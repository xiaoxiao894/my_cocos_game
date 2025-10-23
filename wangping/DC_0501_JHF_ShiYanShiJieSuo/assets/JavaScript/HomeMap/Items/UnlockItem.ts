import { _decorator, Animation, Collider, Component, ITriggerEvent, Label, Node, Sprite, tween, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('UnlockItem')
export class UnlockItem extends Component {

    @property(Label)
    honorLabel:Label = null;

    @property(Sprite)
    green:Sprite = null;

    @property(Node)
    horn:Node = null;

    

    private _num:number = 0;
    private _type:number = 0;
    private _needNum:number = 0;

    
    public init(type:number,needNum:number){
        this._type = type;
        this._num = needNum;
        this._needNum=needNum;
        this.honorLabel.string = String(this._num*10);
        this.green.fillRange=0;
    }

    public subNum():void{
        this._num--;
        this.honorLabel.string = String(this._num*10);
        this.green.fillRange=(this._needNum-this._num)/this._needNum;
    }

    update(deltaTime: number) {
        
    }

    protected onEnable(): void {
        this.node.getComponent(Collider).on('onTriggerEnter',this.onColliderEnter,this);
        this.node.getComponent(Collider).on('onTriggerExit',this.onColliderExit,this);
    }

    protected onDisable(): void {
        this.node.getComponent(Collider).off('onTriggerEnter',this.onColliderEnter,this);
        this.node.getComponent(Collider).off('onTriggerExit',this.onColliderExit,this);
    }

    private onColliderEnter(event: ITriggerEvent):void{
        tween(this.horn).to(0.1,{scale:new Vec3(0.1,0.1,1)}).start();
    }

    private onColliderExit(event: ITriggerEvent):void{
        tween(this.horn).to(0.1,{scale:new Vec3(0.09,0.09,1)}).start();
    }
}


