System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Node, tween, UIOpacity, Vec3, _dec, _dec2, _class, _class2, _descriptor, _crd, ccclass, property, BubbleFead;

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
      Node = _cc.Node;
      tween = _cc.tween;
      UIOpacity = _cc.UIOpacity;
      Vec3 = _cc.Vec3;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "7441enf6TFDF4qKO6ibFUrX", "BubbleFead", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Node', 'tween', 'UIOpacity', 'Vec3']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("BubbleFead", BubbleFead = (_dec = ccclass('BubbleFead'), _dec2 = property({
        type: Node,
        tooltip: "升级节点1"
      }), _dec(_class = (_class2 = class BubbleFead extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "imageFead", _descriptor, this);

          this.isFead = false;
        }

        onLoad() {
          this.imageFead.forEach(item => {
            item.addComponent(UIOpacity);
          });
        }

        start() {
          this.Show();
        }

        hideFead() {
          this.isFead = true;
          this.imageFead.forEach(element => {
            const uiOpacity = element.getComponent(UIOpacity);

            if (uiOpacity) {
              tween(uiOpacity).to(0.5, {
                opacity: 0
              }) // 操作 UIOpacity 组件的 opacity 属性
              .start();
            }
          });
        }

        getFeadState() {
          return this.isFead;
        }

        Show() {
          this.imageFead.forEach(element => {
            const originalScale = element.scale.clone();
            const shrunkenScale = originalScale.clone().multiplyScalar(1.2);
            const uiOpacity = element.getComponent(UIOpacity); // uiOpacity.opacity = 0;

            if (uiOpacity) {
              // 使用 parallel 同时执行透明度和缩放动画
              tween(uiOpacity).to(0.5, {
                opacity: 255
              }).start(); // 操作 UIOpacity 组件的 opacity 属性     

              tween(element).to(0.2, {
                scale: shrunkenScale
              }) // 操作 Node 的 scale 属性
              .to(0.2, {
                scale: originalScale
              }) // 操作 Node 的 scale 属性
              .start();
            }
          });
        }

        Show1(num = -1) {
          console.log("num num == ", num);

          if (num == 1) {
            this.imageFead[0].parent.parent.position = new Vec3(this.imageFead[0].parent.parent.position.x, 5.763, this.imageFead[0].parent.parent.position.z);
          }

          if (num == 2) {
            this.imageFead[0].parent.parent.position = new Vec3(this.imageFead[0].parent.parent.position.x, 4.763, this.imageFead[0].parent.parent.position.z);
          }

          this.imageFead.forEach(element => {
            const originalScale = new Vec3(0.01, 0.01, 0.01);
            const shrunkenScale = originalScale.clone().multiplyScalar(1.2);
            const uiOpacity = element.getComponent(UIOpacity); // uiOpacity.opacity = 0;

            if (uiOpacity) {
              // 使用 parallel 同时执行透明度和缩放动画
              tween(uiOpacity).to(0.5, {
                opacity: 255
              }).start(); // 操作 UIOpacity 组件的 opacity 属性     

              tween(element).to(0.2, {
                scale: shrunkenScale
              }) // 操作 Node 的 scale 属性
              .to(0.2, {
                scale: originalScale
              }) // 操作 Node 的 scale 属性
              .start();
            }
          });
        } // initShow


        update(deltaTime) {}

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "imageFead", [_dec2], {
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
//# sourceMappingURL=5d2376fdbd6823ba614473b3db32a02cf631fba5.js.map