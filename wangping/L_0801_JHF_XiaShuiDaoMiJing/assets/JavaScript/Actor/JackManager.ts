import { _decorator, Component, Node } from 'cc';
import { PlayerManager } from './PlayerManager';
import { DataManager } from '../Global/DataManager';
import { Actor } from './Actor';
import { PlayerWeaponTypeEnum } from '../Enum/Index';
import { SoundManager } from '../Common/SoundManager';
const { ccclass, property } = _decorator;

@ccclass('JackManager')
export class JackManager extends Component {

    fireAtTarget(name) {
        if (!this.node.parent || !this.node.parent.parent) return;
        const playerManager = this.node.parent.parent.getComponent(PlayerManager)
        if (DataManager.Instance.curWeaponType == PlayerWeaponTypeEnum.CottonSwab) {
            SoundManager.inst.playAudio("wuqi1");
        } else if (DataManager.Instance.curWeaponType == PlayerWeaponTypeEnum.Knife) {
            SoundManager.inst.playAudio("wuqi2");
        } else if (DataManager.Instance.curWeaponType == PlayerWeaponTypeEnum.Flamethrower) {
            SoundManager.inst.playAudio("wuqi3");
        }

        if (name == "walk") {
            playerManager.walkingAttackEffects();
        } else {
            playerManager.pauseAttackEffect();
        }
    }

    centerAttackEnd() {
        if (DataManager.Instance.playerAction) {
            DataManager.Instance.playerAction = false;
        }
    }

    attackEnd(name) {
        DataManager.Instance.playerAction = true;
    }

    start() {

    }

    update(deltaTime: number) {

    }
}


