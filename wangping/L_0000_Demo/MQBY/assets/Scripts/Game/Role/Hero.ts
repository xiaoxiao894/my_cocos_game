import { _decorator, Node, tween, Vec3 , Animation, Quat} from 'cc';
import { CommonEvent, CharacterState, FrameEventId, BuildingType, ObjectType, EffectType, PHY_GROUP } from '../../common/CommonEnum';
import { DamageData } from '../../common/CommonInterface';
import { ComponentInitializer } from '../../common/ComponentInitializer';
import { ComponentEvent } from '../../common/ComponentEvents';
import { HeroAIComponent } from '../AI/HeroAIComponent';
import { HealthComponent } from '../Components/HealthComponent';
import { PickupComponent } from '../Components/PickupComponent';
import { Character } from './Character';
import { Lightning } from 'db://assets/Res/Eff/light/Lightning';
import { ModelAnimationComponent } from '../Components/ModelAnimationComponent';
import { GuideManager } from '../GuideManager';

const { ccclass, property } = _decorator;

export enum WeaponType {
    /* 斧头 */
    Axe = 'Axe',
    /* 枪 */
    Gun = 'Gun',
    /* 大铲子 */
    BigShovel = 'BigShovel',
}

/**
 * 英雄组件 - 基于组件化设计的英雄类
 */
@ccclass('Hero')
export class Hero extends Character {
    @property({type: HeroAIComponent, displayName: '英雄AI组件'})
    public heroAIComponent: HeroAIComponent = null!;

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
    
    public weaponType: WeaponType = WeaponType.Axe;

    onLoad() {
        super.onLoad();

        this.node.on(ComponentEvent.UPDATE_ITEM_COUNT, this.onUpdateItemCount, this);
        this.node.on(ComponentEvent.KNOCKUP_END, this.onKnockupEnd, this);

        app.event.on(CommonEvent.UnlockItem, this.onUnlockItem, this);

        this.SetWeapon(WeaponType.Axe);
    }
    private onKnockupEnd(): void {
        if(this.modelAni.getState(this.modelAni.defaultClip.name).isPlaying){
            this.modelAni.stop();
            tween(this.modelAni.node)
                .to(0.2, {eulerAngles: new Vec3(90, 0, 0), position: new Vec3(0, 0.2, 0)})
                .delay(0.5)
                .to(0.5, {rotation: new Quat(0, 0, 0, 1), position: new Vec3(0, 0, 0)}, {easing: 'backOut'})
                .start();
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
            heroAIComponent: HeroAIComponent
        }, this);
    }

    /**
     * 开始攻击动画
     */
    protected startAttackAnimation() {;
        
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
        if(this.movementComponent.isMoving && (this.weaponType === WeaponType.Axe || this.weaponType === WeaponType.BigShovel)){
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
                if((this.weaponType === WeaponType.Axe || this.weaponType === WeaponType.BigShovel) && this.stateComponent.getCurrentState() === CharacterState.Attack){
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
        // if(item === BuildingType.Gun){
        //     // this.SetWeapon(WeaponType.Gun);
        //     this.SetWeapon(WeaponType.BigShovel);
        //     this.bigShovelNode.active = true;
        //     this.axeNode.active = false;
        //     this.gunNode.active = false;

        //     this.bigShovelNode.setScale(0, 0, 0);

        //     tween(this.bigShovelNode)
        //         .to(1, {scale: new Vec3(1, 1, 1)}, {easing: 'backOut'})
        //         .start();

        //     // manager.effect.playEffect(EffectType.Hero_Upgrade, this.node.getWorldPosition());
        // }
    }

    private onUpdateItemCount(type: ObjectType, count: number): void {
        app.event.emit(CommonEvent.UpdateHeroItemCount, {
            type: type,
            count: count
        });
    }

    protected onPerformAttack(damageData: DamageData): void {
        // console.log('onHeroPerformAttack', damageData);
        const target = this.GetAttackTarget();
        if(target){
            if(this.weaponType === WeaponType.Gun){
                app.audio.playEffect('resources/audio/主角雷电攻击');
            }else{
                if(target.getComponent(Character)){
                    app.audio.playEffect('resources/audio/主角锄头攻击');
                    const pos = manager.game.calculateSolderCount(this.node.getWorldPosition().add(new Vec3(0, 1, 0)), target.getWorldPosition().add(new Vec3(0, 1, 0)), [PHY_GROUP.ENEMY]);
                    if(pos){
                        manager.effect.playEffect(EffectType.Solder_Attack, pos);
                    }
                }else{
                    app.audio.playEffect('resources/audio/主角（人物）挖玉米');
                }
            }
            const healthComponent = target.getComponent(HealthComponent);
            if(healthComponent){
                healthComponent.takeDamage(damageData);
            }

            if(this.weaponType === WeaponType.Gun){
                let d = {progress: 0};
                tween(d)
                    .call(() => {
                        this.lightning.node.active = true;
                        this.lightning.node.setParent(this.gunNode);
                        this.lightning.node.setPosition(0,0,0);
                    })
                    .to(0.3, {progress: 1}, {
                        onUpdate: (pro, ratio) => {
                            if(ratio === undefined){
                                return;
                            }
                            this.lightning.setEndPos(target.getWorldPosition().add(new Vec3(0, 1.5, 0)));
                        }
                    })
                    .call(() => {
                        this.lightning.node.active = false;
                    })
                    .start();
            }
        }
    }
    
    public GetAttackTarget(): Node | null {
        const attackComponent = this.attackComponent;

        const attackRange = attackComponent.attackRangeValue;
        
        const enemies = manager.enemy.getRangeEnemies(this.node.position, attackRange);
        if(enemies.length > 0){
            return enemies[0].node;
        }

        return null;
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
        if(this.weaponType === WeaponType.Axe || this.weaponType === WeaponType.BigShovel){
            if(this.stateComponent.getCurrentState() === CharacterState.Attack){
                return;
            }
        }
        
        this.node.emit(ComponentEvent.CHANGE_STATE, isMoving ? CharacterState.Move : CharacterState.Idle);
    }
    
    public SetWeapon(weaponType: WeaponType) {
        this.weaponType = weaponType;
        switch(weaponType){
            case WeaponType.Axe:
                this.attackComponent.setAttackParams(6, 0.5, 10, 0, 0.4);
                this.animationComponent.AttackAnimName = "attack";
                break;
            case WeaponType.Gun:
                this.attackComponent.setAttackParams(12, 0.6, 3000, 0, 0.45);
                this.animationComponent.AttackAnimName = "attack_1";
                break;
            case WeaponType.BigShovel:
                this.attackComponent.setAttackParams(7, 0.6, 3000, 0, 0.45);
                this.animationComponent.AttackAnimName = "attack";
                break;
        }
    }

    // private _firstHurt: boolean = true;
    protected onHurt(damageData: DamageData): void {
        super.onHurt(damageData);
        app.event.emit(CommonEvent.HeroHurt, damageData);

        const healPercent = this.healthComponent.healthPercentage;
        if(healPercent < 0.3){
            app.event.emit(CommonEvent.ShowTips, {tips: app.lang.getLanguage("HurtTips"), id: "HurtTips", duration: 3});
        }

        // if(this._firstHurt){
        //     this._firstHurt = false;
        //     this.modelAni.play()
        // }
    }

    protected onDead(): void {
        super.onDead();
        this.scheduleOnce(() => {
           app.event.emit(CommonEvent.GameFail);
        }, 1);
    }

    private isShowAttackEffect: boolean = false;
    protected onAttackEnter(): void {
        super.onAttackEnter();
        this.isShowAttackEffect = false;
    }

    protected onAttackUpdate(dt: number): void {
        super.onAttackUpdate(dt);
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
    
} 