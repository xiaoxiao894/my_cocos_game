import { _decorator, Component, Node } from 'cc';
import { PlayerManager } from './PlayerManager';
import { DataManager } from '../Global/DataManager';
import { Actor } from './Actor';
const { ccclass, property } = _decorator;

@ccclass('JackManager')
export class JackManager extends Component {

    fireAtTarget(name) {
        const actor = this.node.parent.getComponent(Actor);
        if (!actor.qianbiNode.active) {
            if (DataManager.Instance.playerAction) return;
        }
        const playerManager = this.node.parent.getComponent(PlayerManager)
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


