import { _decorator, Color, color, ICollisionEvent, ITriggerEvent, Node, tween, UIOpacity, Vec3, PhysicsSystem, geometry, v3, Sprite, Tween } from 'cc';
import { Character } from './Character';
import { ComponentEvent } from '../../common/ComponentEvents';
import { DamageData } from '../../common/CommonInterface';
import { CharacterState, CommonEvent, EffectType, FrameEventId, ObjectType, PHY_GROUP } from '../../common/CommonEnum';
import { AutoHuntAIComponent } from '../AI/AutoHuntAIComponent';
import { ComponentInitializer } from '../../common/ComponentInitializer';
import { HealthComponent } from '../Components/HealthComponent';
import { Hero, WeaponType } from './Hero';
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

    @property({ type: UIOpacity, displayName: '施法范围指示'})
    public skillRangeUIO: UIOpacity = null!;

    private _skillCooldownTimer: number = 0;

    private _isAggroToPlayer: boolean = false;

    private _aggroToPlayerTimer: number = 0;

    public get isAggroToPlayer(): boolean {
        return this._isAggroToPlayer;
    }

    public set isAggroToPlayer(value: boolean) {
        this._isAggroToPlayer = value;
        this.updateAiEnabled();
    }

    onLoad(): void {
        super.onLoad();

        this.skillRangeUIO.opacity = 0;
        // manager.enemy.addEnemy(this.node);
        
        // this.node.on(ComponentEvent.STATE_CHANGED, this.TEST, this);
        this.scheduleOnce(() => {
            this.isAggroToPlayer = true;
        });
    }

    private TEST(state: CharacterState){
        console.warn('TEST', state);
    }

    update(dt: number): void {
        if(!manager.game.isGameStart) return;
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

        if(this.isAggroToPlayer){
            this._aggroToPlayerTimer += dt;
            if(this._aggroToPlayerTimer >= 10){
                this.isAggroToPlayer = false;
                this._aggroToPlayerTimer = 0;
            }
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

        app.event.on(CommonEvent.SpiderEggAttacked, this.onSpiderEggAttacked, this);
    }

    protected unregisterEvents() {
        super.unregisterEvents();
        
        this.node.off(ComponentEvent.COMPONENT_INITIALIZED, this.onComponentInitialized, this);

        app.event.offAllByTarget(this);
    }

    private onSpiderEggAttacked(node: Node){
        // console.log('蜘蛛卵被攻击，激活Boss攻击');
        this.isAggroToPlayer = true;
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
                moveAnimation.knockback(this.node.getWorldPosition(), 2);
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
        if(this.isAggroToPlayer){
            const currentPos = this.node.getWorldPosition();
            const enemies = manager.game.getRangeSolder(currentPos, searchRadius);
            if(enemies.some(enemy => enemy.node === manager.game.hero.node)){
                return [{node: manager.game.hero.node, squaredDistance: 0}];
            }
            return enemies;
        }else{
            return [];
        }
    }

    protected onHurt(damageData: DamageData): void {
        super.onHurt(damageData);
        this.isAggroToPlayer = true;
        // const heroComponent = damageData.damageSource.getComponent(Hero);
        // if(heroComponent){
        //     // 如果是喷火器攻击，则不掉钱
        //     if(heroComponent.weaponType === WeaponType.FireGun) {
        //         return;
        //     }
        //     // 其他武器100%掉钱
        //     if(Math.random() < 1) {
        //         manager.drop.spawnParabolicItem(ObjectType.DropItemCoin, this.node.getWorldPosition());
        //     }
        // }else{
        //     // 非英雄攻击也让金币掉落在地上
        //     if(Math.random() < 0.9) {
        //         manager.drop.spawnParabolicItem(ObjectType.DropItemCoin, this.node.getWorldPosition());
        //     }
        // }
    }

    protected onDead(): void {
        super.onDead();
        this.updateAiEnabled();
        app.audio.playEffect('resources/audio/蜘蛛死亡');
        // Boss死亡时掉落大量金币
        this.schedule(()=>{
            // 使用DropManager的spawnParabolicItem方法让金币掉落在地上
            manager.drop.spawnParabolicItem(ObjectType.DropItemCoin, this.node.getWorldPosition(), 3);
        },0,20)
        this.scheduleOnce(() => {
            app.event.emit(CommonEvent.BossDead, this.node);
            this.node.active = false;
        }, 1);
    }

    castSkill(force: boolean = false) {
        // 检查技能是否在冷却中
        if (!this.isSkillReady() && !force) {
            console.log('技能冷却中，无法释放技能');
            return false;
        }

        if(this.GetAttackTarget() == null){
            return false;
        }

        if(this.stateComponent.getCurrentState() === CharacterState.Dead){
            return false;
        }

        // 先禁用AI，再切换状态
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

    private _firstHurt: boolean = true;
    protected performSkill(): void {
        const enemies = manager.game.getRangeSolder(this.node.getWorldPosition(), 8);
        if(enemies.length > 0){
            for(const enemy of enemies){
                const healthComponent = enemy.node.getComponent(HealthComponent);
                if(healthComponent){
                    const damageData: DamageData = {
                        damage: this._firstHurt ? 100 : 80,
                        damageSource: this.node,
                    };
                    healthComponent.takeDamage(damageData);
                }

                const moveAnimation = enemy.node.getComponent(MovementComponent);
                if(moveAnimation){
                    if(this._firstHurt) {
                        this.autoHuntAIComponent.setPatrolEnabled(true);
                    }
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
        
        manager.enemy.ShowBossSkillEff(this.node.getWorldPosition());

        this._firstHurt = false;
    }

    protected onSkillEnter(): void {
        super.onSkillEnter();
        
        // 确保AI被禁用
        this.autoHuntAIComponent.setAIEnabled(false);
        
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
        this.animationComponent.playAnimation('skill', false, 0.5);

        Tween.stopAllByTarget(this.skillRangeUIO);
        this.skillRangeUIO.opacity = 180;
        this.skillRangeUIO.node.scale = v3(0.6, 0.6, 1);
        tween(this.skillRangeUIO.node)
            .to(1, { scale: v3(1, 1, 1) })
            .start();
        tween(this.skillRangeUIO)
            .to(1, { opacity: 255})
            .call(() => {
                this.skillRangeUIO.opacity = 0;
            })
            .start();
    }

    protected onSkillUpdate(dt: number): void {
        super.onSkillUpdate(dt);
    }

    protected onAnimationComplete(animName: string): void {
        if(animName === 'skill'){
            this.stateComponent.changeState(CharacterState.Idle);
            // 技能结束后重新启用AI
            this.updateAiEnabled();
        }
    }

    private updateAiEnabled(){
        const currentState = this.stateComponent.getCurrentState();
        // 在死亡或技能状态时禁用AI
        const enabled = currentState !== CharacterState.Dead && 
                       currentState !== CharacterState.Skill;
        this.autoHuntAIComponent.setAIEnabled(enabled);
    }
    
} 