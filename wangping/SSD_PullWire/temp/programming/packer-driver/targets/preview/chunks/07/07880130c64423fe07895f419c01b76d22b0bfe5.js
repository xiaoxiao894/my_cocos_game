System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, EventManager, _class, _crd;

  _export("EventManager", void 0);

  return {
    setters: [function (_cc) {
      _cclegacy = _cc.cclegacy;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "1ef1eEZIz9E8pDLX30iZwmn", "EventManager", undefined);

      /**
       * 事件管理
       */
      _export("EventManager", EventManager = class EventManager {
        constructor() {
          this._eventMap = new Map();
        }

        static get inst() {
          return EventManager._instance;
        }

        clear() {
          this._eventMap.clear();
        }

        on(eventName, func, ctx) {
          if (this._eventMap.has(eventName)) {
            this._eventMap.get(eventName).push({
              func,
              ctx
            });
          } else {
            this._eventMap.set(eventName, [{
              func,
              ctx
            }]);
          }
        }

        off(eventName, func, ctx) {
          if (this._eventMap.has(eventName)) {
            var events = this._eventMap.get(eventName);

            var index = events.findIndex(i => i.func === func && i.ctx === ctx);
            index > -1 && events.splice(index, 1);

            if (events.length == 0) {
              this._eventMap.delete(eventName);
            }
          } else {
            console.warn("\u4E8B\u4EF6\u89E3\u7ED1\u5931\u8D25\uFF1A\u4E8B\u4EF6\u540D\uFF08" + eventName + "\uFF09\u4E0D\u5B58\u5728");
          }
        }

        emit(eventName, detail) {
          if (this._eventMap.has(eventName)) {
            this._eventMap.get(eventName).forEach(_ref => {
              var {
                func,
                ctx
              } = _ref;
              typeof detail === 'undefined' ? func.call(ctx) : func.call(ctx, detail);
            });
          }
        }

      });

      _class = EventManager;
      EventManager._instance = new _class();

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=07880130c64423fe07895f419c01b76d22b0bfe5.js.map