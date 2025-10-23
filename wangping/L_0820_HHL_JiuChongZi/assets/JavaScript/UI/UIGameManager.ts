import { _decorator, Component, Label, Node } from 'cc';
import { DataManager } from '../Global/DataManager';
const { ccclass, property } = _decorator;

@ccclass('UIGameManager')
export class UIGameManager extends Component {
    @property(Label)
    meatPropertyLabel: Label = null;

    @property(Label)
    coinPropertyLabel: Label = null;

    _meatTotal = 0;
    _coinTotal = 0;
    start() {
        DataManager.Instance.uiPropertManager = this;
    }

    meatCollectProperty() {
        this._meatTotal++;
        this.meatPropertyLabel.string = `${this._meatTotal}`;
    }

    meatDeliverProperty() {
        this._meatTotal--;
        if (this._meatTotal >= 0) {
            this.meatPropertyLabel.string = `${this._meatTotal}`;
        }
    }

    coinCollectProperty() {
        this._coinTotal += 5;
        this.coinPropertyLabel.string = `${this._coinTotal}`;
    }

    coinDeliverProperty() {
        this._coinTotal -= 5;
        if (this._coinTotal >= 0) {
            this.coinPropertyLabel.string = `${this._coinTotal}`;
        }
    }
}


