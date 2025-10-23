System.register(["__unresolved_0", "cc", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, instantiate, NodePool, DataManager, Pool, _crd;

  function _reportPossibleCrUseOfEntityTypeEnum(extras) {
    _reporterNs.report("EntityTypeEnum", "../Enum/Index", _context.meta, extras);
  }

  function _reportPossibleCrUseOfDataManager(extras) {
    _reporterNs.report("DataManager", "../Global/DataManager", _context.meta, extras);
  }

  _export("default", void 0);

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      instantiate = _cc.instantiate;
      NodePool = _cc.NodePool;
    }, function (_unresolved_2) {
      DataManager = _unresolved_2.DataManager;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "552c79j3OVHf7pbUT0BwXs9", "Pool", undefined);

      __checkObsolete__(['_decorator', 'Component', 'instantiate', 'Node', 'NodePool', 'Prefab']);

      _export("default", Pool = class Pool {
        constructor(type, num) {
          if (num === void 0) {
            num = 8;
          }

          this._pool = void 0;
          this._entityType = void 0;
          this._prefab = void 0;
          this._entityType = type;
          this._pool = new NodePool();
          this._prefab = (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.prefabMap.get(this._entityType);

          for (var i = 0; i < num; i++) {
            var prefab = (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
              error: Error()
            }), DataManager) : DataManager).Instance.prefabMap.get(this._entityType);

            if (prefab) {
              var itemNode = instantiate(prefab);
              itemNode.active = false;

              this._pool.put(itemNode);
            }
          }
        }

        getItem() {
          if (!this._prefab) {
            return null;
          }

          var node = instantiate(this._prefab);
          node.active = true;
          return node;
        }

        putItem(itemNode) {
          itemNode.active = false;
          itemNode.destroy();
        }

      });

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=b015c8a9062e15d5a247e7a2dd3bb348446447c5.js.map