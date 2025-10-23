System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, tween, Vec3, _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _crd, ccclass, property, ItemAreaManager;

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
      tween = _cc.tween;
      Vec3 = _cc.Vec3;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "efa39reRJ1HXrpq1rt3SXRO", "ItemAreaManager", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Node', 'tween', 'Vec3']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("ItemAreaManager", ItemAreaManager = (_dec = ccclass('ItemAreaManager'), _dec2 = property({
        tooltip: "技能生成位置的随机偏移范围（单位：米）"
      }), _dec3 = property({
        tooltip: "技能释放的整体朝向角度（绕Y轴，单位：度）"
      }), _dec4 = property({
        tooltip: "技能检测的影响半径（仅XZ平面）"
      }), _dec5 = property({
        tooltip: "第一圈技能的半径（单位：米）"
      }), _dec6 = property({
        tooltip: "每一圈向外扩展的间隔距离（单位：米）"
      }), _dec7 = property({
        tooltip: "总共生成多少圈技能效果"
      }), _dec8 = property({
        tooltip: "每一圈释放技能的延迟时间（单位：秒）"
      }), _dec9 = property({
        tooltip: "技能扇形的覆盖角度（单位：度）"
      }), _dec(_class = (_class2 = class ItemAreaManager extends Component {
        constructor(...args) {
          super(...args);
          this._duration = 0.3;

          _initializerDefineProperty(this, "radiusRandomOffset", _descriptor, this);

          _initializerDefineProperty(this, "directionAngleDeg", _descriptor2, this);

          _initializerDefineProperty(this, "skillDetectRadius", _descriptor3, this);

          _initializerDefineProperty(this, "initialRadius", _descriptor4, this);

          _initializerDefineProperty(this, "ringStep", _descriptor5, this);

          _initializerDefineProperty(this, "ringCount", _descriptor6, this);

          _initializerDefineProperty(this, "delayPerRing", _descriptor7, this);

          _initializerDefineProperty(this, "spreadAngle", _descriptor8, this);
        }

        displayAni(node) {
          tween(node).to(this._duration, {
            scale: new Vec3(1, 1, 1)
          }, {
            easing: 'backOut'
          }) // 带弹性效果
          .start();
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "radiusRandomOffset", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 3;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "directionAngleDeg", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "skillDetectRadius", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 4;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "initialRadius", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 5;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "ringStep", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 5;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "ringCount", [_dec7], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 5;
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "delayPerRing", [_dec8], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0.3;
        }
      }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "spreadAngle", [_dec9], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 130;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=8f8e00cdb01e490249330f33fef86eff8441001d.js.map