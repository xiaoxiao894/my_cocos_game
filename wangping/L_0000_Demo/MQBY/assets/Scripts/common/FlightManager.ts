import { _decorator, Component, Node, Vec3, UITransform, tween, Tween, easing } from 'cc';
const { ccclass, property } = _decorator;

/**
 * 飞行物品接口定义
 */
interface FlightItem {
    id: string;               // 飞行物品唯一ID
    node: Node;               // 飞行节点
    startPos: Vec3;           // 起始位置
    endPos: Vec3;             // 目标位置
    endNode: Node;            // 目标节点
    endNodeOffset: () => Vec3;      // 目标节点偏移量函数
    controlPoint: Vec3;       // 贝塞尔曲线控制点
    duration: number;         // 飞行持续时间
    progress: number;         // 飞行进度(0-1)
    peakHeight: number;       // 飞行最高点
    isActive: boolean;        // 是否处于活动状态
    onComplete?: () => void;  // 完成回调
    tweenId?: number;         // tween动画ID
}

/**
 * 飞行配置选项
 */
interface FlightOptions {
    peakHeight?: number;      // 飞行最高点
    speed?: number;           // 飞行速度
    easing?: (t: number) => number; // 缓动函数
    useWorldSpace?: boolean;  // 是否使用世界坐标系
    autoRotate?: boolean;     // 是否自动旋转朝向目标
    endNodeOffset?: () => Vec3;     // 目标节点偏移量函数
    onUpdate?: (progress: number, item: FlightItem) => void; // 更新回调
    onComplete?: () => void;  // 完成回调
}

@ccclass('FlightManager')
export class FlightManager extends Component {
    // 单例实例
    private static _instance: FlightManager = null!;

    // 默认配置
    private static readonly DEFAULT_OPTIONS: FlightOptions = {
        peakHeight: 150,
        speed: 1000,
        easing: easing.linear,
        useWorldSpace: true,
        autoRotate: false
    };

    // 飞行物品集合
    private flightItems: Map<string, FlightItem> = new Map();
    
    // 物品计数器
    private itemCounter: number = 0;

    /**
     * 获取单例实例
     */
    public static get instance(): FlightManager {
        return FlightManager._instance;
    }

    /**
     * 组件加载时
     */
    onLoad() {
        if (FlightManager._instance === null) {
            FlightManager._instance = this;
        } else {
            this.node.destroy();
        }
    }

    /**
     * 组件销毁时
     */
    onDestroy() {
        // 清理所有飞行物品
        this.removeAllFlights();
        
        if (FlightManager._instance === this) {
            FlightManager._instance = null!;
        }
    }

    /**
     * 创建一个新的飞行物品
     * @param flyNode 要飞行的节点
     * @param startPos 起始位置
     * @param endNode 目标节点
     * @param options 飞行配置选项
     * @returns 飞行物品的唯一ID
     */
    public createFlight(
        flyNode: Node,
        startPos: Vec3,
        endNode: Node,
        options: FlightOptions = {}
    ): string {
        // 合并默认选项
        const finalOptions = { ...FlightManager.DEFAULT_OPTIONS, ...options };
        
        // 生成唯一ID
        const itemId = `flight_${++this.itemCounter}`;
        
        // 设置节点父级 - 修改为添加到最底层
        if (flyNode.parent !== this.node) {
            // 将节点添加为子节点，并设置为最底层（索引0）
            flyNode.parent = this.node;
            flyNode.setSiblingIndex(0);
        }
        
        // 设置初始位置
        if (finalOptions.useWorldSpace) {
            flyNode.setWorldPosition(startPos);
        } else {
            flyNode.setPosition(startPos);
        }
        
        // 创建飞行物品
        const flightItem: FlightItem = {
            id: itemId,
            node: flyNode,
            startPos: startPos.clone(),
            endPos: new Vec3(), // 临时值，将在下面更新
            endNode: endNode,
            endNodeOffset: options.endNodeOffset ? options.endNodeOffset : () => new Vec3(),
            controlPoint: new Vec3(), // 临时值，将在下面更新
            duration: 0, // 临时值，将在下面计算
            progress: 0,
            peakHeight: finalOptions.peakHeight || FlightManager.DEFAULT_OPTIONS.peakHeight || 150,
            isActive: true,
            onComplete: finalOptions.onComplete
        };
        
        // 计算目标位置
        this.updateTargetPosition(flightItem);
        
        // 计算控制点
        flightItem.controlPoint = this.calculateControlPoint(
            flightItem.startPos, 
            flightItem.endPos, 
            flightItem.peakHeight
        );
        
        // 计算飞行距离和持续时间
        const distance = this.calculateApproximateDistance(
            flightItem.startPos, 
            flightItem.controlPoint, 
            flightItem.endPos
        );
        flightItem.duration = distance / (finalOptions.speed || FlightManager.DEFAULT_OPTIONS.speed || 1000);
        
        // 存储飞行物品
        this.flightItems.set(itemId, flightItem);
        
        // 使用tween实现平滑飞行
        this.startFlightTween(flightItem, finalOptions);
        
        return itemId;
    }

    /**
     * 开始飞行动画
     * @param item 飞行物品
     * @param options 飞行配置选项
     */
    private startFlightTween(item: FlightItem, options: FlightOptions): void {
        // 停止已有的tween动画
        if (item.tweenId !== undefined) {
            Tween.stopAllByTarget(item);
        }
        
        // 创建进度tween
        const progressTween = tween(item)
            .to(item.duration, { progress: 1 }, {
                easing: options.easing,
                onUpdate: () => {
                    // 实时更新目标位置
                    this.updateTargetPosition(item);
                    
                    // 重新计算控制点
                    item.controlPoint = this.calculateControlPoint(
                        item.startPos, 
                        item.endPos, 
                        item.peakHeight
                    );
                    
                    // 计算当前位置
                    const position = this.calculateBezierPosition(
                        item.startPos,
                        item.controlPoint,
                        item.endPos,
                        item.progress
                    );
                    
                    // 更新节点位置
                    if (options.useWorldSpace) {
                        item.node.setWorldPosition(position);
                    } else {
                        item.node.setPosition(position);
                    }
                    
                    // 自动旋转朝向
                    if (options.autoRotate) {
                        this.updateNodeRotation(item, position);
                    }
                    
                    // 调用更新回调
                    if (options.onUpdate) {
                        options.onUpdate(item.progress, item);
                    }
                },
                onComplete: () => {
                    // 最后一次更新目标位置
                    this.updateTargetPosition(item);
                    
                    // 设置到最终位置
                    if (options.useWorldSpace) {
                        item.node.setWorldPosition(item.endPos);
                    } else {
                        item.node.setPosition(item.endPos);
                    }
                    
                    // 调用完成回调
                    if (item.onComplete) {
                        item.onComplete();
                    }
                    
                    // 移除飞行物品
                    this.removeFlight(item.id);
                }
            })
            .start();
        
        // 保存tween ID
        // @ts-ignore
        item.tweenId = progressTween['_id'] as number;
    }

    /**
     * 更新目标位置
     * @param item 飞行物品
     */
    private updateTargetPosition(item: FlightItem): void {
        // 获取目标节点的最新位置
        item.endPos = this.calculateTargetPosition(item.endNode, item.endNodeOffset);
    }

    /**
     * 更新节点旋转朝向
     * @param item 飞行物品
     * @param currentPos 当前位置
     */
    private updateNodeRotation(item: FlightItem, currentPos: Vec3): void {
        // 计算下一个位置点
        const nextProgress = Math.min(item.progress + 0.05, 1);
        const nextPos = this.calculateBezierPosition(
            item.startPos,
            item.controlPoint,
            item.endPos,
            nextProgress
        );
        
        // 计算方向向量
        const direction = new Vec3();
        Vec3.subtract(direction, nextPos, currentPos);
        
        if (direction.length() > 0.001) {
            // 使用3D朝向 - 让节点朝向移动方向
            const targetPos = new Vec3();
            Vec3.add(targetPos, currentPos, direction);
            item.node.lookAt(targetPos);
        }
    }

    /**
     * 计算目标位置
     * @param endNode 目标节点
     * @param offsetFunc 偏移量函数
     * @returns 目标位置
     */
    private calculateTargetPosition(endNode: Node, offsetFunc: () => Vec3): Vec3 {
        const endWorldPos = new Vec3();
        endNode.getWorldPosition(endWorldPos);
        
        // 获取偏移量
        const offset = offsetFunc();
        
        if (!Vec3.strictEquals(offset, Vec3.ZERO)) {
            endWorldPos.add(offset);
        }
        
        return endWorldPos;
    }

    /**
     * 计算控制点
     * @param start 起始位置
     * @param end 目标位置
     * @param peakHeight 最高点高度
     * @returns 控制点
     */
    private calculateControlPoint(start: Vec3, end: Vec3, peakHeight: number): Vec3 {
        return new Vec3(
            (start.x + end.x) / 2,
            Math.max(start.y, end.y) + peakHeight,
            (start.z + end.z) / 2
        );
    }

    /**
     * 计算贝塞尔曲线近似距离
     * @param start 起始位置
     * @param control 控制点
     * @param end 目标位置
     * @returns 近似距离
     */
    private calculateApproximateDistance(start: Vec3, control: Vec3, end: Vec3): number {
        // 使用更精确的方法计算贝塞尔曲线长度
        // 这里使用分段线性近似
        const segments = 10;
        let distance = 0;
        let prevPoint = start.clone();
        
        for (let i = 1; i <= segments; i++) {
            const t = i / segments;
            const point = this.calculateBezierPosition(start, control, end, t);
            distance += Vec3.distance(prevPoint, point);
            prevPoint = point;
        }
        
        return distance;
    }

    /**
     * 计算贝塞尔曲线位置
     * @param start 起始位置
     * @param control 控制点
     * @param end 目标位置
     * @param t 插值参数(0-1)
     * @returns 贝塞尔曲线上的位置
     */
    private calculateBezierPosition(start: Vec3, control: Vec3, end: Vec3, t: number): Vec3 {
        const x = this.calculateBezierPoint(start.x, control.x, end.x, t);
        const y = this.calculateBezierPoint(start.y, control.y, end.y, t);
        const z = this.calculateBezierPoint(start.z, control.z, end.z, t);
        return new Vec3(x, y, z);
    }

    /**
     * 计算贝塞尔曲线上的点
     * @param a 起始值
     * @param b 控制值
     * @param c 结束值
     * @param t 插值参数(0-1)
     * @returns 贝塞尔曲线上的值
     */
    private calculateBezierPoint(a: number, b: number, c: number, t: number): number {
        return Math.pow(1 - t, 2) * a + 2 * t * (1 - t) * b + Math.pow(t, 2) * c;
    }

    /**
     * 检查指定ID的飞行物品是否存在
     * @param itemId 飞行物品ID
     * @returns 是否存在
     */
    public hasFlightItem(itemId: string): boolean {
        return this.flightItems.has(itemId);
    }

    /**
     * 停止并移除指定的飞行物品
     * @param itemId 飞行物品ID
     */
    public removeFlight(itemId: string): void {
        const item = this.flightItems.get(itemId);
        if (item) {
            // 停止tween动画
            if (item.tweenId !== undefined) {
                Tween.stopAllByTarget(item);
            }
            
            // 移除飞行物品
            this.flightItems.delete(itemId);
        }
    }

    /**
     * 停止所有飞行物品
     */
    public removeAllFlights(): void {
        // 停止所有tween动画
        this.flightItems.forEach(item => {
            if (item.tweenId !== undefined) {
                Tween.stopAllByTarget(item);
            }
        });
        
        // 清空飞行物品集合
        this.flightItems.clear();
    }

    /**
     * 更新指定飞行物品的目标位置偏移
     * @param itemId 飞行物品ID
     * @param newEndNodeOffset 新的目标位置偏移函数
     * @param options 更新选项
     */
    public updateFlightTargetPosition(
        itemId: string, 
        newEndNodeOffset: () => Vec3,
        options: Partial<FlightOptions> = {}
    ): void {
        const item = this.flightItems.get(itemId);
        if (!item || !item.isActive) return;
        
        // 保存当前位置作为新的起始点
        const currentPos = new Vec3();
        item.node.getWorldPosition(currentPos);
        item.startPos = currentPos;
        
        // 更新目标位置偏移
        item.endNodeOffset = newEndNodeOffset;
        
        // 更新目标位置
        this.updateTargetPosition(item);
        
        // 更新控制点
        item.controlPoint = this.calculateControlPoint(
            item.startPos, 
            item.endPos, 
            options.peakHeight || item.peakHeight
        );
        
        // 如果提供了新的峰值高度，则更新
        if (options.peakHeight !== undefined) {
            item.peakHeight = options.peakHeight;
        }
        
        // 计算新的飞行距离和持续时间
        const distance = this.calculateApproximateDistance(item.startPos, item.controlPoint, item.endPos);
        const speed = options.speed || FlightManager.DEFAULT_OPTIONS.speed || 1000;
        item.duration = distance / speed;
        
        // 重置进度
        item.progress = 0;
        
        // 重新开始飞行动画
        this.startFlightTween(item, {
            ...FlightManager.DEFAULT_OPTIONS,
            ...options,
            onComplete: item.onComplete
        });
    }

    /**
     * 暂停指定的飞行物品
     * @param itemId 飞行物品ID
     */
    public pauseFlight(itemId: string): void {
        const item = this.flightItems.get(itemId);
        if (item && item.tweenId !== undefined) {
            Tween.stopAllByTarget(item);
            item.isActive = false;
        }
    }

    /**
     * 恢复指定的飞行物品
     * @param itemId 飞行物品ID
     * @param options 恢复选项
     */
    public resumeFlight(itemId: string, options: Partial<FlightOptions> = {}): void {
        const item = this.flightItems.get(itemId);
        if (item && !item.isActive) {
            item.isActive = true;
            this.startFlightTween(item, {
                ...FlightManager.DEFAULT_OPTIONS,
                ...options,
                onComplete: item.onComplete
            });
        }
    }

    /**
     * 获取指定飞行物品的当前进度
     * @param itemId 飞行物品ID
     * @returns 飞行进度(0-1)，如果物品不存在则返回-1
     */
    public getFlightProgress(itemId: string): number {
        const item = this.flightItems.get(itemId);
        return item ? item.progress : -1;
    }
} 