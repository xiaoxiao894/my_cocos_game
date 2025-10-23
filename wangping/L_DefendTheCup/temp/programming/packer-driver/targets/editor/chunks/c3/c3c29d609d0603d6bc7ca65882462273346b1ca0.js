System.register(["__unresolved_0", "cc", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, assert, AudioClip, AudioSource, Component, Node, DataManager, _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _dec12, _dec13, _dec14, _dec15, _dec16, _dec17, _dec18, _dec19, _dec20, _dec21, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _descriptor11, _descriptor12, _descriptor13, _descriptor14, _descriptor15, _descriptor16, _descriptor17, _descriptor18, _descriptor19, _descriptor20, _crd, ccclass, property, SoundManager;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfDataManager(extras) {
    _reporterNs.report("DataManager", "../Global/DataManager", _context.meta, extras);
  }

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
      assert = _cc.assert;
      AudioClip = _cc.AudioClip;
      AudioSource = _cc.AudioSource;
      Component = _cc.Component;
      Node = _cc.Node;
    }, function (_unresolved_2) {
      DataManager = _unresolved_2.DataManager;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "b844747m8hJ042ZCF1tNA35", "SoundManager", undefined);

      __checkObsolete__(['_decorator', 'assert', 'AudioClip', 'AudioSource', 'Component', 'Node', 'resources']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("SoundManager", SoundManager = (_dec = ccclass('SoundManager'), _dec2 = property(AudioSource), _dec3 = property(AudioClip), _dec4 = property(AudioSource), _dec5 = property(AudioClip), _dec6 = property(AudioSource), _dec7 = property(AudioSource), _dec8 = property(AudioSource), _dec9 = property(AudioSource), _dec10 = property(AudioSource), _dec11 = property(AudioSource), _dec12 = property(AudioSource), _dec13 = property(AudioSource), _dec14 = property(AudioSource), _dec15 = property(AudioSource), _dec16 = property(AudioSource), _dec17 = property(AudioClip), _dec18 = property(AudioClip), _dec19 = property(AudioClip), _dec20 = property(AudioClip), _dec21 = property(AudioClip), _dec(_class = (_class2 = class SoundManager extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "BgSound", _descriptor, this);

          _initializerDefineProperty(this, "bgSoundClip", _descriptor2, this);

          _initializerDefineProperty(this, "PlayerAttackSound", _descriptor3, this);

          _initializerDefineProperty(this, "IconSound", _descriptor4, this);

          _initializerDefineProperty(this, "BuildingUnlockSound", _descriptor5, this);

          _initializerDefineProperty(this, "CardEjectSound", _descriptor6, this);

          _initializerDefineProperty(this, "ClickCardSound", _descriptor7, this);

          _initializerDefineProperty(this, "CreatePartnerSound", _descriptor8, this);

          _initializerDefineProperty(this, "SkillSound1", _descriptor9, this);

          _initializerDefineProperty(this, "SkillSound2", _descriptor10, this);

          _initializerDefineProperty(this, "SkillSound3", _descriptor11, this);

          _initializerDefineProperty(this, "SkillSound4", _descriptor12, this);

          _initializerDefineProperty(this, "SkillSound5", _descriptor13, this);

          _initializerDefineProperty(this, "WeaponPickingUpSound", _descriptor14, this);

          _initializerDefineProperty(this, "WinSound", _descriptor15, this);

          _initializerDefineProperty(this, "skillSound1", _descriptor16, this);

          _initializerDefineProperty(this, "skillSound2", _descriptor17, this);

          _initializerDefineProperty(this, "skillSound3", _descriptor18, this);

          _initializerDefineProperty(this, "skillSound4", _descriptor19, this);

          _initializerDefineProperty(this, "skillSound5", _descriptor20, this);
        }

        playRingSoundDynamically(name, delay) {
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
            audioSource.play(); // 添加到场景中

            this.node.addChild(audioNode); // 自动销毁

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
          audioSource.play(); // 添加到场景中

          this.node.addChild(audioNode); // 自动销毁

          audioSource.node.once(AudioSource.EventType.ENDED, () => {
            audioNode.destroy();
          });
        }

        start() {
          (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.soundManager = this;
        }

        playLoopAudio() {
          this.BgSound.stop();
          this.BgSound.clip = this.bgSoundClip;
          this.BgSound.loop = false;
          this.BgSound.play();
          const duration = this.bgSoundClip.getDuration(); // 提前 0.05 秒调度下一轮播放，避免停顿

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

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "BgSound", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "bgSoundClip", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "PlayerAttackSound", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "IconSound", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "BuildingUnlockSound", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "CardEjectSound", [_dec7], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "ClickCardSound", [_dec8], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "CreatePartnerSound", [_dec9], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, "SkillSound1", [_dec10], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor10 = _applyDecoratedDescriptor(_class2.prototype, "SkillSound2", [_dec11], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor11 = _applyDecoratedDescriptor(_class2.prototype, "SkillSound3", [_dec12], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor12 = _applyDecoratedDescriptor(_class2.prototype, "SkillSound4", [_dec13], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor13 = _applyDecoratedDescriptor(_class2.prototype, "SkillSound5", [_dec14], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor14 = _applyDecoratedDescriptor(_class2.prototype, "WeaponPickingUpSound", [_dec15], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor15 = _applyDecoratedDescriptor(_class2.prototype, "WinSound", [_dec16], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor16 = _applyDecoratedDescriptor(_class2.prototype, "skillSound1", [_dec17], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor17 = _applyDecoratedDescriptor(_class2.prototype, "skillSound2", [_dec18], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor18 = _applyDecoratedDescriptor(_class2.prototype, "skillSound3", [_dec19], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor19 = _applyDecoratedDescriptor(_class2.prototype, "skillSound4", [_dec20], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor20 = _applyDecoratedDescriptor(_class2.prototype, "skillSound5", [_dec21], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=c3c29d609d0603d6bc7ca65882462273346b1ca0.js.map