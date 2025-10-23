System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, _crd, EventType;

  return {
    setters: [function (_cc) {
      _cclegacy = _cc.cclegacy;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "2c41bpB2nRIy65rfyj/OpS3", "EventType", undefined);

      // assets/scripts/framework/EventType.ts

      /**
       * 事件类型定义
       * 建议将所有事件名称集中管理，避免拼写错误
       */
      _export("EventType", EventType = /*#__PURE__*/function (EventType) {
        EventType["ENTITY_MOVE_TREE"] = "ENTITY_MOVE_TREE";
        EventType["ENTITY_MOVE_HAND_OVER"] = "ENTITY_MOVE_HAND_OVER";
        EventType["ENTITY_HAND_OVER_ADD"] = "ENTITY_HAND_OVER_ADD";
        EventType["ENTITY_TREE_COMPLATE"] = "ENTITY_TREE_COMPLATE";
        EventType["ENTITY_TREE_TRANSMIT"] = "ENTITY_TREE_TRANSMIT";
        EventType["ENTITY_CORN_CUT"] = "ENTITY_CORN_CUT";
        EventType["ENTITY_ENEMY_TRANSMIT"] = "ENTITY_ENEMY_TRANSMIT";
        EventType["ENTITY_ENEMY_DIE"] = "ENTITY_ENEMY_DIE";
        EventType["ENTITY_ENEMY_HAND_OVER"] = "ENTITY_ENEMY_HAND_OVER";
        EventType["ENTITY_CORNHAND_OVER_ADD"] = "ENTITY_CORNHAND_OVER_ADD";
        EventType["ENTITY_CORN_COMPLATE"] = "ENTITY_CORN_COMPLATE";
        EventType["ENTITY_CLICK_ENEMY"] = "ENTITY_CLICK_ENEMY";
        EventType["ENTITY_SHOW_TREEHANDE"] = "ENTITY_SHOW_TREEHANDE";
        EventType["ENTITY_ALL_DIE"] = "ENTITY_ALL_DIE";
        EventType["SHOW_ENEMY"] = "SHOW_ENEMY";
        EventType["GAME_OVER"] = "GAME_OVER";
        EventType["ENTITY_HAND_OVER_NO"] = "ENTITY_HAND_OVER_NO";
        return EventType;
      }({}));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=6a590aee9392180481fb6b2e95184cf6cf31c8b6.js.map