import { _decorator, Camera, Component, geometry, Node, PhysicsSystem, tween, Vec2, Vec3, view } from 'cc';
import ItemPool from "../Common/ItemPool";
import { EntityTypeEnum } from "../Enum/Index";
import { MonsterItem } from './Monster';
import { DataManager } from '../Global/DataManager';
import { Simulator } from '../RVO/Simulator';
import Util from '../Common/Util';
import MonsterBorn from './MonsterBorn';
const { ccclass, property } = _decorator;

@ccclass('MonsterManager')
export default class MonsterManager extends Component {
    //怪物节点池
    private _monsterPools: ItemPool[] = [];
    private _monsterTypes: EntityTypeEnum[] = [EntityTypeEnum.centipede, EntityTypeEnum.metalwasp, EntityTypeEnum.pillbug, EntityTypeEnum.pseudoladybug];
    private _dropPool: ItemPool;
    private _bornSpeed: number = 1;
    private _bornTimeLimit: number = 1;
    private _bornTime: number = 0;

    private _dropList: Node[] = [];

    //rvo
    private _speedCfg = [12, 8, 8, 8];
    private _radiusCfg = [2, 1, 1, 1];

    // 计数器/ 控制怪物生成比例
    private _createCounter: number = 0;

    // smallMonsterRatio   怪物生成的比例
    private _smallMonsterRatio: number = 20;
    private _bigMonsterRatio: number = 1;

    protected start(): void {
        DataManager.Instance.monsterManager = this;
    }

    //初始化
    public init() {
        this._monsterPools = [];
        for (let i = 0; i < this._monsterTypes.length; i++) {
            this._monsterPools.push(new ItemPool(this._monsterTypes[i]));
        }
        this._dropPool = new ItemPool(EntityTypeEnum.dropItem);
    }

    private creatMonster() {
        let rad = 0;

        // 每生成 20 个 0，生成一个 1
        if (this._createCounter >= 30) {
            rad = 0;
            this._createCounter = 0; // 重置计数器
        } else {
            rad = 1;
            this._createCounter++;   // 增加计数器
        }

        const pool = this._monsterPools[rad];
        if (!pool) {
            console.warn(`No monster pool found for type ${rad}`);
            return;
        }

        const node: Node = pool.getItem();
        const monster: MonsterItem = node.getComponent(MonsterItem);
        if (!monster) return;

        const pos: Vec3 = MonsterBorn.getWorldBornPos();
        if (!pos) {
            console.log("no pos");
            return;
        }

        // 初始化怪物、设置位置并加入场景
        monster.init(rad);
        node.setWorldPosition(pos);
        this.node.addChild(node);

        // 设置 RVO
        const mass = 1;
        const agentId = Simulator.instance.addAgent(
            Util.v3t2(pos),
            this._radiusCfg[rad],
            this._speedCfg[rad],
            null,
            mass
        );

        const agentObj = Simulator.instance.getAgentByAid(agentId);
        agentObj.neighborDist = this._radiusCfg[rad] * 2;

        monster.agentHandleId = agentId;
    }

    private _framTimes = 0
    protected update(dt: number): void {
        if (this._monsterPools.length > 0) {
            this._bornTime += dt;
            if (this._bornTime > this._bornTimeLimit) {
                this._bornTime = 0;
                for (let i = 0; i < this._bornSpeed; i++) {
                    this.creatMonster();
                }
            }

        }

        // rvo 更新逻辑坐标
        Simulator.instance.run(dt);
        this._framTimes = 0
        for (let index = 0; index < this.node.children.length; index++) {
            const monster = this.node.children[index];
            monster?.getComponent(MonsterItem)?.moveByRvo()
        }
    }

    public killMonsters(nodes: Node[]) {
        for (let node of nodes) {
            let monster: MonsterItem = node.getComponent(MonsterItem);
            if (monster) {
                monster.deathAni();
                //掉落生成
                this.dropItem(node.getWorldPosition().clone());
                DataManager.Instance.gridSystem.removeNode(node);
            }
        }
        console.log(`kill monster`);
    }

    public recycleMonster(index: number, node: Node) {
        if (this._monsterPools[index]) {
            this._monsterPools[index].putItem(node);
        }
    }

    private dropItem(pos: Vec3) {
        let node = this._dropPool.getItem();
        this.node.addChild(node);
        node.setWorldPosition(pos);
        //欠精细化动画
        tween(node).by(0.5, { position: new Vec3(5, 0, 5) }).call(() => {
            this._dropList.push(node);
        }).start();
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

}