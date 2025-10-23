import { _decorator, Color, color, ICollisionEvent, ITriggerEvent, Node, tween, UIOpacity, Vec3, PhysicsSystem, geometry } from 'cc';
import { Character } from './Character';
import { ComponentEvent } from '../../common/ComponentEvents';

const { ccclass, property } = _decorator;

/**
 * 敌人角色类 - 展示重构后的事件系统使用
 */
@ccclass('Enemy')
export class Enemy extends Character {
    // @property(EnemyAI)  
    // ai: EnemyAI = null!;

    onLoad(): void {
        super.onLoad();
        manager.enemy.addEnemy(this.node);
    }

    protected initComponents() {
        super.initComponents();
    }

    protected registerComponentEvents() {
        super.registerComponentEvents();
        
        // 注册目标追踪组件事件（无需设置回调函数）
        // 目标追踪组件现在通过事件与其他组件通信
    }

    protected registerEvents() {
        super.registerEvents();
        
        // 监听组件初始化完成事件
        this.node.on(ComponentEvent.COMPONENT_INITIALIZED, this.onComponentInitialized, this);
    }

    protected unregisterEvents() {
        super.unregisterEvents();
        
        this.node.off(ComponentEvent.COMPONENT_INITIALIZED, this.onComponentInitialized, this);
    }

    /**
     * 组件初始化完成回调
     */
    private onComponentInitialized() {
        // 所有组件都已初始化并注册了事件监听
        // 可以开始使用事件系统进行组件间通信
        console.log('敌人组件初始化完成，事件系统已准备就绪');
    }

    /**
     * 设置目标（通过事件）
     */
    public setTarget(target: any) {
        // 通过事件设置目标，而不是直接调用组件方法
        this.node.emit(ComponentEvent.SET_TARGET, target);
    }

    /**
     * 清除目标（通过事件）
     */
    public clearTarget() {
        // 通过事件清除目标
        this.node.emit(ComponentEvent.CLEAR_TARGET);
    }
    
    public GetAttackTarget(): Node | null {
        return null;
    }
} 