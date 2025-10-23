System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Vec3, Quat, CCBoolean, CCInteger, CCFloat, _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _crd, ccclass, property, NodeRotator;

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
      Vec3 = _cc.Vec3;
      Quat = _cc.Quat;
      CCBoolean = _cc.CCBoolean;
      CCInteger = _cc.CCInteger;
      CCFloat = _cc.CCFloat;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "909f8qOoNlESrXmcQp0s9Hr", "NodeRotator", undefined); // import { _decorator, Component, Node, tween, Vec3, Quat, math, Tween, TweenEasing } from 'cc';
      // const { ccclass, property } = _decorator;
      // @ccclass('NodeRotator')
      // export class NodeRotator extends Component {
      //     start() {
      //         this.scheduleOnce(() => {
      //             this.rotator();
      //         }, 2);
      //     }
      //     rotator() {
      //         // 持续旋转（绕Y轴每秒旋转360度）
      //         tween(this.node)
      //             .by(2, { eulerAngles: new Vec3(0, 360, 0) }) // 相对旋转
      //             .repeatForever() // 永久重复
      //             .start();
      //     }
      // }


      __checkObsolete__(['_decorator', 'Component', 'Node', 'Vec3', 'Quat', 'math', 'CCBoolean', 'CCInteger', 'CCFloat']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("NodeRotator", NodeRotator = (_dec = ccclass('NodeRotator'), _dec2 = property({
        type: CCInteger,
        tooltip: '最大旋转速度 (度/秒)'
      }), _dec3 = property({
        type: CCFloat,
        tooltip: '加速时间 (秒)'
      }), _dec4 = property({
        type: CCBoolean,
        tooltip: '顺时针旋转'
      }), _dec5 = property({
        type: CCBoolean,
        tooltip: '逆向旋转'
      }), _dec6 = property({
        type: Vec3,
        tooltip: '旋转轴'
      }), _dec(_class = (_class2 = class NodeRotator extends Component {
        constructor() {
          super(...arguments);

          _initializerDefineProperty(this, "maxRotationSpeed", _descriptor, this);

          // 每秒360度（1圈/秒）
          _initializerDefineProperty(this, "accelerationTime", _descriptor2, this);

          // 从0加速到最大速度所需时间
          _initializerDefineProperty(this, "clockwise", _descriptor3, this);

          _initializerDefineProperty(this, "reverse", _descriptor4, this);

          // 新增属性，用于控制是否逆向旋转
          _initializerDefineProperty(this, "rotateAxis", _descriptor5, this);

          // 默认绕Y轴旋转
          this._currentSpeed = 0;
          // 当前旋转速度 (度/秒)
          this._isRotating = false;
          this._rotationProgress = 0;
          // 当前旋转角度（度）
          this._initialRotation = new Quat();
        }

        // 初始旋转状态
        start() {
          // 保存初始旋转状态
          this.node.getRotation(this._initialRotation); // this.scheduleOnce(() => {

          this.startRotation(); // }, 5); // 延迟1秒开始旋转，便于观察
        }

        startRotation() {
          if (this._isRotating) return;
          this._isRotating = true;
          this._currentSpeed = 0;
          this._rotationProgress = 0;
        }

        stopRotation() {
          this._isRotating = false;
        }

        resetRotation() {
          this.stopRotation();
          this.node.setRotation(this._initialRotation);
          this._rotationProgress = 0;
        }

        toggleDirection() {
          this.clockwise = !this.clockwise;
        } // 新增方法：设置逆向旋转状态


        setReverse(reverse) {
          this.reverse = reverse;
        }

        update(dt) {
          if (!this._isRotating) return; // 1. 计算加速度 (度/秒²)

          var acceleration = this.maxRotationSpeed / this.accelerationTime; // 2. 更新当前速度（线性加速）

          if (this._currentSpeed < this.maxRotationSpeed) {
            this._currentSpeed += acceleration * dt; // 确保不超过最大速度

            this._currentSpeed = Math.min(this._currentSpeed, this.maxRotationSpeed);
          } // 3. 计算本帧旋转角度
          // 修改旋转方向计算，同时考虑clockwise和reverse参数


          var direction = this.clockwise !== this.reverse ? 1 : -1;
          var rotationAmount = this._currentSpeed * dt * direction;
          this._rotationProgress += rotationAmount; // 4. 应用旋转

          this.applyRotation();
        }

        applyRotation() {
          // 创建旋转四元数
          var rotationQuat = new Quat();
          Quat.fromEuler(rotationQuat, this.rotateAxis.x * this._rotationProgress, this.rotateAxis.y * this._rotationProgress, this.rotateAxis.z * this._rotationProgress); // 应用旋转

          this.node.setRotation(rotationQuat);
        } // 调试信息 - 更新以显示reverse状态


        onEnable() {
          console.log("\u65CB\u8F6C\u63A7\u5236\u5668\u5DF2\u542F\u7528:\n        \u6700\u5927\u901F\u5EA6: " + this.maxRotationSpeed + " \u5EA6/\u79D2\n        \u52A0\u901F\u65F6\u95F4: " + this.accelerationTime + " \u79D2\n        \u65CB\u8F6C\u65B9\u5411: " + (this.clockwise ? '顺时针' : '逆时针') + "\n        \u9006\u5411\u72B6\u6001: " + (this.reverse ? '是' : '否') + "\n        ");
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "maxRotationSpeed", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 360;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "accelerationTime", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 2;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "clockwise", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return true;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "reverse", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return false;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "rotateAxis", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return new Vec3(0, 1, 0);
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=22fcb43160484c8a5b8dc5134519026b165182ad.js.map