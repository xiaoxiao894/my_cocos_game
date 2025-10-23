import { _decorator, Component, Label, Node, Sprite, tween, UIOpacity, Vec3 } from 'cc';
import { DataManager } from '../Global/DataManager';
import super_html_playable from '../Common/super_html_playable';
import { SoundManager } from '../Common/SoundManager';
import { LanguageManager } from '../Language/LanguageManager';
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

    private isExecuteClickButton = false;

    start() {
        DataManager.Instance.gameEndManager = this;

        this.node.active = false;

        const downloadLabel = this.download?.getChildByName("Label")?.getComponent(Label);
        const text = LanguageManager.t('Download');
        if (downloadLabel && text) {
            downloadLabel.string = text;
        }

        const iconSpr = this.icon.getComponent(Sprite);
        DataManager.Instance.UIPropertyManager.adaptationLanguageLogo(iconSpr);
    }

    onEnable() {
        // this.scheduleOnce(() => {
        //     if (!this.isExecuteClickButton) {
        //         this.isExecuteClickButton = true;
        //         this.onClickButton();
        //     }
        // }, 2);
    }

    init() {
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
        // this.win.setScale(0, 1, 1);
        this.download.setScale(0, 1, 1);

        SoundManager.inst.playAudio("DC_shengli");

        tween(this.icon)
            .to(0.3, { scale: new Vec3(2.2, 2.2, 2.2) })
            .to(0.3, { scale: new Vec3(2, 2, 2) })
            .start();

        tween(this.download)
            .delay(0.3)
            .to(0.3, { scale: new Vec3(2.1, 2.1, 2.1) })
            .to(0.3, { scale: new Vec3(2, 2, 2) })
            .call(() => {
                this.hand.active = true;
                this.playFingerAndButtonAnim();
            })
            .start();

        // tween(this.win)
        //     .delay(0.1)
        //     .to(0.3, { scale: new Vec3(1.1, 1.1, 1.1) })
        //     .to(0.3, { scale: new Vec3(1, 1, 1) })
        //     .call(() => {
        //         this.hand.active = true;
        //         this.playFingerAndButtonAnim();
        //     })
        //     .start();
    }

    // 手指+按钮循环提示动画
    playFingerAndButtonAnim() {
        // 手指动画（0.9 -> 1 循环）
        tween(this.hand)
            .repeatForever(
                tween()
                    .to(0.3, { scale: new Vec3(0.3, 0.3, 0.3) })
                    .to(0.3, { scale: new Vec3(0.4, 0.4, 0.4) })
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
        this.isExecuteClickButton = true;
        super_html_playable.download();
    }
}


