import { _decorator, Component, dynamicAtlasManager, instantiate, Node, Pool, ProgressBar, tween, Vec3 } from 'cc';
import { DataManager } from '../Global/DataManager';
import { EntityTypeEnum } from '../Enum/Index';
import { ItemMonsterManager } from './ItemMonsterManager';
import { MonsterStateDefine } from '../Actor/StateDefine';
const { ccclass, property } = _decorator;

@ccclass('MonsterConManager')
export class MonsterConManager extends Component {
    private maxMonsterCount: number = 7;
    private generateRadius: number = 18;
    private regionRadius: number = 1;

    private _monsterCenterPos = new Vec3(-2, 0, -23);

    private _prefabMonsterPool: Pool<Node> | null = null;
    private _prefabMonsterCount: number = 10;
    start() {
        DataManager.Instance.monsterConMananger = this;

    }

    initMonsterConManager() {
        this._prefabMonsterPool = new Pool(() => {
            const monsterPrefab = DataManager.Instance.prefabMap.get(EntityTypeEnum.Monster);
            return instantiate(monsterPrefab!);
        }, this._prefabMonsterCount, (node: Node) => {
            node.removeFromParent();
        })
    }

    onDestroy() {
        this._prefabMonsterPool.destroy();
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

        const activeCount = this.node.children.filter(child => child.active).length;
        const needToAdd = this.maxMonsterCount - activeCount;

        if (needToAdd > 0) {
            const positions = this.generateFixedNonOverlappingPoints(this._monsterCenterPos, this.generateRadius, this.regionRadius, needToAdd)

            for (let i = 0; i < positions.length; i++) {
                const monster = this.create();
                monster.setWorldPosition(positions[i]);

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

    // 固定生成 n 个不重叠位置
    generateFixedNonOverlappingPoints(center: Vec3, radius: number, regionRadius: number, count: number): Vec3[] {
        const positions: Vec3[] = [];
        const maxAttempts = 1000;

        let attempts = 0;
        while (positions.length < count && attempts < maxAttempts) {
            attempts++;

            const angle = Math.random() * Math.PI * 2;
            const r = Math.random() * (radius - regionRadius);
            const x = center.x + Math.cos(angle) * r;
            const z = center.z + Math.sin(angle) * r;
            const y = center.y;

            const candidate = new Vec3(x, y, z);

            // 判断是否与已有点重叠
            let overlapped = false;
            for (const pos of positions) {
                if (Vec3.distance(candidate, pos) < regionRadius * 2) {
                    overlapped = true;
                    break;
                }
            }

            if (!overlapped) {
                positions.push(candidate);
            }
        }

        // 如果失败则使用均匀放置（回退方案）
        if (positions.length < count) {
            // console.warn(`随机生成失败，使用回退均匀网格生成`);
            positions.length = 0;

            const angleStep = (Math.PI * 2) / count;
            const effectiveRadius = radius - regionRadius;
            for (let i = 0; i < count; i++) {
                const angle = i * angleStep;
                const x = center.x + Math.cos(angle) * effectiveRadius;
                const z = center.z + Math.sin(angle) * effectiveRadius;
                const y = center.y;
                positions.push(new Vec3(x, y, z));
            }
        }

        return positions;
    }
}


