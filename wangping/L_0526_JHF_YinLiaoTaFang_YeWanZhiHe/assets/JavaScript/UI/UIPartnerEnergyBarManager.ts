import { _decorator, Animation, Color, Component, find, Graphics, Node, Vec3 } from 'cc';
import { PartnerManager } from '../Actor/PartnerManager';
const { ccclass, property } = _decorator;

@ccclass('UIPartnerEnergyBarManager')
export class UIPartnerEnergyBarManager extends Component {

    radius: number = 25;
    // 更新时间
    duration: number = 12.0;

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

        const partnerParent = this.node.parent.getChildByName("PartnerParent");
        const partnerManager = this.node.parent.getComponent(PartnerManager);
        const anim = partnerParent?.getComponent(Animation);
        const skillState = anim?.getState("skillALL");

        // skillALL 正在播放中，等待完成
        if (skillState?.isPlaying) return;

        // 初次满圈立即释放技能
        if (!this._hasInit) {
            this._hasInit = true;
            this.drawFullCircle();
            this.playSkillAllAndRelease(partnerManager, anim);
            return;
        }

        this.elapsed += deltaTime;
        let progress = this.elapsed / this.duration;

        if (progress >= 1) {
            progress = 1;
            this.drawFullCircle();
            this.playSkillAllAndRelease(partnerManager, anim);
            return;
        }

        // 绘制冷却进度
        const startAngle = Math.PI / 2;
        const endAngle = startAngle + Math.PI * 2 * progress;
        this.progressBarGraphics.clear();
        this.progressBarGraphics.moveTo(0, 0);
        this.progressBarGraphics.arc(0, 0, this.radius, startAngle, endAngle, true);
        this.progressBarGraphics.lineTo(0, 0);
        this.progressBarGraphics.fill();
    }

    private drawFullCircle() {
        this.progressBarGraphics.clear();
        this.progressBarGraphics.moveTo(0, 0);
        this.progressBarGraphics.arc(0, 0, this.radius, Math.PI / 2, Math.PI / 2 + Math.PI * 2, true);
        this.progressBarGraphics.lineTo(0, 0);
        this.progressBarGraphics.fill();
    }

    private playSkillAllAndRelease(partnerManager: any, anim: Animation | null) {
        if (!partnerManager) return;

        partnerManager.isSkillAllPlaying = true;

        const skillState = anim?.getState("skillALL");
        if (anim && skillState) {
            // 防止重复绑定和重复播放
            anim.off(Animation.EventType.FINISHED);
            anim.stop();
            anim.play("skillALL");

            this._hasPlayedSkillFinish = false;

            anim.once(Animation.EventType.FINISHED, () => {
                if (this._hasPlayedSkillFinish) return;
                this._hasPlayedSkillFinish = true;

                partnerManager.releaseMajorSkills();

                // 获取方向动画
                const direction = partnerManager.direction;
                const aniName = partnerManager.node.name.slice(0, -1);
                const clipName = `${aniName}${direction}`; 

                const anim = partnerManager.getComponent(Animation);
                const dirState = anim?.getState(clipName);

                if (dirState) {
                    dirState.stop();
                    anim.play(clipName);

                    // 第二段动画播放完成后恢复 idle
                    anim.once(Animation.EventType.FINISHED, () => {
                        anim.play("idleB");
                        partnerManager.isSkillAllPlaying = false;
                        this.elapsed = 0;
                    });
                } else {
                    console.warn(`❌ 未找到方向动画 ${clipName}`);
                    anim.play("idleB");
                    partnerManager.isSkillAllPlaying = false;
                    this.elapsed = 0;
                }
            });
        } else {
            // 没有动画直接执行技能释放
            partnerManager.releaseMajorSkills();
            partnerManager.isSkillAllPlaying = false;
            this.elapsed = 0;
        }
    }


    updateUiFollow() {
        // 如果需要UI跟随，这里写逻辑
    }
}
