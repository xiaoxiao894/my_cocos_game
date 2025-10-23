import { _decorator, Component, instantiate, Node, Pool } from 'cc';
import { DataManager } from '../Global/DataManager';
import { EntityTypeEnum } from '../Enum/Index';
const { ccclass, property } = _decorator;

@ccclass('RoastDuckManager')
export class RoastDuckManager extends Component {
    private roastDuckPool: Pool<Node> | null = null;
    private roastDuckCount = 300;

    start() {
        DataManager.Instance.roastDuckManager = this;
    }

    init() {
        this.roastDuckPool = new Pool(() => {
            const monsterPrefab = DataManager.Instance.prefabMap.get(EntityTypeEnum.RoastDuck);
            return instantiate(monsterPrefab!);
        }, this.roastDuckCount, (node: Node) => {
            node.removeFromParent();
        })
    }

    create() {
        if (!this.roastDuckPool) return;
        let node = this.roastDuckPool.alloc();
        node.active = true;

        return node;
    }

    onDestroy() {
        this.roastDuckPool.destroy();
    }

    // 回收金币
    onProjectileDead(node) {
        node.active = false;
        this.roastDuckPool.free(node);
    }

    update(deltaTime: number) {

    }
}


