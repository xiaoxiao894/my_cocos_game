import { _decorator, Component, Node, Vec3 } from 'cc';
import { BulletBase } from './BulletBase';
import { HealthComponent } from '../Components/HealthComponent';
import { Enemy } from '../Role/Enemy';
import { BuildingType, BuildUnlockState } from '../../common/CommonEnum';
const { ccclass, property } = _decorator;

/** 发射子弹 爆炸水果 */
@ccclass('BulletExplosionFruit')
export class BulletExplosionFruit extends BulletBase {
    @property({
        tooltip: '爆炸范围',
    })
    explosionRange: number = 10;

    public fire(startPos: Vec3, direction: Vec3): void {
        super.fire(startPos, direction);
        app.audio.playEffect('resources/MQBY/番茄投掷器')
    }

    /**
     * 命中回调
     */
    protected onHit(targetNode: Node): void {
        app.audio.playEffect('resources/MQBY/番茄爆炸')
        const selfWpos = this.node.getWorldPosition();
        // 获取被击中对象的生命值组件并造成伤害
        if (targetNode) {
            let damageValue = this.damage;
            let immunity = false;
            let damageRange = this.explosionRange;

            // 不出怪了，或者 解锁传送带后伤害和伤害范围增加
            const checkBuilding = manager.game.unlockItemMap.get(BuildingType.ExplosionFruitTransporter);
            if (!manager.enemy.CanCreateEnemy || (checkBuilding && checkBuilding.UnlockState == BuildUnlockState.Unlocked)) {

                damageValue = this.damage * 3;
                damageRange = this.explosionRange * 2;
            }

            let enemys = manager.enemy.getRangeEnemies(targetNode.getWorldPosition(), damageRange);
            enemys.forEach(enemy => {
                const healthComp = enemy.node.getComponent(HealthComponent);
                if (healthComp) {
                    let damageData = {
                        damage: damageValue,
                        damageSource: this.createNode,
                        ignoreImmunity: immunity,
                    }
                    healthComp.takeDamage(damageData, this.damageColor);
                }

                const enmeyCom = enemy.node.getComponent(Enemy);
                if (enmeyCom && !enmeyCom.isElite) {
                    // 击退
                    enmeyCom.knockback(this.node.getWorldPosition(), 4);
                }
            });

            // 获取两个碰撞体的中心点
            const targetWpos = targetNode.getWorldPosition();
            const hitPos = new Vec3((selfWpos.x + targetWpos.x) / 2, (selfWpos.y + targetWpos.y) / 2, (selfWpos.z + targetWpos.z) / 2);
            // 在碰撞点播放特效
            manager.effect.playEffect(manager.effect.effectType.Explosion, hitPos);
        }
        else {
            // 直接在子弹当前位置播放
            manager.effect.playEffect(manager.effect.effectType.Explosion, selfWpos);
        }
    }

    update(dt: number): void {
        super.update(dt);
        // 碰到地面了，也爆炸
        if (this.node.worldPosition.y <= 0) {
            this.onHit(this.targetNode);
            this.recycleBullet();
        }
    }
}


