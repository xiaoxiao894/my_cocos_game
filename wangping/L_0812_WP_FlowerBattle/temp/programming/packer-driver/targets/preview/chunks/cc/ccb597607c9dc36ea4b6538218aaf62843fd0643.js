System.register(["__unresolved_0", "cc", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, AudioSource, Node, director, ResourceManager, SoundManager, _crd;

  function _reportPossibleCrUseOfResourceManager(extras) {
    _reporterNs.report("ResourceManager", "./ResourceManager", _context.meta, extras);
  }

  _export("SoundManager", void 0);

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      AudioSource = _cc.AudioSource;
      Node = _cc.Node;
      director = _cc.director;
    }, function (_unresolved_2) {
      ResourceManager = _unresolved_2.ResourceManager;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "73edbJNmAlHS4Vl+358HhHo", "SoundManager", undefined);

      __checkObsolete__(['_decorator', 'AudioClip', 'AudioSource', 'Node', 'Vec3', 'director']);

      _export("SoundManager", SoundManager = class SoundManager {
        static get Instance() {
          if (!SoundManager._instance) {
            SoundManager._instance = new SoundManager();
          }

          return SoundManager._instance;
        }

        constructor() {
          this._backgroundNode = null;
          this._audioNode = null;
          this._bgmAudioSource = null;
          this._runSource = null;
          this._miningSource = null;
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
          this.initMiningSoundSource();
        } // 初始化人跑步背景音乐


        initRunSource() {
          var meraNode = new Node();
          director.getScene().addChild(meraNode);
          director.addPersistRootNode(meraNode);
          this._runSource = meraNode.addComponent(AudioSource);
        } // 初始化金矿采集器背景音乐


        initMiningSoundSource() {
          var miningNode = new Node();
          director.getScene().addChild(miningNode);
          director.addPersistRootNode(miningNode);
          this._miningSource = miningNode.addComponent(AudioSource);
        } // 播放人跑步背景音乐


        playRunBGM() {
          var clip = this.audioClips.get("run");

          if (!clip) {
            console.error("run not found!");
            return;
          }

          this._runSource.stop();

          this._runSource.clip = clip;
          this._runSource.loop = true;

          this._runSource.play();
        } // 停止跑步音乐


        stopRunBGM() {
          this._runSource.stop();
        } // 播放金矿采集器背景音乐


        playMiningBGM() {
          var clip = this.audioClips.get("YX_kuangshi");

          if (!clip) {
            console.error("mining not found!");
            return;
          }

          if (!this._miningSource.playing) {
            this._miningSource.clip = clip;
            this._miningSource.loop = false;

            this._miningSource.play();
          }
        } // 停止金矿采集器背景音乐


        stopMiningBGM() {
          this._miningSource.stop();
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


          var effectsNode = this._audioNode.getChildByName('EffectsPool');

          if (effectsNode && effectsNode.isValid) {
            effectsNode.destroy();
          }
        } // 获取可用的音效播放器


        getIdleEffectSource() {
          //如果超过最大音效限制就去掉最早的那个
          while (this.effectsPool.length >= this.POOL_SIZE) {
            var oldSource = this.effectsPool.shift();
            oldSource.stop();
            oldSource.destroy();
          }

          var source = this._audioNode.addComponent(AudioSource);

          source.volume = 1;
          this.effectsPool.push(source);
          return source;
        } // 播放背景音乐


        playBGM(name) {
          var clip = this.audioClips.get(name);

          if (!clip) {
            console.error("BGM " + name + " not found!");
            return;
          }

          this._bgmAudioSource.stop();

          this._bgmAudioSource.clip = clip;
          this._bgmAudioSource.loop = true;

          this._bgmAudioSource.play();
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


        playAudio(name, volume) {
          if (volume === void 0) {
            volume = 1;
          }

          var clip = this.audioClips.get(name);

          if (!clip) {
            console.error("Audio " + name + " not found!");
            return;
          }

          var source = this.getIdleEffectSource();

          if (source) {
            source.volume = volume;
            source.playOneShot(clip);
          }
        } // 停止所有音效


        stopAllEffects() {
          for (var source of this.effectsPool) {
            source.stop();
          }
        } // 预加载音效资源


        preloadAudioClips() {
          //单独优先加载背景音乐
          (_crd && ResourceManager === void 0 ? (_reportPossibleCrUseOfResourceManager({
            error: Error()
          }), ResourceManager) : ResourceManager).instance.loadAudio("bgm/BGM").then(clip => {
            console.log("audio load " + clip.name);
            this.audioClips.set(clip.name, clip); //直接播放背景音乐

            this.playBGM("BGM");
            this.loadLeftAudios();
          });
        }

        loadLeftAudios() {
          // 加载音效
          (_crd && ResourceManager === void 0 ? (_reportPossibleCrUseOfResourceManager({
            error: Error()
          }), ResourceManager) : ResourceManager).instance.loadAudioDir("sounds").then(clips => {
            clips.forEach(clip => {
              console.log("audio load " + clip.name);
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
//# sourceMappingURL=ccb597607c9dc36ea4b6538218aaf62843fd0643.js.map