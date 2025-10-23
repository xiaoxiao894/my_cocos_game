// import { _decorator, CCString, color, Color, Component, instantiate, log, sp, tween, UIOpacity, v3, Vec3, Node } from 'cc';
// import { BaseAnimationComponent } from './BaseAnimationComponent';
// import { ComponentEvent } from '../../common/ComponentEvents';
// import { ColorEffectType } from '../../common/CommonEnum';

// const { ccclass, property } = _decorator;

// /**
//  * 颜色效果数据
//  */
// export interface ColorEffectData {
//     type: ColorEffectType;
//     duration: number;
//     timer: number;
//     active: boolean;
// }

// /**
//  * 动画信息数据
//  */
// export interface AnimationInfo {
//     name: string;
//     duration: number;
//     isLoop: boolean;
// }

// /**
//  * 当前播放动画数据
//  */
// export interface CurrentAnimationData {
//     name: string;
//     duration: number;
//     isLoop: boolean;
//     currentTime: number;
//     timeScale: number;
//     isPlaying: boolean;
// }

// /**
//  * 动画组件 - 骨骼动画实现
//  */
// @ccclass('AnimationComponent')
// export class AnimationComponent extends BaseAnimationComponent {
//     protected updateFaceDirection(directionX: number): void {
//         throw new Error('Method not implemented.');
//     }
//     protected updateFaceDirectionFrom3D(direction: Vec3): void {
//         throw new Error('Method not implemented.');
//     }
//     @property({type: sp.Skeleton, displayName: '骨骼动画', tooltip: '角色的Spine骨骼动画组件'})
//     protected skeleton: sp.Skeleton = null!;
//     @property({type: sp.Skeleton, displayName: '闪白动画', tooltip: '闪白动画的Spine骨骼动画组件'})
//     protected flashSkeleton: sp.Skeleton = null!;
    
//     /** 闪白效果淡出动画状态 */
//     private isPlayingFlashFadeOut: boolean = false;
    
//     /** 所有动画信息缓存 */
//     private animationInfoMap: Map<string, AnimationInfo> = new Map();
    
//     /** 当前播放的动画数据 */
//     private currentAnimationData: CurrentAnimationData | null = null;

//     /**
//      * 初始化骨骼动画
//      */
//     protected initAnimation() {
//         if (!this.skeleton) {
//             this.skeleton = this.getComponent(sp.Skeleton)!;
//         }
        
//         if (this.skeleton) {
//             // 不再使用skeleton的完成回调，改为自己计算
//             // this.skeleton.setCompleteListener(this.onAnimationComplete.bind(this));
            
//             // 设置为默认颜色
//             this.skeleton.color = this.defaultColor.clone();
//         }

//         // 初始化闪白动画
//         if (this.flashSkeleton) {
//             this.flashSkeleton.node.active = false;
//         }

//         // 延迟加载动画信息，确保骨骼数据已完全加载
//         this.scheduleOnce(() => {
//             this.loadAllAnimationInfo();
//             this.setupAnimationMix();
//         }, 0);
//     }

//     /**
//      * 设置动画混合
//      */
//     private setupAnimationMix() {
//         if (!this.skeleton) return;

//         // 混合动画
//         this.skeleton.setMix(this.idleAnimName, this.moveAnimName, 0.2);
//         this.skeleton.setMix(this.idleAnimName, this.attackAnimName, 0.2);

//         this.skeleton.setMix(this.moveAnimName, this.idleAnimName, 0.2);
//         this.skeleton.setMix(this.moveAnimName, this.runAttackAnimName, 0.2);

//         this.skeleton.setMix(this.attackAnimName, this.idleAnimName, 0.2);
//         this.skeleton.setMix(this.runAttackAnimName, this.moveAnimName, 0.2);
//         this.skeleton.setMix(this.runAttackAnimName, this.idleAnimName, 0.2);
//     }

//     /**
//      * 加载所有动画信息
//      */
//     private loadAllAnimationInfo() {
//         if (!this.skeleton || !this.skeleton.skeletonData) {
//             return;
//         }

//         // 清空之前的数据
//         this.animationInfoMap.clear();

//         // 通过findAnimation方法来获取动画信息，这是推荐的方式
//         // 我们先获取已知的动画名称，然后尝试获取它们的信息
//         const animationNames = [
//             this.idleAnimName,
//             this.moveAnimName,
//             this.attackAnimName,
//             this.deadAnimName,
//             this.runAttackAnimName
//         ];

//         // 遍历已知动画名称
//         for (const animName of animationNames) {
//             const anim = this.skeleton.findAnimation(animName);
//             if (anim) {
//                 const animInfo: AnimationInfo = {
//                     name: animName,
//                     duration: anim.duration,
//                     isLoop: false // 默认不循环，播放时设置
//                 };
//                 this.animationInfoMap.set(animName, animInfo);
//                 // console.log(`加载动画信息: ${animName}, 时长: ${anim.duration}秒`);
//             }
//         }

//         // 尝试通过其他方式获取所有动画名称
//         try {
//             const skeletonData = this.skeleton.skeletonData;
//             // 使用 getRuntimeData 方法获取运行时数据
//             if (skeletonData && (skeletonData as any).getRuntimeData) {
//                 const runtimeData = (skeletonData as any).getRuntimeData();
//                 if (runtimeData && runtimeData.animations) {
//                     for (let i = 0; i < runtimeData.animations.length; i++) {
//                         const anim = runtimeData.animations[i];
//                         if (anim && anim.name && !this.animationInfoMap.has(anim.name)) {
//                             const animInfo: AnimationInfo = {
//                                 name: anim.name,
//                                 duration: anim.duration,
//                                 isLoop: false
//                             };
//                             this.animationInfoMap.set(anim.name, animInfo);
//                             // console.log(`加载额外动画信息: ${anim.name}, 时长: ${anim.duration}秒`);
//                         }
//                     }
//                 }
//             }
//         } catch (error) {
//             console.warn('无法获取额外动画信息:', error);
//         }

//         // console.log(`总共加载了 ${this.animationInfoMap.size} 个动画`);
//     }

//     /**
//      * 获取动画信息
//      * @param animName 动画名称
//      */
//     private getAnimationInfo(animName: string): AnimationInfo | null {
//         return this.animationInfoMap.get(animName) || null;
//     }

//     /**
//      * 更新函数，用于追踪动画时间
//      */
//     update(dt: number) {
//         // 调用父类的update
//         super.update(dt);
        
//         // 更新动画时间
//         this.updateAnimationTime(dt);
//     }

//     /**
//      * 更新动画时间
//      * @param dt 帧间隔时间
//      */
//     private updateAnimationTime(dt: number) {
//         if (!this.currentAnimationData || !this.currentAnimationData.isPlaying) {
//             return;
//         }

//         // 根据时间缩放更新当前时间
//         this.currentAnimationData.currentTime += dt * this.currentAnimationData.timeScale;

//         // 检查动画是否完成
//         if (this.currentAnimationData.currentTime >= this.currentAnimationData.duration) {
//             if (this.currentAnimationData.isLoop) {
//                 // 循环动画，重置时间
//                 this.currentAnimationData.currentTime = this.currentAnimationData.currentTime % this.currentAnimationData.duration;
//             } else {
//                 // 非循环动画，标记为完成
//                 this.currentAnimationData.currentTime = this.currentAnimationData.duration;
//                 this.currentAnimationData.isPlaying = false;
                
//                 // 触发动画完成回调
//                 this.onAnimationComplete();
//             }
//         }
//     }

//     protected onSlowStart(slowRatio: number, slowDuration: number) {
//         this.skeleton.timeScale = slowRatio ? Math.max(0.6 - slowRatio, 0.1) : 1;
        
//         // 更新当前动画的时间缩放
//         if (this.currentAnimationData) {
//             this.currentAnimationData.timeScale = this.skeleton.timeScale;
//         }
//     }

//     protected onSlowEnd() {
//         this.resetTimeScale();
//     }

//     /**
//      * 应用指定类型的颜色到骨骼
//      * @param type 颜色效果类型
//      */
//     protected applyColorToAnimation(type: ColorEffectType) {
//         if (!this.skeleton) return;
        
//         switch (type) {
//             case ColorEffectType.HURT:
//                 this.skeleton.color = this.hurtColor.clone();
//                 break;
//             case ColorEffectType.SLOW:
//                 this.skeleton.color = this.slowColor.clone();
//                 break;
//             default:
//                 this.skeleton.color = this.defaultColor.clone();
//                 break;
//         }
//     }

//     /**
//      * 动画完成回调
//      */
//     protected onAnimationComplete() {
//         // 如果闪白效果开启，在动画完成时关闭
//         if (this.flashSkeleton && this.flashSkeleton.node.active) {
//             if (!this.isPlayingFlashFadeOut) {
//                 this.resetFlashEffect();
//             }
//         }

//         // 发送动画完成事件
//         this.node.emit(ComponentEvent.ANIMATION_COMPLETE, this.currentAnimationData?.name || '');

//         if(this.currentAnimationData?.name === this.attackAnimName || this.currentAnimationData?.name === this.runAttackAnimName){
//             this.node.emit(ComponentEvent.ATTACK_ANI_COMPLETE, this.currentAnimationData?.name || '');
//         }
//     }

//     /**
//      * 播放空闲动画
//      */
//     public playIdle() {
//         this.playAnimation(this.idleAnimName, true);
//     }

//     /**
//      * 播放移动动画
//      */
//     public playMove() {
//         this.playAnimation(this.moveAnimName, true);
//     }

//     /**
//      * 播放攻击动画
//      * @param timeScale 动画播放速度
//      */
//     public playAttack(timeScale?: number, isLoop: boolean = false) {
//         this.playAnimation(this.attackAnimName, isLoop, timeScale);
//     }

//     /**
//      * 播放死亡动画
//      */
//     public playDead() {
//         this.playAnimation(this.deadAnimName, false);
//     }

//     /**
//      * 播放移动攻击动画
//      * @param timeScale 动画播放速度
//      */
//     public playRunAttack(timeScale?: number, isLoop: boolean = false) {
//         this.playAnimation(this.runAttackAnimName, false, timeScale);
//     }

//     /**
//      * 播放指定动画
//      * @param name 动画名称
//      * @param loop 是否循环播放
//      * @param timeScale 动画播放速度，默认为1
//      */
//     public playAnimation(name: string, loop: boolean, timeScale: number = 1, isShowLight: boolean = false) {
//         if (!this.skeleton) return;
        
//         const anim = this.skeleton.findAnimation(name);
//         if (!anim) {
//             console.warn(`动画 ${name} 未找到`);
//             return;
//         }

//         // 检查是否已经在播放相同动画
//         if (this.currentAnimationData && this.currentAnimationData.name === name && this.currentAnimationData.isPlaying) {
//             return;
//         }

//         this.skeleton.setAnimation(0, name, loop);
        
//         // 设置时间缩放
//         if (timeScale !== undefined) {
//             this.setTimeScale(timeScale);
//         } else {
//             this.resetTimeScale();
//         }

//         // 获取动画信息
//         const animInfo = this.getAnimationInfo(name);
//         const duration = animInfo ? animInfo.duration : anim.duration;

//         // 更新当前动画数据
//         this.currentAnimationData = {
//             name,
//             duration,
//             isLoop: loop,
//             currentTime: 0,
//             timeScale: timeScale,
//             isPlaying: true
//         };

//         if (isShowLight && this.flashSkeleton) {
//             const flashMaterial = this.flashSkeleton.customMaterial;
//             if (flashMaterial) {
//                 flashMaterial.setProperty('whiteAmount', 0.8);
//                 this.flashSkeleton.setAnimation(0, name, loop);
//                 this.flashSkeleton.node.active = true;
//                 this.flashSkeleton.timeScale = timeScale;

//                 this.flashSkeleton.node.setScale(this.skeleton.node.scale);
//                 const targetScale = this.skeleton.node.getScale().multiplyScalar(2.5);
//                 tween(this.flashSkeleton.node)
//                     .to(0.4, {scale: targetScale})
//                     .start();

//                 const opacity = this.flashSkeleton.getComponent(UIOpacity);
//                 if (opacity) {
//                     opacity.opacity = 0;
//                     tween(opacity)
//                         .to(0.4, {opacity: 255})
//                         .start();
//                 } else {
//                     console.warn('闪白动画UIOpacity组件未找到，请检查flashSkeleton的节点配置');
//                 }
//             } else {
//                 console.warn('闪白动画材质未设置，请检查flashSkeleton的材质配置');
//             }
//         }

//         // console.log(`开始播放动画: ${name}, 时长: ${duration}秒, 循环: ${loop}, 时间缩放: ${timeScale}`);
//     }

//     /**
//      * 设置动画播放速度
//      * @param timeScale 时间缩放值，大于1加速，小于1减速
//      */
//     public setTimeScale(timeScale: number) {
//         if (!this.skeleton) return;
//         this.skeleton.timeScale = timeScale;
        
//         // 更新当前动画数据的时间缩放
//         if (this.currentAnimationData) {
//             this.currentAnimationData.timeScale = timeScale;
//         }
//     }

//     /**
//      * 重置时间缩放为默认值
//      */
//     public resetTimeScale() {
//         if (!this.skeleton) return;
//         this.skeleton.timeScale = this.defaultTimeScale;
        
//         // 更新当前动画数据的时间缩放
//         if (this.currentAnimationData) {
//             this.currentAnimationData.timeScale = this.defaultTimeScale;
//         }
//     }

//     /**
//      * 获取动画时长
//      * @param animName 动画名称，不传则获取当前动画时长
//      * @returns 动画时长(秒)
//      */
//     public getAnimationDuration(animName?: string): number {
//         let duration = 0;
        
//         if (animName) {
//             // 优先从缓存的动画信息中获取
//             const animInfo = this.getAnimationInfo(animName);
//             if (animInfo) {
//                 duration = animInfo.duration;
//             } else if (this.skeleton) {
//                 // 回退到通过skeleton获取
//                 const anim = this.skeleton.findAnimation(animName);
//                 duration = anim ? anim.duration : 0;
//             }
//         } else {
//             // 获取当前动画时长
//             if (this.currentAnimationData) {
//                 duration = this.currentAnimationData.duration;
//             } else if (this.skeleton) {
//                 // 回退到通过skeleton获取
//                 const currentTrack = this.skeleton.getCurrent(0);
//                 duration = currentTrack ? currentTrack.animationEnd : 0;
//             }
//         }

//         return duration;
//     }

//     /**
//      * 获取当前骨骼动画
//      */
//     public getSkeletonComponent(): sp.Skeleton {
//         return this.skeleton;
//     }

//     /**
//      * 获取当前骨骼动画节点
//      */
//     public getSkeletonNode() {
//         return this.skeleton ? this.skeleton.node : null;
//     }

//     /**
//      * 获取当前动画节点
//      */
//     public getAnimationNode(): Node | null {
//         return this.getSkeletonNode();
//     }
    
//     /**
//      * 获取当前动画帧事件进度
//      * 用于在指定时间点触发攻击等效果
//      * @returns 当前动画进度(0-1)
//      */
//     public getCurrentAnimationProgress(): number {
//         if (!this.currentAnimationData || !this.currentAnimationData.isPlaying) {
//             return 0;
//         }
        
//         if (this.currentAnimationData.duration <= 0) {
//             return 0;
//         }
        
//         return Math.min(1, this.currentAnimationData.currentTime / this.currentAnimationData.duration);
//     }

//     /**
//      * 获取当前动画名称
//      * @returns 当前动画名称
//      */
//     public getCurrentAnimationName(): string {
//         return this.currentAnimationData?.name || '';
//     }

//     /**
//      * 停止当前动画
//      */
//     public stopAnimation() {
//         if (this.currentAnimationData) {
//             this.currentAnimationData.isPlaying = false;
//         }
//     }

//     /**
//      * 恢复当前动画
//      */
//     public resumeAnimation() {
//         if (this.currentAnimationData) {
//             this.currentAnimationData.isPlaying = true;
//         }
//     }

//     /**
//      * 判断当前是否有动画正在播放
//      * @returns 是否正在播放动画
//      */
//     public isPlayingAnimation(): boolean {
//         return this.currentAnimationData?.isPlaying || false;
//     }

//     /**
//      * 获取所有已加载的动画名称
//      * @returns 动画名称数组
//      */
//     public getAllAnimationNames(): string[] {
//         return Array.from(this.animationInfoMap.keys());
//     }

//     /**
//      * 重新加载动画信息（用于骨骼数据更新后）
//      */
//     public reloadAnimationInfo() {
//         this.loadAllAnimationInfo();
//     }

//     /**
//      * 获取动画信息缓存
//      * @returns 动画信息Map
//      */
//     public getAnimationInfoMap(): Map<string, AnimationInfo> {
//         return this.animationInfoMap;
//     }

//     /**
//      * 重置闪白效果
//      */
//     private resetFlashEffect() {
//         if (this.flashSkeleton) {
//             // 设置淡出动画状态为true
//             this.isPlayingFlashFadeOut = true;
            
//             // 获取当前缩放值
//             const currentScale = this.flashSkeleton.node.getScale();
//             // 缩小动画
//             tween(this.flashSkeleton.node)
//                 .to(0.15, { scale: currentScale.multiplyScalar(0.5) })
//                 .call(() => {
//                     // 动画结束后关闭节点
//                     this.flashSkeleton.node.active = false;
//                     // 重置缩放，为下次显示做准备
//                     this.flashSkeleton.node.setScale(this.skeleton.node.getScale().multiplyScalar(2));
//                     // 重置淡出动画状态
//                     this.isPlayingFlashFadeOut = false;
//                 })
//                 .start();

//             // 如果有透明度组件，添加淡出效果
//             const opacity = this.flashSkeleton.getComponent(UIOpacity);
//             if (opacity) {
//                 tween(opacity)
//                     .to(0.15, { opacity: 0 })
//                     .start();
//             }
//         }
//     }
// } 