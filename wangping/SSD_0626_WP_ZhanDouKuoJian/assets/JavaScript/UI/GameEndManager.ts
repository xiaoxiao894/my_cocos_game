import { _decorator, Component, Label, Node, Sprite, SpriteFrame, tween, UIOpacity, Vec3 } from 'cc';
import super_html_playable from '../core/super_html_playable';
import { SoundManager } from '../core/SoundManager';
import { LanguageManager } from '../core/LanguageManager';
const { ccclass, property } = _decorator;

@ccclass('GameEndManager')
export class GameEndManager extends Component {
    @property(Node)
    bg: Node = null;

    @property(Node)
    icon: Node = null;

    @property(Sprite)
    iconSprite: Sprite = null;

    @property(SpriteFrame)
    logoKo: SpriteFrame = null;

    @property(SpriteFrame)
    logozH: SpriteFrame = null;

    @property(SpriteFrame)
    logoEngLish: SpriteFrame = null;

    @property(Node)
    download: Node = null;

    // @property(Label)
    // downloadLabel: Label = null;

    // @property(Node)
    // win: Node = null;

    @property(Node)
    hand: Node = null;

    start() {

        this.node.active = false;
        // const text = LanguageManager.t('Download');
        // if (this.downloadLabel && text) {
        //     this.downloadLabel.string = text;
        // }
        const downloadLabel = this.download?.getChildByName("Label")?.getComponent(Label);
        const text = LanguageManager.t('Download');
        if (downloadLabel && text) {
            downloadLabel.string = text;
        }

        const language = LanguageManager.t('Language');
        if (language == "ko") {
           this.iconSprite.spriteFrame = this.logoKo;
        } else if (language == "zh-hk" || language == "zh-mo" || language == "zh-tw") {
            this.iconSprite.spriteFrame = this.logozH;
        } else if (language) {
            this.iconSprite.spriteFrame = this.logoEngLish;
        }
        this.init();
        this.playFingerAndButtonAnim();
        SoundManager.inst.playAudio("YX_shengli");
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
        this.download.setScale(0, 1, 1);

        tween(this.icon)
            .to(0.25, { scale: new Vec3(2.2, 2.2, 2.2) })
            .to(0.3, { scale: new Vec3(2, 2, 2) })
            .start();

        tween(this.download)
            .delay(0.25)
            .to(0.25, { scale: new Vec3(2.1, 2.1, 2.1) })
            .to(0.3, { scale: new Vec3(2, 2, 2) })
            .call(
                () => {
                    this.hand.active = true;
                }
            )
            .start();

    }

    // 手指+按钮循环提示动画
    playFingerAndButtonAnim() {
        // this.hand.active = true;
        // 手指动画（0.9 -> 1 循环）
        tween(this.hand)
            .repeatForever(
                tween()
                    .to(0.3, { scale: new Vec3(0.4, 0.4, 0.4) })
                    .to(0.3, { scale: new Vec3(0.5, 0.5, 0.5) })
            )
            .start();
    }
    platformBtnEvent() {
        console.log("点击下载");
        super_html_playable.download();
    }

}


