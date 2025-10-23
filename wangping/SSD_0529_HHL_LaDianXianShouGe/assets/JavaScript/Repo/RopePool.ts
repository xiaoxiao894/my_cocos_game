import { instantiate , Node, NodePool } from "cc";

export default class RopePool {

    private _itemPool:NodePool; //缓存池
    private _node:Node;



    public constructor(node:Node,num:number=8) {
        this._itemPool=new NodePool();
        this._node=node;
        for(let i=0;i<num;i++){
            if(this._node){
                let itemNode = instantiate(this._node);
                itemNode.active = false;
                this._itemPool.put(itemNode);
            }
        }
    }


    public getItem():Node{
        if(!this._node){
            return null;
        }
        let node:Node = this._itemPool.get()||instantiate(this._node);
        node.active = true;
        return node;
    }

    public putItem(itemNode:Node){
        itemNode.active=false;
        this._itemPool.put(itemNode);
    }
}