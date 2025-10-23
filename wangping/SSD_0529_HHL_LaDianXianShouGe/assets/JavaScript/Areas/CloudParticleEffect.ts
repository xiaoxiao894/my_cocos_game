import { _decorator, Component, tween, Color, Tween, ParticleSystem, Material } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('CloudParticleEffect')
export class CloudParticleEffect extends Component {
    @property(ParticleSystem)
    public cloudParticleOuter: ParticleSystem = null;

    @property
    public fadeDuration: number = 1;

    @property
    public initialOpacity: number = 127;     // 初始透明度

    @property
    public targetOpacity: number = 0;    // 目标透明度

    @property
    public particleColor: Color = new Color(114, 114, 114, 127);

    private tweenInstance: Tween<Color> = null;
    private _material: Material = null;
    private _currentColor: Color = new Color();

    protected start(): void {
        this._material = this.cloudParticleOuter.getMaterialInstance(0);
        this._currentColor.set(114, 114, 114, this.initialOpacity);
        this._material.setProperty("tintColor", this._currentColor);
        

    }

    cloudFadeEffct(isFadeIn: boolean) {
        // 获取当前透明度
        const currentOpacity = this._currentColor.a;

        // 边界检查：如果已经达到目标透明度，则不执行操作
        if (isFadeIn && currentOpacity >= this.initialOpacity - 1) {
            return;
        }
        
        if (!isFadeIn && currentOpacity <= this.targetOpacity + 1) {
            return;
        }

        this.cloudFadeOutCallBack(isFadeIn ? 'fadeIn' : 'fadeOut');
    }

    cloudFadeOutCallBack(action: 'fadeIn' | 'fadeOut') {
        if (this.tweenInstance) {
            this.tweenInstance.stop();
            this.tweenInstance = null;
        }

        if (!this._material) {
            this._material = this.cloudParticleOuter.getMaterialInstance(0);
        }

        // 使用当前颜色作为起始点
        const startColor = new Color(this._currentColor);
        const endOpacity = action === 'fadeIn' ? this.initialOpacity : this.targetOpacity;
        
        this.tweenInstance = tween(startColor)
            .to(this.fadeDuration, { a: endOpacity }, {
                onUpdate: (target: Color) => {
                    this._currentColor.set(target);
                    this._material.setProperty("tintColor", this._currentColor);
                },
                easing: 'linear'
            })
            .call(() => {
                this.tweenInstance = null;
            })
            .start();
    }

    onDestroy() {
        if (this.tweenInstance) {
            this.tweenInstance.stop();
            this.tweenInstance = null;
        }
    }
}