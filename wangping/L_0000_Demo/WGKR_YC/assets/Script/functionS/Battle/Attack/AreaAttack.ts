import { _decorator, Animation, Component, Node, profiler, Vec3 } from 'cc';
import { AttackTargetBase } from '../Base/AttackTargetBase';
import { BattleTarget } from '../BattleTarger/BattleTarget';
const { ccclass, property } = _decorator;
/**近战范围攻击 */
@ccclass('AreaAttack')
export class AreaAttack extends AttackTargetBase {


    @property(Animation)
    private effect_anim: Animation;

    // @property({ type: Bullet_Hit_Enum })
    // public hitEnum: Bullet_Hit_Enum = Bullet_Hit_Enum.zhanshi;

    private temp: Vec3 = new Vec3();
    protected attackEvent(power: number, reoel: number): void {
        let targetList = this.collectGettarget.groupTarget;
        if (targetList == null) {
            this.target = null;
            return;
        }
        this.effect_anim && this.effect_anim.play();
        this.target = targetList[0];
        for (let i = 0; i < targetList.length; i++) {
            let target = targetList[i];
            target.Hit(power);
            target.repelBattleTarget(this.node, reoel);
            let pos = target.node.worldPosition;
            this.temp.set(pos.x, pos.y + 50);
            // EffectManager.instance.ShowEffect(this.temp, PoolEnum.bullet_hit, this.hitEnum)
        }

    }

}


