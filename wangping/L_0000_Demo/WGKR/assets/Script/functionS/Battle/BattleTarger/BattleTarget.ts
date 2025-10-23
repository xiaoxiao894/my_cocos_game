import { _decorator, Component, Node, RigidBody2D, Vec3 } from 'cc';
import { BattleTargetBase } from '../Base/BattleTargetBase';
import { vectorPower, vectorPower_v2 } from '../../../Tool/Index';
import { MoveDrive } from '../../../Base/MoveDrive';
const { ccclass, property } = _decorator;

@ccclass('BattleTarget')
export abstract class BattleTarget extends BattleTargetBase {
    // private _move: MoveDrive

    // public get moveD() {
    //     if (!this._move) {
    //         this._move = this.node.getComponent(MoveDrive);
    //     }
    //     return this._move;
    // }
    public Hit(damage: number): number {
        if (this.isDie) {
            return 0;
        }
        this.curHp -= damage;
        this.curHp = Math.max(0, this.curHp);
        this.curHp = Math.min(this.MaxHp, this.curHp);
        let value = this.curHp / this.MaxHp;
        if (this.isDie) {
            this.die();
        } else {
            this.damage(damage);
        }
        this.hpC.value = value;
        return value;
    }

    public repelBattleTarget(target: Node, reoel: number = 0) {
        const v = vectorPower(target, this.node, reoel);
        v.y = 0;
        this.rig.applyImpulse(v);
    }

    public init(difficulty: number) {
        this.initHp(difficulty);
        this.hpC.value = 1;
    }

}


