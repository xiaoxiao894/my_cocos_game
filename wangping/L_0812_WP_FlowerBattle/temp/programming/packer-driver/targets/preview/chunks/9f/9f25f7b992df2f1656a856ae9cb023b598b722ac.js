System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3", "__unresolved_4", "__unresolved_5", "__unresolved_6", "__unresolved_7", "__unresolved_8", "__unresolved_9"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, App, Simulator, GlobeVariable, RVOObstacles, Vector2, Flower, EventManager, EventType, PlayerAttackFlower, _dec, _class, _crd, ccclass, property, GameManager;

  function _reportPossibleCrUseOfApp(extras) {
    _reporterNs.report("App", "./App", _context.meta, extras);
  }

  function _reportPossibleCrUseOfSimulator(extras) {
    _reporterNs.report("Simulator", "./RVO/Simulator", _context.meta, extras);
  }

  function _reportPossibleCrUseOfGlobeVariable(extras) {
    _reporterNs.report("GlobeVariable", "./core/GlobeVariable", _context.meta, extras);
  }

  function _reportPossibleCrUseOfRVOObstacles(extras) {
    _reporterNs.report("RVOObstacles", "./RVO/RVOObstacles", _context.meta, extras);
  }

  function _reportPossibleCrUseOfVector(extras) {
    _reporterNs.report("Vector2", "./RVO/Common", _context.meta, extras);
  }

  function _reportPossibleCrUseOfFlower(extras) {
    _reporterNs.report("Flower", "./Entitys/Flower", _context.meta, extras);
  }

  function _reportPossibleCrUseOfEventManager(extras) {
    _reporterNs.report("EventManager", "./core/EventManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfEventType(extras) {
    _reporterNs.report("EventType", "./core/EventType", _context.meta, extras);
  }

  function _reportPossibleCrUseOfPlayerAttackFlower(extras) {
    _reporterNs.report("PlayerAttackFlower", "./Entitys/PlayerAttackFlower", _context.meta, extras);
  }

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
    }, function (_unresolved_2) {
      App = _unresolved_2.App;
    }, function (_unresolved_3) {
      Simulator = _unresolved_3.Simulator;
    }, function (_unresolved_4) {
      GlobeVariable = _unresolved_4.GlobeVariable;
    }, function (_unresolved_5) {
      RVOObstacles = _unresolved_5.default;
    }, function (_unresolved_6) {
      Vector2 = _unresolved_6.Vector2;
    }, function (_unresolved_7) {
      Flower = _unresolved_7.Flower;
    }, function (_unresolved_8) {
      EventManager = _unresolved_8.EventManager;
    }, function (_unresolved_9) {
      EventType = _unresolved_9.EventType;
    }, function (_unresolved_10) {
      PlayerAttackFlower = _unresolved_10.PlayerAttackFlower;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "9247fnHse1MBbY+w+sWe6Y6", "GameManager", undefined);

      __checkObsolete__(['_decorator']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("GameManager", GameManager = (_dec = ccclass('GameManager'), _dec(_class = class GameManager {
        constructor() {
          this.isStatrGame = false;
          this.delayedTime = 0.8;
          this.addTime = 0;
          this.beetleDelayedTime = 0.3;
          this.beetleAddTime = 0;
          this.blockTime = 0;
          this.blockDelayedTime = 1;
          this.temp = 1;
        }

        continueGame() {
          //  this.isStatrGame = false;
          this.delayedTime = 0.6;
          this.addTime = 0;
          var characterData = (_crd && App === void 0 ? (_reportPossibleCrUseOfApp({
            error: Error()
          }), App) : App).dataManager.getCharacterById(4);

          if (characterData) {
            this.beetleDelayedTime = characterData.attackInterval;
            this.beetleAddTime = characterData.attackInterval;
          }

          if (characterData.maxNum != -1) {
            (_crd && GlobeVariable === void 0 ? (_reportPossibleCrUseOfGlobeVariable({
              error: Error()
            }), GlobeVariable) : GlobeVariable).beetleNumLimit = characterData.maxNum;
          }

          this.blockTime = 0;
          this.blockDelayedTime = 1;
          (_crd && App === void 0 ? (_reportPossibleCrUseOfApp({
            error: Error()
          }), App) : App).mapShowController.continueGame();
          (_crd && App === void 0 ? (_reportPossibleCrUseOfApp({
            error: Error()
          }), App) : App).playerController.continueGame();
          (_crd && App === void 0 ? (_reportPossibleCrUseOfApp({
            error: Error()
          }), App) : App).dropController.continueGame();
          (_crd && App === void 0 ? (_reportPossibleCrUseOfApp({
            error: Error()
          }), App) : App).guideManager.continueGame();
          (_crd && GlobeVariable === void 0 ? (_reportPossibleCrUseOfGlobeVariable({
            error: Error()
          }), GlobeVariable) : GlobeVariable).continueGame();
          (_crd && App === void 0 ? (_reportPossibleCrUseOfApp({
            error: Error()
          }), App) : App).sceneNode.enemyParent.children.forEach(item => {
            item.removeFromParent();
            item.destroy();
          });
          (_crd && App === void 0 ? (_reportPossibleCrUseOfApp({
            error: Error()
          }), App) : App).sceneNode.bloodParent.children.forEach(item => {
            item.removeFromParent();
            item.destroy();
          });
          (_crd && App === void 0 ? (_reportPossibleCrUseOfApp({
            error: Error()
          }), App) : App).sceneNode.effectParent.children.forEach(item => {
            item.removeFromParent();
            item.destroy();
          });
          (_crd && App === void 0 ? (_reportPossibleCrUseOfApp({
            error: Error()
          }), App) : App).sceneNode.coinParent.children.forEach(item => {
            item.removeFromParent();
            item.destroy();
          });
          (_crd && App === void 0 ? (_reportPossibleCrUseOfApp({
            error: Error()
          }), App) : App).sceneNode.enemyParent.removeAllChildren();
          (_crd && App === void 0 ? (_reportPossibleCrUseOfApp({
            error: Error()
          }), App) : App).enemyController.continueGame();
          (_crd && App === void 0 ? (_reportPossibleCrUseOfApp({
            error: Error()
          }), App) : App).sceneNode.coinParent.removeAllChildren();
          (_crd && App === void 0 ? (_reportPossibleCrUseOfApp({
            error: Error()
          }), App) : App).sceneNode.effectParent.removeAllChildren();
          (_crd && App === void 0 ? (_reportPossibleCrUseOfApp({
            error: Error()
          }), App) : App).sceneNode.guideParent.removeAllChildren();
          (_crd && App === void 0 ? (_reportPossibleCrUseOfApp({
            error: Error()
          }), App) : App).sceneNode.flower.getComponent(_crd && Flower === void 0 ? (_reportPossibleCrUseOfFlower({
            error: Error()
          }), Flower) : Flower).continueGame();
          (_crd && App === void 0 ? (_reportPossibleCrUseOfApp({
            error: Error()
          }), App) : App).sceneNode.attackFlower.getComponent(_crd && PlayerAttackFlower === void 0 ? (_reportPossibleCrUseOfPlayerAttackFlower({
            error: Error()
          }), PlayerAttackFlower) : PlayerAttackFlower).continueGame();
          (_crd && App === void 0 ? (_reportPossibleCrUseOfApp({
            error: Error()
          }), App) : App).sceneNode.GameEnd.active = false;
          (_crd && GlobeVariable === void 0 ? (_reportPossibleCrUseOfGlobeVariable({
            error: Error()
          }), GlobeVariable) : GlobeVariable).isGameEnd = false;
          (_crd && App === void 0 ? (_reportPossibleCrUseOfApp({
            error: Error()
          }), App) : App).sceneNode.enemyParent.active = false;
          (_crd && GlobeVariable === void 0 ? (_reportPossibleCrUseOfGlobeVariable({
            error: Error()
          }), GlobeVariable) : GlobeVariable).isStartGame = false; //拦截拒马是否存在

          (_crd && GlobeVariable === void 0 ? (_reportPossibleCrUseOfGlobeVariable({
            error: Error()
          }), GlobeVariable) : GlobeVariable).initEnemyBirthPosCurUnm = 0;
          (_crd && GlobeVariable === void 0 ? (_reportPossibleCrUseOfGlobeVariable({
            error: Error()
          }), GlobeVariable) : GlobeVariable).isBlock = false;
          (_crd && GlobeVariable === void 0 ? (_reportPossibleCrUseOfGlobeVariable({
            error: Error()
          }), GlobeVariable) : GlobeVariable).isFirstBlock = true;
          (_crd && GlobeVariable === void 0 ? (_reportPossibleCrUseOfGlobeVariable({
            error: Error()
          }), GlobeVariable) : GlobeVariable).blockLockNum = 0;
          (_crd && GlobeVariable === void 0 ? (_reportPossibleCrUseOfGlobeVariable({
            error: Error()
          }), GlobeVariable) : GlobeVariable).blockRest = true; //拒马交付区域是否显示

          (_crd && GlobeVariable === void 0 ? (_reportPossibleCrUseOfGlobeVariable({
            error: Error()
          }), GlobeVariable) : GlobeVariable).blockIndex = 0;
          (_crd && GlobeVariable === void 0 ? (_reportPossibleCrUseOfGlobeVariable({
            error: Error()
          }), GlobeVariable) : GlobeVariable).restQueue = false;
          (_crd && GlobeVariable === void 0 ? (_reportPossibleCrUseOfGlobeVariable({
            error: Error()
          }), GlobeVariable) : GlobeVariable).rvoRestTime = 0.6;
          (_crd && GlobeVariable === void 0 ? (_reportPossibleCrUseOfGlobeVariable({
            error: Error()
          }), GlobeVariable) : GlobeVariable).rvoRestTimeLimit = 0.6;
          (_crd && GlobeVariable === void 0 ? (_reportPossibleCrUseOfGlobeVariable({
            error: Error()
          }), GlobeVariable) : GlobeVariable).beetleIsMove = false;
          (_crd && GlobeVariable === void 0 ? (_reportPossibleCrUseOfGlobeVariable({
            error: Error()
          }), GlobeVariable) : GlobeVariable).beetleIsMoveEnemy = false; //甲虫的引导是否结束 结束第一次时候移动想镜头

          (_crd && GlobeVariable === void 0 ? (_reportPossibleCrUseOfGlobeVariable({
            error: Error()
          }), GlobeVariable) : GlobeVariable).isBeetleGuild = false;
          (_crd && GlobeVariable === void 0 ? (_reportPossibleCrUseOfGlobeVariable({
            error: Error()
          }), GlobeVariable) : GlobeVariable).beetleLockNum = 0;
          (_crd && GlobeVariable === void 0 ? (_reportPossibleCrUseOfGlobeVariable({
            error: Error()
          }), GlobeVariable) : GlobeVariable).enemySpiderNumBig = 10;
          (_crd && GlobeVariable === void 0 ? (_reportPossibleCrUseOfGlobeVariable({
            error: Error()
          }), GlobeVariable) : GlobeVariable).curEnemySpiderNum = 1;
          (_crd && GlobeVariable === void 0 ? (_reportPossibleCrUseOfGlobeVariable({
            error: Error()
          }), GlobeVariable) : GlobeVariable).bigHp = 5;
          (_crd && GlobeVariable === void 0 ? (_reportPossibleCrUseOfGlobeVariable({
            error: Error()
          }), GlobeVariable) : GlobeVariable).beetleNumLimit = 10;
          (_crd && GlobeVariable === void 0 ? (_reportPossibleCrUseOfGlobeVariable({
            error: Error()
          }), GlobeVariable) : GlobeVariable).beetleCurNum = 0;
          (_crd && GlobeVariable === void 0 ? (_reportPossibleCrUseOfGlobeVariable({
            error: Error()
          }), GlobeVariable) : GlobeVariable).globCoinNum = 0; //金币初始数量

          (_crd && GlobeVariable === void 0 ? (_reportPossibleCrUseOfGlobeVariable({
            error: Error()
          }), GlobeVariable) : GlobeVariable).coinStartNum = 5; //当前碰撞的区域

          (_crd && GlobeVariable === void 0 ? (_reportPossibleCrUseOfGlobeVariable({
            error: Error()
          }), GlobeVariable) : GlobeVariable).g_curArea = 1;
          (_crd && GlobeVariable === void 0 ? (_reportPossibleCrUseOfGlobeVariable({
            error: Error()
          }), GlobeVariable) : GlobeVariable).playerLevel = 0;
          (_crd && EventManager === void 0 ? (_reportPossibleCrUseOfEventManager({
            error: Error()
          }), EventManager) : EventManager).instance.emit((_crd && EventType === void 0 ? (_reportPossibleCrUseOfEventType({
            error: Error()
          }), EventType) : EventType).ContinueCoin);
          this.startGame();
        }

        startGame() {
          (_crd && App === void 0 ? (_reportPossibleCrUseOfApp({
            error: Error()
          }), App) : App).guideManager.init();
          this.isStatrGame = true; //     App.palingAttack.setPaling(1);

          (_crd && Simulator === void 0 ? (_reportPossibleCrUseOfSimulator({
            error: Error()
          }), Simulator) : Simulator).instance.setAgentDefaults(60, 3, 1, 0.1, 14, 80, new (_crd && Vector2 === void 0 ? (_reportPossibleCrUseOfVector({
            error: Error()
          }), Vector2) : Vector2)(0, 0));
          this.addRvoObstacle();
          var characterData = (_crd && App === void 0 ? (_reportPossibleCrUseOfApp({
            error: Error()
          }), App) : App).dataManager.getCharacterById(4);

          if (characterData) {
            this.beetleDelayedTime = characterData.attackInterval;
            this.beetleAddTime = characterData.attackInterval;
          }

          if (characterData.maxNum != -1) {
            (_crd && GlobeVariable === void 0 ? (_reportPossibleCrUseOfGlobeVariable({
              error: Error()
            }), GlobeVariable) : GlobeVariable).beetleNumLimit = characterData.maxNum;
          }
        } // 添加障碍物


        addRvoObstacle() {
          var obstacleParrent = (_crd && App === void 0 ? (_reportPossibleCrUseOfApp({
            error: Error()
          }), App) : App).sceneNode.obstacleParrent;
          obstacleParrent.children.forEach(item => {
            (_crd && RVOObstacles === void 0 ? (_reportPossibleCrUseOfRVOObstacles({
              error: Error()
            }), RVOObstacles) : RVOObstacles).addOneObstacle(item);
          }); // RVOObstacles.addOneObstacle(level_1);  

          (_crd && Simulator === void 0 ? (_reportPossibleCrUseOfSimulator({
            error: Error()
          }), Simulator) : Simulator).instance.processObstacles();
        }

        //当前出生的怪物数量
        update(dt) {
          if ((_crd && GlobeVariable === void 0 ? (_reportPossibleCrUseOfGlobeVariable({
            error: Error()
          }), GlobeVariable) : GlobeVariable).isGameEnd) return;

          if (!(_crd && GlobeVariable === void 0 ? (_reportPossibleCrUseOfGlobeVariable({
            error: Error()
          }), GlobeVariable) : GlobeVariable).blockRest) {
            this.blockTime += dt;

            if (this.blockTime >= this.blockDelayedTime) {
              this.blockTime = 0;
              (_crd && GlobeVariable === void 0 ? (_reportPossibleCrUseOfGlobeVariable({
                error: Error()
              }), GlobeVariable) : GlobeVariable).blockRest = true;
              (_crd && App === void 0 ? (_reportPossibleCrUseOfApp({
                error: Error()
              }), App) : App).mapShowController.restBlock1();
            }
          }

          if (this.isStatrGame) {
            this.addTime += dt; //间隔多少秒创建一波怪

            if (this.addTime >= this.delayedTime) {
              this.addTime = 0;
              this.temp++;
              if ((_crd && App === void 0 ? (_reportPossibleCrUseOfApp({
                error: Error()
              }), App) : App).enemyController.getEnemyList().length + (_crd && App === void 0 ? (_reportPossibleCrUseOfApp({
                error: Error()
              }), App) : App).enemyController.getEnemyRvoList().length >= (_crd && GlobeVariable === void 0 ? (_reportPossibleCrUseOfGlobeVariable({
                error: Error()
              }), GlobeVariable) : GlobeVariable).allEnemyNumLimit) return; // if (!GlobeVariable.beetleIsMoveEnemy) {

              this.produceEnemySpider(); // }
            } // rvo 更新逻辑坐标


            (_crd && Simulator === void 0 ? (_reportPossibleCrUseOfSimulator({
              error: Error()
            }), Simulator) : Simulator).instance.run(dt);
            (_crd && App === void 0 ? (_reportPossibleCrUseOfApp({
              error: Error()
            }), App) : App).enemyController.update(dt); // this.playerAttackEnemy();

            (_crd && App === void 0 ? (_reportPossibleCrUseOfApp({
              error: Error()
            }), App) : App).playerController.update(dt);
            (_crd && App === void 0 ? (_reportPossibleCrUseOfApp({
              error: Error()
            }), App) : App).beetleController.update(dt);
            (_crd && App === void 0 ? (_reportPossibleCrUseOfApp({
              error: Error()
            }), App) : App).guideManager.update(dt);
          }

          if ((_crd && GlobeVariable === void 0 ? (_reportPossibleCrUseOfGlobeVariable({
            error: Error()
          }), GlobeVariable) : GlobeVariable).beetleIsMove) {
            (_crd && GlobeVariable === void 0 ? (_reportPossibleCrUseOfGlobeVariable({
              error: Error()
            }), GlobeVariable) : GlobeVariable).beetleIsMoveEnemy = true;
            this.beetleAddTime += dt;

            if (this.beetleAddTime >= this.beetleDelayedTime) {
              this.beetleAddTime = 0;

              if ((_crd && GlobeVariable === void 0 ? (_reportPossibleCrUseOfGlobeVariable({
                error: Error()
              }), GlobeVariable) : GlobeVariable).beetleCurNum >= (_crd && GlobeVariable === void 0 ? (_reportPossibleCrUseOfGlobeVariable({
                error: Error()
              }), GlobeVariable) : GlobeVariable).beetleNumLimit) {
                // GlobeVariable.beetleNumLimit = 10;
                (_crd && GlobeVariable === void 0 ? (_reportPossibleCrUseOfGlobeVariable({
                  error: Error()
                }), GlobeVariable) : GlobeVariable).beetleCurNum = 0;
                (_crd && GlobeVariable === void 0 ? (_reportPossibleCrUseOfGlobeVariable({
                  error: Error()
                }), GlobeVariable) : GlobeVariable).beetleIsMove = false;
                setTimeout(() => {
                  (_crd && App === void 0 ? (_reportPossibleCrUseOfApp({
                    error: Error()
                  }), App) : App).mapShowController.showBeetleBubble();
                }, 300);
              }

              (_crd && App === void 0 ? (_reportPossibleCrUseOfApp({
                error: Error()
              }), App) : App).beetleController.creatBeetleByLevel();
            }
          }
        }

        produceEnemySpider() {
          (_crd && App === void 0 ? (_reportPossibleCrUseOfApp({
            error: Error()
          }), App) : App).enemyController.creatEnemyByLevel(1);
        }

      }) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=9f25f7b992df2f1656a856ae9cb023b598b722ac.js.map