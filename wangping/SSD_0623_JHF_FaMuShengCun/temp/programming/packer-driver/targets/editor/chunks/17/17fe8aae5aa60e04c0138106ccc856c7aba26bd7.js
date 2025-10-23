System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, _dec, _class, _class2, _crd, ccclass, property, VirtualInput;

  return {
    setters: [function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "059856HneFB+YKhK6Sg/z1U", "VirtuallInput", undefined);

      __checkObsolete__(['_decorator']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("VirtualInput", VirtualInput = (_dec = ccclass('VirtualInput'), _dec(_class = (_class2 = class VirtualInput {
        static get horizontal() {
          return this._horizontal;
        }

        static set horizontal(val) {
          this._horizontal = val;
        }

        static get vertical() {
          return this._vertical;
        }

        static set vertical(val) {
          this._vertical = val;
        }

      }, _class2._horizontal = 0, _class2._vertical = 0, _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=17fe8aae5aa60e04c0138106ccc856c7aba26bd7.js.map