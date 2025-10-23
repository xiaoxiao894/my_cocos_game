import { _decorator, Component, Node, tween, Vec3 } from 'cc';
import { MathUtil } from './MathUtils';
import { Global } from './core/Global';

import { eventMgr } from './core/EventManager';
import { EventType } from './core/EventType';
const { ccclass, property } = _decorator;

interface BackpackInfo {
    parentNode: Node | null;
    indexLength: number;
    originalPositions: Map<Node, Vec3>;
    name: string;
    // 新增：跟踪当前背包中正在归位的物品数量
    restoringCount: number;
}

@ccclass('goodsDrop')
export class goodsDrop extends Component {
    backpacks: BackpackInfo[] = [
        { 
            parentNode: null, 
            indexLength: 0, 
            originalPositions: new Map<Node, Vec3>(), 
            name: "backpack1",
            restoringCount: 0
        },
        { 
            parentNode: null, 
            indexLength: 0, 
            originalPositions: new Map<Node, Vec3>(), 
            name: "backpack",
            restoringCount: 0
        }
    ];
    
    // 跟踪所有背包中正在归位的物品总数
    private totalRestoringCount = 0;

    start() {
        this.initGoods();
    }

    update(deltaTime: number) {
        // 可以添加帧更新逻辑
    }

    // 初始化所有背包
    initGoods() {
        this.backpacks.forEach(backpack => {
            backpack.parentNode = this.node.getChildByName(backpack.name);
            if (!backpack.parentNode) return;

            backpack.indexLength = backpack.parentNode.children.length - 1;

            // 保存所有物品的初始位置
            backpack.parentNode.children.forEach(child => {
                backpack.originalPositions.set(child, child.getWorldPosition().clone());
            });
        });
    }

    // 随机化指定背包中的物品位置
    randomizeItemsInBackpack(backpackIndex: number, count: number = 1) {
        let temp = -0.8
        if(backpackIndex == 0){
            temp=-0.5
        }

        const backpack = this.backpacks[backpackIndex];
        if (count < 0 || !backpack.parentNode || backpack.indexLength < 0) return;

        const parentWorldPos = backpack.parentNode.getWorldPosition();

        // 生成相对于相对于父节点的随机偏移量
        let relativeOffset: Vec3;
        do {
            relativeOffset = new Vec3(
                Math.floor(Math.random() * 7) - 3, // -3 到 3
                temp,
                Math.floor(Math.random() * 7) - 3  // -3 到 3
            );
        } while (relativeOffset.x === 0 && relativeOffset.z === 0);


        // 计算相对于父节点的目标位置
        let handOverPos = new Vec3(
            parentWorldPos.x + relativeOffset.x,
            parentWorldPos.y + relativeOffset.y,
            parentWorldPos.z + relativeOffset.z
        );

        const itemNode = backpack.parentNode.children[backpack.indexLength];
        const itemWorldPos = itemNode.getWorldPosition().clone();

        // 计算贝塞尔曲线控制点
        const LIFT_HEIGHT = 2;
        const randomLift = () => Math.floor(Math.random() * (LIFT_HEIGHT * 2 + 1)) - LIFT_HEIGHT;

        const controlPoint = new Vec3(
            (itemNode.worldPosition.x + handOverPos.x) / 2 + randomLift(),
            (itemNode.worldPosition.y + handOverPos.y) / 2 + 6,
            (itemNode.worldPosition.z + handOverPos.z) / 2 + randomLift()
        );
        // 执行贝塞尔曲线动画
        tween(itemNode)
            .to(0.1, {
                // scale: new Vec3(1, 1, 1)
            }, {
                easing: 'cubicInOut',
                onUpdate: (target: Node, ratio: number) => {
                    const position = MathUtil.bezierCurve(
                        itemWorldPos,
                        controlPoint,
                        handOverPos,
                        ratio
                    );
                    target.worldPosition = position;
                }
            })
            .call(() => {
                backpack.indexLength--;
                this.randomizeItemsInBackpack(backpackIndex, count - 1);
            })
            .start();
    }
    
    // 恢复指定背包中的物品位置
    restoreItemsInBackpack(backpackIndex: number) {
        const backpack = this.backpacks[backpackIndex];
        if (!backpack?.parentNode) return;

        const children = backpack.parentNode.children;
        
        // 计算需要归位的物品数量
        let ii = 0;
        if (backpack.indexLength - 2 >= 0) {
            ii = backpack.indexLength - 2;
        }
        const itemsToRestore = children.length - ii;
        
        // 更新计数器
        backpack.restoringCount = itemsToRestore;
        this.totalRestoringCount += itemsToRestore;

        // 为每个物品设置延迟动画
        for (let i = ii; i < children.length; i++) {
            // 使用立即执行函数解决闭包问题
            (function (index) {
                const itemNode = children[index];
                if (!itemNode) {
                    // 如果物品节点不存在，也需要减少计数器
                    this.itemRestoreComplete(backpackIndex);
                    return;
                }

                // 安排动画
                this.scheduleOnce(() => {
                    const originalPos = backpack.originalPositions.get(itemNode);
                    if (!originalPos) {
                        this.itemRestoreComplete(backpackIndex);
                        return;
                    }

                    const currentPos = itemNode.getWorldPosition().clone();

                    // 贝塞尔曲线控制点
                    const controlPoint = new Vec3(
                        (currentPos.x + originalPos.x) / 2,
                        (currentPos.y + originalPos.y) / 2 + 5,
                        (currentPos.z + originalPos.z) / 2
                    );

                    // 播放音效
                    Global.soundManager.playPickUpSound();

                    // 执行动画
                    tween(itemNode)
                        .to(0.3, {}, {
                            easing: 'cubicInOut',
                            onUpdate: (target: Node, ratio: number) => {
                                const position = MathUtil.bezierCurve(
                                    currentPos,
                                    controlPoint,
                                    originalPos,
                                    ratio
                                );
                                target.worldPosition = position;
                            }
                        })
                        .call(() => {
                            // 单个物品动画完成
                            this.itemRestoreComplete(backpackIndex);
                        })
                        .start();
                }, index * 0.1);
            }).call(this, i); // 绑定this并传递当前索引
        }
    }
    
    // 单个物品归位完成
    private itemRestoreComplete(backpackIndex: number) {
        const backpack = this.backpacks[backpackIndex];
        if (!backpack) return;
        
        // 减少当前背包的归位计数器
        backpack.restoringCount--;
        // 减少全局归位计数器
        this.totalRestoringCount--;
        
        // 重置当前背包的indexLength（当该背包所有物品都归位后）
        if (backpack.restoringCount <= 0) {
            backpack.indexLength = backpack.parentNode?.children.length - 1 || 0;
        }
        
        // 检查是否所有物品都已归位
        this.checkAllItemsRestored();
    }
    
    // 检查是否所有物品都已归位
    private checkAllItemsRestored() {
        // 当全局计数器为0时，说明所有物品都已归位
        if (this.totalRestoringCount <= 0) {
            eventMgr.emit(EventType.GAME_OVER);
        }
    }

    // 恢复所有背包中的物品位置
    restoreItemsInAllBackpacks() {
        // 重置计数器
        this.totalRestoringCount = 0;
        this.backpacks.forEach(backpack => {
            backpack.restoringCount = 0;
        });
        
        // 开始所有背包的物品归位
        this.backpacks.forEach((_, index) => {
            this.restoreItemsInBackpack(index);
        });
    }
}