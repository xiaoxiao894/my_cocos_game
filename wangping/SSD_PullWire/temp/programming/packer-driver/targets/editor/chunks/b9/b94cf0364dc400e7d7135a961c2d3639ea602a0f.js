System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, tween, Color, ParticleSystem, _dec, _dec2, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _crd, ccclass, property, CloudParticleEffect;

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
      tween = _cc.tween;
      Color = _cc.Color;
      ParticleSystem = _cc.ParticleSystem;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "0769cwRzWZHe5li52Rcozp0", "CloudParticleEffect", undefined);

      __checkObsolete__(['_decorator', 'Component', 'tween', 'Color', 'Tween', 'ParticleSystem', 'Material']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("CloudParticleEffect", CloudParticleEffect = (_dec = ccclass('CloudParticleEffect'), _dec2 = property(ParticleSystem), _dec(_class = (_class2 = class CloudParticleEffect extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "cloudParticleOuter", _descriptor, this);

          _initializerDefineProperty(this, "fadeDuration", _descriptor2, this);

          _initializerDefineProperty(this, "initialOpacity", _descriptor3, this);

          // 初始透明度
          _initializerDefineProperty(this, "targetOpacity", _descriptor4, this);

          // 目标透明度
          _initializerDefineProperty(this, "particleColor", _descriptor5, this);

          this.tweenInstance = null;
          this._material = null;
          this._currentColor = new Color();
        }

        start() {
          this._material = this.cloudParticleOuter.getMaterialInstance(0);

          this._currentColor.set(114, 114, 114, this.initialOpacity);

          this._material.setProperty("tintColor", this._currentColor);
        }

        cloudFadeEffct(isFadeIn) {
          // 获取当前透明度
          const currentOpacity = this._currentColor.a; // 边界检查：如果已经达到目标透明度，则不执行操作

          if (isFadeIn && currentOpacity >= this.initialOpacity - 1) {
            return;
          }

          if (!isFadeIn && currentOpacity <= this.targetOpacity + 1) {
            return;
          }

          this.cloudFadeOutCallBack(isFadeIn ? 'fadeIn' : 'fadeOut');
        }

        cloudFadeOutCallBack(action) {
          if (this.tweenInstance) {
            this.tweenInstance.stop();
            this.tweenInstance = null;
          }

          if (!this._material) {
            this._material = this.cloudParticleOuter.getMaterialInstance(0);
          } // 使用当前颜色作为起始点


          const startColor = new Color(this._currentColor);
          const endOpacity = action === 'fadeIn' ? this.initialOpacity : this.targetOpacity;
          this.tweenInstance = tween(startColor).to(this.fadeDuration, {
            a: endOpacity
          }, {
            onUpdate: target => {
              this._currentColor.set(target);

              this._material.setProperty("tintColor", this._currentColor);
            },
            easing: 'linear'
          }).call(() => {
            this.tweenInstance = null;
          }).start();
        }

        onDestroy() {
          if (this.tweenInstance) {
            this.tweenInstance.stop();
            this.tweenInstance = null;
          }
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "cloudParticleOuter", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "fadeDuration", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 1;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "initialOpacity", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 127;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "targetOpacity", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "particleColor", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return new Color(114, 114, 114, 127);
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=b94cf0364dc400e7d7135a961c2d3639ea602a0f.js.map