System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, Vec3, v3, MathUtil, _crd, tempVec, tempVec2, tempVec3, up;

  _export("MathUtil", void 0);

  return {
    setters: [function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      Vec3 = _cc.Vec3;
      v3 = _cc.v3;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "350ab25cypAt7HtpKoQ8wf9", "MathUtil", undefined);

      __checkObsolete__(['_decorator', 'IVec3Like', 'Vec3', 'v3', 'math']);

      tempVec = v3();
      tempVec2 = v3();
      tempVec3 = v3();
      up = v3();
      /**
       * 通用数学库
       */

      _export("MathUtil", MathUtil = class MathUtil {
        static rotateAround(out, v, u, maxAngleDelta) {
          var cos = Math.cos(maxAngleDelta);
          var sin = Math.sin(maxAngleDelta);
          Vec3.multiplyScalar(tempVec, v, cos);
          Vec3.cross(tempVec2, u, v);
          Vec3.scaleAndAdd(tempVec3, tempVec, tempVec2, sin);
          var dot = Vec3.dot(u, v);
          Vec3.scaleAndAdd(out, tempVec3, u, dot * (1.0 - cos));
        }

        static rotateToward(out, from, to, maxAngleDelta) {
          Vec3.cross(up, from, to);
          this.rotateAround(out, from, up, maxAngleDelta);
        }

        static signAngle(from, to, axis) {
          var angle = Vec3.angle(from, to);
          Vec3.cross(tempVec, from, to);
          var sign = Math.sign(axis.x * tempVec.x + axis.y * tempVec.y + axis.z * tempVec.z);
          return angle * sign;
        }

        static staticgetTwoDistinctRandom(arr) {
          if (arr.length < 2) return null; // 洗牌 + 取前两个

          var shuffled = arr.slice().sort(() => Math.random() - 0.5);
          return [shuffled[0], shuffled[1]];
        }

        static bezierCurve(p0, p1, p2, t) {
          var u = 1 - t;
          var tt = t * t;
          var uu = u * u;
          var p = new Vec3();
          p.x = uu * p0.x + 2 * u * t * p1.x + tt * p2.x;
          p.y = uu * p0.y + 2 * u * t * p1.y + tt * p2.y;
          p.z = uu * p0.z + 2 * u * t * p1.z + tt * p2.z;
          return p;
        }

        static getRandom(min, max) {
          return Math.floor(Math.random() * (max - min) + min);
        }

      });

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=f73e10101ae7a644f7770c1365f086159e35cba3.js.map