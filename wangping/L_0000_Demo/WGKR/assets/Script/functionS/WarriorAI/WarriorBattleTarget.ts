import { _decorator, Component, Node } from 'cc';
import { BattleTarget } from '../Battle/BattleTarger/BattleTarget';
const { ccclass, property } = _decorator;

@ccclass('WarriorBattleTarget')
export class WarriorBattleTarget extends BattleTarget {
    protected damage(power: number): void {
    }
    protected die(): void {
    }
}


