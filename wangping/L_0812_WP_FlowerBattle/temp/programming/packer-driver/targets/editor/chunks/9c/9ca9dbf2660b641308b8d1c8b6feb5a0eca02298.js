System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, v2, v3, RVOUtils, _crd;

  _export("default", void 0);

  return {
    setters: [function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      v2 = _cc.v2;
      v3 = _cc.v3;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "35406m8QkhHJaFFI6GI9yeC", "RVOUtils", undefined);

      __checkObsolete__(['v2', 'v3', 'Vec2', 'Vec3']);

      _export("default", RVOUtils = class RVOUtils {
        static simpleV2(value, out) {
          if (out) {
            out.set(value, value);
            return out;
          }

          return v2(value, value);
        }

        static simpleV3(value, out) {
          if (out) {
            out.set(value, value, value);
            return out;
          }

          return v3(value, value, value);
        }

        static v2t3(v2Data, out) {
          if (!out) {
            return v3(v2Data.x, v2Data.y, 1);
          } else {
            out.x = v2Data.x;
            out.y = 0;
            out.z = v2Data.y;
            return out;
          }
        }

        static v3t2(v3Data, out) {
          if (!out) {
            return v2(v3Data.x, v3Data.z);
          } else {
            out.x = v3Data.x;
            out.y = v3Data.z;
            return out;
          }
        }

      });

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=9ca9dbf2660b641308b8d1c8b6feb5a0eca02298.js.map