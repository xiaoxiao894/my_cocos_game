import { _decorator, ITriggerEvent} from 'cc';
import { EntityTypeEnum } from '../Common/Enum';
import { DataManager } from '../Global/DataManager';
import { Partner } from './Partner';
import { EntityTrigger } from '../Common/EntityTrigger';
const { ccclass, property } = _decorator;

@ccclass('PartnerTrigger')
export class PartnerTrigger extends EntityTrigger {

    @property({type:Partner,override:true})
    entity: Partner|null = null;

    /** 攻击大玉米 */
    public onAttackCorn(){
        if(this._inTrigger === EntityTypeEnum.BigCorn){
            DataManager.Instance.cornController.attackCorn(this.entity.attackNode.worldPosition);
        }
    }
}


