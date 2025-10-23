import { _decorator, Component, Node, SkeletalAnimation, CCString, Vec3, tween, Material, MeshRenderer, CCInteger, Quat, Vec2, v2, instantiate, ProgressBar, random } from 'cc';
import { DataManager, Guardrail } from '../Global/DataManager';
import { FlowField } from './FlowField';
import { Simulator } from '../RVO/Simulator';
import { RVOMath, Vector2 } from '../RVO/Common';
import { MonsterStateEnum } from '../Actor/StateDefine';
import { EntityTypeEnum } from '../Enum/Index';
import { DissolveEffect } from '../../Res/DissolveEffect/scripts/DissolveEffect';
import { MathUtil } from '../Util/MathUtil';
const { ccclass, property } = _decorator;

const targetNode = new Node("Temp");

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
    private _lastPathHasObstacle: boolean = false;
    private _checkCounter: number = 0;

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
        if (this.runAniName) {
            this.scheduleOnce(() => {
                this._isAttackPlayer = false
                this.changState(MonsterStateEnum.Walk);
            }, 0);
        }
        if (this.type === 1) {
            DataManager.Instance.BossTipConManager.addTarget(this.node);
            this._bloodOffset = new Vec3(0, 10, 0);
        } else {
            this._bloodOffset = new Vec3(0, 4.5, 0);
        }

        if (this._bloodNode) {
            let bar: ProgressBar = this._bloodNode.getComponent(ProgressBar);
            if (bar) {
                bar.progress = 1;
            }
            this._bloodNode.active = false;
        }

        //初始化材质
        this.dissolveEffect.forEach((d: DissolveEffect) => {
            this.setMaterByIndex(d.node, 0);
            if (isDissolveOnce) {
                this.warmUpMaterial(d.node, 1);
                this.warmUpMaterial(d.node, 2);
            }
            d.reset();
        });
    }

    private setMaterByIndex(node: Node, matIndex: number) {
        let mesh: MeshRenderer = node.getComponent(MeshRenderer);
        if (mesh) {
            mesh.setMaterial(this.mats[matIndex], 0);
            if (this.type === 1) {
                //大怪需要挂双材质
                if (matIndex == 1) {
                    mesh.setMaterial(this.mats[matIndex], 1);

                } else {
                    mesh.setMaterial(this.mats[matIndex + 3], 1);
                }
            }
        }
    }

    public warmUpMaterial(node, index: number) {
        let mesh: MeshRenderer = node.getComponent(MeshRenderer);
        if (!mesh) return;

        mesh.setMaterial(this.mats[index], 0);

        if (this.type === 1) {
            if (index === 1) {
                mesh.setMaterial(this.mats[index], 1);
            } else {
                mesh.setMaterial(this.mats[index + 3], 1);
            }
        }

        this.scheduleOnce(() => {
            mesh.setMaterial(this.mats[0], 0);
            if (this.type === 1) {
                mesh.setMaterial(this.mats[0 + 3], 1);
            }
        })

    }

    public deathAni(isPlayer: boolean = false) {
        if (this._isDead) {
            return;
        }

        if (this.redTimeout) {
            clearTimeout(this.redTimeout);
            this.redTimeout = null;
        }
        this._nowHp--;
        if (this._nowHp > 0) {
            if (isPlayer) {
                //击退效果
                this._isHit = true;

                const agentAid = this.agentHandleId;
                const currentPos = this.node.getWorldPosition().clone();
                const playerPos = DataManager.Instance.player.node.getWorldPosition().clone();

                // 计算击退方向向量
                let goalVector = new Vec2(playerPos.x, playerPos.z).subtract2f(currentPos.x, currentPos.z);
                goalVector = goalVector.normalize().multiplyScalar(-this.hitPow);

                // 预测击退后的终点
                const knockbackFinalPos = currentPos.clone().add(new Vec3(goalVector.x, 0, goalVector.y));

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
                        this._assignedGuardrail = null;
                        this._hasCountedAttack = false;
                        this._noMove = false;
                    }
                    this._isHit = false;
                }
            }
            if (this._bloodNode) {
                let bar: ProgressBar = this._bloodNode.getComponent(ProgressBar);
                if (bar) {
                    bar.progress = this._nowHp / this.hp;
                }
                this._bloodNode.active = true;
            }
            if (isPlayer) {
                DataManager.Instance.player.monsterHitEffect([this.node]);
            }
            //闪红
            this.dissolveEffect.forEach((d: DissolveEffect) => {
                this.setMaterByIndex(d.node, 1);
            });
            this.redTimeout = setTimeout(() => {
                //恢复
                this.dissolveEffect.forEach((d) => {
                    this.setMaterByIndex(d.node, 0);
                });
            }, 250);
            return;
        }

        if (isPlayer) {
            //击退效果
            this._isHit = true;

            const agentAid = this.agentHandleId;
            const currentPos = this.node.getWorldPosition().clone();
            const playerPos = DataManager.Instance.player.node.getWorldPosition().clone();

            // 计算击退方向向量
            let goalVector = new Vec2(playerPos.x, playerPos.z).subtract2f(currentPos.x, currentPos.z);
            goalVector = goalVector.normalize().multiplyScalar(-this.hitPow - 1.5);

            // 预测击退后的终点
            const knockbackFinalPos = currentPos.clone().add(new Vec3(goalVector.x, 0, goalVector.y));

            targetNode.setWorldPosition(knockbackFinalPos);
            const isInsideDoor = DataManager.Instance.sceneManager.isNodeInsideDoorArea(targetNode);

            if (!isInsideDoor) {
                // const dir2 = goalVector.clone().normalize();
                // const goal1 = this.hitPow;
                // const goal2 = this.hitPow + 2;
                // const seg1 = new Vec3(dir2.x * goal1, 0, dir2.y * goal1);
                // const seg2 = new Vec3(dir2.x * goal2, 0, dir2.y * goal2);
                goalVector = goalVector.normalize().multiplyScalar(-4.5);
                const goalVectorOne = goalVector.normalize().multiplyScalar(-4.5 - 1.5);
                tween(this.node)
                    .by(0.1, { position: new Vec3(goalVector.x, 0, goalVector.y) })
                    .by(0.15, { position: new Vec3(goalVectorOne.x, 0, goalVectorOne.y) })
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
                    this._assignedGuardrail = null;
                    this._hasCountedAttack = false;
                    this._noMove = false;
                }
                this._isHit = false;
            }
        }

        //真死了
        this._isDead = true;

        if (this._assignedGuardrail && this._hasCountedAttack && this._assignedGuardrail.attackingMonsterCount > 0) {
            this._assignedGuardrail.attackingMonsterCount--;
        }
        this._isAttackPlayer = false;

        // let timeout: number = 650;
        // if (this.type > 0) {
        //     timeout = 880;
        // }
        //闪红
        this.dissolveEffect.forEach((d: DissolveEffect) => {
            this.setMaterByIndex(d.node, 1);
        });

        this.changState(MonsterStateEnum.Die);

        //消融
        // setTimeout(() => {
        this.scheduleOnce(() => {
            this.dissolveEffect.forEach((d) => {
                this.setMaterByIndex(d.node, 0);
                // d.init();
                // d.play(0.5);
            });
        }, 250 / 1000)

        // }, 250);

        this.scheduleOnce(() => {
            DataManager.Instance.monsterManager.recycleMonster(this._index, this.node);
        }, 1300 / 1000)
        // setTimeout(() => {
        //     DataManager.Instance.monsterManager.recycleMonster(this._index, this.node);
        // }, 1330);

        if (this.type === 1) {
            DataManager.Instance.BossTipConManager.removeTarget(this.node);
        }

        this.scheduleOnce(() => {
            if (isPlayer) {
                DataManager.Instance.player.monsterHitEffect([this.node]);
                this.updateIconPos();
            } else {
                this.updateIconPos();
            }
        }, 0.15)

        //血条回收
        if (this._bloodNode) {
            DataManager.Instance.monsterManager.recycleBlood(this._bloodNode);
        }

        //掉落生成
        DataManager.Instance.gridSystem.removeNode(this.node);
    }

    updateIconPos() {
        // if (this.node.name == "Mantis") {
        const randomIconNum = MathUtil.getRandom(2, 3);

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
        // } else {
        //     DataManager.Instance.monsterManager.dropItem(this.node.getWorldPosition().clone());
        // }
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

        const FRONT_DIST = 2;// 前排离护栏表面的距离
        const SIDE_SPACING = 1.5; // 前排左右间距
        const QUEUE_SPACING = 1.0; // 后排纵向间距
        let ARRIVE_RADIUS = 0.5; // 到达判定半径（米）
        const MAX_SPEED = 12.0;// 期望速度上限
        const SEP_R = 0.8; // 到达后分离半径
        const SEP_K = 0.8; // 到达后分离强度

        const GUARDRAIL_ENGAGE_RADIUS = 12.0;   // 进入半径
        const GUARDRAIL_DISENGAGE_RADIUS = 16.0; // 脱离半径
        const GUARDRAIL_ATTACK_RADIUS = 7.0;     // 攻击门槛

        // 分散策略参数
        const REBALANCE_DIFF = 2;                // 最近护栏队列
        const DIST_REBALANCE_FACTOR = 1.25;      // 只有当“更短队列的栅栏”距离 ≤ 最近距离 * 1.25 时才会换，避免跨场
        const SOFT_MAX_PER_G = Infinity;

        // —— 贴墙触发/不可达容差
        const FACE_TRIGGER = 1.0;
        const SIDE_TOL = 1.1;
        const BIND_RADIUS = 4.0;           // 门外：靠近自动绑定
        const ATTACK_TRIGGER_RADIUS = 1.2; // 门外：贴近护栏中心触发
        const UNREACH_EPS = 0.3;

        const playerPos = DataManager.Instance.player.node.getWorldPosition();
        const isPlayerInDoorArea = DataManager.Instance.sceneManager.isNodeInsideDoorArea(DataManager.Instance.player.node);
        ARRIVE_RADIUS = isPlayerInDoorArea ? 7 : 4.5;

        let moveTarget = new Vec2(playerPos.x, playerPos.z);
        let worldTarget = new Vec3(playerPos.x, 0, playerPos.z);

        // 工具：队列维护
        const ensureQueue = (g: Guardrail) => {
            const anyG: any = g as any;
            if (!anyG._queue) anyG._queue = [];
            for (let i = anyG._queue.length - 1; i >= 0; i--) {
                if (!anyG._queue[i]?.isValid) anyG._queue.splice(i, 1);
            }
            return anyG._queue as Node[];
        };
        const queueLen = (g: Guardrail) => ensureQueue(g).length;

        // 最近护栏（与距离）
        const getNearestGuardrail = (pos: Vec3) => {
            let nearest: Guardrail | null = null;
            let bestD2 = Infinity;
            for (const g of DataManager.Instance.guardrailArr) {
                const d2 = Vec3.squaredDistance(pos, g.node.worldPosition);
                if (d2 < bestD2) { bestD2 = d2; nearest = g; }
            }
            return { nearest, dist: Math.sqrt(bestD2) };
        };

        // 门外：靠近自动绑定（保持原有）
        const bindNearestGuardrailIfClose = () => {
            if (this._assignedGuardrail) return;
            const me = this.node.worldPosition;
            const { nearest, dist } = getNearestGuardrail(me);
            if (nearest && dist <= BIND_RADIUS) {
                this._assignedGuardrail = nearest;
                (this._assignedGuardrail as any).attackingMonsterCount =
                    (this._assignedGuardrail as any).attackingMonsterCount || 0;
                (this._assignedGuardrail as any).attackingMonsterCount += 1;

                const q = ensureQueue(nearest);
                if (q.indexOf(this.node) === -1) q.push(this.node);
            }
        };

        // 插槽
        const computeGuardrailSlot = (g: Guardrail, idx: number) => {
            const gNode = g.node;
            const gPos = gNode.worldPosition;
            const gRot = gNode.worldRotation;

            const forward = new Vec3(0, 0, -1);
            Vec3.transformQuat(forward, forward, gRot);
            forward.y = 0; forward.normalize();

            const right = new Vec3(1, 0, 0);
            Vec3.transformQuat(right, right, gRot);
            right.y = 0; right.normalize();

            let lateral = 0, depth = FRONT_DIST;
            if (idx === 0) lateral = -0.5 * SIDE_SPACING;
            else if (idx === 1) lateral = 0.5 * SIDE_SPACING;
            else { depth = FRONT_DIST + (idx - 1) * QUEUE_SPACING; lateral = 0; }

            const slot = new Vec3(
                gPos.x - forward.x * depth + right.x * lateral,
                gPos.y,
                gPos.z - forward.z * depth + right.z * lateral
            );
            return { slot, forward, right };
        };

        // 面触发（护栏“法向”）
        const isTouchingGuardrailFace = (g: Guardrail, pos: Vec3): boolean => {
            if (!g?.node?.isValid) return false;
            const gNode = g.node;
            const gPos = gNode.worldPosition;
            const gRot = gNode.worldRotation;

            const forward = new Vec3(0, 0, -1);
            Vec3.transformQuat(forward, forward, gRot);
            forward.y = 0; forward.normalize();

            const right = new Vec3(1, 0, 0);
            Vec3.transformQuat(right, right, gRot);
            right.y = 0; right.normalize();

            const delta = new Vec3(pos.x - gPos.x, 0, pos.z - gPos.z);
            const depth = -Vec3.dot(delta, forward);
            const lateralAbs = Math.abs(Vec3.dot(delta, right));
            const lateralLimit = (SIDE_TOL * 0.5 + SIDE_SPACING * 0.5);
            return depth >= 0 && depth <= FACE_TRIGGER && lateralAbs <= lateralLimit;
        };

        // —— 主逻辑 —— 
        if (isPlayerInDoorArea) {
            const me = this.node.worldPosition.clone();

            // 进入/脱离圈判断
            const { nearest, dist: nearestDist } = getNearestGuardrail(me);
            const bound = this._assignedGuardrail;
            const boundDist = bound ? Vec3.distance(me, bound.node.worldPosition) : Infinity;

            const allowGuardrail =
                (nearest && nearestDist <= GUARDRAIL_ENGAGE_RADIUS) ||
                (bound && boundDist <= GUARDRAIL_DISENGAGE_RADIUS);

            if (!allowGuardrail) {
                // 已绑定但跑远：解绑
                if (bound && boundDist >= GUARDRAIL_DISENGAGE_RADIUS) {
                    const anyOld: any = bound as any;
                    const oq = anyOld._queue || [];
                    const i = oq.indexOf(this.node);
                    if (i !== -1) oq.splice(i, 1);
                    this._assignedGuardrail = null;
                    this._hasCountedAttack = false;
                }
                // 回退：追玩家
                moveTarget = new Vec2(playerPos.x, playerPos.z);
                worldTarget = new Vec3(playerPos.x, 0, playerPos.z);

            } else {
                // —— 就近优先 + 分散 —— 
                // 1) 收集进入圈内的候选（距离与队列）
                type Cand = { g: Guardrail; d: number; ql: number; };
                const cands: Cand[] = [];
                for (const g of DataManager.Instance.guardrailArr) {
                    if (!g?.node?.isValid) continue;
                    const d = Math.sqrt(Vec3.squaredDistance(me, g.node.worldPosition));
                    if (d <= GUARDRAIL_ENGAGE_RADIUS) {
                        const ql = queueLen(g);
                        // 软上限：若开启，仅把未达上限的放优先级更高
                        cands.push({ g, d, ql });
                    }
                }
                if (cands.length > 0) {
                    cands.sort((a, b) => a.d - b.d);
                    const nearestCand = cands[0];
                    const minQL = cands.reduce((m, c) => Math.min(m, c.ql), Infinity);

                    let chosen = nearestCand.g;

                    // 若最近那条队列比全局最短队列长得多，尝试换去“最短队列中距离也不算太远”的那条
                    if (nearestCand.ql - minQL >= REBALANCE_DIFF) {
                        let alt: Cand | null = null;
                        for (const c of cands) {
                            if (c.ql === minQL && c.d <= nearestCand.d * DIST_REBALANCE_FACTOR) {
                                if (!alt || c.d < alt.d) alt = c;
                            }
                        }
                        if (alt) chosen = alt.g;
                    }

                    // 如果设置了软上限且最近已达上限，尝试找最近的未达上限者
                    if (SOFT_MAX_PER_G !== Infinity && nearestCand.ql >= SOFT_MAX_PER_G) {
                        let alt2: Cand | null = null;
                        for (const c of cands) {
                            if (c.ql < SOFT_MAX_PER_G) { alt2 = c; break; }
                        }
                        if (alt2) chosen = alt2.g;
                    }

                    // 绑定/切换 & 入队
                    if (!this._assignedGuardrail) {
                        this._assignedGuardrail = chosen;
                        this._assignedGuardrail.attackingMonsterCount =
                            (this._assignedGuardrail.attackingMonsterCount || 0) + 1;
                    } else if (this._assignedGuardrail !== chosen) {
                        const oldAny: any = this._assignedGuardrail as any;
                        const oq = oldAny._queue || [];
                        const i = oq.indexOf(this.node);
                        if (i !== -1) oq.splice(i, 1);
                        this._assignedGuardrail = chosen;
                        this._assignedGuardrail.attackingMonsterCount =
                            (this._assignedGuardrail.attackingMonsterCount || 0) + 1;
                    }
                    const q = ensureQueue(this._assignedGuardrail);
                    if (q.indexOf(this.node) === -1) q.push(this.node);

                    const idx = q.indexOf(this.node);
                    const { slot } = computeGuardrailSlot(this._assignedGuardrail, idx);
                    moveTarget = new Vec2(slot.x, slot.z);
                    worldTarget = new Vec3(slot.x, 0, slot.z);
                } else {
                    // 圈内没有候选（极端情况），回退追玩家
                    moveTarget = new Vec2(playerPos.x, playerPos.z);
                    worldTarget = new Vec3(playerPos.x, 0, playerPos.z);
                }
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
     * 在此之前请确保 Simulator.run 已执行
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

    // private rotateTowards(targetWorldPos: Vec3, dt: number) {
    //     const currentPos = this.node.worldPosition.clone();
    //     const dir = new Vec3();
    //     Vec3.subtract(dir, targetWorldPos, currentPos);
    //     dir.y = 0;
    //     dir.normalize();

    //     if (dir.lengthSqr() < 0.0001) return;

    //     const targetQuat = new Quat();
    //     Quat.fromViewUp(targetQuat, dir, Vec3.UP);

    //     const currentQuat = this.node.worldRotation.clone();
    //     const resultQuat = new Quat();
    //     Quat.slerp(resultQuat, currentQuat, targetQuat, Math.min(1, dt * 40));
    //     this.node.worldRotation = resultQuat;
    // }

    // /**
    //  * 在此之前 请确保Simulator run执行完毕
    //  */
    // moveByRvo(dt) {
    //     if (this._isDead) return;
    //     // if (this._noMove) {
    //     //     return;
    //     // }

    //     // //栅栏边上的怪不移动
    //     // if (this._hasCountedAttack) {
    //     //     this._noMove = true;
    //     // }

    //     if (this.agentHandleId == -1) return;

    //     const p = Simulator.instance.getAgentPosition(this.agentHandleId);
    //     const targetPos = new Vec3(p.x, 0, p.y);
    //     const currentPos = this.node.worldPosition.clone();

    //     const dist = Vec3.distance(currentPos, targetPos);
    //     if (dist > 0.01) {
    //         const smoothFactor = 10;
    //         Vec3.lerp(currentPos, currentPos, targetPos, dt * smoothFactor);
    //         this.node.setWorldPosition(currentPos);
    //         DataManager.Instance.gridSystem?.updateNode(this.node);
    //     }

    //     //同步更新血条位置
    //     if (this._bloodNode) {
    //         let bloodPos: Vec3 = new Vec3();
    //         Vec3.add(bloodPos, currentPos, this._bloodOffset);
    //         this._bloodNode.setWorldPosition(bloodPos);
    //     }
    // }

    changState(state: MonsterStateEnum | string) {
        if (state == this.currentState) {
            return;
        }
        if (state === MonsterStateEnum.Die) {
            this.skeletalAnimation?.crossFade(state as string,)

            // 播放一次动画以初始化动画状态
            // this.skeletalAnimation.play(MonsterStateEnum.Attack);

            // const state = this.skeletalAnimation.getState(MonsterStateEnum.Attack);
            // if (!state) return;

            // state.update(0); // 强制立即应用该时间的骨骼姿势
            // state.pause();
        } else {
            this.skeletalAnimation?.crossFade(state as string, 0.1)
        }

        this.currentState = state;
    }

    private attack() {
        if (this._isAttackPlayer) {
            DataManager.Instance.uiWarnManager.playWarnFadeAnimation();
        }
        //打护栏
        if (this._assignedGuardrail) {
            //护栏掉血
            if (this._assignedGuardrail.blood > 0) {
                this._assignedGuardrail.blood -= 1;
                let bloodNode = this._assignedGuardrail.node.getChildByName("FenceBloodBar");
                if (!bloodNode) {
                    bloodNode = instantiate(DataManager.Instance.prefabMap.get(EntityTypeEnum.FenceBloodBar));
                    if (!bloodNode) {
                        return;
                    }
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
                let leftNode = this._assignedGuardrail.node.getChildByPath("Door_Left/LaZhu_hl_B007/B");
                if (leftNode) {
                    let leftMesh: MeshRenderer = leftNode.getComponent(MeshRenderer);
                    if (leftMesh) {
                        leftMesh.setMaterial(DataManager.Instance.sceneManager.doorMaterials[1], 0);
                        setTimeout(() => {
                            leftMesh.setMaterial(DataManager.Instance.sceneManager.doorMaterials[0], 0);
                        }, 50);
                    }
                }
                let rightNode = this._assignedGuardrail.node.getChildByPath("Door_Right/LaZhu_hl_B007/B");
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
                let fenceNode = this._assignedGuardrail.node.getChildByName("B");
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



