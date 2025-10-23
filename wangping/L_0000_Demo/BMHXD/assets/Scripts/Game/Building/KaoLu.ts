import { _decorator, Collider, Component, easing, ITriggerEvent, Label, Node, SkeletalAnimation, tween, Tween, v3, Vec3 } from 'cc';
import { ItemLayout } from '../Tools/ItemLayout';
import { PickupComponent } from '../Components/PickupComponent';
import { Config } from '../../common/Config';
import { ObjectType } from '../../common/CommonEnum';
import { PoolManager } from '../PoolManager';
import { DropItemCom } from '../Drop/DropItemCom';
const { ccclass, property } = _decorator;

@ccclass('KaoLu')
export class KaoLu extends Component {

    @property(ItemLayout)
    private cornLayout: ItemLayout = null;

    @property(ItemLayout)
    private cronSoupLayout: ItemLayout = null;

    @property(Node)
    private cookPos: Node = null;

    @property(Collider)
    public putInCollider: Collider = null;

    @property(Node)
    private inGreen: Node = null;

    @property(Collider)
    public putOutCollider: Collider = null;

    @property(Node)
    private outGreen: Node = null;
    
    @property(Node)
    private noCornTip: Node = null;

    @property({
        type: Label,
        displayName: '玉米数量',
        tooltip: '例: x100'
    })
    private cornNum: Label = null;

    private inPickupComponents: Map<string, PickupComponent> = new Map(); // 存储在触发器内的PickupComponent
    private outPickupComponents: Map<string, PickupComponent> = new Map(); // 存储在触发器内的PickupComponent

    private checkTimer: number = 0.1; // 用于在update中控制检查频率
    private cookingTimer: number = 0.1; // 用于烹饪计时
    private readonly COOKING_INTERVAL: number = 0.1; // 烹饪间隔（秒）
    private isCooking: boolean = false; // 是否正在烹饪状态
    
    protected onLoad(): void {
        this.putInCollider.on('onTriggerEnter', this.onInTriggerEnter, this);
        this.putInCollider.on('onTriggerExit', this.onInTriggerExit, this);
        this.putOutCollider.on('onTriggerEnter', this.onOutTriggerEnter, this);
        this.putOutCollider.on('onTriggerExit', this.onOutTriggerExit, this);
        
        // 初始化UI显示
        this._updateCornDisplay();
    }

    protected onDestroy(): void {
        
    }

    update(dt: number) {
        // 累加时间
        this.checkTimer += dt;
        this.cookingTimer += dt;
        
        // 当累加时间达到检查间隔时执行检查，确保低帧率时不会漏掉检查次数
        while (this.checkTimer >= Config.UNLOCK_CHECK_INTERVAL) {
            this._checkPickupComponents();
            this.checkTimer -= Config.UNLOCK_CHECK_INTERVAL; // 减去一个间隔时间而不是重置为0
        }

        // 烹饪计时器检查
        while (this.cookingTimer >= this.COOKING_INTERVAL) {
            this._processCooking();
            this.cookingTimer -= this.COOKING_INTERVAL;
        }

        const isUsing = this.inPickupComponents.size > 0;
        this.inGreen.active = isUsing;
        this.outGreen.active = this.outPickupComponents.size > 0;
    }

    private onInTriggerEnter(event: ITriggerEvent ) {
        const node = event.otherCollider.node;
        const pickupComponent = node.getComponent(PickupComponent);
        if(pickupComponent){
            // 添加到Map中跟踪
            this.inPickupComponents.set(node.uuid, pickupComponent);
            // console.log('添加到Map中跟踪', node.uuid, pickupComponent);
        }
    }

    private onInTriggerExit(event: ITriggerEvent ) {
        const node = event.otherCollider.node;
        if(node && this.inPickupComponents.has(node.uuid)){
            // 从Map中移除
            this.inPickupComponents.delete(node.uuid);
            // console.log('从Map中移除', node.uuid);
        }
    }

    private onOutTriggerEnter(event: ITriggerEvent ) {
        const node = event.otherCollider.node;
        const pickupComponent = node.getComponent(PickupComponent);
        if(pickupComponent){
            this.outPickupComponents.set(node.uuid, pickupComponent);
        }
    }

    private onOutTriggerExit(event: ITriggerEvent ) {
        const node = event.otherCollider.node;
        if(node && this.outPickupComponents.has(node.uuid)){
            this.outPickupComponents.delete(node.uuid);
        }
    }
    
    private _checkPickupComponents() {
        // 遍历所有触发器内的PickupComponent
        this.inPickupComponents.forEach((pickupComponent, uuid) => {
            if(pickupComponent && pickupComponent.isValid){
                this.onUse(pickupComponent);
            } else {
                // 如果组件不再有效，从Map中移除
                this.inPickupComponents.delete(uuid);
            }
        });

        this.outPickupComponents.forEach((pickupComponent, uuid) => {
            if(pickupComponent && pickupComponent.isValid && pickupComponent.canPickupItem(ObjectType.DropItemCornSoup)){
                this.onPickupSoup(pickupComponent);
            } else {
                this.outPickupComponents.delete(uuid);
            }
        });
    }

    private onUse(pickupComponent: PickupComponent) {
        if(pickupComponent.getItemCount(ObjectType.DropItemCornKernel ) > 0){
            const consumeList = pickupComponent.consumeItem(ObjectType.DropItemCornKernel , 1);

            let item: Node = null;
            if(consumeList.length > 0){
                item = consumeList[0];
                Tween.stopAllByTarget(item);
                
                const tarLayoutPos = this.cornLayout.getCurrEmptyPosition();
                const tarPos = this.cornLayout.getItemPosition(tarLayoutPos);
    
                this.cornLayout.reserveItem(tarLayoutPos);
    
                item.setWorldRotationFromEuler(0, 0, 0);
                manager.effect.flyNodeInParabola(item, tarPos, () => {
                    app.audio.playEffect('resources/audio/投入资源');
                    this.cornLayout.addItemToReserve(item, tarLayoutPos);
                    tween(item).to(0.1, {
                        scale: v3(1.2, 1.2, 1.2)
                    }, {
                        easing: easing.sineOut
                    }).to(0.1, {
                        scale: v3(1, 1, 1)
                    }, {
                        easing: easing.sineOut
                    }).start();
                });
            }
        }
    }

    private _processCooking() {
        const soupItems = this.cornLayout.getOuterItems(1);
        if (soupItems.length === 0) {
            return; // 没有汤，无法烹饪
        }

        const soupItem = soupItems[0];
        const dropItemCom = soupItem.getComponent(DropItemCom);
        if(dropItemCom){
            this.cornLayout.removeItemByNode(soupItem);
            let tarPos = this.cookPos.getWorldPosition();
            manager.effect.flyNodeInParabola(soupItem, tarPos, () => {
                app.audio.playEffect('resources/audio/投入资源');
                manager.pool.putNode(soupItem);
                this._createSoup();
            }, 0.3);
            
        }
    }


    private onPickupSoup(pickupComponent: PickupComponent) {
        const soupItems = this.cronSoupLayout.getOuterItems(1);
        if (soupItems.length === 0) {
            return; // 没有汤，无法烹饪
        }
        const soupItem = soupItems[0];
        const dropItemCom = soupItem.getComponent(DropItemCom);
        if(dropItemCom){
            this.cronSoupLayout.removeItemByNode(soupItem);
            pickupComponent.pickupItem(dropItemCom);
        }
    }

    private _updateCornDisplay() {
        // 更新玉米数量显示
        if (this.cornNum) {
            this.cornNum.string = `${this.cornLayout.getItemCount()}`;
        }
        
        // 更新无玉米提示
        if (this.noCornTip) {
            this.noCornTip.active = this.cornLayout.getItemCount() === 0;
        }
    }

    private _createSoup() {
        // 使用对象池获取汤对象
        const soup = manager.pool.getNode(ObjectType.DropItemCornSoup);
        if (!soup) {
            console.warn('无法从对象池获取汤对象');
            return;
        }

        // 获取汤容器的空位置
        const soupLayoutPos = this.cronSoupLayout.getCurrEmptyPosition();
        if (!soupLayoutPos) {
            console.warn('汤容器已满，无法添加更多汤');
            // 回收汤对象
            manager.pool.putNode(soup);
            return;
        }
        soup.setWorldPosition(this.cookPos.getWorldPosition());
        soup.setScale(1, 1, 1);
        soup.setRotationFromEuler(0, 0, 0);

        // 预留位置
        this.cronSoupLayout.reserveItem(soupLayoutPos);
        
        // 获取目标位置
        const tarPos = this.cronSoupLayout.getItemPosition(soupLayoutPos);

        manager.effect.flyNodeInParabola(soup, tarPos, () => {
            app.audio.playEffect('resources/audio/投入资源');
            this.cronSoupLayout.addItemToReserve(soup, soupLayoutPos);

            tween(soup).to(0.1, {
                scale: v3(1.2, 1.2, 1.2)
            }, {
                easing: easing.sineOut
            }).to(0.1, {
                scale: v3(1, 1, 1)
            }, {
                easing: easing.sineOut
            }).start();
        }, 0.3);
    }
}


