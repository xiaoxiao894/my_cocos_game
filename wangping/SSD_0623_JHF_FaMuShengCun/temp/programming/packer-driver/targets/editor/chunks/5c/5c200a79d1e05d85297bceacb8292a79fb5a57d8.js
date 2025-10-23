System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Singleton, FunTypeEnum, PlacingEnum, PlotEnum, TypeItemEnum, _dec, _class, _crd, ccclass, property, DataManager;

  function _reportPossibleCrUseOfSingleton(extras) {
    _reporterNs.report("Singleton", "../Base/Singleton", _context.meta, extras);
  }

  function _reportPossibleCrUseOfPlayerManager(extras) {
    _reporterNs.report("PlayerManager", "../Actor/PlayerManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfCameraMain(extras) {
    _reporterNs.report("CameraMain", "../Camera/CameraMain", _context.meta, extras);
  }

  function _reportPossibleCrUseOfGridSystem(extras) {
    _reporterNs.report("GridSystem", "../Grid/GridSystem", _context.meta, extras);
  }

  function _reportPossibleCrUseOfFunTypeEnum(extras) {
    _reporterNs.report("FunTypeEnum", "../Enum/Index", _context.meta, extras);
  }

  function _reportPossibleCrUseOfPlacingEnum(extras) {
    _reporterNs.report("PlacingEnum", "../Enum/Index", _context.meta, extras);
  }

  function _reportPossibleCrUseOfPlotEnum(extras) {
    _reporterNs.report("PlotEnum", "../Enum/Index", _context.meta, extras);
  }

  function _reportPossibleCrUseOfTypeItemEnum(extras) {
    _reporterNs.report("TypeItemEnum", "../Enum/Index", _context.meta, extras);
  }

  function _reportPossibleCrUseOfPillarManager(extras) {
    _reporterNs.report("PillarManager", "../pillars/PillarManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfUIPropertyManager(extras) {
    _reporterNs.report("UIPropertyManager", "../UI/UIPropertyManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfSceneManager(extras) {
    _reporterNs.report("SceneManager", "../Scene/SceneManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfConveyerBeltManager(extras) {
    _reporterNs.report("ConveyerBeltManager", "../Actor/ConveyerBeltManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfUIWarnManager(extras) {
    _reporterNs.report("UIWarnManager", "../UI/UIWarnManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfUIJoyStick(extras) {
    _reporterNs.report("UIJoyStick", "../UI/UIJoyStick", _context.meta, extras);
  }

  function _reportPossibleCrUseOfGameEndManager(extras) {
    _reporterNs.report("GameEndManager", "../UI/GameEndManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfSearchTreeManager(extras) {
    _reporterNs.report("SearchTreeManager", "../SearchSystem/SearchTreeManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfTreeManager(extras) {
    _reporterNs.report("TreeManager", "../Tree/TreeManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfWoodManager(extras) {
    _reporterNs.report("WoodManager", "../Wood/WoodManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfBoardConManager(extras) {
    _reporterNs.report("BoardConManager", "../Board/BoardConManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfMonsterConManager(extras) {
    _reporterNs.report("MonsterConManager", "../Monster/MonsterConManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfElectricTowerManager(extras) {
    _reporterNs.report("ElectricTowerManager", "../ElectricTower/ElectricTowerManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfPartnerConManager(extras) {
    _reporterNs.report("PartnerConManager", "../Actor/PartnerConManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfArrow3DManager(extras) {
    _reporterNs.report("Arrow3DManager", "../Arrow/Arrow3DManager", _context.meta, extras);
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
      Singleton = _unresolved_2.default;
    }, function (_unresolved_3) {
      FunTypeEnum = _unresolved_3.FunTypeEnum;
      PlacingEnum = _unresolved_3.PlacingEnum;
      PlotEnum = _unresolved_3.PlotEnum;
      TypeItemEnum = _unresolved_3.TypeItemEnum;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "a04c97HM95FdYN3zY0abJtg", "DataManager", undefined);

      __checkObsolete__(['_decorator', 'Prefab', 'Vec3', 'Node']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("DataManager", DataManager = (_dec = ccclass('DataManager'), _dec(_class = class DataManager extends (_crd && Singleton === void 0 ? (_reportPossibleCrUseOfSingleton({
        error: Error()
      }), Singleton) : Singleton) {
        constructor(...args) {
          super(...args);
          this.cameraGuiding = false;
          this.isConveyerBeltUpgrade = false;
          this.curCutDownTree = 0;
          // 帮手正在砍树      没在砍树 false, 正在砍树true
          this.hasHelperCuttingDownTrees = false;
          // 是否到达交付地点， false 没有前往，true 前往
          this.hasHelperReachDeliveryLocation = false;
          this.prefabMap = new Map();
          this.claimedTargets = new Set();
          // 防止重复攻击
          this.partnerConManager = void 0;
          this.electricTowerManager = void 0;
          this.monsterManager = void 0;
          this.boardManager = void 0;
          this.woodManager = void 0;
          this.treeManager = void 0;
          this.searchTreeManager = void 0;
          this.arrow3DManager = void 0;
          this.gameEndManager = void 0;
          this.uiJoyStick = void 0;
          this.uiWarnManager = void 0;
          this.conveyerBeltManager = void 0;
          this.player = void 0;
          this.sceneManager = void 0;
          this.pillarManager = void 0;
          this.UIPropertyManager = void 0;
          this.mainCamera = null;
          this.gridSystem = void 0;
          this.isNormalAttacking = true;
          // 是否可以普通攻击,    
          this.arrowTargetNode = null;
          // 箭头指向目标位置
          // 记录当前秒
          this.curReduceTemplateTimeIndex = 0;
          this.curReduceTemplateTimeArr = [2, 1.6, 1.2, 1, 0.8];
          // 是否进入提示区域？ 
          this.isEnterPromptArea = true;
          this.guideTargetIndex = -1;
          this.guideTargetList = [{
            plot: (_crd && PlotEnum === void 0 ? (_reportPossibleCrUseOfPlotEnum({
              error: Error()
            }), PlotEnum) : PlotEnum).Plot8,
            // 解锁英雄
            coinNum: 10,
            initCoinNum: 10,
            isDisplay: true
          }, {
            plot: (_crd && PlotEnum === void 0 ? (_reportPossibleCrUseOfPlotEnum({
              error: Error()
            }), PlotEnum) : PlotEnum).Plot9,
            // 左1
            coinNum: 30,
            initCoinNum: 30,
            isDisplay: false
          }, {
            plot: (_crd && PlotEnum === void 0 ? (_reportPossibleCrUseOfPlotEnum({
              error: Error()
            }), PlotEnum) : PlotEnum).Plot3,
            // 右1
            coinNum: 30,
            initCoinNum: 30,
            isDisplay: false
          }, {
            plot: (_crd && PlotEnum === void 0 ? (_reportPossibleCrUseOfPlotEnum({
              error: Error()
            }), PlotEnum) : PlotEnum).Plot2,
            // 左2
            coinNum: 60,
            initCoinNum: 60,
            isDisplay: false
          }, {
            plot: (_crd && PlotEnum === void 0 ? (_reportPossibleCrUseOfPlotEnum({
              error: Error()
            }), PlotEnum) : PlotEnum).Plot4,
            // 右2
            coinNum: 60,
            initCoinNum: 60,
            isDisplay: false
          }, {
            plot: (_crd && PlotEnum === void 0 ? (_reportPossibleCrUseOfPlotEnum({
              error: Error()
            }), PlotEnum) : PlotEnum).Plot5,
            // 升级
            coinNum: 100,
            initCoinNum: 100,
            isDisplay: false
          }];
          this.isTouching = false;
          this.isDeactivateVirtualJoystick = false;
          // 障碍物
          this.obstacleArr = [];
          // 栅栏
          this.guardrailArr = [];
          //栅栏血量
          this.guardrailBlood = 250;
          // 怪物查找范围
          this.monsterSearchRange = 5;
          // 四个门
          this.doors = [];
          // 是否开始生成武器
          this.isGenerateWeapons = false;
          // 传送带是否解锁
          this.isConveyorBeltUnlocking = false;
          // 武器队列
          this.isInWeaponDeliveryArea = false;
          // 是否结束游戏
          this.isGameEnd = false;
          // 是否开始游戏
          this.isStartGame = false;
          // 小兵 ,开关门
          this.isAllMinionsPassed = true;
          // 电塔是否攻击
          this.isTowerAttack = false;
          this.isGetCoins = false;

          /** 传送带等级 */
          this.conveyorLevel = 1;
          this.rules = [{
            colliderName: (_crd && PlotEnum === void 0 ? (_reportPossibleCrUseOfPlotEnum({
              error: Error()
            }), PlotEnum) : PlotEnum).Plot1,
            funType: (_crd && FunTypeEnum === void 0 ? (_reportPossibleCrUseOfFunTypeEnum({
              error: Error()
            }), FunTypeEnum) : FunTypeEnum).Deliver,
            placing: (_crd && PlacingEnum === void 0 ? (_reportPossibleCrUseOfPlacingEnum({
              error: Error()
            }), PlacingEnum) : PlacingEnum).WoodAccumulationCon,
            typeItem: (_crd && TypeItemEnum === void 0 ? (_reportPossibleCrUseOfTypeItemEnum({
              error: Error()
            }), TypeItemEnum) : TypeItemEnum).Wood,
            isChangValue: false
          }, {
            colliderName: (_crd && PlotEnum === void 0 ? (_reportPossibleCrUseOfPlotEnum({
              error: Error()
            }), PlotEnum) : PlotEnum).Plot2,
            funType: (_crd && FunTypeEnum === void 0 ? (_reportPossibleCrUseOfFunTypeEnum({
              error: Error()
            }), FunTypeEnum) : FunTypeEnum).Deliver,
            placing: (_crd && PlacingEnum === void 0 ? (_reportPossibleCrUseOfPlacingEnum({
              error: Error()
            }), PlacingEnum) : PlacingEnum).Plot2Con,
            typeItem: (_crd && TypeItemEnum === void 0 ? (_reportPossibleCrUseOfTypeItemEnum({
              error: Error()
            }), TypeItemEnum) : TypeItemEnum).Coin,
            isChangValue: true
          }, {
            colliderName: (_crd && PlotEnum === void 0 ? (_reportPossibleCrUseOfPlotEnum({
              error: Error()
            }), PlotEnum) : PlotEnum).Plot3,
            funType: (_crd && FunTypeEnum === void 0 ? (_reportPossibleCrUseOfFunTypeEnum({
              error: Error()
            }), FunTypeEnum) : FunTypeEnum).Deliver,
            placing: (_crd && PlacingEnum === void 0 ? (_reportPossibleCrUseOfPlacingEnum({
              error: Error()
            }), PlacingEnum) : PlacingEnum).Plot3Con,
            typeItem: (_crd && TypeItemEnum === void 0 ? (_reportPossibleCrUseOfTypeItemEnum({
              error: Error()
            }), TypeItemEnum) : TypeItemEnum).Coin,
            isChangValue: true
          }, {
            colliderName: (_crd && PlotEnum === void 0 ? (_reportPossibleCrUseOfPlotEnum({
              error: Error()
            }), PlotEnum) : PlotEnum).Plot4,
            funType: (_crd && FunTypeEnum === void 0 ? (_reportPossibleCrUseOfFunTypeEnum({
              error: Error()
            }), FunTypeEnum) : FunTypeEnum).Deliver,
            placing: (_crd && PlacingEnum === void 0 ? (_reportPossibleCrUseOfPlacingEnum({
              error: Error()
            }), PlacingEnum) : PlacingEnum).Plot4Con,
            typeItem: (_crd && TypeItemEnum === void 0 ? (_reportPossibleCrUseOfTypeItemEnum({
              error: Error()
            }), TypeItemEnum) : TypeItemEnum).Coin,
            isChangValue: true
          }, {
            colliderName: (_crd && PlotEnum === void 0 ? (_reportPossibleCrUseOfPlotEnum({
              error: Error()
            }), PlotEnum) : PlotEnum).Plot5,
            funType: (_crd && FunTypeEnum === void 0 ? (_reportPossibleCrUseOfFunTypeEnum({
              error: Error()
            }), FunTypeEnum) : FunTypeEnum).Deliver,
            placing: (_crd && PlacingEnum === void 0 ? (_reportPossibleCrUseOfPlacingEnum({
              error: Error()
            }), PlacingEnum) : PlacingEnum).Plot5Con,
            typeItem: (_crd && TypeItemEnum === void 0 ? (_reportPossibleCrUseOfTypeItemEnum({
              error: Error()
            }), TypeItemEnum) : TypeItemEnum).Coin,
            isChangValue: true
          }, {
            colliderName: (_crd && PlotEnum === void 0 ? (_reportPossibleCrUseOfPlotEnum({
              error: Error()
            }), PlotEnum) : PlotEnum).Plot6,
            funType: (_crd && FunTypeEnum === void 0 ? (_reportPossibleCrUseOfFunTypeEnum({
              error: Error()
            }), FunTypeEnum) : FunTypeEnum).Deliver,
            placing: (_crd && PlacingEnum === void 0 ? (_reportPossibleCrUseOfPlacingEnum({
              error: Error()
            }), PlacingEnum) : PlacingEnum).Plot6Con,
            typeItem: (_crd && TypeItemEnum === void 0 ? (_reportPossibleCrUseOfTypeItemEnum({
              error: Error()
            }), TypeItemEnum) : TypeItemEnum).Coin,
            isChangValue: true
          }, {
            colliderName: (_crd && PlotEnum === void 0 ? (_reportPossibleCrUseOfPlotEnum({
              error: Error()
            }), PlotEnum) : PlotEnum).Plot7,
            funType: (_crd && FunTypeEnum === void 0 ? (_reportPossibleCrUseOfFunTypeEnum({
              error: Error()
            }), FunTypeEnum) : FunTypeEnum).Collect,
            placing: (_crd && PlacingEnum === void 0 ? (_reportPossibleCrUseOfPlacingEnum({
              error: Error()
            }), PlacingEnum) : PlacingEnum).SceneCoinCon,
            typeItem: (_crd && TypeItemEnum === void 0 ? (_reportPossibleCrUseOfTypeItemEnum({
              error: Error()
            }), TypeItemEnum) : TypeItemEnum).Coin,
            isChangValue: false
          }, {
            colliderName: (_crd && PlotEnum === void 0 ? (_reportPossibleCrUseOfPlotEnum({
              error: Error()
            }), PlotEnum) : PlotEnum).Plot8,
            funType: (_crd && FunTypeEnum === void 0 ? (_reportPossibleCrUseOfFunTypeEnum({
              error: Error()
            }), FunTypeEnum) : FunTypeEnum).Deliver,
            placing: (_crd && PlacingEnum === void 0 ? (_reportPossibleCrUseOfPlacingEnum({
              error: Error()
            }), PlacingEnum) : PlacingEnum).Plot8Con,
            typeItem: (_crd && TypeItemEnum === void 0 ? (_reportPossibleCrUseOfTypeItemEnum({
              error: Error()
            }), TypeItemEnum) : TypeItemEnum).Coin,
            isChangValue: true
          }, {
            colliderName: (_crd && PlotEnum === void 0 ? (_reportPossibleCrUseOfPlotEnum({
              error: Error()
            }), PlotEnum) : PlotEnum).Plot9,
            funType: (_crd && FunTypeEnum === void 0 ? (_reportPossibleCrUseOfFunTypeEnum({
              error: Error()
            }), FunTypeEnum) : FunTypeEnum).Deliver,
            placing: (_crd && PlacingEnum === void 0 ? (_reportPossibleCrUseOfPlacingEnum({
              error: Error()
            }), PlacingEnum) : PlacingEnum).Plot9Con,
            typeItem: (_crd && TypeItemEnum === void 0 ? (_reportPossibleCrUseOfTypeItemEnum({
              error: Error()
            }), TypeItemEnum) : TypeItemEnum).Coin,
            isChangValue: true
          }];
          // 当前所在地块
          this.currentArrowPointing = null;
          // 树矩阵
          this.treeMatrix = [];
          // 解锁电塔数量
          this.unlockPowerTowersNum = 1;
          // 怪刷新速度
          this.bornTimeLimit = 0.6;
          // 电塔攻击频率
          this.bulletAttackTimeInterval = 2;
          // 怪物数量
          this.monsterNum = 20;
          // 只进入一次指引
          this.onlyGuidanceOnce = true;
          // 帮手是否解锁
          this.isUnlockHelper = false;
          // 是否继续填充木柴
          this.isContinueFillFireWood = true;
          this.quantityFirewood = 27;
          this.curQuantityFirewood = 0;
          // 当前投射木柴
          this.isEndTower = false;
          // 电塔的攻击距离
          this.electricTowerAttackRange = 15;
        }

        static get Instance() {
          return super.GetInstance();
        }

      }) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=5c200a79d1e05d85297bceacb8292a79fb5a57d8.js.map