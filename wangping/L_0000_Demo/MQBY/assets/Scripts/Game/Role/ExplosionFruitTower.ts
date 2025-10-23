import { _decorator, Animation, animation, AnimationManager, Collider, Color, ITriggerEvent, Label, Material, MeshRenderer, Node, Sprite, tween, Tween, UITransform, Vec3 } from 'cc';
import { BuildingType, CommonEvent, EffectType, ObjectType, PHY_GROUP } from '../../common/CommonEnum';
import { ArcherTower } from './ArcherTower';
import { ArcherAttackComponent } from '../Components/ArcherAttackComponent';
import { HealthComponent } from '../Components/HealthComponent';

const { ccclass, property } = _decorator;

/**
 * 爆炸果实防御塔类
 */
@ccclass('ExplosionFruitTower')
export class ExplosionFruitTower extends ArcherTower {
    /** 自定义攻击帧动画 */
    @property({ type: Animation })
    private attackAnimation: Animation;

    onLoad(): void {
        super.onLoad();
        app.event.on(CommonEvent.UnlockItem, this.onUnlockItem, this);

        manager.game.registerBuilding(BuildingType.ExplosionFruitDefenseTower, this.node, this.ammoSupplyCollider.node.getWorldPosition());

        this._hideAll();
    }

    protected start(): void {
        this.initCollider();
        this.registerEvents();
        this._initArrowUI();
        this._initAmmoSupply();

    }

    _hideAll() {
        this.node.active = false;
        this.uiNode.active = false;
        this.animationComponent.getAnimationNode().active = false;
        this.aiComponent.AIEnabled = false;
    }

    _showAll() {
        this.node.active = true;
        this.uiNode.active = true;
        this.animationComponent.getAnimationNode().active = true;
        this.aiComponent.AIEnabled = true;
    }

    onUnlockItem(itemType: BuildingType): void {
        if (itemType == BuildingType.ExplosionFruitDefenseTower) {
            this._showAll();
        }
    }

    private _isPlayingAttackAni: boolean = false;

    /** 没有骨骼动画，另外操作攻击动画 */
    protected onAttackEnter(): void {
        this.movementComponent.IsKeepFace = true;
        if (this.attackAnimation) {
            this.attackAnimation.play();
            this._isPlayingAttackAni = true;
            this.scheduleOnce(() => {
                this.attackComponent.performAttack();
            }, 0.4);

            // 动画播放完毕后，更新标记
            this.attackAnimation.once(Animation.EventType.FINISHED, () => {
                this._isPlayingAttackAni = false;
            })
        }
        else {
            this._isPlayingAttackAni = true;
            this.scheduleOnce(() => {
                this.attackComponent.performAttack();
                this._isPlayingAttackAni = false;
            }, 0.2);
        }
    }

    protected onAttackUpdate(dt: number): void {
        if (!this.attackAnimation || !this._isPlayingAttackAni) {
            this.handleAttackComplete();
        }

        const target = this.GetAttackTarget();
        if (target) {
            this.attackComponent.updateAttackTarget(target);
        } else {
            this.waitForAttackCooldown();
        }
    }

    public addArrowByWpos(wpos: Vec3): void {
        let consumptionType = ObjectType.DropItemSwab;
        if (this.bulletType == ObjectType.BulletExplosionFruit) {
            consumptionType = ObjectType.DropItemExplosionFruit;
        }
        const position = wpos;
        let item = manager.pool.getNode(consumptionType, manager.effect.node)!;
        item.setWorldPosition(position);

        const parent = manager.effect.node;
        item.setParent(parent, true);

        tween(item)
            .set({ scale: new Vec3(1.5, 1.5, 1.5) })
            .to(0.3, { scale: new Vec3(2.5, 2.5, 2.5) })
            .start();

        item.setRotationFromEuler(new Vec3(0, 0, 0));

        const archerAt = this.attackComponent as ArcherAttackComponent;
        archerAt.setCurrentAmmo(archerAt.getCurrentAmmo() + 1);
        manager.effect.flyNodeInParabola(item, this.bulletStartPos, () => {
            app.audio.playEffect('resources/MQBY/投入资源');
            this.updateArrowProgressBar()
            manager.pool.putNode(item);
        });

    }

    
    public GetAttackTarget(): Node | null {
            // 始终攻击一个目标，直到该目标死亡
            if (this._attackHealth && !this._attackHealth.isDead) {
                return this._attackHealth.node;
            }
    
            this._attackHealth = null;
    
            const attackComponent = this.attackComponent;
            const attackRange = attackComponent.attackRangeValue;
    
            // 打最近的单位
            const enemies = manager.enemy.getRangeEnemies(this.node.worldPosition, attackRange);
            if (enemies.length > 0) {
                this._attackHealth = enemies[0].node.getComponent(HealthComponent);
                return enemies[0].node;
            }
    
            return null;

    }
} 