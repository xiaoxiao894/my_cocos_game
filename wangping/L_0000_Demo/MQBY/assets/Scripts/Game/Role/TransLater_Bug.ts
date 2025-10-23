import { _decorator, Node, sys, tween, UITransform, Vec3 } from 'cc';
import { Character } from './Character';
import { ComponentInitializer } from '../../common/ComponentInitializer';
import { PickupComponent } from '../Components/PickupComponent';
import { BuildingType, CommonEvent, ObjectType } from '../../common/CommonEnum';
import { TransLaterBugAIComponent } from '../AI/TransLaterBugAIComponent';

const { ccclass, property } = _decorator;

/**
 * 小甲虫搬运工
 */
@ccclass('TransLater_Bug')
export class TransLater_Bug extends Character {
    @property({ type: TransLaterBugAIComponent, displayName: '基础AI组件' })
    public aiComponent: TransLaterBugAIComponent = null!;

    @property({ type: PickupComponent, displayName: '拾取组件' })
    public pickupComponent: PickupComponent = null!;

    @property({ type: BuildingType, displayName: '解锁建筑' })
    public unlockBuilding: BuildingType = BuildingType.SwabTransLater;

    onLoad() {
        super.onLoad();

        ComponentInitializer.initComponents(this.node, {
            aiComponent: TransLaterBugAIComponent,
            pickupComponent: PickupComponent
        }, this);

        app.event.on(CommonEvent.UnlockItem, this.onUnlockItem, this);
    }

    protected start(): void {
        super.start();
        this.aiComponent.AIEnabled = false;
        this.node.active = false;

        if (this.unlockBuilding == BuildingType.SwabTransLater) {
            this.aiComponent.carryItemType = ObjectType.StackItemSwab;
        }
        else if (this.unlockBuilding == BuildingType.ExplosionFruitTransLater) {
            this.aiComponent.carryItemType = ObjectType.StackItemExplosionFruit;
        }
        this.aiComponent.pickUpItemMax = this.pickupComponent.itemContainer[0].itemMaxCount;
    }

    protected unregisterEvents(): void {
        super.unregisterEvents();

        app.event.offAllByTarget(this);
    }

    private onUnlockItem(item: BuildingType): void {
        if (item === this.unlockBuilding) {
            this.node.active = true;
            this.node.setScale(0, 0, 0);
            tween(this.node).to(0.5, { scale: new Vec3(1, 1, 1) }, { easing: 'backOut' }).call(() => {
                this.aiComponent.AIEnabled = true;
            }).start();
        }
    }

    public GetAttackTarget(): Node | null {
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