import { _decorator, Component, Node, Collider, ICollisionEvent, NodeEventType } from 'cc';
import { HealthComponent } from '../Components/HealthComponent';
import { MovementComponent } from '../Components/MovementComponent';
import { AttackComponent } from '../Components/AttackComponent';
import { StateComponent } from '../Components/StateComponent';
import { CharacterState, FrameEventId } from '../../common/CommonEnum';
import { ComponentEvent } from '../../common/ComponentEvents';
import { ComponentInitializer } from '../../common/ComponentInitializer';
import { Vec3 } from 'cc';
import { BaseAnimationComponent } from '../Components/BaseAnimationComponent';
import { DamageData } from '../../common/CommonInterface';

const { ccclass, property } = _decorator;

/**
 * 角色组件 - 基于组件化设计的角色基类
 */
@ccclass('Character')
export abstract class Character extends Component {
    @property({type: HealthComponent, displayName: '健康组件'})
    public healthComponent: HealthComponent = null!;

    @property({type: MovementComponent, displayName: '移动组件'})
    public movementComponent: MovementComponent = null!;

    @property({type: AttackComponent, displayName: '攻击组件'})
    public attackComponent: AttackComponent = null!;

    @property({type: BaseAnimationComponent, displayName: '动画组件'})
    public animationComponent: BaseAnimationComponent = null!;

    @property({type: StateComponent, displayName: '状态组件'})
    public stateComponent: StateComponent = null!;

    @property({type: Node, displayName: 'UI节点', tooltip: '需要始终面向Z轴的UI节点'})
    public uiNode: Node = null!;

    /** 碰撞器组件 */
    protected collider: Collider|null = null;

    onLoad() {
        this.initComponents();
        this.registerComponentEvents();
        this.initCollider();
        this.registerEvents();
    }

    /**
     * 初始化组件引用
     */
    protected initComponents() {
        
        // 使用组件初始化器简化组件获取和创建
        ComponentInitializer.initComponents(this.node, 
        {
            healthComponent: HealthComponent,
            movementComponent: MovementComponent,
            attackComponent: AttackComponent,
            stateComponent: StateComponent
        }, 
        this);
    }
    /**
     * 注册组件事件监听
     */
    protected registerComponentEvents() {
        // 设置健康组件关联
        this.healthComponent.node.on(ComponentEvent.DEAD, this.onDead, this);
        this.healthComponent.node.on(ComponentEvent.HURT, this.onHurt, this);
        
        // 设置移动组件关联
        this.movementComponent.node.on(ComponentEvent.TARGET_REACHED, this.onTargetReached, this);
        this.movementComponent.node.on(ComponentEvent.MOVE_STATE_UPDATE, this.onMoveStateUpdate, this);
        
        // 设置攻击组件关联
        this.attackComponent.node.on(ComponentEvent.ATTACK_START, this.onAttackStart, this);
        this.attackComponent.node.on(ComponentEvent.ATTACK_ANI_END, this.onAttackEnd, this);
        this.attackComponent.node.on(ComponentEvent.PERFORM_ATTACK, this.onPerformAttack, this);
        
        // 设置动画组件关联
        this.animationComponent.node.on(ComponentEvent.ANIMATION_COMPLETE, this.onAnimationComplete, this);
        
        // 设置状态组件回调
        this.setupStateCallbacks();
    }

    /**
     * 设置状态回调
     */
    protected setupStateCallbacks() {
        this.stateComponent.setStateEnterCallback(CharacterState.Idle, this.onIdleEnter.bind(this));
        this.stateComponent.setStateUpdateCallback(CharacterState.Idle, this.onIdleUpdate.bind(this));
        
        this.stateComponent.setStateEnterCallback(CharacterState.Move, this.onMoveEnter.bind(this));
        this.stateComponent.setStateUpdateCallback(CharacterState.Move, this.onMoveUpdate.bind(this));
        this.stateComponent.setStateExitCallback(CharacterState.Move, this.onMoveExit.bind(this));
        
        this.stateComponent.setStateEnterCallback(CharacterState.Attack, this.onAttackEnter.bind(this));
        this.stateComponent.setStateUpdateCallback(CharacterState.Attack, this.onAttackUpdate.bind(this));
        this.stateComponent.setStateExitCallback(CharacterState.Attack, this.onAttackExit.bind(this));
        
        this.stateComponent.setStateEnterCallback(CharacterState.Skill, this.onSkillEnter.bind(this));
        this.stateComponent.setStateUpdateCallback(CharacterState.Skill, this.onSkillUpdate.bind(this));
        this.stateComponent.setStateExitCallback(CharacterState.Skill, this.onSkillExit.bind(this));
        
        this.stateComponent.setStateEnterCallback(CharacterState.Dead, this.onDeadEnter.bind(this));
        this.stateComponent.setStateUpdateCallback(CharacterState.Dead, this.onDeadUpdate.bind(this));
    }

    /**
     * 初始化碰撞器
     */
    protected initCollider() {
        this.collider = this.getComponent(Collider);
    }

    /**
     * 注册事件
     */
    protected registerEvents() {
        if (this.collider) {
            this.collider.on('onCollisionEnter', this.onCollisionEnter, this);
        }
        this.node.on(NodeEventType.TRANSFORM_CHANGED, this.onTransformChanged, this);
    }


    protected onTransformChanged() {
        if(this.uiNode){
            this.uiNode?.setWorldRotationFromEuler(0,0,0);
        }
    }

    /**
     * 注销事件
     */
    protected unregisterEvents() {
        if (this.collider) {
            this.collider.off('onCollisionEnter', this.onCollisionEnter, this);
        }
        this.node.off(NodeEventType.TRANSFORM_CHANGED, this.onTransformChanged, this);
        
        // 注销组件事件
        this.healthComponent.node.off(ComponentEvent.DEAD, this.onDead, this);
        this.healthComponent.node.off(ComponentEvent.HURT, this.onHurt, this);
        
        this.movementComponent.node.off(ComponentEvent.TARGET_REACHED, this.onTargetReached, this);
        this.movementComponent.node.off(ComponentEvent.MOVE_STATE_UPDATE, this.onMoveStateUpdate, this);
        
        this.attackComponent.node.off(ComponentEvent.ATTACK_START, this.onAttackStart, this);
        this.attackComponent.node.off(ComponentEvent.ATTACK_ANI_END, this.onAttackEnd, this);
        this.attackComponent.node.off(ComponentEvent.PERFORM_ATTACK, this.onPerformAttack, this);
        
        this.animationComponent.node.off(ComponentEvent.ANIMATION_COMPLETE, this.onAnimationComplete, this);
    }
    
    update(dt: number) {
        // 各组件的update已在组件内部实现
    }

    // 状态回调方法 ===========================

    /**
     * 空闲状态进入回调
     */
    protected onIdleEnter() {
        this.animationComponent.playIdle();
    }

    /**
     * 空闲状态更新回调
     */
    protected onIdleUpdate(dt: number) {
        // 子类可重写
        if(!this.animationComponent.isPlayingAnimation() == true || this.animationComponent.getCurrentAnimationName() != this.animationComponent.IdleAnimName){
            this.animationComponent.playIdle();
        }

        if(this.movementComponent.isMoving){
            this.stateComponent.changeState(CharacterState.Move);
        }
    }

    /**
     * 移动状态进入回调
     */
    protected onMoveEnter() {
        this.animationComponent.playMove();
    }

    /**
     * 移动状态更新回调
     */
    protected onMoveUpdate(dt: number) {
        // 子类可重写
        if(this.animationComponent.isPlayingAnimation() != true || this.animationComponent.getCurrentAnimationName() != this.animationComponent.MoveAnimName){
            this.animationComponent.playMove();
        }
    }

    /**
     * 移动状态退出回调
     */
    protected onMoveExit() {
        // 子类可重写
    }

    /**
     * 攻击状态进入回调
     */
    protected onAttackEnter() {
        this.startAttackAnimation();
        this.movementComponent.IsKeepFace = true;
    }

    /**
     * 开始攻击动画
     */
    protected startAttackAnimation() {
        // 计算攻击动画的timeScale
        const attackTimeScale = this.calculateAttackTimeScale(this.animationComponent.AttackAnimName);
        
        // 清除之前的帧事件（避免重复添加）
        this.animationComponent.clearFrameEvents();
        
        // 添加攻击帧事件，在指定进度时触发攻击伤害
        this.animationComponent.addAttackFrameEvent(
            this.attackComponent.attackDamageExecuteTime,
            () => {
                this.attackComponent.performAttack();
            },
            FrameEventId.ATTACK_DAMAGE,
            true
        );
        
        // 播放攻击动画
        this.animationComponent.playAttack(attackTimeScale, false);
    }

    /**
     * 根据攻击冷却时间和动画时长计算timeScale
     * @returns 计算得到的timeScale值
     */
    protected calculateAttackTimeScale(attAnimName:string): number {
        // 获取攻击动画时长
        const baseAnimDuration = this.animationComponent.getAnimationDuration(attAnimName);
        if (baseAnimDuration <= 0 || this.attackComponent.attackCooldownTime <= 0) {
            return 1.0; // 默认值
        }

        // 如果冷却时间小于动画时长，需要加速动画以实现连续播放
        if (this.attackComponent.attackCooldownTime < baseAnimDuration) {
            // 计算时间缩放，确保动画时长匹配攻击冷却时间
            return baseAnimDuration / this.attackComponent.attackCooldownTime;
        }
        
        // 如果冷却时间大于等于动画时长，正常播放
        return 1.0;
    }

    /**
     * 攻击状态更新回调
     */
    protected onAttackUpdate(dt: number) {
        // 如果动画播放完毕，处理攻击后续逻辑
        if (!this.animationComponent.isPlayingAnimation()) {
            this.handleAttackComplete();
        }
        
        const target = this.GetAttackTarget();
        if(target){
            this.attackComponent.updateAttackTarget(target);
        }else{
            this.waitForAttackCooldown();
        }
        // 子类可重写实现其他攻击更新逻辑
    }

    /**
     * 处理攻击完成后的逻辑
     */
    private handleAttackComplete() {
        const target = this.GetAttackTarget();
        
        // 如果有目标且可以攻击，继续攻击
        if (target && this.attackComponent.canAttack()) {
            this.continueAttack();
        } 
        // 如果有目标但还在冷却，根据冷却时间和动画时长的关系决定行为
        else if (target && !this.attackComponent.canAttack()) {
            this.waitForAttackCooldown();
        } 
        // 没有目标，退出攻击状态
        else {
            this.exitAttackState();
        }
    }

    /**
     * 继续攻击（连续攻击）
     */
    private continueAttack() {
        if (this.attackComponent.attack()) {
            this.startAttackAnimation();
        }
    }

    /**
     * 等待攻击冷却
     */
    private waitForAttackCooldown() {
        // // 获取攻击动画基础时长
        // let baseAnimDuration = 0;
        // if(this.animationComponent.getCurrentAnimationName() === this.animationComponent.AttackAnimName){
        //     baseAnimDuration = this.animationComponent.getAnimationDuration(this.animationComponent.AttackAnimName);
        // }else if(this.animationComponent.getCurrentAnimationName() === this.animationComponent.RunAttackAnimName){
        //     baseAnimDuration = this.animationComponent.getAnimationDuration(this.animationComponent.RunAttackAnimName);
        // }
        // if(baseAnimDuration <= 0){
        //     return;
        // }
        
        // // 如果冷却时间小于动画时长，保持攻击状态等待冷却
        // // 这种情况下动画已经被加速，会连续播放
        // if (this.attackComponent.attackCooldownTime < baseAnimDuration) {
        //     // 保持攻击状态，在下一帧update中会继续检查冷却状态
        //     return;
        // }
        
        // 如果冷却时间大于等于动画时长，切换到idle状态
        // 避免在攻击状态下没有动画播放的空档期
        if(this.movementComponent.isMoving){
            this.stateComponent.changeState(CharacterState.Move);
        }else{
            this.stateComponent.changeState(CharacterState.Idle);
        }
    }

    /**
     * 退出攻击状态
     */
    private exitAttackState() {
        if (this.movementComponent.isMoving) {
            this.stateComponent.changeState(CharacterState.Move);
        } else {
            this.stateComponent.changeState(CharacterState.Idle);
        }
    }

    /**
     * 攻击状态退出回调
     */
    protected onAttackExit() {
        // 清理攻击相关的帧事件
        this.animationComponent.clearFrameEvents();
        // 子类可重写
        this.movementComponent.IsKeepFace = false;
    }

    /**
     * 死亡状态进入回调
     */
    protected onDeadEnter() {
        this.animationComponent.playDead();
        // 发送角色停止事件
        this.node.emit(ComponentEvent.CHARACTER_STOP);
    }

    /**
     * 死亡状态更新回调
     */
    protected onDeadUpdate(dt: number) {
        // 子类可重写
    }

    // 事件回调方法 ===========================

    /**
     * 动画完成回调
     */
    protected onAnimationComplete(animName: string) {
    }

    /**
     * 受伤回调
     */
    protected onHurt(damageData: DamageData) {
        // 子类可重写
    }

    /**
     * 死亡回调
     */
    protected onDead() {
        this.scheduleOnce(() => {
            this.movementComponent.setRigidBodyEnabled(false);
        });
        this.node.emit(ComponentEvent.CHANGE_STATE, CharacterState.Dead);
        this.animationComponent.playDissolve();
    }

    /**
     * 攻击开始回调
     */
    protected onAttackStart() {
    }

    /**
     * 攻击结束回调 - 简化版本
     */
    protected onAttackEnd() {
        // 攻击逻辑已经统一移到 handleAttackComplete 中处理
        // 子类可重写实现特殊逻辑
    }

    /**
     * 执行攻击回调
     */
    protected onPerformAttack(damageData: DamageData) {
        // 子类根据需要实现攻击逻辑
    }

    /**
     * 移动状态改变回调
     */
    protected onMoveStateUpdate(isMoving: boolean) {
        if (this.stateComponent.getCurrentState() === CharacterState.Dead) {
            return;
        }
        
        // Character基类中移动会打断攻击
        if(isMoving){
            if(this.stateComponent.getCurrentState() != CharacterState.Move){
                this.stateComponent.changeState(CharacterState.Move);
            }
        }else{
            if(this.stateComponent.getCurrentState() != CharacterState.Idle){
                this.stateComponent.changeState(CharacterState.Idle);
            }
        }
    }

    /**
     * 目标到达回调
     */
    protected onTargetReached() {
        // 子类可重写
    }

    /**
     * 碰撞事件回调
     */
    protected onCollisionEnter(event: ICollisionEvent) {
        // 子类可重写
    }

    // 添加技能状态回调方法

    /**
     * 技能状态进入回调
     */
    protected onSkillEnter() {
        // 子类可重写
    }

    /**
     * 技能状态更新回调
     */
    protected onSkillUpdate(dt: number) {
        // 子类可重写
    }

    /**
     * 技能状态退出回调
     */
    protected onSkillExit() {
        // 子类可重写
    }

    // 公共接口方法 ===========================

    /**
     * 移动角色
     * @param direction 移动方向
     */
    public move(direction: Vec3) {
        if (this.stateComponent.getCurrentState() === CharacterState.Dead) {
            return;
        }
        
        // 发送角色移动事件
        this.node.emit(ComponentEvent.CHARACTER_MOVE, direction);
    }

    /**
     * 移动到世界坐标位置
     * @param targetPos 目标位置
     */
    public moveToWorldPosition(targetPos: Vec3) {
        if (this.stateComponent.getCurrentState() === CharacterState.Dead) {
            return;
        }
        
        // 发送移动到位置事件
        this.node.emit(ComponentEvent.MOVE_TO_POSITION, targetPos);
    }

    /**
     * 停止移动
     */
    public stopMoving() {
        // 发送角色停止事件
        this.node.emit(ComponentEvent.CHARACTER_STOP);
    }

    /**
     * 获取攻击目标
     * @returns 攻击目标
     */
    public abstract GetAttackTarget(): Node | null;

    /**
     * 执行攻击
     */
    public attack() {
        if (this.stateComponent.getCurrentState() === CharacterState.Dead) {
            return;
        }
        
        // 直接调用攻击组件，减少事件传递（方案二）
        if (this.attackComponent.attack()) {
            // 攻击成功，直接切换状态
            this.stateComponent.changeState(CharacterState.Attack);
        }
    }

    /**
     * 击退
     * @param pos 击退位置
     * @param force 击退力
     */
    public knockback(pos: Vec3, force: number) {
        // 发送角色击退事件
        this.node.emit(ComponentEvent.CHARACTER_KNOCKBACK, { pos, force });
    }

    /**
     * 击飞
     * @param force 击飞力度
     */
    public knockup(force: number) {
        // 发送角色击飞事件
        this.node.emit(ComponentEvent.CHARACTER_KNOCKUP, force);
    }

    /**
     * 搜索敌人
     */
    public searchForAttackTarget(searchRadius: number): { node: Node; squaredDistance: number }[] {
        return [];
    }

    /**
     * 重置角色状态
     */
    public reset() {
        this.healthComponent.reset();
        this.movementComponent.reset();
        this.attackComponent.reset();
        this.stateComponent.reset();
        this.animationComponent.reset();
    }

    onDestroy() {
        this.unregisterEvents();
    }
} 