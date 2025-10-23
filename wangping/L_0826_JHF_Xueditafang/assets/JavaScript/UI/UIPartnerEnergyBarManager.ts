import { _decorator, Animation, AnimationComponent, Color, Component, find, Graphics, Node, Vec3 } from 'cc';
import { PartnerManager } from '../Actor/PartnerManager';
const { ccclass, property } = _decorator;

@ccclass('UIPartnerEnergyBarManager')
export class UIPartnerEnergyBarManager extends Component {

    radius: number = 25;
    // 更新时间
    duration: number = 8.0;

    private progressBarGraphics: Graphics = null!;
    private elapsed = 0;

    start() {
        const camera = find("Main Camera");
        const cameraPos = camera.worldPosition;
        this.node.lookAt(cameraPos, Vec3.UP)

        const circleThree = this.node.getChildByName("Circle3");
        if (!circleThree) {
            console.warn("Circle3 节点未找到");
            return;
        }

        this.progressBarGraphics = circleThree.getComponent(Graphics) || circleThree.addComponent(Graphics);
        this.progressBarGraphics.fillColor = Color.fromHEX(new Color(), "#00FF00");
    }

    createGraphics(node: Node, fillColor: string, strokeColor: string, radius: number) {
        const graphics = node.getComponent(Graphics) || node.addComponent(Graphics);
        graphics.fillColor = Color.fromHEX(new Color(), fillColor);
        graphics.strokeColor = Color.fromHEX(new Color(), strokeColor);

        graphics.circle(0, 0, radius);
        graphics.fill();
        graphics.stroke();
    }

    private _hasInit = false;
    private _hasPlayedSkillFinish = false;

    update(deltaTime: number) {
        this.updateUiFollow();

        const parent = this.node.parent;
        const partnerParent = parent.getChildByName("PartnerParent");
        const partnerManager = parent.getComponent(PartnerManager);
        const anim = partnerParent?.getComponent(Animation);
        const skillState = anim?.getState("skillALL");

        // 技能动画播放中，等待
        if (skillState?.isPlaying) return;

        // 初次：满圈并释放
        if (!this._hasInit) {
            this._hasInit = true;
            this.drawFullCircle();
            this.playSkillAllAndRelease(partnerManager, anim);
            // this.elapsed = 0;
            return;
        }

        // 冷却累计
        this.elapsed += deltaTime;

        if (this.elapsed >= this.duration) {
            // —— 冷却满了 —— //
            this.elapsed -= this.duration;   // 回绕，开始新一轮
            this.clearCircle();              // 清空画布（直接清掉满圆）
            this.playSkillAllAndRelease(partnerManager, anim);
            return;
        }

        // —— 正常绘制进度 —— //
        const progress = this.elapsed / this.duration;
        this.drawProgress(progress);
    }

    // 清空，不画任何东西
    private clearCircle() {
        const g = this.progressBarGraphics;
        g.clear();
    }

    // 按进度画 0~1
    private drawProgress(progress: number) {
        const g = this.progressBarGraphics;
        g.clear();
        const startAngle = Math.PI / 2;
        const endAngle = startAngle + Math.PI * 2 * progress;
        g.moveTo(0, 0);
        g.arc(0, 0, this.radius, startAngle, endAngle, true);
        g.lineTo(0, 0);
        g.fill();
    }

    // 画满圆 
    private drawFullCircle() {
        this.drawProgress(1);
    }

    // private drawFullCircle() {
    //     this.progressBarGraphics.clear();
    //     this.progressBarGraphics.moveTo(0, 0);
    //     this.progressBarGraphics.arc(0, 0, this.radius, Math.PI / 2, Math.PI / 2 + Math.PI * 2, true);
    //     this.progressBarGraphics.lineTo(0, 0);
    //     this.progressBarGraphics.fill();
    // }

    private playSkillAllAndRelease(partnerManager: any, anim: Animation | null) {
        if (!partnerManager) return;

        // 已在播就不再触发，防止重复进入导致 idleB 反复
        if (partnerManager.isSkillAllPlaying) return;

        // 若没动画组件，直接执行技能释放并复位
        if (!anim) {
            partnerManager.releaseMajorSkills?.();
            partnerManager.isSkillAllPlaying = false;
            this.elapsed = 0;
            return;
        }

        partnerManager.isSkillAllPlaying = true;

        const toIdleOnce = (() => {
            let done = false;
            return () => {
                if (done) return;
                done = true;
                // 播放 idleB（会打断当前片段）
                anim.play('idleB');
                partnerManager.isSkillAllPlaying = false;
                // this.elapsed = 0;
            };
        })();

        const playDirectionOrIdle = () => {
            const direction: string = partnerManager.direction;
            const aniName = partnerManager.node?.name?.slice(0, -1) ?? '';
            const clipName = `${aniName}${direction}`;
            const parentAnim = partnerManager.getComponent(Animation);
            const dirState = parentAnim.getState(clipName);

            // 找不到方向动画就直接回 idle
            if (!dirState) {
                console.warn(`❌ 未找到方向动画 ${clipName}，回退到 idleB`);
                toIdleOnce();
                return;
            }

            // 播放方向动画
            dirState.stop();
            dirState.play(clipName);

            let dirFinished = false;

            // 超时兜底：防止方向动画被设为循环而不触发 FINISHED
            const guard2 = setTimeout(() => {
                if (dirFinished) return;
                dirFinished = true;
                toIdleOnce();
            }, 2500);

            // 方向动画完成后回 idle
            anim.once(Animation.EventType.FINISHED, () => {
                if (dirFinished) return;
                dirFinished = true;
                clearTimeout(guard2);
                toIdleOnce();
            });
        };

        // ===== 第一段：skillALL =====
        const skillState = anim.getState('skillALL');
        if (!skillState) {
            // 没有 skillALL：直接释放并回 idle
            partnerManager.releaseMajorSkills?.();
            toIdleOnce();
            return;
        }

        // 先停止再播放，避免叠加
        anim.stop();
        anim.play('skillALL');

        let skillFinished = false;

        // skillALL 的兜底（资源异常或被设循环时）
        const guard1 = setTimeout(() => {
            if (skillFinished) return;
            skillFinished = true;
            // 释放技能效果
            partnerManager.releaseMajorSkills?.();
            // 进入方向段/idle
            playDirectionOrIdle();
        }, 2500);

        // skillALL 完成：释放技能 -> 方向动画 -> idle
        anim.once(Animation.EventType.FINISHED, () => {
            if (skillFinished) return;
            skillFinished = true;
            clearTimeout(guard1);

            // 释放技能效果
            partnerManager.releaseMajorSkills?.();

            // 进入方向段/idle
            playDirectionOrIdle();
        });
    }

    updateUiFollow() {
        // 如果需要UI跟随，这里写逻辑
    }
}
