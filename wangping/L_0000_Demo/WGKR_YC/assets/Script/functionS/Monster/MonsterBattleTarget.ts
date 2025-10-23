import { _decorator, Component, Node } from 'cc';
import { BattleTarget } from '../Battle/BattleTarger/BattleTarget';
import AudioManager, { SoundEnum } from '../../Base/AudioManager';
const { ccclass, property } = _decorator;

@ccclass('MonsterBattleTarget')
export class MonsterBattleTarget extends BattleTarget {

    @property(Node)
    public hitNode: Node;

    protected damage(power: number): void {
    }
    protected die(): void {
        AudioManager.inst.playOneShot(SoundEnum.Sound_monster_die);
    }

}


