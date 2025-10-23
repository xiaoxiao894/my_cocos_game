System.register(["__unresolved_0", "cc"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, SkeletalAnimation, _dec, _dec2, _class, _class2, _descriptor, _crd, ccclass, property, EachPartnerManager;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfPartnerAttackEnum(extras) {
    _reporterNs.report("PartnerAttackEnum", "./StateDefine", _context.meta, extras);
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
      SkeletalAnimation = _cc.SkeletalAnimation;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "ef32eJU2E1GDaW+jzsgVViC", "EachPartnerManager", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Node', 'SkeletalAnimation']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("EachPartnerManager", EachPartnerManager = (_dec = ccclass('EachPartnerManager'), _dec2 = property(SkeletalAnimation), _dec(_class = (_class2 = class EachPartnerManager extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "skeletalAnimation", _descriptor, this);

          this.currentState = null;
        }

        init() {}

        changState(state) {
          if (state == this.currentState) {
            return;
          }

          this.skeletalAnimation.crossFade(state, 0.1);
          this.currentState = state;
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "skeletalAnimation", [_dec2], {
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
//# sourceMappingURL=4ff37382da9350e0104a7595530fd021840b66fd.js.map