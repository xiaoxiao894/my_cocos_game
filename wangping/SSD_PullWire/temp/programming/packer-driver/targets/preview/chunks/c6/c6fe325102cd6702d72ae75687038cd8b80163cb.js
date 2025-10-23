System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, _crd, EventType, PlotName;

  return {
    setters: [function (_cc) {
      _cclegacy = _cc.cclegacy;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "5b0996hzsBGP4+t0XbOrSPq", "EventType", undefined);

      // assets/scripts/framework/EventType.ts

      /**
       * 事件类型定义
       * 建议将所有事件名称集中管理，避免拼写错误
       */
      _export("EventType", EventType = /*#__PURE__*/function (EventType) {
        EventType["MapFarmland_cloudFadeOut"] = "MapFarmland_cloudFadeOut";
        EventType["MapFarmland_cloudFadeIn"] = "MapFarmland_cloudFadeIn";
        EventType["MapFarmland_start"] = "MapFarmland_start";
        EventType["MapFarmland_fruitGreen"] = "MapFarmland_fruitGreen";
        EventType["MiningSite_cloudFadeOut"] = "MiningSite_cloudFadeOut";
        EventType["MiningSite_cloudFadeIn"] = "MiningSite_cloudFadeIn";
        EventType["MiningSite_start"] = "MiningSite_start";
        EventType["Lumberyard_cloudFadeOut"] = "Lumberyard_cloudFadeOut";
        EventType["Lumberyard_cloudFadeIn"] = "Lumberyard_cloudFadeIn";
        EventType["Lumberyard_start"] = "Lumberyard_start";
        EventType["MapBeast_cloudFadeOut"] = "MapBeast_cloudFadeOut";
        EventType["MapBeast_cloudFadeIn"] = "MapBeast_cloudFadeIn";
        EventType["MapBeast_start"] = "MapBeast_start";
        EventType["MapBeast_enemyStart"] = "MapBeast_enemyStart";
        EventType["MapBeastB_cloudFadeOut"] = "MapBeastB_cloudFadeOut";
        EventType["MapBeastB_cloudFadeIn"] = "MapBeastB_cloudFadeIn";
        EventType["MapBeastB_start"] = "MapBeastB_start";
        EventType["MapBeastB1_cloudFadeOut"] = "MapBeastB1_cloudFadeOut";
        EventType["MapBeastB1_cloudFadeIn"] = "MapBeastB1_cloudFadeIn";
        EventType["MapLand_allCloudFade"] = "MapLand_allCloudFade";
        return EventType;
      }({})); //按照解锁顺序排序 数字占位用 改成地块事件前缀


      _export("PlotName", PlotName = ["MapFarmland", "MiningSite", "MapBeast", "MapBeastB", "Lumberyard", "MapBeastB1"]);

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=c6fe325102cd6702d72ae75687038cd8b80163cb.js.map