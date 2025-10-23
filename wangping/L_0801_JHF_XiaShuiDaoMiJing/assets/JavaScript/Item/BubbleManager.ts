import { _decorator, Color, Component, Label, Node, tween, Vec3 } from 'cc';
import { DataManager } from '../Global/DataManager';
const { ccclass, property } = _decorator;

@ccclass('BubbleManager')
export class BubbleManager extends Component {
    @property(Node)
    meatIconNode: Node = null;

    @property(Label)
    numberLabel: Label = null;

    @property(Label)
    numberLabel1: Label = null;

    private _breathTween = null;
    private _originalScale: Vec3 = null; //  添加：记录原始 scale

    start() {
        DataManager.Instance.bubbleManager = this;
        this._originalScale = this.meatIconNode.scale.clone(); //  在 start 或 onLoad 中初始化
    }

    update(deltaTime: number) {

    }

    startBreathingAnimation() {
        const breatheScale = new Vec3(
            this._originalScale.x * 1.1,
            this._originalScale.y * 1.1,
            this._originalScale.z * 1.1
        );

        this._breathTween = tween(this.meatIconNode)
            .repeatForever(
                tween()
                    .to(0.8, { scale: breatheScale }, { easing: 'sineInOut' })
                    .to(0.8, { scale: this._originalScale }, { easing: 'sineInOut' })
            )
            .start();
    }

    stopBreathingAnimation() {
        if (this._breathTween) {
            this._breathTween.stop();
            this._breathTween = null;
        }

        // 停止时强制还原原始缩放
        this.meatIconNode.setScale(this._originalScale);
    }

    playScaleOnce() {
        this.stopBreathingAnimation();

        const largerScale = new Vec3(
            this._originalScale.x * 1.1,
            this._originalScale.y * 1.1,
            this._originalScale.z * 1.1
        );

        this.increaseQuantity();

        tween(this.meatIconNode)
            .to(0.1, { scale: largerScale }, { easing: 'quadOut' })
            .to(0.1, { scale: this._originalScale }, { easing: 'quadIn' })
            .call(() => {
                // this.startBreathingAnimation();
            })
            .start();
    }

    // 气泡增加数量
    increaseQuantity() {
        if (this.numberLabel1) {
            const number = Number(this.numberLabel1.string);
            this.numberLabel1.string = `${number + 1}`;

            this.numberLabel.node.active = false;
            this.numberLabel1.node.active = true;

            DataManager.Instance.soundManager.hungerSoundStop();
        }
    }

    // 气泡减少数量
    reduceNumber() {
        if (this.numberLabel1) {
            const number = Number(this.numberLabel1.string);
            const numString = Math.max(number - 1, 0)
            this.numberLabel1.string = `${numString}`;

            if (numString == 0) {
                this.numberLabel.node.active = true;
                this.numberLabel1.node.active = false;

                DataManager.Instance.soundManager.hungerSoundPlay();
            }
        }
    }
}


