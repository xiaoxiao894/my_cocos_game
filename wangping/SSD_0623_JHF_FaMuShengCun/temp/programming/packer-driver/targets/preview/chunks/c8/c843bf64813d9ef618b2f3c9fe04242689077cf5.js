System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Label, Sprite, _dec, _dec2, _dec3, _dec4, _class, _class2, _descriptor, _descriptor2, _descriptor3, _crd, ccclass, property, DeliverItem;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  return {
    setters: [function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
      Component = _cc.Component;
      Label = _cc.Label;
      Sprite = _cc.Sprite;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "c59e9UPaWZJu65rwOEPg+QU", "DeliverItem", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Label', 'Sprite']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("DeliverItem", DeliverItem = (_dec = ccclass('DeliverItem'), _dec2 = property(Sprite), _dec3 = property(Label), _dec4 = property(Sprite), _dec(_class = (_class2 = class DeliverItem extends Component {
        constructor() {
          super(...arguments);

          _initializerDefineProperty(this, "deliverRange", _descriptor, this);

          _initializerDefineProperty(this, "num", _descriptor2, this);

          _initializerDefineProperty(this, "checkSprite", _descriptor3, this);

          this._needNum = 0;
          this._nowNum = 0;
        }

        init(needNum) {
          this._needNum = needNum;
          this.num.string = this._nowNum + "/" + this._needNum;
          this.deliverRange.fillRange = this._nowNum / this._needNum;
          this.checkSprite.grayscale = true;
        }

        addItem() {
          this._nowNum++;
          this.num.string = this._nowNum + "/" + this._needNum;
          this.deliverRange.fillRange = this._nowNum / this._needNum;

          if (this._nowNum == this._needNum) {
            this.checkSprite.grayscale = false;
          }
        }

        update(deltaTime) {}

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "deliverRange", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "num", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "checkSprite", [_dec4], {
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
//# sourceMappingURL=c843bf64813d9ef618b2f3c9fe04242689077cf5.js.map