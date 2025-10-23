import { _decorator, Camera, CCFloat, Component, dynamicAtlasManager, geometry, instantiate, Node, PhysicsSystem, Pool, ProgressBar, tween, Vec2, Vec3, view } from 'cc';
import { DataManager } from '../Global/DataManager';
import { ItemMonsterManager } from './ItemMonsterManager';
import { MonsterStateDefine } from '../Actor/StateDefine';
import MonsterBorn from './MonsterBorn';
import { EntityTypeEnum } from '../Enum/Index';
const { ccclass, property } = _decorator;
const TAU = Math.PI * 2;
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

    private _curMonsterPosIdx = 0;

    private _prefabMonsterPool: Pool<Node> | null = null;
    private _prefabMonsterCount: number = 10;

    private _bornSpeed: number = 1;
    private _bornTime: number = 0;
    start() {
        DataManager.Instance.monsterConMananger = this;

        if (this.node.children.length > 0) {
            for (let i = 0; i < this.node.children.length; i++) {
                const monster = this.node.children[i];
                if (!monster) continue;

                monster.setScale(1, 0, 1);
                tween(monster)
                    .to(0.15, { scale: new Vec3(1, 1.1, 1) }, { easing: 'quadOut' })
                    .to(0.05, { scale: new Vec3(1, 1, 1) }, { easing: 'quadOut' })
                    .start();

                const itemMonsterManager = monster.getComponent(ItemMonsterManager);
                itemMonsterManager.init();

                DataManager.Instance.gridSystemManager.updateNode(monster);
            }
        }
    }

    initMonsterConManager() {
        this._prefabMonsterPool = new Pool(() => {
            const monsterPrefab = DataManager.Instance.prefabMap.get(EntityTypeEnum.Monster);
            return instantiate(monsterPrefab!);
        }, this._prefabMonsterCount, (node: Node) => {
            node.removeFromParent();
        })
    }

    create() {
        if (!this._prefabMonsterPool) return;

        let node = this._prefabMonsterPool.alloc();
        if (node.parent === null) node.setParent(this.node)
        node.active = true;

        return node;
    }

    onProjectileDead(node) {
        node.active = false;
        this._prefabMonsterPool.free(node);
    }

    update(deltaTime: number) {
        if (!DataManager.Instance.gridSystemManager || !this._prefabMonsterPool) return;

        const curMonsterCount = this.node.children.length;
        const maxMonsterCount = DataManager.Instance.maxMonsterCount;

        if (curMonsterCount < maxMonsterCount) {
            this._bornTime += deltaTime;
            if (this._bornTime > DataManager.Instance.bornTimeLimit) {
                this._bornTime = 0;

                const spawnCount = Math.min(this._bornSpeed, maxMonsterCount - curMonsterCount);
                for (let i = 0; i < spawnCount; i++) {
                    this.createMonster(false);
                }
            }
        }
    }

    // 生成怪物
    createMonster(isAfferentPos = false, pos = new Vec3(0, 0, 0), isCustomHp = false) {
        const monster = this.create();

        let validPos: Vec3 = null;
        if (isAfferentPos) {
            validPos = pos;
        } else {
            const birthPoints = this.monsterPosParent.children;
            if (this._curMonsterPosIdx >= birthPoints.length) {
                this._curMonsterPosIdx = 0;
            }
            const birthPoint = birthPoints[this._curMonsterPosIdx];
            validPos = birthPoint.getWorldPosition();
            this._curMonsterPosIdx++;
        }

        monster.setWorldPosition(validPos);
        tween(monster)
            .to(0.15, { scale: new Vec3(1, 1.1, 1) }, { easing: 'quadOut' })
            .to(0.05, { scale: new Vec3(1, 1, 1) }, { easing: 'quadOut' })
            .start();

        const monsterManager: ItemMonsterManager = monster.getComponent(ItemMonsterManager);
        monsterManager.init();

        DataManager.Instance.gridSystemManager.updateNode(monster);
    }

    // 被攻击的怪                   是否是主角， 谁打的我
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

}


