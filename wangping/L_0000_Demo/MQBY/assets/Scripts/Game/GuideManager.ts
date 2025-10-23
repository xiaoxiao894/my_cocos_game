import { _decorator, Component, Node, Sprite, UITransform, v3, Vec2, Vec3 } from 'cc';
import { BuildingType, BuildUnlockState, CommonEvent, ObjectType } from '../common/CommonEnum';
import { UnlockItem } from './Building/UnlockItem';
import { ArcherTower } from './Role/ArcherTower';
const { ccclass, property } = _decorator;

export enum GuideStep {
    None, // 无引导
    WaitStart, // 等待开始
    /** 引导去搬运棉签 */
    ToCarrySwab,
    /** 引导运送棉签去棉签防御塔 */
    ToDefenseTower,
    /** 引导去解锁棉签搬运工 */
    ToUnlockSwabTransLater,
    /** 引导去解锁爆炸水果防御塔 */
    ToUnlockExplosionFruitDefenseTower,
    /** 引导去解锁炸弹搬运区 */
    ToUnlockExplosionFruitStack,
    /** 引导去解锁水果炸弹搬运工 */
    ToUnlockExplosionFruitTransLater,
    /** 引导去解锁棉签传送带 */
    ToUnlockSwabTransporter,
    /** 引导结束 显示解锁炸弹传送带和新区域解锁UI */
    LastGuide,
    End,
}

@ccclass('GuideManager')
export class GuideManager extends Component {
    /** 单例实例 */
    private static _instance: GuideManager | null = null;
    /** 获取单例实例 */
    public static get instance(): GuideManager {
        return this._instance as GuideManager;
    }

    @property({ type: Node, displayName: '箭头' })
    public arrow: Node = null!;

    @property({ type: Sprite, displayName: '箭头Sprite' })
    public arrowSprite: Sprite = null!;

    private _isShowArrow: boolean = false;

    private _startNode: Node = null!;
    private _endNode: Node = null!;

    private _currentStep: GuideStep = GuideStep.None;
    public get currentStep(): GuideStep {
        return this._currentStep;
    }

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
        app.event.on(CommonEvent.UnlockItem, this.onUnlockItem, this);
        app.event.on(CommonEvent.UpdateGuide, this.updateGuide, this);

        this.startGuide();
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
        if (!startNode || !endNode) {
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

    public startGuide(): void {
        if (this._currentStep != GuideStep.None) return;
        app.log.info("初始化");
        this._currentStep = GuideStep.WaitStart;
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
        ]

        for (const id of ids) {
            if (excludeId && id === excludeId) {
                continue;
            }
            app.event.emit(CommonEvent.HideTips, { id: id });
        }
    }

    private showTips(id: string): void {
        this.hideOtherTips(id);
        app.event.emit(CommonEvent.ShowTips, { tips: app.lang.getLanguage(id), id: id, duration: -1 });
    }

    private updateGuide(): void {
        if (this._currentStep === GuideStep.End) return;
        this._currentStep++;
        let unlockItem: UnlockItem = null;
        switch (this._currentStep) {
            case GuideStep.WaitStart:
                app.log.warn("初始化还未完成，玩家就开始了操作?某种原因导致的卡顿?"); 
                this.updateGuide();
                break;
            case GuideStep.ToCarrySwab:
                this.showArrow(manager.game.hero.node, manager.game.firstGuideNode);
                // this.showTips("guide_attCron");
                break;
            case GuideStep.ToDefenseTower:
                const towerNode = manager.game.getTowerNode(BuildingType.SwabArcherTower);
                const archerCom = towerNode.getComponent(ArcherTower);
                this.showArrow(manager.game.hero.node, archerCom.ammoSupplyCollider.node);
                break;
            case GuideStep.ToUnlockSwabTransLater:
                unlockItem = manager.game.unlockItemMap.get(BuildingType.SwabTransLater)
                app.event.emit(CommonEvent.SetUnlockStatue, { type: BuildingType.SwabTransLater, state: BuildUnlockState.Active });
                // this.showArrow(manager.game.hero.node, unlockItem.node);
                this._currentUnlockItem = unlockItem;
                this._checkUnlockGuide();
                break;
            case GuideStep.ToUnlockExplosionFruitDefenseTower:
                unlockItem = manager.game.unlockItemMap.get(BuildingType.ExplosionFruitDefenseTower);
                app.event.emit(CommonEvent.SetUnlockStatue, { type: BuildingType.ExplosionFruitDefenseTower, state: BuildUnlockState.Active });
                // this.showArrow(manager.game.hero.node, unlockItem.node);
                this._currentUnlockItem = unlockItem;
                this._checkUnlockGuide();
                break;
            case GuideStep.ToUnlockExplosionFruitStack:
                unlockItem = manager.game.unlockItemMap.get(BuildingType.ExplosionFruitStack);
                app.event.emit(CommonEvent.SetUnlockStatue, { type: BuildingType.ExplosionFruitStack, state: BuildUnlockState.Active });
                // this.showArrow(manager.game.hero.node, unlockItem.node);
                this._currentUnlockItem = unlockItem;
                this._checkUnlockGuide();
                break;
            case GuideStep.ToUnlockExplosionFruitTransLater:
                unlockItem = manager.game.unlockItemMap.get(BuildingType.ExplosionFruitTransLater);
                app.event.emit(CommonEvent.SetUnlockStatue, { type: BuildingType.ExplosionFruitTransLater, state: BuildUnlockState.Active });
                // this.showArrow(manager.game.hero.node, unlockItem.node);
                this._currentUnlockItem = unlockItem;
                this._checkUnlockGuide();
                break;
            case GuideStep.ToUnlockSwabTransporter:
                unlockItem = manager.game.unlockItemMap.get(BuildingType.SwabTransporter);
                app.event.emit(CommonEvent.SetUnlockStatue, { type: BuildingType.SwabTransporter, state: BuildUnlockState.Active });
                // this.showArrow(manager.game.hero.node, unlockItem.node);
                this._currentUnlockItem = unlockItem;
                this._checkUnlockGuide();
                break;
            case GuideStep.LastGuide:
                this._currentUnlockItem = null;
                this.hideArrow();
                app.event.emit(CommonEvent.SetUnlockStatue, { type: BuildingType.NewAreaUnlock, state: BuildUnlockState.Active });
                app.event.emit(CommonEvent.SetUnlockStatue, { type: BuildingType.ExplosionFruitTransporter, state: BuildUnlockState.Active });
                break;
        }
    }

    private _currentUnlockItem: UnlockItem = null;
    _checkUnlockGuide() {
        const unlockItem = this._currentUnlockItem;
        if (unlockItem) {
            const needCount = unlockItem.getDisplayRemainGold();
            const haveCount = manager.game.hero.pickupComponent.getItemCount(ObjectType.DropItemCoin);
            if (needCount <= haveCount) {
                this.showArrow(manager.game.hero.node, unlockItem.node);
            }
            else {
                this.showArrow(manager.game.hero.node, manager.game.coinContainer.guidePosNode);
            }
        }
    }

    //#region 事件回调
    private onUpdateHeroItemCount(data: { type: ObjectType, count: number }): void {
        if (data.type === ObjectType.DropItemSwab) {
            if (this._currentStep === GuideStep.ToCarrySwab && data.count >= 5) {
                this.updateGuide();
            }
            else if (this._currentStep === GuideStep.ToDefenseTower && data.count <= 1) {
                this.updateGuide();
            }
        }
        else if (data.type === ObjectType.DropItemCoin) {
            this._checkUnlockGuide();
        }
    }

    private onUnlockItem(item: BuildingType): void {
        this.updateGuide();
    }

    //#endregion
}

