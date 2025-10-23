System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Label, Node, Sprite, tween, Vec3, Animation, EventManager, EventName, DataManager, _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _dec12, _dec13, _dec14, _dec15, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _descriptor11, _descriptor12, _descriptor13, _descriptor14, _crd, ccclass, property, TowerComponent;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfEventManager(extras) {
    _reporterNs.report("EventManager", "../Global/EventManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfEventName(extras) {
    _reporterNs.report("EventName", "../Common/Enum", _context.meta, extras);
  }

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
      Component = _cc.Component;
      Label = _cc.Label;
      Node = _cc.Node;
      Sprite = _cc.Sprite;
      tween = _cc.tween;
      Vec3 = _cc.Vec3;
      Animation = _cc.Animation;
    }, function (_unresolved_2) {
      EventManager = _unresolved_2.EventManager;
    }, function (_unresolved_3) {
      EventName = _unresolved_3.EventName;
    }, function (_unresolved_4) {
      DataManager = _unresolved_4.DataManager;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "caae2rkZ2REN5OYwvt7u5vW", "TowerComponent", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Label', 'Node', 'Sprite', 'tween', 'Vec3', 'Animation', 'Tween', 'Quat']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("TowerComponent", TowerComponent = (_dec = ccclass('TowerComponent'), _dec2 = property(Node), _dec3 = property(Sprite), _dec4 = property(Label), _dec5 = property(Label), _dec6 = property(Node), _dec7 = property(Node), _dec8 = property(Animation), _dec9 = property(Animation), _dec10 = property(Animation), _dec11 = property(Node), _dec12 = property(Node), _dec13 = property(Node), _dec14 = property(Node), _dec15 = property(Node), _dec(_class = (_class2 = class TowerComponent extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "upGradeBtn", _descriptor, this);

          _initializerDefineProperty(this, "progressBar", _descriptor2, this);

          _initializerDefineProperty(this, "progressLabel", _descriptor3, this);

          _initializerDefineProperty(this, "progressLabelaMax", _descriptor4, this);

          _initializerDefineProperty(this, "coinFlyEndNode", _descriptor5, this);

          _initializerDefineProperty(this, "upgradeEffectNode", _descriptor6, this);

          //塔升级效果
          _initializerDefineProperty(this, "EffectNode", _descriptor7, this);

          //未升级效果
          _initializerDefineProperty(this, "mapAnimation", _descriptor8, this);

          //升级动画
          _initializerDefineProperty(this, "mapParticleAnimation", _descriptor9, this);

          //升级动画
          _initializerDefineProperty(this, "hand_sprite", _descriptor10, this);

          _initializerDefineProperty(this, "endNode", _descriptor11, this);

          _initializerDefineProperty(this, "endNode1", _descriptor12, this);

          _initializerDefineProperty(this, "upgradeNode", _descriptor13, this);

          _initializerDefineProperty(this, "ropeParent", _descriptor14, this);

          this.animationTime = 0.5;
          this.upgradeAnimationType = 1;
          // 1 缩放 2 左右旋转抖动 3 
          this.upgradeTween = null;
          this._rotationProgress = 0;
          this._rotateSpeed = 90;
          // 每秒旋转角度
          this._nowNum = 0;
          this._updateNum = false;
          this._delayTime = 0.5;
          this._timeCount = 0;
          this.isOkUp = false;
          this.addTime = 0;
        }

        onEnable() {
          (_crd && EventManager === void 0 ? (_reportPossibleCrUseOfEventManager({
            error: Error()
          }), EventManager) : EventManager).inst.on((_crd && EventName === void 0 ? (_reportPossibleCrUseOfEventName({
            error: Error()
          }), EventName) : EventName).GiveTowerCoin, this.onGiveTowerCoin, this);
          (_crd && EventManager === void 0 ? (_reportPossibleCrUseOfEventManager({
            error: Error()
          }), EventManager) : EventManager).inst.on((_crd && EventName === void 0 ? (_reportPossibleCrUseOfEventName({
            error: Error()
          }), EventName) : EventName).TowerUpgradeButtonShow, this.showProgress, this);
          (_crd && EventManager === void 0 ? (_reportPossibleCrUseOfEventManager({
            error: Error()
          }), EventManager) : EventManager).inst.on((_crd && EventName === void 0 ? (_reportPossibleCrUseOfEventName({
            error: Error()
          }), EventName) : EventName).coinNumUpLimit, this.coinNumUpLimitCallBack, this);
        }

        coinNumUpLimitCallBack() {
          if (this.isOkUp) return;
          this.isOkUp = true;
          this.hand_sprite.active = true;
          this.hand_sprite.getComponent(Animation).play(); // this.upgradeAnimationType = 2;

          (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.upgradeAnimationType = 2;

          if ((_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.upgradeTween) {
            (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
              error: Error()
            }), DataManager) : DataManager).Instance.upgradeTween.stop(); // 停止动画

            (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
              error: Error()
            }), DataManager) : DataManager).Instance.upgradeTween = null; // 释放引用，方便GC回收
          } // this.scheduleOnce(() => {
          // }, 0.2)
          // tween(this.hand_sprite)
          //     .repeatForever(
          //         tween()
          //             .to(0.3, { position: new Vec3(-1.953, 21.117, 4.964) })  // 修改 pos 为 position
          //             .to(0.3, { position: new Vec3(-1.953, 21.117, 3.964) })  // 修改 pos 为 position
          //             .to(0.3, { scale: new Vec3(0.01, 0.01, 0.01) })
          //             .to(0.3, { scale: new Vec3(0.012, 0.012, 0.012) })
          //     )
          //     .start();


          if ((_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.upgradeAnimationType == 2) {
            (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
              error: Error()
            }), DataManager) : DataManager).Instance.upgradeTween = tween(this.upgradeNode).to(0.25, {
              eulerAngles: new Vec3(0, 15, 0)
            }, {
              easing: "linear"
            }) // 绕Y轴向右旋转15度
            .to(0.5, {
              eulerAngles: new Vec3(0, -15, 0)
            }, {
              easing: "linear"
            }) // 绕Y轴向左旋转15度
            .to(0.25, {
              eulerAngles: new Vec3(0, 0, 0)
            }, {
              easing: "linear"
            }) // 回到初始角度
            .union().repeatForever().start();
          } // let rotateAxis: Vec3 = new Vec3(0, 1, 0); // 默认绕Y轴旋转
          // let _rotationProgress: number = 0; // 当前旋转角度（度）
          // // 创建旋转四元数
          // const rotationQuat = new Quat();
          // Quat.fromEuler(rotationQuat,
          //     rotateAxis.x * _rotationProgress,
          //     rotateAxis.y * _rotationProgress,
          //     rotateAxis.z * _rotationProgress
          // );
          // // 应用旋转
          // this.node.setRotation(rotationQuat);

        }

        onDisable() {
          (_crd && EventManager === void 0 ? (_reportPossibleCrUseOfEventManager({
            error: Error()
          }), EventManager) : EventManager).inst.on((_crd && EventName === void 0 ? (_reportPossibleCrUseOfEventName({
            error: Error()
          }), EventName) : EventName).GiveTowerCoin, this.onGiveTowerCoin, this);
          (_crd && EventManager === void 0 ? (_reportPossibleCrUseOfEventManager({
            error: Error()
          }), EventManager) : EventManager).inst.off((_crd && EventName === void 0 ? (_reportPossibleCrUseOfEventName({
            error: Error()
          }), EventName) : EventName).TowerUpgradeButtonShow, this.showProgress, this);
        }

        start() {
          (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.upgradeNode = this.upgradeNode;
          this.hand_sprite.active = false;

          if ((_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.upgradeAnimationType == 1) {
            (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
              error: Error()
            }), DataManager) : DataManager).Instance.upgradeTween = tween(this.upgradeNode).to(this.animationTime, {
              scale: new Vec3(1.1, 1.1, 1.1)
            }, {
              easing: "quadOut"
            }).to(this.animationTime, {
              scale: new Vec3(1, 1, 1)
            }, {
              easing: "quadIn"
            }).union().repeatForever().start();
          }

          this.updateProgress(); //this.upGradeBtn.active = false;

          (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.coinEndNode = this.coinFlyEndNode;
        }

        update(deltaTime) {
          // if (this.upgradeAnimationType == 2) {
          //     // 累加旋转角度
          //     this._rotationProgress += this._rotateSpeed * deltaTime;
          //     if (this._rotationProgress >= 360) {
          //         this._rotationProgress -= 360;
          //     }
          //     let rotateAxis: Vec3 = new Vec3(1, 0, 1); // 默认绕Y轴旋转
          //     const rotationQuat = new Quat();
          //     Quat.fromEuler(rotationQuat,
          //         rotateAxis.x * this._rotationProgress,
          //         rotateAxis.y * this._rotationProgress,
          //         rotateAxis.z * this._rotationProgress
          //     );
          //     // 应用旋转
          //     this.upgradeNode.setRotation(rotationQuat);
          // }
          if ((_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.coinNum + Number(this.progressLabel.string) >= (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.upgradeCoinNum) {
            this.coinNumUpLimitCallBack();
          }

          if (this._updateNum) {
            // this.addTime += deltaTime;
            //if (this.addTime >= 0.02) {
            this.addTime = 0;

            if (this._nowNum < (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
              error: Error()
            }), DataManager) : DataManager).Instance.towerCoinNum) {
              this._nowNum += 10;
              this.updateProgress();
            } else {
              this._updateNum = false;

              if (this._nowNum >= (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
                error: Error()
              }), DataManager) : DataManager).Instance.upgradeCoinNum) {
                //游戏结束
                this.scheduleOnce(() => {
                  (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
                    error: Error()
                  }), DataManager) : DataManager).Instance.isGameOver = true;
                  (_crd && EventManager === void 0 ? (_reportPossibleCrUseOfEventManager({
                    error: Error()
                  }), EventManager) : EventManager).inst.emit((_crd && EventName === void 0 ? (_reportPossibleCrUseOfEventName({
                    error: Error()
                  }), EventName) : EventName).GameOver);
                  this.upGradeBtn.active = false;
                  this.upgradeEffect();
                }, 0.5);
              }
            } // }

          }
        }

        updateProgress() {
          this.progressLabelaMax.string = "/ " + (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.upgradeCoinNum;
          this.progressLabel.string = String((_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.towerCoinNum);
          let need = (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.upgradeCoinNum; // if(need - this._nowNum < 0){
          //     this._nowNum = need; 
          // }
          // this.progressLabel.string = String(need - this._nowNum);

          this.progressBar.fillRange = this._nowNum / need;
        }

        onGiveTowerCoin() {
          this._updateNum = true;
          this._timeCount = 0;
        }

        showProgress() {
          if (!this.upGradeBtn.active) {
            // this.upGradeBtn.active = true;
            this.upGradeBtn.setScale(0, 0, 0);
            tween(this.upGradeBtn).delay(5).to(0.1, {
              scale: new Vec3(1.1, 1.1, 1.1)
            }, {
              easing: 'quadOut'
            }).to(0.05, {
              scale: new Vec3(1, 1, 1)
            }, {
              easing: 'quadIn'
            }).start();
          }
        }

        upgradeEffect() {
          this.hand_sprite.active = false;
          this.scheduleOnce(() => {
            if (this.upgradeTween) {
              this.upgradeTween.stop(); // 停止动画

              this.upgradeTween = null; // 释放引用，方便GC回收
            }

            this.mapAnimation.play(); // let nodes: Node[] = [];
            // console.log("DataManager.Instance.leftSocket.length == " + DataManager.Instance.leftSocket.length);
            // for (let i = 0; i < DataManager.Instance.leftSocket.length; i++) {
            //     console.log("i == " + i);
            //     console.log("ChaTou == " + DataManager.Instance.leftSocket[i] );
            //     let str = "ChaTou" + (DataManager.Instance.leftSocket[i]) ;
            //      console.log(str );
            //     nodes[i] = this.endNode.getChildByName(str);
            //     console.log(nodes)
            //     nodes[i].active = false;
            // }
            // this.endNode.active = false;

            this.endNode1.active = true;
            this.scheduleOnce(() => {
              (_crd && EventManager === void 0 ? (_reportPossibleCrUseOfEventManager({
                error: Error()
              }), EventManager) : EventManager).inst.emit((_crd && EventName === void 0 ? (_reportPossibleCrUseOfEventName({
                error: Error()
              }), EventName) : EventName).ropeMovePoint);
            }, 0.8);
            this.mapAnimation.once(Animation.EventType.FINISHED, () => {// for (let i = 0; i < nodes.length; i++) {
              //     // nodes[i] = this.endNode.getChildByName("ChaTou"+DataManager.Instance.leftSocket[i]+1);
              //     nodes[i].active = true;
              // }
              // EventManager.inst.emit(EventName.ropeMovePoint);
              // this.ropeParent.setPosition(this.ropeParent.position.add(new Vec3(0,1,0)));
              // for(let i = 0; i < this.startNodes.length;i++){
              //     this.startNodes[i].active = true;
              // }
              //this.endNode1.active = false;
            }, this); //欠塔升级的动画

            this.upGradeBtn.active = false; //升级的动画

            this.scheduleOnce(() => {
              this.mapParticleAnimation.node.active = true;
              this.mapParticleAnimation.play();
              this.mapParticleAnimation.once(Animation.EventType.FINISHED, () => {
                this.mapParticleAnimation.node.active = false;
              }, this);
            }, 0.6);
          }, 0.5); // this.scheduleOnce(() => {
          //     this.mapParticleAnimation.node.active = true;
          //     this.mapParticleAnimation.play();
          //     this.mapParticleAnimation.once(Animation.EventType.FINISHED, () => {
          //         this.mapParticleAnimation.node.active = false;
          //     }, this);
          //     this.mapAnimation.play();
          //     //欠塔升级的动画
          //     this.upGradeBtn.active = false;
          //     //升级的动画
          //     //this.scheduleOnce(() => {
          //     this.EffectNode.node.active = false;
          //     this.upgradeEffectNode.active = true;
          //     this.upgradeEffectNode.getComponent(Animation).play();
          //     //}, 1);
          // }, 0.5)
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "upGradeBtn", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "progressBar", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "progressLabel", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "progressLabelaMax", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "coinFlyEndNode", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "upgradeEffectNode", [_dec7], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "EffectNode", [_dec8], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "mapAnimation", [_dec9], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, "mapParticleAnimation", [_dec10], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor10 = _applyDecoratedDescriptor(_class2.prototype, "hand_sprite", [_dec11], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor11 = _applyDecoratedDescriptor(_class2.prototype, "endNode", [_dec12], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor12 = _applyDecoratedDescriptor(_class2.prototype, "endNode1", [_dec13], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor13 = _applyDecoratedDescriptor(_class2.prototype, "upgradeNode", [_dec14], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor14 = _applyDecoratedDescriptor(_class2.prototype, "ropeParent", [_dec15], {
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
//# sourceMappingURL=5e8bcbd9fd012c2b9e1a41001dee590ade21881a.js.map