System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, instantiate, NodePool, _dec, _class, _class2, _crd, ccclass, property, NodePoolManager;

  return {
    setters: [function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
      instantiate = _cc.instantiate;
      NodePool = _cc.NodePool;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "09900q7FZJG+L9sU/K6SFnf", "NodePoolManager", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Node', 'instantiate', 'Prefab', 'NodePool']);

      ({
        ccclass,
        property
      } = _decorator);
      /**
       * 节点池管理类 - 用于管理游戏中的节点池
       */

      _export("NodePoolManager", NodePoolManager = (_dec = ccclass('NodePoolManager'), _dec(_class = (_class2 = class NodePoolManager {
        constructor() {
          // 存储节点池的映射表，键为预制体路径或名称，值为节点池和预制体的信息
          this.poolMap = new Map();
        }

        static get Instance() {
          if (!this._instance) {
            this._instance = new NodePoolManager();
          }

          return this._instance;
        }

        /**
         * 初始化节点池
         * @param prefab 预制体
         * @param poolSize 初始池大小
         * @param poolName 池名称，可选，默认为预制体名称
         */
        initPool(prefab, poolSize = 5, poolName) {
          const name = poolName || prefab.data.name; // 如果已存在该名称的节点池，则先清理

          if (this.poolMap.has(name)) {
            this.clearPool(name);
          } // 创建新的节点池


          const nodePool = new NodePool();
          this.poolMap.set(name, {
            pool: nodePool,
            prefab: prefab
          }); // 预创建指定数量的节点

          this.expandPool(name, poolSize);
        }
        /**
         * 从节点池获取节点
         * @param prefabOrName 预制体或池名称
         * @returns 节点实例，如果池为空则返回null
         */


        getNode(prefabOrName) {
          let poolInfo = null;
          let poolName = ''; // 根据传入参数类型确定池名称

          if (typeof prefabOrName === 'string') {
            poolName = prefabOrName;
            poolInfo = this.poolMap.get(poolName);
          } else {
            poolName = prefabOrName.data.name;
            poolInfo = this.poolMap.get(poolName); // 如果节点池不存在，则初始化一个

            if (!poolInfo) {
              this.initPool(prefabOrName);
              poolInfo = this.poolMap.get(poolName);
            }
          }

          if (!poolInfo) {
            console.warn(`NodePoolManager: 未找到名为 ${poolName} 的节点池`);
            return null;
          }

          let node = null;
          const {
            pool,
            prefab
          } = poolInfo; // 从节点池获取节点，如果没有则创建新节点

          if (pool.size() > 0) {
            node = pool.get();
          } else {
            node = instantiate(prefab);
            node.name = prefab.data.name;
          }

          return node;
        }
        /**
         * 将节点返回到节点池
         * @param node 要返回的节点
         * @param poolName 池名称，可选，默认为节点名称
         */


        returnNode(node, poolName) {
          const name = poolName || node.name;
          const poolInfo = this.poolMap.get(name);

          if (!poolInfo) {
            console.warn(`NodePoolManager: 未找到名为 ${name} 的节点池，节点 ${node.name} 无法返回`);
            node.destroy();
            return;
          } // 将节点放回节点池


          try {
            poolInfo.pool.put(node);
          } catch (error) {
            console.error(`NodePoolManager: 返回节点 ${node.name} 到池 ${name} 时出错:`, error);
            node.destroy();
          }
        }
        /**
         * 扩展节点池大小
         * @param poolName 池名称
         * @param size 要扩展的数量
         */


        expandPool(poolName, size) {
          const poolInfo = this.poolMap.get(poolName);

          if (!poolInfo) {
            console.warn(`NodePoolManager: 未找到名为 ${poolName} 的节点池`);
            return;
          }

          const {
            pool,
            prefab
          } = poolInfo;

          for (let i = 0; i < size; i++) {
            const node = instantiate(prefab);
            node.name = prefab.data.name;
            pool.put(node);
          }
        }
        /**
         * 清理指定节点池
         * @param poolName 池名称
         */


        clearPool(poolName) {
          const poolInfo = this.poolMap.get(poolName);

          if (poolInfo) {
            poolInfo.pool.clear();
            this.poolMap.delete(poolName);
          }
        }
        /**
         * 清理所有节点池
         */


        clearAllPools() {
          this.poolMap.forEach((value, key) => {
            value.pool.clear();
          });
          this.poolMap.clear();
        }
        /**
         * 获取指定节点池的大小
         * @param poolName 池名称
         * @returns 节点池大小
         */


        getPoolSize(poolName) {
          const poolInfo = this.poolMap.get(poolName);
          return poolInfo ? poolInfo.pool.size() : 0;
        }

      }, _class2._instance = null, _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=494d79bebf2c43cf4eea51aae710cd8b6abe3465.js.map