import { _decorator, Component, SkeletalAnimation,Node, Vec3 } from "cc";
import StateMachine from "./SateMachine";
import { EntityTypeEnum } from "./Enum";
import { DataManager } from "../Global/DataManager";

const { ccclass, property } = _decorator;

@ccclass('Entity')
export default class Entity extends Component {

    //动画
    @property(SkeletalAnimation)
    ani: SkeletalAnimation = null;

    @property(Node)
    attackNode:Node = null;

    stateMachine: StateMachine = new StateMachine();

    protected entityName: EntityTypeEnum;

    public attackNum:number = 1;
    hp: number = 0;
    maxHp: number = 0;

    

    protected onLoad(): void {
        this.startStateMachines();
    }

    /**
     * 初始化状态机
     */
    protected startStateMachines(): void {

    }

    public getEntityName() {
        return this.entityName;
    }

    getMachineName() {
        return this.stateMachine.getStateName();
    }

    update(dt: number): void {

        this.stateMachine.update(dt);
    }

    takeDamage(damage: number,callback?: (...agrs:unknown[]) => void): void {
        //console.log("damage damage " + damage);
        this.hp -= damage;
        if (this.hp <= 0) {
            this.die(callback);
        }
        if(callback){
            callback(this.hp <= 0);
        }
    }

    hit(play:Entity){
        
    }

    die(callback?: (...agrs:unknown[]) => void): void {
        
    }
}

