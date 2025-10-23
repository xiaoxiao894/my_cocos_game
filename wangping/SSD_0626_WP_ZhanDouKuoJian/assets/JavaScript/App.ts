import { _decorator, Component, instantiate, Node } from 'cc';
import { PlayerController } from './Entitys/PlayerController';
import { SceneNode } from './SceneNode';
import { ResourceManager } from './core/ResourceManager';
import { GlobeVariable } from './core/GlobeVariable';
import { NodePoolManager } from './core/NodePoolManager';
import { GameManager } from './GameManager';
import { EnemyController } from './Entitys/EnemyController';
import { PalingAttack } from './PalingAttack';
import DropController from './Entitys/DropController';
import { MapShowController } from './MapShowController';
import ParterController from './Entitys/ParterController';
import GoldMineController from './Entitys/GoldMineController';
import super_html_playable from './core/super_html_playable';
import { SoundManager } from './core/SoundManager';
import { GuideManager } from './Guide/GuideManager';
const { ccclass, property } = _decorator;

@ccclass('App')
export class App extends Component {
    //游戏的主入口所有入口都在这个类中
    public static playerController: PlayerController = null;
    public static enemyController: EnemyController = null;
    public static sceneNode: SceneNode = null;
    public static resManager: ResourceManager = null;
    public static poolManager: NodePoolManager = null;
    public static palingAttack: PalingAttack = null;
    public static dropController: DropController = null;
    public static mapShowController: MapShowController = null;
    public static parterController: ParterController = null;
    public static goldMineController: GoldMineController = null;
    public static guidArrow3D: Node = null;
    private gameManager: GameManager = null;
    public static guideManager: GuideManager = null;
    @property(Node)
    private root: Node = null;
    protected async onLoad() {
        App.mapShowController = this.root.getComponent(MapShowController);
        App.poolManager = NodePoolManager.Instance;
        App.resManager = ResourceManager.instance;
        App.palingAttack = PalingAttack.Instance;
        await this.initRes()
        SoundManager.inst.preloadAudioClips();
        App.sceneNode = this.node.getComponent(SceneNode);
        App.playerController = PlayerController.Instance;
        App.enemyController = EnemyController.Instance;
        App.parterController = ParterController.Instance;
        App.goldMineController = GoldMineController.Instance;
        App.dropController = DropController.Instance;
        App.playerController.initPlayer();
        App.guideManager = GuideManager.Instance;
        this.gameManager = new GameManager();
        this.gameManager.startGame();


    }
    /**应该放在加载进度中  没有进度在次调用 */
    async initRes() {
        //创建敌人
        let prefab = await App.resManager.loadPrefab(GlobeVariable.prefabPath.EnemyBear)
        if (prefab) {
            App.poolManager.initPool(prefab, 100, GlobeVariable.entifyName.EnemyBear);
        }
        //创建血条
        let prefabBlood = await App.resManager.loadPrefab(GlobeVariable.prefabPath.BloodBar);
        if (prefabBlood) {
            App.poolManager.initPool(prefabBlood, 100, GlobeVariable.entifyName.BloodBar);
        }
        //创建小兵
        let prefabParter = await App.resManager.loadPrefab(GlobeVariable.prefabPath.Parter)
        if (prefabParter) {
            App.poolManager.initPool(prefabParter, 50, GlobeVariable.entifyName.Parter);
        }
        //创建金币
        let prefabCoin = await App.resManager.loadPrefab(GlobeVariable.prefabPath.Coin);
        if (prefabCoin) {
            App.poolManager.initPool(prefabCoin, 100, GlobeVariable.entifyName.Coin);
        }
        //创建子弹
        let prefabPylonAttackEffect = await App.resManager.loadPrefab(GlobeVariable.prefabPath.bulletEffect);
        if (prefabPylonAttackEffect) {
            App.poolManager.initPool(prefabPylonAttackEffect, 100, GlobeVariable.entifyName.bulletEffect);
        }
        //爆炸效果
        let prefabBoom = await App.resManager.loadPrefab(GlobeVariable.prefabPath.TX_Attack_hit);
        if (prefabBoom) {
            App.poolManager.initPool(prefabBoom, 10, GlobeVariable.entifyName.TX_Attack_hit);
        }
        //箭头3d 
        let prefabArrow3D = await App.resManager.loadPrefab(GlobeVariable.prefabPath.Guid_Arrow3D);
        App.guidArrow3D = instantiate(prefabArrow3D);

        //箭头路径
        let prefabArrowPath = await App.resManager.loadPrefab(GlobeVariable.prefabPath.Guid_ArrowPath);
        if (prefabArrowPath) {
            App.poolManager.initPool(prefabArrowPath, 10, GlobeVariable.entifyName.Guid_ArrowPath);
        }

        //创建血条
        let prefabPalingBlood = await App.resManager.loadPrefab(GlobeVariable.prefabPath.PalingBloodBar);
        if (prefabPalingBlood) {
            App.poolManager.initPool(prefabPalingBlood, 100, GlobeVariable.entifyName.PalingBloodBar);
        }

        //创建血条
        let electricBullet = await App.resManager.loadPrefab(GlobeVariable.prefabPath.ElectricBullet);
        if (electricBullet) {
            App.poolManager.initPool(electricBullet, 50, GlobeVariable.entifyName.ElectricBullet);
        }

        GlobeVariable.isTouching = true;

    }

    start() {
        const google_play = "https://play.google.com/store/apps/details?id=com.funplus.ts.global";
        const appstore = "https://play.google.com/store/apps/details?id=com.funplus.ts.global";

        super_html_playable.set_google_play_url(google_play);
        super_html_playable.set_app_store_url(appstore);
    }

    update(deltaTime: number) {
        if (this.gameManager) {
            this.gameManager.update(deltaTime);
        }
    }
}




