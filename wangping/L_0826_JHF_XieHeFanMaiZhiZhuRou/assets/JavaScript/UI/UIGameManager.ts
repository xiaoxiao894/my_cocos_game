import { _decorator, Component, Label, Node } from 'cc';
import { DataManager } from '../Global/DataManager';
import { LanguageManager } from '../Language/LanguageManager';
const { ccclass, property } = _decorator;

@ccclass('UIGameManager')
export class UIGameManager extends Component {
    @property(Label)
    downloadLabel: Label = null;

    @property(Label)
    meatPropertyLabel: Label = null;

    @property(Label)
    coinPropertyLabel: Label = null;

    _meatTotal = 0;
    _coinTotal = 5;
    start() {
        const text = LanguageManager.t('download');
        if (this.downloadLabel && text) {
            this.downloadLabel.string = text;
        }

        DataManager.Instance.uiGameManager = this;
    }

    // 收集
    meatCollectProperty() {
        this._meatTotal++;
        this.meatPropertyLabel.string = `${this._meatTotal}`;
    }

    // 交付
    meatDeliverProperty() {
        if (this._meatTotal >= 0) {
            this._meatTotal--;
            this.meatPropertyLabel.string = `${this._meatTotal}`;
        }
    }

    coinCollectProperty() {
        this._coinTotal += 1;
        this.coinPropertyLabel.string = `${this._coinTotal}`;
    }

    coinDeliverProperty() {
        if (this._coinTotal >= 0) {
            this._coinTotal -= 1;
            this.coinPropertyLabel.string = `${this._coinTotal}`;
        }
    }

    // 重置属性
    resetProperty() {
        this._meatTotal = 0;
        this.meatPropertyLabel.string = `${this._meatTotal}`;

        this._coinTotal = 5;
        this.coinPropertyLabel.string = `${this._coinTotal}`;
    }
}


