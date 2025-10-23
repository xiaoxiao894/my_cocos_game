System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, Singleton, _crd;

  _export("Singleton", void 0);

  return {
    setters: [function (_cc) {
      _cclegacy = _cc.cclegacy;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "6ba6bqmGzdH25zIo9rvxec0", "Singleton", undefined);

      _export("Singleton", Singleton = class Singleton {
        constructor() {
          var className = this.constructor.name;

          if (Singleton.instances[className]) {
            return Singleton.instances[className];
          }

          Singleton.instances[className] = this;
        }

        static getInstance() {
          if (!Singleton.instances[this.name]) {
            Singleton.instances[this.name] = new this();
          }

          return Singleton.instances[this.name];
        }

      });

      Singleton.instances = {};

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=f3f33c3d62aae0e6ef42727e9dcb5a1cf7f7a8ea.js.map