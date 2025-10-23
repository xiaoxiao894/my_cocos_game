import { _decorator, Animation, AnimationState, Component, Node } from 'cc';
import { DataManager } from '../Global/DataManager';
const { ccclass, property } = _decorator;

@ccclass('PartnerManager')
export class PartnerManager extends Component {
    private _isWalkAttack = false;

    start() {

    }

    update(deltaTime: number) {

    }

    // 停顿攻击特效
    pauseAttackEffect() {
        // const jack = this.node.getChildByName("jack");
        // const txWalkAttack = jack.getChildByName("TX_attack");
        // txWalkAttack.active = true;
        // const attackSprite = txWalkAttack.getChildByName("Sprite");

        // if (attackSprite) {
        //     const walkAttackAni = attackSprite.getComponent(Animation);
        //     if (walkAttackAni) {
        //         walkAttackAni.once(Animation.EventType.FINISHED, this._onAttackFinished, this);

        //         walkAttackAni.play("TX_Attack");
        //     }
        // }
    }

    private _onAttackFinished(anim: Animation, state: AnimationState) {
        if (state.name === "TX_Attack") {
            const jack = this.node.getChildByName("jack");
            const txWalkAttack = jack.getChildByName("TX_attack");
            txWalkAttack.active = false;

            if (this._isWalkAttack) {
                this._isWalkAttack = false;

                // this.walkingAttackEffects();
            }
        }
    }

    // 走路攻击特效
    walkingAttackEffects() {
        const jack = this.node.getChildByName("jack");
        const txWalkAttack = jack.getChildByName("TX_walk_attack");
        txWalkAttack.active = true;
        const walkAttackSprite = txWalkAttack.getChildByName("Sprite");

        if (walkAttackSprite) {
            const walkAttackAni = walkAttackSprite.getComponent(Animation);
            if (walkAttackAni) {
                walkAttackAni.once(Animation.EventType.FINISHED, this._onWalkAttackFinished, this);
                // walkAttackAni?.stop();
                walkAttackAni?.play("TX_Attack");
            }
        }
    }

    private _onWalkAttackFinished(anim: Animation, state: AnimationState) {
        if (state.name === "TX_Attack") {
            const jack = this.node.getChildByName("jack");
            const txWalkAttack = jack.getChildByName("TX_walk_attack");
            txWalkAttack.active = false;
        }
    }
}


