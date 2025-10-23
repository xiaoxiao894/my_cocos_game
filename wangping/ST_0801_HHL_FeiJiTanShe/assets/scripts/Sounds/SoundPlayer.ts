import { _decorator, AudioClip, AudioSource, Component, Enum, Node } from 'cc';
import EventManager from '../EventManager/EventManager';
import EventType from '../EventManager/EventType';
import { SoundSetting } from './SoundSetting';
const { ccclass, property } = _decorator;

enum MuteTye {
    Pause = 1,
    Volume = 2,
}

enum PlayType {
    Play = 1,
    PlayOneShot = 2
}

Enum(MuteTye);
Enum(PlayType);

@ccclass('SoundPlayer')
export class SoundPlayer extends Component {

    @property(AudioSource)
    source: AudioSource

    @property(AudioClip)
    clip: AudioClip

    @property
    loop: boolean = false

    @property
    playOnAwake: boolean = false;

    @property
    volume: number = 1.0

    @property({ type: MuteTye })
    muteType: MuteTye = MuteTye.Volume

    @property({ type: PlayType })
    playType: PlayType = PlayType.Play

    @property
    public isMute: boolean = false;

    @property
    public isPlay: boolean = false;

    onLoad() {
        if (this.source == null) {
            this.source = this.node.getComponent(AudioSource);
        }
        if (this.source == null) {
            this.source = this.node.addComponent(AudioSource)
        }
        this.source.enabled = false;
        this.source.clip = this.clip;
        this.source.loop = this.loop;
        this.source.playOnAwake = this.playOnAwake;
        this.source.enabled = true;
    }

    protected start(): void {
        this.isMute = SoundSetting.inst.isOn;

        if (this.playOnAwake) {
            if (this.playType == PlayType.Play) {
                this.play();
            } else if (this.playType == PlayType.PlayOneShot) {
                this.playOneShot();
            }
        }

        EventManager.addEventListener(EventType.SOUND_SWITCH, this.onSoundSwitch, this);
    }

    protected onDestroy(): void {
        EventManager.remveEventListener(EventType.SOUND_SWITCH, this.onSoundSwitch, this);
    }

    onSoundSwitch(isOn: boolean) {
        this.isMute = !isOn;
        if (this.isMute == false && this.isPlay && this.loop) {
            this.playForce()
        }
    }

    public pause() {
        if (this.isPlay == false) {
            return;
        }
        this.isPlay = false;

        if (this.muteType == MuteTye.Pause) {
            this.source.pause();
        } else if (this.muteType == MuteTye.Volume) {
            this.source.volume = 0.0
        }
    }

    public play() {
        if (this.isMute) {
            this.isPlay = true;
            return;
        }
        if (this.isPlay) {
            return;
        }
        this.isPlay = true;
        this.playForce();
    }

    playForce() {
        this.source.play();
        if (this.muteType == MuteTye.Pause) {
        } else if (this.muteType == MuteTye.Volume) {
            this.source.volume = this.volume;
        }
    }

    public playOneShot() {
        if (this.isMute) {
            return;
        }
        this.source.playOneShot(this.clip, this.volume);
    }

    protected onDisable(): void {
        this.pause()
    }
}

