import { _decorator, Component, Node, tween, UIOpacity } from 'cc';
import { DataManager } from '../Global/DataManager';
const { ccclass, property } = _decorator;

@ccclass('UIWarnManager')
export class UIWarnManager extends Component {
    private _isTrue = true;

    start() {
        DataManager.Instance.uiWarnManager = this;

        this.node.active = false;
    }

    playWarnFadeAnimation() {
        if (!this._isTrue) return;
        this._isTrue = false;

        this.node.active = true;
        const opacity = this.node?.getComponent(UIOpacity) || this.node?.addComponent(UIOpacity);
        opacity.opacity = 0;

        tween(opacity)
            .to(0.5, { opacity: 255 }, { easing: 'quadOut' })  // 渐显
            .to(0.5, { opacity: 0 }, { easing: 'quadIn' })    // 渐隐
            .call(() => {
                this.node.active = false;
                this._isTrue = true;
            })
            .start();
    }
}


