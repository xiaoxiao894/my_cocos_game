import { _decorator, Color, Component, Label, Node, tween, Vec3 } from 'cc';
import { DataManager } from '../Global/DataManager';
import { LanguageManager } from '../Language/LanguageManager';
const { ccclass, property } = _decorator;

@ccclass('UIPropertyManager')
export class UIPropertyManager extends Component {
    @property(Label)
    propertyLabel: Label = null;

    @property(Label)
    downloadLabel: Label = null;

    private _breathTween = null;
    _total = 0;
    start() {
        const text = LanguageManager.t('download');
        if (this.downloadLabel && text) {
            this.downloadLabel.string = text;
        }

        DataManager.Instance.UIPropertyManager = this;

        this._total = 0;

        this.propertyLabel.string = `${this._total}`;


    }

    collectProperty() {
        this._total++;
        this.propertyLabel.string = `${this._total}`;

        this.playChangeAni(true)
    }

    deliverProperty() {
        this._total--;
        if (this._total >= 0) {
            this.propertyLabel.string = `${this._total}`;
        }

        this.playChangeAni(false)
    }

    // 播数字变化动画动画
    private playChangeAni(isAdd: boolean) {
        if (this._breathTween) {
            this._breathTween.stop(); // 停止之前的动画
        }
        if (isAdd) {
            this.propertyLabel.color = new Color().fromHEX('#00ff00');
        } else {
            this.propertyLabel.color = new Color().fromHEX('#ff0000');
        }
        const tweenAni = tween(this.propertyLabel.node)
            .to(0.08, { scale: new Vec3(1.1, 1.1, 1.1) }, { easing: 'quadOut' })
            .to(0.08, { scale: new Vec3(1, 1, 1) }, { easing: 'quadIn' })
            .call(() => {
                this.propertyLabel.color = new Color().fromHEX('#FFFFFF');
            })
            .start();

        this._breathTween = tweenAni;
    }

    update(deltaTime: number) {

    }
}


