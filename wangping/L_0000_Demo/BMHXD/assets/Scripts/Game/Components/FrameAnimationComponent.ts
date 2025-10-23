import { _decorator, Animation, AnimationClip, AnimationState, Color, Component, math, Node, Sprite, SpriteFrame } from 'cc';
import { BaseAnimationComponent } from './BaseAnimationComponent';
import { ColorEffectType } from '../../common/CommonEnum';
import { ComponentEvent } from '../../common/ComponentEvents';

const { ccclass, property } = _decorator;

/**
 * 帧动画组件 - 使用序列帧实现动画效果
 */
@ccclass('FrameAnimationComponent')
export class FrameAnimationComponent extends BaseAnimationComponent {
    protected updateFaceDirection(directionX: number): void {
        throw new Error('Method not implemented.');
    }
    protected updateFaceDirectionFrom3D(direction: math.Vec3): void {
        throw new Error('Method not implemented.');
    }
    @property({type: Animation, displayName: '动画组件', tooltip: '角色的Animation组件'})
    protected animation: Animation = null!;

    @property({type: Node, displayName: '动画节点', tooltip: '显示动画的节点'})
    protected animationNode: Node = null!;

    /** 当前播放的动画名称 */
    private currentAnimName: string = '';
    
    /**
     * 初始化帧动画
     */
    protected initAnimation() {
        if (!this.animation) {
            this.animation = this.getComponent(Animation)!;
        }
        
        if (!this.animationNode) {
            this.animationNode = this.node;
        }
        
        if (this.animation) {
            this.animation.on(Animation.EventType.FINISHED, this.onAnimationComplete, this);
            // 确保动画组件已经加载了所有的动画剪辑
            if (!this.animation.clips.find(clip => clip && clip.name === this.idleAnimName)) {
                console.warn(`动画剪辑 ${this.idleAnimName} 未找到，请检查Animation组件配置`);
            }
        }
    }

    protected onSlowStart(slowRatio: number, slowDuration: number) {
        if (this.animation) {
            // 对于帧动画，减速通过降低动画速度实现
            const state = this.animation.getState(this.currentAnimName);
            if (state) {
                state.speed = slowRatio ? Math.max(0.8 - slowRatio, 0.1) : 1;
            }
        }
    }

    protected onSlowEnd() {
        this.resetTimeScale();
    }

    /**
     * 应用指定类型的颜色到精灵
     * @param type 颜色效果类型
     */
    protected applyColorToAnimation(type: ColorEffectType) {
        if (!this.animationNode) return;
        
        // 获取渲染组件 (Sprite)
        const renderComp = this.animationNode.getComponent(Sprite);
        if (!renderComp) return;
        
        switch (type) {
            case ColorEffectType.HURT:
                renderComp.color = this.hurtColor.clone();
                break;
            case ColorEffectType.SLOW:
                renderComp.color = this.slowColor.clone();
                break;
            default:
                renderComp.color = this.defaultColor.clone();
                break;
        }
    }

    /**
     * 动画完成回调
     */
    protected onAnimationComplete() {
        // 发送动画完成事件
        this.node.emit(ComponentEvent.ANIMATION_COMPLETE, this.currentAnimName);

        if(this.currentAnimName === this.attackAnimName || this.currentAnimName === this.runAttackAnimName){
            this.node.emit(ComponentEvent.ATTACK_ANI_COMPLETE, this.currentAnimName);
        }
    }

    /**
     * 播放空闲动画
     */
    public playIdle() {
        this.playAnimation(this.idleAnimName, true);
    }

    /**
     * 播放移动动画
     */
    public playMove() {
        this.playAnimation(this.moveAnimName, true);
    }

    /**
     * 播放攻击动画
     * @param timeScale 动画播放速度
     */
    public playAttack(timeScale: number = 1, isLoop: boolean = false) {
        this.playAnimation(this.attackAnimName, isLoop, timeScale);
    }

    /**
     * 播放死亡动画
     */
    public playDead() {
        this.playAnimation(this.deadAnimName, false);
    }

    /**
     * 播放移动攻击动画
     * @param timeScale 动画播放速度
     */
    public playRunAttack(timeScale: number = 1, isLoop: boolean = false) {
        this.playAnimation(this.runAttackAnimName, isLoop, timeScale);
    }

    /**
     * 播放指定动画
     * @param name 动画名称
     * @param loop 是否循环播放
     * @param timeScale 动画播放速度，默认为1
     */
    public playAnimation(name: string, loop: boolean, timeScale: number = 1, isShowLight: boolean = false) {
        if (!this.animation) return;
        
        // 检查动画是否存在
        if (!this.animation.clips.find(clip => clip && clip.name === name)) {
            console.warn(`动画 ${name} 未找到`);
            return;
        }

        // 如果正在播放相同的动画，不重复播放
        if (this.currentAnimName === name && this.animation.getState(name).isPlaying) {
            return;
        }
        this.node.emit(ComponentEvent.PLAY_ANIMATION_START, {
            name,
            loop,
            timeScale,
            crossFade: 0
        });

        // 保存当前播放的动画名称
        this.currentAnimName = name;
        
        // 设置循环模式并播放动画
        const state = this.animation.getState(name);
        if (state) {
            state.wrapMode = loop ? AnimationClip.WrapMode.Loop : AnimationClip.WrapMode.Normal;
            
            // 播放动画
            this.animation.play(name);
            
            // 设置时间缩放
            if (timeScale !== undefined) {
                this.setTimeScale(timeScale);
            } else {
                this.resetTimeScale();
            }
        }
    }

    /**
     * 设置动画播放速度
     * @param timeScale 时间缩放值，大于1加速，小于1减速
     */
    public setTimeScale(timeScale: number) {
        if (!this.animation) return;
        
        // 对于帧动画，修改当前动画状态的速度
        const state = this.animation.getState(this.currentAnimName);
        if (state) {
            state.speed = timeScale;
        }
    }

    /**
     * 重置时间缩放为默认值
     */
    public resetTimeScale() {
        if (!this.animation) return;
        
        const state = this.animation.getState(this.currentAnimName);
        if (state) {
            state.speed = this.defaultTimeScale;
        }
    }

    /**
     * 获取动画时长
     * @param animName 动画名称，不传则获取当前动画时长
     * @returns 动画时长(秒)
     */
    public getAnimationDuration(animName?: string): number {
        if (!this.animation) return 0;

        let duration = 0;
        const clipName = animName || this.currentAnimName;
        
        if (clipName) {
            const state = this.animation.getState(clipName);
            duration = state ? state.duration : 0;
        } else {
            const currentState = this.animation.getState(this.currentAnimName);
            duration = currentState ? currentState.duration : 0;
        }

        return duration;
    }

    /**
     * 获取当前动画节点
     */
    public getAnimationNode(): Node | null {
        return this.animationNode;
    }
    
    /**
     * 获取当前动画帧事件进度
     * @returns 当前动画进度(0-1)
     */
    public getCurrentAnimationProgress(): number {
        if (!this.animation) return 0;
        
        const state = this.animation.getState(this.currentAnimName);
        if (!state) return 0;
        
        return state.time / state.duration;
    }

    /**
     * 获取当前动画名称
     * @returns 当前动画名称
     */
    public getCurrentAnimationName(): string {
        return this.currentAnimName;
    }

    /**
     * 获取当前动画是否正在播放
     * @returns 是否正在播放
     */
    public isPlayingAnimation(): boolean {
        return this.animation.getState(this.currentAnimName)?.isPlaying || false;
    }
} 