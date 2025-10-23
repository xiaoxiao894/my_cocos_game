System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Node, PlayerPylon, PlayerTurret, _dec, _dec2, _dec3, _class, _class2, _descriptor, _descriptor2, _crd, ccclass, property, AnimationEvent;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfPlayerPylon(extras) {
    _reporterNs.report("PlayerPylon", "./Entitys/PlayerPylon", _context.meta, extras);
  }

  function _reportPossibleCrUseOfPlayerTurret(extras) {
    _reporterNs.report("PlayerTurret", "./Entitys/PlayerTurret", _context.meta, extras);
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
      PlayerPylon = _unresolved_2.PlayerPylon;
    }, function (_unresolved_3) {
      PlayerTurret = _unresolved_3.PlayerTurret;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "bfbc9ELKgdAG5ji9hLF+VZv", "AnimationEvent", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Node']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("AnimationEvent", AnimationEvent = (_dec = ccclass('AnimationEvent'), _dec2 = property({
        type: Node
      }), _dec3 = property({
        type: Number
      }), _dec(_class = (_class2 = class AnimationEvent extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "target", _descriptor, this);

          _initializerDefineProperty(this, "targetType", _descriptor2, this);
        }

        // 1-火柴盒 2-炮塔
        AttackAni() {
          if (this.targetType == 1) {
            this.target.getComponent(_crd && PlayerPylon === void 0 ? (_reportPossibleCrUseOfPlayerPylon({
              error: Error()
            }), PlayerPylon) : PlayerPylon).AttackAni();
          }

          if (this.targetType == 2) {
            this.target.getComponent(_crd && PlayerTurret === void 0 ? (_reportPossibleCrUseOfPlayerTurret({
              error: Error()
            }), PlayerTurret) : PlayerTurret).AttackAni();
          }
        }

        restFireEvent() {
          if (this.targetType == 1) {
            this.target.getComponent(_crd && PlayerPylon === void 0 ? (_reportPossibleCrUseOfPlayerPylon({
              error: Error()
            }), PlayerPylon) : PlayerPylon).restFireEvent();
          }
        }

        start() {}

        update(deltaTime) {}

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "target", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "targetType", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 1;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=73c24484725bd87557e996d1638e56f1b53d1401.js.map