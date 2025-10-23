import { _decorator, Animation, AsyncDelegate, CCFloat, Collider, Collider2D, ColliderComponent, Component, ConeCollider,  ERigidBodyType, ICollisionEvent, ITriggerEvent, math, Node, RigidBody, SkeletalAnimation, tween, UITransform, v3, Vec3 } from 'cc';
import { StateDefine } from './StateDefine';
import { MathUtil } from '../Utils/MathUtil';
import { CollisionZoneEnum, EntityTypeEnum, UIPropertyEnum, UnlockType } from '../Enum/Index';
import { DataManager } from '../Global/DataManager';
import { SoundManager } from '../Common/SoundManager';
import { UIpropertyManager } from '../UI/UIpropertyManager';
const { ccclass, property } = _decorator;

let tempVelocity: Vec3 = v3();

@ccclass('Actor')
export class Actor extends Component {
    skeletalAnimation: SkeletalAnimation = null;

    @property(CCFloat)
    linearSpeed: number = 100.0;

    @property(CCFloat)
    angularSpeed: number = 90;

    currentState: StateDefine | string = StateDefine.IdleRelax;
    currState = null;

    destForward: Vec3 = v3();

    collider: Collider | null = null;
    rigidbody: RigidBody | null = null;

    // 收集钱区域
    isInMoneyArea = false;
    // 交付钱区域
    isDeliveryMoneyArea = false;
    // 交付药剂区域
    isDeliveryMedicationArea = false;
    // 在收集勋章区域
    isDeliveryHonorArea = false;
    // 在交付勋章区域
    isDeliveryMedalAni = false;

    // 区域1
    isHelper1Area = false;
    // 区域2
    isHelper2Area = false;
    // 区域3
    isUnlockTileArea = false;

    // 机器人收集钱的数量
    private _maxMoneyRobot = 10;

    // 移动倍率
    private magnification = 10;

    // 跑倍率
    private runRate = 20;
    // 走倍率
    private walkRate = 7;

    // 控制钱的变量
    private _moneyCollectCooldown = 0;
    private _moneyCollectInterval = 0.09;

    private _medicineCollectCooldown = 0;


    // 进去区域
    private isEnterArea = false;
    private currentQuantity = 0;

    curBackpackMoneyCount = 0;
    curBackpckMedalCount = 0;
    curBackpackMedicaneCount = 0;

    // 连续收集勋章

    uiMoney = null;
    uiHonorValue = null;
    uiMedicament = null;

    init() {
        this.rigidbody = this.node.getComponent(RigidBody);
        this.collider = this.node.getComponent(Collider);

        const roadman = this.node.getChildByName("roadman_low02");
        this.skeletalAnimation = roadman.getComponent(SkeletalAnimation)
        this.skeletalAnimation?.on(Animation.EventType.FINISHED, this.onAnimationFinished, this);



        this.collider?.on("onTriggerEnter", this.onTriggerEnter, this)
        this.collider?.on("onTriggerStay", this.onTriggerStay, this);
        this.collider?.on("onTriggerExit", this.onTriggerExit, this);

        //this.collider.on('onCollisionEnter', this.onCollisionEnter, this);
    }

    onTriggerEnter(event: ITriggerEvent) {
        const selfCollider = event.selfCollider;
        const otherCollider = event.otherCollider;

        const backpackOne = this.node.getChildByName("BackBackpack1");
        const backpackTwo = this.node.getChildByName("BackBackpack2");

        // 获取钱
        if (otherCollider.node.name == CollisionZoneEnum.GetMoneyArea) {

            let moneyBackpack = null;

            if (backpackOne?.children.some(child => child.name === EntityTypeEnum.Money)) {
                moneyBackpack = backpackOne;
            } else if (backpackTwo?.children.some(child => child.name === EntityTypeEnum.Money)) {
                moneyBackpack = backpackTwo;
            }

            this.curBackpackMoneyCount = moneyBackpack ? moneyBackpack.children.length : 0;

            this.isInMoneyArea = true;
        } else if (otherCollider.node.name == CollisionZoneEnum.Operator) {
            this.isDeliveryMoneyArea = true;
            let medicineBackpack = null;
            if (backpackOne?.children.some(child => child.name === EntityTypeEnum.Money)) {
                medicineBackpack = backpackOne;
            } else if (backpackTwo?.children.some(child => child.name === EntityTypeEnum.Money)) {
                medicineBackpack = backpackTwo;
            }

            this.curBackpackMedicaneCount = medicineBackpack ? medicineBackpack.children.length : 0;
        } else if (otherCollider.node.name == CollisionZoneEnum.DeliverMedicineArea) {
            this.deliveryisMedicationAniData();
            this.isDeliveryMedicationArea = true;
        } else if (otherCollider.node.name == CollisionZoneEnum.GetHonorArea) {
            let honorBackpack = null;
            if (backpackOne?.children.some(child => child.name == EntityTypeEnum.Honor)) {
                honorBackpack = backpackOne;
            } else if (backpackTwo?.children.some(child => child.name == EntityTypeEnum.Honor)) {
                honorBackpack = backpackTwo;
            }

            this.curBackpckMedalCount = honorBackpack ? honorBackpack.children.length : 0;

            this.isDeliveryHonorArea = true;
        } else if (otherCollider.node.name == CollisionZoneEnum.Helper1Area) {
            this.isHelper1Area = true;
            this.isDeliveryMedalAni = true;
            this.isEnterArea = true;
        } else if (otherCollider.node.name == CollisionZoneEnum.Helper2Area) {
            this.isHelper2Area = true;
            this.isDeliveryMedalAni = true;
            this.isEnterArea = true;
        } else if (otherCollider.node.name == CollisionZoneEnum.UnlockTileArea) {
            this.isUnlockTileArea = true;
            this.isDeliveryMedalAni = true;
            this.isEnterArea = true;
        }
    }

    private isDrugDelivery = true;
    onTriggerStay(event: ITriggerEvent) {
        const peoplesArr = DataManager.Instance.PeopleManeger.getPeoplesPos();
        const selfCollder = event.selfCollider;
        const otherCollider = event.otherCollider;

        if (otherCollider.node.name == CollisionZoneEnum.DeliverMedicineArea) {
            this.isDeliveryMedicationArea = true;

            // 如果药剂还在背包中，并且尚未触发交付动画，则重新尝试交付
            if (this.isDrugDelivery && this.hasMedicineInFrontBackpack() && peoplesArr.length > 0) {
                this.isDrugDelivery = false;
                this.deliveryisMedicationAniData();
            }
        } else if (otherCollider.node.name == CollisionZoneEnum.GetHonorArea) {
            this.isDeliveryHonorArea = true;
        }
    }

    private hasMedicineInFrontBackpack(): boolean {
        const frontBackpack = this.node.getChildByName("FrontBackpack");
        return !!frontBackpack && frontBackpack.children.length > 0;
    }

    onTriggerExit(event: ITriggerEvent) {
        const otherCollider = event.otherCollider;
        const selfCollider = event.selfCollider;
        this.isDrugDelivery = true;

        // 获取钱
        if (otherCollider.node.name == CollisionZoneEnum.GetMoneyArea) {
            this.isInMoneyArea = false;
        } else if (otherCollider.node.name == CollisionZoneEnum.Operator) {
            this.isDeliveryMoneyArea = false;
        } else if (otherCollider.node.name == CollisionZoneEnum.DeliverMedicineArea) {
            this.isDeliveryMedicationArea = false;
        } else if (otherCollider.node.name == CollisionZoneEnum.GetHonorArea) {
            this.isDeliveryHonorArea = false;
        } else if (otherCollider.node.name == CollisionZoneEnum.Helper1Area) {
            this.isHelper1Area = false;
            this.isDeliveryMedalAni = false;
        } else if (otherCollider.node.name == CollisionZoneEnum.Helper2Area) {
            this.isHelper2Area = false;
            this.isDeliveryMedalAni = false;
        } else if (otherCollider.node.name == CollisionZoneEnum.UnlockTileArea) {
            this.isUnlockTileArea = false;
            this.isDeliveryMedalAni = false;
        }
    }

    // 碰撞检测
    // onCollisionEnter(event: ICollisionEvent) {
    //     const selfCollider = event.selfCollider;
    //     const otherCollider = event.otherCollider;

    //     // 碰撞药剂收集
    //     if (otherCollider.node.name == EntityTypeEnum.Medicine && selfCollider.node.name != EntityTypeEnum.WithdrawMoneyRobot&& selfCollider.node.name!=EntityTypeEnum.Player) {
    //         // 获取组件
    //         const medicineRigidbody = otherCollider.node.getComponent(RigidBody);
    //         const medicineCollider = otherCollider.node.getComponent(Collider);
    //         medicineCollider.enabled = false;

    //         // 延迟关闭刚体，避免提前禁用导致状态未提交
    //         this.scheduleOnce(() => {
    //             medicineRigidbody.enabled = false;
    //             this.collectMedicineAni(otherCollider.node);
    //         }, 0.05);

    //         // 收集药剂动画
    //     }
    // }

    update(deltaTime: number) {
        this.getAreaAni(deltaTime);

        if (this.currState == StateDefine.Die) {
            return;
        }

        if (this.currState == StateDefine.Run) {
            this.magnification = this.runRate
        } else if (this.currState == StateDefine.Walk) {
            this.magnification = this.walkRate;
        }

        let a = MathUtil.signAngle(this.node.forward, this.destForward, Vec3.UP);
        let as = v3(0, a * 20, 0);
        this.rigidbody.setAngularVelocity(as);

        switch (this.currState) {
            case StateDefine.Walk:
            case StateDefine.Run:
                this.doMove();
                break;
        }

        //收集药剂
        if (this.isDeliveryMoneyArea) {
            this.playerCollectMedicine(deltaTime);
        }
    }

    private playerCollectMedicine(dt) {
        this._medicineCollectCooldown -= dt;
        if (this._medicineCollectCooldown > 0) return;

        if (this.isDeliveryMoneyArea && this.node.name == EntityTypeEnum.CollectingMedicationRobot) {
            if (this.curBackpackMedicaneCount >= this._maxMoneyRobot) {
                this.isDeliveryMoneyArea = false;
                return;
            }
        }

        let medicines: Node[] = DataManager.Instance.LaboratoryManeger.getLandMedicines();
        if (medicines.length > 0) {
            let medicine = medicines[0];
            // 获取组件
            const medicineRigidbody = medicine.getComponent(RigidBody);
            const medicineCollider = medicine.getComponent(Collider);
            medicineCollider.enabled = false;
            medicineRigidbody.enabled = false;
            this.collectMedicineAni(medicine);
            // 延迟关闭刚体，避免提前禁用导致状态未提交
            this.scheduleOnce(() => {
                medicineRigidbody.enabled = false;
            }, 0.05);

            this._medicineCollectCooldown = this._moneyCollectInterval;
        }
    }

    doMove() {
        let speed = this.linearSpeed * this.destForward.length() * this.magnification;
        tempVelocity.x = math.clamp(this.node.forward.x, -1, 1) * speed;
        tempVelocity.z = math.clamp(this.node.forward.z, -1, 1) * speed;
        this.rigidbody?.setLinearVelocity(tempVelocity);
    }

    stopMove() {
        this.rigidbody?.setLinearVelocity(Vec3.ZERO);
    }

    // 获取区域动画
    getAreaAni(dt) {
        this.collectingMoneyAni(dt);
        this.deliveryMoneyAni(dt);
        this.deliveryisMedicationAni(dt);
        this.collectMedalAni(dt);
        this.deliveryMedalAni();
    }

    // 收集钱
    collectingMoneyAni(dt) {
        if (!this.isInMoneyArea) return;
        // 是收钱机器人，并且
        if (this.node.name == EntityTypeEnum.WithdrawMoneyRobot && !DataManager.Instance.isRobotAction) return;

        this._moneyCollectCooldown -= dt;
        if (this._moneyCollectCooldown > 0) return;
        this.collectAni(CollisionZoneEnum.GetMoneyArea, EntityTypeEnum.Money);

        this._moneyCollectCooldown = this._moneyCollectInterval;
    }

    // 收集勋章动画
    collectMedalAni(dt: number) {
        if (this.isDeliveryHonorArea) {
            this.collectAni(CollisionZoneEnum.GetHonorArea, EntityTypeEnum.Honor);
        }
    }

    // 收集动画
    collectAni(area, entity) {
        let targetBackpack: Node | null = null;

        const backBackpackOne = this.node.getChildByName("BackBackpack1");
        const backBackpackTwo = this.node.getChildByName("BackBackpack2");

        const getBackpackType = (backpack: Node | null): string | null => {
            if (!backpack || backpack.children.length === 0) return null;
            return backpack.children[0].name;
        };

        const typeOne = getBackpackType(backBackpackOne);
        const typeTwo = getBackpackType(backBackpackTwo);

        if (typeOne === entity) {
            targetBackpack = backBackpackOne;
        } else if (typeTwo === entity) {
            targetBackpack = backBackpackTwo;
        } else if (backBackpackOne.children.length === 0) {
            targetBackpack = backBackpackOne;
        } else if (backBackpackTwo.children.length === 0) {
            targetBackpack = backBackpackTwo;
        } else {
            console.warn("没有空背包或匹配背包，默认放入BackBackpack1");
            targetBackpack = backBackpackOne;
        }

        let node: Node = null;
        let startWorldPos: Vec3 = null;
        this.curBackpackMoneyCount++;

        if (area === CollisionZoneEnum.GetMoneyArea) {
            if (this.node.name == "Player") {
                if (this.curBackpackMoneyCount > DataManager.Instance.maxMoneyCount) {
                    this.isInMoneyArea = false;
                    DataManager.Instance.moneyMaxManager.playAnimation();
                    SoundManager.inst.playAudio("DC_MAX");
                    return;
                }
            } else {
                if (this.curBackpackMoneyCount > this._maxMoneyRobot) {
                    this.isInMoneyArea = false;
                    return;
                }
            }

            const { pos, money } = DataManager.Instance.MoneyManeger.playerGetMoney();
            node = money;
            startWorldPos = pos;

            if (this.node.name == "Player") {
                DataManager.Instance.sceneManager.UIproperty.getComponent(UIpropertyManager).updatePropertyLab(UIPropertyEnum.Money, true);
            } else {
                DataManager.Instance.sceneManager.UIpropertyMoneyRobot.getComponent(UIpropertyManager).updatePropertyLab(UIPropertyEnum.Money, true)
            }
        } else if (area === CollisionZoneEnum.GetHonorArea) {
            const honorData = DataManager.Instance.HonorManeger.playerGetHonor();
            if (!honorData) {
                this.isDeliveryHonorArea = false;
                return;
            }
            const { pos, honor } = honorData;
            node = honor;
            startWorldPos = pos;

            if (this.node.name == "Player") {
                DataManager.Instance.sceneManager.UIproperty.getComponent(UIpropertyManager).updatePropertyLab(UIPropertyEnum.HonorValue, true);
            }
        }

        node.setParent(this.node.parent);

        const getBackpackTopWorldPos = (): Vec3 => {
            const base = targetBackpack.getWorldPosition(new Vec3());
            if (targetBackpack.children.length === 0) {
                return base;
            }

            const lastChild = targetBackpack.children[targetBackpack.children.length - 1];
            const lastChildWorldPos = lastChild.getWorldPosition(new Vec3());
            lastChildWorldPos.y += DataManager.Instance.MoneyHeight;
            return lastChildWorldPos;
        };

        const controlPoint = new Vec3();

        const originalScale = node.scale.clone();
        const shrunkenScale = originalScale.clone().multiplyScalar(0.8);

        tween(node)
            .to(0.1, { scale: shrunkenScale })
            .start();

        tween(node)
            .to(0.3, {}, {
                easing: 'cubicInOut',
                onUpdate: (_, ratio) => {
                    let endPos = null;
                    if (this.node.name == "Player") {
                        if (area === CollisionZoneEnum.GetMoneyArea) {
                            const money = DataManager.Instance.sceneManager.UIproperty.getChildByPath("nodes/Money");
                            const icon = money.getChildByName("Icon");
                            endPos = icon.getWorldPosition(new Vec3());
                        } else if (area == CollisionZoneEnum.GetHonorArea) {
                            const honorValue = DataManager.Instance.sceneManager.UIproperty.getChildByPath("nodes/HonorValue");
                            const icon = honorValue.getChildByName("Icon");
                            endPos = icon.getWorldPosition(new Vec3());
                        }
                    } else {
                        if (area === CollisionZoneEnum.GetMoneyArea) {
                            const money = DataManager.Instance.sceneManager.UIpropertyMoneyRobot.getChildByName("Money");
                            const icon = money.getChildByName("Icon");
                            endPos = icon.getWorldPosition(new Vec3());
                        }
                    }

                    // const endPos = getBackpackTopWorldPos();

                    controlPoint.set(
                        (startWorldPos.x + endPos.x) / 2,
                        Math.max(startWorldPos.y, endPos.y) + 20,
                        (startWorldPos.z + endPos.z) / 2
                    );

                    const pos = MathUtil.bezierCurve(startWorldPos, controlPoint, endPos, ratio);
                    node.setWorldPosition(pos);
                }
            })
            .call(() => {
                node.setParent(targetBackpack);

                const index = targetBackpack.children.indexOf(node);
                const finalOffsetY = DataManager.Instance.MoneyHeight * index;
                node.setPosition(new Vec3(0, finalOffsetY, 0));
                tween(node)
                    .to(0.1, { scale: originalScale })
                    .start();

                if (entity === EntityTypeEnum.Honor) {
                    DataManager.Instance.medalsNumber++;
                    DataManager.Instance.pt.updateNumLabel();
                }

                SoundManager.inst.playAudio("DC_shiqu");
            })
            .start();
    }


    // 交付钱动画
    deliveryMoneyAni(dt) {
        if (!this.isDeliveryMoneyArea) return;
        if (this.node.name == EntityTypeEnum.WithdrawMoneyRobot && !DataManager.Instance.isRobotAction) return;

        this._moneyCollectCooldown -= dt;
        if (this._moneyCollectCooldown > 0) return;

        const deliverWorldPos = DataManager.Instance.LaboratoryManeger.getDeliverWorldPos();
        this.deliveryAni(EntityTypeEnum.Money, deliverWorldPos);

        this._moneyCollectCooldown = this._moneyCollectInterval;
    }


    // 交付勋章动画
    deliveryMedalAni() {
        if (this.isDeliveryMedalAni) {
            let helperPos = null;
            let unlockType = null;
            if (this.isHelper1Area && this.isEnterArea) {
                this.isEnterArea = false;
                const remainingQuantity = DataManager.Instance.HonorManeger.helper1NeedNum();
                this.currentQuantity = remainingQuantity
            } else if (this.isHelper2Area && this.isEnterArea) {
                this.isEnterArea = false;
                const remainingQuantity = DataManager.Instance.HonorManeger.helper2NeedNum();
                this.currentQuantity = remainingQuantity
            } else if (this.isUnlockTileArea && this.isEnterArea) {
                this.isEnterArea = false;
                const remainingQuantity = DataManager.Instance.HonorManeger.unlockAreaNeedNum();
                this.currentQuantity = remainingQuantity;
            }

            if (this.isHelper1Area) {
                helperPos = DataManager.Instance.HonorManeger.getHelper1Pos();
                unlockType = UnlockType.Helper1;
            } else if (this.isHelper2Area) {
                helperPos = DataManager.Instance.HonorManeger.getHelper2Pos()
                unlockType = UnlockType.Helper2;
            } else if (this.isUnlockTileArea) {
                helperPos = DataManager.Instance.HonorManeger.getUnlockAreaPos()
                unlockType = UnlockType.UnlockTile;
            }

            if (this.currentQuantity <= 0) {
                return;
            }

            this.currentQuantity--;

            const deliverWorldPos = helperPos;
            this.deliveryAni(EntityTypeEnum.Honor, deliverWorldPos, unlockType);
        }
    }

    // 交付动画
    deliveryAni(entity, deliverWorldPos, unlockType = UnlockType.Helper1) {
        let targetBackpack: Node | null = null;

        const backBackpackOne = this.node?.getChildByName("BackBackpack1");
        const backBackpackTwo = this.node?.getChildByName("BackBackpack2");

        const backpackOneHasSame = backBackpackOne?.children.some(child => child.name === entity);
        const backpackTwoHasSame = backBackpackTwo?.children.some(child => child.name === entity);

        if (backpackOneHasSame) {
            targetBackpack = backBackpackOne;
        } else if (backpackTwoHasSame) {
            targetBackpack = backBackpackTwo;
        }

        if (!targetBackpack) return;

        const node = targetBackpack.children[targetBackpack.children.length - 1];
        let worldPos: Vec3 = node.getWorldPosition().clone();
        node.parent = DataManager.Instance.HomeMap.effectNode;
        node.setWorldPosition(worldPos);

        // 设置初始缩放为 0，实现从 0 放大到 1 的动画

        if (this.node.name == "Player") {
            if (entity == EntityTypeEnum.Money) {
                const money = DataManager.Instance.sceneManager.UIproperty.getChildByPath("nodes/Money");
                const icon = money.getChildByName("Icon");
                const nodePos = icon.getWorldPosition(new Vec3());
                node.setPosition(nodePos);
                node.scale = new Vec3(0.8, 0.8, 0.8);
            } else if (entity == EntityTypeEnum.Honor) {
                const money = DataManager.Instance.sceneManager.UIproperty.getChildByPath("nodes/HonorValue");
                const icon = money.getChildByName("Icon");
                const nodePos = icon.getWorldPosition(new Vec3());
                node.setPosition(nodePos);
                node.scale = new Vec3(0.5, 0.5, 0.5);
            }
        } else {
            const uiProperty = this.node.getChildByName("UIproperty");
            if (entity == EntityTypeEnum.Money) {
                const money = DataManager.Instance.sceneManager.UIpropertyMoneyRobot.getChildByName("Money")
                const icon = money.getChildByName("Icon");
                const nodePos = icon.getWorldPosition(new Vec3());
                node.setPosition(nodePos);
                node.scale = new Vec3(0.8, 0.8, 0.8);
            } else if (entity == EntityTypeEnum.Honor) {
                const honorValue = uiProperty.getChildByName("HonorValue");
                const icon = honorValue.getChildByName("Icon");
                const nodePos = icon.getWorldPosition(new Vec3());
                node.setPosition(nodePos);
                node.scale = new Vec3(0.5, 0.5, 0.5);
            }
        }

        const nodeWorldPos = node.position;
        let controlPoint = null;
        if (entity == EntityTypeEnum.Money) {
            controlPoint = new Vec3(
                (nodeWorldPos.x + deliverWorldPos.x) / 2,
                20,
                (nodeWorldPos.z + deliverWorldPos.z) / 2
            );
        } else {
            controlPoint = new Vec3(
                (nodeWorldPos.x + deliverWorldPos.x) / 2,
                38,
                (nodeWorldPos.z + deliverWorldPos.z) / 2
            );
        }

        tween(node)
            .to(0.3, {
                position: deliverWorldPos,
                scale: new Vec3(1, 1, 1)
            }, {
                easing: `cubicInOut`,
                onUpdate: (target, ratio) => {
                    const targetNode = target as Node;
                    const position = MathUtil.bezierCurve(nodeWorldPos, controlPoint, deliverWorldPos, ratio);
                    targetNode.worldPosition = position;
                }
            })
            .call(() => {
                if (entity == EntityTypeEnum.Money) {
                    DataManager.Instance.MoneyManeger.recycleMoney(node);
                    DataManager.Instance.LaboratoryManeger.playerDeliverMoney();

                    DataManager.Instance.isDeliveryMoneyCompleted = targetBackpack.children.length <= 0;

                    if (this.node.name == "Player") {
                        DataManager.Instance.sceneManager.UIproperty.getComponent(UIpropertyManager)
                            .updatePropertyLab(UIPropertyEnum.Money, false);
                    } else {
                        DataManager.Instance.sceneManager.UIpropertyMoneyRobot.getComponent(UIpropertyManager)
                            .updatePropertyLab(UIPropertyEnum.Money, false);
                    }
                } else if (entity == EntityTypeEnum.Honor) {
                    DataManager.Instance.HonorManeger.recycleHonor(node);
                    if (unlockType == UnlockType.Helper1) {
                        DataManager.Instance.HonorManeger.deliverHonorToHelper1();
                    } else if (unlockType == UnlockType.Helper2) {
                        DataManager.Instance.HonorManeger.deliverHonorToHelper2();
                    } else if (unlockType == UnlockType.UnlockTile) {
                        DataManager.Instance.HonorManeger.deliverHonorToUnlockArea();
                    }

                    if (this.node.name == "Player") {
                        DataManager.Instance.sceneManager.UIproperty.getComponent(UIpropertyManager)
                            .updatePropertyLab(UIPropertyEnum.HonorValue, false);
                    }
                }

                if (entity == EntityTypeEnum.Honor) {
                    DataManager.Instance.medalsNumber--;
                    DataManager.Instance.pt.updateNumLabel();
                }

                if (targetBackpack?.children.length <= 0 && this.node.name === "Player") {
                    const backBackpack1 = this.node.getChildByName("BackBackpack1");
                    const backBackpack2 = this.node.getChildByName("BackBackpack2");

                    if (backBackpack1?.children.length <= 0 && backBackpack2?.children.length > 0) {
                        const items = [...backBackpack2.children];

                        for (let i = 0; i < items.length; i++) {
                            const node = items[i];
                            const originalRotation = node.rotation.clone();
                            const worldPos = node.getWorldPosition(new Vec3());

                            node.parent = backBackpack1;
                            node.setWorldPosition(worldPos);

                            const localStartPos = node.getPosition();
                            const targetLocalPos = new Vec3(0, DataManager.Instance.MoneyHeight * i, 0);
                            const controller = { t: 0 };
                            const interpolatedPos = new Vec3();

                            tween(controller)
                                .delay(i * 0.03)
                                .to(0.3, { t: 1 }, {
                                    easing: 'quadOut',
                                    onUpdate: () => {
                                        Vec3.lerp(interpolatedPos, localStartPos, targetLocalPos, controller.t);
                                        node.setPosition(interpolatedPos);
                                    }
                                })
                                .call(() => {
                                    node.setPosition(targetLocalPos);
                                    node.setRotation(originalRotation);
                                })
                                .start();
                        }
                    }
                }

                SoundManager.inst.playAudio("DC_shiqu");
            })
            .start();
    }


    // 收集药剂动画
    private medicineCount = 0;
    collectMedicineAni(medicine: Node) {
        // 如果药剂已被收集到任意背包中，则不重复收集
        const allBackpacks = [
            this.node.getChildByName("FrontBackpack"),
            this.node.getChildByName("BackBackpack1"),
            this.node.getChildByName("BackBackpack2"),
            DataManager.Instance?.player?.getChildByName("FrontBackpack"),
            DataManager.Instance?.player?.getChildByName("BackBackpack1"),
            DataManager.Instance?.player?.getChildByName("BackBackpack2")
        ];

        for (const backpack of allBackpacks) {
            if (!backpack) continue;
            if (backpack.children.includes(medicine)) {
                console.warn("药剂已被其他背包收集，跳过动画");
                return;
            }
        }

        const frontBackpack = this.node.getChildByName("FrontBackpack");
        if (!frontBackpack) return;

        const targetIndex = this.medicineCount++;
        const medicineWorldPos = medicine.worldPosition.clone();
        // const frontBackpackWorldPos = frontBackpack.worldPosition.clone();
        // frontBackpackWorldPos.y += targetIndex * DataManager.Instance.MedicineHeight;

        let frontBackpackWorldPos = null;
        if (this.node.name == "Player") {
            const medicament = DataManager.Instance.sceneManager.UIproperty.getChildByPath("nodes/Medicament");
            const icon = medicament.getChildByName("Icon");
            frontBackpackWorldPos = icon.worldPosition.clone();
        } else {
            const medicament = DataManager.Instance.sceneManager.UIpropertyMedicationRobot.getChildByName("Medicament");
            const icon = medicament.getChildByName("Icon");
            frontBackpackWorldPos = icon.worldPosition.clone();
        }

        medicine.setParent(this.node.parent);
        DataManager.Instance.LaboratoryManeger.pickUpMedicine(medicine);

        const controlPoint = new Vec3(
            (medicineWorldPos.x + frontBackpackWorldPos.x) / 2,
            Math.max(medicineWorldPos.y, frontBackpackWorldPos.y) + 20,
            (medicineWorldPos.z + frontBackpackWorldPos.z) / 2
        );

        const originalScale = medicine.scale.clone();
        const shrunkenScale = originalScale.clone().multiplyScalar(0.9);

        tween(medicine)
            .to(0.3, { scale: shrunkenScale })
            .start();

        tween(medicine)
            .to(0.3, {}, {
                easing: `cubicInOut`,
                onUpdate: (_, ratio) => {
                    const pos = MathUtil.bezierCurve(medicineWorldPos, controlPoint, frontBackpackWorldPos, ratio);
                    medicine.setWorldPosition(pos);
                }
            })
            .call(() => {
                medicine.setParent(frontBackpack);
                medicine.setRotationFromEuler(0, 0, 0);

                if (this.node.name == "Player") {
                    DataManager.Instance.sceneManager.UIproperty.getComponent(UIpropertyManager).updatePropertyLab(UIPropertyEnum.Medicament, true);
                } else {
                    DataManager.Instance.sceneManager.UIpropertyMedicationRobot.getComponent(UIpropertyManager).updatePropertyLab(UIPropertyEnum.Medicament, true)
                }

                // 重新排列当前背包中的所有药剂
                const children = frontBackpack.children;
                for (let i = 0; i < children.length; i++) {
                    children[i].setPosition(new Vec3(0, i * DataManager.Instance.MedicineHeight, 0));
                }

                tween(medicine)
                    .to(0.1, { scale: originalScale })
                    .start();

                SoundManager.inst.playAudio("DC_shiqu");
            })
            .start();
        if (this.isDeliveryMoneyArea && this.node.name == EntityTypeEnum.CollectingMedicationRobot) {
            this.curBackpackMedicaneCount++;
        }
    }

    // 交付药剂动画
    private _pendingMedications: { node: Node, start: Vec3, control: Vec3, end: Vec3 }[] = [];
    private _groupLaunchTimer = 0;
    private _isLaunchingMedications = false;
    private _groupSize = 1; // 每组1个
    private _activeMedicineCount: number = 0; // 当前正在飞行或未回收的药品数量
    private _allMedicineCount: number = 0;

    //每个人时间间隔加一些
    private _lastEndPos: Vec3;
    private _peopleInterval: number = 0.05;
    private _peopleTimer: number = 0;
    private _jumpAni: boolean = false;

    deliveryisMedicationAniData() {
        this._jumpAni = false;
        this._lastEndPos = null;
        const frontBackpack = this.node.getChildByName("FrontBackpack");
        const peoplesArr = DataManager.Instance.PeopleManeger.getPeoplesPos();
        const medicines: Node[] = frontBackpack.children;

        const peopleCount = peoplesArr.length;

        if (peopleCount <= 0) return;
        this.isDrugDelivery = false;
        this._pendingMedications = [];
        this._groupLaunchTimer = 0;
        this._isLaunchingMedications = true;
        let startIndex: number = DataManager.Instance.PeopleManeger.getStartIndex();
        let needNum: number = DataManager.Instance.PeopleManeger.getNeedHonorNum();
        let min: number = Math.max(0, medicines.length - needNum);
        let len: number = medicines.length;
        for (let i = medicines.length - 1; i >= min; i--) {
            const medicine = medicines[i];
            const targetIndex = Math.floor((20 - needNum + len - 1 - i) / 5); // 复用目标点
            const end = peoplesArr[targetIndex].clone();
            // const start = medicine.worldPosition.clone();
            let start = null;
            if (this.node.name == "Player") {
                const medicament = DataManager.Instance.sceneManager.UIproperty.getChildByPath("nodes/Medicament");
                const icon = medicament.getChildByName("Icon");
                start = icon.worldPosition.clone();
                start.x = start.x - 0.2;
                start.z = start.z + 2;
            } else {
                const medicament = DataManager.Instance.sceneManager.UIpropertyMedicationRobot.getChildByName('Medicament');
                const icon = medicament.getChildByName("Icon");
                start = icon.worldPosition.clone();
                start.x = start.x - 10;
                start.z = start.z - 10;
            }

            const control = new Vec3(
                (start.x + end.x) / 2,
                Math.max(start.y, end.y) + 20,
                (start.z + end.z) / 2
            );
            this._pendingMedications.push({ node: medicine, start, control, end });
        }

        this._allMedicineCount = this._pendingMedications.length;
    }

    deliveryisMedicationAni(dt: number) {
        if (!this._isLaunchingMedications) {
            return;
        }

        if (this._pendingMedications.length === 0 && this._activeMedicineCount === 0) {
            this._isLaunchingMedications = false;
            this.medicineCount = 0;
            if (this.node.name === "Player") {
                DataManager.Instance.sceneManager.UIproperty
                    .getComponent(UIpropertyManager)
                    .updateMed();
            } else {
                DataManager.Instance.sceneManager.UIpropertyMedicationRobot
                    .getComponent(UIpropertyManager)
                    .updateMed();
            }
            console.log("所有药品交付完成！");
            return;
        }

        //人和人之间加时间间隔
        let newEndPos = this._pendingMedications[0]?.end;
        if (newEndPos && this._lastEndPos && (newEndPos.x != this._lastEndPos.x || newEndPos.z != this._lastEndPos.z)) {
            if (this._peopleTimer < this._peopleInterval) {
                this._peopleTimer += dt;
                return;
            }
        }
        this._peopleTimer = 0;

        if (this._jumpAni) {
            this._jumpAni = false;
            return;
        }

        // else if (this._pendingMedications.length === 0 && this.node.name != "Player"&&!this.isDrugDelivery) {

        //     DataManager.Instance.sceneManager.UIpropertyMedicationRobot
        //         .getComponent(UIpropertyManager)
        //         .updateMed();
        // }

        // this._groupLaunchTimer += dt;
        // if (this._groupLaunchTimer >= 0.1) {
        //     this._groupLaunchTimer = 0;

        // 每次发射最多 groupSize 个
        const batch = this._pendingMedications.splice(0, this._groupSize);
        this._activeMedicineCount += batch.length;

        let soundOnce = true;

        batch.forEach((item) => {
            if (this.node.name === "Player") {
                DataManager.Instance.sceneManager.UIproperty
                    .getComponent(UIpropertyManager)
                    .updatePropertyLab(UIPropertyEnum.Medicament, false);
            } else {
                DataManager.Instance.sceneManager.UIpropertyMedicationRobot
                    .getComponent(UIpropertyManager)
                    .updatePropertyLab(UIPropertyEnum.Medicament, false);
            }

            item.node.setParent(this.node.parent);
            item.node.scale = new Vec3(0.6, 0.6, 0.6); // 设置初始缩放为 0，开始放大动画

            tween(item.node)
                .to(0.5, { scale: new Vec3(1, 1, 1) }, {
                    easing: 'cubicInOut',
                    onUpdate: (target, ratio) => {
                        const node = target as Node;
                        const pos = MathUtil.bezierCurve(item.start, item.control, item.end, ratio);
                        node.worldPosition = pos;
                    }
                })
                .call(() => {
                    DataManager.Instance.LaboratoryManeger.recycleMedicine(item.node);
                    this.medicineCount--;
                    this._activeMedicineCount--;
                    DataManager.Instance.PeopleManeger.addMedicine();

                    if (this._pendingMedications.length === 0 && this._activeMedicineCount === 0) {
                        this._isLaunchingMedications = false;
                        DataManager.Instance.PeopleManeger.playerDeliverMedicine(this._allMedicineCount);
                        const frontBackpack = this.node.getChildByName("FrontBackpack");
                        if (frontBackpack) {
                            const medicines: Node[] = frontBackpack.children;
                            if (medicines.length > 0) {
                                this.isDrugDelivery = true;
                            } else if (this.node.name === EntityTypeEnum.CollectingMedicationRobot) {
                                DataManager.Instance.sceneManager.UIpropertyMedicationRobot
                                    .getComponent(UIpropertyManager)
                                    .updateMed();
                            }
                        }
                    }

                    if (soundOnce) {
                        soundOnce = false;
                        SoundManager.inst.playAudio("DC_shiqu");
                    }
                })
                .start();
            this._lastEndPos = item.end;
        });
        //}
    }


    changeState(state: StateDefine | string) {
        if (this.currState == state) {
            return;
        }

        if (this.currState == StateDefine.Run ||
            this.currState == StateDefine.Walk
        ) {
            this.stopMove();
        }

        this.skeletalAnimation?.crossFade(state as string, 0.1);
        // 更改状态
        this.currState = state;
    }

    onAnimationFinished() {

    }
}

