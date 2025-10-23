System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Vec3, Vec4, Singleton, EventManager, EventName, _dec, _class, _crd, ccclass, property, DataManager;

  function _reportPossibleCrUseOfSingleton(extras) {
    _reporterNs.report("Singleton", "../Base/Singleton", _context.meta, extras);
  }

  function _reportPossibleCrUseOfCameraMain(extras) {
    _reporterNs.report("CameraMain", "../Camera/CameraMain", _context.meta, extras);
  }

  function _reportPossibleCrUseOfRopeManager(extras) {
    _reporterNs.report("RopeManager", "../Repo/RopeManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfSceneManager(extras) {
    _reporterNs.report("SceneManager", "../SceneManger", _context.meta, extras);
  }

  function _reportPossibleCrUseOfEventManager(extras) {
    _reporterNs.report("EventManager", "./EventManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfEventName(extras) {
    _reporterNs.report("EventName", "../Common/Enum", _context.meta, extras);
  }

  function _reportPossibleCrUseOfSoundManager(extras) {
    _reporterNs.report("SoundManager", "../core/SoundManager", _context.meta, extras);
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
      Vec4 = _cc.Vec4;
    }, function (_unresolved_2) {
      Singleton = _unresolved_2.default;
    }, function (_unresolved_3) {
      EventManager = _unresolved_3.EventManager;
    }, function (_unresolved_4) {
      EventName = _unresolved_4.EventName;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "a04c97HM95FdYN3zY0abJtg", "DataManager", undefined);

      __checkObsolete__(['_decorator', 'Prefab', 'Vec2', 'Vec3', 'Node', 'Vec4', 'Tween']);

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
          this.sceneManger = null;
          this.soundManager = null;
          this.isMapBesastSatr = false;

          /** 主摄像机 */
          this.mainCamera = null;

          /** 电线管理类 */
          this.ropeManager = null;

          /** 当前操控的插头 */
          this.nowPlug = null;
          //当前插座
          this.nowSocket = null;

          /**所有插座节点 */
          this.socketNodes = [];

          /**所有箭头节点 */
          this.arrowNodes = [];
          this.Arrow_beast = null;
          this.Arrow_mining = null;
          this.Arrow_farmLand = null;

          /**摄像机移动限制 */

          /**
           * (-19, -40, 37.9, 22);
           * 向左滑动右边界
           * 向右滑动左边界  
           * 向下滑动上边界
           * 向上滑动下边界
           */
          // Vec4(xMax, xMin, zMax, zMin)
          this.cameraLimit = new Vec4(14, -14, 56, 23.64);

          /** 插头插座连接距离 */
          this.plugConnectDistance = 6;
          this.cloudHideDistance = 10;
          this.upgradeAnimationType = 1;
          this.upgradeTween = null;
          this.upgradeNode = null;

          /** 插头移动旋转角度 顺序对应插座 */
          this.plugMoveAngles = [new Vec3(-90, 0, 0), new Vec3(90, 90, 0), new Vec3(90, 0, 0), new Vec3(90, -90, 0), new Vec3(-90, 0, 0)];

          /** 插头最终旋转角度 顺序对应插座 */
          this.plugFinalAngles = [new Vec3(-90, 0, 0), new Vec3(90, 90, 0), new Vec3(90, 90, 0), new Vec3(125, -127, 0), new Vec3(-90, 0, 0)];

          /** 游戏结束 */
          this.isGameOver = false;
          this.leftSocket = [0, 1, 2, 3, 4];
          //当前金币数量
          this.coinNum = 0;
          //升级需要金币数量
          this.upgradeCoinNum = 900;
          //塔当前金币数量
          this.towerCoinNum = 0;
          //飞金币节点
          this.coinEndNode = null;
        }

        static get Instance() {
          return super.GetInstance();
        }

        addCoin(num) {
          if (num === void 0) {
            num = 1;
          }

          this.coinNum += num;
          (_crd && EventManager === void 0 ? (_reportPossibleCrUseOfEventManager({
            error: Error()
          }), EventManager) : EventManager).inst.emit((_crd && EventName === void 0 ? (_reportPossibleCrUseOfEventName({
            error: Error()
          }), EventName) : EventName).CoinAdd);
        }

      }) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=9f99bd5ac870ae6cca4491aa0f4c699a024bdcb1.js.map