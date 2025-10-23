import { _decorator, Component, CCFloat, Color, Vec3, color, sp } from 'cc';
import { ComponentEvent } from '../../common/ComponentEvents';
import { HealthBar } from './HealthBar';
// import { DamageNum } from '../UI/DamageNum';
import { ColorEffectType } from '../../common/CommonEnum';
import { DamageData } from '../../common/CommonInterface';
import { BaseComponet } from './BaseComponet';

const { ccclass, property } = _decorator;

/**
 * 健康组件 - 管理生命值、受伤和死亡逻辑
 */
@ccclass('HealthComponent')
export class HealthComponent extends BaseComponet {
    @property({
        type: CCFloat,
        displayName: '最大生命值',
        range: [1, 100000],
        tooltip: '角色的最大生命值'
    })
    protected maxHealth: number = 100;

    @property({
        type: CCFloat,
        displayName: '受伤免疫时间',
        range: [0, 3],
        tooltip: '受伤后的短暂无敌时间(秒)'
    })
    protected damageImmunityTime: number = 0.5;

    @property({type: HealthBar, displayName: '血条'})
    public healthBar: HealthBar = null!;

    /** 当前生命值 */
    @property({type: CCFloat, displayName: '当前生命值'})
    protected currentHealth: number = 0;
    /** 是否处于免疫状态 */
    protected isImmune: boolean = false;
    /** 免疫计时器 */
    protected immunityTimer: number = 0;
    /** 默认伤害颜色 */
    private defaultDamageColor: Color = color().fromHEX('#B2B488');

    onLoad() {
        super.onLoad();
        this.currentHealth = this.maxHealth;
        if (this.healthBar) {
            this.healthBar.updateHealth(this.healthPercentage);
        }
    }

    /**
     * 初始化健康状态
     */
    public initHealth() {
        this.currentHealth = this.maxHealth;
        if (this.healthBar) {
            this.healthBar.updateHealth(this.healthPercentage);
        }
    }

    update(dt: number) {
        this.updateImmunityStatus(dt);
    }

    /**
     * 更新免疫状态
     */
    protected updateImmunityStatus(dt: number) {
        if (this.isImmune) {
            this.immunityTimer += dt;
            if (this.immunityTimer >= this.damageImmunityTime) {
                this.isImmune = false;
                this.immunityTimer = 0;
            }
        }
    }

    /**
     * 角色受伤处理
     * @param damageData 伤害数据
     * @returns 是否死亡
     */
    public takeDamage(damageData : DamageData): boolean {
        // 已经死亡或处于免疫状态则不受伤害
        if (this.isDead || this.isImmune) {
            return false;
        }

        // 减少生命值
        this.currentHealth = Math.max(0, this.currentHealth - damageData.damage);
        
        // 更新血条显示
        if (this.healthBar) {
            this.healthBar.show();
            this.healthBar.updateHealth(this.healthPercentage);
        }
        
        // 发送生命值变化事件
        this.node.emit(ComponentEvent.HEALTH_CHANGED, this.healthPercentage);
        
        // 触发受伤效果
        this.onHurt(damageData);
        
        // 设置短暂免疫
        this.isImmune = true;
        this.immunityTimer = 0;
        
        // 显示伤害数字
        // const damageNum = manager.pool.getNode(ObjectType.DamageNum)!.getComponent(DamageNum)!;
        // damageNum.node.setParent(this.node);
        // damageNum.showDamage(damage, this.node.getWorldPosition().add(new Vec3(0, 0, 0.5)), damageColor || this.defaultDamageColor);
        
        // 检查是否死亡
        if (this.currentHealth <= 0) {
            this.onDead();
            return true;
        }
        
        return false;
    }

    /**
     * 治疗角色
     * @param amount 治疗量
     */
    public heal(amount: number) {
        if (this.isDead) return;
        
        this.currentHealth = Math.min(this.maxHealth, this.currentHealth + amount);
        
        // 更新血条显示
        if (this.healthBar) {
            this.healthBar.updateHealth(this.healthPercentage);
        }
        
        // 发送生命值变化事件
        this.node.emit(ComponentEvent.HEALTH_CHANGED, this.healthPercentage);
    }

    /**
     * 受伤处理
     */
    protected onHurt(damageData: DamageData) {
        if (this.isDead) return;
        
        // 显示闪红效果
        this.showHurtEffect();
        
        // 发送受伤事件
        this.node.emit(ComponentEvent.HURT, damageData);
    }

    /**
     * 死亡处理
     */
    protected onDead() {
        // 隐藏血条
        if (this.healthBar) {
            this.healthBar.hide();
        }
        
        // 发送死亡事件
        this.node.emit(ComponentEvent.DEAD, this);
    }

    /**
     * 显示受伤闪红效果
     */
    protected showHurtEffect() {
        // 通过事件应用闪红效果
        this.node.emit(ComponentEvent.APPLY_COLOR_EFFECT, {
            type: ColorEffectType.HURT,
            duration: 0.2
        });
    }

    /**
     * 重置组件状态
     */
    public reset() {
        this.initHealth();
        this.isImmune = false;
        this.immunityTimer = 0;
    }

    /**
     * 获取当前生命值
     */
    public get health(): number {
        return this.currentHealth;
    }

    /**
     * 获取生命值百分比
     */
    public get healthPercentage(): number {
        return this.currentHealth / this.maxHealth;
    }

    /**
     * 判断是否已死亡
     */
    public get isDead(): boolean {
        return this.currentHealth <= 0;
    }

    /**
     * 设置最大生命值
     */
    public setMaxHealth(maxHealth: number) {
        this.maxHealth = maxHealth;
        if (this.healthBar) {
            this.healthBar.updateHealth(this.healthPercentage);
        }
    }

    /**
     * 设置当前生命值
     */
    public setCurrentHealth(currentHealth: number) {
        this.currentHealth = currentHealth;
        if (this.healthBar) {
            this.healthBar.updateHealth(this.healthPercentage);
        }
    }
} 