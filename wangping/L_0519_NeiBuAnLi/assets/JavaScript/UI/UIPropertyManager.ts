import { _decorator, Component, Label, Node } from 'cc';
import { DataManager } from '../Global/DataManager';
const { ccclass, property } = _decorator;

@ccclass('UIPropertyManager')
export class UIPropertyManager extends Component {
    @property(Label)
    propertyLabel: Label = null;

    _total = 0;
    start() {

        DataManager.Instance.UIPropertyManager = this;
        this._total = 0;

        this.propertyLabel.string = `${this._total}`;
    }

    collectProperty() {
        this._total++;
        this.propertyLabel.string = `${this._total}`;
    }

    deliverProperty() {
        this._total--;
        this.propertyLabel.string = `${this._total}`;
    }

    update(deltaTime: number) {

    }
}


