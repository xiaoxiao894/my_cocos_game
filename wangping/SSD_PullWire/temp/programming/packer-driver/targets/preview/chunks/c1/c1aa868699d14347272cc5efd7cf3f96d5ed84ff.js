System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, _crd, PrefabPathEnum, EntityTypeEnum, EventName, PlatformEnum;

  return {
    setters: [function (_cc) {
      _cclegacy = _cc.cclegacy;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "48ecaFGOkBPa4bg3PTvefBF", "Enum", undefined);

      //prefabs路径枚举
      _export("PrefabPathEnum", PrefabPathEnum = /*#__PURE__*/function (PrefabPathEnum) {
        PrefabPathEnum["Arrow"] = "Prefab/Arrow";
        PrefabPathEnum["coinNode"] = "Prefab/xiaoPrefab/coinNode";
        return PrefabPathEnum;
      }({})); //实体类型枚举


      _export("EntityTypeEnum", EntityTypeEnum = /*#__PURE__*/function (EntityTypeEnum) {
        EntityTypeEnum["Arrow"] = "Arrow";
        EntityTypeEnum["coinNode"] = "coinNode";
        return EntityTypeEnum;
      }({}));
      /** 事件名称 */


      _export("EventName", EventName = /*#__PURE__*/function (EventName) {
        EventName["ArrowTargetVectorUpdate"] = "ArrowTargetVectorUpdate";
        EventName["PlugStateUpdate"] = "PlugStateUpdate";
        EventName["TouchSceenStart"] = "TouchSceenStart";
        EventName["GiveTowerCoin"] = "GiveTowerCoin";
        EventName["CoinAdd"] = "CoinAdd";
        EventName["TowerUpgradeButtonShow"] = "TowerUpgradeButtonShow";
        EventName["TowerUpgradeBtnClick"] = "TowerUpgradeBtnClick";
        EventName["GameOver"] = "GameOver";
        EventName["coinNumUpLimit"] = "coinNumUpLimit";
        EventName["ropeMovePoint"] = "ropeMovePoint";
        return EventName;
      }({})); //广告平台


      _export("PlatformEnum", PlatformEnum = /*#__PURE__*/function (PlatformEnum) {
        PlatformEnum["AppLovin"] = "AppLovin";
        PlatformEnum["Facebook"] = "Facebook";
        PlatformEnum["Google"] = "Google";
        PlatformEnum["IronSource"] = "IronSource";
        PlatformEnum["Liftoff"] = "Liftoff";
        PlatformEnum["Mintegral"] = "Mintegral";
        PlatformEnum["Moloco"] = "Moloco";
        PlatformEnum["Pangle"] = "Pangle";
        PlatformEnum["Rubeex"] = "Rubeex";
        PlatformEnum["Tiktok"] = "Tiktok";
        PlatformEnum["Unity"] = "Unity";
        return PlatformEnum;
      }({}));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=c1aa868699d14347272cc5efd7cf3f96d5ed84ff.js.map