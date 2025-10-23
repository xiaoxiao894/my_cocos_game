import { _decorator, AudioClip, AudioSource, Node, Vec3, director } from 'cc';
import { ResourceManager } from './ResourceManager';
import { App } from '../App';

export class SoundManager {

    private _backgroundNode = null;
    private _audioNode = null;
    private _bgmAudioSource: AudioSource = null;

    private _runSource: AudioSource = null;
    private _miningSource: AudioSource = null;


    // 音效缓存
    private audioClips: Map<string, AudioClip> = new Map();

    // 单例模式
    private static _instance: SoundManager;
    public static get inst(): SoundManager {
        if (!SoundManager._instance) {
            SoundManager._instance = new SoundManager();
        }
        return SoundManager._instance;
    }

    public constructor() {
        this._backgroundNode = new Node();
        this._audioNode = new Node();
        director.getScene().addChild(this._backgroundNode);
        director.getScene().addChild(this._audioNode);
        // 设置为常驻节点
        director.addPersistRootNode(this._backgroundNode);
        director.addPersistRootNode(this._audioNode);
        this._bgmAudioSource = this._backgroundNode.getComponent(AudioSource);
        if (!this._bgmAudioSource) {
            this._bgmAudioSource = this._backgroundNode.addComponent(AudioSource);
        }
        this.initRunSource();
        this.initMiningSoundSource();
    }

    // 初始化人跑步背景音乐
    public initRunSource() {
        let meraNode: Node = new Node();
        director.getScene().addChild(meraNode);
        director.addPersistRootNode(meraNode);
        this._runSource = meraNode.addComponent(AudioSource);

    }

    // 初始化金矿采集器背景音乐
    public initMiningSoundSource() {
        let miningNode: Node = new Node();
        director.getScene().addChild(miningNode);
        director.addPersistRootNode(miningNode);
        this._miningSource = miningNode.addComponent(AudioSource);
    }

    // 播放人跑步背景音乐
    public playRunBGM() {
        const clip = this.audioClips.get("YX_run");
        if (!clip) {
            console.error(`run not found!`);
            return;
        }

        this._runSource.stop();
        this._runSource.clip = clip;
        this._runSource.loop = true;
        this._runSource.play();
    }

    // 停止跑步音乐
    public stopRunBGM() {
        this._runSource.stop();
    }

    // 播放金矿采集器背景音乐
    public playMiningBGM() {
        const clip = this.audioClips.get("YX_kuangshi");
        if (!clip) {
            console.error(`mining not found!`);
            return;
        }
        if (!this._miningSource.playing) {
            this._miningSource.clip = clip;
            this._miningSource.loop = false;
            this._miningSource.play();
        }
    }

    // 停止金矿采集器背景音乐
    public stopMiningBGM() {
        this._miningSource.stop();
    }






    // 音效播放器对象池
    private effectsPool: AudioSource[] = [];
    private readonly POOL_SIZE = 8;  // 同时可播放的音效数量



    // 清理音效池
    public clearEffectsPool() {
        // 停止所有音效
        this.stopAllEffects();

        // 销毁所有 AudioSource 组件
        this.effectsPool.forEach(source => {
            if (source.isValid) {
                source.destroy();
            }
        });

        // 清空数组
        this.effectsPool = [];
        if (!this._audioNode) {
            return;
        }

        // 找到并销毁 EffectsPool 节点
        const effectsNode = this._audioNode.getChildByName('EffectsPool');
        if (effectsNode && effectsNode.isValid) {
            effectsNode.destroy();
        }
    }





    // 获取可用的音效播放器
    private getIdleEffectSource(): AudioSource | null {
        //如果超过最大音效限制就去掉最早的那个
        while (this.effectsPool.length >= this.POOL_SIZE) {
            let oldSource = this.effectsPool.shift();
            oldSource.stop();
            oldSource.destroy();
        }
        const source: AudioSource = this._audioNode.addComponent(AudioSource);
        source.volume = 1;
        this.effectsPool.push(source);
        return source;
    }

    // 播放背景音乐
    public playBGM(name: string) {
        // const clip = this.audioClips.get(name);
        // if (!clip) {
        //     console.error(`BGM ${name} not found!`);
        //     return;
        // }

        // this._bgmAudioSource.stop();
        // this._bgmAudioSource.clip = clip;
        // this._bgmAudioSource.loop = true;
        // this._bgmAudioSource.play();
        const clip = this.audioClips.get(name);
        if (!clip) return;

        // 停止当前播放并切换音频
        this._bgmAudioSource.stop();
        this._bgmAudioSource.clip = clip;
        this._bgmAudioSource.loop = false;
        this._bgmAudioSource.play();

        // 清除上一次的定时器（避免重复触发）
        if (this.bgmTimer) {
            clearTimeout(this.bgmTimer);
        }

        const duration = clip.getDuration();
        // 用 setTimeout 替代 scheduleOnce
        this.bgmTimer = setTimeout(() => {
            this.playBGM(name);
        }, (duration - App.mapShowController.bgmTime) * 1000); // 注意：setTimeout 单位是毫秒，需×1000
    }
    // 定义一个变量存储定时器ID，用于清理
    private bgmTimer: number | null = null;
    // 停止背景音乐
    public stopBGM() {
        this._bgmAudioSource.stop();
    }

    // 暂停背景音乐
    public pauseBGM() {
        this._bgmAudioSource.pause();
    }

    // 恢复背景音乐
    public resumeBGM() {
        this._bgmAudioSource.play();
    }

    // 播放音效
    public playAudio(name: string, volume: number = 1) {
        const clip: AudioClip = this.audioClips.get(name);
        if (!clip) {
            console.error(`Audio ${name} not found!`);
            return;
        }

        const source = this.getIdleEffectSource();
        if (source) {

            source.volume = volume;
            source.playOneShot(clip);
        }
    }


    // 停止所有音效
    public stopAllEffects() {
        for (const source of this.effectsPool) {
            source.stop();
        }
    }



    // 预加载音效资源
    public preloadAudioClips() {
        //单独优先加载背景音乐
        ResourceManager.instance.loadAudio("bgm/BGM").then((clip) => {
            // console.log("audio load " + clip.name);
            this.audioClips.set(clip.name, clip);
            //直接播放背景音乐
            this.playBGM("BGM");
            this.loadLeftAudios();
        });

    }

    private loadLeftAudios() {
        // 加载音效
        ResourceManager.instance.loadAudioDir("sounds").then((clips) => {
            clips.forEach(clip => {
                // console.log("audio load " + clip.name);
                this.audioClips.set(clip.name, clip);
            });
        });
    }

}