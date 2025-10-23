System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Camera, Component, instantiate, Node, UITransform, Vec3, DataManager, EntityTypeEnum, _dec, _dec2, _dec3, _class, _class2, _descriptor, _descriptor2, _crd, ccclass, property, _tempWorldPos, _tempUINodePos, BossTipConMananger;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfDataManager(extras) {
    _reporterNs.report("DataManager", "../Global/DataManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfEntityTypeEnum(extras) {
    _reporterNs.report("EntityTypeEnum", "../Enum/Index", _context.meta, extras);
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
      instantiate = _cc.instantiate;
      Node = _cc.Node;
      UITransform = _cc.UITransform;
      Vec3 = _cc.Vec3;
    }, function (_unresolved_2) {
      DataManager = _unresolved_2.DataManager;
    }, function (_unresolved_3) {
      EntityTypeEnum = _unresolved_3.EntityTypeEnum;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "d596aBxXZNByb5kh3bc8ocs", "BossTipConMananger", undefined);

      __checkObsolete__(['_decorator', 'Camera', 'Component', 'instantiate', 'Node', 'UITransform', 'Vec3', 'v3']);

      ({
        ccclass,
        property
      } = _decorator);
      _tempWorldPos = new Vec3();
      _tempUINodePos = new Vec3();

      _export("BossTipConMananger", BossTipConMananger = (_dec = ccclass('BossTipConMananger'), _dec2 = property(Camera), _dec3 = property(Node), _dec(_class = (_class2 = class BossTipConMananger extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "camera", _descriptor, this);

          _initializerDefineProperty(this, "canvas", _descriptor2, this);

          //@property
          this.margin = 30;
          this.arrowMargin = 100;
          this.disableLen = 120;
          this.arrowTargets = [];
        }

        start() {
          (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.BossTipConManager = this;
        }

        update() {
          for (const arrow of this.arrowTargets) {
            this.updateArrowForTarget(arrow);
          }
        }

        addTarget(target3D) {
          const prefab = (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.prefabMap.get((_crd && EntityTypeEnum === void 0 ? (_reportPossibleCrUseOfEntityTypeEnum({
            error: Error()
          }), EntityTypeEnum) : EntityTypeEnum).BoosTip);

          if (!prefab) {
            console.warn("BoosTip prefab not found");
            return;
          }

          const bossTipNode = instantiate(prefab);
          bossTipNode.setParent(this.node);
          bossTipNode.setSiblingIndex(999);
          const tipTransform = bossTipNode.getComponent(UITransform);

          if (tipTransform) {
            tipTransform.anchorPoint.set(0.5, 0.5);
          }

          this.arrowTargets.push({
            target3D,
            bossTipNode
          });
        }

        removeTarget(target3D) {
          const index = this.arrowTargets.findIndex(a => a.target3D === target3D);

          if (index >= 0) {
            this.arrowTargets[index].bossTipNode.destroy();
            this.arrowTargets.splice(index, 1);
          }
        }

        updateArrowForTarget({
          target3D,
          bossTipNode
        }) {
          if (!target3D || !target3D.isValid) return;
          target3D.getWorldPosition(_tempWorldPos); //  提高箭头在目标上方

          _tempWorldPos.y += 3.5; //  3D → UI 坐标

          this.camera.convertToUINode(_tempWorldPos, this.canvas, _tempUINodePos);
          const canvasTransform = this.canvas.getComponent(UITransform);
          const halfW = canvasTransform.contentSize.width / 2;
          const halfH = canvasTransform.contentSize.height / 2; //  判断是否在视野内

          const isInView = _tempUINodePos.x >= -halfW + this.margin && _tempUINodePos.x <= halfW - this.margin && _tempUINodePos.y >= -halfH + this.margin && _tempUINodePos.y <= halfH - this.margin;
          const arrow = bossTipNode.getChildByName("Arrow");
          bossTipNode.active = true;

          if (isInView) {
            // 屏幕内：箭头归零，位置靠近目标
            if (arrow) arrow.angle = 0;
            bossTipNode.active = false;
            const dist = 100;
            const angleRad = bossTipNode.angle * Math.PI / 180;
            _tempUINodePos.x += -Math.sin(angleRad) * dist;
            _tempUINodePos.y += Math.cos(angleRad) * dist;
            bossTipNode.setPosition(_tempUINodePos);

            if (Math.abs(_tempUINodePos.x) < this.disableLen || Math.abs(_tempUINodePos.y) < this.disableLen) {
              bossTipNode.active = false;
            }
          } else {
            // 屏幕外：箭头指向目标方向
            const dir = _tempUINodePos.clone().normalize();

            if (arrow) arrow.angle = Math.atan2(dir.y, dir.x) * 180 / Math.PI + 90;
            const clampedX = Math.min(Math.max(_tempUINodePos.x, -halfW + this.arrowMargin), halfW - this.arrowMargin);
            const clampedY = Math.min(Math.max(_tempUINodePos.y, -halfH + this.arrowMargin), halfH - this.arrowMargin);
            bossTipNode.setPosition(new Vec3(clampedX, clampedY, 0));
            bossTipNode.active = true;
          }
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "camera", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "canvas", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=9c261f96950829f95954029af4b75afbe0485f8d.js.map