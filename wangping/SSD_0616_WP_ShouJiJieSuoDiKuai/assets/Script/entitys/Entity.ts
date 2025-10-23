import { _decorator, Component, SkeletalAnimation, Vec3 } from "cc";
import { eventMgr } from "../core/EventManager";
import { EventType } from "../core/EventType";
import StateMachine from "../core/SateMachine";
import AttackState from "../states/AttackState";
import DieState from "../states/DieState";
import HurtState from "../states/HurtState";
import IdleState from "../states/IdleState";
import { MoveState } from "../states/MoveState";
import { CutTreeState } from "../states/CutTreeState";
import { HandOver } from "../states/HandOver";
import { CutCornState } from "../states/CutCornState";
import { CornHandOver } from "../states/CornHandOver";

/**
 * 角色类型枚举
 */
export enum CharacterType {
    CHARACTER = "character",    // 玩家角色
    ENEMY_TREE = "enemyTree",   // 树型敌人
    ENEMY = "enemy",            // 普通敌人
    ENEMY_ELITE = "enemy1"      // 精英敌人(红色)
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
    type: string = CharacterType.CHARACTER; // character  enemeyTree  enmey enemy1

    protected moveSpeed: number = 0;

    stateMachine: StateMachine = new StateMachine();

    target: unknown = null;

    moveTargetWorldPos:Vec3 = null; //移动到的目标位置

    protected moveCallBack:Function = null;

    //不同的怪有不同的动画方式
    @property(SkeletalAnimation)
    characterSkeletalAnimation: SkeletalAnimation = null;

    protected onLoad(): void {

        // 初始化状态机
        this.stateMachine.addState("idle", new IdleState(this));
        this.stateMachine.addState("attack", new AttackState(this));
        this.stateMachine.addState("hurt", new HurtState(this));
        this.stateMachine.addState("die", new DieState(this));
        this.stateMachine.addState("move", new MoveState(this));
        this.stateMachine.addState("cutTree", new CutTreeState(this));
        this.stateMachine.addState("handOver", new HandOver(this));
        this.stateMachine.addState("cutCorn", new CutCornState(this));
        this.stateMachine.addState("cornHandOver", new CornHandOver(this));


        // 监听事件
        this.setupEventListeners();
    }
    getMachineName() {
        return this.stateMachine.getStateName();
    }

    protected start(): void {
        //this.idle(this);
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
        //eventMgr.emit(EventType.ENTITY_TAKE_DAMAGE, this, finalDamage);
        if (this.hp <= 0) {
            this.die(callback);
        } else {
            this.stateMachine.setState("hurt");
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
    idle() {
     
        this.stateMachine.setState("idle");
    }

    update(dt: number): void {

        this.stateMachine.update(dt);
    }

    useSkill(callback?: (...agrs:unknown[]) => void): void {
        this.stateMachine.setState("attack",callback);
    }
    cutTree(callback?: (...agrs:unknown[]) => void): void {
        this.stateMachine.setState("cutTree",callback);
    }
    handOver(callback?: (...agrs:unknown[]) => void){
        this.stateMachine.setState("handOver",callback);
    }
    cornHandOver(callback?: (...agrs:unknown[]) => void){
        this.stateMachine.setState("cornHandOver",callback);
    }
    cutCorn(callback?: (...agrs:unknown[]) => void){
        this.stateMachine.setState("cutCorn",callback);
    }
}

