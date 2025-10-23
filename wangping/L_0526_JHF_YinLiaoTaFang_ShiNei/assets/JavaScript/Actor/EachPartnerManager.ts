import { _decorator, Component, Node, SkeletalAnimation } from 'cc';
import { PartnerAttackEnum, StateDefine } from './StateDefine';
const { ccclass, property } = _decorator;

@ccclass('EachPartnerManager')
export class EachPartnerManager extends Component {
    @property(SkeletalAnimation)
    skeletalAnimation: SkeletalAnimation = null;

    currentState: PartnerAttackEnum | string = null;

    init() {
    }

    changState(state: PartnerAttackEnum) {
        if (state == this.currentState) {
            return;
        }

        this.skeletalAnimation.crossFade(state, 0.1);
        this.currentState = state;
    }
}


