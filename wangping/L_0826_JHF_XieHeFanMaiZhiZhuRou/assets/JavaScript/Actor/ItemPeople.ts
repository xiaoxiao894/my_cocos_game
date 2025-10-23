import { _decorator, Animation, Component, Node, SkeletalAnimation } from 'cc';
import { PeopleEnum } from './StateDefine';
const { ccclass, property } = _decorator;

@ccclass('ItemPeople')
export class ItemPeople extends Component {
    @property(SkeletalAnimation)
    skeletalAnimation: SkeletalAnimation = null;

    _currentState = null;

    bubbleValue: number = Infinity;

    start() {

    }

    update(deltaTime: number) {

    }

    changState(state: PeopleEnum | string) {
        if (this._currentState === state) {
            return;
        }

        const minion1 = this.node?.getChildByName("Minion");
        const minion1Ani = minion1?.getComponent(Animation);

        if (state === PeopleEnum.Idle) {
            this.skeletalAnimation?.crossFade(state as string, 0.1);
            // // 停止骨骼动画
            // if (this.skeletalAnimation) this.skeletalAnimation.stop();

            // // 播放非骨骼 idle 动画
            // if (minion1Ani) {
            //     minion1Ani.play("idleA");
            // }
            // this.skeletalAnimation?.crossFade(state as string, 0.1);
        } else {
            // 停止非骨骼动画
            // if (minion1Ani?.defaultClip) {
            //     minion1Ani.stop();
            // }

            // 播放骨骼动画
            this.skeletalAnimation?.crossFade(state as string, 0.1);
        }

        this._currentState = state;
    }

}


