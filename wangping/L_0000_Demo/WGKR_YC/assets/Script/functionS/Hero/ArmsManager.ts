import { _decorator, Component, Node } from 'cc';
import { FbxManager } from '../FBX/FbxManager';
import { ArmsAttackBase } from '../Battle/Arms/ArmsAttackBase';
import { BattleTarget } from '../Battle/BattleTarger/BattleTarget';
const { ccclass, property } = _decorator;

@ccclass('ArmsManager')
export class ArmsManager extends Component {

    @property(FbxManager)
    public fbxMgr: FbxManager;

    @property(ArmsAttackBase)
    public arms: ArmsAttackBase;

    public target: BattleTarget;

    start() {
        this.fbxMgr.setAttackAnimCall(this.startAttack, this);
    }

    private startAttack() {
        this.arms.startAttack(this.target);
    }


}


