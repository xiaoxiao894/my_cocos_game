import { _decorator, Component, SkeletalAnimation, v3, Vec3,Node } from "cc";
import { eventMgr } from "../core/EventManager";
import { EventType } from "../core/EventType";
import StateMachine from "../core/SateMachine";
import { IdleState } from "../State/IdleState";
import { MoveState } from "../State/MoveState";
import { App } from "../App";


/**
 * 角色类型枚举
 */
export enum CharacterType {
    Player = "Player",    // 玩家角色
    StaticPlayer = "StaticPlayer",    // 静态玩家角色
    AIPlayer = "AIPlayer",  //不需要操作有自己行为的角色
    Enemy = "Enemy",    // 敌人角色
    Parter = "Parter",  // 伙伴
}
/**
 *   角色状态机名字
 */
export enum CharacterStateType {
    Idle = "idle",    // 玩家角色
    Move = "move",    // 静态玩家角色
    MoveAttack = "moveAttack",  //不需要操作有自己行为的角色
    Attack = "attack",    // 敌人角色
}
const { ccclass, property } = _decorator;

@ccclass('Entity')
export default class Entity extends Component {


    id: string;

    entityName: string;

    hp: number = 0;

    maxHp: number = 0;

    attack: number = 0;

    defense: number = 0;

    type: string = CharacterType.Player; 
    
    protected moveSpeed: number = 0;

    stateMachine: StateMachine = new StateMachine();

    destForward: Vec3 = v3();

    target: unknown = null;

    moveTargetWorldPos:Vec3 = null; //移动到的目标位置

    //不同的怪有不同的动画方式
    @property(SkeletalAnimation)
    characterSkeletalAnimation: SkeletalAnimation = null;

    protected onLoad(): void {

        // 初始化状态机
         this.stateMachine.addState(CharacterStateType.Idle, new IdleState(this));
         this.stateMachine.addState(CharacterStateType.Move, new MoveState(this));
        // 监听事件
        this.setupEventListeners();
    }
    getMachineName() {
        return this.stateMachine.getStateName();
    }


    //设置移动速度
    setMoveSpeed(speed: number) {
        this.moveSpeed = speed;
    }
    //获取移动速度
    getMoveSpeed() {
        return this.moveSpeed;
    }
    //没有配置表手动默认
    setData(id: string, name: string, hp: number, attack: number, type: string) {
        this.id = id;
        this.entityName = name;
        this.hp = hp;
        this.maxHp = hp;
        this.attack = attack;
        this.type = type;
    }
    //获取ID
    getId() {
        return this.id;

    }
    getEntityName() {
        return this.entityName;
    }
    /**获取类型 */
    getType() {
        return this.type;
    }
    entitySetPosition(pos: Vec3) {
        this.node.setPosition(pos);
    }
    entityGetPosition() {
        return this.node.position;
    }
    private setupEventListeners(): void {
  
    }
    takeDamage(damage: number,callback?: (...agrs:unknown[]) => void): void {
        const finalDamage = Math.max(damage - this.defense, 0);
        console.log("damage damage " + damage);
        console.log("this.defense this.defense " + this.defense);
        this.hp -= finalDamage;
        if(this.hp <= 0){
            this.hp = 0;
        }
        //eventMgr.emit(EventType.ENTITY_TAKE_DAMAGE, this, finalDamage);
        if (this.hp <= 0) {
            this.die(callback);
        } else {
           // this.stateMachine.setState("hurt");
        }
        if(callback){
            callback(this.hp <= 0);
        }
    }


    heal(amount: number): void {
        this.hp = Math.min(this.hp + amount, this.maxHp);
      
    }

    die(callback?: (...agrs:unknown[]) => void): void {

        this.stateMachine.setState("die",callback);
    
    }
    move(callback?: (...agrs:unknown[]) => void): void {
      
        this.stateMachine.setState("move",callback);
    }
    moveAttack(callback?: (...agrs:unknown[]) => void): void {
        this.stateMachine.setState("moveAttack",callback);
    }
    idle() {
     
        this.stateMachine.setState("idle");
    }

    update(dt: number): void {

        this.stateMachine.update(dt);
    }

    useSkill(callback?: (...agrs:unknown[]) => void): void {
        this.stateMachine.setState("attack",callback);
    }

    // /** 当前节点是否在城内 */
    // public isInDoor(): boolean {
    //     return this.posIsInDoor(this.node.worldPosition.clone());
    // }

    // /** 坐标是否在栅栏内 */
    // public posIsInDoor(pos:Vec3):boolean{
    //     let palings:Node[]=App.sceneNode.palingLevels;
    //     if(palings[0].active === true){
    //         //1级
    //         return App.palingAttack.inPalingsByLevel(1,pos);
    //     }else if(palings[1].active === true){
    //         //2级
    //         if(!App.palingAttack.inPalingsByLevel(2,pos)){
    //             //3级
    //             if(palings[2].active === true){
    //                 return App.palingAttack.inPalingsByLevel(3,pos);
    //             }else{
    //                 return false;
    //             }
    //         }else{
    //             return true;
    //         }
    //     }
    //     return false;
    // }

}

