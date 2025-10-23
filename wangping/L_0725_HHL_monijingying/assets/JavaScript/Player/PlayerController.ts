import { _decorator, Component,Vec3,SkeletalAnimation,Quat } from 'cc';
import Player from './Player';
import { EventManager } from '../Global/EventManager';
import { EntityTypeEnum, EventName, PlayerState } from '../Common/Enum';
import { PlayerTrigger } from './PlayerTrigger';
import { DataManager } from '../Global/DataManager';
import { Monster } from '../Monster/Monster';

const { ccclass, property } = _decorator;

@ccclass('PlayerController')
export class PlayerController extends Component {
    @property(Player)
    private player: Player = null;//玩家

    @property(PlayerTrigger)
    trigger: PlayerTrigger = null; //玩家触发器

    private attackInterval: number = 0.2; // 攻击检测间隔(秒)
    private lastAttackTime: number = 0;

    public attackDistanceSqr:number = 400; // 攻击距离平方 20

    private attackCornAngle:number = 90; // 攻击角度
    private attackMonsterAngle:number = 135; // 攻击角度

    //临时向量
    private tempVec1: Vec3 = new Vec3();
    private tempVec2: Vec3 = new Vec3();

    //下一个状态
    private _nextState:PlayerState;

    start(){
        DataManager.Instance.playerController = this;
        this.player.idle();
    }

    protected onEnable(): void {
        EventManager.inst.on(EventName.TouchScreenStart, this.playerMove, this);
        EventManager.inst.on(EventName.TouchScreenEnd, this.playerStop, this);
    }

    protected onDisable(): void {
        EventManager.inst.off(EventName.TouchScreenStart, this.playerMove, this);
        EventManager.inst.off(EventName.TouchScreenEnd, this.playerStop, this);
    }

    private playerMove(){
        if(DataManager.Instance.playerAction){
            this.player.move();
        }else{
            this._nextState = PlayerState.Move;
        }
        
    }

    private playerStop(){
        if(DataManager.Instance.playerAction){
            this.player.idle();
        }else{
            this._nextState = PlayerState.Idle;
        }
    }

    update(dt: number) {
        this.playerAttackCheck(dt);
    }

    playerAttackCheck(deltaTime: number) {
        // 添加攻击间隔，减少检测频率
        this.lastAttackTime += deltaTime;
        if (this.lastAttackTime < this.attackInterval) {
            return;
        }
        this.lastAttackTime = 0;
        const machine:string = this.player.getMachineName();
        if(machine === PlayerState.Attack || machine === PlayerState.MoveAttack){
            return;
        }

        
        //攻击
        if (this.checkAttack()) {
            if (this.player.getMachineName() == PlayerState.Move) {
                this.player.moveAttack(() => {
                    if(this._nextState === PlayerState.Idle){
                        this.player.idle();
                    }else{
                        this.playerMove();
                    }
                    this._nextState = null;
                });
                
            } else if (this.player.getMachineName() == PlayerState.Idle) {
                this.player.attack(() => {
                    if(this._nextState === PlayerState.Move){
                        this.player.move();
                    }else{
                        this.playerStop();
                    }
                    this._nextState = null;
                });
            }
        }
    }

    public checkAttack():boolean{
        // 攻击检测
        let attack:boolean = false;
        //大玉米检测
        if(this.trigger.triggerName() == EntityTypeEnum.BigCorn){
            const inAngle:boolean = DataManager.Instance.cornController.isBigCornInAngle(this.player.node,this.attackCornAngle);
            attack = inAngle;
        }
        //怪检测
        let currentAttackTargets:Array<Monster> = [];
        let monsterList = DataManager.Instance.monsterController.getMonsterList();
        for (let i = 0; i < monsterList.length; i++) {
            Vec3.copy(this.tempVec1, monsterList[i].node.worldPosition);
            this.player.node.getWorldPosition(this.tempVec2);
            // 计算距离
            const distanceSqr = Vec3.squaredDistance(this.tempVec1, this.tempVec2);

            //方向
            // 计算方向向量（敌人相对于玩家的位置）
            const direction = Vec3.subtract(new Vec3(), this.tempVec1, this.tempVec2);
            Vec3.normalize(direction, direction);

            // 获取玩家正前方的方向向量（假设玩家的forward是其正前方）
            const playerForward = this.player.node.forward.clone().multiplyScalar(-1);
            Vec3.normalize(playerForward, playerForward);

            // 计算两个方向向量的夹角（弧度）
            const angle = Math.acos(Vec3.dot(direction, playerForward));

            // 转换为角度，并检查是否在180度范围内
            const angleDegrees = angle * (180 / Math.PI);
            const isInFront = angleDegrees <= this.attackMonsterAngle;

            if (Number(distanceSqr.toFixed(2)) <= this.attackDistanceSqr && isInFront) {
                currentAttackTargets.push(monsterList[i]);
            }
        }
        if(currentAttackTargets.length > 0){
            attack = true;
            this.player.attackTargetList.push(...currentAttackTargets);
        }
        return attack;
    }

    
}


