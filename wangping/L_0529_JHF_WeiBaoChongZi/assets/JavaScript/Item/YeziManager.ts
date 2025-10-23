import { _decorator, Component, Node, SkeletalAnimation } from 'cc';
import { DataManager } from '../Global/DataManager';
const { ccclass, property } = _decorator;

@ccclass('YeziManager')
export class YeziManager extends Component {
    @property(Node)
    outputStartingPoint1: Node = null;

    @property(Node)
    outputStartingPoint2: Node = null;

    @property(Node)
    outputStartingPoint3: Node = null;

    start() {

    }

    update(deltaTime: number) {

    }

    YeziIdle() {
        const yezi1 = this.outputStartingPoint1.getComponent(SkeletalAnimation);
        const yezi2 = this.outputStartingPoint2.getComponent(SkeletalAnimation);
        const yezi3 = this.outputStartingPoint3.getComponent(SkeletalAnimation);

        if (DataManager.Instance.meatConManager._pendingLeafIdleCount <= 0) {
            yezi1?.play('idle');
            yezi2?.play('idle');
            yezi3?.play('idle');
        }
    }
}


