System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, tween, Vec3, easing, UITransform, Vec2, Material, MeshRenderer, _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _crd, ccclass, property, TopShakeEffect;

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
      Vec3 = _cc.Vec3;
      easing = _cc.easing;
      UITransform = _cc.UITransform;
      Vec2 = _cc.Vec2;
      Material = _cc.Material;
      MeshRenderer = _cc.MeshRenderer;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "c9322yRGNFCE68WbJasE7xL", "TopShakeEffect", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Node', 'tween', 'Vec3', 'easing', 'UITransform', 'Vec2', 'Material', 'MeshRenderer']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("TopShakeEffect", TopShakeEffect = (_dec = ccclass('TopShakeEffect'), _dec2 = property(Material), _dec3 = property(Material), _dec4 = property({
        tooltip: '晃动角度幅度'
      }), _dec5 = property({
        tooltip: '单次晃动周期（秒）'
      }), _dec6 = property({
        tooltip: '是否自动开始晃动'
      }), _dec7 = property({
        tooltip: '自动启动时的晃动次数，0表示无限循环'
      }), _dec8 = property({
        tooltip: '晃动轴（通常是X或Z）'
      }), _dec9 = property({
        tooltip: '晃动中心点（0-1）'
      }), _dec(_class = (_class2 = class TopShakeEffect extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "baseMaterial", _descriptor, this);

          _initializerDefineProperty(this, "redMaterial", _descriptor2, this);

          this.meshRender = null;

          // 晃动幅度（角度）
          _initializerDefineProperty(this, "angleAmplitude", _descriptor3, this);

          _initializerDefineProperty(this, "duration", _descriptor4, this);

          _initializerDefineProperty(this, "autoStart", _descriptor5, this);

          _initializerDefineProperty(this, "autoShakeCount", _descriptor6, this);

          _initializerDefineProperty(this, "shakeAxis", _descriptor7, this);

          // 晃动中心点（0表示底部，1表示顶部）
          _initializerDefineProperty(this, "pivotPoint", _descriptor8, this);

          // 初始旋转
          this._originalRotation = new Vec3();
          // 当前是否正在晃动
          this._isShaking = false;
          // 晃动完成回调
          this._shakeCompleteCallback = null;
        }

        onLoad() {
          // 记录初始旋转
          this._originalRotation.set(this.node.eulerAngles); // 设置锚点以控制旋转中心


          if (this.node.getComponent(UITransform)) {
            this.node.getComponent(UITransform).anchorPoint = new Vec2(0.5, this.pivotPoint);
          }
        }

        start() {
          if (this.autoStart) {
            this.shake(this.autoShakeCount);
          }
        }
        /**
         * 开始晃动
         * @param count 晃动次数，0表示无限循环
         * @param callback 晃动完成回调
         */


        shake(count = 0, isMaterial, callback) {
          this.meshRender = this.node.children[0].getComponent(MeshRenderer);

          if (this.redMaterial) {
            this.meshRender.setMaterial(this.redMaterial, 0);
          } // 如果正在晃动，先停止


          if (this._isShaking) {
            this.stopShake();
          }

          this._isShaking = true;
          this._shakeCompleteCallback = callback; // 创建一个左右晃动的补间动画

          let targetRot1 = new Vec3();
          let targetRot2 = new Vec3(); // 根据选择的轴设置旋转角度

          switch (this.shakeAxis) {
            case 'X':
              targetRot1.set(this._originalRotation.x + this.angleAmplitude, this._originalRotation.y, this._originalRotation.z);
              targetRot2.set(this._originalRotation.x - this.angleAmplitude, this._originalRotation.y, this._originalRotation.z);
              break;

            case 'Y':
              targetRot1.set(this._originalRotation.x, this._originalRotation.y + this.angleAmplitude, this._originalRotation.z);
              targetRot2.set(this._originalRotation.x, this._originalRotation.y - this.angleAmplitude, this._originalRotation.z);
              break;

            case 'Z':
            default:
              targetRot1.set(this._originalRotation.x, this._originalRotation.y, this._originalRotation.z + this.angleAmplitude);
              targetRot2.set(this._originalRotation.x, this._originalRotation.y, this._originalRotation.z - this.angleAmplitude);
              break;
          } // 创建单次晃动的tween


          const singleShake = tween(this.node).to(this.duration / 2, {
            eulerAngles: targetRot1
          }, {
            easing: easing.sineOut
          }).to(this.duration / 2, {
            eulerAngles: targetRot2
          }, {
            easing: easing.sineIn
          }).to(this.duration / 4, {
            eulerAngles: this._originalRotation
          }, {
            easing: easing.sineOut
          }); // 根据次数决定是循环还是执行有限次

          if (count <= 0) {
            // 无限循环
            singleShake.union().repeatForever().start();
          } else {
            // 有限次数
            tween(this.node).call(() => {
              this._isShaking = true;
            }).repeat(count, singleShake).call(() => {
              this._isShaking = false;

              if (this.baseMaterial) {
                this.meshRender.setMaterial(this.baseMaterial, 0);
              }

              if (this._shakeCompleteCallback) {
                this._shakeCompleteCallback();

                this._shakeCompleteCallback = null;
              }
            }).start();
          }
        }
        /**
         * 停止晃动，回到初始位置
         */


        stopShake() {
          tween(this.node).stop();
          this.node.eulerAngles = this._originalRotation;
          this._isShaking = false;

          if (this._shakeCompleteCallback) {
            this._shakeCompleteCallback();

            this._shakeCompleteCallback = null;
          }
        }
        /**
         * 检查是否正在晃动
         */


        isShaking() {
          return this._isShaking;
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "baseMaterial", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "redMaterial", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "angleAmplitude", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 8;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "duration", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0.2;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "autoStart", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return true;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "autoShakeCount", [_dec7], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0;
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "shakeAxis", [_dec8], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 'Z';
        }
      }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "pivotPoint", [_dec9], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0.0;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=7a4dca88530fdcedb8abb6ae32bc1e68878fa955.js.map