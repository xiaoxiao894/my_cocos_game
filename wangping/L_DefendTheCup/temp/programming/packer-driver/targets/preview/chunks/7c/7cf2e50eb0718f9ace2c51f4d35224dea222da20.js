System.register(["__unresolved_0", "cc", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, CCInteger, Collider, Component, instantiate, Node, Prefab, DeliverItem, _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _crd, ccclass, property, PillarItem;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfDeliverItem(extras) {
    _reporterNs.report("DeliverItem", "./DeliverItem", _context.meta, extras);
  }

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
      CCInteger = _cc.CCInteger;
      Collider = _cc.Collider;
      Component = _cc.Component;
      instantiate = _cc.instantiate;
      Node = _cc.Node;
      Prefab = _cc.Prefab;
    }, function (_unresolved_2) {
      DeliverItem = _unresolved_2.DeliverItem;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "3c773cCPRNNE5eX8xOvpQud", "PillarItem", undefined);

      __checkObsolete__(['_decorator', 'CCInteger', 'Collider', 'Component', 'ICollisionEvent', 'instantiate', 'Node', 'Prefab']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("PillarItem", PillarItem = (_dec = ccclass('PillarItem'), _dec2 = property(Collider), _dec3 = property(CCInteger), _dec4 = property(CCInteger), _dec5 = property(Prefab), _dec6 = property(Node), _dec(_class = (_class2 = class PillarItem extends Component {
        constructor() {
          super(...arguments);

          _initializerDefineProperty(this, "pillarCollider", _descriptor, this);

          _initializerDefineProperty(this, "unlockIndex", _descriptor2, this);

          _initializerDefineProperty(this, "needNum", _descriptor3, this);

          _initializerDefineProperty(this, "deliver", _descriptor4, this);

          _initializerDefineProperty(this, "_state", _descriptor5, this);

          this._num = 0;
          this._deliverItem = void 0;
        }

        start() {
          this._state = 0;
          this._num = 0;
          this.pillarCollider.node.active = false;
          var node = instantiate(this.deliver);

          if (node) {
            this._deliverItem = node.getComponent(_crd && DeliverItem === void 0 ? (_reportPossibleCrUseOfDeliverItem({
              error: Error()
            }), DeliverItem) : DeliverItem);
            node.active = false;
            this.node.addChild(node);
          }
        }

        onEnable() {
          this.pillarCollider.on("onCollisionEnter", this.onCollisionEnter, this);
        }

        onDisable() {
          this.pillarCollider.off("onCollisionEnter", this.onCollisionEnter, this);
        } //激活


        pillarActive() {
          this._state = 1;
          this.pillarCollider.node.active = true;

          if (this._deliverItem) {
            this._deliverItem.init(this.needNum);

            this._deliverItem.node.active = true;
          }
        }

        pillarDie() {
          this._state = 2;
        }

        itemAdd() {
          if (this._state === 1 && this._num < this.needNum) {
            var _this$_deliverItem;

            this._num++; //更新展示展示

            if (this._num >= this.needNum) {
              this.pillarDie();
            }

            (_this$_deliverItem = this._deliverItem) == null || _this$_deliverItem.addItem();
          }
        }

        onCollisionEnter(event) {//主角第一次靠近播放动画
        }

        isUnlocked() {
          return this._state == 2;
        }

        getLeftNeedNum() {
          return this.needNum - this._num;
        }

        update(deltaTime) {}

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "pillarCollider", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "unlockIndex", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "needNum", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "deliver", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "_state", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=7cf2e50eb0718f9ace2c51f4d35224dea222da20.js.map