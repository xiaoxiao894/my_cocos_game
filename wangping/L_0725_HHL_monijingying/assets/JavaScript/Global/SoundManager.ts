import { _decorator,  AudioClip, AudioSource, Node,  Vec3,director } from 'cc';
import { ResourceManager } from '../Global/ResourceManager';

export class SoundManager{

    private _backgroundNode = null;
    private _audioNode = null;
    private _bgmAudioSource: AudioSource = null;

    private _runSource:AudioSource = null;


    // 音效缓存
    private audioClips: Map<string, AudioClip> = new Map();

    // 单例模式
    private static _instance: SoundManager;
    public static get inst(): SoundManager {
        if(!SoundManager._instance){
            SoundManager._instance = new SoundManager();
        }
        return SoundManager._instance;
    }

    public constructor(){
        this._backgroundNode=new Node();
        this._audioNode=new Node();
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
    }

    // 初始化人跑步背景音乐
    public initRunSource(){
        let meraNode:Node =new Node();
        director.getScene().addChild(meraNode);
        director.addPersistRootNode(meraNode);
        this._runSource = meraNode.addComponent(AudioSource);
    }

    // 播放人跑步背景音乐
    public playRunBGM() {
        const clip = this.audioClips.get("run");
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
        if(!this._audioNode){
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
        while(this.effectsPool.length >= this.POOL_SIZE){
            let oldSource=this.effectsPool.shift();
            oldSource.stop();
            oldSource.destroy();
        }
        const source:AudioSource = this._audioNode.addComponent(AudioSource);
        source.volume = 1;
        this.effectsPool.push(source);
        return source;
    }

    // 播放背景音乐
    public playBGM(name: string) {
        const clip = this.audioClips.get(name);
        if (!clip) {
            console.error(`BGM ${name} not found!`);
            return;
        }

        this._bgmAudioSource.stop();
        this._bgmAudioSource.clip = clip;
        this._bgmAudioSource.loop = true;
        this._bgmAudioSource.play();
    }

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
        const clip:AudioClip = this.audioClips.get(name);
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
        ResourceManager.Instance.loadRes("bgm/BGM", AudioClip).then( ( clip) => {
            console.log("audio load " + clip.name);
            this.audioClips.set(clip.name, clip);
            //直接播放背景音乐
            this.playBGM("BGM");
            this.loadLeftAudios();
        });
        
    }

    private loadLeftAudios(){
        // 加载音效
        ResourceManager.Instance.loadDir("sounds", AudioClip).then( ( clips) => {
            clips.forEach(clip => {
                console.log("audio load " + clip.name);
                this.audioClips.set(clip.name, clip);
            });
        });
    }
    
}