import { _decorator, Component, Node, tween, Tween, Vec3, Sprite, color, Color } from 'cc';
const { ccclass, property } = _decorator;

import EventType from '../../EventManager/EventType'
import EventManager from '../../EventManager/EventManager';

@ccclass('FingerDragTweener')
export class FingerDragTweener extends Component {

    @property
    originalPos: Vec3 = new Vec3(300, -200, 0)

    @property
    dragBeginPos: Vec3 = new Vec3(0, -80, 0)

    @property
    dragEndPos: Vec3 = new Vec3(0, -180, 0)

    @property
    originalScale: Vec3 = new Vec3(0.3, 0.3, 0.3)

    @property
    dragBeginScale: Vec3 = new Vec3(0.6, 0.6, 0.6)

    @property
    dragEndScale: Vec3 = new Vec3(1.0, 1.0, 1.0)

    @property
    originalColor: Color = new Color(255, 255, 255, 0)

    @property
    dragBeginColor: Color = new Color(255, 255, 255, 255)

    @property
    dragEndColor: Color = new Color(255, 255, 255, 255)

    @property
    duration_t0: number = 0.4

    @property
    duration_t1: number = 0.2

    @property
    duration_t2: number = 0.6

    @property(Node)
    dragTarget: Node

    @property(Sprite)
    finger: Sprite


    _tweener: Tween

    protected start(): void {
        const dragTarget = this.dragTarget;
        dragTarget.setWorldPosition(this.dragBeginPos)
        dragTarget.setScale(this.dragBeginScale)
    }

    protected onEnable(): void {

        const dragTarget = this.dragTarget;

        const t = tween(this.dragTarget).
            parallel( // 初始化位置
                tween(dragTarget).to(0, {
                    position: this.originalPos,
                    scale: this.originalScale
                }),
                tween(this.finger).to(0, {
                    color: this.originalColor,
                })
            ).
            parallel( // 动画01 移动到开始拖拉位置
                tween(dragTarget).to(this.duration_t0, {
                    position: this.dragBeginPos,
                    scale: this.dragBeginScale,
                }, {
                    easing: "linear",
                }),
                tween(this.finger).to(this.duration_t0, {
                    color: this.dragBeginColor,
                }, {
                    easing: "linear",
                })
            ).
            delay(this.duration_t1).
            to(this.duration_t2, { // 往后拖
                position: this.dragEndPos,
                scale: this.dragEndScale,
            }, {
                // easing: "quadInOut",
                easing: "linear",
                onUpdate: (target: Node, ratio: number) => {
                    // console.log("pull ratio:", ratio);
                    EventManager.dispatchEvent(EventType.FINGER_PULL, ratio);
                }
            }).
            to(this.duration_t2, { // 往前推
                position: this.dragBeginPos,
                scale: this.dragBeginScale
            }, {
                easing: "linear",
                onUpdate: (target: Node, ratio: number) => {
                    // console.log("push ratio:", ratio);
                    EventManager.dispatchEvent(EventType.FINGER_PUSH, ratio);
                }
            }).
            parallel( // 回退到初始位置
                tween(dragTarget).to(this.duration_t0, {
                    position: this.originalPos
                }, {
                    easing: "linear",
                }),
                tween(this.finger).to(this.duration_t0, {
                    color: this.originalColor
                }, {
                    easing: "linear",
                })
            ).
            union().
            repeatForever().
            start();

        this._tweener = t;

    }

    protected onDisable(): void {
        this._tweener?.stop();
        this._tweener = null;
    }

    update(deltaTime: number) {
    }
}

