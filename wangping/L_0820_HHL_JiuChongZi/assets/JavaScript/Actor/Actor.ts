import { _decorator, Animation, AnimationState, AsyncDelegate, BoxCollider, CCFloat, Collider, Color, Component, director, find, ICollisionEvent, Label, LabelComponent, Mat4, math, MeshRenderer, Node, Quat, RigidBody, SkeletalAnimation, Slider, Sprite, Tween, tween, UIOpacity, UIRenderer, v3, Vec3, Vec4 } from 'cc';
import { StateDefine } from './StateDefine';
import { MathUtil } from '../Util/MathUtil';
import { DataManager } from '../Global/DataManager';
import { UIPropertyManager } from '../UI/UIPropertyManager';
import { FunTypeEnum, PathEnum, PlotEnum, TypeItemEnum } from '../Enum/Index';
import { BackpackCurveTransfer } from '../Ani/BackpackCurveTransfer';
import { ItemPartnerManager } from './ItemPartnerManager';
import { StackManager } from '../StackSlot/StackManager';
const { ccclass, property } = _decorator;

let tempVelocity: Vec3 = v3();

@ccclass('Actor')
export class Actor extends Component {
    @property(Node)
    huochaiNode: Node = null;

    @property(Node)
    gongNode: Node = null;

    @property(Node)
    qianbiNode: Node = null;

    @property(SkeletalAnimation)
    skeletalAnimation: SkeletalAnimation | null = null;

    @property(CCFloat)
    linearSpeed: number = 1.0;

    @property(CCFloat)
    angularSpeed: number = 90;

    @property(Node)
    partnerCon: Node = null;

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

    destForward: Vec3 = v3();

    collider: Collider | null = null;
    rigidbody: RigidBody | null = null;

    currentState: StateDefine | string = StateDefine.Idle;

    uiproperty = null;

    // 指定地块
    private designatedPlotList = [PlotEnum.Plot6, PlotEnum.Plot7, PlotEnum.Plot8, PlotEnum.Plot9];
    private designatedPlotList2 = [PlotEnum.Plot2, PlotEnum.Plot3, PlotEnum.Plot4, PlotEnum.Plot5];

    private areaEffectNode = null;
    private isPlayerDesignatedPlot = false;
    private _txAttackInitialWorldRot: Quat = new Quat();
    private _txWalkAttackInitialWorldRot: Quat = new Quat();
    start() {
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

    private _promptAniTimer: number = 0;
    private _promptAniInterval: number = 5;

    update(deltaTime: number) {
        if (!this.isPlayerDesignatedPlot) {
            this._promptAniTimer += deltaTime;
            if (this._promptAniTimer >= this._promptAniInterval) {
                this._promptAniTimer = 0;
                this.plotPromptAni();
            }
        }

        // 普通地块规则
        this.ordinaryRulesFun();
        // 自动获取金币
        this.partnerDrops(deltaTime);

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

    // 普通地块规则
    ordinaryRulesFun() {
        const player = DataManager.Instance.player.node;
        if (!player) return;

        const getPlotRule = (plotEnum: PlotEnum) =>
            DataManager.Instance.ordinaryRules.find(rule => rule.colliderName === plotEnum);

        const activatePlot = (path: string) => {
            const plot = find(path);
            if (plot) {
                plot.active = true;
                plot.setScale(0, 1, 0);
                tween(plot)
                    .to(0.15, { scale: new Vec3(1.2, 1.2, 1.2) }, { easing: 'quadOut' })
                    .to(0.05, { scale: new Vec3(1, 1, 1) }, { easing: 'quadOut' })
                    .start();
            }
        };

        const getBackpackList = (): Node[] => [
            player.getChildByName("Backpack1"),
            player.getChildByName("Backpack2"),
            player.getChildByName("Backpack3")
        ].filter(Boolean) as Node[];

        const findMeatBackpack = (): Node | null => {
            for (const backpack of getBackpackList()) {
                for (const item of backpack.children) {
                    if (!item?.isValid) continue;
                    if (item.children.length > 0 && item.children[0].name === TypeItemEnum.Meat) {
                        return backpack;
                    }
                }
            }
            return null;
        };

        const hasItemTypeInBackpack = (type: TypeItemEnum): boolean => {
            for (const backpack of getBackpackList()) {
                for (const item of backpack.children) {
                    if (!item?.isValid) continue;
                    if (item.children.length > 0 && item.name === type) {
                        return true;
                    }
                }
            }
            return false;
        };

        // Plot2：金币背包检查
        const plot2Rule = getPlotRule(PlotEnum.Plot2);
        if (plot2Rule && !plot2Rule.isDisplay) {
            const coinBackpack = findMeatBackpack();
            if (coinBackpack && coinBackpack.children.length >= 8) {
                DataManager.Instance.guideTargetIndex = 1;
                plot2Rule.isDisplay = true;
                const path = "ThreeDNode/PlotCon/Plot2"
                activatePlot(path);
                const plot = find(path);
                this.updatePlotData("Plot2", plot);
            }
        }

        // Plot3 
        const plot3Rule = getPlotRule(PlotEnum.Plot3);
        if (plot3Rule && !plot3Rule.isDisplay) {
            const barbecueCon1 = find("ThreeDNode/PlacingCon/BarbecueCon1");
            if (barbecueCon1 && barbecueCon1.children.length > 0) {
                plot3Rule.isDisplay = true;
                const path = "ThreeDNode/PlotCon/Plot3"
                activatePlot(path);
                const plot = find(path);
                this.updatePlotData("Plot3", plot);
            }
        }
        // Plot4：也检查是否有 Roast
        const plot4Rule = getPlotRule(PlotEnum.Plot4);
        if (plot4Rule && !plot4Rule.isDisplay) {
            if (hasItemTypeInBackpack(TypeItemEnum.Roast)) {
                plot4Rule.isDisplay = true;
                const path = "ThreeDNode/PlotCon/Plot4";
                activatePlot(path);
                const plot = find(path);
                this.updatePlotData("Plot4", plot);
            }
        }

        const plot5Rule = getPlotRule(PlotEnum.Plot5);
        if (plot5Rule && !plot5Rule.isDisplay) {
            const coinCon = find("ThreeDNode/PlacingCon/CoinCon");
            if (coinCon && coinCon.children.length > 0) {
                plot5Rule.isDisplay = true;
                const path = "ThreeDNode/PlotCon/Plot5"
                activatePlot(path);
                const plot = find(path);
                this.updatePlotData("Plot5", plot);
            }
        }


        const plot8Rule = getPlotRule(PlotEnum.Plot8)
        if (plot8Rule && !plot8Rule.isDisplay) {
            if (hasItemTypeInBackpack(TypeItemEnum.GoldCoin) && plot8Rule.isShow) {
                plot8Rule.isDisplay = true;
                const path = "ThreeDNode/PlotCon/Plot8";
                activatePlot(path);
                const plot = find(path);
                this.updatePlotData("Plot8", plot, true);
            }
        }

        if (plot8Rule && plot8Rule.isDisplay && this._plot8TriggerStep === 0) {
            const plot = DataManager.Instance.guideTargetList.find(item => {
                return item.plotName == PlotEnum.Plot8
            })
            if (plot) {
                if (hasItemTypeInBackpack(TypeItemEnum.GoldCoin)) {
                    plot.isDisplay = true;
                    plot.isDisplayPath = true;
                } else {
                    plot.isDisplay = false;
                    plot.isDisplayPath = false;
                }
            }
        }
    }

    // 更新数据
    updatePlotData(plotName, plotNode, isShowPath = false) {
        for (let i = 0; i < DataManager.Instance.guideTargetList.length; i++) {
            DataManager.Instance.guideTargetList[i].isDisplay = false;
        }

        const plot = DataManager.Instance.guideTargetList.find(itme => {
            return itme.plotName == plotName
        })

        if (plot) {
            plot.node = plotNode;
            plot.isDisplay = true;

            if (isShowPath) {
                plot.isDisplayPath = true;
            }
        }
    }

    doMove() {
        let speed = this.linearSpeed * this.destForward.length() * 20;
        tempVelocity.x = math.clamp(this.node.forward.x, -1, 1) * speed;
        tempVelocity.z = math.clamp(this.node.forward.z, -1, 1) * speed;
        this.rigidbody?.setLinearVelocity(tempVelocity);
    }

    stopMove() {
        this.rigidbody?.setLinearVelocity(Vec3.ZERO);
    }

    changState(state: StateDefine | string) {
        if (state == this.currentState) {
            return;
        }

        if (this.currentState == StateDefine.Walk || this.currentState == StateDefine.Walk_attack) {
            this.stopMove();
        }

        // if (DataManager.Instance.playerAction) {
        this.skeletalAnimation?.crossFade(state as string, 0.1)
        this.currentState = state;
        // if (state == StateDefine.AttackP || state == StateDefine.Attack || state == StateDefine.WalkP || state == StateDefine.Walk_attack) {
        //     DataManager.Instance.playerAction = false;
        this.skeletalAnimation?.once(Animation.EventType.LASTFRAME, this.onAnimationFinished, this);
        // }
        // }
    }

    onAnimationFinished(event: AnimationEvent) {
        // console.log("动画已完成:", event);
        // 在此处处理动画完成后的逻辑
        DataManager.Instance.playerAction = true;
    }

    private stackOffsetY: number = 0.5;
    private deliverInterval: number = 0.2;

    // 状态标记
    private _isEnterArea = false;
    private deliverCooldown: number = 0.1;
    private _lastDeliverTime = 0;

    // 统一交付和收集中的“动画中”物体集合
    private _activeTransferringItems: Set<Node> = new Set();

    // 进入/离开/停留判定
    onTriggerEnter(event: ICollisionEvent) {
        const otherCollider = event.otherCollider;
        // this._isEnterArea = true;

        this.resetLandDiscoloration();

        const elementCon = otherCollider.node.getChildByName("ElementCon");
        if (otherCollider.node.name == PlotEnum.Plot1 && elementCon.active == false) {
            DataManager.Instance.hasPersonInPlot1 = true;
        }

        if (otherCollider.node.name == PlotEnum.Plot10) {
            DataManager.Instance.hasPersonInPlot10 = true;
        }

        if (otherCollider.node.name.includes("Door")) {
            const [scene, side] = otherCollider.node.name.split("_");

            const sceneMap = {
                Scene1: {
                    L: this.scene1LSide,
                    T: this.scene1TSide,
                    B: this.scene1BSide,
                    R: this.scene1RSide
                }
            };

            const doorGroup = sceneMap[scene]?.[side]?.getChildByName(`${side}_Door`);
            if (!doorGroup) {
                // console.warn(`[Door] ${scene}_${side} 未找到门节点`);
                return;
            }

            const doorL = doorGroup.getChildByName("Door_Left");
            const doorR = doorGroup.getChildByName("Door_Right");

            this.openDoorBySide(doorL, doorR, side);
        }

        // 是否进入地块4，下一个指向是地块1
        const plot4 = DataManager.Instance.guideTargetList.find(item => {
            return item.plotName == PlotEnum.Plot4;
        })

        if (plot4 && plot4.isDisplay && otherCollider.node.name == PlotEnum.Plot4) {
            const plot1 = DataManager.Instance.guideTargetList.find(item => {
                return item.plotName == PlotEnum.Plot1;
            })

            if (plot1 && plot1.isOnce) {
                plot1.isDisplay = true;
                plot1.isOnce = false;

                const plot1Node = find("ThreeDNode/PlotCon/Plot1");
                this.updatePlotData("Plot1", plot1Node);
            }
        }

        const targetData = DataManager.Instance.guideTargetList.find(item => {
            return item.isDisplay;
        })

        if (targetData && targetData.plotName == otherCollider.node.name && otherCollider.node.name != PlotEnum.Plot8) {
            targetData.isDisplay = false;
        }

        // 是否在指定地块上
        const designatedPlot = this.designatedPlotList.find(item => {
            return item == otherCollider.node.name;
        })

        if (designatedPlot) {
            this.isPlayerDesignatedPlot = true;

            this.stopPlotPromptAni();
            // 重置
            this.resetPlotPromptAni();
        }

        if (otherCollider.node.name == PlotEnum.Plot10) {
            DataManager.Instance.meatConManager.stopPlotPromptAni();
            DataManager.Instance.meatConManager.resetPlotPromptAni();
        }

    }

    onTriggerExit(event: ICollisionEvent) {
        const otherCollider = event.otherCollider;
        // this._isEnterArea = false;

        const elementCon = otherCollider.node.getChildByName("ElementCon");
        if (otherCollider.node.name == PlotEnum.Plot1 && elementCon.active == false) {
            DataManager.Instance.hasPersonInPlot1 = false;
        }

        if (otherCollider.node.name == PlotEnum.Plot10) {
            DataManager.Instance.hasPersonInPlot10 = false;
        }


        if (otherCollider.node.name == PlotEnum.Plot2 || otherCollider.node.name == PlotEnum.Plot3 ||
            otherCollider.node.name == "Scene1_L_Door" || otherCollider.node.name == "Scene1_L_Door_One") {
            if (this.areaEffectNode) {
                const renderer = this.areaEffectNode.getComponent(UIRenderer);
                if (renderer) {
                    renderer.color = new Color(255, 255, 255);
                }
            }
        } else {
            if (this.areaEffectNode) {
                const renderer = this.areaEffectNode.getComponent(UIRenderer);
                if (renderer) {
                    renderer.color = new Color(255, 255, 255);
                }
            }
        }

        if (otherCollider.node.name.includes("Door")) {
            const [scene, side] = otherCollider.node.name.split("_");

            const sceneMap = {
                Scene1: {
                    L: this.scene1LSide,
                    T: this.scene1TSide,
                    B: this.scene1BSide,
                    R: this.scene1RSide
                }
            };

            const doorGroup = sceneMap[scene]?.[side]?.getChildByName(`${side}_Door`);
            if (!doorGroup) {
                // console.warn(`[Door] ${scene}_${side} 未找到门节点`);
                return;
            }

            const doorL = doorGroup.getChildByName("Door_Left");
            const doorR = doorGroup.getChildByName("Door_Right");

            this.closeDoorBySide(doorL, doorR, side);
        }

        // 是否离开指定地块
        const designatedPlot = this.designatedPlotList.find(item => {
            return item == otherCollider.node.name;
        })

        if (designatedPlot) {
            this.isPlayerDesignatedPlot = false;
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
            // console.warn(`[Door] 未定义方向开门角度: ${side}`);
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
        // 开门
        DataManager.Instance.soundManager.openDoorSoundPlay();

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
            // console.warn(`[Door] 未定义方向开门角度: ${side}`);
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
        // if (!this._isEnterArea) return;

        const otherCollider = event.otherCollider;

        this._handleExecution(otherCollider);
    }

    // === 匹配规则执行 ===
    private _handleExecution(otherCollider: any) {
        if (otherCollider.node.name == PlotEnum.Plot1) {
            DataManager.Instance.hasPersonInPlot1 = true;

            this.landDiscoloration(otherCollider);
            return;
        }

        if (otherCollider.node.name == PlotEnum.Plot10) {
            DataManager.Instance.hasPersonInPlot10 = true;
        }

        const rule = DataManager.Instance.rules.find(item => item.colliderName === otherCollider.node.name);
        if (!rule) return;

        const { funType, placing, typeItem, colliderName, adjacentPlots, isChaneValue } = rule;

        if (colliderName == PlotEnum.Plot5) {
            for (let i = 0; i < adjacentPlots.length; i++) {
                const { plot, isUnlock } = adjacentPlots[i];
                if (!isUnlock) {
                    const plotNode = find(`ThreeDNode/PlotCon/${plot}`);
                    plotNode.active = true;

                    adjacentPlots[i].isUnlock = true;
                }
            }
        }

        const playerNode = DataManager.Instance.player.node;
        const backpacks: Node[] = [
            playerNode.getChildByName("Backpack1"),
            playerNode.getChildByName("Backpack2"),
            playerNode.getChildByName("Backpack3")
        ].filter(Boolean) as Node[];

        const targetCon = find(`ThreeDNode/PlacingCon/${placing}`);
        if (!targetCon) {
            // console.warn(`未找到目标容器 PlacingCon/${placing}`);
            return;
        }

        const obj = {
            isChaneValue: isChaneValue,
            otherCollider: otherCollider,
            // isPlot2ArrangePos: PlotEnum.Plot2 == otherCollider.node.name ? true : false,
            isPlot5ArrangePos: PlotEnum.Plot5 == otherCollider.node.name ? true : false,
            row: 4,
            col: 4
        }

        this.landDiscoloration(otherCollider);

        if (funType === FunTypeEnum.Deliver) {
            const sourceBackpack = this._findBackpackWithItem(backpacks, typeItem);
            if (sourceBackpack) {
                this.startDelivery(sourceBackpack, targetCon, obj);
            } else {
                // console.warn(`未找到包含 ${typeItem} 的背包用于交付`);
            }

        } else if (funType === FunTypeEnum.Collect) {                                   // 收集
            let targetBackpack = this._findBackpackWithItem(backpacks, typeItem);

            if (!targetBackpack) {
                targetBackpack = this._findEmptyBackpack(backpacks);
            }

            if (targetBackpack) {
                this.collectAni(targetCon, targetBackpack, obj);
            } else {
                // console.warn(`未找到可收集的目标背包（含${typeItem}或为空）`);
            }
        }
    }

    // 修改地块颜色
    landDiscoloration(otherCollider) {
        const landmark = otherCollider.node.getChildByName("Landmark");
        if (landmark) {
            const dashedBoxParent = landmark.getChildByName("DashedBoxParent");
            if (dashedBoxParent) {
                const dashedBox = dashedBoxParent.getChildByName("DashedBox");
                if (dashedBox) {
                    this.areaEffectNode = dashedBox;
                    const renderer = dashedBox.getComponent(UIRenderer);
                    if (renderer) {
                        renderer.color = new Color(61, 255, 0);
                    }
                }
            }
        }
    }

    resetLandDiscoloration() {
        const plotCon = find("ThreeDNode/PlotCon");
        if (!plotCon) return;

        for (let i = 0; i < plotCon.children.length; i++) {
            const plot = plotCon.children[i];

            const landmark = plot.getChildByName("Landmark");
            if (landmark) {
                const dashedBoxParent = landmark.getChildByName("DashedBoxParent");
                if (dashedBoxParent) {
                    const dashedBox = dashedBoxParent.getChildByName("DashedBox");
                    if (dashedBox) {
                        this.areaEffectNode = dashedBox;
                        const renderer = dashedBox.getComponent(UIRenderer);
                        if (renderer) {
                            renderer.color = new Color(255, 255, 255);
                        }
                    }
                }
            }
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

    private _findEmptyBackpack(backpacks: Node[]): Node | null {
        return backpacks.find(bag => bag.children.length === 0) || null;
    }

    startDelivery(from: Node, to: Node, obj) {
        const now = performance.now();
        if (now - this._lastDeliverTime < this.deliverCooldown * 1000) return;
        this._lastDeliverTime = now;

        this.playBezierTransfer(from, to, 'deliver', obj);
    }

    private collectAni(from: Node, to: Node, obj) {
        this.playBezierTransfer(from, to, 'collect', obj);
    }

    // === 贝塞尔转移动画 ===
    private _plot8TriggerStep = 0; // 初始状态
    private _reservedLabelMap: Map<Node, number> = new Map();

    private playBezierTransfer(from: Node, to: Node, mode: 'collect' | 'deliver', obj) {
        if (!from || !to) return;

        if (obj.isChaneValue) {
            const landmark = obj.otherCollider.node.getChildByName("Landmark");
            if (!landmark || !this.reserveValueIfPossible(landmark, 5)) {
                // console.warn("资源不足，跳过交付");
                return;
            }
        }

        const children = from.children;
        if (children.length === 0) return;

        const stackManager: StackManager = obj.isPlot5ArrangePos ? to["__stackManager"] : to["__stackManager"]; // to始终用于目标堆叠
        let item: Node | null = null;

        // Plot5：从 from 的堆叠管理器中取顶部 item 并释放槽位
        if (obj.isPlot5ArrangePos) {
            const fromStackManager: StackManager = from["__stackManager"];
            if (!fromStackManager) {
                // console.warn("from 没有 stackManager，无法取出");
                return;
            }

            const slots = fromStackManager.getAllOccupiedSlots?.() ?? [];
            for (let i = slots.length - 1; i >= 0; i--) {
                const slot = slots[i];
                const node = slot.assignedNode;
                if (node && node.isValid && node['__isReady'] === true) {
                    item = node;
                    fromStackManager.releaseSlot(node);
                    break;
                }
            }

            // for (let i = 0; i < slots.length; i++) {
            //     const slot = slots[i];
            //     const node = slot.assignedNode;
            //     if (node && node.isValid && node[`__isReady`] == true) {
            //         item = node;
            //     } else {
            //         break;
            //     }
            // }

            // if (item) {
            //     fromStackManager.releaseSlot(item)
            // }

            if (!item) {
                // console.warn("Plot5 没有可收集的 __isReady 物品");
                return;
            }
        } else {
            // 默认从 from.children 中取出未在动画中的节点
            for (let i = children.length - 1; i >= 0; i--) {
                const child = children[i];
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
        if (obj.isPlot2ArrangePos) {
            const slot = stackManager.assignSlot(item);
            if (!slot) {
                // console.warn("没有可用槽位");
                this._activeTransferringItems.delete(item);
                return;
            }
            endPos = stackManager.getSlotWorldPos(slot, to);
            // Plot5：收集物品，飞往 to 的堆顶
        } else if (obj.otherCollider.node.name == PlotEnum.Plot2) {
            endPos = to.worldPosition;
        } else if (obj.isPlot5ArrangePos) {
            endPos = this._getStackTopWorldPos(to, this.stackOffsetY);
        } else {
            // 默认：飞向堆顶
            endPos = this._getStackTopWorldPos(to, this.stackOffsetY);
        }

        const curvePeakY = Math.max(startPos.y, endPos.y) + 15;
        const controlPoint = new Vec3(
            (startPos.x + endPos.x) / 2,
            curvePeakY,
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
                    if (obj.isPlot2ArrangePos) {
                        const finalWorldPos = endPos;
                        item.setWorldPosition(finalWorldPos);
                        item.setParent(to);

                        const localPos = new Vec3();
                        to.inverseTransformPoint(localPos, finalWorldPos);
                        item.setPosition(localPos);

                        DataManager.Instance.uiPropertManager.meatDeliverProperty();
                    } else if (obj.otherCollider.node.name == PlotEnum.Plot2) {
                        const finalPos = to.worldPosition;
                        item.setWorldPosition(finalPos)
                        item?.removeFromParent();

                        // 增加交付逻辑
                        DataManager.Instance.meatConManager.meraItem?.addMeat();
                        DataManager.Instance.meatConManager._waitProductNum++;
                        DataManager.Instance.bubbleManager.playScaleOnce();

                        DataManager.Instance.uiPropertManager.meatDeliverProperty();
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

                    if (obj.isChaneValue) {
                        this.changeValueFun(item, obj)
                    }

                    // 根据 mode 播放不同的声音
                    if (mode == 'collect' && item.name == TypeItemEnum.Roast) {
                        DataManager.Instance.soundManager.grassPickUpSoundPlay();
                    } else if (mode == "deliver" && item.name == TypeItemEnum.Roast) {
                        DataManager.Instance.soundManager.grassPutSoundPlay();
                    } else if (mode == "deliver" && item.name == TypeItemEnum.Meat) {
                        DataManager.Instance.soundManager.meatDeliverSoundPlay();
                    } else if (item.name == "GoldCoin") {
                        DataManager.Instance.soundManager.coinDeliverSound();
                    }
                }
            })
            .start();
    }

    changeValueFun(item, obj) {
        if (item) item.removeFromParent();
        DataManager.Instance.coinManager.onProjectileDead(item);

        const landmark = obj.otherCollider.node.getChildByName("Landmark");
        if (landmark) {
            const newVal = this.finalizeReservedValue(landmark, 5);

            if (obj.otherCollider.node.name === PlotEnum.Plot6 && newVal === 0) {
                const plot1 = find("ThreeDNode/PlotCon/Plot1");
                const elementCon = plot1.getChildByName("ElementCon");
                if (elementCon) {
                    elementCon.active = true;
                    elementCon.setScale(1, 0, 1);

                    tween(elementCon)
                        .to(0.15, { scale: new Vec3(1, 1.1, 1) }, { easing: 'quadOut' })
                        .to(0.05, { scale: new Vec3(1, 1, 1) }, { easing: 'quadOut' })
                        .start();

                    DataManager.Instance.soundManager.summonSoldiersSound();
                    const level = elementCon.getChildByName("TX_shengjiLZ");
                    level.active = true;
                    const levelAni = level.getComponent(Animation);
                    if (levelAni) {
                        levelAni.play("TX_shengjiLZ");
                    }
                }
                DataManager.Instance.hasPersonInPlot1 = true;

                const plot7 = find("ThreeDNode/PlotCon/Plot7");
                if (plot7) {
                    plot7.active = true;
                    plot7.setScale(0, 1, 0);
                    tween(plot7)
                        .to(0.15, { scale: new Vec3(1, 1.1, 1) }, { easing: 'quadOut' })
                        .to(0.05, { scale: new Vec3(1, 1, 1) }, { easing: 'quadOut' })
                        .start();
                }

                const plot6 = find("ThreeDNode/PlotCon/Plot6");
                if (plot6) {
                    plot6.setScale(1, 1, 1);
                    tween(plot6)
                        .to(0.15, { scale: new Vec3(0, 0, 0) }, { easing: 'quadOut' })
                        .call(() => {
                            plot6.active = false;
                        })
                        .start();
                }
            } else if (obj.otherCollider.node.name === PlotEnum.Plot7 && newVal === 0) {
                const landmark = obj.otherCollider.node.getChildByName("Landmark");
                const numeratorNode = landmark?.getChildByName("Numerator");
                const numeratorLabel = numeratorNode?.getComponent(Label);
                if (!numeratorLabel) return;

                let currentVal = parseInt(numeratorLabel.string);
                if (isNaN(currentVal)) currentVal = 0;

                // 提前判断是否已满，不创建
                if (currentVal >= 5) return;

                // === 正常创建逻辑 ===
                const plot8 = find("ThreeDNode/PlotCon/Plot8");
                if (plot8 && !plot8.active) {
                    plot8.active = true;
                    plot8.setScale(0, 1, 0);
                    tween(plot8)
                        .to(0.15, { scale: new Vec3(1, 1.1, 1) }, { easing: 'quadOut' })
                        .to(0.05, { scale: new Vec3(1, 1, 1) }, { easing: 'quadOut' })
                        .start();

                    const plot = DataManager.Instance.ordinaryRules.find(item => {
                        return item.colliderName == PlotEnum.Plot8;
                    })
                    if (plot) {
                        plot.isShow = true;
                    }

                    // const plotData = DataManager.Instance.guideTargetList.find(item => {
                    //     return item.plotName == PlotEnum.Plot8
                    // })

                    // if (plotData) {
                    //     plotData.isDisplay = true;
                    // }
                }

                // 召唤士兵的声音
                DataManager.Instance.soundManager.summonSoldiersSound();
                const level = obj.otherCollider.node.getChildByName("TX_shengjiLZ");
                level.active = true;
                const levelAni = level.getComponent(Animation);
                if (levelAni) {
                    levelAni.play("TX_shengjiLZ");
                }

                const partner = DataManager.Instance.partnerConManager.create();
                const worldPos = obj.otherCollider.node.getWorldPosition();
                partner.setPosition(worldPos);
                if (partner && this.partnerCon) partner.setParent(this.partnerCon);

                this.scheduleOnce(() => {
                    if (currentVal >= 5) return;
                    const label = landmark.getChildByName("Label");
                    const labelCom = label.getComponent(Label);
                    if (labelCom.string) labelCom.string = `${20}`;
                }, 2)

                currentVal += 1;
                numeratorLabel.string = `${currentVal}`;

                const partnerComp = partner.getComponent(ItemPartnerManager);
                if (partnerComp) {
                    partnerComp.onKilledCallback = () => {
                        let val = parseInt(numeratorLabel.string);
                        if (isNaN(val)) val = 0;
                        val = Math.max(0, val - 1);
                        numeratorLabel.string = `${val}`;

                        const label = landmark.getChildByName("Label");
                        const labelCom = label.getComponent(Label);
                        if (labelCom.string) labelCom.string = `${20}`;
                    };
                }
            }
            else if (obj.otherCollider.node.name == PlotEnum.Plot8 && newVal === 0) {
                // 更新武器
                // const jack = this.node.getChildByName("jack");
                // const mianqian = jack.getChildByName("weapen_00mianqian");
                // const dingzi = jack.getChildByName("weapen_02dingzi");
                // const daopian = jack.getChildByName("weapen_03daopian");
                // const skin = jack.getChildByName("Bip001 R Hand Socket");

                if (this._plot8TriggerStep === 0) {
                    const targetData = DataManager.Instance.guideTargetList.find(item => {
                        return item.plotName == PlotEnum.Plot8;
                    })

                    if (targetData) {
                        targetData.isDisplay = false;
                    }

                    DataManager.Instance.soundManager.changeWeaponSound();

                    // 第一次进入
                    const plot9 = find("ThreeDNode/PlotCon/Plot9");
                    if (plot9 && !plot9.active) {
                        plot9.active = true;
                        plot9.setScale(0, 1, 0);
                        tween(plot9)
                            .to(0.15, { scale: new Vec3(1, 1.1, 1) }, { easing: 'quadOut' })
                            .to(0.05, { scale: new Vec3(1, 1, 1) }, { easing: 'quadOut' })
                            .start();
                    }

                    if (this.huochaiNode) this.huochaiNode.active = false;
                    if (this.qianbiNode) this.qianbiNode.active = true;

                    const landmark = obj.otherCollider.node.getChildByName("Landmark");
                    if (landmark) {
                        const tipIcon = landmark.getChildByName("TipIcon-001");
                        if (tipIcon) tipIcon.active = false;

                        const tipIcon01 = landmark.getChildByName("TipIcon-002");
                        if (tipIcon01) tipIcon01.active = true;

                        const labelNode = landmark.getChildByName("Label");
                        const labelCom = labelNode.getComponent(Label);
                        if (labelCom) labelCom.string = `${200}`

                        DataManager.Instance.soundManager.ConstructionSettlement();
                        const level = obj.otherCollider.node.getChildByName("TX_shengjiLZ");
                        level.active = true;
                        const levelAni = level.getComponent(Animation);
                        if (levelAni) {
                            levelAni.play("TX_shengjiLZ");
                        }
                    }
                    this._plot8TriggerStep = 1; // 标记为已执行第一阶段
                } else if (this._plot8TriggerStep === 1) {
                    DataManager.Instance.soundManager.ConstructionSettlement();
                    const level = obj.otherCollider.node.getChildByName("TX_shengjiLZ");
                    level.active = true;
                    const levelAni = level.getComponent(Animation);
                    if (levelAni) {
                        levelAni.play("TX_shengjiLZ");
                    }

                    // 第二次进入
                    if (this.qianbiNode) this.qianbiNode.active = false;
                    if (this.gongNode) this.gongNode.active = true;

                    this._plot8TriggerStep = 2; // 若不再需要触发可设置为终态

                    if (DataManager.Instance.isGameEnd) return;

                    // 执行过关逻辑
                    DataManager.Instance.isGameEnd = true;
                    DataManager.Instance.gameEndManager.init();
                }
            } else if (obj.otherCollider.node.name == PlotEnum.Plot9 && newVal === 0) {
                if (DataManager.Instance.isGameEnd) return;

                const elementCon = obj.otherCollider.node.getChildByName("ElementCon");
                if (!elementCon) return;

                elementCon.active = true;
                // elementCon.setScale(1, 0, 1);
                const elemenConAni = elementCon.getComponent(Animation);
                if (elemenConAni) {
                    elemenConAni.play("zhuoziCS");

                    this.scheduleOnce(() => {
                        DataManager.Instance.isGameEnd = true;
                        DataManager.Instance.gameEndManager.init();
                    }, 4)

                }
                // tween(elementCon)
                //     .to(0.15, { scale: new Vec3(1, 1.1, 1) }, { easing: 'quadOut' })
                //     .to(0.05, { scale: new Vec3(1, 1, 1) }, { easing: 'quadOut' })
                //     .delay(2)
                //     .call(() => {

                //     })
                //     .start();

                // 
                // 地图1 打开
                // const fencesScene1 = find("ThreeDNode/Map/Scene1");
                // const scene1RSide = fencesScene1.getChildByName("RSide");
                // scene1RSide.active = false;

                const scene1PhysicsRight = find("ThreeDNode/Map/Scene1Physics/Right");
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
                                    const plane2 = find("Dixing/Plane-002");
                                    if (plane2) {
                                        plane2.active = true;
                                        const palne02Ani = plane2.getComponent(Animation);
                                        if (palne02Ani) {
                                            palne02Ani.play("tudiCS")
                                        }
                                    }
                                }
                            })
                            .start();
                    }, i * 0.05); // 每个节点延迟0.05秒
                }

                DataManager.Instance.mainCamera.overGuide();
            }
        }
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

    // 伙伴掉落
    partnerDrops(dt: number) {
        const meatList = DataManager.Instance.meatManager.getAutoDrops();
        const meatCon = find("ThreeDNode/PlacingCon/MeatCon");
        if (!meatList || !meatCon) return;

        const stackManager = meatCon["__stackManager"];
        if (!stackManager) {
            // console.warn("meatCon 没有 stackManager");
            return;
        }

        const baseRot = meatCon.getWorldRotation();
        const basePos = meatCon.getWorldPosition();

        for (let i = 0; i < meatList.length; i++) {
            const item = meatList[i];
            if (!item || !item.isValid) continue;

            const startPos = item.getWorldPosition();
            item.setParent(this.node);

            const slot = stackManager.assignSlot(item);
            if (!slot) {
                // console.warn("没有可用槽位");
                this._activeTransferringItems.delete(item);
                continue;
            }

            const endPos = stackManager.getSlotWorldPos(slot, meatCon);
            const controlPoint = startPos.clone().lerp(endPos, 0.5).add3f(0, 15, 0);

            const tParam = { t: 0 };
            this._activeTransferringItems.add(item);

            tween(tParam)
                .to(0.3, { t: 1 }, {
                    onUpdate: () => {
                        const t = tParam.t;
                        const oneMinusT = 1 - t;

                        const pos = new Vec3(
                            oneMinusT * oneMinusT * startPos.x + 2 * oneMinusT * t * controlPoint.x + t * t * endPos.x,
                            oneMinusT * oneMinusT * startPos.y + 2 * oneMinusT * t * controlPoint.y + t * t * endPos.y,
                            oneMinusT * oneMinusT * startPos.z + 2 * oneMinusT * t * controlPoint.z + t * t * endPos.z
                        );

                        item.setWorldPosition(pos);
                    },
                    onComplete: () => {
                        const meatScaleNode = item.getChildByName("Meat");
                        if (meatScaleNode) {
                            meatScaleNode.setScale(3, 3, 3);
                        }

                        item.setWorldPosition(endPos);
                        item.setParent(meatCon);

                        const localPos = new Vec3();
                        meatCon.inverseTransformPoint(localPos, endPos);
                        item.setPosition(localPos);

                        this._activeTransferringItems.delete(item);
                    }
                })
                .start();
        }
    }

    // 重置plot动画
    resetPlotPromptAni() {
        if (this.isPlayerDesignatedPlot) {
            const list = [
                find("ThreeDNode/Plot6"),
                find("ThreeDNode/Plot7"),
                find("ThreeDNode/Plot8"),
                find("ThreeDNode/Plot9"),
            ]

            for (let i = 0; i < list.length; i++) {
                const plotNode = list[i];

                if (!plotNode) continue;

                const renderer = plotNode.getComponent(UIRenderer);
                if (renderer) renderer.color = new Color(255, 255, 255, 255);
            }
        }
    }

    private _plotTweenList: Tween<Node>[] = [];

    plotPromptAni() {
        const backpackLists = [
            DataManager.Instance.player.node.getChildByName("Backpack1"),
            DataManager.Instance.player.node.getChildByName("Backpack2"),
            DataManager.Instance.player.node.getChildByName("Backpack3"),
        ];

        const isCoinBackpack = backpackLists.find(item => {
            return item && item.children.length > 0 && item.children[0].name === "GoldCoin";
        });

        if (isCoinBackpack && !this.isPlayerDesignatedPlot) {
            const list = [
                find("ThreeDNode/PlotCon/Plot6"),
                find("ThreeDNode/PlotCon/Plot7"),
                find("ThreeDNode/PlotCon/Plot8"),
                find("ThreeDNode/PlotCon/Plot9")
            ];

            this._plotTweenList = []; // 清空之前的引用

            for (let i = 0; i < list.length; i++) {
                const plotNode = list[i];
                if (!plotNode) continue;
                const landmark = plotNode?.getChildByName("Landmark");
                const dashedBoxParent = landmark.getChildByName("DashedBoxParent");
                const dashedBox = dashedBoxParent?.getChildByName("DashedBox");

                const dashedBoxAni = dashedBox.getComponent(Animation);
                if (dashedBoxAni) {
                    dashedBoxAni.play("UI_dikuangTS");
                }

            }
        }
    }

    stopPlotPromptAni() {
        if (this._plotTweenList.length > 0) {
            for (let i = 0; i < this._plotTweenList.length; i++) {
                this._plotTweenList[i].stop();
            }
            this._plotTweenList = [];
        }

        // 可选：重置颜色和缩放
        const plotNames = ["Plot6", "Plot7", "Plot8", "Plot9"];
        for (const name of plotNames) {
            const node = find("ThreeDNode/PlotCon/" + name);
            const landmark = node?.getChildByName("Landmark");
            const dashedBoxParent = landmark.getChildByName("DashedBoxParent")
            const dashedBox = dashedBoxParent?.getChildByName("DashedBox");
            const renderer = dashedBox?.getComponent(UIRenderer);
            if (renderer) {
                renderer.color = new Color(255, 255, 255, 255);  // 重置颜色为白色
            }

            const dashedBoxAni = dashedBox.getComponent(Animation);
            if (dashedBoxAni) {
                dashedBoxAni.stop();
            }
            dashedBox.setScale(1, 1, 1);  // 重置缩放
        }
    }

}


