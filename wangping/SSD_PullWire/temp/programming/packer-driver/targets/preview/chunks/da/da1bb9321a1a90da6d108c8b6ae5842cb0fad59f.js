System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3", "__unresolved_4", "__unresolved_5", "__unresolved_6"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Node, SkeletalAnimation, Vec3, Animation, tween, eventMgr, EventType, CloudEffct, coinEffect, DataManager, CloudParticleEffect, _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _dec12, _dec13, _dec14, _dec15, _dec16, _dec17, _dec18, _dec19, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _descriptor11, _descriptor12, _descriptor13, _descriptor14, _descriptor15, _descriptor16, _descriptor17, _descriptor18, _crd, ccclass, property, MapBeastB;

  function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

  function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfeventMgr(extras) {
    _reporterNs.report("eventMgr", "../EventManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfEventType(extras) {
    _reporterNs.report("EventType", "../EventType", _context.meta, extras);
  }

  function _reportPossibleCrUseOfCloudEffct(extras) {
    _reporterNs.report("CloudEffct", "../CloudEffct", _context.meta, extras);
  }

  function _reportPossibleCrUseOfcoinEffect(extras) {
    _reporterNs.report("coinEffect", "../coinEffect", _context.meta, extras);
  }

  function _reportPossibleCrUseOfDataManager(extras) {
    _reporterNs.report("DataManager", "../../Global/DataManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfCloudParticleEffect(extras) {
    _reporterNs.report("CloudParticleEffect", "../CloudParticleEffect", _context.meta, extras);
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
      Vec3 = _cc.Vec3;
      Animation = _cc.Animation;
      tween = _cc.tween;
    }, function (_unresolved_2) {
      eventMgr = _unresolved_2.eventMgr;
    }, function (_unresolved_3) {
      EventType = _unresolved_3.EventType;
    }, function (_unresolved_4) {
      CloudEffct = _unresolved_4.CloudEffct;
    }, function (_unresolved_5) {
      coinEffect = _unresolved_5.coinEffect;
    }, function (_unresolved_6) {
      DataManager = _unresolved_6.DataManager;
    }, function (_unresolved_7) {
      CloudParticleEffect = _unresolved_7.CloudParticleEffect;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "42540aAa65Id5pOzIJigiLQ", "MapBeastB", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Node', 'SkeletalAnimation', 'Vec3', 'Animation', 'tween']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("MapBeastB", MapBeastB = (_dec = ccclass('MapBeastB'), _dec2 = property(Node), _dec3 = property(Node), _dec4 = property(Node), _dec5 = property(Node), _dec6 = property(Node), _dec7 = property(Node), _dec8 = property(Animation), _dec9 = property(Node), _dec10 = property(Node), _dec11 = property(Node), _dec12 = property(Node), _dec13 = property(Node), _dec14 = property(Animation), _dec15 = property(_crd && CloudParticleEffect === void 0 ? (_reportPossibleCrUseOfCloudParticleEffect({
        error: Error()
      }), CloudParticleEffect) : CloudParticleEffect), _dec16 = property(_crd && CloudParticleEffect === void 0 ? (_reportPossibleCrUseOfCloudParticleEffect({
        error: Error()
      }), CloudParticleEffect) : CloudParticleEffect), _dec17 = property(_crd && CloudParticleEffect === void 0 ? (_reportPossibleCrUseOfCloudParticleEffect({
        error: Error()
      }), CloudParticleEffect) : CloudParticleEffect), _dec18 = property(_crd && CloudParticleEffect === void 0 ? (_reportPossibleCrUseOfCloudParticleEffect({
        error: Error()
      }), CloudParticleEffect) : CloudParticleEffect), _dec19 = property(Node), _dec(_class = (_class2 = class MapBeastB extends Component {
        constructor() {
          super(...arguments);

          _initializerDefineProperty(this, "palingNode", _descriptor, this);

          _initializerDefineProperty(this, "palingRight", _descriptor2, this);

          _initializerDefineProperty(this, "palingLeft", _descriptor3, this);

          _initializerDefineProperty(this, "palingUp", _descriptor4, this);

          _initializerDefineProperty(this, "palingDown", _descriptor5, this);

          _initializerDefineProperty(this, "beastContainer", _descriptor6, this);

          _initializerDefineProperty(this, "oilAnimation", _descriptor7, this);

          _initializerDefineProperty(this, "oilPump", _descriptor8, this);

          _initializerDefineProperty(this, "singleShowPaling", _descriptor9, this);

          //单独显示的栅栏
          // @property(Node)
          // cloudNode: Node = null;
          // @property(Node)
          // cloudNode1: Node = null;
          _initializerDefineProperty(this, "coinNode", _descriptor10, this);

          _initializerDefineProperty(this, "levelUp", _descriptor11, this);

          _initializerDefineProperty(this, "levelUpParticle", _descriptor12, this);

          _initializerDefineProperty(this, "mapEffect", _descriptor13, this);

          _initializerDefineProperty(this, "cloudParticleOuter", _descriptor14, this);

          _initializerDefineProperty(this, "cloudParticleCentrality", _descriptor15, this);

          _initializerDefineProperty(this, "cloudParticleOuter1", _descriptor16, this);

          _initializerDefineProperty(this, "cloudParticleCentrality1", _descriptor17, this);

          this.isStart = false;
          this.isDrumAni = false;
          //是否开始油桶的动画事件
          this.drumDuration = 2.6;
          //持续多少秒
          this.drumTime = 0;
          //累计时间
          this.coinNum = 10;

          _initializerDefineProperty(this, "mapCoinNode", _descriptor18, this);

          this.mapCoinNum = 300;
          this.playPalingAnimation = null;
        }

        start() {
          this.playPalingAnimation = this.palingNode.getComponent(Animation);
          var animState = this.playPalingAnimation.getState(this.playPalingAnimation.defaultClip.name);

          if (animState) {
            animState.time = 0; // 设置到第一帧

            animState.sample(); // 采样当前时间帧

            this.playPalingAnimation.pause(); // 暂停动画，停留在第一帧
          }
        } //初始化事件


        onInitEvent() {
          //云的的事件监听
          (_crd && eventMgr === void 0 ? (_reportPossibleCrUseOfeventMgr({
            error: Error()
          }), eventMgr) : eventMgr).on((_crd && EventType === void 0 ? (_reportPossibleCrUseOfEventType({
            error: Error()
          }), EventType) : EventType).MapBeastB_start, this.MapBeastBStart, this);
          (_crd && eventMgr === void 0 ? (_reportPossibleCrUseOfeventMgr({
            error: Error()
          }), eventMgr) : eventMgr).on((_crd && EventType === void 0 ? (_reportPossibleCrUseOfEventType({
            error: Error()
          }), EventType) : EventType).MapBeastB_cloudFadeOut, this.beastBFadeOut, this);
          (_crd && eventMgr === void 0 ? (_reportPossibleCrUseOfeventMgr({
            error: Error()
          }), eventMgr) : eventMgr).on((_crd && EventType === void 0 ? (_reportPossibleCrUseOfEventType({
            error: Error()
          }), EventType) : EventType).MapBeastB_cloudFadeIn, this.beastBFadeIn, this); //第二个云

          (_crd && eventMgr === void 0 ? (_reportPossibleCrUseOfeventMgr({
            error: Error()
          }), eventMgr) : eventMgr).on((_crd && EventType === void 0 ? (_reportPossibleCrUseOfEventType({
            error: Error()
          }), EventType) : EventType).MapBeastB1_cloudFadeOut, this.beastBFadeOutOneOne, this);
          (_crd && eventMgr === void 0 ? (_reportPossibleCrUseOfeventMgr({
            error: Error()
          }), eventMgr) : eventMgr).on((_crd && EventType === void 0 ? (_reportPossibleCrUseOfEventType({
            error: Error()
          }), EventType) : EventType).MapBeastB1_cloudFadeIn, this.beastBFadeInOneOne, this);
        }

        onLoad() {
          this.onInitEvent();
          this.initPaling();
        }

        beastBFadeOut() {
          if (this.isStart) {
            return;
          }

          this.cloudParticleOuter.cloudFadeEffct(false);
          this.cloudParticleCentrality.cloudFadeEffct(false); //this.cloudFadeEffct(false, this.cloudNode)
        }

        beastBFadeIn() {
          if (this.isStart) {
            return;
          }

          this.cloudParticleOuter.cloudFadeEffct(true);
          this.cloudParticleCentrality.cloudFadeEffct(true); //this.cloudFadeEffct(true, this.cloudNode)
        }

        beastBFadeOutOneOne() {
          if (this.isStart) {
            return;
          }

          this.cloudParticleOuter1.cloudFadeEffct(false);
          this.cloudParticleCentrality1.cloudFadeEffct(false); //this.cloudFadeEffct(false, this.cloudNode1)
        }

        beastBFadeInOneOne() {
          if (this.isStart) {
            return;
          }

          this.cloudParticleOuter1.cloudFadeEffct(true);
          this.cloudParticleCentrality1.cloudFadeEffct(true); // this.cloudFadeEffct(true, this.cloudNode1)
        }

        cloudFadeEffct(isFade, cloudNode) {
          var siblings = cloudNode.children;

          if (siblings.length === 0) {
            console.warn("当前云节点没有子节点");
            return;
          } // 遍历并处理同级节点


          siblings.forEach((sibling, index) => {
            sibling.getComponent(_crd && CloudEffct === void 0 ? (_reportPossibleCrUseOfCloudEffct({
              error: Error()
            }), CloudEffct) : CloudEffct).startEffect(isFade);
          });
        }

        MapBeastBStart() {
          this.cloudParticleOuter.cloudFadeEffct(false);
          this.cloudParticleCentrality.cloudFadeEffct(false);
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
          }, 0.6);
          this.scheduleOnce(() => {
            (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
              error: Error()
            }), DataManager) : DataManager).Instance.addCoin(this.mapCoinNum);
          }, 0.4);
          this.palingEffctCallBack();
        }

        allEffect() {
          this.mapEffect.play();
          if (this.isStart) return;
          this.isStart = true; //this.cloudFadeEffct(false, this.cloudNode1)

          this.cloudParticleOuter1.cloudFadeEffct(false);
          this.cloudParticleCentrality1.cloudFadeEffct(false);
          this.scheduleOnce(() => {
            this.oilPump.getComponent(SkeletalAnimation).play();
          }, 1); // this.scheduleOnce(() => {
          //升级特效

          this.levelUp.active = true;
          var anim = this.levelUp.getComponent(Animation);
          anim.play();
          anim.once(Animation.EventType.FINISHED, () => {
            this.levelUp.active = false;
          }, this); //升级粒子特效

          (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.soundManager.playUpgradeSound();
          this.levelUpParticle.active = true;
          var animParticle = this.levelUpParticle.getComponent(Animation);
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
          }, 0.3); //}, 1.5);
          // this.scheduleOnce(() => {
          //     this.singleShowPaling.active = true;
          //     this.singleShowPaling.getComponent(PalingAnimation).startBounce();
          // }, 1.2)

          this.scheduleOnce(() => {
            this.beastContainer.active = true;
          }, 2);
          this.isDrumAni = true;
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
          // this.palingDown.active = false;
          // this.palingUp.active = true;
          // this.palingLeft.active = false;
        }

        palingEffctTo() {// 获取动画组件
          // const leftAnimation = this.palingLeft.getComponent(PalingAnimation);
          // const rightAnimation = this.palingRight.getComponent(PalingAnimation);
          // this.palingUp.getComponent(PalingAnimation).startMoveDown();
          // 同时启动两个动画，并等待它们都完成
          // await Promise.all([
          //     leftAnimation.startAnimation(),
          //     rightAnimation.startAnimation()
          // ]);

          return _asyncToGenerator(function* () {})();
        }

        palingEffctCallBack() {
          var _this = this;

          return _asyncToGenerator(function* () {
            // this.palingRight.active = true;
            // this.palingDown.active = true;
            // this.palingUp.active = true;
            // this.palingLeft.active = true;
            (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
              error: Error()
            }), DataManager) : DataManager).Instance.soundManager.playPalingSound();

            var anim = _this.palingNode.getComponent(Animation);

            anim.play();
            anim.once(Animation.EventType.FINISHED, () => {});

            _this.scheduleOnce(() => {
              _this.allEffect();
            }, 0.48); // await this.palingEffctTo();
            // this.palingDown.getComponent(PalingAnimation).startBounce();

          })();
        }

        update(deltaTime) {
          if (this.isDrumAni) {
            this.drumTime += deltaTime;

            if (this.drumTime >= this.drumDuration) {
              this.drumTime = 0; //this.oilNode.getComponent(OilDrumEffect).showChildrenSequentially();

              if (this.oilAnimation.node.active == false) {
                this.oilAnimation.node.active = true;
              }

              this.oilAnimation.play();
              this.scheduleOnce(() => {
                this.coinNode.getComponent(_crd && coinEffect === void 0 ? (_reportPossibleCrUseOfcoinEffect({
                  error: Error()
                }), coinEffect) : coinEffect).setCoinNum(this.coinNum);
                this.coinNode.getComponent(_crd && coinEffect === void 0 ? (_reportPossibleCrUseOfcoinEffect({
                  error: Error()
                }), coinEffect) : coinEffect).playEffect();
              }, 2.4);
              (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
                error: Error()
              }), DataManager) : DataManager).Instance.addCoin(this.coinNum);
            }
          }
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "palingNode", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "palingRight", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "palingLeft", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "palingUp", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "palingDown", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "beastContainer", [_dec7], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "oilAnimation", [_dec8], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "oilPump", [_dec9], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, "singleShowPaling", [_dec10], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor10 = _applyDecoratedDescriptor(_class2.prototype, "coinNode", [_dec11], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor11 = _applyDecoratedDescriptor(_class2.prototype, "levelUp", [_dec12], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor12 = _applyDecoratedDescriptor(_class2.prototype, "levelUpParticle", [_dec13], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor13 = _applyDecoratedDescriptor(_class2.prototype, "mapEffect", [_dec14], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor14 = _applyDecoratedDescriptor(_class2.prototype, "cloudParticleOuter", [_dec15], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor15 = _applyDecoratedDescriptor(_class2.prototype, "cloudParticleCentrality", [_dec16], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor16 = _applyDecoratedDescriptor(_class2.prototype, "cloudParticleOuter1", [_dec17], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor17 = _applyDecoratedDescriptor(_class2.prototype, "cloudParticleCentrality1", [_dec18], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor18 = _applyDecoratedDescriptor(_class2.prototype, "mapCoinNode", [_dec19], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=da1bb9321a1a90da6d108c8b6ae5842cb0fad59f.js.map