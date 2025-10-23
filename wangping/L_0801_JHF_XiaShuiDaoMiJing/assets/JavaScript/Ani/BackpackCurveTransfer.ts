import { _decorator, Component, Node, Vec3, v3 } from 'cc';
const { ccclass } = _decorator;

@ccclass('BackpackCurveTransfer')
export class BackpackCurveTransfer extends Component {
    private _sourceBackpack: Node = null;
    private _targetBackpack: Node = null;
    private _stackOffsetY = 0.5;
    private _isTransferring = false;

    public isEnabled = true;
    public interval = 0.3; // 每两个之间的间隔秒数（动画完成后等待）

    /**
     * 开始转移（逐个执行贝塞尔动画）
     * @param from 源背包
     * @param to 目标背包
     */
    transfer(from: Node, to: Node) {
        this._sourceBackpack = from;
        this._targetBackpack = to;
        this._isTransferring = false;
        this._transferNext(); // 立即执行第一个
    }

    private _transferNext() {
        if (!this.isEnabled || this._isTransferring || !this._sourceBackpack) return;

        if (this._sourceBackpack.children.length === 0) {
            this._sourceBackpack = null;
            return;
        }

        const item = this._sourceBackpack.children[this._sourceBackpack.children.length - 1];
        if (!item?.isValid) return;

        this._isTransferring = true;

        const startPos = item.getWorldPosition();
        const endPos = this._getTopStackWorldPos(this._targetBackpack);

        const midPos = new Vec3(
            (startPos.x + endPos.x) / 2,
            Math.max(startPos.y, endPos.y) + 5,
            (startPos.z + endPos.z) / 2
        );

        item.parent = this.node;
        item.setWorldPosition(startPos);

        let t = 0;
        const duration = 0.5;

        const updateFunc = () => {
            t += 1 / (duration * 60);
            if (t >= 1) {
                item.setWorldPosition(endPos);
                item.setParent(this._targetBackpack);

                const localPos = new Vec3();
                this._targetBackpack.inverseTransformPoint(localPos, endPos);
                item.setPosition(localPos);

                this.unschedule(updateFunc);
                this._isTransferring = false;

                // 动画结束后等待间隔，再执行下一个
                this.scheduleOnce(() => {
                    this._transferNext();
                }, this.interval);

                return;
            }

            // 二阶贝塞尔
            const p1 = new Vec3(), p2 = new Vec3(), current = new Vec3();
            Vec3.lerp(p1, startPos, midPos, t);
            Vec3.lerp(p2, midPos, endPos, t);
            Vec3.lerp(current, p1, p2, t);
            item.setWorldPosition(current);
        };

        this.schedule(updateFunc, 1 / 60);
    }

    private _getTopStackWorldPos(target: Node): Vec3 {
        const basePos = target.getWorldPosition();
        let maxY = 0;

        for (const child of target.children) {
            const worldPos = child.getWorldPosition();
            const offsetY = worldPos.y - basePos.y;
            if (offsetY > maxY) {
                maxY = offsetY;
            }
        }

        const targetPos = basePos.clone();
        targetPos.y += maxY + this._stackOffsetY;
        return targetPos;
    }
}
