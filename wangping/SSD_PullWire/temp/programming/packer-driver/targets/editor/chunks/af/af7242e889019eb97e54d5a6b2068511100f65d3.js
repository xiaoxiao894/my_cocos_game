System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3", "__unresolved_4", "__unresolved_5", "__unresolved_6", "__unresolved_7"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Node, Prefab, Vec3, Animation, tween, poolManager, eventMgr, EventType, EnemyBase, coinEffect, DataManager, CloudParticleEffect, _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _dec12, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _descriptor11, _crd, ccclass, property, MapBeast;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfpoolManager(extras) {
    _reporterNs.report("poolManager", "./PoolManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfeventMgr(extras) {
    _reporterNs.report("eventMgr", "../EventManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfEventType(extras) {
    _reporterNs.report("EventType", "../EventType", _context.meta, extras);
  }

  function _reportPossibleCrUseOfEnemyBase(extras) {
    _reporterNs.report("EnemyBase", "./EnemyBase", _context.meta, extras);
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
      Prefab = _cc.Prefab;
      Vec3 = _cc.Vec3;
      Animation = _cc.Animation;
      tween = _cc.tween;
    }, function (_unresolved_2) {
      poolManager = _unresolved_2.poolManager;
    }, function (_unresolved_3) {
      eventMgr = _unresolved_3.eventMgr;
    }, function (_unresolved_4) {
      EventType = _unresolved_4.EventType;
    }, function (_unresolved_5) {
      EnemyBase = _unresolved_5.EnemyBase;
    }, function (_unresolved_6) {
      coinEffect = _unresolved_6.coinEffect;
    }, function (_unresolved_7) {
      DataManager = _unresolved_7.DataManager;
    }, function (_unresolved_8) {
      CloudParticleEffect = _unresolved_8.CloudParticleEffect;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "ba906bYnjlCwIyMgfkdqT9R", "MapBeast", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Node', 'Prefab', 'Vec3', 'Animation', 'tween']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("MapBeast", MapBeast = (_dec = ccclass('MapBeast'), _dec2 = property(Prefab), _dec3 = property(Node), _dec4 = property(Prefab), _dec5 = property(Prefab), _dec6 = property(Node), _dec7 = property(Node), _dec8 = property(Node), _dec9 = property(Node), _dec10 = property(Node), _dec11 = property(_crd && CloudParticleEffect === void 0 ? (_reportPossibleCrUseOfCloudParticleEffect({
        error: Error()
      }), CloudParticleEffect) : CloudParticleEffect), _dec12 = property(_crd && CloudParticleEffect === void 0 ? (_reportPossibleCrUseOfCloudParticleEffect({
        error: Error()
      }), CloudParticleEffect) : CloudParticleEffect), _dec(_class = (_class2 = class MapBeast extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "bearPrefab", _descriptor, this);

          // 熊预制体
          _initializerDefineProperty(this, "palingNode", _descriptor2, this);

          _initializerDefineProperty(this, "dogPrefab", _descriptor3, this);

          // 狗预制体
          _initializerDefineProperty(this, "elephantPrefab", _descriptor4, this);

          // 大象预制体
          _initializerDefineProperty(this, "beastContainer", _descriptor5, this);

          // 动物容器
          _initializerDefineProperty(this, "electricPalingParent", _descriptor6, this);

          // @property(Node)
          // palingPanrent: Node = null;
          // @property(Node)
          // protected cloudNode: Node = null;
          this.siblings = null;

          _initializerDefineProperty(this, "mapCoinNode", _descriptor7, this);

          this.mapCoinNum = 300;

          _initializerDefineProperty(this, "beastBack", _descriptor8, this);

          _initializerDefineProperty(this, "beastBackPaticle", _descriptor9, this);

          _initializerDefineProperty(this, "cloudParticleOuter", _descriptor10, this);

          _initializerDefineProperty(this, "cloudParticleCentrality", _descriptor11, this);

          this.isStart = false;
          this.startRandom = false;
          this.addTime = 0;
        }

        // cloudFadeEffct(isFade: boolean) {
        //     this.siblings = this.cloudNode.children;
        //     if (this.siblings.length === 0) {
        //         console.warn("当前云节点没有子节点");
        //         return;
        //     }
        //     // 遍历并处理同级节点
        //     this.siblings.forEach((sibling, index) => {
        //         sibling.getComponent(CloudEffct).startEffect(isFade);
        //     });
        // }
        //初始化事件
        onInitEvent() {
          //云的的事件监听
          (_crd && eventMgr === void 0 ? (_reportPossibleCrUseOfeventMgr({
            error: Error()
          }), eventMgr) : eventMgr).once((_crd && EventType === void 0 ? (_reportPossibleCrUseOfEventType({
            error: Error()
          }), EventType) : EventType).MapBeast_start, this.beastStartCallBack, this);
          (_crd && eventMgr === void 0 ? (_reportPossibleCrUseOfeventMgr({
            error: Error()
          }), eventMgr) : eventMgr).on((_crd && EventType === void 0 ? (_reportPossibleCrUseOfEventType({
            error: Error()
          }), EventType) : EventType).MapBeast_cloudFadeOut, this.beastCloudFadeOut, this);
          (_crd && eventMgr === void 0 ? (_reportPossibleCrUseOfeventMgr({
            error: Error()
          }), eventMgr) : eventMgr).on((_crd && EventType === void 0 ? (_reportPossibleCrUseOfEventType({
            error: Error()
          }), EventType) : EventType).MapBeast_cloudFadeIn, this.beastCloudFadeIn, this);
        }

        beastCloudFadeOut() {
          if (this.isStart) return;
          this.beastContainer.active = true;
          this.cloudParticleOuter.cloudFadeEffct(false);
          this.cloudParticleCentrality.cloudFadeEffct(false); // this.cloudFadeEffct(false);
        }

        beastCloudFadeIn() {
          if (this.isStart) return;
          this.cloudParticleOuter.cloudFadeEffct(true);
          this.cloudParticleCentrality.cloudFadeEffct(true); // this.cloudFadeEffct(true);
        } //主逻辑开始生效事件


        beastStartCallBack() {
          (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.isMapBesastSatr = true;
          (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.Arrow_beast.active = false;
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
            (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
              error: Error()
            }), DataManager) : DataManager).Instance.soundManager.playPalingSound();
          }, 0.6);
          this.scheduleOnce(() => {
            (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
              error: Error()
            }), DataManager) : DataManager).Instance.addCoin(this.mapCoinNum);
          }, 0.4);
          let anim = this.palingNode.getComponent(Animation);
          anim.play();
          anim.once(Animation.EventType.FINISHED, () => {});
          this.scheduleOnce(() => {
            //升级粒子特效
            this.beastBack.active = true;
            const animParticle = this.beastBack.getComponent(Animation);
            animParticle.play();
            animParticle.once(Animation.EventType.FINISHED, () => {
              this.beastBack.active = false;
            }, this);
            (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
              error: Error()
            }), DataManager) : DataManager).Instance.soundManager.playUpgradeSound();
            this.beastBackPaticle.active = true;
            const animParticle1 = this.beastBackPaticle.getComponent(Animation);
            this.scheduleOnce(() => {
              animParticle1.play();
            }, 0.06);
            animParticle1.once(Animation.EventType.FINISHED, () => {
              this.beastBackPaticle.active = false;
            }, this);
            this.scheduleOnce(() => {
              this.mapCoinNode.getComponent(_crd && coinEffect === void 0 ? (_reportPossibleCrUseOfcoinEffect({
                error: Error()
              }), coinEffect) : coinEffect).setCoinNum(this.mapCoinNum);
              this.mapCoinNode.getComponent(_crd && coinEffect === void 0 ? (_reportPossibleCrUseOfcoinEffect({
                error: Error()
              }), coinEffect) : coinEffect).playEffect();
            }, 0.3);
          }, 0.32); // this.palingPanrent.getComponent(PalingAnimation).startBounce();

          this.scheduleOnce(() => {
            this.beastContainer.active = true;
          }, 1.5); // this.beastBack.getComponent(Animation).play();
          // this.beastBackPaticle.getComponent(Animation).play();

          this.scheduleOnce(() => {
            const siblings = this.electricPalingParent.children;

            for (let i = 0; i < siblings.length; i++) {
              const sibling = siblings[i];
              (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
                error: Error()
              }), DataManager) : DataManager).Instance.soundManager.playPalingElectricSound();
              this.scheduleOnce(() => {
                const effectNode = sibling.getChildByName("TX_dianliuWQ");

                if (effectNode) {
                  effectNode.active = true;
                  const animation = effectNode.getComponent(Animation);
                  animation.play("dianliusuofang");
                  animation.once(Animation.EventType.FINISHED, () => {
                    // 动画完成后切换到新动画
                    animation.play("TX_dianliuWQ");
                  }, this);
                }
              }, 0.1 * (i + 1)); // 每个节点延迟递增0.5秒
            }
          }, 1);
          this.isStart = true; // this.scheduleOnce(() => {
          //     this.cloudNode.removeAllChildren();
          // }, 40)

          this.scheduleOnce(() => {
            if (this.beastContainer.children.length > 0) {
              this.beastContainer.children.forEach(sibling => {
                sibling.getComponent(_crd && EnemyBase === void 0 ? (_reportPossibleCrUseOfEnemyBase({
                  error: Error()
                }), EnemyBase) : EnemyBase).die();
              }); // this.beastContainer.removeAllChildren();

              this.beastRandom();
              this.startRandom = true;
            }

            (_crd && eventMgr === void 0 ? (_reportPossibleCrUseOfeventMgr({
              error: Error()
            }), eventMgr) : eventMgr).emit((_crd && EventType === void 0 ? (_reportPossibleCrUseOfEventType({
              error: Error()
            }), EventType) : EventType).MapBeast_enemyStart);
          }, 3.5);
          this.scheduleOnce(() => {
            //摄像机移动
            tween((_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
              error: Error()
            }), DataManager) : DataManager).Instance.mainCamera.node).to(0.8, {
              worldPosition: new Vec3(0.014142, 34.1, 37.250385)
            }).call(() => {//this._upgraded = true;
            }).start();
          }, 1); // this.beastRandom();
        }

        beastRandom() {
          // 定义随机生成的动物配置
          const beastPatterns = [[// 组合1
          {
            type: 'elephant',
            pos: new Vec3(5, 0, 40)
          }, {
            type: 'dog',
            pos: new Vec3(-5, 0, 40)
          }, {
            type: 'dog',
            pos: new Vec3(-2.583, 0, 40)
          }, {
            type: 'bear',
            pos: new Vec3(-0.656, 0, 40)
          }, {
            type: 'dog',
            pos: new Vec3(1.314, 0, 40)
          }, {
            type: 'elephant',
            pos: new Vec3(-8, 0, 40)
          }], [// 组合2
          {
            type: 'elephant',
            pos: new Vec3(5, 0, 40)
          }, {
            type: 'bear',
            pos: new Vec3(-5, 0, 40)
          }, {
            type: 'dog',
            pos: new Vec3(-2.583, 0, 40)
          }, {
            type: 'bear',
            pos: new Vec3(-0.656, 0, 40)
          }, {
            type: 'dog',
            pos: new Vec3(1.314, 0, 40)
          }, {
            type: 'dog',
            pos: new Vec3(-8, 0, 40)
          }], [// 组合3
          {
            type: 'bear',
            pos: new Vec3(5, 0, 40)
          }, {
            type: 'dog',
            pos: new Vec3(-5, 0, 40)
          }, {
            type: 'dog',
            pos: new Vec3(-2.583, 0, 40)
          }, {
            type: 'bear',
            pos: new Vec3(-0.656, 0, 40)
          }, {
            type: 'dog',
            pos: new Vec3(1.314, 0, 40)
          }, {
            type: 'dog',
            pos: new Vec3(-8, 0, 40)
          }], [// 组合4
          {
            type: 'bear',
            pos: new Vec3(5, 0, 40)
          }, {
            type: 'dog',
            pos: new Vec3(-5, 0, 40)
          }, {
            type: 'dog',
            pos: new Vec3(-2.583, 0, 40)
          }, {
            type: 'elephant',
            pos: new Vec3(-0.656, 0, 40)
          }, {
            type: 'dog',
            pos: new Vec3(1.314, 0, 40)
          }, {
            type: 'elephant',
            pos: new Vec3(-8, 0, 40)
          }], [// 组合5
          {
            type: 'bear',
            pos: new Vec3(5, 0, 40)
          }, {
            type: 'elephant',
            pos: new Vec3(-5, 0, 40)
          }, {
            type: 'dog',
            pos: new Vec3(-2.583, 0, 40)
          }, {
            type: 'elephant',
            pos: new Vec3(-0.656, 0, 40)
          }, {
            type: 'dog',
            pos: new Vec3(1.314, 0, 40)
          }, {
            type: 'dog',
            pos: new Vec3(-8, 0, 40)
          }]]; // 生成1-5的随机数

          const random = Math.floor(Math.random() * 5) + 1; // 获取对应的动物配置

          const beasts = beastPatterns[random - 1]; // 生成动物

          beasts.forEach(beast => {
            switch (beast.type) {
              case 'elephant':
                this.spawnElephant(beast.pos, true);
                break;

              case 'dog':
                this.spawnDog(beast.pos, true);
                break;

              case 'bear':
                this.spawnBear(beast.pos, true);
                break;
            }
          });
        }

        initPools() {
          if (!this.bearPrefab || !this.dogPrefab || !this.elephantPrefab) return; // 初始化熊敌人池

          (_crd && poolManager === void 0 ? (_reportPossibleCrUseOfpoolManager({
            error: Error()
          }), poolManager) : poolManager).initPool('BearPool', this.bearPrefab, 3); // 初始化狗敌人池

          (_crd && poolManager === void 0 ? (_reportPossibleCrUseOfpoolManager({
            error: Error()
          }), poolManager) : poolManager).initPool('DogPool', this.dogPrefab, 3); // 初始化大象敌人池

          (_crd && poolManager === void 0 ? (_reportPossibleCrUseOfpoolManager({
            error: Error()
          }), poolManager) : poolManager).initPool('ElephantPool', this.elephantPrefab, 3);
        }

        start() {
          this.initPools();
          this.InitcreatorEnemy();
          this.onInitEvent();
          this.scheduleOnce(() => {
            this.beastContainer.active = false;
          }, 0.1); // this.scheduleOnce(() => {
          //    // eventMgr.emit(EventType.MapBeast_start);
          //    eventMgr.emit(EventType.MapBeast_cloudFadeOut);
          // }, 2)
          // this.scheduleOnce(() => {
          //    // eventMgr.emit(EventType.MapBeast_start);
          //    eventMgr.emit(EventType.MapBeast_cloudFadeIn);
          // }, 5)
        }

        InitcreatorEnemy() {
          this.spawnElephant(new Vec3(5, 0, 29));
          this.spawnDog(new Vec3(-5, 0, 28.665));
          this.spawnDog(new Vec3(-2.583, 0, 28.665));
          this.spawnBear(new Vec3(-0.656, 0, 28.533));
          this.spawnDog(new Vec3(1.314, 0, 28.665));
          this.spawnElephant(new Vec3(-8, 0, 29));
        }

        spawnBear(pos, enemyDie) {
          // 从对象池获取熊敌人节点
          const bear = (_crd && poolManager === void 0 ? (_reportPossibleCrUseOfpoolManager({
            error: Error()
          }), poolManager) : poolManager).getNode('BearPool');

          if (enemyDie) {
            bear.getComponent(_crd && EnemyBase === void 0 ? (_reportPossibleCrUseOfEnemyBase({
              error: Error()
            }), EnemyBase) : EnemyBase).setDie();
          }

          if (bear) {
            bear.parent = this.beastContainer;
            bear.position = new Vec3(pos);
            bear.active = true;
          }
        }

        spawnDog(pos, enemyDie) {
          // 从对象池获取狗敌人节点
          const dog = (_crd && poolManager === void 0 ? (_reportPossibleCrUseOfpoolManager({
            error: Error()
          }), poolManager) : poolManager).getNode('DogPool');

          if (enemyDie) {
            dog.getComponent(_crd && EnemyBase === void 0 ? (_reportPossibleCrUseOfEnemyBase({
              error: Error()
            }), EnemyBase) : EnemyBase).setDie();
          }

          if (dog) {
            dog.parent = this.beastContainer;
            dog.position = new Vec3(pos);
            dog.active = true;
          }
        }

        spawnElephant(pos, enemyDie) {
          // 从对象池获取大象敌人节点
          const elephant = (_crd && poolManager === void 0 ? (_reportPossibleCrUseOfpoolManager({
            error: Error()
          }), poolManager) : poolManager).getNode('ElephantPool');

          if (enemyDie) {
            elephant.getComponent(_crd && EnemyBase === void 0 ? (_reportPossibleCrUseOfEnemyBase({
              error: Error()
            }), EnemyBase) : EnemyBase).setDie();
          }

          if (elephant) {
            elephant.parent = this.beastContainer;
            elephant.position = new Vec3(pos);
            elephant.active = true;
          }
        }

        clearAll() {
          // 清空所有对象池
          (_crd && poolManager === void 0 ? (_reportPossibleCrUseOfpoolManager({
            error: Error()
          }), poolManager) : poolManager).clearAll();
        }

        update(deltaTime) {
          if (this.startRandom) {
            this.addTime += deltaTime;

            if (this.addTime >= 9) {
              this.addTime = 0;
              this.beastRandom();
            }
          }
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "bearPrefab", [_dec2], {
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
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "dogPrefab", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "elephantPrefab", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "beastContainer", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "electricPalingParent", [_dec7], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "mapCoinNode", [_dec8], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "beastBack", [_dec9], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, "beastBackPaticle", [_dec10], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor10 = _applyDecoratedDescriptor(_class2.prototype, "cloudParticleOuter", [_dec11], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor11 = _applyDecoratedDescriptor(_class2.prototype, "cloudParticleCentrality", [_dec12], {
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
//# sourceMappingURL=af7242e889019eb97e54d5a6b2068511100f65d3.js.map