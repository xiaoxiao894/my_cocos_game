import { _decorator, Component, Node } from 'cc';
import { PlayerManager } from './PlayerManager';
const { ccclass, property } = _decorator;

@ccclass('JackManager')
export class JackManager extends Component {

    fireAtTarget(name) {
        if (!this.node.parent || !this.node.parent.parent) return;

        const playerManager = this.node.parent.parent.getComponent(PlayerManager)
        if (name == "walk") {
            playerManager.walkingAttackEffects();
        } else {
            playerManager.pauseAttackEffect();
        }
    }
}


