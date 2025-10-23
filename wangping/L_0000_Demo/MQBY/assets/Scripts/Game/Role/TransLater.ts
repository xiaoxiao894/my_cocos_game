import { _decorator, Node, sys, tween, UITransform, Vec3 } from 'cc';
import { Character } from './Character';
import { ComponentInitializer } from '../../common/ComponentInitializer';
import { AutoHuntAIComponent } from '../AI/AutoHuntAIComponent';
import { DamageData } from '../../common/CommonInterface';
import { HealthComponent } from '../Components/HealthComponent';
import { TransLaterAIComponent } from '../AI/TransLaterAIComponent';
import { PickupComponent } from '../Components/PickupComponent';
import { BuildingType, CommonEvent, ObjectType } from '../../common/CommonEnum';

const { ccclass, property } = _decorator;

/**
 * 士兵组件 - 基于组件化设计的士兵类
 */
@ccclass('TransLater')
export class TransLater extends Character {
    @property({type: TransLaterAIComponent, displayName: '基础AI组件'})
    public aiComponent: TransLaterAIComponent = null!;

    @property({type: PickupComponent, displayName: '拾取组件'})
    public pickupComponent: PickupComponent = null!;

    @property({displayName: '攻击角度范围', tooltip: '英雄前方攻击扇形角度（度数），默认90度'})
    public attackAngleRange: number = 90;

    onLoad() {
        super.onLoad();

        ComponentInitializer.initComponents(this.node, {
            aiComponent: TransLaterAIComponent,
            autoHuntAIComponent: AutoHuntAIComponent,
            pickupComponent: PickupComponent
        }, this);
    }

    protected start(): void {
        this.aiComponent.AIEnabled = false;

        this.node.active = false;
    }

    protected registerEvents(): void {
        super.registerEvents();

        app.event.on(CommonEvent.UnlockItem, this.onUnlockItem, this);
    }

    protected unregisterEvents(): void {
        super.unregisterEvents();

        app.event.offAllByTarget(this);
    }

    private onUnlockItem(item: BuildingType): void {
        // if(item === BuildingType.TransLater){
        //     this.node.active = true;
        //     this.node.setScale(0, 0, 0);
        //     tween(this.node).to(0.5, {scale: new Vec3(1, 1, 1)}, {easing: 'backOut'}).call(() => {
        //         this.aiComponent.AIEnabled = true;
        //     }).start();
        // }
    }

    protected onPerformAttack(damageData: DamageData): void {
        // console.log('onHeroPerformAttack', damageData);
        const target = this.GetAttackTarget();
        if(target){
            const healthComponent = target.getComponent(HealthComponent);
            if(healthComponent && !healthComponent.isDead){
                healthComponent.takeDamage(damageData);
            }
        }
    }

    public GetAttackTarget(): Node | null {
        const attackComponent = this.attackComponent;
        const attackRange = attackComponent.attackRangeValue;

        // 检查目标是否在设定的前方角度范围内
        const isTargetInFront = (targetPos: Vec3): boolean => {
            const heroPos = this.node.position;
            const heroForward = this.node.forward;
            
            // 计算从英雄到目标的方向向量
            const toTarget = new Vec3();
            Vec3.subtract(toTarget, targetPos, heroPos);
            toTarget.normalize();
            
            // 计算角度（点积）
            const dot = Vec3.dot(heroForward, toTarget);
            
            // 将攻击角度范围转换为半角度的余弦值
            // 例如：90度范围 = 左右各45度，cos(45°) ≈ 0.707
            const halfAngleRad = (this.attackAngleRange * 0.5) * Math.PI / 180;
            const cosHalfAngle = Math.cos(halfAngleRad);
            
            return dot >= cosHalfAngle;
        };

        // const corn = manager.game.bigCorn;
        // if(corn && corn.isValid){
        //     const distance = Vec3.distance(this.node.position, corn.node.position);
        //     if(distance <= attackRange && isTargetInFront(corn.node.position)){
        //         return corn.node;
        //     }
        // }
        
        return null;
    }

    public reset(): void {
        super.reset();
        this.aiComponent.reset();
    }

    protected onDead(): void {
        super.onDead();
    }
} 