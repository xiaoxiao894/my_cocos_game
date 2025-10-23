import { _decorator, Component, Label, Node } from 'cc';
import { DataManager } from '../Global/DataManager';
import { PlayerItem } from './PlayerItem';
import { EntityTypeEnum, EventName } from '../Common/Enum';
import { EventManager } from '../Global/EventManager';
import { LanguageManager } from '../Language/LanguageManager';
import super_html_playable from '../Common/super_html_playable';
const { ccclass, property } = _decorator;

@ccclass('UIManager')
export class UIManager extends Component {
    
    //玉米
    @property(PlayerItem)
    corn: PlayerItem = null;
    //金币
    @property(PlayerItem)
    coin: PlayerItem = null;

    @property(Node)
    endNode:Node = null;

    @property(Label)
    downloadLabel: Label = null;


    protected onLoad(): void {
        this.corn.init(0);
        this.coin.init(0);
        this.endNode.active = false;
        const text = LanguageManager.t('download');
        if (this.downloadLabel && text) {
            this.downloadLabel.string = text;
        }
        DataManager.Instance.uiManger = this;
    }

    start() {
        
    }

    protected onEnable(): void {
        EventManager.inst.on(EventName.GameOver, this.onGameEnd, this);
    }

    protected onDisable(): void {
        EventManager.inst.off(EventName.GameOver, this.onGameEnd, this);
    }

    //加
    public addItem(type:EntityTypeEnum, num:number = 1) {
        let item:PlayerItem = null;
        switch (type) {
            case EntityTypeEnum.Corn:
                item = this.corn;
                break;
            case EntityTypeEnum.Coin:
                item = this.coin;
                break;
        }
        if (item) {
            item.add(num);
        }
    }

    //减
    public subItem(type:EntityTypeEnum, num:number = 1) {
        let item:PlayerItem = null;
        switch (type) {
            case EntityTypeEnum.Corn:
                item = this.corn;
                break;
            case EntityTypeEnum.Coin:
                item = this.coin;
                break;
        }
        if (item) {
            item.sub(num);
        }
    }

    public onGameEnd(){
        this.scheduleOnce(()=>{
            this.endNode.active = true;
        },2);
    }

    onClickEndButton() {
        super_html_playable.download();
    }
}


