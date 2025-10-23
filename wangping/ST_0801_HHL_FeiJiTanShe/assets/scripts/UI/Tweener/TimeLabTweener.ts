import { _decorator, Component, Node, tween, Tween, Vec3, Sprite, color, Color, Label } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('TimeLabTweener')
export class TimeLabTweener extends Component {

    @property(Node)
    target: Node

    @property(Label)
    targetLab: Label

    @property
    originalPos: Vec3 = new Vec3(0, -150, 0)

    @property
    originalScale: Vec3 = new Vec3(1.0, 1.0, 1.0)

    @property
    originalColor: Color = new Color(255, 255, 255, 255)

    @property
    duration: number = 0.3

    @property
    toScale: Vec3 = new Vec3(1.2, 1.2, 1.2)

    @property
    toColor: Color = new Color(255, 0, 0, 255)

    _tweener: Tween

    protected start(): void {
        this.target.setPosition(this.originalPos)
        this.target.setScale(this.originalScale)
    }

    protected onEnable(): void {

        const t = tween(this.target).
            parallel(
                tween(this.target).to(this.duration, {
                    position: this.originalPos,
                    scale: this.toScale
                }),
                tween(this.targetLab).to(this.duration, {
                    color: this.toColor
                }),
            ).
            parallel(
                tween(this.target).to(this.duration, {
                    position: this.originalPos,
                    scale: this.originalScale
                }),
                tween(this.targetLab).to(this.duration, {
                    color: this.originalColor
                }),
            ).
            union().
            repeatForever().
            start();

        // const t = tween(this.target).to(this.duration, {
        //     position: this.originalPos,
        //     scale: this.toScale
        // }).to(this.duration, {
        //     position: this.originalPos,
        //     scale: this.originalScale,
        // }).
        //     union().
        //     repeatForever().
        //     start();

        this._tweener = t;

    }

    protected onDisable(): void {
        this._tweener?.stop();
        this._tweener = null;
    }

    update(deltaTime: number) {
    }
}

