import { _decorator, Component, Node } from 'cc';
import { PartnerManager } from './PartnerManager';
const { ccclass, property } = _decorator;

@ccclass('PartnerJackMananger')
export class PartnerJackMananger extends Component {
    start() {

    }

    fireAtTarget(name) {
        const playerManager = this.node.parent.getComponent(PartnerManager)
        if (name == "walk") {
            playerManager.walkingAttackEffects();
        } else {
            playerManager.pauseAttackEffect();
        }
    }

    update(deltaTime: number) {

    }
}


