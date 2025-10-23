import { _decorator, Color, Component, Label, Node, tween, UIOpacity, Vec3 } from 'cc';
import { PoolObjectBase } from '../../common/PoolObjectBase';
import { ObjectType } from '../../common/CommonEnum';
const { ccclass, property } = _decorator;

@ccclass('DamageNum')
export class DamageNum extends PoolObjectBase {
    @property(Label)
    private label: Label = null!;

    @property(UIOpacity)
    private opacity: UIOpacity = null!;

    public showString(str: string, worldPos: Vec3, color: Color = Color.RED) {
        this.label.string = str;
        this.node.active = true;
        
        // 设置位置
        this.node.setWorldPosition(worldPos);
        // 设置颜色
        this.label.color = color;
        this.opacity.opacity = 255;

        const pos = this.node.getPosition().add(new Vec3(0, 2, 0.2));

        let scale = 0.03;

        this.node.scale = new Vec3(scale, scale, scale);

        // 设置动画
        tween(this.node)
            .to(0.3, { 
                position: pos
            })
            .call(() => {
                tween(this.opacity)
                    .to(0.3, { opacity: 0 })
                    .call(() => {
                        this.node.active = false;
                        manager.pool.putNode(this.node);
                    })
                    .start();
            })
            .start();
    }

    public showDamage(damage: number, worldPos: Vec3, color: Color) {
        this.label.string = damage.toFixed(0);
        this.node.active = true;
        
        // 设置位置
        this.node.setWorldPosition(worldPos);
        // 设置颜色
        this.label.color = color;
        this.opacity.opacity = 255;

        const pos = this.node.getPosition().add(new Vec3(0, 2, 0.2));
        
        // 根据伤害值计算缩放比例（伤害值范围一般在0到150）
        const minScale = 0.01;
        const maxScale = 0.03;
        const damageRatio = Math.min(Math.max(damage, 0), 120) / 120;
        let scale = minScale + (maxScale - minScale) * damageRatio;
        scale = Math.max(scale, minScale);
        scale = Math.min(scale, maxScale);

        this.node.scale = new Vec3(scale, scale, scale);

        // 设置动画
        tween(this.node)
            .to(0.3, { 
                position: pos
            })
            .call(() => {
                tween(this.opacity)
                    .to(0.3, { opacity: 0 })
                    .call(() => {
                        this.node.active = false;
                        manager.pool.putNode(this.node);
                    })
                    .start();
            })
            .start();

    }
    
    public reset(): void {
        this.label.string = '';
        this.opacity.opacity = 0;
        this.node.active = false;
    }
}


