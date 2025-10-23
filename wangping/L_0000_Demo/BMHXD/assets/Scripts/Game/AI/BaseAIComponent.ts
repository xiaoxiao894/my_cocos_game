import { _decorator, Component, CCFloat, Node } from 'cc';
import { Character } from '../Role/Character';
import { BaseComponet } from '../Components/BaseComponet';

const { ccclass, property } = _decorator;

/**
 * AI目标信息接口
 */
export interface AITarget {
    node: Node;
    priority: number;        // 优先级，数值越高优先级越高
    distance: number;        // 距离
    lastSeenTime: number;    // 最后发现时间
}

/**
 * AI组件基类
 * 提供最基础的AI功能框架，适用于所有类型的AI角色
 */
@ccclass('BaseAIComponent')
export abstract class BaseAIComponent extends BaseComponet {
    
    @property({
        type: CCFloat,
        displayName: '决策间隔',
        range: [0.01, 2],
        tooltip: 'AI决策更新的时间间隔（秒）'
    })
    protected decisionInterval: number = 0.2;

    protected _character: Character = null;
    
    /** 当前目标 */
    protected currentTarget: AITarget | null = null;
    
    /** 决策计时器 */
    protected decisionTimer: number = 0;
    
    /** 是否启用AI */
    protected aiEnabled: boolean = true;

    public get AIEnabled(): boolean {
        return this.aiEnabled;
    }

    public set AIEnabled(value: boolean) {
        this.aiEnabled = value;

    }
    onLoad() {
        super.onLoad();
        this.initializeAI();
        this.setupStateMachine();
        this.registerEvents();
    }

    onDestroy() {
        this.unregisterEvents();
    }

    public reset(): void {
        this.currentTarget = null;
        this.decisionTimer = 0;
        this.aiEnabled = true;
    }

    /**
     * 初始化AI组件
     * 子类可重写此方法进行自定义初始化
     */
    protected initializeAI() {
        this._character = this.node.getComponent(Character);
        this.currentTarget = null;
    }

    /**
     * 注册事件监听
     */
    protected registerEvents() {
        
    }

    /**
     * 注销事件监听
     */
    protected unregisterEvents() {
        
    }

    update(dt: number) {
        if (!this.aiEnabled) return;
        // 更新决策逻辑
        this.updateDecision(dt);
    }

    /**
     * 更新决策逻辑
     */
    protected updateDecision(dt: number) {
        this.decisionTimer += dt;
        
        if (this.decisionTimer >= this.decisionInterval) {
            this.decisionTimer = 0;
            this.makeDecision();
        }
    }

    /**
     * AI决策核心逻辑
     * 子类必须重写此方法实现具体的决策逻辑
     */
    protected abstract makeDecision(): void;

    /**
     * 设置状态机
     * 子类可重写此方法添加自定义状态
     */
    protected abstract setupStateMachine(): void;
    // ==================== 状态机回调方法 ====================
} 