// SimplePoolManager.ts
import { Pool, Node, instantiate, Prefab, Tween } from 'cc';

export interface PoolConfig {
    key: string;          // 池的名字
    prefab: Prefab;       // 对应的预制体
    count?: number;       // 预热数量（默认 50）
}

export class SimplePoolManager {
    private static _inst: SimplePoolManager;
    static get Instance() {
        if (!this._inst) this._inst = new SimplePoolManager();
        return this._inst;
    }

    private _pools = new Map<string, Pool<any>>();

    //   批量注册多个池 
    registerNodePools(configs: PoolConfig[]) {
        for (const cfg of configs) {
            this.create<Node>(
                cfg.key,
                () => {
                    const node = instantiate(cfg.prefab);
                    node.active = false;
                    return node;
                },
                cfg.count ?? 50,
                (node) => node.destroy()
            );
        }
    }

    // 创建一个池 
    create<T>(key: string, createFunc: () => T, count: number, destroyFunc?: (obj: T) => void) {
        if (this._pools.has(key)) return;
        const pool = new Pool<T>(createFunc, count, destroyFunc);
        this._pools.set(key, pool);
    }



    // 从池里取对象
    alloc<T>(key: string): T | null {
        return this._pools.get(key)?.alloc() ?? null;
    }

    free(key: string, obj) {
        obj.removeFromParent();
        obj.active = false;



        this._pools.get(key)?.free(obj);
    }

    // 回收对象
    // free<T>(key: string, obj: T) {
    //     this._pools.get(key)?.free(obj);
    // }

    //销毁指定池
    destroy(key: string) {
        this._pools.get(key)?.destroy();
        this._pools.delete(key);
    }

    //   销毁所有池 
    destroyAll() {
        for (let pool of this._pools.values()) pool.destroy();
        this._pools.clear();
    }
}
