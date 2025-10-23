import { _decorator, Component, Node, SkeletalAnimation, CCString, Vec3, tween, Material, MeshRenderer, CCInteger, Quat, geometry, PhysicsSystem, Animation, Vec2, v2 } from 'cc';
import { DataManager } from '../Global/DataManager';
import { FlowField } from './FlowField';
import Util from '../Common/Util';
import { Simulator } from '../RVO/Simulator';
import { RVOMath } from '../RVO/Common';
const { ccclass, property } = _decorator;

@ccclass('MonsterItem')
export class MonsterItem extends Component {

    @property(SkeletalAnimation)
    ani: SkeletalAnimation = null;

    @property(CCString)
    runAniName: string = "walk_f";

    @property(CCString)
    dieAniName: string = "die";

    @property(CCInteger)
    speed: number = 5;

    private _isDead: boolean = false;
    private _index: number;
    private _lastPathHasObstacle: boolean = false;
    private _checkCounter: number = 0;

    //rvo
    private _frames: number = 0;
    private _agentHandleId: number = -1; //RVOid
    public get agentHandleId(): number {
        return this._agentHandleId;
    }
    public set agentHandleId(value: number) {
        this._agentHandleId = value;
    }


    public init(index: number) {
        this._index = index;
        this._isDead = false;
        if (this.runAniName) {
            this.scheduleOnce(() => {
                this.ani.play(this.runAniName);
            }, 0);
        }
    }

    public deathAni() {
        if (this._isDead) {
            return;
        }
        this._isDead = true;
        this.ani.play(this.dieAniName);
        this.ani.once(Animation.EventType.FINISHED, () => {
            DataManager.Instance.monsterManager.recycleMonster(this._index, this.node);
            if (this.agentHandleId >= 0) {
                Simulator.instance.removeAgent(this.agentHandleId);
            }
        });
    }


    update(dt: number) {
        if (this._isDead) {
            return;
        }

        if (this._frames++ > 8) {
            this._frames = 0
            this.setPreferredVelocities()//设置追踪主角的线速度
        }
    }

    /**
     * 检查到玩家之间是否有障碍物
     */
    private hasObstacleToPlayer(playerPos: Vec3): boolean {
        const ray = new geometry.Ray(
            this.node.worldPosition.x,
            this.node.worldPosition.y + 0.5, // 从腰部高度发射
            this.node.worldPosition.z,
            playerPos.x - this.node.worldPosition.x,
            playerPos.y - this.node.worldPosition.y,
            playerPos.z - this.node.worldPosition.z
        );

        // 射线检测（忽略怪物和玩家层）
        const mask = 1 << 8 | 1 << 9;
        const bResult = PhysicsSystem.instance.raycastClosest(ray, mask, 10);
        if (bResult) {
            const result = PhysicsSystem.instance.raycastClosestResult;
            const distanceToObstacle = Vec3.distance(this.node.position, result.hitPoint);
            return distanceToObstacle < 5.0; // 5米内视为有障碍
        }
        return false;
    }

    // getCircle(world: boolean = false) {
    //     let agent = Simulator.instance.getAgentByAid(this.agentHandleId)
    //     if (agent) {
    //         if (world) {
    //             return { pos: Util.v3t2(this.node.worldPosition), radius: agent.radius_ }
    //         } else {
    //             return { pos: Util.v3t2(this.node.position), radius: agent.radius_ }
    //         }

    //     } else {
    //         console.error("monster Circle error...")
    //         return null;
    //     }
    // }

    /**
    * 设置追踪主角的线速度方向和大小
    */
    //_tmpScale: Vec3 = new Vec3()
    setPreferredVelocities() {
        if (this.agentHandleId < 0) {
            return
        }
        //this._tmpScale = this.node.getScale()
        let agentAid = this.agentHandleId
        let agent = Simulator.instance.getAgentByAid(agentAid)
        let agentPos = Simulator.instance.getAgentPosition(agentAid)
        let moveTarget: Vec2 = v2(DataManager.Instance.player.node.getWorldPosition().x, DataManager.Instance.player.node.getWorldPosition().z);
        if (agent && agentPos) {
            let goalVector: Vec2 = moveTarget.subtract2f(agentPos.x, agentPos.y)//  this.goals[i].minus(Simulator.instance.getAgentPosition(agentAid));
            if (goalVector.lengthSqr() > 1.0) {
                goalVector = goalVector.normalize().multiplyScalar(agent.maxSpeed_);
            }
            if (goalVector.lengthSqr() < RVOMath.RVO_EPSILON) {
                Simulator.instance.setAgentPrefVelocity(agentAid, Vec2.ZERO);
            }
            else {
                Simulator.instance.setAgentPrefVelocity(agentAid, goalVector);
                //这个会导致抖动呀 宝贝...
                // let angle = Math.random() * 2.0 * Math.PI;
                // let dist = Math.random() * 0.0001;
                // Simulator.instance.setAgentPrefVelocity(i,
                //     Simulator.instance.getAgentPrefVelocity(i).plus(new Vector2(Math.cos(angle), Math.sin(angle)).scale(dist)));
            }
            //朝向
            const targetRotation = new Quat();
            Quat.fromViewUp(targetRotation, new Vec3(goalVector.x, 0, goalVector.y).normalize());
            this.node.worldRotation = targetRotation;
        } else {
            console.error("RVO异常::", agent, agentPos, agentAid)
        }
        // }
    }

    /**
     * 在此之前 请确保Simulator run执行完毕
     */
    moveByRvo() {
        if (this._isDead) {
            return;
        }
        // console.log("p::", p, Simulator.instance.getAgentPosition(this.agentHandleId))
        let p = Simulator.instance.getAgentPosition(this.agentHandleId);
        this.node.setWorldPosition(p.x, 0, p.y);
        //console.log("moveByRvo::", p, this.node.position, this.agentHandleId);

        //网格更新怪位置
        DataManager.Instance.gridSystem?.updateNode(this.node);
    }

}



