import { _decorator, Component, Node, UITransform, Sprite, CCFloat, UIOpacity, tween } from 'cc';
const { ccclass, property } = _decorator;

/**
 * HealthBar 类
 * 用于显示角色的生命值
 */
@ccclass('HealthBar')
export class HealthBar extends Component {
    /**
     * 更新血条显示
     * @param percentage 生命值百分比 (0-1)
     */
    public updateHealth(percentage: number): void { }


    /**
     * 显示血条
     */
    public show(): void { }

    /**
     * 隐藏血条
     */
    public hide(): void { }

    /**
     * 立即隐藏血条
     */
    public hideImmediately(): void { }
} 