System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, CCFloat, Component, _dec, _dec2, _class, _class2, _descriptor, _crd, ccclass, property, OilDrumEffect;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  return {
    setters: [function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
      CCFloat = _cc.CCFloat;
      Component = _cc.Component;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "520d2bDP2hFRJ7TK0c6C2o+", "OilDrumEffect", undefined);

      __checkObsolete__(['_decorator', 'CCFloat', 'Component', 'Node']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("OilDrumEffect", OilDrumEffect = (_dec = ccclass('OilDrumEffect'), _dec2 = property(CCFloat), _dec(_class = (_class2 = class OilDrumEffect extends Component {
        constructor() {
          super(...arguments);

          _initializerDefineProperty(this, "singleTime", _descriptor, this);
        }

        start() {
          // 先隐藏所有子节点
          this.allHide();
        }

        allHide() {
          var siblings = this.node.children;
          siblings.forEach((sibling, index) => {
            sibling.active = false;
          });
        } // 逐个隐藏子节点


        hideChildrenSequentially() {
          var siblings = this.node.children;
          siblings.forEach((sibling, index) => {
            this.scheduleOnce(() => {
              sibling.active = false;
            }, this.singleTime * (index + 1));
          });
        } // 逐个显示子节点


        showChildrenSequentially() {
          var siblings = this.node.children;
          siblings.forEach((sibling, index) => {
            this.scheduleOnce(() => {
              sibling.active = true;
            }, this.singleTime * (index + 1));
          });
          this.scheduleOnce(() => {
            this.allHide();
          });
        }

        update(deltaTime) {// 不需要更新逻辑
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "singleTime", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0.2;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=370125253e5740d3e96366ed31b60110d7ee410a.js.map