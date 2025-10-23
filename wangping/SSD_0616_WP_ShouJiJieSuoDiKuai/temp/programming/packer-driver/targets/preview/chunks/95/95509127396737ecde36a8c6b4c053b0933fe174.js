System.register(["__unresolved_0", "cc", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, tween, UIOpacity, Global, _dec, _class, _crd, ccclass, property, UIWarnManager;

  function _reportPossibleCrUseOfGlobal(extras) {
    _reporterNs.report("Global", "./core/Global", _context.meta, extras);
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
      Global = _unresolved_2.Global;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "7b311za8IhH5ZIo08aaVwJV", "UIWarnManager", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Node', 'Tween', 'tween', 'UIOpacity']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("UIWarnManager", UIWarnManager = (_dec = ccclass('UIWarnManager'), _dec(_class = class UIWarnManager extends Component {
        constructor() {
          super(...arguments);
          this._isTrue = true;
          this.tweenWarn = null;
          this.callFunc = null;
        }

        start() {
          (_crd && Global === void 0 ? (_reportPossibleCrUseOfGlobal({
            error: Error()
          }), Global) : Global).warnUI = this;
          this.node.active = false;
        }

        playWarnFadeAnimation() {
          var _this$node, _this$node2;

          // 确保节点处于活动状态
          this.node.active = true; // 获取或添加UIOpacity组件

          var opacity = ((_this$node = this.node) == null ? void 0 : _this$node.getComponent(UIOpacity)) || ((_this$node2 = this.node) == null ? void 0 : _this$node2.addComponent(UIOpacity)); // 停止之前的动画（如果有）

          this.stopWarnFadeAnimation(); // 设置初始透明度为0（隐藏状态）

          opacity.opacity = 0; // 创建动画序列：只包含渐显和渐隐，移除重置透明度的回调
          // 创建动画序列并设置为无限循环

          this.callFunc = () => {
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
              if (this.callFunc) this.callFunc();
            }).start();
          };

          this.callFunc();
        }

        stopWarnFadeAnimation() {
          if (this.callFunc) {
            this.callFunc = null;
          }
        }

      }) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=95509127396737ecde36a8c6b4c053b0933fe174.js.map