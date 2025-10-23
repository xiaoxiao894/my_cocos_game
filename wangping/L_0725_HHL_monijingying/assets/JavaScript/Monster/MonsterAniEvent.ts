import { _decorator, Component, Node } from 'cc';
import { Monster } from './Monster';
const { ccclass, property } = _decorator;

@ccclass('MonsterAniEvent')
export class MonsterAniEvent extends Component {

    @property(Monster)
    monster: Monster = null!;

    // 攻击事件
    private onAttack(){
        this.monster.realAttack();
    }

}


