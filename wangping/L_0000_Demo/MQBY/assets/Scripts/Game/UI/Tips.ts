import { _decorator, Component, Label, Node, Tween, tween, UIOpacity } from 'cc';
import { CommonEvent } from '../../common/CommonEnum';
const { ccclass, property } = _decorator;

@ccclass('Tips')
export class Tips extends Component {

    @property({type: Label, displayName: '提示字体'})
    public tipsLabel: Label = null!;

    @property({type: UIOpacity, displayName: '提示节点透明度'})
    public tipsOpacity: UIOpacity = null!;

    private datas: {tips: string, id: string, duration: number}[] = [];
    private currentTip: {tips: string, id: string, duration: number} | null = null;
    private hideTimer: any = null;
    private isShowing: boolean = false;

    protected onLoad(): void {
        app.event.on(CommonEvent.ShowTips, this.onShowTips, this);
        app.event.on(CommonEvent.HideTips, this.onHideTips, this);

        this.node.active = false;
        this.tipsOpacity.opacity = 0;
    }

    protected onDestroy(): void {
        app.event.offAllByTarget(this);
        this.clearTimer();
    }

    start() {

    }

    update(deltaTime: number) {
        
    }

    private onShowTips(data: {tips: string, id: string, duration: number}): void {
        // 如果当前正在显示提示，优先显示新的
        if (this.isShowing && this.currentTip) {
            this.forceHide();
        }

        this.currentTip = data;
        this.isShowing = true;
        
        // 设置提示文本
        this.tipsLabel.string = data.tips;
        this.node.active = true;
        
        // 显示动画
        this.showAnim();
        
        // 设置定时器（如果duration不是-1）
        if (data.duration !== -1) {
            this.startHideTimer(data.duration);
        }
    }

    private onHideTips(data: {id: string}): void {
        if (this.datas.length > 0) {
            this.currentTip = this.datas[0];
            this.showAnim();
            if (this.currentTip.duration !== -1) {
                this.startHideTimer(this.currentTip.duration);
            }
        }else{
            this.hideTips();
        }
    }

    private hideTips(): void {
        if (!this.isShowing) return;
        
        this.clearTimer();
        this.isShowing = false;
        this.hideAnim();
        this.currentTip = null;
    }

    private forceHide(): void {
        this.clearTimer();
        this.isShowing = false;
        this.node.active = false;
        this.tipsOpacity.opacity = 0;
        this.currentTip = null;
    }

    private startHideTimer(duration: number): void {
        this.clearTimer();
        this.hideTimer = setTimeout(() => {
            this.hideTips();
        }, duration * 1000);
    }

    private clearTimer(): void {
        if (this.hideTimer) {
            clearTimeout(this.hideTimer);
            this.hideTimer = null;
        }
    }

    private showAnim(): void {
        Tween.stopAllByTarget(this.tipsOpacity);
        tween(this.tipsOpacity)
            .to(0.5, {opacity: 255})
            .start();
    }

    private hideAnim(): void {
        Tween.stopAllByTarget(this.tipsOpacity);
        tween(this.tipsOpacity)
            .to(0.5, {opacity: 0})
            .call(() => {
                this.node.active = false;
            })
            .start();
    }
}


