import { _decorator, Collider, Color, ITriggerEvent, Label, Material, MeshRenderer, Node, Sprite, Tween, UITransform, Vec3 } from 'cc';
import { Character } from './Character';
import { ComponentInitializer } from '../../common/ComponentInitializer';
import { SolderAIComponent } from '../AI/SolderAIComponent';
import { AutoHuntAIComponent } from '../AI/AutoHuntAIComponent';
import { DamageData } from '../../common/CommonInterface';
import { HealthComponent } from '../Components/HealthComponent';
import { BuildingType, CommonEvent, EffectType, ObjectType, PHY_GROUP } from '../../common/CommonEnum';
import { ArcherTowerAIComponent } from '../AI/ArcherTowerAIComponent';
import { ArcherAttackComponent } from '../Components/ArcherAttackComponent';
import { BulletBase } from '../Bullet/BulletBase';
import { PickupComponent } from '../Components/PickupComponent';
import { Config } from '../../common/Config';

const { ccclass, property } = _decorator;

/**
 * 弓箭手防御塔类
 */
@ccclass('ArcherTower')
export class ArcherTower extends Character {
    @property({ type: ArcherTowerAIComponent, displayName: '基础AI组件' })
    public aiComponent: ArcherTowerAIComponent = null!;

    @property({ type: Node, displayName: '子弹数量UI节点' })
    public arrowUINode: Node = null!;

    @property({ type: Collider, displayName: '弹药补充感应区' })
    public ammoSupplyCollider: Collider = null!;

    @property({ type: Node, displayName: '弹药补充感应UI节点' })
    public ammoSupplyUINode: Node = null!;

    @property({ type: Node, displayName: '子弹开始位置节点' })
    public bulletStartPos: Node = null!;

    @property({ type: ObjectType, displayName: '子弹类型' })
    public bulletType: ObjectType = ObjectType.BulletSwab;

    onLoad() {
        super.onLoad();

        ComponentInitializer.initComponents(this.node, {
            aiComponent: ArcherTowerAIComponent,
        }, this);
    }

    protected start(): void {
        super.start();
        this._initArrowUI();
        this._initAmmoSupply();

        manager.game.registerBuilding(BuildingType.SwabArcherTower, this.node, this.ammoSupplyCollider.node.getWorldPosition());
    }

    protected _arrowIcon: Node = null;
    protected _noArrowOutline: Node = null;
    protected _noArrowExclamation: Node = null;
    protected _arrowProgressBar: Sprite = null;
    protected _arrowCountLabel: Label = null;

    protected _initArrowUI(): void {
        this._arrowIcon = this.arrowUINode.getChildByName('arr_icon');
        this._noArrowOutline = this.arrowUINode.getChildByName('outline');
        this._noArrowExclamation = this.arrowUINode.getChildByName('exclamation');
        this._arrowProgressBar = this.arrowUINode.getChildByPath('arr_bg/arr_bar').getComponent(Sprite);
        this._arrowCountLabel = this.arrowUINode.getChildByName('Label').getComponent(Label);

        this.updateArrowProgressBar();
    }

    protected pickupComponents: Map<string, PickupComponent> = new Map(); // 存储在触发器内的PickupComponent
    protected checkTimer: number = 0; // 用于在update中控制检查频率

    protected _initAmmoSupply(): void {
        this.pickupComponents.clear();
        this.ammoSupplyCollider.on('onTriggerEnter', this._onAmmoSupplyTriggerEnter, this);
        this.ammoSupplyCollider.on('onTriggerExit', this._onAmmoSupplyTriggerExit, this);
    }

    protected _onAmmoSupplyTriggerEnter(event: ITriggerEvent): void {
        const node = event.otherCollider.node;
        const pickupComponent = node.getComponent(PickupComponent);
        if (pickupComponent) {
            // 添加到Map中跟踪
            this.pickupComponents.set(node.uuid, pickupComponent);
            // console.log('添加到Map中跟踪', node.uuid, pickupComponent);
        }

        this.ammoSupplyUINode.active = this.pickupComponents.size > 0;
    }

    protected _onAmmoSupplyTriggerExit(event: ITriggerEvent): void {
        const node = event.otherCollider.node;
        if (node && this.pickupComponents.has(node.uuid)) {
            // 从Map中移除
            this.pickupComponents.delete(node.uuid);
            // console.log('从Map中移除', node.uuid);
        }

        this.ammoSupplyUINode.active = this.pickupComponents.size > 0;
    }

    update(dt: number) {
        // 累加时间
        this.checkTimer += dt;
        // 当累加时间达到检查间隔时执行检查，确保低帧率时不会漏掉检查次数
        while (this.checkTimer >= Config.UNLOCK_CHECK_INTERVAL) {
            this._checkPickupComponents();
            this.checkTimer -= Config.UNLOCK_CHECK_INTERVAL; // 减去一个间隔时间而不是重置为0
        }
    }

    protected _checkPickupComponents() {
        const archerAt = this.attackComponent as ArcherAttackComponent;
        if (archerAt.getCurrentAmmo() >= archerAt.getMaxAmmo()) {
            return;
        }
        // 遍历所有触发器内的PickupComponent
        this.pickupComponents.forEach((pickupComponent, uuid) => {
            if (pickupComponent && pickupComponent.isValid) {
                this.OnCost(pickupComponent, pickupComponent.node.getWorldPosition());
            } else {
                // 如果组件不再有效，从Map中移除
                this.pickupComponents.delete(uuid);
            }
        });
    }

    /** 直接补充物品 */
    public addArrowByWpos(wpos: Vec3) {
        let consumptionType = ObjectType.DropItemSwab;
        if (this.bulletType == ObjectType.BulletExplosionFruit) {
            consumptionType = ObjectType.DropItemExplosionFruit;
        }
        const position = wpos;
        let item = manager.pool.getNode(consumptionType, manager.effect.node)!;
        item.setWorldPosition(position);

        const parent = manager.effect.node;
        item.setParent(parent, true);

        item.setRotationFromEuler(new Vec3(0, 0, 0));

        const archerAt = this.attackComponent as ArcherAttackComponent;
        archerAt.setCurrentAmmo(archerAt.getCurrentAmmo() + 1);
        manager.effect.flyNodeInParabola(item, this.bulletStartPos, () => {
            app.audio.playEffect('resources/MQBY/投入资源');
            this.updateArrowProgressBar()
            manager.pool.putNode(item);
        });
    }

    /** 从拾取组件中补充物品 */
    public OnCost(pickupComponent: PickupComponent, wpos: Vec3) {
        let consumptionType = ObjectType.DropItemSwab;
        if (this.bulletType == ObjectType.BulletExplosionFruit) {
            consumptionType = ObjectType.DropItemExplosionFruit;
        }
        const consumeList = pickupComponent.consumeItem(consumptionType, 1);

        let item = null;
        if (consumeList.length > 0) {
            item = consumeList[0];
            Tween.stopAllByTarget(item);
        } else {
            return;
        }

        const parent = manager.effect.node;
        item.setParent(parent, true);

        item.setRotationFromEuler(new Vec3(0, 0, 0));

        const archerAt = this.attackComponent as ArcherAttackComponent;
        manager.effect.flyNodeInParabola(item, this.bulletStartPos, () => {
            app.audio.playEffect('resources/MQBY/投入资源');
            archerAt.setCurrentAmmo(archerAt.getCurrentAmmo() + 1);
            this.updateArrowProgressBar()
            manager.pool.putNode(item);
        });
    }

    /**
     * 更新箭数量进度条显示
     */
    protected updateArrowProgressBar(): void {
        let arrowCount = 0, maxArrowCount = 10;
        let archerAt = this.attackComponent as ArcherAttackComponent;
        arrowCount = archerAt.getCurrentAmmo();
        maxArrowCount = archerAt.getMaxAmmo();

        arrowCount = Math.max(arrowCount, 0);
        maxArrowCount = Math.max(maxArrowCount, 1);

        if (this._arrowProgressBar) {
            this._arrowProgressBar.fillRange = arrowCount / maxArrowCount;
        }

        // 如果有箭数量显示节点，更新显示的文本
        if (this._arrowCountLabel) {
            this._arrowCountLabel.string = `${arrowCount}/${maxArrowCount}`;
        }

        // 更新箭数量显示节点的可见性
        if (arrowCount <= 0) {
            this._noArrowOutline.active = true;
            this._noArrowExclamation.active = true;
        }
        else if (arrowCount < maxArrowCount / 2) {
            this._noArrowOutline.active = true;
            this._noArrowExclamation.active = false;
        }
        else {
            this._noArrowOutline.active = false;
            this._noArrowExclamation.active = false;
        }
    }

    onDestroy() {
        super.onDestroy();
    }

    protected onPerformAttack(damageData: DamageData): void {
        this.updateArrowProgressBar();

        let attackTarget = this.GetAttackTarget();
        if (!attackTarget) {
            return;
        }

        // 只管放箭，箭的伤害计算在箭的脚本中
        this.shootArrow(attackTarget, damageData.damage);

    }

    /**
     * 发射箭矢
     * @param targetNode 目标节点
     * @param damage 伤害值
     */
    protected shootArrow(targetNode: Node, damage: number): void {
        // 从对象池获取箭矢实例
        const arrowNode = manager.pool.getNode(this.bulletType)!;
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

        this.bulletStartPos.active = false;
        this.scheduleOnce(() => {
            this.bulletStartPos.active = this._arrowProgressBar.fillRange > 0;
        }, 0.5);
    }

    _attackHealth: HealthComponent = null;
    public GetAttackTarget(): Node | null {
        // 始终攻击一个目标，直到该目标死亡
        if (this._attackHealth && !this._attackHealth.isDead) {
            return this._attackHealth.node;
        }

        this._attackHealth = null;

        const attackComponent = this.attackComponent;
        const attackRange = attackComponent.attackRangeValue;

        // // 优先选择精英怪
        // const eliteEnemys = manager.enemy.getEliteEnemys();
        // if (eliteEnemys.length > 0) {
        //     const eliteWpos = eliteEnemys[0].getWorldPosition();
        //     if (Vec3.distance(this.node.worldPosition, eliteWpos) <= attackRange) {
        //         this._attackHealth = eliteEnemys[0].getComponent(HealthComponent);
        //         return eliteEnemys[0];
        //     }
        // }

        const enemies = manager.enemy.getRangeEnemies(this.node.worldPosition, attackRange);
        if (enemies.length > 0) {
            this._attackHealth = enemies[0].node.getComponent(HealthComponent);
            return enemies[0].node;
        }

        return null;
    }

    public reset(): void {
        super.reset();
        this.aiComponent.reset();
    }

    protected onDead(): void {
        super.onDead();
        // 通知敌人管理器回收
        this.scheduleOnce(() => {
            this.node.active = false;
        }, 1.5);
    }

    protected onHurt(damageData: DamageData): void {
        super.onHurt(damageData);
        app.event.emit(CommonEvent.SolderHurt, damageData);
    }

    protected onAttackEnter(): void {
        super.onAttackEnter();
    }
} 