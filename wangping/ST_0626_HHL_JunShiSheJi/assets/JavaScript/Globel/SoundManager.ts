import { _decorator,  AudioClip, AudioSource, Node,  Vec3,director } from 'cc';
import { ResourceManager } from './ResourceManager';

export class SoundManager{

    private _audioNode = null;

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
        this._audioNode=new Node();
        director.getScene().addChild(this._audioNode);
        // 设置为常驻节点
        director.addPersistRootNode(this._audioNode);
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


    // 播放音效
    public playAudio(name: string, volume: number = 1) {
        const clip:AudioClip = this.audioClips.get(name);
        if (!clip) {
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

        this.loadLeftAudios();
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