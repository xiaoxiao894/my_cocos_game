import { _decorator, AudioSource, Component, Node } from 'cc';
import { DataManager } from '../Globel/DataManager';
const { ccclass, property } = _decorator;

@ccclass('SoundManager')
export class SoundManager extends Component {

    @property(AudioSource)
    boneSound: AudioSource = null;

    @property(AudioSource)
    launchSound: AudioSource = null;

    @property(AudioSource)
    deepSeaSound: AudioSource = null;

    @property(AudioSource)
    sonarSound: AudioSource = null;

    @property(AudioSource)
    winSound: AudioSource = null;

    @property(AudioSource)
    failSound: AudioSource = null;

    start() {
        DataManager.Instacne.soundManager = this;
        DataManager.Instacne.isTurnSound = true;
        this.deepSeaSoundPlay();
        this.sonarSoundPlay();
    }

    // 爆炸
    boneSoundPlay() {
        this.boneSound.play();
        this.boneSound.loop = false;

    }

    boneSoundPause() {
        this.boneSound.pause();
    }

    // 发射
    launchSoundPlay() {
        this.launchSound.play();
        this.launchSound.loop = false;
    }

    launchSoundPause() {
        this.launchSound.pause();
    }

    // 深海
    deepSeaSoundPlay() {
        this.deepSeaSound.play();
        this.deepSeaSound.loop = true;
    }

    deepSeaSoundPause() {
        this.deepSeaSound.pause();
    }

    // 声纳
    sonarSoundPlay() {
        this.sonarSound.play();
        this.sonarSound.loop = true;

    }

    sonarSoundPause() {
        this.sonarSound.pause();
    }

    onAudioEnded() {
        if (DataManager.Instacne.isTurnSound) {
            DataManager.Instacne.soundManager.sonarSoundPlay();
        } else {
            DataManager.Instacne.soundManager.sonarSoundPause();
        }
    }

    // 过关界面
    winSoundPlay() {
        this.winSound.play();
        this.winSound.loop = false;
    }

    winSoundPause() {
        this.winSound.pause();
    }

    // 失败界面
    failSoundPlay() {
        this.failSound.play();
        this.failSound.loop = false;
    }

    failSoundPause() {
        this.failSound.pause();
    }

}


