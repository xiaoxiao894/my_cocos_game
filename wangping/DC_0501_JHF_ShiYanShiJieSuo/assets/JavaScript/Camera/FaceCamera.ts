import { _decorator, Component, Node, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('UIFollowTarget')
export class UIFollowTarget extends Component {
    @property({ type: Node })
    target: Node = null;

    private _initialOffset = new Vec3();   // 初始偏移（世界空间下）
    private _targetWorldPos = new Vec3();
    private _finalPos = new Vec3();

    onLoad() {
        if (!this.target) return;

        // 计算初始的世界空间偏移
        const uiWorldPos = this.node.worldPosition;
        const targetWorldPos = this.target.worldPosition;
        Vec3.subtract(this._initialOffset, uiWorldPos, targetWorldPos);
    }

    update(dt: number) {
        if (!this.target) return;

        this.target.getWorldPosition(this._targetWorldPos);
        Vec3.add(this._finalPos, this._targetWorldPos, this._initialOffset);
        this.node.setWorldPosition(this._finalPos);
    }
}
