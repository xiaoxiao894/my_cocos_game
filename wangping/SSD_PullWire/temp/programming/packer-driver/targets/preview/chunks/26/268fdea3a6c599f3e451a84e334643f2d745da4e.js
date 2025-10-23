System.register(["__unresolved_0", "cc", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Node, CloudEffct, _dec, _dec2, _class, _class2, _descriptor, _crd, ccclass, property, GroundParent;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfCloudEffct(extras) {
    _reporterNs.report("CloudEffct", "./CloudEffct", _context.meta, extras);
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
      Node = _cc.Node;
    }, function (_unresolved_2) {
      CloudEffct = _unresolved_2.CloudEffct;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "04f0d42V8tGxaooB8OuwLEt", "GroundParent", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Node']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("GroundParent", GroundParent = (_dec = ccclass('GroundParent'), _dec2 = property(Node), _dec(_class = (_class2 = class GroundParent extends Component {
        constructor() {
          super(...arguments);

          _initializerDefineProperty(this, "cloudNode", _descriptor, this);

          this.siblings = null;
        }

        cloudFadeEffct(isFade) {
          this.siblings = this.cloudNode.children;

          if (this.siblings.length === 0) {
            console.warn("当前云节点没有子节点");
            return;
          } // 遍历并处理同级节点


          this.siblings.forEach((sibling, index) => {
            sibling.getComponent(_crd && CloudEffct === void 0 ? (_reportPossibleCrUseOfCloudEffct({
              error: Error()
            }), CloudEffct) : CloudEffct).startEffect(isFade);
          });
        }

        start() {}

        update(deltaTime) {}

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "cloudNode", [_dec2], {
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
//# sourceMappingURL=268fdea3a6c599f3e451a84e334643f2d745da4e.js.map