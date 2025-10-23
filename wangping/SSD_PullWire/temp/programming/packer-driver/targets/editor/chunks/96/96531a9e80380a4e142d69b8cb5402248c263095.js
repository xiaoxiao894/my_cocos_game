System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, DataManager, MathUtil, RopeUtils, _crd;

  function _reportPossibleCrUseOfDataManager(extras) {
    _reporterNs.report("DataManager", "../Global/DataManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfMathUtil(extras) {
    _reporterNs.report("MathUtil", "../Utils/MathUtils", _context.meta, extras);
  }

  _export("default", void 0);

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
    }, function (_unresolved_2) {
      DataManager = _unresolved_2.DataManager;
    }, function (_unresolved_3) {
      MathUtil = _unresolved_3.MathUtil;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "cab1fOPTt1FXaNV+KFBIr8/", "RopeUtils", undefined);

      __checkObsolete__(['Vec3']);

      _export("default", RopeUtils = class RopeUtils {
        // 根据坐标获取当前所处的地块索引 -1中间地块
        static getPlotIndexByPos(pos) {
          pos = (_crd && MathUtil === void 0 ? (_reportPossibleCrUseOfMathUtil({
            error: Error()
          }), MathUtil) : MathUtil).worldToLocal(pos, (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.sceneManger.node);
          let len = (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.cloudHideDistance;

          if (pos.x > len - 4) {
            if (pos.z < -len) {
              //伐木场
              return 4;
            } else if (pos.z < len) {
              //矿场
              return 1;
            }
          } else if (pos.x > -len + 2) {
            if (pos.z < -len + 4) {
              //农场
              return 0;
            } else if (pos.z > len) {
              //电厂
              return 2;
            }
          } else {
            if (pos.z > len) {
              //左下角动物地块
              return 5;
            } else if (pos.z > -len) {
              //左边油田
              return 3;
            }
          }

          return -1;
        }

      });

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=96531a9e80380a4e142d69b8cb5402248c263095.js.map