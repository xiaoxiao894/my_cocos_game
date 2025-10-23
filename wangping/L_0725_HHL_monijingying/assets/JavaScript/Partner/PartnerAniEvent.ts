import { _decorator, Component, Node } from 'cc';
import { PartnerTrigger } from './PartnerTrigger';
import { Partner } from './Partner';
const { ccclass, property } = _decorator;

@ccclass('PartnerAniEvent')
export class PartnerAniEvent extends Component {

    @property(PartnerTrigger)
    entityTrigger: PartnerTrigger = null!;

    @property(Partner)
    partner: Partner = null!;

    // 攻击事件
    private onAttack(){
        this.entityTrigger.onAttackCorn();
        this.partner.realAttackMonster();
    }

    /** 攻击结束 */
    private onAttackEnd(){
        this.partner.playIdle();
    }

}


