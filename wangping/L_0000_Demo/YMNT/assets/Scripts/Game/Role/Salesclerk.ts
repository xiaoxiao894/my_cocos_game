import { _decorator, Node, sys, tween, UITransform, Vec3 } from 'cc';
import { Character } from './Character';
import { ComponentInitializer } from '../../common/ComponentInitializer';
import { AutoHuntAIComponent } from '../AI/AutoHuntAIComponent';
import { SalesclerkAIComponent } from '../AI/SalesclerkAIComponent';
import { PickupComponent } from '../Components/PickupComponent';
import { BuildingType, CommonEvent, ObjectType } from '../../common/CommonEnum';

const { ccclass, property } = _decorator;

/**
 * 士兵组件 - 基于组件化设计的士兵类
 */
@ccclass('Salesclerk')
export class Salesclerk extends Character {

    @property({type: SalesclerkAIComponent, displayName: '基础AI组件'})
    public aiComponent: SalesclerkAIComponent = null!;

    @property({type: PickupComponent, displayName: '拾取组件'})
    public pickupComponent: PickupComponent = null!;

    onLoad() {
        super.onLoad();

        ComponentInitializer.initComponents(this.node, {
            aiComponent: SalesclerkAIComponent,
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
    
    public GetAttackTarget(): Node | null {
        return null;
    }

    private onUnlockItem(item: BuildingType): void {
        if(item === BuildingType.Salesclerk){
            this.node.active = true;
            this.node.setScale(0, 0, 0);
            tween(this.node).to(0.5, {scale: new Vec3(1, 1, 1)}, {easing: 'backOut'}).call(() => {
                this.aiComponent.AIEnabled = true;
            }).start();
        }
    }

    public reset(): void {
        super.reset();
        this.aiComponent.reset();
    }

    protected onDead(): void {
        super.onDead();
    }
} 