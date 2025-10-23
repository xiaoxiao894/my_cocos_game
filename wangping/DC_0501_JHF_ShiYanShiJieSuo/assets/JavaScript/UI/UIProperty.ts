import { _decorator, Component, Label, math, Node } from 'cc';
import { DataManager } from '../Global/DataManager';
const { ccclass, property } = _decorator;

@ccclass('UIProperty')
export class UIProperty extends Component {
    @property(Node)
    numberNode: Node = null;

    private _numLabelCom: Label = null;
    private _multiplier = 10;
    
    start() {
        DataManager.Instance.pt = this;

        this._numLabelCom = this.numberNode.getComponent(Label);
    }

    updateNumLabel() {
        if (!this._numLabelCom) return;

        const number = Math.floor(DataManager.Instance.medalsNumber) * this._multiplier;

        if (number >= 0) {
            this._numLabelCom.string = `${number}`;
        }
    }

    update(deltaTime: number) {

    }
}

