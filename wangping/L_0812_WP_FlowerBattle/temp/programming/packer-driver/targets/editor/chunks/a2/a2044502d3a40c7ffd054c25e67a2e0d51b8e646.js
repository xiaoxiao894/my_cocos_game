System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, view, ResolutionPolicy, director, Widget, Layout, Camera, _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _crd, ccclass, property, executeInEditMode, AspectAdapter38_Safe;

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
      view = _cc.view;
      ResolutionPolicy = _cc.ResolutionPolicy;
      director = _cc.director;
      Widget = _cc.Widget;
      Layout = _cc.Layout;
      Camera = _cc.Camera;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "90e77nI2dxCzbliXNQV9ZgK", "AspectAdapter38_Safe", undefined);

      //import { DataManager } from '../Global/DataManager';
      __checkObsolete__(['_decorator', 'Component', 'view', 'ResolutionPolicy', 'director', 'Widget', 'Layout', 'Camera']);

      ({
        ccclass,
        property,
        executeInEditMode
      } = _decorator);

      _export("AspectAdapter38_Safe", AspectAdapter38_Safe = (_dec = ccclass('AspectAdapter38_Safe'), _dec2 = executeInEditMode(), _dec3 = property({
        tooltip: '设计分辨率宽'
      }), _dec4 = property({
        tooltip: '设计分辨率高'
      }), _dec5 = property({
        tooltip: '宽高比值'
      }), _dec6 = property({
        tooltip: '镜头小于1:1'
      }), _dec7 = property({
        tooltip: '镜头大于1:1'
      }), _dec8 = property({
        type: Camera,
        tooltip: '镜头小于1:1'
      }), _dec(_class = _dec2(_class = (_class2 = class AspectAdapter38_Safe extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "designWidth", _descriptor, this);

          _initializerDefineProperty(this, "designHeight", _descriptor2, this);

          _initializerDefineProperty(this, "threshold", _descriptor3, this);

          _initializerDefineProperty(this, "greaterThanCameraZoomRatio", _descriptor4, this);

          _initializerDefineProperty(this, "lessThanCameraZoomRatio", _descriptor5, this);

          _initializerDefineProperty(this, "mainCamera", _descriptor6, this);

          this._pending = false;
          this._applying = false;
          this._lastKey = null;

          this._onResize = () => {
            if (this._pending) return;
            this._pending = true; // 延后一帧处理，等引擎内部尺寸稳定

            this.scheduleOnce(this._applyNow, 0);
          };

          this._applyNow = () => {
            this._pending = false;
            if (this._applying) return;
            this._applying = true;
            const {
              width: sw,
              height: sh
            } = view.getVisibleSize();

            if (sw <= 0 || sh <= 0) {
              this._applying = false;
              return;
            }

            const aspect = sw / sh;

            if (aspect >= this.threshold) {
              // 宽/高 ≥ 1：保持 1:1，不再变化 高
              const side = this.designWidth;
              const policy = ResolutionPolicy.FIXED_HEIGHT;
              const key = `${policy}:${side}x${side}`;

              if (this._lastKey !== key) {
                this._lastKey = key;
                view.setDesignResolutionSize(side, side, policy);
                this.scheduleOnce(this._refreshUIOnce, 0);

                if (this.mainCamera) {
                  this.mainCamera.orthoHeight = this.greaterThanCameraZoomRatio;
                }

                console.log("大于1： 1");
              }
            } else {
              // 宽/高 < 1：正常缩放  宽
              const dw = this.designWidth,
                    dh = this.designHeight;
              const policy = ResolutionPolicy.FIXED_WIDTH; // 随宽

              const key = `${policy}:${dw}x${dh}`;

              if (this._lastKey !== key) {
                this._lastKey = key;
                view.setDesignResolutionSize(dw, dh, policy);
                this.scheduleOnce(this._refreshUIOnce, 0);

                if (this.mainCamera) {
                  this.mainCamera.orthoHeight = this.lessThanCameraZoomRatio;
                }

                console.log("小于1： 1");
              }
            }

            this._applying = false;
          };

          this._refreshUIOnce = () => {
            const scene = director.getScene();
            if (!scene) return;

            for (const w of scene.getComponentsInChildren(Widget)) w.updateAlignment();

            for (const l of scene.getComponentsInChildren(Layout)) l.updateLayout();
          };
        }

        onLoad() {
          this._onResize();
        }

        onEnable() {
          view.on('canvas-resize', this._onResize, this);

          this._onResize(); // 启用时触发一次

        }

        onDisable() {
          view.off('canvas-resize', this._onResize, this);
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "designWidth", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 720;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "designHeight", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 1280;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "threshold", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 1.0;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "greaterThanCameraZoomRatio", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 1;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "lessThanCameraZoomRatio", [_dec7], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 2;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "mainCamera", [_dec8], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      })), _class2)) || _class) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=a2044502d3a40c7ffd054c25e67a2e0d51b8e646.js.map