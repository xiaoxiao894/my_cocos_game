System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, SkeletalAnimation, App, GlobeVariable, EnemySpider, EnemyController, _crd;

  function _reportPossibleCrUseOfApp(extras) {
    _reporterNs.report("App", "../App", _context.meta, extras);
  }

  function _reportPossibleCrUseOfGlobeVariable(extras) {
    _reporterNs.report("GlobeVariable", "../core/GlobeVariable", _context.meta, extras);
  }

  function _reportPossibleCrUseOfEnemySpider(extras) {
    _reporterNs.report("EnemySpider", "./EnemySpider", _context.meta, extras);
  }

  _export("EnemyController", void 0);

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      SkeletalAnimation = _cc.SkeletalAnimation;
    }, function (_unresolved_2) {
      App = _unresolved_2.App;
    }, function (_unresolved_3) {
      GlobeVariable = _unresolved_3.GlobeVariable;
    }, function (_unresolved_4) {
      EnemySpider = _unresolved_4.EnemySpider;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "1f8c9GeXlFOcIJOfTr7b3+c", "EnemyController", undefined);

      __checkObsolete__(['_decorator', 'Node', 'SkeletalAnimation', 'tween', 'Vec3']);

      _export("EnemyController", EnemyController = class EnemyController {
        constructor() {
          this.enemyList = [];
          //敌人列
          this.enemInitList = {};
          this.enemyRvoList = [];
        }

        static get Instance() {
          if (this._instance == null) {
            this._instance = new EnemyController();
          }

          return this._instance;
        }

        init() {
          if ((_crd && App === void 0 ? (_reportPossibleCrUseOfApp({
            error: Error()
          }), App) : App).sceneNode.enemyParent.children.length > 0) {
            (_crd && App === void 0 ? (_reportPossibleCrUseOfApp({
              error: Error()
            }), App) : App).sceneNode.enemyParent.children.forEach(item => {
              var enemy = item.getComponent(_crd && EnemySpider === void 0 ? (_reportPossibleCrUseOfEnemySpider({
                error: Error()
              }), EnemySpider) : EnemySpider); // 确保enemInitList中存在对应的对象

              if (!this.enemInitList[enemy.node.name]) {
                this.enemInitList[enemy.node.name] = {};
              } // 然后再设置属性


              this.enemInitList[enemy.node.name].isAttack = true;

              if (enemy.spiderType == 0) {
                this.enemInitList[enemy.node.name].entifyName = (_crd && GlobeVariable === void 0 ? (_reportPossibleCrUseOfGlobeVariable({
                  error: Error()
                }), GlobeVariable) : GlobeVariable).entifyName.EnemySpiderL;
              } else {
                this.enemInitList[enemy.node.name].entifyName = (_crd && GlobeVariable === void 0 ? (_reportPossibleCrUseOfGlobeVariable({
                  error: Error()
                }), GlobeVariable) : GlobeVariable).entifyName.EnemySpider;
              }

              this.enemInitList[enemy.node.name].spiderType = enemy.spiderType;

              if (enemy.spiderType == 0) {
                this.enemInitList[enemy.node.name].speedBig = 1.5;
              } else {
                this.enemInitList[enemy.node.name].speedBig = 1;
              }

              this.enemInitList[enemy.node.name].currentTargetIndex = enemy.currentIndex;
              this.enemInitList[enemy.node.name].worldPosition = enemy.node.worldPosition.clone(); // 使用clone避免引用问题

              this.enemInitList[enemy.node.name].worldRotation = enemy.node.worldRotation.clone(); // 使用clone避免引用问题

              this.enemInitList[enemy.node.name].spiderHp = enemy.spiderHp;

              if (enemy) {
                enemy.isAttack = true;
                this.enemyList.push(enemy);
              }
            });
          }
        }

        continueGame() {
          this.enemyList.length = 0;
          this.enemyRvoList.length = 0;
          this.enemyList = []; //敌人列表

          this.enemyRvoList = []; //敌人列表

          for (var key in this.enemInitList) {
            var prefab = (_crd && App === void 0 ? (_reportPossibleCrUseOfApp({
              error: Error()
            }), App) : App).poolManager.getNode(this.enemInitList[key].entifyName);
            prefab.parent = (_crd && App === void 0 ? (_reportPossibleCrUseOfApp({
              error: Error()
            }), App) : App).sceneNode.enemyParent;
            prefab.setWorldPosition(this.enemInitList[key].worldPosition);
            prefab.setWorldRotation(this.enemInitList[key].worldRotation);
            prefab.active = true;
            prefab.getComponent(SkeletalAnimation).getState("walk_f_1").speed = this.enemInitList[key].speedBig;
            var enemySpider = prefab.getComponent(_crd && EnemySpider === void 0 ? (_reportPossibleCrUseOfEnemySpider({
              error: Error()
            }), EnemySpider) : EnemySpider);
            enemySpider.spiderName = "spider";
            enemySpider.poolName = this.enemInitList[key].entifyName;
            enemySpider.init();
            enemySpider.setHp(this.enemInitList[key].spiderHp);
            enemySpider.currentTargetIndex = this.enemInitList[key].currentTargetIndex;
            enemySpider.isAttack = true;
            this.enemyList.push(enemySpider);
          } // this.enemInitList = null;
          // this.enemInitList = {};

        } //n级敌人随机出现的位置


        creatEnemyByLevel(level) {
          if (!(_crd && GlobeVariable === void 0 ? (_reportPossibleCrUseOfGlobeVariable({
            error: Error()
          }), GlobeVariable) : GlobeVariable).isStartGame) return;
          this.realCreatEnemy((_crd && App === void 0 ? (_reportPossibleCrUseOfApp({
            error: Error()
          }), App) : App).sceneNode.enemyBirthPos.worldPosition.clone());
        }

        getEnemyList() {
          return this.enemyList;
        }

        getEnemyRvoList() {
          return this.enemyRvoList;
        }
        /**
         * 添加敌人到RVO寻找列表
         * 从对列列表删除
         * @param enemy 
         */


        setEnemyRvoList(enemy) {
          this.enemyRvoList.push(enemy);
          this.removeEnemy(enemy);
        }

        removeEnemyRvo(enemy) {
          var index = this.enemyRvoList.indexOf(enemy);

          if (index !== -1) {
            this.enemyRvoList.splice(index, 1); // 从列表中移除
          }
        }

        restRvoEnemy() {
          this.enemyRvoList.forEach((enemy, index) => {
            setTimeout(() => {
              if (enemy) {
                // 额外检查，确保元素存在
                enemy.rvoLastMove = true;
              }
            }, index * 300);
          });
        } // restRvoEnemy() {
        //     for (let index = 0; index < this.enemyRvoList.length; index++) {
        //         setTimeout(() => {
        //             const enemy = this.enemyRvoList[index];
        //             if (enemy) {
        //                 enemy.rvoLastMove = true;
        //             }
        //         }, index * 500);
        //     }
        // }
        // resetEnemyAttackPaling() {
        //     for (let index = 0; index < this.enemyList.length; index++) {
        //         const enemy = this.enemyList[index];
        //         enemy.resetPaling();
        //     }
        // }


        removeEnemy(enemy) {
          var index = this.enemyList.indexOf(enemy);

          if (index !== -1) {
            this.enemyList.splice(index, 1); // 从列表中移除
          }

          console.log("remove enemy ,num " + this.enemyList.length);
        }
        /** 真正创建怪 */


        realCreatEnemy(pos) {
          //  GlobeVariable.curEnemySpiderNum++;
          //let scaleT = 1.8
          // 提取公共逻辑，减少重复代码
          var prefabName = (_crd && GlobeVariable === void 0 ? (_reportPossibleCrUseOfGlobeVariable({
            error: Error()
          }), GlobeVariable) : GlobeVariable).curEnemySpiderNum > (_crd && GlobeVariable === void 0 ? (_reportPossibleCrUseOfGlobeVariable({
            error: Error()
          }), GlobeVariable) : GlobeVariable).enemySpiderNumBig ? (_crd && GlobeVariable === void 0 ? (_reportPossibleCrUseOfGlobeVariable({
            error: Error()
          }), GlobeVariable) : GlobeVariable).entifyName.EnemySpider : (_crd && GlobeVariable === void 0 ? (_reportPossibleCrUseOfGlobeVariable({
            error: Error()
          }), GlobeVariable) : GlobeVariable).entifyName.EnemySpiderL;
          var prefab = (_crd && App === void 0 ? (_reportPossibleCrUseOfApp({
            error: Error()
          }), App) : App).poolManager.getNode(prefabName);
          prefab.parent = (_crd && App === void 0 ? (_reportPossibleCrUseOfApp({
            error: Error()
          }), App) : App).sceneNode.enemyParent;
          prefab.setWorldPosition(pos);
          prefab.active = true;
          var enemySpider = prefab.getComponent(_crd && EnemySpider === void 0 ? (_reportPossibleCrUseOfEnemySpider({
            error: Error()
          }), EnemySpider) : EnemySpider);
          prefab.getComponent(SkeletalAnimation).getState("walk_f_1").speed = 1.5;
          enemySpider.spiderName = "spider";
          enemySpider.poolName = prefabName;
          enemySpider.init(); // if(GlobeVariable.initEnemyBirthPosCurUnm <= GlobeVariable.initEnemyBirthPosNumLimit){
          //     prefab.setWorldPosition(App.sceneNode.enemyBirthPos1.worldPosition.clone());
          //     enemySpider.setSpiderPos();
          //     GlobeVariable.initEnemyBirthPosCurUnm++;
          // }

          setTimeout(() => {
            enemySpider.isAttack = true;
          }, 3);
          this.enemyList.push(enemySpider);
          console.log("push enemy ,num " + this.enemyList.length); // 根据类型设置不同属性

          if ((_crd && GlobeVariable === void 0 ? (_reportPossibleCrUseOfGlobeVariable({
            error: Error()
          }), GlobeVariable) : GlobeVariable).curEnemySpiderNum > (_crd && GlobeVariable === void 0 ? (_reportPossibleCrUseOfGlobeVariable({
            error: Error()
          }), GlobeVariable) : GlobeVariable).enemySpiderNumBig) {
            (_crd && GlobeVariable === void 0 ? (_reportPossibleCrUseOfGlobeVariable({
              error: Error()
            }), GlobeVariable) : GlobeVariable).curEnemySpiderNum = 0;
            prefab.getComponent(SkeletalAnimation).getState("walk_f_1").speed = 1;
            var data = (_crd && App === void 0 ? (_reportPossibleCrUseOfApp({
              error: Error()
            }), App) : App).dataManager.getMonsterById(2);

            if (data) {
              enemySpider.Idtype = data.Idtype;
              enemySpider.hp = data._hp;
              enemySpider.maxHp = data._hp;
              enemySpider.recordHp = data._hp;
              enemySpider.hitPow = data._hitPow;
            } // 实现大蜘蛛的缩放
            // prefab.setScale(2.8, 2.8, 2.8); // 假设使用这样的方法设置缩放

          } // 统一计数逻辑，无论大小蜘蛛都计入总数


          (_crd && GlobeVariable === void 0 ? (_reportPossibleCrUseOfGlobeVariable({
            error: Error()
          }), GlobeVariable) : GlobeVariable).curEnemySpiderNum++; // //出现动画
          // tween(prefab)
          //     .to(0.15, { scale: new Vec3(1, 1.2, 1) }, { easing: 'quadOut' })
          //     .to(0.05, { scale: new Vec3(scaleT, scaleT, scaleT) }, { easing: 'quadOut' })
          //     .start();
        }

        update(dt) {
          for (var index = 0; index < this.enemyList.length; index++) {
            var _enemy$getComponent;

            var enemy = this.enemyList[index];
            enemy == null || (_enemy$getComponent = enemy.getComponent(_crd && EnemySpider === void 0 ? (_reportPossibleCrUseOfEnemySpider({
              error: Error()
            }), EnemySpider) : EnemySpider)) == null || _enemy$getComponent.update(dt);
          }

          for (var _index = 0; _index < this.enemyRvoList.length; _index++) {
            var _enemy$getComponent2;

            var _enemy = this.enemyRvoList[_index];
            _enemy == null || (_enemy$getComponent2 = _enemy.getComponent(_crd && EnemySpider === void 0 ? (_reportPossibleCrUseOfEnemySpider({
              error: Error()
            }), EnemySpider) : EnemySpider)) == null || _enemy$getComponent2.update(dt);
          }
        }

      });

      //敌人列表
      EnemyController._instance = null;

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=e6e1a74b5507e48bcdb96f431ef0a7d9666fcf73.js.map