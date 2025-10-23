import { Node, AudioSource, AudioClip, resources, director, _decorator, Component, ccenum } from 'cc';




export default class AudioManager {
    //AudioMgr.ts
    /**
     * @en
     * this is a sington class for audio play, can be easily called from anywhere in you project.
     * @zh
     * 这是一个用于播放音频的单件类，可以很方便地在项目的任何地方调用。
     */
    private static _inst: AudioManager;
    public static get inst(): AudioManager {
        if (this._inst == null) {
            this._inst = new AudioManager();
        }
        return this._inst;
    }
    static restart() {
        this._inst = null;
    }

    private _audioSource: AudioSource;
    constructor() {
        //@en create a node as audioMgr
        //@zh 创建一个节点作为 audioMgr
        let audioMgr = new Node();
        audioMgr.name = '__audioMgr__';

        //@en add to the scene.
        //@zh 添加节点到场景
        director.getScene().addChild(audioMgr);

        //@en make it as a persistent node, so it won't be destroied when scene change.
        //@zh 标记为常驻节点，这样场景切换的时候就不会被销毁了
        director.addPersistRootNode(audioMgr);

        //@en add AudioSource componrnt to play audios.
        //@zh 添加 AudioSource 组件，用于播放音频。
        this._audioSource = audioMgr.addComponent(AudioSource);
    }

    public get audioSource() {
        return this._audioSource;
    }

    /**
     * @en
     * play short audio, such as strikes,explosions
     * @zh
     * 播放短音频,比如 打击音效，爆炸音效等
     * @param sound clip or url for the audio
     * @param volume 
     */
    playOneShot(sound: AudioClip | string, volume: number = 1.0) {
        if (sound instanceof AudioClip) {
            this._audioSource.playOneShot(sound, volume);
        }
        else {
            resources.load("Sound/" + sound, (err, clip: AudioClip) => {
                if (err) {
                    console.log(err);
                }
                else {
                    this._audioSource.playOneShot(clip, volume);
                }
            });
        }
    }

    /**
     * @en
     * play long audio, such as the bg music
     * @zh
     * 播放长音频，比如 背景音乐
     * @param sound clip or url for the sound
     * @param volume 
     */
    play(sound: AudioClip | string, volume: number = 1.0) {
        if (sound instanceof AudioClip) {
            this.audioSource.stop();
            this.audioSource.clip = sound;
            this.audioSource.loop = true;
            this.audioSource.play();
            this.audioSource.volume = volume;
        }
        else {
            resources.load("Sound/" + sound, (err, clip: AudioClip) => {
                if (err) {
                    console.log(err);
                }
                else {
                    this.audioSource.stop();
                    this.audioSource.clip = clip;
                    this.audioSource.loop = true;
                    this.audioSource.play();
                    this.audioSource.volume = volume;
                }
            });
        }
    }


    /**
     * stop the audio play
     */
    stop() {
        this._audioSource.stop();
    }

    /**
     * pause the audio play
     */
    pause() {
        this._audioSource.pause();
    }

    /**
     * resume the audio play
     */
    resume() {
        this._audioSource.play();
    }

}

export enum SoundEnum {
    bgm = "BGM",
    Sound_door = "Sound_door",
    Sound_Fire = "Sound_Fire",
    Sound_get_gold = "Sound_get_gold",
    Sound_get_meat = "Sound_get_meat",
    Sound_get = "Sound_get",
    Sound_loser = "Sound_loser",
    Sound_meatTcook = "Sound_meatTcook",
    Sound_monster_die = "Sound_monster_die",
    Sound_out = "Sound_out",
    Sound_up = "Sound_up",
    Sound_win = "Sound_win",
    Sound_Fire_hit = "Sound_Fire_hit",
    Sound_knife_hit = "Sound_knife_hit",
    Sound_shandian = "Sound_shandian",
    Sound_minaqina = "Sound_minaqina",

}
ccenum(SoundEnum);