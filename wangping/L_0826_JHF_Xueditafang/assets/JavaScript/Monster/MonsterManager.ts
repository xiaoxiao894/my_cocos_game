import { _decorator, Camera, CCFloat, Color, Component, director, find, geometry, Node, PhysicsSystem, Quat, Sprite, tween, Vec2, Vec3, view } from 'cc';
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

    @property(CCFloat)
    bigMonsterBloodBarScale = 0;

    @property(CCFloat)
    littleMonsterBloodBar = 0;

    //怪物节点池
    private _monsterPools: ItemPool[] = [];
    private _monsterTypes: EntityTypeEnum[] = [EntityTypeEnum.Spider, EntityTypeEnum.Mantis];
    private _dropPool: ItemPool;
    private _bloodPool: ItemPool;
    private _bornSpeed: number = 1;
    private _bornTimeLimit: number = 1;
    private _bornTime: number = 0;

    private _dropList: Node[] = [];
    private initMonsterPos = [
        { pos: new Vec3(-9.306, 0, 1.298) },
        { pos: new Vec3(-2.3, 0, 1.648) },
        { pos: new Vec3(5.085, 0, 1.575) },
        { pos: new Vec3(-5.608, 0, 1.464) },
        { pos: new Vec3(1.508, 0, 1.981) },
    ]
    //rvo
    private _speedCfg = [12, 12, 12, 12];
    private _radiusCfg = [1.5, 1.5];

    // 计数器/ 控制怪物生成比例
    private _createCounter: number = 0;

    // smallMonsterRatio   怪物生成的比例
    private _smallMonsterRatio: number = 11;
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
            const { pos } = this.initMonsterPos[i];

            DataManager.Instance.monsterManager.creatMonster(true, true, pos);
        }
    }

    creatMonster(isDissolveOnce, isAfferentPos = false, pos = new Vec3(0, 0, 0)) {
        let rad = 0;

        // if (this._createCounter >= this._smallMonsterRatio) {
        //     rad = 1;
        //     this._createCounter = 0;
        // } else {
        //     rad = 0;
        //     this._createCounter++;
        // }

        const pool = this._monsterPools[rad];
        if (!pool) {
            console.warn(`No monster pool found for type ${rad}`);
            return;
        }

        const node: Node = pool.getItem();
        const monster: MonsterItem = node.getComponent(MonsterItem);
        if (!monster) return;

        let validPos: Vec3 = null;
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
            bloodNode.setScale(this.bigMonsterBloodBarScale, this.bigMonsterBloodBarScale, this.bigMonsterBloodBarScale)
            redNodeSprite.color = new Color(255, 0, 0)
        } else {
            bloodNode.setScale(this.littleMonsterBloodBar, this.littleMonsterBloodBar, this.littleMonsterBloodBar)
            redNodeSprite.color = new Color(255, 0, 0)
        }
        monster.init(rad, bloodNode, isDissolveOnce);

        const newNode = new Node("tempNode");
        newNode.setScale(1, 0, 1);
        director.getScene().addChild(newNode);
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

                DataManager.Instance.gridSystem.updateNode(node);

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

    private getRayRectangleIntersection(angle: number): Vec2 | null {
        //x cos y sin
        const cosA = Math.cos(angle);
        const sinA = Math.sin(angle);
        const screen = view.getVisibleSize();
        // 矩形边界范围（假设矩形是轴对齐的）
        const bounder: number = 10;
        const xMin = 0 - bounder;
        const xMax = screen.width + bounder;
        const yMin = 0 - bounder;
        const yMax = screen.height + bounder;

        // 处理极端情况
        const epsilon = 0.0001;

        // 从屏幕中心发射射线
        const rayOrigin = new Vec2(screen.width / 2, screen.height / 2);
        let nearestT = Infinity;
        let intersection: Vec2 | null = null;

        // 处理完全垂直或水平的射线
        if (Math.abs(cosA) < epsilon) { // 垂直射线
            return new Vec2(0, sinA > 0 ? yMax : yMin);
        }
        if (Math.abs(sinA) < epsilon) { // 水平射线
            return new Vec2(cosA > 0 ? xMax : xMin, 0);
        }

        // 右边界 x = xMax
        const tRight = (xMax - rayOrigin.x) / cosA;
        const yRight = rayOrigin.y + tRight * sinA;
        if (tRight > epsilon && yRight >= yMin && yRight <= yMax && tRight < nearestT) {
            nearestT = tRight;
            intersection = new Vec2(xMax, yRight);
        }
        // 左边界 x = xMin
        const tLeft = (xMin - rayOrigin.x) / cosA;
        const yLeft = rayOrigin.y + tLeft * sinA;
        if (tLeft > epsilon && yLeft >= yMin && yLeft <= yMax) {
            nearestT = tLeft;
            intersection = new Vec2(xMin, yLeft);
        }
        // 上边界 y = yMax
        const tTop = (yMax - rayOrigin.y) / sinA;
        const xTop = rayOrigin.x + tTop * cosA;
        if (tTop > epsilon && xTop >= xMin && xTop <= xMax && tTop < nearestT) {
            nearestT = tTop;
            intersection = new Vec2(xTop, yMax);
        }

        // 下边界 y = yMin
        const tBottom = (yMin - rayOrigin.y) / sinA;
        const xBottom = rayOrigin.x + tBottom * cosA;
        if (tBottom > epsilon && xBottom >= xMin && xBottom <= xMax && tBottom < nearestT) {
            nearestT = tBottom;
            intersection = new Vec2(xBottom, yMin);
        }

        return intersection;
    }

    private isOnce = false;
    private _framTimes = 0
    protected update(dt: number): void {
        if (DataManager.Instance.isStartGame) {
            if (this._monsterPools.length > 0) {
                const currentMonsterCount = this.monsterParent.children.length;
                const maxMonsterCount = 80;

                if (currentMonsterCount < maxMonsterCount) {
                    this._bornTime += dt;
                    if (this._bornTime > this._bornTimeLimit) {
                        this._bornTime = 0;

                        // 可创建的数量不超过最大限制
                        const spawnCount = Math.min(this._bornSpeed, maxMonsterCount - currentMonsterCount);
                        for (let i = 0; i < spawnCount; i++) {
                            this.creatMonster(false);
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

    public killMonsters(nodes: Node[], isPlayer = false) {

        for (let node of nodes) {
            let monster: MonsterItem = node.getComponent(MonsterItem);
            if (monster) {
                monster.deathAni(isPlayer);
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