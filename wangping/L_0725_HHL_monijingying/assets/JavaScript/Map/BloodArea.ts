import { _decorator, Collider,Component, ITriggerEvent, tween, UIOpacity } from 'cc';
import { EntityTypeEnum} from '../Common/Enum';
import { Partner } from '../Partner/Partner';
const { ccclass, property } = _decorator;

@ccclass('BloodArea')
export class BloodArea extends Component {

    @property(UIOpacity)
    kuangInside:UIOpacity = null;

    private _indexList:number[] = [];

    
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
        if(event.otherCollider&&event.otherCollider.node&&event.otherCollider.node.name==EntityTypeEnum.Partner){
            const partner:Partner = event.otherCollider.node.getComponent(Partner);
            if(partner&&partner.gotoBlooding()){
                if(this._indexList.length === 0){
                    this.showArea();
                }
                this._indexList.push(partner.index);

            }
        }
    }

    protected onColliderExit(event: ITriggerEvent):void{
        if(event.otherCollider&&event.otherCollider.node&&event.otherCollider.node.name==EntityTypeEnum.Partner){
            const partner:Partner = event.otherCollider.node.getComponent(Partner);
            const index = this._indexList.indexOf(partner.index);
            if(index>=0){
                this._indexList.splice(index,1);
                if(this._indexList.length === 0){
                    this.hideArea();
                }
            }
        }
    }

    private showArea():void{
        tween(this.kuangInside).to(0.3, {opacity:255}).start();
    }

    private hideArea():void{
        tween(this.kuangInside).to(0.3, {opacity:0}).start();
    }
}



