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
        assert(this.PlayerAttackSound);
        this.PlayerAttackSound.play();
    }

    IconSoundPlay() {
        assert(this.IconSound);
        this.IconSound.play();
    }

    BuildingUnlockSoundPlay() {
        assert(this.BuildingUnlockSound);
        this.BuildingUnlockSound.play();
    }

    ClickCardSoundPlay() {
        assert(this.ClickCardSound);
        this.ClickCardSound.play();
    }

    CardEjectSoundPlay() {
        assert(this.CardEjectSound);
        this.CardEjectSound.play();
    }

    CreatePartnerSoundPlay() {
        assert(this.CreatePartnerSound);
        this.CreatePartnerSound.play();
    }

    SkillSound1Play() {
        assert(this.SkillSound1);
        this.SkillSound1.play();
    }

    SkillSound2Play() {
        assert(this.SkillSound2);
        this.SkillSound2.play();
    }

    SkillSound3Play() {
        assert(this.SkillSound3);
        this.SkillSound3.play();
    }

    SkillSound4Play() {
        assert(this.SkillSound4);
        this.SkillSound4.play();
    }

    SkillSound5Play() {
        assert(this.SkillSound5);
        this.SkillSound5.play();
    }

    WeaponPickingUpSoundPlay() {
        assert(this.WeaponPickingUpSound);
        this.WeaponPickingUpSound.play();
    }


    WinSoundPlay() {
        assert(this.WinSound);
        this.WinSound.play();
    }
}


