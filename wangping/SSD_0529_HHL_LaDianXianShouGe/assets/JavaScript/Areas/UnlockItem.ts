import { _decorator, Animation, Collider, Color, Component, ITriggerEvent, Label, Node, Sprite, tween, Vec3 } from 'cc';
import { DataManager } from '../Global/DataManager';
import { EventManager } from '../Global/EventManager';
import { EntityTypeEnum, EventName } from '../Common/Enum';
const { ccclass, property } = _decorator;

@ccclass('UnlockItem')
export class UnlockItem extends Component {

    @property(Label)
    honorLabel:Label = null;

    @property(Sprite)
    kuangInside:Sprite = null;

    // @property(Node)
    // horn:Node = null;

    

    private _num:number = 0;
    private _type:number = 0;
    private _needNum:number = 0;

    
    public init(type:number,needNum:number){
        this._type = type;
        this._num = needNum;
        this._needNum=needNum;
        this.honorLabel.string = String(this._num);
    }

    public updateNum():void{
        this._num = DataManager.Instance.upgradeThirdWoodNum-DataManager.Instance.towerWoodNum;
        this.honorLabel.string = String(Math.max(0,this._num));
    }

    update(deltaTime: number) {
        
    }

    protected onEnable(): void {
        this.node.getComponent(Collider).on('onTriggerEnter',this.onColliderEnter,this);
        this.node.getComponent(Collider).on('onTriggerExit',this.onColliderExit,this);
        EventManager.inst.on(EventName.GiveTowerWood,this.updateNum,this);
    }

    protected onDisable(): void {
        this.node.getComponent(Collider).off('onTriggerEnter',this.onColliderEnter,this);
        this.node.getComponent(Collider).off('onTriggerExit',this.onColliderExit,this);
        EventManager.inst.off(EventName.GiveTowerWood,this.updateNum,this);
    }

    private onColliderEnter(event: ITriggerEvent):void{
        if(event.otherCollider&&event.otherCollider.node&&event.otherCollider.node.name==EntityTypeEnum.Player){
            //tween(this.horn).to(0.1,{scale:new Vec3(0.1,0.1,1)}).start();
            this.kuangInside.color = new Color().fromHEX("#00FC1E");
            DataManager.Instance.inDeliverArea = true;
        }
    }

    private onColliderExit(event: ITriggerEvent):void{
        if(event.otherCollider&&event.otherCollider.node&&event.otherCollider.node.name==EntityTypeEnum.Player){
            //tween(this.horn).to(0.1,{scale:new Vec3(0.09,0.09,1)}).start();
            this.kuangInside.color = new Color().fromHEX("#FFFFFF");
        }
        DataManager.Instance.inDeliverArea = false;
        DataManager.Instance.mainCamera.towerLookBack();
    }
}


