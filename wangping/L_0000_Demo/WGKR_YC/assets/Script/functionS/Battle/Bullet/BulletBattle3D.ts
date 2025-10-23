import { _decorator, ccenum, CCFloat, CCInteger, Collider2D, Component, IPhysics2DContact, ITriggerEvent, math, random, tween, Vec3 } from "cc";
import { BulletCollideBase3D as BulletCollideBase3D } from "./BulletCollideBase3D";
import { BulletEnum, EffectEnum } from "../../../Base/EnumIndex";
import LayerManager, { SceneType } from "../../../Base/LayerManager";
import { MoveDrive, MoveModEnum } from "../../../Base/MoveDrive";
import PoolManager, { PoolEnum } from "../../../Base/PoolManager";
import { EffectManager } from "../../Effect/EffectManager";
import { BattleTarget } from "../BattleTarger/BattleTarget";
import { getPosRandomPos } from "../../../Tool/Index";
import { MonsterBattleTarget } from "../../Monster/MonsterBattleTarget";
import AudioManager, { SoundEnum } from "../../../Base/AudioManager";
// import { BulletEnum } from "./BulletManager";
const { ccclass, property } = _decorator;

/**
 * 弹药战斗系统 使用 物理
 */
@ccclass('BulletBattle3D')
export default class BulletBattle3D extends BulletCollideBase3D {

    @property({ type: BulletEnum })
    public bulletEnum: BulletEnum = BulletEnum.arrow;

    @property({ type: EffectEnum })
    public effectEnum: EffectEnum = EffectEnum.hit;


    // @property({ type: Bullet_Hit_Enum })
    // public bulletHitEnum: Bullet_Hit_Enum = Bullet_Hit_Enum.gongjian;
    /**-1 关闭 弹药碰撞到第一个有效目标后 经过该时间后结束 优先：1   */
    @property(CCFloat)
    public triggerDieTime: number = -1;

    private _triggerDieTime: number = this.triggerDieTime;

    private _isTrigger: boolean = false;
    /**-1 关闭 弹药发出后结束的时间 优先：3    防止 一些永远无法攻击到敌人的弹药一直在场景中  无论该弹药是否攻击过*/
    @property(CCFloat)
    public overTime: number = 5;

    private _overTime: number = this.overTime;

    /**弹药攻击attackCount次 后结束 (只能大于0) 优先：2  到达次数后回收*/
    @property(CCInteger)
    public attackCount: number = 1;

    private _attackCount = this.attackCount;

    private _damage: number = 0;

    private _repelPower: number = 0;

    @property(MoveDrive)
    public moveD: MoveDrive;

    protected start(): void {
        this.moveD = this.node.getComponent(MoveDrive);
        if (!this.moveD) {
            this.moveD = this.node.addComponent(MoveDrive);
        }

    }

    protected update(dt: number): void {
        if (this.triggerDieTime != -1 && this._isTrigger) {
            if (this._triggerDieTime <= 0) {
                this.over();
            } else {
                this._triggerDieTime -= dt;
            }
        }
        else if (this._attackCount <= 0) {
            this.over();
        }
        else if (this.overTime != -1) {
            if (this._overTime <= 0) {
                this.over();
            } else {
                this._overTime -= dt;
            }
        }
        this.moveD.MoveEvent(dt);
    }

    private over() {
        this.node.active = false;
        PoolManager.instance.setPool(PoolEnum.bullet + this.bulletEnum, this);
    }

    private rotationV3: Vec3 = new Vec3();
    /**
     * 
     * @param angle 角度
     * @param damage 伤害
     * @param repelPower 击退力度
     */
    public setBulletInfo(angle: number, damage: number, repelPower: number) {

        if (LayerManager.instance.SceneType == SceneType.D2) {
            let r = angle / 180 * Math.PI;
            let vectorX = Math.cos(r);
            let vectorY = Math.sin(r);
            this.node.angle = angle;
            this.moveD.moveMod = MoveModEnum.vectorMove;
            this.moveD.vector.set(vectorX, vectorY);
        } else {
            // this.rotationV3.set(0, angle, 0);
            // this.node.eulerAngles = this.rotationV3;
            this.moveD.moveMod = MoveModEnum.forwardMove;
        }
        this._damage = damage;
        this._repelPower = repelPower;
        this._attackCount = this.attackCount;
        this._overTime = this.overTime;
        this._triggerDieTime = this.triggerDieTime;
        this._isTrigger = false;
        this.node.active = true;
        // if (this.bulletEnum == BulletEnum.arrow) {
        //     this.node.setScale(0.1, 0.1, 0.1);
        //     tween(this.node).to(0.5, { scale: Vec3.ONE }).start();
        // }
    }


    public temp: Vec3 = new Vec3();


    protected _startCollide(event: ITriggerEvent) {
        this._isTrigger = true;
        let battle = event.otherCollider.node.getComponent(BattleTarget);
        if (battle.isDie) {
            return;
        }
        battle.Hit(this._damage)
        battle.repelBattleTarget(this.node, this._repelPower);
        this._attackCount--;
        const ep = getPosRandomPos((battle as MonsterBattleTarget).hitNode.worldPosition, 0.5, Vec3.UP);
        this.temp.set(ep);
        this.temp.y += 2;

        // if (this.bulletHitEnum == Bullet_Hit_Enum.gongjian) {

        AudioManager.inst.playOneShot(SoundEnum.Sound_knife_hit);
        EffectManager.instance.addShowEffect(this.temp, this.effectEnum, 3.5);

    }
    protected _EndCollide(event: ITriggerEvent) {

    }

}