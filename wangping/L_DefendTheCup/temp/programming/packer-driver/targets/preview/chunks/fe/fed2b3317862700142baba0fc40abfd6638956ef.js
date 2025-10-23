System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, GridSystem, _crd;

  _export("GridSystem", void 0);

  return {
    setters: [function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "521f93YxnBH4rzlaLgB42vA", "GridSystem", undefined);

      __checkObsolete__(['Vec3', 'Node']);

      _export("GridSystem", GridSystem = class GridSystem {
        constructor(gridSize) {
          if (gridSize === void 0) {
            gridSize = 5;
          }

          this.gridSize = void 0;
          this.gridMap = new Map();
          this.nodeGridKey = new Map();
          this.gridSize = gridSize;
        }

        getGridKey(pos) {
          var gx = Math.floor(pos.x / this.gridSize);
          var gz = Math.floor(pos.z / this.gridSize);
          return gx + "_" + gz;
        } // 注册或更新怪物位置


        updateNode(node) {
          if (!node || !node.worldPosition) return;
          var newKey = this.getGridKey(node.worldPosition);
          var lastKey = this.nodeGridKey.get(node);
          if (lastKey === newKey) return; // 没移动出格子
          // 1. 旧格子移除

          if (lastKey && this.gridMap.has(lastKey)) {
            var _this$gridMap$get;

            (_this$gridMap$get = this.gridMap.get(lastKey)) == null || _this$gridMap$get.delete(node);
          } // 2. 新格子添加


          if (!this.gridMap.has(newKey)) {
            this.gridMap.set(newKey, new Set());
          }

          this.gridMap.get(newKey).add(node); // 3. 记录新位置

          this.nodeGridKey.set(node, newKey);
        } // 获取攻击范围内的怪物（粗略）


        getNearbyNodes(centerPos, range) {
          var result = [];
          var cx = Math.floor(centerPos.x / this.gridSize);
          var cz = Math.floor(centerPos.z / this.gridSize);
          var r = Math.ceil(range / this.gridSize);

          for (var dx = -r; dx <= r; dx++) {
            for (var dz = -r; dz <= r; dz++) {
              var key = cx + dx + "_" + (cz + dz);
              var set = this.gridMap.get(key);

              if (set) {
                for (var node of set) {
                  result.push(node);
                }
              }
            }
          }

          return result;
        } // 移除节点


        removeNode(node) {
          var key = this.nodeGridKey.get(node);

          if (key && this.gridMap.has(key)) {
            var _this$gridMap$get2;

            (_this$gridMap$get2 = this.gridMap.get(key)) == null || _this$gridMap$get2.delete(node);
          }

          this.nodeGridKey.delete(node);
        }

      });

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=fed2b3317862700142baba0fc40abfd6638956ef.js.map