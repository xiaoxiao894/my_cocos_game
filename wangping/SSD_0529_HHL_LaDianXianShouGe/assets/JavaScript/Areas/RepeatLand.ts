import {  _decorator, Animation, CCClass, CCFloat, CCInteger, Component,instantiate,MeshRenderer,Node, Prefab, Quat, RigidBody, tween, Vec3 } from "cc";
import { CloudParticleEffect } from "./CloudParticleEffect";


const { ccclass, property } = _decorator;

@ccclass('RepeatLand')
export class RepeatLand extends Component{

    @property(Node)
    itemNode:Node = null;

    @property(Node)
    itemParent:Node = null;

    @property(CCFloat)
    itemDisX:number = 0.6;

    @property(CCFloat)
    itemDisY:number = 0.6;

    @property(CCInteger)
    itemNumX:number = 10;

    @property(CCInteger)
    itemNumZ:number = 10;

    @property(CloudParticleEffect)
    cloudList:CloudParticleEffect[] = [];

    @property(CCFloat)
    creatSpeed:number = 0.2;


    private _inited:boolean = false;
    private _batch:boolean = false;

    private _i:number = 0;
    private _j:number = 0;



    protected start(): void {
    }

    public init(){
        if(this._inited){
            return;
        }

        this._inited = true;
        this.schedule(this.initOne,this.creatSpeed);
    }

    private initOne(){
        if(this._i<this.itemNumX && this._j<this.itemNumZ){
            let newItem:Node = instantiate(this.itemNode);
            newItem.name = `Item_${this._i*this.itemNumZ+this._j}`;
            newItem.active = true;
            newItem.setParent(this.itemParent);
            newItem.setPosition(new Vec3(this._i*this.itemDisX,0,this._j*this.itemDisY));
            this._j++;
            if(this._j>=this.itemNumZ){
                this._i++;
                this._j = 0;
            }
        }else if(!this._batch){
            this._batch = true;
            //合批
            //this.getComponent(RopeBatch).batchStaticModel();
            this.unschedule(this.initOne);
        }
    }

    protected update(dt: number): void {
        if(!this._inited){
            return;
        }
        
    }


    public cloudAni(){
        //云消散
        if(this.cloudList.length>0){
            this.cloudList.forEach((item,index)=>{
                item.cloudFadeEffct(false);
            });
        }
    }

    //展示阴影
    public showShadows(){
        let items = this.itemParent.children;
        for(let i=0;i<items.length;i++){
            let item = items[i];
            item.children.forEach((node)=>{
                let mesh:MeshRenderer = node.getComponent(MeshRenderer);
                if(mesh){
                    mesh.shadowCastingMode = 1;
                }
            })
        }
    }

}
