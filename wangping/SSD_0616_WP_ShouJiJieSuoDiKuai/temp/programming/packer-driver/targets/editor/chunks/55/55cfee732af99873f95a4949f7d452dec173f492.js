System.register(["__unresolved_0", "cc", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, AudioSource, Component, Global, _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _dec12, _dec13, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _descriptor11, _descriptor12, _crd, ccclass, property, SoundManager;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfGlobal(extras) {
    _reporterNs.report("Global", "./core/Global", _context.meta, extras);
  }

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
      AudioSource = _cc.AudioSource;
      Component = _cc.Component;
    }, function (_unresolved_2) {
      Global = _unresolved_2.Global;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "e4f9247SVFDuZrvhzM6lg0y", "SoundManager", undefined);

      __checkObsolete__(['_decorator', 'assert', 'AudioSource', 'Component', 'Node']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("SoundManager", SoundManager = (_dec = ccclass('SoundManager'), _dec2 = property({
        type: AudioSource,
        tooltip: '背景音乐'
      }), _dec3 = property({
        type: AudioSource,
        tooltip: '砍树'
      }), _dec4 = property({
        type: AudioSource,
        tooltip: '砍玉米'
      }), _dec5 = property({
        type: AudioSource,
        tooltip: '人物奔跑'
      }), _dec6 = property({
        type: AudioSource,
        tooltip: '敌人出现'
      }), _dec7 = property({
        type: AudioSource,
        tooltip: '攻击敌人声音'
      }), _dec8 = property({
        type: AudioSource,
        tooltip: '建筑掉落声音'
      }), _dec9 = property({
        type: AudioSource,
        tooltip: '交付'
      }), _dec10 = property({
        type: AudioSource,
        tooltip: '拾取'
      }), _dec11 = property({
        type: AudioSource,
        tooltip: '升级'
      }), _dec12 = property({
        type: AudioSource,
        tooltip: ' 警告声音'
      }), _dec13 = property({
        type: AudioSource,
        tooltip: ' 破碎音效'
      }), _dec(_class = (_class2 = class SoundManager extends Component {
        constructor(...args) {
          super(...args);

          // 背景音乐
          _initializerDefineProperty(this, "BgSound", _descriptor, this);

          _initializerDefineProperty(this, "cutTreeSound", _descriptor2, this);

          _initializerDefineProperty(this, "cutCronSound", _descriptor3, this);

          _initializerDefineProperty(this, "playrRunSound", _descriptor4, this);

          _initializerDefineProperty(this, "enemySound", _descriptor5, this);

          _initializerDefineProperty(this, "attackEnemySound", _descriptor6, this);

          _initializerDefineProperty(this, "animationSound", _descriptor7, this);

          _initializerDefineProperty(this, "handOverSound", _descriptor8, this);

          _initializerDefineProperty(this, "pickUpSound", _descriptor9, this);

          _initializerDefineProperty(this, "upSound", _descriptor10, this);

          _initializerDefineProperty(this, "warnSound", _descriptor11, this);

          _initializerDefineProperty(this, "shatterSound", _descriptor12, this);
        }

        playShatterSound() {
          if (this.shatterSound.state !== AudioSource.AudioState.PLAYING) {
            this.shatterSound.playOneShot(this.shatterSound.clip, 1);
          }
        }
        /** 播放背景音乐 */


        playBgMusic() {
          if (this.BgSound.state !== AudioSource.AudioState.PLAYING) {
            this.BgSound.play();
          }
        }

        playCutTreeSound() {
          if (this.cutTreeSound.state !== AudioSource.AudioState.PLAYING) {
            //this.cutTreeSound.play();
            this.cutTreeSound.playOneShot(this.cutTreeSound.clip, 1);
          }
        }

        playWarnSound() {
          if (this.warnSound.state !== AudioSource.AudioState.PLAYING) {
            //this.cutTreeSound.play();
            this.warnSound.playOneShot(this.warnSound.clip, 1);
          }
        }

        playCutCronSound() {
          if (this.cutCronSound.state !== AudioSource.AudioState.PLAYING) {
            //this.cutCronSound.play();
            this.cutCronSound.playOneShot(this.cutCronSound.clip, 1);
          }
        }

        playPlayerRunSound() {
          if (this.playrRunSound.state !== AudioSource.AudioState.PLAYING) {
            this.playrRunSound.play(); // this.playrRunSound.playOneShot(this.playrRunSound.clip, 1);
          }
        }

        playEnemySound() {
          if (this.enemySound.state !== AudioSource.AudioState.PLAYING) {
            this.enemySound.play();
          }
        }

        playAttackEnemySound() {
          if (this.attackEnemySound.state !== AudioSource.AudioState.PLAYING) {
            this.attackEnemySound.play();
          }
        }

        playAnimationSound() {
          if (this.animationSound.state !== AudioSource.AudioState.PLAYING) {
            //this.animationSound.play();
            this.animationSound.playOneShot(this.animationSound.clip, 1);
          }
        }

        playHandOverSound() {
          if (this.handOverSound.state !== AudioSource.AudioState.PLAYING) {
            //this.handOverSound.play();
            this.handOverSound.playOneShot(this.handOverSound.clip, 1);
          }
        }

        playPickUpSound() {
          if (this.pickUpSound.state !== AudioSource.AudioState.PLAYING) {
            //this.pickUpSound.play();
            this.pickUpSound.playOneShot(this.pickUpSound.clip, 1);
          }
        }

        playPickUpSound1() {
          if (this.pickUpSound.state !== AudioSource.AudioState.PLAYING) {
            this.pickUpSound.play(); //this.pickUpSound.playOneShot(this.pickUpSound.clip, 1);
          }
        }

        playUpSound() {
          if (this.upSound.state !== AudioSource.AudioState.PLAYING) {
            this.upSound.play();
          }
        } // /** 播放选择插销音效 */
        // playPlugSound() {
        //     if (this.plugSound.state !== AudioSource.AudioState.PLAYING) {
        //         this.plugSound.play();
        //     }
        // }
        // /** 播放插入插销音效 */
        // playSocketSound() {
        //     if (this.socketSound.state !== AudioSource.AudioState.PLAYING) {
        //         this.socketSound.play();
        //     }
        // }
        // /** 播放背景音效 */
        // playVictorySound() {
        //     if (this.victorySound.state !== AudioSource.AudioState.PLAYING) {
        //         this.victorySound.play();
        //     }
        // }
        // /** 播放通电音效 */
        // playElectricSound() {
        //     if (this.electricSound.state !== AudioSource.AudioState.PLAYING) {
        //         this.electricSound.play();
        //     }
        // }
        // /** 播放围墙出生音效 */
        // playPalingSound() {
        //     if (this.palingSound.state !== AudioSource.AudioState.PLAYING) {
        //         this.palingSound.play();
        //     }
        // }
        // /** 播放解锁音效 */
        // playLockSound() {
        //     if (this.lockSound.state !== AudioSource.AudioState.PLAYING) {
        //         this.lockSound.play();
        //     }
        // }
        // /** 播放欢呼音效 */
        // playCheerSound() {
        //     if (this.cheerSound.state !== AudioSource.AudioState.PLAYING) {
        //         this.cheerSound.play();
        //     }
        // }
        // /** 播放洒水音效 */
        // playWateringSound() {
        //     if (this.wateringSound.state !== AudioSource.AudioState.PLAYING) {
        //         this.wateringSound.play();
        //     }
        // }
        // /** 播放洒水音效3次 */
        // playWateringSoundThreeTimes() {
        //     let playCount = 0;
        //     const totalPlays = 3;
        //     const interval = 0.5; // 每次播放之间的间隔时间（秒）
        //     const playNext = () => {
        //         if (playCount < totalPlays) {
        //             this.wateringSound.playOneShot(this.wateringSound.clip, 1);
        //             playCount++;
        //             // 使用 scheduleOnce 来安排下一次播放
        //             this.scheduleOnce(() => {
        //                 playNext();
        //             }, interval);
        //         }
        //     };
        //     playNext();
        // }
        // /** 播放生长音效 */
        // playGrowSound() {
        //     if (this.growSound.state !== AudioSource.AudioState.PLAYING) {
        //         this.growSound.play();
        //     }
        // }
        // /** 播放升级音效 */
        // playUpgradeSound() {
        //     if (this.upSound.state !== AudioSource.AudioState.PLAYING) {
        //         this.upSound.play();
        //     }
        // }
        // /** 播放矿石音效 */
        // playOreSound() {
        //     if (this.oreSound.state !== AudioSource.AudioState.PLAYING) {
        //         this.oreSound.play();
        //     }
        // }
        // /** 播放3次矿石音效 */
        // playOreSoundThreeTimes() {
        //     let playCount = 0;
        //     const totalPlays = 3;
        //     const interval = 0.5; // 每次播放之间的间隔时间（秒）
        //     const playNext = () => {
        //         if (playCount < totalPlays) {
        //             this.oreSound.playOneShot(this.oreSound.clip, 1);
        //             playCount++;
        //             // 使用 scheduleOnce 来安排下一次播放
        //             this.scheduleOnce(() => {
        //                 playNext();
        //             }, interval);
        //         }
        //     };
        //     playNext();
        // }
        // /** 播放围墙电流音效 */
        // playPalingElectricSound() {
        //     if (this.palingElectric.state !== AudioSource.AudioState.PLAYING) {
        //         // this.palingElectric.play();
        //         this.palingElectric.playOneShot(this.palingElectric.clip, 1);
        //     }
        // }
        // /** 播放攻击围墙音效 */
        // playAttackPalingSound() {
        //     if (this.attackPaling.state !== AudioSource.AudioState.PLAYING) {
        //         this.attackPaling.play();
        //     }
        // }
        // /** 播放熊音效 */
        // playBearSound() {
        //     if (this.bearSound.state !== AudioSource.AudioState.PLAYING) {
        //         this.bearSound.play();
        //     }
        // }
        // /** 播放大象音效 */
        // playElephantSound() {
        //     if (this.elephantSound.state !== AudioSource.AudioState.PLAYING) {
        //         this.elephantSound.play();
        //     }
        // }
        // /** 播放狗音效 */
        // playDogSound() {
        //     if (this.dogSound.state !== AudioSource.AudioState.PLAYING) {
        //         this.dogSound.play();
        //     }
        // }
        // // /** 播放资源投放音效 */
        // playResourceSound() {
        //     if (this.resourceSound.state !== AudioSource.AudioState.PLAYING) {
        //         this.resourceSound.playOneShot(this.resourceSound.clip, 1);
        //     }
        // }
        // //     /**
        // //  * 播放资源投放音效
        // //  * @param num - 控制音效播放次数和音量大小的参数
        // //  */
        // //     playResourceSound(num: number) {
        // //         // 播放指定次数的音效，每次降低音量
        // //         for (let i = 0; i < num; i++) {
        // //             // 计算当前音量 (随次数增加而降低)
        // //            // const volume = Math.max(0.2, 1 - (i * 0.1)); // 最低音量0.2
        // //             // 使用 setTimeout 安排每次播放
        // //             const timer = setTimeout(() => {
        // //                 // 使用 playOneShot 方法，不需要检查音频源状态
        // //                 this.resourceSound.playOneShot(this.resourceSound.clip, 0.5);
        // //             }, i * 20); // 200毫秒间隔，可根据需要调整
        // //         }
        // //     }


        start() {
          (_crd && Global === void 0 ? (_reportPossibleCrUseOfGlobal({
            error: Error()
          }), Global) : Global).soundManager = this;
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "BgSound", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "cutTreeSound", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "cutCronSound", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "playrRunSound", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "enemySound", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "attackEnemySound", [_dec7], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "animationSound", [_dec8], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "handOverSound", [_dec9], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, "pickUpSound", [_dec10], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor10 = _applyDecoratedDescriptor(_class2.prototype, "upSound", [_dec11], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor11 = _applyDecoratedDescriptor(_class2.prototype, "warnSound", [_dec12], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor12 = _applyDecoratedDescriptor(_class2.prototype, "shatterSound", [_dec13], {
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
//# sourceMappingURL=55cfee732af99873f95a4949f7d452dec173f492.js.map