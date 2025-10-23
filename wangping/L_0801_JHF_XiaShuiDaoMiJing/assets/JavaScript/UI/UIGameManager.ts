import { _decorator, Color, Component, Label, Node, tween, Vec3 } from 'cc';
import { DataManager } from '../Global/DataManager';
const { ccclass, property } = _decorator;

@ccclass('UIGameManager')
export class UIGameManager extends Component {
    @property(Label)
    meatPropertyLabel: Label = null;

    @property(Label)
    coinPropertyLabel: Label = null;
    private _breathTween = null;
    _meatTotal = 0;
    _coinTotal = 0;
    start() {
        DataManager.Instance.uiPropertManager = this;
    }

    meatCollectProperty() {
        this._meatTotal++;
        this.meatPropertyLabel.string = `${this._meatTotal}`;
        this.playChangeAni(true)
    }

    meatDeliverProperty() {
        this._meatTotal--;
        if (this._meatTotal >= 0) {
            this.meatPropertyLabel.string = `${this._meatTotal}`;
            this.playChangeAni(false)
        }
    }

    coinCollectProperty() {
        this._coinTotal += 1;
        this.coinPropertyLabel.string = `${this._coinTotal}`;


    }

    coinDeliverProperty() {
        this._coinTotal -= 1;
        if (this._coinTotal >= 0) {
            this.coinPropertyLabel.string = `${this._coinTotal}`;
        }


    }

    // 播数字变化动画动画
    private playChangeAni(isAdd: boolean) {
        if (this._breathTween) {
            this._breathTween.stop(); // 停止之前的动画
        }
        if (isAdd) {
            this.meatPropertyLabel.color = new Color().fromHEX('#00ff00');
        } else {
            this.meatPropertyLabel.color = new Color().fromHEX('#ff0000');
        }
        const tweenAni = tween(this.meatPropertyLabel.node)
            .to(0.08, { scale: new Vec3(1.1, 1.1, 1.1) }, { easing: 'quadOut' })
            .to(0.08, { scale: new Vec3(1, 1, 1) }, { easing: 'quadIn' })
            .call(() => {
                this.meatPropertyLabel.color = new Color().fromHEX('#FFFFFF');
            })
            .start();

        this._breathTween = tweenAni;
    }
}


