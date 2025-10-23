import { _decorator, Component, Node, director, Vec3, Prefab, instantiate, NodePool, CCInteger, math } from 'cc';
import { EnemyBoss } from './Role/EnemyBoss';
import { HealthComponent } from './Components/HealthComponent';
import { Enemy } from './Role/Enemy';
import { GuideManager, GuideStep } from './GuideManager';
const { ccclass, property } = _decorator;

@ccclass('EnemyManager')
export class EnemyManager extends Component {
    /** 单例实例 */
    private static _instance: EnemyManager | null = null;

    /** 获取单例实例 */
    public static get instance(): EnemyManager {
        if (!this._instance) {
            console.warn('EnemyManager 实例不存在 动态创建');
            // 动态创建节点并添加组件
            const node = new Node('EnemyManager');
            this._instance = node.addComponent(EnemyManager);
            // 添加到场景
            director.getScene()?.addChild(node);
        }
        return this._instance as EnemyManager;
    }

    @property(Prefab)
    protected enemyPrefab: Prefab = null;

    @property(Prefab)
    protected eliteEnemyPrefab: Prefab = null;

    @property({ type: [Node], displayName: '创建敌人位置组' })
    public enemyStartNodes: Node[] = [];

    @property({ type: Node, displayName: '初始敌人位置节点' })
    public initEnemyPosParent: Node = null;

    @property({ type: CCInteger, displayName: '最大敌人数', range: [1, 100] })
    public maxEnemyCount: number = 10;

    /** 所有敌人节点列表 */
    private _enemies: Node[] = [];

    // 对象池
    private enemyPool: NodePool = null!;

    // 精英怪对象池
    private eliteEnemyPool: NodePool = null!;

    /** 初始化对象池数量 */
    private poolInitSize = 10;

    /**
     * 初始化对象池
     */
    private initEnemyPool() {
        // 创建对象池
        this.enemyPool = new NodePool();

        this.eliteEnemyPool = new NodePool();

        // 预先实例化一定数量的敌人
        for (let i = 0; i < this.poolInitSize; i++) {
            const enemyNode = instantiate(this.enemyPrefab);
            this.enemyPool.put(enemyNode);
        }
    }

    /**
     * 从对象池中获取或创建敌人
     */
    public createOrGetEnemy(isElite: boolean = false): Node {
        let enemyNode: Node = null!;

        if (isElite) {
            // 从对象池中获取敌人
            if (this.eliteEnemyPool.size() > 0) {
                enemyNode = this.eliteEnemyPool.get()!;
            } else {
                // 如果对象池为空，创建新的敌人
                enemyNode = instantiate(this.eliteEnemyPrefab);
            }
        }
        else {
            // 从对象池中获取敌人
            if (this.enemyPool.size() > 0) {
                enemyNode = this.enemyPool.get()!;
            } else {
                // 如果对象池为空，创建新的敌人
                enemyNode = instantiate(this.enemyPrefab);
            }
        }

        return enemyNode;
    }

    onLoad() {
        // 单例检查
        if (EnemyManager._instance) {
            this.node.destroy();
            return;
        }
        EnemyManager._instance = this;
        // 创建对象池
        this.initEnemyPool();

        this.scheduleOnce(() => {
            this.createInitEnemy();
        });
    }

    public createInitEnemy() {
        if (!this.initEnemyPosParent) {
            console.warn('EnemyManager 没有配置初始敌人位置节点');
            return;
        }
        for (let i = 0; i < this.initEnemyPosParent.children.length; i++) {
            let posNode = this.initEnemyPosParent.children[i];
            let wPos = posNode.worldPosition;
            this._createEnemy(wPos);
        }
    }

    protected onDestroy(): void {
        if (EnemyManager._instance === this) {
            EnemyManager._instance = null;
        }

        this._enemies = [];
    }

    /**
     * 添加敌人到管理器
     * @param enemy 敌人节点
     */
    public addEnemy(enemy: Node): void {
        if (!this._enemies.includes(enemy)) {
            this._enemies.push(enemy);
        }
    }

    /**
     * 从管理器移除敌人
     * @param enemy 敌人节点
     */
    public removeEnemy(enemy: Node): void {
        const index = this._enemies.indexOf(enemy);
        if (index >= 0) {
            this._enemies.splice(index, 1);
        }

        const enemyCom = enemy.getComponent(Enemy);

        // 回收敌人节点到对象池
        if (enemyCom.isElite) {
            this.eliteEnemyPool.put(enemy);
        }
        else {
            this.enemyPool.put(enemy);
        }
    }

    /** 获取存活的精英怪 */
    public getEliteEnemys(): Node[] {
        let eliteEnemies: Node[] = [];
        for (const enemy of this._enemies) {
            if (!enemy || !enemy.isValid || enemy.getComponent(HealthComponent)?.isDead) {
                continue;
            }
            if (enemy.getComponent(Enemy).isElite) {
                eliteEnemies.push(enemy);
            }
        }
        return eliteEnemies;
    }

    /**
     * 获取范围内的敌人
     * @param position 中心位置
     * @param range 范围半径
     * @returns 范围内的敌人组件数组
     */
    public getRangeEnemies(position: Vec3, range: number): { node: Node, squaredDistance: number }[] {
        const rangeEnemies: { node: Node, squaredDistance: number }[] = [];
        // 使用平方距离来优化性能，避免开平方根运算
        const rangeSquared = range * range;

        for (const enemy of this._enemies) {
            if (!enemy || !enemy.isValid || enemy.getComponent(HealthComponent)?.isDead) {
                continue;
            }

            // 计算平方距离
            const enemyPos = enemy.getWorldPosition();
            const squaredDistance = Vec3.squaredDistance(position, enemyPos);

            if (squaredDistance <= rangeSquared) {
                // 这里返回的对象应该包含node属性，以匹配BulletBase中的使用方式
                rangeEnemies.push({
                    node: enemy,
                    squaredDistance: squaredDistance // 注意：这里是平方距离，用于排序
                });
            }
        }

        // 按平方距离排序，最近的在前面
        rangeEnemies.sort((a, b) => a.squaredDistance - b.squaredDistance);

        return rangeEnemies;
    }

    protected update(dt: number): void {
        if (manager.game.isGamePause) {
            return;
        }
        if (manager.game.isGameStart) {
            this._updateEnemy(dt);
        }
    }

    private readonly MaxCreateTime: number = 1;
    private _createTimeCount: number = 0;

    private _canCreateEnemy: boolean = true;
    public set CanCreateEnemy(value: boolean) {
        this._canCreateEnemy = value;
    }

    public get CanCreateEnemy(): boolean {
        return this._canCreateEnemy;
    }

    private _startCreatEliteTime: number = 0;
    private _updateEnemy(dt: number): void {
        if (!this._canCreateEnemy) {
            return;
        }
        if (this._createTimeCount <= 0) {
            this._createTimeCount = this.MaxCreateTime;

            let wPos = this._getCreatePos();
            // 在指定位置附近（X/Z少量随机）
            wPos.x += Math.random() * 10 - 5;
            wPos.z += Math.random() * 4 - 2;
            this._createEnemy(wPos);

            // 解锁番茄炸弹塔，或者时间超过指定值，则开始出精英怪
            if (GuideManager.instance.currentStep > GuideStep.ToUnlockExplosionFruitDefenseTower || this._startCreatEliteTime >= 40) {
                this._checkCreateEliteEnemy();
            }
        }
        this._createTimeCount -= dt;
        this._startCreatEliteTime += dt;
    }


    _elitePosId: number = 0;
    /**
     * 检查是否创建精英怪。同时只会有X个精英怪在场上
     */
    private _checkCreateEliteEnemy() {
        // 检查当前是否已有精英怪在场上
        const currentEliteCount = this._enemies.filter(enemy => {
            const enemyComponent = enemy.getComponent(Enemy);
            return enemyComponent && enemyComponent.isElite;
        }).length;

        // 精英怪数量
        const maxEliteCount = GuideManager.instance.currentStep > GuideStep.ToUnlockExplosionFruitStack ? 2 : 1;

        // 如果没有精英怪，且有精英怪预制体，则创建精英怪
        if (currentEliteCount < maxEliteCount && this.eliteEnemyPrefab) {
            if (this.enemyStartNodes.length > 0) {
                if (this._elitePosId <= 0) {
                    this._elitePosId = this.enemyStartNodes.length - 1;
                }

                for (let i = 0; i < maxEliteCount - currentEliteCount; i++) {
                    // 获取第一个开始点位的位置
                    const startPos = new Vec3();
                    this.enemyStartNodes[maxEliteCount == 1 ? 0 : this._elitePosId--].getWorldPosition(startPos);

                    // 实例化精英怪
                    const eliteEnemyNode = this.createOrGetEnemy(true);
                    eliteEnemyNode.parent = this.node;
                    eliteEnemyNode.setWorldPosition(startPos);

                    // 获取精英怪组件
                    const eliteEnemy = eliteEnemyNode.getComponent(Enemy);
                    // 重置精英怪状态
                    eliteEnemy && eliteEnemy.reset();

                    // 精英怪直冲城门
                    eliteEnemy.setAttackTarget(manager.game.doorNode);

                    // 将精英怪添加到管理器
                    this.addEnemy(eliteEnemyNode);
                }
            }
        }
    }

    private _createId: number = 0;
    private _repeatCount: number = 0;
    private _getCreatePos(): Vec3 {
        if (this.enemyStartNodes.length <= 0) {
            return this.node.worldPosition;
        }
        let wPos = new Vec3();
        // 番茄防御塔解锁前，使用生成策略:尽量使用双数id的位置
        if (GuideManager.instance.currentStep <= GuideStep.ToUnlockExplosionFruitDefenseTower) {
            if (this._createId >= this.enemyStartNodes.length) {
                if (this._repeatCount == 0) {
                    this._repeatCount++;
                    // 1 ~ this.enemyStartNodes.length-1 范围内，随机取一个单数id
                    this._createId = Math.floor(Math.random() * (this.enemyStartNodes.length - 1)) + 1;
                    if (this._createId % 2 == 0) {
                        this._createId++;
                    }
                    // 确保创建的id在有效范围内
                    if (this._createId >= this.enemyStartNodes.length) {
                        this._createId = 1;
                    }
                }
                else {
                    this._createId = 0;
                    this._repeatCount = 0;
                }
            }

            this.enemyStartNodes[this._createId].getWorldPosition(wPos);
            // 确保下一个还是双数
            if (this._createId % 2 == 0) {
                this._createId += 2;
            }
            else {
                this._createId++;
            }
            return wPos;
        }
        else {
            // 0-2 重复两次，然后3-最大 重复1次，然后循环 
            if (this._repeatCount == 0) {
                if (this._createId >= 3) {
                    this._repeatCount++;
                    this._createId = 0;
                }
            }
            else {
                if (this._createId >= this.enemyStartNodes.length) {
                    this._createId = 0;
                    this._repeatCount = 0;
                }
            }
            let index = this._createId;
            this.enemyStartNodes[index].getWorldPosition(wPos);
            this._createId++;
            return wPos;
        }
    }

    private _resetEnemyCom(enemyNode: Node, wPos: Vec3) {
        let enemy = enemyNode.getComponent(Enemy);
        if (enemy) {
            // 重置敌人状态
            enemy.reset();
            // 敌人根据位置设置目标
            if (wPos.x < -5 || wPos.x > 5) {
                // 查找最近的城墙
                let wallNode = this._findNearestWall(wPos);
                enemy.setAttackTarget(wallNode);
                enemy.attackComponent.setLockAttackDir(new Vec3(0, 0, -1));
            }
            else {
                enemy.setAttackTarget(manager.game.doorNode);
                enemy.attackComponent.setLockAttackDir(null);
            }
        }
    }

    private _createEnemy(wPos: Vec3): Node {
        if (!this.enemyPrefab) {
            console.warn('EnemyManager 没有配置敌人预制体');
            return;
        }
        if (this._enemies.length >= this.maxEnemyCount) {
            return;
        }
        let enemyNode = this.createOrGetEnemy();
        enemyNode.parent = this.node;
        enemyNode.setWorldPosition(wPos);

        this._resetEnemyCom(enemyNode, wPos);

        this.addEnemy(enemyNode);

        return enemyNode;
    }

    /**
     * 查找距离最近的城墙
     * @param wPos 
     * @returns 
     */
    private _findNearestWall(wPos: Vec3): Node {
        let nearestWall: Node = null;
        let minDistance: number = Number.MAX_VALUE;

        for (const wall of manager.game.wallNodes) {
            if (wall && wall.isValid) {
                let wallPos = wall.worldPosition;
                let distance = Vec3.distance(wPos, wallPos);
                if (distance < minDistance) {
                    minDistance = distance;
                    nearestWall = wall;
                }
            }
        }

        return nearestWall;
    }

    killAllEnemy() {
        const damageData = {
            damage: 99999,
            damageSource: this.node,
            ignoreImmunity: true,
        }
        for (const enemy of this._enemies) {
            if (enemy && enemy.isValid) {
                let healthComponent = enemy.getComponent(HealthComponent);
                if (healthComponent && !healthComponent.isDead) {
                    healthComponent.takeDamage(damageData);
                }
            }
        }
    }

} 