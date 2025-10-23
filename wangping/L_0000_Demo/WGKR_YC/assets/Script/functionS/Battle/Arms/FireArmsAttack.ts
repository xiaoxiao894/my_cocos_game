import { _decorator, CCFloat, Collider, Component, ITriggerEvent, Node, v3, Vec3 } from 'cc';
import { ArmsAttackBase } from './ArmsAttackBase';
import { AttackParkPlay } from '../AttackParkPlay';
import { MonsterBattleTarget } from '../../Monster/MonsterBattleTarget';
import { UnityUpComponent } from '../../../Base/UnityUpComponent';
import { group } from 'console';
import ColliderTag from '../CollectBattleTarger/ColliderTag';
import AudioManager, { SoundEnum } from '../../../Base/AudioManager';
import { EffectEnum } from '../../../Base/EnumIndex';
import { EffectManager } from '../../Effect/EffectManager';
import { getPosRandomPos } from '../../../Tool/Index';
const { ccclass, property } = _decorator;

@ccclass('FireArmsAttack')
export class FireArmsAttack extends UnityUpComponent {

    private count: number = 0;
    protected _update(dt: number): void {
        if (this._isAttack) {
            this._attTime -= dt;
            if (this._attTime <= 0) {
                this._attTime = 1 / this.attackSpeed;
                this.count++;
                if (this.count >= this.attackSpeed) {
                    this.count = 0;
                    AudioManager.inst.playOneShot(SoundEnum.Sound_Fire);
                }
                for (let i = this._battleList.length - 1; i >= 0; i--) {
                    let battle = this._battleList[i];
                    if (battle.isDie) {
                        this._battleList.splice(i, 1);
                    } else {
                        battle.Hit(this.power);
                        battle.repelBattleTarget(this.node, this.reoel);
                        const pos = v3(getPosRandomPos(battle.hitNode.worldPosition, 0.5, Vec3.UP));
                        pos.y += 2;
                        EffectManager.instance.addShowEffect(pos, EffectEnum.fire_hit, 3);
                        AudioManager.inst.playOneShot(SoundEnum.Sound_Fire_hit);
                    }
                }
            }
        }
    }

    @property(CCFloat)
    public attackSpeed: number = 1.5;
    private _attTime: number = 0;

    @property(CCFloat)
    public power: number = 10;
    @property(CCFloat)
    public reoel: number = 10;

    private _isAttack: boolean;

    private _attackPark: AttackParkPlay;
    private collide: Collider;

    private _battleList: MonsterBattleTarget[] = [];

    init() {
        this.collide = this.getComponent(Collider);
        this._attackPark = this.getComponent(AttackParkPlay);
        this.collide.on("onTriggerEnter", this.onStartCollide, this);
        this.collide.on("onTriggerExit", this.onEndCollide, this);

    }

    public set isAttack(value: boolean) {
        this.count = 0;
        this._isAttack = value;
        if (value) {
            this._attackPark.play();
            AudioManager.inst.playOneShot(SoundEnum.Sound_Fire);
        } else {
            this._attackPark.stop();
        }

    }


    private onStartCollide(event: ITriggerEvent) {

        let colliderTag = event.otherCollider.getComponent(ColliderTag);
        if (colliderTag) {
            let battle = event.otherCollider.getComponent(MonsterBattleTarget);
            if (battle) {
                let index = this._battleList.indexOf(battle);
                if (index == -1) {
                    this._battleList.push(battle);
                }
            }

        }
    }


    private onEndCollide(event: ITriggerEvent) {

        let colliderTag = event.otherCollider.getComponent(ColliderTag);
        if (colliderTag) {
            let battle = event.otherCollider.getComponent(MonsterBattleTarget);
            if (battle) {
                let index = this._battleList.indexOf(battle);
                if (index != -1) {
                    this._battleList.splice(index, 1);
                }
            }

        }
    }

}


