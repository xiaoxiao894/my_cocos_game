import { _decorator, Component } from 'cc';
import { Turret } from './Turret';
const { ccclass, property } = _decorator;

@ccclass('TurretAniEvent')
export class TurretAniEvent extends Component {
    @property(Turret)
    target: Turret = null!;


    // 攻击事件
    private onAttack(){
        this.target.AttackAni();
    }

}


