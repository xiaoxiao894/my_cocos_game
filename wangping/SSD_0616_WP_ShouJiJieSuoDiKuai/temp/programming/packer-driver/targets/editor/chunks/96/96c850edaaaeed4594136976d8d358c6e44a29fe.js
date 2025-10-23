System.register(["__unresolved_0", "cc", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Node, Animation, Camera, Vec3, tween, Global, _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _dec12, _dec13, _dec14, _dec15, _dec16, _dec17, _dec18, _dec19, _dec20, _dec21, _dec22, _dec23, _dec24, _dec25, _dec26, _dec27, _dec28, _dec29, _dec30, _dec31, _dec32, _dec33, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _descriptor11, _descriptor12, _descriptor13, _descriptor14, _descriptor15, _descriptor16, _descriptor17, _descriptor18, _descriptor19, _descriptor20, _descriptor21, _descriptor22, _descriptor23, _descriptor24, _descriptor25, _descriptor26, _descriptor27, _descriptor28, _descriptor29, _descriptor30, _descriptor31, _descriptor32, _crd, ccclass, property, GroundEffct;

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
      Component = _cc.Component;
      Node = _cc.Node;
      Animation = _cc.Animation;
      Camera = _cc.Camera;
      Vec3 = _cc.Vec3;
      tween = _cc.tween;
    }, function (_unresolved_2) {
      Global = _unresolved_2.Global;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "2d89aKBkCZPPpohnU22mehu", "GroundEffct", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Node', 'Animation', 'Camera', 'Vec3', 'tween', 'Tween', 'Quat']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("GroundEffct", GroundEffct = (_dec = ccclass('GroundEffct'), _dec2 = property(Camera), _dec3 = property(Animation), _dec4 = property(Node), _dec5 = property(Node), _dec6 = property(Node), _dec7 = property(Node), _dec8 = property(Node), _dec9 = property(Animation), _dec10 = property(Node), _dec11 = property(Node), _dec12 = property(Node), _dec13 = property(Node), _dec14 = property(Animation), _dec15 = property(Node), _dec16 = property(Node), _dec17 = property(Node), _dec18 = property(Node), _dec19 = property(Node), _dec20 = property(Node), _dec21 = property(Node), _dec22 = property(Node), _dec23 = property(Node), _dec24 = property(Node), _dec25 = property(Node), _dec26 = property(Node), _dec27 = property(Node), _dec28 = property(Node), _dec29 = property(Node), _dec30 = property(Node), _dec31 = property({
        type: Vec3,
        tooltip: '相机位置'
      }), _dec32 = property({
        type: Vec3,
        tooltip: '相机旋转'
      }), _dec33 = property({
        type: Number,
        tooltip: '相机高度'
      }), _dec(_class = (_class2 = class GroundEffct extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "mainCamera", _descriptor, this);

          _initializerDefineProperty(this, "groundAnimation", _descriptor2, this);

          // 每一个大地
          _initializerDefineProperty(this, "ground1", _descriptor3, this);

          _initializerDefineProperty(this, "ground2", _descriptor4, this);

          _initializerDefineProperty(this, "ground3", _descriptor5, this);

          _initializerDefineProperty(this, "ground4", _descriptor6, this);

          _initializerDefineProperty(this, "ground4UI", _descriptor7, this);

          _initializerDefineProperty(this, "treeAnimation", _descriptor8, this);

          // 每一个大地快上的树
          _initializerDefineProperty(this, "tree1", _descriptor9, this);

          _initializerDefineProperty(this, "tree2", _descriptor10, this);

          _initializerDefineProperty(this, "tree3", _descriptor11, this);

          _initializerDefineProperty(this, "tree4", _descriptor12, this);

          _initializerDefineProperty(this, "groundObjectAnmation", _descriptor13, this);

          // 每一个大地快上的物体
          _initializerDefineProperty(this, "groundObject1", _descriptor14, this);

          _initializerDefineProperty(this, "groundObject2", _descriptor15, this);

          _initializerDefineProperty(this, "groundObject3", _descriptor16, this);

          _initializerDefineProperty(this, "groundObject4", _descriptor17, this);

          //玉米地块 每一个小地块
          _initializerDefineProperty(this, "groundObject2_1", _descriptor18, this);

          _initializerDefineProperty(this, "groundObject2_2", _descriptor19, this);

          _initializerDefineProperty(this, "groundObject2_3", _descriptor20, this);

          _initializerDefineProperty(this, "groundObject2_4", _descriptor21, this);

          _initializerDefineProperty(this, "ArrowgroundObject2_1", _descriptor22, this);

          _initializerDefineProperty(this, "ArrowgroundObject2_2", _descriptor23, this);

          _initializerDefineProperty(this, "ArrowgroundObject2_3", _descriptor24, this);

          _initializerDefineProperty(this, "ArrowgroundObject2_4", _descriptor25, this);

          _initializerDefineProperty(this, "arrowGuid", _descriptor26, this);

          _initializerDefineProperty(this, "upgradeNode", _descriptor27, this);

          /////////////////////////////////以上关于相机地块的变量
          _initializerDefineProperty(this, "treeLandHouse", _descriptor28, this);

          _initializerDefineProperty(this, "enemyLandHouse", _descriptor29, this);

          //最后显示的相机位置
          _initializerDefineProperty(this, "cameraPosition1", _descriptor30, this);

          _initializerDefineProperty(this, "cameraRotation", _descriptor31, this);

          _initializerDefineProperty(this, "cameraHigeht", _descriptor32, this);
        }

        onLoad() {
          this.tree3.active = false; // this.scheduleOnce(() => {
          //     this.treeAnimation.play("shuCS - 02");
          //     const state = this.treeAnimation.getState("shuCS - 02");
          //     if (state) {
          //         state.time = 0;       // 设置动画时间到0秒
          //         state.sample();       // 采样当前时间帧，更新动画到第一帧
          //         this.treeAnimation.pause(); // 暂停动画，保持在第一帧
          //     }
          // }, 0.1)
        }

        ///////////////////关于地块相机移动//////////////////////
        passAnimation1() {
          this.ground2.active = true;
          this.groundAnimation.play("dikuaiCS");
          (_crd && Global === void 0 ? (_reportPossibleCrUseOfGlobal({
            error: Error()
          }), Global) : Global).soundManager.playAnimationSound();
          this.groundAnimation.once(Animation.EventType.FINISHED, () => {
            this.tree2.active = true;
            this.groundObject2.active = true; //  this.treeAnimation.play("shuCS")

            this.groundObjectAnmation.play("shuCS");
          });
          const targetPosition = new Vec3(8, 22, 32.7);
          const targetPosition1 = new Vec3(14.8, 19, 32.3);
          const targetPosition2 = new Vec3(0, 21.8, 32.3);
          console.log("(this.mainCamera.node =====" + this.mainCamera.node);
          tween(this.mainCamera.node).to(0.8, {
            position: targetPosition
          }).call(() => {
            tween(this.mainCamera.node).to(0.8, {
              position: targetPosition1
            }).call(() => {
              tween(this.mainCamera.node).delay(0.5).to(0.8, {
                position: targetPosition2
              }).call(() => {}).start();
            }).start();
          }).start();
        }

        passAnimation11() {
          const targetPosition = new Vec3(8, 22, 32.7);
          const targetPosition1 = new Vec3(13.8, 19, 43.1);
          tween(this.mainCamera.node).to(0.8, {
            position: targetPosition
          }).call(() => {
            tween(this.mainCamera.node).to(0.8, {
              position: targetPosition1
            }).call(() => {
              (_crd && Global === void 0 ? (_reportPossibleCrUseOfGlobal({
                error: Error()
              }), Global) : Global).isMoveCamreToCorn = false;
            }).start();
          }).start();
        }

        passAnimation2() {
          (_crd && Global === void 0 ? (_reportPossibleCrUseOfGlobal({
            error: Error()
          }), Global) : Global).soundManager.playAnimationSound();
          const targetPosition = new Vec3(13.927, 33.377, 16.287);
          const targetPosition1 = new Vec3(31.3, 47.4, 58.5);
          const targetPosition2 = new Vec3(40.64, 47.385, 58.454);
          const targetPosition3 = new Vec3(15, 15, 37.1);
          this.ground3.active = true;
          this.groundAnimation.play("dikuaiCS - 01");
          this.groundAnimation.once(Animation.EventType.FINISHED, () => {
            this.tree3.active = true;
            this.enemyLandHouse.active = true;
            this.groundObject3.active = true;
            this.tree3.active = true;
            this.treeAnimation.play("shuCS - 02");
            this.groundObjectAnmation.play("shuCS - 02");
          });
          tween(this.mainCamera.node) // .to(0.8, { position: targetPosition })
          // .call(() => {
          //     // 第一个动画完成回调
          // })
          .to(1.2, {
            position: targetPosition1
          }).call(() => {// 第二个动画完成回调
          }).delay(0.5) // .to(0.8, { position: targetPosition2 })
          // .call(() => {
          // })
          .to(1, {
            position: targetPosition3
          }).call(() => {
            // 第二个动画完成回调
            this.scheduleOnce(() => {
              this.arrowGuid.active = true;
            }, 0.5);
          }).start();
        }

        passAnimation21() {
          const targetPosition2 = new Vec3(28, 28.4, 42.8);
          tween(this.mainCamera.node).to(1, {
            position: targetPosition2
          }).call(() => {
            // 第二个动画完成回调
            this.arrowGuid.active = false;
          }).start();
        }

        passAnimation3() {
          (_crd && Global === void 0 ? (_reportPossibleCrUseOfGlobal({
            error: Error()
          }), Global) : Global).soundManager.playAnimationSound(); //const targetPosition = new Vec3(19.511, 82.498, 106.064);

          const targetPosition = this.cameraPosition1; // new Vec3(20, 100, 75);
          //const targetRotation = new Vec3(-55, 0, 0);
          //this.mainCamera.node.setRotationFromEuler(this.cameraRotation);//-55, 0, 0);
          // this.mainCamera.orthoHeight = this.cameraHigeht

          let tree = this.tree3.getChildByName("DK-102");
          tree.children.forEach(child => {
            if (child.getChildByName("UI_famuzhiyin")) {
              let n = child.getChildByName("UI_famuzhiyin"); // 获取当前节点的缩放值

              const currentScale = n.scale.clone(); // 计算放大 1.2 倍后的缩放值

              const targetScale = currentScale.multiplyScalar(1.53);
              tween(n).to(1.7, {
                scale: targetScale
              }).start();
            }
          });
          tween(this.mainCamera).to(0.5, {
            orthoHeight: this.cameraHigeht
          }).start();
          tween(this.mainCamera.node) // .parallel(
          //     tween().to(0.5, { position: targetPosition }),
          //     tween().to(0.5, { eulerAngles: targetRotation })
          // )
          .to(0.5, {
            position: targetPosition
          }).call(() => {
            // 第一个动画完成回调
            this.ground4.active = true;
            this.tree4.active = true;
            this.groundAnimation.play("dikuaiCS - 02");
            this.treeAnimation.play("shuCS - 03");
            this.groundObjectAnmation.play("shuCS - 03");
            this.scheduleOnce(() => {
              this.groundObject4.active = true;
              this.ground4UI.active = true;
            }, 1);
          }).start();
        }

        showAllTreeClick() {
          for (let i = 0; i < 3; i++) {
            let tree = this.tree3.getChildByName("DK-10" + (i + 1));
            tree.children.forEach(child => {
              if (child.getChildByName("UI_famuzhiyin")) {// child.getChildByName("UI_famuzhiyin").active = true;
              }
            });
          } //let parentNode = this.tree3.getChildByName

        } //////////////////////////////////////////////相机镜头以外的操作


        upgradeTreeHouseAnimation(callback) {
          if ((_crd && Global === void 0 ? (_reportPossibleCrUseOfGlobal({
            error: Error()
          }), Global) : Global).isPlayHouseAnimation) {
            return;
          }

          (_crd && Global === void 0 ? (_reportPossibleCrUseOfGlobal({
            error: Error()
          }), Global) : Global).isPlayHouseAnimation = false;
          (_crd && Global === void 0 ? (_reportPossibleCrUseOfGlobal({
            error: Error()
          }), Global) : Global).soundManager.playUpSound();
          let house1 = this.treeLandHouse.getChildByName("shengjiqian");
          let house2 = this.treeLandHouse.getChildByName("shengjihou");
          let particle = this.treeLandHouse.getChildByName("TX_shengjiLZ");
          house1.active = false;
          house2.active = true;
          particle.active = true;
          const treeLandHouseAnim = this.treeLandHouse.getComponent(Animation);
          const particleAnim = particle.getComponent(Animation); // const treeLandHouseAnim = this.treeLandHouse.getComponent(Animation);
          // 检查特定动画状态（假设动画剪辑名为"upgrade_anim"）

          const animState = treeLandHouseAnim.getState("shengji_fangzi");

          if (animState && animState.isPlaying) {
            return;
          } // 创建两个 Promise，分别在动画完成时 resolve


          const p1 = new Promise(resolve => {
            treeLandHouseAnim.play();
            treeLandHouseAnim.once(Animation.EventType.FINISHED, () => {
              resolve();
            });
          });
          const p2 = new Promise(resolve => {
            particleAnim.play();
            particleAnim.once(Animation.EventType.FINISHED, () => {
              resolve();
            });
          }); // 两个动画都完成后调用回调

          Promise.all([p1, p2]).then(() => {
            callback();
          });
        }

        upgradeEnemyHouseAnimation(callback) {
          (_crd && Global === void 0 ? (_reportPossibleCrUseOfGlobal({
            error: Error()
          }), Global) : Global).soundManager.playUpSound();
          let house1 = this.enemyLandHouse.getChildByName("shengjiqian");
          let house2 = this.enemyLandHouse.getChildByName("shengjihou");
          let particle = this.enemyLandHouse.getChildByName("TX_shengjiLZ");
          house1.active = false;
          house2.active = true;
          particle.active = true;
          const treeLandHouseAnim = this.enemyLandHouse.getComponent(Animation);
          const particleAnim = particle.getComponent(Animation); // 创建两个 Promise，分别在动画完成时 resolve

          const p1 = new Promise(resolve => {
            treeLandHouseAnim.play();
            treeLandHouseAnim.once(Animation.EventType.FINISHED, () => {
              resolve();
            });
          });
          const p2 = new Promise(resolve => {
            particleAnim.play();
            particleAnim.once(Animation.EventType.FINISHED, () => {
              resolve();
            });
          }); // 两个动画都完成后调用回调

          Promise.all([p1, p2]).then(() => {
            callback();
          });
        }

        hideCornArrow() {
          this.ArrowgroundObject2_1.active = false;
          this.ArrowgroundObject2_2.active = false;
          this.ArrowgroundObject2_3.active = false;
          this.ArrowgroundObject2_4.active = false;
        }

        upgradeAnimation() {
          const anim = this.upgradeNode.getComponent(Animation);

          if ((_crd && Global === void 0 ? (_reportPossibleCrUseOfGlobal({
            error: Error()
          }), Global) : Global).playerBodyWood > 0 && (_crd && Global === void 0 ? (_reportPossibleCrUseOfGlobal({
            error: Error()
          }), Global) : Global).upgradeUIAnimtion == 1) {
            (_crd && Global === void 0 ? (_reportPossibleCrUseOfGlobal({
              error: Error()
            }), Global) : Global).upgradeUIAnimtion = 2;
            const animState = anim.getState('SJZY');

            if (!animState || animState.isPlaying) {
              return;
            }

            anim.play('SJZY');
          } // else if (Global.playerBodyWood >= Global.treeHandOverNumLimit && Global.upgradeUIAnimtion == 2) {
          //     Global.upgradeUIAnimtion = 0;
          //     const animState = anim.getState('WoodTDAni');
          //     if (!animState || animState.isPlaying) {
          //         return;
          //     }
          //     anim.play('WoodTDAni');
          // }

        } // start() {
        // }
        // update(deltaTime: number) {
        // }


      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "mainCamera", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "groundAnimation", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "ground1", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "ground2", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "ground3", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "ground4", [_dec7], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "ground4UI", [_dec8], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "treeAnimation", [_dec9], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, "tree1", [_dec10], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor10 = _applyDecoratedDescriptor(_class2.prototype, "tree2", [_dec11], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor11 = _applyDecoratedDescriptor(_class2.prototype, "tree3", [_dec12], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor12 = _applyDecoratedDescriptor(_class2.prototype, "tree4", [_dec13], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor13 = _applyDecoratedDescriptor(_class2.prototype, "groundObjectAnmation", [_dec14], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor14 = _applyDecoratedDescriptor(_class2.prototype, "groundObject1", [_dec15], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor15 = _applyDecoratedDescriptor(_class2.prototype, "groundObject2", [_dec16], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor16 = _applyDecoratedDescriptor(_class2.prototype, "groundObject3", [_dec17], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor17 = _applyDecoratedDescriptor(_class2.prototype, "groundObject4", [_dec18], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor18 = _applyDecoratedDescriptor(_class2.prototype, "groundObject2_1", [_dec19], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor19 = _applyDecoratedDescriptor(_class2.prototype, "groundObject2_2", [_dec20], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor20 = _applyDecoratedDescriptor(_class2.prototype, "groundObject2_3", [_dec21], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor21 = _applyDecoratedDescriptor(_class2.prototype, "groundObject2_4", [_dec22], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor22 = _applyDecoratedDescriptor(_class2.prototype, "ArrowgroundObject2_1", [_dec23], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor23 = _applyDecoratedDescriptor(_class2.prototype, "ArrowgroundObject2_2", [_dec24], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor24 = _applyDecoratedDescriptor(_class2.prototype, "ArrowgroundObject2_3", [_dec25], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor25 = _applyDecoratedDescriptor(_class2.prototype, "ArrowgroundObject2_4", [_dec26], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor26 = _applyDecoratedDescriptor(_class2.prototype, "arrowGuid", [_dec27], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor27 = _applyDecoratedDescriptor(_class2.prototype, "upgradeNode", [_dec28], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor28 = _applyDecoratedDescriptor(_class2.prototype, "treeLandHouse", [_dec29], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor29 = _applyDecoratedDescriptor(_class2.prototype, "enemyLandHouse", [_dec30], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor30 = _applyDecoratedDescriptor(_class2.prototype, "cameraPosition1", [_dec31], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return new Vec3(20, 100, 75);
        }
      }), _descriptor31 = _applyDecoratedDescriptor(_class2.prototype, "cameraRotation", [_dec32], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return new Vec3(-55, 0, 0);
        }
      }), _descriptor32 = _applyDecoratedDescriptor(_class2.prototype, "cameraHigeht", [_dec33], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 25;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=96c850edaaaeed4594136976d8d358c6e44a29fe.js.map