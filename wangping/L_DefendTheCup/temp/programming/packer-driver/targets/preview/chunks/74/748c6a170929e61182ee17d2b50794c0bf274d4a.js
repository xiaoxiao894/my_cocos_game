System.register(["__unresolved_0", "cc", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Camera, Component, Node, v3, Vec3, DataManager, _dec, _dec2, _dec3, _class, _class2, _descriptor, _descriptor2, _crd, ccclass, property, tempPos, CameraMain;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfDataManager(extras) {
    _reporterNs.report("DataManager", "../Global/DataManager", _context.meta, extras);
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
      DataManager = _unresolved_2.DataManager;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "572c3TBPI9AjpSLbigjiQz+", "CameraMain", undefined);

      __checkObsolete__(['_decorator', 'Camera', 'Component', 'Node', 'Quat', 'tween', 'v3', 'Vec3']);

      ({
        ccclass,
        property
      } = _decorator);
      tempPos = v3();

      _export("CameraMain", CameraMain = (_dec = ccclass('CameraMain'), _dec2 = property(Node), _dec3 = property(Camera), _dec(_class = (_class2 = class CameraMain extends Component {
        constructor() {
          super(...arguments);

          _initializerDefineProperty(this, "target", _descriptor, this);

          _initializerDefineProperty(this, "camera", _descriptor2, this);

          this.initialDirection = v3();
        }

        start() {
          (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.mainCamera = this;
          Vec3.subtract(this.initialDirection, this.node.worldPosition, this.target.worldPosition);
        }

        update(dt) {
          Vec3.add(tempPos, this.target.worldPosition, this.initialDirection);

          if (this.camera) {
            this.camera.node.setWorldPosition(tempPos);
          }
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "target", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "camera", [_dec3], {
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
//# sourceMappingURL=748c6a170929e61182ee17d2b50794c0bf274d4a.js.map