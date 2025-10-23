import { _decorator, Camera, Component, instantiate, Node, UITransform, Vec3, v3 } from 'cc';
import { DataManager } from '../Global/DataManager';
import { EntityTypeEnum } from '../Enum/Index';

const { ccclass, property } = _decorator;

const _tempWorldPos = new Vec3();
const _tempUINodePos = new Vec3();

@ccclass('BossTipConMananger')
export class BossTipConMananger extends Component {
    @property(Camera)
    camera: Camera = null;

    @property(Node)
    canvas: Node = null;

    //@property
    private margin: number = 30;

    private arrowMargin: number = 100;

    private disableLen: number = 120;

    private arrowTargets: { target3D: Node, bossTipNode: Node }[] = [];

    start() {
        DataManager.Instance.BossTipConManager = this;
    }

    update() {
        for (const arrow of this.arrowTargets) {
            this.updateArrowForTarget(arrow);
        }
    }

    addTarget(target3D: Node) {
        const prefab = DataManager.Instance.prefabMap.get(EntityTypeEnum.BoosTip);
        if (!prefab) {
            console.warn("BoosTip prefab not found");
            return;
        }

        const bossTipNode = instantiate(prefab);
        bossTipNode.setParent(this.node);
        bossTipNode.setSiblingIndex(999);

        const tipTransform = bossTipNode.getComponent(UITransform);
        if (tipTransform) {
            tipTransform.anchorPoint.set(0.5, 0.5);
        }

        this.arrowTargets.push({ target3D, bossTipNode });
    }

    removeTarget(target3D: Node) {
        const index = this.arrowTargets.findIndex(a => a.target3D === target3D);
        if (index >= 0) {
            this.arrowTargets[index].bossTipNode.destroy();
            this.arrowTargets.splice(index, 1);
        }
    }

    private updateArrowForTarget({ target3D, bossTipNode }) {
        if (!target3D || !target3D.isValid) return;

        target3D.getWorldPosition(_tempWorldPos);

        //  提高箭头在目标上方
        _tempWorldPos.y += 3.5;

        //  3D → UI 坐标
        this.camera.convertToUINode(_tempWorldPos, this.canvas, _tempUINodePos);

        const canvasTransform = this.canvas.getComponent(UITransform)!;
        const halfW = canvasTransform.contentSize.width / 2;
        const halfH = canvasTransform.contentSize.height / 2;

        //  判断是否在视野内
        const isInView =
            _tempUINodePos.x >= -halfW + this.margin &&
            _tempUINodePos.x <= halfW - this.margin &&
            _tempUINodePos.y >= -halfH + this.margin &&
            _tempUINodePos.y <= halfH - this.margin;

        const arrow = bossTipNode.getChildByName("Arrow");
        bossTipNode.active = true;

        if (isInView) {
            // 屏幕内：箭头归零，位置靠近目标
            if (arrow) arrow.angle = 0;
            bossTipNode.active = false;

            const dist = 100;
            const angleRad = bossTipNode.angle * Math.PI / 180;
            _tempUINodePos.x += -Math.sin(angleRad) * dist;
            _tempUINodePos.y += Math.cos(angleRad) * dist;
            bossTipNode.setPosition(_tempUINodePos);

            if (Math.abs(_tempUINodePos.x) < this.disableLen || Math.abs(_tempUINodePos.y) < this.disableLen) {
                bossTipNode.active = false;
            }

        } else {
            // 屏幕外：箭头指向目标方向
            const dir = _tempUINodePos.clone().normalize();
            if (arrow) arrow.angle = Math.atan2(dir.y, dir.x) * 180 / Math.PI + 90;

            const clampedX = Math.min(Math.max(_tempUINodePos.x, -halfW + this.arrowMargin), halfW - this.arrowMargin);
            const clampedY = Math.min(Math.max(_tempUINodePos.y, -halfH + this.arrowMargin), halfH - this.arrowMargin);

            bossTipNode.setPosition(new Vec3(clampedX, clampedY, 0));

            bossTipNode.active = true;
        }
    }

}
