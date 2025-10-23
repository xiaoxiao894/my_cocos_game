System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, ProgressBar, tween, App, GlobeVariable, _dec, _dec2, _dec3, _class, _class2, _descriptor, _descriptor2, _crd, ccclass, property, Blood;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfApp(extras) {
    _reporterNs.report("App", "../App", _context.meta, extras);
  }

  function _reportPossibleCrUseOfGlobeVariable(extras) {
    _reporterNs.report("GlobeVariable", "../core/GlobeVariable", _context.meta, extras);
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
      ProgressBar = _cc.ProgressBar;
      tween = _cc.tween;
    }, function (_unresolved_2) {
      App = _unresolved_2.App;
    }, function (_unresolved_3) {
      GlobeVariable = _unresolved_3.GlobeVariable;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "b016bdakR1P6aextvVPnI3u", "Blood", undefined);

      __checkObsolete__(['_decorator', 'Component', 'ProgressBar', 'tween']);

      /**
       * 怪的血量控制
       */
      ({
        ccclass,
        property
      } = _decorator);

      _export("default", Blood = (_dec = ccclass("Blood"), _dec2 = property(ProgressBar), _dec3 = property(ProgressBar), _dec(_class = (_class2 = class Blood extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "redProgress", _descriptor, this);

          _initializerDefineProperty(this, "greenProgress", _descriptor2, this);

          this._bloodMax = 100;
          this._bloodNow = 100;
        }

        /**
         * 初始化
         * @param blood 总血量
         */
        init(blood) {
          this._bloodMax = blood;
          this._bloodNow = blood;
          this.redProgress.progress = 1;
          this.greenProgress.progress = 1;
        }
        /**
         * 受伤掉血
         * @param harm 伤害值
         */


        injuryAni(harm) {
          this._bloodNow = Math.max(0, this._bloodNow - harm);
          const targetProgress = this._bloodNow / this._bloodMax;
          this.redProgress.progress = targetProgress;
          tween(this.greenProgress).to(0.5, {
            progress: targetProgress
          }, {
            easing: 'quadInOut'
          }).call(() => {
            if (this._bloodNow <= 0) {
              this.recycleSelf();
            }
          }).start();
        }
        /** 回收自己 */


        recycleSelf() {
          this.node.active = false;
          this.node.removeFromParent();
          (_crd && App === void 0 ? (_reportPossibleCrUseOfApp({
            error: Error()
          }), App) : App).poolManager.returnNode(this.node, (_crd && GlobeVariable === void 0 ? (_reportPossibleCrUseOfGlobeVariable({
            error: Error()
          }), GlobeVariable) : GlobeVariable).entifyName.BloodBar);
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "redProgress", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "greenProgress", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=7c9753f9489400fdfa52bbe78e44d604ce2a549c.js.map