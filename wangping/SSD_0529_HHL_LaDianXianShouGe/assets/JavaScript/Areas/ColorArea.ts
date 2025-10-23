import { _decorator, Animation, Collider, Color, Component, ITriggerEvent, Label, Node, Sprite, tween, Vec3 } from 'cc';
import { DataManager } from '../Global/DataManager';
import { EventManager } from '../Global/EventManager';
import { EntityTypeEnum, EventName } from '../Common/Enum';
const { ccclass, property } = _decorator;

@ccclass('ColorArea')
export class ColorArea extends Component {

    @property(Sprite)
    kuangInside:Sprite = null;

    
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
        if(event.otherCollider&&event.otherCollider.node&&event.otherCollider.node.name==EntityTypeEnum.Player){
            this.kuangInside.color = new Color().fromHEX("#00FC1E");
        }
    }

    private onColliderExit(event: ITriggerEvent):void{
        if(event.otherCollider&&event.otherCollider.node&&event.otherCollider.node.name==EntityTypeEnum.Player){
            this.kuangInside.color = new Color().fromHEX("#FFFFFF");
        }
    }
}



