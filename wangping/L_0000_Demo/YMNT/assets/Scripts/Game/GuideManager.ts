import { _decorator, Component, Node, Sprite, UITransform, v3, Vec2, Vec3 } from 'cc';
import { BuildingType, CommonEvent, ObjectType } from '../common/CommonEnum';
const { ccclass, property } = _decorator;

enum GuideStep {
    AttCron, // 攻击Cron
    GoToChuShi, // 去厨房投放
    GoToChuShiOut, // 去厨房拾取
    GoToTouFang, // 去商店投放
    GoToSalesclerk, // 去售货员
    WaitFight, // 等待战斗
    GoFight, // 去战斗
    BackHome, // 回家
    CollectCoin, // 收集金币
    UnlockTransporter, // 解锁搬运工
    WaitCoin1, // 等待金币100
    UnlockSell, // 解锁售货员
    WaitCoin2, // 等待金币100
    UnlockGun, // 解锁枪
    GoWin, // 去胜利
    Finished, // 引导结束
}

@ccclass('GuideManager')
export class GuideManager extends Component {
    /** 单例实例 */
    private static _instance: GuideManager | null = null;
    /** 获取单例实例 */
    public static get instance(): GuideManager {
        return this._instance as GuideManager;
    }

    @property({type: Node, displayName: '箭头'})
    public arrow: Node = null!;

    @property({type: Sprite, displayName: '箭头Sprite'})
    public arrowSprite: Sprite = null!;

    @property({type: Node, displayName: '家节点'})
    public homeNode: Node = null!;

    @property({type: Node, displayName: '金币节点'})
    public coinNode: Node = null!;

    @property({type: Node, displayName: '外部节点'})
    public externalNode: Node = null!;

    private _isShowArrow: boolean = false;

    private _startNode: Node = null!;
    private _endNode: Node = null!;

    private _currentStep: GuideStep = GuideStep.AttCron;
    
    /** 初始化单例，提供更安全的初始化方式 */
    public static initInstance(instance: GuideManager): void {
        if (this._instance) {
            instance.node.destroy();
            return;
        }
        this._instance = instance;
    }

    protected onLoad(): void {
        // 使用改进的单例初始化方法
        GuideManager.initInstance(this);
        if (GuideManager._instance !== this) return;

        this.hideArrow();

        app.event.on(CommonEvent.UpdateHeroItemCount, this.onUpdateHeroItemCount, this);
        app.event.on(CommonEvent.HeroHurt, this.onHeroHurt, this);
        app.event.on(CommonEvent.UnlockItem, this.onUnlockItem, this);
        app.event.on(CommonEvent.HeroAtHome, this.onHeroAtHome, this);
        app.event.on(CommonEvent.PickupCoin, this.onPickupCoin, this);
        app.event.on(CommonEvent.SolderHurt, this.onSolderHurt, this);
        app.event.on(CommonEvent.SellSuccess, this.onSellSuccess, this);

        this.scheduleOnce(() => {
            this.startGuide();
        }, 1);
    }

    protected onDestroy(): void {
        if (GuideManager._instance === this) {
            GuideManager._instance = null;
        }

        app.event.offAllByTarget(this);
    }

    update(dt: number): void {
        if (!this._isShowArrow) return;
        const startWPosY = manager.game.calculateGroundHeight(this._startNode.getWorldPosition());
        const startWPos = this._startNode.getWorldPosition();
        startWPos.y = startWPosY + 0.1;
        const endWPosY = manager.game.calculateGroundHeight(this._endNode.getWorldPosition());
        const endWPos = this._endNode.getWorldPosition();
        endWPos.y = endWPosY + 0.1;

        this.updateArrow(startWPos, endWPos);
    }

    private updateArrow(startWPos: Vec3, endWPos: Vec3): void {
        if (!this._isShowArrow) return;
        this.arrow.setWorldPosition(endWPos);

        this.arrow.lookAt(startWPos);

        const distance = Vec3.distance(startWPos, endWPos);
        const scale = this.arrowSprite.node.scale.y;
        this.arrowSprite.node.getComponent(UITransform)!.height = distance / scale;
    }

    private showArrow(startNode: Node, endNode: Node): void {
        if(!startNode || !endNode) {
            console.error('startNode or endNode is null');
            return;
        }
        this._isShowArrow = true;
        this._startNode = startNode;
        this._endNode = endNode;

        this.arrow.active = true;
    }

    private hideArrow(): void {
        this._isShowArrow = false;
        this.arrow.active = false;
    }

    private startGuide(): void {
        this._currentStep = GuideStep.AttCron;
        this.updateGuide();
    }

    private setStep(step: GuideStep): void {
        this._currentStep = step;
        this.updateGuide();
    }

    private hideOtherTips(excludeId?: string): void {
        const ids = [
            "guide_attCron",
            "guide_goToChuShi",
            "guide_goToTouFang",
            "guide_goFight",
            "guide_unlockTransporter",
            "guide_unlockSell",
            "guide_unlockGun",
        ]

        for(const id of ids){
            if(excludeId && id === excludeId){
                continue;
            }
            app.event.emit(CommonEvent.HideTips, {id: id});
        }
    }

    private showTips(id: string): void {
        this.hideOtherTips(id);
        app.event.emit(CommonEvent.ShowTips, {tips: app.lang.getLanguage(id), id: id, duration: -1});
    }

    private updateGuide(): void {
        switch (this._currentStep) {
            case GuideStep.AttCron:
                this.showArrow(manager.game.hero.node, manager.game.bigCorn.node);
                this.showTips("guide_attCron");
                break;
            case GuideStep.GoToChuShi:
                this.showArrow(manager.game.hero.node, manager.game.chuShi.putInCollider.node);
                this.showTips("guide_goToChuShi");
                break;
            case GuideStep.GoToChuShiOut:
                this.showArrow(manager.game.hero.node, manager.game.chuShi.putOutCollider.node);
                break;
            case GuideStep.GoToTouFang:
                this.showArrow(manager.game.hero.node, manager.game.soupShop.pickupNode);
                this.showTips("guide_goToTouFang");
                break;
            case GuideStep.GoToSalesclerk:
                this.showArrow(manager.game.hero.node, manager.game.soupShop.salesclerkNode);
                break;
            case GuideStep.WaitFight:
                this.hideArrow();
                break;
            case GuideStep.GoFight:
                this.showArrow(manager.game.hero.node, manager.enemy.boss.node);
                this.showTips("guide_goFight");
                break;
            case GuideStep.BackHome:
                this.showArrow(manager.game.hero.node, this.homeNode);
                break;
            case GuideStep.CollectCoin:
                this.showArrow(manager.game.hero.node, this.coinNode);
                break;
            case GuideStep.UnlockTransporter:
                this.showArrow(manager.game.hero.node, manager.game.unlockItemMap.get(BuildingType.TransLater)!.node);
                this.showTips("guide_unlockTransporter");
                break;
            case GuideStep.WaitCoin1:
                this.hideArrow();
                break;
            case GuideStep.UnlockSell:
                this.showArrow(manager.game.hero.node, manager.game.unlockItemMap.get(BuildingType.Salesclerk)!.node);
                this.showTips("guide_unlockSell");
                break;
            case GuideStep.WaitCoin2:
                this.hideArrow();
                break;
            case GuideStep.UnlockGun:
                this.showArrow(manager.game.hero.node, manager.game.unlockItemMap.get(BuildingType.Gun)!.node);
                this.showTips("guide_unlockGun");
                break;
            case GuideStep.GoWin:
                // this.showArrow(manager.game.hero.node, this.externalNode);
                this.showArrow(manager.game.hero.node, manager.enemy.boss.node);
                break;
            default:
                this.hideArrow();
                break;
        }
    }

    //#region 事件回调
    private onUpdateHeroItemCount(data: { type: ObjectType, count: number }): void {
        if(this._currentStep === GuideStep.AttCron && data.type === ObjectType.DropItemCornKernel && data.count >= 5){
            this.hideOtherTips("guide_attCron");
            this.setStep(GuideStep.GoToChuShi)
        }
        if(this._currentStep === GuideStep.GoToChuShi && data.type === ObjectType.DropItemCornKernel && data.count <= 0){
            this.hideOtherTips("guide_goToChuShi");
            this.setStep(GuideStep.GoToChuShiOut);
        }
        if(this._currentStep === GuideStep.GoToChuShiOut && data.type === ObjectType.DropItemCornSoup && data.count >= 3){
            this.setStep(GuideStep.GoToTouFang);
        }
        if(this._currentStep === GuideStep.GoToTouFang && data.type === ObjectType.DropItemCornSoup && data.count <= 0){
            this.hideOtherTips("guide_goToTouFang");
            this.setStep(GuideStep.GoToSalesclerk);
        }

        if(this._currentStep === GuideStep.WaitCoin1 && data.type === ObjectType.DropItemCoin){
            if(manager.game.unlockItemMap.get(BuildingType.Salesclerk)!.getDisplayRemainGold() <= data.count){
                this.setStep(GuideStep.UnlockSell);
            }
        }
        if(this._currentStep === GuideStep.WaitCoin2 && data.type === ObjectType.DropItemCoin){
            if(manager.game.unlockItemMap.get(BuildingType.Gun)!.getDisplayRemainGold() <= data.count){
                this.setStep(GuideStep.UnlockGun);
            }
        }
    }

    private onPickupCoin(): void {
        if(this._currentStep === GuideStep.CollectCoin){
            this.setStep(GuideStep.UnlockTransporter);
        }
    }

    private onSolderHurt(): void {
        if(this._currentStep === GuideStep.WaitFight){
            this.setStep(GuideStep.GoFight);
        }
    }

    private onSellSuccess(): void {
        if(this._currentStep === GuideStep.GoToSalesclerk){
            this.setStep(GuideStep.WaitFight);
        }
    }

    private onHeroHurt(): void {
        if(this._currentStep === GuideStep.GoFight){
            this.hideOtherTips("guide_goFight");
            this.setStep(GuideStep.BackHome);
        }
    }

    private onHeroAtHome(): void {
        if(this._currentStep === GuideStep.BackHome){
            this.setStep(GuideStep.CollectCoin);
        }
    }

    private onUnlockItem(item: BuildingType): void {
        if(item === BuildingType.TransLater){
            this.hideOtherTips("guide_unlockTransporter");
            if(manager.game.unlockItemMap.get(BuildingType.Salesclerk)!.getDisplayRemainGold() <= manager.game.hero.pickupComponent.getItemCount(ObjectType.DropItemCoin)){
                this.setStep(GuideStep.UnlockSell);
            }else{
                this.setStep(GuideStep.WaitCoin1);
            }
        }

        if(item === BuildingType.Salesclerk && this._currentStep === GuideStep.UnlockSell){
            this.hideOtherTips("guide_unlockSell");
            if(manager.game.unlockItemMap.get(BuildingType.Gun)!.getDisplayRemainGold() <= manager.game.hero.pickupComponent.getItemCount(ObjectType.DropItemCoin)){
                this.setStep(GuideStep.UnlockGun);
            }else{
                this.setStep(GuideStep.WaitCoin2);
            }
        }

        if(item === BuildingType.Gun && this._currentStep === GuideStep.UnlockGun){
            this.hideOtherTips("guide_unlockGun");
            this.setStep(GuideStep.GoWin);
        }
    }

    //#endregion
}

