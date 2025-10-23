import { _decorator, CCFloat, CCInteger, Component, Node, Vec3 } from 'cc';
import { ComponentEvent } from '../../common/ComponentEvents';
const { ccclass, property } = _decorator;

export interface LayoutItem {
    isFull: boolean; // 是否已经占位
    node: Node | null; // 修改为可为null
    isAdded: boolean; // 是否已经添加
}

export interface ItemLayoutPosition {
    row: number;
    column: number;
    layer: number;
}

/**
 * ItemLayout - 物品布局管理器
 * 支持多层堆叠的网格布局系统
 * 可设置最高堆叠层数限制，超过限制的物品将保持在最顶层位置
 */
@ccclass('ItemLayout')
export class ItemLayout extends Component {
    @property({
        type: CCInteger,
        tooltip: '布局的列数'
    })
    public columns: number = 5;

    @property({
        type: CCInteger,
        tooltip: '布局的行数'
    })
    public rows: number = 3;

    @property({
        type: CCFloat,
        tooltip: '子物体的Y间距'
    })
    public spacingY: number = 1;

    @property({
        type: CCFloat,
        tooltip: '子物体的X间距'
    })
    public spacingX: number = 1;

    @property({
        type: CCFloat,
        tooltip: '子物体的Z间距'
    })
    public spacingZ: number = 1;

    @property({
        type: CCInteger,
        tooltip: '最高堆叠层数，0表示不限制',
        min: 0
    })
    public maxStackLayers: number = 0;

    // 存储所有子物体  key: 位置 row_column_layer  value: 子物体数据
    private items: Map<string, LayoutItem> = new Map();
    private maxLayer: number = 1; // 修改初始值为1，确保至少有一层

    protected onLoad(): void {
        this.node.removeAllChildren();
        this.items.clear();
        this.maxLayer = 1; // 修改初始值为1
    }

    private emitItemCountChanged(previousCount: number): void {
        const currentCount = this.getItemCount();
        if (currentCount !== previousCount) {
            this.node.emit(ComponentEvent.LAYOUT_COUNT_CHANGED, currentCount, previousCount);
        }
    }

    private getKey(lpos: ItemLayoutPosition): string {
        return `${lpos.row}_${lpos.column}_${lpos.layer}`;
    }

    private deserializationKey(key: string): {lpos: ItemLayoutPosition} {
        const arr = key.split('_');
        return {
            lpos: {
                row: parseInt(arr[0]),
                column: parseInt(arr[1]),
                layer: parseInt(arr[2])
            }
        }
    }

    /**
     * 检查位置是否在有效范围内
     */
    private isValidPosition(lpos: ItemLayoutPosition): boolean {
        return lpos.row >= 0 && lpos.row < this.rows &&
               lpos.column >= 0 && lpos.column < this.columns &&
               lpos.layer >= 0;
    }

    /**
     * 添加物品到布局中
     */
    public addItem(node: Node, lpos?: ItemLayoutPosition): ItemLayoutPosition | null {
        if (!node) {
            console.warn('添加的节点不能为空');
            return null;
        }

        const previousCount = this.getItemCount();

        let position: ItemLayoutPosition;
        
        if (lpos) {
            // 使用指定位置
            if (!this.isValidPosition(lpos)) {
                console.warn(`指定位置超出布局范围: row=${lpos.row}, column=${lpos.column}, layer=${lpos.layer}`);
                return null;
            }
            
            const key = this.getKey(lpos);
            const existingItem = this.items.get(key);
            if (existingItem && existingItem.isFull) {
                console.warn(`位置 ${key} 已被占用`);
                return null;
            }
            position = lpos;
        } else {
            // 自动寻找空位置
            position = this.getCurrEmptyPosition();
            if (!position) {
                console.warn('没有可用的空位置');
                return null;
            }
        }

        // 添加节点到布局
        const key = this.getKey(position);
        const worldPos = this.getItemPosition(position);
        
        node.setParent(this.node, true);
        node.setWorldPosition(worldPos);
        
        this.items.set(key, {
            node: node,
            isFull: true,
            isAdded: true
        });
        
        this.maxLayer = Math.max(this.maxLayer, position.layer + 1);
        
        this.emitItemCountChanged(previousCount);

        return position;
    }

    /**
     * 占位
     */
    public reserveItem(lpos: ItemLayoutPosition): boolean {
        if (!this.isValidPosition(lpos)) {
            console.warn(`占位位置超出布局范围: row=${lpos.row}, column=${lpos.column}, layer=${lpos.layer}`);
            return false;
        }

        const key = this.getKey(lpos);
        let data = this.items.get(key);
        if (data) {
            if (data.isFull == false) {
                data.isFull = true;
                data.isAdded = false;
                return true;
            }else{
                console.warn(`${key} 已经占位`);
                return false;
            }
        }else{
            this.items.set(key, { node: null, isAdded: false, isFull: true });
            this.maxLayer = Math.max(this.maxLayer, lpos.layer + 1);
            return true;
        }
    }

    /**
     * add已经占的位置  
     */
    public addItemToReserve(node: Node, lpos: ItemLayoutPosition): boolean {
        if (!node) {
            console.warn('添加的节点不能为空');
            return false;
        }

        const key = this.getKey(lpos);
        let data = this.items.get(key);
        if (data) {
            if (data.isFull == true && data.isAdded == false) {
                // data.node = node; // 设置节点
                // data.isAdded = true;
                
                // // 设置节点位置
                // const worldPos = this._caculateItemPosition(lpos);
                // node.setParent(this.node);
                // node.setPosition(worldPos);
                this.items.delete(key);

                this.addItem(node);
                
                return true;
            }else{
                console.warn(`${key} 存在数据但是未提前占位或者已经添加`);
                return false;
            }
        }else{
            console.warn(`${key} 不存在 未提前占位`);
            return false;
        }
    }

    public removeItem(lpos: ItemLayoutPosition): boolean {
        const previousCount = this.getItemCount();
        const key = this.getKey(lpos);
        // const item = this.items.get(key);
        // if (item && item.node) {
        //     item.node.removeFromParent();
        // }
        const deleted = this.items.delete(key);
        this.emitItemCountChanged(previousCount);
        return deleted;
    }

    public removeItemByNode(node: Node): boolean {
        for (const [key, item] of this.items) {
            if (item.node === node) {
                return this.removeItem(this.deserializationKey(key).lpos);
            }
        }
        return false;
    }

    public getItem(lpos: ItemLayoutPosition): LayoutItem | undefined {
        const key = this.getKey(lpos);
        return this.items.get(key);
    }
    
    public getCurrEmptyPosition(): ItemLayoutPosition | null {
        // 修复循环逻辑，确保从第0层开始查找
        for (let layer = 0; layer < this.maxLayer; layer++) {
            for (let row = 0; row < this.rows; row++) {
                for (let column = 0; column < this.columns; column++) {
                    const key = this.getKey({row, column, layer});
                    const item = this.items.get(key);
                    if (!item || !item.isFull) {
                        return {row, column, layer};
                    }
                }
            }
        }
        
        // 如果所有位置都满了，尝试新增一层
        for (let row = 0; row < this.rows; row++) {
            for (let column = 0; column < this.columns; column++) {
                return {row, column, layer: this.maxLayer};
            }
        }
        
        return null;
    }

    /**
     * 获取最外层物品
     */
    public getOuterItems(num: number): Node[] {
        const items: Node[] = [];
        for(let layer = this.maxLayer - 1; layer >= 0; layer--){
            for(let row = this.rows - 1; row >= 0; row--){
                for(let column = this.columns - 1; column >= 0; column--){
                    const key = this.getKey({row, column, layer});
                    const item = this.items.get(key);
                    if (item && item.isFull && item.isAdded) {
                        num--;
                        if (num === 0) {
                            items.push(item.node);                            
                        }
                    }
                }
            }
        }
        return items;
    }

    public getItemCount(): number {
        let count = 0;
        for (const [key, item] of this.items) {
            if (item.isFull && item.isAdded) {
                count++;
            }
        }
        return count;
    }

    /**
     * 清空所有物品
     */
    public clearAllItems(): void {
        const previousCount = this.getItemCount();
        for (const [key, item] of this.items) {
            if (item.node) {
                item.node.removeFromParent();
            }
        }
        this.items.clear();
        this.maxLayer = 1;
        this.emitItemCountChanged(previousCount);
    }

    private _caculateItemPosition(position: ItemLayoutPosition): Vec3 {
        // 计算实际的Y轴位置，如果设置了最高层数限制，则限制在最顶层
        let actualLayer = position.layer;
        if (this.maxStackLayers > 0 && actualLayer >= this.maxStackLayers) {
            actualLayer = this.maxStackLayers - 1; // 层数从0开始，所以减1
        }
        
        return new Vec3(
            position.column * this.spacingX,
            actualLayer * this.spacingY,
            position.row * this.spacingZ
        );
    }

    /**
     * 获取物品在世界坐标系中的位置
     * 如果设置了最高堆叠层数限制，超过限制的物品将保持在最顶层的位置
     * @param position 物品的布局位置
     * @returns 世界坐标位置
     */
    public getItemPosition(position: ItemLayoutPosition): Vec3 {
        // 获取局部坐标偏移（已考虑最高层数限制）
        const localOffset = this._caculateItemPosition(position);
        
        // 创建临时结果向量
        const result = new Vec3();
        
        // 使用节点的世界矩阵将局部坐标转换为世界坐标
        // 这会正确处理所有父节点的旋转、缩放和位移
        Vec3.transformMat4(result, localOffset, this.node.getWorldMatrix());
        
        return result;
    }

}



