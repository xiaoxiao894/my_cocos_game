System.register(["__unresolved_0", "cc", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Vec3, DataManager, _dec, _class, _crd, ccclass, property, SearchTreeManager;

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
      Vec3 = _cc.Vec3;
    }, function (_unresolved_2) {
      DataManager = _unresolved_2.DataManager;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "9f2a7ItdZlPSre3J2vRUZA7", "SearchTreeManager", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Node', 'Vec3']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("SearchTreeManager", SearchTreeManager = (_dec = ccclass('SearchTreeManager'), _dec(_class = class SearchTreeManager extends Component {
        constructor(...args) {
          super(...args);
          // 优先搜索前56个
          this.searchNumber = 56;
        }

        start() {
          (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.searchTreeManager = this;
        }

        getAttackTargets(player, attackRange, maxAngle, isPlayer = false) {
          if (!(_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.gridSystem) return;
          const nearby = (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.gridSystem.getNearbyNodes(player.worldPosition, attackRange);
          const forward = player.forward.clone().normalize();
          const result = [];

          for (let i = 0; i < nearby.length; i++) {
            const enemy = nearby[i];
            if (!enemy.activeInHierarchy) continue;
            const toEnemy = enemy.worldPosition.clone().subtract(player.worldPosition);
            const dist = toEnemy.length();
            if (dist > attackRange) continue;
            toEnemy.normalize();
            const angle = Math.acos(Vec3.dot(forward, toEnemy)) * 180 / Math.PI;

            if (angle <= maxAngle) {
              result.push(enemy);
            }
          }

          return result;
        }

      }) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=afdbc5536b376720c97536c860e1e58f1b5193ce.js.map