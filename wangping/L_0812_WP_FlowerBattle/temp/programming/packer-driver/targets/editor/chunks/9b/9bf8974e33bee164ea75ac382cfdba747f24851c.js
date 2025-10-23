System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3", "__unresolved_4", "__unresolved_5", "__unresolved_6"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Animation, SkeletalAnimation, ParticleSystem, Camera, Material, SkinnedMeshRenderer, tween, Vec3, Node, RigidBody, Collider, BooldPaling, App, GlobeVariable, GameEndManager, CameraMain, Player, _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _dec12, _dec13, _dec14, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _descriptor11, _descriptor12, _descriptor13, _crd, ccclass, property, Flower;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfBooldPaling(extras) {
    _reporterNs.report("BooldPaling", "../BooldPaling", _context.meta, extras);
  }

  function _reportPossibleCrUseOfApp(extras) {
    _reporterNs.report("App", "../App", _context.meta, extras);
  }

  function _reportPossibleCrUseOfGlobeVariable(extras) {
    _reporterNs.report("GlobeVariable", "../core/GlobeVariable", _context.meta, extras);
  }

  function _reportPossibleCrUseOfGameEndManager(extras) {
    _reporterNs.report("GameEndManager", "../UI/GameEndManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfCameraMain(extras) {
    _reporterNs.report("CameraMain", "../core/CameraMain", _context.meta, extras);
  }

  function _reportPossibleCrUseOfPlayer(extras) {
    _reporterNs.report("Player", "./Player", _context.meta, extras);
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
      Animation = _cc.Animation;
      SkeletalAnimation = _cc.SkeletalAnimation;
      ParticleSystem = _cc.ParticleSystem;
      Camera = _cc.Camera;
      Material = _cc.Material;
      SkinnedMeshRenderer = _cc.SkinnedMeshRenderer;
      tween = _cc.tween;
      Vec3 = _cc.Vec3;
      Node = _cc.Node;
      RigidBody = _cc.RigidBody;
      Collider = _cc.Collider;
    }, function (_unresolved_2) {
      BooldPaling = _unresolved_2.BooldPaling;
    }, function (_unresolved_3) {
      App = _unresolved_3.App;
    }, function (_unresolved_4) {
      GlobeVariable = _unresolved_4.GlobeVariable;
    }, function (_unresolved_5) {
      GameEndManager = _unresolved_5.GameEndManager;
    }, function (_unresolved_6) {
      CameraMain = _unresolved_6.CameraMain;
    }, function (_unresolved_7) {
      Player = _unresolved_7.Player;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "c9656X+5gRNcbp58beXBttu", "Flower", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Animation', 'SkeletalAnimation', 'ParticleSystem', 'Camera', 'Material', 'SkinnedMeshRenderer', 'tween', 'Vec3', 'Node', 'RigidBody', 'CapsuleCollider', 'Collider']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("Flower", Flower = (_dec = ccclass('Flower'), _dec2 = property({
        type: _crd && BooldPaling === void 0 ? (_reportPossibleCrUseOfBooldPaling({
          error: Error()
        }), BooldPaling) : BooldPaling,
        tooltip: "血条"
      }), _dec3 = property({
        type: SkeletalAnimation,
        tooltip: "动画"
      }), _dec4 = property({
        type: ParticleSystem,
        tooltip: "动画"
      }), _dec5 = property({
        type: Animation,
        tooltip: "动画"
      }), _dec6 = property({
        type: Animation,
        tooltip: "动画"
      }), _dec7 = property({
        type: Node,
        tooltip: "joysticNode"
      }), _dec8 = property({
        type: Camera,
        tooltip: "动画"
      }), _dec9 = property(Material), _dec10 = property(Material), _dec11 = property(Material), _dec12 = property(Material), _dec13 = property(SkinnedMeshRenderer), _dec14 = property({
        type: Animation,
        tooltip: "受击缩放动画"
      }), _dec(_class = (_class2 = class Flower extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "booldPaling", _descriptor, this);

          _initializerDefineProperty(this, "flowerAni", _descriptor2, this);

          _initializerDefineProperty(this, "hitParticle", _descriptor3, this);

          _initializerDefineProperty(this, "hitAni", _descriptor4, this);

          _initializerDefineProperty(this, "birthAni", _descriptor5, this);

          _initializerDefineProperty(this, "joysticNode", _descriptor6, this);

          _initializerDefineProperty(this, "mainCamera", _descriptor7, this);

          _initializerDefineProperty(this, "material0", _descriptor8, this);

          _initializerDefineProperty(this, "material1", _descriptor9, this);

          _initializerDefineProperty(this, "material2", _descriptor10, this);

          _initializerDefineProperty(this, "materialWhite", _descriptor11, this);

          _initializerDefineProperty(this, "flowerMesh", _descriptor12, this);

          _initializerDefineProperty(this, "hitAniScal", _descriptor13, this);

          this.hp = 1000;
          this.isDie = false;
          this.isPlayer = false;
        }

        start() {
          this.init();
        }

        onEnable() {// this.init();
        }

        init() {
          this.hp = this.booldPaling.getBloodHpMax();
          this.scheduleOnce(() => {
            this.flowerAni.play("Chushi_MeiGuiHua");
            if (this.isPlayer) return;
            this.isPlayer = true;
            this.birthAni.play("kaichangAni");
            console.log('kaichangAni  kaichangAni ');
            this.flowerAni.once(Animation.EventType.FINISHED, () => {
              this.flowerAni.play("Chushi_MeiGuiHua_reverse");
              this.flowerAni.once(Animation.EventType.FINISHED, () => {
                this.flowerAni.play("Idel_MeiGuiHua");
                (_crd && App === void 0 ? (_reportPossibleCrUseOfApp({
                  error: Error()
                }), App) : App).sceneNode.player.getComponent(RigidBody).enabled = true;
                (_crd && App === void 0 ? (_reportPossibleCrUseOfApp({
                  error: Error()
                }), App) : App).sceneNode.player.getComponent(Collider).enabled = true;
              }, this);
            }, this);
            this.birthAni.once(Animation.EventType.FINISHED, () => {
              this.cameraMove();
            }, this);
          }, 1); // this.hitAni.play("hua");
        }

        IdleEvent() {
          (_crd && App === void 0 ? (_reportPossibleCrUseOfApp({
            error: Error()
          }), App) : App).sceneNode.player.getComponent(_crd && Player === void 0 ? (_reportPossibleCrUseOfPlayer({
            error: Error()
          }), Player) : Player).jumpAni();
        }

        cameraMove() {
          tween(this.mainCamera.node).to(0.5, {
            worldPosition: new Vec3(106.5, 111, 77.5)
          }).call(() => {
            this.mainCamera.getComponent(_crd && CameraMain === void 0 ? (_reportPossibleCrUseOfCameraMain({
              error: Error()
            }), CameraMain) : CameraMain).init();
            (_crd && GlobeVariable === void 0 ? (_reportPossibleCrUseOfGlobeVariable({
              error: Error()
            }), GlobeVariable) : GlobeVariable).isCameraMoveEnd = true;
            this.joysticNode.active = true;
          }).start();
        }

        continueGame() {
          (_crd && GlobeVariable === void 0 ? (_reportPossibleCrUseOfGlobeVariable({
            error: Error()
          }), GlobeVariable) : GlobeVariable).isCameraMoveEnd = false;
          (_crd && GlobeVariable === void 0 ? (_reportPossibleCrUseOfGlobeVariable({
            error: Error()
          }), GlobeVariable) : GlobeVariable).isIdel = false;
          (_crd && App === void 0 ? (_reportPossibleCrUseOfApp({
            error: Error()
          }), App) : App).playerController.initPlayer(); //this.scheduleOnce(() => {

          this.flowerAni.play("Chushi_MeiGuiHua"); //  App.playerController.initPlayer();

          this.birthAni.play("kaichangAni");
          this.flowerAni.once(Animation.EventType.FINISHED, () => {
            this.flowerAni.play("Chushi_MeiGuiHua_reverse");
            this.flowerAni.once(Animation.EventType.FINISHED, () => {
              this.flowerAni.play("Idel_MeiGuiHua"); //  this.cameraMove();
            }, this);
          }, this);
          this.birthAni.once(Animation.EventType.FINISHED, () => {
            this.cameraMove();
          }, this);
          this.isDie = false;
          this.booldPaling.continueGame();
          this.hp = this.booldPaling.getBloodHpMax(); //  }, 0.5)
          //  this.flowerAni.play("Idel_MeiGuiHua");
        }

        hit(attack) {
          this.booldPaling.subscribeBool(attack);
          let flowerTx = (_crd && App === void 0 ? (_reportPossibleCrUseOfApp({
            error: Error()
          }), App) : App).poolManager.getNode((_crd && GlobeVariable === void 0 ? (_reportPossibleCrUseOfGlobeVariable({
            error: Error()
          }), GlobeVariable) : GlobeVariable).entifyName.FlowerTx);
          flowerTx.parent = this.hitParticle.node.parent;
          flowerTx.setPosition(this.hitParticle.node.position);
          flowerTx.active = true;
          let particle = flowerTx.getComponent(ParticleSystem);
          if (particle) particle.play();
          this.scheduleOnce(() => {
            if (particle) {
              // 1. 停止粒子播放
              particle.stop(); // 3. 可选：手动清除所有粒子（根据引擎特性）

              particle.clear();
              flowerTx.active = false;
              flowerTx.removeFromParent();
              (_crd && App === void 0 ? (_reportPossibleCrUseOfApp({
                error: Error()
              }), App) : App).poolManager.returnNode(flowerTx, (_crd && GlobeVariable === void 0 ? (_reportPossibleCrUseOfGlobeVariable({
                error: Error()
              }), GlobeVariable) : GlobeVariable).entifyName.FlowerTx);
            }
          }, 1.5);
          this.hitAniScal.play("HitAni");
          this.flowerMesh.materials = [this.materialWhite, this.materialWhite, this.materialWhite];
          this.scheduleOnce(() => {
            this.flowerMesh.materials = [this.material0, this.material1, this.material2];
          }, 0.1); // if (this.booldPaling.getBloodHp() > this.hp / 2) {
          //     this.flowerAni.getState("Idel_MeiGuiHua").speed = 2;
          //     this.scheduleOnce(() => {
          //         this.flowerAni.getState("Idel_MeiGuiHua").speed = 1;
          //     }, 0.5)
          // }

          if (this.flowerAni.getState("Idel_MeiGuiHua").isPlaying) {
            this.flowerAni.getState("Idel_MeiGuiHua").speed = 2;
            this.scheduleOnce(() => {
              this.flowerAni.getState("Idel_MeiGuiHua").speed = 1;
            }, 0.5);
          } else if (this.flowerAni.getState("Idel_DieAway_MeiGuiHua").isPlaying) {
            this.flowerAni.getState("Idel_DieAway_MeiGuiHua").speed = 3;
            this.scheduleOnce(() => {
              this.flowerAni.getState("Idel_DieAway_MeiGuiHua").speed = 1;
            }, 0.5);
          }

          if (this.booldPaling.getBloodHp() == this.hp / 2) {
            this.flowerAni.play("DieAway_MeiGuiHua");
            this.scheduleOnce(() => {
              this.flowerAni.play("Idel_DieAway_MeiGuiHua");
            }, 1.5);
          } else if (this.booldPaling.getBloodHp() <= 0 && !this.isDie) {
            this.isDie = true;
            this.flowerAni.play("Die_MeiGuiHua");
            this.flowerAni.once(Animation.EventType.FINISHED, () => {
              (_crd && App === void 0 ? (_reportPossibleCrUseOfApp({
                error: Error()
              }), App) : App).sceneNode.GameEnd.active = true;
              (_crd && App === void 0 ? (_reportPossibleCrUseOfApp({
                error: Error()
              }), App) : App).sceneNode.GameEnd.getComponent(_crd && GameEndManager === void 0 ? (_reportPossibleCrUseOfGameEndManager({
                error: Error()
              }), GameEndManager) : GameEndManager).showGameEnd(0);
              (_crd && GlobeVariable === void 0 ? (_reportPossibleCrUseOfGlobeVariable({
                error: Error()
              }), GlobeVariable) : GlobeVariable).isGameEnd = true;
            }, this);
          }
        }

        update(deltaTime) {}

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "booldPaling", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "flowerAni", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "hitParticle", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "hitAni", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "birthAni", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "joysticNode", [_dec7], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "mainCamera", [_dec8], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "material0", [_dec9], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, "material1", [_dec10], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor10 = _applyDecoratedDescriptor(_class2.prototype, "material2", [_dec11], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor11 = _applyDecoratedDescriptor(_class2.prototype, "materialWhite", [_dec12], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor12 = _applyDecoratedDescriptor(_class2.prototype, "flowerMesh", [_dec13], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor13 = _applyDecoratedDescriptor(_class2.prototype, "hitAniScal", [_dec14], {
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
//# sourceMappingURL=9bf8974e33bee164ea75ac382cfdba747f24851c.js.map