import { _decorator, Color, Component, Node, Vec3 } from 'cc';
import { ComponentEvent } from '../../common/ComponentEvents';
import { ColorEffectType, FrameEventId } from '../../common/CommonEnum';
import { BaseComponet } from './BaseComponet';

const { ccclass, property } = _decorator;

/**
 * 颜色效果数据
 */
export interface ColorEffectData {
    type: ColorEffectType;
    duration: number;
    timer: number;
    active: boolean;
}

/**
 * 帧事件数据
 */
export interface FrameEvent {
    progress: number;        // 触发进度 (0-1)
    callback: () => void;    // 回调函数
    once: boolean;           // 是否只触发一次
    triggered: boolean;      // 是否已经触发过
    id: FrameEventId;        // 事件唯一标识
}

/**
 * 基础动画组件 - 所有动画组件的父类，包含通用逻辑
 */
@ccclass('BaseAnimationComponent')
export abstract class BaseAnimationComponent extends BaseComponet {
    /** 空闲动画名称 */
    @property({displayName: '空闲动画名称'})
    protected idleAnimName: string = 'idle';
    /** 移动动画名称 */
    @property({displayName: '移动动画名称'})
    protected moveAnimName: string = 'run';
    /** 攻击动画名称 */
    @property({displayName: '攻击动画名称'})
    protected attackAnimName: string = 'attack';
    /** 死亡动画名称 */
    @property({displayName: '死亡动画名称'})
    protected deadAnimName: string = 'die';
    /** 攻击动画名称 */
    @property({displayName: '攻击动画名称'})
    protected runAttackAnimName: string = 'run_attack';
    
    /** 默认时间缩放 */
    protected defaultTimeScale: number = 1.0;

    /** 默认骨骼颜色 */
    protected readonly defaultColor: Color = new Color(255, 255, 255, 255);
    /** 受伤效果颜色 (红色) */
    protected readonly hurtColor: Color = new Color(255, 0, 0, 255);
    /** a减速效果颜色 (蓝色) */
    protected readonly slowColor: Color = new Color(90, 155, 255, 255);
    
    /** 当前显示的颜色效果类型 */
    protected currentDisplayColorEffect: ColorEffectType = ColorEffectType.NORMAL;
    /** 所有活跃的颜色效果 */
    protected colorEffects: Map<ColorEffectType, ColorEffectData> = new Map();
    
    /** 帧事件列表 */
    protected frameEvents: FrameEvent[] = [];
    /** 上一帧的动画进度，用于检测进度变化 */
    private lastAnimationProgress: number = 0;

    public get IdleAnimName(): string {
        return this.idleAnimName;
    }

    public set IdleAnimName(name: string) {
        this.idleAnimName = name;
    }

    public get MoveAnimName(): string {
        return this.moveAnimName;
    }

    public set MoveAnimName(name: string) {
        this.moveAnimName = name;
    }

    public get AttackAnimName(): string {
        return this.attackAnimName;
    }

    public set AttackAnimName(name: string) {
        this.attackAnimName = name;
    }

    public get DeadAnimName(): string {
        return this.deadAnimName;
    }

    public get RunAttackAnimName(): string {
        return this.runAttackAnimName;
    }

    onLoad() {
        super.onLoad();
        this.initAnimation();
        this.registerEvents();
    }

    onDestroy() {
        this.unregisterEvents();
    }

    /**
     * 初始化动画组件
     */
    protected abstract initAnimation(): void;

    /**
     * 注册事件监听
     */
    protected registerEvents() {
        // 监听应用颜色效果事件
        this.node.on(ComponentEvent.APPLY_COLOR_EFFECT, this.onApplyColorEffect, this);
        // 监听取消颜色效果事件
        this.node.on(ComponentEvent.CANCEL_COLOR_EFFECT, this.onCancelColorEffect, this);

        // 监听减速开始事件
        this.node.on(ComponentEvent.SLOW_START, this.onSlowStart, this);
        // 监听减速结束事件
        this.node.on(ComponentEvent.SLOW_END, this.onSlowEnd, this);

        // 监听设置朝向事件
        this.node.on(ComponentEvent.SET_FACE_DIRECTION, this.updateFaceDirection, this);
        // 监听设置朝向事件
        this.node.on(ComponentEvent.SET_FACE_DIRECTION_FROM_3D, this.updateFaceDirectionFrom3D, this);
    }

    /**
     * 注销事件监听
     */
    protected unregisterEvents() {
        this.node.off(ComponentEvent.APPLY_COLOR_EFFECT, this.onApplyColorEffect, this);
        this.node.off(ComponentEvent.CANCEL_COLOR_EFFECT, this.onCancelColorEffect, this);
        this.node.off(ComponentEvent.SLOW_START, this.onSlowStart, this);
        this.node.off(ComponentEvent.SLOW_END, this.onSlowEnd, this);
        this.node.off(ComponentEvent.SET_FACE_DIRECTION, this.updateFaceDirection, this);
        this.node.off(ComponentEvent.SET_FACE_DIRECTION_FROM_3D, this.updateFaceDirectionFrom3D, this);
    }

    /**
     * 处理应用颜色效果事件
     * @param eventData 事件数据
     */
    protected onApplyColorEffect(eventData: any) {
        if (!eventData || eventData.type === undefined || eventData.duration === undefined) {
            return;
        }
        
        this.applyColorEffect(eventData.type, eventData.duration);
    }

    /**
     * 处理取消颜色效果事件
     * @param type 颜色效果类型
     */
    protected onCancelColorEffect(type: ColorEffectType) {
        this.cancelColorEffect(type);
    }

    protected abstract onSlowStart(slowRatio: number, slowDuration: number): void;

    protected abstract onSlowEnd(): void;

    update(dt: number) {
        this.updateColorEffects(dt);
        this.updateFrameEvents();
    }

    /**
     * 更新所有颜色效果
     * @param dt 帧间隔时间
     */
    protected updateColorEffects(dt: number) {
        let needUpdateColor = false;
        
        // 更新所有效果的计时器
        for (const [type, effectData] of this.colorEffects.entries()) {
            if (!effectData.active) continue;
            
            effectData.timer += dt;
            if (effectData.timer >= effectData.duration) {
                // 效果结束，标记为非活跃
                effectData.active = false;
                needUpdateColor = true;
            }
        }
        
        // 如果有效果状态变化，更新显示的颜色
        if (needUpdateColor) {
            this.updateDisplayColorEffect();
        }
    }

    /**
     * 更新帧事件
     */
    protected updateFrameEvents() {
        if (this.frameEvents.length === 0) {
            return;
        }

        const currentProgress = this.getCurrentAnimationProgress();
        
        // 遍历所有帧事件
        for (const frameEvent of this.frameEvents) {
            // 如果是一次性事件且已经触发过，跳过
            if (frameEvent.once && frameEvent.triggered) {
                continue;
            }

            // 检查是否需要触发事件
            const shouldTrigger = this.shouldTriggerFrameEvent(frameEvent, currentProgress);
            
            if (shouldTrigger) {
                try {
                    frameEvent.callback();
                    frameEvent.triggered = true;
                } catch (error) {
                    console.error(`帧事件回调执行失败 (ID: ${frameEvent.id}):`, error);
                }
            }
        }

        // 更新上一帧进度
        this.lastAnimationProgress = currentProgress;
    }

    /**
     * 判断是否应该触发帧事件
     * @param frameEvent 帧事件
     * @param currentProgress 当前进度
     * @return 是否应该触发
     */
    private shouldTriggerFrameEvent(frameEvent: FrameEvent, currentProgress: number): boolean {
        // 如果进度没有变化，不触发
        if (currentProgress === this.lastAnimationProgress) {
            return false;
        }

        // 检查是否跨越了触发点
        // 情况1：正常播放，从小进度到大进度
        if (this.lastAnimationProgress < frameEvent.progress && currentProgress >= frameEvent.progress) {
            return true;
        }

        // 情况2：循环动画重新开始，进度从接近1跳回到0附近
        if (this.lastAnimationProgress > 0.9 && currentProgress < 0.1) {
            // 如果事件进度很小，说明应该在循环开始时触发
            if (frameEvent.progress <= currentProgress) {
                // 重置非一次性事件的触发状态
                if (!frameEvent.once) {
                    frameEvent.triggered = false;
                }
                return true;
            }
        }

        return false;
    }

    /**
     * 更新显示的颜色效果
     * 选择当前活跃的最高优先级效果
     */
    protected updateDisplayColorEffect() {
        // 默认为正常颜色
        let highestPriorityEffect = ColorEffectType.NORMAL;
        
        // 找出当前活跃的最高优先级效果
        for (const [type, effectData] of this.colorEffects.entries()) {
            if (effectData.active && type > highestPriorityEffect) {
                highestPriorityEffect = type;
            }
        }
        
        // 如果最高优先级效果变化，应用新的颜色
        if (highestPriorityEffect !== this.currentDisplayColorEffect) {
            this.currentDisplayColorEffect = highestPriorityEffect;
            this.applyColorToAnimation(highestPriorityEffect);
        }
    }

    /**
     * 应用指定类型的颜色到动画
     * @param type 颜色效果类型
     */
    protected abstract applyColorToAnimation(type: ColorEffectType): void;

    /**
     * 应用颜色效果
     * @param type 颜色效果类型
     * @param duration 持续时间(秒)
     */
    protected applyColorEffect(type: ColorEffectType, duration: number) {
        if (type === ColorEffectType.NORMAL) return;
        
        // 创建或更新效果数据
        const effectData: ColorEffectData = {
            type,
            duration,
            timer: 0,
            active: true
        };
        
        // 保存/更新效果
        this.colorEffects.set(type, effectData);
        
        // 更新显示的颜色
        this.updateDisplayColorEffect();
    }

    /**
     * 取消指定类型的颜色效果
     * @param type 要取消的颜色效果类型
     */
    protected cancelColorEffect(type: ColorEffectType) {
        // 如果效果存在且活跃，将其标记为非活跃
        const effectData = this.colorEffects.get(type);
        if (effectData && effectData.active) {
            effectData.active = false;
            this.updateDisplayColorEffect();
        }
    }

    /**
     * 重置所有颜色效果
     */
    protected resetAllColorEffects() {
        this.colorEffects.clear();
        this.currentDisplayColorEffect = ColorEffectType.NORMAL;
        
        this.applyColorToAnimation(ColorEffectType.NORMAL);
    }

    /**
     * 动画完成回调
     */
    protected abstract onAnimationComplete(track: any): void;
    
    /**
     * 根据X方向更新朝向
     */
    protected abstract updateFaceDirection(directionX: number): void;

    /**
     * 根据3D方向向量更新朝向
     */
    protected abstract updateFaceDirectionFrom3D(direction: Vec3): void;

    /**
     * 播放空闲动画
     */
    public abstract playIdle(): void;

    /**
     * 播放移动动画
     */
    public abstract playMove(): void;

    /**
     * 播放攻击动画
     * @param timeScale 动画播放速度
     */
    public abstract playAttack(timeScale?: number, isLoop?: boolean): void;

    /**
     * 播放死亡动画
     */
    public abstract playDead(): void;

    /**
     * 播放移动攻击动画
     * @param timeScale 动画播放速度
     */
    public abstract playRunAttack(timeScale?: number, isLoop?: boolean): void;

    /**
     * 播放指定动画
     * @param name 动画名称
     * @param loop 是否循环播放
     * @param timeScale 动画播放速度，默认为1
     */
    public abstract playAnimation(name: string, loop: boolean, timeScale?: number): void;

    /**
     * 设置动画播放速度
     * @param timeScale 时间缩放值，大于1加速，小于1减速
     */
    public abstract setTimeScale(timeScale: number): void;

    /**
     * 重置时间缩放为默认值
     */
    public abstract resetTimeScale(): void;

    /**
     * 获取动画时长
     * @param animName 动画名称，不传则获取当前动画时长
     * @returns 动画时长(秒)
     */
    public abstract getAnimationDuration(animName?: string): number;

    /**
     * 获取当前动画节点
     */
    public abstract getAnimationNode(): Node | null;
    
    /**
     * 获取当前动画帧事件进度
     * 用于在指定时间点触发攻击等效果
     * @returns 当前动画进度(0-1)
     */
    public abstract getCurrentAnimationProgress(): number;

    /**
     * 获取当前动画名称
     * @returns 当前动画名称
     */
    public abstract getCurrentAnimationName(): string;

    /**
     * 判断当前是否有动画正在播放
     * @returns 是否正在播放动画
     */
    public abstract isPlayingAnimation(): boolean;

    /**
     * 播放溶解动画
     */
    public playDissolve() {}

    /**
     * 添加帧事件
     * @param progress 触发进度 (0-1)，0表示动画开始，1表示动画结束
     * @param callback 回调函数
     * @param eventId 事件ID，必须使用枚举
     * @param once 是否只触发一次，默认为true
     * @returns 事件ID
     */
    public addFrameEvent(progress: number, callback: () => void, eventId: FrameEventId, once: boolean = true): FrameEventId {
        // 限制进度范围
        progress = Math.max(0, Math.min(1, progress));
        
        // 检查ID是否已存在
        if (this.frameEvents.some(event => event.id === eventId)) {
            console.warn(`帧事件ID "${eventId}" 已存在，将覆盖原事件`);
            this.removeFrameEvent(eventId);
        }
        
        const frameEvent: FrameEvent = {
            progress,
            callback,
            once,
            triggered: false,
            id: eventId
        };
        
        this.frameEvents.push(frameEvent);
        
        // 按进度排序，便于调试和查看
        this.frameEvents.sort((a, b) => a.progress - b.progress);
        
        return eventId;
    }

    /**
     * 移除指定ID的帧事件
     * @param id 事件ID
     * @returns 是否成功移除
     */
    public removeFrameEvent(id: FrameEventId): boolean {
        const index = this.frameEvents.findIndex(event => event.id === id);
        if (index !== -1) {
            this.frameEvents.splice(index, 1);
            return true;
        }
        return false;
    }

    /**
     * 清空所有帧事件
     */
    public clearFrameEvents(): void {
        this.frameEvents.length = 0;
        this.lastAnimationProgress = 0;
    }

    /**
     * 获取所有帧事件信息（用于调试）
     * @returns 帧事件信息数组
     */
    public getFrameEventsInfo(): Array<{id: FrameEventId, progress: number, once: boolean, triggered: boolean}> {
        return this.frameEvents.map(event => ({
            id: event.id,
            progress: event.progress,
            once: event.once,
            triggered: event.triggered
        }));
    }

    /**
     * 重置所有帧事件的触发状态
     * 用于动画重新播放时重置事件状态
     */
    public resetFrameEventStates(): void {
        for (const frameEvent of this.frameEvents) {
            frameEvent.triggered = false;
        }
        this.lastAnimationProgress = 0;
    }

    /**
     * 快捷方法：添加攻击帧事件
     * @param progress 攻击触发进度，默认0.5（动画中点）
     * @param callback 攻击回调
     * @param eventId 事件ID，默认使用攻击伤害枚举
     * @returns 事件ID
     */
    public addAttackFrameEvent(progress: number = 0.5, callback: () => void, eventId: FrameEventId = FrameEventId.ATTACK_DAMAGE, once:boolean = false): FrameEventId {
        return this.addFrameEvent(progress, callback, eventId, once);
    }

    /**
     * 快捷方法：添加音效帧事件
     * @param progress 音效触发进度
     * @param callback 音效回调
     * @param eventId 事件ID，默认使用攻击音效枚举
     * @returns 事件ID
     */
    public addSoundFrameEvent(progress: number, callback: () => void, eventId: FrameEventId = FrameEventId.ATTACK_SOUND): FrameEventId {
        return this.addFrameEvent(progress, callback, eventId, true);
    }

    /**
     * 重置组件状态
     */
    public reset() {
        this.resetTimeScale();
        this.resetAllColorEffects();
        this.clearFrameEvents();
    }
} 