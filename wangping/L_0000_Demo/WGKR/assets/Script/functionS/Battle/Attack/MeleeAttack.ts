import { _decorator, Component, Node } from 'cc';
import { AttackTargetBase } from '../Base/AttackTargetBase';
import { BattleTarget } from '../BattleTarger/BattleTarget';
const { ccclass, property } = _decorator;

@ccclass('MeleeAttack')
export class MeleeAttack extends AttackTargetBase {


    /**近战单体攻击 */

    protected attackEvent(power: number, reoel: number): void {
        let targetList = this.collectGettarget.singleTarget;
        if (targetList == null) {
            this.target = null;
            return;
        }
        let target = targetList;
        target.Hit(power);
        target.repelBattleTarget(this.node, reoel);

    }


}


