import { _decorator, Component, instantiate, Node, Vec3, tween, find, director, Animation, Camera } from 'cc';
import { DataManager } from '../Global/DataManager';
import { EntityTypeEnum } from '../Enum/Index';
import { MinionManager } from './MinionManager';
import { MinionStateEnum } from './StateDefine';
import { Actor } from './Actor';

const { ccclass, property } = _decorator;

@ccclass('MinionConManager')
export class MinionConManager extends Component {
    @property(Node)
    minionWeaponCon: Node = null;

    @property(Node)
    lookingMonsterMinionCon: Node = null;

    // 怪容器
    @property(Node)
    monsterParent: Node = null;

    // 起点
    birthPoint = new Vec3(-0.657, 0, 9);

    // 排队
    queuePosition = [
        new Vec3(-0.657, 0, 21),
        new Vec3(-0.657, 0, 18),
        new Vec3(-0.657, 0, 15),
        new Vec3(-0.657, 0, 12),
    ];
    // 出门路径
    exitRoute = [new Vec3(-0.657, 0, 25), new Vec3(8.411, 0, 25), new Vec3(8.411, 0, 33)];

    moveSpeed = 5;
    spawnCooldown = 1.5;
    private _spawnTimer = 0;

    private _targetMonsters: Node[] = [];

    // 是否出现结算结束截面
    private isSettlementInterface = false;

    protected start(): void {
        DataManager.Instance.MinionConManager = this;
    }

    update(deltaTime: number) {
        if (DataManager.Instance.isStartGame) {
            this._spawnTimer += deltaTime;
            this.checkQueueAndRefill();

            // 小兵出门
            this.goOutMinion();
        }
    }

    // 填充队列
    checkQueueAndRefill() {
        if (!this.node) return;

        const children = this.node.children;

        // 已有小兵自动前进补位
        for (let i = 0; i < children.length; i++) {
            const minion = children[i];
            const targetPos = this.queuePosition[i];

            if (!minion) continue;

            const minionManager = minion?.children[0].getComponent(MinionManager);
            const currentPos = minion.position;

            // 如果已经在位置上，确保状态为 Idle
            if (Vec3.distance(currentPos, targetPos) < 0.01) {
                minionManager.changState(MinionStateEnum.Idle);
                continue;
            }

            if ((minion as any)._tweenTarget?.equals(targetPos)) continue;

            (minion as any)._tweenTarget = targetPos.clone();

            // 开始移动时切换为 Walk
            minionManager.changState(MinionStateEnum.Walk);

            const duration = Vec3.distance(currentPos, targetPos) / this.moveSpeed;

            tween(minion)
                .stop()
                .to(duration, { position: targetPos })
                .call(() => {
                    delete (minion as any)._tweenTarget;

                    // 移动结束后切换为 Idle
                    minionManager.changState(MinionStateEnum.Idle);
                })
                .start();
        }

        // 如果人数不足，创建新兵补到队尾
        if (children.length < this.queuePosition.length && this._spawnTimer >= this.spawnCooldown) {
            const prefab = DataManager.Instance.prefabMap.get(EntityTypeEnum.Minion);
            if (!prefab) return;

            const minion = instantiate(prefab);
            minion.setParent(this.node);
            minion.setPosition(this.birthPoint.clone());

            const minionManager = minion.children[0].getComponent(MinionManager);
            minionManager.changState(MinionStateEnum.Walk);

            const targetPos = this.queuePosition[children.length - 1];
            const duration = Vec3.distance(this.birthPoint, targetPos) / this.moveSpeed;

            (minion as any)._tweenTarget = targetPos.clone();

            tween(minion)
                .to(duration, { position: targetPos })
                .call(() => {
                    delete (minion as any)._tweenTarget;

                    // 移动完成后切换为 Idle
                    minionManager.changState(MinionStateEnum.Idle);
                })
                .start();

            this._spawnTimer = 0;
        }
    }

    private _isDeliveringMinion = false;
    private _deliverInterval = 1;

    // === 添加到类成员中 ===
    private _activeMovingMinions: Set<Node> = new Set(); // 追踪正在出门的小兵

    // === 完整 goOutMinion 方法 ===
    goOutMinion() {
        if (this._isDeliveringMinion) return;
        if (this.node.children.length <= 0) return;

        const validWeapons = this.minionWeaponCon.children.filter(w => w["__delivered"] && !w["__used"]);
        if (validWeapons.length <= 0) return;

        this._isDeliveringMinion = true;

        const weapon = validWeapons[validWeapons.length - 1];
        if (!weapon?.isValid) {
            this._isDeliveringMinion = false;
            return;
        }

        const minion = this.node.children[0];
        if (!minion?.isValid) {
            this._isDeliveringMinion = false;
            return;
        }

        DataManager.Instance.isAllMinionsPassed = false;

        // 延迟标记为“已使用”，防止出列过早
        weapon["__used"] = true;

        const weaponStart = weapon.getWorldPosition();
        const minionWorld = minion.getWorldPosition();
        const weaponTarget = minionWorld.clone().add(new Vec3(0, 2, 0));
        const controlPoint = new Vec3(
            (weaponStart.x + weaponTarget.x) / 2,
            Math.max(weaponStart.y, weaponTarget.y) + 5,
            (weaponStart.z + weaponTarget.z) / 2
        );

        // 先放到世界空间中进行动画
        weapon.setParent(this.node.parent);
        weapon.setWorldPosition(weaponStart);
        if (DataManager.Instance.isGameEnd) return;

        const controller = { t: 0 };
        tween(controller)
            .to(0.4, { t: 1 }, {
                easing: 'quadOut',
                onUpdate: () => {
                    if (!weapon?.isValid) return;
                    const t = controller.t;
                    const oneMinusT = 1 - t;
                    const pos = new Vec3(
                        oneMinusT * oneMinusT * weaponStart.x + 2 * oneMinusT * t * controlPoint.x + t * t * weaponTarget.x,
                        oneMinusT * oneMinusT * weaponStart.y + 2 * oneMinusT * t * controlPoint.y + t * t * weaponTarget.y,
                        oneMinusT * oneMinusT * weaponStart.z + 2 * oneMinusT * t * controlPoint.z + t * t * weaponTarget.z
                    );
                    weapon.setWorldPosition(pos);
                }
            })
            .call(() => {
                if (weapon) weapon.destroy();
                //const worldFinal = weapon.getWorldPosition();
                // weapon.setParent(minion);
                // weapon.setWorldPosition(worldFinal);、
                // 小兵拿到的武器是否是通过传送带传送过来的
                if (weapon && weapon[`__isTransferredWeapons`] && !this.isSettlementInterface) {
                    this.isSettlementInterface = true;
                    this.scheduleOnce(() => {
                        DataManager.Instance.isGameEnd = true;
                        DataManager.Instance.gameEndManager.init();
                    }, 1)
                }

                const worldPos = weapon.worldPosition;
                const effectPrefab = DataManager.Instance.prefabMap.get(EntityTypeEnum.TX_shengjiLZ)
                const skillExplosion = instantiate(effectPrefab);
                director.getScene().addChild(skillExplosion);
                skillExplosion.setWorldPosition(new Vec3(worldPos.x, worldPos.y, worldPos.z));

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

                // 出列：小兵移动准备
                minion.setParent(this.lookingMonsterMinionCon);
                const minionManager = minion.children[0].getComponent(MinionManager);
                if (minionManager) minionManager.changState(MinionStateEnum.Walk);

                const geometry = minion?.children[0]?.getChildByName("Geometry");
                if (geometry) {
                    geometry.active = true;
                }

                const route = this.exitRoute;
                let moveChain = tween(minion);

                this._activeMovingMinions.add(minion); // ➕ 追踪当前出门小兵


                for (let i = 0; i < route.length; i++) {
                    const target = route[i].clone();
                    if (i === 2) {
                        target.z += Math.random() * 20;
                    }

                    moveChain = moveChain
                        .call(() => {
                            const currentPos = minion.getWorldPosition();
                            const dir = new Vec3();
                            Vec3.subtract(dir, target, currentPos);
                            dir.y = 0;
                            dir.normalize();

                            const targetAngle = Math.atan2(dir.x, dir.z) * 180 / Math.PI;

                            tween(minion)
                                .to(0.3, { eulerAngles: new Vec3(0, targetAngle, 0) }, { easing: 'sineInOut' })
                                .start();

                            if (i === 2) {
                                const bSide = find("ThreeDNode/Map/Fences/Scene1/BSide");
                                const bDoor = bSide?.getChildByName("B_Door");
                                if (bDoor) {
                                    const doorL = bDoor.getChildByName("Door_Left");
                                    const doorR = bDoor.getChildByName("Door_Right");
                                    DataManager.Instance.player.getComponent(Actor).openDoorBySide(doorL, doorR, "B");
                                }
                            }
                        })
                        .to(Vec3.distance(minion.getWorldPosition(), target) / this.moveSpeed, {
                            worldPosition: target
                        }, { easing: 'linear' });
                }

                moveChain
                    .call(() => {
                        // ✅ 出门完成，从追踪集合中移除
                        this._activeMovingMinions.delete(minion);

                        // ✅ 所有出门小兵完成，才关门
                        if (this._activeMovingMinions.size === 0) {
                            DataManager.Instance.isAllMinionsPassed = true;

                            const bSide = find("ThreeDNode/Map/Fences/Scene1/BSide");
                            const bDoor = bSide?.getChildByName("B_Door");
                            if (bDoor) {
                                const doorL = bDoor.getChildByName("Door_Left");
                                const doorR = bDoor.getChildByName("Door_Right");
                                DataManager.Instance.player.getComponent(Actor).closeDoorBySide(doorL, doorR, "B", true);
                            }
                        }

                        this.soldiersChasingMonsters?.(minion);
                    })
                    .start();

                this.scheduleOnce(() => {
                    this._isDeliveringMinion = false;
                    this.goOutMinion(); // 自动继续下一个
                }, this._deliverInterval);
            })
            .start();
    }

    // 兵，追怪
    soldiersChasingMonsters(minion) {
        console.log(`${minion.name} 开始追击`);
        const minionManager = minion.children[0].getComponent(MinionManager);
        minionManager.isLookingForMonsters = true;
        minionManager.init();
    }

    public addMonsterTarget(node: Node) {
        this._targetMonsters.push(node);
        //console.log(`增加目标 ${node.uuid}`);
    }

    public removeMonsterTarget(node: Node) {
        let index: number = this._targetMonsters.indexOf(node);
        if (index >= 0) {
            this._targetMonsters.splice(index, 1);
            //console.log(`移除目标 ${node.uuid}`);
        } else {
            if (node) {
                console.log(`目标 ${node.uuid} 不存在`);
            } else {
                console.log(`目标为空`);
            }
        }

    }

    public hasTarget(node: Node) {
        return this._targetMonsters.indexOf(node) !== -1;
    }
}