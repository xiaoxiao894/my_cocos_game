import { _decorator, Component, Node, tween, Tween, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ScaleTweener')
export class ScaleTweener extends Component {

    @property
    originalScale: Vec3 = new Vec3(1.0, 1.0, 1.0)

    @property
    duration: number = 0.3

    @property
    toScale: Vec3 = new Vec3(1.2, 1.2, 1.2)

    @property
    isOffsetPosition: boolean = false;

    @property
    offsetPosition: Vec3 = new Vec3(0.0, 10.0, 0.0)

    _tweener: Tween

    _originalPosition: Vec3 = new Vec3(0, 0, 0)

    protected start(): void {
        this.node.setScale(this.originalScale)
    }

    protected onEnable(): void {

        if (this.isOffsetPosition) {

            this._originalPosition = this.node.position;
            const toPosition = new Vec3();
            Vec3.add(toPosition, this._originalPosition, this.offsetPosition);

            const t = tween(this.node).to(this.duration, {
                scale: this.toScale,
                position: toPosition
            }).to(this.duration, {
                scale: this.originalScale,
                position: this._originalPosition
            }).union().repeatForever().start();

            this._tweener = t;
        } else {

            const t = tween(this.node).to(this.duration, {
                scale: this.toScale,
                // position: toPosition
            }).to(this.duration, {
                scale: this.originalScale,
                // position: this._originalPosition
            }).union().repeatForever().start();

            this._tweener = t;
        }

    }

    protected onDisable(): void {
        this._tweener?.stop();
        this._tweener = null;
    }

    update(deltaTime: number) {
    }
}

