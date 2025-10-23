import { _decorator, Component, Node, UITransform, Sprite, CCFloat, UIOpacity, tween } from 'cc';
import { HealthBar } from './HealthBar';
const { ccclass, property } = _decorator;

/**
 * HealthBar_Cycle 类
 * 用于显示角色的生命值
 */
@ccclass('HealthBar_Cycle')
export class HealthBar_Cycle extends HealthBar {

    @property({
        type: Sprite,
        displayName: '血条填充',
        tooltip: '血条填充节点，会根据生命值百分比调整填充范围'
    })
    private fill: Sprite = null!;
    
    @property({
        type: Sprite,
        displayName: '血条平滑背景',
        tooltip: '血条平滑背景节点，会在受伤后缓慢减少'
    })
    private backgroundFill: Sprite = null!;
    
    @property({
        type: CCFloat,
        displayName: '平滑动画时长',
        range: [0.1, 2.0],
        tooltip: '血条减少的平滑动画持续时间（秒）'
    })
    private animationDuration: number = 0.5;

    @property({type: UIOpacity, displayName: '血条透明度'})
    private opacity: UIOpacity = null!;
    
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
            
            // 如果背景填充存在，平滑更新其填充范围
            if (this.backgroundFill) {
                // 计算当前应该显示的血量百分比（线性插值）
                const currentFillRange = 
                    this.currentHealthPercent - (this.currentHealthPercent - this.targetHealthPercent) * progress;
                
                this.backgroundFill.fillRange = currentFillRange;
                
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
            console.error('HealthBar_Cycle: 血条填充节点未设置');
            return;
        }

        // 确保使用的是圆形填充类型
        this.fill.type = Sprite.Type.FILLED;
        this.fill.fillType = Sprite.FillType.RADIAL;
        this.fill.fillRange = 1.0;
        
        // 初始化背景填充
        if (this.backgroundFill) {
            this.backgroundFill.type = Sprite.Type.FILLED;
            this.backgroundFill.fillType = Sprite.FillType.RADIAL;
            this.backgroundFill.fillRange = 1.0;
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
        if (!this.fill) {
            return;
        }

        // 限制百分比在0-1范围内
        const healthPercent = Math.max(0, Math.min(1, percentage));
        
        // 更新填充区域范围（立即更新）
        this.fill.fillRange = healthPercent;
        
        // 处理平滑背景动画
        if (this.backgroundFill) {
            if (healthPercent < this.currentHealthPercent) {
                // 如果动画正在进行，保存当前背景填充范围对应的百分比作为新的起始点
                if (this.isAnimating) {
                    this.currentHealthPercent = this.backgroundFill.fillRange;
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
                
                this.backgroundFill.fillRange = healthPercent;
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