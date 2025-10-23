System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, instantiate, Pool, DataManager, EntityTypeEnum, _dec, _class, _crd, ccclass, property, ElectricTowerManager;

  function _reportPossibleCrUseOfDataManager(extras) {
    _reporterNs.report("DataManager", "../Global/DataManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfEntityTypeEnum(extras) {
    _reporterNs.report("EntityTypeEnum", "../Enum/Index", _context.meta, extras);
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
      instantiate = _cc.instantiate;
      Pool = _cc.Pool;
    }, function (_unresolved_2) {
      DataManager = _unresolved_2.DataManager;
    }, function (_unresolved_3) {
      EntityTypeEnum = _unresolved_3.EntityTypeEnum;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "55fc8JYX/lOQappgPPDi9qb", "ElectricTowerManager", undefined);

      __checkObsolete__(['_decorator', 'Component', 'instantiate', 'Node', 'Pool']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("ElectricTowerManager", ElectricTowerManager = (_dec = ccclass('ElectricTowerManager'), _dec(_class = class ElectricTowerManager extends Component {
        constructor(...args) {
          super(...args);
          this._electricTowerPool = null;
          this._electricTowerCount = 300;
        }

        start() {
          (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.electricTowerManager = this;
        }

        electricTowerManagerInit() {
          this._electricTowerPool = new Pool(() => {
            const electricTowerPrefab = (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
              error: Error()
            }), DataManager) : DataManager).Instance.prefabMap.get((_crd && EntityTypeEnum === void 0 ? (_reportPossibleCrUseOfEntityTypeEnum({
              error: Error()
            }), EntityTypeEnum) : EntityTypeEnum).Electricity);
            return instantiate(electricTowerPrefab);
          }, this._electricTowerCount, node => {
            node.removeFromParent();
          });
        }

        createElectricTower() {
          if (!this._electricTowerPool) return;

          const node = this._electricTowerPool.alloc();

          if (node.parent == null) node.setParent(this.node);
          node.active = true;
          return node;
        }

        onDestroy() {
          this._electricTowerPool.destroy();
        }

        onElectricTowerDead(node) {
          node.active = false;

          this._electricTowerPool.free(node);
        }

      }) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=21df09dfb86803f9f1762502d4783c327b41dcd7.js.map