import { _decorator,  ITriggerEvent, Label, } from 'cc';
import { ColorArea } from './ColorArea';
import { EventManager } from '../Global/EventManager';
import { EventName } from '../Common/Enum';
import { DataManager } from '../Global/DataManager';
const { ccclass, property } = _decorator;

@ccclass('UnlockLawnMowerArea')
export class UnlockLawnMowerArea extends ColorArea {

    @property(Label)
    honorLabel:Label = null;

    protected start(): void {
        this.honorLabel.string = String(DataManager.Instance.unlockLawnMowerCost);
    }

    public deliverCoin():void{
        DataManager.Instance.unlockLawnMowerCost--;
        this.honorLabel.string = String(Math.max(0,DataManager.Instance.unlockLawnMowerCost));
        if(DataManager.Instance.unlockLawnMowerCost <= 0){
            this.node.active = false;
            EventManager.inst.emit(EventName.UnlockLawnMower);
        }
    }

    protected onEnable(): void {
        super.onEnable();
        EventManager.inst.on(EventName.DeliverCoinUnlockLawnMower,this.deliverCoin,this);
    }

    protected onDisable(): void {
        super.onDisable();
        EventManager.inst.off(EventName.DeliverCoinUnlockLawnMower,this.deliverCoin,this);
    }

    protected onColliderEnter(event: ITriggerEvent):void{
        super.onColliderEnter(event);
        
    }

    protected onColliderExit(event: ITriggerEvent):void{
        super.onColliderExit(event);
    }
}


