System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Node, ProgressBar, _dec, _dec2, _dec3, _dec4, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _crd, ccclass, property, BooldPaling;

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
      Node = _cc.Node;
      ProgressBar = _cc.ProgressBar;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "4d84daj2gxHhLkGvL2c8oRE", "BooldPaling", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Node', 'ProgressBar']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("BooldPaling", BooldPaling = (_dec = ccclass('BooldPaling'), _dec2 = property(Node), _dec3 = property(ProgressBar), _dec4 = property(Number), _dec(_class = (_class2 = class BooldPaling extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "bloodPaling", _descriptor, this);

          _initializerDefineProperty(this, "progressBar", _descriptor2, this);

          _initializerDefineProperty(this, "bloodHpMax", _descriptor3, this);

          _initializerDefineProperty(this, "bloodHp", _descriptor4, this);

          _initializerDefineProperty(this, "isBool", _descriptor5, this);
        }

        resetBloodHp() {
          this.bloodHp = this.bloodHpMax;
          this.progressBar.progress = 1;
        }

        continueGame() {
          this.node.active = true;
          this.bloodHp = this.bloodHpMax;
          this.progressBar.progress = 1;
        }

        getBloodHpMax() {
          return this.bloodHpMax;
        }

        subscribeBool(num = 1) {
          if (this.bloodHp <= 0) {
            this.node.active = false;
            return;
          }

          this.bloodHp -= num;
          this.bloodPaling.active = true;
          this.progressBar.progress = this.bloodHp / this.bloodHpMax;
        }

        getBloodHp() {
          return this.bloodHp;
        }

        start() {
          this.node.active = this.isBool;
        }

        update(deltaTime) {}

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "bloodPaling", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "progressBar", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "bloodHpMax", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 20;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "bloodHp", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 20;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "isBool", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return false;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=f580c3dbb7771f54c8c438dc8631a3fc805f9be1.js.map