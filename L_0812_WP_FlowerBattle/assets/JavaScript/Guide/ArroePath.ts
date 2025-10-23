import { _decorator, Component, Node, Quat, Vec3 } from 'cc';
import { App } from '../App';
import { GlobeVariable } from '../core/GlobeVariable';
const { ccclass, property } = _decorator;

@ccclass('ArroePath')
export class ArroePath extends Component {

    @property({ tooltip: "箭头间距" })
    spacing: number = 3.0;

    arrowNodes: Node[] = [];
    createArrowPathTo(targetPos: Vec3) {
        const player = App.playerController.getPlayer().node;
        if (!player) return;

        const start = player.worldPosition;
        const dir = new Vec3();
        Vec3.subtract(dir, targetPos, start);
        const totalLength = dir.length();

        if (totalLength < 0.01) {
            this.setArrowCount(0);
            return;
        }

        const count = Math.floor(totalLength / this.spacing);
        this.setArrowCount(count);

        dir.normalize();

        for (let i = 0; i < count; i++) {
            const arrow = this.arrowNodes[i];
            let pos = new Vec3();
            Vec3.scaleAndAdd(pos, start, dir, this.spacing * (i + 1)); // 避免从脚下起始
          //  pos.y = 1;
            arrow.setWorldPosition(pos);

            const rot = new Quat();
            Quat.fromViewUp(rot, dir, Vec3.UP);
            arrow.setWorldRotation(rot);
        }
    }

    setArrowCount(targetCount: number) {

        while (this.arrowNodes.length < targetCount) {
            const arrow = App.poolManager.getNode(GlobeVariable.entifyName.Guid_ArrowPath);
            arrow.setParent(App.sceneNode.guideParent);
            this.arrowNodes.push(arrow);
        }

        while (this.arrowNodes.length > targetCount) {
            const arrow = this.arrowNodes.pop()!;
            App.poolManager.returnNode(arrow);
            arrow.removeFromParent();
        }
    }
    /** 清除所有箭头 */
    clearArrows() {
        if (this.arrowNodes.length === 0) return;

        this.arrowNodes.forEach(arrow => {
            App.poolManager.returnNode(arrow);
            arrow.removeFromParent();
        });
        this.arrowNodes.length = 0;
    }

    // 组件销毁时清理资源
    onDestroy() {
        this.clearArrows();
    }
}


