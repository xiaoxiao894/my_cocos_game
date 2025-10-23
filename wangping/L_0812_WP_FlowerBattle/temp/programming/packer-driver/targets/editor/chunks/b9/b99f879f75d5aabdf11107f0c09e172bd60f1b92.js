System.register(["__unresolved_0", "cc", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Camera, Component, Node, v3, Vec3, GlobeVariable, _dec, _dec2, _dec3, _class, _class2, _descriptor, _descriptor2, _descriptor3, _crd, ccclass, property, tempPos, tempCurrentPos, CameraMain;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfGlobeVariable(extras) {
    _reporterNs.report("GlobeVariable", "./GlobeVariable", _context.meta, extras);
  }

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
      Camera = _cc.Camera;
      Component = _cc.Component;
      Node = _cc.Node;
      v3 = _cc.v3;
      Vec3 = _cc.Vec3;
    }, function (_unresolved_2) {
      GlobeVariable = _unresolved_2.GlobeVariable;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "689c1+CRL9H9oHUuPGufvmS", "CameraMain", undefined);

      __checkObsolete__(['_decorator', 'Camera', 'Component', 'Node', 'Quat', 'tween', 'v3', 'Vec3']);

      ({
        ccclass,
        property
      } = _decorator); //let tempPos: Vec3 = v3();

      tempPos = v3();
      tempCurrentPos = v3();

      _export("CameraMain", CameraMain = (_dec = ccclass('CameraMain'), _dec2 = property(Node), _dec3 = property(Camera), _dec(_class = (_class2 = class CameraMain extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "target", _descriptor, this);

          _initializerDefineProperty(this, "camera", _descriptor2, this);

          _initializerDefineProperty(this, "smoothFactor", _descriptor3, this);

          // 平滑因子，值越小过渡越平滑
          this.initialDirection = v3();
        }

        start() {// Vec3.subtract(this.initialDirection, this.node.worldPosition, this.target!.worldPosition);
        }

        init() {
          if (this.target) {
            Vec3.subtract(this.initialDirection, this.node.worldPosition, this.target.worldPosition);
            (_crd && GlobeVariable === void 0 ? (_reportPossibleCrUseOfGlobeVariable({
              error: Error()
            }), GlobeVariable) : GlobeVariable).isCameraMove = true;
          }
        }

        update(dt) {
          if ((_crd && GlobeVariable === void 0 ? (_reportPossibleCrUseOfGlobeVariable({
            error: Error()
          }), GlobeVariable) : GlobeVariable).isCameraMove && this.target && this.camera) {
            // 计算目标位置
            Vec3.add(tempPos, this.target.worldPosition, this.initialDirection); // 获取当前相机位置

            this.camera.node.getWorldPosition(tempCurrentPos); // 使用线性插值平滑过渡到目标位置

            Vec3.lerp(tempCurrentPos, tempCurrentPos, tempPos, this.smoothFactor); // 设置相机位置

            this.camera.node.setWorldPosition(tempCurrentPos);
          }
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "target", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "camera", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "smoothFactor", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0.8;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=b99f879f75d5aabdf11107f0c09e172bd60f1b92.js.map