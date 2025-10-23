import { _decorator, CCFloat, Component, Node, RigidBody, RigidBody2D } from 'cc';
import { HpComponent } from '../../Other/HpComponent';
const { ccclass, property } = _decorator;


/**
 * 表示该物体可以被攻击
 * 
 */
@ccclass('BattleTargetBase')
export abstract class BattleTargetBase extends Component {
    public rig: RigidBody;


    @property(CCFloat)
    public MaxHp: number = 500;
    private defMaxHp: number = 0;
    protected curHp: number = 0;

    public isDestroy: boolean = false;

    @property(HpComponent)
    public hpC: HpComponent;



    protected onLoad(): void {
        this.initHp();
    }

    public initHp(difficulty: number = 1): void {
        if (!this.defMaxHp) {
            this.defMaxHp = this.MaxHp;
        }
        this.MaxHp = this.defMaxHp * difficulty;
        // console.log(this.MaxHp);
        this.curHp = this.MaxHp;
        this.isDestroy = false;
    }


    protected start(): void {
        this.rig = this.node.getComponent(RigidBody);
    }



    public abstract Hit(damage: number): number;

    public abstract repelBattleTarget(target: Node, reoel: number): void;



    public get isDie() {
        return this.curHp <= 0 || this.isDestroy;
    }




    protected abstract damage(power: number): void;
    protected abstract die(): void;



}


