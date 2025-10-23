import { _decorator, Component, Node, tween, Vec3, UIOpacity, Button } from 'cc';
import { CommonEvent } from 'db://assets/Scripts/common/CommonEnum';
import super_html_playable from 'db://playable_packager/super_html_playable';
const { ccclass, property } = _decorator;

@ccclass('LosePanel')
export class LosePanel extends Component {
    @property({type: Node, displayName: '黑色背景'})
    public blackBg: Node = null!;

    @property({type: Node, displayName: 'Icon'})
    public icon: Node = null!;

    @property({type: Node, displayName: '失败标题'})
    public loseTitle: Node = null!;

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
        this.showLoseAni();
    }

    protected onDisable(): void {
        this.hideLoseAni();
    }

    /**
     * 显示失败动画
     */
    public showLoseAni(): void {
        app.audio.playEffect('resources/audio/失败')
        // 初始化所有元素状态
        const blackBgOpacity = this.blackBg.getComponent(UIOpacity) || this.blackBg.addComponent(UIOpacity);
        blackBgOpacity.opacity = 0;
        
        this.icon.scale = new Vec3(0.2, 0.2, 1);
        
        const loseTitlePos = this.loseTitle.position.clone();
        this.loseTitle.position = new Vec3(loseTitlePos.x, loseTitlePos.y + 150, loseTitlePos.z);
        const loseTitleOpacity = this.loseTitle.getComponent(UIOpacity) || this.loseTitle.addComponent(UIOpacity);
        loseTitleOpacity.opacity = 0;
        
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
            .to(0.5, { scale: new Vec3(1, 1, 1) }, { easing: 'backOut' })
            .start();
        
        // 失败标题滑入并淡入
        tween(this.loseTitle)
            .to(0.5, { position: loseTitlePos }, { easing: 'backOut' })
            .start();
            
        tween(loseTitleOpacity)
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

    /**
     * 隐藏失败动画
     */
    public hideLoseAni(): void {
        // 停止所有可能正在播放的动画
        tween(this.blackBg).stop();
        tween(this.icon).stop();
        tween(this.loseTitle).stop();
        tween(this.downloadBtn).stop();
        
        // 获取UIOpacity组件
        const blackBgOpacity = this.blackBg.getComponent(UIOpacity);
        const loseTitleOpacity = this.loseTitle.getComponent(UIOpacity);
        const downloadBtnOpacity = this.downloadBtn.getComponent(UIOpacity);
        
        if (blackBgOpacity) tween(blackBgOpacity).stop();
        if (loseTitleOpacity) tween(loseTitleOpacity).stop();
        if (downloadBtnOpacity) tween(downloadBtnOpacity).stop();
    }
}


