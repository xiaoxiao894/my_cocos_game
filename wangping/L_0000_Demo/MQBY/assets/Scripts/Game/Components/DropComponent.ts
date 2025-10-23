import { _decorator, Component, Prefab, instantiate, Node, Vec3, CCFloat, CCInteger, math, Enum, tween, PhysicsSystem, geometry } from 'cc';
import { CommonEvent, ObjectType, PHY_GROUP } from '../../common/CommonEnum';
import { DropItemCom } from '../Drop/DropItemCom';

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

@ccclass('DropItemConfig')
export class DropItem {
    @property({ type: Enum(ObjectType), displayName: '掉落物品类型' })
    public objectType: ObjectType = ObjectType.DropItemCoin;

    @property({ type: CCFloat, displayName: '掉落概率', range: [0, 1] })
    public probability: number = 0.5;

    @property({ type: CCInteger, displayName: '最小掉落数量' })
    public minCount: number = 1;

    @property({ type: CCInteger, displayName: '最大掉落数量' })
    public maxCount: number = 5;
}

/**
 * 掉落组件 - 管理角色死亡后的物品掉落功能
 */
@ccclass('DropComponent')
export class DropComponent extends Component {
    @property({ type: [DropItem], displayName: '掉落物品配置' })
    public dropItems: DropItem[] = [];

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

    private defaultLandingHeight: number = 0.2;

    private get dropContainer(): Node {
        return manager.game.dropLayer;
    }

    /** 掉落物品配置列表 */
    private dropConfigs: DropItemConfig[] = [];

    onLoad() {
        this.initDropConfigs();
    }

    /**
     * 初始化掉落配置
     */
    private initDropConfigs() {
        // 根据属性配置填充掉落配置列表
        this.dropConfigs = this.dropItems.map(item => ({
            objectType: item.objectType,
            probability: item.probability,
            minCount: item.minCount,
            maxCount: item.maxCount
        }));
    }

    /**
     * 添加自定义掉落物品配置
     * @param config 掉落物品配置
     */
    public addDropConfig(config: DropItemConfig) {
        this.dropConfigs.push(config);
    }

    /**
     * 生成掉落物品
     * @param position 掉落位置
     * @param dropRateMultiplier 掉落率倍数修正
     */
    public generateDrops(position: Vec3, dropRateMultiplier: number = 1) {
        // 检查是否有掉落配置
        if (this.dropConfigs.length === 0) {
            return;
        }

        // 为每种可能的掉落物品执行随机判定
        for (const config of this.dropConfigs) {
            // 计算最终掉落概率
            const finalProbability = config.probability * dropRateMultiplier;

            // 进行掉落判定
            if (Math.random() <= finalProbability) {
                // 确定掉落数量
                const count = math.randomRangeInt(config.minCount, config.maxCount + 1);

                // 生成掉落物品
                for (let i = 0; i < count; i++) {
                    this.spawnItem(config, position);
                }
            }
        }
    }

    /**
     * 生成单个掉落物品
     * @param config 掉落配置
     * @param basePosition 基础位置
     */
    private spawnItem(config: DropItemConfig, basePosition: Vec3) {
        const objectType = config.objectType;

        // 指定金币堆放处
        if (manager.game.coinContainer) {
            manager.game.coinContainer.receiveCoin(this.node.worldPosition);
            return;
        }

        // 实例化预制体
        const item = manager.pool.getNode(objectType, this.dropContainer)!;
        // 计算随机掉落位置
        const randomOffset = new Vec3(
            (Math.random() - 0.5) * 2 * this.dropRadius,
            0,  // 保持在同一高度
            (Math.random() - 0.5) * 2 * this.dropRadius
        );


        const dropPos = manager.drop.dropCoinPos;

        let targetX = 0;
        let targetZ = 0;
        if (dropPos) {
            targetX = dropPos.worldPositionX + randomOffset.x;;
            targetZ = dropPos.worldPositionZ + randomOffset.z;
        }
        else {
            targetX = basePosition.x + randomOffset.x;
            targetZ = basePosition.z + randomOffset.z;
        }

        let targetY = this.defaultLandingHeight; // 默认落地高度

        // // 创建从上方向下的射线进行地面检测
        // const ray = new geometry.Ray();
        // const rayOrigin = new Vec3(targetX, basePosition.y + 20, targetZ); // 从高处向下射线
        // const rayDir = new Vec3(0, -1, 0); // 向下的方向
        // ray.o = rayOrigin;
        // ray.d = rayDir;

        // // 执行射线检测
        // if (PhysicsSystem.instance.raycast(ray)) {
        //     const raycastResults = PhysicsSystem.instance.raycastResults;
        //     // 如果检测到碰撞，使用碰撞点的高度
        //     if (raycastResults.length > 0) {
        //         // targetY = raycastResults[0].hitPoint.y + 0.3; // 加上一个小偏移防止穿透

        //         for (const result of raycastResults) {
        //             const collider = result.collider;
        //             if (collider.getGroup() == PHY_GROUP.GROUND) {
        //                 targetY = result.hitPoint.y + 0.3;
        //                 break;
        //             }
        //         }
        //     }
        // }

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
        const heightVariation = Math.random() * 0.5 + 3.0;
        const duration = this.dropDuration * (Math.random() * 0.4 + 0.8); // 随机持续时间变化

        const delay = Math.random() * 0.4;

        // 使用tween实现抛物线动画
        tween(item)
            .delay(delay)
            .to(duration, {}, {
                onUpdate: (target, ratio) => {
                    if (ratio === undefined) {
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
                if (dropItemCom) {
                    dropItemCom.canPickup = true;
                    dropItemCom.showRotate();
                }
            })
            .start();
    }

    /**
     * 重置组件状态
     */
    public reset() {
        // 重置状态或清理时可以在此实现
    }
} 