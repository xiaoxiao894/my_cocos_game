import { _decorator, Collider, Color, Component, ITriggerEvent, Sprite } from 'cc';
import { EntityTypeEnum} from '../Common/Enum';
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

    protected onColliderEnter(event: ITriggerEvent):void{
        if(event.otherCollider&&event.otherCollider.node&&event.otherCollider.node.name==EntityTypeEnum.Player){
            this.kuangInside.color = new Color().fromHEX("#00FC1E");
        }
    }

    protected onColliderExit(event: ITriggerEvent):void{
        if(event.otherCollider&&event.otherCollider.node&&event.otherCollider.node.name==EntityTypeEnum.Player){
            this.kuangInside.color = new Color().fromHEX("#FFFFFF");
        }
    }
}



