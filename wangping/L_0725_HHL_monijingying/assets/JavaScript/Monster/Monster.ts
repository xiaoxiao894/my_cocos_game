import { _decorator, Node, Quat, v2, Vec2, Vec3, Material, MeshRenderer, tween, ParticleSystem, Animation, CCInteger, CCFloat, Label, SpriteFrame, Sprite } from 'cc';
import Entity from '../Common/Entity';
import { EnemyStateType, EntityTypeEnum, EventName } from '../Common/Enum';
import Blood from '../Common/Blood';
import { NodePoolManager } from '../Common/NodePoolManager';
import { DataManager } from '../Global/DataManager';
import { Simulator } from '../RVO/Simulator';
import { DissolveEffect } from '../../Res/DissolveEffect/scripts/DissolveEffect';
import { RVOMath } from '../RVO/Common';
import DropController from '../Map/DropController';
import { EventManager } from '../Global/EventManager';
import { SoundManager } from '../Global/SoundManager';
import { Partner } from '../Partner/Partner';
import Player from '../Player/Player';


const { ccclass, property } = _decorator;

@ccclass('Monster')
export class Monster extends Entity {
    @property({ type: CCFloat, tooltip: "伤害最大值" })
    damageMaxValue = 500;

    @property({ type: CCFloat, tooltip: "伤害最小值" })
    damageMinValue = 300;

    @property(Node)
    harmCon: Node = null;

    @property(SpriteFrame)
    numberSF: SpriteFrame[] = [];

    @property(DissolveEffect)
    dissolveEffect: DissolveEffect[] = [];

    @property({ displayName: "寻农民/主角半径" })
    findTargetRadius: number = 10;

    @property({ displayName: "主角优先半径", tooltip: "未解锁所有墙，优先寻主角半径" })
    playerFirstRadius: number = 30;

    @property(Node)
    hitPosNode: Node = null;

    @property(Animation)
    hitEffect: Animation = null;


    //血条初始位置
    @property({ displayName: "血条位置" })
    private bloodOffset: Vec3 = new Vec3(0, 7, 0);

    @property({ type: CCInteger, displayName: "血量" })
    maxHp: number = 2;

    //掉落数量
    @property({ displayName: "掉落数量" })
    private dropNum: number = 8;

    @property({ displayName: "找人数量" })
    findPlayerNum: number = 20;

    @property({ displayName: "找农民数量" })
    findPartnerNum: number = 2;

    private machineState: EnemyStateType = EnemyStateType.Move;
    private _blood: Blood = null;

    //追击位置
    private moveTargetPos: Vec2 = null;
    //追击目标 墙、主角、伙伴
    private moveTargetNode: Node = null;
    private moveTargetType: number = -1;//1追击角色 2 追击围栏

    //帧率
    private _frames: number = 0;

    // 闪红时间间隔
    private _redTimeLimit: number = 0.3;
    private _redTime: number = 0;


    /** 攻击距离的平方 */
    private _attackRadiusSqr: number = 81;

    //是否到达追踪的栅栏
    private _isArriveWall: boolean = false;

    private hitPow = 0;
    private hitRangeV3: Vec3 = null;

    //RVOid
    private _agentHandleId: number = -1;
    public get agentHandleId(): number {
        return this._agentHandleId;
    }
    public set agentHandleId(value: number) {
        this._agentHandleId = value;
    }

    private _harmConQuat: Quat = new Quat();
    /** 初始化 */
    public init(): void {
        this.hitPow = 0;
        this.hp = this.maxHp;
        this.hitEffect.node.active = false;
        //创建血条
        let bloodNode: Node = NodePoolManager.Instance.getNode(EntityTypeEnum.HP);
        bloodNode.parent = DataManager.Instance.sceneManager.bloodParent;
        bloodNode.active = false;
        this._blood = bloodNode.getComponent(Blood);
        this._blood?.init(EntityTypeEnum.Monster, this.maxHp);
        //初始化材质
        this.setMaterByIndex(0, true);

        this.move();
        this.update(0);

        this.harmCon.getWorldRotation(this._harmConQuat);
        this.harmCon.active = false;
    }


    hit(play: Entity, hitPow: number = 0, bulletPos: Vec3 = null) {
        if (this.machineState != EnemyStateType.Die) {
            this.hitPow = hitPow;
            this.hitRangeV3 = bulletPos;
            const isPlayer = play.getEntityName() === EntityTypeEnum.Player;
            if (isPlayer || DataManager.Instance.partnerAttackMonsterNum < 3) {
                SoundManager.inst.playAudio("zhizhushouji");
            }
            if (!isPlayer) {
                DataManager.Instance.partnerAttackMonsterNum++;
            } else {
                this.hitEffect.node.active = true;
                this.hitEffect.play();
                this.hitEffect.once(Animation.EventType.FINISHED, () => {
                    this.hitEffect.node.active = false;
                });
            }
            if (this._redTime >= this._redTimeLimit && isPlayer) {
                //闪红
                this.setMaterByIndex(1);
                setTimeout(() => {
                    //恢复
                    this.setMaterByIndex(0);
                }, 250);
                this._redTime = 0;
            }

            this.takeDamage(play.attackNum);
            this.setShowHp(play.attackNum);


            // —————— 飘字
            if (!this.harmCon || !this.harmCon.children) return;

            const rdmValue = this.getRandom(this.damageMinValue, this.damageMaxValue).toString();
            for (let i = 0; i < rdmValue.length; i++) {
                const str = rdmValue[i];
                if (!str) continue;

                const spr = this.harmCon.children[i + 1]?.getComponent(Sprite);
                if (spr) spr.spriteFrame = this.numberSF[Number(str)];
            }

            this.harmCon.active = true;
            const harnConAni = this.harmCon.getComponent(Animation);
            if (harnConAni) harnConAni.play();
        }
    }

    setShowHp(attack: number) {
        return;
        if (!this._blood) {
            return;
        }
        this._blood.node.active = true;
        this._blood.injuryAni(attack);
    }

    move() {
        if (this.machineState != EnemyStateType.Move)
            this.machineState = EnemyStateType.Move;
        if (!this.ani.getState(EnemyStateType.Move).isPlaying) {
            this.ani.play(EnemyStateType.Move)
            //console.log("monster move id",this.agentHandleId);
            return;
        }
    }

    attack1() {
        if (this.machineState != EnemyStateType.Attack)
            this.machineState = EnemyStateType.Attack;
        if (!this.ani.getState(EnemyStateType.Attack).isPlaying) {
            this.ani.play(EnemyStateType.Attack);
            //console.log("monster Attack id",this.agentHandleId);
            return true;
        }
        return false;
    }

    public realAttack() {
        if (this.moveTargetNode && this.moveTargetNode.getComponent(Entity)) {
            this.moveTargetNode.getComponent(Entity).hit(this);
        }
    }

    die(callback?: (...agrs: unknown[]) => void): void {
        if (this.machineState != EnemyStateType.Die) {
            this.machineState = EnemyStateType.Die;
            this._frames = 0;

            // 从RVO模拟器中移除代理，避免残留影响路径计算
            //console.log("die agentHandleId", this.agentHandleId);
            if (this.agentHandleId !== -1) {
                Simulator.instance.removeAgent(this.agentHandleId);
                this.agentHandleId = -1;
            }
            // 1. 从怪列表中移除自己
            DataManager.Instance.monsterController.removeMonster(this);
            //从打栏杆移除
            // if(this.moveTargetType === 2&&this.moveTargetNode){
            //     let wall =DataManager.Instance.wallController.getAttackWallByUuid(this.moveTargetNode.uuid);
            //     if (wall) {
            //         DataManager.Instance.wallController.updateAttackWallCurNum(wall.node.uuid, Math.max(wall.curNum - 1, 0));
            //     }
            // }
            //击退
            if (this.hitPow > 0 && this.hitRangeV3) {
                console.log("hitPow", this.hitPow);
                // 计算击退方向向量
                const currentPos = this.node.worldPosition;
                let goalVector = new Vec2(this.hitRangeV3.x, this.hitRangeV3.z).subtract2f(currentPos.x, currentPos.z);
                goalVector = goalVector.normalize().multiplyScalar(-this.hitPow);
                tween(this.node)
                    .by(0.15, { position: new Vec3(goalVector.x, 0, goalVector.y) }, {
                        onUpdate: () => {
                            this.updateBloodPos();
                        }
                    })
                    .start();
            }

            //死亡动画
            this.ani.play(EnemyStateType.Die);
            //掉落
            const dropPos = this.node.worldPosition.clone();
            for (let i = 0; i < this.dropNum; i++) {
                DropController.Instance.dropItem(dropPos);
            }

            tween(this)
                // .delay(0.25)
                // .call(()=>{
                //     //死亡动画
                //     this.ani.play(EnemyStateType.Die);
                //     //掉落
                //     const dropPos = this.node.worldPosition.clone();
                //     for (let i = 0; i < this.dropNum; i++) {
                //         DropController.Instance.dropItem(dropPos);
                //     }
                // })
                .delay(0.66)
                .call(() => {
                    //消融
                    this.dissolveEffect.forEach((d) => {
                        d.init();
                        d.play(0.5);
                    });
                })
                .delay(0.4)
                .call(() => {
                    this.reset();
                    this.node.removeFromParent();
                    this.node.active = false;

                    // 回收节点到对象池（检查节点有效性）
                    if (this.node?.isValid) {
                        NodePoolManager.Instance.returnNode(this.node, EntityTypeEnum.Monster);
                    }

                    // 回收血条节点（检查节点有效性）
                    if (this._blood?.isValid) {
                        NodePoolManager.Instance.returnNode(this._blood.node, EntityTypeEnum.HP);
                        this._blood = null;
                    }
                })
                .start();

            if (this.moveTargetNode?.getComponent(Player)) {
                DataManager.Instance.targetPlayerNumber--;
            } else if (this.moveTargetNode?.getComponent(Partner)) {
                this.moveTargetNode.getComponent(Partner).monsterNum--;
            }
        }

        if (!DataManager.Instance.monsterController.firstMonsterDie) {
            DataManager.Instance.monsterController.firstMonsterDie = true;
            EventManager.inst.emit(EventName.FirstMonsterDie);
        }

    }

    private reset() {
        this._frames = 0;
        this.moveTargetPos = null;
        this.moveTargetNode = null;
        this._isArriveWall = false;
        this.moveTargetType = -1;
    }

    /** 临时变量 */
    private currentPos1 = new Vec3();

    /**
     * 在此之前 请确保Simulator run执行完毕
     */
    moveByRvo(dt) {

        if (this.agentHandleId == -1) return;

        Vec3.copy(this.currentPos1, this.node.worldPosition);

        // 获取伙伴的世界位置
        const partnerPos = new Vec3();
        // 计算距离
        let distance = Infinity;

        if (this.moveTargetNode) {
            this.moveTargetNode.getWorldPosition(partnerPos);
            distance = Vec3.squaredDistance(this.currentPos1, partnerPos);
        }


        // 如果距离小于等于攻击距离，则执行攻击逻辑
        if (Number(distance.toFixed(1)) <= this._attackRadiusSqr) {
            if (this.moveTargetType === 2) {
                this._isArriveWall = true;
                // let wall =DataManager.Instance.wallController.getAttackWallByUuid(this.moveTargetNode.uuid);
                // if (wall) {
                //     DataManager.Instance.wallController.updateAttackWallCurNum(wall.node.uuid, wall.curNum +1);
                // }
            }

            if (this.attack1()) {
                return;
            }
        } else {
            this.move();
            const p = Simulator.instance.getAgentPosition(this.agentHandleId);
            const targetPos = new Vec3(p.x, 0, p.y);
            const currentPos = this.node.worldPosition.clone();

            const dist = Vec3.squaredDistance(currentPos, targetPos);
            if (dist > 0.001) {
                const smoothFactor = 1;
                Vec3.lerp(currentPos, currentPos, targetPos, dt * smoothFactor);
                this.node.setWorldPosition(currentPos);
            }

            this.updateBloodPos();
        }
    }

    private updateBloodPos() {
        return;
        //同步更新血条位置
        if (this._blood) {
            let bloodPos: Vec3 = new Vec3();
            Vec3.add(bloodPos, this.node.worldPosition.clone(), this.bloodOffset);
            this._blood.node.setWorldPosition(bloodPos);
        }
    }

    lateUpdate(dt: number) {
        if (this.harmCon) this.harmCon.setWorldRotation(this._harmConQuat);
    }

    // _frames: number = 0
    update(deltaTime: number) {
        if (this._frames++ > 8) {
            this._frames = 0
            this.setPreferredVelocities()//设置线速度
            if (this.moveTargetNode) {
                const pos = this.moveTargetNode.getWorldPosition();
                //确定朝向
                this.rotateTowards(pos, deltaTime);
            }
        }
        this._redTime += deltaTime;
    }

    /**
    * 设置追踪伙伴的线速度方向和大小
    */
    setPreferredVelocities() {
        if (this.agentHandleId < 0) {
            return;
        }

        const wallAllUnlock: boolean = DataManager.Instance.wallController.isWallAllUnlocked();
        const inDoor: boolean = DataManager.Instance.wallController.posIsInDoor(this.node.worldPosition);

        if (wallAllUnlock && this.moveTargetNode && this.moveTargetType === 1) {
            const targetInDoor: boolean = DataManager.Instance.wallController.posIsInDoor(this.moveTargetNode.worldPosition);
            //怪在墙外 、人在墙内  取消目标
            if (targetInDoor && !inDoor) {
                if (this.moveTargetNode.getComponent(Player)) {
                    DataManager.Instance.targetPlayerNumber--;
                }
                if (this.moveTargetNode.getComponent(Partner)) {
                    this.moveTargetNode.getComponent(Partner).monsterNum--;
                }
                this.moveTargetNode = null;
                this.moveTargetPos = null;
                this.moveTargetType = -1;

            }
        }

        //如果是伙伴，伙伴死了切换目标
        if (this.moveTargetNode?.getComponent(Partner) && !this.moveTargetNode.getComponent(Partner).unlocked) {
            this.moveTargetNode = null;
            this.moveTargetPos = null;

            this.moveTargetType = -1;
        }

        //没目标、目标是墙还没到
        if (!this.moveTargetNode || (this.moveTargetType === 2 && !this._isArriveWall)) {
            //寻找人
            let minNode: Node = null;
            let minDistSqr = Infinity;
            let partners: Entity[] = DataManager.Instance.partnerController.getPartners();
            const selfPos = this.node.worldPosition.clone();
            //主角
            const playerNode: Node = DataManager.Instance.player;
            const playerInDoor: boolean = DataManager.Instance.wallController.posIsInDoor(playerNode.worldPosition);
            const playerPos = playerNode.getWorldPosition();
            const distSqr = Vec3.squaredDistance(selfPos, playerPos);
            //主角不在范围内,再找农民
            if (wallAllUnlock || distSqr > Math.pow(this.playerFirstRadius, 2) || DataManager.Instance.targetPlayerNumber > this.findPlayerNum) {
                if (partners && partners.length > 0) {
                    for (const partner of partners) {
                        if (!partner || !partner.isValid) continue;
                        if ((partner as Partner).monsterNum >= this.findPartnerNum) {
                            continue
                        }
                        const partnerInDoor: boolean = DataManager.Instance.wallController.posIsInDoor(partner.node.worldPosition);
                        const partnerPos = partner.node.getWorldPosition();
                        const distSqr = Vec3.squaredDistance(selfPos, partnerPos);
                        if (!partnerInDoor && distSqr < minDistSqr) {
                            if (wallAllUnlock) {
                                if (distSqr < Math.pow(this.findTargetRadius, 2)) {
                                    minDistSqr = distSqr;
                                    minNode = partner.node;
                                }
                            } else {
                                minDistSqr = distSqr;
                                minNode = partner.node;
                            }
                        }
                    }
                }
            }



            //判断主角

            if (!playerInDoor && distSqr < minDistSqr) {
                if (wallAllUnlock) {
                    if (distSqr < Math.pow(this.findTargetRadius, 2)) {
                        minDistSqr = distSqr;
                        minNode = playerNode;
                        DataManager.Instance.targetPlayerNumber++;
                    }
                } else {
                    minDistSqr = distSqr;
                    minNode = playerNode;
                    DataManager.Instance.targetPlayerNumber++;
                }
            }

            //找到人
            if (minNode) {
                //如果原来在走向墙，把自己从找墙去掉
                // if(this.moveTargetNode&&this.moveTargetType === 2){
                //     let wall =DataManager.Instance.wallController.getAttackWallByUuid(this.moveTargetNode.uuid);
                //     if (wall) {
                //         DataManager.Instance.wallController.updateAttackWallCurNum(wall.node.uuid, Math.max(wall.curNum - 1, 0));
                //     }
                // }
                this.moveTargetNode = minNode;
                this.moveTargetType = 1;
                if (minNode.getComponent(Partner)) {
                    minNode.getComponent(Partner).monsterNum++;
                }
            }
        }

        if (this.moveTargetNode) {
            let targetPos = this.moveTargetNode.getWorldPosition();
            this.moveTargetPos = v2(targetPos.x, targetPos.z);
        } else {
            //去打墙
            //寻找围栏
            let attackWall = DataManager.Instance.wallController.getNearstAttackWall(this.node.worldPosition.clone());
            if (attackWall) {
                this.moveTargetNode = attackWall.node;

                this.moveTargetType = 2;
            } else {
                this.moveTargetType = 1;
                this.moveTargetNode = DataManager.Instance.player;

            }
            let targetPos = this.moveTargetNode.getWorldPosition();
            this.moveTargetPos = v2(targetPos.x, targetPos.z);
        }

        let agentAid = this.agentHandleId
        let agent = Simulator.instance.getAgentByAid(agentAid)
        let agentPos = Simulator.instance.getAgentPosition(agentAid)


        let moveTargetPos: Vec2 = this.moveTargetPos.clone();

        if (agent && agentPos) {
            let goalVector: Vec2 = moveTargetPos.subtract2f(agentPos.x, agentPos.y);

            // 计算距离
            let distance = Infinity;

            if (this.moveTargetNode) {
                // 获取伙伴的世界位置
                const partnerPos = new Vec3();
                this.moveTargetNode.getWorldPosition(partnerPos);
                distance = Vec3.squaredDistance(this.currentPos1, partnerPos);
            }

            if (goalVector.lengthSqr() > 1.0) {
                goalVector = goalVector.normalize().multiplyScalar(agent.maxSpeed_);
            }
            if (goalVector.lengthSqr() < RVOMath.RVO_EPSILON || Number(distance.toFixed(1)) <= this._attackRadiusSqr) {
                Simulator.instance.setAgentPrefVelocity(agentAid, Vec2.ZERO);
            }
            else {
                Simulator.instance.setAgentPrefVelocity(agentAid, goalVector);
            }
        } else {
            console.error("RVO异常::", agent, agentPos, agentAid)
        }
    }

    // 旋转到目标方向
    private rotateTowards(targetWorldPos: Vec3, dt: number) {
        const currentPos = this.node.worldPosition.clone();
        const dir = new Vec3();
        Vec3.subtract(dir, targetWorldPos, currentPos);
        dir.y = 0;
        dir.normalize();

        if (!dir) return;

        const targetQuat = new Quat();
        Quat.fromViewUp(targetQuat, dir, Vec3.UP);

        const currentQuat = this.node.worldRotation.clone();
        const resultQuat = new Quat();
        Quat.slerp(resultQuat, currentQuat, targetQuat, Math.min(1, dt * 40));
        const dot = Quat.dot(resultQuat, targetQuat);
        if (dot > 0.99996) { // ~0.5°
            this.node.worldRotation = targetQuat;
        } else {
            this.node.worldRotation = resultQuat;
        }
    }

    public isAlive(): boolean {
        return this.machineState !== EnemyStateType.Die;
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

    // 随机数
    private getRandom(min, max) {
        return Math.floor(Math.random() * (max - min) + min)
    }
}


