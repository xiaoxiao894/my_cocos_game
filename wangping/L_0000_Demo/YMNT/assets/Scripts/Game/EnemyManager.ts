import { _decorator, Component, Node, director, Vec3 } from 'cc';
import { EnemyBoss } from './Role/EnemyBoss';
import { HealthComponent } from './Components/HealthComponent';
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

    @property({type: EnemyBoss, displayName: 'Boss'})
    public boss: EnemyBoss = null!;

    /** 所有敌人节点列表 */
    private _enemies: Node[] = [];

    onLoad() {
        // 单例检查
        if (EnemyManager._instance) {
            this.node.destroy();
            return;
        }
        EnemyManager._instance = this;
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
    }

    /**
     * 获取范围内的敌人
     * @param position 中心位置
     * @param range 范围半径
     * @returns 范围内的敌人组件数组
     */
    public getRangeEnemies(position: Vec3, range: number): {node: Node, squaredDistance: number}[] {
        const rangeEnemies: {node: Node, squaredDistance: number}[] = [];
        // 使用平方距离来优化性能，避免开平方根运算
        const rangeSquared = range * range;

        // 计算boss的距离
        if(this.boss && this.boss.node.isValid && !this.boss.healthComponent.isDead){
            const bossPos = this.boss.node.getWorldPosition();
            const bossSquaredDistance = Vec3.squaredDistance(position, bossPos);
            if (bossSquaredDistance <= rangeSquared) {
                rangeEnemies.push({
                    node: this.boss.node,
                    squaredDistance: bossSquaredDistance
                });
            }
        }
        
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
} 