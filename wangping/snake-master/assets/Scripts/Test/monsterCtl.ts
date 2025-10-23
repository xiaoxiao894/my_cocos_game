import { Component, Vec2, Vec3, _decorator, v2, v3 } from 'cc';
import { RVOMath } from '../RVO/Common';
import { Simulator } from '../RVO/Simulator';
import Util from '../core/utils/Util';
import MonsterFactory from './MonsterFactory';
import Game from './Test2';
import { monsterEffectCtl } from './monsterEffectCtl';
const { ccclass, property } = _decorator;

@ccclass('monsterCtl')
export class monsterCtl extends Component {
    private _hp: number = 5;
    public get hp(): number {
        return this._hp;
    }
    public set hp(value: number) {
        this._hp = value;
    }

    // private state : number =
    //测试受击
    // hurtCoolTime = 0.15;
    // hurtTime = 0.2;

    hurtCoolTime = 0.15;
    hurtTime = 0.2;
    private _hit: boolean = false
    private _hitPow: number = 3 //受击系数 系数越高 反弹力度越大

    private orScale: Vec3 = v3(1, 1, 1)
    public cutRectMonterList = []


    private _agentHandleId: number = -1; //RVOid
    public get agentHandleId(): number {
        return this._agentHandleId;
    }
    public set agentHandleId(value: number) {
        this._agentHandleId = value;
    }

    start() {
        this.orScale = this.node.scale
        this._effectCtl = this.node.getComponent(monsterEffectCtl)
    }

    _effectCtl: monsterEffectCtl
    reuse() {
        this._hit = false
        this.hurtTime = 0
        this._effectCtl = this.node.getComponent(monsterEffectCtl)
        if (this._effectCtl)
            this._effectCtl.reuse()
    }

    /**
     * 改为圆形判断
     */
    getRect() {
        let agent = Simulator.instance.getAgentByAid(this.agentHandleId)
        if (agent) {
            return agent.radius_
        }
    }

    _tmpV2: Vec2 = new Vec2()
    getCircle(world: boolean = false) {
        let agent = Simulator.instance.getAgentByAid(this.agentHandleId)
        if (agent) {
            if (world) {
                return { pos: Util.v3t2(this.node.worldPosition, this._tmpV2), radius: agent.radius_ }
            } else {
                return { pos: Util.v3t2(this.node.position, this._tmpV2), radius: agent.radius_ }
            }

        } else {
            console.error("monster Circle error...")
            return null
        }
    }

    _frames: number = 0
    update(deltaTime: number) {
        this.hurtTime -= deltaTime

        if (this._hit) {//设置 反向并且衰减的 线速度
            this.setPreferredVelocities(this._hitPow)//this._hitPow * this.hurtTime / this.hurtCoolTime
            if (this.hurtTime <= 0) {
                this._hit = false
            }
        } else {
            if (this._frames++ > 8) {
                this._frames = 0
                this.setPreferredVelocities()//设置追踪主角的线速度
                //确定朝向
            }
        }

    }

    /**
    * 设置追踪主角的线速度方向和大小
    */
    _tmpScale: Vec3 = new Vec3()
    setPreferredVelocities(hitPow: number = null) {
        if (this.agentHandleId < 0) {
            return
        }
        this._tmpScale = this.node.getScale()
        let agentAid = this.agentHandleId
        let agent = Simulator.instance.getAgentByAid(agentAid)
        let agentPos = Simulator.instance.getAgentPosition(agentAid)
        let moveTarget: Vec2 = v2(Game.Instance.Player.node.getPosition().x, Game.Instance.Player.node.getPosition().y)
        //受击状态的线速度处理
        if (hitPow) {
            if (agent && agentPos) {
                let goalVector: Vec2 = moveTarget.subtract2f(agentPos.x, agentPos.y)//  this.goals[i].minus(Simulator.instance.getAgentPosition(agentAid));
                goalVector = goalVector.normalize().multiplyScalar(agent.maxSpeed_ * -hitPow);
                Simulator.instance.setAgentPrefVelocity(agentAid, goalVector);
            }
            return
        }


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
            if (goalVector.x > 0) {
                this.node.setScale(this._tmpScale.set(Math.abs(this._tmpScale.x), this._tmpScale.y, this._tmpScale.z))
            } else {
                this.node.setScale(this._tmpScale.set(-Math.abs(this._tmpScale.x), this._tmpScale.y, this._tmpScale.z))
            }
        } else {
            console.error("RVO异常::", agent, agentPos, agentAid)
        }
        // }
    }

    /**
     * 在此之前 请确保Simulator run执行完毕
     */
    moveByRvo() {
        // console.log("p::", p, Simulator.instance.getAgentPosition(this.agentHandleId))
        let p = Simulator.instance.getAgentPosition(this.agentHandleId);
        this.node.setPosition(p.x, p.y)
    }

    /**
     * 测试效果 闪白 蓝光...
     */
    hurtAction() {
        let randEfIdx = Math.random()
        let mstEffectCtl = this.node.getComponent(monsterEffectCtl)
        if (mstEffectCtl) {
            if (randEfIdx > 0.5) {
                mstEffectCtl.playHit()
            } else {
                mstEffectCtl.playFroze()
            }
        }
    }

    hurt(): boolean {

        // if (!this.)
        if (this.hurtTime > 0) { //受击冷却中
            return
        }
        this.hurtTime = this.hurtCoolTime

        this._hp--
        if (this._hp <= 0) {
            this.rmMonster()
            return true
        } else {
            this.hurtAction()
            this._hit = true
            return false
        }
    }

    rmMonster() {
        this._effectCtl.disove(() => {
            if (this.agentHandleId >= 0) {
                Simulator.instance.removeAgent(this.agentHandleId)
                // console.log("移除RVO对象::", this.agentHandleId)
            }
            MonsterFactory.Instance.recoverNode(this.node)
        })
    }
}


