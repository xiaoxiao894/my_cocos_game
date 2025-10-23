import { _decorator, Node, tween, Vec3 , Animation, Quat, log, SkeletalAnimation, AnimationClip, ParticleSystem} from 'cc';
import { CommonEvent, CharacterState, FrameEventId, BuildingType, ObjectType, EffectType, PHY_GROUP } from '../../common/CommonEnum';
import { DamageData } from '../../common/CommonInterface';
import { ComponentInitializer } from '../../common/ComponentInitializer';
import { ComponentEvent } from '../../common/ComponentEvents';
import { HealthComponent } from '../Components/HealthComponent';
import { PickupComponent } from '../Components/PickupComponent';
import { Character } from './Character';
import { Lightning } from 'db://assets/Res/Eff/light/Lightning';
import { MovementComponent } from '../Components/MovementComponent';
import { BaseAIComponent } from '../AI/BaseAIComponent';

const { ccclass, property } = _decorator;

export enum WeaponType {
    /* 斧头 */
    Axe = 'Axe',
    /* 枪 */
    Gun = 'Gun',
    /* 大铲子 */
    BigShovel = 'BigShovel',
    /* 喷火枪 */
    FireGun = 'FireGun',
}

/**
 * 英雄组件 - 基于组件化设计的英雄类
 */
@ccclass('Hero')
export class Hero extends Character {
    @property({type: BaseAIComponent, displayName: '英雄AI组件'})
    public heroAIComponent: BaseAIComponent = null!;

    /** 拾取组件 */
    @property({type: PickupComponent, displayName: '拾取组件'})
    public pickupComponent: PickupComponent = null!;

    @property({type: Lightning, displayName: '闪电组件'})
    public lightning: Lightning = null!;

    @property({type: Node, displayName: '斧头节点'})
    public axeNode: Node = null!;

    @property({type: Node, displayName: '枪节点'})
    public gunNode: Node = null!;

    @property({type: Node, displayName: '大铲子节点'})
    public bigShovelNode: Node = null!;

    @property({type: Animation, displayName: '模型动画'})
    public modelAni: Animation = null!;
    
    @property({type: Animation, displayName: '喷火器模型动画'})
    public fireGunModelAni: Animation = null!;

    @property({type: Node, displayName: '喷火节点'})
    public fireNode: Node = null!;

    @property({type: Node, displayName: '武器升级特效'})
    public weaponUpgradeEff: Node = null!;
    
    public weaponType: WeaponType = WeaponType.Axe;

    /** 玉米伤害计时器 */
    private cornDamageTimer: number = 0;
    /** 玉米伤害间隔（秒） */
    private cornDamageInterval: number = 0.5;

    onLoad() {
        super.onLoad();

        this.node.on(ComponentEvent.UPDATE_ITEM_COUNT, this.onUpdateItemCount, this);
        // this.node.on(ComponentEvent.KNOCKUP_END, this.onKnockupEnd, this);
        this.node.on(ComponentEvent.PLAY_ANIMATION_START, this.onPlayAnimationStart, this);

        app.event.on(CommonEvent.UnlockItem, this.onUnlockItem, this);

        
        // this.node.on(ComponentEvent.STATE_CHANGED, this.TEST, this);
        // this.SetWeapon(WeaponType.Axe);
        // this.SetWeapon(WeaponType.BigShovel);
        this.SetWeapon(WeaponType.FireGun);
    }
    // private onKnockupEnd(): void {
    //     if(this.modelAni.getState(this.modelAni.defaultClip.name).isPlaying){
    //         this.modelAni.stop();
    //         // this.modelAni.node.setRotationFromEuler(90, 0, 0);
    //         // this.modelAni.node.setPosition(0, 0.2, 0);
    //         tween(this.modelAni.node)
    //             .to(0.2, {eulerAngles: new Vec3(90, 0, 0), position: new Vec3(0, 0.2, 0)})
    //             .delay(0.5)
    //             .to(0.5, {rotation: new Quat(0, 0, 0, 1), position: new Vec3(0, 0, 0)}, {easing: 'backOut'})
    //             .call(() => {
    //                 this._firstHurt = false;
    //             })
    //             .start();
    //     }
    // }

    private onPlayAnimationStart(data: {
        name: string,
        loop: boolean,
        timeScale: number,
        crossFade: number
    }){
        // console.log('onPlayAnimationStart', data);
        if(this.weaponType == WeaponType.FireGun){
            switch (data.name) {
                case this.animationComponent.IdleAnimName:
                    this.setFire(false)
                    this.playFireGunAnimation("idle", data.loop, data.timeScale, data.crossFade);
                    break;
                case this.animationComponent.MoveAnimName:
                    this.setFire(false)
                    this.playFireGunAnimation("run", data.loop, data.timeScale, data.crossFade);
                    break;
                case this.animationComponent.RunAttackAnimName:
                    this.setFire(true)
                    this.playFireGunAnimation("runattack", data.loop, data.timeScale, data.crossFade);
                    break;
                case this.animationComponent.AttackAnimName:
                    this.setFire(true)
                    this.playFireGunAnimation("fire", data.loop, data.timeScale, data.crossFade);
                    break;
                default:
                    break;
            }
        }else{
            this.setFire(false)
        }
    }

    setFire(isShow:boolean){
        this.fireNode.getComponentsInChildren(ParticleSystem).forEach(particle => {
            if(particle.isPlaying && !isShow){
                particle.stop();
            }
            if(!particle.isPlaying && isShow){
                particle.play();
            }
        });
    }

    /**
     * 播放指定动画
     * @param name 动画名称
     * @param loop 是否循环播放
     * @param timeScale 动画播放速度，默认为1
     */
    public playFireGunAnimation(name: string, loop: boolean, timeScale: number = 1, crossFade: number = 0.3) {
        if (!this.fireGunModelAni) {
            console.error('fireGunModelAni SkeletalAnimation 组件未找到');
            return;
        }
        
        // 检查动画剪辑是否存在
        const clips = this.fireGunModelAni.clips;
        const clip = clips.find(clip => clip && clip.name === name);
        if (!clip) {
            console.warn(`动画剪辑 ${name} 未找到`);
            return;
        }

        let isNoAni = false;

        // 创建或获取动画状态
        let state = this.fireGunModelAni.getState(name);
        if (!state) {
            state = this.fireGunModelAni.createState(clip, name);
            isNoAni = true;
        }

        if (!state) {
            console.error(`无法创建动画状态: ${name}`);
            return;
        }

        
        // 设置循环模式
        state.wrapMode = loop ? AnimationClip.WrapMode.Loop : AnimationClip.WrapMode.Normal;
        
        // 设置播放速度
        state.speed = timeScale;
        
        // 播放动画
        if (crossFade > 0 && !isNoAni) {
            this.fireGunModelAni.crossFade(name, crossFade);
        } else {
            this.fireGunModelAni.play(name);
        }
    }

    private TEST(state: CharacterState){
        console.warn('TEST', state);
    }

    onDestroy() {
        this.node.off(ComponentEvent.UPDATE_ITEM_COUNT, this.onUpdateItemCount, this);
        app.event.offAllByTarget(this);
    }

    protected initComponents(): void {
        super.initComponents();
        ComponentInitializer.initComponents(this.node, {
            pickupComponent: PickupComponent,
        }, this);
    }

    /**
     * 开始攻击动画
     */
    protected startAttackAnimation() {;
        // 连续攻击时重置特效标志
        this.isShowAttackEffect = false;
        
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
        if(this.movementComponent.isMoving && (this.weaponType === WeaponType.Axe || this.weaponType === WeaponType.BigShovel || this.weaponType === WeaponType.FireGun)){
            let attackTimeScale = this.calculateAttackTimeScale(this.animationComponent.RunAttackAnimName);
            this.animationComponent.playRunAttack(attackTimeScale, false);
        }else{
            let attackTimeScale = this.calculateAttackTimeScale(this.animationComponent.AttackAnimName);
            this.animationComponent.playAttack(attackTimeScale, false);
        }
    }

    protected onMoveStateUpdate(isMoving: boolean) {
        if (this.stateComponent.getCurrentState() === CharacterState.Dead) {
            return;
        }
        
        if(isMoving){
            if(this.stateComponent.getCurrentState() != CharacterState.Move){
                if((this.weaponType === WeaponType.Axe || this.weaponType === WeaponType.BigShovel || this.weaponType === WeaponType.FireGun) && this.stateComponent.getCurrentState() === CharacterState.Attack){
                    // 斧头攻击时，移动不会打断攻击
                }else{
                    this.stateComponent.changeState(CharacterState.Move);
                }
            }
        }else{
            if(this.stateComponent.getCurrentState() != CharacterState.Idle && this.stateComponent.getCurrentState() != CharacterState.Attack){
                this.stateComponent.changeState(CharacterState.Idle);
            }
        }
    }

    public move(direction: Vec3): void {
        // if(this._firstHurt)  return;
        super.move(direction);
    }

    /**
     * 变换监听回调，用于通知UI位置变化
     */
    protected onTransformChanged(): void {
        super.onTransformChanged();
        app.event.emit(CommonEvent.HerMove, this.node.getWorldPosition());
    }

    private onUnlockItem(item: BuildingType): void {
        if(item === BuildingType.BigShovel){
            // this.SetWeapon(WeaponType.Gun);
            this.SetWeapon(WeaponType.BigShovel, true);
            this.bigShovelNode.active = true;
            this.axeNode.active = false;
            this.gunNode.active = false;

            this.bigShovelNode.setScale(0, 0, 0);

            tween(this.bigShovelNode)
                .to(1, {scale: new Vec3(1, 1, 1)}, {easing: 'backOut'})
                .start();

            // manager.effect.playEffect(EffectType.Hero_Upgrade, this.node.getWorldPosition());
        }else if(item === BuildingType.FireGun){
            this.SetWeapon(WeaponType.FireGun, true);
            this.gunNode.active = true;
            this.axeNode.active = false;
            this.bigShovelNode.active = false;
        }
    }

    private onUpdateItemCount(type: ObjectType, count: number): void {
        app.event.emit(CommonEvent.UpdateHeroItemCount, {
            type: type,
            count: count
        });
    }

    protected onPerformAttack(damageData: DamageData): void {
        // 范围伤害：以英雄为中心，半径为 attackRangeValue
        if (this.weaponType === WeaponType.FireGun) {
            return;
        }

        const primaryTargets =  this.getAttackTargetList();

        // 播放一次性音效/特效（基于主要目标以保持原有表现）
        if (primaryTargets.length > 0) {
            if (this.weaponType === WeaponType.Gun) {
                app.audio.playEffect('resources/audio/主角雷电攻击');
                const tweenData = { progress: 0 };
                tween(tweenData)
                    .call(() => {
                        this.lightning.node.active = true;
                        this.lightning.node.setParent(this.gunNode);
                        this.lightning.node.setPosition(0, 0, 0);
                    })
                    .to(0.3, { progress: 1 }, {
                        onUpdate: (_pro, ratio) => {
                            if (ratio === undefined) return;
                            this.lightning.setEndPos(primaryTargets[0].getWorldPosition().add(new Vec3(0, 1.5, 0)));
                        }
                    })
                    .call(() => {
                        this.lightning.node.active = false;
                    })
                    .start();
            } else {
                // 分析目标类型，避免重复播放音效
                let hasEnemyTargets = false;
                let hasCornTargets = false;
                let firstEnemyTarget: Node | null = null;

                for(const target of primaryTargets){
                    if (target.getComponent(Character)) {
                        hasEnemyTargets = true;
                        if (!firstEnemyTarget) {
                            firstEnemyTarget = target;
                        }
                    } else {
                        hasCornTargets = true;
                    }
                }

                // 播放音效（只播放一次）
                if (hasEnemyTargets) {
                    app.audio.playEffect('resources/audio/主角锄头攻击');
                    // 只在第一个敌人位置播放特效
                    if (firstEnemyTarget) {
                        const effectPos = manager.game.calculateSolderCount(
                            this.node.getWorldPosition().add(new Vec3(0, 1, 0)),
                            firstEnemyTarget.getWorldPosition().add(new Vec3(0, 1, 0)),
                            [PHY_GROUP.ENEMY]
                        );
                        if (effectPos) {
                            manager.effect.playEffect(EffectType.Solder_Attack, effectPos);
                        }
                    }
                } else if (hasCornTargets) {
                    app.audio.playEffect('resources/audio/主角（人物）挖玉米');
                }

                // 对所有目标造成伤害
                for(const target of primaryTargets){
                    if (target.getComponent(Character)) {
                        const cornHealth = target.getComponent(HealthComponent);
                        if (cornHealth) {
                            cornHealth.takeDamage(damageData);
                        }
                        const moveAnimation = target.getComponent(MovementComponent);
                        if(moveAnimation){
                            moveAnimation.knockback(this.node.getWorldPosition(), 2);
                        }
                    } else {
                        // 主要目标为玉米，保持原有行为（只对玉米结算一次伤害）
                        const cornHealth = target.getComponent(HealthComponent);
                        if (cornHealth) {
                            const damageData1: DamageData = {
                                damage: 1,
                                damageSource: this.node
                            };
                            cornHealth.takeDamage(damageData1);
                        }
                    }
                }
            }
        }
    }

    protected getAttackTargetList(): Node[] {
        const list: Node[] = [];
        const attackComponent = this.attackComponent;
        const attackRange = attackComponent.attackRangeValue;
        const closeRange = 3.5; // 5个像素的近距离范围

        const corn = manager.game.bigCorn;
        if(corn && corn.isValid){
            const distance = Vec3.distance(this.node.position, corn.node.position);
            if(distance <= attackRange){
                // 如果是喷火枪，需要检查玉米是否在面向方向或距离很近
                if(this.weaponType === WeaponType.FireGun){
                    if(distance <= closeRange || this.isTargetInFacing(corn.node)){
                        list.push(corn.node);
                    }
                }else{
                    list.push(corn.node);
                }
            }
        }
        
        const enemies = manager.enemy.getRangeEnemies(this.node.position, attackRange);
        if(enemies.length > 0){
            // 如果是喷火枪，获取面向方向的敌人或距离很近的敌人
            if(this.weaponType === WeaponType.FireGun){
                for(const enemy of enemies){
                    const distance = Vec3.distance(this.node.position, enemy.node.position);
                    if(distance <= closeRange || this.isTargetInFacing(enemy.node)){
                        list.push(enemy.node);
                    }
                }
            }else{
                // list.push(enemies[0].node);
                for(const enemy of enemies){
                    list.push(enemy.node);
                }
            }
        }

        return list;
    }
    
    public GetAttackTarget(): Node | null {
        return this.getAttackTargetList()[0] || null;
    }

    /**
     * 检查是否面向玉米
     * @returns 是否面向玉米
     */
    public isFacingCorn(): boolean {
        const corn = manager.game.bigCorn;
        if (!corn || !corn.isValid) {
            return false;
        }
        
        // 检查距离是否在攻击范围内
        const distance = Vec3.distance(this.node.position, corn.node.position);
        const attackRange = this.attackComponent.attackRangeValue;
        if (distance > attackRange) {
            return false;
        }
        
        return this.isTargetInFacing(corn.node);
    }

    /**
     * 检查目标是否在角色面向方向
     * @param target 目标节点
     * @returns 是否在面向方向
     */
    private isTargetInFacing(target: Node): boolean {
        // 计算角色到目标的方向向量
        const toTarget = new Vec3();
        Vec3.subtract(toTarget, target.position, this.node.position);
        toTarget.y = 0; // 忽略Y轴差异
        toTarget.normalize();

        // 获取角色的朝向向量（前方向）
        const forward = new Vec3();
        Vec3.transformQuat(forward, Vec3.FORWARD, this.node.rotation);
        forward.y = 0; // 忽略Y轴差异
        forward.normalize();

        // 计算夹角的余弦值
        const dot = Vec3.dot(forward, toTarget);
        
        // 设置面向角度阈值（约45度范围，可根据需要调整）
        const facingAngleThreshold = Math.cos(Math.PI / 4); // 45度
        
        return dot >= facingAngleThreshold;
    }

    public attack(): void {
        if (this.movementComponent.isMoving && this.weaponType === WeaponType.Gun) return;
        super.attack();
    }

    /**
     * 重写移动状态改变回调 - Hero移动时可以继续攻击
     */
    protected onMoveStateChanged(isMoving: boolean) {
        if (this.stateComponent.getCurrentState() === CharacterState.Dead) {
            // Hero在攻击状态时移动不会打断攻击
            return;
        }
        if(this.weaponType === WeaponType.Axe || this.weaponType === WeaponType.BigShovel || this.weaponType === WeaponType.FireGun){
            if(this.stateComponent.getCurrentState() === CharacterState.Attack){
                return;
            }
        }
        log('onMoveStateChanged', isMoving);
        this.node.emit(ComponentEvent.CHANGE_STATE, isMoving ? CharacterState.Move : CharacterState.Idle);
    }
    
    public SetWeapon(weaponType: WeaponType, isShowEff: boolean = false) {
        this.weaponType = weaponType;
        switch(weaponType){
            case WeaponType.Axe: 
                this.attackComponent.setAttackParams(4, 0.3, 20, 5, 0.4);
                this.animationComponent.IdleAnimName = "idle";
                this.animationComponent.MoveAnimName = "run";
                this.animationComponent.RunAttackAnimName = "run_attack";
                this.animationComponent.AttackAnimName = "attack";
                break;
            case WeaponType.Gun:
                this.attackComponent.setAttackParams(12, 0.6, 150, 50, 0.45);
                this.animationComponent.IdleAnimName = "idle";
                this.animationComponent.MoveAnimName = "run";
                this.animationComponent.RunAttackAnimName = "run_attack";
                this.animationComponent.AttackAnimName = "attack_1";
                break;
            case WeaponType.BigShovel:
                this.attackComponent.setAttackParams(6, 0.4, 40, 10, 0.45);
                this.animationComponent.IdleAnimName = "idle";
                this.animationComponent.MoveAnimName = "run";
                this.animationComponent.RunAttackAnimName = "run_attack";
                this.animationComponent.AttackAnimName = "attack";
                break;
            case WeaponType.FireGun:
                this.attackComponent.setAttackParams(12, 0.32, 3000, 0, 0.45);
                this.animationComponent.IdleAnimName = "fire_idle";
                this.animationComponent.MoveAnimName = "fire_run";
                this.animationComponent.RunAttackAnimName = "fire_runattack";
                this.animationComponent.AttackAnimName = "fire";
                this.pickupComponent.offset = 0.6;
                break;
        }

        this.fireGunModelAni.node.active = weaponType === WeaponType.FireGun;

        isShowEff && this.weaponUpgradeEff.getComponentsInChildren(ParticleSystem).forEach(particle => {
            particle.play();
        });
    }

    protected onHurt(damageData: DamageData): void {
        super.onHurt(damageData);
        app.event.emit(CommonEvent.HeroHurt, {damageData:damageData});

        const healPercent = this.healthComponent.healthPercentage;
        if(healPercent < 0.3){
            app.event.emit(CommonEvent.ShowTips, {tips: app.lang.getLanguage("HurtTips"), id: "HurtTips", duration: 3});
        }
    }

    protected onDead(): void {
        super.onDead();
        this.scheduleOnce(() => {
           app.event.emit(CommonEvent.GameFail);
        }, 1);
    }

    private isShowAttackEffect: boolean = false;
    protected onAttackEnter(): void {
        this.startAttackAnimation();
        this.movementComponent.IsKeepFace = this.weaponType != WeaponType.FireGun;
        this.isShowAttackEffect = false;
        // 重置玉米伤害计时器，确保攻击开始时能立即造成伤害
        this.cornDamageTimer = this.cornDamageInterval;
    }

    protected onAttackExit(): void {
        super.onAttackExit();
        // 攻击结束时重置玉米伤害计时器
        this.cornDamageTimer = 0;
    }

    protected onAttackUpdate(dt: number): void {
        // 处理喷火枪伤害效果
        this.handleFireGunAttack(dt);
        // 如果动画播放完毕，处理攻击后续逻辑
        if (!this.animationComponent.isPlayingAnimation()) {
            // 喷火枪攻击条件：不在家 或者 (在家但面向玉米)
            if(this.weaponType === WeaponType.FireGun && (!this.isAtHome() || this.isFacingCorn())){
                if (this.attackComponent.attack()) {
                    this.startAttackAnimation();
                }
            }else{
                this.handleAttackComplete();
            }
        }
        
        const target = this.GetAttackTarget();
        if(target){
            if(this.weaponType != WeaponType.FireGun){
                this.attackComponent.updateAttackTarget(target);
            }
        }else{
            this.waitForAttackCooldown();
        }
        
        const progress = this.animationComponent.getCurrentAnimationProgress();
        if(progress >= 0.3 && !this.isShowAttackEffect){
            if(this.weaponType === WeaponType.Axe){
                this.isShowAttackEffect = true;
                manager.effect.playEffect(EffectType.Hero_Attack, this.node.getWorldPosition().add(new Vec3(0, 1.3, 0)), this.node.getRotation());
            }else if(this.weaponType === WeaponType.BigShovel){
                this.isShowAttackEffect = true;
                manager.effect.playEffect(EffectType.Hero_Attack1, this.node.getWorldPosition().add(new Vec3(0, 1.3, 0)), this.node.getRotation());
            }
        }
    }
    
    /**
     * 等待攻击冷却
     */
    protected waitForAttackCooldown() {
        // // 获取攻击动画基础时长
        let baseAnimDuration = 0;
        if(this.animationComponent.getCurrentAnimationName() === this.animationComponent.AttackAnimName){
            baseAnimDuration = this.animationComponent.getAnimationDuration(this.animationComponent.AttackAnimName);
        }else if(this.animationComponent.getCurrentAnimationName() === this.animationComponent.RunAttackAnimName){
            baseAnimDuration = this.animationComponent.getAnimationDuration(this.animationComponent.RunAttackAnimName);
        }
        if(baseAnimDuration <= 0){
            return;
        }
        
        // 如果冷却时间小于动画时长，保持攻击状态等待冷却
        // 这种情况下动画已经被加速，会连续播放
        if (this.attackComponent.attackCooldownTime < baseAnimDuration) {
            // 保持攻击状态，在下一帧update中会继续检查冷却状态
            return;
        }
        
        // 如果冷却时间大于等于动画时长，切换到idle状态
        // 避免在攻击状态下没有动画播放的空档期
        if(this.movementComponent.isMoving){
            this.stateComponent.changeState(CharacterState.Move);
        }else{
            this.stateComponent.changeState(CharacterState.Idle);
        }
    }

    private handleFireGunAttack(dt: number): void {
        if(this.weaponType === WeaponType.FireGun){
            const list = this.getAttackTargetList();
            if(list.length > 0){
                // 更新玉米伤害计时器
                this.cornDamageTimer += dt;
                
                for(const target of list){
                    const healthComponent = target.getComponent(HealthComponent);
                    if(healthComponent){
                        // 检查是否为玉米
                        const corn = manager.game.bigCorn;
                        const isCorn = corn && corn.node === target;
                        
                        if(isCorn){
                            // 对玉米：每0.5秒造成1点伤害
                            if(this.cornDamageTimer >= this.cornDamageInterval){
                                healthComponent.takeDamage({
                                    damage: 1,
                                    damageSource: this.node
                                });
                                this.cornDamageTimer = 0; // 重置计时器
                            }
                        } else {
                            // 对敌人：保持原来的每帧伤害
                            healthComponent.takeDamage({
                                damage: this.attackComponent.damage * dt,
                                damageSource: this.node
                            });
                            
                            // 添加微弱的击退效果（仅对敌人生效）
                            const movementComponent = target.getComponent(MovementComponent);
                            if(movementComponent){
                                movementComponent.knockback(this.node.getWorldPosition(), 3);
                            }
                        }
                    }
                }
            } else {
                // 没有攻击目标时重置计时器
                this.cornDamageTimer = 0;
            }
        }
    }
    

    public reset(): void {
        super.reset();
        this.heroAIComponent.reset();
    }
} 