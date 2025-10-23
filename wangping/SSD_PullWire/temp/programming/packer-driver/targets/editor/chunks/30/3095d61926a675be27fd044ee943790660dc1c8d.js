System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, instantiate, Label, Node, Quat, tween, Vec3, DataManager, EventManager, EventName, _dec, _dec2, _dec3, _dec4, _dec5, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _crd, ccclass, property, CoinComponent;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfDataManager(extras) {
    _reporterNs.report("DataManager", "../Global/DataManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfEventManager(extras) {
    _reporterNs.report("EventManager", "../Global/EventManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfEventName(extras) {
    _reporterNs.report("EventName", "../Common/Enum", _context.meta, extras);
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
      Label = _cc.Label;
      Node = _cc.Node;
      Quat = _cc.Quat;
      tween = _cc.tween;
      Vec3 = _cc.Vec3;
    }, function (_unresolved_2) {
      DataManager = _unresolved_2.DataManager;
    }, function (_unresolved_3) {
      EventManager = _unresolved_3.EventManager;
    }, function (_unresolved_4) {
      EventName = _unresolved_4.EventName;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "7f606LcKa5EEq9+Q3cVdrzP", "CoinComponent", undefined);

      __checkObsolete__(['_decorator', 'Camera', 'Component', 'instantiate', 'Label', 'Node', 'Quat', 'Tween', 'tween', 'UITransform', 'Vec3', 'view']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("CoinComponent", CoinComponent = (_dec = ccclass('CoinComponent'), _dec2 = property(Label), _dec3 = property(Node), _dec4 = property(Node), _dec5 = property(Node), _dec(_class = (_class2 = class CoinComponent extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "coinNum", _descriptor, this);

          _initializerDefineProperty(this, "effectNode", _descriptor2, this);

          _initializerDefineProperty(this, "coinNode", _descriptor3, this);

          _initializerDefineProperty(this, "breathNode", _descriptor4, this);

          this.isCoinMessagee = false;
          this._coins = [];
          this._upgraded = false;
          this._breathTween = null;
          this._remainingCoinBatches = undefined;
          this.num = 0;
          this.tiem = 0.3;
          this.isFrister = false;
          this.isFrister1 = false;
        }

        start() {
          this.coinNum.string = "0";
        }

        onEnable() {
          (_crd && EventManager === void 0 ? (_reportPossibleCrUseOfEventManager({
            error: Error()
          }), EventManager) : EventManager).inst.on((_crd && EventName === void 0 ? (_reportPossibleCrUseOfEventName({
            error: Error()
          }), EventName) : EventName).TowerUpgradeBtnClick, this.towerUpgrade, this);
          (_crd && EventManager === void 0 ? (_reportPossibleCrUseOfEventManager({
            error: Error()
          }), EventManager) : EventManager).inst.on((_crd && EventName === void 0 ? (_reportPossibleCrUseOfEventName({
            error: Error()
          }), EventName) : EventName).CoinAdd, this.coinAdd, this);
        }

        onDisable() {
          (_crd && EventManager === void 0 ? (_reportPossibleCrUseOfEventManager({
            error: Error()
          }), EventManager) : EventManager).inst.off((_crd && EventName === void 0 ? (_reportPossibleCrUseOfEventName({
            error: Error()
          }), EventName) : EventName).TowerUpgradeBtnClick, this.towerUpgrade, this);
          (_crd && EventManager === void 0 ? (_reportPossibleCrUseOfEventManager({
            error: Error()
          }), EventManager) : EventManager).inst.off((_crd && EventName === void 0 ? (_reportPossibleCrUseOfEventName({
            error: Error()
          }), EventName) : EventName).CoinAdd, this.coinAdd, this);
        }

        coinAdd() {
          this.updateCoinNum();
          this.playBreathAni();
        }

        updateCoinNum() {
          if (Number(this.coinNum.string) >= 900) {
            if (this.isCoinMessagee == false) {
              (_crd && EventManager === void 0 ? (_reportPossibleCrUseOfEventManager({
                error: Error()
              }), EventManager) : EventManager).inst.emit((_crd && EventName === void 0 ? (_reportPossibleCrUseOfEventName({
                error: Error()
              }), EventName) : EventName).coinNumUpLimit);
              this.isCoinMessagee = true;
            }
          } // this.scheduleOnce(() => {
          //  }, 0.3)


          this.coinNum.string = String((_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.coinNum);
        } //点击金币


        towerUpgrade() {
          (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.upgradeAnimationType = 3;
          (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.upgradeTween.stop();
          (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.upgradeNode.rotation = new Quat(0, 0, 0, 1);
          (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.upgradeTween = tween((_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.upgradeNode).to(0.05, {
            scale: new Vec3(0.95, 0.95, 0.95)
          }, {
            easing: "quadOut"
          }).to(0.05, {
            scale: new Vec3(0.85, 0.85, 0.85)
          }, {
            easing: "quadIn"
          }).to(0.1, {
            scale: new Vec3(1, 1, 1)
          }, {
            easing: "quadIn"
          }).call(() => {
            (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
              error: Error()
            }), DataManager) : DataManager).Instance.upgradeTween = tween((_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
              error: Error()
            }), DataManager) : DataManager).Instance.upgradeNode).to(0.5, {
              scale: new Vec3(1.1, 1.1, 1.1)
            }, {
              easing: "quadOut"
            }).to(0.5, {
              scale: new Vec3(1, 1, 1)
            }, {
              easing: "quadIn"
            }).union().repeatForever().start();
          }).union().start();

          if (this._upgraded) {
            return;
          }

          if ((_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.coinNum <= 0) {
            return;
          } //摄像机移动


          tween((_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.mainCamera.node).to(0.8, {
            worldPosition: new Vec3(0.014142, 34.1, 37.250385)
          }).call(() => {
            this._upgraded = true;
          }).start();
        }

        update(dt) {
          // 初始化计数器（如果未设置）
          if (this._upgraded && this._remainingCoinBatches === undefined) {
            this._remainingCoinBatches = Math.ceil((_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
              error: Error()
            }), DataManager) : DataManager).Instance.coinNum / 10);
            this.num = this._remainingCoinBatches; // if(this.num > 50 ){
            //     this.num = 50;
            // }
          }

          if (this.num > 0) {
            this.scheduleOnce(() => {
              (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
                error: Error()
              }), DataManager) : DataManager).Instance.soundManager.playResourceSound();
            }, 0.3);
            this.num--;
          }

          if (this._upgraded === true && (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.coinNum > 0 && (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.towerCoinNum < (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.upgradeCoinNum) {
            if (this.isFrister == false && this.isFrister1 == false) {
              this.isFrister = true;
            }

            let startPos = new Vec3(0, 0, 0);
            let endPos = (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
              error: Error()
            }), DataManager) : DataManager).Instance.coinEndNode.worldPosition.clone();
            let camera = (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
              error: Error()
            }), DataManager) : DataManager).Instance.mainCamera.camera;
            camera.convertToUINode(endPos, this.node, endPos); // 飞钱

            (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
              error: Error()
            }), DataManager) : DataManager).Instance.coinNum -= 10;
            let tesTiem = 0.5;

            if ((_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
              error: Error()
            }), DataManager) : DataManager).Instance.coinNum < 100) {
              tesTiem = 0.1;
            } else {
              tesTiem = 0.5;
            }

            this.updateCoinNum();

            if (this.isFrister == true) {
              this.isFrister = false;
              this.isFrister1 = true;
              this.scheduleOnce(() => {
                let teim = dt;

                if ((_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
                  error: Error()
                }), DataManager) : DataManager).Instance.coinNum >= 100) {
                  teim = dt;
                } else if ((_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
                  error: Error()
                }), DataManager) : DataManager).Instance.coinNum > 30 && (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
                  error: Error()
                }), DataManager) : DataManager).Instance.coinNum < 100) {
                  teim = 0.05;
                } else {
                  teim = 0.2;
                }

                console.log("this._remainingCoinBatches == " + this._remainingCoinBatches);

                if ((_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
                  error: Error()
                }), DataManager) : DataManager).Instance.upgradeAnimationType == 3) {
                  (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
                    error: Error()
                  }), DataManager) : DataManager).Instance.upgradeTween.stop();
                  (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
                    error: Error()
                  }), DataManager) : DataManager).Instance.upgradeTween = tween((_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
                    error: Error()
                  }), DataManager) : DataManager).Instance.upgradeNode).to(teim, {
                    scale: new Vec3(1.1, 1.1, 1.1)
                  }, {
                    easing: "quadOut"
                  }).to(teim, {
                    scale: new Vec3(1, 1, 1)
                  }, {
                    easing: "quadIn"
                  }).union().repeatForever().start();
                }
              }, tesTiem);
            } // 减少剩余批次计数


            if (this._remainingCoinBatches !== undefined) {
              this._remainingCoinBatches--;
            }

            let coinNode = this._coins.pop() || instantiate(this.coinNode);
            coinNode.active = true;
            coinNode.parent = this.effectNode;
            coinNode.setPosition(startPos);
            coinNode.setScale(new Vec3(0.8, 0.8, 1));
            const controlPoint = new Vec3(startPos.x - Math.abs(endPos.x - startPos.x) * 0.5, (startPos.y + endPos.y) * 0.5 + 100, startPos.z);
            tween(coinNode).to(0.5, {
              position: endPos,
              scale: new Vec3(0.6, 0.6, 1)
            }, {
              easing: 'cubicOut',
              onUpdate: (target, ratio) => {
                const t = ratio;
                const x = (1 - t) * (1 - t) * startPos.x + 2 * t * (1 - t) * controlPoint.x + t * t * endPos.x;
                const y = (1 - t) * (1 - t) * startPos.y + 2 * t * (1 - t) * controlPoint.y + t * t * endPos.y;
                coinNode.position = new Vec3(x, y, startPos.z);
              }
            }).call(() => {
              coinNode.active = false;
              coinNode.removeFromParent();

              this._coins.push(coinNode);

              if ((_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
                error: Error()
              }), DataManager) : DataManager).Instance.towerCoinNum < (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
                error: Error()
              }), DataManager) : DataManager).Instance.upgradeCoinNum) {
                (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
                  error: Error()
                }), DataManager) : DataManager).Instance.towerCoinNum += 10;
                (_crd && EventManager === void 0 ? (_reportPossibleCrUseOfEventManager({
                  error: Error()
                }), EventManager) : EventManager).inst.emit((_crd && EventName === void 0 ? (_reportPossibleCrUseOfEventName({
                  error: Error()
                }), EventName) : EventName).GiveTowerCoin);
              } // 仅当所有批次都完成且金币处理完毕时才重置_upgraded


              if (this._remainingCoinBatches !== undefined && this._remainingCoinBatches <= 0 && (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
                error: Error()
              }), DataManager) : DataManager).Instance.coinNum < 10) {
                this._upgraded = false;
                this._remainingCoinBatches = undefined; // 重置计数器

                this.isFrister = false;
                this.isFrister1 = false;

                if (this._remainingCoinBatches > 2) {
                  this.tiem = 0.5;
                } else if (this._remainingCoinBatches < 1) {
                  this.tiem = 0.2;
                } else {
                  this.tiem = 0.3;
                }

                this.scheduleOnce(() => {
                  (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
                    error: Error()
                  }), DataManager) : DataManager).Instance.upgradeAnimationType = 1;
                  (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
                    error: Error()
                  }), DataManager) : DataManager).Instance.upgradeTween.stop();
                  (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
                    error: Error()
                  }), DataManager) : DataManager).Instance.upgradeNode.scale = new Vec3(1, 1, 1);

                  if ((_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
                    error: Error()
                  }), DataManager) : DataManager).Instance.upgradeAnimationType == 1) {
                    (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
                      error: Error()
                    }), DataManager) : DataManager).Instance.upgradeTween = tween((_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
                      error: Error()
                    }), DataManager) : DataManager).Instance.upgradeNode).to(0.5, {
                      scale: new Vec3(1.1, 1.1, 1.1)
                    }, {
                      easing: "quadOut"
                    }).to(0.5, {
                      scale: new Vec3(1, 1, 1)
                    }, {
                      easing: "quadIn"
                    }).union().repeatForever().start();
                  }
                }, this.tiem);
              }
            }).start();
          }
        } // 公用呼吸动画方法（防叠加）


        playBreathAni() {
          if (this._breathTween) {
            this._breathTween.stop(); // 停止之前的动画

          }

          const tweenAni = tween(this.breathNode).to(0.08, {
            scale: new Vec3(1, 1, 1)
          }, {
            easing: 'quadOut'
          }).to(0.08, {
            scale: new Vec3(0.8, 0.8, 1)
          }, {
            easing: 'quadIn'
          }).start();
          this._breathTween = tweenAni;
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "coinNum", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "effectNode", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "coinNode", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "breathNode", [_dec5], {
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
//# sourceMappingURL=3095d61926a675be27fd044ee943790660dc1c8d.js.map