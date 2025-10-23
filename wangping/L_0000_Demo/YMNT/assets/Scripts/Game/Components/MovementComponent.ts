import { _decorator, Component, CCFloat, Vec3, RigidBody, ERigidBodyType, v3, Node, Collider, CCBoolean } from 'cc';
import { ComponentEvent } from '../../common/ComponentEvents';
import { ColorEffectType } from '../../common/CommonEnum';
import { BaseComponet } from './BaseComponet';

const { ccclass, property } = _decorator;

/**
 * 移动组件 - 管理角色移动相关功能
 */
@ccclass('MovementComponent')
export class MovementComponent extends BaseComponet {
    @property({
        type: CCFloat, 
        displayName: '移动速度',
        range: [0, 20],
        tooltip: '角色的基础移动速度'
    })
    protected moveSpeed: number = 5;

    @property({
        type: CCFloat,
        displayName: '到达目标距离',
        range: [0.1, 5.0],
        tooltip: '认为角色已到达目标点的距离阈值'
    })
    protected arriveDistance: number = 0.5;

    protected gravity: number = 50;
    protected knockupMaxDuration: number = 3.0;

    @property({
        type: CCFloat,
        displayName: '地面高度偏移',
        range: [0.1, 10.0],
        tooltip: '角色站立时，地面高度偏移'
    })
    protected groundHeightOffset: number = 1;

    @property({
        type: Node,
        displayName: '影子'
    })
    protected shadow: Node = null!;

    /** 移动时是否保持朝向 */
    protected isKeepFace: boolean = false;

    /** 减速相关属性 */
    /** 是否处于减速状态 */
    protected isSlowing: boolean = false;
    /** 减速计时器 */
    protected slowTimer: number = 0;
    /** 减速持续时间 */
    protected slowDuration: number = 0;
    /** 减速系数 (0-1之间，表示减少的速度百分比) */
    protected slowRatio: number = 0;
    /** 原始速度 */
    protected originalSpeed: number = 0;

    /** 击退相关属性 */
    /** 是否处于击退状态 */
    protected isKnockingBack: boolean = false;
    /** 击退方向 */
    protected knockbackDirection: Vec3 = new Vec3();
    /** 击退力度 */
    protected knockbackForce: number = 0;
    /** 击退持续时间 */
    protected knockbackDuration: number = 0.3;
    /** 当前击退计时器 */
    protected knockbackTimer: number = 0;
    /** 击退前的移动方向 */
    protected preKnockbackDirection: Vec3 = new Vec3();
    /** 击退前是否正在向目标移动 */
    protected wasMovingToTarget: boolean = false;
    /** 击退前的目标位置 */
    protected preKnockbackTargetPosition: Vec3|null = null;

    /** 击飞相关属性 */
    /** 是否处于击飞状态 */
    protected isKnockedUp: boolean = false;
    /** 击飞初始速度 */
    protected knockupVelocity: number = 0;
    /** 击飞当前Y轴速度 */
    protected currentYVelocity: number = 0;
    /** 击飞起始高度 */
    protected knockupStartHeight: number = 0;
    /** 击飞时的地面高度 */
    protected knockupGroundHeight: number = 0;
    /** 击飞持续时间计时器 */
    protected knockupTimer: number = 0;
    /** 击飞前的移动状态 */
    protected preKnockupDirection: Vec3 = new Vec3();
    /** 击飞前是否正在向目标移动 */
    protected wasMovingToTargetBeforeKnockup: boolean = false;
    /** 击飞前的目标位置 */
    protected preKnockupTargetPosition: Vec3|null = null;
    /** 击飞方向（水平方向） */
    protected knockupDirection: Vec3 = new Vec3();
    /** 击飞水平速度 */
    protected knockupHorizontalVelocity: Vec3 = new Vec3();
    /** 击飞水平阻力系数（每秒减少的速度比例） */
    protected knockupHorizontalDrag: number = 2.0;

    /** 移动方向 */
    protected readonly direction: Vec3 = new Vec3();
    /** 是否正在移动到目标点 */
    protected isMovingToTarget: boolean = false;
    /** 目标世界坐标 */
    protected targetWorldPosition: Vec3|null = null;
    /** 到达目标点的回调函数 */
    protected onTargetReachedCallback: Function|null = null;
    /** 临时向量，用于计算 */
    private readonly tempVec3: Vec3 = new Vec3();
    /** 临时向量，用于存储位置 */
    private readonly currentPos: Vec3 = new Vec3();
    /** 刚体组件 */
    protected rigidBody: RigidBody|null = null;

    get ArriveDistance(): number {
        return this.arriveDistance;
    }

    set IsKeepFace(value: boolean) {
        this.isKeepFace = value;
    }

    onLoad() {
        super.onLoad();
        this.initRigidBody();
        this.registerEvents();
    }

    onDestroy() {
        this.unregisterEvents();
    }

    /**
     * 注册事件监听
     */
    private registerEvents() {
        // 监听击飞结束事件，处理基础移动恢复
        this.node.on(ComponentEvent.KNOCKUP_END, this.onKnockupEndForMovement, this);
        // 监听击退结束事件，处理基础移动恢复
        this.node.on(ComponentEvent.KNOCKBACK_END, this.onKnockbackEndForMovement, this);
        // 监听移动到位置事件
        this.node.on(ComponentEvent.MOVE_TO_POSITION, this.onMoveToPosition, this);
        // 监听停止移动事件
        this.node.on(ComponentEvent.STOP_MOVING, this.onStopMoving, this);
        // 监听更新朝向事件
        this.node.on(ComponentEvent.UPDATE_FACE_DIRECTION, this.onUpdateFaceDirection, this);
        // 监听角色移动事件
        this.node.on(ComponentEvent.CHARACTER_MOVE, this.onCharacterMove, this);
        // 监听角色停止事件
        this.node.on(ComponentEvent.CHARACTER_STOP, this.onCharacterStop, this);
        // 监听角色击退事件
        this.node.on(ComponentEvent.CHARACTER_KNOCKBACK, this.onCharacterKnockback, this);
        // 监听角色击飞事件
        this.node.on(ComponentEvent.CHARACTER_KNOCKUP, this.onCharacterKnockup, this);
    }

    /**
     * 注销事件监听
     */
    private unregisterEvents() {
        this.node.off(ComponentEvent.KNOCKUP_END, this.onKnockupEndForMovement, this);
        this.node.off(ComponentEvent.KNOCKBACK_END, this.onKnockbackEndForMovement, this);
        this.node.off(ComponentEvent.MOVE_TO_POSITION, this.onMoveToPosition, this);
        this.node.off(ComponentEvent.STOP_MOVING, this.onStopMoving, this);
        this.node.off(ComponentEvent.UPDATE_FACE_DIRECTION, this.onUpdateFaceDirection, this);
        this.node.off(ComponentEvent.CHARACTER_MOVE, this.onCharacterMove, this);
        this.node.off(ComponentEvent.CHARACTER_STOP, this.onCharacterStop, this);
        this.node.off(ComponentEvent.CHARACTER_KNOCKBACK, this.onCharacterKnockback, this);
        this.node.off(ComponentEvent.CHARACTER_KNOCKUP, this.onCharacterKnockup, this);
    }

    /**
     * 处理移动到位置事件
     */
    private onMoveToPosition(targetPos: Vec3) {
        this.moveToWorldPosition(targetPos);
    }

    /**
     * 处理停止移动事件
     */
    private onStopMoving() {
        this.stopMovingToTarget();
    }

    /**
     * 处理更新朝向事件
     */
    private onUpdateFaceDirection(directionX: number) {
        this.changeFaceDirection(directionX);
    }

    /**
     * 处理角色移动事件
     */
    private onCharacterMove(direction: Vec3) {
        this.move(direction);
    }

    /**
     * 处理角色停止事件
     */
    private onCharacterStop() {
        this.stopMovingToTarget();
        this.move(Vec3.ZERO);
    }

    /**
     * 处理角色击退事件
     */
    private onCharacterKnockback(data: { pos: Vec3, force: number }) {
        this.knockback(data.pos, data.force);
    }

    /**
     * 处理角色击飞事件
     */
    private onCharacterKnockup(force: number) {
        this.knockup(force);
    }

    /**
     * 获取刚体组件
     */
    public getRigidBody(): RigidBody|null {
        return this.rigidBody;
    }

    /**
     * 初始化刚体组件
     */
    protected initRigidBody() {
        this.rigidBody = this.getComponent(RigidBody);
    }

    update(dt: number) {
        if(this._character && this._character.healthComponent.isDead){
            return;
        }
        // 游戏暂停时不更新
        if (manager.game.isGamePause) return;

        this.updateTargetMovement(dt);
        this.updateSlowEffect(dt);
        this.updateKnockbackEffect(dt);
        this.updateKnockupEffect(dt);
        this.updatePosition(dt);
        
        // 更新地面高度
        this.updateGroundHeight();
    }

    /**
     * 更新击飞效果
     * @param dt 帧间隔时间
     */
    protected updateKnockupEffect(dt: number) {
        if (!this.isKnockedUp) return;
        
        // 更新击飞计时器
        this.knockupTimer += dt;
        
        // 检查是否超过最大持续时间，强制结束击飞
        if (this.knockupTimer >= this.knockupMaxDuration) {
            this.forceEndKnockup();
            return;
        }
        
        // 更新Y轴速度（受重力影响）
        this.currentYVelocity -= this.gravity * dt;
        
        // 获取当前位置
        const currentPos = this.node.getWorldPosition();
        
        // 更新Y轴位置
        currentPos.y += this.currentYVelocity * dt;
        
        // 更新水平位置（如果有水平击飞方向）
        if (!Vec3.equals(this.knockupHorizontalVelocity, Vec3.ZERO)) {
            const oldSpeed = Vec3.len(this.knockupHorizontalVelocity);
            
            // 应用水平移动
            currentPos.x += this.knockupHorizontalVelocity.x * dt;
            currentPos.z += this.knockupHorizontalVelocity.z * dt;
            
            // 应用空气阻力，基于时间的线性衰减
            const dragForce = this.knockupHorizontalDrag * dt;
            const currentSpeed = Vec3.len(this.knockupHorizontalVelocity);
            
            if (currentSpeed > 0) {
                const newSpeed = Math.max(0, currentSpeed - dragForce);
                const speedRatio = newSpeed / currentSpeed;
                Vec3.multiplyScalar(this.knockupHorizontalVelocity, this.knockupHorizontalVelocity, speedRatio);
            }
            
            // 当水平速度很小时，停止水平移动
            if (Vec3.len(this.knockupHorizontalVelocity) < 0.1) {
                console.log('击飞水平移动结束，速度太小');
                this.knockupHorizontalVelocity.set(0, 0, 0);
            }
            
            // 调试信息（每0.1秒输出一次）
            if (Math.floor(this.knockupTimer * 10) !== Math.floor((this.knockupTimer - dt) * 10)) {
                // console.log(`击飞更新 - 时间:${this.knockupTimer.toFixed(2)}s, 位置变化:(${(this.knockupHorizontalVelocity.x * dt).toFixed(2)}, ${(this.knockupHorizontalVelocity.z * dt).toFixed(2)}), 速度:${Vec3.len(this.knockupHorizontalVelocity).toFixed(2)}`);
            }
        }
        
        // 检查是否落地
        if (currentPos.y <= this.knockupGroundHeight + this.groundHeightOffset) {
            // 落地
            currentPos.y = this.knockupGroundHeight + this.groundHeightOffset;
            this.endKnockup();
        }
        
        // 更新位置
        this.node.setWorldPosition(currentPos);
        
        // 更新影子位置，保持在地面高度（使用已计算的地面高度）
        this.updateShadowPosition(this.knockupGroundHeight);
    }

    /**
     * 更新击退效果
     * @param dt 帧间隔时间
     */
    protected updateKnockbackEffect(dt: number) {
        if (!this.isKnockingBack) return;
        
        this.knockbackTimer += dt;
        if (this.knockbackTimer >= this.knockbackDuration) {
            // 击退结束，不再直接恢复移动状态，改为发送事件
            this.isKnockingBack = false;
            
            // 发送击退结束事件
            this.node.emit(ComponentEvent.KNOCKBACK_END);
        } else {
            // 使用二次方曲线模拟物理减速效果，比线性减速更自然
            const progress = this.knockbackTimer / this.knockbackDuration;
            // 使用 (1 - progress)² 实现非线性的减速效果
            const currentForce = this.knockbackForce * (1 - progress) * (1 - progress);
            
            // 更新击退方向和力度
            Vec3.multiplyScalar(this.direction, this.knockbackDirection, currentForce);
        }
    }

    /**
     * 根据当前方向和速度更新位置
     * @param dt 帧间隔时间
     */
    protected updatePosition(dt: number) {
        // 击飞时不进行水平移动
        if (this.isKnockedUp) return;
        
        
        const isMoving = !Vec3.equals(this.direction, Vec3.ZERO);
        
        if (!isMoving) return;
        
        // 计算速度系数
        let speedMultiplier = 1.0;
        
        // 在击退状态下使用独立的速度计算
        if (this.isKnockingBack) {
            // 击退的位移计算与普通移动分开
            // 击退力越大，移动速度越快
            speedMultiplier = 1.5 + this.knockbackForce * 0.1;
            
            // 随着击退时间推移，速度系数也会减小
            const knockbackProgress = this.knockbackTimer / this.knockbackDuration;
            speedMultiplier *= (1 - knockbackProgress);
        }
        
        // 计算位移量 - 不改变Y轴方向，让物理系统控制
        const displacement = new Vec3(
            this.direction.x * this.moveSpeed * dt * speedMultiplier,
            0, // Y轴位移设为0，让物理系统控制
            this.direction.z * this.moveSpeed * dt * speedMultiplier
        );
        
        // 获取当前位置
        this.node.getPosition(this.currentPos);
        
        // 保存原来的Y值
        const originalY = this.currentPos.y;
        
        // 更新位置
        Vec3.add(this.currentPos, this.currentPos, displacement);
        
        // 恢复Y值，让物理系统控制Y轴
        this.currentPos.y = originalY;
        
        this.node.setPosition(this.currentPos);
    }

    /**
     * 更新减速效果
     * @param dt 帧间隔时间
     */
    protected updateSlowEffect(dt: number) {
        if (!this.isSlowing) return;
        
        this.slowTimer += dt;
        if (this.slowTimer >= this.slowDuration) {
            // 减速时间结束，恢复原速
            this.isSlowing = false;
            this.moveSpeed = this.originalSpeed;
            
            // 通过事件取消减速颜色效果
            this.node.emit(ComponentEvent.CANCEL_COLOR_EFFECT, ColorEffectType.SLOW);
            
            // 发送减速结束事件
            this.node.emit(ComponentEvent.SLOW_END);
        }
    }

    /**
     * 应用减速效果
     * @param ratio 减速比例 (0-1之间，表示减少的速度百分比)
     * @param duration 减速持续时间(秒)
     */
    public applySlowEffect(ratio: number, duration: number) {
        if (ratio <= 0 || duration <= 0) return;
        
        // 限制减速比例在0-1之间
        ratio = Math.max(0, Math.min(1, ratio));
        
        // 如果当前已经处于减速状态
        if (this.isSlowing) {
            // 如果新减速比例更大，更新减速比例
            if (ratio > this.slowRatio) {
                this.slowRatio = ratio;
                this.moveSpeed = this.originalSpeed * (1 - this.slowRatio);
            }
            // 不论减速比例如何，都重置持续时间（刷新时间）
            this.slowDuration = duration;
            this.slowTimer = 0;
            
            // 通过事件应用减速颜色效果
            this.node.emit(ComponentEvent.APPLY_COLOR_EFFECT, {
                type: ColorEffectType.SLOW,
                duration: this.slowDuration
            });
            
            // 发送减速更新事件
            this.node.emit(ComponentEvent.SLOW_UPDATED, this.slowRatio, this.slowDuration);
            return;
        }
        
        // 首次应用减速效果，保存原始速度
        if (!this.isSlowing) {
            this.originalSpeed = this.moveSpeed;
        }
        
        this.isSlowing = true;
        this.slowRatio = ratio;
        this.slowDuration = duration;
        this.slowTimer = 0;
        
        // 计算减速后的速度
        this.moveSpeed = this.originalSpeed * (1 - this.slowRatio);
        
        // 通过事件应用减速颜色效果
        this.node.emit(ComponentEvent.APPLY_COLOR_EFFECT, {
            type: ColorEffectType.SLOW,
            duration: this.slowDuration
        });
        
        // 发送减速开始事件
        this.node.emit(ComponentEvent.SLOW_START, this.slowRatio, this.slowDuration);
    }

    /**
     * 取消减速效果
     */
    public cancelSlowEffect() {
        if (!this.isSlowing) return;
        
        this.isSlowing = false;
        this.moveSpeed = this.originalSpeed;
        
        // 通过事件取消减速颜色效果
        this.node.emit(ComponentEvent.CANCEL_COLOR_EFFECT, ColorEffectType.SLOW);
        
        // 发送减速结束事件
        this.node.emit(ComponentEvent.SLOW_END);
    }

    /**
     * 更新目标点移动逻辑
     */
    protected updateTargetMovement(dt: number) {
        if (!this.isMovingToTarget || !this.targetWorldPosition) return;
        
        // 检查是否到达目标点
        Vec3.subtract(this.tempVec3, this.targetWorldPosition, this.node.getWorldPosition());
        const distance = Vec3.len(this.tempVec3);
        
        if (distance <= this.arriveDistance) {
            this.onTargetArrived();
            return;
        }
        
        // 如果未到达，更新方向继续移动
        Vec3.normalize(this.tempVec3, this.tempVec3);
        this.move(this.tempVec3);
    }

    /**
     * 目标点到达后的回调方法
     */
    protected onTargetArrived() {
        this.isMovingToTarget = false;
        this.targetWorldPosition = null;
        this.move(Vec3.ZERO); // 停止移动
        
        // 发送目标到达事件
        this.node.emit(ComponentEvent.TARGET_REACHED);
        
        // 执行回调函数
        if (this.onTargetReachedCallback) {
            this.onTargetReachedCallback();
            this.onTargetReachedCallback = null;
        }
    }

    public setRigidBodyEnabled(enabled: boolean) {
        if (this.rigidBody) {
            this.rigidBody.enabled = enabled;
        }

        this.node.getComponents(Collider).forEach(collider => {
            collider.enabled = enabled;
        });
    }

    /**
     * 移动角色
     * @param direction 移动方向
     */
    public move(direction: Vec3) {
        Vec3.copy(this.direction, direction);
        
        const isMoving = !Vec3.equals(direction, Vec3.ZERO);
        // 移动状态发生改变时发送事件
        this.node.emit(ComponentEvent.MOVE_STATE_UPDATE, isMoving);
        
        // 更新朝向
        if (!this.isKeepFace && isMoving) {
            // 使用3D方向向量更新朝向
            // this.updateFaceDirectionFrom3D(direction);
            this.node.emit(ComponentEvent.SET_FACE_DIRECTION_FROM_3D, direction);
        }
    }

    /**
     * 更改角色朝向
     */
    public changeFaceDirection(directionX: number) {
        // this.updateFaceDirection(directionX);
        this.node.emit(ComponentEvent.SET_FACE_DIRECTION, directionX);
    }

    /**
     * 移动到指定世界坐标位置
     * @param targetPos 目标世界坐标
     * @param callback 到达目标点后的回调函数
     */
    public moveToWorldPosition(targetPos: Vec3, callback?: Function) {
        this.targetWorldPosition = targetPos.clone();
        this.isMovingToTarget = true;
        
        // 设置回调函数
        this.onTargetReachedCallback = callback || null;
        
        // 计算初始方向并开始移动
        Vec3.subtract(this.tempVec3, this.targetWorldPosition, this.node.getWorldPosition());
        Vec3.normalize(this.tempVec3, this.tempVec3);
        this.move(this.tempVec3);
    }

    /**
     * 停止移动到目标点
     */
    public stopMovingToTarget() {
        this.isMovingToTarget = false;
        this.targetWorldPosition = null;
        this.onTargetReachedCallback = null;
        this.move(Vec3.ZERO);
    }

    /**
     * 重置组件状态
     */
    public reset() {
        this.isMovingToTarget = false;
        this.wasMovingToTarget = false;
        this.targetWorldPosition = null;
        this.preKnockbackTargetPosition = null;
        this.onTargetReachedCallback = null;
        this.direction.set(Vec3.ZERO);
        this.preKnockbackDirection.set(Vec3.ZERO);
        
        // 重置减速状态
        if (this.isSlowing) {
            this.isSlowing = false;
            this.moveSpeed = this.originalSpeed;
            
            // 通过事件取消减速颜色效果
            this.node.emit(ComponentEvent.CANCEL_COLOR_EFFECT, ColorEffectType.SLOW);
        }
        this.slowTimer = 0;
        
        // 重置击退状态
        this.isKnockingBack = false;
        this.knockbackTimer = 0;
        
        // 重置击飞状态
        this.isKnockedUp = false;
        this.currentYVelocity = 0;
        this.knockupTimer = 0;
        this.wasMovingToTargetBeforeKnockup = false;
        this.preKnockupTargetPosition = null;
        this.preKnockupDirection.set(Vec3.ZERO);
        this.knockupDirection.set(Vec3.ZERO);
        this.knockupHorizontalVelocity.set(Vec3.ZERO);

        this.setRigidBodyEnabled(true);
    }

    /**
     * 获取当前移动方向
     */
    public getDirection(): Vec3 {
        return this.direction;
    }

    /**
     * 是否正在移动
     */
    public get isMoving(): boolean {
        return !Vec3.equals(this.direction, Vec3.ZERO);
    }

    /**
     * 获取当前移动速度
     */
    public get speed(): number {
        return this.moveSpeed;
    }

    /**
     * 设置移动速度
     */
    public set speed(value: number) {
        if (this.isSlowing) {
            // 如果处于减速状态，保存为原始速度
            this.originalSpeed = value;
            // 应用减速比例
            this.moveSpeed = value * (1 - this.slowRatio);
        } else {
            this.moveSpeed = value;
        }
    }

    /** 
     * 击退
     * @param pos 击退位置
     * @param force 击退力
     */
    public knockback(pos: Vec3, force: number) {
        if (force <= 0) return;
        
        // 考虑刚体质量调整击退力
        let adjustedForce = force;
        if (this.rigidBody) {
            const mass = this.rigidBody.mass;
            if (mass > 0) {
                // 根据质量调整力度：质量越大，受到的影响越小
                // 使用 1/sqrt(mass) 作为力度系数，使得力度随质量增加而减小，但不会减小太快
                adjustedForce = force / Math.sqrt(mass);
                
                // 设置最大力度限制
                adjustedForce = Math.min(force * 2, adjustedForce);
            }
        }
        
        // 如果调整后的力度太小，则不执行击退
        if (adjustedForce <= 0.1) return;
        
        // 如果第一次击退，保存当前移动到目标的状态
        if (!this.isKnockingBack) {
            // 保存当前是否在向目标移动
            this.wasMovingToTarget = this.isMovingToTarget;
            
            // 保存目标位置
            if (this.isMovingToTarget && this.targetWorldPosition) {
                this.preKnockbackTargetPosition = this.targetWorldPosition.clone();
            }
            
            // 保存当前移动方向，以便击退结束后恢复
            Vec3.copy(this.preKnockbackDirection, this.direction);
        }
        
        // 暂时停止向目标点移动，击退结束后会恢复
        this.isMovingToTarget = false;
        
        // 计算击退方向（从击退源点指向角色的方向）
        const currentPos = this.node.getWorldPosition();
        Vec3.subtract(this.knockbackDirection, currentPos, pos);
        
        // 只考虑水平方向的击退（y设为0）
        this.knockbackDirection.y = 0;
        
        // 如果方向是零向量，设置一个默认方向
        if (Vec3.equals(this.knockbackDirection, Vec3.ZERO)) {
            this.knockbackDirection.set(0, 0, 1);
        }
        
        // 标准化方向向量
        Vec3.normalize(this.knockbackDirection, this.knockbackDirection);
        
        // 设置击退状态
        this.isKnockingBack = true;
        this.knockbackTimer = 0;  // 重置计时器，使得每次击退都能完整执行
        this.knockbackForce = adjustedForce;
        
        // 立即应用击退方向和力度
        Vec3.multiplyScalar(this.direction, this.knockbackDirection, this.knockbackForce);
        
        // 更新朝向（面向击退相反方向）
        // this.updateFaceDirection(-this.knockbackDirection.x);
        
        // 发送击退开始事件
        this.node.emit(ComponentEvent.KNOCKBACK_START);
    }

    /**
     * 获取是否处于击退状态
     */
    public get isInKnockbackState(): boolean {
        return this.isKnockingBack;
    }

    /**
     * 击飞
     * @param force 击飞力度
     * @param direction 击飞方向（可选，如果不提供则为纯垂直击飞）
     */
    public knockup(force: number, direction?: Vec3) {
        if (force <= 0) return;
        
        // 保存击飞前的状态
        if (!this.isKnockedUp) {
            // 保存当前移动方向
            Vec3.copy(this.preKnockupDirection, this.direction);
            
            // 保存是否正在向目标移动
            this.wasMovingToTargetBeforeKnockup = this.isMovingToTarget;
            
            // 保存目标位置
            if (this.isMovingToTarget && this.targetWorldPosition) {
                this.preKnockupTargetPosition = this.targetWorldPosition.clone();
            }
        }
        
        // 暂停所有移动
        this.isMovingToTarget = false;
        this.isKnockingBack = false;
        this.move(Vec3.ZERO);
        
        // 获取当前位置信息
        const currentPos = this.node.getWorldPosition();
        this.knockupStartHeight = currentPos.y;
        this.knockupGroundHeight = manager.game.calculateGroundHeight(currentPos);
        
        // 处理击飞方向
        if (direction && !Vec3.equals(direction, Vec3.ZERO)) {
            // 有指定方向的击飞
            Vec3.copy(this.knockupDirection, direction);
            Vec3.normalize(this.knockupDirection, this.knockupDirection);
            
            // 设置水平速度，只保留水平分量
            this.knockupHorizontalVelocity.set(
                this.knockupDirection.x * force * 2,
                0,
                this.knockupDirection.z * force * 2
            );
            
            // console.log(`击飞开始 - 力度:${force}, 方向:`, this.knockupDirection, '水平速度:', this.knockupHorizontalVelocity);
        } else {
            // 纯垂直击飞
            this.knockupDirection.set(0, 0, 0);
            this.knockupHorizontalVelocity.set(0, 0, 0);
            // console.log(`纯垂直击飞 - 力度:${force}`);
        }
        
        // 设置击飞状态
        this.isKnockedUp = true;
        this.knockupVelocity = force;
        // 增加初始速度系数，让起飞更快
        this.currentYVelocity = force * 5;
        this.knockupTimer = 0;
        
        // 发送击飞开始事件
        this.node.emit(ComponentEvent.KNOCKUP_START);
    }

    public cherkArrive(wpos: Vec3){
        const distance = Vec3.distance(this.node.getWorldPosition(), wpos);
        if (distance <= this.arriveDistance) {
            return true;
        }
        return false;
    }

    /**
     * 结束击飞状态
     */
    protected endKnockup() {
        this.isKnockedUp = false;
        this.currentYVelocity = 0;
        this.knockupTimer = 0;
        
        // 不再直接恢复移动状态，而是发送事件让其他组件处理
        // 这样可以避免组件间耦合，让路径跟随组件等自己决定如何恢复移动
        
        // 发送击飞结束事件
        this.node.emit(ComponentEvent.KNOCKUP_END);
        
        // 确保影子位置正确
        this.updateShadowPosition();
    }

    /**
     * 强制结束击飞状态（当击飞时间过长时）
     */
    protected forceEndKnockup() {
        // 强制设置到地面高度
        const currentPos = this.node.getWorldPosition();
        currentPos.y = this.knockupGroundHeight + this.groundHeightOffset;
        this.node.setWorldPosition(currentPos);
        
        // 调用正常的结束流程
        this.endKnockup();
    }

    /**
     * 获取是否处于击飞状态
     */
    public get isInKnockupState(): boolean {
        return this.isKnockedUp;
    }

    /**
     * 检查是否需要使用射线检测
     */
    private needRaycastForHeight(): boolean {
        return !this.rigidBody;
    }
    
    /**
     * 更新影子位置，保持在地面高度
     * @param groundHeight 可选的地面高度，如果不提供则自动计算
     */
    private updateShadowPosition(groundHeight?: number) {
        if (!this.shadow) return;
        
        // 如果没有提供地面高度，则计算
        if (groundHeight === undefined) {
            const characterPos = this.node.getWorldPosition();
            groundHeight = manager.game.calculateGroundHeight(characterPos);
        }
        
        // 设置影子位置，保持X和Z不变，Y保持在地面
        const shadowPos = this.shadow.getWorldPosition();
        this.shadow.setWorldPosition(shadowPos.x, groundHeight, shadowPos.z);
    }

    /**
     * 更新角色高度
     */
    private updateGroundHeight() {
        // 击飞时不更新地面高度，由击飞逻辑控制
        if (this.isKnockedUp) return;
        
        if (this.needRaycastForHeight()) {
            const currentPos = this.node.getWorldPosition();
            const groundHeight = manager.game.calculateGroundHeight(currentPos);
            
            // 仅更新Y坐标，保持XZ不变
            currentPos.y = groundHeight + this.groundHeightOffset;
            this.node.setWorldPosition(currentPos);
            
            // 更新影子位置，传递已计算的地面高度
            this.updateShadowPosition(groundHeight);
        } else {
            // 如果不需要射线检测，单独更新影子位置
            this.updateShadowPosition();
        }
    }

    /**
     * 处理击飞结束后的基础移动恢复
     * 这个方法处理非路径跟随的简单移动场景
     */
    private onKnockupEndForMovement() {
        // 只在没有其他组件处理的情况下恢复基础移动状态
        // 如果有路径跟随组件，它会自己处理移动恢复
        
        // 延迟一帧执行，让其他组件先处理
        this.scheduleOnce(() => {
            // 检查是否仍然没有移动方向（说明没有其他组件处理）
            if (Vec3.equals(this.direction, Vec3.ZERO)) {
                // 恢复击飞前的移动状态
                if (this.wasMovingToTargetBeforeKnockup && this.preKnockupTargetPosition) {
                    this.isMovingToTarget = true;
                    if (!this.targetWorldPosition) {
                        this.targetWorldPosition = this.preKnockupTargetPosition.clone();
                    }
                    
                    // 重新计算移动方向并调用move方法触发状态变化事件
                    Vec3.subtract(this.tempVec3, this.targetWorldPosition, this.node.getWorldPosition());
                    if (!Vec3.equals(this.tempVec3, Vec3.ZERO)) {
                        Vec3.normalize(this.tempVec3, this.tempVec3);
                        this.move(this.tempVec3);
                    } else {
                        this.move(Vec3.ZERO);
                    }
                }
            }else{
                this.move(Vec3.ZERO);
            }
        }, 0);
    }

    /**
     * 处理击退结束后的基础移动恢复
     * 这个方法处理非路径跟随的简单移动场景
     */
    private onKnockbackEndForMovement() {
        // 只在没有其他组件处理的情况下恢复基础移动状态
        // 如果有路径跟随组件，它会自己处理移动恢复
        
        // 延迟一帧执行，让其他组件先处理
        this.scheduleOnce(() => {
            if(this._character.healthComponent.isDead){
                return;
            }
            // 检查是否仍然没有移动方向（说明没有其他组件处理）
            if (Vec3.equals(this.direction, Vec3.ZERO)) {
                // 恢复击退前的移动状态
                if (this.wasMovingToTarget && this.preKnockbackTargetPosition) {
                    this.isMovingToTarget = true;
                    if (!this.targetWorldPosition) {
                        this.targetWorldPosition = this.preKnockbackTargetPosition.clone();
                    }
                    
                    // 重新计算移动方向
                    Vec3.subtract(this.tempVec3, this.targetWorldPosition, this.node.getWorldPosition());
                    if (!Vec3.equals(this.tempVec3, Vec3.ZERO)) {
                        Vec3.normalize(this.tempVec3, this.tempVec3);
                        this.move(this.tempVec3);
                    } else {
                        this.move(Vec3.ZERO);
                    }
                }
            }else{
                this.move(Vec3.ZERO);
            }
        }, 0);
    }
}