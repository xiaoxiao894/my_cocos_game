import {  _decorator, CCClass, CCInteger, Component,CylinderCollider,instantiate,Node, Prefab, RigidBody, tween, Vec3 } from "cc";
import { DataManager } from "../Global/DataManager";

const { ccclass, property } = _decorator;

@ccclass('Tree')
export class Tree extends Component{

    @property(Node)
    leafNode:Node = null;

    /** 0 小树 1 大树 */
    @property(CCInteger)
    public type :number = 0;

    @property(CCInteger)
    public woodNum:number = 5;
    
    private _index:number = -1;

    private _leftWoodNum:number = 0;
    private _woodParent:Node = null;

    public init(index:number){
        this._index = index;
    }

    //监听玩家位置变化，播动画
    protected onEnable(): void {
        
    }

    protected onDisable(): void {
        
    }

    public playAni(angle:Vec3):void{
        tween(this.node).to(0.2,{eulerAngles:angle}).to(0.2,{eulerAngles:new Vec3(0,0,0)}).start();
    }

    /** 变成木头 */
    public treeToWood(parent:Node):void{
        this._woodParent = parent;
        this._leftWoodNum = this.woodNum;
        this.leafNode.active = false;
        if(this.type ===0){
            this.update(0);
        }
    }

    protected update(dt: number): void {
        if(this._leftWoodNum>0){
            let addNum:number = Math.min(this._leftWoodNum,6);
            this._leftWoodNum -= addNum;
            for(let i=0;i<addNum;i++){
                let wood:Node = DataManager.Instance.treeManger.getWood();
                wood.parent = this._woodParent;
                let pos:Vec3 = this.node.getWorldPosition().clone();
                //随机位置
                if(this.type ==1){
                    pos.y = 2 + Math.random()*4;
                    pos.x += Math.random()*2-1;
                    pos.z += Math.random()*2-1;
                }else{
                    pos.y = 1 + Math.random();
                    pos.x += Math.random()*2-1;
                    pos.z += Math.random()*2-1;
                }
                //随机角度
                const randomRotationX = Math.random() * 360;
                const randomRotationY = Math.random() * 360;
                const randomRotationZ = Math.random() * 360;
                wood.eulerAngles = new Vec3(randomRotationX,randomRotationY,randomRotationZ);
                
                wood.setWorldPosition(pos);
                const woodRigidbody = wood.getComponent(RigidBody);
                const woodCollider = wood.getComponent(CylinderCollider);
                woodCollider.enabled = true;
                woodRigidbody.enabled = true;
                const randomX:number = Math.random()-0.5;
                let randomY:number = Math.random()*4;
                if(this.type ==1){
                    randomY= Math.random()*8;
                }
                const randomZ:number = Math.random()-0.5;
                woodRigidbody.setAngularVelocity(new Vec3(randomX*10,randomY*10,randomZ*10));
                woodRigidbody.setLinearVelocity(new Vec3(randomX,randomY,randomZ));
            }
        }
    }



}