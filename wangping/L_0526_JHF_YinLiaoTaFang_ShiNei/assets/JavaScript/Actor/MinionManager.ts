import {
    _decorator,
    Component,
    instantiate,
    Node,
    Vec3,
    tween,
    SkeletalAnimation,
    find,
    Prefab,
    Pool,
    director,
    Animation,
    SkeletalAnimationState,
    Vec2,
    Quat,
    Mat4,
    CCFloat,
    AnimationClip
} from 'cc';
import { DataManager } from '../Global/DataManager';
import { EntityTypeEnum, EventNames } from '../Enum/Index';
import { MinionStateEnum } from './StateDefine';
import { Simulator } from '../RVO/Simulator';
import { EventManager } from '../Global/EventManager';
import Util from '../Common/Util';
import { MonsterItem } from '../Monster/MonsterItem';
import { UIPartnerEnergyBarManager } from '../UI/UIPartnerEnergyBarManager';

const { ccclass, property } = _decorator;

@ccclass('MinionManager')
export class MinionManager extends Component {
    @property(SkeletalAnimation)
    skeletalAnimation: SkeletalAnimation | null = null;

    @property(Prefab)
    hitExplosionProfab: Prefab = null;

    @property(Node)
    sgdNode: Node = null;

    @property(CCFloat)
    attackRadius = 15;

    private _currentState: MinionStateEnum | string = null;
    private _moveSpeed = 3;
    private _targetMonster: Node | null = null;
    private _attackCooldown = 3;
    private _attackTimer = 0;
    private prefabPool = null;

    //移动小兵
    private _seachTime: number = 0;
    private _seachInterval: number = 10;

    //不移动的小兵
    private _noMoveSeachTime: number = 0;
    private _noMoveSearchInterval: number = 1;

    // 是否是可移动兵人         // 默认是可移动的兵人
    isLookingForMonsters = false;

    // 是否是可移动的兵人
    isMoveMinion = true;
    start() {
        if(this.isMoveMinion) {
            
        }
    }

    protected onEnable(): void {
        EventManager.inst.on(EventNames.ArmyMoveByRVO, this.moveByRvo, this);
    }

    protected onDisable(): void {
        EventManager.inst.off(EventNames.ArmyMoveByRVO, this.moveByRvo, this);
    }

    init() {
        const poolCount = 5;
        this.prefabPool = new Pool(() => {
            const prefab = DataManager.Instance.prefabMap.get(EntityTypeEnum.MinionWeapons);
            return instantiate(prefab!);
        }, poolCount, (node: Node) => {
            node.removeFromParent();
        });


        // 设置 RVO
        const mass = 1;
        const agentId = Simulator.instance.addAgent(
            Util.v3t2(this.node.worldPosition.clone()),
            1,
            15,
            null,
            mass
        );

        const agentObj = Simulator.instance.getAgentByAid(agentId);
        agentObj.neighborDist = 1;

        this._agentHandleId = agentId;

        this.changState(MinionStateEnum.Idle);
    }

    onDestroy() {
        this.prefabPool.destroy();
    }

    create() {
        if (!this.prefabPool) return null;
        let node = this.prefabPool.alloc();
        if (node.parent == null) {
            director.getScene().addChild(node);
        }
        node.active = true;

        return node;
    }

    onProjectileDead(node: Node) {
        node.active = false;
        this.prefabPool.free(node);
    }

    changState(state: MinionStateEnum | string) {
        if (state == this._currentState) return;
        const ani = this.node.parent.getComponent(Animation);

        if (state == MinionStateEnum.Idle) {
            let idleClip = null;
            if (this.isMoveMinion) {
                idleClip = this.skeletalAnimation.clips.find(clip => clip.name === MinionStateEnum.AttackCloseRange); // 替换为实际动画名
            } else {
                idleClip = this.skeletalAnimation.clips.find(clip => clip.name === MinionStateEnum.Attack); // 替换为实际动画名
            }
            if (idleClip) {
                this.skeletalAnimation.stop();
                // this.skeletalAnimation.defaultClip = idleClip;
                const stateState = this.skeletalAnimation.getState(idleClip.name);
                if (stateState) {
                    stateState.time = 0;         // 设置时间为第0秒
                    stateState.sample();         // 强制应用当前帧的姿势
                    stateState.pause();          // 停止播放
                }
            }
            if (ani) {
                ani.play("MinionidleA-001");
            }
        } else {
            if (ani) {
                ani.stop();
            }

            this.skeletalAnimation?.crossFade(state as string, 0.1);
        }
        this._currentState = state;
    }

    update(deltaTime: number) {
        if (this.isLookingForMonsters) {
            this._attackTimer -= deltaTime;
            this.chaseTarget(deltaTime);
        }
    }

    private noMoveCheckInterval: number = 4; // 检查间隔时间（秒）
    private moveThreshold: number = 0.5; // 移动阈值，小于此值认为没有移动
    private _lastCheckPos: Vec3 = null;
    private _stayTime: number = 0;

    // 生成武器的 0.6
    chaseTarget(dt: number) {
        this._seachTime += dt;
        this._noMoveSeachTime += dt;
        this._attackTimer -= dt;

        const monsterParent = DataManager.Instance.monsterManager.monsterParent;
        if (!monsterParent || monsterParent.children.length === 0) return;

        const selfPos = this.node.worldPosition.clone();

        // 主动搜索（时间间隔 或 无目标 或 非移动单位的时间）
        if ((!this.isMoveMinion && this._noMoveSeachTime > this._noMoveSearchInterval)
            || !this._targetMonster || !this._targetMonster.isValid
            || this._seachTime >= this._seachInterval) {

            this._noMoveSeachTime = 0;
            this._seachTime = 0;
            this.searchNearestMonster(selfPos);
        }

        if (!this._targetMonster || !this._targetMonster.isValid) return;

        const targetPos = this._targetMonster.getWorldPosition();
        const direction = targetPos.clone().subtract(selfPos);
        direction.y = 0;
        const distance = direction.length();

        // 检测是否静止超过一定时间（仅移动单位）
        if (this.isMoveMinion) {
            if (!this._lastCheckPos) {
                this._lastCheckPos = selfPos.clone();
            }

            const distanceMoved = Vec3.distance(selfPos, this._lastCheckPos);

            if (distanceMoved > this.moveThreshold) {
                this._lastCheckPos.set(selfPos);
                this._stayTime = 0;
            } else {
                this._stayTime += dt;

                if (this._stayTime >= this.noMoveCheckInterval) {
                    this._stayTime = 0;
                    this.searchNearestMonster(selfPos); //  静止时执行再次搜索
                }
            }
        }

        const agentAid = this.agentHandleId;

        // 攻击逻辑
        if (distance < this.attackRadius) {
            if (this.isMoveMinion) {
                if (this._attackTimer <= 0) {
                    this.closeRangeAttackTarget();
                    this.scheduleOnce(() => {
                        this.skeletalAnimation?.stop();
                        this.changState(MinionStateEnum.Idle);
                    }, 2);
                    this._attackTimer = 2.5;
                }
            } else {
                if (this._attackTimer <= 0) {
                    this.attackTarget();
                    const lHand = this.node.getChildByName("Bip001 L Hand Socket");
                    const gongjian = lHand?.getChildByName("GongJian_Skin");
                    const gongjianAni = gongjian?.getComponent(Animation);
                    gongjianAni?.play("attack");

                    this.scheduleOnce(() => {
                        this.skeletalAnimation?.stop();
                        this.changState(MinionStateEnum.Idle);
                    }, 1.07);
                    this._attackTimer = this._attackCooldown;
                }
            }

            Simulator.instance.setAgentPrefVelocity(agentAid, Vec2.ZERO);
        } else {
            if (this.isMoveMinion) {
    //              if (distance > 0.01) {
    //     // 归一化方向向量
    //     direction.normalize();
    //     // 应用速度倍率
    //     const velocity = new Vec2(direction.x * moveSpeed, direction.z * moveSpeed);
    //     Simulator.instance.setAgentPrefVelocity(agentAid, velocity);
    //     this.changState(MinionStateEnum.Walk);
    // }
                Simulator.instance.setAgentPrefVelocity(agentAid, new Vec2(direction.x, direction.z));
                this.changState(MinionStateEnum.Walk);
            } else {
                this.changState(MinionStateEnum.Idle);
            }

            this.smoothLookAt(targetPos, dt);
        }
    }

    // 搜索附近的小怪
    private searchNearestMonster(selfPos: Vec3) {
        const monsterParent = DataManager.Instance.monsterManager.monsterParent;
        if (!monsterParent) return;

        let nearest: Node | null = null;
        let minDistSqr = Infinity;

        for (const monster of monsterParent.children) {
            if (!monster || !monster.isValid) continue;

            const monsterItem = monster.getComponent(MonsterItem);
            if (!monsterItem || monsterItem.isDead) continue;

            const monsterPos = monster.getWorldPosition();
            const distSqr = Vec3.squaredDistance(selfPos, monsterPos);

            if (distSqr < minDistSqr && !DataManager.Instance.MinionConManager.hasTarget(monster)) {
                minDistSqr = distSqr;
                nearest = monster;
            }
        }

        if (this._targetMonster !== nearest) {
            DataManager.Instance.MinionConManager.removeMonsterTarget(this._targetMonster);
            DataManager.Instance.MinionConManager.addMonsterTarget(nearest);
        }

        this._targetMonster = nearest;
    }

    // 自动转向
    smoothLookAt(targetPos: Vec3, dt: number, rotateSpeed: number = 10) {
        const selfPos = this.node.worldPosition;
        const dir = new Vec3();
        Vec3.subtract(dir, targetPos, selfPos);
        dir.y = 0;
        if (dir.lengthSqr() < 0.001) return;

        dir.normalize();
        const angleRad = Math.atan2(dir.x, dir.z);
        const targetY = angleRad * 180 / Math.PI;

        const currentY = this.node.eulerAngles.y;

        // 归一化差值到 [-180, 180]
        let deltaY = targetY - currentY;
        deltaY = ((deltaY + 180) % 360 + 360) % 360 - 180;

        // 使用平滑插值（slerp-like），dt 越小越平滑
        const smoothFactor = 1 - Math.exp(-rotateSpeed * dt);
        const lerpedY = currentY + deltaY * smoothFactor;

        this.node.setRotationFromEuler(0, lerpedY, 0);
    }

    // 近距离攻击
    closeRangeAttackTarget() {
        if (!this._targetMonster || !this._targetMonster.isValid) return;

        const monsterItem = this._targetMonster.getComponent(MonsterItem);
        if (!monsterItem || monsterItem.isDead) return;

        const target = this._targetMonster;
        DataManager.Instance.MinionConManager.removeMonsterTarget(this._targetMonster);

        this.changState(MinionStateEnum.AttackCloseRange)

        const targetWorldPos = target.getWorldPosition();
        this.smoothLookAt(targetWorldPos, 1);

        // 击杀小怪
        this.scheduleOnce(() => {
            DataManager.Instance.monsterManager.killMonsters([target], true, this.node);

            const skillExplosion = instantiate(this.hitExplosionProfab);
            director.getScene().addChild(skillExplosion);
            skillExplosion.setWorldPosition(new Vec3(targetWorldPos.x, targetWorldPos.y + 1, targetWorldPos.z));

            try {
                const anim = skillExplosion?.children[0]?.getComponent(Animation);
                if (anim) {
                    anim.play(`TX_Attack_hit`);
                    anim.once(Animation.EventType.FINISHED, () => {
                        try {
                            skillExplosion.destroy();
                        } catch (e) {
                            console.warn("Skill explosion destroy failed:", e);
                        }
                    });
                } else {
                    this.scheduleOnce(() => {
                        try {
                            skillExplosion.destroy();
                        } catch (e) {
                            console.warn("Skill explosion delayed destroy failed:", e);
                        }
                    }, 1);
                }
            } catch (e) {
                console.error("Animation error:", e);
                this.scheduleOnce(() => {
                    try {
                        skillExplosion.destroy();
                    } catch (e) {
                        console.warn("Fallback explosion destroy failed:", e);
                    }
                }, 1);
            }
        }, 0.47)
    }

    // 攻击目标
    attackTarget() {
        if (!this._targetMonster || !this._targetMonster.isValid) return;

        const monsterItem = this._targetMonster.getComponent(MonsterItem);
        if (!monsterItem || monsterItem.isDead) return;

        const target = this._targetMonster;
        DataManager.Instance.MinionConManager.removeMonsterTarget(this._targetMonster);
        this._targetMonster = null;

        this.changState(MinionStateEnum.Attack);

        // 面朝目标
        this.smoothLookAt(target.getWorldPosition(), 1);

        let bullet: Node;
        try {
            bullet = this.create();
            if (!bullet) return;

            //  获取发射起点（角色向后偏移 2 米 + 上抬 1.5 米）
            const startPos = this.node.worldPosition.clone();
            const forward = this.node.forward.clone().normalize();
            const bulletStart = startPos.add(forward.multiplyScalar(-2)).add(new Vec3(0, 1.5, 0));
            bullet.setWorldPosition(bulletStart);

            const targetPos = target.getWorldPosition();

            // 使用 lookAt 让子弹 -Z 轴 朝向目标
            bullet.lookAt(targetPos, Vec3.UP);

            const fixQuat = new Quat();
            Quat.fromAxisAngle(fixQuat, Vec3.UP, 90 * Math.PI / 180); // 将 X+ 转成 Z+
            const currentQuat = bullet.getRotation();
            const finalQuat = new Quat();
            Quat.multiply(finalQuat, currentQuat, fixQuat); // 原始朝向 * 补偿旋转
            bullet.setRotation(finalQuat);

            this.scheduleOnce(() => {

            }, 0.73)

            // 发射动画（从起点飞向目标）
            tween(bullet)
                .to(0.3, { worldPosition: targetPos }, { easing: 'quadInOut' })
                .call(() => {
                    try {
                        this.onProjectileDead(bullet);

                        this.scheduleOnce(() => {
                            DataManager.Instance.monsterManager.killMonsters([target]);
                            // 更新杀怪数量
                            // const partnerEnergyBar = this.node?.parent?.parent.getChildByName("PartnerEnergyBar");
                            // if (partnerEnergyBar) {
                            //     const partnerEnergyBarManager = partnerEnergyBar.getComponent(UIPartnerEnergyBarManager);
                            //     let killMonsterNum = partnerEnergyBarManager.getKillMonsterNum;
                            //     partnerEnergyBarManager.setKillMonsterNum = killMonsterNum += 1;
                            // }
                            // console.log("更新杀怪数量", this.node.parent.name, this.node.name);

                            const skillExplosion = instantiate(this.hitExplosionProfab);
                            director.getScene().addChild(skillExplosion);
                            skillExplosion.setWorldPosition(new Vec3(targetPos.x, targetPos.y + 1, targetPos.z));

                            try {
                                const anim = skillExplosion?.children[0]?.getComponent(Animation);
                                if (anim) {
                                    anim.play(`TX_Attack_hit`);
                                    anim.once(Animation.EventType.FINISHED, () => {
                                        try {
                                            skillExplosion.destroy();
                                        } catch (e) {
                                            console.warn("Skill explosion destroy failed:", e);
                                        }
                                    });
                                } else {
                                    this.scheduleOnce(() => {
                                        try {
                                            skillExplosion.destroy();
                                        } catch (e) {
                                            console.warn("Skill explosion delayed destroy failed:", e);
                                        }
                                    }, 1);
                                }
                            } catch (e) {
                                console.error("Animation error:", e);
                                this.scheduleOnce(() => {
                                    try {
                                        skillExplosion.destroy();
                                    } catch (e) {
                                        console.warn("Fallback explosion destroy failed:", e);
                                    }
                                }, 1);
                            }
                        }, 0.43)
                    } catch (e) {
                        console.error("Bullet hit logic error:", e);
                    }
                })
                .start();
        } catch (e) {
            console.error("AttackTarget failed:", e);
        }
    }

    //rov相关
    private _agentHandleId: number = -1; //RVOid
    public get agentHandleId(): number {
        return this._agentHandleId;
    }
    public set agentHandleId(value: number) {
        this._agentHandleId = value;
    }

    /**
     * 在此之前 请确保Simulator run执行完毕
     */
    moveByRvo(dt) {
        if (!this.isLookingForMonsters || !this.isMoveMinion) {
            return;
        }
        const p = Simulator.instance.getAgentPosition(this.agentHandleId);
        const targetPos = new Vec3(p.x, 0, p.y);
        const currentPos = this.node.worldPosition.clone();

        const dist = Vec3.distance(currentPos, targetPos);
        if (dist > 0.01) {
            const smoothFactor = 10;
            Vec3.lerp(currentPos, currentPos, targetPos, dt * smoothFactor);
            this.node.setWorldPosition(currentPos);
        }
    }
}