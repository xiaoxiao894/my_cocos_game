import { _decorator, Component, Prefab, Node, director, find, math, Material, Pool, instantiate } from 'cc';
import { EntityTypeEnum, GamePlayNameEnum, PathEnum, PrefabPathEnum } from '../Enum/Index';
import { ResourceManager } from '../Global/ResourceManager';
import { DataManager } from '../Global/DataManager';
import Platform from '../Common/Platform';
import { GridSystem } from '../Grid/GridSystem';
import { FlowField } from '../Monster/FlowField';
import { Simulator } from '../RVO/Simulator';
import { Vector2 } from '../RVO/Common';
import RVOObstacles from '../Global/RVOObstacles';
import super_html_playable from '../Common/super_html_playable';
const { ccclass, property } = _decorator;

@ccclass('SceneManager')
export class SceneManager extends Component {
    @property(Node)
    obstacles: Node = null;

    @property(Material)
    doorMaterials: Material[] = [];

    @property(Material)
    guardrailMaterials: Material[] = [];

    hitEffectPrefabPool: Pool<Node> | null = null;

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
        this.initGrid();
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

        Platform.instance.init();
        if (DataManager.Instance.monsterManager) DataManager.Instance.monsterManager.init();
        if (this.obstacles) {
            FlowField.Instance.init(this.obstacles.children);
        }

        //rvo
        Simulator.instance.setAgentDefaults(60, 3, 1, 0.1, 14, 80, new Vector2(0, 0));

        // 添加静态障碍物
        this.addRvoObstacle();

        // 收集护栏
        const fencesScene1 = find(PathEnum.FencesScene1);
        this.collectGuardrails(fencesScene1);

        // 添加门
        this.initAddScene1DoorFun();

        const poolCount = 5;

        this.hitEffectPrefabPool = new Pool(() => {
            const prefab = DataManager.Instance.prefabMap.get(EntityTypeEnum.TX_Attack_hit)
            return instantiate(prefab!)
        }, poolCount, (node: Node) => {
            node.removeFromParent();
        })

        this.updateGuidanceData();
    }

    initGrid() {
        DataManager.Instance.gridSystem = new GridSystem(5);
    }

    // 更新指引数据
    updateGuidanceData() {
        const deliveryAreas = find("ThreeDNode/Map/DeliveryAreas");

        if (deliveryAreas) {
            const guideList = DataManager.Instance.guideTargetList;

            for (let i = 0; i < deliveryAreas.children.length; i++) {
                const node = deliveryAreas.children[i];
                if (!node) continue;

                const guideData = {
                    name: node.name,
                    isDisplay: true,
                    isFind: true,
                    node: node,
                    worldPos: node.worldPosition,
                };

                // 最后两个插入数组开头，其余插入末尾
                if (i >= deliveryAreas.children.length - 2) {
                    guideData.isDisplay = false;
                    guideList.unshift(guideData); // 插入开头
                } else {
                    const plot = node.getChildByName("Plot");
                    if (plot) {
                        const isZeroScale = plot && plot.scale.x !== 0 && plot.scale.y !== 0 && plot.scale.z !== 0;

                        if (isZeroScale) {
                            guideData.isDisplay = true;
                        } else {
                            guideData.isDisplay = false;
                        }
                    }
                    guideList.push(guideData); // 插入末尾
                }
            }

        }
    }

    // 添加障碍物
    addRvoObstacle() {
        let tempList = [];
        const scene1Physics = find(PathEnum.Scene1Physics);
        const left = scene1Physics.getChildByName("Left");
        const right = scene1Physics.getChildByName("Right");
        const top = scene1Physics.getChildByName("Top");
        const bottom = scene1Physics.getChildByName("Bottom");
        const obstacle = scene1Physics.getChildByName("obstacle");
        const outSide1 = find(PathEnum.OutSide1);
        const outSide2 = find(PathEnum.OutSide2);
        const outSide3 = find(PathEnum.OutSide3);
        const outSide4 = find(PathEnum.OutSide4);

        tempList.push(...left.children, ...right.children, ...bottom.children, ...top.children);
        DataManager.Instance.obstacleArr.push(obstacle, ...outSide1.children, ...outSide2.children, ...outSide3.children, ...outSide4.children);

        const excludedNames = ["Scene1_T_Door", "Scene1_L_Door", "Scene1_R_Door", "Scene1_B_Door"];
        for (let i = 0; i < tempList.length; i++) {
            const node = tempList[i];
            if (!excludedNames.includes(node.name)) {
                RVOObstacles.addOneObstacle(node);
            }
        }

        for (let i = 0; i < DataManager.Instance.obstacleArr.length; i++) {
            const node = DataManager.Instance.obstacleArr[i];
            RVOObstacles.addOneObstacle(node);
        }

        Simulator.instance.processObstacles();
    }

    // 收集护栏
    collectGuardrails(scene) {
        for (let i = 0; i < scene.children.length; i++) {
            for (let j = 0; j < scene.children[i].children.length; j++) {
                const node = scene.children[i].children[j];

                if (!node) continue;
                DataManager.Instance.guardrailArr.push({
                    node: node,
                    attackingMonsterCount: 0,
                    blood: DataManager.Instance.guardrailBlood
                });
            }
        }
    }

    // 添加门
    initAddScene1DoorFun() {
        const scene1 = find(PathEnum.Scene1);

        const doorConfigs = [
            { side: "LSide", doorName: "L_Door", direction: "Left" },
            { side: "TSide", doorName: "T_Door", direction: "Top" },
            { side: "RSide", doorName: "R_Door", direction: "Right" },
            { side: "BSide", doorName: "B_Door", direction: "Bottom" },
        ];

        doorConfigs.forEach(cfg => {
            const sideNode = scene1.getChildByName(cfg.side);
            if (!sideNode) {
                console.warn(`未找到 ${cfg.side}`);
                return;
            }

            const doorNode = sideNode.children.find(child => child.name === cfg.doorName);
            if (!doorNode) {
                console.warn(`未找到 ${cfg.doorName} in ${cfg.side}`);
                return;
            }

            this.addDoor({ direction: cfg.direction, doorNode });
        });
    }

    // 添加场景2
    addSceneDoorFun(path) {
        const index = DataManager.Instance.doors.findIndex(item => {
            return item.direction == "Right";
        })

        if (index >= 0) {
            DataManager.Instance.doors.splice(index, 1);

            const scene2 = find(path);
            const rSide = scene2.getChildByName("RSide");

            if (rSide) {
                const rDoor = rSide.getChildByName("R_Door")
                if (rDoor) {
                    DataManager.Instance.doors.push({
                        direction: "Right",
                        doorNode: rDoor
                    })
                }
            }
        }
    }

    // 添加门
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

