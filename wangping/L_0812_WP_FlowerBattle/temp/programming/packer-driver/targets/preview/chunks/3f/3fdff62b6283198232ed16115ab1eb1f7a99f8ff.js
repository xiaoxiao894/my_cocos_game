System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, _crd, EventType;

  return {
    setters: [function (_cc) {
      _cclegacy = _cc.cclegacy;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "738cc6yuCVAF6KyNBEgTnsw", "EventType", undefined);

      // assets/scripts/framework/EventType.ts

      /**
       * 事件类型定义
       * 建议将所有事件名称集中管理，避免拼写错误
       */
      _export("EventType", EventType = /*#__PURE__*/function (EventType) {
        EventType["CoinAdd"] = "CoinAdd";
        EventType["CoinSub"] = "CoinSub";
        EventType["ContinueCoin"] = "ContinueCoin";
        return EventType;
      }({}));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=3fdff62b6283198232ed16115ab1eb1f7a99f8ff.js.map