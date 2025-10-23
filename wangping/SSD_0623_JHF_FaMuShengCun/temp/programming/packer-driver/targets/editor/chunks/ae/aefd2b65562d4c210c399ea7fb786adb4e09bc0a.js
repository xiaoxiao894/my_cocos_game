System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, StackSlot, _crd;

  _export("StackSlot", void 0);

  return {
    setters: [function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "295b0XIDw9Ewo3n7Sx6Tw2j", "StackSlot", undefined);

      // StackSlot.ts
      __checkObsolete__(['Vec3', 'Node']);

      _export("StackSlot", StackSlot = class StackSlot {
        constructor(pos) {
          this.position = void 0;
          this.assignedNode = null;
          this.reservedNode = void 0;
          this.position = pos;
        }

        get isOccupied() {
          return this.assignedNode !== null;
        }

        release() {
          this.assignedNode = null;
        }

      });

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=aefd2b65562d4c210c399ea7fb786adb4e09bc0a.js.map