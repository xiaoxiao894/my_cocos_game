System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Vec3, Singleton, CollisionEntityEnum, EntityTypeEnum, _dec, _class, _crd, ccclass, property, DataManager;

  function _reportPossibleCrUseOfSingleton(extras) {
    _reporterNs.report("Singleton", "../Base/Singleton", _context.meta, extras);
  }

  function _reportPossibleCrUseOfPlayerManager(extras) {
    _reporterNs.report("PlayerManager", "../Actor/PlayerManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfCameraMain(extras) {
    _reporterNs.report("CameraMain", "../Camera/CameraMain", _context.meta, extras);
  }

  function _reportPossibleCrUseOfMonsterManager(extras) {
    _reporterNs.report("MonsterManager", "../Monster/MonsterManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfGridSystem(extras) {
    _reporterNs.report("GridSystem", "../Grid/GridSystem", _context.meta, extras);
  }

  function _reportPossibleCrUseOfCollisionEntityEnum(extras) {
    _reporterNs.report("CollisionEntityEnum", "../Enum/Index", _context.meta, extras);
  }

  function _reportPossibleCrUseOfEntityTypeEnum(extras) {
    _reporterNs.report("EntityTypeEnum", "../Enum/Index", _context.meta, extras);
  }

  function _reportPossibleCrUseOfCardConManager(extras) {
    _reporterNs.report("CardConManager", "../UI/CardConManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfPillarManager(extras) {
    _reporterNs.report("PillarManager", "../pillars/PillarManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfUIPropertyManager(extras) {
    _reporterNs.report("UIPropertyManager", "../UI/UIPropertyManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfSearchMonsters(extras) {
    _reporterNs.report("SearchMonsters", "../Actor/SearchMonsters", _context.meta, extras);
  }

  function _reportPossibleCrUseOfBossTipConMananger(extras) {
    _reporterNs.report("BossTipConMananger", "../Tip/BossTipConMananger", _context.meta, extras);
  }

  function _reportPossibleCrUseOfSceneManager(extras) {
    _reporterNs.report("SceneManager", "../Scene/SceneManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfConveyerBeltManager(extras) {
    _reporterNs.report("ConveyerBeltManager", "../Actor/ConveyerBeltManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfMinionConManager(extras) {
    _reporterNs.report("MinionConManager", "../Actor/MinionConManager", _context.meta, extras);
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

  function _reportPossibleCrUseOfArrow3DManager(extras) {
    _reporterNs.report("Arrow3DManager", "../Actor/Arrow3DManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfSoundManager(extras) {
    _reporterNs.report("SoundManager", "../Sounds/SoundManager", _context.meta, extras);
  }

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
      Vec3 = _cc.Vec3;
    }, function (_unresolved_2) {
      Singleton = _unresolved_2.default;
    }, function (_unresolved_3) {
      CollisionEntityEnum = _unresolved_3.CollisionEntityEnum;
      EntityTypeEnum = _unresolved_3.EntityTypeEnum;
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
        constructor() {
          super(...arguments);
          this.prefabMap = new Map();
          this.soundManager = void 0;
          this.arrow3DManager = void 0;
          this.gameEndManager = void 0;
          this.uiJoyStick = void 0;
          this.uiWarnManager = void 0;
          this.conveyerBeltManager = void 0;
          this.player = void 0;
          this.sceneManager = void 0;
          this.monsterManager = void 0;
          this.searchMonsters = void 0;
          this.pillarManager = void 0;
          this.UIPropertyManager = void 0;
          this.mainCamera = null;
          this.gridSystem = void 0;
          this.cardConManager = void 0;
          this.isNormalAttacking = true;
          // 是否可以普通攻击,    
          this.arrowTargetNode = null;
          // 箭头指向目标位置
          this.BossTipConManager = void 0;
          this.MinionConManager = void 0;
          this.cardDatas = [{
            card: (_crd && EntityTypeEnum === void 0 ? (_reportPossibleCrUseOfEntityTypeEnum({
              error: Error()
            }), EntityTypeEnum) : EntityTypeEnum).Card1,
            partner: (_crd && EntityTypeEnum === void 0 ? (_reportPossibleCrUseOfEntityTypeEnum({
              error: Error()
            }), EntityTypeEnum) : EntityTypeEnum).Partner1
          }, {
            card: (_crd && EntityTypeEnum === void 0 ? (_reportPossibleCrUseOfEntityTypeEnum({
              error: Error()
            }), EntityTypeEnum) : EntityTypeEnum).Card2,
            partner: (_crd && EntityTypeEnum === void 0 ? (_reportPossibleCrUseOfEntityTypeEnum({
              error: Error()
            }), EntityTypeEnum) : EntityTypeEnum).Partner2
          }, {
            card: (_crd && EntityTypeEnum === void 0 ? (_reportPossibleCrUseOfEntityTypeEnum({
              error: Error()
            }), EntityTypeEnum) : EntityTypeEnum).Card3,
            partner: (_crd && EntityTypeEnum === void 0 ? (_reportPossibleCrUseOfEntityTypeEnum({
              error: Error()
            }), EntityTypeEnum) : EntityTypeEnum).Partner3
          }];
          this.guideTargetIndex = -1;
          this.guideTargetList = [];
          this.isTouching = false;
          this.isDeactivateVirtualJoystick = false;
          this.landParcelRules = [{
            name: (_crd && CollisionEntityEnum === void 0 ? (_reportPossibleCrUseOfCollisionEntityEnum({
              error: Error()
            }), CollisionEntityEnum) : CollisionEntityEnum).DeliveryAreas1,
            // 地块名称
            iconNumber: 5,
            // 需要金币数量 
            isUnlockPartners: false // 是否解锁伙伴

          }, {
            name: (_crd && CollisionEntityEnum === void 0 ? (_reportPossibleCrUseOfCollisionEntityEnum({
              error: Error()
            }), CollisionEntityEnum) : CollisionEntityEnum).DeliveryAreas2,
            // 地块名称
            iconNumber: 5,
            // 需要金币数量 
            isUnlockPartners: false // 是否解锁伙伴

          }, {
            name: (_crd && CollisionEntityEnum === void 0 ? (_reportPossibleCrUseOfCollisionEntityEnum({
              error: Error()
            }), CollisionEntityEnum) : CollisionEntityEnum).DeliveryAreas3,
            // 地块名称
            iconNumber: 25,
            // 需要金币数量 
            isUnlockPartners: true // 是否解锁伙伴

          }, {
            name: (_crd && CollisionEntityEnum === void 0 ? (_reportPossibleCrUseOfCollisionEntityEnum({
              error: Error()
            }), CollisionEntityEnum) : CollisionEntityEnum).DeliveryAreas4,
            // 地块名称
            iconNumber: 25,
            // 需要金币数量 
            isUnlockPartners: true // 是否解锁伙伴

          }, {
            name: (_crd && CollisionEntityEnum === void 0 ? (_reportPossibleCrUseOfCollisionEntityEnum({
              error: Error()
            }), CollisionEntityEnum) : CollisionEntityEnum).DeliveryAreas5,
            // 地块名称
            iconNumber: 25,
            // 需要金币数量 
            isUnlockPartners: true // 是否解锁伙伴

          }, {
            name: (_crd && CollisionEntityEnum === void 0 ? (_reportPossibleCrUseOfCollisionEntityEnum({
              error: Error()
            }), CollisionEntityEnum) : CollisionEntityEnum).DeliveryAreas6,
            // 地块名称
            iconNumber: 40,
            // 需要金币数量        只要有一个角色解锁，这个就显示   解锁这个解锁场景1，
            isUnlockPartners: false // 是否解锁伙伴

          }, {
            name: (_crd && CollisionEntityEnum === void 0 ? (_reportPossibleCrUseOfCollisionEntityEnum({
              error: Error()
            }), CollisionEntityEnum) : CollisionEntityEnum).DeliveryAreas7,
            // 地块名称
            iconNumber: 45,
            // 需要金币数量         解锁铁匠铺         送一个弓之后  解锁60出暗送带，80下一个
            isUnlockPartners: false // 是否解锁伙伴

          }, {
            name: (_crd && CollisionEntityEnum === void 0 ? (_reportPossibleCrUseOfCollisionEntityEnum({
              error: Error()
            }), CollisionEntityEnum) : CollisionEntityEnum).DeliveryAreas8,
            // 地块名称
            iconNumber: 25,
            // 需要金币数量        
            isUnlockPartners: false // 是否解锁伙伴

          }, {
            name: (_crd && CollisionEntityEnum === void 0 ? (_reportPossibleCrUseOfCollisionEntityEnum({
              error: Error()
            }), CollisionEntityEnum) : CollisionEntityEnum).DeliveryAreas9,
            // 地块名称
            iconNumber: 60,
            // 需要金币数量 
            isUnlockPartners: false // 是否解锁伙伴

          }, {
            name: (_crd && CollisionEntityEnum === void 0 ? (_reportPossibleCrUseOfCollisionEntityEnum({
              error: Error()
            }), CollisionEntityEnum) : CollisionEntityEnum).DeliveryAreas10,
            // 地块名称
            iconNumber: 80,
            // 需要金币数量                   解锁场景2，  结束
            isUnlockPartners: false // 是否解锁伙伴

          }];
          // 武器位置坐标
          this.weaponPos = [{
            pos: new Vec3(-0.918, -1.139, -2.053)
          }, {
            pos: new Vec3(0.29, -1.139, -2.053)
          }, {
            pos: new Vec3(1.517, -1.139, -2.053)
          }];
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
          // 特效名字对应
          this.skillName = [{
            name: "Partner1-L",
            skill: "",
            effects: ""
          }, {
            name: "Partner2-L",
            skill: "",
            effects: ""
          }, {
            name: "Partner3-L",
            skill: "",
            effects: ""
          }, {
            name: "Partner4-L",
            skill: "",
            effects: ""
          }, {
            name: "Partner5-L",
            skill: "",
            effects: ""
          }];
          // 武器队列
          this.isInWeaponDeliveryArea = false;
          // 是否结束游戏
          this.isGameEnd = false;
          // 是否开始游戏
          this.isStartGame = false;
          // 小兵 ,开关门
          this.isAllMinionsPassed = true;
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
//# sourceMappingURL=38fe8fc128520c1627e75d32fbffca9988edda84.js.map