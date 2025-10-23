import { _decorator, Animation, AnimationClip, AnimationState, BoxCollider, builtinResMgr, CCFloat, Collider, Color, Component, director, EffectAsset, find, gfx, ICollisionEvent, instantiate, Label, Mat4, Material, math, MeshRenderer, Node, Quat, resources, RigidBody, SkeletalAnimation, Slider, Sprite, Texture2D, tween, UIOpacity, v3, Vec3, Vec4 } from 'cc';
import { MinionStateEnum, StateDefine } from './StateDefine';
import { MathUtil } from '../Util/MathUtil';
import { DataManager } from '../Global/DataManager';
import { FlowField } from '../Monster/FlowField';
import { AreaEnum, CollisionEntityEnum, EntityTypeEnum, GamePlayNameEnum, PathEnum } from '../Enum/Index';
import { UIPropertyManager } from '../UI/UIPropertyManager';
import { ItemAreaManager } from '../Area/ItemAreaManager';
import { GunTurretManager } from './GunTurretManager';
import RVOObstacles from '../Global/RVOObstacles';
import { Simulator } from '../RVO/Simulator';
import { MinionManager } from './MinionManager';
import { TweenMaterial } from '../Area/TweenMaterial';
const { ccclass, property } = _decorator;

let tempVelocity: Vec3 = v3();

@ccclass('Actor')
export class Actor extends Component {
    @property(SkeletalAnimation)
    skeletalAnimation: SkeletalAnimation | null = null;

    @property(CCFloat)
    linearSpeed: number = 1.0;

    @property(CCFloat)
    angularSpeed: number = 90;

    @property(Node)
    scene1TSide: Node = null;

    @property(Node)
    scene1RSide: Node = null;

    @property(Node)
    scene1BSide: Node = null;

    @property(Node)
    scene1LSide: Node = null;

    @property(Node)
    scene2TSide: Node = null;

    @property(Node)
    scene2RSide: Node = null;

    @property(Node)
    scene2BSide: Node = null;

    @property(Node)
    scene2LSide: Node = null;

    @property(Texture2D)
    texture: Texture2D = null;

    @property({ type: CCFloat, tooltip: "R" })
    R = 163;

    @property({ type: CCFloat, tooltip: "G" })
    G = 150;

    @property({ type: CCFloat, tooltip: "B" })
    B = 0;

    // const targetColor = new Color(163, 150, 0, 255);


    destForward: Vec3 = v3();

    collider: Collider | null = null;
    rigidbody: RigidBody | null = null;

    currentState: StateDefine | string = StateDefine.Idle;

    uiproperty = null;

    onceData = true;

    // 是否在获取兵器的区域
    isWeaponArea = false;

    private _weaponCollectIndex = -1;
    private _weaponCollecting = false;
    private _weaponCollectDelay = 0;

    // 是否已经交付一次武器              FALSE没有交付， TURE已经交付一次
    private _hasWeaponDeliverdOnce = false;

    // 解锁地块6
    private isUnlockDeliveryAreas6 = true;

    // 是否交付金币
    private isDeliverCoins = false;
    private otherNode = null;

    private _txSGDAttackInitialWorldRot: Quat = new Quat();
    private _txSGDWalkAttackInitialWorldRot: Quat = new Quat();

    start() {
        this.rigidbody = this.node.getComponent(RigidBody);
        this.collider = this.node.getComponent(Collider);

        this.uiproperty = this.node.getChildByName("UIproperty");

        this.collider?.on("onTriggerEnter", this.onTriggerEnter, this);
        this.collider?.on("onTriggerStay", this.onTriggerStay, this);
        this.collider?.on("onTriggerExit", this.onTriggerExit, this);

        const JackParent = this.node.getChildByName("JackParent");
        if (JackParent) {
            const jack = JackParent.getChildByName("AnnaJC_Skin");
            if (jack) {
                const txAttack = JackParent.getChildByName("TX_attack");

                if (txAttack) {
                    txAttack.getWorldRotation(this._txSGDAttackInitialWorldRot);
                }

                const txWalkAttack = jack.getChildByName("TX_walk_attack");
                if (txWalkAttack) {
                    txWalkAttack.getWorldRotation(this._txSGDWalkAttackInitialWorldRot);
                }
            }
        }
    }

    lateUpdate(dt: number) {
        const JackParent = this.node.getChildByName("JackParent");
        if (JackParent) {
            const jack = JackParent.getChildByName("AnnaJC_Skin");
            if (jack) {
                const txAttack = jack.getChildByName("TX_attack");
                if (txAttack) {
                    txAttack.setWorldRotation(this._txSGDWalkAttackInitialWorldRot);
                }

                const txWalkAttack = jack.getChildByName("TX_walk_attack");
                if (txWalkAttack) {
                    txWalkAttack.setWorldRotation(this._txSGDWalkAttackInitialWorldRot);
                }
            }

        }
    }

    showPlane(node) {
        const meshRenderer = node.getComponent(MeshRenderer);
        const material = new Material();
        material.initialize({
            effectName: 'builtin-unlit',
            technique: 1, // transparent
            defines: {
                USE_TEXTURE: true
            }
        });

        // 目标颜色（最后应该过渡到这个颜色）
        const targetColor = new Color(this.R, this.G, this.B, 255);
        const startColorVec4 = new Vec4(
            targetColor.r / 255,
            targetColor.g / 255,
            targetColor.b / 255,
            0   // 初始 alpha = 0（完全透明）
        );

        // 设置初始透明色
        material.setProperty('mainColor', startColorVec4);
        material.setProperty('mainTexture', this.texture);
        const tilingOffset = new Vec4(6, 8, 0, 0);
        material.setProperty('tilingOffset', tilingOffset);
        meshRenderer.setMaterial(material, 0);

        // 开始渐变动画（从 alpha = 0 → 1）
        const tweenColor = new Vec4(startColorVec4.x, startColorVec4.y, startColorVec4.z, 0);
        tween(tweenColor)
            .to(1.5, {
                w: 1 // Vec4 的第4个参数是 alpha
            }, {
                onUpdate: () => {
                    material.setProperty('mainColor', tweenColor);
                }
            })
            .start();

    }

    colorToVec4(color: Color): Vec4 {
        return new Vec4(
            color.r / 255,
            color.g / 255,
            color.b / 255,
            color.a / 255
        );
    }

    update(deltaTime: number) {
        // 是否在金币的交付区域内
        if (this.isDeliverCoins) {
            this.deliverCoinsFun(deltaTime);
        }

        const canCollect = this._weaponCollecting && this.isWeaponArea;

        if (canCollect) {
            this._weaponCollectDelay += deltaTime;
            if (this._weaponCollectDelay >= 0.2) {
                this._weaponCollectDelay = 0;
                this.getPlayerWeaponStep(); // 每次收集一个
            }
        }

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
        let speed = this.linearSpeed * this.destForward.length() * 15;
        tempVelocity.x = math.clamp(this.node.forward.x, -1, 1) * speed;
        tempVelocity.z = math.clamp(this.node.forward.z, -1, 1) * speed;
        this.rigidbody?.setLinearVelocity(tempVelocity);
        FlowField.Instance.updateFlowField(this.node.getWorldPosition().clone());
    }

    // 武器获取
    startWeaponCollecting() {
        const deliveryAreas7 = find(PathEnum.DeliveryAreas7);
        if (!deliveryAreas7) return;

        const buildingCon = deliveryAreas7.getChildByName("BuildingCon");
        const weapons = buildingCon?.getChildByName("Weapons");
        const isZeroScale = buildingCon && buildingCon.scale.x !== 0 && buildingCon.scale.y !== 0 && buildingCon.scale.z !== 0;
        if (!isZeroScale || !weapons || weapons.children.length === 0) return;

        this._weaponCollectIndex = weapons.children.length - 1;
        this._weaponCollecting = true;
    }

    // 初始化交付状态
    private _isWeaponDelivering: boolean = false;
    private _weaponQueue: Node[] = [];
    private _weaponDeliverInterval: number = 0.3;

    private arrangeDeliveredWeapons() {
        const minionWeaponCon = find(PathEnum.MinionWeaponCon);
        if (!minionWeaponCon) return;

        const itemsPerRow = 3;
        const horizontalSpacing = 1.3;
        const verticalSpacing = 1;

        const validWeapons = minionWeaponCon.children.filter(w => (w as any).__delivered && !(w as any).__used);

        validWeapons.forEach((weapon, index) => {
            const col = index % itemsPerRow;
            const row = Math.floor(index / itemsPerRow);
            const targetPos = new Vec3(0, row * verticalSpacing, col * horizontalSpacing);
            weapon.setPosition(targetPos);
        });
    }

    weaponDelivery() {
        if (this._isWeaponDelivering) return;

        const backpack2 = DataManager.Instance.player.node.getChildByName("Backpack2");
        if (!backpack2 || backpack2.children.length === 0) return;

        const minionWeaponCon = find(PathEnum.MinionWeaponCon);
        if (!minionWeaponCon) return;

        if (this._weaponQueue.length === 0) {
            this._weaponQueue = [...backpack2.children].reverse();
        }

        if (this._weaponQueue.length === 0) return;

        if (!DataManager.Instance.isInWeaponDeliveryArea) {
            this._weaponQueue = [];
            return;
        }

        const item = this._weaponQueue.shift();
        if (!item?.isValid) {
            this.scheduleOnce(() => this.weaponDelivery(), this._weaponDeliverInterval);
            return;
        }

        this._isWeaponDelivering = true;

        const itemsPerRow = 3;
        const horizontalSpacing = 1.3;
        const verticalSpacing = 1;

        const validWeapons = minionWeaponCon.children.filter(w => (w as any).__delivered && !(w as any).__used);
        const nextIndex = validWeapons.length;

        const col = nextIndex % itemsPerRow;
        const row = Math.floor(nextIndex / itemsPerRow);
        const targetPos = new Vec3(0, row * verticalSpacing, col * horizontalSpacing);

        const worldStartPos = item.getWorldPosition();
        const worldTargetPos = minionWeaponCon.getWorldPosition().clone().add(targetPos);
        const midPoint = worldStartPos.clone().lerp(worldTargetPos, 0.5).add3f(0, 5, 0);

        const obj = { t: 0 };
        tween(obj)
            .to(0.6, { t: 1 }, {
                easing: 'quadInOut',
                onUpdate: () => {
                    if (!item?.isValid) return;
                    const pos = MathUtil.bezierCurve(worldStartPos, midPoint, worldTargetPos, obj.t);
                    item.setWorldPosition(pos);
                }
            })
            .call(() => {
                item.setParent(minionWeaponCon);
                (item as any).__delivered = true;
                item.setPosition(targetPos);

                this.arrangeDeliveredWeapons(); // 自动重新排布所有已交付武器

                if (!this._hasWeaponDeliverdOnce) {
                    this._hasWeaponDeliverdOnce = true;
                    this.deliverAllWeaponsOnce();
                }

                this._isWeaponDelivering = false;

                if (this._weaponQueue.length > 0 && DataManager.Instance.isInWeaponDeliveryArea) {
                    this.scheduleOnce(() => this.weaponDelivery(), this._weaponDeliverInterval);
                } else {
                    this._weaponQueue = [];
                }

                const nextData = DataManager.Instance.guideTargetList.find(item => item.name === "DeliverEquipmentArea");
                if (nextData) {
                    nextData.isFind = false;
                    nextData.isDisplay = false;
                }
            })
            .start();
    }

    // 是否有一次交付武器
    deliverAllWeaponsOnce() {
        const deliveryAreas9 = find(PathEnum.DeliveryAreas9);
        const deliveryAreas9Plot = deliveryAreas9.getChildByName("Plot");
        const itemAreaManager9 = deliveryAreas9Plot.getComponent(ItemAreaManager);
        itemAreaManager9?.displayAni(deliveryAreas9Plot);

        const areas9Data = DataManager.Instance.guideTargetList.find(item => {
            return item.name == "DeliveryAreas9";
        })

        if (areas9Data) {
            areas9Data.isFind = true;
            areas9Data.isDisplay = true;
        }

        const deliveryAreas10 = find(PathEnum.DeliveryAreas10);
        const deliveryAreas10Plot = deliveryAreas10.getChildByName("Plot");
        const itemAreaManage10 = deliveryAreas10Plot.getComponent(ItemAreaManager);
        itemAreaManage10?.displayAni(deliveryAreas10Plot);

        const areas10Data = DataManager.Instance.guideTargetList.find(item => {
            return item.name == "DeliveryAreas10";
        })

        if (areas10Data) {
            areas10Data.isFind = true;
            areas10Data.isDisplay = true;
        }
    }

    stopMove() {
        this.rigidbody?.setLinearVelocity(Vec3.ZERO);
    }

    changState(state: StateDefine | string) {
        const clipName = state as string;

        // 获取目标动画状态
        const aniState = this.skeletalAnimation?.getState(clipName);

        // 如果是攻击状态，允许重复切换（防止攻击无法连击）
        if (state === StateDefine.Attack) {
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
        if (
            this.currentState === StateDefine.Walk ||
            this.currentState === StateDefine.Walk_attack
        ) {
            this.stopMove();
        }

        if (aniState) {
            aniState.wrapMode = AnimationClip.WrapMode.Loop; // 防止播放完卡住
            this.skeletalAnimation?.crossFade(clipName, 0.1);
        } else {
            console.warn(`未找到动画状态：${clipName}`);
        }

        this.currentState = state;
    }

    onAnimationFinished(event: AnimationEvent) {
        DataManager.Instance.playerAction = true;
    }

    // 进入
    private enterPlots = [];
    onTriggerEnter(event: ICollisionEvent) {
        const selfCollider = event.selfCollider;
        const otherCollider = event.otherCollider;

        // 执行开门逻辑
        if (otherCollider.node.name.includes("Door")) {
            const [scene, side] = otherCollider.node.name.split("_");

            const sceneMap = {
                Scene1: {
                    L: this.scene1LSide,
                    T: this.scene1TSide,
                    B: this.scene1BSide,
                    R: this.scene1RSide
                },
                Scene2: {
                    L: this.scene2LSide,
                    T: this.scene2TSide,
                    B: this.scene2BSide,
                    R: this.scene2RSide
                }
            };

            const doorGroup = sceneMap[scene]?.[side]?.getChildByName(`${side}_Door`);
            if (!doorGroup) {
                console.warn(`[Door] ${scene}_${side} 未找到门节点`);
                return;
            }

            const doorL = doorGroup.getChildByName("Door_Left");
            const doorR = doorGroup.getChildByName("Door_Right");

            this.openDoorBySide(doorL, doorR, side);
        }

        // 是否进入交付金币的区域
        var otherNode = otherCollider.node;

        var deliveryAreaNames = [];
        for (var key in CollisionEntityEnum) {
            if (CollisionEntityEnum.hasOwnProperty(key)) {
                deliveryAreaNames.push(CollisionEntityEnum[key]);
            }
        }

        if (deliveryAreaNames.indexOf(otherNode.name) !== -1) {
            this.isDeliverCoins = true;
            this.otherNode = otherNode;

            this.enterPlots.push(otherNode.name)
        }
    }

    openDoorBySide(doorL: Node | null, doorR: Node | null, side: string) {
        const duration = 0.3;

        // 不同方向的开门角度设置（左门/右门）
        const angleMap = {
            L: { left: 70, right: 300 },
            R: { left: -110, right: 110 },
            T: { left: -20, right: 200 },
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

    onTriggerStay(event: ICollisionEvent) {
        const otherNode = event.otherCollider.node;
        DataManager.Instance.isInWeaponDeliveryArea = true;

        // 人物在装备区域， 并且7已经解锁
        if (otherNode.name === "ObtainEquipmentArea" && !DataManager.Instance.isConveyorBeltUnlocking) {
            this.isWeaponArea = true;
            this.startWeaponCollecting();
        }

        // 武器交付区域
        if (otherNode.name === AreaEnum.DeliverEquipmentArea) {
            this.weaponDelivery();
        }
        // // === 👇记录执行时间开始
        // const t0 = performance.now();
        // const backpack1 = this.node.getChildByName("Backpack1");
        // if (!backpack1 || backpack1.children.length === 0) return;

        // const deliveryAreaNames = Object.values(CollisionEntityEnum) as string[];
        // if (!deliveryAreaNames.includes(otherNode.name)) return;

        // const plot = otherNode.getChildByName("Plot");
        // const deliveryNumNode = plot?.getChildByName("DeliveryNum");
        // const label = deliveryNumNode?.getComponent(Label);
        // const isNotZeroScale = plot?.scale.x !== 0 || plot.scale.y !== 0 || plot.scale.z !== 0;

        // if (!plot || !deliveryNumNode || !label || !isNotZeroScale) return;

        // let total = this.deliveryCountMap.get(otherNode);
        // if (total === undefined) {
        //     total = Number(label.string);
        //     this.deliveryCountMap.set(otherNode, total);
        // }

        // const pending = this.pendingDeliveryCountMap.get(otherNode) ?? 0;
        // if ((total - pending) > 0 && !this._deliverQueue.includes(otherNode)) {
        //     this.pendingDeliveryCountMap.set(otherNode, pending + 1);
        //     this._deliverQueue.push(otherNode);
        //     this._tryDeliverNext();

        //     const t1 = performance.now();
        //     console.log(`🕒 deliverItemToTarget 执行耗时: ${(t1 - t0).toFixed(2)}ms`);
        // }
    }

    // === 声明交付状态映射（以区域 Node 为 key，追踪剩余次数） ===
    private deliveryCountMap: Map<Node, number> = new Map();
    private pendingDeliveryCountMap: Map<Node, number> = new Map();
    private _deliverInterval: number = 0.05;
    private _deliverTimer = 0;

    deliverCoinsFun(deltaTime: number) {
        const backpack1 = this.node.getChildByName("Backpack1");
        if (!backpack1 || backpack1.children.length === 0) return;
        if (!this.otherNode) return;

        var isDeliveryArea = false;
        for (var k in CollisionEntityEnum) {
            if (Object.prototype.hasOwnProperty.call(CollisionEntityEnum, k)) {
                if (CollisionEntityEnum[k] === this.otherNode.name) {
                    isDeliveryArea = true;
                    break;
                }
            }
        }
        if (!isDeliveryArea) return;

        const plot = this.otherNode.getChildByName("Plot");
        const deliveryNumNode = plot?.getChildByName("DeliveryNum");
        const label = deliveryNumNode?.getComponent(Label);
        const isNotZeroScale = plot?.scale.x !== 0 || plot.scale.y !== 0 || plot.scale.z !== 0;

        if (!plot || !deliveryNumNode || !label || !isNotZeroScale) return;

        // 初始化交付数
        let total = this.deliveryCountMap.get(this.otherNode);
        if (total === undefined) {
            total = Number(label.string);
            this.deliveryCountMap.set(this.otherNode, total);
            this.pendingDeliveryCountMap.set(this.otherNode, 0);
        }

        const pending = this.pendingDeliveryCountMap.get(this.otherNode) ?? 0;
        if (total - pending <= 0) return; // 没有金币可交付（剩余全部在飞）

        this._deliverTimer += deltaTime;
        if (this._deliverTimer < this._deliverInterval) return;
        this._deliverTimer = 0;

        const success = this.deliverItemToTarget(this.otherNode);
        if (!success) return;
    }

    private deliverItemToTarget(targetNode: Node): boolean {
        const player = DataManager.Instance.player;
        const backpack1 = player?.node?.getChildByName("Backpack1");
        if (!player || !backpack1 || backpack1.children.length === 0) return false;

        const item = backpack1.children[backpack1.children.length - 1];
        if (!item || !item.isValid) return false;

        const plot = targetNode.getChildByName("Plot");
        const deliveryNumNode = plot?.getChildByName("DeliveryNum");
        const dkLv = plot?.getChildByName("DK_LV");
        const dkLvSpr = dkLv?.getComponent(Sprite);
        const label = deliveryNumNode?.getComponent(Label);
        if (!plot || !deliveryNumNode || !label) return false;

        const currentTotal = this.deliveryCountMap.get(targetNode) ?? Number(label.string);
        const currentPending = this.pendingDeliveryCountMap.get(targetNode) ?? 0;
        if (currentTotal - currentPending <= 0) return false;

        // 标记为已飞出待完成
        this.pendingDeliveryCountMap.set(targetNode, currentPending + 1);

        // 播放UI缩放动画（保持不变）
        const iconSprite = plot.getChildByName("Icon");
        if (iconSprite) {
            tween(iconSprite).stop();
            tween(iconSprite)
                .to(0.1, { scale: new Vec3(0.02, 0.02, 0.02) })
                .to(0.1, { scale: new Vec3(0.015, 0.015, 0.015) })
                .start();
        }

        const deliveryNumSprite = plot.getChildByName("DeliveryNum");
        if (deliveryNumSprite) {
            tween(deliveryNumSprite).stop();
            tween(deliveryNumSprite)
                .to(0.1, { scale: new Vec3(0.08, 0.08, 0.08) })
                .to(0.1, { scale: new Vec3(0.06, 0.06, 0.06) })
                .start();
        }

        // 飞行动画轨迹
        const itemWorldPos = item.worldPosition.clone();
        item.setParent(this.node.parent);

        const start = itemWorldPos;
        const end = targetNode.worldPosition.clone();
        const control = new Vec3(
            (start.x + end.x) / 2,
            Math.max(start.y, end.y) + 7,
            (start.z + end.z) / 2
        );

        const controller = { t: 0 };
        tween(controller)
            .to(0.5, { t: 1 }, {
                easing: 'quadInOut',
                onUpdate: () => {
                    const t = controller.t;
                    const oneMinusT = 1 - t;
                    const pos = new Vec3(
                        oneMinusT * oneMinusT * start.x + 2 * oneMinusT * t * control.x + t * t * end.x,
                        oneMinusT * oneMinusT * start.y + 2 * oneMinusT * t * control.y + t * t * end.y,
                        oneMinusT * oneMinusT * start.z + 2 * oneMinusT * t * control.z + t * t * end.z
                    );
                    item.setWorldPosition(pos);
                }
            })
            .call(() => {
                DataManager.Instance.monsterManager.recycleDrop(item);
                DataManager.Instance.soundManager.playIconSound();

                // 动画完成后：更新实际数据和 UI
                let remaining = this.deliveryCountMap.get(targetNode) ?? 1;
                remaining = Math.max(remaining - 1, 0);
                this.deliveryCountMap.set(targetNode, remaining);
                label.string = remaining.toString();
                DataManager.Instance.UIPropertyManager.deliverProperty();

                let pending = this.pendingDeliveryCountMap.get(targetNode) ?? 1;
                this.pendingDeliveryCountMap.set(targetNode, Math.max(pending - 1, 0));


                const plotData = DataManager.Instance.landParcelRules.find(item => item.name === targetNode.name);
                if (plotData) {
                    let value = 0;
                    if (plotData.iconNumber > 0) {
                        value = (plotData.iconNumber - remaining) / plotData.iconNumber;
                        value = Math.max(0, Math.min(1, value));
                    }
                    dkLvSpr.fillRange = value;
                }

                if (remaining === 0 && !(targetNode as any)._hasDeliveredZero) {
                    (targetNode as any)._hasDeliveredZero = true;
                    this.onDeliveryComplete(targetNode);
                }
            })
            .start();

        return true;
    }

    // 离开
    onTriggerExit(event: ICollisionEvent) {
        DataManager.Instance.isInWeaponDeliveryArea = false;
        const otherCollider = event.otherCollider;
        const selfCollider = event.selfCollider;
        const otherNode = event.otherCollider.node;

        if (otherNode.name == "ObtainEquipmentArea") {
            this.isWeaponArea = false;
            this._weaponCollecting = false;
        }
        if (otherCollider.node.name.includes("Door")) {
            const [scene, side] = otherCollider.node.name.split("_");

            const sceneMap = {
                Scene1: {
                    L: this.scene1LSide,
                    T: this.scene1TSide,
                    B: this.scene1BSide,
                    R: this.scene1RSide
                },
                Scene2: {
                    L: this.scene2LSide,
                    T: this.scene2TSide,
                    B: this.scene2BSide,
                    R: this.scene2RSide
                }
            };

            const doorGroup = sceneMap[scene]?.[side]?.getChildByName(`${side}_Door`);
            if (!doorGroup) {
                console.warn(`[Door] ${scene}_${side} 未找到门节点`);
                return;
            }

            const doorL = doorGroup.getChildByName("Door_Left");
            const doorR = doorGroup.getChildByName("Door_Right");

            this.closeDoorBySide(doorL, doorR, side);
        }
        // 是否离开金币的交付区域
        var deliveryAreaNames = [];
        for (var key in CollisionEntityEnum) {
            if (CollisionEntityEnum.hasOwnProperty(key)) {
                deliveryAreaNames.push(CollisionEntityEnum[key]);
            }
        }

        if (deliveryAreaNames.indexOf(otherNode.name) !== -1) {
            const idx = this.enterPlots.findIndex(itme => {
                return itme == otherNode.name;
            })

            if (idx >= 0) {
                this.enterPlots.splice(idx, 1);
            }

            if (this.enterPlots.length <= 0) {
                this.isDeliverCoins = false;
                this.otherNode = null;
            }
        }
    }

    closeDoorBySide(doorL: Node | null, doorR: Node | null, side: string, isMinion = false) {
        const duration = 0.3;

        const angleMap = {
            L: { left: 180, right: 180 },
            R: { left: 0, right: 0 },
            T: { left: 90, right: 90 },
            B: { left: -90, right: -90 }
        };

        const config = angleMap[side];
        if (!config) {
            console.warn(`[Door] 未定义方向开门角度: ${side}`);
            return;
        }

        if (this.node.name == "Player" && !DataManager.Instance.isAllMinionsPassed && side == "B" && !isMinion) {
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

    onDeliveryComplete(otherNode) {
        const plot = otherNode.getChildByName("Plot");
        const buildingCon = otherNode.getChildByName("BuildingCon");
        if (!plot) return;

        const uiOpacity = plot.getComponent(UIOpacity) || plot.addComponent(UIOpacity);
        tween(uiOpacity)
            .to(0.3, { opacity: 0 })
            .call(() => {
                DataManager.Instance.soundManager.BuildingUnlockSoundPlay();

                const data = DataManager.Instance.guideTargetList.find(item => {
                    return item.name == otherNode.name;
                })

                if (data) {
                    data.isFind = false;
                    data.isDisplay = false;
                }

                if (otherNode.name == "DeliveryAreas3" || otherNode.name == "DeliveryAreas4" ||
                    otherNode.name == "DeliveryAreas5" || otherNode.name == "DeliveryAreas8" ||
                    otherNode.name == "DeliveryAreas7") {
                    buildingCon.setScale(1, 1, 0);
                    tween(buildingCon)
                        .to(0.15, { scale: new Vec3(1, 1, 1.1) }, { easing: 'quadOut' }) // 带弹性效果
                        .to(0.05, { scale: new Vec3(1, 1, 1) }, { easing: 'quadOut' })
                        .call(() => {
                            const deliveryAreasPh = find(PathEnum.DeliveryAreasPh);
                            if (deliveryAreasPh) {
                                const deliveryAreas = deliveryAreasPh.getChildByName(otherNode.name);
                                if (deliveryAreas) {
                                    const boxCollider = deliveryAreas.getComponent(BoxCollider);
                                    if (boxCollider) {
                                        boxCollider.enabled = true;
                                    }

                                    const rigidbody = deliveryAreas.getComponent(RigidBody);
                                    if (rigidbody) {
                                        rigidbody.enabled = true;
                                        rigidbody.wakeUp();
                                    }
                                }
                            }

                            // 解锁规则条件
                            this.unlockNewSpecies(otherNode);
                        })
                        .start();
                } else {
                    buildingCon.setScale(1, 0, 1);
                    tween(buildingCon)
                        .to(0.15, { scale: new Vec3(1, 1.1, 1) }, { easing: 'quadOut' }) // 带弹性效果
                        .to(0.05, { scale: new Vec3(1, 1, 1) }, { easing: 'quadOut' })
                        .call(() => {
                            const deliveryAreasPh = find(PathEnum.DeliveryAreasPh);
                            if (deliveryAreasPh) {
                                const deliveryAreas = deliveryAreasPh.getChildByName(otherNode.name);
                                if (deliveryAreas) {
                                    const boxCollider = deliveryAreas.getComponent(BoxCollider);
                                    if (boxCollider) {
                                        boxCollider.enabled = true;
                                    }

                                    const rigidbody = deliveryAreas.getComponent(RigidBody);
                                    if (rigidbody) {
                                        rigidbody.enabled = true;
                                        rigidbody.wakeUp();
                                    }
                                }
                            }

                            // 解锁规则条件
                            this.unlockNewSpecies(otherNode);
                        })
                        .start();
                }
            })
            .start()
    }

    // 解锁规则条件
    unlockNewSpecies(otherNode) {
        // 解锁地块6
        if (otherNode.name == CollisionEntityEnum.DeliveryAreas3 || otherNode.name == CollisionEntityEnum.DeliveryAreas4 ||
            otherNode.name == CollisionEntityEnum.DeliveryAreas5) {
            if (this.isUnlockDeliveryAreas6) {
                this.isUnlockDeliveryAreas6 = false;

                const deliveryAreas6 = otherNode.parent.getChildByName(CollisionEntityEnum.DeliveryAreas6);
                if (deliveryAreas6) {
                    const plot = deliveryAreas6.getChildByName("Plot");
                    const itemAreaManager7 = deliveryAreas6.getComponent(ItemAreaManager);
                    itemAreaManager7?.displayAni(plot);

                    const data = DataManager.Instance.guideTargetList.find(item => {
                        return item.name == CollisionEntityEnum.DeliveryAreas6;
                    })

                    if (data) {
                        data.isFind = true;
                        data.isDisplay = true;
                    }

                }
            }
        }
        // 解锁角色
        if (otherNode.name == CollisionEntityEnum.DeliveryAreas3 || otherNode.name == CollisionEntityEnum.DeliveryAreas4 ||
            otherNode.name == CollisionEntityEnum.DeliveryAreas5 || otherNode.name == CollisionEntityEnum.DeliveryAreas8) {
            // 生成两张卡片
            DataManager.Instance.cardConManager.createCards(otherNode);
        } else if (otherNode.name == CollisionEntityEnum.DeliveryAreas6) {             // 解锁场景1
            // 地图1 打开
            const fencesScene1 = find(PathEnum.FencesScene1);
            const scene1RSide = fencesScene1.getChildByName("RSide");
            scene1RSide.active = false;

            const scene1PhysicsRight = find(PathEnum.Scene1PhysicsRight);
            for (let i = 0; i < scene1PhysicsRight.children.length; i++) {
                const node = scene1PhysicsRight.children[i];
                const boxCollider = node.getComponent(BoxCollider);
                boxCollider.enabled = false;

                const rigidBody = node.getComponent(RigidBody);
                rigidBody.enabled = false;
            }

            // 地图2
            let sideList: Node[] = [];
            sideList.push(...this.scene2TSide.children, ...this.scene2RSide.children, ...this.scene2BSide.children.reverse());

            // 开启阴影
            for (let i = 0; i < sideList.length; i++) {
                const node = sideList[i];
                if (node.name.includes("Door")) {
                    const doorLeft = node.getChildByName("Door_Left")
                    const childrenL = doorLeft.children[0].children[0];
                    const meshRendererL = childrenL.getComponent(MeshRenderer);
                    meshRendererL.shadowCastingMode = 1;

                    const doorRight = node.getChildByName("Door_Left")
                    const childrenR = doorRight.children[0].children[0];
                    const meshRendererR = childrenR.getComponent(MeshRenderer);
                    meshRendererR.shadowCastingMode = 1;
                } else {
                    const children = node.children[0];
                    const meshRender = children.getComponent(MeshRenderer);
                    meshRender.shadowCastingMode = 1;
                }

                if ((node as any)._hasFadedIn) continue;
                (node as any)._hasFadedIn = true;
                // 设定初始位置（地底）
                const originPos = node.getPosition();

                // 构建上升动画
                const targetPos = new Vec3(originPos.x, 0, originPos.z);

                // 延迟执行，形成依次升起效果
                this.scheduleOnce(() => {
                    tween(node)
                        .to(0.2, { position: targetPos }, { easing: 'quadOut' })
                        .call(() => {
                            // 动画结束后执行额外逻辑（仅最后一个节点或全部执行都可）
                            if (i === sideList.length - 1) {
                                const plane2 = find("dixing/Plane-002");
                                if (plane2) {
                                    plane2.active = true;
                                    const palne02Ani = plane2.getComponent(Animation);
                                    if (palne02Ani) {
                                        palne02Ani.play("Plane02CS")
                                    }
                                    // this.showPlane(plane2);
                                }

                                const deliveryAreas8 = otherNode.parent.getChildByName(CollisionEntityEnum.DeliveryAreas8);
                                if (deliveryAreas8) {
                                    const plot = deliveryAreas8.getChildByName("Plot");
                                    const itemAreaManager8 = deliveryAreas8.getComponent(ItemAreaManager);
                                    itemAreaManager8?.displayAni(plot);

                                    const data = DataManager.Instance.guideTargetList.find(item => {
                                        return item.name == CollisionEntityEnum.DeliveryAreas8
                                    })

                                    if (data) {
                                        data.isFind = true;
                                        data.isDisplay = true;
                                    }
                                }

                                const deliveryAreas7 = otherNode.parent.getChildByName(CollisionEntityEnum.DeliveryAreas7);
                                if (deliveryAreas7) {
                                    const plot = deliveryAreas7.getChildByName("Plot");
                                    const itemAreaManager7 = deliveryAreas7.getComponent(ItemAreaManager);
                                    itemAreaManager7?.displayAni(plot);

                                    const data = DataManager.Instance.guideTargetList.find(item => {
                                        return item.name == CollisionEntityEnum.DeliveryAreas7
                                    })

                                    if (data) {
                                        data.isFind = true;
                                        data.isDisplay = true;
                                    }
                                }

                                // 显示场景2的路径
                                //this.displaySceneTwoPath();

                                // 显示场景2的刚体
                                this.displaySceneRigidBody(PathEnum.Scene2Physics);

                                // 添加场景2的障碍物到避障里面
                                this.addSceneToObstacle(PathEnum.Scene2Physics);

                                // 更新门数据
                                DataManager.Instance.sceneManager.addSceneDoorFun(PathEnum.Scene2);

                                // 检查哪些怪在这个场景中
                                const monsters = DataManager.Instance.monsterManager.getSurroundedMonsters();
                                if (monsters.length > 0) {
                                    // 
                                    for (let i = 0; i < monsters.length; i++) {
                                        const node = monsters[i];
                                        if (!node || !node.isValid) continue;

                                        if (node.name == "Mantis") {
                                            // 直接死五次
                                            for (let j = 0; j < 5; j++) {
                                                DataManager.Instance.monsterManager.killMonsters([node])
                                            }
                                        } else {
                                            for (let j = 0; j < 3; j++) {
                                                DataManager.Instance.monsterManager.killMonsters([node]);
                                            }
                                        }
                                    }
                                }

                                const fencesScene2 = find(PathEnum.FencesScene2);
                                DataManager.Instance.sceneManager.collectGuardrails(fencesScene2);
                            }
                        })
                        .start();
                }, i * 0.05); // 每个节点延迟0.05秒
            }
        } else if (otherNode.name == CollisionEntityEnum.DeliveryAreas7) {             // 解锁铁匠铺
            // const deliveryAreas7 = otherNode.parent.getChildByName(CollisionEntityEnum.DeliveryAreas7);
            // if (deliveryAreas7) {
            //     const buildingCon = deliveryAreas7.getChildByName("BuildingCon");
            //     buildingCon.setScale(1, 1, 0);
            //     tween(buildingCon)
            //         .to(0.3, { scale: new Vec3(1, 1, 1.1) }, { easing: 'backOut' })
            //         .to(0.3, { scale: new Vec3(1, 1, 1) }, { easing: 'backOut' })
            //         .call(() => {
            //             // 开始产出弓箭
            DataManager.Instance.isGenerateWeapons = true;

            const data = DataManager.Instance.guideTargetList.find(item => {
                return item.name == "ObtainEquipmentArea";
            })

            if (data) {
                data.isFind = true;
                data.isDisplay = true;
            }
            // })
            // .start();
            // const itemAreaManager7 = deliveryAreas7.getComponent(ItemAreaManager);
            // itemAreaManager7?.displayAni(buildingCon);
            // }
        } else if (otherNode.name == CollisionEntityEnum.DeliveryAreas10) {            // 解锁场景2，  结束
            // 地图2 打开
            const fencesScene1 = find(PathEnum.FencesScene1);
            const scene1RSide = fencesScene1.getChildByName("RSide");
            scene1RSide.active = false;

            const scene1PhysicsRight = find(PathEnum.Scene2PhysicsRight);
            for (let i = 0; i < scene1PhysicsRight.children.length; i++) {
                const node = scene1PhysicsRight.children[i];
                const boxCollider = node.getComponent(BoxCollider);
                boxCollider.enabled = false;

                const rigidBody = node.getComponent(RigidBody);
                rigidBody.enabled = false;
            }

            const fencesScene2 = find(PathEnum.FencesScene2);
            const scene2RSide = fencesScene2.getChildByName("RSide");
            scene2RSide.active = false;

            const fencesScene3 = find(PathEnum.FencesScene3);
            const tSide = fencesScene3.getChildByName("TSide");
            const rSide = fencesScene3.getChildByName("RSide");
            const bSide = fencesScene3.getChildByName("BSide");

            let newList = [];
            newList.push(...tSide.children, ...rSide.children, ...bSide.children);

            for (let i = 0; i < newList.length; i++) {
                const node = newList[i];

                if ((node as any)._hasFadedIn) continue;
                (node as any)._hasFadedIn = true;

                // 保存原始位置
                const originPos = node.getPosition();
                const targetPos = new Vec3(originPos.x, 0, originPos.z);

                // 延迟播放上升动画
                this.scheduleOnce(() => {
                    tween(node)
                        .to(0.2, { position: targetPos }, { easing: 'quadOut' })
                        .call(() => {
                            if (i === newList.length - 1) {
                                const plane3 = find("dixing/Plane-003");
                                if (plane3) {
                                    plane3.active = true;
                                    const palne03Ani = plane3.getComponent(Animation);
                                    if (palne03Ani) {
                                        palne03Ani.play("Plane003CS")
                                    }
                                    // this.showPlane(plane3);
                                }
                                // 显示场景2的刚体
                                this.displaySceneRigidBody(PathEnum.Scene3Physics);

                                // 添加场景2的障碍物到避障里面
                                this.addSceneToObstacle(PathEnum.Scene3Physics);

                                // 更新门数据
                                DataManager.Instance.sceneManager.addSceneDoorFun(PathEnum.Scene3);

                                // 检查哪些怪在这个场景中
                                const monsters = DataManager.Instance.monsterManager.getSurroundedMonsters();
                                if (monsters.length > 0) {
                                    for (let i = 0; i < monsters.length; i++) {
                                        const node = monsters[i];
                                        if (!node || !node.isValid) continue;

                                        if (node.name == "Mantis") {
                                            // 直接死五次
                                            for (let j = 0; j < 5; j++) {
                                                DataManager.Instance.monsterManager.killMonsters([node])
                                            }
                                        } else {
                                            DataManager.Instance.monsterManager.killMonsters([node]);
                                        }
                                    }
                                }

                                const fencesScene3 = find(PathEnum.FencesScene3);
                                DataManager.Instance.sceneManager.collectGuardrails(fencesScene3);

                                // 结束游戏
                                if (DataManager.Instance.isGameEnd) return;

                                this.scheduleOnce(() => {
                                    DataManager.Instance.isGameEnd = true;

                                    DataManager.Instance.gameEndManager.init();
                                }, 2)
                            }
                        })
                        .start();
                }, i * 0.05); // 每个间隔 0.05s
            }
        } else if (otherNode.name == CollisionEntityEnum.DeliveryAreas9) {             // 解锁传送带
            DataManager.Instance.conveyerBeltManager.init();

            this.scheduleOnce(() => {
                // 等待两秒钟，解锁自动运输模式
                DataManager.Instance.isConveyorBeltUnlocking = true;
            }, 2)
        } else if (otherNode.name == CollisionEntityEnum.DeliveryAreas1 ||
            otherNode.name == CollisionEntityEnum.DeliveryAreas2) {
            const buildingCon = otherNode.getChildByName("BuildingCon");
            if (buildingCon) {
                const minion = buildingCon.getChildByName("Minion");
                if (minion) {
                    const minionManager = minion.children[0].getComponent(MinionManager);

                    if (minionManager) {
                        minionManager.init();
                        minionManager.changState(MinionStateEnum.Idle);

                        const worldPos = minion.worldPosition;
                        const effectPrafab = DataManager.Instance.prefabMap.get(EntityTypeEnum.TX_shengjiLZ);
                        const skillExplosion = instantiate(effectPrafab);
                        director.getScene().addChild(skillExplosion);
                        skillExplosion.setWorldPosition(new Vec3(worldPos.x, worldPos.y + 1, worldPos.z));

                        const anim = skillExplosion?.getComponent(Animation);
                        if (anim) {
                            anim.play(`TX_shengjiLZ`);
                            anim.once(Animation.EventType.FINISHED, () => {
                                skillExplosion.destroy();
                            });
                        } else {
                            // 没动画时，延迟回收
                            this.scheduleOnce(() => {
                                skillExplosion.destroy();
                            }, 1);
                        }

                        tween(minion)
                            .to(0.4, { scale: new Vec3(1, 1, 1) }, {
                                easing: 'backOut' // 或 'elasticOut'，带弹力的缓出
                            })
                            .call(() => {
                                minionManager.isLookingForMonsters = true;
                                minionManager.isMoveMinion = false;
                            })
                            .start();
                    }
                }
            }

        }
    }

    fadeInMesh3D(node: Node, duration: number = 1.5) {
        const meshRenderer = node.getComponent(MeshRenderer);
        if (!meshRenderer) {
            console.warn('[fadeInMesh3D] 节点上缺少 MeshRenderer');
            return;
        }

        const sharedMat = meshRenderer.material;
        if (!sharedMat) {
            console.warn('[fadeInMesh3D] 没有共享材质');
            return;
        }

        // 创建材质（只用 effectAsset 初始化）
        const newMat = new Material();
        newMat.initialize({
            effectAsset: sharedMat.effectAsset,
        });

        // 设置混合模式（启用透明）
        const pass = newMat.passes[0];
        const blendTarget = pass.blendState.targets[0];
        blendTarget.blend = true;
        blendTarget.blendSrc = gfx.BlendFactor.SRC_ALPHA;
        blendTarget.blendDst = gfx.BlendFactor.ONE_MINUS_SRC_ALPHA;
        pass.blendState.targets[0] = blendTarget;

        // 设置初始颜色透明
        const baseColor = new Color(163, 150, 0, 0);
        const baseVec4 = new Vec4(
            baseColor.r / 255,
            baseColor.g / 255,
            baseColor.b / 255,
            0
        );
        newMat.setProperty('mainColor', baseVec4);

        //  应用材质
        meshRenderer.setMaterial(newMat, 0);

        //  tween 动画：透明 -> 不透明
        const fade = { alpha: 0 };
        tween(fade)
            .to(duration, { alpha: 1 }, {
                onUpdate: () => {
                    newMat.setProperty('mainColor', new Vec4(
                        baseVec4.x, baseVec4.y, baseVec4.z, fade.alpha
                    ));
                }
            })
            .start();
    }

    fadeInMaterial(node: Node, duration = 1.0) {
        const renderer = node.getComponent(MeshRenderer);
        if (!renderer) return;

        const material = renderer.getMaterial(0);
        if (!material) return;

        // 设置混合模式，允许透明（只需一次）
        const target = material.passes[0].blendState.targets[0];
        target.blend = true;
        target.blendSrc = 5; // src alpha
        target.blendDst = 6; // one minus src alpha
        target.blendEq = 0;

        // 初始为完全透明
        const color = new Color(255, 255, 255, 0);
        material.setProperty('albedo', color); // 注意：标准材质属性名是 'albedo'

        // Tween 到不透明
        const tempColor = color.clone();
        tween(tempColor)
            .to(duration, new Color(255, 255, 255, 255), {
                onUpdate: () => {
                    material.setProperty('albedo', tempColor);
                }
            })
            .start();
    }

    // 显示场景3的刚体
    displayScene3RigidBody() {
        const scene3Physics = find(PathEnum.Scene3Physics);
        if (!scene3Physics) return;

        for (let i = 0; i < scene3Physics.children.length; i++) {
            const dirNode = scene3Physics.children[i];
            if (!dirNode.activeInHierarchy) continue;

            for (let j = 0; j < dirNode.children.length; j++) {
                const node = dirNode.children[j];
                if (!node || !node.activeInHierarchy) continue;

                const boxColider = node.getComponent(BoxCollider);

                if (boxColider) {
                    boxColider.enabled = true;
                }

                const rigidBody = node.getComponent(RigidBody);

                if (rigidBody) {
                    rigidBody.enabled = true;
                    rigidBody.wakeUp();
                }
            }
        }
    }

    // 添加场景到避障里面
    addSceneToObstacle(path) {
        const scenePhysics = find(path)
        for (let i = 0; i < scenePhysics.children.length; i++) {
            const outNode = scenePhysics.children[i];
            for (let j = 0; j < outNode.children.length; j++) {
                const inNode = outNode.children[j];
                if (inNode.name != "Scene2_R_Door") {
                    RVOObstacles.addOneObstacle(inNode);
                }
            }
        }

        Simulator.instance.processObstacles();
    }

    // 显示场景2刚体
    displaySceneRigidBody(path) {
        const scenePhysics = find(path);
        if (!scenePhysics) return;

        for (let i = 0; i < scenePhysics.children.length; i++) {
            const dirNode = scenePhysics.children[i];
            if (!dirNode.activeInHierarchy) continue;

            for (let j = 0; j < dirNode.children.length; j++) {
                const node = dirNode.children[j];
                if (!node || !node.activeInHierarchy) continue;

                const boxCollider = node.getComponent(BoxCollider);
                const rigidBody = node.getComponent(RigidBody);

                if (boxCollider) {
                    boxCollider.enabled = true;
                }

                if (rigidBody) {
                    rigidBody.enabled = true;
                    rigidBody.wakeUp();
                }
            }
        }
    }

    // 显示场景2路径
    displaySceneTwoPath() {
        let list = [];
        const roadS2H = find(PathEnum.RoadS2H);
        const roadS2S = find(PathEnum.RoadS2S);

        list.push(...roadS2H.children.reverse(), ...roadS2S.children);

        for (let i = 0; i < list.length; i++) {
            tween(list[i])
                .to(i * 0.1, { scale: new Vec3(1, 1, 1) })
                .start();
        }
    }

    // 角色获取武器
    getPlayerWeaponStep() {
        if (!this.isWeaponArea) {
            this._weaponCollecting = false;
            return;
        }

        const deliveryAreas7 = find(PathEnum.DeliveryAreas7);
        if (!deliveryAreas7) return;

        const buildingCon = deliveryAreas7.getChildByName("BuildingCon");
        const weapons = buildingCon?.getChildByName("Weapons");
        if (!weapons || this._weaponCollectIndex < 0 || this._weaponCollectIndex >= weapons.children.length) {
            this._weaponCollecting = false;
            return;
        }

        const weapon = weapons.children[this._weaponCollectIndex];
        this._weaponCollectIndex--;

        if (!weapon || !weapon.isValid) return;

        const backpack2 = DataManager.Instance.player.node.getChildByName("Backpack2");
        if (!backpack2) return;

        const duration = 0.6;
        const start = weapon.worldPosition.clone();
        const controller = { t: 0 };

        weapon.setParent(this.node.parent);
        weapon.setWorldPosition(start);
        weapon.setScale(0.7, 0.7, 0.7)
        this.playerWeaponRotationAni(weapon);

        tween(controller)
            .to(duration, { t: 1 }, {
                easing: 'quadOut',
                onUpdate: () => {
                    const t = controller.t;
                    const oneMinusT = 1 - t;

                    let maxY = 0;
                    for (let j = 0; j < backpack2.children.length; j++) {
                        const child = backpack2.children[j];
                        if (!child || !child.isValid) continue;
                        const localPos = child.getPosition();
                        if (localPos.y > maxY) {
                            maxY = localPos.y;
                        }
                    }

                    const localTarget = new Vec3(0, maxY + 0.5, 0);

                    const worldPos = backpack2.getWorldPosition();
                    const worldRot = backpack2.getWorldRotation();
                    const worldScale = backpack2.getWorldScale();
                    const worldMat = new Mat4();
                    Mat4.fromRTS(worldMat, worldRot, worldPos, worldScale);

                    const worldTarget = Vec3.transformMat4(new Vec3(), localTarget, worldMat);

                    const control = new Vec3(
                        (start.x + worldTarget.x) / 2,
                        Math.max(start.y, worldTarget.y) + 2,
                        (start.z + worldTarget.z) / 2
                    );

                    const pos = new Vec3(
                        oneMinusT * oneMinusT * start.x + 2 * oneMinusT * t * control.x + t * t * worldTarget.x,
                        oneMinusT * oneMinusT * start.y + 2 * oneMinusT * t * control.y + t * t * worldTarget.y,
                        oneMinusT * oneMinusT * start.z + 2 * oneMinusT * t * control.z + t * t * worldTarget.z
                    );

                    weapon.setWorldPosition(pos);
                }
            })
            .call(() => {
                const finalWorldPos = weapon.getWorldPosition().clone();
                weapon.setParent(backpack2);
                weapon.setWorldPosition(finalWorldPos);

                DataManager.Instance.soundManager.WeaponPickingUpSoundPlay();

                if (this.onceData) {
                    this.onceData = false;

                    const data = DataManager.Instance.guideTargetList.find(item => {
                        return item.name == "ObtainEquipmentArea";
                    })

                    if (data) {
                        data.isFind = false;
                        data.isDisplay = false;
                    }

                    const nextData = DataManager.Instance.guideTargetList.find(item => {
                        return item.name == "DeliverEquipmentArea";
                    })

                    if (nextData) {
                        nextData.isFind = true;
                        nextData.isDisplay = true;
                    }
                }

            })
            .start();
    }

    // 武器旋转动画
    playerWeaponRotationAni(weapon) {
        const duration = 0.6;
        // 添加旋转动画（独立于位移动画）
        const startEuler = weapon.children[0].eulerAngles.clone(); // 初始角度（建议为 Vec3.ZERO）
        const targetEuler = new Vec3(123, -8, 180);
        const rotCtrl = { t: 0 };

        tween(rotCtrl)
            .to(duration, { t: 1 }, {
                easing: 'quadOut',
                onUpdate: () => {
                    const t = rotCtrl.t;
                    const currentEuler = new Vec3();
                    Vec3.lerp(currentEuler, startEuler, targetEuler, t);
                    weapon.children[0].setRotationFromEuler(currentEuler.x, currentEuler.y, currentEuler.z);
                }
            })
            .start();
    }

}


