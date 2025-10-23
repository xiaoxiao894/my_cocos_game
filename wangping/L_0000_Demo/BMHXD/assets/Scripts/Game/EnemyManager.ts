import { _decorator, Component, Node, director, Vec3, Prefab, instantiate, NodePool, tween, geometry, PhysicsSystem, easing, v3, ParticleSystem } from 'cc';
import { EnemyBoss } from './Role/EnemyBoss';
import { HealthComponent } from './Components/HealthComponent';
import { BuildingType, CommonEvent, PHY_GROUP } from '../common/CommonEnum';
import { Enemy } from './Role/Enemy';
import { SpiderEgg } from './Role/SpiderEgg';
import { AutoHuntState } from './AI/AutoHuntAIComponent';
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

    @property({type: Node, displayName: 'Boss原位'})
    public bossOriginalPos: Node = null!;

    @property({type: Prefab, displayName: 'Enemy预制体'})
    private enemyPrefab: Prefab = null!;

    @property({displayName: 'Boss死亡后Enemy数量'})
    private maxEnemyCount: number = 8;

    @property({type :Node, displayName: '敌人生成位置'})
    public enemySpawnPos: Node = null!;

    @property({displayName: 'Enemy生成范围'})
    private spawnRange: number = 12;

    @property({type: SpiderEgg, displayName: 'SpiderEgg列表'})
    private spiderEggList: SpiderEgg[] = [];

    @property({type :Node, displayName: '外边'})
    public outPos: Node = null!;

    @property({type: Node, displayName: 'boss技能特效'})
    public bossSkillEff: Node = null!;

    /** 所有敌人节点列表 */
    private _enemies: Node[] = [];

    /** Enemy对象池 */
    private _enemyPool: NodePool = new NodePool();

    private isKeepEnemyNum:boolean = true;

    /** 是否正在生成敌人（防止重复生成） */
    private _isSpawning: boolean = false;

    /** 正在生成中的敌人数量（包括动画播放中的） */
    private _spawningCount: number = 0;

    private _isCanSpawn:boolean = false;

    public set isCanSpawn(isCanSpawn: boolean){
        this._isCanSpawn = isCanSpawn;
    }

    onLoad() {
        // 单例检查
        if (EnemyManager._instance) {
            this.node.destroy();
            return;
        }
        EnemyManager._instance = this;

        this.registerEvents();
        this.initEnemyPool();
        // 立即生成第一波敌人
        this.schedule(()=>{
            this.spawnEnemyFromRandomSpiderEgg();
        }, 0, 2, 0)

        this.scheduleOnce(()=>{
            this.boss.castSkill(true);
        }, 0.3);

        manager.game.InitSolders();
    }

    protected onDestroy(): void {
        if (EnemyManager._instance === this) {
            EnemyManager._instance = null;
        }
        
        this._enemies = [];
        this.clearEnemyPool();
        this.unregisterEvents();
    }

    /**
     * 初始化Enemy对象池
     */
    private initEnemyPool(): void {
        if (!this.enemyPrefab) {
            console.warn('Enemy预制体未设置，无法初始化对象池');
            return;
        }

        // 预先创建一些Enemy节点到对象池
        for (let i = 0; i < 5; i++) {
            const enemyNode = instantiate(this.enemyPrefab);
            enemyNode.active = false;
            this._enemyPool.put(enemyNode);
        }
        
        console.log('Enemy对象池初始化完成');
    }

    /**
     * 清理Enemy对象池
     */
    private clearEnemyPool(): void {
        this._enemyPool.clear();
    }

    /**
     * 从对象池获取Enemy节点
     */
    private getEnemyFromPool(): Node | null {
        let enemyNode: Node | null = null;
        
        if (this._enemyPool.size() > 0) {
            enemyNode = this._enemyPool.get();
        } else if (this.enemyPrefab) {
            enemyNode = instantiate(this.enemyPrefab);
            console.log('Enemy对象池已空，动态创建新Enemy');
        }
        
        if (enemyNode) {
            enemyNode.active = true;
            // 重置Enemy状态
            const enemy = enemyNode.getComponent(Enemy);
            if (enemy) {
                enemy.reset();
            }
        }
        
        return enemyNode;
    }

    /**
     * 回收Enemy节点到对象池
     */
    private putEnemyToPool(enemyNode: Node): void {
        if (!enemyNode || !enemyNode.isValid) {
            return;
        }

        // 停用节点
        enemyNode.active = false;
        enemyNode.removeFromParent();
        
        // 放回对象池
        this._enemyPool.put(enemyNode);
    }

    private registerEvents(): void {
        app.event.on(CommonEvent.BossDead, this.onBossDead, this);
        app.event.on(CommonEvent.EnemyDead, this.onEnemyDead, this);
        app.event.on(CommonEvent.SpiderEggDead, this.onSpiderEggDead, this);
        app.event.on(CommonEvent.UnlockItem, this.onUnlockItem, this);
        app.event.on(CommonEvent.CameraAniEnd, this.onCameraAniEnd, this);
    }

    private unregisterEvents(): void {
        app.event.offAllByTarget(this);
    }

    private onBossDead(node: Node): void {
        console.log('Boss已死亡');
        // 现在从游戏开始就管理敌人数量，所以Boss死后不需要额外操作
        // 如果需要Boss死后增加敌人数量，可以在这里调用 spawnEnemyArmy()
        
        // 检查胜利条件
        this.scheduleOnce(() => {
            this.checkGameOver();
        }, 0.1); // 延迟一点检查，确保状态更新完成
    }

    /**
     * Enemy死亡回调
     */
    private onEnemyDead(enemyNode: Node): void {
        // 从列表中移除
        this.removeEnemy(enemyNode);
        
        // 回收到对象池
        this.putEnemyToPool(enemyNode);
        
        // 检查胜利条件
        this.scheduleOnce(() => {
            this.checkGameOver();
        }, 0.1); // 延迟一点检查，确保状态更新完成
    }

    private onCameraAniEnd(): void {
        console.log('Boss回到后方');
        this.scheduleOnce(() => {
            const pos = this.bossOriginalPos.getWorldPosition();
            this.boss.autoHuntAIComponent.setInitialPosition(pos);
            this.boss.autoHuntAIComponent.forceChangeState(AutoHuntState.Idle);
            this.boss.autoHuntAIComponent.setPatrolEnabled(true);
        }, 0.1); // 延迟一点检查，确保状态更新完成
    }

    private onUnlockItem(item: BuildingType): void {
        if(item === BuildingType.FireGun){
            // this.isKeepEnemyNum = false;
        }
    }

    /**
     * 蜘蛛卵死亡回调
     */
    private onSpiderEggDead(spiderEggNode: Node): void {
        console.log('蜘蛛卵死亡，检查胜利条件');
        // 检查胜利条件
        this.scheduleOnce(() => {
            this.checkGameOver();
        }, 0.1); // 延迟一点检查，确保状态更新完成
    }

    /**
     * 生成Enemy（用于重新生成）
     */
    private spawnEnemy(startPos: Vec3): void {
        if (this._enemies.length >= this.maxEnemyCount) {
            return;
        }

        const enemyNode = this.getEnemyFromPool();
        if (!enemyNode) {
            console.warn('无法从对象池获取Enemy节点');
            return;
        }

        const targetPos = this.generateSafeSpawnPosition(this.enemySpawnPos.getWorldPosition());

        // 设置Enemy节点父级
        enemyNode.setParent(this.node);
        enemyNode.setScale(0.1, 0.1, 0.1);

        // 在目标位置上方生成
        enemyNode.setWorldPosition(startPos);

        // 使用下落动画
        // 下落动画完成后，添加到管理列表
        this.addEnemy(enemyNode);

        const randomScale = Math.random() * 0.7 + 0.8;
        

        tween(enemyNode)
        .to(0.5, { scale: v3(randomScale, randomScale, randomScale) }, { easing: easing.backOut })
        .call(()=>{
            // 激活Enemy的AI
            const enemy = enemyNode.getComponent(Enemy);
            if (enemy) {
                enemy.onSpawnComplete(targetPos);
            }
        }).start();
        
    }

    /**
     * 生成安全的生成位置（避开家触发器范围）
     */
    private generateSafeSpawnPosition(startPos: Vec3): Vec3 {
        const maxAttempts = 20; // 最大重试次数，避免无限循环
        let attempts = 0;
        
        while (attempts < maxAttempts) {
            attempts++;
            
            // 随机目标位置（在范围内）
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * this.spawnRange + 2; // 2到spawnRange+2的距离
            const candidatePos = new Vec3(
                startPos.x + Math.cos(angle) * distance,
                startPos.y,
                startPos.z + Math.sin(angle) * distance
            );

            // 检测该位置是否安全（不在家触发器范围内）
            if (this.isPositionSafeFromHome(candidatePos)) {
                // console.log(`Enemy安全位置生成成功，尝试次数: ${attempts}`);
                return candidatePos;
            }
        }
        
        // 如果超过最大尝试次数，返回一个远离原点的位置作为后备方案
        console.warn(`Enemy安全位置生成失败，使用后备位置，总尝试次数: ${attempts}`);
        const backupAngle = Math.random() * Math.PI * 2;
        const backupDistance = this.spawnRange + 5; // 更远的距离作为后备
        return new Vec3(
            startPos.x + Math.cos(backupAngle) * backupDistance,
            startPos.y,
            startPos.z + Math.sin(backupAngle) * backupDistance
        );
    }

    /**
     * 检测位置是否安全（不在家触发器范围内）
     */
    public isPositionSafeFromHome(position: Vec3): boolean {
        // 创建从上方向下的射线进行检测
        const ray = new geometry.Ray();
        const rayOrigin = new Vec3(position.x, position.y + 20, position.z); // 从高处向下射线
        const rayDir = new Vec3(0, -1, 0); // 向下的方向
        ray.o = rayOrigin;
        ray.d = rayDir;
        
        // 执行射线检测，检测HOME组
        const maxDistance = 30; // 最大检测距离
        const queryTrigger = true; // 检测触发器
        
        const hasHit = PhysicsSystem.instance.raycast(ray, PHY_GROUP.HOME, maxDistance, queryTrigger);
        if (hasHit) {
            const raycastResults = PhysicsSystem.instance.raycastResults;
            for (const result of raycastResults) {
                const collider = result.collider;
                if (collider.getGroup() === PHY_GROUP.HOME) {
                    // console.log(`检测到家触发器，位置不安全: ${position}`);
                    return false; // 检测到家触发器，位置不安全
                }
            }
        }
        
        return true; // 位置安全
    }

    /**
     * 创建抛物线运动动画
     */
    private createParabolicMotion(enemyNode: Node, startPos: Vec3, endPos: Vec3, callback: () => void): void {
        const duration = 0.8 + Math.random() * 0.4; // 0.8-1.2秒的随机duration
        const height = 3 + Math.random() * 2; // 3-5的随机高度
        
        // 使用tween实现抛物线动画
        const progressObj = { progress: 0 };
        
        tween(progressObj)
            .to(duration, { progress: 1 }, {
                onUpdate: () => {
                    const ratio = progressObj.progress;
                    
                    // 线性插值计算当前X和Z位置
                    const currentX = startPos.x + (endPos.x - startPos.x) * ratio;
                    const currentZ = startPos.z + (endPos.z - startPos.z) * ratio;
                    
                    // 计算Y位置（抛物线轨迹）
                    const heightOffset = 4 * height * ratio * (1 - ratio);
                    const currentY = startPos.y + (endPos.y - startPos.y) * ratio + heightOffset;
                    
                    // 设置节点位置
                    enemyNode.setWorldPosition(new Vec3(currentX, currentY, currentZ));
                }
            })
            .call(() => {
                callback();
            })
            .start();
    }

    /**
     * 创建下落运动动画
     */
    private createDropMotion(enemyNode: Node, startPos: Vec3, endPos: Vec3, callback: () => void): void {
        const duration = 0.5 + Math.random() * 0.3; // 0.5-0.8秒的随机duration
        
        // 使用tween实现简单的下落动画
        tween(enemyNode)
            .to(duration, { 
                worldPosition: endPos 
            }, {
                easing: easing.sineIn // 使用弹跳缓动，模拟落地效果
            })
            .call(() => {
                callback();
            })
            .start();
    }

    /**
     * 添加敌人到管理器
     * @param enemy 敌人节点
     */
    public addEnemy(enemy: Node): void {
        if (!this._enemies.includes(enemy)) {
            this._enemies.push(enemy);
            // console.log(`添加Enemy到管理器，当前数量: ${this._enemies.length}`);
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
            // console.log(`从管理器移除Enemy，当前数量: ${this._enemies.length}`);
        }
    }

    /**
     * 获取范围内的敌人（包括Boss、普通敌人和蜘蛛卵）
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
        
        // 计算普通敌人的距离
        for (const enemy of this._enemies) {
            if (!enemy || !enemy.isValid || enemy.getComponent(HealthComponent)?.isDead) {
                continue;
            }
            
            // 计算平方距离
            const enemyPos = enemy.getWorldPosition();
            const squaredDistance = Vec3.squaredDistance(position, enemyPos);
            
            if (squaredDistance <= rangeSquared) {
                rangeEnemies.push({
                    node: enemy,
                    squaredDistance: squaredDistance
                });
            }
        }
        
        // 计算蜘蛛卵的距离
        for (const spiderEgg of this.spiderEggList) {
            if (!spiderEgg || !spiderEgg.node.isValid || !spiderEgg.node.active || spiderEgg.healthComponent?.isDead) {
                continue;
            }
            
            // 计算平方距离
            const spiderEggPos = spiderEgg.node.getWorldPosition();
            const squaredDistance = Vec3.squaredDistance(position, spiderEggPos);
            
            if (squaredDistance <= rangeSquared) {
                rangeEnemies.push({
                    node: spiderEgg.node,
                    squaredDistance: squaredDistance
                });
            }
        }
        
        // 按平方距离排序，最近的在前面
        rangeEnemies.sort((a, b) => a.squaredDistance - b.squaredDistance);
        
        return rangeEnemies;
    }

    protected update(dt: number): void {
        // 检查是否需要生成敌人来维持数量
        if (this.isKeepEnemyNum && manager.game.isGameStart && !this._isSpawning && this._isCanSpawn) {
            const currentTotalCount = this._enemies.length + this._spawningCount;
            const missingEnemyCount = this.maxEnemyCount - currentTotalCount;
            if (missingEnemyCount > 0) {
                this.spawnMissingEnemies(missingEnemyCount);
            }
        }
    }

    /**
     * 通过随机蜘蛛卵生成敌人
     */
    private spawnEnemyFromRandomSpiderEgg(): void {
        const activeSpiderEggs = this.getActiveSpiderEggs();
        if(activeSpiderEggs.length === 0){ return; }
        const spiderEgg = activeSpiderEggs[Math.floor(Math.random() * activeSpiderEggs.length)];
        if(spiderEgg){
            // 立即增加生成计数，防止重复触发
            this._spawningCount++;
            spiderEgg.playSpawnSpiderAni(()=>{
                this.spawnEnemy(spiderEgg.node.getWorldPosition());
                // 生成完成后减少计数
                this._spawningCount--;
            });
        }
    }

    /**
     * 批量生成缺失的敌人来维持数量
     */
    private spawnMissingEnemies(missingCount: number): void {
        if (missingCount <= 0 || this._isSpawning) {
            return;
        }

        this._isSpawning = true;
        
        // 立即生成第一个敌人
        this.spawnEnemyFromRandomSpiderEgg();
        
        // 如果需要生成多个，使用定时器间隔生成
        if (missingCount > 1) {
            let spawnedCount = 1;
            const spawnTimer = setInterval(() => {
                if (spawnedCount < missingCount) {
                    this.spawnEnemyFromRandomSpiderEgg();
                    spawnedCount++;
                } else {
                    clearInterval(spawnTimer);
                    this._isSpawning = false;
                }
            }, 300); // 每1秒生成一个
        } else {
            this._isSpawning = false;
        }
    }

    private checkGameOver(): void {
        // 检查所有敌人是否都死了
        const allEnemiesDead = this._enemies.length === 0;
        
        // 检查Boss是否死了
        const bossDead = this.boss && this.boss.healthComponent && this.boss.healthComponent.isDead;
        
        // 检查所有蜘蛛卵是否都死了
        const allSpiderEggsDead = this.spiderEggList.every(spiderEgg => 
            spiderEgg && spiderEgg.healthComponent && spiderEgg.healthComponent.isDead
        );
        
        // 只有当敌人、Boss和蜘蛛卵都死了才胜利
        if (allEnemiesDead && bossDead && allSpiderEggsDead) {
            console.log('胜利条件满足：敌人、Boss和蜘蛛卵都已死亡');
            // 停止敌人生成，防止新敌人出现
            this.isKeepEnemyNum = false;
            this._isSpawning = false;
            app.event.emit(CommonEvent.GameWin);
        }
    }

    /**
     * 获取所有活跃的蜘蛛卵
     */
    public getActiveSpiderEggs(): SpiderEgg[] {
        return this.spiderEggList.filter(egg => egg.node.active);
    }

    public ShowBossSkillEff(wpos: Vec3){
        this.bossSkillEff.setWorldPosition(wpos);
        const particles = this.bossSkillEff.getComponentsInChildren(ParticleSystem);
        particles.forEach(particle => {
            particle.play();
        });
    }
} 