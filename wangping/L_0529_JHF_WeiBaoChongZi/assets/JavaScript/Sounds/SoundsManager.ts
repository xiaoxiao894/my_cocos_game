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

    // 3_ 开门
    @property(AudioSource)
    openDoor: AudioSource = null;

    // 4_ 掉落
    @property(AudioClip)
    meatFall: AudioClip = null;

    // 5_ 拾取
    @property(AudioClip)
    meatPickup: AudioClip = null;

    // 6_ 交付
    @property(AudioClip)
    meatDeliver: AudioClip = null;

    // 7_ 草制作
    @property(AudioClip)
    grassMake: AudioClip = null;

    // 8_ 草拾取
    @property(AudioClip)
    grassPickUp: AudioClip = null;

    // 9_ 草摆放
    @property(AudioClip)
    grassPut: AudioClip = null;

    // 10_ 草交付
    @property(AudioClip)
    grassDeliver: AudioClip = null;

    // 11_ 金币摆放
    @property(AudioClip)
    coinPut: AudioClip = null;

    // 12_ 金币交付
    @property(AudioClip)
    coinDeliver: AudioClip = null;

    // 13_ 召唤士兵
    @property(AudioSource)
    summonSoldiers: AudioSource = null;

    // 14_ 更换武器
    @property(AudioSource)
    changeWeapon: AudioSource = null;

    // 15_ 建筑结算
    @property(AudioSource)
    constructionSettlement: AudioSource = null;

    // 饥饿音效
    @property(AudioSource)
    hungerSound: AudioSource = null;

    @property(AudioSource)
    win: AudioSource = null;

    start() {
        DataManager.Instance.soundManager = this;
    }

    private lastPlayTimeMap: Map<AudioClip, number> = new Map();
    private minInterval: number = 0.01; // 每个音效最小间隔（秒）

    /**
     * 播放短音效，自动控制播放间隔，避免堆叠过多
     * @param clip 音效资源
     */
    playSound(clip: AudioClip) {
        if (!clip) return;

        const now = performance.now() / 1000; // 秒
        const lastTime = this.lastPlayTimeMap.get(clip) || 0;

        if (now - lastTime < this.minInterval) {
            return; 
        }

        this.lastPlayTimeMap.set(clip, now);

        const audioNode = new Node('SFX-Audio');
        const source = audioNode.addComponent(AudioSource);
        source.clip = clip;
        source.volume = 1.0;
        source.loop = false;
        source.playOnAwake = false;

        this.node.addChild(audioNode);

        source.play();

        source.node.once(AudioSource.EventType.ENDED, () => {
            audioNode.destroy();
        });
    }

    // 1
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

    // 12 金币交付拾取
    coinDeliverSound() {
        this.playSound(this.coinDeliver);
    }

    // 2
    playerAttackSoundPlay() {
        // assert(this.PlayerAttackSound);
        this.PlayerAttackSound.play();
    }

    // 3
    openDoorSoundPlay() {
        // assert(this.openDoor);
        this.openDoor.play();
    }

    // 4 
    meatFallSoundPlay() {
        this.playSound(this.meatFall);
    }

    // 5
    meatPickupSoundPlay() {
        this.playSound(this.meatPickup);
    }
    // 6
    meatDeliverSoundPlay() {
        this.playSound(this.meatDeliver);
    }

    // 7
    grassMakeSoundPlay() {
        this.playSound(this.grassMake);
    }

    // 8
    grassPickUpSoundPlay() {
        this.playSound(this.grassPickUp);
    }

    // 9
    grassPutSoundPlay() {
        this.playSound(this.grassPut);
    }

    // 10 
    grassDeliverSoundPlay() {
        this.playSound(this.grassDeliver);
    }

    // 11 金币摆放
    coinPutSound() {
        this.playSound(this.coinPut);
    }

    // 13 更换武器
    summonSoldiersSound() {
        // assert(this.summonSoldiers);
        this.summonSoldiers.play();
    }

    // 14 更换武器
    changeWeaponSound() {
        // assert(this.changeWeapon);
        this.changeWeapon.play();
    }

    // 15 建筑解锁音效
    ConstructionSettlement() {
        // assert(this.constructionSettlement);
        this.constructionSettlement.play();
    }

    hungerSoundPlay() {
        if (this.hungerSound) {
            this.hungerSound.loop = true;       // 开启循环
            this.hungerSound.play();            // 播放音效
        }
    }

    hungerSoundStop() {
        if (this.hungerSound && this.hungerSound.playing) {
            this.hungerSound.stop();            // 停止播放
        }
    }

    // 16胜利音效
    WinSoundPlay() {
        // assert(this.win);
        this.win.play();
    }
}


