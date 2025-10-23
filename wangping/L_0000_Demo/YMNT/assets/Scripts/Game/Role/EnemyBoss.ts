import { _decorator, Color, color, ICollisionEvent, ITriggerEvent, Node, tween, UIOpacity, Vec3, PhysicsSystem, geometry, v3 } from 'cc';
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
@ccclass('EnemyBoss')
export class EnemyBoss extends Character {
    @property(AutoHuntAIComponent)  
    public autoHuntAIComponent: AutoHuntAIComponent = null!;

    @property({type: Node, displayName: '攻击位置'})
    public attPos: Node = null!;

    @property({ displayName: '技能冷却'})
    public skillCooldown: number = 5;

    private _skillCooldownTimer: number = 0;

    onLoad(): void {
        super.onLoad();
        // manager.enemy.addEnemy(this.node);
        
        // this.node.on(ComponentEvent.STATE_CHANGED, this.TEST, this);
    }

    private TEST(state: CharacterState){
        console.warn('TEST', state);
    }

    update(dt: number): void {
        super.update(dt);
        
        // 更新技能冷却计时器
        if (this._skillCooldownTimer > 0) {
            this._skillCooldownTimer -= dt;
            if (this._skillCooldownTimer < 0) {
                this._skillCooldownTimer = 0;
            }
        }

        if(this.isSkillReady()){
            this.castSkill();
        }
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

        const enemies = manager.game.getRangeSolder(this.node.position, attackRange);
        if(enemies.length > 0){
            if(enemies.some(enemy => enemy.node === manager.game.hero.node)){
                return manager.game.hero.node;
            }
            return enemies[0].node;            
        }
        
        return null;
    }

    protected onPerformAttack(damageData: DamageData): void {
        // console.log('onHeroPerformAttack', damageData);
        const target = this.GetAttackTarget();
        if(target){
            const healthComponent = target.getComponent(HealthComponent);
            if(healthComponent){
                healthComponent.takeDamage(damageData);
            }
            app.audio.playEffect('resources/audio/蜘蛛攻击');

            const moveAnimation = target.getComponent(MovementComponent);
            if(moveAnimation){
                moveAnimation.knockback(this.node.getWorldPosition(), 3);
            }

            const pos = manager.game.calculateSolderCount(this.node.getWorldPosition().add(new Vec3(0, 1, 0)), target.getWorldPosition().add(new Vec3(0, 1, 0)), [PHY_GROUP.SOLDER, PHY_GROUP.HERO]);
            if(pos){
                manager.effect.playEffect(EffectType.Boss_Attack, pos);
            }

            app.event.emit(CommonEvent.ShakeCamera, {
                intensity: 0.2,
                duration: 0.1,
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
        if(enemies.some(enemy => enemy.node === manager.game.hero.node)){
            return [{node: manager.game.hero.node, squaredDistance: 0}];
        }
        return enemies;
    }

    protected onHurt(damageData: DamageData): void {
        super.onHurt(damageData);
        if(damageData.damageSource.getComponent(Hero)){
            if(Math.random() < 1) {
                manager.drop.spawnParabolicItem(ObjectType.DropItemCoin, this.node.getWorldPosition());
            }
        }else{
            if(Math.random() < 0.9) {
                const coinContainer = manager.game.coinContainer;
                if (!coinContainer) {
                    console.warn('CoinContainer不存在，无法掉落金币');
                    return;
                }
                const success = coinContainer.receiveCoin(this.node.getWorldPosition());
                if (!success) {
                    console.warn('金币掉落到容器失败');
                }
            }
        }
    }

    protected onDead(): void {
        super.onDead();
        this.autoHuntAIComponent.setAIEnabled(false);
        app.audio.playEffect('resources/audio/蜘蛛死亡');
        this.scheduleOnce(() => {
            app.event.emit(CommonEvent.GameWin);
        }, 1);
    }

    castSkill() {
        // 检查技能是否在冷却中
        if (!this.isSkillReady()) {
            console.log('技能冷却中，无法释放技能');
            return false;
        }

        if(this.GetAttackTarget() == null){
            return false;
        }

        if(this.stateComponent.getCurrentState() === CharacterState.Dead){
            return false;
        }

        this.autoHuntAIComponent.setAIEnabled(false);
        
        this.stateComponent.changeState(CharacterState.Skill);
        return true;
    }

    /**
     * 检查技能是否准备好（不在冷却中）
     */
    public isSkillReady(): boolean {
        return this._skillCooldownTimer <= 0;
    }

    /**
     * 获取剩余冷却时间
     */
    public getSkillCooldownRemaining(): number {
        return Math.max(0, this._skillCooldownTimer);
    }

    /**
     * 获取技能冷却进度 (0-1，0表示冷却完成，1表示刚开始冷却)
     */
    public getSkillCooldownProgress(): number {
        if (this.skillCooldown <= 0) return 0;
        return Math.min(1, this._skillCooldownTimer / this.skillCooldown);
    }

    /**
     * 重置技能冷却
     */
    private resetSkillCooldown(): void {
        this._skillCooldownTimer = this.skillCooldown;
        console.log(`技能冷却开始，冷却时间: ${this.skillCooldown}秒`);
    }

    protected performSkill(): void {
        const enemies = manager.game.getRangeSolder(this.node.position, 7);
        if(enemies.length > 0){
            for(const enemy of enemies){
                const healthComponent = enemy.node.getComponent(HealthComponent);
                if(healthComponent){
                    const damageData: DamageData = {
                        damage: 40,
                        damageSource: this.node,
                    };
                    healthComponent.takeDamage(damageData);
                }

                const moveAnimation = enemy.node.getComponent(MovementComponent);
                if(moveAnimation){
                    moveAnimation.knockup(6, Vec3.subtract(new Vec3(), enemy.node.getWorldPosition(), this.node.getWorldPosition()));
                }

                const pos = manager.game.calculateSolderCount(this.node.getWorldPosition().add(new Vec3(0, 1, 0)), enemy.node.getWorldPosition().add(new Vec3(0, 1, 0)), [PHY_GROUP.SOLDER, PHY_GROUP.HERO]);
                if(pos){
                    manager.effect.playEffect(EffectType.Boss_Attack, pos, undefined, undefined, v3(2, 2, 2));
                }

                app.event.emit(CommonEvent.ShakeCamera, {
                    intensity: 3,
                    duration: 0.15,
                    source: this.node
                });
            }
        }
        
    }

    protected onSkillEnter(): void {
        super.onSkillEnter();
        
        // 技能开始时重置冷却计时器
        this.resetSkillCooldown();
        
        // 清除之前的帧事件（避免重复添加）
        this.animationComponent.clearFrameEvents();
        
        // 添加攻击帧事件，在指定进度时触发攻击伤害
        this.animationComponent.addFrameEvent(
            0.6,
            () => {
                this.performSkill();
            },
            FrameEventId.SKILL_CAST,
            true
        );
        this.animationComponent.playAnimation('skill', false, 0.66);
    }

    protected onSkillUpdate(dt: number): void {
        super.onSkillUpdate(dt);
    }

    protected onAnimationComplete(animName: string): void {
        if(animName === 'skill'){
            this.stateComponent.changeState(CharacterState.Idle);
            this.autoHuntAIComponent.setAIEnabled(true);
        }
    }
    
} 