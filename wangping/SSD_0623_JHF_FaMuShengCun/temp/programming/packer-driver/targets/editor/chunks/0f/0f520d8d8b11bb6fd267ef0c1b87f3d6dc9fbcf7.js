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
//# sourceMappingURL=0f520d8d8b11bb6fd267ef0c1b87f3d6dc9fbcf7.js.map