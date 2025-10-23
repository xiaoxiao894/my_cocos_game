System.register(["__unresolved_0", "cc", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, instantiate, NodePool, DataManager, ItemPool, _crd;

  function _reportPossibleCrUseOfDataManager(extras) {
    _reporterNs.report("DataManager", "../Global/DataManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfEntityTypeEnum(extras) {
    _reporterNs.report("EntityTypeEnum", "../Enum/Index", _context.meta, extras);
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

      _cclegacy._RF.push({}, "cb430Za7DNOqpa52lc3HAtZ", "ItemPool", undefined);

      __checkObsolete__(['instantiate', 'Node', 'NodePool', 'Prefab']);

      _export("default", ItemPool = class ItemPool {
        constructor(type, num = 8) {
          this._itemPool = void 0;
          //缓存池
          this._type = void 0;
          //类型
          this._prefab = void 0;
          this._type = type;
          this._itemPool = new NodePool();
          this._prefab = (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.prefabMap.get(this._type);

          for (let i = 0; i < num; i++) {
            const prefab = (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
              error: Error()
            }), DataManager) : DataManager).Instance.prefabMap.get(this._type);

            if (prefab) {
              let itemNode = instantiate(prefab);
              itemNode.active = false;

              this._itemPool.put(itemNode);
            }
          }
        }

        getItem() {
          if (!this._prefab) {
            return null;
          }

          let node = instantiate(this._prefab);
          node.active = true;
          return node;
        }

        putItem(itemNode) {
          itemNode.destroy(); // itemNode.active = false;
          // this._itemPool.put(itemNode);
        }

      });

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=404dea9c79a02d9fa3cb43659b0fa3bc8a46f7ae.js.map