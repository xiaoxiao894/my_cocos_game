import { _decorator, CCFloat, Component, Node, tween, Vec3 } from 'cc';
import { DropItemCom } from './Game/Drop/DropItemCom';
import { ObjectType } from './common/CommonEnum';
const { ccclass, property } = _decorator;

/**
 * 掉落物品配置接口
 */
interface DropItemConfig {
    objectType: ObjectType;
    probability: number;  // 掉落概率 0-1
    minCount: number;     // 最小掉落数量
    maxCount: number;     // 最大掉落数量
}

@ccclass('Test')
export class Test extends Component {
    @property({
        type: CCFloat,
        displayName: '掉落扩散范围',
        tooltip: '物品掉落的扩散范围'
    })
    private dropRadius: number = 3;
    
    @property({
        type: CCFloat,
        displayName: '抛物线最大高度',
        tooltip: '掉落物品抛物线的最大高度'
    })
    private maxHeight: number = 2.0;
    
    @property({
        type: CCFloat,
        displayName: '掉落动画时间',
        tooltip: '掉落物品到达目标位置所需时间(秒)'
    })
    private dropDuration: number = 0.5;

    private get dropContainer(): Node {
        return manager.game.dropLayer;
    }
    
    private defaultLandingHeight: number = 0;

    protected start(): void {
        // this.schedule(() => {
        //     this.spawnItem({
        //         objectType: ObjectType.DropItemCoin,
        //         probability: 1,
        //         minCount: 1,
        //         maxCount: 1
        //     }, new Vec3(0, 0, 0));
        // }, 0, 200);

        // this.schedule(() => {
        //     this.spawnItem({
        //         objectType: ObjectType.DropItemCornSoup ,
        //         probability: 1,
        //         minCount: 1,
        //         maxCount: 1
        //     }, new Vec3(0, 0, 0));
        // }, 0, 100);

        // this.schedule(() => {
        //     this.spawnItem({
        //         objectType: ObjectType.DropItemCornKernel ,
        //         probability: 1,
        //         minCount: 1,
        //         maxCount: 1
        //     }, new Vec3(0, 0, 0));
        // }, 0, 100);
    }
    
    /**
     * 生成单个掉落物品
     * @param config 掉落配置
     * @param basePosition 基础位置
     */
    private spawnItem(config: DropItemConfig, basePosition: Vec3) {
        const objectType = config.objectType;
        // 实例化预制体
        const item = manager.pool.getNode(objectType, this.dropContainer)!;
        // 计算随机掉落位置
        const randomOffset = new Vec3(
            (Math.random() - 0.5) * 2 * this.dropRadius,
            0,  // 保持在同一高度
            (Math.random() - 0.5) * 2 * this.dropRadius
        );
        
        const targetX = basePosition.x + randomOffset.x;
        const targetZ = basePosition.z + randomOffset.z;
        
        // 使用GameManager的地面高度计算方法
        const checkPosition = new Vec3(targetX, basePosition.y, targetZ);
        let targetY = manager.game.calculateGroundHeight(checkPosition) + 0.5;
        
        // 如果没有检测到地面，使用默认高度
        if (targetY <= -100) {
            targetY = this.defaultLandingHeight;
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
        if (this.dropContainer) {
            this.dropContainer.addChild(item);
        } else {
            // 如果没有设置容器，则添加到场景中
            this.node.addChild(item);
        }
        
        // 添加到管理器中
        manager.drop.addItem(item);
        
        // 创建抛物线动画
        this.createParabolicMotion(item, startPosition, targetPosition);
    }
    
    /**
     * 创建抛物线动画
     * @param item 掉落物品节点
     * @param startPos 起始位置
     * @param endPos 目标位置
     */
    private createParabolicMotion(item: Node, startPos: Vec3, endPos: Vec3) {
        // 随机生成最大高度变化量，使不同物品有不同的抛物线高度
        const heightVariation = Math.random() * 0.5 + 0.8; // 0.8-1.3范围内
        const duration = this.dropDuration * (Math.random() * 0.4 + 0.8); // 随机持续时间变化

        const delay = Math.random() * 0.4;
        
        // 使用tween实现抛物线动画
        tween(item)
            .delay(delay)
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
                    const parabolicHeight = 4 * this.maxHeight * heightVariation * ratio * (1 - ratio);
                    
                    // 在起点和终点之间进行线性插值，再加上抛物线高度
                    const baseY = startPos.y * (1 - ratio) + endPos.y * ratio;
                    currentPos.y = baseY + parabolicHeight;
                    
                    // 应用位置
                    item.setWorldPosition(currentPos);
                }
            })
            .call(() => {
                const dropItemCom = item.getComponent(DropItemCom);
                if(dropItemCom){
                    dropItemCom.canPickup = true;
                    dropItemCom.showRotate();
                }
            })
            .start();
    }
}


