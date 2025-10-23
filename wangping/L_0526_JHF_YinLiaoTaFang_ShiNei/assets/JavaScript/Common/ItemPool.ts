import { instantiate, Node, NodePool, Prefab } from "cc";
import { DataManager } from "../Global/DataManager";
import { EntityTypeEnum } from "../Enum/Index";

export default class ItemPool {

    private _itemPool: NodePool; //缓存池

    private _type: EntityTypeEnum; //类型
    private _prefab: Prefab;

    public constructor(type: EntityTypeEnum, num: number = 8) {
        this._type = type;
        this._itemPool = new NodePool();
        this._prefab = DataManager.Instance.prefabMap.get(this._type);
        for (let i = 0; i < num; i++) {
            const prefab = DataManager.Instance.prefabMap.get(this._type)
            if (prefab) {
                let itemNode = instantiate(prefab);
                itemNode.active = false;
                this._itemPool.put(itemNode);
            }
        }
    }


    public getItem(): Node {
        if (!this._prefab) {
            return null;
        }
        let node: Node = this._itemPool.get();
        if(!node){
            node = instantiate(this._prefab);
        }
        node.active = true;
        return node;
    }

    public putItem(itemNode: Node) {
        itemNode.removeFromParent();
        itemNode.active = false;
        this._itemPool.put(itemNode);
    }
}