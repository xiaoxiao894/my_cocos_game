import { _decorator, Component, Node } from 'cc';
import { DataManager } from '../Global/DataManager';
import { SimplePoolManager } from '../Util/SimplePoolManager';
import { TypeItemEnum } from '../Enum/Index';
import { StackManager } from '../StackSlot/StackManager';
const { ccclass, property } = _decorator;

@ccclass('PlacingManager')
export class PlacingManager extends Component {
    start() {
        DataManager.Instance.placingManager = this;
    }

    resetPlacing() {
        for (let i = 0; i < this.node.children.length; i++) {
            const con = this.node.children[i];
            if (con.children.length <= 0) continue;

            const stackManager: StackManager = con["__stackManager"];
            if (stackManager) stackManager.clear();

            con.removeAllChildren();
        }

    }

}


