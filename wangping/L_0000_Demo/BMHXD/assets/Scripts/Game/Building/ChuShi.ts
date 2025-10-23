import { _decorator, Collider, Component, ITriggerEvent, Label, Node, SkeletalAnimation, tween, Tween, v3, Vec3 } from 'cc';
import { ItemLayout } from '../Tools/ItemLayout';
import { PickupComponent } from '../Components/PickupComponent';
import { Config } from '../../common/Config';
import { ObjectType } from '../../common/CommonEnum';
import { PoolManager } from '../PoolManager';
import { DropItemCom } from '../Drop/DropItemCom';
const { ccclass, property } = _decorator;

@ccclass('ChuShi')
export class ChuShi extends Component {

    @property({
        type: SkeletalAnimation,
        displayName: '动画',
        tooltip: '烹饪动画'
    })
    private anim: SkeletalAnimation = null;

    @property(Node)
    private cornFlyPos: Node = null;

    @property(ItemLayout)
    private cronSoupLayout: ItemLayout = null;

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
    private shouldStopAfterAnimation: boolean = false; // 标记是否在动画结束后停止
    
    // 新增烹饪时间相关属性
    private cookingQueue: number = 0; // 正在烹饪的汤数量
    
    // 玉米和汤的计数
    private totalCornCount: number = 0; // 厨师这边剩余的玉米总数
    
    protected onLoad(): void {
        this.putInCollider.on('onTriggerEnter', this.onInTriggerEnter, this);
        this.putInCollider.on('onTriggerExit', this.onInTriggerExit, this);
        this.putOutCollider.on('onTriggerEnter', this.onOutTriggerEnter, this);
        this.putOutCollider.on('onTriggerExit', this.onOutTriggerExit, this);
        
        // 监听动画播放完成事件
        if (this.anim) {
            this.anim.on(SkeletalAnimation.EventType.FINISHED, this.onAnimationFinished, this);
        }
        
        // 初始化UI显示
        this._updateCornDisplay();
    }

    protected onDestroy(): void {
        // 移除动画事件监听器
        if (this.anim) {
            this.anim.off(SkeletalAnimation.EventType.FINISHED, this.onAnimationFinished, this);
        }
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
            }

            // 玉米飞向cornFlyPos然后回收
            const tarPos = this.cornFlyPos.getWorldPosition();
            item.setRotationFromEuler(0, 0, 0);
            manager.effect.flyNodeInParabola(item, tarPos, () => {
                app.audio.playEffect('resources/audio/投入资源');
                // 回收玉米到对象池
                PoolManager.instance.putNode(item);
                // 增加玉米计数（玉米已经到达厨师这边）
                this.totalCornCount++;
                this._updateCornDisplay();
            });
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

    private _startCookingSoup() {
        // 将汤加入烹饪队列
        this.cookingQueue++;
    }

    private _completeCookingSoup() {
        // 完成五份汤的烹饪
        const completedSoups = Math.min(5, this.cookingQueue); // 最多完成5份，但不能超过当前烹饪队列数量
        this.cookingQueue -= completedSoups;
        this.schedule(() => {
            this._createSoup();
        }, 0.1, completedSoups - 1);
        // console.log(`完成烹饪${completedSoups}份汤，当前汤数量：`, this.availableSoupCount, '，剩余烹饪队列：', this.cookingQueue);
    }

    private _processCooking() {
        // 如果有存储的玉米且烹饪队列有空余，消耗玉米开始烹饪
        if (this.totalCornCount > 0 && this.cookingQueue < 5) { // 限制同时烹饪的数量
            this.totalCornCount--;
            this._updateCornDisplay();
            this._startCookingSoup();
        }

        // 检查各种状态
        const hasCornsStored = this.totalCornCount > 0;
        
        // 动画控制逻辑：
        // 1. 有汤正在烹饪中 - 播放动画
        // 2. 有存储的玉米 - 播放动画准备烹饪
        const shouldCook = hasCornsStored;
        
        if (shouldCook && !this.isCooking && !this.shouldStopAfterAnimation) {
            // 应该烹饪且未在烹饪，开始烹饪动画
            this.isCooking = true;
            this._startCookingAnimation();
            console.log('开始烹饪动画');
        } else if (!shouldCook && this.isCooking && !this.shouldStopAfterAnimation) {
            // 不应该烹饪且正在烹饪，标记等待动画结束后停止
            this.shouldStopAfterAnimation = true;
            // console.log('准备在动画播放完成后停止');
        }
    }



    private _startCookingAnimation() {
        if (this.anim) {
            // 清除停止标记，因为现在要开始新的烹饪
            this.shouldStopAfterAnimation = false;
            this.anim.play();
        }
    }

    private _stopCookingAnimation() {
        if (this.anim) {
            this.anim.stop();
        }
    }

    private onAnimationFinished() {
        this._completeCookingSoup();
        // 动画播放完成时的回调
        if (this.shouldStopAfterAnimation) {
            // 如果标记了需要停止，现在执行停止
            this.isCooking = false;
            this.shouldStopAfterAnimation = false;
            this._stopCookingAnimation();
            // console.log('动画播放完成，停止烹饪');
        }else{
            this._startCookingAnimation();
        }
    }

    private _updateCornDisplay() {
        // 更新玉米数量显示
        if (this.cornNum) {
            this.cornNum.string = `${this.totalCornCount}`;
        }
        
        // 更新无玉米提示
        if (this.noCornTip) {
            this.noCornTip.active = this.totalCornCount === 0;
        }
    }

    private _createSoup() {
        // 使用对象池获取汤对象
        const soup = PoolManager.instance.getNode(ObjectType.DropItemCornSoup);
        if (!soup) {
            console.warn('无法从对象池获取汤对象');
            return;
        }

        // 获取汤容器的空位置
        const soupLayoutPos = this.cronSoupLayout.getCurrEmptyPosition();
        if (!soupLayoutPos) {
            console.warn('汤容器已满，无法添加更多汤');
            // 回收汤对象
            PoolManager.instance.putNode(soup);
            return;
        }

        // 预留位置
        this.cronSoupLayout.reserveItem(soupLayoutPos);
        
        // 获取目标位置
        const tarPos = this.cronSoupLayout.getItemPosition(soupLayoutPos);
        
        // 设置汤的初始位置和旋转
        this.cronSoupLayout.addItemToReserve(soup, soupLayoutPos);
        soup.setScale(0, 0, 0);
        // soup.setWorldPosition(tarPos);
        soup.setRotationFromEuler(0, 0, 0);

        tween(soup).to(0.5, {
            scale: v3(1.2, 1.2, 1.2)
        }, {
            easing: 'backOut'
        }).call(() => {
            soup.getComponent(DropItemCom).canPickup = true;
        }).start();
    }
}


