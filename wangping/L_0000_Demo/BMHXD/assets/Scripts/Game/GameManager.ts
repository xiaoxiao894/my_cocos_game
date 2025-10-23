import { _decorator, Component, geometry, PhysicsSystem, Vec2, Vec3, Node, Prefab, NodePool, instantiate, Collider, ITriggerEvent, game, macro } from 'cc';
import { BuildingType, BuildUnlockState, CommonEvent, GameResult, PHY_GROUP } from '../common/CommonEnum';
import { Hero } from './Role/Hero';
import { UnlockItem } from './Building/UnlockItem';
import { Corn } from './Building/Corn';
import { SoupShop } from './Building/SoupShop';
import { Solder } from './Role/Solder';
import { ChuShi } from './Building/ChuShi';
import { CoinContainer } from './Building/CoinContainer';
import { KaoLu } from './Building/KaoLu';
import { DamageData } from '../common/CommonInterface';
import { GuideManager } from './GuideManager';
import { SuperPackage } from 'db://super-packager/Common/SuperPackage';
const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {
    /** 单例实例 */
    private static _instance: GameManager | null = null;
    /** 获取单例实例 */
    public static get instance(): GameManager {
        return this._instance as GameManager;
    }
    
    /** 初始化单例，提供更安全的初始化方式 */
    public static initInstance(instance: GameManager): void {
        if (this._instance) {
            instance.node.destroy();
            return;
        }
        this._instance = instance;
    }

    @property({
        type: Hero,
        displayName: '英雄'
    })
    public hero: Hero = null!;

    @property({
        type: Corn,
        displayName: '大玉米'
    })
    public bigCorn: Corn = null!;

    @property({
        type: KaoLu,
        displayName: '厨房'
    })
    public kaoLu: KaoLu = null!;

    @property({
        type: Node,
        displayName: '掉落层'
    })
    public dropLayer: Node = null!;

    @property({
        type: Node,
        displayName: '地图层'
    })
    public mapLayer: Node = null!;

    @property({
        type: SoupShop,
        displayName: '汤店'
    })
    public soupShop: SoupShop = null!;

    @property({
        type: Prefab,
        displayName: '士兵预制体'
    })
    public solderPrefab: Prefab = null!;

    @property({
        displayName: '最大士兵数量',
        tooltip: '场上保持的士兵数量'
    })
    public maxSolderCount: number = 10;

    @property({
        type: Node,
        displayName: '士兵初始点',
    })
    public solderInitPoint: Node = null!;

    @property({
        type: Collider,
        displayName: '家触发器',
    })
    public homeTrigger: Collider = null!;

    @property({
        type: CoinContainer,
        displayName: '金币容器',
    })
    public coinContainer: CoinContainer = null!;

    @property({
        type: Node,
        displayName: '初始Solders的父节点',
    })
    public initSolderParent: Node = null!;

    private _isGamePause: boolean = false;
    private _isGameStart: boolean = false;
    private _gameResult: GameResult = GameResult.None;
    /** 失败次数计数器 */
    private _failCount: number = 0;

    public get isGamePause(): boolean {
        return this._isGamePause;
    }

    public set isGamePause(value: boolean) {
        this._isGamePause = value;
    }

    public get isGameStart(): boolean {
        return this._isGameStart;
    }

    public set isGameStart(value: boolean) {
        if(this._isGameStart !== true && value === true) {
            console.log("游戏开始");
            if(!app.audio.getMusicSwitch()){
                app.audio.setMusicSwitch(true);
            }
            if(!app.audio.getEffectSwitch()){
                app.audio.setEffectSwitch(true);
            }
            app.audio.playMusic('resources/audio/休闲BGM');
        
            // 定期检查士兵数量，每1秒检查一次
            this.schedule(() => {
                this.maintainSolderCount();
            }, 0.2, macro.REPEAT_FOREVER, 0.5);

            this.scheduleOnce(() => {
                SuperPackage.Instance.DownloadTCE();
            }, 150);
        }
        this._isGameStart = value;
    }

    public get gameResult(): GameResult {
        return this._gameResult;
    }

    public set gameResult(value: GameResult) {
        this._gameResult = value;
        if(value === GameResult.Win){
            this.isGamePause = true;
            app.event.emit(CommonEvent.ShowWinUI);
        }else if(value === GameResult.Fail){
            this.isGamePause = true;
            app.event.emit(CommonEvent.ShowFailUI);
        }
    }

    public get failCount(): number {
        return this._failCount;
    }

    public onRetry(): void {
        // 如果是第二次失败，则直接跳转下载
        if (this._failCount >= 2) {
            console.log('第二次失败，跳转下载');
            this.onDownload();
            return;
        }

        this.gameResult = GameResult.None;
        this.isGamePause = false;

        this.hero.node.setWorldPosition(0,0,0);
        this.hero.healthComponent.restoreAllHealth();
        this.hero.reset();
    }

    private _unlockItemMap: Map<string, UnlockItem> = new Map();
    private _solderPool: NodePool = null!;
    /** 活跃的士兵节点列表 */
    private _activeSolders: Node[] = [];
    /** 是否正在生成士兵 */
    private _isSpawning: boolean = false;
    /** 在家中的士兵集合 */
    private _soldersAtHome: Set<string> = new Set();
    /** 英雄是否在家中 */
    private _heroAtHome: boolean = false;
    /** 英雄血量恢复定时器句柄 */
    private _heroHealTimer: any = null;
    /** 血量恢复速率（每秒） */
    private readonly HEAL_RATE_PER_SECOND: number = 60;

    public get unlockItemMap() {
        return this._unlockItemMap;
    }

    protected onLoad(): void {
        app.audio.setMusicSwitch(false)
        app.audio.setEffectSwitch(false)
        // 使用改进的单例初始化方法
        GameManager.initInstance(this);
        if (GameManager._instance !== this) return;
        
        // 注册事件监听
        this.registerEvents();

        this.initSolderPool();

        game.frameRate = 60;
    }

    protected start(): void {
    }

    protected onDestroy(): void {
        if (GameManager._instance === this) {
            GameManager._instance = null;
        }

        this.stopSpawningProcess();
        this.stopHeroHeal(); // 停止英雄血量恢复定时器
        this.unregisterEvents();
        this.clearAllSolders();
    }
    
    // 注册事件的独立方法
    private registerEvents(): void {
        app.event.on(CommonEvent.joystickInput, this.onJoystickInput, this);
        app.event.on(CommonEvent.GameWin, this.onGameWin, this);
        app.event.on(CommonEvent.GameFail, this.onGameFail, this);
        app.event.on(CommonEvent.HeroHurt, this.onHeroHurt, this);
        app.event.on(CommonEvent.UnlockItem, this.onUnlockItem, this);
        app.event.on(CommonEvent.CameraAniEnd, this.onCameraAniEnd, this);

        if (this.homeTrigger) {
            this.homeTrigger.on('onTriggerEnter', this.onHomeTriggerEnter, this);
            this.homeTrigger.on('onTriggerExit', this.onHomeTriggerExit, this);
        }
    }

    private onGameWin(): void {
        this.gameResult = GameResult.Win;
    }

    private onGameFail(): void {
        this._failCount++;
        console.log(`游戏失败，失败次数：${this._failCount}`);
        this.gameResult = GameResult.Fail;
    }

    private onHeroHurt(data: {damageData: DamageData}): void {
        if(this.unlockItemMap.get(BuildingType.BigShovel)?.UnlockState === BuildUnlockState.NoActive){
            app.event.emit(CommonEvent.SetUnlockStatue, {type: BuildingType.BigShovel, state: BuildUnlockState.Active});
        }
    }

    private onUnlockItem(type: BuildingType): void {
        if(type === BuildingType.BigShovel){
            if(this.unlockItemMap.get(BuildingType.TransLater)?.UnlockState === BuildUnlockState.NoActive){
                app.event.emit(CommonEvent.SetUnlockStatue, {type: BuildingType.TransLater, state: BuildUnlockState.Active});
            }
        }else if(type === BuildingType.TransLater){
            if(this.unlockItemMap.get(BuildingType.Salesclerk)?.UnlockState === BuildUnlockState.NoActive){
                app.event.emit(CommonEvent.SetUnlockStatue, {type: BuildingType.Salesclerk, state: BuildUnlockState.Active});
            }
        }else if(type === BuildingType.Salesclerk){
            if(this.unlockItemMap.get(BuildingType.FireGun)?.UnlockState === BuildUnlockState.NoActive){
                app.event.emit(CommonEvent.SetUnlockStatue, {type: BuildingType.FireGun, state: BuildUnlockState.Active});
            }
        }else if(type === BuildingType.FireGun){
            // if(this.unlockItemMap.get(BuildingType.WeaponUltimateUpgrade)?.UnlockState === BuildUnlockState.NoActive){
            //     app.event.emit(CommonEvent.SetUnlockStatue, {type: BuildingType.WeaponUltimateUpgrade, state: BuildUnlockState.Active});
            // }
            if(this.unlockItemMap.get(BuildingType.LandExpansion)?.UnlockState === BuildUnlockState.NoActive){
                app.event.emit(CommonEvent.SetUnlockStatue, {type: BuildingType.LandExpansion, state: BuildUnlockState.Active});
            }
        }

        if(type === BuildingType.LandExpansion || type === BuildingType.WeaponUltimateUpgrade){
            this.gameResult = GameResult.Win;
        }
    }

    private onCameraAniEnd(): void {
        this.isCameraAniEnd = true;

        GuideManager.instance.startGuide();
    }

    private isCameraAniEnd: boolean = false;
    private onJoystickInput(inputVector: Vec2): void {
        if(!this.isCameraAniEnd){
            return;
        }
        if(this.isGamePause){
            return;
        }
        if(!this.isGameStart){
            this.isGameStart = true;

            this.scheduleOnce(() => {
                manager.enemy.isCanSpawn = true;
            }, 3);
        }

        // this.isGameStart = true;
        // 将2D输入转换为3D移动方向，Y轴映射到Z轴
        const moveDirection = new Vec3(inputVector.x, 0, -inputVector.y);
        this.hero.move(moveDirection);
    }
    
    // 注销事件的独立方法
    private unregisterEvents(): void {
        app.event.offAllByTarget(this);
        
        // 清理家触发器事件
        if (this.homeTrigger) {
            this.homeTrigger.off('onTriggerEnter', this.onHomeTriggerEnter, this);
            this.homeTrigger.off('onTriggerExit', this.onHomeTriggerExit, this);
        }
    }

    /**
     * 初始化士兵对象池
     */
    private initSolderPool(): void {
        this._solderPool = new NodePool();

        // 预创建10个士兵对象放入对象池
        for (let i = 0; i < 10; i++) {
            const solder = instantiate(this.solderPrefab);
            this._solderPool.put(solder);
        }
        
    }

    InitSolders(): void {
        this.initSolderParent.children.forEach((child, index) => {
            const solder = child.getComponent(Solder);
            if(solder){
                solder.switchAIMode(true)
                solder.lookAt(manager.enemy.boss.node.getWorldPosition());
                this.scheduleOnce(() => {
                    solder.animationComponent.reset();
                    this.addActiveSolder(child);
                }, 0.1*index);
            }
        });
    }

    /**
     * 获取士兵对象
     * @returns 士兵节点
     */
    public getSolder(): Node {
        let solder = this._solderPool.get();
        if (solder) {
            // 从对象池获取
            solder.setParent(this.mapLayer);
            solder.active = true;
        } else {
            // 对象池为空，创建新的
            solder = instantiate(this.solderPrefab);
            solder.setParent(this.mapLayer);
            solder.active = true;
        }
        
        // 确保士兵组件正常工作
        const solderComponent = solder.getComponent(Solder);
        if (solderComponent) {
            // 士兵从对象池取出后可能需要重新初始化某些状态
            // reset方法已经在putSolder时调用，这里不需要再次调用
        }
        
        // 添加到活跃士兵列表
        this.addActiveSolder(solder);
        return solder;
    }

    /**
     * 回收士兵对象到对象池
     * @param solder 士兵节点
     */
    public putSolder(solder: Node): void {
        if (!solder || !solder.isValid) {
            return;
        }
        
        // 从活跃列表中移除
        this.removeActiveSolder(solder);
        
        // 从在家集合中移除
        this._soldersAtHome.delete(solder.uuid);
        
        // 重置士兵组件状态
        const solderComponent = solder.getComponent(Solder);
        if (solderComponent) {
            // 调用士兵的reset方法，全面重置状态
            solderComponent.reset();
        }
        
        // 重置节点状态
        solder.active = false;
        solder.setParent(null);
        
        // 放回对象池
        this._solderPool.put(solder);
        
        // 士兵死亡后检查是否需要补充
        this.scheduleOnce(() => {
            this.maintainSolderCount();
        }, 0.1);
    }

    /**
     * 添加活跃士兵
     * @param solder 士兵节点
     */
    private addActiveSolder(solder: Node): void {
        if (!this._activeSolders.includes(solder)) {
            this._activeSolders.push(solder);
        }
    }

    /**
     * 移除活跃士兵
     * @param solder 士兵节点
     */
    private removeActiveSolder(solder: Node): void {
        const index = this._activeSolders.indexOf(solder);
        if (index >= 0) {
            this._activeSolders.splice(index, 1);
        }
    }

    /**
     * 清空所有士兵
     */
    private clearAllSolders(): void {
        // 回收所有活跃的士兵
        const activeSolders = [...this._activeSolders];
        for (const solder of activeSolders) {
            this.putSolder(solder);
        }
        this._activeSolders = [];
        this._soldersAtHome.clear();
    }

    /**
     * 获取英雄是否在家中
     */
    public isHeroAtHome(): boolean {
        return this._heroAtHome;
    }

    /**
     * 获取范围内的士兵（排除在家中的士兵）
     * @param position 中心位置
     * @param searchRadius 搜索半径
     * @returns 范围内的士兵数组，按距离排序，不包含在家中的士兵
     */
    public getRangeSolder(position: Vec3, searchRadius: number): { node: Node; squaredDistance: number }[] {
        const rangeSolders: { node: Node; squaredDistance: number }[] = [];
        // 使用平方距离来优化性能，避免开平方根运算
        const rangeSquared = searchRadius * searchRadius;

        if(this.hero && this.hero.node.isValid && !this.hero.healthComponent.isDead){
            // 排除在家中的英雄
            if (!this._heroAtHome) {
                const squaredDistance = Vec3.squaredDistance(position, this.hero.node.getWorldPosition());
                if(squaredDistance <= rangeSquared){
                    rangeSolders.push({
                        node: this.hero.node,
                        squaredDistance: squaredDistance
                    });
                };
            }
        }
        
        for (const solder of this._activeSolders) {
            if (!solder || !solder.isValid || !solder.active || solder.getComponent(Solder)?.healthComponent.isDead || solder.getComponent(Solder)?.enableAutoHunt === false) {
                continue;
            }
            
            // 排除在家中的士兵
            if (this._soldersAtHome.has(solder.uuid)) {
                continue;
            }
            
            // 计算平方距离
            const solderPos = solder.getWorldPosition();
            const squaredDistance = Vec3.squaredDistance(position, solderPos);
            
            if (squaredDistance <= rangeSquared) {
                rangeSolders.push({
                    node: solder,
                    squaredDistance: squaredDistance
                });
            }
        }
        
        // 按平方距离排序，最近的在前面
        rangeSolders.sort((a, b) => a.squaredDistance - b.squaredDistance);
        
        return rangeSolders;
    }

    /**
     * 获取活跃士兵数量
     * @returns 活跃士兵数量
     */
    public getActiveSolderCount(): number {
        return this._activeSolders.length;
    }

    /**
     * 获取所有活跃士兵
     * @returns 活跃士兵节点数组
     */
    public getAllActiveSolders(): Node[] {
        return [...this._activeSolders];
    }

    // ================================
    // 士兵生成管理系统
    // ================================
    
    /**
     * 维持场上士兵数量
     * 确保场上始终有指定数量的士兵
     */
    public maintainSolderCount(): void {
        if (this.isGamePause) {
            return;
        }

        const currentCount = this.getActiveSolderCount();
        const needToSpawn = this.maxSolderCount - currentCount;

        if (needToSpawn > 0 && !this._isSpawning && manager.game.soupShop.waitLength < 4) {
            console.log(`士兵补充: 当前${currentCount}个, 需要补充${needToSpawn}个`);
            this.startSpawningProcess();
        }
    }

    /**
     * 开始生成士兵流程
     * 每秒生成一个士兵直到达到目标数量
     */
    private startSpawningProcess(): void {
        if (this._isSpawning) {
            return;
        }

        this._isSpawning = true;
        
        // 立即生成第一个士兵
        if (this.canSpawnSolder()) {
            this.spawnSolder();
        }
        
        // 如果还需要更多士兵，启动定时器
        if (this.getActiveSolderCount() < this.maxSolderCount) {
            this.schedule(this.spawnSolderTick, 1.0);
        } else {
            this._isSpawning = false;
        }
    }

    /**
     * 生成士兵定时器回调
     */
    private spawnSolderTick = (): void => {
        if (!this.canSpawnSolder() || manager.game.soupShop.waitLength >= 4) {
            this.stopSpawningProcess();
            return;
        }
        
        this.spawnSolder();
        
        // 检查是否达到目标数量
        if (this.getActiveSolderCount() >= this.maxSolderCount) {
            this.stopSpawningProcess();
        }
    }

    /**
     * 停止生成士兵流程
     */
    private stopSpawningProcess(): void {
        if (!this._isSpawning) {
            return;
        }
        
        this._isSpawning = false;
        this.unschedule(this.spawnSolderTick);
        // console.log(`士兵生成完成: 当前数量${this.getActiveSolderCount()}`);
    }

    /**
     * 检查是否可以生成士兵
     */
    private canSpawnSolder(): boolean {
        return !this.isGamePause && 
               this.getActiveSolderCount() < this.maxSolderCount &&
               !!this.solderInitPoint;
    }

    /**
     * 生成一个士兵
     */
    private spawnSolder(): void {
        if (!this.canSpawnSolder()) {
            return;
        }

        const solder = this.getSolder();
        this.positionNewSolder(solder);
    }

    /**
     * 设置新士兵的位置
     */
    private positionNewSolder(solder: Node): void {
        const initPos = this.solderInitPoint.getWorldPosition();
        // const spawnPos = this.calculateSpawnPosition(initPos);
        solder.setWorldPosition(initPos);
    }

    /**
     * 计算生成位置
     */
    private calculateSpawnPosition(centerPos: Vec3): Vec3 {
        const randomAngle = Math.random() * Math.PI * 2;
        const randomDistance = 2 + Math.random() * 3; // 距离中心2-5米
        
        const spawnPos = new Vec3(
            centerPos.x + Math.cos(randomAngle) * randomDistance,
            centerPos.y,
            centerPos.z + Math.sin(randomAngle) * randomDistance
        );
        
        // 计算正确的地面高度
        spawnPos.y = this.calculateGroundHeight(spawnPos);
        return spawnPos;
    }

    /**
     * 使用射线检测计算地面高度
     * @param position 当前位置
     * @returns 计算后的地面高度
     */
    public calculateGroundHeight(position: Vec3): number {
        // 创建从上方向下的射线进行地面检测
        const ray = new geometry.Ray();
        const rayOrigin = new Vec3(position.x, position.y + 20, position.z); // 从高处向下射线
        const rayDir = new Vec3(0, -1, 0); // 向下的方向
        ray.o = rayOrigin;
        ray.d = rayDir;
        
        let groundHeight = -100; // 默认地面高度
        
        // 执行射线检测
        if (PhysicsSystem.instance.raycast(ray)) {
            const raycastResults = PhysicsSystem.instance.raycastResults;
            // 如果检测到碰撞，使用碰撞点的高度
            if (raycastResults.length > 0) {
                for (const result of raycastResults) {
                    // const result = raycastResults[0];
                    const collider = result.collider;
                    if (collider.getGroup() == PHY_GROUP.GROUND) {
                        let h = result.hitPoint.y; // 加上一个小偏移防止穿透
                        if(h > groundHeight){
                            groundHeight = h;
                        }
                    }
                }
            }
        }
        
        return groundHeight > -100 ? groundHeight : 0;
    }

    // ================================
    // 公共接口方法
    // ================================

    /**
     * 立即生成指定数量的士兵（跳过逐个生成机制）
     * @param count 要生成的士兵数量
     */
    public spawnSoldersImmediate(count: number): void {
        if (count <= 0) return;
        
        console.log(`立即生成${count}个士兵`);
        for (let i = 0; i < count && this.getActiveSolderCount() < this.maxSolderCount; i++) {
            this.spawnSolder();
        }
    }

    /**
     * 强制完成生成流程
     * 停止当前的逐个生成，立即补充到目标数量
     */
    public forceCompleteSpawning(): void {
        this.stopSpawningProcess();
        const currentCount = this.getActiveSolderCount();
        const needToSpawn = this.maxSolderCount - currentCount;
        
        if (needToSpawn > 0) {
            this.spawnSoldersImmediate(needToSpawn);
        }
    }

    /**
     * 重置生成系统
     * 停止所有生成流程并清空士兵
     */
    public resetSpawningSystem(): void {
        this.stopSpawningProcess();
        this.clearAllSolders();
    }

    /**
     * 获取生成系统状态
     */
    public getSpawningStatus(): {
        isSpawning: boolean;
        currentCount: number;
        maxCount: number;
        needToSpawn: number;
    } {
        const currentCount = this.getActiveSolderCount();
        return {
            isSpawning: this._isSpawning,
            currentCount: currentCount,
            maxCount: this.maxSolderCount,
            needToSpawn: Math.max(0, this.maxSolderCount - currentCount)
        };
    }


    /**
     * 士兵进入家触发器
     */
    private onHomeTriggerEnter(event: ITriggerEvent): void {
        const node = event.otherCollider.node;
        
        // 检查是否是英雄
        if (this.hero && node === this.hero.node && !this._heroAtHome) {
            this._heroAtHome = true;
            // console.log(`英雄进入家中`);
            // 启动血量恢复
            this.startHeroHeal();
            app.event.emit(CommonEvent.HeroAtHome);
            return;
        }
        
        // 检查是否是士兵
        const solder = node.getComponent(Solder);
        if (solder && this._activeSolders.includes(node)) {
            this._soldersAtHome.add(node.uuid);
            // console.log(`士兵 ${node.uuid} 进入家中, 在家士兵数: ${this._soldersAtHome.size}`);
        }
    }

    /**
     * 士兵离开家触发器
     */
    private onHomeTriggerExit(event: ITriggerEvent): void {
        const node = event.otherCollider.node;
        
        // 检查是否是英雄
        if (this.hero && node === this.hero.node) {
            this._heroAtHome = false;
            // console.log(`英雄离开家中`);
            // 停止血量恢复
            this.stopHeroHeal();
            return;
        }
        
        // 检查是否是士兵
        if (this._soldersAtHome.has(node.uuid)) {
            this._soldersAtHome.delete(node.uuid);
            // console.log(`士兵 ${node.uuid} 离开家中, 在家士兵数: ${this._soldersAtHome.size}`);
        }
    }

    /**
     * 获取在家中的士兵数量
     * @returns 在家中的士兵数量
     */
    public getSoldersAtHomeCount(): number {
        return this._soldersAtHome.size;
    }

    /**
     * 获取在家中的士兵节点列表
     * @returns 在家中的士兵节点数组
     */
    public getSoldersAtHome(): Node[] {
        const soldersAtHome: Node[] = [];
        for (const solder of this._activeSolders) {
            if (solder && solder.isValid && this._soldersAtHome.has(solder.uuid)) {
                soldersAtHome.push(solder);
            }
        }
        return soldersAtHome;
    }

    /**
     * 检查士兵是否在家中
     * @param solder 士兵节点
     * @returns 是否在家中
     */
    public isCanHunted(node: Node): boolean {
        if(this.hero && this.hero.node === node){
            return !this._heroAtHome;
        }

        if(node.getComponent(Solder)){
            return !this._soldersAtHome.has(node.uuid);
        }

        return true;
    }

    public calculateSolderCount(origin: Vec3, target: Vec3, attackMask: PHY_GROUP[]): Vec3 | null {
        // 创建射线计算攻击位置
        const ray = new geometry.Ray();
        const rayOrigin = origin;
        const targetPos = target;
        
        // 计算射线方向（从Boss到目标）
        const direction = Vec3.subtract(new Vec3(), targetPos, rayOrigin);
        direction.normalize();
        
        // 设置射线起点和方向
        ray.o.set(rayOrigin);
        ray.d.set(direction);
        
        // 执行射线检测
        const mask = attackMask.reduce((acc, curr) => acc | curr, 0);
        const maxDistance = Vec3.distance(rayOrigin, targetPos);  // 设置最大检测距离为目标距离
        const queryTrigger = false;  // 不检测触发器
        
        const hasHit = PhysicsSystem.instance.raycast(ray, mask, maxDistance, queryTrigger);
        if (hasHit) {
            const raycastResults = PhysicsSystem.instance.raycastResults;
            for (const result of raycastResults) {
                const collider = result.collider;
                // console.log('collider.getGroup()', collider.getGroup());
                if (attackMask.includes(collider.getGroup())) {
                    // console.log('射线碰撞到:', result.collider.node.name);
                    const pos = result.hitPoint;
                    return pos;
                    break;
                }
            }
        }
        return null;
    }

    public onDownload(): void {
        SuperPackage.Instance.Download();
    }

    /**
     * 启动英雄血量恢复
     */
    private startHeroHeal(): void {
        // 如果已经有定时器在运行，先停止
        this.stopHeroHeal();
        
        // 启动新的血量恢复定时器，每秒执行一次
        this._heroHealTimer = this.schedule(() => {
            this.healHero();
        }, 1.0);
        
        // console.log('英雄血量恢复开始：每秒恢复10点血量');
    }

    /**
     * 停止英雄血量恢复
     */
    private stopHeroHeal(): void {
        if (this._heroHealTimer) {
            this.unschedule(this._heroHealTimer);
            this._heroHealTimer = null;
            console.log('英雄血量恢复停止');
        }
    }

    /**
     * 执行英雄血量恢复
     */
    private healHero(): void {
        // 检查英雄是否存在且仍在家中
        if (!this.hero || !this.hero.node.isValid || !this._heroAtHome) {
            this.stopHeroHeal();
            return;
        }

        // 检查英雄是否死亡
        if (this.hero.healthComponent.isDead) {
            this.stopHeroHeal();
            return;
        }

        // 如果已满血则不需要恢复
        if (this.hero.healthComponent.healthPercentage >= 1.0) {
            return;
        }

        // 恢复血量
        this.hero.healthComponent.heal(this.HEAL_RATE_PER_SECOND);
        // console.log(`英雄恢复${this.HEAL_RATE_PER_SECOND}点血量，当前血量：${this.hero.healthComponent.health}，血量百分比：${Math.round(this.hero.healthComponent.healthPercentage * 100)}%`);
    }
}


