import {  _decorator, CCClass, CCFloat, CCInteger, Component,instantiate,Label,Node, Prefab, Quat, RigidBody, tween, UIOpacity, Vec3 } from "cc";
import { DataManager } from "../Global/DataManager";
import { EventManager } from "../Global/EventManager";
import { EventName } from "../Common/Enum";


const { ccclass, property } = _decorator;

@ccclass('TelegraphPole')
export class TelegraphPole extends Component{

    @property(Node)
    ropeNode:Node = null;

    @property(Node)
    ropeParent:Node = null;

    @property(CCFloat)
    ropeHeight:number = 0.6;

    @property(Node)
    electricity:Node = null;

    @property(Node)
    tipNode:Node = null;

    @property(Label)
    tipLabel:Label = null;

    private _ropeNum:number = 2;
    private _startPos:Vec3;
    private _countStart:boolean = false;

    protected start(): void {
        this.tipLabel.string = DataManager.Instance.wireLen.toString();
        this.tipNode.active = false;
        this.init();
    }

    protected onEnable(): void {
        EventManager.inst.on(EventName.PlugInOver,this.showElectricity,this);
        EventManager.inst.on(EventName.ElectricityHide,this.hideElectricity,this);
        EventManager.inst.on(EventName.RopeTotalLenChange,this.ropeTotleLenChange,this);
        EventManager.inst.on(EventName.HideRopeLenChangeTip,this.hideTip,this);
    }

    protected onDisable(): void {
        EventManager.inst.off(EventName.PlugInOver,this.showElectricity,this);
        EventManager.inst.off(EventName.ElectricityHide,this.hideElectricity,this);
        EventManager.inst.off(EventName.RopeTotalLenChange,this.ropeTotleLenChange,this);
        EventManager.inst.off(EventName.HideRopeLenChangeTip,this.hideTip,this);
    }

    private init(){
        this.electricity.active = false;
        this._ropeNum = 2;
        if(DataManager.Instance.wireLen >50){
            this._ropeNum = 4;
        }
        this.ropeParent.removeAllChildren();
        for(let i = 0;i<this._ropeNum;i++){
            let rope = instantiate(this.ropeNode);
            rope.parent = this.ropeParent;
            rope.setPosition(new Vec3(0,i*this.ropeHeight,0));
        }
        this._startPos = new Vec3(0,0,0);
        this.ropeParent.setPosition(this._startPos);
        this.ropeParent.setWorldRotation(new Quat());
    }

    protected update(dt: number): void {
        let total:number = DataManager.Instance.wireLen;
        let usedLen:number = DataManager.Instance.usedLen;
        if(usedLen<5){
            usedLen = 0;
        }
        let newPos:Vec3 = new Vec3(0,0,0);
        let moveY:number = usedLen/total*this.ropeHeight*this._ropeNum;
        newPos.y = -moveY;
        this.ropeParent.setPosition(newPos);
        let angleY:number = -this._ropeNum*360*usedLen/total;
        this.ropeParent.eulerAngles = new Vec3(0,angleY,0);
        for(let i = 0;i<this.ropeParent.children.length;i++){
            let rope:Node = this.ropeParent.children[i];
            if(rope){
                rope.active = rope.position.y>(moveY-this.ropeHeight/2);
            }
        }

        //数字蹦
        if(this._countStart){
            let nowNum:number = Number(this.tipLabel.string);
            if(nowNum<DataManager.Instance.wireSecendLen){
                nowNum++;
                this.tipLabel.string = nowNum.toString();
            }
        }
    }

    private showElectricity(){
        this.electricity.active = true;
    }

    private hideElectricity(){
        this.electricity.active = false;
    }

    private ropeTotleLenChange(){
        this.init();
        this.scheduleOnce(this.showTip,0.7);
    }

    private showTip(){
        this.tipNode.active = true;
        this.tipNode.setScale( new Vec3(0,0,0));
        tween(this.tipNode)
        .to(0.25, { scale:new Vec3(1.1, 1.1, 1.1) }, { easing: 'quadOut' })
        .to(0.15, { scale: new Vec3(1, 1, 1) }, { easing: 'quadIn' })
        .call(()=>{
            this._countStart = true;
        })
        .start();
    }

    private hideTip(){
        if(this.tipNode.active){
            tween(this.tipNode.getComponent(UIOpacity)).to(0.5,{opacity:0}).call(()=>{
                this.tipNode.active = false;
            }).start();
        }
    }
}
