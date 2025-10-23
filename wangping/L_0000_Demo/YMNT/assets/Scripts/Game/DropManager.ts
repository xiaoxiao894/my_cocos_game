import { _decorator, Component, director, Node, tween, Vec3 } from 'cc';
import { DropItemCom } from './Drop/DropItemCom';
import { ObjectType } from '../common/CommonEnum';
const { ccclass, property } = _decorator;

@ccclass('DropManager')
export class DropManager extends Component {
    /** 单例实例 */
    private static declare _instance: DropManager | null;
    /** 获取单例实例 */
    public static get instance(): DropManager {
        if (!this._instance) {
            console.log('DropManager 实例不存在 动态创建');
            // 动态创建节点并添加组件
            const node = new Node('DropManager');
            this._instance = node.addComponent(DropManager);
            // 添加到场景
            director.getScene()?.addChild(node);
        }
        return this._instance as DropManager;
    }

    private itemList: DropItemCom[] = [];
    
    onLoad() {
        // 单例检查
        if (DropManager._instance) {
            this.node.destroy();
            return;
        }
        DropManager._instance = this;
        
        // 设置常驻节点，切换场景不销毁
        director.addPersistRootNode(this.node);
    }
    
    onDestroy() {
        if (DropManager._instance === this) {
            DropManager._instance = null;
        }
    }

    public addItem(item: Node) {
        const dropItemCom = item.getComponent(DropItemCom);
        if (dropItemCom) {
            this.itemList.push(dropItemCom);
        }else{
            console.warn('DropManager 添加物品失败，物品没有 DropItemCom 组件');
        }
    }

    public removeItem(item: Node) {
        const dropItemCom = item.getComponent(DropItemCom);
        if (dropItemCom) {
            const index = this.itemList.indexOf(dropItemCom);
            if (index !== -1) {
                this.itemList.splice(index, 1);
            }
        }
    }

    public getRangeItems(worldPosition: Vec3, range: number) {
        const result: DropItemCom[] = [];
        const rangeSquared = range * range; // 平方范围，避免开平方运算
        
        for (const item of this.itemList) {
            const itemPos = item.node.getWorldPosition();
            // 计算距离的平方
            const distanceSquared = Vec3.squaredDistance(worldPosition, itemPos);
            
            // 如果距离平方小于等于范围平方，则在范围内
            if (distanceSquared <= rangeSquared && item.canPickup) {
                result.push(item);
            }
        }
        
        return result;
    }

    /**
     * 获取范围内的物品，同时返回距离信息（平方距离）
     * @param worldPosition 世界坐标位置
     * @param range 搜索范围
     * @returns 包含物品和平方距离的数组
     */
    public getRangeItemsWithDistance(worldPosition: Vec3, range: number): Array<{item: DropItemCom, distanceSquared: number}> {
        const result: Array<{item: DropItemCom, distanceSquared: number}> = [];
        const rangeSquared = range * range;
        
        for (const item of this.itemList) {
            if (!item.canPickup) continue;
            
            const itemPos = item.node.getWorldPosition();
            const distanceSquared = Vec3.squaredDistance(worldPosition, itemPos);
            
            if (distanceSquared <= rangeSquared) {
                result.push({ item, distanceSquared });
            }
        }
        
        return result;
    }
    /**
     * 生成单个掉落物品
     * @param config 掉落配置
     * @param basePosition 基础位置
     */
    public spawnItem(objectType: ObjectType, basePosition: Vec3, isAddDrop: boolean = true): DropItemCom {
        // 实例化预制体
        const item = manager.pool.getNode(objectType)!;
        
        // 设置物品初始位置（在生成点上方一点）
        const startPosition = new Vec3(basePosition);
        startPosition.y += 0.5; // 从稍微高一点的位置开始
        item.setWorldPosition(startPosition);
        
        // 将物品添加到容器中
        if (manager.effect.node) {
            manager.effect.addToEffectLayer(item);
        } else {
            // 如果没有设置容器，则添加到场景中
            this.node.addChild(item);
        }
        
        if(isAddDrop){
            // 添加到管理器中
            manager.drop.addItem(item);
        }
        
        const dropItemCom = item.getComponent(DropItemCom);
        if(dropItemCom){
            dropItemCom.canPickup = true;
        }

        return dropItemCom;
    }

    
    /**
     * 生成单个抛物线掉落物品
     * @param config 掉落配置
     * @param basePosition 基础位置
     */
    public spawnParabolicItem(objectType: ObjectType, basePosition: Vec3, dropRadius: number = 3) {
        const item = manager.pool.getNode(objectType)!;

        // 计算随机掉落位置
        const randomOffset = new Vec3(
            (Math.random() - 0.5) * 2 * dropRadius,
            0,  // 保持在同一高度
            (Math.random() - 0.5) * 2 * dropRadius
        );

        const targetX = basePosition.x + randomOffset.x;
        const targetZ = basePosition.z + randomOffset.z;

        // 使用GameManager的地面高度计算方法
        const checkPosition = new Vec3(targetX, basePosition.y, targetZ);
        let targetY = manager.game.calculateGroundHeight(checkPosition) + 0.5;
        if (targetY <= -100) {
            targetY = 0;
        }
        
        const targetPosition = new Vec3(
            targetX,
            targetY,  // 使用射线检测结果作为落地高度
            targetZ
        );
        
        // 设置物品初始位置（在生成点上方一点）
        const startPosition = new Vec3(basePosition);
        startPosition.y += 0.5; // 从稍微高一点的位置开始
        item.setWorldPosition(startPosition);
        
        // 将物品添加到容器中
        if (manager.effect.node) {
            manager.effect.addToEffectLayer(item);
        } else {
            // 如果没有设置容器，则添加到场景中
            this.node.addChild(item);
        }
        
        // 添加到管理器中
        manager.drop.addItem(item);

        this.createParabolicMotion(item, basePosition, targetPosition, (item) => {
            const dropItemCom = item.getComponent(DropItemCom);
            if(dropItemCom){
                dropItemCom.canPickup = true;
                dropItemCom.showRotate();
            }
        });
    }

    /**
     * 创建抛物线动画
     * @param item 掉落物品节点
     * @param startPos 起始位置
     * @param endPos 目标位置
     */
    private createParabolicMotion(item: Node, startPos: Vec3, endPos: Vec3, callback: (item: Node) => void) {
        // 随机生成最大高度变化量，使不同物品有不同的抛物线高度
        const heightVariation = Math.random() * 0.5 + 0.8; // 0.8-1.3范围内
        const duration = 0.5 * (Math.random() * 0.4 + 0.8); // 随机持续时间变化
        
        // 使用tween实现抛物线动画
        tween(item)
            .to(duration, {}, {
                onUpdate: (target, ratio) => {
                    if(ratio === undefined){
                        return;
                    }
                    // 计算当前位置，使用抛物线公式
                    const currentPos = new Vec3();
                    Vec3.lerp(currentPos, startPos, endPos, ratio); // 线性插值x和z
                    
                    // 实现抛物线的y轴变化: y = 4 * h * t * (1 - t)
                    // 其中h为最大高度，t为时间比例(0-1)
                    const parabolicHeight = 4 * 3 * heightVariation * ratio * (1 - ratio);
                    
                    // 在起点和终点之间进行线性插值，再加上抛物线高度
                    const baseY = startPos.y * (1 - ratio) + endPos.y * ratio;
                    currentPos.y = baseY + parabolicHeight;
                    
                    // 应用位置
                    item.setWorldPosition(currentPos);
                }
            })
            .call(() => {
                callback(item);
            })
            .start();
    }
}


