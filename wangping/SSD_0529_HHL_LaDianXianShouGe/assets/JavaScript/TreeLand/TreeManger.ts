import {  _decorator, CCClass, Component, instantiate ,Node, Vec3} from "cc";
import { DataManager } from "../Global/DataManager";
import { Tree } from "./Tree";
import { EventManager } from "../Global/EventManager";
import { EntityTypeEnum, EventName } from "../Common/Enum";
import GridPathController from "../Player/GridPathController";
import { TreeAniData } from "../Common/Type";
import ItemPool from "../Common/ItemPool";
import { SoundManager } from "../Common/SoundManager";

const { ccclass, property } = _decorator;

@ccclass('TreeManager')
export class TreeManager extends Component{
    @property(Node)
    treeNode:Node = null;

    @property(Node)
    treeParent:Node = null;

    @property(Node)
    woodRootParent:Node = null;

    @property(Node)
    bigTreeNode:Node = null;

    @property(Node)
    woodParent:Node = null;

    private _trapTreeList:number[][] = [];
    private _bigTreeToWood:boolean = false;
    private _woodPool:ItemPool;

    protected onLoad(): void {
        DataManager.Instance.treeManger = this;
        DataManager.Instance.firstTreePos = this.treeParent.getWorldPosition().clone();
        DataManager.Instance.bigTreePos = this.bigTreeNode.getWorldPosition().clone();
        DataManager.Instance.bigTreeAlive = true;
    }

    protected start(): void {
        this.initTrees();
        this.scheduleOnce(()=>{
            this._woodPool = new ItemPool(EntityTypeEnum.Wood, 100);
        },2);
    }

    protected onEnable(): void {
        EventManager.inst.on(EventName.PlugInOver, this.onTreeToWood, this);
        EventManager.inst.on(EventName.TreeFallAniPlay, this.playAni, this);
        EventManager.inst.on(EventName.PlugPowerOver, this.treeToWoodAniStart, this);
    }

    protected onDisable(): void {
        EventManager.inst.off(EventName.PlugInOver, this.onTreeToWood, this);
        EventManager.inst.off(EventName.TreeFallAniPlay, this.playAni, this);
        EventManager.inst.off(EventName.PlugPowerOver, this.treeToWoodAniStart, this);
    }

    public initTrees(){
        let row:number = DataManager.Instance.treeRow;
        let col:number = DataManager.Instance.treeCol;
        let space:number = DataManager.Instance.treeSpace;

        for(let i = 0; i < row; i++){
            for(let j = 0; j < col; j++){
                if(DataManager.Instance.bigTreeIndexList.indexOf(i*col+j)>=0){
                    continue;
                }
                let newTree:Node = instantiate(this.treeNode);
                newTree.name = `Tree_${i*col+j}`;
                newTree.active = true;
                newTree.setParent(this.treeParent);
                newTree.setPosition(new Vec3(i*space,0,j*space));
                newTree.getComponent(Tree)?.init(i*col+j);
            }
        }
    }

    /** 树变成木头 */
    private onTreeToWood(){
        let list:number[] = GridPathController.instance.getPointsInsideTrees();
        console.log("tree to wood",list);
        let treeIndexList:number[][] = new Array(DataManager.Instance.treeRow);
        let col:number = DataManager.Instance.treeCol;
        for(let i = 0; i < list.length; i++){
            let row:number = Math.floor(list[i]/col);
            if(!treeIndexList[row]){
                treeIndexList[row] = [];
            }
            treeIndexList[row].push(list[i]);
        }
        for(let j=treeIndexList.length-1;j>=0;j--){
            if(!treeIndexList[j]){
                treeIndexList.splice(j,1);
            }
        }
       
        this._trapTreeList = treeIndexList;
        if(list[0]===-1){
            this._bigTreeToWood = true;
        }

        EventManager.inst.emit(EventName.TreeToWoodInited);
    }

     //一行一行树变成木头
    private treeToWoodAniStart(){
        this.schedule(this.oneRowTreeToWood, 0.2);
        GridPathController.instance.cleanPath();
        //判断是否有大树
        if(DataManager.Instance.bigTreeAlive&&this._bigTreeToWood){
            DataManager.Instance.bigTreeAlive = false;
            if(this.bigTreeNode){
                this.bigTreeNode.getComponent(Tree).treeToWood(this.woodParent);
                let worldPos:Vec3 = this.bigTreeNode.getWorldPosition().clone()
                this.bigTreeNode.parent = this.woodRootParent;
                this.bigTreeNode.setWorldPosition(worldPos);
                this.bigTreeNode = null;
            }
        }
        this.scheduleOnce(this.checkWoodOutBound,3);
    }

    /** 一行树变成木头 */
    private oneRowTreeToWood(){
        if(this._trapTreeList.length>0){
            let treeIndexList:number[] = this._trapTreeList.shift();
            for(let i = 0; i < treeIndexList.length; i++){
                let tree:Node = this.treeParent.getChildByPath(`Tree_${treeIndexList[i]}`);
                if(tree){
                    let treeComp:Tree = tree.getComponent(Tree);
                    if(treeComp){
                        treeComp.treeToWood(this.woodParent);
                        tree.parent = this.woodRootParent;
                    }
                }
            }
            SoundManager.inst.playAudio("mutouposui");
        }else{
            this.unschedule(this.oneRowTreeToWood);
            DataManager.Instance.mainCamera.treeLookBack();
        }
    }

    /** 播动画 */
    private playAni(aniData:TreeAniData[]){
         let col:number = DataManager.Instance.treeCol;
        for(let i = 0; i < aniData.length; i++){
            let index:number = aniData[i].tree.x*col + aniData[i].tree.y;
            let tree:Node = this.treeParent.getChildByName(`Tree_${index}`);
            if(tree&&tree.getComponent(Tree)){
                tree.getComponent(Tree).playAni(aniData[i].dir);
            }
        }
    }

    public getWood():Node{
        return this._woodPool.getItem();
    }

    public putWood(node:Node){
        this._woodPool.putItem(node);
    }

    //检查木头落在外边的销毁
    private checkWoodOutBound(){
        let woodList:Node[] = this.woodParent.children;
        for(let i = woodList.length-1; i >=0; i--){
            let pos:Vec3 = woodList[i].getPosition();
            if(pos.x<-12.5||pos.x>30||pos.z<-12.5||pos.z>12.5){
                let node:Node = woodList[i];
                this.woodParent.removeChild(node);
                this.putWood(node);
            }
        }
    }

    public getWoodNum():number{
        return this.woodParent.children.length;
    }

}