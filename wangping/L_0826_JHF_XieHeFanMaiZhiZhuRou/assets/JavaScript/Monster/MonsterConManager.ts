import { _decorator, Camera, CCFloat, Component, dynamicAtlasManager, geometry, instantiate, Node, PhysicsSystem, Pool, ProgressBar, Tween, tween, Vec2, Vec3, view } from 'cc';
import { DataManager } from '../Global/DataManager';
import { ItemMonsterManager } from './ItemMonsterManager';
import { MonsterStateDefine } from '../Actor/StateDefine';
import MonsterBorn from './MonsterBorn';
import { EntityTypeEnum } from '../Enum/Index';
const { ccclass, property } = _decorator;

type BirthSlot = {
    point: Node;          // 出生点节点
    busy: boolean;        // 是否已占用
    monster: Node | null; // 当前占用该点的怪
};


@ccclass('MonsterConManager')
export class MonsterConManager extends Component {
    @property({ type: CCFloat, tooltip: "怪物距人物固定距离外生成" })
    raidiusOutSide = 10;

    @property({ type: CCFloat, tooltip: "搜索最大范围" })
    maxSearchRadius = 100;

    @property({ type: CCFloat, tooltip: "半径步进" })
    radiusStep = 1.5;

    @property(Node)
    monsterPosParent: Node = null;

    private _prefabMonsterPool: Pool<Node> | null = null;
    private _prefabMonsterBigPool: Pool<Node> | null = null;
    private _prefabMonsterSmallPool: Pool<Node> | null = null;
    private _prefabMonsterCount: number = 10;

    private _bornSpeed: number = 1;
    private _bornTime: number = 0;

    private _slots: BirthSlot[] = [];
    private _curProbeIdx = 0;         // 轮询指针，避免总从 0 号刷


    private _initMonsters = [
        new Vec3(15.244, 0, -80.255),
        new Vec3(-2.447, 0, -52.506),
        new Vec3(23.322, 0, -59.046),
        new Vec3(-17.406, 0, -64.883),
        new Vec3(13.322, 0, -41.23),
    ]

    // 初始化时生成的怪物是否已经被清光
    private _allInitialMonstersKilled = false;
    private _isOnce = true

    // 判断当前是否有大蜘蛛存在？ 
    private _isMonsterBigExist = false;

    onLoad() {
        this._slots = (this.monsterPosParent?.children ?? []).map(n => ({
            point: n,
            busy: false,
            monster: null
        }));
    }

    start() {
        DataManager.Instance.monsterConMananger = this;
    }

    initMonsters() {
        for (let i = 0; i < this._initMonsters.length; i++) {
            const pos = this._initMonsters[i];

            const slotIdx = this._pickFreeSlotIdx();
            if (slotIdx < 0) break;

            this._spawnAtSlot(slotIdx, true, pos);
        }
    }

    initMonsterConManager() {
        this._prefabMonsterBigPool = new Pool(() => {
            const monsterBigPrefab = DataManager.Instance.prefabMap.get(EntityTypeEnum.MonsterBig);
            return instantiate(monsterBigPrefab!);
        }, this._prefabMonsterCount, (node: Node) => {
            node.removeFromParent();
        })

        this._prefabMonsterSmallPool = new Pool(() => {
            const monsterSmallPrefab = DataManager.Instance.prefabMap.get(EntityTypeEnum.MonsterSmall);
            return instantiate(monsterSmallPrefab);
        }, this._prefabMonsterCount, (node: Node) => {
            node.removeAllChildren();
        })
    }

    createMonsterBig() {
        if (!this._prefabMonsterBigPool) return;

        let node = this._prefabMonsterBigPool.alloc();
        if (node.parent === null) node.setParent(this.node);

        return node;
    }

    createMonsterSmall() {
        if (!this._prefabMonsterSmallPool) return;

        let node = this._prefabMonsterSmallPool.alloc();
        if (node.parent === null) node.setParent(this.node);

        return node;
    }

    // create() {
    //     if (!this._prefabMonsterPool) return;

    //     let node = this._prefabMonsterPool.alloc();
    //     if (node.parent === null) node.setParent(this.node)
    //     node.active = true;

    //     return node;
    // }

    onProjectileDead(node) {
        node.active = false;
        node.removeFromParent();
        node.destroy();
        // this._prefabMonsterPool.free(node);
    }

    /** 
     *  每一个出生点，只能存在一个怪物， 等待这个怪物死亡后，这个出生点，才会出现下一个怪物 
     */
    update(deltaTime: number) {
        if (!DataManager.Instance.gridSystemManager || !this._prefabMonsterPool) return;
        if (this.node.children.length <= 0 && this._isOnce) {
            this._allInitialMonstersKilled = true;
            this._isOnce = false;
        }

        if (!this._allInitialMonstersKilled) return;

        const curMonsterCount = this.node.children.length;
        const maxMonsterCount = DataManager.Instance.maxMonsterCount;

        if (curMonsterCount < maxMonsterCount) {
            this._bornTime += deltaTime;
            if (this._bornTime > DataManager.Instance.bornTimeLimit) {
                this._bornTime = 0;

                const spawnCount = Math.min(this._bornSpeed, maxMonsterCount - curMonsterCount);
                for (let i = 0; i < spawnCount; i++) {
                    const slotIdx = this._pickFreeSlotIdx();
                    if (slotIdx < 0) break;

                    this._spawnAtSlot(slotIdx, false);
                }
            }
        }
    }

    // 指定出生点生成一个怪
    private _spawnAtSlot(slotIdx: number, isAfferentPos = false, pos = new Vec3(0, 0, 0)) {
        const slot = this._slots[slotIdx];
        if (!slot || slot.busy) return;

        let monster = null;
        if (!this._isMonsterBigExist) {
            this._isMonsterBigExist = true;
            monster = this.createMonsterBig();
        } else {
            monster = this.createMonsterSmall();
        }

        let validPos: Vec3 = null;
        if (isAfferentPos) {
            validPos = pos;
        } else {
            validPos = slot.point.getWorldPosition();
        }

        monster.setWorldPosition(validPos);
        this._playSpawnTween(monster);

        const monsterManager: ItemMonsterManager = monster.getComponent(ItemMonsterManager);
        if (monsterManager) monsterManager?.init();

        slot.busy = true;
        slot.monster = monster;

        DataManager.Instance.gridSystemManager.updateNode(monster);
    }

    // 被攻击的怪  
    takeDamageMonster(nodes: Node[], isPlayer = true, whoHitMe) {
        for (let node of nodes) {
            const monster = node.getComponent(ItemMonsterManager);

            if (monster) {
                monster.injuryAni(isPlayer, whoHitMe);
            }
        }
    }

    // 获取攻击目标
    getAttackTargets(player: Node, attackRange: number, maxAngle: number): Node[] {
        if (!DataManager.Instance.gridSystemManager) return;

        const nearby = DataManager.Instance.gridSystemManager.getNearbyNodes(player.worldPosition, attackRange);
        const forward = player.forward.clone().normalize();
        const result: Node[] = [];

        for (const enemy of nearby) {
            if (!enemy.activeInHierarchy) continue;

            const toEnemy = enemy.worldPosition.clone().subtract(player.worldPosition);
            const dist = toEnemy.length();

            if (dist > attackRange) continue;

            toEnemy.normalize();
            const angle = Math.acos(Vec3.dot(forward, toEnemy)) * 180 / Math.PI;

            if (angle <= maxAngle) {
                result.push(enemy);
            }
        }

        return result;
    }

    // 动画
    private _playSpawnTween(node: Node) {
        node.setScale(1, 0, 1);

        tween(node)
            .to(0.15, { scale: new Vec3(1, 1.1, 1) }, { easing: 'quadOut' })
            .to(0.05, { scale: new Vec3(1, 1, 1) }, { easing: 'quadOut' })
            .start();
    }

    /** 轮询寻找一个空闲的出生点索引；找不到返回 -1 */
    private _pickFreeSlotIdx(): number {
        const L = this._slots.length;
        if (L === 0) return -1;

        for (let k = 0; k < L; k++) {
            const i = (this._curProbeIdx + k) % L;
            if (!this._slots[i].busy) {
                this._curProbeIdx = (i + 1) % L;
                return i;
            }
        }
        return -1;
    }

    // 重置数据
    public restoreSlot(monster: Node) {
        const slot = this._slots.find(item => {
            return item.monster == monster;
        })

        if (slot) {
            slot.busy = false;
            slot.monster = null;
        }
    }

    private _resetAllSlot() {
        if (this._slots.length <= 0) return;

        for (let i = 0; i < this._slots.length; i++) {
            const slot = this._slots[i];
            if (!slot) continue;

            slot.busy = false;
            slot.monster = null;
        }
    }

    // 重置怪物容器
    public resetMonsterCon() {
        this._allInitialMonstersKilled = false;
        this._isOnce = true

        for (let i = 0; i < DataManager.Instance.guardrailArr.length; i++) {
            const guardrail = DataManager.Instance.guardrailArr[i];
            if (!guardrail) continue;

            guardrail.attackingMonsterCount = 0;
            guardrail.blood = 250;
            guardrail.node.children[2]?.destroy();
        }

        // 清理网格
        DataManager.Instance.gridSystemManager.clear();

        // 清理当前节点下所有数据
        this.node.removeAllChildren();

        // 重置数据
        this._resetAllSlot();
        this._bornTime = 0;

        // 初始化怪物
        this.initMonsters();
    }
}


