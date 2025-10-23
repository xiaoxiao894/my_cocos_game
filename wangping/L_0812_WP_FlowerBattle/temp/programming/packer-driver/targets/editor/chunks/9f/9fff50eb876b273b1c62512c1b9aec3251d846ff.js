System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Vec3, _dec, _class, _crd, ccclass, property, Arrow3D;

  return {
    setters: [function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
      Component = _cc.Component;
      Vec3 = _cc.Vec3;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "af633QqRldOyLm+hHzPfqp3", "Arrow3D", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Node', 'Vec3']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("Arrow3D", Arrow3D = (_dec = ccclass('Arrow3D'), _dec(_class = class Arrow3D extends Component {
        constructor(...args) {
          super(...args);
          this._floatingTime = 0;
          this._floatingRotateY = 0;
          this._floatingSpeed = 0.6;
          this._floatingAmplitude = 0.8;
          this._floatingHeightOffset = 11;
          this._floatingRotateSpeed = 180;
        }

        start() {//  DataManager.Instance.arrow3DManager = this;
          // this.node.active = false;
        }

        setActive(isActive) {
          this.node.active = isActive;
        }
        /**
         * 播放立起来跳动 + 自转效果（调用前需设置 _targetVec）
         * @param deltaTime 每帧传入的时间
         * @param targetVec 箭头要跳动的目标位置
         */


        playFloatingEffect(deltaTime, targetVec) {
          this._floatingTime += deltaTime; // 上下浮动

          const floatY = Math.sin(this._floatingTime * 2 * Math.PI * this._floatingSpeed) * this._floatingAmplitude;

          this.node.setWorldPosition(new Vec3(targetVec.x, targetVec.y + this._floatingHeightOffset + floatY, targetVec.z)); // 自转

          this._floatingRotateY += this._floatingRotateSpeed * deltaTime;
          this._floatingRotateY %= 360;
          this.node.setRotationFromEuler(-270, this._floatingRotateY, 0);
        }

      }) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=9fff50eb876b273b1c62512c1b9aec3251d846ff.js.map