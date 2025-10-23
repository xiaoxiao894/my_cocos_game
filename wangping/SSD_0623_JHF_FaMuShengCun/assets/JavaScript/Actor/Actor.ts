import { _decorator, absMaxComponent, animation, Animation, AnimationClip, AnimationState, AsyncDelegate, BoxCollider, builtinResMgr, CCFloat, Collider, Color, Component, director, DynamicAtlasManager, EffectAsset, find, gfx, ICollisionEvent, instantiate, Label, Mat4, Material, math, MeshRenderer, Node, resources, RigidBody, SkeletalAnimation, Slider, Sprite, Texture2D, tween, UIOpacity, UIRenderer, v3, Vec3, Vec4, warnID } from 'cc';
import { MinionStateEnum, StateDefine } from './StateDefine';
import { MathUtil } from '../Util/MathUtil';
import { DataManager } from '../Global/DataManager';
import { AreaEnum, CollisionEntityEnum, EntityTypeEnum, FunTypeEnum, GamePlayNameEnum, PathEnum, PlotEnum, TypeItemEnum } from '../Enum/Index';
import { UIPropertyManager } from '../UI/UIPropertyManager';
import RVOObstacles from '../Global/RVOObstacles';
import { Simulator } from '../RVO/Simulator';
import { StackManager } from '../StackSlot/StackManager';
import GridPathController from './GridPathController';
import { SoundManager } from '../Common/SoundManager';
import { ItemElectricTowerManager } from '../ElectricTower/ItemElectricTowerManager';
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
    partnerCon: Node = null;

    @property(Texture2D)
    texture: Texture2D = null;

    // 升级动画
    @property(Node)
    powerPlant: Node = null;

    @property(SkeletalAnimation)
    conveyorAni: SkeletalAnimation = null;

    @property(Animation)
    logging: Animation = null;

    destForward: Vec3 = v3();

    collider: Collider | null = null;
    rigidbody: RigidBody | null = null;

    currentState: StateDefine | string = StateDefine.Idle;
    uiproperty = null;
    onceData = true;
    // 是否在获取兵器的区域
    isWeaponArea = false;

    // 是否正在交付
    private isDeliveryProgress = false;

    private areaEffectNode = null;

    private _plots = ["Plot0", "Plot9", "Plot3", "Plot2", "Plot4"]

    start() {
        this.rigidbody = this.node.getComponent(RigidBody);
        this.collider = this.node.getComponent(Collider);

        this.uiproperty = this.node.getChildByName("UIproperty");

        this.collider?.on("onTriggerEnter", this.onTriggerEnter, this);
        this.collider?.on("onTriggerStay", this.onTriggerStay, this);
        this.collider?.on("onTriggerExit", this.onTriggerExit, this);


    }

    update(deltaTime: number) {
        if (this.currentState == StateDefine.Die) {
            return;
        }

        // 始终执行朝向调整
        let a = MathUtil.signAngle(this.node.forward, this.destForward, Vec3.UP);
        let as = v3(0, a * 20, 0);
        this.rigidbody.setAngularVelocity(as);

        //  改成无条件执行移动（不依赖状态）
        this.doMove();

        //记录网格坐标
        GridPathController.instance.updatePath(this.node.worldPosition.clone());
    }

    doMove() {
        let speed = this.linearSpeed * this.destForward.length() * 15;
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
        if (state === StateDefine.Attack) {
            this.skeletalAnimation?.crossFade(clipName, 0.1);
            this.currentState = state;
            return;
        }

        // 允许 Walk/WALK_ATTACK 状态重复切换播放动画
        if (state === this.currentState) {
            if (aniState && !aniState.isPlaying) {
                this.skeletalAnimation?.play(clipName);
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
            // console.warn(`未找到动画状态：${clipName}`);
        }

        this.currentState = state;
    }

    private stackOffsetY: number = 0.5;
    private _isEnterArea = false;
    private _deliverCooldown: number = 0.1;
    private _lastDeliverTime = 0;
    private _activeTransferringItems: Set<Node> = new Set();

    private _curPlots = [];
    // 进入
    onTriggerEnter(event: ICollisionEvent) {
        this.isDeliveryProgress = true;
        this.resetLandDiscoloration();

        const otherCollider = event.otherCollider;
        // this._isEnterArea = true;

        this._curPlots.push(otherCollider.node.name);

        if (otherCollider && otherCollider.node.name == PlotEnum.Plot7) {
            DataManager.Instance.isGetCoins = true;

            DataManager.Instance.arrowTargetNode._unlockHelper = false;
        }

        // 地块颜色
        this.landDiscoloration(otherCollider);
    }

    onTriggerStay(event: ICollisionEvent) {
        // if (!this._isEnterArea) return;

        const otherCollider = event.otherCollider;
        this._handleExecution(otherCollider);
    }

    // 离开
    onTriggerExit(event: ICollisionEvent) {
        const otherCollider = event.otherCollider;
        // this._isEnterArea = false;
        this.isDeliveryProgress = false;

        if (otherCollider && otherCollider.node.name == PlotEnum.Plot7) {
            DataManager.Instance.isGetCoins = false;
        }

        const plotIndex = this._curPlots.findIndex(item => {
            return item == otherCollider.node.name;
        })

        if (plotIndex >= 0) {
            this._curPlots.splice(plotIndex, 1);
        }

        this.resetLandDiscoloration();
        this.isEnterPromptArea(otherCollider);

        const landmark = otherCollider.node.getChildByName("Landmark");
        if (landmark) {
            this.scheduleOnce(() => {
                this.stopBreathingAni(landmark);
            })
        }
    }


    isEnterPromptArea(otherCollider) {
        const guideTarget = DataManager.Instance.guideTargetList.find(item => {
            return item.isDisplay;
        })

        if (guideTarget && guideTarget.plot == otherCollider.node.name) {
            DataManager.Instance.isEnterPromptArea = true;
        } else if (otherCollider.name == PlotEnum.Plot7) {
            DataManager.Instance.isEnterPromptArea = true;
        }
    }

    // 执行处理函数
    private _handleExecution(otherCollider: any) {
        const rule = DataManager.Instance.rules.find(item => item.colliderName == otherCollider.node.name);
        if (!rule) return;

        const { placing, funType, typeItem, isChangValue } = rule;

        // 检查背包
        const playerNode = this.node;
        const backpack1 = playerNode.getChildByName("Backpack1");
        const backpack2 = playerNode.getChildByName("Backpack2");
        const backpack3 = playerNode.getChildByName("Backpack3");

        const backpacks: Node[] = [backpack1, backpack2, backpack3].filter(Boolean) as Node[];

        const targetPath = `THREE3DNODE/PlacingCon/${placing}`;
        const targetCon = find(targetPath);
        if (!targetCon) {
            // console.log(`未找到目标容器 PlacingcCon/${placing}`);
            if (this.isDeliveryProgress == false) {
                const landmark = otherCollider.node.getChildByName("Landmark");

                if (landmark) {
                    this.stopBreathingAni(landmark);
                    // this.labelStopBreathingAni(landmark);
                }
            }

            return;
        }

        const obj = {
            isChangValue: isChangValue,
            otherCollider: otherCollider,
            isPlot1ArrangePos: PlotEnum.Plot1 == otherCollider.node.name ? true : false,
            isPlot7ArrangePos: PlotEnum.Plot7 == otherCollider.node.name ? true : false,
        }

        if (funType == FunTypeEnum.Deliver) {               // 交付
            let sourceBackpack = this._findBackpackWithItem(backpacks, typeItem);
            if (sourceBackpack) {
                this.startDelivery(sourceBackpack, targetCon, obj);
            } else {
                if (this.isDeliveryProgress == false) {
                    const landmark = otherCollider.node.getChildByName("Landmark");

                    if (landmark) {
                        this.scheduleOnce(() => {
                            this.stopBreathingAni(landmark);
                            // this.labelStopBreathingAni(landmark);
                        }, 0.2)
                    }
                }
                // console.warn(`未找到包含 ${typeItem} 的背包用于交付`);
            }
        } else if (funType == FunTypeEnum.Collect) {        // 收集
            let targetBackpack = this._findBackpackWithItem(backpacks, typeItem);

            if (!targetBackpack) {
                targetBackpack = this._findEmptyBackpack(backpacks);
            }

            if (targetBackpack) {
                this.collectAni(targetCon, targetBackpack, obj);
            } else {
                if (this.isDeliveryProgress == false) {
                    const landmark = otherCollider.node.getChildByName("Landmark");

                    if (landmark) {
                        this.stopBreathingAni(landmark);
                        // this.labelStopBreathingAni(landmark);
                    }
                }
                // console.warn(`未找到可收集的目标背包（含${typeItem}或为空）`);
            }
        }
    }

    // 查找背包物品
    private _findBackpackWithItem(backpacks: Node[], typeItem: string): Node | null {
        for (const bag of backpacks) {
            if (bag.children.some(child => child.name.includes(typeItem))) {
                return bag;
            }
        }
        return null;
    }

    // 查找空背包
    private _findEmptyBackpack(backpacks: Node[]): Node | null {
        return backpacks.find(bag => bag.children.length === 0) || null;
    }

    startDelivery(from: Node, to: Node, obj) {
        const now = performance.now();

        // if (now - this._lastDeliverTime < this._deliverCooldown * 1000) return;
        this._lastDeliverTime = now;

        this.playBezierTransfer(from, to, 'deliver', obj);
    }

    private collectAni(from: Node, to: Node, obj) {
        this.playBezierTransfer(from, to, 'collect', obj);
    }

    // === 贝塞尔转移动画 ===
    private _reservedLabelMap: Map<Node, number> = new Map();

    private playBezierTransfer(from: Node, to: Node, mode: 'collect' | 'deliver', obj) {
        if (!from || !to) return;

        if (obj.isChangValue) {
            const landmark = obj.otherCollider.node.getChildByName("Landmark");
            if (!landmark || !this.reserveValueIfPossible(landmark, 1)) {
                // console.warn("资源不足，跳过交付");
                return;
            }
        }

        const children = from.children;
        if (children.length === 0) return;

        const stackManager: StackManager = obj.isPlot1ArrangePos ? to["__stackManager"] : to["__stackManager"]; // to始终用于目标堆叠
        let item: Node | null = null;
        // Plot5：从 from 的堆叠管理器中取顶部 item 并释放槽位
        if (obj.isPlot7ArrangePos) {
            const fromStackManager: StackManager = from["__stackManager"];
            if (!fromStackManager) {
                // console.warn("from 没有 stackManager，无法取出");
                return;
            }

            const slots = fromStackManager.getAllOccupiedSlots?.() ?? [];
            for (let i = slots.length - 1; i >= 0; i--) {
                const slot = slots[i];
                const node = slot.assignedNode;
                if (node && node.isValid && node['__fallingTarget'] === true) {
                    item = node;
                    fromStackManager.releaseSlot(node);
                    break;
                }
            }
            if (!item) {
                // console.warn("Plot5 没有可收集的 __isReady 物品");
                return;
            }
        } else {
            for (let i = children.length - 1; i >= 0; i--) {
                const child = children[i];
                if (child['__isReady'] === true) {
                    item = child;
                    break;
                }
            }
        }

        if (!item?.isValid) return;
        if (mode == "deliver" && item.name == "Coin") {
            SoundManager.inst.playAudio("YX_jinbi_jiaofu");
        } else if (mode == "deliver" && item.name == "Wood") {
            SoundManager.inst.playAudio("Sounds_jiaofu_mutou");
        }
        this._activeTransferringItems.add(item);

        const startPos = item.getWorldPosition();
        item.parent = this.node;
        item.setWorldPosition(startPos);

        let endPos: Vec3 | null = null;

        if (obj.isPlot1ArrangePos) {
            const slot = stackManager.assignSlot(item);
            if (!slot) {
                this._activeTransferringItems.delete(item);
                return;
            }
            endPos = stackManager.getSlotWorldPos(slot, to);
        } else {
            endPos = this._getStackTopWorldPos(to, this.stackOffsetY);
        }

        const curvePeakY = Math.max(startPos.y, endPos.y) + 8;
        const curvePeakYOffset = Math.abs(startPos.y - endPos.y);
        let controlPoint
        if (curvePeakYOffset <= 2 && mode == "deliver" && item.name == "Coin") {
            controlPoint = new Vec3(
                (startPos.x + endPos.x) / 2,
                curvePeakY,
                (startPos.z + endPos.z) / 2 + 2
            );
        } else {
            controlPoint = new Vec3(
                (startPos.x + endPos.x) / 2,
                curvePeakY,
                (startPos.z + endPos.z) / 2
            );
        }

        if (this.isDeliveryProgress && obj.isChangValue) {
            this.isDeliveryProgress = false;
            const landmark = obj.otherCollider.node.getChildByName("Landmark");
            const landmarkAni = landmark.getComponent(Animation);
            if (landmarkAni) {
                landmarkAni.play("UI_jiaofu");
            }
        }

        const tParam = { t: 0 };

        let distance = Math.abs(startPos.y - endPos.y);
        // 使用指数衰减函数，提升高处下落速度
        let runTime = 1.2 * (1 - Math.exp(-distance / 50));
        // 限定时间边界
        runTime = Math.min(Math.max(runTime, 0.3), 1.0);
        tween(tParam)
            .to(runTime, { t: 1 }, {
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
                    if (item.name == TypeItemEnum.Wood) {
                        item.eulerAngles = new Vec3(-90, 0, 0);

                        if (DataManager.Instance.onlyGuidanceOnce) {
                            DataManager.Instance.onlyGuidanceOnce = false;
                            DataManager.Instance.mainCamera.woodGuidance();
                        }
                    } else {
                        item.eulerAngles = new Vec3(0, 0, 0);
                    }

                    if (obj.isPlot7ArrangePos) {
                        if (DataManager.Instance.UIPropertyManager) {
                            DataManager.Instance.UIPropertyManager.collectProperty();
                            SoundManager.inst.playAudio("YX_jinbi_shiqu");
                        }
                    }

                    // 物理组件禁用
                    const rigidBody = item.getComponent(RigidBody);
                    if (rigidBody) {
                        rigidBody.enabled = false;
                    }

                    // 禁用碰撞器
                    const collider = item.getComponent(Collider);
                    if (collider) {
                        collider.enabled = false;
                    }

                    tween(item)
                        .to(0.15, { scale: new Vec3(1.2, 1.2, 1.2) }, { easing: 'quadOut' })
                        .to(0.05, { scale: new Vec3(1, 1, 1) }, { easing: 'quadOut' })
                        .start();


                    // 处理物体的位置
                    if (obj.isPlot1ArrangePos) {
                        const finalWorldPos = endPos;
                        item.setWorldPosition(finalWorldPos);
                        item.setParent(to);

                        const localPos = new Vec3();
                        to.inverseTransformPoint(localPos, finalWorldPos);
                        item.setPosition(localPos);
                    } else {
                        let finalPos = null;
                        if (item.name == "Coin") {
                            finalPos = this._getStackTopWorldPos(to, 0.3);
                        } else {
                            finalPos = this._getStackTopWorldPos(to, this.stackOffsetY);
                        }
                        item.setWorldPosition(finalPos);
                        item.setParent(to);

                        const localPos = new Vec3();
                        to.inverseTransformPoint(localPos, finalPos);
                        item.setPosition(localPos);
                    }
                    this._activeTransferringItems.delete(item);

                    if (obj.isChangValue) {
                        this.changeValueFun(item, obj)

                        if (mode == "deliver") {
                            DataManager.Instance.UIPropertyManager.deliverProperty();

                            const landmark = obj.otherCollider.node.getChildByName("Landmark");
                            const label = landmark.getChildByName("Label");
                            const progress = landmark.getChildByName("jindu");
                            const data = DataManager.Instance.guideTargetList.find(item => {
                                return item.plot == obj.otherCollider.node.name;
                            })

                            if (data) {
                                const labelStr = label.getComponent(Label).string;
                                data.coinNum = labelStr;

                                const progressSprite = progress.getComponent(Sprite)
                                if (progressSprite) {
                                    progressSprite.fillRange = (data.initCoinNum - data.coinNum) / data.initCoinNum
                                }
                            }
                        }
                    }
                }
            })
            .start();
    }

    /**
     * plot2, 3, 4， 9
     * 
     * plot5 升级
     * 
     * plot6 传送
     */

    changeValueFun(item, obj) {
        item.removeFromParent();
        item.destroy();
        // DataManager.Instance.coinManager.onProjectileDead(item);

        // ================== 主处理 ==================
        const landmark = obj.otherCollider.node.getChildByName("Landmark");
        if (!landmark) return;

        const newVal = this.finalizeReservedValue(landmark, 1);
        if (newVal === 0 && this.isDeliveryProgress === false) {
            this.stopBreathingAni(landmark);
        }

        const otherColliderNode = obj.otherCollider.node;
        if (newVal !== 0) return; // 只有清零才触发后续逻辑

        switch (otherColliderNode.name) {
            case PlotEnum.Plot8: {
                // 解锁人物 + 解锁电塔两个地块 + 弹提示/特效
                DataManager.Instance.isUnlockHelper = true;
                this.cancelPhysics(otherColliderNode);
                this.shrinkHideLandmark(landmark, () => {
                    landmark.active = false;
                    this.unlockHelper(obj);
                    this.unlockPlot3AndPlot9();
                    this.setGuideDisplay(PlotEnum.Plot8, false, true);
                    this.playLevelUpOnce(otherColliderNode, "TX_shengjiLZ");
                });
                break;
            }

            case PlotEnum.Plot3:
            case PlotEnum.Plot9: {
                this.cancelPhysics(otherColliderNode);
                this.shrinkHideLandmark(landmark, () => {
                    this.scheduleOnce(() => this.plotLevelUpEffect(otherColliderNode), 0.2);
                    this.setGuideDisplay(otherColliderNode.name, false, true);
                    landmark.active = false;

                    this.activateElementCon(otherColliderNode, (dtNode: Node) => {
                        // 完成电线动画与DT弹起后，更新状态/解锁逻辑（两者一致）
                        DataManager.Instance.curReduceTemplateTimeIndex++;
                        DataManager.Instance.unlockPowerTowersNum++;
                        this.unlockTriggerConditions();
                        this.enablePhysics(dtNode);

                        const itemElectricTowerManager = dtNode?.parent?.parent.getComponent(ItemElectricTowerManager);
                        if (itemElectricTowerManager) {
                            itemElectricTowerManager.isNew = true;
                        }

                        if (otherColliderNode.name === PlotEnum.Plot3) {
                            // 激活Plot4并出现Landmark引导
                            const plot4 = find("THREE3DNODE/Unlock/Plot4");
                            if (plot4) {
                                plot4.active = true;
                                const lm = plot4.getChildByName("Landmark");
                                this.popShowLandmark(lm, PlotEnum.Plot4, true);
                            }
                        } else {
                            // name === PlotEnum.Plot9，激活Plot2并开物理+Landmark引导
                            const plot2 = find("THREE3DNODE/Unlock/Plot2");
                            if (plot2) {
                                plot2.active = true;
                                this.enablePhysics(plot2);
                                const lm = plot2.getChildByName("Landmark");
                                this.popShowLandmark(lm, PlotEnum.Plot2, true);
                            }
                        }
                    });
                });
                break;
            }

            case PlotEnum.Plot4:
            case PlotEnum.Plot2: {
                this.cancelPhysics(otherColliderNode);
                this.shrinkHideLandmark(landmark, () => {
                    this.scheduleOnce(() => this.plotLevelUpEffect(otherColliderNode), 0.2);
                    this.setGuideDisplay(otherColliderNode.name, false, true);
                    landmark.active = false;

                    this.activateElementCon(otherColliderNode, (dtNode: Node) => {
                        this.enablePhysics(dtNode);
                        const itemElectricTowerManager = dtNode?.parent?.parent.getComponent(ItemElectricTowerManager);
                        if (itemElectricTowerManager) {
                            itemElectricTowerManager.isNew = true;
                        }

                        DataManager.Instance.curReduceTemplateTimeIndex++;
                        DataManager.Instance.unlockPowerTowersNum++;
                        this.unlockTriggerConditions();
                    });
                });
                break;
            }

            case PlotEnum.Plot5: {
                // 升级建筑
                this.shrinkHideLandmark(landmark, () => {
                    this.setGuideDisplay(PlotEnum.Plot5, false, true);
                    landmark.active = false;

                    DataManager.Instance.boardManager.denominatorUpgradeAni(30, 80, 0.03);

                    // 三阶段展示 + 动画
                    const thirdShow: Node = this.powerPlant.getChildByName("thirdShow");
                    if (thirdShow) thirdShow.active = true;

                    const plantAni = this.powerPlant.getComponent(Animation);
                    plantAni?.play("shengji02");

                    // 火焰动画与升级特效
                    const fire = this.powerPlant.getChildByName("TX_huoyan-001");
                    if (fire) {
                        fire.active = true;
                        const fireAni = fire.getComponent(Animation);
                        const fireState = fireAni?.getState("TX_huoyan");
                        if (fireState) {
                            fireState.speed = 0.35;
                            fireState.play();
                        }
                    }
                    this.playLevelUpOnce(this.powerPlant, "TX_shengji");
                    this.playLevelUpOnce(this.powerPlant, "TX_shengjiLZ");

                    this.scheduleOnce(() => {
                        const unlock = find("THREE3DNODE/Unlock");

                        for (let i = 0; i < this._plots.length; i++) {
                            const str = this._plots[i];

                            this.scheduleOnce(() => {
                                const plot = unlock.children.find(item => {
                                    return item.name == str;
                                })

                                if (plot) {
                                    const elementCon = plot.getChildByName("ElementCon");
                                    if (elementCon) {

                                        const node = elementCon.getChildByName("Node");
                                        if (node) {
                                            const dtani = node.getChildByName("DTani");
                                            if (dtani) {
                                                const dtaniAni = dtani.getComponent(Animation);
                                                if (dtaniAni) dtaniAni.play("levelDT");

                                                const shengji = dtani.getChildByName("TX_shengji_02");
                                                if (shengji) {
                                                    shengji.active = true;
                                                }

                                                SoundManager.inst.playAudio("YX_huoban");
                                            }
                                        };

                                        // const itemElectricTowerManager = elementCon.getComponent(ItemElectricTowerManager);
                                        // if (itemElectricTowerManager) {
                                        //     itemElectricTowerManager.isNew = true;
                                        // }

                                        // 升级之后的电塔攻击距离
                                        DataManager.Instance.electricTowerAttackRange = 22.5;
                                    }
                                }
                            }, i * 0.1)
                        }

                        // this.scheduleOnce(() => {
                        for (let i = 0; i < this._plots.length; i++) {
                            const str = this._plots[i];
                            const plot = unlock.children.find(item => {
                                return item.name == str;
                            })

                            if (plot) {
                                const elementCon = plot.getChildByName("ElementCon");
                                if (elementCon) {
                                    const itemElectricTowerManager = elementCon.getComponent(ItemElectricTowerManager);
                                    if (itemElectricTowerManager) {
                                        itemElectricTowerManager.isNew = true;
                                    }
                                }
                            }
                        }
                        // }, 1)
                    }, 0.6)

                    if (DataManager.Instance.mainCamera) DataManager.Instance.mainCamera.overGuide();

                    // 结束游戏
                    if (!DataManager.Instance.isGameEnd) {
                        this.scheduleOnce(() => {
                            DataManager.Instance.isGameEnd = true;
                            DataManager.Instance.gameEndManager.init();
                        }, 2);
                    }
                    SoundManager.inst.playAudio("YX_weiqiangSC");
                });
                break;
            }

            case PlotEnum.Plot6: {
                // 升级传送带
                SoundManager.inst.playAudio("YX_weiqiangSC");
                this.shrinkHideLandmark(landmark, () => {
                    this.setGuideDisplay(PlotEnum.Plot6, false, true);
                    landmark.active = false;

                    // 提速
                    const aniState = this.conveyorAni.getState("Take 001");
                    if (aniState) aniState.speed = 2;
                    const loggingState = this.logging.getState("chilun");
                    if (loggingState) loggingState.speed = 2;

                    DataManager.Instance.conveyorLevel = 2;
                    this.plotLevelUpEffect(this.conveyorAni.node.parent, "TX_shengji");

                    DataManager.Instance.isConveyerBeltUpgrade = true;

                    // 切换皮带显示
                    const workflow = find("THREE3DNODE/Workflow");
                    const beltNode = workflow?.getChildByName("chuansongdai");
                    beltNode?.getChildByName("polySurface42") && (beltNode.getChildByName("polySurface42").active = false);
                    beltNode?.getChildByName("polySurface43") && (beltNode.getChildByName("polySurface43").active = true);

                    const workflowAni = workflow?.getComponent(Animation);
                    workflowAni?.play("chuansongSJ");
                });
                break;
            }

            default:
                break;
        }
    }

    /** Landmark 收缩隐藏后回调 */
    private shrinkHideLandmark(landmark: Node, done: () => void) {
        tween(landmark)
            .to(0.15, { scale: new Vec3(0, 0, 0) }, { easing: 'quadOut' })
            .call(done)
            .start();
    }

    /** 设置引导列表的显示状态，并可选地标记进入提示区域 */
    private setGuideDisplay(plot: string, isDisplay: boolean, enterPrompt = false) {
        const data = DataManager.Instance.guideTargetList.find(it => it.plot === plot);
        if (data) data.isDisplay = isDisplay;
        if (enterPrompt) DataManager.Instance.isEnterPromptArea = true;
    }

    /** 激活 ElementCon + 播放电线动画 + 弹起DT，完成后回调返还 DT 节点 */
    private activateElementCon(parentPlot: Node, onDtReady: (dtNode: Node) => void) {
        const elementCon = parentPlot.getChildByName("ElementCon");
        if (!elementCon) return;

        elementCon.active = true;
        elementCon.setScale(1, 1, 1);

        const node = elementCon.getChildByName("Node");
        const wireCon = node?.getChildByName("WireCon");
        if (!wireCon) return;

        wireCon.active = true;

        const dianxian = wireCon.getChildByName("dianxian");
        const dianxianAni = dianxian?.getComponent(Animation);
        dianxianAni?.play("dianxianCS");
        dianxianAni?.once(Animation.EventType.FINISHED, () => {
            SoundManager.inst.playAudio("YX_huoban");
            const dt = node.getChildByName("DTani");
            if (!dt) return;

            dt.active = true;
            dt.setScale(1, 0, 1);

            tween(dt)
                .to(0.15, { scale: new Vec3(1, 1.2, 1) }, { easing: 'quadOut' })
                .to(0.05, { scale: new Vec3(1, 1, 1) }, { easing: 'quadOut' })
                .call(() => onDtReady(dt))
                .start();
        }, this);
    }

    /** 一键开刚体/碰撞体*/
    private enablePhysics(node: Node) {
        const col = node.getComponent(Collider);
        if (col) col.enabled = true;
        const rb = node.getComponent(RigidBody);
        if (rb) rb.enabled = true;
    }

    /** 播放一次性升级特效 */
    private playLevelUpOnce(host: Node, childName: string) {
        const fx = host.getChildByName(childName);
        if (!fx) return;
        fx.active = true;
        const ani = fx.getComponent(Animation);
        ani?.play();
        ani?.once(Animation.EventType.FINISHED, () => (fx.active = false), this);
    }

    /** 弹出显示 Landmark（并更新引导显示） */
    private popShowLandmark(landmark: Node, plot: string, guideDisplay: boolean) {
        if (!landmark) return;
        landmark.active = true;
        landmark.setScale(0, 0, 0);
        tween(landmark)
            .to(0.15, { scale: new Vec3(1.2, 1.2, 1.2) }, { easing: 'quadOut' })
            .to(0.05, { scale: new Vec3(1, 1, 1) }, { easing: 'quadOut' })
            .call(() => {
                this.setGuideDisplay(plot, guideDisplay, true);
            })
            .start();
    }

    // 解锁5 or 6
    unlockPlot5OrPlot6(plots) {
        for (let i = 0; i < plots.length; i++) {
            const plotName = plots[i];
            const plot = find(`THREE3DNODE/Unlock/${plotName}`);
            if (plot) {
                plot.active = true;

                const landmark = plot.getChildByName("Landmark");
                landmark.active = true;
                landmark.setScale(0, 0, 0);
                tween(landmark)
                    .to(0.15, { scale: new Vec3(1.2, 1.2, 1.2) }, { easing: 'quadOut' })
                    .to(0.05, { scale: new Vec3(1, 1, 1) }, { easing: 'quadOut' })
                    .call(() => {
                        if (plotName == PlotEnum.Plot6) {
                            const data = DataManager.Instance.guideTargetList.find(item => {
                                return item.plot == PlotEnum.Plot6;
                            })

                            if (data) {
                                data.isDisplay = true;
                                DataManager.Instance.isEnterPromptArea = true;
                            }
                        } else if (plotName == PlotEnum.Plot5) {
                            const data = DataManager.Instance.guideTargetList.find(item => {
                                return item.plot == PlotEnum.Plot5;
                            })

                            if (data) {
                                data.isDisplay = true;
                                DataManager.Instance.isEnterPromptArea = true;
                            }
                        }
                    })
                    .start();
            }
        }
    }

    // 解锁触发条件
    unlockTriggerConditions() {
        switch (DataManager.Instance.unlockPowerTowersNum) {
            case 2:
                {
                    DataManager.Instance.bulletAttackTimeInterval = DataManager.Instance.sceneManager.towerAttackInterval[1] ?? 1;
                    DataManager.Instance.monsterNum = 25;
                }
                break;
            case 3:
                {
                    const plots = [PlotEnum.Plot6];                         // 解锁传送带地块
                    this.unlockPlot5OrPlot6(plots);

                    DataManager.Instance.bornTimeLimit = 0.3;
                    DataManager.Instance.bulletAttackTimeInterval = DataManager.Instance.sceneManager.towerAttackInterval[2] ?? 0.9;
                    DataManager.Instance.monsterNum = 30;

                }
                break;
            case 4: {
                {
                    DataManager.Instance.bulletAttackTimeInterval = DataManager.Instance.sceneManager.towerAttackInterval[3] ?? 0.8;
                }
                break;
            }
            case 5:
                {
                    const plots = [PlotEnum.Plot5];
                    this.unlockPlot5OrPlot6(plots);
                    DataManager.Instance.bornTimeLimit = 0.2;
                    DataManager.Instance.bulletAttackTimeInterval = DataManager.Instance.sceneManager.towerAttackInterval[4] ?? 0.7;
                }
                break;
            default:
                break;
        }
    }

    // 金币停止呼吸动画
    stopBreathingAni(landmark: Node) {
        const coinAni = landmark.getComponent(Animation);
        if (!coinAni) return;
        const clipName = "UI_jiaofu";
        let state = coinAni.getState(clipName);

        // 如果还没创建 state，则手动创建
        if (!state) {
            const clip = coinAni.clips?.find(c => c && c.name === clipName);
            if (!clip) return;
            state = coinAni.createState(clip, clipName);
        }

        // 强制跳到第 0 秒并采样
        state.time = 0;
        state.sample();
        state.stop();
    }

    // 解锁plot3 和 plot9的两个地块
    unlockPlot3AndPlot9() {
        const plots = [PlotEnum.Plot3, PlotEnum.Plot9];

        for (let i = 0; i < plots.length; i++) {
            const plotName = plots[i];
            const plot = find(`THREE3DNODE/Unlock/${plotName}`);
            if (plot) {
                plot.active = true;

                const plotBoxCollider = plot.getComponent(Collider);
                if (plotBoxCollider) {
                    plotBoxCollider.enabled = true;
                }

                const plotRightbody = plot.getComponent(RigidBody);
                if (plotRightbody) {
                    plotRightbody.enabled = true;
                }

                const landmark = plot.getChildByName("Landmark");
                landmark.active = true;
                landmark.setScale(0, 0, 0);
                tween(landmark)
                    .to(0.15, { scale: new Vec3(1.2, 1.2, 1.2) }, { easing: 'quadOut' })
                    .to(0.05, { scale: new Vec3(1, 1, 1) }, { easing: 'quadOut' })
                    .call(() => {
                        const data = DataManager.Instance.guideTargetList.find(item => {
                            return item.plot == plotName;
                        })

                        if (data) {
                            data.isDisplay = true;
                            DataManager.Instance.isEnterPromptArea = true;
                        }
                    })
                    .start();
            }
        }
    }

    /**
     * 地块升级效果
     * @param node 地块节点
     */
    private plotLevelUpEffect(node: Node, name = "TX_shengjiLZ") {
        let levelUpNode: Node = node.getChildByName(name);
        if (levelUpNode) {
            levelUpNode.active = true;
            levelUpNode.getComponent(Animation).play();
            levelUpNode.getComponent(Animation).on(Animation.EventType.FINISHED, () => {
                levelUpNode.active = false;
            }, this);
        }
    }

    // 取消武器
    cancelPhysics(otherColliderNode) {
        const collider = otherColliderNode.getComponent(Collider);
        if (collider) {
            collider.enabled = false;
        }
        const rightBody = otherColliderNode.getComponent(Collider);
        if (rightBody) {
            rightBody.enabled = false;
        }
    }

    // 解锁士兵
    unlockHelper(obj) {
        const partner = DataManager.Instance.partnerConManager.create();
        const worldPos = obj.otherCollider.node.getWorldPosition();
        partner.setPosition(worldPos);

        if (partner && this.partnerCon) partner.setParent(this.partnerCon);
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

    // 修改地块颜色
    landDiscoloration(otherCollider) {
        this.resetLandDiscoloration();

        const landmark = otherCollider.node.getChildByName("Landmark");
        if (landmark) {
            const dashedBoxParent = landmark.getChildByName("kuang-001");
            if (dashedBoxParent) {
                this.areaEffectNode = dashedBoxParent;
                const renderer = dashedBoxParent.getComponent(UIRenderer);
                if (renderer) {
                    renderer.color = new Color(61, 255, 0);
                }
            }
        }
    }

    resetLandDiscoloration() {
        const unlock = find("THREE3DNODE/Unlock");
        if (!unlock) return;

        for (const plot of unlock.children) {
            const plotName = this._curPlots.find(item => {
                return item == plot.name;
            })

            if (!plot || plotName) continue;

            const landmark = plot.getChildByName("Landmark");
            if (!landmark) continue;

            this.stopBreathingAni(landmark);

            const dashedBox = landmark.getChildByName("kuang-001");
            if (!dashedBox) continue;

            this.areaEffectNode = dashedBox;

            const renderer = dashedBox.getComponent(UIRenderer);
            if (renderer) {
                renderer.color = new Color(255, 255, 255);
            }
        }
    }

    // 重置plot动画
    resetPlotPromptAni() {
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


