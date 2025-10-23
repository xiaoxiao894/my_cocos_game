System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, MeshRenderer, Vec4, assert, TweenMaterial, _crd;

  _export("TweenMaterial", void 0);

  return {
    setters: [function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      MeshRenderer = _cc.MeshRenderer;
      Vec4 = _cc.Vec4;
      assert = _cc.assert;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "a4400o3ObZACq8CRh8vgL8f", "TweenMaterial", undefined);

      __checkObsolete__(['Node', 'Material', 'MeshRenderer', 'Vec4', 'renderer', 'assert', 'IVec4Like']);

      _export("TweenMaterial", TweenMaterial = class TweenMaterial {
        constructor(node, initialColor) {
          this.node = null;
          this.renderer = null;
          this.material = void 0;
          this.pass = null;
          this.mainColorHandler = 0;
          this._mainColor = null;
          this.node = node;
          this.renderer = this.node.getComponent(MeshRenderer);
          this.material = this.renderer.getMaterialInstance(0);
          this.pass = this.material.passes[0];
          this.mainColorHandler = this.pass.getHandle('mainColor');

          if (initialColor) {
            this._mainColor = Vec4.clone(initialColor);
            this.pass.setUniform(this.mainColorHandler, this._mainColor);
          } else {
            this._mainColor = new Vec4();
            this.pass.getUniform(this.mainColorHandler, this._mainColor);
          }
        }

        get mainColor() {
          assert(this.node !== null);
          return this._mainColor;
        }

        set mainColor(v) {
          var _this$pass;

          (_this$pass = this.pass) == null || _this$pass.setUniform(this.mainColorHandler, v);
        }

      });

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=2f95515413a10660ed09b1888df2f6076f2b7886.js.map