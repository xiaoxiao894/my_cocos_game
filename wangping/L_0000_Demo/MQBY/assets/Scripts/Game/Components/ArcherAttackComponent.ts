import { _decorator, Component, CCFloat, Vec3, Node, CCInteger, math } from 'cc';
import { ComponentEvent } from '../../common/ComponentEvents';
import { CharacterState } from '../../common/CommonEnum';
import { DamageData } from '../../common/CommonInterface';
import { StateComponent } from './StateComponent';
import { BaseComponet } from './BaseComponet';
import { AttackComponent } from './AttackComponent';

const { ccclass, property } = _decorator;

/**
 * 远程攻击组件 - 继承自攻击组件
 */
@ccclass('ArcherAttackComponent')
export class ArcherAttackComponent extends AttackComponent {
    @property({
        type: CCInteger,
        displayName: '最大弹药数',
        range: [1, 100],
        tooltip: '最大弹药数'
    })
    protected maxAmmo: number = 10;

    public getMaxAmmo(): number {
        return this.maxAmmo;
    }

    @property({
        type: CCInteger,
        displayName: '当前弹药数',
        range: [1, 100],
        tooltip: '当前弹药数'
    })
    protected currentAmmo: number = 5;

    public getCurrentAmmo(): number {
        return this.currentAmmo;
    }

    public setCurrentAmmo(value: number) {
        if (value > this.maxAmmo) {
            value = this.maxAmmo;
        }
        if (value < 0) {
            value = 0;
        }
        this.currentAmmo = value;
    }

    /**
     * 判断是否可以攻击
     * @returns 是否可以攻击
     */
    public canAttack(): boolean {
        return this._currentAttackTime <= 0 && !manager.game.isGamePause && this.currentAmmo > 0;
    }

    /**
     * 执行攻击伤害
     */
    public performAttack() {
        if (this.hasPerformedAttack) return;
        this.currentAmmo--;

        this.hasPerformedAttack = true;

        // 计算伤害值并发送执行攻击事件
        const damageValue = Math.floor(this.calculatDamage());
        const damageData: DamageData = {
            damage: damageValue,
            damageSource: this.node,
            ignoreImmunity: false,
        };
        this.node.emit(ComponentEvent.PERFORM_ATTACK, damageData);
    }
} 