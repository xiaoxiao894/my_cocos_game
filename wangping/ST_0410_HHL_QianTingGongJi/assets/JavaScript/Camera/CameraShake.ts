import { _decorator, Component, Vec3, tween, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('CameraShake')
export class CameraShake extends Component {

    private _originalPos: Vec3 = new Vec3();
    private _isShaking: boolean = false;

    /**
     * 调用这个方法触发摄像机抖动
     * @param duration 抖动持续时间（秒）
     * @param strength 抖动强度
     */
    public shake(duration: number = 0.3, strength: number = 0.1) {
        if (this._isShaking) return;

        this._isShaking = true;
        this._originalPos.set(this.node.position);

        const shakeTimes = Math.floor(duration / 0.02);

        const shakeTween = tween(this.node);

        for (let i = 0; i < shakeTimes; i++) {
            const offset = new Vec3(
                (Math.random() - 0.5) * strength,
                (Math.random() - 0.5) * strength,
                0
            );
            shakeTween.to(0.01, { position: this._originalPos.clone().add(offset) });
        }

        shakeTween
            .to(0.01, { position: this._originalPos })
            .call(() => {
                this._isShaking = false;
            })
            .start();
    }
}
