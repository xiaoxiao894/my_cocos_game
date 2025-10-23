System.register(["__unresolved_0", "cc", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Vec3, DataManager, _dec, _class, _crd, ccclass, property, Arrow3DManager;

  function _reportPossibleCrUseOfDataManager(extras) {
    _reporterNs.report("DataManager", "../Global/DataManager", _context.meta, extras);
  }

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
      Component = _cc.Component;
      Vec3 = _cc.Vec3;
    }, function (_unresolved_2) {
      DataManager = _unresolved_2.DataManager;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "3ce707NL5tNk6VhWxUpf2c0", "Arrow3DManager", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Node', 'Vec3']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("Arrow3DManager", Arrow3DManager = (_dec = ccclass('Arrow3DManager'), _dec(_class = class Arrow3DManager extends Component {
        constructor(...args) {
          super(...args);
          this._floatingTime = 0;
          this._floatingRotateY = 0;
          this._floatingSpeed = 0.4;
          this._floatingAmplitude = 1.2;
          this._floatingHeightOffset = 4;
          this._floatingRotateSpeed = 180;
        }

        start() {
          (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.arrow3DManager = this;
          this.node.active = false;
        }
        /**
         * 播放立起来跳动 + 自转效果（调用前需设置 _targetVec）
         * @param deltaTime 每帧传入的时间
         * @param targetVec 箭头要跳动的目标位置
         */


        playFloatingEffect(deltaTime, targetVec, isPlot = false) {
          this._floatingTime += deltaTime; // 上下浮动

          const floatY = Math.sin(this._floatingTime * 2 * Math.PI * this._floatingSpeed) * this._floatingAmplitude;

          if (isPlot) {
            this._floatingHeightOffset = 1;
          } else {
            this._floatingHeightOffset = 4.5;
          }

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
//# sourceMappingURL=34f409f750e1641e38e7236d600c2a379ba8d369.js.map