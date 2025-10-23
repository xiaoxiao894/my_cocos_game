System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, NodePool, director, instantiate, isValid, Director, PoolManager, _crd, ccclass, property, poolManager;

  _export("PoolManager", void 0);

  return {
    setters: [function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
      NodePool = _cc.NodePool;
      director = _cc.director;
      instantiate = _cc.instantiate;
      isValid = _cc.isValid;
      Director = _cc.Director;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "307783P7ndHdJ2ivaQqDHrt", "PoolManager", undefined);

      __checkObsolete__(['_decorator', 'Node', 'Prefab', 'NodePool', 'director', 'instantiate', 'isValid', 'Director']);

      ({
        ccclass,
        property
      } = _decorator);
      /**
       * Cocos Creator 3.8.0 专用节点池管理器
       * 功能：
       * 1. 多对象池管理
       * 2. 自动扩容机制
       * 3. 内存安全检测
       * 4. 节点回收重置
       */

      _export("PoolManager", PoolManager = class PoolManager {
        constructor() {
          this._poolDict = new Map();
          this._prefabDict = new Map();
          this._resetFuncDict = new Map();
        }

        static get instance() {
          if (!this._instance) {
            this._instance = new PoolManager(); // 使用新的 game 事件系统

            director.on(Director.EVENT_BEFORE_SCENE_LOADING, () => {
              var _this$_instance;

              (_this$_instance = this._instance) == null || _this$_instance.clearAll();
            });
          }

          return this._instance;
        }
        /**
         * 初始化对象池
         * @param poolName 对象池名称
         * @param prefab 预制体
         * @param initSize 初始大小
         * @param resetFunc (可选)节点回收时的重置函数
         */


        initPool(poolName, prefab, initSize, resetFunc) {
          if (this._poolDict.has(poolName)) {
            console.warn(`对象池 ${poolName} 已存在!`);
            return;
          } // 创建新对象池（3.8.0 不需要传递组件类型）


          const pool = new NodePool();

          this._poolDict.set(poolName, pool);

          this._prefabDict.set(poolName, prefab); // 保存重置函数


          if (resetFunc) {
            this._resetFuncDict.set(poolName, resetFunc);
          } // 预生成节点


          this._expandPool(poolName, initSize);
        }
        /**
         * 从对象池获取节点
         * @param poolName 对象池名称
         * @returns 节点或null(如果对象池未初始化)
         */


        getNode(poolName) {
          if (!this._poolDict.has(poolName)) {
            console.error(`对象池 ${poolName} 未初始化!`);
            return null;
          }

          const pool = this._poolDict.get(poolName);

          const prefab = this._prefabDict.get(poolName); // 对象池中有可用节点


          if (pool && pool.size() > 0) {
            return pool.get();
          } // 对象池为空，动态扩容


          console.log(`对象池 ${poolName} 为空，自动扩容`);

          this._expandPool(poolName, 1);

          return instantiate(prefab);
        }
        /**
         * 将节点放回对象池
         * @param poolName 对象池名称
         * @param node 要回收的节点
         */


        putNode(poolName, node) {
          if (!isValid(node)) {
            return;
          }

          if (!this._poolDict.has(poolName)) {
            console.warn(`对象池 ${poolName} 不存在，直接销毁节点`);
            node.destroy();
            return;
          } // 确保节点从父节点中移除


          if (node.parent) {
            node.removeFromParent();
          } // 执行重置函数


          if (this._resetFuncDict.has(poolName)) {
            this._resetFuncDict.get(poolName)(node);
          } // 回收节点


          const pool = this._poolDict.get(poolName);

          pool && pool.put(node);
        }
        /**
         * 动态扩容对象池 (私有方法)
         */


        _expandPool(poolName, expandSize) {
          const pool = this._poolDict.get(poolName);

          const prefab = this._prefabDict.get(poolName);

          if (!pool || !prefab) return;

          for (let i = 0; i < expandSize; i++) {
            const newNode = instantiate(prefab);
            pool.put(newNode);
          }
        }
        /**
         * 获取对象池当前大小
         * @param poolName 对象池名称
         */


        getPoolSize(poolName) {
          var _this$_poolDict$get;

          return ((_this$_poolDict$get = this._poolDict.get(poolName)) == null ? void 0 : _this$_poolDict$get.size()) || 0;
        }
        /**
         * 清空指定对象池
         * @param poolName 对象池名称
         */


        clearPool(poolName) {
          if (!this._poolDict.has(poolName)) {
            return;
          }

          const pool = this._poolDict.get(poolName);

          pool == null || pool.clear();

          this._poolDict.delete(poolName);

          this._prefabDict.delete(poolName);

          this._resetFuncDict.delete(poolName);
        }
        /**
         * 清空所有对象池
         */


        clearAll() {
          this._poolDict.forEach((pool, name) => {
            pool.clear();
          });

          this._poolDict.clear();

          this._prefabDict.clear();

          this._resetFuncDict.clear();
        }
        /**
         * 打印所有对象池状态 (调试用)
         */


        printPoolsStatus() {
          console.log('===== 对象池状态 =====');

          this._poolDict.forEach((pool, name) => {
            const prefab = this._prefabDict.get(name);

            console.log(`[${name}]: 可用 ${pool.size()}个, Prefab: ${(prefab == null ? void 0 : prefab.name) || 'Unknown'}`);
          });

          console.log('=====================');
        }

      }); // 导出单例


      PoolManager._instance = null;

      _export("poolManager", poolManager = PoolManager.instance);

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=d4e4636019be0a431daf58bb163c885a24942663.js.map