import { _decorator, Component, instantiate, math, Node, Quat, Vec3 } from 'cc';
import { DataManager } from '../Global/DataManager';
import { EntityTypeEnum } from '../Enum/Index';
const { ccclass, property } = _decorator;

@ccclass('ArrowManager')
export class ArrowManager extends Component {
    @property(Node)
    target: Node = null;

    @property
    spacing: number = 2.0;

    arrowNodes: Node[] = [];
    start() {
        // 临时
        DataManager.Instance.arrowTargetNode = this.target;
    }

    update(deltaTime: number) {
        if (!DataManager.Instance.arrowTargetNode && !DataManager.Instance.player && !DataManager.Instance.guideTargetList) return;

        const start = DataManager.Instance.player.node.worldPosition;
        const end = DataManager.Instance.guideTargetList[DataManager.Instance.guideTargetIndex].worldPosition;

        const dir = new Vec3();
        Vec3.subtract(dir, end, start);
        const totalLength = dir.length();

        if (totalLength < 0.01) {
            this.setArrowCount(0);
            return;
        }

        const count = Math.floor(totalLength / this.spacing);
        this.setArrowCount(count);

        dir.normalize();

        if (this.arrowNodes.length <= 0) return;
        
        for (let i = 0; i < count; i++) {
            const arrow = this.arrowNodes[i];
            const pos = new Vec3();
            Vec3.scaleAndAdd(pos, start, dir, this.spacing * i);
            arrow.setWorldPosition(pos);

            const rot = new Quat();
            Quat.fromViewUp(rot, dir, Vec3.UP);
            arrow.setWorldRotation(rot);
        }
    }

    setArrowCount(targetCount: number) {
        // 动态增减箭头
        while (this.arrowNodes.length < targetCount) {
            const prefab = DataManager.Instance.prefabMap.get(EntityTypeEnum.Arrow);
            if (!prefab) return;
            const arrow = instantiate(prefab);
            arrow.setParent(this.node);
            this.arrowNodes.push(arrow);
        }
        while (this.arrowNodes.length > targetCount) {
            const arrow = this.arrowNodes.pop()!;
            arrow.destroy();
        }
    }
}


