import { _decorator, Component, Prefab, Node, director, find, math, Material, Pool, instantiate, CCFloat } from 'cc';
import { ResourceManager } from '../Global/ResourceManager';
import { DataManager } from '../Global/DataManager';
import Platform from '../Common/Platform';
import { EntityTypeEnum, PlotEnum, PrefabPathEnum, TypeItemEnum } from '../Enum/Index';
import { GridSystemManager } from '../GridSystem/GridSystemManager';
import super_html_playable from '../Common/super_html_playable';
import { SimplePoolManager } from '../Util/SimplePoolManager';
const { ccclass, property } = _decorator;

@ccclass('SceneManager')
export class SceneManager extends Component {
    @property({ type: CCFloat, displayName: "场景1箭头高度" })
    scene1FloatingHeightOffset = 4.5;

    @property({ type: CCFloat, displayName: "场景2箭头高度" })
    scene2FloatingHeightOffset = 7.5;

    @property({ type: CCFloat, displayName: "棉签攻击距离" })
    cottonSwabAttackDistance = 10;

    @property({ type: CCFloat, displayName: "棉签攻击角度" })
    cottonSwabAttackAngle = 360;

    @property({ type: CCFloat, displayName: "棉签击退距离" })
    cottonSwabRepelDistance = 3;

    @property({ type: CCFloat, displayName: "棉签攻击伤害" })
    cottonSwabRepelHarm = 1;

    @property({ type: CCFloat, displayName: "小刀攻击距离" })
    knifeAttackDistance = 5;

    @property({ type: CCFloat, displayName: "小刀攻击角度" })
    knifeAttackAngle = 360;

    @property({ type: CCFloat, displayName: "小刀击退距离" })
    knifeRepelDistance = 3;

    @property({ type: CCFloat, displayName: "小刀攻击伤害" })
    knifeSwabRepelHarm = 1.5;

    @property({ type: CCFloat, displayName: "喷火器攻击距离" })
    spitfireAttackDistance = 5;

    @property({ type: CCFloat, displayName: "喷火器攻击角度" })
    spitfireAttacAngle = 180;

    @property({ type: CCFloat, displayName: "喷火器击退距离" })
    spitfireRepelDistance = 3;

    @property({ type: CCFloat, displayName: "喷火器攻击伤害" })
    spitfireSwabRepelHarm = 3;

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
        DataManager.Instance.monsterConMananger.initMonsterConManager();

        DataManager.Instance.peopleConManager.init();

        // 注册所有对象池
        SimplePoolManager.Instance.registerNodePools([
            {
                key: TypeItemEnum.Meat,
                prefab: DataManager.Instance.prefabMap.get(TypeItemEnum.Meat)!,
                count: 300,
            },
            {
                key: TypeItemEnum.Roast,
                prefab: DataManager.Instance.prefabMap.get(TypeItemEnum.Roast)!,
                count: 300,
            },
            {
                key: TypeItemEnum.GoldCoin,
                prefab: DataManager.Instance.prefabMap.get(TypeItemEnum.GoldCoin)!,
                count: 300
            },
        ])

        // 收集护栏
        this.collectGuardrails();

        // 添加门
        this.initAddScene1DoorFun();

        // 人物初始化背包中的东西都需要设置一个属性
        this.initBackpack();
    }

    initBackpack() {
        const playerNode = DataManager.Instance.player.node;
        const backpacks: Node[] = [
            playerNode.getChildByName("Backpack1"),
            playerNode.getChildByName("Backpack2"),
            playerNode.getChildByName("Backpack3"),
        ].filter(Boolean) as Node[];

        for (let i = 0; i < backpacks.length; i++) {
            const backpack = backpacks[i];
            if (!backpack) continue;

            for (let j = 0; j < backpack.children.length; j++) {
                const item = backpack.children[j];
                if (!item) continue;

                item[`__isReady`] = true;
            }
        }
    }

    // 收集护栏
    collectGuardrails() {
        const door = find("Root/Cons/L_prp_XieHe_mod_V001/Door");

        DataManager.Instance.guardrailArr.push({
            node: door,
            attackingMonsterCount: 0,
            blood: DataManager.Instance.guardrailBlood
        })
    }

    initAddScene1DoorFun() {
        const walls = find("Root/Phy/Walls");

        const doorConfigs = [
            { side: "L", doorName: "L_Door", direction: "Left" },
            { side: "T", doorName: "T_Door", direction: "Top" },
            { side: "R", doorName: "R_Door", direction: "Right" },
            { side: "B", doorName: "B_Door", direction: "Bottom" },
        ];

        doorConfigs.forEach(cfg => {
            const wallNode = walls.getChildByName(cfg.side);
            if (!wallNode) {
                // console.warn(`未找到 ${cfg.side}`);
                return;
            }

            this.addDoor({ direction: cfg.direction, doorNode: wallNode });
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

        for (const wallNode of doors) {

            const pos = wallNode.doorNode.worldPosition;
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

    isNodeInsideWallArea(node: Node): boolean {
        const walls = DataManager.Instance.walls;
        if (!walls || walls.length < 4) {
            console.log("墙数量不足， 无法判断区域")
            return false;
        }

        let minX = Infinity, maxX = -Infinity;
        let minZ = Infinity, maxZ = -Infinity;

        for (const wallNode of walls) {

            const pos = wallNode.worldPosition;
            minX = Math.min(minX, pos.x);
            maxX = Math.max(maxX, pos.x);
            minZ = Math.min(minZ, pos.z);
            maxZ = Math.max(maxZ, pos.z);
        }

        const pos = node.worldPosition;

        return pos.x >= minX && pos.x <= maxX && pos.z >= minZ && pos.z <= maxZ;
    }

}

