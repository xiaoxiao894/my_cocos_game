System.register(["__unresolved_0", "cc", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, AudioSource, Component, DataManager, _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _dec12, _dec13, _dec14, _dec15, _dec16, _dec17, _dec18, _dec19, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _descriptor11, _descriptor12, _descriptor13, _descriptor14, _descriptor15, _descriptor16, _descriptor17, _descriptor18, _crd, ccclass, property, SoundManager;

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
      AudioSource = _cc.AudioSource;
      Component = _cc.Component;
    }, function (_unresolved_2) {
      DataManager = _unresolved_2.DataManager;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "e65d4tUWAlGt4P7rJtuIrbR", "SoundManager", undefined);

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
        tooltip: '选择插销'
      }), _dec4 = property({
        type: AudioSource,
        tooltip: '插入插销'
      }), _dec5 = property({
        type: AudioSource,
        tooltip: '通电'
      }), _dec6 = property({
        type: AudioSource,
        tooltip: '围墙出生'
      }), _dec7 = property({
        type: AudioSource,
        tooltip: '解锁'
      }), _dec8 = property({
        type: AudioSource,
        tooltip: '欢呼'
      }), _dec9 = property({
        type: AudioSource,
        tooltip: '洒水'
      }), _dec10 = property({
        type: AudioSource,
        tooltip: '生长'
      }), _dec11 = property({
        type: AudioSource,
        tooltip: '升级'
      }), _dec12 = property({
        type: AudioSource,
        tooltip: '矿石'
      }), _dec13 = property({
        type: AudioSource,
        tooltip: '围墙电流'
      }), _dec14 = property({
        type: AudioSource,
        tooltip: '攻击围墙'
      }), _dec15 = property({
        type: AudioSource,
        tooltip: '熊'
      }), _dec16 = property({
        type: AudioSource,
        tooltip: '大象'
      }), _dec17 = property({
        type: AudioSource,
        tooltip: '狗'
      }), _dec18 = property({
        type: AudioSource,
        tooltip: '资源投放'
      }), _dec19 = property({
        type: AudioSource,
        tooltip: '胜利'
      }), _dec(_class = (_class2 = class SoundManager extends Component {
        constructor(...args) {
          super(...args);

          // 背景音乐
          _initializerDefineProperty(this, "BgSound", _descriptor, this);

          // 选择插销
          _initializerDefineProperty(this, "plugSound", _descriptor2, this);

          // 插入插销
          _initializerDefineProperty(this, "socketSound", _descriptor3, this);

          // 通电
          _initializerDefineProperty(this, "electricSound", _descriptor4, this);

          // 围墙出生
          _initializerDefineProperty(this, "palingSound", _descriptor5, this);

          // 解锁
          _initializerDefineProperty(this, "lockSound", _descriptor6, this);

          // 欢呼
          _initializerDefineProperty(this, "cheerSound", _descriptor7, this);

          // 洒水
          _initializerDefineProperty(this, "wateringSound", _descriptor8, this);

          // 生长
          _initializerDefineProperty(this, "growSound", _descriptor9, this);

          // 升级
          _initializerDefineProperty(this, "upSound", _descriptor10, this);

          // 矿石
          _initializerDefineProperty(this, "oreSound", _descriptor11, this);

          // 围墙电流
          _initializerDefineProperty(this, "palingElectric", _descriptor12, this);

          // 攻击围墙
          _initializerDefineProperty(this, "attackPaling", _descriptor13, this);

          _initializerDefineProperty(this, "bearSound", _descriptor14, this);

          _initializerDefineProperty(this, "elephantSound", _descriptor15, this);

          // 修正拼写错误
          _initializerDefineProperty(this, "dogSound", _descriptor16, this);

          // 资源投放
          _initializerDefineProperty(this, "resourceSound", _descriptor17, this);

          _initializerDefineProperty(this, "victorySound", _descriptor18, this);
        }

        /** 播放背景音乐 */
        playBgMusic() {
          if (this.BgSound.state !== AudioSource.AudioState.PLAYING) {
            this.BgSound.play();
          }
        }
        /** 播放选择插销音效 */


        playPlugSound() {
          if (this.plugSound.state !== AudioSource.AudioState.PLAYING) {
            this.plugSound.play();
          }
        }
        /** 播放插入插销音效 */


        playSocketSound() {
          if (this.socketSound.state !== AudioSource.AudioState.PLAYING) {
            this.socketSound.play();
          }
        }
        /** 播放背景音效 */


        playVictorySound() {
          if (this.victorySound.state !== AudioSource.AudioState.PLAYING) {
            this.victorySound.play();
          }
        }
        /** 播放通电音效 */


        playElectricSound() {
          if (this.electricSound.state !== AudioSource.AudioState.PLAYING) {
            this.electricSound.play();
          }
        }
        /** 播放围墙出生音效 */


        playPalingSound() {
          if (this.palingSound.state !== AudioSource.AudioState.PLAYING) {
            this.palingSound.play();
          }
        }
        /** 播放解锁音效 */


        playLockSound() {
          if (this.lockSound.state !== AudioSource.AudioState.PLAYING) {
            this.lockSound.play();
          }
        }
        /** 播放欢呼音效 */


        playCheerSound() {
          if (this.cheerSound.state !== AudioSource.AudioState.PLAYING) {
            this.cheerSound.play();
          }
        }
        /** 播放洒水音效 */


        playWateringSound() {
          if (this.wateringSound.state !== AudioSource.AudioState.PLAYING) {
            this.wateringSound.play();
          }
        }
        /** 播放洒水音效3次 */


        playWateringSoundThreeTimes() {
          let playCount = 0;
          const totalPlays = 3;
          const interval = 0.5; // 每次播放之间的间隔时间（秒）

          const playNext = () => {
            if (playCount < totalPlays) {
              this.wateringSound.playOneShot(this.wateringSound.clip, 1);
              playCount++; // 使用 scheduleOnce 来安排下一次播放

              this.scheduleOnce(() => {
                playNext();
              }, interval);
            }
          };

          playNext();
        }
        /** 播放生长音效 */


        playGrowSound() {
          if (this.growSound.state !== AudioSource.AudioState.PLAYING) {
            this.growSound.play();
          }
        }
        /** 播放升级音效 */


        playUpgradeSound() {
          if (this.upSound.state !== AudioSource.AudioState.PLAYING) {
            this.upSound.play();
          }
        }
        /** 播放矿石音效 */


        playOreSound() {
          if (this.oreSound.state !== AudioSource.AudioState.PLAYING) {
            this.oreSound.play();
          }
        }
        /** 播放3次矿石音效 */


        playOreSoundThreeTimes() {
          let playCount = 0;
          const totalPlays = 3;
          const interval = 0.5; // 每次播放之间的间隔时间（秒）

          const playNext = () => {
            if (playCount < totalPlays) {
              this.oreSound.playOneShot(this.oreSound.clip, 1);
              playCount++; // 使用 scheduleOnce 来安排下一次播放

              this.scheduleOnce(() => {
                playNext();
              }, interval);
            }
          };

          playNext();
        }
        /** 播放围墙电流音效 */


        playPalingElectricSound() {
          if (this.palingElectric.state !== AudioSource.AudioState.PLAYING) {
            // this.palingElectric.play();
            this.palingElectric.playOneShot(this.palingElectric.clip, 1);
          }
        }
        /** 播放攻击围墙音效 */


        playAttackPalingSound() {
          if (this.attackPaling.state !== AudioSource.AudioState.PLAYING) {
            this.attackPaling.play();
          }
        }
        /** 播放熊音效 */


        playBearSound() {
          if (this.bearSound.state !== AudioSource.AudioState.PLAYING) {
            this.bearSound.play();
          }
        }
        /** 播放大象音效 */


        playElephantSound() {
          if (this.elephantSound.state !== AudioSource.AudioState.PLAYING) {
            this.elephantSound.play();
          }
        }
        /** 播放狗音效 */


        playDogSound() {
          if (this.dogSound.state !== AudioSource.AudioState.PLAYING) {
            this.dogSound.play();
          }
        } // /** 播放资源投放音效 */


        playResourceSound() {
          if (this.resourceSound.state !== AudioSource.AudioState.PLAYING) {
            this.resourceSound.playOneShot(this.resourceSound.clip, 1);
          }
        } //     /**
        //  * 播放资源投放音效
        //  * @param num - 控制音效播放次数和音量大小的参数
        //  */
        //     playResourceSound(num: number) {
        //         // 播放指定次数的音效，每次降低音量
        //         for (let i = 0; i < num; i++) {
        //             // 计算当前音量 (随次数增加而降低)
        //            // const volume = Math.max(0.2, 1 - (i * 0.1)); // 最低音量0.2
        //             // 使用 setTimeout 安排每次播放
        //             const timer = setTimeout(() => {
        //                 // 使用 playOneShot 方法，不需要检查音频源状态
        //                 this.resourceSound.playOneShot(this.resourceSound.clip, 0.5);
        //             }, i * 20); // 200毫秒间隔，可根据需要调整
        //         }
        //     }


        start() {
          (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.soundManager = this;
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "BgSound", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "plugSound", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "socketSound", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "electricSound", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "palingSound", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "lockSound", [_dec7], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "cheerSound", [_dec8], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "wateringSound", [_dec9], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, "growSound", [_dec10], {
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
      }), _descriptor11 = _applyDecoratedDescriptor(_class2.prototype, "oreSound", [_dec12], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor12 = _applyDecoratedDescriptor(_class2.prototype, "palingElectric", [_dec13], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor13 = _applyDecoratedDescriptor(_class2.prototype, "attackPaling", [_dec14], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor14 = _applyDecoratedDescriptor(_class2.prototype, "bearSound", [_dec15], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor15 = _applyDecoratedDescriptor(_class2.prototype, "elephantSound", [_dec16], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor16 = _applyDecoratedDescriptor(_class2.prototype, "dogSound", [_dec17], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor17 = _applyDecoratedDescriptor(_class2.prototype, "resourceSound", [_dec18], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor18 = _applyDecoratedDescriptor(_class2.prototype, "victorySound", [_dec19], {
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
//# sourceMappingURL=216766b4865659d670bfe739bbc071ef4a48c1a5.js.map