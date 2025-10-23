import { _decorator, Component, Node, SkeletalAnimation } from 'cc';
import { DataManager } from '../Global/DataManager';
const { ccclass, property } = _decorator;

@ccclass('StagbeetleEventManager')
export class StagbeetleEventManager extends Component {
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


    AttackAnimation() {
        const yezi1 = this.outputStartingPoint1.getComponent(SkeletalAnimation);
        const yezi2 = this.outputStartingPoint2.getComponent(SkeletalAnimation);
        const yezi3 = this.outputStartingPoint3.getComponent(SkeletalAnimation);

        DataManager.Instance.soundManager.grassMakeSoundPlay();

        yezi1?.play('hit');
        yezi2?.play('hit');
        yezi3?.play('hit');
    }
}


