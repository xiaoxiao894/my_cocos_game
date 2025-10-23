import { _decorator, CCFloat, Component, Enum, Node, tween, v3, Vec3 } from 'cc';
import { CommonEvent, ObjectType } from '../../common/CommonEnum';
import { DropItemCom } from '../Drop/DropItemCom';
import { ComponentEvent } from '../../common/ComponentEvents';
import { BaseComponet } from './BaseComponet';

const { ccclass, property } = _decorator;

@ccclass('ContainerItem')
export class ContainerItem{
    @property({
        type: Node,
        displayName: '容器节点'
    })
    public itemNode: Node = null!;

    @property({
        type: Enum(ObjectType),
        displayName: '物品类型'
    })
    public itemType: ObjectType = ObjectType.DropItemCoin;

    @property({
        displayName: '物品间距'
    })
    public itemSpacing: number = 0;

    @property({
        displayName: '物品堆叠上限'
    })
    public itemMaxCount: number = 50;

    @property({
        displayName: '是否可以拾取'
    })
    public canPickup: boolean = true;
}

@ccclass('PickupComponent')
export class PickupComponent extends BaseComponet {
    @property({
        type: CCFloat,
        displayName: '拾取范围',
        tooltip: '角色可以拾取物品的范围'
    })
    public pickupRange: number = 3;

    @property({
        displayName: '自动拾取',
        tooltip: '是否自动拾取范围内的物品'
    })
    public autoPickup: boolean = true; 

    @property({
        type: CCFloat,
        displayName: '自动拾取间隔',
        tooltip: '自动拾取的检测间隔(秒)'
    })
    public pickupInterval: number = 0.01;

    @property({
        type: [ContainerItem],
        displayName: '物品容器'
    })
    public itemContainer: ContainerItem[] = [];

    private pickupTimer: number = 0;
    private _offset: number = 0;

    private itemMap: Map<ObjectType, number> = new Map();
    
    // 存储容器中的物品节点
    private containerItems: Map<ObjectType, Node[]> = new Map();
    public get offset(): number {
        return this._offset;
    }
    public set offset(value:number){
        this._offset = value;
        this.arrangeContainers();
    }

    start() {
        // 初始化拾取组件
        // this.itemMap.set(ObjectType.DropItemCoin, 0);
        // this.itemMap.set(ObjectType.DropItemCoin, 1000);
        // this.itemMap.set(ObjectType.DropItemCornKernel, 1000);
        // this.itemMap.set(ObjectType.DropItemCornSoup, 1000);
        this.containerItems.set(ObjectType.DropItemCoin, []);
        
        // 初始化容器排列
        this.arrangeContainers();

        // this.node.on(ComponentEvent.FACE_DIRECTION_CHANGED, this.onFaceDirectionChanged, this);
    }

    onDestroy() {
        // this.node.off(ComponentEvent.FACE_DIRECTION_CHANGED, this.onFaceDirectionChanged, this);
    }

    // onFaceDirectionChanged(directionX: number) {
    //     for(const item of this.itemContainer){
    //         let xabs = Math.abs(item.itemNode.position.x);
    //         const x = directionX > 0 ? -xabs : xabs;
    //         item.itemNode.setPosition(x, item.itemNode.position.y, item.itemNode.position.z);
    //     }
    // }

    update(deltaTime: number) {
        if (this.autoPickup) {
            this.pickupTimer += deltaTime;
            while (this.pickupTimer >= this.pickupInterval) {
                this.pickupTimer -= this.pickupInterval;
                this.checkAndPickupItems();
            }
        }
    }

    /**
     * 检查并拾取范围内的物品
     */
    private checkAndPickupItems() {
        // 获取角色位置
        const position = this.node.getWorldPosition();
        
        // 从DropManager获取范围内的物品（带距离信息）
        const nearbyItemsWithDistance = manager.drop.getRangeItemsWithDistance(position, this.pickupRange);
        
        // 检查是否有物品
        if (nearbyItemsWithDistance.length === 0) {
            return;
        }
        
        // 过滤出可以拾取的物品（检查对应容器的 canPickup 状态）
        const pickableItems = nearbyItemsWithDistance.filter(itemData => {
            const container = this.findMatchingContainer(itemData.item.objectType);
            // 必须有对应容器且容器允许拾取
            return container && container.canPickup;
        });
        
        // 如果没有可拾取的物品，返回
        if (pickableItems.length === 0) {
            return;
        }
        
        // 获取最近的物品（使用已计算的平方距离）
        const nearestItemData = pickableItems.reduce((prev, current) => {
            return prev.distanceSquared < current.distanceSquared ? prev : current;
        });

        this.pickupItem(nearestItemData.item);
    }

    /**
     * 手动触发拾取范围内的物品
     */
    public triggerPickup() {
        this.checkAndPickupItems();
    }

    /**
     * 拾取指定物品
     * @param item 要拾取的物品组件
     */
    public pickupItem(item: DropItemCom) {
        // 查找匹配的容器
        const matchingContainer = this.findMatchingContainer(item.objectType);
        
        // 必须有容器且容器允许拾取
        if (!matchingContainer || !matchingContainer.canPickup) {
            return;
        }
        
        item.canPickup = false;
        item.reset();
        item.node.setRotationFromEuler(new Vec3(0, 0, 0));
        
        // 创建飞向角色的动画
        this.createFlyAnimation(item.node, () => {
            // 根据物品类型处理拾取效果
            this.handlePickupEffect(item);
            
            // 将物品添加到容器中
            this.addItemToContainer(item, matchingContainer);
            tween(item.node)
                .to(0.1, {
                    scale: v3(1.2, 1.2, 1.2),
                }, { easing: 'cubicOut' })
                .to(0.1, {
                    scale: v3(1, 1, 1),
                }, { easing: 'cubicOut' })
                .start();
        });
    }

    /**
     * 查找匹配物品类型的容器
     * @param itemType 物品类型
     * @returns 匹配的容器或null
     */
    private findMatchingContainer(itemType: ObjectType): ContainerItem | null {
        for (const container of this.itemContainer) {
            if (container && container.itemNode && container.itemType === itemType) {
                return container;
            }
        }
        return null;
    }

    /**
     * 排列容器位置
     * 按照z值0.75+（i*0.9）排列，只有数量不为0的容器才参与排列
     */
    private arrangeContainers() {
        let arrangeIndex = 0;
        
        for (const container of this.itemContainer) {
            if (!container || !container.itemNode) continue;
            
            // 获取当前容器的物品数量
            const itemCount = this.getContainerItemCount(container.itemType);
            
            if (itemCount > 0) {
                // 只有数量大于0的容器才参与排列
                const zPosition = 0.75 + (arrangeIndex * 0.9) + this.offset;
                const currentPos = container.itemNode.position;
                const targetPos = new Vec3(currentPos.x, currentPos.y, zPosition);
                
                // 添加缓动动画
                tween(container.itemNode)
                    .to(0.3, { position: targetPos }, { easing: 'cubicOut' })
                    .start();
                
                arrangeIndex++;
            }
        }
    }

    /**
     * 获取指定容器的物品数量（包括总数量统计）
     * @param itemType 物品类型
     * @returns 物品数量
     */
    private getContainerItemCount(itemType: ObjectType): number {
        return this.getItemCount(itemType);
    }

    /**
     * 将物品添加到容器中并堆叠
     * @param item 要添加的物品
     * @param container 目标容器
     */
    private addItemToContainer(item: DropItemCom, container: ContainerItem) {
        if (!container || !container.itemNode) return;
        
        // 获取当前物品类型的物品节点数组
        let items = this.containerItems.get(item.objectType);
        if (!items) {
            items = [];
            this.containerItems.set(item.objectType, items);
        }
        
        // 检查是否达到堆叠上限
        if (items.length >= container.itemMaxCount) {
            // 只更新物品数量统计，不实际添加到容器
            // 从管理器中移除物品
            manager.drop.removeItem(item.node);
            item.node.setParent(container.itemNode, true);
            
            // 等待缩放动画结束
            this.scheduleOnce(() => {
                // 回收物品节点
                if(item.node && item.node.parent){
                    manager.pool.putNode(item.node);
                }
            }, 0.3);
            return;
        }
        
        // 计算新位置 (从0点开始往上堆叠)
        const yOffset = items.length * container.itemSpacing;
        
        // 从管理器中移除物品
        manager.drop.removeItem(item.node);
        
        // 将物品添加到容器中
        container.itemNode.addChild(item.node);
        
        // 重置物品位置和缩放
        item.node.setPosition(0, yOffset, 0);
        item.node.setScale(1, 1, 1);
        
        // 更新物品节点数组
        items.push(item.node);
        
        // 重新排列容器
        this.arrangeContainers();
    }

    /**
     * 创建物品飞向角色的动画
     * @param itemNode 物品节点
     * @param onComplete 动画完成回调
     */
    private createFlyAnimation(itemNode: Node, onComplete: () => void) {
        // 记录开始位置
        const startPos = itemNode.getWorldPosition().clone();
        
        // 创建动画持续时间和曲线参数
        const duration = 0.5;
        
        // 使用一个空节点作为跟踪节点，附加到角色上
        const trackNode = new Node('TrackNode');
        this.node.addChild(trackNode);
        
        // 设置初始位置
        itemNode.setWorldPosition(startPos);
        
        // 获取物品类型
        const itemType = this.getItemObjectType(itemNode);
        
        // 查找匹配的容器（必须存在）
        const matchingContainer = this.findMatchingContainer(itemType)!;
        
        // 判断容器是否已满
        const items = this.containerItems.get(itemType) || [];
        const isContainerFull = items.length >= matchingContainer.itemMaxCount;
        
        // 创建动画序列
        tween(itemNode)
            .to(duration * 0.2, { 
                scale: v3(1.2, 1.2, 1.2),
            }, { easing: 'cubicOut' })
            .to(duration * 0.8, {}, {
                onUpdate: (target, ratio) => {
                    if(ratio == undefined){
                        return;
                    }
                    
                    // 实时获取容器当前位置
                    const containerPos = matchingContainer.itemNode.getWorldPosition();
                    
                    // 计算顶部位置
                    let topYOffset = 0;
                    if (isContainerFull) {
                        // 如果容器已满，飞向容器顶部的最上层
                        topYOffset = matchingContainer.itemMaxCount * matchingContainer.itemSpacing;
                    } else {
                        // 否则飞向当前堆叠高度
                        topYOffset = items.length * matchingContainer.itemSpacing;
                    }
                    
                    // 将目标位置设置为容器顶部，实时更新
                    const targetPos = new Vec3(containerPos.x, containerPos.y + topYOffset, containerPos.z);
                    
                    // 使用抛物线轨迹
                    const pos = new Vec3();
                    
                    // 计算当前距离，动态调整抛物线高度
                    const currentDistance = Vec3.distance(startPos, targetPos);
                    const peakHeight = Math.max(2, currentDistance * 0.5);
                    
                    // 线性插值计算x和z坐标
                    pos.x = startPos.x + (targetPos.x - startPos.x) * ratio;
                    pos.z = startPos.z + (targetPos.z - startPos.z) * ratio;
                    
                    // 抛物线计算y坐标
                    pos.y = 4 * peakHeight * ratio * (1 - ratio) + 
                            startPos.y * (1 - ratio) + 
                            targetPos.y * ratio;
                    
                    // 更新物品位置
                    itemNode.setWorldPosition(pos);
                    
                    // 缩放效果
                    const scale = 1 + 0.2 * (1 - ratio);
                    itemNode.setScale(scale, scale, scale);
                }
            })
            .call(() => {
                // 移除跟踪节点
                trackNode.removeFromParent();
                trackNode.destroy();
                
                // 完成回调
                if (onComplete) {
                    onComplete();
                }
            })
            .start();
    }

    /**
     * 获取物品节点的对象类型
     * @param itemNode 物品节点
     * @returns 物品类型
     */
    private getItemObjectType(itemNode: Node): ObjectType {
        const itemCom = itemNode.getComponent(DropItemCom);
        return itemCom ? itemCom.objectType : ObjectType.None;
    }

    /**
     * 处理物品拾取后的效果
     * @param item 拾取的物品组件
     */
    private handlePickupEffect(item: DropItemCom) {
        this.addItem(item);
    }

    /**
     * 增加物品
     * @param item 物品组件
     */
    private addItem(item: DropItemCom, count: number = 1) {
        const type = item.objectType;
        
        // 获取当前物品类型的数量，如果不存在则初始化为0
        const currentCount = this.itemMap.get(type) || 0;
        const totalCount = currentCount + count;
        
        // 更新物品数量
        this.itemMap.set(type, totalCount);
        if(type === ObjectType.DropItemCoin){
            app.audio.playEffect('resources/audio/收取金币');
        }else{
            app.audio.playEffect('resources/audio/收取资源');
        }
        
        this.node.emit(ComponentEvent.UPDATE_ITEM_COUNT, type, totalCount);
        
        // 重新排列容器
        this.arrangeContainers();
    }

    /**
     * 消耗指定物品类型的数量
     * @param type 物品类型
     * @param count 数量
     */
    public consumeItem(type: ObjectType, count: number): Node[] {
        // app.log.debug(`消耗物品类型: ${type}, 数量: ${count}`);
        // 获取当前物品总数
        const totalCount = this.getItemCount(type);
        
        // 找到匹配的容器
        const matchingContainer = this.findMatchingContainer(type);
        
        // 更新数量统计
        this.setItemCount(type, totalCount - count);

        this.node.emit(ComponentEvent.UPDATE_ITEM_COUNT, type, this.getItemCount(type));
        
        // 重新排列容器
        this.arrangeContainers();
        
        // 创建消耗物品的列表
        const consumedItems: Node[] = [];
        
        // 如果有匹配的容器，处理物品显示
        if (matchingContainer && matchingContainer.itemNode) {
            // 获取容器中当前堆叠的物品数量
            const containerCount = this.containerItems.get(type) || [];
            
            // 计算容器外的物品数量
            const outsideCount = totalCount - containerCount.length;
            
            if (count <= outsideCount) {
                // 如果消耗数量小于或等于容器外数量，只需消耗容器外的部分
                // 从对象池取出虚拟物品添加到消耗列表
                for (let i = 0; i < count; i++) {
                    const virtualItem = this.createVirtualItemForConsume(type, matchingContainer);
                    if (virtualItem) {
                        consumedItems.push(virtualItem);
                    }
                }
            } else {
                // 消耗容器外的全部物品
                for (let i = 0; i < outsideCount; i++) {
                    const virtualItem = this.createVirtualItemForConsume(type, matchingContainer);
                    if (virtualItem) {
                        consumedItems.push(virtualItem);
                    }
                }
                
                // 消耗容器内的物品
                const containerConsumeCount = count - outsideCount;
                const containerItems = this.removeItemsFromContainer(type, containerConsumeCount);
                consumedItems.push(...containerItems);
            }
        }
        // app.log.debug(`消耗物品数量: ${consumedItems.length}`);
        return consumedItems;
    }
    
    /**
     * 为消耗创建一个虚拟物品（从对象池取出并放在容器顶部）
     * @param type 物品类型
     * @param container 物品容器
     * @returns 创建的虚拟物品节点
     */
    private createVirtualItemForConsume(type: ObjectType, container: ContainerItem): Node|null {
        // 从对象池获取一个物品节点
        const virtualItem = manager.pool.getNode(type);
        if (!virtualItem) return null;
        
        // 获取容器当前的堆叠数量
        const containerCount = this.containerItems.get(type) || [];
        
        // 计算顶部位置
        const topYOffset = containerCount.length * container.itemSpacing;
        
        // 设置位置到容器顶部
        virtualItem.setParent(container.itemNode);
        virtualItem.setPosition(0, topYOffset, 0);
        virtualItem.setRotationFromEuler(new Vec3(0, 0, 0));
        
        return virtualItem;
    }
    
    /**
     * 从容器中移除指定数量的物品
     * @param type 物品类型
     * @param count 移除数量
     */
    private removeItemsFromContainer(type: ObjectType, count: number): Node[] {
        // 查找匹配的容器
        const matchingContainer = this.findMatchingContainer(type);
        if (!matchingContainer || !matchingContainer.itemNode) return [];
        
        const items = this.containerItems.get(type) || [];
        const removeCount = Math.min(items.length, count);
        
        if (removeCount <= 0) return [];
        
        const removeList = items.splice(items.length - removeCount, removeCount);
        
        // 重新排列剩余物品
        this.rearrangeContainerItems(type);
        
        return removeList;
    }
    
    /**
     * 重新排列容器中的物品
     * @param type 物品类型
     */
    private rearrangeContainerItems(type: ObjectType): void {
        // 查找匹配的容器
        const matchingContainer = this.findMatchingContainer(type);
        if (!matchingContainer || !matchingContainer.itemNode) return;
        
        const items = this.containerItems.get(type) || [];
        for (let i = 0; i < items.length; i++) {
            const yPos = i * matchingContainer.itemSpacing;
            items[i].setPosition(0, yPos, 0);
        }
    }

    /**
     * 获取指定物品类型的数量
     * @param type 物品类型
     * @returns 指定物品类型的数量
     */
    public getItemCount(type: ObjectType): number {
        return this.itemMap.get(type) || 0;
    }

    
    /**
     * 设定指定物品类型的数量
     * @param type 物品类型
     * @param count 数量
     */
    public setItemCount(type: ObjectType, count: number): void {
        this.itemMap.set(type, count);
        this.node.emit(ComponentEvent.UPDATE_ITEM_COUNT, type, count);
        
        // 重新排列容器
        this.arrangeContainers();
    }

    /**
     * 磁力拾取范围内所有物品
     * @param magnetRange 磁力拾取范围，默认使用拾取范围的2倍
     * @returns Promise 在所有拾取动画完成后解析
     */
    public async magnetPickup(magnetRange?: number): Promise<void> {
        const range = magnetRange || this.pickupRange * 2;
        const position = this.node.getWorldPosition();
        
        // 获取扩大范围内的物品（带距离信息）
        const itemsWithDistance = manager.drop.getRangeItemsWithDistance(position, range);
        
        // 如果没有物品，直接返回
        if (itemsWithDistance.length === 0) {
            return Promise.resolve();
        }
        
        // 过滤出可以拾取的物品（检查对应容器的 canPickup 状态）
        const pickableItems = itemsWithDistance.filter(itemData => {
            const container = this.findMatchingContainer(itemData.item.objectType);
            // 必须有对应容器且容器允许拾取
            return container && container.canPickup;
        });
        
        // 如果没有可拾取的物品，直接返回
        if (pickableItems.length === 0) {
            return Promise.resolve();
        }
        
        // 为每个物品创建一个Promise
        const pickupPromises: Promise<void>[] = [];
        
        // 拾取所有物品
        for (const itemData of pickableItems) {
            const item = itemData.item;
            const distanceSquared = itemData.distanceSquared;
            
            item.canPickup = false;
            item.reset();
            item.node.setRotationFromEuler(new Vec3(0, 0, 0));

            // 使用平方根计算实际距离（只在需要时计算一次）
            const distance = Math.sqrt(distanceSquared);
            let speed = 50;
            let time = distance / speed;
            const delay = Math.random() * 0.2;
            
            // 为每个物品创建Promise
            const itemPromise = new Promise<void>((resolve) => {
                tween(item.node)
                    .delay(delay)
                    .to(time, {
                        worldPosition: position
                    }).call(() => {
                        // 处理物品拾取效果（更新统计）
                        this.handlePickupEffect(item);
                        
                        const matchingContainer = this.findMatchingContainer(item.objectType);
                        // 将物品添加到容器中（已经在过滤时确保了容器存在）
                        this.addItemToContainer(item, matchingContainer!);
                        
                        // 动画完成后解析Promise
                        resolve();
                    })
                    .start();
            });
            
            pickupPromises.push(itemPromise);
        }
        
        // 等待所有拾取动画完成
        await Promise.all(pickupPromises);

        console.log('拾取完成');
    }

    /**
     * 判断指定物品是否可以被拾取
     * @param itemOrType 物品组件或物品类型
     * @returns 是否可以拾取
     */
    public canPickupItem(itemOrType: DropItemCom | ObjectType): boolean {
        // 获取物品类型
        let itemType: ObjectType;
        if (itemOrType instanceof Component) {
            // 如果传入的是物品组件
            itemType = (itemOrType as DropItemCom).objectType;
        } else {
            // 如果传入的是物品类型（枚举值）
            itemType = itemOrType;
        }
        
        // 查找匹配的容器
        const container = this.findMatchingContainer(itemType);
        
        // 必须有容器且容器允许拾取
        return container !== null && container.canPickup;
    }

    /**
     * 设置指定类型容器的拾取状态
     * @param itemType 物品类型
     * @param canPickup 是否可以拾取
     */
    public setContainerPickupState(itemType: ObjectType, canPickup: boolean): void {
        const container = this.findMatchingContainer(itemType);
        if (container) {
            container.canPickup = canPickup;
        }
    }
} 