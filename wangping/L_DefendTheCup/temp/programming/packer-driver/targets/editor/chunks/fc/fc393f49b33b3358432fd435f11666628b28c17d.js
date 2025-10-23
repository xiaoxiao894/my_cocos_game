System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, Singleton, _crd;

  _export("default", void 0);

  return {
    setters: [function (_cc) {
      _cclegacy = _cc.cclegacy;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "d2858RpOptGbY9wJSInyXF5", "Singleton", undefined);

      _export("default", Singleton = class Singleton {
        static GetInstance() {
          if (this._instance === null) {
            this._instance = new this();
          }

          return this._instance;
        }

        constructor() {}

      });

      Singleton._instance = null;

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=fc393f49b33b3358432fd435f11666628b28c17d.js.map