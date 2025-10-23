import { _decorator, Component, Node, tween, UIOpacity, Vec3 } from 'cc';
import { DataManager } from '../Global/DataManager';
import Platform from '../Common/Platform';
import super_html_playable from '../Common/super_html_playable';
const { ccclass, property } = _decorator;

@ccclass('GameEndManager')
export class GameEndManager extends Component {
    @property(Node)
    bg: Node = null;

    @property(Node)
    icon: Node = null;

    @property(Node)
    download: Node = null;

    @property(Node)
    win: Node = null;

    @property(Node)
    hand: Node = null;

    start() {
        DataManager.Instance.gameEndManager = this;

        this.node.active = false;
    }

    init() {
        // 胜利音效
        DataManager.Instance.soundManager.WinSoundPlay();

        this.hand.active = false;
        this.node.active = true;
        // 背景淡入
        const opacityCom = this.bg.getComponent(UIOpacity) || this.bg.addComponent(UIOpacity);
        opacityCom.opacity = 0;
        tween(opacityCom)
            .to(0.1, { opacity: 150 })
            .start();

        // 初始缩放
        this.icon.setScale(0, 0, 0);
        this.win.setScale(0, 1, 1);
        this.download.setScale(0, 1, 1);

        tween(this.icon)
            .to(0.3, { scale: new Vec3(2.2, 2.2, 2.2) })
            .to(0.3, { scale: new Vec3(2, 2, 2) })
            .start();

        tween(this.download)
            .delay(0.3)
            .to(0.3, { scale: new Vec3(1.1, 1.1, 1.1) })
            .to(0.3, { scale: new Vec3(1, 1, 1) })
            .start();

        tween(this.win)
            .delay(0.1)
            .to(0.3, { scale: new Vec3(1.1, 1.1, 1.1) })
            .to(0.3, { scale: new Vec3(1, 1, 1) })
            .call(() => {
                this.hand.active = true;
                this.playFingerAndButtonAnim();
            })
            .start();
    }

    // 手指+按钮循环提示动画
    playFingerAndButtonAnim() {
        // 手指动画（0.9 -> 1 循环）
        tween(this.hand)
            .repeatForever(
                tween()
                    .to(0.3, { scale: new Vec3(0.9, 0.9, 0.9) })
                    .to(0.3, { scale: new Vec3(1, 1, 1) })
            )
            .start();

        // 按钮点击提示动画（1.0 -> 1.1 -> 1.0 循环）
        // tween(this.download)
        //     .repeatForever(
        //         tween()
        //             .to(0.3, { scale: new Vec3(1.1, 1.1, 1.1) })
        //             .to(0.3, { scale: new Vec3(1, 1, 1) })
        //     )
        //     .start();
    }

    onClickButton() {
        super_html_playable.download();
    }
}


