import { _decorator, Component, Node, tween, Vec3, SkeletalAnimation, Quat, BoxCollider } from 'cc';
import Entity from './Entity';
import { App } from '../App';
import { GlobeVariable } from '../core/GlobeVariable';
import { SoundManager } from '../core/SoundManager';
import { EnemySpider } from './EnemySpider';
const { ccclass, property } = _decorator;

@ccclass('PlayerPylon')
export class PlayerPylon extends Entity {
    // @property
    attackRange: number = 30; // 攻击范围，可在编辑器中调整

    @property({ type: SkeletalAnimation })
    characterAnima: SkeletalAnimation = null; // 骨骼动画组件

    @property({ type: Node })
    fireNode: Node = null;


    private enemyList: EnemySpider[] = []; // 敌人列表
    private attackTargetList: EnemySpider[] = []; // 攻击目标列表

    private attackType = 2; // 1-随机攻击 2-攻击最近的

    private bulletSpeed: number = 150;

    // 血量属性
    hp = 2;
    maxHp = 2;
    attack: number = 1;

    // 攻击间隔
    private attackInterval: number = 0.25;
    private testInterval = 0.3;

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
        let characterData = App.dataManager.getCharacterById(2);
        //  
        if (characterData) {
            this.attackRange = characterData.attackRange;
            this.attack = characterData.attackDamage;
            this.maxHp = characterData.maxHp;
            this.hp = characterData.hp;
            this.attackInterval = characterData.attackInterval;
            this.testInterval = characterData.attackInterval;
            this.fireNode.active = true;
        }
        this.bulletPos = this.node.getChildByName("attackPos");
    }

    move() {
        // 塔防无需移动逻辑
    }
    restFireEvent() {
        this.fireNode.active = true;
        console.log("restFireEvent");
    }
    AttackAni() {
        this.fireNode.active = false;
        // 检查敌人列表（更新范围内敌人）
        this.checkEnemy();

        // 仅使用attack1中已确定的currentTarget，不重复计算
        if (this.currentTarget) {
            // 二次校验目标有效性（避免攻击准备阶段目标死亡或被重置）
            if (!this.isValidEnemy(this.currentTarget)) {
                this.currentTarget = null;
                return;
            }

            // 保存当前攻击目标快照，防止回调时目标变化
            const currentAttackTarget = this.currentTarget;
            if (!currentAttackTarget.hitPosNode || !currentAttackTarget.node.isValid) {
                return;
            }
            this.enemyHitPos = currentAttackTarget.hitPosNode.worldPosition.clone();

            // 旋转到目标方向
            this.rotateTowards(this.enemyHitPos, 40);

            // 播放攻击音效（限制次数）
            SoundManager.Instance.playAudio("gonggongji");

            // 创建并发射子弹
            const prefab = App.poolManager.getNode(GlobeVariable.entifyName.FireArrow);
            prefab.setWorldPosition(this.bulletPos.worldPosition);
            prefab.setWorldRotation(this.bulletPos.worldRotation);
            prefab.setWorldScale(this.bulletPos.worldScale);
            prefab.parent = App.sceneNode.fireArrow;

            currentAttackTarget.recordHp -= this.attack;

            const distance = Vec3.distance(this.bulletPos.worldPosition, this.enemyHitPos);
            const flightTime = Math.max(0.05, distance / this.bulletSpeed);

            // 保存初始目标位置，防止目标移动导致子弹跟踪到出生点
            const initialTargetPos = this.enemyHitPos.clone();

            tween(prefab)
                .to(flightTime, { worldPosition: initialTargetPos }, {
                    onUpdate: (target: Node, ratio) => {
                        // 检查目标是否有效，无效则立即终止动画并回收子弹
                        if (!currentAttackTarget || !currentAttackTarget.node || !currentAttackTarget.node.isValid || !currentAttackTarget.isAttack) {
                            //     prefab.stopAllActions();
                            prefab.removeFromParent();
                            App.poolManager.returnNode(prefab);
                            return;
                        }
                        // 在每一帧更新时，让箭矢面向目标方向
                        const currentPos = target.worldPosition;
                        const dir = new Vec3();
                        Vec3.subtract(dir, initialTargetPos, currentPos);
                        dir.normalize();

                        if (dir.lengthSqr() > 0.0001) {
                            const oppositeDir = new Vec3(-dir.x, -dir.y, -dir.z);
                            const targetQuat = new Quat();
                            Quat.fromViewUp(targetQuat, oppositeDir, Vec3.UP);
                            target.worldRotation = targetQuat;
                        }
                    }
                })
                .call(() => {
                    // 使用快照目标执行攻击，避免currentTarget已被重置
                    if (currentAttackTarget && currentAttackTarget.node && currentAttackTarget.node.isValid && currentAttackTarget.hp > 0 && currentAttackTarget.isAttack) {
                        currentAttackTarget.baseHit(this.attack, this.bulletPos.worldPosition, 4);
                    }
                    prefab.removeFromParent();
                    App.poolManager.returnNode(prefab);
                })
                .start();
        }
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
        this.characterAnima.play("Attack_HuoChaiHe");
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
        // 增加对isAttack和node.isValid的检查
        return enemy && enemy.node && enemy.node.isValid && enemy.hp > 0 && enemy.recordHp > 0 && enemy.isAttack;
    }

    /** 辅助判断：目标是否在攻击范围内 */
    private isInAttackRange(target: Node): boolean {
        if (!target) {
            return false;
        }
        return Vec3.distance(target.worldPosition, this.node.worldPosition) < this.attackRange;
    }

    /** 旋转到目标方向 */
    private rotateTowards(targetWorldPos: Vec3, dt: number) {
        const currentPos = this.node.worldPosition.clone();
        const dir = new Vec3();
        Vec3.subtract(dir, targetWorldPos, currentPos);
        dir.y = 0; // 保持水平旋转
        dir.normalize();

        if (dir.lengthSqr() < 0.0001) return;

        const oppositeDir = new Vec3(-dir.x, -dir.y + 0.1, -dir.z - 0.1);
        const targetQuat = new Quat();
        Quat.fromViewUp(targetQuat, oppositeDir, Vec3.UP);

        const currentQuat = this.node.worldRotation.clone();
        const resultQuat = new Quat();
        Quat.slerp(resultQuat, currentQuat, targetQuat, Math.min(1, dt * 40));
        this.node.worldRotation = resultQuat;
    }
}