System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Color, Component, Label, Node, tween, Vec3, EventManager, EventType, GlobeVariable, _dec, _dec2, _dec3, _class, _class2, _descriptor, _descriptor2, _crd, ccclass, property, CoinComponent;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfEventManager(extras) {
    _reporterNs.report("EventManager", "../core/EventManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfEventType(extras) {
    _reporterNs.report("EventType", "../core/EventType", _context.meta, extras);
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
      Color = _cc.Color;
      Component = _cc.Component;
      Label = _cc.Label;
      Node = _cc.Node;
      tween = _cc.tween;
      Vec3 = _cc.Vec3;
    }, function (_unresolved_2) {
      EventManager = _unresolved_2.EventManager;
    }, function (_unresolved_3) {
      EventType = _unresolved_3.EventType;
    }, function (_unresolved_4) {
      GlobeVariable = _unresolved_4.GlobeVariable;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "7f606LcKa5EEq9+Q3cVdrzP", "CoinComponent", undefined);

      __checkObsolete__(['_decorator', 'Camera', 'Color', 'color', 'Component', 'instantiate', 'Label', 'Node', 'Quat', 'Tween', 'tween', 'Vec3']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("CoinComponent", CoinComponent = (_dec = ccclass('CoinComponent'), _dec2 = property(Label), _dec3 = property(Node), _dec(_class = (_class2 = class CoinComponent extends Component {
        constructor() {
          super(...arguments);

          _initializerDefineProperty(this, "coinNum", _descriptor, this);

          _initializerDefineProperty(this, "breathNode", _descriptor2, this);

          this._coinNum = 0;
          this._breathTween = null;
        }

        start() {
          this._coinNum = (_crd && GlobeVariable === void 0 ? (_reportPossibleCrUseOfGlobeVariable({
            error: Error()
          }), GlobeVariable) : GlobeVariable).coinStartNum;
          this.updateCoinNum();
        }

        onEnable() {
          (_crd && EventManager === void 0 ? (_reportPossibleCrUseOfEventManager({
            error: Error()
          }), EventManager) : EventManager).instance.on((_crd && EventType === void 0 ? (_reportPossibleCrUseOfEventType({
            error: Error()
          }), EventType) : EventType).CoinAdd, this.coinAdd, this);
          (_crd && EventManager === void 0 ? (_reportPossibleCrUseOfEventManager({
            error: Error()
          }), EventManager) : EventManager).instance.on((_crd && EventType === void 0 ? (_reportPossibleCrUseOfEventType({
            error: Error()
          }), EventType) : EventType).CoinSub, this.coinSub, this);
          (_crd && EventManager === void 0 ? (_reportPossibleCrUseOfEventManager({
            error: Error()
          }), EventManager) : EventManager).instance.on((_crd && EventType === void 0 ? (_reportPossibleCrUseOfEventType({
            error: Error()
          }), EventType) : EventType).ContinueCoin, this.continueCoin, this);
        }

        onDisable() {
          (_crd && EventManager === void 0 ? (_reportPossibleCrUseOfEventManager({
            error: Error()
          }), EventManager) : EventManager).instance.off((_crd && EventType === void 0 ? (_reportPossibleCrUseOfEventType({
            error: Error()
          }), EventType) : EventType).CoinAdd, this.coinAdd, this);
          (_crd && EventManager === void 0 ? (_reportPossibleCrUseOfEventManager({
            error: Error()
          }), EventManager) : EventManager).instance.off((_crd && EventType === void 0 ? (_reportPossibleCrUseOfEventType({
            error: Error()
          }), EventType) : EventType).CoinSub, this.coinSub, this);
          (_crd && EventManager === void 0 ? (_reportPossibleCrUseOfEventManager({
            error: Error()
          }), EventManager) : EventManager).instance.off((_crd && EventType === void 0 ? (_reportPossibleCrUseOfEventType({
            error: Error()
          }), EventType) : EventType).ContinueCoin, this.continueCoin, this);
        }

        continueCoin() {
          this._coinNum = (_crd && GlobeVariable === void 0 ? (_reportPossibleCrUseOfGlobeVariable({
            error: Error()
          }), GlobeVariable) : GlobeVariable).coinStartNum;
          this.updateCoinNum();
        }

        coinAdd(num) {
          this._coinNum += num;
          this.updateCoinNum();
          this.playBreathAni(true);
        }

        coinSub(num) {
          this._coinNum -= num;
          this.updateCoinNum();
          this.playBreathAni(false);
        }

        updateCoinNum() {
          this.coinNum.string = String(Math.max(0, this._coinNum));
        } // 公用呼吸动画方法（防叠加）


        playBreathAni(isAdd) {
          if (this._breathTween) {
            this._breathTween.stop(); // 停止之前的动画

          }

          if (isAdd) {
            this.coinNum.color = new Color().fromHEX('#00ff00');
          } else {
            this.coinNum.color = new Color().fromHEX('#ff0000');
          }

          var tweenAni = tween(this.breathNode).to(0.08, {
            scale: new Vec3(1.1, 1.1, 1.1)
          }, {
            easing: 'quadOut'
          }).to(0.08, {
            scale: new Vec3(1, 1, 1)
          }, {
            easing: 'quadIn'
          }).call(() => {
            this.coinNum.color = new Color().fromHEX('#FFFFFF');
          }).start();
          this._breathTween = tweenAni;
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "coinNum", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "breathNode", [_dec3], {
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
//# sourceMappingURL=0cd585795c691f34ae42d62507bf21d6d56e4bf4.js.map