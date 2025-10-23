System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3", "__unresolved_4", "__unresolved_5", "__unresolved_6", "__unresolved_7"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, instantiate, Node, SkeletalAnimation, Animation, find, eventMgr, EventType, DataManager, coinEffect, EntityTypeEnum, EventName, EventManager, CloudParticleEffect, _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _dec12, _dec13, _dec14, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _descriptor11, _descriptor12, _descriptor13, _crd, ccclass, property, Lumberyard;

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

  function _reportPossibleCrUseOfcoinEffect(extras) {
    _reporterNs.report("coinEffect", "../core/coinEffect", _context.meta, extras);
  }

  function _reportPossibleCrUseOfEntityTypeEnum(extras) {
    _reporterNs.report("EntityTypeEnum", "../Common/Enum", _context.meta, extras);
  }

  function _reportPossibleCrUseOfEventName(extras) {
    _reporterNs.report("EventName", "../Common/Enum", _context.meta, extras);
  }

  function _reportPossibleCrUseOfEventManager(extras) {
    _reporterNs.report("EventManager", "../Global/EventManager", _context.meta, extras);
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
      instantiate = _cc.instantiate;
      Node = _cc.Node;
      SkeletalAnimation = _cc.SkeletalAnimation;
      Animation = _cc.Animation;
      find = _cc.find;
    }, function (_unresolved_2) {
      eventMgr = _unresolved_2.eventMgr;
    }, function (_unresolved_3) {
      EventType = _unresolved_3.EventType;
    }, function (_unresolved_4) {
      DataManager = _unresolved_4.DataManager;
    }, function (_unresolved_5) {
      coinEffect = _unresolved_5.coinEffect;
    }, function (_unresolved_6) {
      EntityTypeEnum = _unresolved_6.EntityTypeEnum;
      EventName = _unresolved_6.EventName;
    }, function (_unresolved_7) {
      EventManager = _unresolved_7.EventManager;
    }, function (_unresolved_8) {
      CloudParticleEffect = _unresolved_8.CloudParticleEffect;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "62006RIi4xKE5RFnqbV/UF3", "Lumberyard", undefined);

      __checkObsolete__(['_decorator', 'Component', 'instantiate', 'Node', 'Prefab', 'SkeletalAnimation', 'Animation', 'find']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("Lumberyard", Lumberyard = (_dec = ccclass('Lumberyard'), _dec2 = property(SkeletalAnimation), _dec3 = property(Node), _dec4 = property(Node), _dec5 = property(Node), _dec6 = property(Node), _dec7 = property(Animation), _dec8 = property(Node), _dec9 = property(Node), _dec10 = property(Node), _dec11 = property(Animation), _dec12 = property(_crd && CloudParticleEffect === void 0 ? (_reportPossibleCrUseOfCloudParticleEffect({
        error: Error()
      }), CloudParticleEffect) : CloudParticleEffect), _dec13 = property(_crd && CloudParticleEffect === void 0 ? (_reportPossibleCrUseOfCloudParticleEffect({
        error: Error()
      }), CloudParticleEffect) : CloudParticleEffect), _dec14 = property(Node), _dec(_class = (_class2 = class Lumberyard extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "ani", _descriptor, this);

          _initializerDefineProperty(this, "palingNode", _descriptor2, this);

          _initializerDefineProperty(this, "palingLeft", _descriptor3, this);

          _initializerDefineProperty(this, "palingUp", _descriptor4, this);

          _initializerDefineProperty(this, "coinParent", _descriptor5, this);

          _initializerDefineProperty(this, "work", _descriptor6, this);

          _initializerDefineProperty(this, "levelUp", _descriptor7, this);

          _initializerDefineProperty(this, "levelUpParticle", _descriptor8, this);

          _initializerDefineProperty(this, "treeNode", _descriptor9, this);

          _initializerDefineProperty(this, "mapAnimation", _descriptor10, this);

          _initializerDefineProperty(this, "cloudParticleOuter", _descriptor11, this);

          _initializerDefineProperty(this, "cloudParticleCentrality", _descriptor12, this);

          // @property(Animation)
          // lumberyardTree: Animation = null;
          this.isStart = false;
          this._coin = null;
          this._addNum = 10;

          _initializerDefineProperty(this, "mapCoinNode", _descriptor13, this);

          this.mapCoinNum = 300;
          this.playPalingAnimation = null;
        }

        onEnable() {
          //云的的事件监听
          (_crd && eventMgr === void 0 ? (_reportPossibleCrUseOfeventMgr({
            error: Error()
          }), eventMgr) : eventMgr).on((_crd && EventType === void 0 ? (_reportPossibleCrUseOfEventType({
            error: Error()
          }), EventType) : EventType).Lumberyard_cloudFadeOut, this.cloudFadeOutCallBack, this);
          (_crd && eventMgr === void 0 ? (_reportPossibleCrUseOfeventMgr({
            error: Error()
          }), eventMgr) : eventMgr).on((_crd && EventType === void 0 ? (_reportPossibleCrUseOfEventType({
            error: Error()
          }), EventType) : EventType).Lumberyard_start, this.startCallBack, this);
          (_crd && eventMgr === void 0 ? (_reportPossibleCrUseOfeventMgr({
            error: Error()
          }), eventMgr) : eventMgr).on((_crd && EventType === void 0 ? (_reportPossibleCrUseOfEventType({
            error: Error()
          }), EventType) : EventType).Lumberyard_cloudFadeIn, this.cloudFadeInCallBack, this);
          (_crd && EventManager === void 0 ? (_reportPossibleCrUseOfEventManager({
            error: Error()
          }), EventManager) : EventManager).inst.on((_crd && EventName === void 0 ? (_reportPossibleCrUseOfEventName({
            error: Error()
          }), EventName) : EventName).GameOver, this.ropeShowCallBack, this);
        }

        onDisable() {
          (_crd && eventMgr === void 0 ? (_reportPossibleCrUseOfeventMgr({
            error: Error()
          }), eventMgr) : eventMgr).off((_crd && EventType === void 0 ? (_reportPossibleCrUseOfEventType({
            error: Error()
          }), EventType) : EventType).Lumberyard_cloudFadeOut, this.cloudFadeOutCallBack, this);
          (_crd && eventMgr === void 0 ? (_reportPossibleCrUseOfeventMgr({
            error: Error()
          }), eventMgr) : eventMgr).off((_crd && EventType === void 0 ? (_reportPossibleCrUseOfEventType({
            error: Error()
          }), EventType) : EventType).Lumberyard_start, this.startCallBack, this);
          (_crd && eventMgr === void 0 ? (_reportPossibleCrUseOfeventMgr({
            error: Error()
          }), eventMgr) : eventMgr).off((_crd && EventType === void 0 ? (_reportPossibleCrUseOfEventType({
            error: Error()
          }), EventType) : EventType).Lumberyard_cloudFadeIn, this.cloudFadeInCallBack, this);
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
          this.node.getChildByName("ChaZuo").active = false;
          this.initPaling();
        }

        update(deltaTime) {} //显示插座


        ropeShowCallBack() {
          this.node.getChildByName("ChaZuo").active = true;
        }
        /**
         * 关于云的操作模块
         */
        //淡出回调


        cloudFadeOutCallBack() {
          //if (DataManager.Instance.isGameOver) {
          if (this.isStart) return; // this.cloudFadeEffct(false);
          //}

          this.cloudParticleOuter.cloudFadeEffct(false);
          this.cloudParticleCentrality.cloudFadeEffct(false);
        } //淡入回调


        cloudFadeInCallBack() {
          if (this.isStart) return; // this.cloudFadeEffct(true);

          this.cloudParticleOuter.cloudFadeEffct(true);
          this.cloudParticleCentrality.cloudFadeEffct(true);
        }
        /**
         * 地块开始启动
         */


        startCallBack() {
          (_crd && eventMgr === void 0 ? (_reportPossibleCrUseOfeventMgr({
            error: Error()
          }), eventMgr) : eventMgr).emit((_crd && EventType === void 0 ? (_reportPossibleCrUseOfEventType({
            error: Error()
          }), EventType) : EventType).MapLand_allCloudFade);
          (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.soundManager.playSocketSound();
          this.scheduleOnce(() => {
            (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
              error: Error()
            }), DataManager) : DataManager).Instance.soundManager.playElectricSound();
            (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
              error: Error()
            }), DataManager) : DataManager).Instance.soundManager.playLockSound();
          }, 0.6); //延迟几秒开始木栅栏动画

          this.palingEffctCallBack();
        }

        allEffect() {
          this.mapAnimation.play();
          this.isStart = true;

          if ((_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.isGameOver) {
            //延时几秒开始建筑开始转动
            this.scheduleOnce(() => {
              this.ani.play();
              this.treeNode.getComponent(Animation).play();
            }, 1); //延时几秒开始升级特效
            // this.scheduleOnce(() => {
            //升级特效

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
              this.scheduleOnce(() => {
                this.mapCoinNode.getComponent(_crd && coinEffect === void 0 ? (_reportPossibleCrUseOfcoinEffect({
                  error: Error()
                }), coinEffect) : coinEffect).setCoinNum(this.mapCoinNum);
                this.mapCoinNode.getComponent(_crd && coinEffect === void 0 ? (_reportPossibleCrUseOfcoinEffect({
                  error: Error()
                }), coinEffect) : coinEffect).playEffect(); // this.lumberyardTree.play()

                (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
                  error: Error()
                }), DataManager) : DataManager).Instance.addCoin(this.mapCoinNum);
              }, 0.3);
            }, this); // }, 0.5);

            this.scheduleOnce(() => {
              let node = find("Canvas/GameEnd");
              node.active = true;
              (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
                error: Error()
              }), DataManager) : DataManager).Instance.soundManager.playVictorySound();
            }, 2);
            this.schedule(() => {
              this.lumberWork();
            }, 2.5);
          }
        }
        /**
         * 关于木栅栏的操作
         */


        initPaling() {// this.palingUp.active = false;
          // this.palingLeft.active = false;
        }

        async palingEffctTo() {
          (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.soundManager.playPalingSound(); // 获取动画组件
          // const upAnimation = this.palingUp.getComponent(PalingAnimation);
          // const leftAnimation = this.palingLeft.getComponent(PalingAnimation);
          //this.palingRight.getComponent(PalingAnimation).startMoveDown();
          // 同时启动两个动画，并等待它们都完成
          // await Promise.all([
          //     upAnimation.startAnimation(),
          //     leftAnimation.startAnimation()
          // ]);
        }

        async palingEffctCallBack() {
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
          }, 0.32); // await this.palingEffctTo();
        } //增加金币


        addCoin() {
          var _this$_coin;

          if (!this._coin) {
            let prefab = (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
              error: Error()
            }), DataManager) : DataManager).Instance.prefabMap.get((_crd && EntityTypeEnum === void 0 ? (_reportPossibleCrUseOfEntityTypeEnum({
              error: Error()
            }), EntityTypeEnum) : EntityTypeEnum).coinNode);
            let coinNode = instantiate(prefab);
            coinNode.scale = coinNode.scale.clone().multiplyScalar(1.1);
            coinNode.parent = this.coinParent;
            let effect = coinNode.getComponent(_crd && coinEffect === void 0 ? (_reportPossibleCrUseOfcoinEffect({
              error: Error()
            }), coinEffect) : coinEffect);
            this._coin = effect;

            if (this._coin) {
              this._coin.setCoinNum(this._addNum);
            }
          }

          (_this$_coin = this._coin) == null || _this$_coin.playEffect();
        }

        lumberWork() {
          this.addCoin();
          this.scheduleOnce(() => {
            this.work.node.active = true;
            this.work.play();
          }, 0.5);
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
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "palingLeft", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "palingUp", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "coinParent", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "work", [_dec7], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "levelUp", [_dec8], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "levelUpParticle", [_dec9], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, "treeNode", [_dec10], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor10 = _applyDecoratedDescriptor(_class2.prototype, "mapAnimation", [_dec11], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor11 = _applyDecoratedDescriptor(_class2.prototype, "cloudParticleOuter", [_dec12], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor12 = _applyDecoratedDescriptor(_class2.prototype, "cloudParticleCentrality", [_dec13], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor13 = _applyDecoratedDescriptor(_class2.prototype, "mapCoinNode", [_dec14], {
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
//# sourceMappingURL=fac4ecaabeb15faf0389a2160e0e03e34743de7a.js.map