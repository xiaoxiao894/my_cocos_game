import { _decorator, Component, instantiate, Node, Pool } from 'cc';
import { EntityTypeEnum } from '../Enum/Index';
import { DataManager } from '../Global/DataManager';
const { ccclass, property } = _decorator;

@ccclass('PartnerConManager')
export class PartnerConManager extends Component {
    private PartnerPool: Pool<Node> | null = null;
    private partnerCount = 10;

    start() {
        DataManager.Instance.partnerConManager = this;
    }

    init() {
        this.PartnerPool = new Pool(() => {
            const monsterPrefab = DataManager.Instance.prefabMap.get(EntityTypeEnum.Partner);
            return instantiate(monsterPrefab!);
        }, this.partnerCount, (node: Node) => {
            node.removeFromParent();
        })
    }

    create() {
        if (!this.PartnerPool) return;
        let node = this.PartnerPool.alloc();
        node.active = true;

        return node;
    }

    onDestroy() {
        this.PartnerPool.destroy();
    }

    // 回收金币
    onProjectileDead(node) {
        node.active = false;
        this.PartnerPool.free(node);
    }

    // 自动寻怪
    update(dt: number) {
        if (this.node.children.length < 0) return;

        // 攻击到的怪
        const monsters = DataManager.Instance.monsterConMananger.getAttackTargets(this.node, 10, 360);
        const hasMonsters = monsters && monsters.length > 0;

        if (!hasMonsters) return;
        
    }
}


