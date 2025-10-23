import { _decorator, Component, instantiate, Node } from 'cc';
import { PlayerController } from './Entitys/PlayerController';
import { SceneNode } from './SceneNode';
import { ResourceManager } from './core/ResourceManager';
import { GlobeVariable } from './core/GlobeVariable';
import { NodePoolManager } from './core/NodePoolManager';
import { GameManager } from './GameManager';
import { EnemyController } from './Entitys/EnemyController';
import DropController from './Entitys/DropController';
import { MapShowController } from './MapShowController';
import GoldMineController from './Entitys/GoldMineController';
import super_html_playable from './core/super_html_playable';
import { BeetleController } from './Entitys/BeetleController';
import { GuideManager } from './Guide/GuideManager';
import { SoundManager } from './core/SoundManager';
import { DataManager } from './data/DataManager';
const { ccclass, property } = _decorator;

@ccclass('App')
export class App extends Component {
    //游戏的主入口所有入口都在这个类中
    public static playerController: PlayerController = null;
    public static enemyController: EnemyController = null;
    public static beetleController: BeetleController = null;

    public static sceneNode: SceneNode = null;
    public static resManager: ResourceManager = null;
    public static poolManager: NodePoolManager = null;
    public static dropController: DropController = null;
    public static mapShowController: MapShowController = null;
    public static goldMineController: GoldMineController = null;
    public static dataManager:DataManager  = null;
    public static guidArrow3D: Node = null;
    private gameManager: GameManager = null;
    public static gameManager: GameManager = null;
    public static guideManager: GuideManager = null;

    //public static soundManager: SoundManager = null;
    @property(Node)
    private root: Node = null;
    protected async onLoad() {
        SoundManager.Instance.preloadAudioClips();
        App.sceneNode = this.node.getComponent(SceneNode);
        App.mapShowController = this.root.getComponent(MapShowController);
        App.poolManager = NodePoolManager.Instance;
        App.resManager = ResourceManager.instance;
        App.dataManager = DataManager.Instance;
        await App.dataManager.init();
        await this.initRes()
        // App.soundManager = SoundManager.Instance;
  
        App.beetleController = BeetleController.Instance;
        App.playerController = PlayerController.Instance;
        App.enemyController = EnemyController.Instance;
        App.enemyController.init();
        App.goldMineController = GoldMineController.Instance;
        App.dropController = DropController.Instance;
        App.playerController.initPlayer();
        App.guideManager = GuideManager.Instance;
        this.gameManager = new GameManager();
        App.gameManager = this.gameManager;
        this.gameManager.startGame();


    }
    /**应该放在加载进度中  没有进度在次调用 */
    async initRes() {
        // //创建敌人
        let prefab = await App.resManager.loadPrefab(GlobeVariable.prefabPath.EnemySpider)
        if (prefab) {
            App.poolManager.initPool(prefab, 100, GlobeVariable.entifyName.EnemySpider);
        }
        // //创建敌人
        let prefabL = await App.resManager.loadPrefab(GlobeVariable.prefabPath.EnemySpiderL)
        if (prefabL) {
            App.poolManager.initPool(prefabL, 100, GlobeVariable.entifyName.EnemySpiderL);
        }
        //创建血条
        let prefabBlood = await App.resManager.loadPrefab(GlobeVariable.prefabPath.BloodBar);
        if (prefabBlood) {
            App.poolManager.initPool(prefabBlood, 100, GlobeVariable.entifyName.BloodBar);
        }
        //创建火柴棍箭矢
        let fireArrow = await App.resManager.loadPrefab(GlobeVariable.prefabPath.FireArrow);
        if (fireArrow) {
            App.poolManager.initPool(fireArrow, 100, GlobeVariable.entifyName.FireArrow);
        }

        //创建炮塔胶囊
        let turret = await App.resManager.loadPrefab(GlobeVariable.prefabPath.TurretBullet);
        if (turret) {
            App.poolManager.initPool(turret, 100, GlobeVariable.entifyName.TurretBullet);
        }

        //创建炮塔胶囊
        let beetle = await App.resManager.loadPrefab(GlobeVariable.prefabPath.Beetle);
        if (beetle) {
            App.poolManager.initPool(beetle, 100, GlobeVariable.entifyName.Beetle);
        }
        //创建金币
        let prefabCoin = await App.resManager.loadPrefab(GlobeVariable.prefabPath.Coin);
        if (prefabCoin) {
            App.poolManager.initPool(prefabCoin, 100, GlobeVariable.entifyName.Coin);
        }

        //箭头3d 
        let prefabArrow3D = await App.resManager.loadPrefab(GlobeVariable.prefabPath.Guid_Arrow3D);
        App.guidArrow3D = instantiate(prefabArrow3D);

        //箭头路径
        let prefabArrowPath = await App.resManager.loadPrefab(GlobeVariable.prefabPath.Guid_ArrowPath);
        if (prefabArrowPath) {
            App.poolManager.initPool(prefabArrowPath, 10, GlobeVariable.entifyName.Guid_ArrowPath);
        }

        //花瓣特效
        let prefabFlowerTxPath = await App.resManager.loadPrefab(GlobeVariable.prefabPath.FlowerTx);
        if (prefabFlowerTxPath) {
            App.poolManager.initPool(prefabFlowerTxPath, 10, GlobeVariable.entifyName.FlowerTx);

        }
        //炮塔攻击特效
        let prefabTurretTxPath = await App.resManager.loadPrefab(GlobeVariable.prefabPath.TurretTx);
        if (prefabTurretTxPath) {
            App.poolManager.initPool(prefabTurretTxPath, 22, GlobeVariable.entifyName.TurretTx);
        }
        //炮塔攻击特效
        let prefabTurretBombTxPath = await App.resManager.loadPrefab(GlobeVariable.prefabPath.TurretBombTx);
        if (prefabTurretBombTxPath) {
            App.poolManager.initPool(prefabTurretBombTxPath, 10, GlobeVariable.entifyName.TurretBombTx);

        }
        //-arrow 火柴攻击人物受击特效
        let prefabArrowTxPath = await App.resManager.loadPrefab(GlobeVariable.prefabPath.ArrowTX);
        if (prefabArrowTxPath) {
            App.poolManager.initPool(prefabArrowTxPath, 10, GlobeVariable.entifyName.ArrowTX);
        }


        //-arrow  Beetle 攻击受击特效
        let prefabBeetleCollideTxPath = await App.resManager.loadPrefab(GlobeVariable.prefabPath.BeetleCollideTx);
        if (prefabBeetleCollideTxPath) {
            App.poolManager.initPool(prefabBeetleCollideTxPath, 10, GlobeVariable.entifyName.BeetleCollideTx);
        }

    }

    start() {
        const google_play = "https://play.google.com/store/apps/details?gl=US&hl=en-US&id=com.gzgroup.lproject3";
        const appstore = "https://play.google.com/store/apps/details?gl=US&hl=en-US&id=com.gzgroup.lproject3";

        super_html_playable.set_google_play_url(google_play);
        super_html_playable.set_app_store_url(appstore);
    }

    update(deltaTime: number) {
        if (this.gameManager) {
            this.gameManager.update(deltaTime);
        }
    }
}




