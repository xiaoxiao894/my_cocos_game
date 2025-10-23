System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Quat, Vec3, App, GlobeVariable, _dec, _dec2, _class, _class2, _descriptor, _crd, ccclass, property, ArroePath;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfApp(extras) {
    _reporterNs.report("App", "../App", _context.meta, extras);
  }

  function _reportPossibleCrUseOfGlobeVariable(extras) {
    _reporterNs.report("GlobeVariable", "../core/GlobeVariable", _context.meta, extras);
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
      Quat = _cc.Quat;
      Vec3 = _cc.Vec3;
    }, function (_unresolved_2) {
      App = _unresolved_2.App;
    }, function (_unresolved_3) {
      GlobeVariable = _unresolved_3.GlobeVariable;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "5896a3zK6pOXo7aKsJyppar", "ArroePath", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Node', 'Quat', 'Vec3']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("ArroePath", ArroePath = (_dec = ccclass('ArroePath'), _dec2 = property({
        tooltip: "箭头间距"
      }), _dec(_class = (_class2 = class ArroePath extends Component {
        constructor() {
          super(...arguments);

          _initializerDefineProperty(this, "spacing", _descriptor, this);

          this.arrowNodes = [];
        }

        createArrowPathTo(targetPos) {
          var player = (_crd && App === void 0 ? (_reportPossibleCrUseOfApp({
            error: Error()
          }), App) : App).playerController.getPlayer().node;
          if (!player) return;
          var start = player.worldPosition;
          var dir = new Vec3();
          Vec3.subtract(dir, targetPos, start);
          var totalLength = dir.length();

          if (totalLength < 0.01) {
            this.setArrowCount(0);
            return;
          }

          var count = Math.floor(totalLength / this.spacing);
          this.setArrowCount(count);
          dir.normalize();

          for (var i = 0; i < count; i++) {
            var arrow = this.arrowNodes[i];
            var pos = new Vec3();
            Vec3.scaleAndAdd(pos, start, dir, this.spacing * (i + 1)); // 避免从脚下起始
            //  pos.y = 1;

            arrow.setWorldPosition(pos);
            var rot = new Quat();
            Quat.fromViewUp(rot, dir, Vec3.UP);
            arrow.setWorldRotation(rot);
          }
        }

        setArrowCount(targetCount) {
          while (this.arrowNodes.length < targetCount) {
            var arrow = (_crd && App === void 0 ? (_reportPossibleCrUseOfApp({
              error: Error()
            }), App) : App).poolManager.getNode((_crd && GlobeVariable === void 0 ? (_reportPossibleCrUseOfGlobeVariable({
              error: Error()
            }), GlobeVariable) : GlobeVariable).entifyName.Guid_ArrowPath);
            arrow.setParent((_crd && App === void 0 ? (_reportPossibleCrUseOfApp({
              error: Error()
            }), App) : App).sceneNode.guideParent);
            this.arrowNodes.push(arrow);
          }

          while (this.arrowNodes.length > targetCount) {
            var _arrow = this.arrowNodes.pop();

            (_crd && App === void 0 ? (_reportPossibleCrUseOfApp({
              error: Error()
            }), App) : App).poolManager.returnNode(_arrow);

            _arrow.removeFromParent();
          }
        }
        /** 清除所有箭头 */


        clearArrows() {
          if (this.arrowNodes.length === 0) return;
          this.arrowNodes.forEach(arrow => {
            (_crd && App === void 0 ? (_reportPossibleCrUseOfApp({
              error: Error()
            }), App) : App).poolManager.returnNode(arrow);
            arrow.removeFromParent();
          });
          this.arrowNodes.length = 0;
        } // 组件销毁时清理资源


        onDestroy() {
          this.clearArrows();
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "spacing", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 3.0;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=f9cc19b5d8bef871aa676c4f5a8c47e33262e024.js.map