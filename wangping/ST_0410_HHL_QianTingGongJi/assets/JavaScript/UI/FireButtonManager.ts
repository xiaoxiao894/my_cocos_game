import { _decorator, assert, AudioSource, Component, input, Label, labelAssembler, Node, Sprite, SpriteFrame } from 'cc';
import { DataManager } from '../Globel/DataManager';
import { Events } from '../Events/Events';
import super_html_playable from '../Common/super_html_playable';
//import Platform from '../Common/Platform';
const { ccclass, property } = _decorator;

@ccclass('FireButtonManager')
export class FireButtonManager extends Component {
    @property(Label)
    label: Label = null;

    @property(SpriteFrame)
    buttonSpriteFrame: SpriteFrame = null;

    @property(SpriteFrame)
    buttonFireSpriteFrame: SpriteFrame = null;

    @property(Node)
    hand: Node = null;

    isCanClick = true;
    defaultText = "";
    currentValue = 2.0;
    maxValue = 2.0;
    minValue = 0;

    guideTime = 8;
    fireButtonSchedule = null;

    start() {
        DataManager.Instacne.fireButtonManager = this;
        this.label.string = this.defaultText;

        this.node.on(Node.EventType.TOUCH_END, this.onTouchFireButton, this);

        const spriteCom = this.node.getComponent(Sprite)
        spriteCom.spriteFrame = this.buttonFireSpriteFrame;
    }

    onTouchFireButton(event) {
        if (DataManager.Instacne.curLevel >= DataManager.Instacne.targetLevel) {
            super_html_playable.download();
            console.log("download");
            return;
        }
        if (!this.isCanClick) return;

        if (DataManager.Instacne.isTurnSound) {
            DataManager.Instacne.soundManager.launchSoundPlay();
        } else {
            DataManager.Instacne.soundManager.launchSoundPause();
        }

        DataManager.Instacne.isDisplayGuidance = false;
        DataManager.Instacne.UIManager.stopGuideAni();

        this.isCanClick = false;

        let currentTime = this.maxValue;
        let decrement = 0.01;
        const epsilon = 0.01;

        const spriteCom = this.node.getComponent(Sprite)
        spriteCom.spriteFrame = this.buttonSpriteFrame;

        this.unschedule(this.fireButtonSchedule);
        this.fireButtonSchedule = this.schedule(() => {
            if (currentTime <= epsilon) {
                this.label.string = this.defaultText;
                this.isCanClick = true;

                const spriteCom = this.node.getComponent(Sprite)
                spriteCom.spriteFrame = this.buttonFireSpriteFrame;

                this.unschedule(this.fireButtonSchedule)
                this.unscheduleAllCallbacks();
            } else {
                currentTime -= decrement; // 减少倒计时
                this.label.string = currentTime.toFixed(2); // 更新显示
            }
        }, 0.001);

        DataManager.Instacne.targetNumManager.numberOfShell();
        // 发射一颗子弹
        DataManager.Instacne.sceneMananger.fireBullet();

        // 每次点击都需要记录一个时间
        this.unschedule(this.countDownPlaybackGuide);
        this.scheduleOnce(this.countDownPlaybackGuide, this.guideTime)
    }

    initText() {
        this.unscheduleAllCallbacks();
        this.isCanClick = true;
        this.label.string = this.defaultText;

        const spriteCom = this.node.getComponent(Sprite)
        spriteCom.spriteFrame = this.buttonFireSpriteFrame;
    }

    // 倒计时播放
    countDownPlaybackGuide() {
        DataManager.Instacne.isDisplayGuidance = true;
        DataManager.Instacne.UIManager.guideAni();
    }
}


