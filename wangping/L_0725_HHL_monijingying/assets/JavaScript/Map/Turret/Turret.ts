import { _decorator, CCInteger,  Vec3,Node, Quat, tween, ParticleSystem, CCFloat } from 'cc';
import { Monster } from '../../Monster/Monster';
import { SoundManager } from '../../Global/SoundManager';
import { DataManager } from '../../Global/DataManager';
import { NodePoolManager } from '../../Common/NodePoolManager';
import { EntityTypeEnum, EventName } from '../../Common/Enum';
import Entity from '../../Common/Entity';
import { MathUtils } from '../../Util/MathUtils';
import { EventManager } from '../../Global/EventManager';
import RVOObstacles from '../../RVO/RVOObstacles';
import JPSController from '../../JPS/JPSController';
import { TurretLevelItem } from './TurretLevelItem';
import GameUtils from '../../Util/GameUtils';
const { ccclass, property } = _decorator;

@ccclass('Turret')
export class Turret extends Entity {
    @property(TurretLevelItem)
    private turret1:TurretLevelItem = null;
    @property(TurretLevelItem)
    private turret2:TurretLevelItem = null;

    @property(ParticleSystem)
    showAni: ParticleSystem = null;

    protected entityName: EntityTypeEnum = EntityTypeEnum.Turret;

    private attackTargetList: Monster[] = []; // 攻击目标列表

    private bulletSpeed: number = 70;

    //当前等级
    private _level:number = 1;


    // 攻击间隔
    private testInterval = 1.75;

    // 敌人受击位置
    private enemyHitPos: Vec3 = null;
    // 当前攻击目标
    private currentTarget: Monster = null;

    private nowTurret:TurretLevelItem = null;

    private _soundNum:number = 0;

    public init(): void {
        this.showAni.play();
        this.turret2.node.active = false;
        this.turret1.node.active = true;
        this.resetByLevel(1);
        //防止取到缩放是0的情况
        this.scheduleOnce(()=>{
            RVOObstacles.addOneObstacle(this.node);
            JPSController.instance.addOneObstacle(this.node);
        },0.5);
    }

    public upgrade():void{
        if(this._level < 2){
            this.turret2.node.active = true;
            this.turret1.node.active = false;
            GameUtils.showAni(this.turret2.node);
            this.resetByLevel(2);
            if(DataManager.Instance.turretController.isAllTurretUpgraded()){
                DataManager.Instance.isGameEnd = true;
                EventManager.inst.emit(EventName.GameOver);
            }
            this.showAni.play();
        }
    }

    private resetByLevel(level:number):void{
        this._level = level;
        if(level === 2){
            this.nowTurret = this.turret2;
        }else{
            this.nowTurret = this.turret1;
        }
        this.nowTurret.init();
        this.testInterval = this.nowTurret.attackInterval-0.4;
    }

    public get level():number{
        return this._level;
    }

    AttackAni() {
        // 检查敌人列表（更新范围内敌人）
        //this.checkMonster();
        //炮口动画
        this.muzzleAni();

        // 保存当前攻击目标快照，防止回调时目标变化
        const currentAttackTarget = this.currentTarget;
        if (!currentAttackTarget || !currentAttackTarget.hitPosNode) {
            return;
        }
        // this.enemyHitPos = currentAttackTarget.hitPosNode.worldPosition.clone();

        // // 旋转到目标方向
        // if (!this.isInAttackRange(currentAttackTarget.node)) {
        //     this.checkMonster();
        //    this.checkRange()
        //    const currentAttackTarget = this.currentTarget;
        //    if (!currentAttackTarget || !currentAttackTarget.hitPosNode) {
        //         return;
        //     }
        //    this.enemyHitPos = currentAttackTarget.hitPosNode.worldPosition.clone();
        // }
        // this.nowTurret.rotateTowards(this.enemyHitPos, 1);

        // 播放攻击音效（限制次数）
        if(this._soundNum<3){
            SoundManager.inst.playAudio("paotafashe");
            this._soundNum++;
        }
        

        // 创建并发射子弹
        let prefab:Node;
        if(this._level === 2){
            prefab = NodePoolManager.Instance.getNode(EntityTypeEnum.Bullet2);
        }else{
            prefab = NodePoolManager.Instance.getNode(EntityTypeEnum.Bullet1);
        }
        prefab.parent = DataManager.Instance.sceneManager.effectNode;
        prefab.setWorldPosition(this.nowTurret.bulletPos.worldPosition);
        // 核心修改：修正炮弹旋转方向（根据模型实际朝向调整偏移角度）
        const baseRot = this.nowTurret.bulletPos.worldRotation.clone(); // 获取发射点的基础旋转
        const offsetRot = Quat.fromEuler(new Quat(), 0, 0, 0); // 旋转偏移（示例：绕Y轴转90度，需根据模型调整）
        Quat.multiply(baseRot, baseRot, offsetRot); // 合并基础旋转和偏移旋转
        prefab.setWorldRotation(baseRot);

        //prefab.setWorldScale(this.nowTurret.bulletPos.worldScale);

        const distance = Vec3.distance(this.nowTurret.bulletPos.worldPosition, this.enemyHitPos);
        const flightTime = Math.max(0.1, distance / this.bulletSpeed);

        // // 子弹飞行动画

        // 计算贝塞尔曲线控制点（基于子弹起点、目标点和提升高度）
        const startPos = this.nowTurret.bulletPos.worldPosition.clone();
        const endPos = this.enemyHitPos.clone();
        const LIFT_HEIGHT = 10; // 炮弹飞行轨迹高度（可调整）

        // 控制点：起点和终点的中间上方
        const controlPoint = new Vec3(
            (startPos.x + endPos.x) / 2,
            Math.max(startPos.y, endPos.y) + LIFT_HEIGHT, // 取较高点上方
            (startPos.z + endPos.z) / 2
        );

        // 记录初始旋转（假设初始X轴旋转为0）
        const startRotation = prefab.eulerAngles.clone();
        const targetRotationX = 40; // 目标X轴旋转角度

        // 使用贝塞尔曲线动画，同时添加X轴旋转
        tween(prefab)
            .to(flightTime, {}, {
                easing: 'cubicInOut',
                onUpdate: (target: Node, ratio: number) => {
                    // 1. 计算贝塞尔曲线位置
                    const position = MathUtils.bezierCurve(
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
                        if(this._level === 2){
                            NodePoolManager.Instance.returnNode(prefab, EntityTypeEnum.Bullet2);
                        }else{
                            NodePoolManager.Instance.returnNode(prefab, EntityTypeEnum.Bullet1);
                        }
                        return;
                    }
                    currentAttackTarget.hit(this,this.nowTurret.backDistance,this.nowTurret.bulletPos.worldPosition.clone());
                }
                this.explodeAtPosition(this.enemyHitPos);

                prefab.removeFromParent();
                if(this._level === 2){
                    NodePoolManager.Instance.returnNode(prefab, EntityTypeEnum.Bullet2);
                }else{
                    NodePoolManager.Instance.returnNode(prefab, EntityTypeEnum.Bullet1);
                }
                

            })
            .start();
    }


    /** 子弹到达位置后爆炸，对范围内敌人造成伤害 */
    private explodeAtPosition(position: Vec3) {

        // 获取所有敌人列表
        const allEnemies = DataManager.Instance.monsterController.getMonsterList();

        // 查找爆炸范围内的所有有效敌人（使用平方距离优化）
        const affectedEnemies = allEnemies.filter(enemy =>
            this.isValidMonster(enemy) &&
            this.getDistanceSquared(enemy.node.worldPosition, position) <= this.nowTurret.explosionRangeSquared
        );

        // 对所有受影响的敌人造成伤害
        affectedEnemies.forEach(enemy => {
            enemy.hit(this,this.nowTurret.backDistance,this.nowTurret.bulletPos.worldPosition.clone());
        });

        // 爆炸特效
        this.createExplosionEffect(position);
    }

    private createExplosionEffect(position: Vec3) {
        let type: EntityTypeEnum = EntityTypeEnum.TX_jizhong_10;
        if(this._level ===2){
            type = EntityTypeEnum.TX_jizhong_11;
        }
        let flowerTx = NodePoolManager.Instance.getNode(type);

        flowerTx.parent = DataManager.Instance.sceneManager.effectNode;
        flowerTx.setPosition(position);
        flowerTx.active = true;
        let particle = flowerTx.getChildByName("jizhong").getComponent(ParticleSystem);

        particle.play();

        this.scheduleOnce(() => {
            // 1. 停止粒子播放
            particle.stop();
            // 3. 可选：手动清除所有粒子（根据引擎特性）
            particle.clear();
            flowerTx.active = false;
            NodePoolManager.Instance.returnNode(flowerTx, type);

        }, 1.5)
    }

    /** 辅助方法：计算两点之间的平方距离（避免开方运算，提高性能） */
    private getDistanceSquared(pos1: Vec3, pos2: Vec3): number {
        const dx = pos1.x - pos2.x;
        const dy = pos1.y - pos2.y;
        const dz = pos1.z - pos2.z;
        return dx * dx + dy * dy + dz * dz;
    }

    attack1() {
        // 1. 先更新敌人列表
        this.checkMonster();

        // 2. 统一在这里检查并更新目标（攻击前确认）
        this.checkRange();
        // 保存当前攻击目标快照，防止回调时目标变化
        const currentAttackTarget = this.currentTarget;
        if (!currentAttackTarget || !currentAttackTarget.hitPosNode) {
            return;
        }
        this.enemyHitPos = currentAttackTarget.hitPosNode.worldPosition.clone();

        // 旋转到目标方向
        if (!this.isInAttackRange(currentAttackTarget.node)) {
            this.checkMonster();
           this.checkRange()
           const currentAttackTarget = this.currentTarget;
           if (!currentAttackTarget || !currentAttackTarget.hitPosNode) {
                return;
            }
           this.enemyHitPos = currentAttackTarget.hitPosNode.worldPosition.clone();
        }
        this.nowTurret.rotateTowards(this.enemyHitPos, 1);

        // 3. 检查是否有有效目标
        if (!this.currentTarget) {
            return;
        }

        // 5. 执行攻击动画
        this.nowTurret.attackAni();
    }

    die(callback?: (...agrs: unknown[]) => void): void {
        // 死亡逻辑可在此实现
    }

    update(deltaTime: number) {
        if(this.nowTurret){
            this.testInterval += deltaTime;
            if (this.testInterval > this.nowTurret.attackInterval) {
                this.testInterval -= this.nowTurret.attackInterval;
                this.attack1();
            }
        }
        
    }

    /** 查找可攻击的敌人（更新攻击目标列表） */
    checkMonster() {
        this.attackTargetList = []; // 清空列表
        const enemyList = DataManager.Instance.monsterController.getMonsterList();

        // 检查怪列表
        if (this.attackTargetList.length === 0) {
            for (let i = 0; i < enemyList.length; i++) {
                const enemy = enemyList[i];
                if (!this.isValidMonster(enemy)) continue;

                if (this.isInAttackRange(enemy.node)) {
                    this.attackTargetList.push(enemy);
                }
            }
        }
    }

    /** 检查并更新最近的敌人目标 */
    checkRange() {
        // 当前目标有效且在范围内则直接返回
        if (this.currentTarget && this.isValidMonster(this.currentTarget) && this.isInAttackRange(this.currentTarget.node)) {
            return this.currentTarget;
        }

        // 查找最近的敌人
        let minDis = Number.MAX_VALUE;
        let minEnemy: Monster = null;
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
    private isValidMonster(monster: Monster): boolean {
        return monster && monster.isAlive();
    }

    /** 辅助判断：目标是否在攻击范围内 */
    private isInAttackRange(target: Node): boolean {
        return Vec3.distance(target.worldPosition, this.node.worldPosition) < this.nowTurret.attackRange;
    }

    /** 炮口动画 */
    private muzzleAni():void{
        let flowerTx = NodePoolManager.Instance.getNode(EntityTypeEnum.TX_fashe);
        flowerTx.parent = this.nowTurret.bulletPos.parent;
        flowerTx.setPosition(this.nowTurret.bulletPos.position);
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
            NodePoolManager.Instance.returnNode(flowerTx, EntityTypeEnum.TX_fashe);
        }, 1.5)
    }
}


