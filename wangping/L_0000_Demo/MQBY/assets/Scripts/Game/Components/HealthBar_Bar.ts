import { _decorator, Component, Node, UITransform, Sprite, CCFloat, UIOpacity, tween } from 'cc';
import { HealthBar } from './HealthBar';
const { ccclass, property } = _decorator;

/**
 * HealthBar_Bar 类
 * 用于显示角色的生命值
 */
@ccclass('HealthBar_Bar')
export class HealthBar_Bar extends HealthBar {

    @property({
        type: Node,
        displayName: '血条填充',
        tooltip: '血条填充节点，会根据生命值百分比调整宽度'
    })
    private fill: Node = null!;
    
    @property({
        type: Node,
        displayName: '血条平滑背景',
        tooltip: '血条平滑背景节点，会在受伤后缓慢减少'
    })
    private backgroundFill: Node = null!;
    
    @property({
        type: CCFloat,
        displayName: '平滑动画时长',
        range: [0.1, 2.0],
        tooltip: '血条减少的平滑动画持续时间（秒）'
    })
    private animationDuration: number = 0.5;

    @property({type: UIOpacity, displayName: '血条透明度'})
    private opacity: UIOpacity = null!;

    // 原始宽度，用于计算
    private originalWidth: number = 0;
    private barSprite: Sprite = null!;
    private bgFillSprite: Sprite = null!;
    
    // 动画相关
    private isAnimating: boolean = false;
    private currentHealthPercent: number = 1.0;
    private targetHealthPercent: number = 1.0;
    private animationTimer: number = 0;
    
    private isShow: boolean = false;

    onLoad() {
        this.initialize();
        this.isShow = this.node.active;
    }
    
    update(dt: number) {
        // 处理平滑动画
        if (this.isAnimating) {
            this.animationTimer += dt;
            
            // 计算动画进度
            const progress = Math.min(1.0, this.animationTimer / this.animationDuration);
            
            // 如果背景填充存在，平滑更新其宽度
            if (this.backgroundFill && this.bgFillSprite) {
                // 计算当前应该显示的血量百分比（线性插值）
                const currentWidth = this.originalWidth * (
                    this.currentHealthPercent - (this.currentHealthPercent - this.targetHealthPercent) * progress
                );
                
                const uiTransform = this.backgroundFill.getComponent(UITransform);
                if (uiTransform) {
                    uiTransform.width = currentWidth;
                }
                
                // 动画完成
                if (progress >= 1.0) {
                    this.isAnimating = false;
                    this.currentHealthPercent = this.targetHealthPercent;
                }
            } else {
                // 如果没有背景填充，直接结束动画
                this.isAnimating = false;
            }
        }
    }

    /**
     * 初始化血条
     */
    private initialize(): void {
        // 检查必要的节点是否存在
        if (!this.fill) {
            console.error('HealthBar: 血条填充节点未设置');
            return;
        }

        // 获取填充区域的精灵组件
        this.barSprite = this.fill.getComponent(Sprite);
        if (!this.barSprite) {
            console.error('HealthBar: 填充节点上没有Sprite组件');
            return;
        }
        
        // 初始化背景填充精灵
        if (this.backgroundFill) {
            this.bgFillSprite = this.backgroundFill.getComponent(Sprite);
            if (!this.bgFillSprite) {
                console.error('HealthBar: 背景填充节点上没有Sprite组件');
            }
        }

        // 存储原始宽度以便计算
        const uiTransform = this.fill.getComponent(UITransform);
        if (uiTransform) {
            this.originalWidth = uiTransform.width;
            
            // 初始化背景填充宽度与填充宽度一致
            if (this.backgroundFill) {
                const bgTransform = this.backgroundFill.getComponent(UITransform);
                if (bgTransform) {
                    bgTransform.width = this.originalWidth;
                }
            }
        } else {
            console.error('HealthBar: 填充节点上没有UITransform组件');
        }
        
        // 初始化血量百分比
        this.currentHealthPercent = 1.0;
        this.targetHealthPercent = 1.0;
    }

    /**
     * 更新血条显示
     * @param percentage 生命值百分比 (0-1)
     */
    public updateHealth(percentage: number): void {
        // 安全检查，确保血条组件已正确初始化
        if (!this.fill || !this.barSprite || this.originalWidth <= 0) {
            return;
        }

        // 限制百分比在0-1范围内
        const healthPercent = Math.max(0, Math.min(1, percentage));
        
        // 更新填充区域宽度（立即更新）
        const uiTransform = this.fill.getComponent(UITransform);
        if (uiTransform) {
            uiTransform.width = this.originalWidth * healthPercent;
        }
        
        // 处理平滑背景动画
        if (this.backgroundFill) {
            if (healthPercent < this.currentHealthPercent) {
                // 如果动画正在进行，保存当前背景宽度对应的百分比作为新的起始点
                if (this.isAnimating) {
                    const bgTransform = this.backgroundFill.getComponent(UITransform);
                    if (bgTransform) {
                        this.currentHealthPercent = bgTransform.width / this.originalWidth;
                    }
                }
                
                // 更新目标值
                this.targetHealthPercent = healthPercent;
                
                // 重置动画
                this.isAnimating = true;
                this.animationTimer = 0;
            } else if (healthPercent > this.targetHealthPercent) {
                // 如果是血量恢复，直接更新两个值并立即显示
                this.currentHealthPercent = healthPercent;
                this.targetHealthPercent = healthPercent;
                this.isAnimating = false;
                
                const bgTransform = this.backgroundFill.getComponent(UITransform);
                if (bgTransform) {
                    bgTransform.width = this.originalWidth * healthPercent;
                }
            }
            // 如果血量等于目标值，不需要特殊处理
        }
    }


    /**
     * 显示血条
     */
    public show(): void {
        if (!this.isShow) {
            this.isShow = true;
            this.node.active = true;

            this.opacity.opacity = 255;
            // tween(this.opacity).to(0.3, { opacity: 255 }).start();
        }
    }

    /**
     * 隐藏血条
     */
    public hide(): void {
        if (this.isShow) {
            this.isShow = false;
            
            tween(this.opacity).to(0.6, { opacity: 0 }).call(() => {
                this.node.active = false;
            }).start();
        }
    }

    /**
     * 立即隐藏血条
     */
    public hideImmediately(): void {
        this.isShow = false;
        this.node.active = false;
    }
} 