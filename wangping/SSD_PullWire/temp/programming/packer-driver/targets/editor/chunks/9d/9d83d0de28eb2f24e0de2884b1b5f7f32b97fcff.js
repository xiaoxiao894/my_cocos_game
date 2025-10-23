System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Node, tween, v3, Vec3, EventManager, EventName, _dec, _dec2, _class, _class2, _descriptor, _crd, ccclass, property, ArrowItem;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfEventManager(extras) {
    _reporterNs.report("EventManager", "../Global/EventManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfEventName(extras) {
    _reporterNs.report("EventName", "../Common/Enum", _context.meta, extras);
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
      v3 = _cc.v3;
      Vec3 = _cc.Vec3;
    }, function (_unresolved_2) {
      EventManager = _unresolved_2.EventManager;
    }, function (_unresolved_3) {
      EventName = _unresolved_3.EventName;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "7d1c4Rz03pJz7k71Zh2AZg3", "ArrowItem", undefined);

      __checkObsolete__(['_decorator', 'BatchingUtility', 'Component', 'Node', 'tween', 'v3', 'Vec3']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("ArrowItem", ArrowItem = (_dec = ccclass('ArrowItem'), _dec2 = property(Node), _dec(_class = (_class2 = class ArrowItem extends Component {
        constructor(...args) {
          super(...args);
          this._targetVec = null;
          this._heightOffset = 4;
          this._selfEulerY = 0;
          this._rotateSpeed = 140;
          this._isTweeningShow = false;
          this._isTweeningHide = false;
          this._isArrowVisible = false;

          _initializerDefineProperty(this, "arrow", _descriptor, this);
        }

        start() {}

        onEnable() {
          (_crd && EventManager === void 0 ? (_reportPossibleCrUseOfEventManager({
            error: Error()
          }), EventManager) : EventManager).inst.on((_crd && EventName === void 0 ? (_reportPossibleCrUseOfEventName({
            error: Error()
          }), EventName) : EventName).ArrowTargetVectorUpdate, this.updateTargetVec, this);
        }

        onDisable() {
          (_crd && EventManager === void 0 ? (_reportPossibleCrUseOfEventManager({
            error: Error()
          }), EventManager) : EventManager).inst.off((_crd && EventName === void 0 ? (_reportPossibleCrUseOfEventName({
            error: Error()
          }), EventName) : EventName).ArrowTargetVectorUpdate, this.updateTargetVec, this);
        }

        update(dt) {
          if (!this._targetVec) {
            return;
          }

          const time = Date.now();
          const speed = 0.05;
          const amplitude = 0.5;
          const floatY = Math.sin(time * 0.1 * speed) * amplitude;
          this.arrow.setWorldPosition(new Vec3(this._targetVec.x, this._targetVec.y + this._heightOffset + floatY, this._targetVec.z));
          this._selfEulerY += this._rotateSpeed * dt;
          this._selfEulerY %= 360;
          this.arrow.setRotationFromEuler(180, this._selfEulerY, 0);

          if (!this._isTweeningShow && !this._isTweeningHide && !this._isArrowVisible && this._targetVec) {
            this.playScaleTween();
          } //console.log("_targetVec",this._targetVec);

        }

        playScaleTween() {
          if (this._isTweeningShow || this._isTweeningHide) return;
          this.arrow.active = true;
          this._isTweeningShow = true;
          this._isArrowVisible = true;
          this.arrow.setScale(v3(0.1, 0.1, 0.1));
          tween(this.arrow).to(0.25, {
            scale: v3(3.2, 3.2, 3.2)
          }, {
            easing: 'quadOut'
          }).to(0.15, {
            scale: v3(3, 3, 3)
          }, {
            easing: 'quadIn'
          }).call(() => {
            this._isTweeningShow = false;
            console.log("playScaleTween", this.arrow.scale);
          }).start();
        }

        stopScaleTween() {
          if (this._isTweeningShow || this._isTweeningHide) return;
          this._isTweeningHide = true;
          tween(this.arrow).to(0.25, {
            scale: v3(0, 0, 0)
          }, {
            easing: 'quadOut'
          }).call(() => {
            this._isTweeningHide = false;
            this._isArrowVisible = false;
            this.arrow.active = false;
            console.log("stopScaleTween", this.arrow.scale);
          }).start();
        }
        /** 更新目标位置 */


        updateTargetVec(pos) {
          this._targetVec = pos;

          if (this._isArrowVisible) {
            this.stopScaleTween();
          }
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "arrow", [_dec2], {
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
//# sourceMappingURL=9d83d0de28eb2f24e0de2884b1b5f7f32b97fcff.js.map