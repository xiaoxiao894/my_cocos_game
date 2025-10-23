import { _decorator, Node, tween, Vec3, Animation, Quat, Color, ICollisionEvent, ITriggerEvent } from 'cc';
import { CommonEvent, CharacterState, FrameEventId, BuildingType, ObjectType, EffectType, PHY_GROUP } from '../../common/CommonEnum';
import { DamageData } from '../../common/CommonInterface';
import { ComponentInitializer } from '../../common/ComponentInitializer';
import { ComponentEvent } from '../../common/ComponentEvents';
import { HeroAIComponent } from '../AI/HeroAIComponent';
import { HealthComponent } from '../Components/HealthComponent';
import { PickupComponent } from '../Components/PickupComponent';
import { Character } from './Character';
import { BulletBase } from '../Bullet/BulletBase';

const { ccclass, property } = _decorator;

/**
 * 英雄组件 - 基于组件化设计的英雄类
 */
@ccclass('Hero_Girl')
export class Hero_Girl extends Character {
    /** 拾取组件 */
    @property({ type: PickupComponent, displayName: '拾取组件' })
    public pickupComponent: PickupComponent = null!;

    @property({ type: Animation, displayName: '模型动画' })
    public modelAni: Animation = null!;

    @property({ type: HeroAIComponent, displayName: '英雄AI组件' })
    public heroAIComponent: HeroAIComponent = null!;

    @property({ type: Node, displayName: '箭矢发射点' })
    public bulletStartPos: Node = null!;

    onLoad() {
        super.onLoad();

        this.node.on(ComponentEvent.UPDATE_ITEM_COUNT, this.onUpdateItemCount, this);
        this.node.on(ComponentEvent.KNOCKUP_END, this.onKnockupEnd, this);

    }
    private onKnockupEnd(): void {
        if (this.modelAni.getState(this.modelAni.defaultClip.name).isPlaying) {
            this.modelAni.stop();
            tween(this.modelAni.node)
                .to(0.2, { eulerAngles: new Vec3(90, 0, 0), position: new Vec3(0, 0.2, 0) })
                .delay(0.5)
                .to(0.5, { rotation: new Quat(0, 0, 0, 1), position: new Vec3(0, 0, 0) }, { easing: 'backOut' })
                .start();
        }
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
    protected startAttackAnimation() {
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
        if (this.movementComponent.isMoving) {
            let attackTimeScale = this.calculateAttackTimeScale(this.animationComponent.RunAttackAnimName);
            this.animationComponent.playRunAttack(attackTimeScale, false);
        } else {
            let attackTimeScale = this.calculateAttackTimeScale(this.animationComponent.AttackAnimName);
            this.animationComponent.playAttack(attackTimeScale, false);
        }
    }

    protected onMoveStateUpdate(isMoving: boolean) {
        if (this.stateComponent.getCurrentState() === CharacterState.Dead) {
            return;
        }

        if (isMoving) {
            if (this.stateComponent.getCurrentState() != CharacterState.Move) {
                if (this.stateComponent.getCurrentState() === CharacterState.Attack) {
                    // 攻击时，移动不会打断攻击
                } else {
                    this.stateComponent.changeState(CharacterState.Move);
                }
            }
        } else {
            if (this.stateComponent.getCurrentState() != CharacterState.Idle && this.stateComponent.getCurrentState() != CharacterState.Attack) {
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

    private onUpdateItemCount(type: ObjectType, count: number): void {
        app.event.emit(CommonEvent.UpdateHeroItemCount, {
            type: type,
            count: count
        });
    }

    protected onPerformAttack(damageData: DamageData): void {
        const target = this.GetAttackTarget();
        if (target) {
            if (target.getComponent(Character)) {
                this.shootArrow(target, damageData.damage);
            }
        }
    }


    /**
     * 发射箭矢
     * @param targetNode 目标节点
     * @param damage 伤害值
     */
    protected shootArrow(targetNode: Node, damage: number): void {
        // 从对象池获取箭矢实例
        const arrowNode = manager.pool.getNode(ObjectType.BulletSmallStone)!;
        const arrow = arrowNode.getComponent(BulletBase);

        if (!arrow) {
            console.error('箭矢组件未找到！');
            return;
        }

        // 设置箭矢初始位置
        let startPos = this.bulletStartPos.getWorldPosition().clone();

        // 计算射击方向
        const direction = new Vec3();
        Vec3.subtract(direction, targetNode.getWorldPosition(), startPos);
        direction.normalize();

        // 将箭矢添加到场景
        manager.effect.addToEffectLayer(arrowNode);

        // 设置箭矢目标并发射
        arrow.setTarget(targetNode);
        arrow.setDamageColor(Color.RED);
        arrow.damage = damage;
        arrow.createNode = this.node;
        arrow.fire(startPos, direction);
    }

    /**
     * 特殊区域内，视为极大攻击范围
     */
    private _inSpArea: boolean = false;

    public set InSpArea(value: boolean) {
        this._inSpArea = value;
    }

    public GetAttackTarget(): Node | null {
        const attackComponent = this.attackComponent;

        let attackRange = attackComponent.attackRangeValue;
        // 特殊区域内，或游戏结束动画时，视为极大攻击范围
        if (this._inSpArea || !manager.enemy.CanCreateEnemy) {
            attackRange = 1000;
        }

        const enemies = manager.enemy.getRangeEnemies(this.node.position, attackRange);
        if (enemies.length > 0) {
            return enemies[0].node;
        }

        return null;
    }

    public attack(): void {
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

        this.node.emit(ComponentEvent.CHANGE_STATE, isMoving ? CharacterState.Move : CharacterState.Idle);
    }

    // private _firstHurt: boolean = true;
    protected onHurt(damageData: DamageData): void {
        super.onHurt(damageData);
        app.event.emit(CommonEvent.HeroHurt, damageData);

        const healPercent = this.healthComponent.healthPercentage;
        if (healPercent < 0.3) {
            app.event.emit(CommonEvent.ShowTips, { tips: app.lang.getLanguage("HurtTips"), id: "HurtTips", duration: 3 });
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
        // const progress = this.animationComponent.getCurrentAnimationProgress();
        // if (progress >= 0.3 && !this.isShowAttackEffect) {
        //     this.isShowAttackEffect = true;
        //     manager.effect.playEffect(EffectType.Hero_Attack, this.node.getWorldPosition().add(new Vec3(0, 1.3, 0)), this.node.getRotation());
        // }
    }

} 