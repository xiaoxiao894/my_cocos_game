import { _decorator, Component, Prefab, Node, director, find, math, Material, Pool, instantiate, Animation, Label, CCFloat, SpriteAtlas, SpriteFrame } from 'cc';
import { EntityTypeEnum, GamePlayNameEnum, PathEnum, PrefabPathEnum } from '../Enum/Index';
import { ResourceManager } from '../Global/ResourceManager';
import { DataManager } from '../Global/DataManager';
import { GridSystem } from '../Grid/GridSystem';
import { Simulator } from '../RVO/Simulator';
import { Vector2 } from '../RVO/Common';
import RVOObstacles from '../Global/RVOObstacles';
import super_html_playable from '../Common/super_html_playable';
import { WoodManager } from '../Wood/WoodManager';
import { SoundManager } from '../Common/SoundManager';
const { ccclass, property } = _decorator;

@ccclass('SceneManager')
export class SceneManager extends Component {
    @property(SpriteFrame)
    logoIcon: SpriteFrame[] = [];

    @property({ type: CCFloat, tooltip: "背景音效差值" })
    bgmOffset = 0;

    @property({ tooltip: "配置一个字符串参数" })
    bulletAttackTimeInterval: string = "2,1,0.9,0.8,0.7";   // 在属性检查器里可修改

    @property(Node)
    walls: Node = null;

    @property(Node)
    obstacles: Node = null;

    @property(Material)
    doorMaterials: Material[] = [];

    @property(Material)
    guardrailMaterials: Material[] = [];

    @property(Node)
    initFireNode: Node = null;

    hitEffectPrefabPool: Pool<Node> | null = null;

    towerAttackInterval = [];

    onLoad(): void {
        DataManager.Instance.sceneManager = this;
        //跳转链接
        const google_play = "https://play.google.com/store/apps/details?id=com.funplus.ts.global";
        const appstore = "https://play.google.com/store/apps/details?id=com.funplus.ts.global";

        super_html_playable.set_google_play_url(google_play);
        super_html_playable.set_app_store_url(appstore);

        if (this.bulletAttackTimeInterval.length > 0) {
            const strArr = this.bulletAttackTimeInterval.split(",").map(item => Number(item));
            this.towerAttackInterval = strArr;

            DataManager.Instance.bulletAttackTimeInterval = this.towerAttackInterval[0];
        }
    }

    async start() {
        const unlock = find("THREE3DNODE/Unlock");

        for (let i = 0; i < DataManager.Instance.guideTargetList.length; i++) {
            const data = DataManager.Instance.guideTargetList[i];
            if (!data) continue;

            const plot = unlock.getChildByName(data.plot);
            if (!plot) continue;

            const landmark = plot.getChildByName("Landmark");
            if (!landmark) continue;

            const label = landmark.getChildByName("Label");
            if (!label) continue;

            const labelCom = label.getComponent(Label);
            if (!labelCom) continue;

            data.coinNum = Number(labelCom.string);
            data.initCoinNum = Number(labelCom.string);
        }

        if (this.initFireNode) {
            this.initFireNode.active = true;

            const fireAni = this.initFireNode.getComponent(Animation);
            if (fireAni) fireAni.play();
        }



        await Promise.all([this.loadRes()]);
        this.initGame();
        this.initGridSystem();
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
        DataManager.Instance.monsterManager.init();
        //rvo
        Simulator.instance.setAgentDefaults(60, 3, 1, 0.1, 14, 80, new Vector2(0, 0));
        // 添加静态障碍物
        this.addRvoObstacle();

        // 收集护栏
        this.collectGuardrails();

        DataManager.Instance.woodManager.woodManagerInit();
        DataManager.Instance.boardManager.boardManagerInit();
        DataManager.Instance.treeManager.initTrees();
        DataManager.Instance.electricTowerManager.electricTowerManagerInit();
        DataManager.Instance.partnerConManager.partnerConManagerInit();

        //预加载音乐音效
        SoundManager.inst.preloadAudioClips();
    }

    initGridSystem() {
        DataManager.Instance.gridSystem = new GridSystem(5);

        DataManager.Instance.treeManager.initTreeSystem();
    }

    // 添加静态障碍物
    addRvoObstacle() {

        RVOObstacles.addOneObstacle(this.obstacles);

        Simulator.instance.processObstacles();
    }

    // 收集护栏
    collectGuardrails() {
        for (let i = 0; i < this.walls.children.length; i++) {
            const wall = this.walls.children[i];

            if (i > 8) return;
            if (!wall) continue;
            let bloodNode: Node = wall.getChildByName(EntityTypeEnum.FenceBloodBar);
            if (bloodNode) {
                bloodNode.active = false;
            }
            DataManager.Instance.guardrailArr.push({
                node: wall,
                attackingMonsterCount: 0,
                blood: DataManager.Instance.guardrailBlood,
            })
        }
    }

    // 栅栏血条消失逻辑
    private _frames = 0;
    protected update(dt: number): void {
        if (this._frames++ > 10) {
            this._frames = 0
            DataManager.Instance.guardrailArr.forEach(guardrail => {
                if (guardrail.attackingMonsterCount <= 0) {
                    let bloodNode: Node = guardrail.node.getChildByName(EntityTypeEnum.FenceBloodBar);
                    if (bloodNode) {
                        bloodNode.active = false;
                    }
                }
            });
        }
    }

}

