System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Camera, Component, Quat, v3, Vec3, tween, CCInteger, _dec, _dec2, _dec3, _dec4, _class, _class2, _descriptor, _descriptor2, _descriptor3, _crd, ccclass, property, tempPos, CameraMain;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  return {
    setters: [function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
      Camera = _cc.Camera;
      Component = _cc.Component;
      Quat = _cc.Quat;
      v3 = _cc.v3;
      Vec3 = _cc.Vec3;
      tween = _cc.tween;
      CCInteger = _cc.CCInteger;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "7e8602o1ttFs61QDBE8hThK", "CameraMain", undefined);

      __checkObsolete__(['_decorator', 'Camera', 'Component', 'Quat', 'v3', 'Vec3', 'Node', 'tween', 'CCInteger', 'Tween']);

      ({
        ccclass,
        property
      } = _decorator);
      tempPos = v3();

      _export("CameraMain", CameraMain = (_dec = ccclass('CameraMain'), _dec2 = property(Camera), _dec3 = property(CCInteger), _dec4 = property(CCInteger), _dec(_class = (_class2 = class CameraMain extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "camera", _descriptor, this);

          _initializerDefineProperty(this, "speed", _descriptor2, this);

          _initializerDefineProperty(this, "delayTime", _descriptor3, this);

          this.initialPos = v3();
          this.initialRotation = new Quat();
          this._tweenAni = void 0;
        }

        start() {
          // 记录初始位置
          this.initialPos = this.node.worldPosition.clone(); // 记录初始旋转角度（保持角度不变）

          this.node.getRotation(this.initialRotation);
        } //回到中心位置


        moveToCenter() {
          this.scheduleOnce(this.realMove, this.delayTime);
        }

        realMove() {
          let distence = Vec3.distance(this.node.worldPosition, this.initialPos);
          let t = this.speed * distence;
          this._tweenAni = tween(this.node).to(t, {
            worldPosition: this.initialPos
          }).start();
        } //停止回到中心位


        stopTweenAni() {
          if (this._tweenAni) {
            this._tweenAni.stop();
          }

          this.unschedule(this.realMove);
        } //移动摄像机并且升高高度


        moveCenterAndScale() {
          const orgHeight = this.camera.orthoHeight;
          this._tweenAni = tween(this.node).to(0.5, {
            worldPosition: this.initialPos
          }, {
            easing: 'sineOut',
            // 使用缓动函数使动画更自然
            onUpdate: (target, ratio) => {
              // 动态调整正交摄像机大小
              this.camera.orthoHeight = orgHeight + ratio * 5;
            }
          }).start();
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "camera", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "speed", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0.7;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "delayTime", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 5;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=1697ccb83ab1fc339d9a81e4b4a200cb43abce98.js.map