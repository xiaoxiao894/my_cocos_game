import { _decorator, Component, geometry, PhysicsSystem, Vec2, Vec3, Node, Prefab, NodePool, instantiate, Collider, ITriggerEvent, game, tween } from 'cc';
import { PrintComponent } from 'db://playable_packager/PrintComponent';
import { BuildingType, BuildUnlockState, CommonEvent, GameResult, ObjectType, PHY_GROUP } from '../common/CommonEnum';
import { UnlockItem } from './Building/UnlockItem';
import { SuperPackage } from 'db://playable_packager/SuperPackage';
import { Character } from './Role/Character';
import { Hero_Girl } from './Role/Hero_girl';
import { CoinContainer } from './Building/CoinContainer';
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
        type: Hero_Girl,
        displayName: '英雄'
    })
    public hero: Hero_Girl = null!;

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
        type: CoinContainer,
        displayName: '掉落点'
    })
    public coinContainer: CoinContainer = null!;

    @property({
        type: Node,
        displayName: '基地大门'
    })
    public doorNode: Node = null!;

    @property({
        type: [Node],
        displayName: '基地城墙'
    })
    public wallNodes: Node[] = [];

    @property({
        type: Node,
        displayName: '首个引导节点'
    })
    public firstGuideNode: Node = null!;

    @property({ type: Node, displayName: '最终摄像头位置节点' })
    public endCameraPos: Node = null!;

    @property({ type: Node, displayName: '最终显示节点' })
    public lastShowNode: Node = null!;

    @property({ type: Node, displayName: '最终隐藏节点' })
    public lastHideNode: Node = null!;

    @property({ type: Node, displayName: '最终隐藏节点2' })
    public lastHideNode2: Node = null!;

    private _isGamePause: boolean = false;
    private _isGameStart: boolean = false;
    private _gameResult: GameResult = GameResult.None;

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
        if (this._isGameStart !== true && value === true) {
            console.log("游戏开始");
            if (!app.audio.getMusicSwitch()) {
                app.audio.setMusicSwitch(true);
            }
            if (!app.audio.getEffectSwitch()) {
                app.audio.setEffectSwitch(true);
            }
            app.audio.playMusic('resources/MQBY/休闲BGM');
        }
        this._isGameStart = value;
    }

    public get gameResult(): GameResult {
        return this._gameResult;
    }

    public set gameResult(value: GameResult) {
        this._gameResult = value;
        if (value === GameResult.Win) {
            this.isGamePause = true;
            app.event.emit(CommonEvent.ShowWinUI);
        } else if (value === GameResult.Fail) {
            this.isGamePause = true;
            app.event.emit(CommonEvent.ShowFailUI);
        }
    }

    private _unlockItemMap: Map<string, UnlockItem> = new Map();

    /** 英雄是否在家中 */
    private _heroAtHome: boolean = false;
    /** 英雄血量恢复定时器句柄 */
    private _heroHealTimer: any = null;
    /** 血量恢复速率（每秒） */
    private readonly HEAL_RATE_PER_SECOND: number = 10;

    public get unlockItemMap() {
        return this._unlockItemMap;
    }

    protected onLoad(): void {
        PrintComponent.init();
        PrintComponent.loading();
        app.audio.setMusicSwitch(false)
        app.audio.setEffectSwitch(false)
        // 使用改进的单例初始化方法
        GameManager.initInstance(this);
        if (GameManager._instance !== this) return;

        // 注册事件监听
        this.registerEvents();
        game.frameRate = 60;

        this._hideLastArea();
    }

    _showLastArea() {
        this.lastShowNode.active = true;
        this.lastHideNode.active = false;
        this.lastHideNode2.active = false;

        // 顺序缩放lastShowNode节点下，所有名字中不包含wall 和 ground 的子节点
        let children = this.lastShowNode.children;
        for (let i = 0; i < children.length; i++) {
            let child = children[i];
            if (child.name.indexOf('wall') === -1 && child.name.indexOf('ground') === -1 && child.name.indexOf('jiazi') === -1) {
                child.scale = Vec3.ZERO;
                let delayTime = Math.min(1, i * 0.1);
                tween(child)
                    .delay(delayTime)
                    .to(0.2, { scale: Vec3.ONE })
                    .start();
            }
        }
    }

    _hideLastArea() {
        this.lastShowNode.active = false;
        this.lastHideNode.active = true;
        this.lastHideNode2.active = true;
    }

    protected start(): void {
    }

    protected onDestroy(): void {
        if (GameManager._instance === this) {
            GameManager._instance = null;
        }

        this.stopHeroHeal(); // 停止英雄血量恢复定时器
        this.unregisterEvents();
    }

    // 注册事件的独立方法
    private registerEvents(): void {
        app.event.on(CommonEvent.joystickInput, this.onJoystickInput, this);
        app.event.on(CommonEvent.GameWin, this.onGameWin, this);
        app.event.on(CommonEvent.GameFail, this.onGameFail, this);
        app.event.on(CommonEvent.HeroHurt, this.onHeroHurt, this);
        app.event.on(CommonEvent.UnlockItem, this.onUnlockItem, this);
    }

    private onGameWin(): void {
        this.gameResult = GameResult.Win;
    }

    private onGameFail(): void {
        this.gameResult = GameResult.Fail;
    }

    private onHeroHurt(): void {
    }

    private _unlockArray: BuildingType[] = [
        BuildingType.SwabTransLater,
        BuildingType.SwabTransporter,
        BuildingType.ExplosionFruitDefenseTower,
        BuildingType.ExplosionFruitStack,
        BuildingType.ExplosionFruitTransLater,
        BuildingType.ExplosionFruitTransporter,
        BuildingType.NewAreaUnlock,
    ];

    _endGameWin() {
        if (manager.enemy.CanCreateEnemy) {
            manager.enemy.CanCreateEnemy = false;
            app.event.emit(CommonEvent.CameraOrthoHeightChange, 50);
            this.scheduleOnce(() => {
                this.isGamePause = true;
                manager.enemy.killAllEnemy();
                app.event.emit(CommonEvent.GameWin);
            }, 3);
        }

        // if (!this.isGamePause) {
        //     this.isGamePause = true;
        //     // app.event.emit(CommonEvent.CameraMoveToNode, this.endCameraPos);
        //     app.event.emit(CommonEvent.CameraOrthoHeightChange, 50);

        //     // 杀死所有敌人，收集掉落物
        //     manager.enemy.killAllEnemy();
        //     // this.hero.pickupComponent.pickupRange = 10000;

        //     this.scheduleOnce(() => {
        //         app.event.emit(CommonEvent.GameWin);
        //     }, 3);
        // }
    }

    private onUnlockItem(type: BuildingType): void {
        let unlockId = this._unlockArray.indexOf(type);
        if (unlockId === -1) {
            return;
        }

        app.audio.playEffect('resources/MQBY/建造成功');

        // 最终解锁目标完成，胜利
        if (type === BuildingType.NewAreaUnlock) {
            this._endGameWin();
        }
        // 解锁水果传送带后，延迟几秒后判定胜利
        else if (type === BuildingType.ExplosionFruitTransporter) {
            this.scheduleOnce(() => {
                this._endGameWin();
            }, 3);
        }



        if (type === BuildingType.NewAreaUnlock) {
            this._showLastArea();
        }
    }

    // 对应摄像头Y轴的旋转角度
    private rotationAngle: number = -35;
    private onJoystickInput(inputVector: Vec2): void {
        if (this.isGamePause) {
            return;
        }
        if (!this.isGameStart) {
            this.isGameStart = true;
            app.log.info("玩家首次操作，开始游戏");
            app.event.emit(CommonEvent.UpdateGuide);
        }

        // 检查是否需要旋转向量
        let rotatedVector = inputVector.clone();
        // 假设rotationAngle是类中的属性，单位为度，0表示不旋转
        if (this.rotationAngle && this.rotationAngle !== 0) {
            const angleRad = this.rotationAngle * Math.PI / 180; // 转换为弧度
            const cos = Math.cos(angleRad);
            const sin = Math.sin(angleRad);
            // 应用旋转公式
            const x = inputVector.x * cos - inputVector.y * sin;
            const y = inputVector.x * sin + inputVector.y * cos;
            rotatedVector.set(x, y);
        }

        // 将2D输入转换为3D移动方向，Y轴映射到Z轴
        const moveDirection = new Vec3(rotatedVector.x, 0, -rotatedVector.y);
        this.hero.move(moveDirection);
    }

    // 注销事件的独立方法
    private unregisterEvents(): void {
        app.event.offAllByTarget(this);
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
                        if (h > groundHeight) {
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
        SuperPackage.Download();
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

        console.log('英雄血量恢复开始：每秒恢复10点血量');
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

    public getCarryItemNode(itemType: ObjectType, wPos: Vec3): Node {
        let buildingType = BuildingType.None;
        if (itemType == ObjectType.StackItemSwab) {
            buildingType = BuildingType.SwabStack;
        }
        else if (itemType == ObjectType.StackItemExplosionFruit) {
            buildingType = BuildingType.ExplosionFruitStack;
        }
        const buildingInfo = this._buildingMap.get(buildingType);
        if (buildingInfo) {
            let buildingNode = buildingInfo.node;
            // 查找堆放区子节点中，距离最近的
            let minDis = 1000000;
            let minNode: Node = null;
            for (let i = 0; i < buildingNode.children.length; i++) {
                const child = buildingNode.children[i];
                if (child.active) {
                    let dis = Vec3.distance(wPos, child.worldPosition);
                    if (dis < minDis) {
                        minDis = dis;
                        minNode = child;
                    }
                }
            }
            if (minNode) {
                return minNode;
            }
        }
        return null;
    }

    /**
     * 获取最近的指定类型物品的世界位置
     * @param itemType 物品类型
     * @param wPos 搬运者的世界位置
     * @returns 物品的世界位置
     */
    public getCarryItemsWPos(itemType: ObjectType, wPos: Vec3): Vec3 {
        let itemNode = this.getCarryItemNode(itemType, wPos);
        if (itemNode) {
            return itemNode.worldPosition;
        }
        return Vec3.ZERO;
    }

    public getTowerNode(towerType: BuildingType): Node {
        const buildingInfo = this._buildingMap.get(towerType);
        if (buildingInfo) {
            return buildingInfo.node;
        }
        return null;
    }

    /**
     * 获取指定类型的塔的世界位置
     * @param itemType 物品类型
     * @returns 物品的世界位置
     */
    public getTowerWPos(itemType: ObjectType): Vec3 {
        let buildingType = BuildingType.None;
        if (itemType == ObjectType.StackItemSwab) {
            buildingType = BuildingType.SwabArcherTower;
        }
        else if (itemType == ObjectType.StackItemExplosionFruit) {
            buildingType = BuildingType.ExplosionFruitDefenseTower;
        }

        const buildingInfo = this._buildingMap.get(buildingType);
        if (buildingInfo) {
            return buildingInfo.wPos;
        }
        return Vec3.ZERO;
    }

    _buildingMap: Map<BuildingType, { wPos: Vec3, node: Node }> = new Map();

    public getBuildingNode(buildingType: BuildingType): Node {
        const buildingInfo = this._buildingMap.get(buildingType);
        if (buildingInfo) {
            return buildingInfo.node;
        }
        return null;
    }

    /** 注册建筑节点和世界坐标信息 */
    public registerBuilding(itemType: BuildingType, node: Node, wPos: Vec3): void {
        this._buildingMap.set(itemType, { wPos, node });
    }
}


