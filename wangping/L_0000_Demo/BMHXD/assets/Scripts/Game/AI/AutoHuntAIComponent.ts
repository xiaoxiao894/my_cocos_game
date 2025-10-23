import { _decorator, Vec3, CCFloat, game } from 'cc';
import { BaseAIComponent, AITarget } from './BaseAIComponent';
import { StateMachine } from '../StateMachine/StateMachine';
import { CharacterState } from '../../common/CommonEnum';
import { Character } from '../Role/Character';
import { ComponentEvent } from '../../common/ComponentEvents';
import { HealthComponent } from '../Components/HealthComponent';

const { ccclass, property } = _decorator;

/**
 * 自动追击敌人状态枚举
 */
export enum AutoHuntState {
    Idle = 'idle',           // 空闲状态
    Patrol = 'patrol',       // 巡逻状态
    Hunt = 'hunt',           // 追击状态
    Attack = 'attack',       // 攻击状态
    Return = 'return'        // 返回状态
}

/**
 * 自动追击AI组件
 * 实现自动寻找敌人、追击和攻击的功能
 */
@ccclass('AutoHuntAIComponent')
export class AutoHuntAIComponent extends BaseAIComponent {
    
    @property({
        type: CCFloat,
        displayName: '搜索半径',
        range: [1, 50],
        tooltip: '搜索敌人的半径范围'
    })
    protected searchRadius: number = 10;

    @property({
        type: CCFloat,
        displayName: '追击距离',
        range: [1, 100],
        tooltip: '开始追击敌人的最大距离'
    })
    protected huntRange: number = 15;

    @property({
        type: CCFloat,
        displayName: '脱离距离',
        range: [1, 100],
        tooltip: '超过此距离会放弃追击'
    })
    protected maxHuntDistance: number = 20;

    @property({
        displayName: '启用巡逻',
        tooltip: '是否在空闲时进行巡逻'
    })
    protected enablePatrol: boolean = false;

    @property({
        type: CCFloat,
        displayName: '巡逻半径',
        range: [1, 20],
        tooltip: '巡逻的范围半径'
    })
    protected patrolRadius: number = 5;

    @property({
        type: CCFloat,
        displayName: '巡逻停留时间',
        range: [1, 10],
        tooltip: '到达巡逻点后的停留时间'
    })
    protected patrolWaitTime: number = 2;

    /** 状态机 */
    private _stateMachine: StateMachine<AutoHuntState> = new StateMachine<AutoHuntState>();
    
    /** 初始位置 */
    private _initialPosition: Vec3 = new Vec3();
    
    /** 当前巡逻目标位置 */
    private _patrolTarget: Vec3 = new Vec3();
    
    /** 巡逻等待计时器 */
    private _patrolWaitTimer: number = 0;
    
    /** 搜索计时器 */
    private _searchTimer: number = 0;
    
    /** 搜索间隔 */
    private readonly _searchInterval: number = 0.5;

    protected initializeAI() {
        super.initializeAI();
        
        // 记录初始位置
        this._initialPosition.set(this.node.getWorldPosition());
    }

    setInitialPosition(pos: Vec3): void {
        this._initialPosition.set(pos);
    }

    update(dt: number) {
        super.update(dt);
        if(!this.aiEnabled) return;
        this._stateMachine.update(dt);
        
        // 更新搜索计时器
        this._searchTimer += dt;
    }

    protected makeDecision(): void {
        // 定期搜索敌人
        if (this._searchTimer >= this._searchInterval) {
            this._searchTimer = 0;
            this.searchForEnemies();
        }

        // 根据当前状态执行决策
        switch (this._stateMachine.currentState) {
            case AutoHuntState.Idle:
                this.handleIdleDecision();
                break;
            case AutoHuntState.Patrol:
                this.handlePatrolDecision();
                break;
            case AutoHuntState.Hunt:
                this.handleHuntDecision();
                break;
            case AutoHuntState.Attack:
                this.handleAttackDecision();
                break;
            case AutoHuntState.Return:
                this.handleReturnDecision();
                break;
        }
    }

    protected setupStateMachine(): void {
        // 注册空闲状态
        this._stateMachine.registerState(AutoHuntState.Idle, {
            onEnter: () => this.onIdleEnter(),
            onUpdate: (dt: number) => this.onIdleUpdate(dt),
            onExit: () => this.onIdleExit(),
        });

        // 注册巡逻状态
        this._stateMachine.registerState(AutoHuntState.Patrol, {
            onEnter: () => this.onPatrolEnter(),
            onUpdate: (dt: number) => this.onPatrolUpdate(dt),
            onExit: () => this.onPatrolExit(),
        });

        // 注册追击状态
        this._stateMachine.registerState(AutoHuntState.Hunt, {
            onEnter: () => this.onHuntEnter(),
            onUpdate: (dt: number) => this.onHuntUpdate(dt),
            onExit: () => this.onHuntExit(),
        });

        // 注册攻击状态
        this._stateMachine.registerState(AutoHuntState.Attack, {
            onEnter: () => this.onAttackEnter(),
            onUpdate: (dt: number) => this.onAttackUpdate(dt),
            onExit: () => this.onAttackExit(),
        });

        // 注册返回状态
        this._stateMachine.registerState(AutoHuntState.Return, {
            onEnter: () => this.onReturnEnter(),
            onUpdate: (dt: number) => this.onReturnUpdate(dt),
            onExit: () => this.onReturnExit(),
        });
        
        this._stateMachine.changeState(AutoHuntState.Idle);
    }

    /**
     * 搜索敌人
     */
    private searchForEnemies(): void {
        const targets = this.character.searchForAttackTarget(this.searchRadius);

        for(let i = 0; i < targets.length; i++){
            const target = targets[i];
            if(target && manager.game.isCanHunted(target.node)){
                // 检查目标是否已死亡
                const healthComponent = target.node.getComponent(HealthComponent);
                if (healthComponent && healthComponent.isDead) {
                    continue; // 跳过已死亡的目标
                }
                
                this.currentTarget = {
                    node: target.node,
                    priority: 1,
                    distance: Math.sqrt(target.squaredDistance),
                    lastSeenTime: Date.now()
                };
                break;
            }
        }
    }

    /**
     * 生成随机巡逻点（进行安全位置检测）
     */
    private generatePatrolPoint(): Vec3 {
        const maxAttempts = 20; // 最大重试次数
        let attempts = 0;
        
        while (attempts < maxAttempts) {
            attempts++;
            
            // 生成随机角度和距离
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * this.patrolRadius;
            
            // 计算巡逻点位置
            const patrolPoint = new Vec3();
            patrolPoint.x = this._initialPosition.x + Math.cos(angle) * distance;
            patrolPoint.z = this._initialPosition.z + Math.sin(angle) * distance;
            patrolPoint.y = this._initialPosition.y;
            
            // 检测位置是否安全（不在家触发器范围内）
            if (manager.enemy && manager.enemy.isPositionSafeFromHome(patrolPoint)) {
                // console.log(`巡逻点安全位置生成成功，尝试次数: ${attempts}`);
                return patrolPoint;
            }
        }
        
        // 如果超过最大尝试次数，返回初始位置作为后备方案
        console.warn(`巡逻点安全位置生成失败，使用初始位置，总尝试次数: ${attempts}`);
        return this._initialPosition.clone();
    }

    // ==================== 决策处理方法 ====================

    private handleIdleDecision(): void {
        if (this.currentTarget) {
            this._stateMachine.changeState(AutoHuntState.Hunt);
        } else if (this.enablePatrol) {
            this._stateMachine.changeState(AutoHuntState.Patrol);
        }
    }

    private handlePatrolDecision(): void {
        if (this.currentTarget) {
            this._stateMachine.changeState(AutoHuntState.Hunt);
            return;
        }

        // 检查是否到达巡逻点
        const currentPos = this.node.getWorldPosition();
        const distance = Vec3.distance(currentPos, this._patrolTarget);
        
        if (distance <= this.character.movementComponent.ArriveDistance) {
            // 到达巡逻点，等待一段时间后选择新的巡逻点
            this._patrolWaitTimer += this.decisionInterval;
            if (this._patrolWaitTimer >= this.patrolWaitTime) {
                this._patrolTarget = this.generatePatrolPoint();
                this.character.movementComponent.moveToWorldPosition(this._patrolTarget);
                this._patrolWaitTimer = 0;
            }
        }
    }

    private handleHuntDecision(): void {
        if (!this.currentTarget || !this.currentTarget.node.isValid) {
            this.currentTarget = null;
            this._stateMachine.changeState(AutoHuntState.Return);
            return;
        }

        // 检查目标是否已死亡
        const healthComponent = this.currentTarget.node.getComponent(HealthComponent);
        if (healthComponent && healthComponent.isDead) {
            this.currentTarget = null;
            this._stateMachine.changeState(AutoHuntState.Idle); // 重新寻找新目标
            return;
        }

        // 检查当前目标是否还能被追击
        if (!manager.game.isCanHunted(this.currentTarget.node)) {
            this.currentTarget = null;
            this._stateMachine.changeState(AutoHuntState.Return);
            return;
        }

        const currentPos = this.node.getWorldPosition();
        const targetPos = this.currentTarget.node.getWorldPosition();
        const distance = Vec3.distance(currentPos, targetPos);

        // 更新目标距离
        this.currentTarget.distance = distance;

        // 检查是否超出最大追击距离
        if (distance > this.maxHuntDistance) {
            this.currentTarget = null;
            this._stateMachine.changeState(AutoHuntState.Return);
            return;
        }

        // 检查是否到达攻击距离
        const attackRange = this.character.attackComponent.attackRangeValue;
        if (distance <= attackRange) {
            this._stateMachine.changeState(AutoHuntState.Attack);
        }
    }

    private handleAttackDecision(): void {
        if (!this.currentTarget || !this.currentTarget.node.isValid) {
            this.currentTarget = null;
            this._stateMachine.changeState(AutoHuntState.Return);
            return;
        }

        // 检查目标是否已死亡
        const healthComponent = this.currentTarget.node.getComponent(HealthComponent);
        if (healthComponent && healthComponent.isDead) {
            this.currentTarget = null;
            this._stateMachine.changeState(AutoHuntState.Idle); // 重新寻找新目标
            return;
        }

        // 检查当前目标是否还能被攻击
        if (!manager.game.isCanHunted(this.currentTarget.node)) {
            this.currentTarget = null;
            this._stateMachine.changeState(AutoHuntState.Return);
            return;
        }

        const currentPos = this.node.getWorldPosition();
        const targetPos = this.currentTarget.node.getWorldPosition();
        const distance = Vec3.distance(currentPos, targetPos);
        const attackRange = this.character.attackComponent.attackRangeValue;

        // 如果敌人离开攻击范围，继续追击
        if (distance > attackRange) {
            this._stateMachine.changeState(AutoHuntState.Hunt);
        }
    }

    private handleReturnDecision(): void {
        const currentPos = this.node.getWorldPosition();
        const distance = Vec3.distance(currentPos, this._initialPosition);
        
        // 如果已经回到初始位置附近
        if (distance <= this.character.movementComponent.ArriveDistance) {
            this._stateMachine.changeState(AutoHuntState.Idle);
        }
    }

    // ==================== 状态回调方法 ====================

    private onIdleEnter(): void {
        this.character.movementComponent.stopMovingToTarget();
    }

    private onIdleUpdate(dt: number): void {
        // 空闲状态的更新逻辑
    }

    private onIdleExit(): void {
        // 退出空闲状态的清理工作
    }

    private onPatrolEnter(): void {
        this._patrolTarget = this.generatePatrolPoint();
        this.character.movementComponent.moveToWorldPosition(this._patrolTarget);
        this._patrolWaitTimer = 0;
    }

    private onPatrolUpdate(dt: number): void {
        // 巡逻状态的更新逻辑
    }

    private onPatrolExit(): void {
        this.character.movementComponent.stopMovingToTarget();
    }

    private onHuntEnter(): void {
        if (this.currentTarget) {
            const targetPos = this.currentTarget.node.getWorldPosition();
            this.character.movementComponent.moveToWorldPosition(targetPos);
        }
    }

    private onHuntUpdate(dt: number): void {
        // 持续追踪目标位置
        if (this.currentTarget && this.currentTarget.node.isValid && !this.currentTarget.node.getComponent(HealthComponent)?.isDead) {
            // 检查目标是否还能被追击
            if (!manager.game.isCanHunted(this.currentTarget.node)) {
                this.currentTarget = null;
                this._stateMachine.changeState(AutoHuntState.Return);
                return;
            }
            
            const targetPos = this.currentTarget.node.getWorldPosition();
            this.character.movementComponent.moveToWorldPosition(targetPos);
        }
    }

    private onHuntExit(): void {
        // 退出追击状态
    }

    private onAttackEnter(): void {
        this.character.movementComponent.stopMovingToTarget();
    }

    private onAttackUpdate(dt: number): void {
        // 朝向目标并攻击
        if (this.currentTarget && this.currentTarget.node.isValid && !this.currentTarget.node.getComponent(HealthComponent)?.isDead) {
            // 检查目标是否还能被攻击
            if (!manager.game.isCanHunted(this.currentTarget.node)) {
                this.currentTarget = null;
                this._stateMachine.changeState(AutoHuntState.Return);
                return;
            }
            
            // 朝向目标
            const currentPos = this.node.getWorldPosition();
            const targetPos = this.currentTarget.node.getWorldPosition();
            const direction = new Vec3();
            Vec3.subtract(direction, targetPos, currentPos);
            direction.normalize();
            
            // this.character.movementComponent.updateFaceDirectionFrom3D(direction);
            this.node.emit(ComponentEvent.SET_FACE_DIRECTION_FROM_3D, direction);
            
            // 尝试攻击
            if (this.character.attackComponent.canAttack()) {
                this.character.attack();
            }
        }
    }

    private onAttackExit(): void {
        // 退出攻击状态
    }

    private onReturnEnter(): void {
        this.character.movementComponent.moveToWorldPosition(this._initialPosition);
    }

    private onReturnUpdate(dt: number): void {
        // 返回状态的更新逻辑
    }

    private onReturnExit(): void {
        // 退出返回状态
    }

    // ==================== 公共方法 ====================

    /**
     * 设置搜索半径
     */
    public setSearchRadius(radius: number): void {
        this.searchRadius = radius;
    }

    /**
     * 设置追击距离
     */
    public setHuntRange(range: number): void {
        this.huntRange = range;
    }

    /**
     * 启用/禁用AI
     */
    public setAIEnabled(enabled: boolean): void {
        this.aiEnabled = enabled;
        // console.warn('setAIEnabled', enabled);
        if (!enabled) {
            this.currentTarget = null;
            this._stateMachine.changeState(AutoHuntState.Idle);
        }
    }

    /**
     * 获取当前状态
     */
    public getCurrentState(): AutoHuntState {
        return this._stateMachine.currentState;
    }

    /**
     * 强制切换到指定状态
     */
    public forceChangeState(state: AutoHuntState): void {
        this._stateMachine.changeState(state);
    }

    /**
     * 设置是否启用巡逻
     */
    public setPatrolEnabled(enabled: boolean): void {
        this.enablePatrol = enabled;
    }

    /**
     * 设置巡逻参数
     */
    public setPatrolParams(radius: number, waitTime: number): void {
        this.patrolRadius = radius;
        this.patrolWaitTime = waitTime;
    }

    /**
     * 设置最大追击距离
     */
    public setMaxHuntDistance(distance: number): void {
        this.maxHuntDistance = distance;
    }

    /**
     * 获取当前目标
     */
    public getCurrentTarget(): AITarget | null {
        return this.currentTarget;
    }

    /**
     * 清除当前目标
     */
    public clearTarget(): void {
        this.currentTarget = null;
        this._stateMachine.changeState(AutoHuntState.Idle);
    }

    /**
     * 获取初始位置
     */
    public getInitialPosition(): Vec3 {
        return this._initialPosition.clone();
    }

    /**
     * 重置到初始位置
     */
    public resetToInitialPosition(): void {
        this._initialPosition.set(this.node.getWorldPosition());
        this._stateMachine.changeState(AutoHuntState.Idle);
    }

    public reset(): void {
        super.reset();
        this.currentTarget = null;
        this._stateMachine.changeState(AutoHuntState.Idle);
    }
} 