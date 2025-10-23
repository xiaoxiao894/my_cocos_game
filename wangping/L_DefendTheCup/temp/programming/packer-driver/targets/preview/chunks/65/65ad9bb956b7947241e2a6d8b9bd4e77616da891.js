System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, PillarItem, DataManager, _dec, _dec2, _class, _class2, _descriptor, _crd, ccclass, property, PillarManager;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfPillarItem(extras) {
    _reporterNs.report("PillarItem", "./PillarItem", _context.meta, extras);
  }

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
    }, function (_unresolved_2) {
      PillarItem = _unresolved_2.PillarItem;
    }, function (_unresolved_3) {
      DataManager = _unresolved_3.DataManager;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "cdfc6JAls1E8LkyAPIBTFph", "PillarManager", undefined);

      __checkObsolete__(['_decorator', 'Component']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("default", PillarManager = (_dec = ccclass('PillarComponent'), _dec2 = property(_crd && PillarItem === void 0 ? (_reportPossibleCrUseOfPillarItem({
        error: Error()
      }), PillarItem) : PillarItem), _dec(_class = (_class2 = class PillarManager extends Component {
        constructor() {
          super(...arguments);

          _initializerDefineProperty(this, "pillars", _descriptor, this);

          this._activeIndex = 0;
          this._deliveringNum = 0;
        }

        start() {
          (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.pillarManager = this;
          this.pillars.forEach(item => {
            (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
              error: Error()
            }), DataManager) : DataManager).Instance.guideTargetList.push(item.node);
          }); //直接激活第一个

          this.scheduleOnce(() => {
            this.pillars[this._activeIndex].pillarActive();
          }, 0);
        }

        deliverItem() {
          if (this._activeIndex >= this.pillars.length) {
            return;
          }

          this._deliveringNum++;
          this.scheduleOnce(() => {
            this.pillars[this._activeIndex].itemAdd();

            if (this.pillars[this._activeIndex].isUnlocked()) {
              this._activeIndex++;

              if (this.pillars[this._activeIndex]) {
                this.pillars[this._activeIndex].pillarActive();
              }
            }

            this._deliveringNum--;
          }, 0.2);
        }

        deliverNeedNum() {
          return this.pillars[this._activeIndex].getLeftNeedNum() + this._deliveringNum;
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "pillars", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return [];
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=65ad9bb956b7947241e2a6d8b9bd4e77616da891.js.map