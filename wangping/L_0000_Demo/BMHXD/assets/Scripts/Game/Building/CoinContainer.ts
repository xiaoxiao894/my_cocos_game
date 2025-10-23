import { _decorator, Collider, Component, ITriggerEvent, Node, Tween, v3, Vec3 } from 'cc';
import { ItemLayout } from '../Tools/ItemLayout';
import { PickupComponent } from '../Components/PickupComponent';
import { DropItemCom } from '../Drop/DropItemCom';
import { CommonEvent, ObjectType } from '../../common/CommonEnum';
import { Config } from '../../common/Config';
import { ComponentEvent } from '../../common/ComponentEvents';
const { ccclass, property } = _decorator;

@ccclass('CoinContainer')
export class CoinContainer extends Component {

    @property({type: ItemLayout, displayName: '金币布局'})
    private coinLayout: ItemLayout = null!;

    @property({type: Collider, displayName: '金币容器触发器'})
    private coinContainerCollider: Collider = null!;

    private pickupComponents: Map<string, PickupComponent> = new Map(); // 存储在触发器内的PickupComponent
    private checkTimer: number = 0.1; // 用于在update中控制检查频率
    protected onLoad(): void {
        this.coinContainerCollider.on('onTriggerEnter', this.onTriggerEnter, this);
        this.coinContainerCollider.on('onTriggerExit', this.onTriggerExit, this);

        this.coinLayout.node.on(ComponentEvent.LAYOUT_COUNT_CHANGED, this.onLayoutCountChanged, this);  // 监听金币布局数量变化
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

    private _checkPickupComponents() {
        // 遍历所有触发器内的PickupComponent
        this.pickupComponents.forEach((pickupComponent, uuid) => {
            if(pickupComponent && pickupComponent.isValid){
                this.onPickup(pickupComponent);
            } else {
                // 如果组件不再有效，从Map中移除
                this.pickupComponents.delete(uuid);
            }
        });
    }

    private onTriggerEnter(event: ITriggerEvent ) {
        const node = event.otherCollider.node;
        const pickupComponent = node.getComponent(PickupComponent);
        if(pickupComponent){
            // 添加到Map中跟踪
            this.pickupComponents.set(node.uuid, pickupComponent);
            // console.log('添加到Map中跟踪', node.uuid, pickupComponent);
        }
    }

    private onTriggerExit(event: ITriggerEvent ) {
        const node = event.otherCollider.node;
        if(node && this.pickupComponents.has(node.uuid)){
            // 从Map中移除
            this.pickupComponents.delete(node.uuid);
        }
    }

    private onLayoutCountChanged(currentCount: number, previousCount: number) {
        if(currentCount > previousCount){
            app.event.emit(CommonEvent.CoinCountChanged);
        }
    }

    onPickup(pickupComponent: PickupComponent) {
        const coinItems = this.coinLayout.getOuterItems(1);
        if (coinItems.length === 0) {
            return; // 没有金币，无法拾取
        }
        const coinItem = coinItems[0];
        const dropItemCom = coinItem.getComponent(DropItemCom);
        if(dropItemCom && pickupComponent.canPickupItem(dropItemCom.objectType)){
            this.coinLayout.removeItemByNode(coinItem);
            pickupComponent.pickupItem(dropItemCom);
        }
        app.event.emit(CommonEvent.PickupCoin);
    }

    /**
     * 接收金币并让其飞到容器中
     * @param fromPosition 金币的起始位置
     * @returns 是否成功接收金币
     */
    public receiveCoin(fromPosition: Vec3): boolean {
        // 获取金币对象
        const coin = manager.pool.getNode(ObjectType.DropItemCoin);
        if (!coin) {
            console.warn('无法从对象池获取金币对象');
            return false;
        }

        // 检查金币容器是否有空位置
        const layoutPos = this.coinLayout.getCurrEmptyPosition();
        if (!layoutPos) {
            console.warn('金币容器已满');
            manager.pool.putNode(coin);
            return false;
        }

        // 设置金币初始位置
        const startPos = fromPosition.clone();
        startPos.y += 1; // 稍微提高一点
        coin.setWorldPosition(startPos);

        // 将金币添加到效果层
        manager.effect.addToEffectLayer(coin);

        // 预留位置
        this.coinLayout.reserveItem(layoutPos);
        
        // 获取目标位置
        const targetPos = this.coinLayout.getItemPosition(layoutPos);

        // 使用抛物线飞行到目标位置
        manager.effect.flyNodeInParabola(coin, targetPos, () => {
            const dropItemCom = coin.getComponent(DropItemCom);
            if (dropItemCom) {
                dropItemCom.reset();
                dropItemCom.canPickup = true;
            }
            
            // 将金币添加到容器布局中
            this.coinLayout.addItemToReserve(coin, layoutPos);
            coin.setRotationFromEuler(0, 0, 0);
            
        });

        return true;
    }

    public getCoinCount(): number {
        return this.coinLayout.getItemCount();
    }
}


