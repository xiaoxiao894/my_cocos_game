import { _decorator, Component, Node, Sprite, v3, Vec3, tween, Tween, color } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('FingerJoystickTweener')
export class FingerJoystickTweener extends Component {

    @property(Node)
    joystickTarget: Node

    @property(Node)
    joystickPointer: Node

    @property(Node)
    dragTarget: Node

    @property(Sprite)
    finger: Sprite

    _tweener: Tween

    protected onLoad(): void {
        this.finger.color = color(255, 255, 255, 0);
        this.dragTarget.setPosition(v3(200.0, -100.0, 0.0));
        this.joystickPointer.setPosition(Vec3.ZERO);
        this.joystickTarget.setScale(Vec3.ZERO);
    }

    start() {
    }

    update(deltaTime: number) {
    }

    protected onEnable(): void {

        const t = tween(this.node).
            parallel( // 初始化
                tween(this.finger).to(0, {
                    color: color(255, 255, 255, 0),
                }),
                tween(this.dragTarget).to(0, {
                    position: v3(200.0, -100.0, 0.0)
                }),
                tween(this.joystickPointer).to(0, {
                    position: Vec3.ZERO,
                }),
                tween(this.joystickTarget).to(0, {
                    scale: Vec3.ZERO,
                }),
            ).
            parallel(
                // 出现
                tween(this.finger).to(0.2, {
                    color: color(255, 255, 255, 255),
                }),
                tween(this.dragTarget).to(0.3, {
                    position: v3(0.0, 0.0, 0.0)
                }),
                tween(this.joystickTarget).delay(0.1).to(0, {
                    scale: Vec3.ONE,
                }),
                // tween(this.joystickPointer).to(0, {
                //     scale: Vec3.ZERO,
                // })
            ).
            delay(0.3). // 停留
            parallel(
                // 滑动 1
                tween(this.dragTarget).to(0.2, {
                    position: v3(0.0, -50.0, 0.0)
                }),
                tween(this.joystickPointer).to(0.2, {
                    position: v3(0.0, -40.0, 0.0)
                }),
            ).
            delay(0.2).

            parallel(
                // 滑动 2
                tween(this.dragTarget).to(0.2, {
                    position: v3(-50.0, 0.0, 0.0)
                }),
                tween(this.joystickPointer).to(0.2, {
                    position: v3(-40.0, 0.0, 0.0)
                }),
            ).
            delay(0.2).

            parallel(
                // 滑动 3
                tween(this.dragTarget).to(0.4, {
                    position: v3(50.0, 0.0, 0.0)
                }),
                tween(this.joystickPointer).to(0.4, {
                    position: v3(40.0, 0.0, 0.0)
                }),
            ).
            delay(0.4).

            parallel(
                // 消失
                tween(this.finger).to(0.2, {
                    color: color(255, 255, 255, 0),
                }),
                tween(this.dragTarget).to(0.4, {
                    position: v3(200.0, -100.0, 0.0)
                }),
                tween(this.joystickPointer).delay(0.1).to(0.0, {
                    position: Vec3.ZERO,
                }),
                tween(this.joystickTarget).delay(0.1).to(0.0, {
                    scale: Vec3.ZERO,
                }),
            ).
            // parallel(
            //     tween(this.joystickPointer).to(0.0, {
            //         position: Vec3.ZERO,
            //     }),
            //     tween(this.joystickTarget).to(0.0, {
            //         scale: Vec3.ZERO,
            //     }),
            // ).

            // parallel( // 动画01 移动到开始拖拉位置
            //     tween(dragTarget).to(this.duration_t0, {
            //         position: this.dragBeginPos,
            //         scale: this.dragBeginScale,
            //     }, {
            //         easing: "linear",
            //     }),
            //     tween(this.finger).to(this.duration_t0, {
            //         color: this.dragBeginColor,
            //     }, {
            //         easing: "linear",
            //     })
            // ).
            // delay(this.duration_t1).
            // to(this.duration_t2, { // 往后拖
            //     position: this.dragEndPos,
            //     scale: this.dragEndScale,
            // }, {
            //     easing: "linear",
            //     onUpdate: (target: Node, ratio: number) => {
            //         // console.log("pull ratio:", ratio);
            //         EventManager.dispatchEvent(EventType.FINGER_PULL, ratio);
            //     }
            // }).
            // to(this.duration_t2, { // 往前推
            //     position: this.dragBeginPos,
            //     scale: this.dragBeginScale
            // }, {
            //     easing: "linear",
            //     onUpdate: (target: Node, ratio: number) => {
            //         // console.log("push ratio:", ratio);
            //         EventManager.dispatchEvent(EventType.FINGER_PUSH, ratio);
            //     }
            // }).
            // parallel( // 回退到初始位置
            //     tween(dragTarget).to(this.duration_t0, {
            //         position: this.originalPos
            //     }, {
            //         easing: "linear",
            //     }),
            //     tween(this.finger).to(this.duration_t0, {
            //         color: this.originalColor
            //     }, {
            //         easing: "linear",
            //     })
            // ).
            union().
            repeatForever().
            start();

        this._tweener = t;
    }

    protected onDisable(): void {
        this._tweener?.stop();
        this._tweener = null;
    }

}

