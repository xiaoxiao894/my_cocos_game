import { _decorator, Camera, Component, Label, Node, tween, UIOpacity, Vec3, UITransform, Color, ProgressBar, Button } from 'cc';
import { CommonEvent, ObjectType } from '../../common/CommonEnum';
import { DamageData } from '../../common/CommonInterface';
import { SuperPackage } from 'db://super-packager/Common/SuperPackage';
const { ccclass, property } = _decorator;

@ccclass('UI')
export class UI extends Component {
    @property({type: Camera, displayName: '主相机'})
    private mainCamera: Camera = null!;
    @property({type: Label, displayName: '玉米数量'})
    private cornLabel: Label = null!;
    @property({type: Label, displayName: '金币数量'})
    private goldLabel: Label = null!;
    @property({type: Label, displayName: '汤数量'})
    private soupLabel: Label = null!;
    @property({type: Node, displayName: '胜利面板'})
    private winPanel: Node = null!;
    @property({type: Node, displayName: '失败面板'})
    private losePanel: Node = null!;
    @property({type: Node, displayName: 'Home受伤闪红节点'})
    private heroHurtRed: Node = null!;
    @property({type: Button, displayName: '下载按钮'})
    private downloadBtn: Button = null!;

    private isJumped: boolean = false;

    private isShowResult: boolean = false;

    protected onLoad(): void {
        app.event.on(CommonEvent.UpdateHeroItemCount, this.onUpdateHeroItemCount, this);
        app.event.on(CommonEvent.ShowWinUI, this.onShowWinUI, this);
        app.event.on(CommonEvent.ShowFailUI, this.onShowFailUI, this);
        app.event.on(CommonEvent.HeroHurt, this.onHeroHurt, this);

        const opacity = this.heroHurtRed.getComponent(UIOpacity)!;
        tween(opacity)
            .to(0.3, { opacity: 255 })
            .to(0.3, { opacity: 0 })
            .union()
            .repeatForever()
            .start();

        this.isShowResult = false;
        this.isJumped = false;

        this.downloadBtn.node.on(Button.EventType.CLICK, this.onDownload, this);

        this.cornLabel.string = "0";
        this.goldLabel.string = "0";
        this.soupLabel.string = "0";
    }

    protected onDestroy(): void {
        app.event.offAllByTarget(this);
    }

    start() {
        
    }

    update(deltaTime: number) {
        
    }

    private onUpdateHeroItemCount(data: {type: ObjectType, count: number}): void {
        if(data.type === ObjectType.DropItemCoin){
            this.goldLabel.string = data.count.toString();
        }else if(data.type === ObjectType.DropItemCornKernel){
            this.cornLabel.string = data.count.toString();
        }else if(data.type === ObjectType.DropItemCornSoup){
            this.soupLabel.string = data.count.toString();
        }
    }

    /**
     * 更新家基地血条
     * @param healthPercentage 生命值百分比
     */
    private onHeroHurt(data: {damageData: DamageData}): void {
        // 取消之前的所有延迟调用
        this.unscheduleAllCallbacks();
        
        // 显示伤害效果
        this.heroHurtRed.active = true;
        
        // 使用新的延迟调用
        this.scheduleOnce(() => {
            this.heroHurtRed.active = false;
        }, 1);
    }

    private onShowWinUI(): void {
        // if(this.isShowResult) return;
        this.isShowResult = true
        this.winPanel.active = true;
        this.scheduleOnce(() => {
            SuperPackage.Instance.DownloadTCE();
        }, 1);
    }

    private onShowFailUI(): void {
        // if(this.isShowResult) return;
        this.isShowResult = true
        this.losePanel.active = true;
        this.scheduleOnce(() => {
            SuperPackage.Instance.DownloadTCE();
        }, 1);
    }

    private converToUIPos(pos: Vec3): Vec3 {
        const uiPos = this.mainCamera.convertToUINode(pos, this.node);
        return uiPos;
    }

    private onDownload(): void {
        SuperPackage.Instance.Download();
    }
}


