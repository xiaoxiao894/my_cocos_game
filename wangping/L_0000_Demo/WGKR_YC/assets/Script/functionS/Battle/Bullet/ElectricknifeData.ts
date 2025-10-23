import { Lightning } from "db://assets/GameRes/Effect/Eff/light/Lightning";
import { BattleTarget } from "../BattleTarger/BattleTarget";
import PoolManager, { PoolEnum } from "../../../Base/PoolManager";
import { BulletEnum } from "../../../Base/EnumIndex";
import { removetime } from "../Arms/ElectricknifeArmsAttack";

export class ElectricknifeData {

    public targetList: BattleTarget[] = [];
    public attackIndex: number = 0;
    public removeIndex: number = -1;
    public lineList: Lightning[] = [];

    public time: number = 0;
    public removeTime: number = removetime;


    public init() {
        this.lineList.length = 0;
        this.time = 0;
        this.attackIndex = 0;
        this.targetList.length = 0;
        this.removeTime = removetime;
        this.removeIndex = 0;
    }
    public remove() {
        PoolManager.instance.setPool(PoolEnum.bullet + 99, this);
    }

}