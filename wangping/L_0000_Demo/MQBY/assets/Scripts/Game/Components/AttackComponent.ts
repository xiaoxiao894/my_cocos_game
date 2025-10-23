import { _decorator, Component, CCFloat, Vec3, Node } from 'cc';
import { ComponentEvent } from '../../common/ComponentEvents';
import { CharacterState } from '../../common/CommonEnum';
import { DamageData } from '../../common/CommonInterface';
import { StateComponent } from './StateComponent';
import { BaseComponet } from './BaseComponet';

const { ccclass, property } = _decorator;

/**
 * 攻击组件 - 管理角色攻击相关功能
 */
@ccclass('AttackComponent')
export class AttackComponent extends BaseComponet {
    @property({
        type: CCFloat,
        displayName: '攻击距离',
        range: [0.5, 500],
        tooltip: '角色可以攻击目标的距离'
    })
    protected attackRange: number = 2;

    @property({
        type: CCFloat,
        displayName: '攻击冷却',
        range: [0.1, 5],
        tooltip: '攻击之间的冷却时间(秒)'
    })
    protected attackCooldown: number = 1;

    @property({
        type: CCFloat,
        displayName: '伤害值',
        range: [1, 1000],
        tooltip: '攻击造成的伤害'
    })
    protected damageValue: number = 10;

    @property({
        type: CCFloat,
        displayName: '攻击伤害浮动范围',
        range: [0, 200],
        tooltip: '攻击伤害浮动范围：伤害值±设定值'
    })
    protected damageRange: number = 0;

    @property({
        type: CCFloat,
        displayName: '攻击伤害触发时机',
        range: [0, 1],
        tooltip: '攻击动画播放到多少进度时触发伤害(0-1)'
    })
    protected damageExecuteTime: number = 0.6;

    /** 当前攻击冷却时间 */
    protected _currentAttackTime: number = 0;
    /** 是否已执行本次攻击的伤害 */
    protected hasPerformedAttack: boolean = false;

    onLoad() {
        super.onLoad();
        this.registerEvents();
    }

    onDestroy() {
        this.unregisterEvents();
    }

    /**
     * 注册事件监听
     */
    protected registerEvents() {
        // 监听攻击请求事件
        this.node.on(ComponentEvent.REQUEST_ATTACK, this.onRequestAttack, this);
        this.node.on(ComponentEvent.ATTACK_ANI_COMPLETE, this.onAttackAniComplete, this);
    }

    /**
     * 注销事件监听
     */
    protected unregisterEvents() {
        this.node.off(ComponentEvent.REQUEST_ATTACK, this.onRequestAttack, this);
        this.node.off(ComponentEvent.ATTACK_ANI_COMPLETE, this.onAttackAniComplete, this);
    }

    /**
     * 处理攻击请求事件
     */
    protected onRequestAttack() {
        this.attack();
    }

    /**
     * 获取攻击冷却时间
     */
    public get attackCooldownTime(): number {
        return this.attackCooldown;
    }

    /**
     * 获取攻击伤害触发时机
     */
    public get attackDamageExecuteTime(): number {
        return this.damageExecuteTime;
    }

    update(dt: number) {
        this.handleAttackCooldown(dt);
    }

    /**
     * 处理攻击冷却逻辑
     */
    protected handleAttackCooldown(dt: number) {
        // 如果在冷却中，继续计时
        if (this._currentAttackTime > 0) {
            this._currentAttackTime += dt;
            if (this._currentAttackTime >= this.attackCooldown) {
                this._currentAttackTime = 0;
            }
        }
    }

    // 锁攻击方向
    protected _lockAttackDir: Vec3 = null;
    public setLockAttackDir(dir: Vec3) {
        this._lockAttackDir = dir;
    }

    public updateAttackTarget(target: Node) {
        if (this._lockAttackDir) {
            this.node.emit(ComponentEvent.SET_FACE_DIRECTION_FROM_3D, this._lockAttackDir);
            return;
        }
        const direction = new Vec3();
        Vec3.subtract(direction, target.getWorldPosition(), this.node.getWorldPosition());
        direction.normalize();
        this.node.emit(ComponentEvent.SET_FACE_DIRECTION_FROM_3D, direction);
    }

    /**
     * 判断是否可以攻击
     * @returns 是否可以攻击
     */
    public canAttack(): boolean {
        // if(this.node.name == "Hero"){
        //     console.log("canAttack", this._currentAttackTime, this.node.name);  
        // }
        return this._currentAttackTime <= 0 && !manager.game.isGamePause;
    }

    /**
     * 尝试执行攻击
     * @returns 是否成功执行攻击
     */
    public attack(): boolean {
        if (!this.canAttack()) {
            return false;
        }

        return this.startAttack();
    }

    /**
     * 开始攻击
     * @returns 是否成功开始攻击
     */
    public startAttack(): boolean {
        // 开始攻击冷却计时
        this._currentAttackTime = 0.001; // 设置一个极小值表示已开始计时
        this.hasPerformedAttack = false;

        // 发送攻击开始事件
        this.node.emit(ComponentEvent.ATTACK_START);

        return true;
    }

    public onAttackAniComplete(animName: string) {
        // 攻击动画结束，但不重置冷却时间，让冷却继续进行
        // 移除了错误的立即重置逻辑，保持攻击冷却机制的完整性

        // 发送攻击结束事件
        this.node.emit(ComponentEvent.ATTACK_ANI_END);
    }

    /**
     * 执行攻击伤害
     */
    public performAttack() {
        if (this.hasPerformedAttack) return;

        this.hasPerformedAttack = true;

        // 计算伤害值并发送执行攻击事件
        const damage = this.calculatDamage();
        const damageData: DamageData = {
            damage: damage,
            damageSource: this.node,
            ignoreImmunity: false,
        };
        this.node.emit(ComponentEvent.PERFORM_ATTACK, damageData);
    }

    /**
     * 计算实际伤害值
     */
    protected calculatDamage(): number {
        // 在基础伤害值上增加随机浮动
        return this.damageValue + this.damageRange * (Math.random() - 0.5) * 2;
    }

    /**
     * 重置组件状态
     */
    public reset() {
        this._currentAttackTime = 0;
        this.hasPerformedAttack = false;
    }

    /**
     * 获取伤害值
     */
    public get damage(): number {
        return this.damageValue;
    }

    /**
     * 判断是否正在冷却
     */
    public get isCooling(): boolean {
        return this._currentAttackTime > 0;
    }

    /**
     * 获取当前攻击冷却时间
     */
    public get currentAttackTime(): number {
        return this._currentAttackTime;
    }

    /**
     * 判断是否已执行本次攻击的伤害
     */
    public get hasPerformedDamage(): boolean {
        return this.hasPerformedAttack;
    }

    /**
     * 设置伤害值
     * @param value 新的伤害值
     */
    public setDamage(value: number): void {
        this.damageValue = value;
    }

    /**
     * 获取攻击距离
     */
    public get attackRangeValue(): number {
        return this.attackRange;
    }

    /**
     * 设置攻击参数
     * @param attackRange 攻击距离
     * @param attackCooldown 攻击冷却
     * @param damageValue 伤害值
     * @param damageRange 伤害浮动范围
     * @param damageExecuteTime 伤害触发时机
     */
    public setAttackParams(attackRange: number, attackCooldown: number, damageValue: number, damageRange: number, damageExecuteTime: number) {
        this.attackRange = attackRange;
        this.attackCooldown = attackCooldown;
        this.damageValue = damageValue;
        this.damageRange = damageRange;
        this.damageExecuteTime = damageExecuteTime;
    }
} 