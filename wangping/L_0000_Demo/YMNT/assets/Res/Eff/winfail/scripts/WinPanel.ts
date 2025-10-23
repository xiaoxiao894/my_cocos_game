import { _decorator, Button, Component, Node, tween, Vec3, UIOpacity } from 'cc';
import { CommonEvent } from 'db://assets/Scripts/common/CommonEnum';

const { ccclass, property } = _decorator;

@ccclass('WinPanel')
export class WinPanel extends Component {

    @property({type: Node, displayName: '黑色背景'})
    public blackBg: Node = null!;

    @property({type: Node, displayName: 'Icon'})
    public icon: Node = null!;

    @property({type: Node, displayName: '胜利标题'})
    public winTitle: Node = null!;

    @property({type: Node, displayName: '下载按钮'})
    public downloadBtn: Node = null!;

    protected onLoad(): void {
        this.downloadBtn.on(Button.EventType.CLICK, this.onDownload, this);
    }

    protected onDestroy(): void {
        this.downloadBtn.off(Button.EventType.CLICK, this.onDownload, this);
    }

    private onDownload(): void {
        console.log('下载');
        manager.game.onDownload();
    }

    protected onEnable(): void {
        this.showWinAni();
    }

    protected onDisable(): void {
        this.hideWinAni();
    }
    
    public showWinAni(): void {
        app.audio.playEffect('resources/audio/胜利')
        // 初始化所有元素状态
        const blackBgOpacity = this.blackBg.getComponent(UIOpacity) || this.blackBg.addComponent(UIOpacity);
        blackBgOpacity.opacity = 0;
        
        this.icon.scale = new Vec3(0.2, 0.2, 1);
        
        const winTitlePos = this.winTitle.position.clone();
        this.winTitle.position = new Vec3(winTitlePos.x, winTitlePos.y + 150, winTitlePos.z);
        const winTitleOpacity = this.winTitle.getComponent(UIOpacity) || this.winTitle.addComponent(UIOpacity);
        winTitleOpacity.opacity = 0;
        
        const downloadBtnPos = this.downloadBtn.position.clone();
        this.downloadBtn.position = new Vec3(downloadBtnPos.x, downloadBtnPos.y - 100, downloadBtnPos.z);
        const downloadBtnOpacity = this.downloadBtn.getComponent(UIOpacity) || this.downloadBtn.addComponent(UIOpacity);
        downloadBtnOpacity.opacity = 0;
        
        // 黑色背景淡入
        tween(blackBgOpacity)
            .to(0.3, { opacity: 180 })
            .start();
        
        // ICON缩放动画
        tween(this.icon)
            .to(0.5, { scale: new Vec3(2, 2, 2) }, { easing: 'backOut' })
            .start();
        
        // 胜利标题滑入并淡入
        tween(this.winTitle)
            .to(0.5, { position: winTitlePos }, { easing: 'backOut' })
            .start();
            
        tween(winTitleOpacity)
            .to(0.5, { opacity: 255 })
            .start();
        
        // 下载按钮滑入并淡入
        tween(this.downloadBtn)
            .delay(0.2)
            .to(0.5, { position: downloadBtnPos }, { easing: 'backOut' })
            .start();
            
        tween(downloadBtnOpacity)
            .delay(0.2)
            .to(0.5, { opacity: 255 })
            .start();
    }

    public hideWinAni(): void {
        // 停止所有可能正在播放的动画
        tween(this.blackBg).stop();
        tween(this.icon).stop();
        tween(this.winTitle).stop();
        tween(this.downloadBtn).stop();
        
        // 获取UIOpacity组件
        const blackBgOpacity = this.blackBg.getComponent(UIOpacity);
        const winTitleOpacity = this.winTitle.getComponent(UIOpacity);
        const downloadBtnOpacity = this.downloadBtn.getComponent(UIOpacity);
        
        if (blackBgOpacity) tween(blackBgOpacity).stop();
        if (winTitleOpacity) tween(winTitleOpacity).stop();
        if (downloadBtnOpacity) tween(downloadBtnOpacity).stop();
    }

}


