System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, _dec, _class, _class2, _crd, ccclass, property, GlobeVariable;

  return {
    setters: [function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "a04c97HM95FdYN3zY0abJtg", "GlobeVariable", undefined);

      __checkObsolete__(['_decorator']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("GlobeVariable", GlobeVariable = (_dec = ccclass('GlobeVariable'), _dec(_class = (_class2 = class GlobeVariable {
        static continueGame() {
          GlobeVariable.handVoer = {
            "UI_jianta": {
              maxCoin: 5,
              //5
              curCoin: 0,
              isShow: false,
              showCoin: 0
            },
            "UI_paota": {
              maxCoin: 60,
              //60
              curCoin: 0,
              isShow: false,
              showCoin: 0
            },
            "UI_juma": {
              maxCoin: 20,
              //20
              curCoin: 0,
              isShow: false,
              showCoin: 0
            },
            "UI_juma-001": {
              maxCoin: 200,
              //200
              curCoin: 0,
              isShow: false,
              showCoin: 0
            },
            "UI_jiachong": {
              maxCoin: 150,
              //150
              curCoin: 0,
              isShow: false,
              showCoin: 0
            },
            "UI_jiachong-001": {
              maxCoin: 50,
              //50
              curCoin: 0,
              isShow: false,
              showCoin: 0
            },
            "UI_shirenhua": {
              maxCoin: 200,
              //200
              curCoin: 0,
              isShow: false,
              showCoin: 0
            }
          };
        }

      }, _class2.isTouching = false, _class2.isDeactivateVirtualJoystick = false, _class2.isGameEnd = false, _class2.isStartGame = false, _class2.isJoyStickBan = false, _class2.isCameraMove = false, _class2.isCameraMoveEnd = false, _class2.isIdel = false, _class2.isBeetleGuild = false, _class2.allEnemyNumLimit = 500, _class2.maxSquareDis = 130, _class2.bearAttackPalingNum_audio = 0, _class2.bearDiegNum_audio = 0, _class2.pylonAttackNum_audio = 0, _class2.isBlock = false, _class2.isFirstBlock = true, _class2.blockLockNum = 0, _class2.blockRest = true, _class2.initEnemyBirthPosNumLimit = 10, _class2.initEnemyBirthPosCurUnm = 0, _class2.blockIndex = 0, _class2.restQueue = false, _class2.rvoRestTime = 0.6, _class2.rvoRestTimeLimit = 0.6, _class2.beetleIsMove = false, _class2.beetleIsMoveEnemy = false, _class2.beetleLockNum = 0, _class2.enemySpiderNumBig = 10, _class2.curEnemySpiderNum = 1, _class2.bigHp = 5, _class2.beetleNumLimit = 10, _class2.beetleCurNum = 0, _class2.prefabPath = {
        // 玩家
        player: 'Prefabs/player/Player',
        // 敌人熊
        EnemyBear: 'Prefabs/xiaoPrefab/BearPrefab',
        // 敌人蜘蛛
        EnemySpider: 'Prefab/Monster/Spider',
        // 敌人蜘蛛
        EnemySpiderL: 'Prefab/Monster/Spider_L',
        // //血条
        BloodBar: 'Prefabs/UI/BloodBar',
        // 爆炸
        TX_Attack_hit: "Prefabs/TX/TX_Attack_hit",
        // 火柴箭塔
        FireArrow: "Prefab/Cons/HuoChaiGun",
        // 炮塔
        TurretBullet: "Prefab/Cons/JiaoNang",
        //冲锋甲虫
        Beetle: "Prefab/JiaChong",
        // 金币
        Coin: "Prefab/Icon/dropItem",
        // 引导箭头3d
        Guid_Arrow3D: "Prefab/Tip/Arrow",
        // 引导箭头
        Guid_ArrowPath: "Prefab/Tip/PathArrow",
        // 花瓣特效
        FlowerTx: "Prefab/TX/TX_huaban",
        // 炮塔攻击
        TurretTx: "Prefab/TX/TX_fashe",
        // 炮塔攻击
        TurretBombTx: "Prefab/TX/TX_jizhong_10",
        ArrowTX: "Prefab/TX/TX_jizhong_08",
        BeetleCollideTx: "Prefab/TX/TX_jizhong_12"
      }, _class2.entifyName = {
        // 玩家
        player: 'Player',
        // 敌人
        EnemyBear: 'BearPrefab',
        // 敌人蜘蛛
        EnemySpider: 'Spider',
        //血条
        BloodBar: 'BloodBar',
        // 爆炸
        TX_Attack_hit: "TX_Attack_hit",
        // 火柴箭塔
        FireArrow: "HuoChaiGun",
        // 炮塔
        TurretBullet: "TurretBullet",
        //冲锋甲虫
        Beetle: "JiaChong",
        // 金币
        Coin: "Coin",
        // 引导箭头
        Guid_ArrowPath: "PathArrow",
        // 花瓣特效
        FlowerTx: "TX_huaban",
        // 炮塔攻击
        TurretTx: "TX_fashe",
        // 炮塔攻击
        TurretBombTx: "TX_jizhong_10",
        ArrowTX: "TX_jizhong_08",
        // 敌人蜘蛛
        EnemySpiderL: 'Spider_L',
        BeetleCollideTx: "TX_jizhong_12"
      }, _class2.globCoinNum = 0, _class2.coinStartNum = 5, _class2.g_curArea = 1, _class2.playerLevel = 0, _class2.handVoer = {
        "UI_jianta": {
          maxCoin: 5,
          //5
          curCoin: 0,
          isShow: false,
          showCoin: 0
        },
        "UI_paota": {
          maxCoin: 60,
          //60
          curCoin: 0,
          isShow: false,
          showCoin: 0
        },
        "UI_juma": {
          maxCoin: 20,
          //20
          curCoin: 0,
          isShow: false,
          showCoin: 0
        },
        "UI_juma-001": {
          maxCoin: 200,
          //200
          curCoin: 0,
          isShow: false,
          showCoin: 0
        },
        "UI_jiachong": {
          maxCoin: 150,
          //150
          curCoin: 0,
          isShow: false,
          showCoin: 0
        },
        "UI_jiachong-001": {
          maxCoin: 50,
          //50
          curCoin: 0,
          isShow: false,
          showCoin: 0
        },
        "UI_shirenhua": {
          maxCoin: 100,
          //100
          curCoin: 0,
          isShow: false,
          showCoin: 0
        }
      }, _class2.handOverArea = ["UI_jianta", "UI_paota", "UI_juma", "UI_juma-001", "UI_jiachong", "UI_jiachong-001", "UI_shirenhua"], _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=8a694baf55c0a66cca900de8ef37993330580c3d.js.map