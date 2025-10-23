import { _decorator, Component, Node, SkeletalAnimation, CCString, Vec3, tween, Material, MeshRenderer, CCInteger, Quat, Vec2, v2, ProgressBar, CCFloat } from 'cc';
import { DataManager, Guardrail } from '../Global/DataManager';
import { Simulator } from '../RVO/Simulator';
import { RVOMath, Vector2 } from '../RVO/Common';
import { MonsterStateEnum } from '../Actor/StateDefine';
import { DissolveEffect } from '../../Res/DissolveEffect/scripts/DissolveEffect';
import { MathUtil } from '../Util/MathUtil';
const { ccclass, property } = _decorator;

@ccclass('MonsterItem')
export class MonsterItem extends Component {
    @property(SkeletalAnimation)
    skeletalAnimation: SkeletalAnimation = null;

    @property(Node)
    affectedSpecialEffects: Node = null;

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

    @property(CCFloat)
    sizeSquare: number = 16;

    @property(CCFloat)
    dropNum: number = 3;

    @property(Node)
    bloodNode: Node = null;

    private currentState = null;

    private _isDead: boolean = false;
    private _index: number;
    private _lastPathHasObstacle: boolean = false;
    private _checkCounter: number = 0;

    private _noMove: boolean = false;

    private _nowHp: number = 1;

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

    public init(index: number = 0, isDissolveOnce = true, isCustomHp) {
        this._index = index;
        if (isCustomHp) {
            this._nowHp = 1;
            this.hp = 1;
        } else {
            this._nowHp = this.hp;
        }
        this._isDead = false;
        this._noMove = false;
        this._hasCountedAttack = false;
        this._assignedGuardrail = null;
        if (this.runAniName) {
            this.scheduleOnce(() => {
                this.changState(MonsterStateEnum.Walk);
            }, 0);
        }

        if (this.bloodNode) {
            let bar: ProgressBar = this.bloodNode.getComponent(ProgressBar);
            if (bar) {
                bar.progress = 1;
            }
            this.bloodNode.active = false;
        }

        //初始化材质
        // this.dissolveEffect.forEach((d: DissolveEffect) => {
        //     this.setMaterByIndex(d.node, 0);
        //     if (isDissolveOnce) {
        //         this.warmUpMaterial(d.node, 1);
        //         this.warmUpMaterial(d.node, 2);
        //     }
        //     d.reset();
        // })

        this.setMaterByIndex(0, true)
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

    public deathAni(end) {
        if (this._isDead) {
            return;
        }
        // 固定击退方向 -Z 方向）
        const knockbackDir = new Vec3(0, 0, -1);

        // 固定击退距离
        const knockbackDistance = 0.75;   // 击退 3 个单位

        const goalVector = knockbackDir.multiplyScalar(knockbackDistance);

        tween(this.node)
            .by(0.15, { position: goalVector })
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
            })
            .start();

        if (this.redTimeout) {
            clearTimeout(this.redTimeout);
            this.redTimeout = null;
        }
        this._nowHp--;
        if (this.affectedSpecialEffects) {
            this.affectedSpecialEffects.active = true;
        }

        this.scheduleOnce(() => {
            this.affectedSpecialEffects.active = false;
        }, 2)

        if (this.bloodNode) {
            let bar: ProgressBar = this.bloodNode.getComponent(ProgressBar);
            if (bar) {
                bar.progress = this._nowHp / this.hp;
            }
            this.bloodNode.active = true;
        }

        if (this._nowHp > 0) {
            //闪红
            this.setMaterByIndex(1);
            this.redTimeout = setTimeout(() => {
                //恢复
                this.setMaterByIndex(0);
            }, 250);
            return;
        }
        //真死了
        this._isDead = true;
        // this.updateIconPos();
        if (this._assignedGuardrail && this._assignedGuardrail.attackingMonsterCount > 0) {
            this._assignedGuardrail.attackingMonsterCount--;
        }
        this.changState(MonsterStateEnum.Die);
        let timeout: number = 650;
        if (this.type > 0) {
            timeout = 880;
        }
        //闪红
        this.setMaterByIndex(1);
        setTimeout(() => {
            //消融
            // this.setMaterByIndex(0);
            this.dissolveEffect.forEach((d) => {
                this.setMaterByIndex(0);
                d.init();
                d.play(0.5);
            });
        }, 250);

        setTimeout(() => {
            this.clearData();
            DataManager.Instance.monsterManager.recycleMonster(this._index, this.node);
        }, timeout);

        // this.scheduleOnce(() => {
        this.updateIconPos(end);
        // }, 0.15)

        DataManager.Instance.gridSystem.removeNode(this.node);
    }

    updateIconPos(end) {
        // const randomIconNum = MathUtil.getRandom(1, 4);
        const worldPos = this.node.getWorldPosition().clone();
        for (let i = 0; i < this.dropNum; i++) {
            const randius = 3;
            const angle = Math.random() * Math.PI * 2;
            const r = Math.sqrt(Math.random()) * randius;

            const offsetX = r * Math.cos(angle)
            const offsetZ = r * Math.sin(angle);

            const newRandomPos = new Vec3(worldPos.x + offsetX, worldPos.y, worldPos.z + offsetZ);
            DataManager.Instance.monsterManager.dropItem(newRandomPos, end);
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

    /**
    * 设置追踪主角的线速度方向和大小
    */
    // 怪物 RVO 移动与护栏攻击逻辑
    private _assignedGuardrail: Guardrail = null;
    private _hasCountedAttack: boolean = false;
    setPreferredVelocities(dt: number) {
        if (this.agentHandleId < 0 || DataManager.Instance.guardrailArr.length <= 0) return;

        let moveTarget: Vec2;
        let worldTarget: Vec3;

        const monsterPos = this.node.worldPosition.clone();
        let nearestGuardrail = null;
        let minDistSqr = Infinity;

        for (const guardrail of DataManager.Instance.guardrailArr) {
            const attackingCount = guardrail.attackingMonsterCount || 0;
            if (attackingCount >= 2) continue;

            const guardrailPos = guardrail.node.worldPosition;
            const dx = guardrailPos.x - monsterPos.x;
            const dz = guardrailPos.z - monsterPos.z;
            const distSqr = dx * dx + dz * dz;

            if (distSqr < minDistSqr) {
                minDistSqr = distSqr;
                nearestGuardrail = guardrail;
            }
        }

        if (nearestGuardrail && !this._assignedGuardrail) {
            const pos = nearestGuardrail.node.worldPosition;
            const dir = new Vec3();
            Vec3.subtract(dir, pos, monsterPos);
            dir.y = 0;
            dir.normalize();
            const offset = 4;
            const adjustedPos = pos.clone().subtract(dir.multiplyScalar(offset));

            moveTarget = v2(adjustedPos.x, adjustedPos.z);
            worldTarget = new Vec3(adjustedPos.x, 0, adjustedPos.z);

            this._assignedGuardrail = nearestGuardrail;
            this._assignedGuardrail.attackingMonsterCount = (this._assignedGuardrail.attackingMonsterCount || 0) + 1;
        } else if (this._assignedGuardrail) {
            const guardrailPos = this._assignedGuardrail.node.worldPosition;
            const dir = new Vec3();
            Vec3.subtract(dir, guardrailPos, monsterPos);
            dir.y = 0;
            dir.normalize();
            const offset = 4;
            const adjustedPos = guardrailPos.clone().subtract(dir.multiplyScalar(offset));

            moveTarget = v2(adjustedPos.x, adjustedPos.z);
            worldTarget = new Vec3(adjustedPos.x, 0, adjustedPos.z);
        } else {
            for (const guardrail of DataManager.Instance.guardrailArr) {
                const guardrailPos = guardrail.node.worldPosition;
                const dx = guardrailPos.x - monsterPos.x;
                const dz = guardrailPos.z - monsterPos.z;
                const distSqr = dx * dx + dz * dz;

                if (distSqr < minDistSqr) {
                    minDistSqr = distSqr;
                    nearestGuardrail = guardrail;
                }
            }
            if (nearestGuardrail) {
                const pos = nearestGuardrail.node.worldPosition;
                const dir = new Vec3();
                Vec3.subtract(dir, pos, monsterPos);
                dir.y = 0;
                dir.normalize();
                const offset = 4;
                const adjustedPos = pos.clone().subtract(dir.multiplyScalar(offset));

                moveTarget = v2(adjustedPos.x, adjustedPos.z);
                worldTarget = new Vec3(adjustedPos.x, 0, adjustedPos.z);

            }
        }

        if (!moveTarget || !worldTarget) {
            return;
        }

        const agentAid = this.agentHandleId;
        const agent = Simulator.instance.getAgentByAid(agentAid);
        const agentPos = Simulator.instance.getAgentPosition(agentAid);

        if (agent && agentPos) {
            const goalVector = moveTarget.subtract2f(agentPos.x, agentPos.y);
            const distSqr = goalVector.lengthSqr();
            const distanceToTargetSquared = Vec3.squaredDistance(this.node.worldPosition, worldTarget);
            const hasArrived = distanceToTargetSquared <= this.sizeSquare;

            if (hasArrived) {
                if (this.currentState !== MonsterStateEnum.Attack) {
                    this.changState(MonsterStateEnum.Attack);
                }

                Simulator.instance.setAgentPrefVelocity(agentAid, Vec2.ZERO);

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

            if (distSqr < RVOMath.RVO_EPSILON) {
                Simulator.instance.setAgentPrefVelocity(agentAid, Vec2.ZERO);
            } else {
                Simulator.instance.setAgentPrefVelocity(agentAid, goalVector);
            }

            const forward = new Vec3(goalVector.x, 0, goalVector.y).normalize();
            if (forward.lengthSqr() > 0.0001) {
                const currentRotation = this.skeletalAnimation.node.worldRotation.clone();
                const targetRotation = new Quat();
                Quat.fromViewUp(targetRotation, forward, Vec3.UP);

                const rotateSpeed = 8;
                const slerped = new Quat();
                Quat.slerp(slerped, currentRotation, targetRotation, Math.min(1, dt * rotateSpeed));

                const childZero = this.skeletalAnimation.node;
                if (childZero) {
                    childZero.worldRotation = slerped;
                }
            }
        } else {
            // console.error("RVO异常::", agent, agentPos, agentAid);
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

        const currentQuat = this.skeletalAnimation.node.worldRotation.clone();
        const resultQuat = new Quat();
        Quat.slerp(resultQuat, currentQuat, targetQuat, Math.min(1, dt * 40));
        this.skeletalAnimation.node.worldRotation = resultQuat;
    }

    /**
     * 在此之前 请确保Simulator run执行完毕
     */
    moveByRvo(dt) {
        if (this._isDead) return;
        if (this._noMove) {
            return;
        }

        //栅栏边上的怪不移动
        if (this._hasCountedAttack) {
            this._noMove = true;
        }

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

    }

    changState(state: MonsterStateEnum | string) {
        if (state == this.currentState) {
            return;
        }
        if (state === MonsterStateEnum.Die) {
            // 播放一次动画以初始化动画状态
            this.skeletalAnimation.play(MonsterStateEnum.Attack);

            const state = this.skeletalAnimation.getState(MonsterStateEnum.Attack);
            if (!state) return;

            state.update(0); // 强制立即应用该时间的骨骼姿势
            state.pause();
            Simulator.instance.removeAgent(this.agentHandleId);
        } else {
            this.skeletalAnimation?.crossFade(state as string, 0.1)
        }

        this.currentState = state;
    }

    attack() {
        //打护栏
        if (this._assignedGuardrail) {
            //护栏掉血
            if (this._assignedGuardrail.blood > 0) {
                this._assignedGuardrail.blood -= 1;
                let bloodNode = this._assignedGuardrail.node.getChildByName("FenceBloodBar");
                if (!bloodNode) {
                    // bloodNode = instantiate(DataManager.Instance.prefabMap.get(EntityTypeEnum.FenceBloodBar));
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
                let leftNode = this._assignedGuardrail.node.getChildByPath("Door_Left/WeiLan/WeiLan");
                if (leftNode) {
                    let leftMesh: MeshRenderer = leftNode.getComponent(MeshRenderer);
                    if (leftMesh) {
                        leftMesh.setMaterial(DataManager.Instance.sceneManager.doorMaterials[3], 0);
                        leftMesh.setMaterial(DataManager.Instance.sceneManager.doorMaterials[3], 1);
                        leftMesh.setMaterial(DataManager.Instance.sceneManager.doorMaterials[3], 2);
                        setTimeout(() => {
                            leftMesh.setMaterial(DataManager.Instance.sceneManager.doorMaterials[0], 0);
                            leftMesh.setMaterial(DataManager.Instance.sceneManager.doorMaterials[1], 1);
                            leftMesh.setMaterial(DataManager.Instance.sceneManager.doorMaterials[2], 2);
                        }, 50);
                    }
                }
                let rightNode = this._assignedGuardrail.node.getChildByPath("Door_Right/WeiLan/WeiLan");
                if (rightNode) {
                    let rightMesh: MeshRenderer = rightNode.getComponent(MeshRenderer);
                    if (rightMesh) {
                        rightMesh.setMaterial(DataManager.Instance.sceneManager.doorMaterials[3], 0);
                        rightMesh.setMaterial(DataManager.Instance.sceneManager.doorMaterials[3], 1);
                        rightMesh.setMaterial(DataManager.Instance.sceneManager.doorMaterials[3], 2);
                        setTimeout(() => {
                            rightMesh.setMaterial(DataManager.Instance.sceneManager.doorMaterials[0], 0);
                            rightMesh.setMaterial(DataManager.Instance.sceneManager.doorMaterials[1], 1);
                            rightMesh.setMaterial(DataManager.Instance.sceneManager.doorMaterials[2], 2);
                        }, 50);
                    }
                }

            } else {
                //围栏
                let fenceNode = this._assignedGuardrail.node.getChildByName("weiqiang02");
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

    private clearData(): void {
        if (this.agentHandleId >= 0) {
            Simulator.instance.removeAgent(this.agentHandleId);
            this._agentHandleId = -1;
        }
        this._isDead = false;
        this.currentState = null;
        this._frames = 0;

    }

    get isDead() {
        return this._isDead;
    }
}



