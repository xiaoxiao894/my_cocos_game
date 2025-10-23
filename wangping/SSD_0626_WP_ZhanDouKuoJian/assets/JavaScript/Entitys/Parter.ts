
import { _decorator, Node, SkeletalAnimation, tween, Animation, CCFloat, Vec3, RigidBody, ParticleSystem, Tween, Vec2, Quat } from 'cc';
import Entity from './Entity';
import { App } from '../App';
import { Simulator } from '../RVO/Simulator';
import RVOUtils from '../RVO/RVOUtils';
import { EnemyBear } from './EnemyBear';
import { RVOMath } from '../RVO/Common';
import { GlobeVariable } from '../core/GlobeVariable';

const { ccclass, property } = _decorator;

export enum ParterState {
    /** 开始 */
    Start,
    /** 走 */
    Walk,
    /** 追踪怪 */
    track,
    /** 死亡 */
    Dead
}

@ccclass('Parter')
export class Parter extends Entity {

    @property(SkeletalAnimation)
    ani: SkeletalAnimation = null;

    @property(CCFloat)
    speed: number = 10;

    attack: number = 2;

    entityName: string = GlobeVariable.entifyName.player;

    //rov相关
    private _agentHandleId: number = -1; //RVOid
    public get agentHandleId(): number {
        return this._agentHandleId;
    }
    public set agentHandleId(value: number) {
        this._agentHandleId = value;
    }

    /** 状态 开始 0   行走 1   找怪 2   死亡 3 */
    private _state: number = ParterState.Start;
    /** 路径 */
    private _pathNodes: Node[] = [];
    private _pathIndex: number = 0;
    /** 出门走的动画 */
    private _walkTween: Tween<Node>;
    //追踪的怪
    private _targetMonster: EnemyBear = null;

    public init(isLeft: boolean) {
        this._state = ParterState.Start;
        this._pathNodes = isLeft ? App.sceneNode.parterPathLeft.children : App.sceneNode.parterPathRight.children;
        this.node.setPosition(this._pathNodes[0].worldPosition.clone());
        this.node.rotation = this._pathNodes[0].rotation.clone();
        this._pathIndex = 1;
        this.walk();
    }

    update(dt: number) {
        if (this._state === ParterState.track) {
            this.setPreferredVelocities()//设置追踪怪的线速度
            if (this._targetMonster && this._targetMonster.node && this._targetMonster.isAlive()) {
                //方向
                this.rotateTowards(this._targetMonster.node.worldPosition.clone(), dt);
            }

        }
    }

    /** 走出大门 */
    private walk() {
        if (this._pathNodes.length > this._pathIndex) {
            //行走
            if (this._state != ParterState.Walk) {
                this._state = ParterState.Walk;
            }
            //行走动画
            let dis = Vec3.distance(this.node.worldPosition, this._pathNodes[this._pathIndex].worldPosition);
            let time = dis / this.speed * 3;
            const posTween = tween(this.node)
                .to(time, { worldPosition: this._pathNodes[this._pathIndex].worldPosition });
            const rotTween = tween(this.node)
                .to(0.5, { eulerAngles: this._pathNodes[this._pathIndex].eulerAngles.clone() });
            this._walkTween = tween(this.node)
                .parallel(posTween, rotTween)
                .call(() => {

                    this._pathIndex++;
                    this.walk();
                })
                .start();
        } else {
            this.trackMonster();
        }
    }

    //开始追踪怪
    private trackMonster() {
        // 设置 RVO
        const mass = 1;
        const agentId = Simulator.instance.addAgent(
            RVOUtils.v3t2(this.node.worldPosition.clone()),
            1,
            3,
            null,
            mass
        );

        const agentObj = Simulator.instance.getAgentByAid(agentId);
        agentObj.neighborDist = 1;

        this._agentHandleId = agentId;

        this._state = ParterState.track;
    }

    /** 攻击敌人 */
    private attackMonster() {
        if (this._targetMonster) {
            if (this.node.getComponent(SkeletalAnimation).getState("Run_Attack_Woodcutter").isPlaying) {
                return;
            }
            this.node.getComponent(SkeletalAnimation).play("Run_Attack_Woodcutter");

        }
    }

    playAttackAni() {
        this._targetMonster.hit(this);
        App.parterController.removeMonsterTarget(this._targetMonster);
        this.dead();
    }


    public dead() {
        // console.log("parter dead");
        // 从RVO模拟器中移除代理，避免残留影响路径计算
        if (this.agentHandleId !== -1) {
            Simulator.instance.removeAgent(this.agentHandleId);
            this.agentHandleId = -1;
        }

        if (this._walkTween) {
            this._walkTween.stop();
        }
        this._state = ParterState.Dead;

        //死亡动画
        const effectNode: Node = App.poolManager.getNode(GlobeVariable.entifyName.TX_Attack_hit);
        if (effectNode) {
            const ani: Animation = effectNode.getComponent(Animation);
            if (ani) {
                effectNode.parent = App.sceneNode.effectParent;
                effectNode.setWorldPosition(this.node.worldPosition.clone());
                ani.play();
                ani.once(Animation.EventType.FINISHED, () => {
                    effectNode.removeFromParent();
                    App.poolManager.returnNode(effectNode, GlobeVariable.entifyName.TX_Attack_hit);
                });
            }
        }
        // this.node.getComponent(SkeletalAnimation).stop();
        this.node.getComponent(SkeletalAnimation).play("Run_Woodcutter");
        App.poolManager.returnNode(this.node, GlobeVariable.entifyName.Parter);
    }

    /**
    * 设置追踪主角的线速度方向和大小
    *  
    */
    setPreferredVelocities() {
        if (this.agentHandleId < 0) {
            return;
        }
        const selfPos = this.node.getWorldPosition()
        if (!this._targetMonster || !this._targetMonster.isAlive()) {
            if (this._targetMonster) {
                App.parterController.removeMonsterTarget(this._targetMonster);
            }
            let enemyList = App.enemyController.getEnemyList();
            let nearest: EnemyBear = null;
            let minDistSqr = Infinity;
            for (let i = 0; i < enemyList.length; i++) {
                if (!enemyList[i] || !enemyList[i].isAlive() || !enemyList[i].node) {
                    return;
                }
                const monsterPos = enemyList[i].node.getWorldPosition();
                const distSqr = Vec3.squaredDistance(selfPos, monsterPos);
                if (distSqr < minDistSqr && !App.parterController.hasTarget(enemyList[i])) {
                    minDistSqr = distSqr;
                    nearest = enemyList[i];
                }
            }
            if (nearest) {
                App.parterController.addMonsterTarget(nearest);
                this._targetMonster = nearest;
            }
        }

        if (!this._targetMonster) {
            return;
        }

        const dis: number = Vec3.squaredDistance(selfPos, this._targetMonster.node.getWorldPosition());
        if (dis < 5) {
            this.attackMonster();
            return;
        }


        let agentAid = this.agentHandleId;
        let agent = Simulator.instance.getAgentByAid(agentAid)
        let agentPos = Simulator.instance.getAgentPosition(agentAid)


        let moveTargetPos: Vec2 = new Vec2(this._targetMonster.node.getWorldPosition().x,
            this._targetMonster.node.getWorldPosition().z);

        if (agent && agentPos) {
            let goalVector: Vec2 = moveTargetPos.subtract2f(agentPos.x, agentPos.y)
            if (goalVector.lengthSqr() > 1.0) {
                goalVector = goalVector.normalize().multiplyScalar(agent.maxSpeed_);
            }
            if (goalVector.lengthSqr() < RVOMath.RVO_EPSILON) {
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
        this.node.worldRotation = resultQuat;
    }

    /**
     * 在此之前 请确保Simulator run执行完毕
     */
    moveByRvo(dt) {
        if (this._state != ParterState.track) {
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

