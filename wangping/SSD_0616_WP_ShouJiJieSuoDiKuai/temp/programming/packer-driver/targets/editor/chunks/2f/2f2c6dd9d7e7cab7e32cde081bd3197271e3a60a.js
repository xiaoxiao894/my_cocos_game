System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3", "__unresolved_4", "__unresolved_5"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Animation, tween, Vec3, State, CharacterType, BehaviourType, Global, BubbleFead, _dec, _class, _crd, ccclass, property, CutCornState;

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

  function _reportPossibleCrUseOfGlobal(extras) {
    _reporterNs.report("Global", "../core/Global", _context.meta, extras);
  }

  function _reportPossibleCrUseOfBubbleFead(extras) {
    _reporterNs.report("BubbleFead", "../BubbleFead", _context.meta, extras);
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
      tween = _cc.tween;
      Vec3 = _cc.Vec3;
    }, function (_unresolved_2) {
      State = _unresolved_2.default;
    }, function (_unresolved_3) {
      CharacterType = _unresolved_3.CharacterType;
    }, function (_unresolved_4) {
      BehaviourType = _unresolved_4.BehaviourType;
    }, function (_unresolved_5) {
      Global = _unresolved_5.Global;
    }, function (_unresolved_6) {
      BubbleFead = _unresolved_6.BubbleFead;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "ea0723e23RCnJQVKr51xdMy", "CutCornState", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Node', 'Animation', 'tween', 'Vec3', 'Tween']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("CutCornState", CutCornState = (_dec = ccclass('CutCornState'), _dec(_class = class CutCornState extends (_crd && State === void 0 ? (_reportPossibleCrUseOfState({
        error: Error()
      }), State) : State) {
        constructor(entity) {
          super();
          this.index = 0;
          // 新增：保存定时器句柄
          this.scheduleHandle = null;
          this.cornNode = null;
          this.isFirst = false;
          this.tweenInstance = null;
          this.entity = entity;
        }

        getNode(character) {
          let node = null;

          if (character.getId() == "0") {
            node = character.groundEffect.groundObject2_1;
            (_crd && Global === void 0 ? (_reportPossibleCrUseOfGlobal({
              error: Error()
            }), Global) : Global).cornUnlock[0] = 1;
          } else if (character.getId() == "1") {
            (_crd && Global === void 0 ? (_reportPossibleCrUseOfGlobal({
              error: Error()
            }), Global) : Global).cornUnlock[1] = 1;
            node = character.groundEffect.groundObject2_2;
          } else if (character.getId() == "2") {
            node = character.groundEffect.groundObject2_3;
            (_crd && Global === void 0 ? (_reportPossibleCrUseOfGlobal({
              error: Error()
            }), Global) : Global).cornUnlock[2] = 1;
          } else if (character.getId() == "3") {
            node = character.groundEffect.groundObject2_4;
            (_crd && Global === void 0 ? (_reportPossibleCrUseOfGlobal({
              error: Error()
            }), Global) : Global).cornUnlock[3] = 1;
          }

          return node;
        }

        onEnter(callback) {
          let character = this.entity; // 新增：检查是否需要立即清除动作

          if ((_crd && Global === void 0 ? (_reportPossibleCrUseOfGlobal({
            error: Error()
          }), Global) : Global).isStartMoveEnemyLand) {
            this.clearAllActions(character);
            return;
          }

          if (this.entity.getType() == (_crd && CharacterType === void 0 ? (_reportPossibleCrUseOfCharacterType({
            error: Error()
          }), CharacterType) : CharacterType).CHARACTER) {
            if (!this.entity.characterSkeletalAnimation) {
              console.error("骨骼动画组件未初始化");
              return;
            }
          }

          if (character.cornIndex <= 1) {
            character.node.setRotationFromEuler(0, 0, 0);
            character.cornIndex = 1;
          } else {
            character.node.setRotationFromEuler(0, 180, 0);
            character.cornIndex = 4;
          }

          character.axe.active = false;
          character.sickle.active = true;

          let callFun = () => {
            if (character.getId() == "0") {
              character.groundEffect.ArrowgroundObject2_1.active = true;

              if (character.groundEffect.ArrowgroundObject2_1.getComponent(_crd && BubbleFead === void 0 ? (_reportPossibleCrUseOfBubbleFead({
                error: Error()
              }), BubbleFead) : BubbleFead)) {
                character.groundEffect.ArrowgroundObject2_1.getComponent(_crd && BubbleFead === void 0 ? (_reportPossibleCrUseOfBubbleFead({
                  error: Error()
                }), BubbleFead) : BubbleFead).Show();
              }
            } else if (character.getId() == "1") {
              character.groundEffect.ArrowgroundObject2_2.active = true;

              if (character.groundEffect.ArrowgroundObject2_2.getComponent(_crd && BubbleFead === void 0 ? (_reportPossibleCrUseOfBubbleFead({
                error: Error()
              }), BubbleFead) : BubbleFead)) {
                character.groundEffect.ArrowgroundObject2_2.getComponent(_crd && BubbleFead === void 0 ? (_reportPossibleCrUseOfBubbleFead({
                  error: Error()
                }), BubbleFead) : BubbleFead).Show();
              }
            } else if (character.getId() == "2") {
              character.groundEffect.ArrowgroundObject2_3.active = true;

              if (character.groundEffect.ArrowgroundObject2_3.getComponent(_crd && BubbleFead === void 0 ? (_reportPossibleCrUseOfBubbleFead({
                error: Error()
              }), BubbleFead) : BubbleFead)) {
                character.groundEffect.ArrowgroundObject2_3.getComponent(_crd && BubbleFead === void 0 ? (_reportPossibleCrUseOfBubbleFead({
                  error: Error()
                }), BubbleFead) : BubbleFead).Show();
              }
            } else if (character.getId() == "3") {
              character.groundEffect.ArrowgroundObject2_4.active = true;

              if (character.groundEffect.ArrowgroundObject2_4.getComponent(_crd && BubbleFead === void 0 ? (_reportPossibleCrUseOfBubbleFead({
                error: Error()
              }), BubbleFead) : BubbleFead)) {
                character.groundEffect.ArrowgroundObject2_4.getComponent(_crd && BubbleFead === void 0 ? (_reportPossibleCrUseOfBubbleFead({
                  error: Error()
                }), BubbleFead) : BubbleFead).Show();
              }
            }
          };

          const attackLoop = () => {
            // 新增：检查是否需要清除动作
            if ((_crd && Global === void 0 ? (_reportPossibleCrUseOfGlobal({
              error: Error()
            }), Global) : Global).isStartMoveEnemyLand) {
              this.clearAllActions(character);
              return;
            }

            if (character.frontage) {
              if (character.cornIndex > 4) {
                character.cornIndex = 4;
                (_crd && Global === void 0 ? (_reportPossibleCrUseOfGlobal({
                  error: Error()
                }), Global) : Global).isLandNum++;
                character.setFindTarget(false);
                character.BehaviourType = (_crd && BehaviourType === void 0 ? (_reportPossibleCrUseOfBehaviourType({
                  error: Error()
                }), BehaviourType) : BehaviourType).Idel;
                character.frontage = false;
                character.idle(); // 修改：保存定时器句柄

                this.scheduleHandle = this.scheduleOnce(() => {
                  this.cornNode.children.forEach(item => {
                    item.active = true;
                  });
                  callFun();
                }, 3);
                return;
              }
            } else {
              if (character.cornIndex <= 0) {
                character.setFindTarget(false);
                character.BehaviourType = (_crd && BehaviourType === void 0 ? (_reportPossibleCrUseOfBehaviourType({
                  error: Error()
                }), BehaviourType) : BehaviourType).Idel;
                character.cornIndex = 1;
                character.frontage = true;
                character.idle(); // 修改：保存定时器句柄

                this.scheduleHandle = this.scheduleOnce(() => {
                  this.cornNode.children.forEach(item => {
                    item.active = true;
                    callFun();
                  });
                }, 3);
                const allUnlocked = (_crd && Global === void 0 ? (_reportPossibleCrUseOfGlobal({
                  error: Error()
                }), Global) : Global).cornUnlock.every(value => value !== 0);

                if (allUnlocked) {
                  if (!(_crd && Global === void 0 ? (_reportPossibleCrUseOfGlobal({
                    error: Error()
                  }), Global) : Global).isFirstEnemyLand) {
                    (_crd && Global === void 0 ? (_reportPossibleCrUseOfGlobal({
                      error: Error()
                    }), Global) : Global).isFirstEnemyLand = true;
                    character.groundEffect.passAnimation2();
                  }
                }

                return;
              }
            }

            this.cornNode = this.getNode(character);
            character.characterSkeletalAnimation.play("gexiaomai");
            const animationState = character.characterSkeletalAnimation.getState("gexiaomai");
            animationState.speed = 2.2;
            (_crd && Global === void 0 ? (_reportPossibleCrUseOfGlobal({
              error: Error()
            }), Global) : Global).soundManager.playCutCronSound();
            character.characterSkeletalAnimation.once(Animation.EventType.FINISHED, () => {
              // 新增：检查是否需要清除动作
              if ((_crd && Global === void 0 ? (_reportPossibleCrUseOfGlobal({
                error: Error()
              }), Global) : Global).isStartMoveEnemyLand) {
                this.clearAllActions(character);
                return;
              }

              character.characterSkeletalAnimation.play("kugongnanpao");
              this.cornNode.getChildByName("ground" + character.cornIndex).active = false;
              this.tweenInstance = tween(character.node).by(0.3, {
                position: new Vec3(0, 0, character.frontage ? 1.6 : -1.6)
              }).call(() => {
                // 新增：检查是否需要清除动作
                if ((_crd && Global === void 0 ? (_reportPossibleCrUseOfGlobal({
                  error: Error()
                }), Global) : Global).isStartMoveEnemyLand) {
                  this.clearAllActions(character);
                  return;
                }

                character.collectCorn(this.entity);

                if ((_crd && Global === void 0 ? (_reportPossibleCrUseOfGlobal({
                  error: Error()
                }), Global) : Global).isStartMoveEnemyLand == true) {
                  this.clearAllActions(character);
                  return;
                }

                if (character.frontage) {
                  character.cornIndex++;
                } else {
                  character.cornIndex--;
                }

                if ((_crd && Global === void 0 ? (_reportPossibleCrUseOfGlobal({
                  error: Error()
                }), Global) : Global).isLandNum >= 3) {
                  const allUnlocked = (_crd && Global === void 0 ? (_reportPossibleCrUseOfGlobal({
                    error: Error()
                  }), Global) : Global).cornUnlock.every(value => value !== 0);

                  if (allUnlocked) {
                    if (!(_crd && Global === void 0 ? (_reportPossibleCrUseOfGlobal({
                      error: Error()
                    }), Global) : Global).isFirstEnemyLand) {
                      (_crd && Global === void 0 ? (_reportPossibleCrUseOfGlobal({
                        error: Error()
                      }), Global) : Global).isFirstEnemyLand = true;
                      character.groundEffect.passAnimation2();
                    }
                  }
                }

                attackLoop();
              }).start();
            });
          };

          attackLoop();
        } // 新增：清除所有缓存动作的方法


        clearAllActions(character) {
          // 停止tween动画
          if (this.tweenInstance) {
            this.tweenInstance.stop();
            this.tweenInstance = null;
          } // 取消定时器


          if (this.scheduleHandle) {
            this.unschedule(this.scheduleHandle);
            this.scheduleHandle = null;
          } // 停止骨骼动画


          if (character.characterSkeletalAnimation) {
            character.characterSkeletalAnimation.stop();
          } // 切换到 idle 状态
          // character.setFindTarget(false);
          // character.BehaviourType = BehaviourType.Idel;
          // character.idle();

        }

        onUpdate(dt) {
          // 新增：在更新时检查是否需要清除动作
          if ((_crd && Global === void 0 ? (_reportPossibleCrUseOfGlobal({
            error: Error()
          }), Global) : Global).isStartMoveEnemyLand) {
            let character = this.entity;
            this.clearAllActions(character);
          }
        }

        onExit(callback) {
          // 新增：退出状态时清除所有动作
          this.clearAllActions(this.entity);
          if (callback) callback();
        }

      }) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=2f2c6dd9d7e7cab7e32cde081bd3197271e3a60a.js.map