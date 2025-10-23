import { _decorator, Color, color, ICollisionEvent, ITriggerEvent, Node, tween, UIOpacity, Vec3, PhysicsSystem, geometry, v3, ParticleSystem } from 'cc';
import { Character } from './Character';
import { ComponentEvent } from '../../common/ComponentEvents';
import { DamageData } from '../../common/CommonInterface';
import { CharacterState, CommonEvent, EffectType, FrameEventId, ObjectType, PHY_GROUP } from '../../common/CommonEnum';
import { AutoHuntAIComponent } from '../AI/AutoHuntAIComponent';
import { ComponentInitializer } from '../../common/ComponentInitializer';
import { HealthComponent } from '../Components/HealthComponent';
import { Hero } from './Hero';
import { MovementComponent } from '../Components/MovementComponent';

const { ccclass, property } = _decorator;

/**
 * 敌人角色类 - 展示重构后的事件系统使用
 */
@ccclass('Enemy')
export class Enemy extends Character {
    @property(AutoHuntAIComponent)  
    public autoHuntAIComponent: AutoHuntAIComponent = null!;

    @property({type: Node, displayName: '攻击位置'})
    public attPos: Node = null!;

    onLoad(): void {
        super.onLoad();
        // manager.enemy.addEnemy(this.node);
        
        // this.node.on(ComponentEvent.STATE_CHANGED, this.TEST, this);
    }

    private TEST(state: CharacterState){
        console.warn('TEST', state);
    }

    update(dt: number): void {
        if(!manager.game.isGameStart) return;
        super.update(dt);
    }

    protected initComponents() {
        super.initComponents();

        ComponentInitializer.initComponents(this.node, 
        {
            autoHuntAIComponent: AutoHuntAIComponent,
        }, this);
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
        const attackComponent = this.attackComponent;
        const attackRange = attackComponent.attackRangeValue;

        const enemies = manager.game.getRangeSolder(this.node.getWorldPosition(), attackRange);
        if(enemies.length > 0){
            if(enemies.some(enemy => enemy.node === manager.game.hero.node)){
                return manager.game.hero.node;
            }
            return enemies[0].node;            
        }
        
        return null;
    }

    protected onPerformAttack(damageData: DamageData): void {
        // console.log('onEnemyPerformAttack', damageData);
        const target = this.GetAttackTarget();
        if(target){
            const healthComponent = target.getComponent(HealthComponent);
            if(healthComponent){
                healthComponent.takeDamage(damageData);
            }
            app.audio.playEffect('resources/audio/蜘蛛攻击');

            // 移除击飞效果 - Enemy不需要击飞
            // const moveAnimation = target.getComponent(MovementComponent);
            // if(moveAnimation){
            //     moveAnimation.knockback(this.node.getWorldPosition(), 3);
            // }

            // const pos = manager.game.calculateSolderCount(this.node.getWorldPosition().add(new Vec3(0, 1, 0)), target.getWorldPosition().add(new Vec3(0, 1, 0)), [PHY_GROUP.SOLDER, PHY_GROUP.HERO]);
            // if(pos){
            //     manager.effect.playEffect(EffectType.Boss_Attack, pos);
            // }

            app.event.emit(CommonEvent.ShakeCamera, {
                intensity: 0.1, // 减少震动强度
                duration: 0.05,  // 减少震动时间
                source: this.node
            });
        }
    }
    
    /**
     * 搜索敌人
     */
    public searchForAttackTarget(searchRadius: number): { node: Node; squaredDistance: number }[] {
        const currentPos = this.node.getWorldPosition();
        const enemies = manager.game.getRangeSolder(currentPos, searchRadius);
        // if(enemies.some(enemy => enemy.node === manager.game.hero.node)){
        //     return [{node: manager.game.hero.node, squaredDistance: 0}];
        // }
        return enemies;
    }

    protected onHurt(damageData: DamageData): void {
        super.onHurt(damageData);
    }

    protected onDead(): void {
        super.onDead();
        this.autoHuntAIComponent.setAIEnabled(false);
        app.audio.playEffect('resources/audio/蜘蛛死亡');
        
        // 通知EnemyManager这个敌人已死亡
        this.scheduleOnce(() => {
            app.event.emit(CommonEvent.EnemyDead, this.node);
        }, 1);

        // 直接将金币掉落在地上
        this.schedule(()=>{
            if(Math.random() < 0.8) {
                // 使用DropManager的spawnParabolicItem方法让金币掉落在地上
                manager.drop.spawnParabolicItem(ObjectType.DropItemCoin, this.node.getWorldPosition(), 2);
            }
        }, 0.05, 2)
    }
    

    public reset(): void {
        super.reset();
        this.autoHuntAIComponent.reset();
    }

    /**
     * 生成完成后的回调（抛物线动画结束后调用）
     */
    public onSpawnComplete(wpos: Vec3): void {
        // 启用AI
        if (this.autoHuntAIComponent) {
            this.autoHuntAIComponent.setAIEnabled(true);
            this.autoHuntAIComponent.setInitialPosition(wpos);
        }

        // 设置为闲置状态
        this.stateComponent.changeState(CharacterState.Idle);
        
        // console.log('Enemy生成完成，AI已激活');
    }
} 