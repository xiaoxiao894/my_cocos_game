System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3", "__unresolved_4", "__unresolved_5", "__unresolved_6"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, tween, CharacterType, State, BehaviourType, Global, eventMgr, EventType, AttackState, _crd;

  function _reportPossibleCrUseOfEntity(extras) {
    _reporterNs.report("Entity", "../entitys/Entity", _context.meta, extras);
  }

  function _reportPossibleCrUseOfCharacterType(extras) {
    _reporterNs.report("CharacterType", "../entitys/Entity", _context.meta, extras);
  }

  function _reportPossibleCrUseOfState(extras) {
    _reporterNs.report("State", "./State", _context.meta, extras);
  }

  function _reportPossibleCrUseOfenemyCharacter(extras) {
    _reporterNs.report("enemyCharacter", "../entitys/enemyCharacter", _context.meta, extras);
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

  function _reportPossibleCrUseOfeventMgr(extras) {
    _reporterNs.report("eventMgr", "../core/EventManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfEventType(extras) {
    _reporterNs.report("EventType", "../core/EventType", _context.meta, extras);
  }

  _export("default", void 0);

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      tween = _cc.tween;
    }, function (_unresolved_2) {
      CharacterType = _unresolved_2.CharacterType;
    }, function (_unresolved_3) {
      State = _unresolved_3.default;
    }, function (_unresolved_4) {
      BehaviourType = _unresolved_4.BehaviourType;
    }, function (_unresolved_5) {
      Global = _unresolved_5.Global;
    }, function (_unresolved_6) {
      eventMgr = _unresolved_6.eventMgr;
    }, function (_unresolved_7) {
      EventType = _unresolved_7.EventType;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "2435baHeE1EIpsZwD+bfIes", "AttackState", undefined);

      __checkObsolete__(['AnimationComponent', 'tween', 'Vec3']);

      _export("default", AttackState = class AttackState extends (_crd && State === void 0 ? (_reportPossibleCrUseOfState({
        error: Error()
      }), State) : State) {
        constructor(entity) {
          super();
          this.target = null;
          this.callBcak = null;
          this.pos = null;
          this.num = 0;
          this.entity = entity;
          this.pos = this.entity.node.worldPosition.clone();
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
          } // this.entity.node.worldPosition = this.pos;


          if (this.entity.target.getType() == (_crd && CharacterType === void 0 ? (_reportPossibleCrUseOfCharacterType({
            error: Error()
          }), CharacterType) : CharacterType).ENEMY) {
            let enemyChar = this.entity.target;
            let cahracter = this.entity;
            cahracter.isAttack = true;
            cahracter.axe.active = true;
            cahracter.sickle.active = false;

            const attackLoop = () => {
              this.entity.characterSkeletalAnimation.play("kanshu");
              (_crd && Global === void 0 ? (_reportPossibleCrUseOfGlobal({
                error: Error()
              }), Global) : Global).soundManager.playAttackEnemySound(); //enemyTree.playAnimtion();//受激动作

              enemyChar.takeDamage(this.entity.attack, isDie => {
                if (isDie) {
                  (_crd && Global === void 0 ? (_reportPossibleCrUseOfGlobal({
                    error: Error()
                  }), Global) : Global).enemyDieNum++;

                  if ((_crd && Global === void 0 ? (_reportPossibleCrUseOfGlobal({
                    error: Error()
                  }), Global) : Global).enemyDieNum >= 4) {
                    (_crd && eventMgr === void 0 ? (_reportPossibleCrUseOfeventMgr({
                      error: Error()
                    }), eventMgr) : eventMgr).emit((_crd && EventType === void 0 ? (_reportPossibleCrUseOfEventType({
                      error: Error()
                    }), EventType) : EventType).ENTITY_ALL_DIE);
                  } //  cahracter.setFindTarget(false);


                  cahracter.setBehaviour((_crd && BehaviourType === void 0 ? (_reportPossibleCrUseOfBehaviourType({
                    error: Error()
                  }), BehaviourType) : BehaviourType).Idel);
                  cahracter.idle();
                } else {
                  tween(enemyChar).delay(1).call(() => {
                    attackLoop();
                  }).start();
                }
              });
              this.scheduleOnce(() => {
                // this.num++;
                // if(this.num >= 3){
                //     enemyChar.die();
                //     enemyChar.attackNum = -1;
                // }
                enemyChar.hit();
              }, 0.3);
            };

            attackLoop();
          } // if (callback) {
          //     console.log("AttackState callback")
          //     this.callBcak = callback;
          //     this.callBcak(this.entity)
          // }

        }

        onUpdate(dt) {// 攻击状态的逻辑
        }

        onExit(callback) {
          console.log("退出攻击状态");
          this.callBcak = null;
        }

      });

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=eed72cc847933ec162787dee1885851aaa6e2f83.js.map