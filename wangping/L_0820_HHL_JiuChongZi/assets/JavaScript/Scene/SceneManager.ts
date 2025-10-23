import { _decorator, Component, Prefab, Node, director, find, math, Material, Pool, instantiate } from 'cc';
import { ResourceManager } from '../Global/ResourceManager';
import { DataManager } from '../Global/DataManager';
import Platform from '../Common/Platform';
import { EntityTypeEnum, PlotEnum, PrefabPathEnum } from '../Enum/Index';
import { GridSystemManager } from '../GridSystem/GridSystemManager';
import super_html_playable from '../Common/super_html_playable';
const { ccclass, property } = _decorator;

@ccclass('SceneManager')
export class SceneManager extends Component {
    hitEffectPrefabPool: Pool<Node> | null = null;

    @property(Material)
    doorMaterials: Material[] = [];

    @property(Material)
    guardrailMaterials: Material[] = [];

    onLoad() {
        //跳转链接
        const google_play = "https://play.google.com/store/apps/details?gl=US&hl=en-US&id=com.gzgroup.lproject3";
        const appstore = "https://play.google.com/store/apps/details?gl=US&hl=en-US&id=com.gzgroup.lproject3";

        super_html_playable.set_google_play_url(google_play);
        super_html_playable.set_app_store_url(appstore);
    }


    async start() {
        DataManager.Instance.sceneManager = this;
        DataManager.Instance.gridSystemManager = new GridSystemManager(30);

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
    }

    initGame() {
        DataManager.Instance.soundManager.playLoopAudio();
        // 注册网格

        DataManager.Instance.monsterConMananger.initMonsterConManager();
        DataManager.Instance.meatManager.init();
        DataManager.Instance.roastDuckManager.init();
        DataManager.Instance.coinManager.init();

        DataManager.Instance.peopleConManager.init();
        DataManager.Instance.partnerConManager.init();

        const plot = DataManager.Instance.guideTargetList.find(item => {
            return item.plotName == PlotEnum.Plot1;
        })

        if (plot) {
            const plot1Node = find("ThreeDNode/Plot1");
            if (plot1Node) {
                plot.node = plot1Node;
            }
        }

        const poolCount = 5;

        this.hitEffectPrefabPool = new Pool(() => {
            const prefab = DataManager.Instance.prefabMap.get(EntityTypeEnum.TX_Attack_hit)
            return instantiate(prefab!)
        }, poolCount, (node: Node) => {
            node.removeFromParent();
        })

        // 添加门
        this.initAddScene1DoorFun();

        // 收集护栏
        this.collectGuardrails();
    }

    // 收集护栏
    collectGuardrails() {
        const tside = find("ThreeDNode/Map/Scene1/TSide");

        if (!tside) return;

        for (let i = 0; i < tside.children.length; i++) {
            const node = tside.children[i];

            if (!node || i < 4) continue;
            DataManager.Instance.guardrailArr.push({
                node: node,
                attackingMonsterCount: 0,
                blood: DataManager.Instance.guardrailBlood
            })
        }
    }

    initAddScene1DoorFun() {
        const scene1 = find("ThreeDNode/Map/Scene1");

        const doorConfigs = [
            { side: "LSide-001", doorName: "L_Door", direction: "Left" },
            { side: "TSide", doorName: "T_Door", direction: "Top" },
            { side: "RSide", doorName: "R_Door", direction: "Right" },
            { side: "BSide", doorName: "B_Door", direction: "Bottom" },
        ];

        doorConfigs.forEach(cfg => {
            const sideNode = scene1.getChildByName(cfg.side);
            if (!sideNode) {
                // console.warn(`未找到 ${cfg.side}`);
                return;
            }

            const doorNode = sideNode.children.find(child => child.name === cfg.doorName);
            if (!doorNode) {
                // console.warn(`未找到 ${cfg.doorName} in ${cfg.side}`);
                return;
            }

            this.addDoor({ direction: cfg.direction, doorNode });
        });
    }

    addDoor(door) {
        DataManager.Instance.doors.push(door);
    }

    // 判断一个节点是否在门围城的区域内
    isNodeInsideDoorArea(node: Node): boolean {
        const doors = DataManager.Instance.doors;
        if (!doors || doors.length < 4) {
            // console.log("门数量不足， 无法判断区域")
            return false;
        }

        let minX = Infinity, maxX = -Infinity;
        let minZ = Infinity, maxZ = -Infinity;

        for (const { doorNode } of doors) {
            const doorLeft = doorNode.getChildByName("Door_Left");

            const pos = doorLeft.worldPosition;
            minX = Math.min(minX, pos.x);
            maxX = Math.max(maxX, pos.x);
            minZ = Math.min(minZ, pos.z);
            maxZ = Math.max(maxZ, pos.z);
        }

        const pos = node.worldPosition;

        return pos.x >= minX && pos.x <= maxX && pos.z >= minZ && pos.z <= maxZ;
    }

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

