import { _decorator, assert, AsyncDelegate, AudioSource, Component, Label, Node, Tween, tween, UIOpacity, Vec3, view } from 'cc';
import { DataManager } from '../Globel/DataManager';
const { ccclass, property } = _decorator;

@ccclass('UIManager')
export class UIManager extends Component {

    _audioSource: AudioSource = null;

    @property(Node)
    titleNode: Node = null;

    @property(Node)
    titleScaleNode: Node = null;

    @property(Node)
    fireButtonBase: Node = null;

    @property(Node)
    fireButtonNode: Node = null;

    @property(Node)
    handNode: Node = null;

    @property(Node)
    handStartPos: Node = null;

    @property(Node)
    handEndPos: Node = null;

    @property(Node)
    speakerNode: Node = null;

    @property(Node)
    speakerOpenNode: Node = null;

    @property(Node)
    speakerCloseNode: Node = null;

    @property(Node)
    centerNode: Node = null;

    @property(Label)
    targetNumLabel: Node = null;

    private handDur = 1;
    handOpacity = null;

    start() {
        DataManager.Instacne.UIManager = this;

        this.speakerOpenNode.active = true;
        this.speakerCloseNode.active = false;
        this.speakerNode.on(Node.EventType.TOUCH_END, this.onTouchSpeakerNode, this);

        // 手
        this.handOpacity = this.handNode.getComponent(UIOpacity);
        this.handOpacity.opacity = 0;

        this.handNode.setPosition(this.handStartPos.position.x, this.handStartPos.position.y, 0);

        // this.fireButtonBase.active = false;
        // 指引动画
        this.guideAni();
        this.titleNodeAni();
    }

    // 喇叭切换
    onTouchSpeakerNode() {
        DataManager.Instacne.UIManager.hideTitleNode();

        if (this.speakerOpenNode.active) {
            this.closeSpeakerButton();

            DataManager.Instacne.isTurnSound = false;
            DataManager.Instacne.soundManager.boneSoundPause();
            DataManager.Instacne.soundManager.launchSoundPause();
            DataManager.Instacne.soundManager.deepSeaSoundPause();
            DataManager.Instacne.soundManager.sonarSoundPause();
            DataManager.Instacne.soundManager.winSoundPause();
            DataManager.Instacne.soundManager.failSoundPause();

        } else {
            this.openSpeakerButton();

            DataManager.Instacne.isTurnSound = true;
            DataManager.Instacne.soundManager.deepSeaSoundPlay();
            DataManager.Instacne.soundManager.sonarSoundPlay();
        }
    }

    openSpeakerButton() {
        this.speakerOpenNode.active = true;
        this.speakerCloseNode.active = false;
    }

    closeSpeakerButton() {
        this.speakerOpenNode.active = false;
        this.speakerCloseNode.active = true;
    }

    // 指引动画
    guideAni() {
        this.stopGuideAni();
        if (!DataManager.Instacne.isDisplayGuidance) return;

        const opacity = this.fireButtonBase.getComponent(UIOpacity);
        opacity.opacity = 0;
        this.handNode.active = true;

        tween(this.handNode).stop();
        tween(this.handNode)
            .to(this.handDur, { position: new Vec3(this.handEndPos.position.x, this.handEndPos.position.y, 0) })
            .to(0.2, { scale: new Vec3(0.9, 0.9, 0.9) })
            .call(() => {
                tween(this.fireButtonNode).stop();
                tween(this.fireButtonNode)
                    .to(0.15, { scale: new Vec3(1.238, 1.238, 1.238) })       // 1.238, 1.351
                    .to(0.15, { scale: new Vec3(1.351, 1.351, 1.351) })
                    .call(() => {
                        this.fireButtonBaseAni();
                    })
                    .start();
            })
            .delay(0.3)
            .to(0.2, { scale: new Vec3(1, 1, 1) })
            .to(this.handDur, { position: new Vec3(this.handStartPos.position.x, this.handStartPos.position.y, 0) })
            .delay(0.5)
            .call(() => {
                this.guideAni();
            })
            .start();

        tween(this.handOpacity).stop();
        tween(this.handOpacity)
            .to(this.handDur, { opacity: 255 })
            .delay(1)
            .to(this.handDur, { opacity: 0 })
            .start();
    }

    titleNodeAni() {
        if (!this.titleNode.active) return;

        this.showTitleNode();
        tween(this.titleNode)
            .to(1, { scale: new Vec3(DataManager.Instacne.scaleOne, DataManager.Instacne.scaleOne, DataManager.Instacne.scaleOne) })
            .to(1, { scale: new Vec3(DataManager.Instacne.scaleTwo, DataManager.Instacne.scaleTwo, DataManager.Instacne.scaleTwo) })
            .call(() => {
                this.titleNodeAni();
            })
            .start();
    }

    showTitleNode() {
        this.titleNode.active = true;
    }

    hideTitleNode() {
        tween(this.titleNode).stop();
        this.titleNode.active = false;
    }

    // 发射底动画
    fireButtonBaseAni() {
        const opacity = this.fireButtonBase.getComponent(UIOpacity);
        opacity.opacity = 0;
        tween(opacity).stop();
        tween(opacity)
            .delay(0.1)
            .to(0.5, { opacity: 255 })
            .to(0.5, { opacity: 0 })
            .to(0.5, { opacity: 255 })
            .to(0.5, { opacity: 0 })
            .start();
    }

    // 关闭指引动画
    stopGuideAni() {
        this.handNode.setPosition(new Vec3(this.handStartPos.position.x, this.handStartPos.position.y, 0));
        this.handOpacity.opacity = 0;
        tween(this.handNode).stop();
        tween(this.handOpacity).stop();
        this.handNode.active = false;
    }

    public setSpeakerScale(scale: number) {
        this.speakerNode.setScale(scale, scale, scale);
        this.speakerOpenNode.setScale(scale, scale, scale);
        this.speakerCloseNode.setScale(scale, scale, scale);
    }
}


