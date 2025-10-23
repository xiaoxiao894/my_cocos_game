import { _decorator, Component, Node, Vec3, RigidBody, Collider, ICollisionEvent, Enum, log, BoxCollider, ITriggerEvent, Color, color } from 'cc';
import { HealthComponent } from '../Components/HealthComponent';
import { PoolObjectBase } from '../../common/PoolObjectBase';
import { Rotation3DUtils } from '../../common/Rotation3DUtils';

const { ccclass, property } = _decorator;

/**
 * 子弹移动类型枚举
 */
enum BulletMoveType {
    /** 直线移动 */
    LINE = 0,
    /** 抛物线移动 */
    PARABOLA = 1,
}

/**
 * 子弹目标类型枚举
 */
enum BulletTargetType {
    /** 固定方向 */
    FIXED_DIRECTION = 0,
    /** 追踪目标 */
    TRACKING = 1,
}

/**
 * 子弹碰撞类型枚举
 */
enum BulletCollisionType {
    /** 非穿透 */
    NORMAL = 0,
    /** 穿透 */
    PENETRATE = 1,
}

/**
 * 追踪命中判定类型
 */
enum TrackingHitType {
    /** 碰撞判定 */
    COLLISION = 0,
    /** 距离判定 */
    DISTANCE = 1,
}

/**
 * 子弹基类
 * @class BulletBase
 */
@ccclass('BulletBase')
export class BulletBase extends PoolObjectBase {
    /** 子弹速度 */
    @property
    public speed: number = 10;

    public createNode: Node = null;

    /** 子弹伤害 */
    @property
    public damage: number = 10;

    /** 子弹伤害颜色 */
    @property
    public damageColor: Color = color().fromHEX('#ffffff');

    /** 子弹最大射程 */
    @property
    public maxRange: number = 100;

    /** 子弹生命周期 */
    @property
    public lifeTime: number = 5;

    /** 子弹移动类型 */
    @property({ type: Enum(BulletMoveType), displayName: '子弹移动类型', tooltip: '子弹移动类型 : LINE 直线' })
    public moveType: BulletMoveType = BulletMoveType.LINE;

    /** 子弹目标类型 */
    @property({ type: Enum(BulletTargetType), displayName: '子弹目标类型', tooltip: '子弹目标类型 : FIXED_DIRECTION 固定方向, TRACKING 追踪目标' })
    public targetType: BulletTargetType = BulletTargetType.FIXED_DIRECTION;

    /** 目标节点 */
    @property({ type: Node, visible: function (this: BulletBase) { return this.targetType === BulletTargetType.TRACKING }, displayName: '目标节点' })
    public targetNode: Node | null = null;

    /** 命中判定类型 */
    @property({
        type: Enum(TrackingHitType),
        displayName: '命中判定类型',
        tooltip: '命中判定类型 : COLLISION 碰撞判定, DISTANCE 距离判定'
    })
    public hitType: TrackingHitType = TrackingHitType.COLLISION;

    /** 命中距离 */
    @property({
        displayName: '命中距离',
        tooltip: '当子弹与目标距离小于此值时判定命中',
        visible: function (this: BulletBase) {
            return this.hitType === TrackingHitType.DISTANCE
        }
    })
    public hitDistance: number = 1;

    /** 追踪速度 */
    @property({ visible: function (this: BulletBase) { return this.targetType === BulletTargetType.TRACKING }, displayName: '追踪速度' })
    public trackingSpeed: number = 5;

    /** 子弹碰撞类型 */
    @property({ type: Enum(BulletCollisionType), displayName: '子弹碰撞类型', tooltip: '子弹碰撞类型 : NORMAL 非穿透, PENETRATE 穿透' })
    public collisionType: BulletCollisionType = BulletCollisionType.NORMAL;

    /** 最大穿透次数 */
    @property({ visible: function (this: BulletBase) { return this.collisionType === BulletCollisionType.PENETRATE }, displayName: '最大穿透次数' })
    public maxPenetrateCount: number = 3;

    /** 抛物线高度系数 */
    @property({ visible: function (this: BulletBase) { return this.moveType === BulletMoveType.PARABOLA }, displayName: '抛物线高度系数' })
    public parabolaHeightFactor: number = 0.5;

    /** 抛物线基础高度 */
    @property({ visible: function (this: BulletBase) { return this.moveType === BulletMoveType.PARABOLA }, displayName: '抛物线基础高度' })
    public parabolaBaseHeight: number = 5;

    /** 抛物线最大高度 */
    @property({ visible: function (this: BulletBase) { return this.moveType === BulletMoveType.PARABOLA }, displayName: '抛物线最大高度' })
    public parabolaMaxHeight: number = 20;

    /** 是否旋转节点 */
    @property({ displayName: '是否旋转节点', tooltip: '是否根据移动方向旋转子弹节点' })
    public enableRotation: boolean = true;

    // 私有变量
    private _rigidBody: RigidBody | null = null;
    private _collider: Collider | null = null;
    private _direction: Vec3 = new Vec3(0, 0, -1); // 默认向前方向，根据Cocos坐标系Z轴负方向
    private _initPosition: Vec3 = new Vec3();
    private _currentRange: number = 0;
    private _penetrateCount: number = 0;
    private _age: number = 0;
    private _velocity: Vec3 = new Vec3(0, 0, 0);
    private isHited: boolean = false; // 是否已经命中
    private _hitEnemies: Node[] = []; // 已命中的敌人列表（用于穿透模式）

    // 贝塞尔曲线相关变量
    private _parabolaStartPoint: Vec3 = new Vec3();
    private _parabolaControlPoint: Vec3 = new Vec3();
    private _parabolaEndPoint: Vec3 = new Vec3();
    private _parabolaProgress: number = 0;
    private _parabolaDistance: number = 0;
    private _targetPosition: Vec3 = new Vec3();
    private _parabolaInitialized: boolean = false;

    private _isFired: boolean = false;

    /**
     * 组件加载完成
     */
    onLoad() {
        // 获取刚体和碰撞器组件
        this._rigidBody = this.getComponent(RigidBody);
        this._collider = this.getComponent(BoxCollider);

        // 检查碰撞组件
        if (!this._collider) {
            if (this.hitType == TrackingHitType.COLLISION) {
                console.error('碰撞型子弹却没有碰撞组件!');
                return;
            }
        }

        // 记录初始位置
        this._initPosition.set(this.node.position);

        if (this._collider) {
            // 添加碰撞回调
            this._collider.on('onCollisionEnter', this._onCollisionEnter, this);
            this._collider.on('onTriggerEnter', this._onCollisionEnter, this);
        }
    }

    protected onDestroy(): void {
        if (this._collider) {
            this._collider.off('onCollisionEnter', this._onCollisionEnter, this);
            this._collider.off('onTriggerEnter', this._onCollisionEnter, this);
        }
    }

    /**
     * 设置子弹方向
     * @param dir 方向向量
     */
    public setDirection(dir: Vec3) {
        this._direction.set(dir);
        this._direction.normalize();

        // 设置节点朝向
        this._updateRotation();
    }

    /**
     * 设置追踪目标
     * @param target 目标节点
     */
    public setTarget(target: Node) {
        this.targetNode = target;
    }

    /**
     * 设置子弹伤害颜色
     * @param color 颜色
     */
    public setDamageColor(color: Color) {
        this.damageColor = color;
    }

    /**
     * 发射子弹
     * @param startPos 起始位置
     * @param direction 方向
     */
    public fire(startPos: Vec3, direction: Vec3) {
        this._age = 0;
        this._currentRange = 0;
        this._penetrateCount = 0;
        this.isHited = false; // 重置命中状态
        // console.warn('fire====================================');
        this._isFired = true;
        this._hitEnemies = []; // 重置已命中敌人列表
        this._parabolaProgress = 0;
        this._parabolaInitialized = false;

        this.node.position = startPos;
        this._initPosition.set(startPos);
        this.setDirection(direction);

        if (this._rigidBody) {
            this._rigidBody.useGravity = false; // 默认不使用重力，由我们自己控制
            this._rigidBody.isKinematic = true; // 设为运动学刚体，避免物理引擎影响
        }
    }

    /**
     * 更新子弹朝向
     */
    private _updateRotation() {
        // 如果禁用旋转，则不更新节点朝向
        if (!this.enableRotation) {
            return;
        }

        // 使用3D旋转工具类更新朝向
        // smoothness 为 0 表示直接设置朝向，不需要平滑，因此 deltaTime 不会被使用
        Rotation3DUtils.faceDirection(this.node, this._direction, 0);
    }

    /**
     * 初始化抛物线参数
     */
    private _initParabola() {
        if (this._parabolaInitialized) return;

        this._parabolaStartPoint.set(this.node.position);

        if (this.targetType === BulletTargetType.TRACKING && this.targetNode && this.targetNode.isValid) {
            // 如果是追踪类型，使用目标位置作为终点
            this._targetPosition.set(this.targetNode.getWorldPosition());
        } else {
            // 如果是固定方向，根据方向和最大射程计算终点
            this._targetPosition.set(
                this._initPosition.x + this._direction.x * this.maxRange,
                this._initPosition.y + this._direction.y * this.maxRange,
                this._initPosition.z + this._direction.z * this.maxRange
            );
        }

        this._parabolaEndPoint.set(this._targetPosition);

        // 计算两点间距离
        this._parabolaDistance = Vec3.distance(this._parabolaStartPoint, this._parabolaEndPoint);

        // 根据距离计算适当的抛物线高度
        let height = this._calculateParabolaHeight(this._parabolaDistance);

        // 设置控制点（贝塞尔曲线的中间控制点）
        this._parabolaControlPoint.set(
            (this._parabolaStartPoint.x + this._parabolaEndPoint.x) / 2,
            (this._parabolaStartPoint.y + this._parabolaEndPoint.y) / 2 + height,
            (this._parabolaStartPoint.z + this._parabolaEndPoint.z) / 2
        );

        this._parabolaInitialized = true;
    }

    /**
     * 计算抛物线高度
     * @param distance 距离
     * @returns 高度
     */
    private _calculateParabolaHeight(distance: number): number {
        // 根据距离调整高度，距离越远，高度越高，但有上限
        let height = this.parabolaBaseHeight + (distance * this.parabolaHeightFactor);

        // 限制最大高度
        return Math.min(height, this.parabolaMaxHeight);
    }

    /**
     * 更新抛物线轨迹
     * @param dt 时间增量
     */
    private _updateParabola(dt: number) {
        // 初始化抛物线参数
        if (!this._parabolaInitialized) {
            this._initParabola();
        }

        // 如果是追踪类型且目标有效，需要动态更新终点和控制点
        if (this.targetType === BulletTargetType.TRACKING && this.targetNode && this.targetNode.isValid &&
            !this.targetNode.getComponent(HealthComponent)!.isDead) {

            // 更新目标位置
            this._targetPosition.set(this.targetNode.getWorldPosition());
            this._parabolaEndPoint.set(this._targetPosition);

            // 重新计算距离和高度
            this._parabolaDistance = Vec3.distance(this._parabolaStartPoint, this._parabolaEndPoint);
            let height = this._calculateParabolaHeight(this._parabolaDistance);

            // 更新控制点
            this._parabolaControlPoint.set(
                (this._parabolaStartPoint.x + this._parabolaEndPoint.x) / 2,
                (this._parabolaStartPoint.y + this._parabolaEndPoint.y) / 2 + height,
                (this._parabolaStartPoint.z + this._parabolaEndPoint.z) / 2
            );
        }

        // 计算每帧前进的进度值
        const progressPerFrame = (this.speed * dt) / this._parabolaDistance;
        this._parabolaProgress += progressPerFrame;

        // 限制进度在0-1之间
        this._parabolaProgress = Math.min(this._parabolaProgress, 1.0);

        // 计算当前贝塞尔曲线位置
        const newPosition = this._quadraticBezier(
            this._parabolaStartPoint,
            this._parabolaControlPoint,
            this._parabolaEndPoint,
            this._parabolaProgress
        );

        // 计算移动距离，用于判断是否超过最大射程
        const lastPos = this.node.position.clone();
        this.node.position = newPosition;
        this._currentRange += Vec3.distance(lastPos, newPosition);

        // 计算当前位置与下一个位置，用于更新朝向
        if (this._parabolaProgress < 0.98) {
            const nextProgress = Math.min(this._parabolaProgress + 0.02, 1.0);
            const nextPosition = this._quadraticBezier(
                this._parabolaStartPoint,
                this._parabolaControlPoint,
                this._parabolaEndPoint,
                nextProgress
            );

            // 计算方向并更新旋转
            this._direction = nextPosition.clone().subtract(newPosition).normalize();
            this._updateRotation();
        }

        // 如果到达终点，回收子弹
        if (this._parabolaProgress >= 1.0) {
            this.recycleBullet();
        }
    }

    /**
     * 计算二次贝塞尔曲线点
     * @param p0 起点
     * @param p1 控制点
     * @param p2 终点
     * @param t 进度 (0-1)
     * @returns 曲线上的点
     */
    private _quadraticBezier(p0: Vec3, p1: Vec3, p2: Vec3, t: number): Vec3 {
        const result = new Vec3();

        // 二次贝塞尔曲线公式: B(t) = (1-t)²P₀ + 2(1-t)tP₁ + t²P₂
        const oneMinusT = 1 - t;
        const oneMinusTSquared = oneMinusT * oneMinusT;
        const tSquared = t * t;

        result.x = oneMinusTSquared * p0.x + 2 * oneMinusT * t * p1.x + tSquared * p2.x;
        result.y = oneMinusTSquared * p0.y + 2 * oneMinusT * t * p1.y + tSquared * p2.y;
        result.z = oneMinusTSquared * p0.z + 2 * oneMinusT * t * p1.z + tSquared * p2.z;

        return result;
    }

    /**
     * 碰撞回调
     * @param event 碰撞事件
     */
    private _onCollisionEnter(event: ICollisionEvent | ITriggerEvent) {
        // 如果使用距离判定，则忽略碰撞
        if (this.hitType === TrackingHitType.DISTANCE) {
            return;
        }

        const targetNode = (event as ICollisionEvent).otherCollider?.node || (event as ITriggerEvent).otherCollider?.node;
        if (!targetNode) return;

        // 检查是否是穿透模式
        if (this.collisionType === BulletCollisionType.PENETRATE) {
            // 检查是否已经命中过这个目标
            if (this._hitEnemies.includes(targetNode)) {
                return; // 已经命中过，忽略此次碰撞
            }

            // 记录命中的敌人
            this._hitEnemies.push(targetNode);
            this._penetrateCount++;

            // 调用命中回调
            this.onHit(targetNode);

            // 检查是否达到最大穿透次数
            if (this._penetrateCount >= this.maxPenetrateCount) {
                this.recycleBullet();
            }
        } else {
            // 非穿透直接销毁
            if (!this.isHited) {
                this.isHited = true;
                this.onHit(targetNode);
            }
            this.recycleBullet();
        }
    }

    /**
     * 检查距离命中
     */
    private _checkDistanceHit() {
        // 获取敌人管理器
        const enemyManager = manager.enemy;
        if (!enemyManager) return;

        // 获取子弹当前世界坐标
        const bulletPos = this.node.getWorldPosition();

        // 获取范围内的敌人
        const enemies = enemyManager.getRangeEnemies(bulletPos, this.hitDistance);

        // 过滤掉已经命中过的敌人
        const newEnemies = enemies.filter(enemy => !this._hitEnemies.includes(enemy.node));

        if (newEnemies.length > 0) {
            // console.log('newEnemies====================================');
            // for(const enemy of newEnemies) {
            //     console.log(enemy.node.uuid);
            // }
            // console.log('this._hitEnemies====================================');
            // for(const enemy of this._hitEnemies) {
            //     console.log(enemy.uuid);
            // }
            // 命中第一个新敌人
            const targetEnemy = newEnemies[0];
            this._hitEnemies.push(targetEnemy.node);
            this.onHit(targetEnemy.node);

            // 根据穿透类型处理
            if (this.collisionType === BulletCollisionType.PENETRATE) {
                this._penetrateCount++;
                if (this._penetrateCount >= this.maxPenetrateCount) {
                    this.recycleBullet();
                }
            } else {
                // 非穿透直接销毁
                this.isHited = true;
                this.recycleBullet();
            }
        }
    }

    /**
     * 检查地面高度，确保子弹不低于地面
     */
    private _checkGroundHeight() {
        // 获取游戏管理器
        const gameManager = manager.game;
        if (!gameManager) return;

        // 获取子弹当前世界坐标
        const currentPos = this.node.getWorldPosition();

        // 计算当前位置的地面高度
        const groundHeight = gameManager.calculateGroundHeight(currentPos);

        // 如果子弹高度低于地面高度，调整到地面高度
        if (currentPos.y < groundHeight) {
            const newPos = new Vec3(currentPos.x, groundHeight, currentPos.z);
            this.node.setWorldPosition(newPos);

            // 调整方向向量，使子弹沿地面飞行
            // 将Y分量设为0，保持XZ平面的方向
            this._direction.y = 0;
            this._direction.normalize();

            // 更新子弹朝向
            this._updateRotation();
        }
    }

    /**
     * 子弹命中回调，子类可重写此方法
     * @param targetNode 目标节点
     */
    protected onHit(targetNode: Node) {
        // 默认空实现，由子类重写
    }

    /**
     * 回收
     */
    protected recycleBullet() {
        // 添加调试日志，帮助定位回收原因
        // console.log(`子弹回收 - 穿透次数: ${this._penetrateCount}/${this.maxPenetrateCount}, 碰撞类型: ${this.collisionType}, 年龄: ${this._age.toFixed(2)}/${this.lifeTime}, 射程: ${this._currentRange.toFixed(2)}/${this.maxRange}`);

        // 可以在这里添加粒子效果或音效
        this.recycle();
    }

    /**
     * 直线移动更新
     * @param dt 时间增量
     */
    private _updateLineMove(dt: number) {
        const moveStep = this.speed * dt;
        const displacement = new Vec3();
        Vec3.multiplyScalar(displacement, this._direction, moveStep);

        this.node.position = this.node.position.add(displacement);
        this._currentRange += moveStep;
    }

    /**
     * 追踪目标更新
     * @param dt 时间增量
     */
    private _updateTracking(dt: number) {
        if (this.targetNode && this.targetNode.isValid && !this.targetNode.getComponent(HealthComponent)!.isDead) {
            // 计算目标方向
            const targetPos = this.targetNode.getWorldPosition();
            const currentPos = this.node.getWorldPosition();
            const direction = targetPos.clone().subtract(currentPos).normalize();

            // 距离检测在update方法中统一处理，这里不再单独处理

            // 计算当前方向与目标方向的点积，用于判断旋转角度
            const dot = Vec3.dot(this._direction, direction);

            // 限制最大旋转速度，避免快速旋转
            const maxRotateSpeed = Math.min(this.trackingSpeed * dt, 1.0);
            const rotateWeight = Math.max(0.1, maxRotateSpeed);

            // 使用插值平滑旋转
            Vec3.lerp(this._direction, this._direction, direction, rotateWeight);
            this._direction.normalize();

            // 更新旋转
            this._updateRotation();
        } else {
            // // 目标已经死亡或无效，切换到固定方向类型
            // this.targetType = BulletTargetType.FIXED_DIRECTION;
            // // 保持当前方向继续前进
            // this._direction.normalize();
            // this._updateRotation();

            // 目标已经死亡或无效，则销毁子弹
            this.recycleBullet();
        }
    }

    /**
     * 帧更新
     * @param dt 时间增量
     */
    update(dt: number) {
        if (!this._isFired) return;
        this._age += dt;

        // 检查生命周期
        if (this._age >= this.lifeTime || this._currentRange >= this.maxRange) {
            this.recycleBullet();
            return;
        }

        // 如果使用距离判定，检查范围内的敌人
        if (this.hitType === TrackingHitType.DISTANCE) {
            this._checkDistanceHit();
        }

        // 根据移动类型进行更新
        if (this.moveType === BulletMoveType.PARABOLA) {
            // 抛物线移动
            this._updateParabola(dt);
        } else {
            // 如果是追踪类型，更新方向
            if (this.targetType === BulletTargetType.TRACKING) {
                this._updateTracking(dt);
            }

            // 直线移动
            this._updateLineMove(dt);
        }

        // 固定方向类型的子弹需要检查地面高度
        if (this.targetType === BulletTargetType.FIXED_DIRECTION) {
            this._checkGroundHeight();
        }
    }

    /**
     * 重置
     */
    public reset(): void {
        this._age = 0;
        this._currentRange = 0;
        this._penetrateCount = 0;
        this.isHited = false;
        // console.warn('reset====================================');
        this._isFired = false;
        this._hitEnemies = [];
        this._parabolaProgress = 0;
        this._parabolaInitialized = false;
    }
} 