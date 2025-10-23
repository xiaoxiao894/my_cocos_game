import { _decorator, Component,Node} from "cc";
import { EntityTypeEnum } from "../Common/Enum";
import { DataManager } from "../Global/DataManager";
import { NodePoolManager } from "../Common/NodePoolManager";
const { ccclass, property } = _decorator;

@ccclass("BackPack")
export default class BackPack extends Component {

    private _type:EntityTypeEnum = EntityTypeEnum.NONE;
    private _count:number = 0;

    public get Type():EntityTypeEnum {
        return this._type;
    }

    public set Type(value:EntityTypeEnum) {
        this._type = value;
    }

    public get Count():number {
        return this._count;
    }

    public getMaxY():number {
        let height = 0;
        switch(this._type){
            case EntityTypeEnum.Coin:
                height = DataManager.coinHeight;
                break;
            case EntityTypeEnum.Grass:
                height = DataManager.grassHeight;
                break;
            case EntityTypeEnum.Corn:
                height = DataManager.cornHeight;
                break;
        }
        return this.node.children.length * height;
    }

    public addItem(node:Node,type:EntityTypeEnum):boolean {
        if(this._type === EntityTypeEnum.NONE){
            this._type = type;
        }
        if(this._type === type){
            if(this._count >150 ){
                NodePoolManager.Instance.returnNode(node,type);
            }else{
                this.node.addChild(node);
            }
            
            this._count++;
            DataManager.Instance.uiManger.addItem(type);
            return true;
        }
        return false;
    }

    public returnOneItem():Node{
        if(this._count > 0){
            this._count--;
            DataManager.Instance.uiManger.subItem(this._type);
            if(this._count === 0){
                this._type = EntityTypeEnum.NONE;
            }
            if(this._count>this.node.children.length){
                const node = NodePoolManager.Instance.getNode(this._type);
                this.node.addChild(node);
                node.active = true;
                const lastNode:Node = this.node.children[this.node.children.length - 2];
                node.setPosition(lastNode.position.clone());
                node.setRotation(lastNode.rotation.clone());
                node.setScale(lastNode.scale.clone());
                return node;
            }
            return this.node.children[this.node.children.length - 1];
        }
        return null;
    }
}