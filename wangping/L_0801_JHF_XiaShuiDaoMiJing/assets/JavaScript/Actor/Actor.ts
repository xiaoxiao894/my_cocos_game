import { _decorator, animation, Animation, AnimationClip, AnimationState, AsyncDelegate, BoxCollider, CCFloat, Collider, Color, Component, director, find, ICollisionEvent, Label, LabelComponent, Mat4, math, MeshRenderer, Node, ParticleSystem, Quat, RigidBody, Scene, SkeletalAnimation, Slider, Sprite, Tween, tween, UIOpacity, UIRenderer, UITransform, v3, Vec3, Vec4 } from 'cc';
import { StateDefine } from './StateDefine';
import { MathUtil } from '../Util/MathUtil';
import { DataManager } from '../Global/DataManager';
import { FunTypeEnum, PlayerWeaponTypeEnum, PlotEnum, SceneEnum } from '../Enum/Index';
import { SoundManager } from '../Common/SoundManager';
import { PlayerManager } from './PlayerManager';
const { ccclass, property } = _decorator;

let tempVelocity: Vec3 = v3();
const _tempWorldPos = new Vec3();
const _tempUINodePos = new Vec3();

@ccclass('Actor')
export class Actor extends Component {
    @property(SkeletalAnimation)
    skeletalAnimation: SkeletalAnimation | null = null;

    // 三把武器
    @property(Node)
    cottonSwabNode: Node = null;

    // 刀
    @property(Node)
    knifeNode: Node = null;

    // 喷火器
    @property(Node)
    flamethrowerNode: Node = null;

    @property(Node)
    suctionAniNode: Node = null;

    @property(CCFloat)
    linearSpeed: number = 1.0;

    @property(CCFloat)
    angularSpeed: number = 90;

    @property(Node)
    SpriteSplash = null;

    @property(Node)
    annaKT003Node: Node = null;

    destForward: Vec3 = v3();

    collider: Collider | null = null;
    rigidbody: RigidBody | null = null;

    currentState: StateDefine | string = StateDefine.Idle;
    uiproperty = null;

    private deliverCooldown: number = 0.0001;
    private _lastDeliverTime = 0;

    // 当前被吸的节点
    private currentAbsorbingItem = null;

    private waterPlots = null;
    onLoad() {
        if (this.knifeNode) this.knifeNode.active = false;
        if (this.flamethrowerNode) this.flamethrowerNode.active = false;
    }

    // 指定地块
    private _txAttackInitialWorldRot: Quat = new Quat();
    private _txWalkAttackInitialWorldRot: Quat = new Quat();

    private equipmentUi = null;
    start() {
        this.waterPlots = find("Root/WaterPlots");
        this.equipmentUi = find("Canvas/EquipmentUI");

        this.rigidbody = this.node.getComponent(RigidBody);
        this.collider = this.node.getComponent(Collider);

        this.uiproperty = this.node.getChildByName("UIproperty");

        this.collider?.on("onTriggerEnter", this.onTriggerEnter, this);
        this.collider?.on("onTriggerStay", this.onTriggerStay, this);
        this.collider?.on("onTriggerExit", this.onTriggerExit, this);

        const jackASkin = this.node.getChildByName("JackA_Skin");
        if (jackASkin) {
            const txAttack = jackASkin.getChildByName("TX_attack");

            if (txAttack) {
                txAttack.getWorldRotation(this._txAttackInitialWorldRot);
            }

            const txWalkAttack = jackASkin.getChildByName("TX_walk_attack");
            if (txWalkAttack) {
                txWalkAttack.getWorldRotation(this._txWalkAttackInitialWorldRot);
            }
        }
    }

    lateUpdate(dt: number) {
        // 每帧强制将子节点设置为初始世界变换（位置 + 旋转）
        const jackASkin = this.node.getChildByName("JackA_Skin");
        if (jackASkin) {
            const txAttack = jackASkin.getChildByName("TX_attack");
            if (txAttack) {
                txAttack.setWorldRotation(this._txAttackInitialWorldRot);
            }

            const txWalkAttack = jackASkin.getChildByName("TX_walk_attack");
            if (txWalkAttack) {
                txWalkAttack.setWorldRotation(this._txWalkAttackInitialWorldRot);
            }
        }

    }

    update(deltaTime: number) {
        // if (this.currentAbsorbingItem && this.suctionAniNode) {
        //     const targetPos = this.currentAbsorbingItem.worldPosition;
        //     const selfPos = this.suctionAniNode.worldPosition;

        //     // 防止节点自身位置和目标重合导致 lookAt 报错
        //     if (!selfPos.equals(targetPos)) {
        //         this.suctionAniNode.lookAt(targetPos, Vec3.UP);
        //     }
        // }

        if (this.currentState == StateDefine.Die) {
            return;
        }

        // 始终执行朝向调整
        let a = MathUtil.signAngle(this.node.forward, this.destForward, Vec3.UP);
        let as = v3(0, a * 20, 0);
        this.rigidbody.setAngularVelocity(as);

        //  改成无条件执行移动（不依赖状态）
        this.doMove();
    }


    doMove() {
        let speed = this.linearSpeed * this.destForward.length() * 5;
        tempVelocity.x = math.clamp(this.node.forward.x, -1, 1) * speed;
        tempVelocity.z = math.clamp(this.node.forward.z, -1, 1) * speed;
        this.rigidbody?.setLinearVelocity(tempVelocity);
    }

    stopMove() {
        this.rigidbody?.setLinearVelocity(Vec3.ZERO);
    }

    changState(state: StateDefine | string) {
        const clipName = state as string;

        // 获取目标动画状态
        const aniState = this.skeletalAnimation?.getState(clipName);

        // 如果是攻击状态，允许重复切换（防止攻击无法连击）
        const attackKey = `Attack_${DataManager.Instance.curWeaponType}`;
        if (state === StateDefine[attackKey]) {
            this.skeletalAnimation?.crossFade(clipName, 0.1);
            this.skeletalAnimation?.once(Animation.EventType.FINISHED, this.onAnimationFinished, this);
            this.currentState = state;
            return;
        }

        // 允许 Walk/WALK_ATTACK 状态重复切换播放动画
        if (state === this.currentState) {
            if (aniState && !aniState.isPlaying) {
                this.skeletalAnimation?.play(clipName);
                this.skeletalAnimation?.once(Animation.EventType.FINISHED, this.onAnimationFinished, this);
            }
            return;
        }

        // 若切换自 Walk 类状态，停止移动
        const walkAttackKey = `Run_Attack_${DataManager.Instance.curWeaponType}`;
        const walkKey = `Run_${DataManager.Instance.curWeaponType}`;
        if (
            this.currentState === StateDefine[walkKey] ||
            this.currentState === StateDefine[walkAttackKey]
        ) {
            this.stopMove();
        }

        if (aniState) {
            aniState.wrapMode = AnimationClip.WrapMode.Loop; // 防止播放完卡住
            this.skeletalAnimation?.crossFade(clipName, 0.1);

            this.skeletalAnimation?.once(Animation.EventType.FINISHED, this.onAnimationFinished, this);
        } else {
            // console.warn(`未找到动画状态：${clipName}`);
        }

        this.currentState = state;
    }

    onAnimationFinished(event: AnimationEvent) {
        DataManager.Instance.playerAction = true;
    }

    private curWaterPlots = []
    // 进入/离开/停留判定
    onTriggerEnter(event: ICollisionEvent) {
        const otherCollider = event.otherCollider;

        console.log(otherCollider.name);

        // 进入场景2
        if (DataManager.Instance.curScene == SceneEnum.Scene1) {
            if (otherCollider.node.name == PlotEnum.Plot0) {
                // this.SpriteSplash.active = true;
                DataManager.Instance.sceneManager.teleportToScene2();
                this.closeRightBody(otherCollider.node);
            }
        } else {
            this.unlockAnimation(otherCollider);

            const water = this.waterPlots.children.find(item => {
                return item.name == otherCollider.node.name;
            })

            if (water) {
                const txWater = this.node.getChildByName("TX_shui");
                if (txWater) {
                    txWater.active = true;
                    DataManager.Instance.isOnWater = true;
                    this.curWaterPlots.push(otherCollider.node.name);

                    const playerManager = this.node.getComponent(PlayerManager);
                    if (playerManager) {
                        playerManager._stopRunSfx();
                        playerManager._playRunSfx();
                    }
                }
            }
        }
    }

    onTriggerExit(event: ICollisionEvent) {
        const otherCollider = event.otherCollider;

        if (DataManager.Instance.curScene != SceneEnum.Scene1) {

            const idx = this.curWaterPlots.findIndex(item => {
                return item == otherCollider.node.name;
            })

            if (idx >= 0) {
                this.curWaterPlots.splice(idx, 1);
            }

            if (this.curWaterPlots.length <= 0) {
                const txWater = this.node.getChildByName("TX_shui");
                if (txWater) {
                    DataManager.Instance.isOnWater = false;
                    const particleSystem = txWater.children[0].getComponent(ParticleSystem);
                    if (particleSystem) {
                        particleSystem.stopEmitting();
                        particleSystem.clear();
                    }

                    txWater.active = false;

                    const playerManager = this.node.getComponent(PlayerManager);
                    if (playerManager) {
                        playerManager._stopRunSfx();
                    }

                }


            }
        }
    }

    onTriggerStay(event: ICollisionEvent) {
        const otherCollider = event.otherCollider;

        this._handleExecution(otherCollider);
    }


    private _handleExecution(otherCollider: any) {
        const rule = DataManager.Instance.plotRules.find(item => {
            return item.plotName == otherCollider.node.name && item.isUnlock;
        })

        if (!rule) return;

        const { isChangeValue, placing, funType, typeItem, plotName, isUnlock, meatNum, isUnlockAnimationShown } = rule;

        const playerNode = DataManager.Instance.player.node;
        const backpacks: Node[] = [
            playerNode.getChildByName("Backpack1"),
            playerNode.getChildByName("Backpack2"),
            playerNode.getChildByName("Backpack3")
        ].filter(Boolean) as Node[];
        const targetCon = find(`Root/PlacingCon/${placing}`);
        if (!targetCon) {
            return;
        }

        const obj = {
            isChangeValue: isChangeValue,
            otherCollider: otherCollider,
        }

        if (funType == FunTypeEnum.Deliver) {
            const sourceBackpack = this._findBackpackWithItem(backpacks, typeItem);
            if (sourceBackpack) {
                this.startDelivery(sourceBackpack, targetCon, obj);
            } else {
                // console.warn(`未找到包含 ${typeItem} 的背包用于交付`);
            }
        } else if (funType == FunTypeEnum.Collect) {

        }
    }

    startDelivery(from: Node, to: Node, obj) {
        const now = performance.now();
        if (now - this._lastDeliverTime < this.deliverCooldown * 1000) return;
        this._lastDeliverTime = now;

        this.playBezierTransfer(from, to, 'deliver', obj);
    }


    // === 贝塞尔转移动画 ===
    private stackOffsetY: number = 0.5;
    private _reservedLabelMap: Map<Node, number> = new Map();
    // 统一交付和收集中的“动画中”物体集合
    private _activeTransferringItems: Set<Node> = new Set();
    private playBezierTransfer(from: Node, to: Node, mode: 'collect' | 'deliver', obj) {
        if (!from || !to || !DataManager.Instance.isCanDelivered) return;

        if (obj.isChangeValue) {
            const elementCon = obj.otherCollider.node.getChildByName("ElementCon");
            const numerator = elementCon.getChildByName("numerator");
            const denominator = elementCon.getChildByName("denominator");

            if (!numerator || !denominator || !this.reserveValueIfPossible(numerator, denominator, 1)) {
                return; // 资源已满或不足，跳过
            }
        }

        const children = from.children;
        if (children.length === 0) return;

        let item: Node | null = null;

        // 默认从 from.children 中取出未在动画中的节点
        for (let i = children.length - 1; i >= 0; i--) {
            const child = children[i];
            if (child['__isReady'] === true) {
                item = child;
                break;
            }
        }

        if (!item?.isValid) return;

        this._activeTransferringItems.add(item);

        // const startPos = item.getWorldPosition();
        const startPos = DataManager.Instance.player.node.getWorldPosition();
        startPos.y = startPos.y + 0.7;
        startPos.z = startPos.z - 0.4;
        item.parent = this.node;
        item.setWorldPosition(startPos);

        // 默认：飞向堆顶
        let endPos = this._getStackTopWorldPos(to, this.stackOffsetY);

        const curvePeakY = Math.max(startPos.y, endPos.y) + 1;
        const controlPoint = new Vec3(
            (startPos.x + endPos.x) / 2,
            curvePeakY,
            (startPos.z + endPos.z) / 2
        );

        const tParam = { t: 0 };
        tween(tParam)
            .to(0.15, { t: 1 }, {
                onUpdate: () => {
                    const t = tParam.t;
                    const oneMinusT = 1 - t;

                    // 计算贝塞尔曲线位置
                    const current = new Vec3(
                        oneMinusT * oneMinusT * startPos.x + 2 * oneMinusT * t * controlPoint.x + t * t * endPos.x,
                        oneMinusT * oneMinusT * startPos.y + 2 * oneMinusT * t * controlPoint.y + t * t * endPos.y,
                        oneMinusT * oneMinusT * startPos.z + 2 * oneMinusT * t * controlPoint.z + t * t * endPos.z
                    );

                    item.setWorldPosition(current);
                },
                onComplete: () => {
                    item.eulerAngles = new Vec3(0, 0, 0);
                    // 物理组件禁用
                    const rigidBody = item.getComponent(RigidBody);
                    if (rigidBody) {
                        rigidBody.enabled = false;
                    }

                    // 禁用碰撞器
                    const boxCollider = item.getComponent(BoxCollider);
                    if (boxCollider) {
                        boxCollider.enabled = false;
                    }

                    tween(item)
                        .to(0.15, { scale: new Vec3(1.2, 1.2, 1.2) }, { easing: 'quadOut' })
                        .to(0.05, { scale: new Vec3(1, 1, 1) }, { easing: 'quadOut' })
                        .start();

                    const finalPos = this._getStackTopWorldPos(to, this.stackOffsetY);
                    item.setWorldPosition(finalPos);
                    item.setParent(to);

                    const localPos = new Vec3();
                    to.inverseTransformPoint(localPos, finalPos);
                    item.setPosition(localPos);

                    if ((obj.otherCollider.node.name == PlotEnum.Plot1 && mode == 'deliver') ||
                        (obj.otherCollider.node.name == PlotEnum.Plot2 && mode == 'deliver') ||
                        (obj.otherCollider.node.name == PlotEnum.Plot3 && mode == 'deliver') ||
                        (obj.otherCollider.node.name == PlotEnum.Plot4 && mode == 'deliver')) {
                        DataManager.Instance.uiPropertManager.meatDeliverProperty();
                    }

                    this._activeTransferringItems.delete(item);

                    if (obj.isChangeValue) {
                        this.changeValueFun(item, obj)
                    }

                    SoundManager.inst.playAudio("jiaofu");
                }
            })
            .start();
    }

    changeValueFun(item, obj) {
        if (item) item.removeFromParent();

        const elementCon = obj.otherCollider.node.getChildByName("ElementCon");
        const numerator = elementCon.getChildByName("numerator");
        const denominator = elementCon.getChildByName("denominator");
        const progress = elementCon.getChildByName("jindu");

        if (numerator && denominator) {
            const newVal = this.finalizeReservedValue(numerator, denominator, 1);

            const denominatorLabel = denominator.getComponent(Label);
            const denominatorVal = denominatorLabel ? Number(denominatorLabel.string) : 0;

            const progressSpr = progress.getComponent(Sprite);
            progressSpr.fillRange = newVal / denominatorVal

            if (newVal >= denominatorVal) {
                const plotName = obj.otherCollider.node.name;

                switch (plotName) {
                    case PlotEnum.Plot1:
                        console.log("Plot1 满足条件后的逻辑")
                        this.handlePlot1Full(obj.otherCollider);

                        this.mapUI(obj, "Knife");
                        break;
                    case PlotEnum.Plot2:
                        this.handlePlot2Full(obj.otherCollider);

                        this.mapUI(obj, "Armor");
                        console.log("Plot2 满足条件后的逻辑")
                        break;
                    case PlotEnum.Plot3:
                        this.handlePlot3Full(obj.otherCollider);

                        this.mapUI(obj, "Flamethrower");
                        console.log("Plot3 满足条件后的逻辑")
                        break;
                    case PlotEnum.Plot4:
                        this.handlePlot4Full(obj.otherCollider);
                        console.log("Plot4 满足条件后的逻辑")
                        break;
                }
            }
        }
    }

    mapUI(obj, equipment) {
        // 1) 投影到 UI
        obj.otherCollider.node.getWorldPosition(_tempWorldPos);
        DataManager.Instance.mainCamera.camera.convertToUINode(
            _tempWorldPos, this.equipmentUi, _tempUINodePos
        );

        const node = this.equipmentUi.getChildByName(equipment);
        if (!node) return;

        // 起点：放到碰撞体对应的 UI 位置
        node.setPosition(_tempUINodePos);

        node.setScale(0, 0, 1);

        const ani = this.equipmentUi.getChildByName("Ani");
        if (ani) ani?.getComponent(Animation)?.play();

        const uiTrans = node.getComponent(UITransform)!;
        const centerPos = new Vec3(
            (0.5 - uiTrans.anchorX) * uiTrans.width,
            (0.5 - uiTrans.anchorY) * uiTrans.height,
            0
        );

        const topPoint = new Vec3(
            (0.5 - uiTrans.anchorX) * uiTrans.width,
            (0.5 - uiTrans.anchorY) * uiTrans.height + 150,
            0)

        tween(node)
            .to(.5, { position: topPoint, scale: new Vec3(1, 1, 1) }, { easing: 'backOut' })
            .delay(.5)
            .to(.5, { position: centerPos, scale: new Vec3(0, 0, 0) }, { easing: 'backOut' })
            .start();
    }

    private handlePlotFull(params: {
        otherCollider: Collider,
        weaponToActivate: Node,
        weaponToDeactivate: Node,
        unlockNextPlot: PlotEnum,
        nextWeaponType: PlayerWeaponTypeEnum
    }) {
        const { otherCollider, weaponToActivate, weaponToDeactivate, unlockNextPlot, nextWeaponType } = params;

        const elementCon = otherCollider.node.getChildByName("ElementCon");
        if (elementCon) {
            const finishNode = elementCon.getChildByName("ziyuanwancheng");
            if (finishNode) {
                finishNode.active = true;
            }
        }

        // 播放吸收动画
        if (this.suctionAniNode) this.suctionAniNode.active = true;
        this.currentAbsorbingItem = otherCollider.node;
        SoundManager.inst.playAudio("shengji3");

        this.scheduleOnce(() => {
            const elementCon = otherCollider.node.getChildByName("ElementCon");
            if (elementCon) {
                elementCon.active = false;
            }
        }, 0.5)

        this.scheduleOnce(() => {
            if (this.suctionAniNode) this.suctionAniNode.active = false;
            this.currentAbsorbingItem = null;

            // 切换武器
            if (weaponToDeactivate) weaponToDeactivate.active = false;
            if (weaponToActivate) weaponToActivate.active = true;

            this.node.getComponent(PlayerManager)?.hideAllAnimation();

            this.resetIsUnlock();

            const plotRule = DataManager.Instance.plotRules.find(item => item.plotName === unlockNextPlot);
            if (plotRule) plotRule.isUnlock = true;

            if (DataManager.Instance.curWeaponType != nextWeaponType) {
                DataManager.Instance.playerAction = true;
            }

            DataManager.Instance.curWeaponType = nextWeaponType;
            DataManager.Instance.guideTargetIndex++;
        }, 1.25);
    }

    handlePlot1Full(otherCollider: Collider) {
        this.handlePlotFull({
            otherCollider,
            weaponToActivate: this.knifeNode,
            weaponToDeactivate: this.cottonSwabNode,
            unlockNextPlot: PlotEnum.Plot2,
            nextWeaponType: PlayerWeaponTypeEnum.Knife
        });

        const plot1Node = otherCollider.node.getChildByName("Node");
        if (!plot1Node) return;

        const plot1NodeAni = plot1Node.getComponent(Animation);
        if (!plot1NodeAni) return;

        plot1NodeAni.play("daowancheng");
        const elementCon = otherCollider.node.parent.getChildByName("Plot2").getChildByName("ElementCon");
        if (elementCon) {
            elementCon.active = true;
        }

        this.flashEffect(otherCollider);

        DataManager.Instance.maxMonsterCount = 20
        DataManager.Instance.bornTimeLimit = 0.65;


    }

    handlePlot2Full(otherCollider: Collider) {
        this.handlePlotFull({
            otherCollider,
            weaponToActivate: this.knifeNode,
            weaponToDeactivate: this.cottonSwabNode,
            unlockNextPlot: PlotEnum.Plot3,
            nextWeaponType: PlayerWeaponTypeEnum.Knife
        });

        if (this.flamethrowerNode) {
            this.flamethrowerNode.active = true;
        }

        if (this.annaKT003Node) this.annaKT003Node.active = false;

        const plot2Node = otherCollider.node.getChildByName("BingYing1_4_militarycamp_d_01_LOD0");
        if (!plot2Node) return;

        const plot2NodeAni = plot2Node.getComponent(Animation);
        if (!plot2NodeAni) return;

        plot2NodeAni.play("bingyingwancheng");
        plot2NodeAni.once(Animation.EventType.FINISHED, () => {
            plot2NodeAni.play("bingyingwanchengfudong")
        })

        this.flashEffect(otherCollider);

        const elementCon = otherCollider.node.parent.getChildByName("Plot3").getChildByName("ElementCon");
        if (elementCon) {
            elementCon.active = true;
        }
        DataManager.Instance.maxMonsterCount = 32
        DataManager.Instance.bornTimeLimit = 0.5;

        DataManager.Instance.isUnlockArmor = true;

        DataManager.Instance.arrow3DManager.setFloatingHeightOffset = 8.5;

    }

    handlePlot3Full(otherCollider: Collider) {
        this.handlePlotFull({
            otherCollider,
            weaponToActivate: this.flamethrowerNode,
            weaponToDeactivate: this.knifeNode,
            unlockNextPlot: PlotEnum.Plot4,
            nextWeaponType: PlayerWeaponTypeEnum.Flamethrower
        });

        this.scheduleOnce(() => {
            const zhuangbei = this.flamethrowerNode?.getChildByName("ZhuangBei");
            if (zhuangbei) {
                zhuangbei.active = true;
            }
        }, 1.25)


        const plot3Node = otherCollider.node.getChildByName("L_prp_TiDeng_mod");
        if (!plot3Node) return;

        const plot3NodeAni = plot3Node.getComponent(Animation);
        if (!plot3NodeAni) return;

        plot3NodeAni.play("dengwancheng");


        // const plot3NodeHuomiao = plot3Node.getChildByName("TX_huomiao2");
        // if (!plot3NodeHuomiao) return;

        // plot3NodeHuomiao.active = true;

        const elementCon = otherCollider.node.parent.getChildByName("Plot4").getChildByName("ElementCon");
        if (elementCon) {
            elementCon.active = true;
        }

        this.flashEffect(otherCollider);

        DataManager.Instance.maxMonsterCount = 45
        DataManager.Instance.bornTimeLimit = 0.33;

    }

    handlePlot4Full(otherCollider: Collider) {
        const plot4Node = otherCollider.node.getChildByName("PA_prp_ShouJi_mod");
        if (!plot4Node) return;

        const plot4NodeAni = plot4Node.getComponent(Animation);
        if (!plot4NodeAni) return;

        plot4NodeAni.play("shoujiwancheng");

        SoundManager.inst.playAudio("shengji3")

        this.scheduleOnce(() => {
            SoundManager.inst.playAudio("guanbojietong");
        }, .1)

        DataManager.Instance.guideTargetIndex = -1;
        const elementCon = otherCollider.node.parent.getChildByName("Plot4").getChildByName("ElementCon");
        if (elementCon) {
            elementCon.active = false;
        }

        this.flashEffect(otherCollider);

        // 执行过关逻辑
        this.scheduleOnce(() => {
            DataManager.Instance.isGameEnd = true;
            DataManager.Instance.gameEndManager.init();
            SoundManager.inst.playAudio("YX_win")
        }, 3.5)
    }

    // 重置数据
    resetIsUnlock() {
        for (let i = 0; i < DataManager.Instance.plotRules.length; i++) {
            const plotRule = DataManager.Instance.plotRules[i];
            if (plotRule) continue;

            plotRule.isUnlock = false;
        }
    }


    private finalizeReservedValue(numerator: Node, denominator: Node, amount: number): number {
        const numeratorLabel = numerator?.getComponent(Label);
        const denominatorLabel = denominator?.getComponent(Label);
        if (!numeratorLabel || !denominatorLabel) return 0;

        const numeratorVal = Number(numeratorLabel.string);
        const denominatorVal = Number(denominatorLabel.string);
        const key = denominator.parent;

        // 增加值，最多不超过 denominator
        const newVal = Math.min(denominatorVal, numeratorVal + amount);
        numeratorLabel.string = `${newVal}`;

        const reserved = this._reservedLabelMap.get(key) || 0;
        this._reservedLabelMap.set(key, Math.max(0, reserved - amount));

        return newVal;
    }

    private reserveValueIfPossible(numerator: Node, denominator: Node, amount: number): boolean {
        const numeratorLabel = numerator?.getComponent(Label);
        const denominatorLabel = denominator?.getComponent(Label);
        if (!numeratorLabel || !denominatorLabel) return false;

        const numeratorVal = Number(numeratorLabel.string);
        const denominatorVal = Number(denominatorLabel.string);

        if (numeratorVal + amount > denominatorVal) return false;

        const key = denominator.parent;
        const reserved = this._reservedLabelMap.get(key) || 0;

        // 可预留资源数 = 目标上限 - 当前数值 - 已预留数
        const available = denominatorVal - numeratorVal - reserved;

        if (available < amount) return false;

        this._reservedLabelMap.set(key, reserved + amount);
        return true;
    }

    private _findBackpackWithItem(backpacks: Node[], typeItem: string): Node | null {
        for (const bag of backpacks) {
            if (bag.children.some(child => child.name.includes(typeItem))) {
                return bag;
            }
        }
        return null;
    }


    // === 获取堆叠位置 ===
    private _getStackTopWorldPos(container: Node, offsetY: number): Vec3 {
        const base = container.getWorldPosition();
        let maxY = 0;
        for (const child of container.children) {
            const y = child.getWorldPosition().y - base.y;
            if (y > maxY) maxY = y;
        }
        return new Vec3(base.x, base.y + maxY + offsetY, base.z);
    }


    // 展示解锁动画
    unlockAnimation(otherCollider) {
        const plotData = DataManager.Instance.plotRules.find(itme => {
            return itme.plotName == otherCollider.node.name && itme.isUnlock == true;
        })

        if (plotData && !plotData.isUnlockAnimationShown) {
            plotData.isUnlockAnimationShown = true;                     // 已经进来过了
            DataManager.Instance.isCanDelivered = false;

            // 开始播放动画
            const itemNode = otherCollider.node.children[0];
            if (!itemNode) return;

            const itemNodeAni = itemNode.getComponent(Animation);
            if (!itemNodeAni) return;

            DataManager.Instance.sceneManager.sceneVibrationEffect();
            // this.scheduleOnce(() => {
            SoundManager.inst.playAudio("jihuo");
            // }, 0.1)
            if (plotData.plotName == PlotEnum.Plot1) {
                itemNodeAni.play("daoshengqi");
                itemNodeAni.once(Animation.EventType.FINISHED, () => {
                    itemNodeAni.play("daofudong")
                })
            } else if (plotData.plotName == PlotEnum.Plot2) {
                itemNodeAni.play("bingyingshengqi");
                itemNodeAni.once(Animation.EventType.FINISHED, () => {
                    itemNodeAni.play("bingyingfudong")
                })
            } else if (plotData.plotName == PlotEnum.Plot3) {
                itemNodeAni.play("dengshengqi");
            } else if (plotData.plotName == PlotEnum.Plot4) {
                itemNodeAni.play("shoujishengqi");
            } else {
                itemNodeAni.play();
            }

            this.scheduleOnce(() => {
                DataManager.Instance.isCanDelivered = true;
            }, 1)
        }
    }


    // 关闭刚体
    closeRightBody(node) {
        const rightbody = node.getComponent(RigidBody);
        if (rightbody) {
            rightbody.enable = false;
        }

        const collider = node.getComponent(Collider);
        if (collider) {
            collider.enable = false;
        }
    }

    // 闪烁特效
    flashEffect(otherCollider) {
        const TX_shanshuo = otherCollider?.node?.getChildByName("TX_shanshuo");
        if (TX_shanshuo) {
            TX_shanshuo.active = false;
        }
    }
}


