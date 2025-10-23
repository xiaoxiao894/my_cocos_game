import { _decorator, Component, director, instantiate, Node, Pool, Prefab, tween, Vec3 } from 'cc';
import { DataManager } from '../Global/DataManager';
import { Bullet } from './Bullet';
const { ccclass, property } = _decorator;

@ccclass('GunTurretManager')
export class GunTurretManager extends Component {
    @property(Prefab)
    projectile: Prefab | null = null;

    prefabPool: Pool<Node> | null = null;

    // 是否普通攻击
    private isNormalAttacking = true;
    init() {
        const poolCount = 5;

        this.prefabPool = new Pool(() => {
            return instantiate(this.projectile!)
        }, poolCount, (node: Node) => {
            node.removeFromParent();
        })
    }

    onDestroy() {
        this.prefabPool.destroy();
    }

    create() {
        if (!this.prefabPool) return;
        let node = this.prefabPool.alloc();
        if (node.parent == null) {
            director.getScene().addChild(node);
        }
        node.active = true;
        return node;
    }

    onProjectileDead(node) {
        node.active = false;
        this.prefabPool.free(node);
    }

    update(dt: number) {
        const monsters = DataManager.Instance.searchMonsters.getAttackTargets(this.node, 50, 180);
        if (!monsters.length) return;

        const partnerWorldPos = this.node.worldPosition;

        const nearestMonster = this.getNearestMonster(monsters, partnerWorldPos);

        if (nearestMonster && this.isNormalAttacking) {
            this.fireAtTarget(nearestMonster);
            this.isNormalAttacking = false;

            this.scheduleOnce(() => {
                this.isNormalAttacking = true;
            }, 3)
        }
    }

    fireAtTarget(target: Node) {
        const bullet = this.create();
        if (!bullet) return;
        const newBulletPos = new Vec3(this.node.worldPosition.x, this.node.worldPosition.y + 10, this.node.worldPosition.z);
        bullet.setWorldPosition(newBulletPos);

        const bulletComp = bullet.getComponent(Bullet);
        if (bulletComp) {
            bulletComp.target = target;
            bulletComp.speed = 40;
        }
    }

    // 获取离伙伴最近的怪物
    getNearestMonster(monsters, partnerPos: Vec3) {
        let nearest: Node | null = null;
        let minDistance = Infinity;

        for (let monster of monsters) {
            if (!monster || !monster.isValid) continue;

            const monsterPos = monster.worldPosition;
            const distance = Vec3.distance(monsterPos, partnerPos);

            if (distance < minDistance) {
                minDistance = distance;
                nearest = monster;
            }
        }

        return nearest;
    }
}


