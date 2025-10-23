import { _decorator, Component, instantiate, Node, Prefab } from 'cc';
import { EntityTypeEnum, EventName, PrefabPathEnum } from './Common/Enum';
import { ResourceManager } from './Global/ResourceManager';
import { DataManager } from './Global/DataManager';
import { EventManager } from './Global/EventManager';
import super_html_playable from '../super_html_playable';
const { ccclass, property } = _decorator;
const google_play = "https://play.google.com/store/apps/details?id=com.funplus.ts.global";
const appstore = "https://play.google.com/store/apps/details?id=com.funplus.ts.global";


@ccclass('SceneManager')
export class SceneManager extends Component {

    @property(Node)
    socketNodes: Node[] = [];

    @property(Node)
    arrowNodes: Node[] = [];

    @property(Node)
    arrowParent: Node = null;

    private _arrowNode: Node = null;

    async start() {
        DataManager.Instance.sceneManger = this;
        super_html_playable.set_google_play_url(google_play);
        super_html_playable.set_app_store_url(appstore);
        await Promise.all([this.loadRes()])
        this.initGame();
    }

    async loadRes() {
        const list = [];
        for (const type in PrefabPathEnum) {
            const p = ResourceManager.Instance.loadRes(PrefabPathEnum[type], Prefab).then((Prefab) => {
                DataManager.Instance.prefabMap.set(type, Prefab)
            })
            list.push(p);
        }

        await Promise.all(list);
    }


    initGame() {
        DataManager.Instance.socketNodes = this.socketNodes;
        DataManager.Instance.arrowNodes = this.arrowNodes;
        this.createArrow();
    }

    private createArrow() {
        if (!this._arrowNode) {
            this._arrowNode = instantiate(DataManager.Instance.prefabMap.get(EntityTypeEnum.Arrow));
            this._arrowNode.parent = this.arrowParent;
            this.scheduleOnce(() => {
                EventManager.inst.emit(EventName.ArrowTargetVectorUpdate, DataManager.Instance.ropeManager.endNodes[0].getWorldPosition().clone());
            }, 0);
        }
    }

    public checkBuildCanUpdate() {
        if (DataManager.Instance.leftSocket.length === 2) {
            console.log('升级塔 ui出现');
            EventManager.inst.emit(EventName.TowerUpgradeButtonShow);
        }
    }
}

