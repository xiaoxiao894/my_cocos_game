System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, AudioClip, AudioSource, Node, director, Component, ResourceManager, DataManager, SoundManager, _crd;

  function _reportPossibleCrUseOfResourceManager(extras) {
    _reporterNs.report("ResourceManager", "../Global/ResourceManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfDataManager(extras) {
    _reporterNs.report("DataManager", "../Global/DataManager", _context.meta, extras);
  }

  _export("SoundManager", void 0);

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      AudioClip = _cc.AudioClip;
      AudioSource = _cc.AudioSource;
      Node = _cc.Node;
      director = _cc.director;
      Component = _cc.Component;
    }, function (_unresolved_2) {
      ResourceManager = _unresolved_2.ResourceManager;
    }, function (_unresolved_3) {
      DataManager = _unresolved_3.DataManager;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "30e19SFN9VLqYGTt87+s0W9", "SoundManager", undefined);

      __checkObsolete__(['_decorator', 'AudioClip', 'AudioSource', 'Node', 'Vec3', 'director', 'Component']);

      _export("SoundManager", SoundManager = class SoundManager extends Component {
        static get inst() {
          if (!SoundManager._instance) {
            SoundManager._instance = new SoundManager();
          }

          return SoundManager._instance;
        }

        constructor() {
          super();
          this._backgroundNode = null;
          this._audioNode = null;
          this._bgmAudioSource = null;
          this._runSource = null;
          this._runBgmPlaying = false;
          // 音效缓存
          this.audioClips = new Map();
          // 音效播放器对象池
          this.effectsPool = [];
          this.POOL_SIZE = 8;
          this._backgroundNode = new Node();
          this._audioNode = new Node();
          director.getScene().addChild(this._backgroundNode);
          director.getScene().addChild(this._audioNode); // 设置为常驻节点

          director.addPersistRootNode(this._backgroundNode);
          director.addPersistRootNode(this._audioNode);
          this._bgmAudioSource = this._backgroundNode.getComponent(AudioSource);

          if (!this._bgmAudioSource) {
            this._bgmAudioSource = this._backgroundNode.addComponent(AudioSource);
          }

          this.initRunSource();
        } // 初始化人跑步背景音乐


        initRunSource() {
          let meraNode = new Node();
          director.getScene().addChild(meraNode);
          director.addPersistRootNode(meraNode);
          this._runSource = meraNode.addComponent(AudioSource);
        } // 播放人跑步背景音乐


        playRunBGM() {
          const clip = this.audioClips.get("run");

          if (!clip) {
            // console.error(`run not found!`);
            return;
          }

          if (this._runBgmPlaying) {
            return;
          }

          this._runSource.stop();

          this._runSource.clip = clip;
          this._runSource.loop = true;

          this._runSource.play();

          this._runBgmPlaying = true;
        } // 停止跑步音乐


        stopRunBGM() {
          if (!this._runBgmPlaying) {
            return;
          }

          this._runSource.stop();

          this._runBgmPlaying = false;
        }

        // 同时可播放的音效数量
        // 清理音效池
        clearEffectsPool() {
          // 停止所有音效
          this.stopAllEffects(); // 销毁所有 AudioSource 组件

          this.effectsPool.forEach(source => {
            if (source.isValid) {
              source.destroy();
            }
          }); // 清空数组

          this.effectsPool = [];

          if (!this._audioNode) {
            return;
          } // 找到并销毁 EffectsPool 节点


          const effectsNode = this._audioNode.getChildByName('EffectsPool');

          if (effectsNode && effectsNode.isValid) {
            effectsNode.destroy();
          }
        } // 获取可用的音效播放器


        getIdleEffectSource() {
          //如果超过最大音效限制就去掉最早的那个
          while (this.effectsPool.length >= this.POOL_SIZE) {
            let oldSource = this.effectsPool.shift();
            oldSource.stop();
            oldSource.destroy();
          }

          const source = this._audioNode.addComponent(AudioSource);

          source.volume = 1;
          this.effectsPool.push(source);
          return source;
        } // 播放背景音乐


        playBGM(name) {
          const clip = this.audioClips.get(name);

          if (!clip) {
            // console.error(`BGM ${name} not found!`);
            return;
          }

          this._bgmAudioSource.stop();

          this._bgmAudioSource.clip = clip;
          this._bgmAudioSource.loop = false;

          this._bgmAudioSource.play();

          const duration = clip.getDuration();
          const bgmOffset = (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.sceneManager.bgmOffset;
          this.scheduleOnce(() => {
            this.playBGM(name);
          }, duration - bgmOffset);
        } // 停止背景音乐


        stopBGM() {
          this._bgmAudioSource.stop();
        } // 暂停背景音乐


        pauseBGM() {
          this._bgmAudioSource.pause();
        } // 恢复背景音乐


        resumeBGM() {
          this._bgmAudioSource.play();
        } // 播放音效


        playAudio(name, volume = 1) {
          const clip = this.audioClips.get(name);

          if (!clip) {
            // console.error(`Audio ${name} not found!`);
            return;
          }

          const source = this.getIdleEffectSource();

          if (source) {
            source.volume = volume;
            source.playOneShot(clip);
          }
        } // 停止所有音效


        stopAllEffects() {
          for (const source of this.effectsPool) {
            source.stop();
          }
        } // 预加载音效资源


        preloadAudioClips() {
          //单独优先加载背景音乐
          (_crd && ResourceManager === void 0 ? (_reportPossibleCrUseOfResourceManager({
            error: Error()
          }), ResourceManager) : ResourceManager).Instance.loadRes("bgm/BGM", AudioClip).then(clip => {
            // console.log("audio load " + clip.name);
            this.audioClips.set(clip.name, clip); //直接播放背景音乐

            this.playBGM("BGM");
            this.loadLeftAudios();
          });
        }

        loadLeftAudios() {
          // 加载音效
          (_crd && ResourceManager === void 0 ? (_reportPossibleCrUseOfResourceManager({
            error: Error()
          }), ResourceManager) : ResourceManager).Instance.loadDir("sounds", AudioClip).then(clips => {
            clips.forEach(clip => {
              // console.log("audio load " + clip.name);
              this.audioClips.set(clip.name, clip);
            });
          });
        }

      });

      // 单例模式
      SoundManager._instance = void 0;

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=3594206d61370a4cdd0f8d1affce5d2902c5a916.js.map