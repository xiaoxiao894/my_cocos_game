import { _decorator, Component, Node, Vec3 } from 'cc';
import { DataManager } from '../Global/DataManager';
const { ccclass, property } = _decorator;

@ccclass('SearchMonsters')
export class SearchMonsters extends Component {
    start() {
        DataManager.Instance.searchMonsters = this;    
    }
    
    getAttackTargets(player: Node, attackRange: number, maxAngle: number): Node[] {
        if (!DataManager.Instance.gridSystem) return;

        const nearby = DataManager.Instance.gridSystem.getNearbyNodes(player.worldPosition, attackRange);
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


