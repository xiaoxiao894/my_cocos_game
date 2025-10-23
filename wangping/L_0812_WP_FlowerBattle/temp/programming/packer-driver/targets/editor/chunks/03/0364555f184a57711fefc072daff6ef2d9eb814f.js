System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Flower, GlobeVariable, _dec, _dec2, _class, _class2, _descriptor, _crd, ccclass, property, jumpEvent;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfFlower(extras) {
    _reporterNs.report("Flower", "./Entitys/Flower", _context.meta, extras);
  }

  function _reportPossibleCrUseOfGlobeVariable(extras) {
    _reporterNs.report("GlobeVariable", "./core/GlobeVariable", _context.meta, extras);
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
    }, function (_unresolved_2) {
      Flower = _unresolved_2.Flower;
    }, function (_unresolved_3) {
      GlobeVariable = _unresolved_3.GlobeVariable;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "19a0e5Q/DlJQZYRwXJi9Far", "jumpEvent", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Node']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("jumpEvent", jumpEvent = (_dec = ccclass('jumpEvent'), _dec2 = property(_crd && Flower === void 0 ? (_reportPossibleCrUseOfFlower({
        error: Error()
      }), Flower) : Flower), _dec(_class = (_class2 = class jumpEvent extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "birthAnnaNode", _descriptor, this);
        }

        qiehuanEvent() {
          if (this.birthAnnaNode) {
            if (!(_crd && GlobeVariable === void 0 ? (_reportPossibleCrUseOfGlobeVariable({
              error: Error()
            }), GlobeVariable) : GlobeVariable).isIdel) {
              (_crd && GlobeVariable === void 0 ? (_reportPossibleCrUseOfGlobeVariable({
                error: Error()
              }), GlobeVariable) : GlobeVariable).isIdel = true;
              this.birthAnnaNode.IdleEvent();
            }
          }

          console.log('jumpEvent');
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "birthAnnaNode", [_dec2], {
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
//# sourceMappingURL=0364555f184a57711fefc072daff6ef2d9eb814f.js.map