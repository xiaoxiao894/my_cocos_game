import { _decorator, Component, Node, Vec3, tween, v3, EventTarget } from 'cc';
import { FlightManager } from './FlightManager';
const { ccclass, property } = _decorator;

@ccclass('ItemContainer')
export class ItemContainer extends Component {
    @property({
        tooltip: '容器的行数',
        displayName: '行数'
    })
    rows: number = 3;

    @property({
        tooltip: '容器的列数',
        displayName: '列数'
    })
    columns: number = 5;

    @property({
        tooltip: '物品之间的间距（像素）',
        displayName: '间距'
    })
    spacing: number = 50;

    @property({
        tooltip: '不同层级之间的高度差（像素）',
        displayName: '层级高度'
    })
    layerHeight: number = 20;

    @property({
        tooltip: '最大层数，超过后新层将与最高层保持相同高度',
        displayName: '最大层数'
    })
    maxLayers: number = 50;

    @property({
        tooltip: '45度视角下的X轴缩放比例 cos(45°) ≈ 0.866',
        displayName: 'X轴缩放'
    })
    scaleX: number = 0.866; // cos(45°) ≈ 0.866

    private items: Node[][] = [];
    private currentLayer: number = 0;
    private _cachedEmptyPosition: Vec3 = new Vec3();
    // 预创建可重用的Vec3对象
    private _reusableVec3: Vec3 = new Vec3();
    // 预创建缩放值
    private _scaleUp: Vec3 = v3(1.2, 1.2, 1.2);
    private _scaleNormal: Vec3 = v3(1, 1, 1);
    // 缓存物品到层和索引的映射，用于快速查找
    private _itemToLayerMap: Map<Node, {layer: number, index: number}> = new Map();
    // 容器状态是否已更改的标志
    private _containerStateChanged: boolean = true;
    // 缓存返回对象，避免重复创建
    private _cachedEmptyPositionResult: {items: Node[], targetPos: Vec3} = {items: [], targetPos: this._cachedEmptyPosition};

    public get itemNum(): number {
        let count = 0;
        for (let i = 0; i < this.items.length; i++) {
            if (this.items[i]) {
                count += this.items[i].length;
            }
        }
        return count;
    }

    public get currEmptyPosition(): Vec3 {
        this.updateCachedEmptyPosition();
        return this._cachedEmptyPosition;
    }

    private updateCachedEmptyPosition(): void {
        // 确保当前层的数组已初始化
        if (!this.items[this.currentLayer]) {
            this.items[this.currentLayer] = [];
        }

        // 获取当前层的物品数组
        const items = this.items[this.currentLayer];
        
        // 计算物品在当前层的位置
        const index = items.length;
        const row = Math.floor(index / this.columns);
        const col = index % this.columns;

        // 计算45度视角下的目标位置
        const baseX = (col - row) * this.spacing * this.scaleX;
        const baseY = (col + row) * this.spacing * 0.5;
        // 如果当前层超过最大层数，则使用最大层数的高度
        const layerOffset = Math.min(this.currentLayer, this.maxLayers - 1) * this.layerHeight;

        this._cachedEmptyPosition.set(
            baseX,
            baseY + layerOffset,
            0
        );
    }

    /**
     * 更新容器状态，确保层级管理的一致性
     * 在添加或删除物品后调用此方法
     */
    private updateContainerState(): void {
        // 如果状态没有变化，直接返回
        if (!this._containerStateChanged) {
            return;
        }

        // 计算当前应该在哪一层
        let validLayer = 0;
        for (let i = 0; i < this.items.length; i++) {
            if (this.items[i] && this.items[i].length > 0) {
                if (this.items[i].length < this.rows * this.columns) {
                    validLayer = i;
                    break;
                }
                validLayer = i + 1;
            }
        }
        
        // 确保该层存在
        if (!this.items[validLayer]) {
            this.items[validLayer] = [];
        }
        
        this.currentLayer = validLayer;
        // 更新空位置缓存
        this.updateCachedEmptyPosition();
        // 重置状态变化标志
        this._containerStateChanged = false;
        // 更新缓存结果中的引用
        this._cachedEmptyPositionResult.items = this.items[this.currentLayer];
    }

    onLoad() {
        // 初始化物品数组
        this.items[0] = [];
        // 初始化缓存的空位置
        this.updateCachedEmptyPosition();
    }

    /**
     * 添加一个物品到容器中
     * @param item 物品节点
     * @returns 是否添加成功
     */
    public addItem(item: Node): boolean {
        // 获取当前空位置
        const targetPos = this.currEmptyPosition;

        // 确保当前层的数组已初始化
        if (!this.items[this.currentLayer]) {
            this.items[this.currentLayer] = [];
        }

        // 获取当前层的物品数组
        const items = this.items[this.currentLayer];

        // 将物品添加到容器节点下
        item.parent = this.node;
        item.setPosition(targetPos.x, targetPos.y, targetPos.z);

        // 使用缓存的缩放值
        tween(item)
            .to(0.05, {scale: this._scaleUp})
            .to(0.05, {scale: this._scaleNormal})
            .start();

        // 将物品添加到数组中
        const itemIndex = items.length;
        items.push(item);
        
        // 更新映射表
        this._itemToLayerMap.set(item, {layer: this.currentLayer, index: itemIndex});
        
        // 标记容器状态已更改
        this._containerStateChanged = true;
        // 更新容器状态
        this.updateContainerState();
        
        return true;
    }

    /**
     * 移除指定的物品
     * @param item 要移除的物品节点
     * @returns 是否成功移除
     */
    public removeItem(item: Node): boolean {
        // 使用映射表快速查找物品位置
        const itemInfo = this._itemToLayerMap.get(item);
        
        if (itemInfo) {
            const {layer, index} = itemInfo;
            const items = this.items[layer];
            
            // 从数组中移除
            items.splice(index, 1);
            // 从映射表中移除
            this._itemToLayerMap.delete(item);
            
            // 更新映射表中后续物品的索引
            for (let i = index; i < items.length; i++) {
                const currentItem = items[i];
                const currentInfo = this._itemToLayerMap.get(currentItem);
                if (currentInfo) {
                    currentInfo.index = i;
                }
            }
            
            // 重新排列该层后面的物品
            this.rearrangeItems(layer, index);
            
            // 标记容器状态已更改
            this._containerStateChanged = true;
            // 更新容器状态
            this.updateContainerState();

            // 发送物品移除事件
            this.node.emit('itemRemoved', this.node.uuid);
            
            return true;
        }
        
        return false;
    }

    /**
     * 重新排列指定层中从指定索引开始的物品
     * @param layer 层级
     * @param startIndex 开始索引
     */
    private rearrangeItems(layer: number, startIndex: number) {
        const items = this.items[layer];
        const layerOffset = Math.min(layer, this.maxLayers - 1) * this.layerHeight;
        
        for (let i = startIndex; i < items.length; i++) {
            const row = Math.floor(i / this.columns);
            const col = i % this.columns;
            
            const baseX = (col - row) * this.spacing * this.scaleX;
            const baseY = (col + row) * this.spacing * 0.5;

            // 复用Vec3对象
            this._reusableVec3.set(
                baseX,
                baseY + layerOffset,
                0
            );

            // 使用缓动动画移动物品
            tween(items[i])
                .to(0.3, { position: this._reusableVec3.clone() })
                .start();
        }
    }

    /**
     * 清空所有物品
     */
    public clear() {
        for (const layer of this.items) {
            for (const item of layer) {
                item.destroy();
            }
        }
        this.items = [[]];
        this.currentLayer = 0;
        this._itemToLayerMap.clear();
        
        // 标记容器状态已更改
        this._containerStateChanged = true;
        // 更新缓存的空位置
        this.updateCachedEmptyPosition();
    }

    /**
     * 获取当前第一个空位的位置和对应的物品数组
     * @returns 包含物品数组和目标位置的对象
     */
    public getCurrEmptyPosition(): {items: Node[], targetPos: Vec3} {
        // 仅当容器状态发生变化时更新
        if (this._containerStateChanged) {
            this.updateContainerState();
        }

        return this._cachedEmptyPositionResult;
    }

    /**
     * 获取容器中最外层的物体
     * @returns 最外层的物体节点，如果容器为空则返回null
     */
    public getOutermostItem(): Node | null {
        // 如果容器为空，返回null
        if (this.itemNum === 0) {
            return null;
        }

        // 从最高层开始查找
        for (let layer = this.currentLayer; layer >= 0; layer--) {
            // 确保该层存在
            if (this.items[layer] && this.items[layer].length > 0) {
                // 返回该层最后一个物体（最外层的物体）
                return this.items[layer][this.items[layer].length - 1];
            }
        }

        return null;
    }
} 