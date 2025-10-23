import { _decorator, Node, tween, Vec3, Quat, Animation, ParticleSystem, BoxCollider } from 'cc';

import Entity from './Entity';
import { App } from '../App';
import { GlobeVariable } from '../core/GlobeVariable';
import { SoundManager } from '../core/SoundManager';
import { EnemySpider } from './EnemySpider';
import { MathUtil } from '../core/MathUtils';
const { ccclass, property } = _decorator;

@ccclass('PlayerTurret')
export class PlayerTurret extends Entity {
   // @property
    attackRange: number = 30; // 攻击范围，可在编辑器中调整

    @property({ type: Animation })
    characterAnima: Animation = null; // 骨骼动画组件

    private attackTargetList: EnemySpider[] = []; // 攻击目标列表

    private bulletSpeed: number = 90;

    private explosionRangeSquared: number = 120; // 爆炸范围的平方（用于优化距离判断）

    // 血量属性
    hp = 2;
    maxHp = 2;
    attack: number = 1;



    // 攻击间隔
    private attackInterval: number = 1.75;
    private testInterval = 1.75;

    private _speed: number = 10;
    // 塔发射子弹的位置
    private bulletPos: Node = null;

    // 敌人受击位置
    private enemyHitPos: Vec3 = null;
    // 当前攻击目标
    private currentTarget: EnemySpider = null;

    private audioPlayNum: number = 0;

    onLoad() {
        
    }

    start() {
        let characterData = App.dataManager.getCharacterById(3);
        if (characterData) {
            this.attackRange = characterData.attackRange;
            this.attack = characterData.attackDamage;
            this.maxHp = characterData.maxHp;
            this.hp = characterData.hp;
            this.attackInterval = characterData.attackInterval;
            this.testInterval = characterData.attackInterval;
        }
        this.bulletPos = this.node.getChildByName("attackPos");
        
    }
    move() {
        // 塔防无需移动逻辑
    }
    AttackAni() {
        // 检查敌人列表（更新范围内敌人）
        this.checkEnemy();

        let flowerTx = App.poolManager.getNode(GlobeVariable.entifyName.TurretTx);
        flowerTx.parent = this.bulletPos.parent
        flowerTx.setPosition(this.bulletPos.position);
        flowerTx.active = true;
        let particle = flowerTx.getChildByName("blank").getComponent(ParticleSystem);

        particle.play()

        this.scheduleOnce(() => {
            // 1. 停止粒子播放
            particle.stop();
            // 3. 可选：手动清除所有粒子（根据引擎特性）
            particle.clear();
            flowerTx.active = false;
            flowerTx.removeFromParent()
            App.poolManager.returnNode(flowerTx, GlobeVariable.entifyName.FlowerTx);

        }, 1.5)

        // 仅使用attack1中已确定的currentTarget，不重复计算
        // if (this.currentTarget) {
        //     // 二次校验目标有效性（避免攻击准备阶段目标死亡）
        //     if (this.currentTarget.hp <= 0 || this.currentTarget.recordHp <= 0) {
        //         return;
        //     }
        // }

        // 保存当前攻击目标快照，防止回调时目标变化
        const currentAttackTarget = this.currentTarget;
        if (!currentAttackTarget || !currentAttackTarget.hitPosNode) {
            return;
        }
        this.enemyHitPos = currentAttackTarget.hitPosNode.worldPosition.clone();

        // 旋转到目标方向
        if (!this.isInAttackRange(currentAttackTarget.node)) {
            this.checkEnemy();
           this.checkRange()
           const currentAttackTarget = this.currentTarget;
           if (!currentAttackTarget || !currentAttackTarget.hitPosNode) {
            return;
        }
           this.enemyHitPos = currentAttackTarget.hitPosNode.worldPosition.clone();
           // return;
        }
        this.rotateTowards(this.enemyHitPos, 1);

        // 播放攻击音效（限制次数）
        //if (++this.audioPlayNum < 4) {
        SoundManager.Instance.playAudio("paotafashe");
        //  }

        // 创建并发射子弹
        const prefab = App.poolManager.getNode(GlobeVariable.entifyName.TurretBullet);
        prefab.setWorldPosition(this.bulletPos.worldPosition);
        // prefab.setWorldRotation(this.bulletPos.worldRotation);
        // prefab.setWorldScale(this.bulletPos.worldScale);
        // prefab.parent = App.sceneNode.fireArrow;
        // 核心修改：修正炮弹旋转方向（根据模型实际朝向调整偏移角度）
        const baseRot = this.bulletPos.worldRotation.clone(); // 获取发射点的基础旋转
        const offsetRot = Quat.fromEuler(new Quat(), 0, 0, 0); // 旋转偏移（示例：绕Y轴转90度，需根据模型调整）
        Quat.multiply(baseRot, baseRot, offsetRot); // 合并基础旋转和偏移旋转
        prefab.setWorldRotation(baseRot);

        prefab.setWorldScale(this.bulletPos.worldScale);
        prefab.parent = App.sceneNode.fireArrow;

        currentAttackTarget.recordHp -= this.attack;

        const distance = Vec3.distance(this.bulletPos.worldPosition, this.enemyHitPos);
        const flightTime = Math.max(0.1, distance / this.bulletSpeed);

        // // 子弹飞行动画
        // tween(prefab)
        //     .to(flightTime, { worldPosition: this.enemyHitPos })
        //     .call(() => {
        //         // 使用快照目标执行攻击，避免currentTarget已被重置
        //         if (currentAttackTarget && currentAttackTarget.hp > 0) {
        //             currentAttackTarget.turretHit(this.attack);
        //         }
        //         this.explodeAtPosition(this.enemyHitPos);

        //         prefab.removeFromParent();
        //         App.poolManager.returnNode(prefab);
        //     })
        //     .start();

        // 原代码：tween(prefab).to(flightTime, { worldPosition: this.enemyHitPos })...

        // 计算贝塞尔曲线控制点（基于子弹起点、目标点和提升高度）
        const startPos = this.bulletPos.worldPosition.clone();
        const endPos = this.enemyHitPos.clone();
        const LIFT_HEIGHT = 25; // 炮弹飞行轨迹高度（可调整）

        // 控制点：起点和终点的中间上方
        const controlPoint = new Vec3(
            (startPos.x + endPos.x) / 2,
            Math.max(startPos.y, endPos.y) + LIFT_HEIGHT, // 取较高点上方
            (startPos.z + endPos.z) / 2
        );

        // // 使用贝塞尔曲线动画替代线性运动
        // tween(prefab)
        //     .to(flightTime, {}, {
        //         easing: 'cubicInOut',
        //         onUpdate: (target: Node, ratio: number) => {
        //             // 调用MathUtil的贝塞尔曲线计算方法
        //             const position = MathUtil.bezierCurve(
        //                 startPos,
        //                 controlPoint,
        //                 endPos,
        //                 ratio
        //             );
        //             target.worldPosition = position;
        //         }
        //     })
        //     .call(() => {
        //         // 子弹命中逻辑（保持不变）
        //         if (currentAttackTarget && currentAttackTarget.hp > 0) {
        //             currentAttackTarget.turretHit(this.attack);
        //         }
        //         this.explodeAtPosition(this.enemyHitPos);

        //         prefab.removeFromParent();
        //         App.poolManager.returnNode(prefab, GlobeVariable.entifyName.TurretBullet);

        //     })
        //     .start();
        // }
        // 记录初始旋转（假设初始X轴旋转为0）
        const startRotation = prefab.eulerAngles.clone();
        const targetRotationX = 270; // 目标X轴旋转角度

        // 使用贝塞尔曲线动画，同时添加X轴旋转
        tween(prefab)
            .to(flightTime, {}, {
                easing: 'cubicInOut',
                onUpdate: (target: Node, ratio: number) => {
                    // 1. 计算贝塞尔曲线位置
                    const position = MathUtil.bezierCurve(
                        startPos,
                        controlPoint,
                        endPos,
                        ratio
                    );
                    target.worldPosition = position;

                    // 2. 计算X轴旋转（从0度过渡到180度）
                    const currentRotationX = startRotation.x + ratio * targetRotationX;
                    target.eulerAngles = new Vec3(
                        currentRotationX,
                        startRotation.y, // 保持Y轴旋转不变
                        startRotation.z  // 保持Z轴旋转不变
                    );
                }
            })
            .call(() => {
                // 子弹命中逻辑（保持不变）
                if (currentAttackTarget && currentAttackTarget.hp > 0) {
                    if (!this.isInAttackRange(currentAttackTarget.node)) {
                        this.explodeAtPosition(this.enemyHitPos);

                        prefab.removeFromParent();
                        App.poolManager.returnNode(prefab, GlobeVariable.entifyName.TurretBullet);
                        return
                    }
                    currentAttackTarget.turretHit(this.attack, this.bulletPos.worldPosition);
                }
                this.explodeAtPosition(this.enemyHitPos);

                prefab.removeFromParent();
                App.poolManager.returnNode(prefab, GlobeVariable.entifyName.TurretBullet);

            })
            .start();
    }


    /** 子弹到达位置后爆炸，对范围内敌人造成伤害 */
    private explodeAtPosition(position: Vec3) {
        // 播放爆炸音效
        // SoundManager.inst.playAudio("YX_baozha"); // 假设存在爆炸音效

        // 获取所有敌人列表
        const allEnemies = [...App.enemyController.getEnemyRvoList(), ...App.enemyController.getEnemyList()];

        // 查找爆炸范围内的所有有效敌人（使用平方距离优化）
        const affectedEnemies = allEnemies.filter(enemy =>
            this.isValidEnemy(enemy) &&
            this.getDistanceSquared(enemy.node.worldPosition, position) <= this.explosionRangeSquared
        );

        // 对所有受影响的敌人造成伤害
        affectedEnemies.forEach(enemy => {
            enemy.recordHp -= this.attack;
            enemy.turretHit(this.attack, this.bulletPos.worldPosition);

        });

        // 可以在这里添加爆炸特效
        this.createExplosionEffect(position)
    }

    private createExplosionEffect(position: Vec3) {
        let flowerTx = App.poolManager.getNode(GlobeVariable.entifyName.TurretBombTx);

        flowerTx.parent = App.sceneNode.bombEffectParent;
        flowerTx.setPosition(position);
        flowerTx.active = true;
        let particle = flowerTx.getChildByName("jizhong").getComponent(ParticleSystem);

        particle.play()

        this.scheduleOnce(() => {
            // 1. 停止粒子播放
            particle.stop();
            // 3. 可选：手动清除所有粒子（根据引擎特性）
            particle.clear();
            flowerTx.active = false;
            flowerTx.removeFromParent()
            App.poolManager.returnNode(flowerTx, GlobeVariable.entifyName.TurretBombTx);

        }, 1.5)
    }
    /** 辅助方法：计算两点之间的平方距离（避免开方运算，提高性能） */

    /** 辅助方法：计算两点之间的平方距离（避免开方运算，提高性能） */
    private getDistanceSquared(pos1: Vec3, pos2: Vec3): number {
        const dx = pos1.x - pos2.x;
        const dy = pos1.y - pos2.y;
        const dz = pos1.z - pos2.z;
        return dx * dx + dy * dy + dz * dz;
    }

    attack1() {
        // 1. 先更新敌人列表
        this.checkEnemy();

        // 2. 统一在这里检查并更新目标（攻击前确认）
        this.checkRange();

        // 3. 检查是否有有效目标
        if (!this.currentTarget) {
            return;
        }

        // 5. 执行攻击动画
        this.characterAnima.play("attack_paota");
    }

    die(callback?: (...agrs: unknown[]) => void): void {
        // 死亡逻辑可在此实现
    }

    update(deltaTime: number) {
        this.testInterval += deltaTime;
        if (this.testInterval > this.attackInterval) {
            this.testInterval -= this.attackInterval;
            this.attack1();
        }
    }

    /** 查找可攻击的敌人（更新攻击目标列表） */
    checkEnemy() {
        this.attackTargetList = []; // 清空列表
        const rvoEnemyList = App.enemyController.getEnemyRvoList();
        const enemyList = App.enemyController.getEnemyList();

        // 先检查RVO敌人列表
        for (let i = 0; i < rvoEnemyList.length; i++) {
            const enemy = rvoEnemyList[i];
            if (!this.isValidEnemy(enemy)) continue;

            if (this.isInAttackRange(enemy.node)) {
                this.attackTargetList.push(enemy);
            }
        }

        // RVO列表无目标时检查普通敌人列表
        if (this.attackTargetList.length === 0) {
            for (let i = 0; i < enemyList.length; i++) {
                const enemy = enemyList[i];
                if (!this.isValidEnemy(enemy)) continue;

                if (this.isInAttackRange(enemy.node)) {
                    this.attackTargetList.push(enemy);
                }
            }
        }
    }

    /** 检查并更新最近的敌人目标 */
    checkRange() {
        // 当前目标有效且在范围内则直接返回
        if (this.currentTarget && this.isValidEnemy(this.currentTarget) && this.isInAttackRange(this.currentTarget.node)) {
            return this.currentTarget;
        }

        // 查找最近的敌人
        let minDis = Number.MAX_VALUE;
        let minEnemy: EnemySpider = null;
        for (let i = 0; i < this.attackTargetList.length; i++) {
            const enemy = this.attackTargetList[i];
            const distance = Vec3.distance(enemy.node.worldPosition, this.node.worldPosition);
            if (distance < minDis) {
                minDis = distance;
                minEnemy = enemy;
            }
        }

        this.currentTarget = minEnemy;
        return minEnemy;
    }

    /** 辅助判断：敌人是否有效（存活） */
    private isValidEnemy(enemy: EnemySpider): boolean {
        return enemy && enemy.hp > 0 && enemy.recordHp > 0;
    }

    /** 辅助判断：目标是否在攻击范围内 */
    private isInAttackRange(target: Node): boolean {
        if(target && target.worldPosition){
            return Vec3.distance(target.worldPosition, this.node.worldPosition) < this.attackRange;
        }
       return false;
    }

    /** 旋转到目标方向 */
    private rotateTowards(targetWorldPos: Vec3, dt: number) {
        const currentPos = this.node.worldPosition.clone();
        const dir = new Vec3();
        Vec3.subtract(dir, targetWorldPos, currentPos); // 计算从当前位置到目标位置的方向
        dir.y = 0; // 保持水平旋转
        dir.normalize();

        if (dir.lengthSqr() < 0.0001) return; // 距离过近时不旋转

        // 直接使用指向目标的方向作为视图方向，无需取反
        const targetQuat = new Quat();
        Quat.fromViewUp(targetQuat, dir, Vec3.UP); // 使用dir而非反方向

        const currentQuat = this.node.worldRotation.clone();
        const resultQuat = new Quat();
        // 平滑插值旋转
        Quat.slerp(resultQuat, currentQuat, targetQuat, Math.min(1, dt * 40));
        this.node.worldRotation = resultQuat;
    }
}