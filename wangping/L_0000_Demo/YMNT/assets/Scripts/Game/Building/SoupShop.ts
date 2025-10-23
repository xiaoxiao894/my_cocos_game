import { _decorator, Collider, Component, easing, ITriggerEvent, Node, tween, Tween, v3, Vec3 } from 'cc';
import { ItemLayout } from '../Tools/ItemLayout';
import { PickupComponent } from '../Components/PickupComponent';
import { Config } from '../../common/Config';
import { CommonEvent, ObjectType } from '../../common/CommonEnum';
import { PoolManager } from '../PoolManager';
import { DropItemCom } from '../Drop/DropItemCom';
import { Solder } from '../Role/Solder';
const { ccclass, property } = _decorator;

@ccclass('SoupShop')
export class SoupShop extends Component {

    @property({type: ItemLayout, displayName: '汤锅布局'})
    private soupLayout: ItemLayout = null!;

    @property({type: Node, displayName: '等待位置'})
    private waitPos: Node = null!;

    @property({type: Node, displayName: '移动位置'})
    private movePos: Node = null!;

    @property({type: Collider, displayName: '投放触发器'})
    private pickupCollider: Collider = null!;

    @property({type: Node, displayName: '投放状态显示节点'})
    private pickupStateNode: Node = null!;

    @property({type: Collider, displayName: '售货员触发器'})
    private salesclerkCollider: Collider = null!;

    // @property({type: Node, displayName: '售货状态显示节点'})
    // private salesclerkStateNode: Node = null!;

    private pickupComponents: Map<string, PickupComponent> = new Map(); // 存储在 投放触发器内的PickupComponent
    private salesclerkComponents: Map<string, PickupComponent> = new Map(); // 存储在 售货员触发器内的PickupComponent

    private checkTimer: number = 0.1; // 用于在update中控制检查频率
    private checkTimer2: number = 0.1; // 用于在update中控制检查频率

    private waitList: Solder[] = [];
    private isSoupFlying: boolean = false; // 添加标记来跟踪汤是否正在飞行中

    public get WaitPos(): Node {
        return this.waitPos;
    }

    public get attackPos(): Node {
        return this.movePos;
    }

    public get MovePos(): Vec3 {
        return this.movePos.getWorldPosition();
    }

    public get pickupNode(): Node {
        return this.pickupCollider.node;
    }

    public get salesclerkNode(): Node {
        return this.salesclerkCollider.node;
    }

    public get waitLength(): number {
        return this.waitList.length;
    }
    
    protected onLoad(): void {
        this.pickupCollider.on('onTriggerEnter', this.onPickupTriggerEnter, this);
        this.pickupCollider.on('onTriggerExit', this.onPickupTriggerExit, this);
        // this.salesclerkCollider.on('onTriggerEnter', this.onSalesclerkTriggerEnter, this);
        // this.salesclerkCollider.on('onTriggerExit', this.onSalesclerkTriggerExit, this);
    }


    private onPickupTriggerEnter(event: ITriggerEvent ) {
        const node = event.otherCollider.node;
        const pickupComponent = node.getComponent(PickupComponent);
        if(pickupComponent){
            // 添加到Map中跟踪
            this.pickupComponents.set(node.uuid, pickupComponent);
            // console.log('添加到Map中跟踪', node.uuid, pickupComponent);
        }
    }

    private onPickupTriggerExit(event: ITriggerEvent ) {
        const node = event.otherCollider.node;
        if(node && this.pickupComponents.has(node.uuid)){
            // 从Map中移除
            this.pickupComponents.delete(node.uuid);
            // console.log('从Map中移除', node.uuid);
        }
    }


    // private onSalesclerkTriggerEnter(event: ITriggerEvent ) {
    //     const node = event.otherCollider.node;
    //     const salesclerkComponents = node.getComponent(PickupComponent);
    //     if(salesclerkComponents){
    //         // 添加到Map中跟踪
    //         this.salesclerkComponents.set(node.uuid, salesclerkComponents);
    //         // console.log('添加到Map中跟踪', node.uuid, pickupComponent);
    //     }
    // }

    // private onSalesclerkTriggerExit(event: ITriggerEvent ) {
    //     const node = event.otherCollider.node;
    //     if(node && this.salesclerkComponents.has(node.uuid)){
    //         // 从Map中移除
    //         this.salesclerkComponents.delete(node.uuid);
    //         // console.log('从Map中移除', node.uuid);
    //     }
    // }

    private cherkCanSell(): boolean {
        return this.soupLayout.getItemCount() > 0 && this.pickupComponents.size > 0;
    }

    update(dt: number) {
        // 累加时间
        this.checkTimer += dt;
        
        // 当累加时间达到检查间隔时执行检查，确保低帧率时不会漏掉检查次数
        while (this.checkTimer >= Config.UNLOCK_CHECK_INTERVAL) {
            this._checkPickupComponents();
            this.checkTimer -= Config.UNLOCK_CHECK_INTERVAL; // 减去一个间隔时间而不是重置为0
        }

        this.checkTimer2 += dt;
        // 当累加时间达到检查间隔时执行检查，确保低帧率时不会漏掉检查次数
        while (this.checkTimer2 >= 0.1) {
            this.checkWaitSolder();
            this.checkTimer2 -= 0.1; // 减去一个间隔时间而不是重置为0
        }

        const isUsing = this.pickupComponents.size > 0;
        this.pickupStateNode.active = isUsing;
        // const isSalesclerkUsing = this.salesclerkComponents.size > 0;
        // this.salesclerkStateNode.active = isSalesclerkUsing;
        
    }

    
    private _checkPickupComponents() {
        // 遍历所有触发器内的PickupComponent
        this.pickupComponents.forEach((pickupComponent, uuid) => {
            if(pickupComponent && pickupComponent.isValid){
                this.onUse(pickupComponent);
            } else {
                // 如果组件不再有效，从Map中移除
                this.pickupComponents.delete(uuid);
            }
        });
    }

    private onUse(pickupComponent: PickupComponent) {
        if(pickupComponent.getItemCount(ObjectType.DropItemCornSoup ) > 0){
            const consumeList = pickupComponent.consumeItem(ObjectType.DropItemCornSoup , 1);

            if(consumeList.length > 0){
                let item = consumeList[0];
                Tween.stopAllByTarget(item);
                const tarLayoutPos = this.soupLayout.getCurrEmptyPosition();
                const tarPos = this.soupLayout.getItemPosition(tarLayoutPos);
    
                this.soupLayout.reserveItem(tarLayoutPos);
    
                item.setWorldRotationFromEuler(0, 0, 0);
                manager.effect.flyNodeInParabola(item, tarPos, () => {
                    app.audio.playEffect('resources/audio/投入资源');
                    this.soupLayout.addItemToReserve(item, tarLayoutPos);
                    tween(item).to(0.1, {
                        scale: v3(1.5, 1.5, 1.5)
                    }, {
                        easing: easing.sineOut
                    }).to(0.1, {
                        scale: v3(1.2, 1.2, 1.2)
                    }, {
                        easing: easing.sineOut
                    }).start();
                });
            }

        }
    }

    private _lock:boolean = false;
    private checkWaitSolder() {
        if(!this.cherkCanSell() || this._lock) return;
        let soupCount = this.soupLayout.getItemCount()
        if(soupCount > 0 && this.waitList.length > 0){
            const solder = this.waitList[0];
            if(!solder.aiComponent.isCanAddSoup()) return;
            const soupItem = this.soupLayout.getOuterItems(1)[0];
            const target = solder.node;
            
            this.soupLayout.removeItemByNode(soupItem);
            solder.aiComponent.waitAddSoup();
            manager.effect.flyNodeInParabola(soupItem, target, () => {
                app.audio.playEffect('resources/audio/投入资源');
                manager.pool.putNode(soupItem);
                let isFinish = solder.aiComponent.addSoup();
                if(isFinish){
                    this._lock = true;
                    this.RemoveWaitSolder(solder.node);
                    app.event.emit(CommonEvent.SellSuccess, soupItem);
                    this.scheduleOnce(() => {
                        this._lock = false;
                    }, 0.2);
                }
            }, 0.3);
        }
    }

    GetCurrWaitPosition(index?: number): Vec3 {
        index = index === undefined ? this.waitList.length - 1 : index;
        return this.waitPos.getWorldPosition().add(v3( 4 * index, 0, -4 * index));
    }

    AddWaitSolder(node: Node) {
        this.waitList.push(node.getComponent(Solder));
        this.updateSolderPosition();
    }

    RemoveWaitSolder(node: Node) {
        this.waitList = this.waitList.filter(solder => solder.node !== node);
        this.updateSolderPosition();
    }

    private updateSolderPosition() {
        for (let i = 0; i < this.waitList.length; i++) {
            const solder = this.waitList[i];
            solder.aiComponent.setWaitPos(this.GetCurrWaitPosition(i), i);
        }
    }


}


