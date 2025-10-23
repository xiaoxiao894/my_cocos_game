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
            this._bloodOffset = new Vec3(0, 15, 0);
        } else {
            this._bloodOffset = new Vec3(0, 7.5, 0);
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

            const targetNode = new Node("Temp");
            targetNode.setWorldPosition(knockbackFinalPos);
            const isInsideDoor = DataManager.Instance.sceneManager.isNodeInsideDoorArea(targetNode);
            // if (isInsideDoor) {
            //     console.log("击退后会进门区域");
            // } else {
            //     console.log("击退后不会进门区域");
            // }

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
        } else {
            this.updateIconPos();
        }

        if (this.redTimeout) {
            clearTimeout(this.redTimeout);
            this.redTimeout = null;
        }
        this._nowHp--;
        if (this._nowHp > 0) {
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
        //真死了
        this._isDead = true;

        if (this._assignedGuardrail && this._hasCountedAttack && this._assignedGuardrail.attackingMonsterCount > 0) {
            this._assignedGuardrail.attackingMonsterCount--;
        }
        this._isAttackPlayer = false;
        this.changState(MonsterStateEnum.Die);
        let timeout: number = 650;
        if (this.type > 0) {
            timeout = 880;
        }
        //闪红
        this.dissolveEffect.forEach((d: DissolveEffect) => {
            this.setMaterByIndex(d.node, 1);
        });
        setTimeout(() => {
            //消融
            this.dissolveEffect.forEach((d) => {
                this.setMaterByIndex(d.node, 2);
                d.init();
                d.play(0.5);

            });
        }, 250);

        setTimeout(() => {
            DataManager.Instance.monsterManager.recycleMonster(this._index, this.node);
        }, timeout);

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

        const playerPos = DataManager.Instance.player.node.getWorldPosition();
        let moveTarget: Vec2 = v2(playerPos.x, playerPos.z);
        let worldTarget: Vec3 = new Vec3(playerPos.x, 0, playerPos.z);

        const isPlayerInDoorArea = DataManager.Instance.sceneManager.isNodeInsideDoorArea(DataManager.Instance.player.node);

        if (isPlayerInDoorArea) {
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
                moveTarget = v2(pos.x, pos.z);
                worldTarget = new Vec3(pos.x, 0, pos.z);

                this._assignedGuardrail = nearestGuardrail;
                this._assignedGuardrail.attackingMonsterCount = (this._assignedGuardrail.attackingMonsterCount || 0) + 1;
            } else if (this._assignedGuardrail) {
                const guardrailPos: Vec3 = this._assignedGuardrail.node.worldPosition;
                moveTarget = v2(guardrailPos.x, guardrailPos.z);
                worldTarget = new Vec3(guardrailPos.x, 0, guardrailPos.z);
            }
        } else {
            if (this._assignedGuardrail) {
                if (this._hasCountedAttack) {
                    this.rotateTowards(this._assignedGuardrail.node.worldPosition, dt);
                    Simulator.instance.setAgentPrefVelocity(this.agentHandleId, Vec2.ZERO);
                    return;
                }

                const count = this._assignedGuardrail.attackingMonsterCount || 0;
                const guardrailPos: Vec3 = this._assignedGuardrail.node.worldPosition;
                moveTarget = v2(guardrailPos.x, guardrailPos.z);
                worldTarget = new Vec3(guardrailPos.x, 0, guardrailPos.z);

                if (count === 0) {
                    const monsterPos = this.node.worldPosition.clone();
                    const dx = playerPos.x - monsterPos.x;
                    const dz = playerPos.z - monsterPos.z;
                    const distSqr = dx * dx + dz * dz;
                    const playerRange = 0.3;

                    if (distSqr <= playerRange * playerRange) {
                        this._assignedGuardrail = null;
                        this._hasCountedAttack = false;
                        this._noMove = false;
                        moveTarget = v2(playerPos.x, playerPos.z);
                        worldTarget = new Vec3(playerPos.x, 0, playerPos.z);
                    }
                }
            }
        }

        const agentAid = this.agentHandleId;
        const agent = Simulator.instance.getAgentByAid(agentAid);
        const agentPos = Simulator.instance.getAgentPosition(agentAid);

        if (this._isHit) {
            return;
        }

        if (agent && agentPos) {
            const goalVector = moveTarget.subtract2f(agentPos.x, agentPos.y);
            const distSqr = goalVector.lengthSqr();
            const distanceToTargetSquared = Vec3.squaredDistance(this.node.worldPosition, worldTarget);
            const hasArrived = distanceToTargetSquared <= 16;

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

                Simulator.instance.setAgentPrefVelocity(agentAid, Vec2.ZERO);

                if (this._assignedGuardrail) {
                    this.rotateTowards(this._assignedGuardrail.node.worldPosition, dt);
                    this._hasCountedAttack = true;
                }

                return;
            } else {
                // ✅ 确保正在追击时状态是 Walk
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
                const currentRotation = this.node.worldRotation.clone();
                const targetRotation = new Quat();
                Quat.fromViewUp(targetRotation, forward, Vec3.UP);

                const rotateSpeed = 8;
                const slerped = new Quat();
                Quat.slerp(slerped, currentRotation, targetRotation, Math.min(1, dt * rotateSpeed));

                this.node.worldRotation = slerped;
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
        Quat.slerp(resultQuat, currentQuat, targetQuat, Math.min(1, dt * 40));
        this.node.worldRotation = resultQuat;
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

        //同步更新血条位置
        if (this._bloodNode) {
            let bloodPos: Vec3 = new Vec3();
            Vec3.add(bloodPos, currentPos, this._bloodOffset);
            this._bloodNode.setWorldPosition(bloodPos);
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
                let fenceNode = this._assignedGuardrail.node.getChildByName("B");
                if (fenceNode) {
                    let fenceMesh: MeshRenderer = fenceNode.getComponent(MeshRenderer);
                    if (fenceMesh) {
                        fenceMesh.setMaterial(DataManager.Instance.sceneManager.guardrailMaterials[3], 0);
                        fenceMesh.setMaterial(DataManager.Instance.sceneManager.guardrailMaterials[3], 1);
                        fenceMesh.setMaterial(DataManager.Instance.sceneManager.guardrailMaterials[3], 2);
                        setTimeout(() => {
                            fenceMesh.setMaterial(DataManager.Instance.sceneManager.guardrailMaterials[0], 0);
                            fenceMesh.setMaterial(DataManager.Instance.sceneManager.guardrailMaterials[1], 1);
                            fenceMesh.setMaterial(DataManager.Instance.sceneManager.guardrailMaterials[2], 2);
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



