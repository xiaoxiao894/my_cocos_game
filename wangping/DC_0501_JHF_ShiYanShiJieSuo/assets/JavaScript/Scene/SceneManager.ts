import { _decorator, Component, instantiate, Node, ParticleSystem, Prefab } from 'cc';
import { EntityTypeEnum, EventNames, PrefabPathEnum } from '../Enum/Index';
import { ResourceManager } from '../Global/ResourceManager';
import { DataManager } from '../Global/DataManager';
import { UIJoyStickManager } from '../UI/UIJoyStickManager';
import Platform from '../Common/Platform';
import { EventManager } from '../Global/EventManager';
import { SoundManager } from '../Common/SoundManager';
import super_html_playable from '../Common/super_html_playable';
const { ccclass, property } = _decorator;

@ccclass('SceneManager')
export class SceneManager extends Component {

    //3d内容根节点
    @property(Node)
    homeNode: Node = null;

    @property(Node)
    gameEndParent: Node = null;

    @property(Node)
    UIproperty: Node = null

    @property(Node)
    UIpropertyMoneyRobot: Node = null;

    @property(Node)
    UIpropertyMedicationRobot: Node = null;

    @property(ParticleSystem)
    ps: ParticleSystem = null!;

    private ui: Node;


    onLoad() {
        const google_play = "https://play.google.com/store/apps/details?id=com.kingsgroup.dcdly";
        const appstore = "https://apps.apple.com/us/app/dc-dark-legion/id6479020757";

        super_html_playable.set_google_play_url(google_play);
        super_html_playable.set_app_store_url(appstore);

        DataManager.Instance.sceneManager = this;
    }

    async start() {

        this.clearGame();
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

    protected onEnable(): void {
        EventManager.inst.on(EventNames.GameEnd, this.initGameEnd, this);
    }

    protected onDisable(): void {
        EventManager.inst.off(EventNames.GameEnd, this.initGameEnd, this);
    }

    // 清理
    clearGame() {
        this.ui = this.node.getChildByName("UI");

        this.ui.destroyAllChildren();
        //this.homeNode.destroyAllChildren();
        this.gameEndParent.destroyAllChildren();

    }

    initGame() {
        Platform.instance.init();
        this.initMap();
        this.initJoyStick();
        this.initProperty();
        //预加载音乐音效
        SoundManager.inst.preloadAudioClips();

        DataManager.Instance.promptArrowManager.node.active = true;

        this.scheduleOnce(() => {
            this.ps?.play();
        })
    }

    private initMap() {
        // const prefab = DataManager.Instance.prefabMap.get(EntityTypeEnum.Map)
        // const map = instantiate(prefab);
        // map.setParent(this.homeNode);

        DataManager.Instance.MoneyManeger.init();
        DataManager.Instance.HonorManeger?.initHonorPool();
        DataManager.Instance.LaboratoryManeger?.init();
        DataManager.Instance.PeopleManeger?.init();
        //开始引导
        DataManager.Instance.mainCamera?.startGuide();
    }

    initJoyStick() {
        const prefab = DataManager.Instance.prefabMap.get(EntityTypeEnum.JoyStick)
        const joyStick = instantiate(prefab);
        joyStick.setParent(this.ui);
        const jm = (DataManager.Instance.jm = joyStick.getComponent(UIJoyStickManager))
        jm.init();
    }

    initProperty() {
        const prefab = DataManager.Instance.prefabMap.get(EntityTypeEnum.Property);
        const property = instantiate(prefab);
        property.setParent(this.ui);
    }

    public initGameEnd() {
        if (this.gameEndParent.children.length > 0) {
            return;
        }
        const prefab = DataManager.Instance.prefabMap.get(EntityTypeEnum.GameEnd)
        const gameEnd = instantiate(prefab);
        gameEnd.setParent(this.gameEndParent);
    }
}

