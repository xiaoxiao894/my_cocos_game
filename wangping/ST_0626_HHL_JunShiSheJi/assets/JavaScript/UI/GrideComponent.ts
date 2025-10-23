import {  _decorator, CCString, Component, Label,Node, tween, Tween, Vec3 } from "cc";
import { EventManager } from "../Globel/EventManager";
import { EventName } from "../Enum/Enum";
const { ccclass, property } = _decorator;

@ccclass("GrideComponent")
export default class GrideComponent extends Component {
    @property(Node)
    grideNode:Node = null;

    @property(Label)
    grideLabel:Label = null;

    @property(CCString)
    grideText:string[] = [];

    @property(Node)
    handNode:Node = null;

    @property(Node)
    btnNode:Node = null;

    @property(Node)
    firstSlideNode:Node = null;

    private _handTween:Tween<Node> = null;
    private _labelTween:Tween<Node> = null;

    private _index:number = -1;
    private _handStartScale:Vec3 = null;
    private _labelStartScale:Vec3 = null;

    protected start(): void {
        this.grideNode.active = false;
        let pos:Vec3 = this.btnNode.worldPosition.clone();
        Vec3.add(pos, pos, new Vec3(50, -50, 0));
        this.handNode.setWorldPosition(pos);
        let labelPos:Vec3 = this.handNode.position.clone();
        labelPos.x = 0;
        this._handStartScale = this.handNode.scale.clone();
        this._labelStartScale = this.grideLabel.node.scale.clone();
    }

    protected onEnable(): void {
        EventManager.inst.on(EventName.ShowGuide, this.showGride, this);
        EventManager.inst.on(EventName.HideGuide, this.hideGride, this);

        EventManager.inst.on(EventName.TouchStart, this.onTouchStart, this);
    }

    protected onDisable(): void {
        EventManager.inst.off(EventName.ShowGuide, this.showGride, this);
        EventManager.inst.off(EventName.HideGuide, this.hideGride, this);

        EventManager.inst.on(EventName.TouchStart, this.onTouchStart, this);
    }

    private showGride(index:number):void{
        this._index = index;
        this.firstSlideNode.active = index ===0;
        this.grideNode.active = true;
        this.grideLabel.string = this.grideText[1];
        
        this.grideLabel.node.setScale(0,0);

        this.handNode.active = false;
        if(index!==0){
            this.showHand();
        }
        
        this._labelTween = tween(this.grideLabel.node)
        .to(0.3,{scale:new Vec3(1,1,1)})
        .call(()=>{
            this._labelTween = tween(this.grideLabel.node)
            .repeatForever(
                tween()
                    .to(0.3, { scale: new Vec3(this._labelStartScale.x*0.9, this._labelStartScale.y*0.9,1) })
                    .to(0.3, { scale: new Vec3(this._labelStartScale.x, this._labelStartScale.y, 1) })
            )
            .start();
        }).start();
    }

    private showHand():void{
        this.handNode.active = true;
        this.handNode.setScale(0,0,0);
        this._handTween = tween(this.handNode)
        .to(0.3,{scale:new Vec3(1,1,1)})
        .call(()=>{
            this._handTween = tween(this.handNode)
            .repeatForever(
                tween()
                    .to(0.3, { scale: new Vec3(0.9*this._handStartScale.x, 0.9*this._handStartScale.y,1) })
                    .to(0.3, { scale: new Vec3(1*this._handStartScale.x, 1*this._handStartScale.y, 1) })
            )
            .start();
        }).start();
    }

    private hideGride():void{
        this._handTween.stop();
        this._labelTween.stop();
        this.grideNode.active = false;
        this._index = -1;
    }

    private onTouchStart():void{
        if(this._index ===0&&!this.handNode.active){
            this.firstSlideNode.active = false;
            this.grideLabel.string = this.grideText[this._index];
            this.showHand();
        }
    }


}