System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3", "__unresolved_4"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, tween, Animation, State, CharacterType, BehaviourType, Global, _dec, _class, _crd, ccclass, property, CutTreeState;

  function _reportPossibleCrUseOfState(extras) {
    _reporterNs.report("State", "./State", _context.meta, extras);
  }

  function _reportPossibleCrUseOfEntity(extras) {
    _reporterNs.report("Entity", "../entitys/Entity", _context.meta, extras);
  }

  function _reportPossibleCrUseOfCharacterType(extras) {
    _reporterNs.report("CharacterType", "../entitys/Entity", _context.meta, extras);
  }

  function _reportPossibleCrUseOfEnemyTree(extras) {
    _reporterNs.report("EnemyTree", "../entitys/EnemyTree", _context.meta, extras);
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

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
      tween = _cc.tween;
      Animation = _cc.Animation;
    }, function (_unresolved_2) {
      State = _unresolved_2.default;
    }, function (_unresolved_3) {
      CharacterType = _unresolved_3.CharacterType;
    }, function (_unresolved_4) {
      BehaviourType = _unresolved_4.BehaviourType;
    }, function (_unresolved_5) {
      Global = _unresolved_5.Global;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "c0254e2rPBFnaaIbLp01D/8", "CutTreeState", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Node', 'tween', 'Animation']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("CutTreeState", CutTreeState = (_dec = ccclass('CutTreeState'), _dec(_class = class CutTreeState extends (_crd && State === void 0 ? (_reportPossibleCrUseOfState({
        error: Error()
      }), State) : State) {
        constructor(entity) {
          super();
          this.target = null;
          this.callback = null;
          this.num = 0;
          // private TreeAnimationNum: number = 1;
          this.currentTween = null;
          this.isExiting = false;
          this.entity = entity;
        }

        onEnter(callback) {
          // 重置状态
          this.resetState();
          this.callback = callback;
          if (this.entity.getType() !== (_crd && CharacterType === void 0 ? (_reportPossibleCrUseOfCharacterType({
            error: Error()
          }), CharacterType) : CharacterType).CHARACTER) return;

          if (!this.entity.characterSkeletalAnimation) {
            console.error("骨骼动画组件未初始化");
            return;
          }

          var enemyTree = this.entity.target;
          if (!enemyTree || enemyTree.getType() !== (_crd && CharacterType === void 0 ? (_reportPossibleCrUseOfCharacterType({
            error: Error()
          }), CharacterType) : CharacterType).ENEMY_TREE) return;
          var character = this.entity;
          character.axe.active = true;
          character.sickle.active = false;
          character.setBehaviour((_crd && BehaviourType === void 0 ? (_reportPossibleCrUseOfBehaviourType({
            error: Error()
          }), BehaviourType) : BehaviourType).CutTree);
          this.entity.characterSkeletalAnimation.stop(); // 保存引用用于退出时清理

          this.currentTween = tween(enemyTree).call(() => this.performAttack(enemyTree, character)).start();
        }

        performAttack(enemyTree, character) {
          if (this.isExiting) return;
          console.log("attackLoop  == " + character.getBehaviour()); // 移除之前可能残留的监听器

          this.entity.characterSkeletalAnimation.off(Animation.EventType.FINISHED);
          var tt = this.entity.characterSkeletalAnimation.getState("kanshu").wrapMode; // 添加单次监听器
          //  this.entity.characterSkeletalAnimation.once(Animation.EventType.FINISHED, () => {

          this.scheduleOnce(() => {
            if (this.isExiting) return; //  if(Global.treeHandOver){
            //     return;
            //  }
            //     this.scheduleOnce(()=>{
            //         character.setFindTarget(false);
            //         character.BehaviourType = BehaviourType.Idel;
            //         character.idle();
            //     },0.5)
            // }else{

            this.num++;
            enemyTree.curCollectNum++;
            console.log(" this.num  == ", enemyTree.curCollectNum);

            if (enemyTree.curCollectNum === 3) {
              character.collectWoodNew(character, 4, enemyTree);
            } else {
              character.collectWoodNew(character, 3, enemyTree);
            } //}

          }, 0.3); //  });

          (_crd && Global === void 0 ? (_reportPossibleCrUseOfGlobal({
            error: Error()
          }), Global) : Global).soundManager.playCutTreeSound();
          this.entity.characterSkeletalAnimation.play("kanshu");
          enemyTree.playAnimtion("shuKF00" + enemyTree.curCutNum);
          enemyTree.animationNum++;
          enemyTree.curCutNum++; // this.TreeAnimationNum++

          enemyTree.takeDamage(this.entity.attack, isDie => {
            if (this.isExiting) return;

            if (isDie) {
              var itiem = 0.3;

              if ((_crd && Global === void 0 ? (_reportPossibleCrUseOfGlobal({
                error: Error()
              }), Global) : Global).treeHandOver == false) {
                itiem = 0.3;
              } else {
                itiem = 0;
                return;
              }

              this.scheduleOnce(() => {
                if ((_crd && BehaviourType === void 0 ? (_reportPossibleCrUseOfBehaviourType({
                  error: Error()
                }), BehaviourType) : BehaviourType).HandOver == this.entity.BehaviourType) {
                  return;
                } else {
                  character.setFindTarget(false); // character.setBehaviour(BehaviourType.Idel);

                  character.nextTree();
                  this.entity.idle();
                  this.resetState();

                  if (this.callback) {
                    this.callback();
                  }
                }
              }, itiem);
            } else {
              this.currentTween = tween(enemyTree).delay(1).call(() => this.performAttack(enemyTree, character)).start();
            }
          });
        }

        resetState() {
          this.num = 0;
          this.isExiting = false; //  this.TreeAnimationNum = 1;
          // 停止并清除tween动画

          if (this.currentTween) {
            this.currentTween.stop();
            this.currentTween = null;
          } // 清除动画监听器


          if (this.entity.characterSkeletalAnimation) {
            this.entity.characterSkeletalAnimation.off(Animation.EventType.FINISHED);
          }
        }

        onUpdate(dt) {// 攻击状态的逻辑
        }

        onExit(callback) {
          console.log("退出攻击状态");
          this.isExiting = true;
          this.resetState();

          if (callback) {
            callback();
          }
        }

      }) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=a65b550b7dcaa2938c8b7393c2c1c9563477ac6e.js.map