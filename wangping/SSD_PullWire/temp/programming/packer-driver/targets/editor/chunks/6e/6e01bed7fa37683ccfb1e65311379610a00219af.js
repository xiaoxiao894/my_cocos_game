System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3", "__unresolved_4", "__unresolved_5", "__unresolved_6", "__unresolved_7"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Node, SkeletalAnimation, Animation, warn, tween, Vec3, eventMgr, EventType, PalingAnimation, FruitScript, DataManager, coinEffect, CloudParticleEffect, _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _dec12, _dec13, _dec14, _dec15, _dec16, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _descriptor11, _descriptor12, _descriptor13, _descriptor14, _descriptor15, _crd, ccclass, property, MapFarmland;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfeventMgr(extras) {
    _reporterNs.report("eventMgr", "./EventManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfEventType(extras) {
    _reporterNs.report("EventType", "./EventType", _context.meta, extras);
  }

  function _reportPossibleCrUseOfPalingAnimation(extras) {
    _reporterNs.report("PalingAnimation", "./PalingAnimation", _context.meta, extras);
  }

  function _reportPossibleCrUseOfFruitScript(extras) {
    _reporterNs.report("FruitScript", "./FruitScript", _context.meta, extras);
  }

  function _reportPossibleCrUseOfDataManager(extras) {
    _reporterNs.report("DataManager", "../Global/DataManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfcoinEffect(extras) {
    _reporterNs.report("coinEffect", "./coinEffect", _context.meta, extras);
  }

  function _reportPossibleCrUseOfCloudParticleEffect(extras) {
    _reporterNs.report("CloudParticleEffect", "./CloudParticleEffect", _context.meta, extras);
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
      warn = _cc.warn;
      tween = _cc.tween;
      Vec3 = _cc.Vec3;
    }, function (_unresolved_2) {
      eventMgr = _unresolved_2.eventMgr;
    }, function (_unresolved_3) {
      EventType = _unresolved_3.EventType;
    }, function (_unresolved_4) {
      PalingAnimation = _unresolved_4.PalingAnimation;
    }, function (_unresolved_5) {
      FruitScript = _unresolved_5.FruitScript;
    }, function (_unresolved_6) {
      DataManager = _unresolved_6.DataManager;
    }, function (_unresolved_7) {
      coinEffect = _unresolved_7.coinEffect;
    }, function (_unresolved_8) {
      CloudParticleEffect = _unresolved_8.CloudParticleEffect;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "cbd82sR4xpBuJnsbm1lVMsP", "MapFarmland", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Node', 'Prefab', 'SkeletalAnimation', 'Animation', 'ConeCollider', 'error', 'warn', 'ParticleSystem', 'Color', 'tween', 'Vec3']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("MapFarmland", MapFarmland = (_dec = ccclass('MapFarmland'), _dec2 = property(Node), _dec3 = property(Node), _dec4 = property(Node), _dec5 = property(Node), _dec6 = property(Node), _dec7 = property(Node), _dec8 = property(Node), _dec9 = property(Node), _dec10 = property(Node), _dec11 = property(Node), _dec12 = property(Node), _dec13 = property(Animation), _dec14 = property(_crd && CloudParticleEffect === void 0 ? (_reportPossibleCrUseOfCloudParticleEffect({
        error: Error()
      }), CloudParticleEffect) : CloudParticleEffect), _dec15 = property(_crd && CloudParticleEffect === void 0 ? (_reportPossibleCrUseOfCloudParticleEffect({
        error: Error()
      }), CloudParticleEffect) : CloudParticleEffect), _dec16 = property(Animation), _dec(_class = (_class2 = class MapFarmland extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "palingNode", _descriptor, this);

          _initializerDefineProperty(this, "palingRight", _descriptor2, this);

          _initializerDefineProperty(this, "palingLeft", _descriptor3, this);

          _initializerDefineProperty(this, "palingUp", _descriptor4, this);

          _initializerDefineProperty(this, "palingDown", _descriptor5, this);

          _initializerDefineProperty(this, "fruitParent", _descriptor6, this);

          _initializerDefineProperty(this, "rotatorNode", _descriptor7, this);

          this.coinNum = 10;
          this.mapCoinNum = 300;

          _initializerDefineProperty(this, "levelUp", _descriptor8, this);

          _initializerDefineProperty(this, "levelUpParticle", _descriptor9, this);

          _initializerDefineProperty(this, "particleEffect", _descriptor10, this);

          _initializerDefineProperty(this, "mapCoinNode", _descriptor11, this);

          _initializerDefineProperty(this, "mapEffct", _descriptor12, this);

          this.isStart = false;

          _initializerDefineProperty(this, "cloudParticleOuter", _descriptor13, this);

          _initializerDefineProperty(this, "cloudParticleCentrality", _descriptor14, this);

          _initializerDefineProperty(this, "palingAnimation", _descriptor15, this);

          // 缓存组件引用，避免重复查找
          this._fruitScripts = [];
          this._palingAnimations = {};
          this._animations = {};
          this._skeletalAnimations = {};
          // 计时器优化
          this._updateTimer = 0;
          this._checkInterval = 2;
          // 检查间隔时间（秒）
          this._fruitStateChange = false;
          // 对象池相关
          this._coinEffectPool = [];
        }

        onInitEvent() {
          (_crd && eventMgr === void 0 ? (_reportPossibleCrUseOfeventMgr({
            error: Error()
          }), eventMgr) : eventMgr).on((_crd && EventType === void 0 ? (_reportPossibleCrUseOfEventType({
            error: Error()
          }), EventType) : EventType).MapFarmland_cloudFadeOut, this.cloudFadeOutCallBack, this);
          (_crd && eventMgr === void 0 ? (_reportPossibleCrUseOfeventMgr({
            error: Error()
          }), eventMgr) : eventMgr).on((_crd && EventType === void 0 ? (_reportPossibleCrUseOfEventType({
            error: Error()
          }), EventType) : EventType).MapFarmland_cloudFadeIn, this.cloudFadeInCallBack, this);
          (_crd && eventMgr === void 0 ? (_reportPossibleCrUseOfeventMgr({
            error: Error()
          }), eventMgr) : eventMgr).on((_crd && EventType === void 0 ? (_reportPossibleCrUseOfEventType({
            error: Error()
          }), EventType) : EventType).MapFarmland_fruitGreen, this.fruitGreenCallBack, this);
          (_crd && eventMgr === void 0 ? (_reportPossibleCrUseOfeventMgr({
            error: Error()
          }), eventMgr) : eventMgr).on((_crd && EventType === void 0 ? (_reportPossibleCrUseOfEventType({
            error: Error()
          }), EventType) : EventType).MapFarmland_start, this.FarmlandCallBack, this);
          (_crd && eventMgr === void 0 ? (_reportPossibleCrUseOfeventMgr({
            error: Error()
          }), eventMgr) : eventMgr).on((_crd && EventType === void 0 ? (_reportPossibleCrUseOfEventType({
            error: Error()
          }), EventType) : EventType).Lumberyard_start, this.lumberyardStart, this);
        }

        onLoad() {
          this.onInitEvent();
          this.initPaling();

          this._cacheComponents();
        }

        start() {
          const animState = this.palingAnimation.getState(this.palingAnimation.defaultClip.name);

          if (animState) {
            animState.time = 0; // 设置到第一帧

            animState.sample(); // 采样当前时间帧

            this.palingAnimation.pause(); // 暂停动画，停留在第一帧
          }
        } // 缓存常用组件引用


        _cacheComponents() {
          // // 缓存栅栏动画组件
          // this._palingAnimations = {
          //     up: this.palingUp.getComponent(PalingAnimation),
          //     down: this.palingDown.getComponent(PalingAnimation),
          //     left: this.palingLeft.getComponent(PalingAnimation),
          //     right: this.palingRight.getComponent(PalingAnimation)
          // };
          // 缓存动画组件
          this._animations = {
            levelUp: this.levelUp.getComponent(Animation),
            levelUpParticle: this.levelUpParticle.getComponent(Animation),
            particleEffect: this.particleEffect.getComponent(Animation)
          }; // 缓存骨骼动画组件

          this._skeletalAnimations.rotator = this.rotatorNode.getComponent(SkeletalAnimation); // 缓存果实脚本

          this._cacheFruitScripts();
        } // 缓存果实脚本引用


        _cacheFruitScripts() {
          if (!this.fruitParent) return;
          this._fruitScripts.length = 0;
          this.fruitParent.children.forEach(child => {
            const fruitNode = child.getChildByName("fruitNode");

            if (fruitNode) {
              const script = fruitNode.getComponent(_crd && FruitScript === void 0 ? (_reportPossibleCrUseOfFruitScript({
                error: Error()
              }), FruitScript) : FruitScript);
              if (script) this._fruitScripts.push(script);
            }
          });
        }

        FarmlandCallBack() {
          (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.Arrow_farmLand.active = false;
          (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.soundManager.playSocketSound();
          this.scheduleOnce(() => {
            (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
              error: Error()
            }), DataManager) : DataManager).Instance.addCoin(this.mapCoinNum);
          }, 0.3);
          if (this.isStart) return;
          this.scheduleOnce(() => {
            (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
              error: Error()
            }), DataManager) : DataManager).Instance.soundManager.playElectricSound();
            (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
              error: Error()
            }), DataManager) : DataManager).Instance.soundManager.playLockSound();
          }, 0.6); // this.scheduleOnce(() => {

          this.palingEffctCallBack(); //}, 0.48)
        }

        allEffect() {
          this.mapEffct.play();
          this.isStart = true; //升级光效

          this.levelUp.active = true;

          this._animations.levelUp.play();

          this._animations.levelUp.once(Animation.EventType.FINISHED, () => {
            this.levelUp.active = false;
          }, this);

          (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.soundManager.playUpgradeSound(); //升级粒子特效

          this.levelUpParticle.active = true;
          this.scheduleOnce(() => {
            this._animations.levelUpParticle.play();
          }, 0.06); //this._animations.levelUpParticle.play();

          this._animations.levelUpParticle.once(Animation.EventType.FINISHED, () => {
            this.levelUpParticle.active = false; //建筑旋转特效

            this._skeletalAnimations.rotator.play(); //洒水粒子特效


            this.particleEffect.active = true;

            this._animations.particleEffect.play();

            this.scheduleOnce(() => {
              (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
                error: Error()
              }), DataManager) : DataManager).Instance.soundManager.playCheerSound();
            }, 0.2);
            (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
              error: Error()
            }), DataManager) : DataManager).Instance.soundManager.playWateringSoundThreeTimes();
          }, this);

          this.scheduleOnce(() => {
            this._playCoinEffect(this.mapCoinNode, this.mapCoinNum);
          }, 0.3);
          this.scheduleOnce(() => {
            (_crd && eventMgr === void 0 ? (_reportPossibleCrUseOfeventMgr({
              error: Error()
            }), eventMgr) : eventMgr).emit((_crd && EventType === void 0 ? (_reportPossibleCrUseOfEventType({
              error: Error()
            }), EventType) : EventType).MapFarmland_fruitGreen);
          }, 1.1);
          this.scheduleOnce(() => {
            //摄像机移动
            tween((_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
              error: Error()
            }), DataManager) : DataManager).Instance.mainCamera.node).to(0.8, {
              worldPosition: new Vec3(0.014142, 34.1, 37.250385)
            }).call(() => {//this._upgraded = true;
            }).start();
          }, 1.2);
        }

        cloudFadeOutCallBack() {
          if (this.isStart) return;
          this.cloudParticleOuter.cloudFadeEffct(false);
          this.cloudParticleCentrality.cloudFadeEffct(false); // const color = new Color(255, 255, 255, 0);  
          // this.cloudParticleOuter.getMaterialInstance(0).setProperty("tintColor",color);
          // this.cloudParticleCentrality.getMaterialInstance(0).setProperty("tintColor",color);
        }

        cloudFadeInCallBack() {
          if (this.isStart) return;
          this.cloudParticleOuter.cloudFadeEffct(true);
          this.cloudParticleCentrality.cloudFadeEffct(true); //this.cloudFadeEffct(true);
        }

        initPaling() {// this.palingRight.active = true;
          // this.palingDown.active = false;
          // this.palingUp.active = false;
          // this.palingLeft.active = false;
        }

        async palingEffctTo() {
          this._palingAnimations.right.startMoveDown();

          await Promise.all([this._palingAnimations.up.startAnimation(), this._palingAnimations.down.startAnimation()]);
        }

        async palingEffctCallBack() {
          // this.palingRight.active = true;
          // this.palingDown.active = true;
          // this.palingUp.active = true;
          // this.palingLeft.active = true;
          this.palingAnimation.play();
          this.scheduleOnce(() => {
            this.allEffect();
          }, 0.48);
          this.palingAnimation.once(Animation.EventType.FINISHED, () => {}, this);
          (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.soundManager.playPalingSound(); // await this.palingEffctTo();
          // this._palingAnimations.left.startBounce();
        }

        fruitGreenCallBack() {
          (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.soundManager.playGrowSound();

          this._fruitScripts.forEach(script => {
            script.setFruitState("red"); //
          });

          this._fruitStateChange = true;
          this._updateTimer = 0;
        }

        fruitRedCallBack() {
          // 筛选绿色果实（优化版）
          //const greenScripts: FruitScript[] = [];
          // for (let i = 0; i < this._fruitScripts.length; i++) {
          //     if (!this._fruitScripts[i].getFruitState()) {
          //         greenScripts.push(this._fruitScripts[i]);
          //     }
          // }
          // if (greenScripts.length <= 0) return;
          const randomIndex = Math.floor(Math.random() * this._fruitScripts.length); // const fruitScript = greenScripts[randomIndex];
          // fruitScript.setFruitState("red");

          (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.addCoin(this.coinNum); // 获取对应的coinNode（需要确保结构一致性）

          const coinNode = this._fruitScripts[randomIndex].node.parent.getChildByName("coinNode");

          if (coinNode) {
            this.scheduleOnce(() => {
              this._playCoinEffect(coinNode, this.coinNum);
            }, 0.2);
          } else {
            warn("fruit 没有金币的节点", randomIndex);
          } // this.scheduleOnce(() => {
          //     fruitScript.setFruitState("green");
          // }, 3);


          this._updateTimer = 0;
        } // 使用固定间隔计时器替代每帧检查


        update(deltaTime) {
          if (!this._fruitStateChange) return;
          this._updateTimer += deltaTime;

          if (this._updateTimer >= this._checkInterval) {
            this.fruitRedCallBack();
            this._updateTimer = 0;
          }
        }

        lumberyardStart() {
          if ((_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.isGameOver) {
            this.scheduleOnce(() => {
              //this._palingAnimations.up.startMoveDown();
              this.palingUp.getComponent(_crd && PalingAnimation === void 0 ? (_reportPossibleCrUseOfPalingAnimation({
                error: Error()
              }), PalingAnimation) : PalingAnimation).startMoveDown();
            }, 0);
          }
        } // 统一管理coinEffect播放


        _playCoinEffect(node, coinNum) {
          if (!node) return;
          let effect = node.getComponent(_crd && coinEffect === void 0 ? (_reportPossibleCrUseOfcoinEffect({
            error: Error()
          }), coinEffect) : coinEffect);

          if (!effect) {
            effect = node.addComponent(_crd && coinEffect === void 0 ? (_reportPossibleCrUseOfcoinEffect({
              error: Error()
            }), coinEffect) : coinEffect);
          }

          effect.setCoinNum(coinNum);
          effect.playEffect();
        }

        onDestroy() {
          // 清理事件监听
          // eventMgr.targetOff(this);
          // 清理定时器
          this.unscheduleAllCallbacks();
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "palingNode", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "palingRight", [_dec3], {
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
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "palingDown", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "fruitParent", [_dec7], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "rotatorNode", [_dec8], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "levelUp", [_dec9], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, "levelUpParticle", [_dec10], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor10 = _applyDecoratedDescriptor(_class2.prototype, "particleEffect", [_dec11], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor11 = _applyDecoratedDescriptor(_class2.prototype, "mapCoinNode", [_dec12], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor12 = _applyDecoratedDescriptor(_class2.prototype, "mapEffct", [_dec13], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor13 = _applyDecoratedDescriptor(_class2.prototype, "cloudParticleOuter", [_dec14], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor14 = _applyDecoratedDescriptor(_class2.prototype, "cloudParticleCentrality", [_dec15], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor15 = _applyDecoratedDescriptor(_class2.prototype, "palingAnimation", [_dec16], {
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
//# sourceMappingURL=6e01bed7fa37683ccfb1e65311379610a00219af.js.map