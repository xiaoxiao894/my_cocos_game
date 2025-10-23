import { _decorator, Camera, Component, Node, tween, UIOpacity, Vec3 } from 'cc';
import { DataManager } from '../Global/DataManager';
const { ccclass, property } = _decorator;

@ccclass('moneyMaxManager')
export class moneyMaxManager extends Component {
    @property
    floatHeight: number = 50;

    @property
    duration: number = 1.0;

    uiOpacity = null;

    start() {
        DataManager.Instance.moneyMaxManager = this;
    }

    playAnimation() {
        this.uiOpacity = this.node.getComponent(UIOpacity) || this.node.addComponent(UIOpacity);
        this.uiOpacity.opacity = 0; // 从完全透明开始

        const startPos = this.node.position.clone();
        const endPos = new Vec3(startPos.x, startPos.y + this.floatHeight, startPos.z);

        tween(this.uiOpacity)
            .to(this.duration * 0.3, { opacity: 255 }) // 渐显
            .start();

        tween(this.node)
            .to(this.duration, { position: endPos }, { easing: 'quadOut' }) // 上升动画
            .call(() => {
                tween(this.uiOpacity)
                    .to(this.duration * 0.3, { opacity: 0 }) // 渐隐
                    .call(() => {
                        this.node.setPosition(startPos);
                    })
                    .start();
            })
            .start();
    }

}
