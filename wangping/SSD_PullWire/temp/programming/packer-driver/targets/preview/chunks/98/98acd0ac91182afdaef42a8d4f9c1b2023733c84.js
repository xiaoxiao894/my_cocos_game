System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, CloudParticleEffect, eventMgr, EventType, _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _crd, ccclass, property, LandCloudFade;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfCloudParticleEffect(extras) {
    _reporterNs.report("CloudParticleEffect", "./CloudParticleEffect", _context.meta, extras);
  }

  function _reportPossibleCrUseOfeventMgr(extras) {
    _reporterNs.report("eventMgr", "./EventManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfEventType(extras) {
    _reporterNs.report("EventType", "./EventType", _context.meta, extras);
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
    }, function (_unresolved_2) {
      CloudParticleEffect = _unresolved_2.CloudParticleEffect;
    }, function (_unresolved_3) {
      eventMgr = _unresolved_3.eventMgr;
    }, function (_unresolved_4) {
      EventType = _unresolved_4.EventType;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "c22b3Nl5TtG0qcLzhtEzntf", "LandCloudFade", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Node']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("LandCloudFade", LandCloudFade = (_dec = ccclass('LandCloudFade'), _dec2 = property(_crd && CloudParticleEffect === void 0 ? (_reportPossibleCrUseOfCloudParticleEffect({
        error: Error()
      }), CloudParticleEffect) : CloudParticleEffect), _dec3 = property(_crd && CloudParticleEffect === void 0 ? (_reportPossibleCrUseOfCloudParticleEffect({
        error: Error()
      }), CloudParticleEffect) : CloudParticleEffect), _dec4 = property(_crd && CloudParticleEffect === void 0 ? (_reportPossibleCrUseOfCloudParticleEffect({
        error: Error()
      }), CloudParticleEffect) : CloudParticleEffect), _dec5 = property(_crd && CloudParticleEffect === void 0 ? (_reportPossibleCrUseOfCloudParticleEffect({
        error: Error()
      }), CloudParticleEffect) : CloudParticleEffect), _dec6 = property(_crd && CloudParticleEffect === void 0 ? (_reportPossibleCrUseOfCloudParticleEffect({
        error: Error()
      }), CloudParticleEffect) : CloudParticleEffect), _dec7 = property(_crd && CloudParticleEffect === void 0 ? (_reportPossibleCrUseOfCloudParticleEffect({
        error: Error()
      }), CloudParticleEffect) : CloudParticleEffect), _dec8 = property(_crd && CloudParticleEffect === void 0 ? (_reportPossibleCrUseOfCloudParticleEffect({
        error: Error()
      }), CloudParticleEffect) : CloudParticleEffect), _dec9 = property(_crd && CloudParticleEffect === void 0 ? (_reportPossibleCrUseOfCloudParticleEffect({
        error: Error()
      }), CloudParticleEffect) : CloudParticleEffect), _dec(_class = (_class2 = class LandCloudFade extends Component {
        constructor() {
          super(...arguments);

          _initializerDefineProperty(this, "cloudOne", _descriptor, this);

          _initializerDefineProperty(this, "cloudOne1", _descriptor2, this);

          _initializerDefineProperty(this, "cloudTwo", _descriptor3, this);

          _initializerDefineProperty(this, "cloudTwo1", _descriptor4, this);

          _initializerDefineProperty(this, "cloudThree", _descriptor5, this);

          _initializerDefineProperty(this, "cloudThree1", _descriptor6, this);

          _initializerDefineProperty(this, "cloudFour", _descriptor7, this);

          _initializerDefineProperty(this, "cloudFour1", _descriptor8, this);
        }

        start() {
          (_crd && eventMgr === void 0 ? (_reportPossibleCrUseOfeventMgr({
            error: Error()
          }), eventMgr) : eventMgr).on((_crd && EventType === void 0 ? (_reportPossibleCrUseOfEventType({
            error: Error()
          }), EventType) : EventType).MapLand_allCloudFade, this.allCloudFade, this);
        }

        allCloudFade() {
          this.cloudOne.cloudFadeEffct(false);
          this.cloudOne1.cloudFadeEffct(false);
          this.cloudTwo.cloudFadeEffct(false);
          this.cloudTwo1.cloudFadeEffct(false);
          this.cloudThree.cloudFadeEffct(false);
          this.cloudThree1.cloudFadeEffct(false);
          this.cloudFour.cloudFadeEffct(false);
          this.cloudFour1.cloudFadeEffct(false);
        }

        update(deltaTime) {}

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "cloudOne", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "cloudOne1", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "cloudTwo", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "cloudTwo1", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "cloudThree", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "cloudThree1", [_dec7], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "cloudFour", [_dec8], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "cloudFour1", [_dec9], {
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
//# sourceMappingURL=98acd0ac91182afdaef42a8d4f9c1b2023733c84.js.map