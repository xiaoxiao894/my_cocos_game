import { _decorator, Camera, Color, Component, director, find, geometry, Node, PhysicsSystem, Quat, Root, Sprite, tween, Vec2, Vec3, VerticalTextAlignment, view } from 'cc';
import ItemPool from "../Common/ItemPool";
import { EntityTypeEnum, EventNames } from "../Enum/Index";
import { MonsterItem } from './MonsterItem';
import { DataManager } from '../Global/DataManager';
import Util from '../Common/Util';
import { Simulator } from '../RVO/Simulator';
import MonsterBorn from './MonsterBorn';
import { EventManager } from '../Global/EventManager';
import { Vector2 } from '../RVO/Common';
const { ccclass, property } = _decorator;

@ccclass('MonsterManager')
export default class MonsterManager extends Component {

    @property(Node)
    monsterParent: Node = null;
    @property(Node)
    monkeyBloodParent: Node = null;

    //怪物节点池
    private _monsterPools: ItemPool[] = [];
    private _monsterTypes: EntityTypeEnum[] = [EntityTypeEnum.Spider, EntityTypeEnum.Mantis];
    private _dropPool: ItemPool;
    private _bloodPool: ItemPool;
    private _bornSpeed: number = 1;
    _bornTimeLimit: number = 1;
    private _bornTime: number = 0;

    private _dropList: Node[] = [];

    private initMonsterPos = [
        { pos: new Vec3(33.885, 0, 60.245), rot: new Vec3(0, -102.764, 0) },
        { pos: new Vec3(25.77, 0, 65.503), rot: new Vec3(0, 217.764, 0) },
        { pos: new Vec3(16.574, 0, 66.676), rot: new Vec3(0, 171.246, 0) },
        { pos: new Vec3(7.534, 0, 63.879), rot: new Vec3(0, 130.499, 0) },
        { pos: new Vec3(4.948, 0, 55.012), rot: new Vec3(0, 86.593, 0) },
    ]
    //rvo
    private _speedCfg = [10, 8];
    private _radiusCfg = [2, 1.5];

    // 计数器/ 控制怪物生成比例
    private _createCounter: number = 0;

    // smallMonsterRatio   怪物生成的比例360
    private _smallMonsterRatio: number = 9;
    private _bigMonsterRatio: number = 1;

    private selectLocationIndex = 0;
    private monsterBirthPointCon = null;
    protected start(): void {
        DataManager.Instance.monsterManager = this;

        this.monsterBirthPointCon = find('ThreeDNode/MonsterBirthPointCon');
    }

    //初始化
    public init() {
        this._monsterPools = [];
        for (let i = 0; i < this._monsterTypes.length; i++) {
            this._monsterPools.push(new ItemPool(this._monsterTypes[i]));
        }
        this._dropPool = new ItemPool(EntityTypeEnum.dropItem);
        this._bloodPool = new ItemPool(EntityTypeEnum.MonsterBloodBar);

        Simulator.instance.setAgentDefaults(60, 3, 1, 0.1, 14, 80, new Vector2(0, 0));

        for (let i = 0; i < this.initMonsterPos.length; i++) {
            const { pos, rot } = this.initMonsterPos[i];

            DataManager.Instance.monsterManager.creatMonster(true, true, pos, rot);
        }
    }

    creatMonster(isDissolveOnce, isAfferentPos = false, pos = new Vec3(0, 0, 0), rot = new Vec3(0, 0, 0)) {
        let rad = 0;

        if (this._createCounter >= this._smallMonsterRatio) {
            rad = 1;
            this._createCounter = 0;
        } else {
            rad = 0;
            this._createCounter++;
        }

        const pool = this._monsterPools[rad];
        if (!pool) {
            console.warn(`No monster pool found for type ${rad}`);
            return;
        }

        const node: Node = pool.getItem();
        const monster: MonsterItem = node.getComponent(MonsterItem);
        if (!monster) return;

        let validPos: Vec3 = null;
        let validRot: Vec3 = null;
        if (isAfferentPos) {
            validPos = pos;
            node.setWorldPosition(validPos);
        } else {
            const birthPoints = this.monsterBirthPointCon.children;
            if (this.selectLocationIndex >= birthPoints.length) {
                this.selectLocationIndex = 0;
            }

            const birthPoint = birthPoints[this.selectLocationIndex];
            validPos = birthPoint.getWorldPosition();
            node.setWorldPosition(validPos);
            this.selectLocationIndex++;


            // 获取出生点的世界旋转
            const worldRot = birthPoint.getWorldRotation();

            const addRot = Quat.fromEuler(new Quat(), 0, 180, 0);

            const finalRot = new Quat();
            Quat.multiply(finalRot, worldRot, addRot);

            // 设置给节点
            node.setWorldPosition(birthPoint.getWorldPosition());
            node.setWorldRotation(finalRot);

        }

        // 初始化怪物
        // if (rad === 1) {
        const bloodNode = this._bloodPool.getItem();
        this.monkeyBloodParent.addChild(bloodNode);
        const redNode = bloodNode.getChildByName("Red");
        const redNodeSprite = redNode.getComponent(Sprite);
        if (rad == 1) {
            bloodNode.setScale(0.025, 0.025, 0.025)
            redNodeSprite.color = new Color(255, 0, 0)
        } else {
            bloodNode.setScale(0.015, 0.015, 0.015)
            redNodeSprite.color = new Color(255, 153, 0)
        }
        monster.init(rad, bloodNode, isDissolveOnce);

        const newNode = new Node("tempNode");
        newNode.setScale(1, 0, 1);
        director.getScene().addChild(newNode);
        if (rot.length() > 0) {
            node.setRotationFromEuler(rot.x, rot.y, rot.z)
        } else {
            // node.setRotationFromEuler()
        }
        newNode.addChild(node)
        tween(newNode)
            .to(0.15, { scale: new Vec3(1, 1.1, 1) }, { easing: 'quadOut' })
            .to(0.05, { scale: new Vec3(1, 1, 1) }, { easing: 'quadOut' })
            .call(() => {
                this.monsterParent.addChild(node);
                newNode.removeFromParent();
                newNode.destroy();
                const mass = 1;
                const agentId = Simulator.instance.addAgent(
                    Util.v3t2(validPos),
                    this._radiusCfg[rad],   // 半径
                    this._speedCfg[rad],    // 最大速度
                    null,
                    mass
                );

                const agentObj = Simulator.instance.getAgentByAid(agentId);

                // === 建议的 RVO 参数，和行为层对齐 ===
                const radius = this._radiusCfg[rad] ?? 0.45;
                const maxSpeed = this._speedCfg[rad] ?? 2.0;

                // 1) 视邻距离：至少覆盖左右/纵向间距；经验：>= 4*radius 或 >= 3.0
                agentObj.neighborDist = Math.max(3.0, radius * 4);

                // 2) 预测时域（人-人互避）与障碍预测
                agentObj.timeHorizon = 1.5; // 1.0~2.0 更稳
                agentObj.timeHorizonObst = 1.5;

                // 3) 可见邻居数
                agentObj.maxNeighbors_ = 20;

                // 4) 与行为层一致的速度上限和半径（加一层保险写回）
                agentObj.maxSpeed_ = maxSpeed;
                agentObj.radius_ = radius;

                monster.agentHandleId = agentId;
            })
            .start();
    }

    private _framTimes = 0
    protected update(dt: number): void {
        if (DataManager.Instance.isStartGame) {
            if (this._monsterPools.length > 0) {
                const currentMonsterCount = this.monsterParent.children.length;
                const maxMonsterCount = DataManager.Instance.monsterAllNum;

                if (currentMonsterCount < maxMonsterCount) {
                    this._bornTime += dt;
                    if (this._bornTime > DataManager.Instance.monsterBornTimeLimit) {
                        this._bornTime = 0;

                        // 可创建的数量不超过最大限制
                        const spawnCount = Math.min(this._bornSpeed, maxMonsterCount - currentMonsterCount);
                        for (let i = 0; i < spawnCount; i++) {
                            this.creatMonster(false, false, new Vec3(0, 0, 0),);
                        }
                    }
                }
            }

            // rvo 更新逻辑坐标
            Simulator.instance.run(dt);

            this._framTimes = 0;
            for (let index = 0; index < this.monsterParent.children.length; index++) {
                const monster = this.monsterParent.children[index];
                monster?.getComponent(MonsterItem)?.moveByRvo(dt);
            }
            EventManager.inst.emit(EventNames.ArmyMoveByRVO, dt);
        }
    }

    public killMonsters(nodes: Node[], isPlayer = false, node1: Node | null = null) {
        for (let node of nodes) {
            if (!node || !node.isValid) continue;

            const monster = node.getComponent(MonsterItem);
            if (monster && typeof monster.deathAni === 'function') {
                monster.deathAni(isPlayer, node1);
            }
        }
    }

    public recycleMonster(index: number, node: Node) {
        if (this._monsterPools[index]) {
            this._monsterPools[index].putItem(node);
        }
    }

    public recycleBlood(node: Node) {
        this._bloodPool.putItem(node);
    }

    // 金币掉落
    public dropItem(pos: Vec3) {
        let node = this._dropPool.getItem();
        director.getScene().addChild(node);
        node.setWorldPosition(pos);

        // 原始位置
        const startY = pos.y;
        const peakY = startY + 3;     // 第一次跃起高度
        const bounceY = startY + 0.7;   // 回落后的弹跳高度

        tween(node)
            .to(0.25, { position: new Vec3(pos.x, peakY, pos.z) }, { easing: 'quadOut' })   // 向上弹起
            .to(0.2, { position: new Vec3(pos.x, startY, pos.z) }, { easing: 'quadIn' })    // 回落
            .to(0.15, { position: new Vec3(pos.x, bounceY, pos.z) }, { easing: 'quadOut' }) // 二次弹起
            .to(0.15, { position: new Vec3(pos.x, startY, pos.z) }, { easing: 'quadIn' })   // 回到地面
            .call(() => {
                this._dropList.push(node);
            })
            .start();
    }

    //获取掉落物
    public getDrops() {
        let newList = this._dropList.splice(0, this._dropList.length);
        return newList;
    }

    //回收掉落物
    public recycleDrop(node: Node) {
        this._dropPool.putItem(node);
    }

    // 开始场景2，3的时候，检查哪些怪被包围在场景中了
    getSurroundedMonsters() {
        const monsterList = [];
        for (let i = 0; i < this.monsterParent.children.length; i++) {
            const monster = this.monsterParent.children[i];

            if (!monster) continue;

            if (DataManager.Instance.sceneManager.isNodeInsideDoorArea(monster)) {
                monsterList.push(monster);
            }
        }

        return monsterList;
    }

}