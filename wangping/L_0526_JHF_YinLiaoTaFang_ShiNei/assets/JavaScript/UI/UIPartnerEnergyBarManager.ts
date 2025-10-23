import { _decorator, Animation, BoxCollider, Color, Component, director, find, Graphics, instantiate, Node, RigidBody, tween, Vec3 } from 'cc';
import { PartnerManager } from '../Actor/PartnerManager';
import { MinionManager } from '../Actor/MinionManager';
import { MinionStateEnum } from '../Actor/StateDefine';
import { DataManager } from '../Global/DataManager';
import { EntityTypeEnum, PathEnum } from '../Enum/Index';
const { ccclass, property } = _decorator;

@ccclass('UIPartnerEnergyBarManager')
export class UIPartnerEnergyBarManager extends Component {

    radius: number = 25;
    // 更新时间
    duration: number = 12.0;

    private progressBarGraphics: Graphics = null!;

    // 更新杀敌数量
    private _killAllMonsterNum = 20;
    private _killMonsterNum = 0;

    get getKillMonsterNum() {
        return this._killMonsterNum;
    }

    set setKillMonsterNum(num) {
        this._killMonsterNum = num;

        this.updateProgressBar();
    }

    start() {
        const circleThree = this.node.getChildByName("Circle3");
        if (!circleThree) {
            console.warn("Circle3 节点未找到");
            return;
        }

        this.progressBarGraphics = circleThree.getComponent(Graphics) || circleThree.addComponent(Graphics);
        this.progressBarGraphics.fillColor = Color.fromHEX(new Color(), "#00FF00");
    }

    // 更新进度条
    updateProgressBar() {
        // const progress = this._killMonsterNum / this._killAllMonsterNum;
        // if (progress >= 1 && this.node.active) {
        //     this.node.active = false;

        //     // 解锁下一个人物
        //     this.unlockNextPeople();
        //     return;
        // }

        // const startAngle = Math.PI / 2;
        // const endAngle = startAngle + Math.PI * 2 * progress;

        // this.progressBarGraphics.clear();
        // this.progressBarGraphics.moveTo(0, 0);
        // this.progressBarGraphics.arc(0, 0, this.radius, startAngle, endAngle, true);
        // this.progressBarGraphics.lineTo(0, 0);
        // this.progressBarGraphics.fill();
    }

    // 解锁下一个人物
    unlockNextPeople() {
        const deliveryArea = this.node.parent.parent;
        const buildingCon = deliveryArea.getChildByName("BuildingCon-001");
        if (deliveryArea.name == "DeliveryAreas3" || deliveryArea.name == "DeliveryAreas4" ||
            deliveryArea.name == "DeliveryAreas5" || deliveryArea.name == "DeliveryAreas8" ||
            deliveryArea.name == "DeliveryAreas7") {
            buildingCon.setScale(1, 1, 0);
            tween(buildingCon)
                .to(0.15, { scale: new Vec3(1, 1, 1.1) }, { easing: 'quadOut' }) // 带弹性效果
                .to(0.05, { scale: new Vec3(1, 1, 1) }, { easing: 'quadOut' })
                .call(() => {
                    const deliveryAreasPh = find(PathEnum.DeliveryAreasPh);
                    if (deliveryAreasPh) {
                        const deliveryAreas = deliveryAreasPh.getChildByName(`${deliveryArea.name}-BuildingCon-001`);
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
                    this.unlockBuilding(buildingCon);
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
                        const deliveryAreas = deliveryAreasPh.getChildByName(`${deliveryArea.name}-BuildingCon-001`);
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

                    this.unlockBuilding(buildingCon)
                })
                .start();
        }


    }

    // 解锁建筑
    unlockBuilding(buildingCon) {
        if (buildingCon) {
            const minion = buildingCon.getChildByName("Minion");
            if (minion) {
                const minionManager = minion.children[0].getComponent(MinionManager);

                if (minionManager) {
                    minionManager.init();
                    minionManager.changState(MinionStateEnum.Attack);

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
