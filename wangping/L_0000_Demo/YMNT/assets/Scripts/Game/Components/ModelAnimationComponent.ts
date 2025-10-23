import { _decorator, SkeletalAnimation, AnimationState, Color, Component, Node, AnimationClip, MeshRenderer, game, Vec3, CCFloat } from 'cc';
import { BaseAnimationComponent } from './BaseAnimationComponent';
import { ComponentEvent } from '../../common/ComponentEvents';
import { ColorEffectType } from '../../common/CommonEnum';
import { Rotation3DUtils } from '../../common/Rotation3DUtils';
import { Dissolve } from 'db://assets/Res/Eff/diss/Dissolve';

const { ccclass, property } = _decorator;

/**
 * 当前播放动画数据
 */
export interface CurrentAnimationData {
    name: string;
    duration: number;
    frameRate: number;
    isLoop: boolean;
    currentTime: number;
    timeScale: number;
    isPlaying: boolean;
}

/**
 * 模型动画组件 - 3D模型动画实现
 */
@ccclass('ModelAnimationComponent')
export class ModelAnimationComponent extends BaseAnimationComponent {
    @property({type: SkeletalAnimation, displayName: '动画组件', tooltip: '角色的SkeletalAnimation动画组件'})
    protected animation: SkeletalAnimation = null!;
    
    @property({type: Node, displayName: '模型节点', tooltip: '需要控制颜色的模型节点'})
    protected modelNode: Node = null!;

    @property({
        type: CCFloat,
        displayName: '朝向平滑度',
        range: [0.1, 10.0],
        tooltip: '3D朝向旋转的平滑度，值越大旋转越快'
    })
    protected rotationSmoothness: number = 0.1;

    /** 受伤效果颜色 (红色) */
    protected readonly hurtColor: Color = new Color(255, 50, 50, 255);
    
    /** 当前播放的动画数据 */
    private currentAnimationData: CurrentAnimationData | null = null;
    
    /** 当前播放的动画状态 */
    private currentAnimationState: AnimationState | null = null;

    /**
     * 初始化动画组件
     */
    protected initAnimation() {
        if (!this.animation) {
            this.animation = this.getComponent(SkeletalAnimation)!;
        }
        
        if (!this.modelNode) {
            this.modelNode = this.node;
        }
        
        // 确保动画组件存在
        if (!this.animation) {
            console.error('SkeletalAnimation 组件未找到，请检查节点配置');
            return;
        }
        
        // 不再监听引擎动画事件，改为自己计算
        // this.animation.on(SkeletalAnimation.EventType.FINISHED, this.onAnimationFinished, this);
        // this.animation.on(SkeletalAnimation.EventType.PLAY, this.onAnimationPlay, this);
        // this.animation.on(SkeletalAnimation.EventType.PAUSE, this.onAnimationPause, this);
        // this.animation.on(SkeletalAnimation.EventType.STOP, this.onAnimationStop, this);
    }

    onDestroy() {
        super.onDestroy();
        // 移除事件监听器清理代码
        // if (this.animation) {
        //     this.animation.off(SkeletalAnimation.EventType.FINISHED, this.onAnimationFinished, this);
        //     this.animation.off(SkeletalAnimation.EventType.PLAY, this.onAnimationPlay, this);
        //     this.animation.off(SkeletalAnimation.EventType.PAUSE, this.onAnimationPause, this);
        //     this.animation.off(SkeletalAnimation.EventType.STOP, this.onAnimationStop, this);
        // }
    }

    /**
     * 更新函数
     */
    update(dt: number) {
        // 调用父类的update
        super.update(dt);
        
        // 更新动画时间
        this.updateAnimationTime(dt);
    }

    /**
     * 更新动画时间
     * @param dt 帧间隔时间
     */
    private updateAnimationTime(dt: number) {
        if (!this.currentAnimationData || !this.currentAnimationData.isPlaying) {
            return;
        }

        // 根据时间缩放更新当前时间
        this.currentAnimationData.currentTime += dt * this.currentAnimationData.timeScale;

        // 检查动画是否完成
        if (this.currentAnimationData.currentTime >= this.currentAnimationData.duration) {
            if (this.currentAnimationData.isLoop) {
                // 循环动画，重置时间
                this.currentAnimationData.currentTime = this.currentAnimationData.currentTime % this.currentAnimationData.duration;
            } else {
                // 非循环动画，标记为完成
                this.currentAnimationData.currentTime = this.currentAnimationData.duration;
                this.currentAnimationData.isPlaying = false;
                
                // 触发动画完成回调
                this.onAnimationComplete();
            }
        }
    }

    protected onSlowStart(slowRatio: number, slowDuration: number) {
        const timeScale = slowRatio ? Math.max(0.6 - slowRatio, 0.1) : 1;
        this.setTimeScale(timeScale);
    }

    protected onSlowEnd() {
        this.resetTimeScale();
    }

    public reset(): void {
        super.reset();
        this.modelNode.getComponent(Dissolve)?.reset();
    }

    /**
     * 应用指定类型的颜色到模型
     * @param type 颜色效果类型
     */
    protected applyColorToAnimation(type: ColorEffectType) {
        if (!this.modelNode) return;
        
        let targetColor: Color;
        switch (type) {
            case ColorEffectType.HURT:
                targetColor = this.hurtColor.clone();
                break;
            case ColorEffectType.SLOW:
                targetColor = this.slowColor.clone();
                break;
            default:
                targetColor = this.defaultColor.clone();
                break;
        }
        
        // 递归设置所有子节点的颜色
        this.setNodeColor(this.modelNode, targetColor);
    }

    /**
     * 递归设置节点及其子节点的颜色
     */
    private setNodeColor(node: Node, color: Color) {
        if(node.name.startsWith('e_')){
            return;
        }
        // 获取节点的渲染组件并设置颜色
        const meshRenderer = node.getComponent(MeshRenderer);
        if (meshRenderer) {
            // 通过材质设置颜色
            const material = meshRenderer.material;
            if (material) {
                material.setProperty('mainColor', color);
            }
        }
        
        // 递归处理子节点
        for (const child of node.children) { 
            this.setNodeColor(child, color);
        }
    }

    /**
     * 动画完成回调
     */
    protected onAnimationComplete() {
        const currentAnimName = this.currentAnimationData?.name || '';
        
        // 发送动画完成事件
        this.node.emit(ComponentEvent.ANIMATION_COMPLETE, currentAnimName);

        if(currentAnimName === this.attackAnimName || currentAnimName === this.runAttackAnimName){
            this.node.emit(ComponentEvent.ATTACK_ANI_COMPLETE, currentAnimName);
        }
    }

    /**
     * 更新角色朝向（从X方向值）
     */
    protected updateFaceDirection(directionX: number, rotationSmoothness: number = -1) {
        if (directionX === 0) return;
        
        // 使用3D旋转工具类来处理朝向，传入当前的帧时间
        const deltaTime = game.deltaTime;
        Rotation3DUtils.updateYRotationFromX(
            this.node, 
            directionX, 
            rotationSmoothness > 0 ? rotationSmoothness : this.rotationSmoothness,
            deltaTime
        );

        this.node.emit(ComponentEvent.FACE_DIRECTION_CHANGED, directionX);
    }

    /**
     * 根据3D方向向量更新朝向
     */
    public updateFaceDirectionFrom3D(direction: Vec3, rotationSmoothness: number = -1) {
        if (Vec3.equals(direction, Vec3.ZERO)) return;

        // 使用3D旋转工具类来处理朝向，传入当前的帧时间
        const deltaTime = game.deltaTime;
        const horizontalDirection = Rotation3DUtils.toHorizontalDirection(direction);
        Rotation3DUtils.faceDirection(
            this.node, 
            horizontalDirection, 
            rotationSmoothness > 0 ? rotationSmoothness : this.rotationSmoothness,
            deltaTime
        );

        // 发送朝向改变事件
        this.node.emit(ComponentEvent.FACE_DIRECTION_CHANGED, direction.x);
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
        this.playAnimation(this.moveAnimName, true, undefined, 0.1);
    }

    /**
     * 播放攻击动画
     * @param timeScale 动画播放速度
     * @param isLoop 是否循环
     */
    public playAttack(timeScale?: number, isLoop: boolean = false) {
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
     * @param isLoop 是否循环
     */
    public playRunAttack(timeScale?: number, isLoop: boolean = false) {
        this.playAnimation(this.runAttackAnimName, false, timeScale);
    }

    public playDissolve() {
        this.modelNode.getComponent(Dissolve)?.Dissolve();
    }

    /**
     * 播放指定动画
     * @param name 动画名称
     * @param loop 是否循环播放
     * @param timeScale 动画播放速度，默认为1
     */
    public playAnimation(name: string, loop: boolean, timeScale: number = 1, crossFade: number = 0.3) {
        if (!this.animation) {
            console.error('SkeletalAnimation 组件未找到');
            return;
        }
        
        // 检查动画剪辑是否存在
        const clips = this.animation.clips;
        const clip = clips.find(clip => clip && clip.name === name);
        if (!clip) {
            console.warn(`动画剪辑 ${name} 未找到`);
            return;
        }

        // 检查是否已经在播放相同动画
        if (this.currentAnimationData && 
            this.currentAnimationData.name === name && 
            this.currentAnimationData.isPlaying &&
            this.currentAnimationData.isLoop === loop) {
            return;
        }

        // 创建或获取动画状态
        let state = this.animation.getState(name);
        if (!state) {
            state = this.animation.createState(clip, name);
        }

        if (!state) {
            console.error(`无法创建动画状态: ${name}`);
            return;
        }

        // 设置循环模式
        state.wrapMode = loop ? AnimationClip.WrapMode.Loop : AnimationClip.WrapMode.Normal;
        
        // 设置播放速度
        state.speed = timeScale;
        
        // 播放动画
        if (crossFade > 0) {
            this.animation.crossFade(name, crossFade);
        } else {
            this.animation.play(name);
        }
        
        // 更新当前动画数据
        this.currentAnimationData = {
            name,
            duration: state.duration,
            frameRate: state.frameRate,
            isLoop: loop,
            currentTime: 0,
            timeScale: timeScale,
            isPlaying: true
        };
        
        // 保存当前动画状态引用
        this.currentAnimationState = state;

        // console.log(`开始播放动画: ${name}, 时长: ${state.duration}秒, 循环: ${loop}, 时间缩放: ${timeScale}`);
    }

    /**
     * 设置动画播放速度
     * @param timeScale 时间缩放值，大于1加速，小于1减速
     */
    public setTimeScale(timeScale: number) {
        if (!this.animation) return;
        
        // 如果有当前播放的动画状态，设置其速度
        if (this.currentAnimationState) {
            this.currentAnimationState.speed = timeScale;
        }
        
        // 更新当前动画数据的时间缩放
        if (this.currentAnimationData) {
            this.currentAnimationData.timeScale = timeScale;
        }
    }

    /**
     * 重置时间缩放为默认值
     */
    public resetTimeScale() {
        this.setTimeScale(this.defaultTimeScale);
    }

    /**
     * 获取动画时长
     * @param animName 动画名称，不传则获取当前动画时长
     * @returns 动画时长(秒)
     */
    public getAnimationDuration(animName?: string): number {
        if (!this.animation) return 0;

        const gameRate = Number(game.frameRate);
        if (animName) {
            const state = this.animation.getState(animName);
            const aniRate = state.frameRate;
            return (state ? state.duration : 0) * aniRate/gameRate;
        } else if (this.currentAnimationData) {
            const aniRate = this.currentAnimationData.frameRate;
            return this.currentAnimationData.duration * aniRate/gameRate;
        }
        
        return 0;
    }

    /**
     * 获取当前动画节点
     */
    public getAnimationNode(): Node | null {
        return this.modelNode;
    }
    
    /**
     * 获取当前动画帧事件进度
     * 用于在指定时间点触发攻击等效果
     * @returns 当前动画进度(0-1)
     */
    public getCurrentAnimationProgress(): number {
        if (!this.currentAnimationData || !this.currentAnimationData.isPlaying) {
            return 0;
        }
        
        if (this.currentAnimationData.duration <= 0) {
            return 0;
        }
        
        return Math.min(1, this.currentAnimationData.currentTime / this.currentAnimationData.duration);
    }

    /**
     * 获取当前动画名称
     * @returns 当前动画名称
     */
    public getCurrentAnimationName(): string {
        return this.currentAnimationData?.name || '';
    }

    /**
     * 停止当前动画
     */
    public stopAnimation() {
        if (this.animation) {
            this.animation.stop();
        }
        
        if (this.currentAnimationData) {
            this.currentAnimationData.isPlaying = false;
        }
        
        this.currentAnimationState = null;
    }

    /**
     * 暂停当前动画
     */
    public pauseAnimation() {
        if (this.animation) {
            this.animation.pause();
        }
        
        if (this.currentAnimationData) {
            this.currentAnimationData.isPlaying = false;
        }
    }

    /**
     * 恢复当前动画
     */
    public resumeAnimation() {
        if (this.animation && this.currentAnimationData) {
            this.animation.resume();
            this.currentAnimationData.isPlaying = true;
        }
    }

    /**
     * 判断当前是否有动画正在播放
     * @returns 是否正在播放动画
     */
    public isPlayingAnimation(): boolean {
        return this.currentAnimationData?.isPlaying || false;
    }

    /**
     * 获取所有动画名称
     * @returns 动画名称数组
     */
    public getAllAnimationNames(): string[] {
        if (!this.animation || !this.animation.clips) {
            return [];
        }
        
        return this.animation.clips
            .filter(clip => clip && clip.name)
            .map(clip => clip!.name);
    }

    /**
     * 获取动画组件
     */
    public getAnimationComponent(): SkeletalAnimation {
        return this.animation;
    }

    /**
     * 交叉淡入淡出播放动画
     * @param name 动画名称
     * @param fadeTime 淡入淡出时间
     * @param loop 是否循环播放
     * @param timeScale 动画播放速度
     */
    public crossFadeAnimation(name: string, fadeTime: number = 0.3, loop: boolean = false, timeScale: number = 1) {
        if (!this.animation) {
            console.error('SkeletalAnimation 组件未找到');
            return;
        }
        
        // 检查动画剪辑是否存在
        const clips = this.animation.clips;
        const clip = clips.find(clip => clip && clip.name === name);
        if (!clip) {
            console.warn(`动画剪辑 ${name} 未找到`);
            return;
        }

        // 创建或获取动画状态
        let state = this.animation.getState(name);
        if (!state) {
            state = this.animation.createState(clip, name);
        }

        if (!state) {
            console.error(`无法创建动画状态: ${name}`);
            return;
        }

        // 设置循环模式和播放速度
        state.wrapMode = loop ? AnimationClip.WrapMode.Loop : AnimationClip.WrapMode.Normal;
        state.speed = timeScale;

        // 使用交叉淡入淡出播放
        this.animation.crossFade(name, fadeTime);
        
        // 更新当前动画数据
        this.currentAnimationData = {
            name,
            duration: state.duration,
            frameRate: state.frameRate,
            isLoop: loop,
            currentTime: 0,
            timeScale: timeScale,
            isPlaying: true
        };
        
        // 保存当前动画状态引用
        this.currentAnimationState = state;

        // console.log(`交叉淡入淡出播放动画: ${name}, 淡入淡出时间: ${fadeTime}秒`);
    }

    /**
     * 检查动画剪辑是否存在
     * @param name 动画名称
     * @returns 是否存在
     */
    public hasAnimation(name: string): boolean {
        if (!this.animation || !this.animation.clips) {
            return false;
        }
        
        return this.animation.clips.some(clip => clip && clip.name === name);
    }

    /**
     * 获取动画状态
     * @param name 动画名称
     * @returns 动画状态
     */
    public getAnimationState(name: string): AnimationState | null {
        if (!this.animation) {
            return null;
        }
        
        return this.animation.getState(name) || null;
    }
}