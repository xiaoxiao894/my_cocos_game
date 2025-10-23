import { _decorator, Component, instantiate, Node, Pool } from 'cc';
import { DataManager } from '../Global/DataManager';
import { EntityTypeEnum } from '../Enum/Index';
const { ccclass, property } = _decorator;

@ccclass('CoinManager')
export class CoinManager extends Component {
    private _coinPool: Pool<Node> | null = null;
    private _meatCount: number = 300;

    start() {
        DataManager.Instance.coinManager = this;
    }

    init() {
        this._coinPool = new Pool(() => {
            const iconPrefab = DataManager.Instance.prefabMap.get(EntityTypeEnum.GoldCoin);
            return instantiate(iconPrefab!);
        }, this._meatCount, (node: Node) => {
            node.removeFromParent();
        })
    }

    create() {
        if (!this._coinPool) return;
        let node = this._coinPool.alloc();
        if (node.parent === null) node.setParent(this.node)
        node.active = true;

        return node;
    }

    onDestroy() {
        this._coinPool.destroy();
    }

    // 回收金币
    onProjectileDead(node) {
        node.active = false;
        this._coinPool.free(node);
    }

    update(deltaTime: number) {

    }
}


