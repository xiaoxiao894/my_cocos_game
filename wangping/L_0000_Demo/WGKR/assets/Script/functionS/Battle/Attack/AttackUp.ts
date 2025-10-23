import { _decorator, CCFloat, Collider, Component, EventKeyboard, ITriggerEvent, Node, v3, Vec3 } from 'cc';
import { AttackLevel, EffectEnum } from '../../../Base/EnumIndex';
import { UnityUpComponent } from '../../../Base/UnityUpComponent';
import ColliderTag, { COLLIDE_TYPE } from '../CollectBattleTarger/ColliderTag';
import { BattleTarget } from '../BattleTarger/BattleTarget';
import { CollectBattleTarger } from '../CollectBattleTarger/CollectBattleTarger';
import { CollectGetTarget } from '../CollectBattleTarger/CollectGetTarget';
import AttackState from './AttackState';
import { EffectManager } from '../../Effect/EffectManager';
import { getPosRandomPos, isPointInCameraView } from '../../../Tool/Index';
import AudioManager, { SoundEnum } from '../../../Base/AudioManager';
const { ccclass, property } = _decorator;

@ccclass('AttackUp')
export class AttackUp extends UnityUpComponent {


    private _collectBattleTarget: CollectGetTarget;

    public attackIn: boolean = false;;

    protected onLoad(): void {
        this._collectBattleTarget = this.getComponent(CollectGetTarget);
    }


    protected _update(dt: number): void {

        if (this.attackSwitch) {
            if (this.attackLevel == AttackLevel.fire) {
                if (this._time <= 0) {
                    this._time = 1 / this.fireAttackSpeed;
                    for (let i = this.fireBattleList.length - 1; i >= 0; i--) {
                        let battle = this.fireBattleList[i];
                        if (battle.isDie) {
                            this.fireBattleList.splice(i, 1);
                        } else {
                            this.attack(battle, this.firePower, this.fireReoel);
                        }
                    }
                }
            }
        }
        this._time -= dt;
    }

    private _attackSwitch: boolean = false;
    public get attackSwitch() {
        return this._attackSwitch;
    }

    public set attackSwitch(value: boolean) {
        this._collicet.enabled = value;
        this._attackSwitch = value;
    }


    @property({ type: AttackLevel })
    private _attackLevel: AttackLevel = AttackLevel.knife;

    @property({ type: COLLIDE_TYPE })
    public attackTargetTag: COLLIDE_TYPE[] = [];
    private _collicet: Collider;




    public set collider(value: Collider) {
        if (this._collicet) {
            this._collicet.off("onTriggerEnter", this.onStartCollide, this);
            this._collicet.off("onTriggerExit", this.onEndCollide, this);
        }
        this._collicet = value;
        this._collicet.on("onTriggerEnter", this.onStartCollide, this);
        this._collicet.on("onTriggerExit", this.onEndCollide, this);
    }

    @property({ type: AttackLevel })
    public get attackLevel() {
        return this._attackLevel;
    }
    public set attackLevel(value: AttackLevel) {
        this._attackLevel = value;
    }

    @property({
        type: CCFloat,
        visible(this: AttackUp) {
            return this.attackLevel == AttackLevel.knife;
        }
    })
    public knifePower: number = 30;

    @property({
        type: CCFloat,
        visible(this: AttackUp) {
            return this.attackLevel == AttackLevel.knife;
        }
    })
    public knifeReoel: number = 30;




    @property({
        type: CCFloat,
        visible(this: AttackUp) {
            return this.attackLevel == AttackLevel.bigKnife;
        }
    })
    public droadPower: number = 30;

    @property({
        type: CCFloat,
        visible(this: AttackUp) {
            return this.attackLevel == AttackLevel.bigKnife;
        }
    })
    public droadReoel: number = 30;



    @property({
        type: CCFloat,
        visible(this: AttackUp) {
            return this.attackLevel == AttackLevel.fire;
        }
    })
    public firePower: number = 30;

    @property({
        type: CCFloat,
        visible(this: AttackUp) {
            return this.attackLevel == AttackLevel.fire;
        }
    })
    public fireReoel: number = 30;

    @property({
        type: CCFloat,
        visible(this: AttackUp) {
            return this.attackLevel == AttackLevel.fire;
        }
    })
    public fireAttackSpeed: number = 2;
    private _time: number = 0;
    private fireBattleList: BattleTarget[] = [];



    private onStartCollide(event: ITriggerEvent) {

        let colliderTag = event.otherCollider.getComponent(ColliderTag);
        if (colliderTag) {
            if (this.attackTargetTag.indexOf(colliderTag.tag) != -1) {
                let battle = event.otherCollider.getComponent(BattleTarget);
                if (battle) {
                    switch (this.attackLevel) {
                        case AttackLevel.knife:
                            this.attack(battle, this.knifePower, this.knifeReoel);
                            AudioManager.inst.playOneShot(SoundEnum.Sound_knife_hit);
                            break;
                        case AttackLevel.bigKnife:
                            this.attack(battle, this.droadPower, this.droadReoel);
                            AudioManager.inst.playOneShot(SoundEnum.Sound_BigKnife_hit);
                            break;
                        case AttackLevel.fire:
                            let index = this.fireBattleList.indexOf(battle);
                            if (index == -1) {
                                this.fireBattleList.push(battle);
                            }
                            break;
                    }
                }
            }
        }
    }

    private _tempV3: Vec3 = new Vec3();
    private attack(battle: BattleTarget, power: number, reoel: number) {
        if (this.attackSwitch && !battle.isDie) {
            battle.Hit(power);
            battle.repelBattleTarget(this.node, reoel);
            this._tempV3.set(battle.node.worldPosition);
            this._tempV3.y += 5;
            this._tempV3.set(getPosRandomPos(this._tempV3, 0.5, Vec3.ZERO, v3(1, 0, 1)));

            if (AttackLevel.fire == this.attackLevel) {
                EffectManager.instance.addShowEffect(this._tempV3, EffectEnum.fire_hit, 3);
                AudioManager.inst.playOneShot(SoundEnum.Sound_Fire_hit);
            } else {
                EffectManager.instance.addShowEffect(this._tempV3, EffectEnum.hit, 3);
            }
        }
    }



    private onEndCollide(event: ITriggerEvent) {
        let colliderTag = event.otherCollider.getComponent(ColliderTag);
        if (colliderTag) {
            if (this.attackTargetTag.indexOf(colliderTag.tag) != -1) {
                let battle = event.otherCollider.getComponent(BattleTarget);
                if (battle) {
                    switch (this.attackLevel) {
                        case AttackLevel.fire:
                            let index = this.fireBattleList.indexOf(battle);
                            if (index != -1) {
                                this.fireBattleList.splice(index, 1);
                            }
                            break;
                    }
                }
            }
        }
    }



    public get battleTarget() {
        return this._collectBattleTarget.singleTarget;
    }



}


