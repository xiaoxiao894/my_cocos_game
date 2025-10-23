import { _decorator, Color, Component, MeshRenderer, Node, Tween, tween, Vec3 } from 'cc';
import { DamageData } from '../../common/CommonInterface';
import { HomeGate } from './HomeGate';
const { ccclass, property } = _decorator;

/** 可被攻击的墙 */
@ccclass('WallCanBeHit')
export class WallCanBeHit extends HomeGate {
    /**
     * 受伤回调
     */
    protected onHurt(damageData: DamageData) {
        // 模型闪红
        this.setNodeColor(this.modelNode, this.hurtColor);
        this.scheduleOnce(() => {
            let oriColor = this.oriColorMap.get(this.modelNode.name);
            if (oriColor) {
                this.setNodeColor(this.modelNode, oriColor);
            }
        }, 0.3);
    }
}


