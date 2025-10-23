import { _decorator, animation, Animation, AnimationClip, AnimationState, AsyncDelegate, BoxCollider, Camera, CCFloat, Collider, Color, Component, ConeCollider, director, find, ICollisionEvent, Label, LabelComponent, Mat4, math, MeshRenderer, Node, ParticleSystem, PipelineStateManager, Quat, RigidBody, Scene, SkeletalAnimation, Slider, Sprite, Tween, tween, UIOpacity, UIRenderer, v3, Vec3, Vec4 } from 'cc';
import { StateDefine } from './StateDefine';
import { MathUtil } from '../Util/MathUtil';
import { DataManager } from '../Global/DataManager';
import { FunTypeEnum, PlayerWeaponTypeEnum, PlotEnum, TypeItemEnum } from '../Enum/Index';
import { StackManager } from '../StackSlot/StackManager';
import { SimplePoolManager } from '../Util/SimplePoolManager';
import { SoundManager } from '../Common/SoundManager';
const { ccclass, property } = _decorator;

let tempVelocity: Vec3 = v3();

@ccclass('Actor')
export class Actor extends Component {
    @property(Camera)
    camera: Camera | null = null;

    @property(SkeletalAnimation)
    skeletalAnimation: SkeletalAnimation | null = null;

    @property(Node)
    suctionAniNode: Node = null;

    @property(CCFloat)
    linearSpeed: number = 1.0;

    @property(Node)
    cottonSwabNode: Node = null;

    @property(Node)
    knifeNode: Node = null;

    @property(Node)
    fireNode: Node = null;

    @property(Node)
    flamethrowerNode: Node = null;

    // 过关效果
    @property(Node)
    endMonsterNode: Node = null;

    @property(Node)
    doorNode: Node = null;

    destForward: Vec3 = v3();
    currentState: StateDefine | string = StateDefine.Idle;
    collider: Collider | null = null;
    rightBody: RigidBody | null = null;
    rigidbody: any;

    private _reservedLabelMap: Map<Node, number> = new Map();
    // 统一交付和收集中的“动画中”物体集合
    private _activeTransferringItems: Set<Node> = new Set();
    private stackOffsetY: number = 0.5;

    plotsRoot = null;
    private plots = null;

    private _canMove: boolean = true;
    private _changePlots = [PlotEnum.Plot4, PlotEnum.Plot5, PlotEnum.Plot6];
    private curChangePlots = [];

    // 解锁plot1人物位置
    unlockPlot1PlayerPos = new Vec3(-13.977, 0, -2.543);

    start() {
        this.plotsRoot = find('Root/Phy/Plots');
        this.plots = find("Root/Plots");

        this.rigidbody = this.node.getComponent(RigidBody);
        this.collider = this.node.getComponent(Collider);

        this.collider?.on("onTriggerEnter", this.onTriggerEnter, this);
        this.collider?.on("onTriggerStay", this.onTriggerStay, this);
        this.collider?.on("onTriggerExit", this.onTriggerExit, this);
    }

    onTriggerEnter(event: ICollisionEvent) {
        const otherCollider = event.otherCollider;

        if (otherCollider.node.name == PlotEnum.Plot0) {
            const doorL = find("Root/Cons/L_prp_XieHe_mod_V001/Door/Door_L");
            const doorR = find("Root/Cons/L_prp_XieHe_mod_V001/Door/Door_R");
            const side = "T";
            this.openDoorBySide(doorL, doorR, side);
        }

        const plotName = this._changePlots.find(itme => {
            return itme == otherCollider.node.name;
        })

        if (plotName) {
            const pyhPlot = otherCollider.node.getChildByName("PyhPlot");
            if (!pyhPlot) return;

            const greenPlot = pyhPlot.getChildByName("DK_LV");
            if (!greenPlot) return;

            const greenPlotSprite = greenPlot.getComponent(Sprite);
            if (greenPlotSprite) greenPlotSprite.color = new Color(0, 255, 0, 255);

            this.curChangePlots.push(otherCollider.node);
        }
    }

    onTriggerExit(event: ICollisionEvent) {
        const otherCollider = event.otherCollider;


        if (otherCollider.node.name == PlotEnum.Plot0) {
            const doorL = find("Root/Cons/L_prp_XieHe_mod_V001/Door/Door_L");
            const doorR = find("Root/Cons/L_prp_XieHe_mod_V001/Door/Door_R");
            const side = "T";

            this.closeDoorBySide(doorL, doorR, side);
        }

        const curChangePlotIdx = this.curChangePlots.findIndex(item => {
            return item.name == otherCollider.node.name;
        })

        if (curChangePlotIdx > -1) {
            const pyhPlot = this.curChangePlots[curChangePlotIdx].getChildByName("PyhPlot")
            if (!pyhPlot) return;

            const greenPlot = pyhPlot.getChildByName("DK_LV");
            if (!greenPlot) return;

            const greenPlotSprite = greenPlot.getComponent(Sprite);
            if (greenPlotSprite) greenPlotSprite.color = new Color(255, 255, 255, 255);

            this.curChangePlots.splice(curChangePlotIdx, 1);
        }
    }

    // 持续触发事件
    onTriggerStay(event: ICollisionEvent) {
        const otherCollider = event.otherCollider;

        this._handleExecution(otherCollider);
    }

    private _handleExecution(otherCollider) {
        const rule = DataManager.Instance.rules.find((item) => {
            return item.colliderName == otherCollider.node.name
        });
        if (!rule) return;

        const { funType, placing, typeItem, colliderName, isChangeValue } = rule;

        const playerNode = DataManager.Instance.player.node;
        const backpacks: Node[] = [
            playerNode.getChildByName("Backpack1"),
            playerNode.getChildByName("Backpack2"),
            playerNode.getChildByName("Backpack3"),
        ].filter(Boolean) as Node[];

        const targetCon = find(`Root/Placing/${placing}`);
        if (!targetCon) {
            return;
        }

        const obj = {
            isChangeValue: isChangeValue,
            otherCollider: otherCollider,
            row: 4,
            col: 4,
            isPlot4ArrangePos: PlotEnum.Plot4 == otherCollider.node.name ? true : false,        // 交付区域
            isPlot5ArrangePos: PlotEnum.Plot5 == otherCollider.node.name ? true : false,        // 收集区域
            isPlot6ArrangePos: PlotEnum.Plot6 == otherCollider.node.name ? true : false,
            isPlot7ArrangePos: PlotEnum.Plot7 == otherCollider.node.name ? true : false
        }

        if (funType == FunTypeEnum.Deliver) {                                                   // 交付
            const sourceBackpack = this._findBackpackWithItem(backpacks, typeItem);
            if (sourceBackpack) {
                this.startDelivery(sourceBackpack, targetCon, obj);
            }
        } else if (funType == FunTypeEnum.Collect) {                                            // 收集
            let targetBackpack = this._findBackpackWithItem(backpacks, typeItem);

            if (!targetBackpack) {
                targetBackpack = this._findEmptyBackpack(backpacks);
            }

            if (targetBackpack) {
                this.collectAni(targetCon, targetBackpack, obj);
            }
        }
    }

    private _findEmptyBackpack(backpacks: Node[]): Node | null {
        return backpacks.find(bag => bag.children.length === 0) || null;
    }

    startDelivery(from: Node, to: Node, obj) {
        // const now = performance.now();
        // if (now - this._lastDeliverTime < this.deliverCooldown * 1000) return;
        // this._lastDeliverTime = now;

        this.playBezierTransfer(from, to, 'deliver', obj);
    }

    private collectAni(from: Node, to: Node, obj) {
        this.playBezierTransfer(from, to, 'collect', obj);
    }

    private playBezierTransfer(from: Node, to: Node, mode: 'collect' | 'deliver', obj) {
        if (!from?.isValid || !to?.isValid) return;

        if (obj?.isChangeValue) {
            const plotsRoot: Node | null = obj?.otherCollider?.node?.getChildByName?.("Plot") ?? null;
            if (!plotsRoot || !this.reserveValueIfPossible(plotsRoot, 1)) {
                console.warn("资源不足，跳过交付");
                return;
            }
        }

        const stackManager: StackManager = to["__stackManager"];
        let item: Node | null = null;

        if (obj.isPlot5ArrangePos || obj.isPlot7ArrangePos) {
            const fromStackManager: StackManager = from["__stackManager"];
            if (!fromStackManager) {
                console.warn("from 没有 stackManager，无法取出");
                return;
            }

            const slots = fromStackManager.getAllOccupiedSlots?.() ?? [];
            for (let i = slots.length - 1; i >= 0; i--) {
                const slot = slots[i];
                const node = slot.assignedNode;
                if (node && node.isValid && node['__isReady'] == true) {
                    item = node;
                    fromStackManager.releaseSlot(node);
                    break;
                }
            }

            if (!item) {
                return;
            }
        } else {
            // 默认从 from.children 中取出未在动画中的节点
            for (let i = from.children.length - 1; i >= 0; i--) {
                const child = from.children[i];
                if (child['__isReady'] === true) {
                    item = child;
                    break;
                }
            }
        }

        if (!item?.isValid) return;

        this._activeTransferringItems.add(item);
        item[`__isReady`] = false;

        const startPos = item.getWorldPosition();
        (item as any).__originParent = item.parent;  // 记录回滚时要放回的容器
        item.parent = this.node;
        item.setWorldPosition(startPos);

        let endPos: Vec3 | null = null;

        //  Plot2：添加进目标容器的堆叠槽位
        if (obj.isPlot4ArrangePos || obj.isPlot6ArrangePos) {
            const slot = stackManager.assignSlot(item);
            if (!slot) {
                this._activeTransferringItems.delete(item);
                return;
            }
            endPos = stackManager.getSlotWorldPos(slot, to);
        } else {
            endPos = this._getStackTopWorldPos(to, this.stackOffsetY);
        }

        const controlPoint = new Vec3(
            (startPos.x + endPos.x) / 2,
            Math.max(startPos.y, endPos.y) + 15,
            (startPos.z + endPos.z) / 2
        );

        const tParam = { t: 0 };
        tween(tParam)
            .to(0.25, { t: 1 }, {
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

                    // 处理物体的位置
                    if (obj.isPlot4ArrangePos || obj.isPlot6ArrangePos) {
                        const finalWorldPos = endPos;
                        item.setWorldPosition(finalWorldPos);
                        item.setParent(to);

                        const localPos = new Vec3();
                        to.inverseTransformPoint(localPos, finalWorldPos);
                        item.setPosition(localPos);

                    } else {
                        const finalPos = this._getStackTopWorldPos(to, this.stackOffsetY);
                        item.setWorldPosition(finalPos);
                        item.setParent(to);

                        const localPos = new Vec3();
                        to.inverseTransformPoint(localPos, finalPos);
                        item.setPosition(localPos);
                    }

                    if (obj.isPlot4ArrangePos) {
                        DataManager.Instance.uiGameManager.meatDeliverProperty();
                        SoundManager.inst.playAudio("roukuai_jiaofu");
                    }

                    if (obj.otherCollider.node.name == PlotEnum.Plot5) {
                        SoundManager.inst.playAudio("roukuai_jiaofu");
                    } else if (obj.otherCollider.node.name == PlotEnum.Plot6) {
                        SoundManager.inst.playAudio("roukuai_shiqu");
                    }

                    if (obj.otherCollider.node.name == PlotEnum.Plot7 && mode == 'collect') {
                        DataManager.Instance.uiGameManager.coinCollectProperty();
                        SoundManager.inst.playAudio("jinbi_shiqu");                                 // 金币收集
                    } else if ((obj.otherCollider.node.name == PlotEnum.Plot1 && mode == 'deliver') ||
                        (obj.otherCollider.node.name == PlotEnum.Plot2 && mode == 'deliver') ||
                        (obj.otherCollider.node.name == PlotEnum.Plot3 && mode == 'deliver')) {
                        DataManager.Instance.uiGameManager.coinDeliverProperty();
                        SoundManager.inst.playAudio("jinbi_jiaofu");                                            // 金币交付
                    }

                    item['__isReady'] = true;
                    this._activeTransferringItems.delete(item);

                    if (obj.isChangeValue) {
                        this.changeValueFun(item, obj)
                    }
                }
            })
            .start();
    }


    changeValueFun(item: Node | null, obj: any) {
        if (item) item.removeFromParent();
        SimplePoolManager.Instance.free(TypeItemEnum.GoldCoin, item);

        const plot = obj.otherCollider.node.getChildByName('Plot');
        if (!plot) return;

        const newVal = this.finalizeReservedValue(plot, 1);

        const plotData = DataManager.Instance.rules.find(item => item.colliderName === obj.otherCollider.node.name);
        if (plotData) {
            let value = 0
            if (plotData.coinNumber >= 0) {
                value = (plotData.initCoinNum - newVal) / plotData.initCoinNum;
                value = Math.max(0, Math.min(1, value));
            }

            const progress = plot.getChildByName("DK_jindu")
            const progressSprite = progress.getComponent(Sprite);
            progressSprite.fillRange = value;
        }

        const data = DataManager.Instance.rules.find(item => {
            return item.colliderName == obj.otherCollider.node.name;
        })

        if (data) {
            data.coinNumber = newVal;
        }

        if (obj.otherCollider.node.name === PlotEnum.Plot1 && newVal === 0) {
            this.warpToUnlockPlot1(false);

            plot.active = false;

            const elementCon = plot.parent?.getChildByName('ElementCon');
            if (elementCon) {
                elementCon.active = true;
                elementCon.setScale(1, 0, 1);

                tween(elementCon)
                    .to(0.15, { scale: new Vec3(1, 1.1, 1) }, { easing: 'quadOut' })
                    .to(0.05, { scale: new Vec3(1, 1, 1) }, { easing: 'quadOut' })
                    .start();

                const upgrade = elementCon.getChildByName("TX_shengji_01");
                if (upgrade) upgrade.active = true;

                const flame = elementCon.getChildByName("TX_huomiao2");
                if (flame) flame.active = true;

                const fire = elementCon.getChildByName("TX_huoyan");
                if (fire) fire.active = true;

                if (this.plotsRoot) {
                    ['Plot1', 'Plot4', 'Plot5', 'Plot8', 'Plot9'].forEach(name => this.enablePhysicsOnPlot(this.plotsRoot, name));
                }

                const plot2 = this.plots.getChildByName("Plot2");
                if (plot2) plot2.active = true;

                const plot2Data = DataManager.Instance.rules.find(item => {
                    return item.colliderName == PlotEnum.Plot2;
                })

                if (plot2Data) {
                    plot2Data.isDisplay = true;
                }

                // 解锁煤油灯
                DataManager.Instance.isDisplayKeroseneLamp = true;
                SoundManager.inst.playAudio("shengji3");

                data.isDisplay = false;
            }
        } else if (obj.otherCollider.node.name === PlotEnum.Plot2 && newVal === 0) {                        // 更换武器
            const curWeaponType = DataManager.Instance.curWeaponType;
            if (curWeaponType == PlayerWeaponTypeEnum.CottonSwab) {
                SoundManager.inst.playAudio("shengji3")

                this.suctionAniNode.active = true;
                this.cottonSwabNode.active = false;
                this.knifeNode.active = true;

                const plot = obj.otherCollider.node.getChildByName("Plot");
                const progress = plot.getChildByName("DK_jindu");
                const progressSpr = progress.getComponent(Sprite)
                progressSpr.fillRange = 0;

                const lv02 = plot.getChildByName("DK_LV-002");
                lv02.active = false;

                const lv03 = plot.getChildByName("DK_LV-003");
                lv03.active = true;

                const labelNode = plot.getChildByName("Label");
                const labelNodeCom = labelNode.getComponent(Label);
                labelNodeCom.string = `${100}`;

                data.coinNumber = 100;
                data.initCoinNum = 100;

                DataManager.Instance.curWeaponType = PlayerWeaponTypeEnum.Knife;

                this.scheduleOnce(() => {
                    this.suctionAniNode.active = false;
                }, 2)

                const plot3 = this.plots.getChildByName("Plot3");
                if (plot3) plot3.active = true;


                const plot3Data = DataManager.Instance.rules.find(item => {
                    return item.colliderName == PlotEnum.Plot3;
                })

                if (plot3Data) {
                    plot3Data.isDisplay = true;
                }

            } else if (curWeaponType == PlayerWeaponTypeEnum.Knife) {
                SoundManager.inst.playAudio("shengji3")

                plot.active = false;

                this.suctionAniNode.active = true;
                this.knifeNode.active = false;
                this.flamethrowerNode.active = true;

                data.isDisplay = false;

                DataManager.Instance.curWeaponType = PlayerWeaponTypeEnum.Flamethrower;
                this.scheduleOnce(() => {
                    this.suctionAniNode.active = false;
                }, 2)
            }
        } else if (obj.otherCollider.node.name === PlotEnum.Plot3 && newVal === 0) {                        // 解锁新区域
            plot.active = false;

            data.isDisplay = false;

            // 拉伸镜头
            const current = { height: this.camera.orthoHeight };
            tween(current)
                .to(0.5, { height: 48 }, {
                    onUpdate: () => {
                        this.camera.orthoHeight = current.height;
                    },
                    onComplete: () => {
                        // 执行过关
                        if (this.doorNode) {
                            const doorNodeAni = this.doorNode.getComponent(Animation);
                            if (doorNodeAni) {
                                doorNodeAni.play();
                            }
                        }

                        if (this.endMonsterNode) {
                            for (let i = 0; i < this.endMonsterNode.children.length; i++) {
                                const node = this.endMonsterNode.children[i];

                                this.scheduleOnce(() => {
                                    node.setScale(1, 0, 1);

                                    tween(node)
                                        .to(0.15, { scale: new Vec3(1, 1.1, 1) }, { easing: 'quadOut' })
                                        .to(0.05, { scale: new Vec3(1, 1, 1) }, { easing: 'quadOut' })
                                        .call(() => {
                                            if (this.endMonsterNode.children.length - 1 == i) {
                                                // 结束游戏
                                                if (!DataManager.Instance.isGameEnd) {
                                                    this.scheduleOnce(() => {
                                                        DataManager.Instance.isGameEnd = true;
                                                        DataManager.Instance.gameEndManager.init(`download`);
                                                    }, 2);
                                                }
                                            }
                                        })
                                        .start();
                                }, i * 0.1)
                            }
                        }
                    }
                })
                .start();

        }
    }

    enablePhysicsOnPlot(plotsRoot: Node | null, plotName: string) {
        const n = plotsRoot?.getChildByName(plotName);
        if (!n) return;
        n.getComponent(Collider).enabled = true;
        n.getComponent(RigidBody).enabled = true;

        const pyhPlot = n.getChildByName("PyhPlot");
        if (pyhPlot) {
            pyhPlot.active = true;
        }
    }

    closePhysicsOnPlot(plotsRoot: Node | null, plotName: string) {
        const n = plotsRoot?.getChildByName(plotName);
        if (!n) return;
        n.getComponent(Collider).enabled = false;
        n.getComponent(RigidBody).enabled = false

        const pyhPlot = n.getChildByName("PyhPlot");
        if (pyhPlot) {
            pyhPlot.active = false;
        }
    }


    private _findBackpackWithItem(backpacks: Node[], typeItem: string): Node | null {
        for (const bag of backpacks) {
            if (bag.children.some(child => child.name.includes(typeItem))) {
                return bag;
            }
        }
        return null;
    }

    update(dt: number) {
        // 如果被设置为不可移动，确保刚体不被移动
        if (!this._canMove) {
            // 强制清零速度，防止物理残留
            try {
                if (this.rigidbody) {
                    this.rigidbody.setLinearVelocity(Vec3.ZERO);
                    this.rigidbody.setAngularVelocity(Vec3.ZERO);
                }
                if (this.rightBody && typeof this.rightBody.setLinearVelocity === 'function') {
                    this.rightBody.setLinearVelocity(Vec3.ZERO);
                }
            } catch (e) { /* ignore */ }
            return;
        }

        if (this.currentState == StateDefine.Die) {
            return;
        }

        // 始终执行朝向调整
        let a = MathUtil.signAngle(this.node.forward, this.destForward, Vec3.UP);
        let as = v3(0, a * 20, 0);
        this.rigidbody.setAngularVelocity(as);

        this.doMove();
    }

    doMove() {
        // 计算并施加线速度
        let speed = this.linearSpeed * this.destForward.length();
        tempVelocity.x = math.clamp(this.node.forward.x, -1, 1) * speed;
        tempVelocity.z = math.clamp(this.node.forward.z, -1, 1) * speed;
        this.rigidbody?.setLinearVelocity(tempVelocity);
    }

    stopMove() {
        this.rightBody?.setLinearVelocity(Vec3.ZERO);
    }

    changState(state: StateDefine | string) {
        const clipName = state as string;

        if (this.currentState == StateDefine.Die) return;

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
            if (clipName == StateDefine.Die) {
                aniState.wrapMode = AnimationClip.WrapMode.Normal;
            } else {
                aniState.wrapMode = AnimationClip.WrapMode.Loop;
            }
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

    private reserveValueIfPossible(landmarkNode: Node, amount: number): boolean {
        const labelNode = landmarkNode.getChildByName("Label");
        const labelCom = labelNode?.getComponent(Label);
        if (!labelCom) return false;

        const key = landmarkNode.parent;
        const currentVal = Number(labelCom.string);
        const reserved = this._reservedLabelMap.get(key) || 0;

        if (currentVal - reserved < amount) return false;

        this._reservedLabelMap.set(key, reserved + amount);
        return true;
    }

    private finalizeReservedValue(landmarkNode: Node, amount: number): number {
        const labelNode = landmarkNode.getChildByName("Label");
        const labelCom = labelNode?.getComponent(Label);
        if (!labelCom) return 0;

        const key = landmarkNode.parent;
        const currentVal = Number(labelCom.string);
        const newVal = Math.max(0, currentVal - amount);
        labelCom.string = `${newVal}`;

        const reserved = this._reservedLabelMap.get(key) || 0;
        this._reservedLabelMap.set(key, Math.max(0, reserved - amount));

        return newVal;
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

    // === 门 ===
    closeDoorBySide(doorL: Node | null, doorR: Node | null, side: string, isMinion = false) {
        const duration = 0.3;

        const angleMap = {
            L: { left: 180, right: 180 },
            R: { left: 0, right: 0 },
            T: { left: 0, right: 0 },
            B: { left: -90, right: -90 }
        };

        const config = angleMap[side];
        if (!config) {
            console.warn(`[Door] 未定义方向开门角度: ${side}`);
            return;
        }

        if (doorL?.isValid) {
            tween(doorL)
                .to(duration, { eulerAngles: new Vec3(0, config.left, 0) }, { easing: 'quadOut' })
                .start();
        }

        if (doorR?.isValid) {
            tween(doorR)
                .to(duration, { eulerAngles: new Vec3(0, config.right, 0) }, { easing: 'quadOut' })
                .start();
        }
    }

    openDoorBySide(doorL: Node | null, doorR: Node | null, side: string) {
        const duration = 0.3;

        // 不同方向的开门角度设置（左门/右门）
        const angleMap = {
            L: { left: 70, right: 300 },
            R: { left: -110, right: 110 },
            T: { left: 120, right: -120 },
            B: { left: 20, right: -200 }
        };

        const config = angleMap[side];
        if (!config) {
            console.warn(`[Door] 未定义方向开门角度: ${side}`);
            return;
        }

        if (doorL?.isValid) {
            tween(doorL)
                .to(duration, { eulerAngles: new Vec3(0, config.left, 0) }, { easing: 'quadOut' })
                .start();
        }

        if (doorR?.isValid) {
            tween(doorR)
                .to(duration, { eulerAngles: new Vec3(0, config.right, 0) }, { easing: 'quadOut' })
                .start();
        }
    }

    public resetActor() {
        this.curChangePlots = [];

        // 1) 停止 Actor 节点与所有子节点上的 Tween，避免残留动效
        this._stopTweensDeep(this.node);

        // 2) 回滚尚在转移动效中的物品
        if (this._activeTransferringItems && this._activeTransferringItems.size > 0) {
            const items = Array.from(this._activeTransferringItems);
            for (const item of items) {
                if (!item?.isValid) continue;

                // 停该物体自身动效
                this._stopTweensDeep(item);

                // 恢复物理/碰撞
                const rb = item.getComponent(RigidBody);
                if (rb) {
                    rb.enabled = true;
                    try { rb.setLinearVelocity(Vec3.ZERO); } catch { }
                    try { rb.setAngularVelocity(Vec3.ZERO); } catch { }
                }
                const col = item.getComponent(BoxCollider);
                if (col) col.enabled = true;

                // 退回到开始动画前的父节点（需要在 playBezierTransfer 里记录 __originParent）
                const originParent: Node | undefined = (item as any).__originParent;
                if (originParent?.isValid) {
                    // 放回原容器；若原容器有栈管理，放置到容器顶部以免相互穿插
                    if ((originParent as any)["__stackManager"]) {
                        const top = this._getStackTopWorldPos(originParent, this.stackOffsetY);
                        item.setWorldPosition(top);
                        item.setParent(originParent);
                        const local = new Vec3();
                        originParent.inverseTransformPoint(local, top);
                        item.setPosition(local);
                    } else {
                        item.setParent(originParent);
                        item.setPosition(Vec3.ZERO);
                    }
                } else {
                    // 没有记录到原父：放回场景父节点并原地落下
                    const world = this.node.parent ?? this.node;
                    item.setParent(world);
                    // 保持当前位置即可
                }

                (item as any)['__isReady'] = true;
                delete (item as any)['__originParent'];
                this._activeTransferringItems.delete(item);
            }
        }

        // 3) 清空交互的“预占用”映射
        this._reservedLabelMap?.clear?.();

        // 4) 关闭特效/吸附等
        if (this.suctionAniNode?.isValid) this.suctionAniNode.active = false;
        if (this.fireNode?.isValid) this.fireNode.active = false;

        // 5) 清零移动与物理速度
        this.destForward.set(0, 0, 0);
        try { this.rigidbody?.setLinearVelocity(Vec3.ZERO); } catch { }
        try { this.rigidbody?.setAngularVelocity(Vec3.ZERO); } catch { }
        try { this.rightBody?.setLinearVelocity(Vec3.ZERO); } catch { }

        // 6) 切到当前武器对应的 Idle，并同步武器显示
        this._applyIdleByWeapon();

        // 强制设置为 Idle，并播放 Idle 动画
        this.currentState = StateDefine.Idle;
        try {
            // changState 会做动画切换，并处理循环/非循环等逻辑
            this.changState(StateDefine.Idle);
            // 额外确保 skeletalAnimation 在 Idle 状态播放
            const idleKey = StateDefine.Idle as unknown as string;
            if (this.skeletalAnimation && typeof this.skeletalAnimation.play === 'function') {
                // 若有对应 state，则直接 play
                const state = this.skeletalAnimation.getState(idleKey);
                if (state) {
                    this.skeletalAnimation.play(idleKey);
                } else {
                    // 若没有命名为 Idle 的 clip，则 stop 保证不会残留攻击等动画
                    this.skeletalAnimation?.stop();
                }
            }
        } catch (e) {
            console.warn("resetActor: 切换到 Idle 时发生异常", e);
        }


        // 7) 标记允许继续输入/动作（按你项目约定）
        DataManager.Instance.playerAction = true;

        // 统一交付和收集中的“动画中”物体集合
        this._activeTransferringItems.clear();
        this.stackOffsetY = 0.5;
        this._canMove = true;
    }

    /** 按当前武器切换 Idle，并同步三把武器的可见性 */
    private _applyIdleByWeapon() {
        const wt = DataManager.Instance.curWeaponType;

        // 同步武器节点显示
        if (this.cottonSwabNode) this.cottonSwabNode.active = (wt === PlayerWeaponTypeEnum.CottonSwab);
        if (this.knifeNode) this.knifeNode.active = (wt === PlayerWeaponTypeEnum.Knife);
        if (this.flamethrowerNode) this.flamethrowerNode.active = (wt === PlayerWeaponTypeEnum.Flamethrower);

        //优先使用 Idle_WeaponType；否则退回 StateDefine.Idle
        const idleKey = `Idle_${wt}`;
        const idleEnum = (StateDefine as any)[idleKey] ?? StateDefine.Idle;
        this.changState(idleEnum);
    }

    /** 递归停止节点及所有子节点上的 Tween */
    private _stopTweensDeep(node: Node) {
        if (!node?.isValid) return;
        Tween.stopAllByTarget(node);
        for (const c of node.children) this._stopTweensDeep(c);
    }




    // 正在Tween的标记，便于打断
    private __moveTw: Tween<Node> | null = null;

    // 瞬移或平滑移动到解锁点
    public warpToUnlockPlot1(smooth = true) {
        this.warpToPosition(new Vec3(-13.977, 0, -2.543), smooth);
    }

    /** 瞬移/平滑到任意点 */
    public warpToPosition(target: Vec3, smooth = true, dur = 0.6) {
        if (!target) return;

        // 暂停物理速度，防止残留
        try {
            this.rigidbody?.setLinearVelocity(Vec3.ZERO);
            this.rigidbody?.setAngularVelocity(Vec3.ZERO);
        } catch { }

        // 打断上一次Tween
        if (this.__moveTw) {
            this.__moveTw.stop();
            this.__moveTw = null;
        }

        if (!smooth) {
            // 瞬移
            this.node.setWorldPosition(target);
            return;
        }

        // 平滑插值（注意：期间内最好屏蔽摇杆写入 destForward）
        const start = this.node.worldPosition.clone();
        const end = target.clone();
        const self = this;

        // 临时屏蔽摇杆推进（可选）
        const prevCanMove = this._canMove;
        this._canMove = false;

        this.__moveTw = tween(this.node)
            .call(() => {
                // 旋即归零速度
                try {
                    self.rigidbody?.setLinearVelocity(Vec3.ZERO);
                    self.rigidbody?.setAngularVelocity(Vec3.ZERO);
                } catch { }
            })
            .to(dur, {}, {
                onUpdate: (node: Node, ratio: number) => {
                    const t = math.clamp01(ratio);
                    const cur = new Vec3(
                        start.x + (end.x - start.x) * t,
                        start.y + (end.y - start.y) * t,
                        start.z + (end.z - start.z) * t
                    );
                    node.setWorldPosition(cur);

                    // 朝向目标（可选）
                    const dir = new Vec3(end.x - cur.x, 0, end.z - cur.z);
                    if (dir.lengthSqr() > 1e-6) {
                        dir.normalize();
                        const a = MathUtil.signAngle(node.forward, dir, Vec3.UP);
                        const as = v3(0, a * 20, 0);
                        try { self.rigidbody?.setAngularVelocity(as); } catch { }
                    }
                }
            })
            .call(() => {
                // 结束：确保到达、恢复可移动
                self.node.setWorldPosition(end);
                self._canMove = prevCanMove;
                self.__moveTw = null;
                try {
                    self.rigidbody?.setLinearVelocity(Vec3.ZERO);
                    self.rigidbody?.setAngularVelocity(Vec3.ZERO);
                } catch { }
            })
            .start();
    }

    /** 如需随时打断 Tween 移动 */
    public cancelWarp() {
        if (this.__moveTw) {
            this.__moveTw.stop();
            this.__moveTw = null;
        }
        try {
            this.rigidbody?.setLinearVelocity(Vec3.ZERO);
            this.rigidbody?.setAngularVelocity(Vec3.ZERO);
        } catch { }
        this._canMove = true;
    }

}


