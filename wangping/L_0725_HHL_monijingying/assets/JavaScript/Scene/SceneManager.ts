import { _decorator, Component, Prefab, Node, director, find, math, Material, Pool, instantiate } from 'cc';
import { ResourceManager } from '../Global/ResourceManager';
import { DataManager } from '../Global/DataManager';
import super_html_playable from '../Common/super_html_playable';
import { EntityTypeEnum, PrefabPathEnum } from '../Common/Enum';
import { NodePoolManager } from '../Common/NodePoolManager';
import { Simulator } from '../RVO/Simulator';
import { Vector2 } from '../RVO/Common';
import RVOObstacles from '../RVO/RVOObstacles';
import { SoundManager } from '../Global/SoundManager';
import JPSController from '../JPS/JPSController';
const { ccclass, property } = _decorator;

@ccclass('SceneManager')
export class SceneManager extends Component {
    @property(Node)
    effectNode:Node = null;

    @property(Node)
    bloodParent:Node = null;

    @property(Node)
    obstacleCorn:Node = null;

    @property(Node)
    coinParent:Node = null;

    @property(Node)
    startPos:Node = null;

    onLoad() {
        //跳转链接
        const google_play = "https://play.google.com/store/apps/details?gl=US&hl=en-US&id=com.gzgroup.lproject3";
        const appstore = "https://play.google.com/store/apps/details?gl=US&hl=en-US&id=com.gzgroup.lproject3";

        super_html_playable.set_google_play_url(google_play);
        super_html_playable.set_app_store_url(appstore);
    }


    async start() {
        DataManager.Instance.sceneManager = this;

        await Promise.all([this.loadRes()]);
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
        /**箭头路径 */
        let arrowPrefab = DataManager.Instance.prefabMap.get(EntityTypeEnum.PathArrow);
        if(arrowPrefab){
            NodePoolManager.Instance.initPool( arrowPrefab, 40,EntityTypeEnum.PathArrow);
        }
        /** 金币 */
        let coinPrefab = DataManager.Instance.prefabMap.get(EntityTypeEnum.Coin);
        if(coinPrefab){
            NodePoolManager.Instance.initPool( coinPrefab, 50,EntityTypeEnum.Coin);
        }
        /** 草 */
        // let grassPrefab = DataManager.Instance.prefabMap.get(EntityTypeEnum.Grass);
        // if(grassPrefab){
        //     NodePoolManager.Instance.initPool( grassPrefab, 50,EntityTypeEnum.Grass);
        // }
        /** 玉米粒 */
        let cornPrefab = DataManager.Instance.prefabMap.get(EntityTypeEnum.Corn);
        if(cornPrefab){
            NodePoolManager.Instance.initPool( cornPrefab, 20,EntityTypeEnum.Corn);
        }
        /** 伙伴 */
        let partnerPrefab = DataManager.Instance.prefabMap.get(EntityTypeEnum.Partner);
        if(partnerPrefab){
            NodePoolManager.Instance.initPool( partnerPrefab, 5,EntityTypeEnum.Partner);
        }
        /** 怪 */
        let monsterPrefab = DataManager.Instance.prefabMap.get(EntityTypeEnum.Monster);
        if(monsterPrefab){
            NodePoolManager.Instance.initPool( monsterPrefab, 20,EntityTypeEnum.Monster);
        }
        /** 血条 */
        let hpPrefab = DataManager.Instance.prefabMap.get(EntityTypeEnum.HP);
        if(hpPrefab){
            NodePoolManager.Instance.initPool( hpPrefab, 40,EntityTypeEnum.HP);
        }

        //子弹
        let bullet1 = DataManager.Instance.prefabMap.get(EntityTypeEnum.Bullet1);
        if(bullet1){
            NodePoolManager.Instance.initPool( bullet1, 5,EntityTypeEnum.Bullet1);
        }
        let bullet2 = DataManager.Instance.prefabMap.get(EntityTypeEnum.Bullet2);
        if(bullet2){
            NodePoolManager.Instance.initPool( bullet2, 5,EntityTypeEnum.Bullet2);
        }

        //炮塔攻击特效
        let prefabTurretTxPath = DataManager.Instance.prefabMap.get(EntityTypeEnum.TX_fashe);
        if(prefabTurretTxPath){
            NodePoolManager.Instance.initPool( prefabTurretTxPath, 5,EntityTypeEnum.TX_fashe);
        }

        //炮塔攻击特效
        let prefabTurretBombTxPath = DataManager.Instance.prefabMap.get(EntityTypeEnum.TX_jizhong_10);
        if(prefabTurretBombTxPath){
            NodePoolManager.Instance.initPool( prefabTurretBombTxPath, 5,EntityTypeEnum.TX_jizhong_10);
        }

        //炮塔攻击特效2
        let prefabTurretBombTxPath2 = DataManager.Instance.prefabMap.get(EntityTypeEnum.TX_jizhong_11);
        if(prefabTurretBombTxPath2){
            NodePoolManager.Instance.initPool( prefabTurretBombTxPath2, 5,EntityTypeEnum.TX_jizhong_11);
        }

        //蜘蛛受击特效
        // let prefabArrowTxPath = DataManager.Instance.prefabMap.get(EntityTypeEnum.ArrowTX);
        // if(prefabArrowTxPath){
        //     NodePoolManager.Instance.initPool( prefabArrowTxPath, 5,EntityTypeEnum.ArrowTX);
        // }

    }

    initGame() {
        DataManager.Instance.partnerController.init();
        Simulator.instance.setAgentDefaults(100, 3, 3, 3, 14, 80, new Vector2(0, 0));
        this.addObstacle();
        SoundManager.inst.preloadAudioClips();
        
        DataManager.Instance.isGameStart = true;
        
    }

    // 添加障碍物
    addObstacle() {
        //rvo
        RVOObstacles.addOneObstacle(this.obstacleCorn);
        Simulator.instance.processObstacles();
        //jps
        JPSController.instance.addOneObstacle(this.obstacleCorn);
    }

}

