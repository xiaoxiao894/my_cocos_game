System.register(["__unresolved_0", "cc", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, MeshRenderer, DissolveEffect, _dec, _dec2, _class, _class2, _descriptor, _crd, ccclass, property, blockRed;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfDissolveEffect(extras) {
    _reporterNs.report("DissolveEffect", "../Res/DissolveEffect/scripts/DissolveEffect", _context.meta, extras);
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
      MeshRenderer = _cc.MeshRenderer;
    }, function (_unresolved_2) {
      DissolveEffect = _unresolved_2.DissolveEffect;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "1b249fAUTdBrrmXFt1J4N23", "blockRed", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Material', 'MeshRenderer', 'Node']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("blockRed", blockRed = (_dec = ccclass('blockRed'), _dec2 = property(_crd && DissolveEffect === void 0 ? (_reportPossibleCrUseOfDissolveEffect({
        error: Error()
      }), DissolveEffect) : DissolveEffect), _dec(_class = (_class2 = class blockRed extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "dissolveEffect", _descriptor, this);
        }

        start() {
          this.setMaterByIndex(0, true);
        }

        setRed() {
          this.setMaterByIndex(1);
          this.scheduleOnce(() => {
            this.setMaterByIndex(0);
          }, 0.1);
        }

        setMaterByIndex(matIndex, needReset = false) {
          if (!this.dissolveEffect) {
            return;
          }

          this.dissolveEffect.forEach(d => {
            d.init();
            let mesh = d.node.getComponent(MeshRenderer);

            if (mesh) {
              let matInstance = mesh.getMaterialInstance(0);

              if (matIndex === 1) {
                matInstance.setProperty('showType', 1.0);
              } else if (matIndex === 0) {
                matInstance.setProperty('showType', 0.0);
                matInstance.setProperty('dissolveThreshold', 0.0);
              } else if (matIndex === 2) {
                matInstance.setProperty('showType', 0.0);
                matInstance.setProperty('dissolveThreshold', 0.0);
                d.play(0.8);
              }
            }

            if (needReset) {
              d.reset();
            }
          });
        }

        update(deltaTime) {}

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "dissolveEffect", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return [];
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=bf009d37dfc4621f7f877e4d6c9c1140b78f7b22.js.map