System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, Vector2, Obstacle, Line, KeyValuePair, RVOMath, _crd;

  _export({
    Vector2: void 0,
    Obstacle: void 0,
    Line: void 0,
    KeyValuePair: void 0,
    RVOMath: void 0
  });

  return {
    setters: [function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "b21ab/9QsZNQ7vgDt0vtZ9T", "Common", undefined);

      __checkObsolete__(['Vec2']);

      _export("Vector2", Vector2 = class Vector2 {
        constructor(x, y) {
          this.x = 0;
          this.y = 0;
          this.x = x;
          this.y = y;
        }

        plus(vector) {
          return new Vector2(this.x + vector.x, this.y + vector.y);
        }

        minus(vector) {
          return new Vector2(this.x - vector.x, this.y - vector.y);
        }

        multiply(vector) {
          return this.x * vector.x + this.y * vector.y;
        }

        scale(k) {
          return new Vector2(this.x * k, this.y * k);
        }

        copy(v) {
          this.x = v.x;
          this.y = v.y;
          return this;
        }

        clone() {
          return new Vector2(this.x, this.y);
        }

        substract(out, other) {
          out.x -= other.x;
          out.y -= other.y;
          return out;
        }

        lengthSqr() {
          return this.x ** 2 + this.y ** 2;
        }

      });

      _export("Obstacle", Obstacle = class Obstacle {
        constructor() {
          this.next = void 0;
          this.previous = void 0;
          this.direction = void 0;
          this.point = void 0;
          this.id = void 0;
          this.convex = void 0;
        }

      });

      _export("Line", Line = class Line {
        constructor() {
          this.point = void 0;
          this.direction = void 0;
        }

      });

      _export("KeyValuePair", KeyValuePair = class KeyValuePair {
        constructor(key, value) {
          this.key = void 0;
          this.value = void 0;
          this.key = key;
          this.value = value;
        }

      });

      _export("RVOMath", RVOMath = class RVOMath {
        static absSq(v) {
          return v.multiply(v);
        }

        static normalize(v) {
          return v.scale(1 / RVOMath.abs(v)); // v / abs(v)
        }

        static distSqPointLineSegment(vector1, vector2, vector3) {
          let aux1 = vector3.minus(vector1);
          let aux2 = vector2.minus(vector1);
          let r = aux1.multiply(aux2) / RVOMath.absSq(aux2);

          if (r < 0) {
            return RVOMath.absSq(aux1);
          } else if (r > 1) {
            return RVOMath.absSq(vector3.minus(vector2));
          } else {
            return RVOMath.absSq(vector3.minus(vector1.plus(aux2.scale(r))));
          }
        }

        static sqr(p) {
          return p * p;
        }

        static det(v1, v2) {
          return v1.x * v2.y - v1.y * v2.x;
        }

        static abs(v) {
          return Math.sqrt(RVOMath.absSq(v));
        }

        static leftOf(a, b, c) {
          return RVOMath.det(a.minus(c), b.minus(a));
        }

      });

      RVOMath.RVO_EPSILON = 0.00001;

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=5f4b8be556cd44c53cb905842518ac5167fa26f9.js.map