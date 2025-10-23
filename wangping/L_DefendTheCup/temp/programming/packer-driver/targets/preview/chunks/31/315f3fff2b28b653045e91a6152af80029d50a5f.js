System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Label, DataManager, LanguageManager, _dec, _dec2, _dec3, _class, _class2, _descriptor, _descriptor2, _crd, ccclass, property, UIPropertyManager;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfDataManager(extras) {
    _reporterNs.report("DataManager", "../Global/DataManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfLanguageManager(extras) {
    _reporterNs.report("LanguageManager", "../Language/LanguageManager", _context.meta, extras);
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
      Label = _cc.Label;
    }, function (_unresolved_2) {
      DataManager = _unresolved_2.DataManager;
    }, function (_unresolved_3) {
      LanguageManager = _unresolved_3.LanguageManager;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "b6246BNmcFAba92koQh4wea", "UIPropertyManager", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Label', 'Node']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("UIPropertyManager", UIPropertyManager = (_dec = ccclass('UIPropertyManager'), _dec2 = property(Label), _dec3 = property(Label), _dec(_class = (_class2 = class UIPropertyManager extends Component {
        constructor() {
          super(...arguments);

          _initializerDefineProperty(this, "propertyLabel", _descriptor, this);

          _initializerDefineProperty(this, "downloadLabel", _descriptor2, this);

          this._total = 0;
        }

        start() {
          var text = (_crd && LanguageManager === void 0 ? (_reportPossibleCrUseOfLanguageManager({
            error: Error()
          }), LanguageManager) : LanguageManager).t('Download');

          if (this.downloadLabel && text) {
            this.downloadLabel.string = text;
          }

          (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.UIPropertyManager = this;
          this._total = 0;
          this.propertyLabel.string = "" + this._total;
        }

        collectProperty() {
          this._total++;
          this.propertyLabel.string = "" + this._total;
        }

        deliverProperty() {
          this._total--;

          if (this._total >= 0) {
            this.propertyLabel.string = "" + this._total;
          }
        }

        update(deltaTime) {}

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "propertyLabel", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "downloadLabel", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=315f3fff2b28b653045e91a6152af80029d50a5f.js.map