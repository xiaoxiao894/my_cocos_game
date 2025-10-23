import { _decorator, Component, instantiate, Node, NodePool, Prefab } from 'cc';
import { EntityTypeEnum } from '../Enum/Index';
import { DataManager } from '../Global/DataManager';

export default class Pool {
    private _pool: NodePool;
    private _entityType: EntityTypeEnum;
    private _prefab: Prefab;

    public constructor(type: EntityTypeEnum, num: number = 8) {
        this._entityType = type;
        this._pool = new NodePool();
        this._prefab = DataManager.Instance.prefabMap.get(this._entityType);
        for (let i = 0; i < num; i++) {
            const prefab = DataManager.Instance.prefabMap.get(this._entityType)
            if (prefab) {
                let itemNode = instantiate(prefab);
                itemNode.active = false;
                this._pool.put(itemNode);
            }
        }
    }

    public getItem(): Node {
        if (!this._prefab) {
            return null;
        }

        let node: Node = instantiate(this._prefab);
        node.active = true;

        return node;
    }

    public putItem(itemNode: Node) {
        itemNode.active = false;
        itemNode.destroy();
    }
}


