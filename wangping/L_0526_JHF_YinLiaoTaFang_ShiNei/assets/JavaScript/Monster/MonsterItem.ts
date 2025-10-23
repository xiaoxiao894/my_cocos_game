import { _decorator, Component, Node, SkeletalAnimation, CCString, Vec3, tween, Material, MeshRenderer, CCInteger, Quat, Vec2, v2, instantiate, ProgressBar, random } from 'cc';
import { DataManager, Guardrail } from '../Global/DataManager';
import { FlowField } from './FlowField';
import { Simulator } from '../RVO/Simulator';
import { RVOMath, Vector2 } from '../RVO/Common';
import { MonsterStateEnum } from '../Actor/StateDefine';
import { EntityTypeEnum, PlayerWeaponTypeEnum } from '../Enum/Index';
import { DissolveEffect } from '../../Res/DissolveEffect/scripts/DissolveEffect';
import { MathUtil } from '../Util/MathUtil';
const { ccclass, property } = _decorator;

@ccclass('MonsterItem')
export class MonsterItem extends Component {
    @property(SkeletalAnimation)
    skeletalAnimation: SkeletalAnimation = null;

    @property(CCString)
    runAniName: string = "walk_f";

    @property(CCString)
    dieAniName: string = "die";

    @property(CCInteger)
    type: number = 0;

    @property(DissolveEffect)
    dissolveEffect: DissolveEffect[] = [];

    @property(Material)
    mats: Material[] = [];

    @property(CCInteger)
    hp: number = 1;

    //rvo
    @property(CCInteger)
    hitPow: number = 5 //受击系数 系数越高 反弹力度越大

    // 成员变量（放到 class 里）
    private _aimDir: Vec3 = new Vec3(0, 0, 1);   // 缓存的平滑目标方向
    // @property({ tooltip: '方向跟随灵敏度（越大越快）' })
    turnFollow: number = 100;                     //  6~14
    // @property({ tooltip: '旋转平滑强度（越大越快）' })
    turnSmooth: number = 100;                     // 8~18
    // @property({ tooltip: '忽略极小输入的阈值' })
    deadZone: number = 1e-4;

    private currentState = null;

    private _isDead: boolean = false;
    private _index: number;

    private _noMove: boolean = false;

    private _nowHp: number = 1;
    private _bloodNode: Node = null;
    private _bloodOffset: Vec3 = new Vec3(0, 7.5, 0);

    // 闪红恢复timeout
    private redTimeout;


    private _frames: number = 0;
    private _agentHandleId: number = -1; //RVOid
    public get agentHandleId(): number {
        return this._agentHandleId;
    }
    public set agentHandleId(value: number) {
        this._agentHandleId = value;
    }

    // 攻击玩家
    private _isAttackPlayer = false;

    public init(index: number, bloodNode: Node = null, isDissolveOnce) {
        this._index = index;
        this._bloodNode = bloodNode;
        this._nowHp = this.hp;
        this._isDead = false;
        this._noMove = false;
        this._hasCountedAttack = false;
        this._assignedGuardrail = null;
        this.currentState = null;

        if (this.runAniName) {
            this.scheduleOnce(() => {
                this._isAttackPlayer = false;
                this.changState(MonsterStateEnum.Walk);
            }, 0);
        }

        if (this.type === 1) {
            DataManager.Instance.BossTipConManager.addTarget(this.node);
            this._bloodOffset = new Vec3(0, 15, 0);
        } else {
            this._bloodOffset = new Vec3(0, 7.5, 0);
        }

        if (this._bloodNode) {
            const bar: ProgressBar = this._bloodNode.getComponent(ProgressBar);
            if (bar) bar.progress = 1;
            this._bloodNode.active = false;
        }

        // 初始化时一次性绑定正常材质
        this.setMaterByIndex(0, true);
    }


    private setMaterByIndex(matIndex: number, needReset: boolean = false) {
        this.dissolveEffect.forEach((d: DissolveEffect) => {
            let mesh: MeshRenderer = d.node.getComponent(MeshRenderer);
            if (mesh) {
                let matInstance: Material = mesh.getMaterialInstance(0);
                if (matIndex === 1) {
                    matInstance.setProperty('showType', 1.0);
                } else {
                    matInstance.setProperty('showType', 0.0);
                    matInstance.setProperty('dissolveThreshold', 0.0);
                }
            }

            if (needReset) {
                d.reset();
            }
        });
    }


    public deathAni(isPlayer: boolean = false, node) {
        if (this._isDead) {
            return;
        }
        if (isPlayer) {
            //击退效果
            this._isHit = true;

            const currentPos = this.node.getWorldPosition().clone();
            const playerPos = node.getWorldPosition().clone();
            // const playerPos = DataManager.Instance.player.node.getWorldPosition().clone();

            // 计算击退方向向量
            let goalVector = new Vec2(playerPos.x, playerPos.z).subtract2f(currentPos.x, currentPos.z);

            if (node.name == "Player") {
                if (DataManager.Instance.curWeaponType == PlayerWeaponTypeEnum.CottonSwab) {
                    goalVector = goalVector.normalize().multiplyScalar(-DataManager.Instance.sceneManager.forksRepelDistance);
                } else if (DataManager.Instance.curWeaponType == PlayerWeaponTypeEnum.Knife) {
                    goalVector = goalVector.normalize().multiplyScalar(-DataManager.Instance.sceneManager.knifeRepelDistance);
                } else if (DataManager.Instance.curWeaponType == PlayerWeaponTypeEnum.Flamethrower) {
                    goalVector = goalVector.normalize().multiplyScalar(-DataManager.Instance.sceneManager.spitfireRepelDistance);
                }
            } else {
                goalVector = goalVector.normalize().multiplyScalar(-2);
            }

            // 预测击退后的终点
            const knockbackFinalPos = currentPos.clone().add(new Vec3(goalVector.x, 0, goalVector.y));

            const targetNode = new Node("Temp");
            targetNode.setWorldPosition(knockbackFinalPos);
            const isInsideDoor = DataManager.Instance.sceneManager.isNodeInsideDoorArea(targetNode);

            if (!isInsideDoor) {
                tween(this.node)
                    .by(0.15, { position: new Vec3(goalVector.x, 0, goalVector.y) })
                    .call(() => {
                        const agent = Simulator.instance.getAgentByAid(this.agentHandleId);
                        if (agent && this.node?.isValid) {
                            const newWorldPos = this.node.worldPosition;
                            agent.position_ = new Vector2(newWorldPos.x, newWorldPos.z);
                        }
                        if (this._assignedGuardrail) {
                            this._assignedGuardrail.attackingMonsterCount = Math.max(
                                0,
                                (this._assignedGuardrail.attackingMonsterCount || 1) - 1
                            );

                            this.changState(MonsterStateEnum.Walk);
                            const gAny: any = this._assignedGuardrail as any;
                            if (gAny && gAny._queue) {
                                const i = gAny._queue.indexOf(this.node);
                                if (i !== -1) gAny._queue.splice(i, 1);
                            }
                            this._assignedGuardrail = null;
                            this._hasCountedAttack = false;
                            this._noMove = false;
                        }
                        this._isHit = false;
                    })
                    .start();
            } else {
                if (this._assignedGuardrail) {
                    this._assignedGuardrail.attackingMonsterCount = Math.max(
                        0,
                        (this._assignedGuardrail.attackingMonsterCount || 1) - 1
                    );

                    this.changState(MonsterStateEnum.Walk);
                    if (this._assignedGuardrail) {
                        const gAny: any = this._assignedGuardrail as any;
                        if (gAny && gAny._queue) {
                            const i = gAny._queue.indexOf(this.node);
                            if (i !== -1) gAny._queue.splice(i, 1);
                        }
                    }

                    this._assignedGuardrail = null;
                    this._hasCountedAttack = false;
                    this._noMove = false;
                }
                this._isHit = false;
            }
        } else {
            this.updateIconPos();
        }

        if (this.redTimeout) {
            clearTimeout(this.redTimeout);
            this.redTimeout = null;
        }
        this._nowHp -= DataManager.Instance.playerWeaponDamage;
        //闪红
        this.setMaterByIndex(1);
        this.redTimeout = setTimeout(() => {
            //恢复
            this.setMaterByIndex(0);
        }, 250);
        if (this._nowHp > 0) {
            if (this._bloodNode) {
                let bar: ProgressBar = this._bloodNode.getComponent(ProgressBar);
                if (bar) {
                    bar.progress = this._nowHp / this.hp;
                }
                this._bloodNode.active = true;
            }
            if (isPlayer && DataManager.Instance.curWeaponType != PlayerWeaponTypeEnum.Flamethrower) {
                DataManager.Instance.player.monsterHitEffect([this.node]);
            }

            return;
        }
        //真死了
        this._isDead = true;

        if (this._assignedGuardrail && this._hasCountedAttack && this._assignedGuardrail.attackingMonsterCount > 0) {
            this._assignedGuardrail.attackingMonsterCount--;
        }
        this._isAttackPlayer = false;
        let timeout: number = 1330;
        if (this.type > 0) {
            timeout = 3000;
        }
        this.changState(MonsterStateEnum.Die);

        setTimeout(() => {
            this.clearData();
            DataManager.Instance.monsterManager.recycleMonster(this._index, this.node);
        }, timeout);

        if (this.type === 1) {
            DataManager.Instance.BossTipConManager.removeTarget(this.node);
        }

        this.scheduleOnce(() => {
            if (isPlayer && DataManager.Instance.curWeaponType != PlayerWeaponTypeEnum.Flamethrower) {
                DataManager.Instance.player.monsterHitEffect([this.node]);
                this.updateIconPos();
            } else {
                this.updateIconPos();
            }
        }, 0.15)

        //血条回收
        if (this._bloodNode) {
            DataManager.Instance.monsterManager.recycleBlood(this._bloodNode);
            this._bloodNode = null;
        }

        //掉落生成
        DataManager.Instance.gridSystem.removeNode(this.node);
    }

    private clearData(): void {
        if (this.agentHandleId >= 0) {
            Simulator.instance.removeAgent(this.agentHandleId);
            this._agentHandleId = -1;
        }
        this._isDead = false;
        this._aimDir.set(0, 0, 1);
        this.currentState = null;
        this._frames = 0;
        this._isAttackPlayer = false;

    }

    updateIconPos() {
        if (this.node.name == "Mantis") {
            const randomIconNum = MathUtil.getRandom(3, 5);

            const worldPos = this.node.getWorldPosition().clone();
            for (let i = 0; i < randomIconNum; i++) {
                const randius = 3;
                const angle = Math.random() * Math.PI * 2;
                const r = Math.sqrt(Math.random()) * randius;

                const offsetX = r * Math.cos(angle)
                const offsetZ = r * Math.sin(angle);

                const newRandomPos = new Vec3(worldPos.x + offsetX, worldPos.y, worldPos.z + offsetZ);
                DataManager.Instance.monsterManager.dropItem(newRandomPos);
            }
        } else {
            DataManager.Instance.monsterManager.dropItem(this.node.getWorldPosition().clone());
        }
    }

    update(dt: number) {
        if (this._isDead) {
            return;
        }
        if (this._frames++ > 8) {
            this._frames = 0
            this.setPreferredVelocities(dt) //设置追踪主角的线速度
        }

    }

    private _isHit = false;
    /**
    * 设置追踪主角的线速度方向和大小
    */
    //_tmpScale: Vec3 = new Vec3()
    // 怪物 RVO 移动与护栏攻击逻辑
    private _isExecuteRvo = true;
    private _assignedGuardrail: Guardrail = null;
    private _hasCountedAttack: boolean = false;
    setPreferredVelocities(dt: number) {
        if (this.agentHandleId < 0 || DataManager.Instance.guardrailArr.length <= 0) return;

        // —— 可调参数 ——
        const FRONT_DIST = 2.6;  // 前排离护栏表面的距离
        const SIDE_SPACING = 1.2;  // 前排左右间距（需 ≥ 2*agentRadius + 余量）
        const QUEUE_SPACING = 1.0;  // 后排纵向间距（需 ≥ 2*agentRadius + 余量）
        const ARRIVE_RADIUS = 5.5;  // 到达判定半径（米）
        const MAX_SPEED = 10.0;  // 期望速度上限（如有 this.moveSpeed，用它替换）
        const SEP_R = 0.8;  // 到达后分离半径
        const SEP_K = 0.8;  // 到达后分离强度（0.5~1.0 之间试）

        const playerPos = DataManager.Instance.player.node.getWorldPosition();
        let moveTarget: Vec2 = v2(playerPos.x, playerPos.z);
        let worldTarget: Vec3 = new Vec3(playerPos.x, 0, playerPos.z);

        const isPlayerInDoorArea = DataManager.Instance.sceneManager.isNodeInsideDoorArea(DataManager.Instance.player.node);

        if (isPlayerInDoorArea) {
            const monsterPos = this.node.worldPosition.clone();

            // 1) 选最近护栏（入口不再以 attackingCount 限制，站位由队列决定）
            let nearestGuardrail: Guardrail = null;
            let minDistSqr = Infinity;
            for (const g of DataManager.Instance.guardrailArr) {
                const gp = g.node.worldPosition;
                const d2 = Vec3.squaredDistance(monsterPos, gp);
                if (d2 < minDistSqr) { minDistSqr = d2; nearestGuardrail = g; }
            }

            // 2) 绑定护栏（只加一次计数；队列用 _queue 管理）
            if (nearestGuardrail && !this._assignedGuardrail) {
                this._assignedGuardrail = nearestGuardrail;
                this._assignedGuardrail.attackingMonsterCount = (this._assignedGuardrail.attackingMonsterCount || 0) + 1;
            }

            if (this._assignedGuardrail) {
                const grAny: any = this._assignedGuardrail as any;
                if (!grAny._queue) grAny._queue = [];

                // 清理无效
                for (let i = grAny._queue.length - 1; i >= 0; i--) {
                    if (!grAny._queue[i]?.isValid) grAny._queue.splice(i, 1);
                }
                // 入队（去重）
                if (!grAny._queue.includes(this.node)) grAny._queue.push(this.node);

                // 3) 护栏的稳定 forward / right（注意模型本地方向）
                const gNode = this._assignedGuardrail.node;
                const gPos = gNode.worldPosition;
                const gRot = gNode.worldRotation;

                // 若列队方向反了，把 -Z 改为 +Z
                const forward = new Vec3(0, 0, -1);
                Vec3.transformQuat(forward, forward, gRot);
                forward.y = 0; forward.normalize();

                const right = new Vec3(1, 0, 0);
                Vec3.transformQuat(right, right, gRot);
                right.y = 0; right.normalize();

                // 4) 序号与插槽点
                const idx = grAny._queue.indexOf(this.node);
                let lateral = 0;
                let depth = FRONT_DIST;

                if (idx === 0) {
                    lateral = -0.5 * SIDE_SPACING; // 左
                } else if (idx === 1) {
                    lateral = +0.5 * SIDE_SPACING; // 右
                } else {
                    depth = FRONT_DIST + (idx - 1) * QUEUE_SPACING; // 后排纵向
                    lateral = 0;
                }

                const adjustedPos = new Vec3(
                    gPos.x - forward.x * depth + right.x * lateral,
                    gPos.y,
                    gPos.z - forward.z * depth + right.z * lateral
                );

                moveTarget = v2(adjustedPos.x, adjustedPos.z);
                worldTarget = new Vec3(adjustedPos.x, 0, adjustedPos.z);
            }
        } else {
            // —— 玩家不在门区：保持原逻辑 —— 
            if (this._assignedGuardrail) {
                if (this._hasCountedAttack) {
                    this.rotateTowards(this._assignedGuardrail.node.worldPosition, dt);
                    Simulator.instance.setAgentPrefVelocity(this.agentHandleId, Vec2.ZERO);
                    return;
                }

                const count = this._assignedGuardrail.attackingMonsterCount || 0;
                const guardrailPos = this._assignedGuardrail.node.worldPosition;
                moveTarget = v2(guardrailPos.x, guardrailPos.z);
                worldTarget = new Vec3(guardrailPos.x, 0, guardrailPos.z);

                if (count === 0) {
                    const monsterPos = this.node.worldPosition.clone();
                    const d2 = Vec3.squaredDistance(playerPos, monsterPos);
                    const playerRange = 0.3;
                    if (d2 <= playerRange * playerRange) {
                        // 离开护栏：从队列中移除
                        const gAny: any = this._assignedGuardrail as any;
                        if (gAny && gAny._queue) {
                            const i = gAny._queue.indexOf(this.node);
                            if (i !== -1) gAny._queue.splice(i, 1);
                        }
                        this._assignedGuardrail = null;
                        this._hasCountedAttack = false;
                        this._noMove = false;
                        moveTarget = v2(playerPos.x, playerPos.z);
                        worldTarget = new Vec3(playerPos.x, 0, playerPos.z);
                    }
                }
            }
        }

        // ======= 到达判定 + 期望速度（单位化） + 到达后轻分离 =======
        const agentAid = this.agentHandleId;
        const agent = Simulator.instance.getAgentByAid(agentAid);
        const agentPos = Simulator.instance.getAgentPosition(agentAid);

        if (this._isHit) return;

        if (agent && agentPos) {
            const goalVector = moveTarget.subtract2f(agentPos.x, agentPos.y);
            const distSqr = goalVector.lengthSqr();
            const hasArrived = Vec3.squaredDistance(this.node.worldPosition, worldTarget) <= (ARRIVE_RADIUS * ARRIVE_RADIUS);

            if (hasArrived) {
                if (this.currentState !== MonsterStateEnum.Attack) {
                    this.changState(MonsterStateEnum.Attack);
                    if (
                        Vec3.equals(worldTarget, DataManager.Instance.player.node.worldPosition) &&
                        !this._isDead &&
                        this.node.name === "Mantis"
                    ) {
                        this._isAttackPlayer = true;
                    }
                }

                // —— 到达后给极轻的“分离速度”，只对同护栏队列 —— 
                let sepX = 0, sepZ = 0;
                const gAny: any = this._assignedGuardrail as any;
                if (gAny && gAny._queue) {
                    const me = this.node.worldPosition;
                    for (const n of gAny._queue) {
                        if (!n?.isValid || n === this.node) continue;
                        const op = n.worldPosition;
                        const dx = me.x - op.x, dz = me.z - op.z;
                        const d2 = dx * dx + dz * dz;
                        if (d2 > 1e-6 && d2 < SEP_R * SEP_R) {
                            const d = Math.sqrt(d2);
                            const s = (1 - d / SEP_R) * SEP_K;
                            sepX += (dx / d) * s;
                            sepZ += (dz / d) * s;
                        }
                    }
                }
                // 限幅避免抖动
                const mag = Math.hypot(sepX, sepZ);
                if (mag > MAX_SPEED * 0.3 && mag > 0) {
                    sepX *= (MAX_SPEED * 0.3 / mag);
                    sepZ *= (MAX_SPEED * 0.3 / mag);
                }
                Simulator.instance.setAgentPrefVelocity(agentAid, new Vec2(sepX, sepZ));

                if (this._assignedGuardrail) {
                    this.rotateTowards(this._assignedGuardrail.node.worldPosition, dt);
                    this._hasCountedAttack = true;
                }
                return;
            } else {
                if (this.currentState !== MonsterStateEnum.Walk) {
                    this.changState(MonsterStateEnum.Walk);
                }
            }

            // —— 未到达：单位化速度 × MAX_SPEED —— 
            if (distSqr < RVOMath.RVO_EPSILON) {
                Simulator.instance.setAgentPrefVelocity(agentAid, Vec2.ZERO);
            } else {
                const len = Math.sqrt(distSqr);
                const vx = (goalVector.x / len) * MAX_SPEED;
                const vy = (goalVector.y / len) * MAX_SPEED;
                Simulator.instance.setAgentPrefVelocity(agentAid, new Vec2(vx, vy));
            }

            // 朝向速度方向
            // 将你的 2D goalVector(x,y) 转为水平 3D forward(x,0,z)
            const desired = new Vec3(goalVector.x, 0, goalVector.y);
            if (desired.lengthSqr() > this.deadZone) {
                desired.normalize();

                // === 1) 方向输入低通滤波（抑制目标抖动） ===
                // alphaFollow = 1 - exp(-turnFollow * dt) ：帧率无关
                const alphaFollow = 1 - Math.exp(-this.turnFollow * dt);
                Vec3.lerp(this._aimDir, this._aimDir, desired, alphaFollow);
                this._aimDir.normalize();

                // 目标旋转
                const targetRotation = new Quat();
                Quat.fromViewUp(targetRotation, this._aimDir, Vec3.UP);

                // === 2) 四元数指数平滑（更顺不发飘） ===
                const currentRotation = this.node.worldRotation;
                const alphaRot = 1 - Math.exp(-this.turnSmooth * dt); // 帧率无关
                const slerped = new Quat();
                Quat.slerp(slerped, currentRotation, targetRotation, alphaRot);

                // 角度很小时直接吸附，避免细微颤动
                // （可选）阈值约 0.5°：比较四元数点积接近 1
                const dot = Quat.dot(slerped, targetRotation);
                if (dot > 0.99996) { // ~0.5°
                    this.node.worldRotation = targetRotation;
                } else {
                    this.node.worldRotation = slerped;
                }
            }
        } else {
            console.error("RVO异常::", agent, agentPos, agentAid);
        }
    }


    private rotateTowards(targetWorldPos: Vec3, dt: number) {
        const currentPos = this.node.worldPosition.clone();
        const dir = new Vec3();
        Vec3.subtract(dir, targetWorldPos, currentPos);
        dir.y = 0;
        dir.normalize();

        if (dir.lengthSqr() < 0.0001) return;

        const targetQuat = new Quat();
        Quat.fromViewUp(targetQuat, dir, Vec3.UP);

        const currentQuat = this.node.worldRotation.clone();
        const resultQuat = new Quat();
        Quat.slerp(resultQuat, currentQuat, targetQuat, Math.min(1, dt * 400));
        this.node.worldRotation = resultQuat;
    }

    /**
     * 在此之前 请确保Simulator run执行完毕
     */
    moveByRvo(dt) {
        if (this._isDead) return;
        // if (this._noMove) {
        //     return;
        // }

        // //栅栏边上的怪不移动
        // if (this._hasCountedAttack) {
        //     this._noMove = true;
        // }

        if (this.agentHandleId == -1) return;

        const p = Simulator.instance.getAgentPosition(this.agentHandleId);
        const targetPos = new Vec3(p.x, 0, p.y);
        const currentPos = this.node.worldPosition.clone();

        const dist = Vec3.distance(currentPos, targetPos);
        if (dist > 0.01) {
            const smoothFactor = 10;
            Vec3.lerp(currentPos, currentPos, targetPos, dt * smoothFactor);
            this.node.setWorldPosition(currentPos);
            DataManager.Instance.gridSystem?.updateNode(this.node);
        }

        //同步更新血条位置
        if (this._bloodNode) {
            let bloodPos: Vec3 = new Vec3();
            Vec3.add(bloodPos, currentPos, this._bloodOffset);
            this._bloodNode.setWorldPosition(bloodPos);
        }

    }

    changState(state: MonsterStateEnum | string, time = 0) {
        if (state == this.currentState) {
            return;
        }
        if (this.currentState == MonsterStateEnum.Die) {
            return;
        }

        this.skeletalAnimation?.stop();
        // if (state === MonsterStateEnum.Die) {
        //     this.skeletalAnimation?.play(state as string)
        //     // 播放一次动画以初始化动画状态

        // } else {
        this.skeletalAnimation?.play(state as string)
        // }

        this.currentState = state;
    }

    private attack() {
        if (this._isAttackPlayer) {
            DataManager.Instance.uiWarnManager.playWarnFadeAnimation();
        }
        //打护栏
        if (this._assignedGuardrail) {
            //护栏掉血
            if (this._assignedGuardrail.blood > 0 && this._assignedGuardrail.node.name.indexOf("Z") === -1) {
                this._assignedGuardrail.blood -= 1;
                let bloodNode = this._assignedGuardrail.node.getChildByName("FenceBloodBar");
                if (!bloodNode) {
                    const fenceBloodBar = DataManager.Instance.prefabMap.get(EntityTypeEnum.FenceBloodBar)
                    bloodNode = instantiate(fenceBloodBar);
                    if (!bloodNode) {
                        return;
                    }
                    bloodNode.setScale(this._assignedGuardrail.node.scale.x * bloodNode.scale.x, this._assignedGuardrail.node.scale.y * bloodNode.scale.y, this._assignedGuardrail.node.scale.z * bloodNode.scale.z)
                    this._assignedGuardrail.node?.children[0]?.setScale(this._assignedGuardrail.node.scale.x * this._assignedGuardrail.node?.children[0].scale.x, this._assignedGuardrail.node.scale.y * this._assignedGuardrail.node?.children[0].scale.y, this._assignedGuardrail.node.scale.z * this._assignedGuardrail.node?.children[0].scale.z)
                    this._assignedGuardrail.node.setScale(1, 1, 1)
                    bloodNode.parent = this._assignedGuardrail.node;
                }
                bloodNode.active = true;
                let bloodBar: ProgressBar = bloodNode.getComponent(ProgressBar);
                if (bloodBar) {
                    bloodBar.progress = this._assignedGuardrail.blood / DataManager.Instance.guardrailBlood;
                }
            }

            //闪白
            if (this._assignedGuardrail.node.name.includes("Door")) {
                //门
                let leftNode = this._assignedGuardrail.node.getChildByPath("Door_Left")?.children[0]?.children[0];
                if (leftNode) {
                    let leftMesh: MeshRenderer = leftNode.getComponent(MeshRenderer);
                    if (leftMesh) {
                        leftMesh.setMaterial(DataManager.Instance.sceneManager.doorMaterials[1], 0);
                        setTimeout(() => {
                            leftMesh.setMaterial(DataManager.Instance.sceneManager.doorMaterials[0], 0);
                        }, 50);
                    }
                }
                let rightNode = this._assignedGuardrail.node.getChildByPath("Door_Right")?.children[0]?.children[0];
                if (rightNode) {
                    let rightMesh: MeshRenderer = rightNode.getComponent(MeshRenderer);
                    if (rightMesh) {
                        rightMesh.setMaterial(DataManager.Instance.sceneManager.doorMaterials[1], 0);
                        setTimeout(() => {
                            rightMesh.setMaterial(DataManager.Instance.sceneManager.doorMaterials[0], 0);
                        }, 50);
                    }
                }
            } else {
                //围栏
                let fenceNode = this._assignedGuardrail.node.getChildByName("He_b");
                if (fenceNode) {
                    let fenceMesh: MeshRenderer = fenceNode.getComponent(MeshRenderer);
                    if (fenceMesh) {
                        fenceMesh.setMaterial(DataManager.Instance.sceneManager.guardrailMaterials[1], 0);
                        setTimeout(() => {
                            fenceMesh.setMaterial(DataManager.Instance.sceneManager.guardrailMaterials[0], 0);
                        }, 50);
                    }
                }
            }
        }
    }

    /**
     * 如果是打人，检测人是否远离，远离动画切换成走路
     */
    private attackOver() {
        if (this._isAttackPlayer) {
            const playerPos = DataManager.Instance.player.node.getWorldPosition();
            const monsterPos = this.node.getWorldPosition();
            const distSqr = Vec3.squaredDistance(playerPos, monsterPos);
            if (distSqr > 16) {
                this.changState(MonsterStateEnum.Walk);
                this._isAttackPlayer = false;
            }
        }
    }

    get isDead() {
        return this._isDead;
    }
}



