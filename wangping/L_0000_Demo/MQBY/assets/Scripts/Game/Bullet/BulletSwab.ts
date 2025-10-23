import { _decorator, Component, Node, Quat, Vec3 } from 'cc';
import { BulletBase } from './BulletBase';
import { HealthComponent } from '../Components/HealthComponent';
import { Character } from '../Role/Character';
import { BuildingType, BuildUnlockState } from '../../common/CommonEnum';
const { ccclass, property } = _decorator;

/** 发射子弹 棉签 */
@ccclass('BulletSwab')
export class BulletSwab extends BulletBase {
    public fire(startPos: Vec3, direction: Vec3): void {
        super.fire(startPos, direction);
        app.audio.playEffect('resources/MQBY/棉签射箭')
    }

    private damageEffectScale = new Vec3(2, 2, 2);
    /**
     * 命中回调
     */
    protected onHit(targetNode: Node): void {
        // 获取被击中对象的生命值组件并造成伤害
        if (targetNode) {
            const healthComp = targetNode.getComponent(HealthComponent);
            if (healthComp) {
                let damageValue = this.damage;

                // 解锁传送带后伤害增加
                const checkBuilding = manager.game.unlockItemMap.get(BuildingType.SwabTransporter);
                if (checkBuilding && checkBuilding.UnlockState == BuildUnlockState.Unlocked) {
                    damageValue = this.damage * 4;
                }

                let damageData = {
                    damage: damageValue,
                    damageSource: this.createNode,
                    ignoreImmunity: false,
                }
                healthComp.takeDamage(damageData, this.damageColor);

                // 获取两个碰撞体的中心点
                const selfWpos = this.node.getWorldPosition();
                const targetWpos = targetNode.getWorldPosition();
                const hitPos = new Vec3((selfWpos.x + targetWpos.x) / 2, (selfWpos.y + targetWpos.y) / 2 - 0.5, (selfWpos.z + targetWpos.z) / 2);
                // 在碰撞点播放特效
                manager.effect.playEffect(manager.effect.effectType.GreenDamage, hitPos, Quat.IDENTITY, null, this.damageEffectScale);

                // const character = targetNode.getComponent(Character);
                // if(character){
                //     // 击退
                //     character.knockback(this.node.getWorldPosition(), 1);
                // }
            }
        }
    }
}


