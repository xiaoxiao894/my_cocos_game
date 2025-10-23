System.register(["__unresolved_0", "cc", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Node, tween, Vec3, DataManager, _dec, _dec2, _dec3, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _crd, ccclass, property, ConveyerBeltManager;

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
      Component = _cc.Component;
      Node = _cc.Node;
      tween = _cc.tween;
      Vec3 = _cc.Vec3;
    }, function (_unresolved_2) {
      DataManager = _unresolved_2.DataManager;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "4ddbeWlEPNOy4r1SPbWI0xU", "ConveyerBeltManager", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Node', 'tween', 'Vec3']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("ConveyerBeltManager", ConveyerBeltManager = (_dec = ccclass('ConveyerBeltManager'), _dec2 = property(Node), _dec3 = property(Node), _dec(_class = (_class2 = class ConveyerBeltManager extends Component {
        constructor() {
          super(...arguments);

          _initializerDefineProperty(this, "chuansongdai", _descriptor, this);

          _initializerDefineProperty(this, "mianqian", _descriptor2, this);

          _initializerDefineProperty(this, "delayBetween", _descriptor3, this);

          _initializerDefineProperty(this, "scaleUp", _descriptor4, this);

          _initializerDefineProperty(this, "scaleEnd", _descriptor5, this);

          _initializerDefineProperty(this, "duration", _descriptor6, this);
        }

        // 总时长（放大+缩小）
        start() {
          (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.conveyerBeltManager = this;
        }

        init() {
          this.scheduleOnce(() => {
            this.chuansongdaiAni();
            this.mianqianAni();
          });
        }

        chuansongdaiAni() {
          var children = this.chuansongdai.children;
          var halfDur = this.duration / 2;

          for (var i = 0; i < children.length; i++) {
            var child = children[i];
            var delay = i * this.delayBetween;
            tween(child).delay(delay).to(halfDur, {
              scale: new Vec3(this.scaleUp, this.scaleUp, this.scaleUp),
              position: new Vec3(child.position.x, 0.025, child.position.z)
            }, {
              easing: 'quadOut'
            }).to(halfDur, {
              scale: new Vec3(this.scaleEnd, this.scaleEnd, this.scaleEnd)
            }, {
              easing: 'quadIn'
            }).start();
          }
        }

        mianqianAni() {
          var children = this.mianqian.children;
          var halfDur = this.duration / 2;

          for (var i = 0; i < children.length; i++) {
            var child = children[i];
            var delay = i * this.delayBetween;
            var baseScale = new Vec3(40, 40, 40); // 初始缩放

            var peakScale = new Vec3(40, 40, 44); // 抛物线顶点
            // 强制设置初始 x/y = 40
            // child.setScale(baseScale);

            tween(child).delay(delay).to(halfDur, {
              scale: peakScale
            }, {
              easing: 'quadOut'
            }).to(halfDur, {
              scale: baseScale
            }, {
              easing: 'quadIn'
            }).start();
          }
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "chuansongdai", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "mianqian", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "delayBetween", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0.1;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "scaleUp", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 1.2;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "scaleEnd", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 1.0;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "duration", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0.3;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=e8ce2590d931cf3b53a36be9f1dd546ade3a8471.js.map