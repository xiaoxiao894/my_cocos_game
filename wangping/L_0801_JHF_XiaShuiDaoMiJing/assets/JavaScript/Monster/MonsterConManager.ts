import { _decorator, Camera, CCFloat, Component, dynamicAtlasManager, geometry, instantiate, Node, PhysicsSystem, Pool, ProgressBar, tween, Vec2, Vec3, view } from 'cc';
import { DataManager } from '../Global/DataManager';
import { EntityTypeEnum, SceneEnum } from '../Enum/Index';
import { ItemMonsterManager } from './ItemMonsterManager';
import { MonsterStateDefine } from '../Actor/StateDefine';
import MonsterBorn from './MonsterBorn';
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


    private _bornSpeed: number = 1;
    private _bornTime: number = 0;
    start() {
        DataManager.Instance.monsterConMananger = this;
    }

    create() {
        const monsterPrefab = DataManager.Instance.prefabMap.get(EntityTypeEnum.Monster);
        const monsterNode = instantiate(monsterPrefab);
        monsterNode.active = true;

        return monsterNode;
    }

    onProjectileDead(node) {
        node.active = false;
        node.removeFromParent();
    }

    update(deltaTime: number) {
        if (!DataManager.Instance.gridSystemManager || DataManager.Instance.curScene == SceneEnum.Scene1) return;

        const curMonsterCount = this.node.children.length;
        const maxMonsterCount = DataManager.Instance.maxMonsterCount;

        if (curMonsterCount < maxMonsterCount) {
            this._bornTime += deltaTime;
            if (this._bornTime > DataManager.Instance.bornTimeLimit) {
                this._bornTime = 0;

                const spawnCount = Math.min(this._bornSpeed, maxMonsterCount - curMonsterCount);
                for (let i = 0; i < spawnCount; i++) {
                    this.createMonster();
                }
            }
        }

    }

    // 生成怪物
    createMonster() {
        const monster = this.create();
        if (!monster) return;

        const minPlayerRadius = this.raidiusOutSide;        // 最小距离
        const maxSearchRadius = this.maxSearchRadius;       // 搜索最大范围
        const radiusStep = this.radiusStep;                 // 半径步进
        const angleStepDeg = 18;                            // 每圈角度步进
        const useXZOnly = true;                             // 是否仅按XZ算距离
        const useWallClearance = true;                      // 是否启用“贴边安全距离”
        const wallClearance = 3;                            // 贴边安全距离（单位米）

        const pos = this.findSpawnPosEnsured(
            monster,
            minPlayerRadius,
            maxSearchRadius,
            radiusStep,
            angleStepDeg,
            useXZOnly,
            useWallClearance,
            wallClearance
        );

        if (!pos) {
            console.log("no pos");
            return;
        }
        monster.setWorldPosition(pos);
        monster.setParent(this.node)

        monster.setScale(1, 0, 1);
        tween(monster)
            .to(0.15, { scale: new Vec3(1, 1.1, 1) }, { easing: 'quadOut' })
            .to(0.05, { scale: new Vec3(1, 1, 1) }, { easing: 'quadOut' })
            .start();
        const itemMonsterManager = monster.getComponent(ItemMonsterManager);
        itemMonsterManager.init();

        DataManager.Instance.gridSystemManager.updateNode(monster);
    }

    /**
     * 必定返回满足条件的点（如果地图允许）：
     *  - 距离玩家 >= minPlayerRadius
     *  - 不在墙内（isNodeInsideWallArea 返回 false）
     */
    private findSpawnPosEnsured(
        testerNode: Node,
        minPlayerRadius: number,
        maxRadius: number,
        radiusStep: number,
        angleStepDeg: number,
        useXZOnly = true,
        useWallClearance = true,
        clearance = 0.4
    ): Vec3 | null {
        const playerNode = DataManager.Instance.player?.node;
        if (!playerNode || !playerNode.isValid) return null;

        const playerPos = playerNode.worldPosition;
        const angleStep = (angleStepDeg / 180) * Math.PI;

        // 从最小半径开始，一圈一圈往外扩
        for (let r = Math.max(0, minPlayerRadius); r <= maxRadius; r += Math.max(0.001, radiusStep)) {
            // 每圈随机起始角，避免分布呈规律
            const angleOffset = Math.random() * TAU;

            for (let a = 0; a < TAU; a += angleStep) {
                const ang = a + angleOffset;
                const cand = new Vec3(
                    playerPos.x + r * Math.cos(ang),
                    playerPos.y,
                    playerPos.z + r * Math.sin(ang)
                );

                // 1) 距离判定
                const dist = useXZOnly
                    ? Math.hypot(cand.x - playerPos.x, cand.z - playerPos.z)
                    : Vec3.distance(cand, playerPos);
                if (dist < minPlayerRadius) continue;

                // 2) 墙内判定（true=在墙内，false=在墙外）
                testerNode.setWorldPosition(cand);
                if (!DataManager.Instance.sceneManager.isNodeInsideWallArea(testerNode)) {
                    continue;
                }

                if (useWallClearance && clearance > 0) {
                    const dirs = [
                        new Vec3(clearance, 0, 0),
                        new Vec3(-clearance, 0, 0),
                        new Vec3(0, 0, clearance),
                        new Vec3(0, 0, -clearance),
                    ];
                    let nearWall = false;
                    for (const d of dirs) {
                        testerNode.setWorldPosition(cand.x + d.x, cand.y + d.y, cand.z + d.z);
                        if (!DataManager.Instance.sceneManager.isNodeInsideWallArea(testerNode)) {
                            nearWall = true;
                            break;
                        }
                    }
                    if (nearWall) continue;
                }

                // 在墙外，且满足半径/边距
                return cand;
            }
        }

        // 极端：地图几乎全是墙/禁区，返回 null
        return null;
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


