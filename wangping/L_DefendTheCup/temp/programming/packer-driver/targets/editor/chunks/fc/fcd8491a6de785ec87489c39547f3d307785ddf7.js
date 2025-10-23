System.register(["__unresolved_0", "cc", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, tween, UIOpacity, DataManager, _dec, _class, _crd, ccclass, property, UIWarnManager;

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
      tween = _cc.tween;
      UIOpacity = _cc.UIOpacity;
    }, function (_unresolved_2) {
      DataManager = _unresolved_2.DataManager;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "bed6awWwulNZodhK5a7FS30", "UIWarnManager", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Node', 'tween', 'UIOpacity']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("UIWarnManager", UIWarnManager = (_dec = ccclass('UIWarnManager'), _dec(_class = class UIWarnManager extends Component {
        constructor(...args) {
          super(...args);
          this._isTrue = true;
        }

        start() {
          (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.uiWarnManager = this;
          this.node.active = false;
        }

        playWarnFadeAnimation() {
          var _this$node, _this$node2;

          if (!this._isTrue) return;
          this._isTrue = false;
          this.node.active = true;
          const opacity = ((_this$node = this.node) == null ? void 0 : _this$node.getComponent(UIOpacity)) || ((_this$node2 = this.node) == null ? void 0 : _this$node2.addComponent(UIOpacity));
          opacity.opacity = 0;
          tween(opacity).to(0.5, {
            opacity: 255
          }, {
            easing: 'quadOut'
          }) // 渐显
          .to(0.5, {
            opacity: 0
          }, {
            easing: 'quadIn'
          }) // 渐隐
          .call(() => {
            this.node.active = false;
            this._isTrue = true;
          }).start();
        }

      }) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=fcd8491a6de785ec87489c39547f3d307785ddf7.js.map