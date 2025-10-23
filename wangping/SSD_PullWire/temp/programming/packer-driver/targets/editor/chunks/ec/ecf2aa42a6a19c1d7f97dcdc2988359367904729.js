System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3", "__unresolved_4", "__unresolved_5", "__unresolved_6"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Node, SkeletalAnimation, Animation, tween, Vec3, eventMgr, EventType, DataManager, PalingAnimation, coinEffect, CloudParticleEffect, _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _dec12, _dec13, _dec14, _dec15, _dec16, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _descriptor11, _descriptor12, _descriptor13, _descriptor14, _descriptor15, _crd, ccclass, property, MiningSite;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfeventMgr(extras) {
    _reporterNs.report("eventMgr", "../core/EventManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfEventType(extras) {
    _reporterNs.report("EventType", "../core/EventType", _context.meta, extras);
  }

  function _reportPossibleCrUseOfDataManager(extras) {
    _reporterNs.report("DataManager", "../Global/DataManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfPalingAnimation(extras) {
    _reporterNs.report("PalingAnimation", "../core/PalingAnimation", _context.meta, extras);
  }

  function _reportPossibleCrUseOfcoinEffect(extras) {
    _reporterNs.report("coinEffect", "../core/coinEffect", _context.meta, extras);
  }

  function _reportPossibleCrUseOfCloudParticleEffect(extras) {
    _reporterNs.report("CloudParticleEffect", "../core/CloudParticleEffect", _context.meta, extras);
  }

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
      Component = _cc.Component;
      Node = _cc.Node;
      SkeletalAnimation = _cc.SkeletalAnimation;
      Animation = _cc.Animation;
      tween = _cc.tween;
      Vec3 = _cc.Vec3;
    }, function (_unresolved_2) {
      eventMgr = _unresolved_2.eventMgr;
    }, function (_unresolved_3) {
      EventType = _unresolved_3.EventType;
    }, function (_unresolved_4) {
      DataManager = _unresolved_4.DataManager;
    }, function (_unresolved_5) {
      PalingAnimation = _unresolved_5.PalingAnimation;
    }, function (_unresolved_6) {
      coinEffect = _unresolved_6.coinEffect;
    }, function (_unresolved_7) {
      CloudParticleEffect = _unresolved_7.CloudParticleEffect;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "5a48deOS4VLz5TILfs4WrOU", "MiningSite", undefined);

      __checkObsolete__(['_decorator', 'Component', 'instantiate', 'Node', 'Prefab', 'SkeletalAnimation', 'Animation', 'tween', 'Vec3']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("MiningSite", MiningSite = (_dec = ccclass('MiningSite'), _dec2 = property(SkeletalAnimation), _dec3 = property(Node), _dec4 = property(Node), _dec5 = property(Node), _dec6 = property(Node), _dec7 = property(Node), _dec8 = property(_crd && coinEffect === void 0 ? (_reportPossibleCrUseOfcoinEffect({
        error: Error()
      }), coinEffect) : coinEffect), _dec9 = property(Animation), _dec10 = property(Node), _dec11 = property(Node), _dec12 = property(Node), _dec13 = property(Node), _dec14 = property(Animation), _dec15 = property(_crd && CloudParticleEffect === void 0 ? (_reportPossibleCrUseOfCloudParticleEffect({
        error: Error()
      }), CloudParticleEffect) : CloudParticleEffect), _dec16 = property(_crd && CloudParticleEffect === void 0 ? (_reportPossibleCrUseOfCloudParticleEffect({
        error: Error()
      }), CloudParticleEffect) : CloudParticleEffect), _dec(_class = (_class2 = class MiningSite extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "ani", _descriptor, this);

          _initializerDefineProperty(this, "palingNode", _descriptor2, this);

          _initializerDefineProperty(this, "palingRight", _descriptor3, this);

          _initializerDefineProperty(this, "palingLeft", _descriptor4, this);

          _initializerDefineProperty(this, "palingUp", _descriptor5, this);

          _initializerDefineProperty(this, "palingDown", _descriptor6, this);

          _initializerDefineProperty(this, "coinEffct", _descriptor7, this);

          _initializerDefineProperty(this, "work", _descriptor8, this);

          _initializerDefineProperty(this, "levelUp", _descriptor9, this);

          _initializerDefineProperty(this, "levelUpParticle", _descriptor10, this);

          _initializerDefineProperty(this, "electricEffect", _descriptor11, this);

          this.isStart = false;
          this._coin = null;
          this._addNum = 10;

          _initializerDefineProperty(this, "mapCoinNode", _descriptor12, this);

          this.mapCoinNum = 300;

          _initializerDefineProperty(this, "mapAnimation", _descriptor13, this);

          _initializerDefineProperty(this, "cloudParticleOuter", _descriptor14, this);

          _initializerDefineProperty(this, "cloudParticleCentrality", _descriptor15, this);

          this.playPalingAnimation = null;
        }

        onEnable() {
          //云的的事件监听
          (_crd && eventMgr === void 0 ? (_reportPossibleCrUseOfeventMgr({
            error: Error()
          }), eventMgr) : eventMgr).on((_crd && EventType === void 0 ? (_reportPossibleCrUseOfEventType({
            error: Error()
          }), EventType) : EventType).MiningSite_cloudFadeOut, this.cloudFadeOutCallBack, this);
          (_crd && eventMgr === void 0 ? (_reportPossibleCrUseOfeventMgr({
            error: Error()
          }), eventMgr) : eventMgr).on((_crd && EventType === void 0 ? (_reportPossibleCrUseOfEventType({
            error: Error()
          }), EventType) : EventType).MiningSite_cloudFadeIn, this.cloudFadeInCallBack, this);
          (_crd && eventMgr === void 0 ? (_reportPossibleCrUseOfeventMgr({
            error: Error()
          }), eventMgr) : eventMgr).on((_crd && EventType === void 0 ? (_reportPossibleCrUseOfEventType({
            error: Error()
          }), EventType) : EventType).MiningSite_start, this.startCallBack, this);
          (_crd && eventMgr === void 0 ? (_reportPossibleCrUseOfeventMgr({
            error: Error()
          }), eventMgr) : eventMgr).on((_crd && EventType === void 0 ? (_reportPossibleCrUseOfEventType({
            error: Error()
          }), EventType) : EventType).Lumberyard_start, this.lumberyardStart, this);
        }

        onDisable() {
          (_crd && eventMgr === void 0 ? (_reportPossibleCrUseOfeventMgr({
            error: Error()
          }), eventMgr) : eventMgr).off((_crd && EventType === void 0 ? (_reportPossibleCrUseOfEventType({
            error: Error()
          }), EventType) : EventType).MiningSite_cloudFadeOut, this.cloudFadeOutCallBack, this);
          (_crd && eventMgr === void 0 ? (_reportPossibleCrUseOfeventMgr({
            error: Error()
          }), eventMgr) : eventMgr).off((_crd && EventType === void 0 ? (_reportPossibleCrUseOfEventType({
            error: Error()
          }), EventType) : EventType).MiningSite_cloudFadeIn, this.cloudFadeInCallBack, this);
          (_crd && eventMgr === void 0 ? (_reportPossibleCrUseOfeventMgr({
            error: Error()
          }), eventMgr) : eventMgr).off((_crd && EventType === void 0 ? (_reportPossibleCrUseOfEventType({
            error: Error()
          }), EventType) : EventType).MiningSite_start, this.startCallBack, this);
          (_crd && eventMgr === void 0 ? (_reportPossibleCrUseOfeventMgr({
            error: Error()
          }), eventMgr) : eventMgr).off((_crd && EventType === void 0 ? (_reportPossibleCrUseOfEventType({
            error: Error()
          }), EventType) : EventType).Lumberyard_start, this.lumberyardStart, this);
        }

        start() {
          this.init();
          this.playPalingAnimation = this.palingNode.getComponent(Animation);
          const animState = this.playPalingAnimation.getState(this.playPalingAnimation.defaultClip.name);

          if (animState) {
            animState.time = 0; // 设置到第一帧

            animState.sample(); // 采样当前时间帧

            this.playPalingAnimation.pause(); // 暂停动画，停留在第一帧
          }
        }

        init() {
          this.initPaling();
        }

        update(deltaTime) {}
        /**
         * 关于云的操作模块
         */
        //淡出回调


        cloudFadeOutCallBack() {
          if (this.isStart) return; // this.cloudFadeEffct(false);

          this.cloudParticleOuter.cloudFadeEffct(false);
          this.cloudParticleCentrality.cloudFadeEffct(false);
        } //淡入回调


        cloudFadeInCallBack() {
          if (this.isStart) return; //this.cloudFadeEffct(true);

          this.cloudParticleOuter.cloudFadeEffct(true);
          this.cloudParticleCentrality.cloudFadeEffct(true);
        }
        /**
         * 地块开始启动
         */


        startCallBack() {
          (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.Arrow_mining.active = false;
          this.cloudParticleOuter.cloudFadeEffct(false);
          this.cloudParticleCentrality.cloudFadeEffct(false);
          (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.soundManager.playSocketSound();
          this.scheduleOnce(() => {
            this.isStart = true;
            (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
              error: Error()
            }), DataManager) : DataManager).Instance.soundManager.playElectricSound();
            (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
              error: Error()
            }), DataManager) : DataManager).Instance.soundManager.playLockSound();
          }, 0.6);
          this.scheduleOnce(() => {
            (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
              error: Error()
            }), DataManager) : DataManager).Instance.addCoin(this.mapCoinNum);
          }, 0.4); //延迟几秒开始木栅栏动画

          this.palingEffctCallBack(); // }, 2.6)
        }

        allEffect() {
          this.mapAnimation.play(); //延时几秒开始建筑开始动画
          //this.scheduleOnce(() => {

          this.ani.play(); // }, 1);
          //延时几秒开始通电动画

          this.scheduleOnce(() => {
            this.electricEffect.active = true;
            this.electricEffect.getComponent(Animation).play();
            (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
              error: Error()
            }), DataManager) : DataManager).Instance.soundManager.playOreSoundThreeTimes();
          }, 0.7); //延时几秒开始升级特效
          // this.scheduleOnce(() => {
          //升级动画

          this.levelUp.active = true;
          const anim = this.levelUp.getComponent(Animation);
          anim.play();
          anim.once(Animation.EventType.FINISHED, () => {
            this.levelUp.active = false;
          }, this);
          (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.soundManager.playUpgradeSound(); //升级粒子特效

          this.levelUpParticle.active = true;
          const animParticle = this.levelUpParticle.getComponent(Animation);
          this.scheduleOnce(() => {
            animParticle.play();
          }, 0.06); // animParticle.play()

          animParticle.once(Animation.EventType.FINISHED, () => {
            this.levelUpParticle.active = false;
          }, this);
          this.scheduleOnce(() => {
            this.mapCoinNode.getComponent(_crd && coinEffect === void 0 ? (_reportPossibleCrUseOfcoinEffect({
              error: Error()
            }), coinEffect) : coinEffect).setCoinNum(this.mapCoinNum);
            this.mapCoinNode.getComponent(_crd && coinEffect === void 0 ? (_reportPossibleCrUseOfcoinEffect({
              error: Error()
            }), coinEffect) : coinEffect).playEffect();
          }, 0.3); // }, 1.3);
          // this.schedule(() => {

          this.schedule(() => {
            this.miningWork();
          }, 2);
          this.scheduleOnce(() => {
            //摄像机移动
            tween((_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
              error: Error()
            }), DataManager) : DataManager).Instance.mainCamera.node).to(0.8, {
              worldPosition: new Vec3(0.014142, 34.1, 37.250385)
            }).call(() => {//this._upgraded = true;
            }).start();
          }, 1);
        }
        /**
         * 关于木栅栏的操作
         */


        initPaling() {// this.palingRight.active = false;
          // this.palingDown.active = true;
          // this.palingUp.active = false;
          // this.palingLeft.active = false;
        }

        async palingEffctTo() {// // 获取动画组件
          // const leftAnimation = this.palingLeft.getComponent(PalingAnimation);
          // const rightAnimation = this.palingRight.getComponent(PalingAnimation);
          // this.palingDown.getComponent(PalingAnimation).startMoveDown();
          // 同时启动两个动画，并等待它们都完成
          // await Promise.all([
          //     leftAnimation.startAnimation(),
          //     rightAnimation.startAnimation()
          // ]);
        }

        async palingEffctCallBack() {
          // this.palingRight.active = true;
          // this.palingDown.active = true;
          // this.palingUp.active = true;
          // this.palingLeft.active = true;
          (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.soundManager.playPalingSound();
          let anim = this.palingNode.getComponent(Animation);
          anim.play();
          anim.once(Animation.EventType.FINISHED, () => {});
          this.scheduleOnce(() => {
            this.allEffect();
          }, 0.48); // await this.palingEffctTo();
          // this.palingUp.getComponent(PalingAnimation).startBounce();
        }

        miningWork() {
          this.scheduleOnce(() => {
            this.addCoin();
          }, 1.9); // this.addCoin();

          if (this.work.node.active == false) {
            this.work.node.active = true;
          }

          this.work.play();
        } //增加金币


        addCoin() {
          if (this.coinEffct.node.active == false) {
            this.coinEffct.node.active = true;
          }

          this.coinEffct.setCoinNum(this._addNum);
          this.coinEffct.playEffect(); // if (!this._coin) {
          //     let prefab: Prefab = DataManager.Instance.prefabMap.get(EntityTypeEnum.coinNode);
          //     let coinNode = instantiate(prefab);
          //     coinNode.parent = this.coinParent;
          //     let effect: coinEffect = coinNode.getComponent(coinEffect);
          //     this._coin = effect;
          //     if (this._coin) {
          //         this._coin.setCoinNum(this._addNum);
          //     }
          // }
          // this._coin?.playEffect();
        }
        /** 伐木场共用栅栏处理  */


        lumberyardStart() {
          if ((_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.isGameOver) {
            //延迟几秒开始木栅栏动画
            this.scheduleOnce(() => {
              this.palingLeft.getComponent(_crd && PalingAnimation === void 0 ? (_reportPossibleCrUseOfPalingAnimation({
                error: Error()
              }), PalingAnimation) : PalingAnimation).startMoveDown();
            }, 0);
          }
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "ani", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "palingNode", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "palingRight", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "palingLeft", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "palingUp", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "palingDown", [_dec7], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "coinEffct", [_dec8], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "work", [_dec9], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, "levelUp", [_dec10], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor10 = _applyDecoratedDescriptor(_class2.prototype, "levelUpParticle", [_dec11], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor11 = _applyDecoratedDescriptor(_class2.prototype, "electricEffect", [_dec12], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor12 = _applyDecoratedDescriptor(_class2.prototype, "mapCoinNode", [_dec13], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor13 = _applyDecoratedDescriptor(_class2.prototype, "mapAnimation", [_dec14], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor14 = _applyDecoratedDescriptor(_class2.prototype, "cloudParticleOuter", [_dec15], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor15 = _applyDecoratedDescriptor(_class2.prototype, "cloudParticleCentrality", [_dec16], {
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
//# sourceMappingURL=ecf2aa42a6a19c1d7f97dcdc2988359367904729.js.map