System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3", "__unresolved_4", "__unresolved_5", "__unresolved_6", "__unresolved_7"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, tween, Vec3, State, CharacterType, BehaviourType, MathUtil, Global, eventMgr, EventType, _dec, _class, _crd, ccclass, property, HandOver;

  function _reportPossibleCrUseOfState(extras) {
    _reporterNs.report("State", "./State", _context.meta, extras);
  }

  function _reportPossibleCrUseOfEntity(extras) {
    _reporterNs.report("Entity", "../entitys/Entity", _context.meta, extras);
  }

  function _reportPossibleCrUseOfCharacterType(extras) {
    _reporterNs.report("CharacterType", "../entitys/Entity", _context.meta, extras);
  }

  function _reportPossibleCrUseOfBehaviourType(extras) {
    _reporterNs.report("BehaviourType", "../entitys/Character", _context.meta, extras);
  }

  function _reportPossibleCrUseOfCharacter(extras) {
    _reporterNs.report("Character", "../entitys/Character", _context.meta, extras);
  }

  function _reportPossibleCrUseOfMathUtil(extras) {
    _reporterNs.report("MathUtil", "../MathUtils", _context.meta, extras);
  }

  function _reportPossibleCrUseOfGlobal(extras) {
    _reporterNs.report("Global", "../core/Global", _context.meta, extras);
  }

  function _reportPossibleCrUseOfeventMgr(extras) {
    _reporterNs.report("eventMgr", "../core/EventManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfEventType(extras) {
    _reporterNs.report("EventType", "../core/EventType", _context.meta, extras);
  }

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
      tween = _cc.tween;
      Vec3 = _cc.Vec3;
    }, function (_unresolved_2) {
      State = _unresolved_2.default;
    }, function (_unresolved_3) {
      CharacterType = _unresolved_3.CharacterType;
    }, function (_unresolved_4) {
      BehaviourType = _unresolved_4.BehaviourType;
    }, function (_unresolved_5) {
      MathUtil = _unresolved_5.MathUtil;
    }, function (_unresolved_6) {
      Global = _unresolved_6.Global;
    }, function (_unresolved_7) {
      eventMgr = _unresolved_7.eventMgr;
    }, function (_unresolved_8) {
      EventType = _unresolved_8.EventType;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "e36a6IxqDNMW6JthzI2Ogd2", "HandOver", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Node', 'tween', 'Vec3']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("HandOver", HandOver = (_dec = ccclass('HandOver'), _dec(_class = class HandOver extends (_crd && State === void 0 ? (_reportPossibleCrUseOfState({
        error: Error()
      }), State) : State) {
        constructor(entity) {
          super();
          this.target = null;
          this.callBcak = null;
          this.playerBoyNum = 0;
          this.entity = entity;
        }

        onEnter(callback) {
          if (this.entity.getType() == (_crd && CharacterType === void 0 ? (_reportPossibleCrUseOfCharacterType({
            error: Error()
          }), CharacterType) : CharacterType).CHARACTER) {
            // 检查骨骼动画组件是否存在
            if (!this.entity.characterSkeletalAnimation) {
              console.error("骨骼动画组件未初始化");
              return;
            }

            this.entity.characterSkeletalAnimation.play("kugongnanidel");
          }

          (_crd && Global === void 0 ? (_reportPossibleCrUseOfGlobal({
            error: Error()
          }), Global) : Global).playerBodyWoodTest = (_crd && Global === void 0 ? (_reportPossibleCrUseOfGlobal({
            error: Error()
          }), Global) : Global).playerBodyWood;
          this.handOver();
        }

        onUpdate(dt) {
          console.log("HandOver"); // this.handOver();
        }

        onExit(callback) {}

        handOver() {
          if ((_crd && Global === void 0 ? (_reportPossibleCrUseOfGlobal({
            error: Error()
          }), Global) : Global).playerBodyWood > 0 && (_crd && Global === void 0 ? (_reportPossibleCrUseOfGlobal({
            error: Error()
          }), Global) : Global).upgradeUIAnimtion == 2) {
            (_crd && Global === void 0 ? (_reportPossibleCrUseOfGlobal({
              error: Error()
            }), Global) : Global).upgradeUIAnimtion = 3;
          } // 获取交付位置节点


          let handOverPosNode = this.entity.getHandOverPosNode();

          if (!handOverPosNode) {
            console.error("找不到交付位置节点");
            return;
          }

          let handOverPos = handOverPosNode.worldPosition.clone(); // 获取背包节点

          let woodParent = this.entity.node.getChildByName("backpack");

          if (!woodParent) {
            console.error("找不到背包节点");
            return;
          } // 检查背包中是否有木头


          if (woodParent.children.length <= 0) {
            this.entity.setBehaviour((_crd && BehaviourType === void 0 ? (_reportPossibleCrUseOfBehaviourType({
              error: Error()
            }), BehaviourType) : BehaviourType).Idel);
            this.entity.setFindTarget(false);
            this.entity.woodNum = 0;

            if ((_crd && Global === void 0 ? (_reportPossibleCrUseOfGlobal({
              error: Error()
            }), Global) : Global).treeHandOverNum < (_crd && Global === void 0 ? (_reportPossibleCrUseOfGlobal({
              error: Error()
            }), Global) : Global).treeHandOverNumLimit) {
              (_crd && eventMgr === void 0 ? (_reportPossibleCrUseOfeventMgr({
                error: Error()
              }), eventMgr) : eventMgr).emit((_crd && EventType === void 0 ? (_reportPossibleCrUseOfEventType({
                error: Error()
              }), EventType) : EventType).ENTITY_HAND_OVER_NO);
            }

            console.warn("背包中没有可交付的木头");
            return;
          } // 获取最后一个木头节点


          const woodNode = woodParent.children[woodParent.children.length - 1];
          const woodWorldPos = woodNode.getWorldPosition().clone(); // 计算贝塞尔曲线控制点（提升高度可配置）

          const LIFT_HEIGHT = 10; // 可提取为配置项

          const controlPoint = new Vec3((woodNode.position.x + handOverPos.x) / 2, (woodNode.position.y + handOverPos.y) / 2 + LIFT_HEIGHT, (woodNode.position.z + handOverPos.z) / 2); // 执行贝塞尔曲线动画

          tween(woodNode).to(0.1, {
            scale: new Vec3(1, 1, 1)
          }, {
            easing: 'cubicInOut',
            onUpdate: (target, ratio) => {
              // 计算贝塞尔曲线位置
              const position = (_crd && MathUtil === void 0 ? (_reportPossibleCrUseOfMathUtil({
                error: Error()
              }), MathUtil) : MathUtil).bezierCurve(woodWorldPos, controlPoint, handOverPos, ratio);
              target.worldPosition = position;
            }
          }).call(() => {
            (_crd && Global === void 0 ? (_reportPossibleCrUseOfGlobal({
              error: Error()
            }), Global) : Global).treeHandOverNum++;
            (_crd && Global === void 0 ? (_reportPossibleCrUseOfGlobal({
              error: Error()
            }), Global) : Global).soundManager.playHandOverSound();

            if ((_crd && Global === void 0 ? (_reportPossibleCrUseOfGlobal({
              error: Error()
            }), Global) : Global).treeHandOverNum >= (_crd && Global === void 0 ? (_reportPossibleCrUseOfGlobal({
              error: Error()
            }), Global) : Global).treeHandOverNumLimit) {
              (_crd && eventMgr === void 0 ? (_reportPossibleCrUseOfeventMgr({
                error: Error()
              }), eventMgr) : eventMgr).emit((_crd && EventType === void 0 ? (_reportPossibleCrUseOfEventType({
                error: Error()
              }), EventType) : EventType).ENTITY_TREE_COMPLATE); //Global.upgradeUIAnimtion = 0
              // woodParent.removeAllChildren();

              if (woodNode) {
                this.entity.woodNum--;

                if (this.entity.woodNum < 0) {
                  this.entity.woodNum = 0;
                }

                woodNode.removeFromParent();
                woodNode.destroy();
                (_crd && Global === void 0 ? (_reportPossibleCrUseOfGlobal({
                  error: Error()
                }), Global) : Global).upgradeUIAnimtion = 5;
              }

              return;
            } // 增加交付计数


            this.entity.woodNum--;
            (_crd && Global === void 0 ? (_reportPossibleCrUseOfGlobal({
              error: Error()
            }), Global) : Global).playerBodyWood--;
            (_crd && Global === void 0 ? (_reportPossibleCrUseOfGlobal({
              error: Error()
            }), Global) : Global).playerBodyWoodTest--;
            console.log("Global.playerBodyWood == " + (_crd && Global === void 0 ? (_reportPossibleCrUseOfGlobal({
              error: Error()
            }), Global) : Global).playerBodyWood);

            if ((_crd && Global === void 0 ? (_reportPossibleCrUseOfGlobal({
              error: Error()
            }), Global) : Global).playerBodyWoodTest <= 0) {
              (_crd && Global === void 0 ? (_reportPossibleCrUseOfGlobal({
                error: Error()
              }), Global) : Global).playerBodyWoodTest = 0;
              (_crd && Global === void 0 ? (_reportPossibleCrUseOfGlobal({
                error: Error()
              }), Global) : Global).upgradeUIAnimtion = 5;
            }

            if (this.entity.woodNum < 0) {
              this.entity.woodNum = 0;

              if ((_crd && Global === void 0 ? (_reportPossibleCrUseOfGlobal({
                error: Error()
              }), Global) : Global).treeHandOverNum < (_crd && Global === void 0 ? (_reportPossibleCrUseOfGlobal({
                error: Error()
              }), Global) : Global).treeHandOverNumLimit) {
                (_crd && eventMgr === void 0 ? (_reportPossibleCrUseOfeventMgr({
                  error: Error()
                }), eventMgr) : eventMgr).emit((_crd && EventType === void 0 ? (_reportPossibleCrUseOfEventType({
                  error: Error()
                }), EventType) : EventType).ENTITY_HAND_OVER_NO);
              }
            } //Global.upgradeUIAnimtion = 1


            (_crd && eventMgr === void 0 ? (_reportPossibleCrUseOfeventMgr({
              error: Error()
            }), eventMgr) : eventMgr).emit((_crd && EventType === void 0 ? (_reportPossibleCrUseOfEventType({
              error: Error()
            }), EventType) : EventType).ENTITY_HAND_OVER_ADD); // 从场景中移除木头

            woodNode.removeFromParent();
            woodNode.destroy();
            this.handOver(); // 注意：这里不再递归调用this.handOver()
            // 而是通过事件或其他方式通知可以继续交付

            console.log("木头交付完成，当前已交付数量:", (_crd && Global === void 0 ? (_reportPossibleCrUseOfGlobal({
              error: Error()
            }), Global) : Global).treeHandOverNum);
          }).start();
        }

      }) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=86b09891a2d35c5b18dbf08640f1682e11fb77ac.js.map