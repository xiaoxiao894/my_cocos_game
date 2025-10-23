import { _decorator, Node, Prefab, NodePool, director, instantiate, isValid, Director } from 'cc';
const { ccclass, property } = _decorator;

/**
 * Cocos Creator 3.8.0 专用节点池管理器
 * 功能：
 * 1. 多对象池管理
 * 2. 自动扩容机制
 * 3. 内存安全检测
 * 4. 节点回收重置
 */
export class PoolManager {
    private static _instance: PoolManager | null = null;
    private _poolDict: Map<string, NodePool> = new Map();
    private _prefabDict: Map<string, Prefab> = new Map();
    private _resetFuncDict: Map<string, (node: Node) => void> = new Map();

    public static get instance(): PoolManager {
        if (!this._instance) {
            this._instance = new PoolManager();
            // 使用新的 game 事件系统
                director.on(Director.EVENT_BEFORE_SCENE_LOADING, () => {
                this._instance?.clearAll();
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
    public initPool(poolName: string, prefab: Prefab, initSize: number, resetFunc?: (node: Node) => void): void {
        if (this._poolDict.has(poolName)) {
            console.warn(`对象池 ${poolName} 已存在!`);
            return;
        }

        // 创建新对象池（3.8.0 不需要传递组件类型）
        const pool = new NodePool();
        this._poolDict.set(poolName, pool);
        this._prefabDict.set(poolName, prefab);

        // 保存重置函数
        if (resetFunc) {
            this._resetFuncDict.set(poolName, resetFunc);
        }

        // 预生成节点
        this._expandPool(poolName, initSize);
    }

    /**
     * 从对象池获取节点
     * @param poolName 对象池名称
     * @returns 节点或null(如果对象池未初始化)
     */
    public getNode(poolName: string): Node | null {
        if (!this._poolDict.has(poolName)) {
            console.error(`对象池 ${poolName} 未初始化!`);
            return null;
        }

        const pool = this._poolDict.get(poolName);
        const prefab = this._prefabDict.get(poolName);

        // 对象池中有可用节点
        if (pool && pool.size() > 0) {
            return pool.get()!;
        }

        // 对象池为空，动态扩容
        console.log(`对象池 ${poolName} 为空，自动扩容`);
        this._expandPool(poolName, 1);
        return instantiate(prefab);
    }

    /**
     * 将节点放回对象池
     * @param poolName 对象池名称
     * @param node 要回收的节点
     */
    public putNode(poolName: string, node: Node): void {
        if (!isValid(node)) {
            return;
        }

        if (!this._poolDict.has(poolName)) {
            console.warn(`对象池 ${poolName} 不存在，直接销毁节点`);
            node.destroy();
            return;
        }

        // 确保节点从父节点中移除
        if (node.parent) {
            node.removeFromParent();
        }

        // 执行重置函数
        if (this._resetFuncDict.has(poolName)) {
            this._resetFuncDict.get(poolName)!(node);
        }

        // 回收节点
        const pool = this._poolDict.get(poolName);
        pool && pool.put(node);
    }

    /**
     * 动态扩容对象池 (私有方法)
     */
    private _expandPool(poolName: string, expandSize: number): void {
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
    public getPoolSize(poolName: string): number {
        return this._poolDict.get(poolName)?.size() || 0;
    }

    /**
     * 清空指定对象池
     * @param poolName 对象池名称
     */
    public clearPool(poolName: string): void {
        if (!this._poolDict.has(poolName)) {
            return;
        }

        const pool = this._poolDict.get(poolName);
        pool?.clear();
        this._poolDict.delete(poolName);
        this._prefabDict.delete(poolName);
        this._resetFuncDict.delete(poolName);
    }

    /**
     * 清空所有对象池
     */
    public clearAll(): void {
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
    public printPoolsStatus(): void {
        console.log('===== 对象池状态 =====');
        this._poolDict.forEach((pool, name) => {
            const prefab = this._prefabDict.get(name);
            console.log(`[${name}]: 可用 ${pool.size()}个, Prefab: ${prefab?.name || 'Unknown'}`);
        });
        console.log('=====================');
    }
}

// 导出单例
export const poolManager = PoolManager.instance;
