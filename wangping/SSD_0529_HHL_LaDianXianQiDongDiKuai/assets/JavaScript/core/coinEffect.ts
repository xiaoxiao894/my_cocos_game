
// import { _decorator, Color, Component, Label, Node, Sprite, tween, Vec3 } from 'cc';
// const { ccclass, property } = _decorator;

// @ccclass('coinEffect')
// export class coinEffect extends Component {
//     @property(Sprite)
//     coinSprite: Sprite = null;

//     @property(Label)
//     coinLabel: Label = null;

//     // 动画参数
//     @property({ type: Vec3, displayName: '初始位置' })
//     startPosition: Vec3 = new Vec3(0, 0, 0);

//     @property({ displayName: '第一阶段上升距离' })
//     firstRiseDistance: number = 1.5;

//     @property({ displayName: '第二阶段上升距离' })
//     secondRiseDistance: number = 2;

//     @property({ displayName: '淡入时间(秒)' })
//     fadeInDuration: number = 1.0;

//     @property({ displayName: '停顿时间(秒)' })
//     pauseDuration: number = 1;

//     @property({ displayName: '淡出时间(秒)' })
//     fadeOutDuration: number = 1;

//     // 显式声明opacity属性
//     private _opacity: number = 0;

//     start() {
//         this.reset();
//         //this.playEffect();
//     }

//     reset() {
//         this.node.setPosition(this.startPosition);
//         this.setOpacity(0);
//     }

//     setOpacity(value: number) {
//         if (this.coinSprite) this.coinSprite.color = new Color(255, 255, 255, value);
//         if (this.coinLabel) this.coinLabel.color = new Color(255, 255, 255, value);
//     }

//     playEffect() {
//         const originalPos = this.node.position.clone();

//         tween(this.node)
//             .call(() => this.setOpacity(0))

//             // 第一阶段：同时淡入和上升第一部分距离
//             .parallel(
//                 tween(this.node)
//                     .to(this.fadeInDuration, { 
//                         position: new Vec3(
//                             originalPos.x, 
//                             originalPos.y + this.firstRiseDistance, 
//                             originalPos.z
//                         ) 
//                     }),
//                 tween(this as any) // 添加类型断言
//                     .to(this.fadeInDuration, { _opacity: 255 }, {
//                         onUpdate: (target, ratio) => {
//                             this.setOpacity(Math.floor(255 * ratio));
//                         }
//                     })
//             )

//             // 停顿
//             .delay(this.pauseDuration)

//             // 第二阶段：同时淡出和上升第二部分距离
//             .parallel(
//                 tween(this.node)
//                     .to(this.fadeOutDuration, { 
//                         position: new Vec3(
//                             originalPos.x, 
//                             originalPos.y + this.firstRiseDistance + this.secondRiseDistance, 
//                             originalPos.z
//                         ) 
//                     }),
//                 tween(this as any) // 添加类型断言
//                     .to(this.fadeOutDuration, { _opacity: 0 }, {
//                         onUpdate: (target, ratio) => {
//                             this.setOpacity(Math.floor(255 * (1 - ratio)));
//                         }
//                     })
//             )

//             .call(() => this.reset())
//             .start();
//     }

//     // 为opacity添加getter和setter（可选）
//     get opacity() {
//         return this._opacity;
//     }

//     set opacity(value: number) {
//         this._opacity = value;
//     }
// }
import { _decorator, Color, Component, Label, Node, Sprite, Tween, tween, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('coinEffect')
export class coinEffect extends Component {
    @property(Sprite)
    coinSprite: Sprite = null;

    @property(Label)
    coinLabel: Label = null;

    // 动画参数
    @property({ type: Vec3, displayName: '初始位置' })
    startPosition: Vec3 = new Vec3(0, 0, 0);

    @property({ displayName: '第一阶段上升距离' })
    firstRiseDistance: number = 0.5;

    @property({ displayName: '第二阶段上升距离' })
    secondRiseDistance: number = 0.5;

    @property({ displayName: '淡入时间(秒)' })
    fadeInDuration: number = 0.3;

    @property({ displayName: '停顿时间(秒)' })
    pauseDuration: number = 0.2;

    @property({ displayName: '淡出时间(秒)' })
    fadeOutDuration: number = 0.5;

    // 显式声明opacity属性
    private _opacity: number = 0;
    private currentTween: any = null;

    start() {
        this.reset();
        // this.playEffect();
    }

    public setCoinNum(num: number) {
        if (this.coinLabel && num > 0) {
            this.coinLabel.string = "x" + num.toString();
        }
    }

    reset() {
        // 停止当前动画
        if (this.currentTween) {
            this.currentTween.stop();
            this.currentTween = null;
        }

        this.node.setPosition(this.startPosition);
        this.setOpacity(0);
    }

    setOpacity(value: number) {
        if (this.coinSprite) this.coinSprite.color = new Color(255, 255, 255, value);
        if (this.coinLabel) this.coinLabel.color = new Color(255, 255, 255, value);
    }

    // 公共方法，用于外部触发动画
    public playEffect() {
        // 如果正在播放，先重置
        this.reset();

        const originalPos = this.node.position.clone();
        const originalScale = new Vec3(this.node.scale.x, this.node.scale.y, this.node.scale.z);
        this.currentTween = tween(this.node)
            .call(() => this.setOpacity(0))

            // 第一阶段：同时淡入和上升第一部分距离
            .parallel(
                tween(this.node)
                    .to(this.fadeInDuration, {
                        position: new Vec3(
                            originalPos.x,
                            originalPos.y + this.firstRiseDistance,
                            originalPos.z
                        )
                    }),
                tween(this as any)
                    .to(this.fadeInDuration, { _opacity: 255 }, {
                        onUpdate: (target, ratio) => {
                            this.setOpacity(Math.floor(255 * ratio));
                        }
                    }),
                // 新增的缩放动画 (在当前缩放基础上增加 0.1)
                tween(this.node)
                    .to(0.3, {
                        scale: new Vec3(
                            this.node.scale.x + 0.01,
                            this.node.scale.y + 0.01,
                            this.node.scale.z + 0.01
                        )
                    })
                    .to(0.2, { scale: originalScale }) // 0.3秒内恢复原始大小
            )

            // 停顿
            .delay(this.pauseDuration)

            // 第二阶段：同时淡出和上升第二部分距离
            .parallel(
                tween(this.node)
                    .to(this.fadeOutDuration, {
                        position: new Vec3(
                            originalPos.x,
                            originalPos.y + this.firstRiseDistance + this.secondRiseDistance,
                            originalPos.z
                        )
                    }),
                tween(this as any)
                    .to(this.fadeOutDuration, { _opacity: 0 }, {
                        onUpdate: (target, ratio) => {
                            this.setOpacity(Math.floor(255 * (1 - ratio)));
                        }
                    })
            )

            .call(() => {
                // 动画完成后重置状态，但保持不可见
                this.node.setPosition(this.startPosition);
                this.currentTween = null;
            })
            .start();
    }

    // 为opacity添加getter和setter
    get opacity() {
        return this._opacity;
    }

    set opacity(value: number) {
        this._opacity = value;
    }
    // // 测试代码
    // private addNum = 0;
    // protected update(dt: number): void {
    //        this.addNum+= dt;
    //        if(this.addNum >= 3){
    //              this.playEffect();
    //              this.addNum = 0;
    //        }


    // }
}