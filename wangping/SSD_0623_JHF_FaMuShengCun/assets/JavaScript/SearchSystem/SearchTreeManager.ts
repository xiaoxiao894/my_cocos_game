import { _decorator, Component, Node, Vec3 } from 'cc';
import { DataManager } from '../Global/DataManager';
const { ccclass, property } = _decorator;

@ccclass('SearchTreeManager')
export class SearchTreeManager extends Component {
    // 优先搜索前56个
    searchNumber = 56;

    start() {
        DataManager.Instance.searchTreeManager = this;
    }

    getAttackTargets(player: Node, attackRange: number, maxAngle: number, isPlayer = false): Node[] {
        if (!DataManager.Instance.gridSystem) return;

        const nearby = DataManager.Instance.gridSystem.getNearbyNodes(player.worldPosition, attackRange);
        const forward = player.forward.clone().normalize();
        const result: Node[] = [];

        for (let i = 0; i < nearby.length; i++) {
            const enemy = nearby[i];
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


