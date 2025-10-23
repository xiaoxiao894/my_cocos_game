import { _decorator, animation, Animation, AnimationClip, AnimationState, AsyncDelegate, BoxCollider, CCFloat, Collider, Color, Component, director, find, ICollisionEvent, Label, LabelComponent, Mat4, math, MeshRenderer, Node, ParticleSystem, PipelineStateManager, Quat, RigidBody, Scene, SkeletalAnimation, Slider, Sprite, Tween, tween, UIOpacity, UIRenderer, v3, Vec3, Vec4 } from 'cc';
import { StateDefine } from './StateDefine';
import { MathUtil } from '../Util/MathUtil';
import { DataManager } from '../Global/DataManager';
import { FunTypeEnum, PlayerWeaponTypeEnum, PlotEnum, TypeItemEnum } from '../Enum/Index';
import { StackManager } from '../StackSlot/StackManager';
import { SimplePoolManager } from '../Util/SimplePoolManager';
const { ccclass, property } = _decorator;

let tempVelocity: Vec3 = v3();

@ccclass('Actor')
export class Actor extends Component {
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

    destForward: Vec3 = v3();
    currentState: StateDefine | string = StateDefine.Idle;
    collider: Collider | null = null;
    rightBody: RigidBody | null = null;
    rigidbody: any;

    private _isEnterArea = false;
    private deliverCooldown: number = 0.1;
    private _lastDeliverTime = 0;

    private _reservedLabelMap: Map<Node, number> = new Map();
    // 统一交付和收集中的“动画中”物体集合
    private _activeTransferringItems: Set<Node> = new Set();
    private stackOffsetY: number = 0.5;

    start() {
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
        } else {

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

    onTriggerExit(event: ICollisionEvent) {
        const otherCollider = event.otherCollider;


        if (otherCollider.node.name == PlotEnum.Plot0) {
            const doorL = find("Root/Cons/L_prp_XieHe_mod_V001/Door/Door_L");
            const doorR = find("Root/Cons/L_prp_XieHe_mod_V001/Door/Door_R");
            const side = "T";

            this.closeDoorBySide(doorL, doorR, side);
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
        if (!from || !to) return;

        if (obj.isChangeValue) {
            const plot = obj.otherCollider.node.getChildByName("Plot");
            if (!plot || !this.reserveValueIfPossible(plot, 1)) {
                console.warn("资源不足，跳过交付");
                return;
            }
        }

        if (from.children.length == 0) return;

        const stackManager: StackManager = obj.isPlot4ArrangePos ? to["__stackManager"] : to["__stackManager"];
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

        const startPos = item.getWorldPosition();
        item.parent = this.node;
        item.setWorldPosition(startPos);

        let endPos: Vec3 | null = null;

        //  Plot2：添加进目标容器的堆叠槽位
        if (obj.isPlot4ArrangePos) {
            const slot = stackManager.assignSlot(item);
            if (!slot) {
                this._activeTransferringItems.delete(item);
                return;
            }
            endPos = stackManager.getSlotWorldPos(slot, to);
        } else if (obj.isPlot6ArrangePos) {
            const slot = stackManager.assignSlot(item);
            if (!slot) {
                this._activeTransferringItems.delete(item)
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
                    if (obj.isPlot4ArrangePos) {
                        const finalWorldPos = endPos;
                        item.setWorldPosition(finalWorldPos);
                        item.setParent(to);

                        const localPos = new Vec3();
                        to.inverseTransformPoint(localPos, finalWorldPos);
                        item.setPosition(localPos);

                        DataManager.Instance.uiPropertManager.meatDeliverProperty();
                    } else if (obj.isPlot6ArrangePos) {
                        const finalWorldPos = endPos;
                        item.setWorldPosition(finalWorldPos)
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

                    if (obj.otherCollider.node.name == PlotEnum.Plot5 && mode == 'collect') {
                        DataManager.Instance.uiPropertManager.coinCollectProperty();
                    } else if ((obj.otherCollider.node.name == PlotEnum.Plot6 && mode == 'deliver') ||
                        (obj.otherCollider.node.name == PlotEnum.Plot7 && mode == 'deliver') ||
                        (obj.otherCollider.node.name == PlotEnum.Plot8 && mode == 'deliver') ||
                        (obj.otherCollider.node.name == PlotEnum.Plot9 && mode == 'deliver')) {
                        DataManager.Instance.uiPropertManager.coinDeliverProperty();
                    }

                    this._activeTransferringItems.delete(item);

                    if (obj.isChangeValue) {
                        this.changeValueFun(item, obj)
                    }
                }
            })
            .start();
    }

    private _enablePhysicsOnPlot(plotsRoot: Node | null, plotName: string) {
        const n = plotsRoot?.getChildByName(plotName);
        if (!n) return;
        n.getComponent(Collider).enabled = true;
        n.getComponent(RigidBody).enabled = true;
    }

    changeValueFun(item: Node | null, obj: any) {
        if (item) item.removeFromParent();
        // DataManager.Instance.coinManager.onProjectileDead(item as any);
        SimplePoolManager.Instance.free(TypeItemEnum.GoldCoin, item);

        const plot = obj.otherCollider.node.getChildByName('Plot');
        if (!plot) return;

        const newVal = this.finalizeReservedValue(plot, 1);

        if (obj.otherCollider.node.name === PlotEnum.Plot1 && newVal === 0) {
            const elementCon = plot.parent?.getChildByName('ElementCon');
            if (elementCon) {
                elementCon.active = true;
                elementCon.setScale(1, 0, 1);

                tween(elementCon)
                    .to(0.15, { scale: new Vec3(1, 1.1, 1) }, { easing: 'quadOut' })
                    .to(0.05, { scale: new Vec3(1, 1, 1) }, { easing: 'quadOut' })
                    .start();

                const plotsRoot = find('Root/Phy/Plots');
                if (plotsRoot) {
                    ['Plot1', 'Plot4', 'Plot5'].forEach(name => this._enablePhysicsOnPlot(plotsRoot, name));
                }
            }
        } else if (obj.otherCollider.node.name === PlotEnum.Plot2 && newVal === 0) {                        // 更换武器
            const curWeaponType = DataManager.Instance.curWeaponType;
            if (curWeaponType == PlayerWeaponTypeEnum.CottonSwab) {
                this.suctionAniNode.active = true;
                this.cottonSwabNode.active = false;
                this.knifeNode.active = true;

                const plot = obj.otherCollider.node.getChildByName("Plot");
                const labelNode = plot.getChildByName("Label");
                const labelNodeCom = labelNode.getComponent(Label);
                labelNodeCom.string = `${10}`;

                DataManager.Instance.curWeaponType = PlayerWeaponTypeEnum.Knife;

                this.scheduleOnce(() => {
                    this.suctionAniNode.active = false;
                }, 2)
            } else if (curWeaponType == PlayerWeaponTypeEnum.Knife) {
                this.suctionAniNode.active = true;
                this.knifeNode.active = false;
                this.flamethrowerNode.active = true;

                DataManager.Instance.curWeaponType = PlayerWeaponTypeEnum.Flamethrower;
                this.scheduleOnce(() => {
                    this.suctionAniNode.active = false;
                }, 2)
            }
        } else if (obj.otherCollider.node.name === PlotEnum.Plot3 && newVal === 0) {                        // 解锁新区域

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

    // 关闭门
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

    update(dt: number) {
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
}


