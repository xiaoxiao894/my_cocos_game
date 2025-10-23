System.register(["__unresolved_0", "cc"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, Global, _crd;

  function _reportPossibleCrUseOfSoundManager(extras) {
    _reporterNs.report("SoundManager", "../SoundManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfUIWarnManager(extras) {
    _reporterNs.report("UIWarnManager", "../UIWarnManager", _context.meta, extras);
  }

  _export("Global", void 0);

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "c7e99tDzotELodeip+xvqKx", "Global", undefined);

      _export("Global", Global = class Global {});

      // public static isFirstTreeFland:boolean = true;
      // public static isStartGame:boolean = false;
      Global.isAttackWarn = false;
      Global.soundManager = null;
      Global.characterFindTree = 1;
      //人物按顺序砍树 共四个 循环
      Global.characterPrefabPath = "Prefab/Player";
      Global.woodPrefabPath = "Prefab/Wood";
      Global.cornPrefabPath = "Prefab/yumi1";
      Global.isPlayHouseAnimation = false;
      Global.treeHandOverNum = 0;
      Global.treeHandOverNumLimit = 50;
      Global.playerBodyWood = 0;
      Global.playerBodyWoodTest = 0;
      Global.clickCornLand = [0, 0, 0, 0, 0];
      //下标0的位置不用
      Global.playerBodyWoodAll = 0;
      Global.playerBodyCornAll = 0;
      Global.clickNum = 1;
      Global.cornHandOverNum = 0;
      Global.cornHandOverNumLimit = 50;
      Global.cornUnlock = [0, 0, 0, 0];
      Global.isEnemyCutTree = false;
      //敌人地块的树是否可以砍伐
      Global.isUpgrade = false;
      //是否升级
      Global.isMoveCamreToCorn = true;

      /**移动到敌人地块摄像机的移动保证只调用一次 */
      Global.isFirstEnemyLand = false;

      /**在玉米地块开始移动到怪物地块时候停止当前动作以防报错 */
      Global.isStartMoveEnemyLand = false;

      /**在敌人地块砍伐树木需要时机的 */
      Global.isClickUpLandTree = true;
      //是否可以点击树 到玉米地块时候不能点击上一个地块的树
      Global.isClickUpLandCorn = true;
      //是否可以点玉米 到敌人地块时候不能点击上一个地块的玉米
      Global.isClickEnemy = false;
      //是否可以点击敌人地块上的树
      Global.characterPosNum = 0;
      //人物位置
      Global.upgradeUIAnimtion = 0;
      // 1 未达到升级数量左右动画  2 中间状态  3 交付呼吸状态 4 中间状态  5 交付未升级暂停动画
      Global.upgradeAnimationgPlayTyep = 1;
      //1 是第一个地块  2 是最后一个地块
      Global.warnUI = null;
      Global.isClickUpgrade = false;
      Global.isClickUpgradeEnemy = false;
      Global.isClickEnemy1 = false;
      Global.isClickEnemy2 = false;
      Global.isClickEnemy3 = false;
      Global.isClickEnemy4 = false;
      Global.isLandNum = 0;
      Global.enemyDieNum = 0;
      Global.treeHandOver = false;
      Global.showTreeUI = false;
      Global.showTreeUINode = null;

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=cc9bada69b7123f8aeb14d25d74fe14290c8f71b.js.map