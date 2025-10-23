import { _decorator, Button, Component, Label, math, Node, ProgressBar, UITransform, v3, Vec3 } from 'cc';
import EventManager from '../../EventManager/EventManager';
import EventType from '../../EventManager/EventType';

const { ccclass, property } = _decorator;

@ccclass('HudController')
export class HudController extends Component {

    @property(Label)
    timeLab: Label

    @property
    totalTime: number = 60

    @property(Label)
    hightLab: Label

    @property(Node)
    timeLabTween: Node

    @property(Node)
    progressNode: Node

    @property
    maxDistance: number = 500.0

    @property(ProgressBar)
    progressBar: ProgressBar

    @property(Label)
    progressBarLab: Label

    @property(UITransform)
    barSize: UITransform

    @property(Node)
    barSizeFollower: Node

    @property(Button)
    installBtn: Button

    // @property(SoundPlayer)
    // timeTickSoundPlayer: SoundPlayer

    _isShowed: boolean = false;
    _isDirty: boolean = false;
    _hightValue: number = 0.0
    _distanceValue: number = 0.0
    _enableTimeTweener: boolean = false;

    _time: number = 0.0
    _timeValue: number = 0.0
    _isShowInstall: boolean = false;

    start() {

        EventManager.addEventListener(EventType.SHOW_HUD, this.onShow, this)
        EventManager.addEventListener(EventType.SHOW_INSTALL, this.onShowInstall, this)
        EventManager.addEventListener(EventType.UPDATE_MAIN_PLAYER_POS, this.onUpdateMainPlayerPos, this)

        this.timeLab.node.active = false;
        this.hightLab.node.active = false;
        this.timeLabTween.active = false;
        this.progressNode.active = false;

        this._isShowed = false;
        this._enableTimeTweener = false;

        this.installBtn.node.on(Button.EventType.CLICK, this.onInstallBtnClick, this)
    }

    protected onDestroy(): void {
        EventManager.remveEventListener(EventType.SHOW_HUD, this.onShow, this)
        EventManager.remveEventListener(EventType.SHOW_INSTALL, this.onShowInstall, this)
        EventManager.remveEventListener(EventType.UPDATE_MAIN_PLAYER_POS, this.onUpdateMainPlayerPos, this)
    }

    onShow() {
        this.timeLab.node.active = true;
        this.hightLab.node.active = true;
        this.progressNode.active = true;
        this._time = this.totalTime;
        this._isShowed = true;
    }

    onUpdateMainPlayerPos(pos: Vec3) {
        this._isDirty = true;
        this._hightValue = pos.y;
        this._distanceValue = pos.z;
    }

    update(deltaTime: number) {

        if (this._isShowed == false) {
            return;
        }

        this.onTime(deltaTime);

        if (this._isDirty) {

            this._isDirty = false;

            this.hightLab.string = `${Math.ceil(this._hightValue*1.2)}m`;

            if (this._timeValue < 10) {
                this.timeLab.string = `00:0${Math.floor(this._timeValue)}`;
            } else {
                this.timeLab.string = `00:${Math.floor(this._timeValue)}`;
            }

            let curProgress = math.clamp01(this._distanceValue / this.maxDistance);
            this.progressBar.progress = curProgress;
            this.progressBarLab.string = `${Math.floor(curProgress * 100.0)}%`

            const value = this.barSize.contentSize.y;
            this.barSizeFollower.setPosition(v3(0, value));
        }
    }


    onTime(deltaTime: number) {

        if (this._time <= 0) {
            return;
        }

        if(this._isShowInstall) {
            return
        }

        this._time -= deltaTime;

        if (this._time <= 10 && this._enableTimeTweener == false) {
            this._enableTimeTweener = true;
            this.timeLabTween.active = true;
        }

        const curValue = Math.floor(this._time);
        if (curValue != this._timeValue && curValue >= 0.0) {
            this._timeValue = curValue;
            this._isDirty = true;
        }
    }

    onShowInstall() {
        this.timeLab.node.active = false;
        this.timeLabTween.active = false;
        this.progressNode.active = false;
        this._isShowInstall = true;
    }

    onInstallBtnClick() {
        EventManager.dispatchEvent(EventType.PLAYABLE_DOWNLOAD)
    }
 }

