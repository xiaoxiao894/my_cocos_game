import { _decorator, Component, Node } from 'cc';
import { DataManager } from '../Global/DataManager';
const { ccclass, property } = _decorator;

@ccclass('DoorManager')
export class DoorManager extends Component {
    start() {
        DataManager.Instance.guideTargetList.push(this.node);
    }

    update(deltaTime: number) {

    }
}


