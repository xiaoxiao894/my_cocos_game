import { _decorator, Component, Node, Sprite, UITransform, v3, Vec2, Vec3 } from 'cc';
import { BuildingType, BuildUnlockState, CommonEvent, ObjectType } from '../common/CommonEnum';
const { ccclass, property } = _decorator;

enum GuideStep {
    None, // 无引导
    WaitStart, // 等待开始
    AttCron, // 攻击Cron
    GoToChuShi, // 去厨房投放
    GoToChuShiOut, // 去厨房拾取
    GoToTouFang, // 去商店投放
    GoToSalesclerk, // 去售货员
    WaitFight, // 等待战斗
    GoFight, // 去战斗
    BackHome, // 回家
    UnlockBig, // 解锁大铲子
    GoFight1, // 去战斗
    WaitCoin1, // 等待金币
    UnlockTransporter, // 解锁搬运工
    WaitCoin2, // 等待金币
    UnlockSell, // 解锁售货员
    WaitCoin3, // 等待金币
    UnlockFireGun, // 解锁喷火枪
    GoKillEnemys, // 去胜利
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

    private _currentStep: GuideStep = GuideStep.None;
    
    /** 当前引导的蛋索引，用于GoKillEnemys阶段依次引导 */
    private _currentEggIndex: number = 0;
    
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
        app.event.on(CommonEvent.SolderHurt, this.onSolderHurt, this);
        app.event.on(CommonEvent.SellSuccess, this.onSellSuccess, this);
        app.event.on(CommonEvent.BossDead, this.onBossDead, this);
        app.event.on(CommonEvent.GameWin, this.onGameWin, this);
        app.event.on(CommonEvent.SpiderEggDead, this.onSpiderEggDead, this);
        app.event.on(CommonEvent.CoinCountChanged, this.onCoinCountChanged, this);
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

    /**
     * 获取当前活跃的蛋节点（用于依次引导）
     */
    private getCurrentActiveEgg(): Node | null {
        if (!manager.enemy) {
            return null;
        }
        
        const activeEggs = manager.enemy.getActiveSpiderEggs();
        if (this._currentEggIndex >= activeEggs.length) {
            return null;
        }
        
        return activeEggs[this._currentEggIndex]?.node || null;
    }

    public startGuide(): void {
        if(this._currentStep != GuideStep.None) return;
        this._currentStep = GuideStep.WaitStart;
        this.updateGuide();
    }

    /**
     * 检查建筑是否已经解锁
     */
    private isItemUnlocked(buildingType: BuildingType): boolean {
        const unlockItem = manager.game.unlockItemMap.get(buildingType);
        return unlockItem ? unlockItem.UnlockState === BuildUnlockState.Unlocked : false;
    }

    /**
     * 获取解锁步骤完成后的下一步
     */
    private getNextStepAfterUnlock(currentStep: GuideStep): GuideStep {
        switch (currentStep) {
            case GuideStep.UnlockBig:
                return GuideStep.GoFight1;
            case GuideStep.UnlockTransporter:
                // 检查是否有足够金币解锁售货员
                if(manager.game.unlockItemMap.get(BuildingType.Salesclerk)!.getDisplayRemainGold() <= manager.game.hero.pickupComponent.getItemCount(ObjectType.DropItemCoin)){
                    return GuideStep.UnlockSell;
                } else {
                    return GuideStep.WaitCoin2;
                }
            case GuideStep.UnlockSell:
                // 检查是否有足够金币解锁喷火枪
                if(manager.game.unlockItemMap.get(BuildingType.FireGun)!.getDisplayRemainGold() <= manager.game.hero.pickupComponent.getItemCount(ObjectType.DropItemCoin)){
                    return GuideStep.UnlockFireGun;
                } else {
                    return GuideStep.WaitCoin3;
                }
            case GuideStep.UnlockFireGun:
                // 重置蛋索引，从第一个蛋开始引导
                this._currentEggIndex = 0;
                return GuideStep.GoKillEnemys;
            default:
                return currentStep;
        }
    }

    private setStep(step: GuideStep): void {
        // 检查解锁相关步骤，如果已经解锁则跳过
        let finalStep = step;
        
        // 循环检查，直到找到一个不需要跳过的步骤
        while (true) {
            let shouldSkip = false;
            
            switch (finalStep) {
                case GuideStep.UnlockBig:
                    if (this.isItemUnlocked(BuildingType.BigShovel)) {
                        console.log('大铲子已解锁，跳过引导');
                        finalStep = this.getNextStepAfterUnlock(finalStep);
                        shouldSkip = true;
                    }
                    break;
                case GuideStep.UnlockTransporter:
                    if (this.isItemUnlocked(BuildingType.TransLater)) {
                        console.log('搬运工已解锁，跳过引导');
                        finalStep = this.getNextStepAfterUnlock(finalStep);
                        shouldSkip = true;
                    }
                    break;
                case GuideStep.UnlockSell:
                    if (this.isItemUnlocked(BuildingType.Salesclerk)) {
                        console.log('售货员已解锁，跳过引导');
                        finalStep = this.getNextStepAfterUnlock(finalStep);
                        shouldSkip = true;
                    }
                    break;
                case GuideStep.UnlockFireGun:
                    if (this.isItemUnlocked(BuildingType.FireGun)) {
                        console.log('喷火枪已解锁，跳过引导');
                        finalStep = this.getNextStepAfterUnlock(finalStep);
                        shouldSkip = true;
                    }
                    break;
            }
            
            // 如果没有跳过，则退出循环
            if (!shouldSkip) {
                break;
            }
        }
        
        this._currentStep = finalStep;
        this.updateGuide();
    }

    private hideOtherTips(excludeId?: string): void {
        const ids = [
            "guide_waitStart",
            "guide_attCron",
            "guide_goToChuShi",
            "guide_goToTouFang",
            "guide_goFight",
            "guide_unlockTransporter",
            "guide_unlockSell",
            "guide_unlockGun",
            "guide_unlockFireGun",
            "guide_goKillEnemys",
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
            case GuideStep.WaitStart:
                // 如果英雄已经在家，直接跳到下一步
                if (manager.game.isHeroAtHome()) {
                    this.setStep(GuideStep.AttCron);
                    return;
                }
                this.showArrow(manager.game.hero.node, this.homeNode);
                this.showTips("guide_waitStart");
                break;
            case GuideStep.AttCron:
                this.showArrow(manager.game.hero.node, manager.game.bigCorn.attackPoint);
                this.showTips("guide_attCron");
                break;
            case GuideStep.GoToChuShi:
                this.showArrow(manager.game.hero.node, manager.game.kaoLu.putInCollider.node);
                this.showTips("guide_goToChuShi");
                break;
            case GuideStep.GoToChuShiOut:
                this.showArrow(manager.game.hero.node, manager.game.kaoLu.putOutCollider.node);
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
                this.showArrow(manager.game.hero.node, manager.enemy.outPos);
                this.showTips("guide_goFight");
                break;
            case GuideStep.BackHome:
                this.showArrow(manager.game.hero.node, this.homeNode);
                break;
            case GuideStep.UnlockBig:
                this.showArrow(manager.game.hero.node, manager.game.unlockItemMap.get(BuildingType.BigShovel)!.node);
                this.showTips("guide_unlockGun");
                break;
            case GuideStep.GoFight1:
                this.showArrow(manager.game.hero.node, manager.enemy.outPos);
                this.showTips("guide_goFight");
                break;
            case GuideStep.WaitCoin1:
                this.hideArrow();
                break;
            case GuideStep.UnlockTransporter:
                this.showArrow(manager.game.hero.node, manager.game.unlockItemMap.get(BuildingType.TransLater)!.node);
                this.showTips("guide_unlockTransporter");
                break;
            case GuideStep.WaitCoin2:
                this.hideArrow();
                break;
            case GuideStep.UnlockSell:
                this.showArrow(manager.game.hero.node, manager.game.unlockItemMap.get(BuildingType.Salesclerk)!.node);
                this.showTips("guide_unlockSell");
                break;
            case GuideStep.WaitCoin3:
                this.hideArrow();
                break;
            case GuideStep.UnlockFireGun:
                this.showArrow(manager.game.hero.node, manager.game.unlockItemMap.get(BuildingType.FireGun)!.node);
                this.showTips("guide_unlockFireGun");
                break;
            case GuideStep.GoKillEnemys:
                const currentEgg = this.getCurrentActiveEgg();
                if (currentEgg) {
                    this.showArrow(manager.game.hero.node, currentEgg);
                    this.showTips("guide_goKillEnemys");
                } else {
                    // 没有活跃的蛋，引导到敌人生成位置
                    // this.showArrow(manager.game.hero.node, manager.enemy.outPos);
                    this.hideArrow();
                    this.showTips("guide_goKillEnemys");
                }
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

        if(data.type === ObjectType.DropItemCoin){
            this.updateWaitCoin(data.count);
        }
    }

    private getNeedCoin(step: GuideStep): number {
        let needCoin = 0;
        if(step === GuideStep.WaitCoin1){
            needCoin = manager.game.unlockItemMap.get(BuildingType.TransLater)!.getDisplayRemainGold();
        }else if(step === GuideStep.WaitCoin2){
            needCoin = manager.game.unlockItemMap.get(BuildingType.Salesclerk)!.getDisplayRemainGold();
        }else if(step === GuideStep.WaitCoin3){
            needCoin = manager.game.unlockItemMap.get(BuildingType.FireGun)!.getDisplayRemainGold();
        }
        return needCoin;
    }

    private updateWaitCoin(heroCoin: number): void {
        const needCoin = this.getNeedCoin(this._currentStep);
        if(needCoin <= heroCoin){
            if(this._currentStep === GuideStep.WaitCoin1){
                this.setStep(GuideStep.UnlockTransporter);
            }else if(this._currentStep === GuideStep.WaitCoin2){
                this.setStep(GuideStep.UnlockSell);
            }else if(this._currentStep === GuideStep.WaitCoin3){
                this.setStep(GuideStep.UnlockFireGun);
            }
        }
        // 只判断英雄现有金币，不再引导去收集地上的金币
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

    private onBossDead(): void {
        if(this._currentStep === GuideStep.GoFight1){
            // GoFight1阶段Boss死亡，检查是否有足够金币解锁搬运工
            if(manager.game.unlockItemMap.get(BuildingType.TransLater)!.getDisplayRemainGold() <= manager.game.hero.pickupComponent.getItemCount(ObjectType.DropItemCoin)){
                this.setStep(GuideStep.UnlockTransporter);
            }else{
                this.setStep(GuideStep.WaitCoin1);
            }
        }
        if(this._currentStep === GuideStep.GoKillEnemys){
            // Boss死亡，但此时已经在杀敌阶段，继续游戏流程
        }
    }

    private onGameWin(): void {
        if(this._currentStep === GuideStep.GoKillEnemys){
            this.hideOtherTips("");
            this.setStep(GuideStep.Finished);
        }
    }

    private onHeroHurt(): void {
        if(this._currentStep === GuideStep.GoFight){
            this.hideOtherTips("guide_goFight");
            this.setStep(GuideStep.BackHome);
        }
        if(this._currentStep === GuideStep.GoFight1){
            this.hideOtherTips("guide_goFight");
            // 战斗结束后检查是否有足够金币解锁搬运工
            if(manager.game.unlockItemMap.get(BuildingType.TransLater)!.getDisplayRemainGold() <= manager.game.hero.pickupComponent.getItemCount(ObjectType.DropItemCoin)){
                this.setStep(GuideStep.UnlockTransporter);
            }else{
                this.setStep(GuideStep.WaitCoin1);
            }
        }
    }

    private onHeroAtHome(): void {
        if(this._currentStep === GuideStep.WaitStart){
            this.setStep(GuideStep.AttCron);
        }
        if(this._currentStep === GuideStep.BackHome){
            // 直接进入解锁大铲子步骤
            this.setStep(GuideStep.UnlockBig);
        }
    }

    private onUnlockItem(item: BuildingType): void {
        if(item === BuildingType.BigShovel && this._currentStep === GuideStep.UnlockBig){
            this.hideOtherTips("guide_unlockGun");
            this.setStep(GuideStep.GoFight1);
        }

        if(item === BuildingType.TransLater && this._currentStep === GuideStep.UnlockTransporter){
            this.hideOtherTips("guide_unlockTransporter");
            if(manager.game.unlockItemMap.get(BuildingType.Salesclerk)!.getDisplayRemainGold() <= manager.game.hero.pickupComponent.getItemCount(ObjectType.DropItemCoin)){
                this.setStep(GuideStep.UnlockSell);
            }else{
                this.setStep(GuideStep.WaitCoin2);
            }
        }

        if(item === BuildingType.Salesclerk && this._currentStep === GuideStep.UnlockSell){
            this.hideOtherTips("guide_unlockSell");
            if(manager.game.unlockItemMap.get(BuildingType.FireGun)!.getDisplayRemainGold() <= manager.game.hero.pickupComponent.getItemCount(ObjectType.DropItemCoin)){
                this.setStep(GuideStep.UnlockFireGun);
            }else{
                this.setStep(GuideStep.WaitCoin3);
            }
        }

        if(item === BuildingType.FireGun && this._currentStep === GuideStep.UnlockFireGun){
            this.hideOtherTips("guide_unlockFireGun");
            // 重置蛋索引，从第一个蛋开始引导
            this._currentEggIndex = 0;
            this.setStep(GuideStep.GoKillEnemys);
        }
    }

    private onSpiderEggDead(spiderEggNode: Node): void {
        if(this._currentStep === GuideStep.GoKillEnemys){
            // 蛋死亡后，切换到下一个蛋
            this._currentEggIndex++;
            // 刷新引导显示
            this.updateGuide();
        }
    }

    private onCoinCountChanged(): void {
        const heroCoin = manager.game.hero.pickupComponent.getItemCount(ObjectType.DropItemCoin);
        this.updateWaitCoin(heroCoin);
    }

    //#endregion
}

