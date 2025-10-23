import { _decorator, Component, find, instantiate, math, Node, Quat, Vec3 } from 'cc';
import { DataManager } from '../Global/DataManager';
import { EntityTypeEnum } from '../Enum/Index';
const { ccclass, property } = _decorator;

@ccclass('ArrowManager')
export class ArrowManager extends Component {
    @property(Node)
    arrowNode: Node = null;

    @property(Node)
    target: Node = null;

    @property
    spacing: number = 0.01;

    arrowNodes: Node[] = [];

    private _placingCon: Node = null;
    onLoad() {
        this._placingCon = find("Root/PlacingCon");
    }

    start() {
        // 临时
        DataManager.Instance.arrowTargetNode = this.target;
    }

    update(deltaTime: number) {
        if (!DataManager.Instance.arrowTargetNode && !DataManager.Instance.player && !DataManager.Instance.guideTargetList) return;

        const plot = DataManager.Instance.guideTargetList[DataManager.Instance.guideTargetIndex]
        if (DataManager.Instance.guideTargetList.length > 0 && plot && this._placingCon) {
            const placingPlot = this._placingCon.children.find(itme => {
                return itme.name == `${plot.name}Con`;
            })
            if (placingPlot) {
                if (!DataManager.Instance.sceneManager) {
                    this.setArrowCount(0)
                    DataManager.Instance.arrow3DManager.node.active = false;
                    return;
                }
                DataManager.Instance.arrow3DManager.setFloatingHeightOffset = DataManager.Instance.sceneManager.scene2FloatingHeightOffset;

                const tempWorldPosition = new Vec3(placingPlot.worldPosition.x, 0, placingPlot.worldPosition.z)
                this.createArrowPathTo(tempWorldPosition);
                DataManager.Instance.arrow3DManager.node.active = true;
                DataManager.Instance.arrow3DManager.playFloatingEffect(deltaTime, placingPlot.worldPosition);
            } else {
                this.setArrowCount(0);
                DataManager.Instance.arrow3DManager.node.active = false;
            }
        } else {
            this.setArrowCount(0);
            DataManager.Instance.arrow3DManager.node.active = false;
        }
    }

    // 条件判断
    conditionalJudgment() {
        const player = DataManager.Instance.player.node;
        if (DataManager.Instance.guideTargetIndex == -1) {
            const backpack1 = player.getChildByName("Backpack1");

            if (backpack1 && backpack1.children.length >= 5) {
                DataManager.Instance.guideTargetIndex++;
            }
        }
    }

    createArrowPathTo(targetPos: Vec3) {
        const player = DataManager.Instance.player?.node;
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
            pos.y = 0.2;
            arrow.setWorldPosition(pos);

            const rot = new Quat();
            Quat.fromViewUp(rot, dir, Vec3.UP);
            arrow.setWorldRotation(rot);
        }
    }

    setArrowCount(targetCount: number) {
        const prefab = DataManager.Instance.prefabMap.get(EntityTypeEnum.PathArrow);
        if (!prefab) return;

        while (this.arrowNodes.length < targetCount) {
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


