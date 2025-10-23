import { _decorator, Component, Node, SkeletalAnimation } from 'cc';
import { StateDefine } from './StateDefine';
const { ccclass, property } = _decorator;

@ccclass('EachPartnerManager')
export class EachPartnerManager extends Component {

    currentState: StateDefine | string = null;

    skeletalAnimation = null;
    init() {
        this.skeletalAnimation = this.node.getComponent(SkeletalAnimation);
    }

    changState(state: StateDefine) {
        if (state == this.currentState) {
            return;
        }

        this.skeletalAnimation.crossFade(state, 0.1);
        this.currentState = state;
    }
}


