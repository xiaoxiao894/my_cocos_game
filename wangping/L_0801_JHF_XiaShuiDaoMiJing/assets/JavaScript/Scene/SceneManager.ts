import { _decorator, Component, Prefab, Node, director, find, math, Material, Pool, instantiate, UIOpacity, tween, Vec3, Quat, CCFloat, Vec2, Collider, RigidBody, DirectionalLight, Color } from 'cc';
import { ResourceManager } from '../Global/ResourceManager';
import { DataManager } from '../Global/DataManager';
import Platform from '../Common/Platform';
import { EntityTypeEnum, PlotEnum, PrefabPathEnum, SceneEnum } from '../Enum/Index';
import { GridSystemManager } from '../GridSystem/GridSystemManager';
import super_html_playable from '../Common/super_html_playable';
import { CameraShake } from '../Camera/CameraShake';
import { Arrow3DManager } from '../Actor/Arrow3DManager';
import { CircleTransition2D } from '../Transition/CircleTransition2D';
import { SoundManager } from '../Common/SoundManager';
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

    @property({ type: CCFloat, displayName: "盔甲击退距离" })
    armorRepelDistance = 2;

    @property({ type: CCFloat, displayName: "喷火器攻击距离" })
    spitfireAttackDistance = 5;

    @property({ type: CCFloat, displayName: "喷火器攻击角度" })
    spitfireAttacAngle = 180;

    @property({ type: CCFloat, displayName: "喷火器击退距离" })
    spitfireRepelDistance = 3;

    @property({ type: CCFloat, displayName: "喷火器攻击伤害" })
    spitfireSwabRepelHarm = 3;

    @property({ type: CCFloat, displayName: "控制这次震动效果会持续多久(绘随着时间的变化逐渐衰减)" })
    shakerDuration = 0.5;

    @property({ type: CCFloat, displayName: "控制 相机在空间位置上的抖动幅度(数值越大，镜头在 x、y、z 三个方向的随机位移越大)" })
    amplitudePos = 0.3;

    @property({ type: CCFloat, displayName: "制相转角度的抖动幅度(数值越大,抖动的越厉害)" })
    amplitudeRotDeg = 0.5;

    hitEffectPrefabPool: Pool<Node> | null = null;

    @property(Vec3)
    sceneTwoPlayerPos: Vec3 = null;

    @property(Vec3)
    sceneTwoCameraEuler: Vec3 = null;

    @property(Vec3)
    sceneTwoCameraPos: Vec3 = null;

    @property(Node)
    maskBgNode: Node = null;

    // 场景1布景
    @property(Node)
    sceneOneTerrainNode: Node = null;

    @property(Node)
    sceneTwoTerrainNode: Node = null;

    @property(Node)
    SpriteSplash: Node = null

    private _plotCon: Node = null;
    private _mainCameraNode: Node = null;
    private _Phy: Node = null;

    onLoad() {
        //跳转链接
        const google_play = "https://play.google.com/store/apps/details?gl=US&hl=en-US&id=com.gzgroup.lproject3";
        const appstore = "https://play.google.com/store/apps/details?gl=US&hl=en-US&id=com.gzgroup.lproject3";

        super_html_playable.set_google_play_url(google_play);
        super_html_playable.set_app_store_url(appstore);
    }


    async start() {
        DataManager.Instance.sceneManager = this;
        DataManager.Instance.gridSystemManager = new GridSystemManager(100);
        this._plotCon = find("Root/PlotCon");
        this._mainCameraNode = find("Main Camera");
        this._Phy = find("Root/Phy");

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
        // DataManager.Instance.soundManager.playLoopAudio();
        // 注册网格
        DataManager.Instance.meatManager.init();
        this.initGuideTargetList();
        this.collectingWalls();

        DataManager.Instance.arrow3DManager.setFloatingHeightOffset = this.scene1FloatingHeightOffset;

        //预加载音乐音效
        SoundManager.inst.preloadAudioClips();

        // DataManager.Instance.roastDuckManager.init();
        // DataManager.Instance.coinManager.init();

        // DataManager.Instance.peopleConManager.init();
        // DataManager.Instance.partnerConManager.init();


        // const poolCount = 5;

        // this.hitEffectPrefabPool = new Pool(() => {
        //     const prefab = DataManager.Instance.prefabMap.get(EntityTypeEnum.TX_Attack_hit)
        //     return instantiate(prefab!)
        // }, poolCount, (node: Node) => {
        //     node.removeFromParent();
        // })

        // // 添加门
        // this.initAddScene1DoorFun();

        // // 收集护栏
        // this.collectGuardrails();
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

    // 传送到场景2
    teleportToScene2() {
        if (!this.maskBgNode) return;
        DataManager.Instance.curScene = SceneEnum.Scene2;

        // this.maskBgNode.active = true;

        // 获取脚本
        // const trans = this.maskBgNode.getComponent(CircleTransition2D)!;

        // trans.playClose(new Vec2(0, 0), 500, 0.1, () => {
        //     trans.playOpen(new Vec2(0, 0), 500, 0.1);
        // if (this.sceneOneTerrainNode) this.sceneOneTerrainNode.active = false;
        // if (this.sceneTwoTerrainNode) this.sceneTwoTerrainNode.active = true;

        // this.sceneOneTerrainNode.setScale(0, 0, 0);
        // this.sceneTwoTerrainNode.setScale(1, 1, 1)

        // this.scheduleOnce(() => {
        //     this.SpriteSplash.active = false
        // }, 0.1)

        const ligth = find("Main Light");
        ligth.eulerAngles = new Vec3(-133.210, 129.2460, -8.988);
        const lightCom = ligth.getComponent(DirectionalLight);
        lightCom.color = new Color("#868686");
        lightCom.colorTemperature = 6200
        lightCom.shadowSaturation = 0.75;
        this.sceneOneTerrainNode.setPosition(0, -100, 0)
        this.sceneTwoTerrainNode.setPosition(0, 0, 0);


        this.displaySceneTwoPlot();
        this.updateSceneTwoPlayerPos();
        // this.updateSceneTwoMainCameraPos();

        this.closeSceneOnePhysics();
        this.enableSceneTwoPhysics();

        // 播放人物转场粒子效果
        this.scheduleOnce(() => {
            const txZhuanchang = DataManager.Instance.player.node.getChildByName("TX_chuansong");
            if (txZhuanchang) txZhuanchang.active = true;

            SoundManager.inst.playAudio("chuansong");

            DataManager.Instance.arrow3DManager.setFloatingHeightOffset = this.scene2FloatingHeightOffset;
        }, 0.1)

        // });
    }

    // 打开场景2Plot
    displaySceneTwoPlot() {
        DataManager.Instance.guideTargetIndex++;

        for (let i = 1; i < this._plotCon.children.length; i++) {
            const plot = this._plotCon.children[i];
            if (!plot) continue;

            plot.active = true;
        }
    }

    initGuideTargetList() {
        for (let i = 0; i < this._plotCon.children.length; i++) {
            const plot = this._plotCon.children[i];
            if (!plot) continue;

            DataManager.Instance.guideTargetList.push(plot);
        }
    }

    // 更新角色2在场景中的位置
    updateSceneTwoPlayerPos() {
        if (!DataManager.Instance.player) return;

        DataManager.Instance.player.node.setWorldPosition(this.sceneTwoPlayerPos);
    }

    // 更新场景2相机的角度
    updateSceneTwoMainCameraPos() {
        // if (!this.sceneTwoCameraEuler || !this.sceneTwoCameraPos) return;

        // this._mainCameraNode.setWorldPosition(this.sceneTwoPlayerPos);
        // const quat = new Quat();
        // Quat.fromEuler(quat, this.sceneTwoCameraEuler.x, this.sceneTwoCameraEuler.y, this.sceneTwoCameraEuler.z);
        // this._mainCameraNode.setWorldRotation(quat);

        // this._mainCameraNode.setWorldPosition(this.sceneTwoCameraPos);
    }

    // 场景震动效果
    sceneVibrationEffect() {
        const shaker = this.node.getComponent(CameraShake)!;
        shaker.shake(this.shakerDuration, this.amplitudePos, this.amplitudeRotDeg);
    }

    // 解锁场景2刚体
    enableSceneTwoPhysics() {
        const phyWalls = find("Root/Phy/Walls");
        if (!phyWalls) return;

        phyWalls.active = true;

        for (let i = 0; i < phyWalls.children.length; i++) {
            const wall = phyWalls.children[i];

            const wallCollider = wall.getComponent(Collider);
            wallCollider.enabled = true;

            const wallRightBody = wall.getComponent(RigidBody);
            wallRightBody.enabled = true;
        }
    }

    closeSceneOnePhysics() {
        const phyScene1Walls = find("Root/Phy/Scene1Walls");
        if (!phyScene1Walls) return;

        phyScene1Walls.active = false;
    }

    // 收集墙
    collectingWalls() {
        const walls = this._Phy?.getChildByName("Walls");

        if (!walls) return;

        for (let i = 0; i < walls.children.length; i++) {
            const wall = walls.children[i];
            if (!wall) continue;

            DataManager.Instance.walls.push(wall);
        }
    }

    // 判断一个点是否在墙内
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

