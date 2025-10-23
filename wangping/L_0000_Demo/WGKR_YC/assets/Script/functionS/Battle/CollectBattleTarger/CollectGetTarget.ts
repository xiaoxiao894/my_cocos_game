import { _decorator, Component } from "cc";
import { BattleTarget } from "../BattleTarger/BattleTarget";
const { ccclass, property } = _decorator;

/**
 * 战斗目标 收集器  
 */
@ccclass('CollectGetTarget')
export abstract class CollectGetTarget extends Component {
    /**获取单个目标 */
    abstract get singleTarget(): BattleTarget;
    /**获取全部可攻击目标 */
    abstract get groupTarget(): BattleTarget[];
    /**当前是否可攻击 */
    abstract get isCanAttack(): boolean;
    abstract get attackR(): number;
}


