import { _decorator, Button, CCFloat, CCInteger, Component, easing, Enum, Node, Prefab, sp, tween, Vec3 } from 'cc';
import { BuildingType, CommonEvent, HeroType } from '../../common/CommonEnum';
import { BuildingHe } from '../Building/BuildingHe';
const { ccclass, property } = _decorator;

@ccclass('HeroData')
class HeroData {
    @property({type: Enum(HeroType), displayName: "英雄类型"})
    public type: HeroType = HeroType.None;

    @property({type: Prefab, displayName: "英雄预制体"})
    public heroPrefab: Prefab = null!;

    @property({ type: Node ,displayName: "英雄卡节点"})
    public heroCard: Node = null!;
}

@ccclass('SelectHeroPanel')
export class SelectHeroPanel extends Component {

    @property({type: [HeroData], displayName: "英雄数据"})
    public heroData: HeroData[] = [];

    @property({type: Node, displayName: "layer"})
    public layer: Node = null!;

    private heroDataMap: Map<HeroType, HeroData> = new Map();

    private showList: HeroData[] = [];

    private currentBuildingType: BuildingType = BuildingType.None;

    protected onLoad(): void {
        this.heroData.forEach(data => {
            data.heroCard.on(Button.EventType.CLICK, () => this.onHeroCardClick(data), this);
            this.heroDataMap.set(data.type, data);
        });

        app.event.on(CommonEvent.UnlockItem, this.onUnlockItem, this);
    }

    protected onDestroy(): void {
        this.heroData.forEach(data => {
            data.heroCard.off(Button.EventType.CLICK, () => this.onHeroCardClick(data), this);
        });
    }

    protected onEnable(): void {
        manager.game.isGamePause = true;

        this.updateHeroData();

        if(this.showList.length > 1) {
            this.layer.setScale(0, 0, 1);
            tween(this.layer)
                .to(0.4, { scale: Vec3.ONE }, { easing: easing.backOut })
                .start();
        }else {
            this.node.active = false;
            if(this.showList[0]) {
                this.scheduleOnce(() => {
                    this.onSelectHero(this.showList[0].type, this.currentBuildingType, this.showList[0].heroPrefab);
                }, 0.4);
            }
            manager.game.isGamePause = false;
        }
    }

    protected onDisable(): void {
        manager.game.isGamePause = false;
    }

    private updateHeroData(): void {
        this.showList = [];

        this.heroData.forEach(data => {
            this.showList.push(data);
        });

        manager.game.buildingMap.forEach((building, key) => {
            if(key === BuildingType.HeroTower1 
                || key === BuildingType.HeroTower2 
                || key === BuildingType.HeroTower3
                || key === BuildingType.HeroTower4
                || key === BuildingType.HeroTower5
                || key === BuildingType.HeroTower6
            ) {
                const buildingHe = building as BuildingHe;
                const heroType = buildingHe.HeroType;
                if(buildingHe.isUnlock) {
                    const index = this.showList.findIndex(item => item.type === heroType);
                    if(index !== -1) {
                        this.showList.splice(index, 1);
                    }
                }
            }
        });

        this.updateHeroCard();
    }

    private updateHeroCard(): void {
        // 隐藏所有英雄卡
        this.heroData.forEach(data => {
            data.heroCard.active = false;
        });

        // 只显示前两个可用的英雄卡
        for(let i = 0; i < Math.min(2, this.showList.length); i++) {
            this.showList[i].heroCard.active = true;
        }
    }

    private onSelectHero(heroType: HeroType, buildingType: BuildingType, heroPrefab: Prefab): void {
        app.event.emit(CommonEvent.SelectHero, {heroType, buildingType, heroPrefab});
    }

    private onHeroCardClick(heroData: HeroData): void {
        tween(this.layer)
            .to(0.4, { scale: new Vec3(0, 0, 1) }, { easing: easing.quintOut })
            .call(() => {
                this.onSelectHero(heroData.type, this.currentBuildingType, heroData.heroPrefab);
                this.node.active = false;
            })
            .start();
    }

    private onUnlockItem(buildingType: BuildingType): void {
        this.currentBuildingType = buildingType;
        this.updateHeroData();
    }

    public onShowSelectHeroPanel(buildingType: BuildingType): void {
        this.currentBuildingType = buildingType;
        this.updateHeroData();
    }
}

