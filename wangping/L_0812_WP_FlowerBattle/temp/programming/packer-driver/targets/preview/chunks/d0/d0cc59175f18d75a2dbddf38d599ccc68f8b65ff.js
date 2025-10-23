System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3", "__unresolved_4", "__unresolved_5", "__unresolved_6", "__unresolved_7"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Animation, BoxCollider, Mat4, Quat, RigidBody, tween, v3, Vec3, Entity, PlayerTrigger, App, GlobeVariable, EventManager, EventType, SoundManager, _dec, _dec2, _class, _class2, _descriptor, _crd, ccclass, property, Player;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfEntity(extras) {
    _reporterNs.report("Entity", "./Entity", _context.meta, extras);
  }

  function _reportPossibleCrUseOfPlayerTrigger(extras) {
    _reporterNs.report("PlayerTrigger", "./PlayerTrigger", _context.meta, extras);
  }

  function _reportPossibleCrUseOfApp(extras) {
    _reporterNs.report("App", "../App", _context.meta, extras);
  }

  function _reportPossibleCrUseOfGlobeVariable(extras) {
    _reporterNs.report("GlobeVariable", "../core/GlobeVariable", _context.meta, extras);
  }

  function _reportPossibleCrUseOfEventManager(extras) {
    _reporterNs.report("EventManager", "../core/EventManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfEventType(extras) {
    _reporterNs.report("EventType", "../core/EventType", _context.meta, extras);
  }

  function _reportPossibleCrUseOfSoundManager(extras) {
    _reporterNs.report("SoundManager", "../core/SoundManager", _context.meta, extras);
  }

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
      Animation = _cc.Animation;
      BoxCollider = _cc.BoxCollider;
      Mat4 = _cc.Mat4;
      Quat = _cc.Quat;
      RigidBody = _cc.RigidBody;
      tween = _cc.tween;
      v3 = _cc.v3;
      Vec3 = _cc.Vec3;
    }, function (_unresolved_2) {
      Entity = _unresolved_2.default;
    }, function (_unresolved_3) {
      PlayerTrigger = _unresolved_3.PlayerTrigger;
    }, function (_unresolved_4) {
      App = _unresolved_4.App;
    }, function (_unresolved_5) {
      GlobeVariable = _unresolved_5.GlobeVariable;
    }, function (_unresolved_6) {
      EventManager = _unresolved_6.EventManager;
    }, function (_unresolved_7) {
      EventType = _unresolved_7.EventType;
    }, function (_unresolved_8) {
      SoundManager = _unresolved_8.SoundManager;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "95c79LXaalGUoWPGhd/e1rY", "Player", undefined);

      __checkObsolete__(['_decorator', 'Animation', 'BoxCollider', 'Collider', 'Component', 'find', 'ICollisionEvent', 'ITriggerEvent', 'Mat4', 'Node', 'Quat', 'RigidBody', 'tween', 'v3', 'Vec3']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("Player", Player = (_dec = ccclass('Player'), _dec2 = property(Animation), _dec(_class = (_class2 = class Player extends (_crd && Entity === void 0 ? (_reportPossibleCrUseOfEntity({
        error: Error()
      }), Entity) : Entity) {
        constructor() {
          super(...arguments);

          _initializerDefineProperty(this, "attackAni", _descriptor, this);

          this.entityName = (_crd && GlobeVariable === void 0 ? (_reportPossibleCrUseOfGlobeVariable({
            error: Error()
          }), GlobeVariable) : GlobeVariable).entifyName.player;
          // 移动速度
          this.moveSpeed = 18;
          // 旋转平滑系数
          this.rotateSpeed = 14.0;
          this.attack = 1;
          //初始给的金币数量
          this.coinNum = (_crd && GlobeVariable === void 0 ? (_reportPossibleCrUseOfGlobeVariable({
            error: Error()
          }), GlobeVariable) : GlobeVariable).coinStartNum;
          this.backpack = null;
          //碰撞触发事件管理
          this.triggerNode = new (_crd && PlayerTrigger === void 0 ? (_reportPossibleCrUseOfPlayerTrigger({
            error: Error()
          }), PlayerTrigger) : PlayerTrigger)();
          // 新增：保存金币动画的引用，用于取消
          this.coinTween = null;
          this.coinHeightInterval = 0.45;
        }

        subtractCoin(num) {
          this.coinNum -= num;
          (_crd && EventManager === void 0 ? (_reportPossibleCrUseOfEventManager({
            error: Error()
          }), EventManager) : EventManager).instance.emit((_crd && EventType === void 0 ? (_reportPossibleCrUseOfEventType({
            error: Error()
          }), EventType) : EventType).CoinSub, num);
          this.calibrateCoinsPosition();
        }

        onLoad() {
          super.onLoad();
          this.backpack = this.node.getChildByName("backpack");
        } // 新增：节点销毁时停止所有动画


        onDestroy() {
          if (this.coinTween) {
            this.coinTween.stop();
          }
        }

        start() {
          this.triggerNode.initTrigger(this);
        }

        jumpAni() {
          console.log('jumpAni 11111111');
          this.characterSkeletalAnimation.play("Jump");
        }

        continue() {
          this.backpack.children.forEach(item => {
            item.removeFromParent();
            item.destroy();
          });
          this.backpack.removeAllChildren();
          this.coinNum = (_crd && GlobeVariable === void 0 ? (_reportPossibleCrUseOfGlobeVariable({
            error: Error()
          }), GlobeVariable) : GlobeVariable).coinStartNum;

          for (var i = 0; i < (_crd && GlobeVariable === void 0 ? (_reportPossibleCrUseOfGlobeVariable({
            error: Error()
          }), GlobeVariable) : GlobeVariable).coinStartNum; i++) {
            var node = (_crd && App === void 0 ? (_reportPossibleCrUseOfApp({
              error: Error()
            }), App) : App).poolManager.getNode((_crd && GlobeVariable === void 0 ? (_reportPossibleCrUseOfGlobeVariable({
              error: Error()
            }), GlobeVariable) : GlobeVariable).entifyName.Coin);
            node.getComponent(BoxCollider).enabled = false;
            node.getComponent(RigidBody).enabled = false;
            node.parent = this.backpack;
            node.setPosition(v3(0, i * 0.45, 0));
          }
        }

        update(dt) {
          super.update(dt);
          this.collectCoin();
        } //收集金币


        collectCoin() {
          if (!(_crd && GlobeVariable === void 0 ? (_reportPossibleCrUseOfGlobeVariable({
            error: Error()
          }), GlobeVariable) : GlobeVariable).isStartGame) {
            return;
          }

          if ((_crd && App === void 0 ? (_reportPossibleCrUseOfApp({
            error: Error()
          }), App) : App).dropController && (_crd && App === void 0 ? (_reportPossibleCrUseOfApp({
            error: Error()
          }), App) : App).dropController.getAroundDrop) {
            var coin = (_crd && App === void 0 ? (_reportPossibleCrUseOfApp({
              error: Error()
            }), App) : App).dropController.getAroundDrop(this.node.worldPosition);

            if (coin) {
              coin.getComponent(BoxCollider).enabled = false;
              coin.getComponent(RigidBody).enabled = false;
              this.coinFly(coin);
            }
          }
        }
        /** 从金矿收集金币 */


        getGoldMineCoin(coin, pos) {
          if (!coin) return; // 新增空值检查

          coin.parent = (_crd && App === void 0 ? (_reportPossibleCrUseOfApp({
            error: Error()
          }), App) : App).sceneNode.effectParent;
          coin.setWorldPosition(pos);
          this.coinFly(coin);
        }

        coinFly(coin) {
          if (!coin) return; // 新增空值检查

          (_crd && SoundManager === void 0 ? (_reportPossibleCrUseOfSoundManager({
            error: Error()
          }), SoundManager) : SoundManager).Instance.playAudio("jinbi_shiqu");
          var start = coin.getWorldPosition().clone();
          var duration = 0.2;
          var controller = {
            t: 0
          };
          coin.setParent((_crd && App === void 0 ? (_reportPossibleCrUseOfApp({
            error: Error()
          }), App) : App).sceneNode.effectParent);
          coin.setWorldPosition(start);
          var startRot = coin.worldRotation.clone();
          var endRot = this.backpack.worldRotation; // 保存tween引用以便后续取消

          this.coinTween = tween(controller).to(duration, {
            t: 1
          }, {
            easing: 'quadOut',
            onUpdate: () => {
              // 关键修复：检查coin是否存在
              if (!coin || !coin.isValid) return;
              var t = controller.t;
              var oneMinusT = 1 - t;
              var maxY = this.backpack.children.length * 0.45;
              var localTarget = new Vec3(0, maxY, 0);
              var worldPos = this.backpack.getWorldPosition();
              var worldRot = this.backpack.getWorldRotation();
              var worldScale = this.backpack.getWorldScale();
              var worldMat = new Mat4();
              Mat4.fromSRT(worldMat, worldRot, worldPos, worldScale);
              var worldTarget = Vec3.transformMat4(new Vec3(), localTarget, worldMat);
              var control = new Vec3((start.x + worldTarget.x) / 2, Math.max(start.y, worldTarget.y) + 2, (start.z + worldTarget.z) / 2);
              var pos = new Vec3(oneMinusT * oneMinusT * start.x + 2 * oneMinusT * t * control.x + t * t * worldTarget.x, oneMinusT * oneMinusT * start.y + 2 * oneMinusT * t * control.y + t * t * worldTarget.y, oneMinusT * oneMinusT * start.z + 2 * oneMinusT * t * control.z + t * t * worldTarget.z); // 只在coin有效时设置位置

              coin.setWorldPosition(pos);
              var lerpedEuler = new Quat(startRot.x * oneMinusT + endRot.x * t, startRot.y * oneMinusT + endRot.y * t, startRot.z * oneMinusT + endRot.z * t, startRot.w * oneMinusT + endRot.w * t); // 只在coin有效时设置旋转

              coin.setWorldRotation(lerpedEuler);
            }
          }).call(() => {
            // 检查coin是否仍然有效
            if (!coin || !coin.isValid) return;
            var finalWorldPos = coin.getWorldPosition().clone();
            coin.setParent(this.backpack);
            coin.setWorldPosition(finalWorldPos);
            coin.setWorldRotation(endRot);
            tween(coin).to(0.15, {
              scale: new Vec3(8.6, 8.6, 8.6)
            }, {
              easing: 'quadOut'
            }).to(0.05, {
              scale: new Vec3(8, 8, 8)
            }, {
              easing: 'quadOut'
            }).start();
            this.coinNum++;
            (_crd && EventManager === void 0 ? (_reportPossibleCrUseOfEventManager({
              error: Error()
            }), EventManager) : EventManager).instance.emit((_crd && EventType === void 0 ? (_reportPossibleCrUseOfEventType({
              error: Error()
            }), EventType) : EventType).CoinAdd, 1);
            this.calibrateCoinsPosition();
          }).start();
        }

        /**
         * 校准所有金币的位置，解决堆叠断层问题
         * 循环遍历背包中的所有金币，按索引重新设置高度
         */
        calibrateCoinsPosition() {// if (!this.backpack) return;
          // // 获取所有金币子节点
          // const coins = this.backpack.children;
          // // 遍历并重新设置每个金币的高度
          // coins.forEach((coin: Node, index: number) => {
          //     // 保持x和z坐标不变，只调整y坐标
          //     const localPos = coin.getPosition();
          //     const targetY = index * this.coinHeightInterval;
          //     // 如果当前高度与目标高度差距较大，使用动画平滑过渡
          //     if (Math.abs(localPos.y - targetY) > 0.01) {
          //         tween(coin)
          //             .to(0.1, { position: new Vec3(localPos.x, targetY, localPos.z) })
          //             .start();
          //     } else {
          //         // 差距小时直接设置，避免不必要的动画
          //         coin.setPosition(localPos.x, targetY, localPos.z);
          //     }
          // });
        } // private playAttackSound() {
        //     SoundManager.Instance.playAudio("gongji");
        // }
        // private playAttackAni() {
        //     this.attackAni.node.active = true;
        //     this.attackAni.play();
        // }


      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "attackAni", [_dec2], {
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
//# sourceMappingURL=d0cc59175f18d75a2dbddf38d599ccc68f8b65ff.js.map