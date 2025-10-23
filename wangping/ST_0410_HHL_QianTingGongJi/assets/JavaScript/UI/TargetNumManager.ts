import { _decorator, Component, Label, Node } from 'cc';
import { DataManager } from '../Globel/DataManager';
const { ccclass, property } = _decorator;

@ccclass('TargetNumManager')
export class TargetNumManager extends Component {
    start() {
        DataManager.Instacne.targetNumManager = this;

        this.initTargetNum();
    }

    initTargetNum() {
        DataManager.Instacne.currentBulletCount = DataManager.Instacne.targetBulletCount;

        const labelCom = this.node.getComponent(Label)
        labelCom.string = `${DataManager.Instacne.currentBulletCount}`;
    }

    // 炮弹递减
    numberOfShell() {
        const labelCom = this.node.getComponent(Label);
        if (DataManager.Instacne.currentBulletCount > 0) {
            DataManager.Instacne.currentBulletCount -= 1;

            labelCom.string = `${DataManager.Instacne.currentBulletCount}`;
        }
    }
}


