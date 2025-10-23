System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Node, _dec, _dec2, _dec3, _class, _class2, _descriptor, _descriptor2, _crd, ccclass, property, RopeBatch;

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
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "504689JRKFGi4MpdSHx5Hl4", "RopeBatch", undefined);

      __checkObsolete__(['_decorator', 'BatchingUtility', 'Component', 'Node']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("RopeBatch", RopeBatch = (_dec = ccclass('RopeBatch'), _dec2 = property(Node), _dec3 = property(Node), _dec(_class = (_class2 = class RopeBatch extends Component {
        constructor() {
          super(...arguments);

          _initializerDefineProperty(this, "staticModalNode", _descriptor, this);

          _initializerDefineProperty(this, "batchNode", _descriptor2, this);
        }

        batchStaticModel() {// BatchingUtility.batchStaticModel(this.staticModalNode,this.batchNode);
        }

        unbatchStaticModel() {//  BatchingUtility.unbatchStaticModel(this.staticModalNode,this.batchNode);
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "staticModalNode", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "batchNode", [_dec3], {
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
//# sourceMappingURL=ea587c765b1b38f177536058549cba293a812aa2.js.map