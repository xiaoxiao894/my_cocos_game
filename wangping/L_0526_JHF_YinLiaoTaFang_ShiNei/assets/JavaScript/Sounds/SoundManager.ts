import { _decorator, assert, AudioClip, AudioSource, Component, Node, resources } from 'cc';
import { DataManager } from '../Global/DataManager';
const { ccclass, property } = _decorator;

@ccclass('SoundManager')
export class SoundManager extends Component {
    @property(AudioSource)
    BgSound: AudioSource = null;

    @property(AudioClip)
    bgSoundClip: AudioClip = null;

    @property(AudioSource)
    PlayerAttackSound: AudioSource = null;

    @property(AudioClip)
    IconSound: AudioClip = null;

    @property(AudioSource)
    BuildingUnlockSound: AudioSource = null;

    @property(AudioSource)
    CardEjectSound: AudioSource = null;

    @property(AudioSource)
    ClickCardSound: AudioSource = null;

    @property(AudioSource)
    CreatePartnerSound: AudioSource = null;

    @property(AudioSource)
    SkillSound1: AudioSource = null;

    @property(AudioSource)
    SkillSound2: AudioSource = null;

    @property(AudioSource)
    SkillSound3: AudioSource = null;

    @property(AudioSource)
    SkillSound4: AudioSource = null;

    @property(AudioSource)
    SkillSound5: AudioSource = null;

    @property(AudioSource)
    WeaponPickingUpSound: AudioSource = null;

    @property(AudioSource)
    WinSound: AudioSource = null;

    @property(AudioClip)
    skillSound1: AudioClip = null;

    @property(AudioClip)
    skillSound2: AudioClip = null;

    @property(AudioClip)
    skillSound3: AudioClip = null;

    @property(AudioClip)
    skillSound4: AudioClip = null;

    @property(AudioClip)
    skillSound5: AudioClip = null;

    @property(AudioSource)
    flamethrowerSound: AudioSource = null;

    playRingSoundDynamically(name: string, delay: number) {
        setTimeout(() => {
            // 创建音效节点
            const audioNode = new Node('SkillRingAudio');
            const audioSource = audioNode.addComponent(AudioSource);
            if (name == "Partner1-L") {
                audioSource.clip = this.skillSound1;
            } else if (name == "Partner2-L") {
                audioSource.clip = this.skillSound2;
            } else if (name == "Partner3-L") {
                audioSource.clip = this.skillSound3;
            } else if (name == "Partner4-L") {
                audioSource.clip = this.skillSound4;
            } else if (name == "Partner5-L") {
                audioSource.clip = this.skillSound5;
            }

            audioSource.volume = 1.0;
            audioSource.play();

            // 添加到场景中
            this.node.addChild(audioNode);

            // 自动销毁
            audioSource.node.once(AudioSource.EventType.ENDED, () => {
                audioNode.destroy();
            });
        }, delay * 1000);
    }

    playIconSound() {
        // 创建音效节点
        const audioNode = new Node('SkillRingAudio');
        const audioSource = audioNode.addComponent(AudioSource);
        audioSource.clip = this.IconSound;
        audioSource.volume = 1.0;
        audioSource.play();

        // 添加到场景中
        this.node.addChild(audioNode);

        // 自动销毁
        audioSource.node.once(AudioSource.EventType.ENDED, () => {
            audioNode.destroy();
        });
    }

    start() {
        DataManager.Instance.soundManager = this;
    }

    playLoopAudio() {
        this.BgSound.stop();
        this.BgSound.clip = this.bgSoundClip;
        this.BgSound.loop = false;
        this.BgSound.play();

        const duration = this.bgSoundClip.getDuration();

        // 提前 0.05 秒调度下一轮播放，避免停顿
        this.scheduleOnce(() => {
            this.playLoopAudio();
        }, duration - 0.08);
    }

    PlayerAttackSoundPlay() {
        this.PlayerAttackSound.play();
    }

    IconSoundPlay() {
        this.IconSound.play();
    }

    BuildingUnlockSoundPlay() {
        this.BuildingUnlockSound.play();
    }

    ClickCardSoundPlay() {
        this.ClickCardSound.play();
    }

    CardEjectSoundPlay() {
        this.CardEjectSound.play();
    }

    CreatePartnerSoundPlay() {
        this.CreatePartnerSound.play();
    }

    SkillSound1Play() {
        this.SkillSound1.play();
    }

    SkillSound2Play() {
        this.SkillSound2.play();
    }

    SkillSound3Play() {
        this.SkillSound3.play();
    }

    SkillSound4Play() {
        this.SkillSound4.play();
    }

    SkillSound5Play() {
        this.SkillSound5.play();
    }

    WeaponPickingUpSoundPlay() {
        this.WeaponPickingUpSound.play();
    }

    WinSoundPlay() {
        this.WinSound.play();
    }

    startFlamethrowerSound() {
        if (this.flamethrowerSound) {
            this.flamethrowerSound.loop = true;   // 循环播放
            if (!this.flamethrowerSound.playing) {
                this.flamethrowerSound.play();
            }
        }
    }

    stopFlamethrowerSound() {
        if (this.flamethrowerSound) {
            this.flamethrowerSound.stop();  // 停止播放
        }
    }
}


