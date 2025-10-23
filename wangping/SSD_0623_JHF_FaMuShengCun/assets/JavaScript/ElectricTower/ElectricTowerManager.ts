import { _decorator, Component, instantiate, Node, Pool } from 'cc';
import { DataManager } from '../Global/DataManager';
import { EntityTypeEnum } from '../Enum/Index';
const { ccclass, property } = _decorator;

@ccclass('ElectricTowerManager')
export class ElectricTowerManager extends Component {
    private _electricTowerPool: Pool<Node> | null = null;
    private _electricTowerCount: number = 300;

    start(): void {
        DataManager.Instance.electricTowerManager = this;
    }

    electricTowerManagerInit() {
        this._electricTowerPool = new Pool(() => {
            const electricTowerPrefab = DataManager.Instance.prefabMap.get(EntityTypeEnum.Electricity);
            return instantiate(electricTowerPrefab)
        }, this._electricTowerCount, (node: Node) => {
            node.removeFromParent();
        })
    }

    createElectricTower() {
        if (!this._electricTowerPool) return;

        const node = this._electricTowerPool.alloc();
        if (node.parent == null) node.setParent(this.node);
        node.active = true;

        return node;
    }

    onDestroy() {
        this._electricTowerPool.destroy();
    }

    onElectricTowerDead(node) {
        node.active = false;
        this._electricTowerPool.free(node);
    }
}


