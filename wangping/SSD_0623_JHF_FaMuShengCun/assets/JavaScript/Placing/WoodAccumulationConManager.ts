import { _decorator, Component, Node, tween, Vec3, Animation } from 'cc';
import { StackManager } from '../StackSlot/StackManager';
import { DataManager } from '../Global/DataManager';
import { SoundManager } from '../Common/SoundManager';
const { ccclass, property } = _decorator;

@ccclass('WoodAccumulationConManager')
export class WoodAccumulationConManager extends Component {
    // 电锯火光特效
    @property(Node)
    chainsawNode: Node = null;

    @property(Node)
    cutterStart: Node = null;

    @property(Node)
    cutterEnd: Node = null;

    @property(Node)
    conveyerBeltStart: Node = null;

    @property(Node)
    conveyerBeltEnd: Node = null;

    @property(Node)
    cameraPos: Node = null;

    @property(Animation)
    logging: Animation = null;


    private _row = 2;
    private _col = 7;
    private _gapX = 0.7;
    private _gapY = 2;
    private _gapZ = 0.7;
    private _maxLayer = 20000;

    private _isProcessing = false;

    start() {
        if (this.node && !this.node[`__stackManager`]) {
            this.node[`__stackManager`] = new StackManager(this._row, this._col, this._gapX, this._gapY, this._gapZ, this._maxLayer);
        }
    }

    update(deltaTime: number) {
        if (!DataManager.Instance.isContinueFillFireWood) return;
        if (!this.node?.active || this._isProcessing || this.node.children.length <= 0) return;

        const wood = this.getTopItem();
        if (!wood?.isValid) return;

        this._isProcessing = true;
        this._processWood(wood);
    }

    private _processWood(wood: Node) {
        const startPos = wood.getWorldPosition();
        const endPos = this.cutterStart.worldPosition.clone();
        const startRot = wood.eulerAngles.clone();
        const endRot = new Vec3(0, 0, -90);

        const controlPoint = new Vec3(
            (startPos.x + endPos.x) / 2,
            Math.max(startPos.y, endPos.y) + 15,
            (startPos.z + endPos.z) / 2
        );

        const level: number = DataManager.Instance.conveyorLevel;
        const tParam = { t: 0 };

        DataManager.Instance.curQuantityFirewood++;

        tween(tParam)
            .to(0.6 / level, { t: 1 }, {
                easing: 'quadOut',
                onUpdate: () => this._updateBezierMovement(wood, startPos, controlPoint, endPos, startRot, endRot, tParam.t),
                onComplete: () => this._onBezierComplete(wood, endRot)
            })
            .start();
    }

    private _updateBezierMovement(wood: Node, startPos: Vec3, controlPoint: Vec3, endPos: Vec3, startRot: Vec3, endRot: Vec3, t: number) {
        const oneMinusT = 1 - t;

        // 三次贝塞尔插值位置
        const pos = new Vec3(
            oneMinusT * oneMinusT * startPos.x + 2 * oneMinusT * t * controlPoint.x + t * t * endPos.x,
            oneMinusT * oneMinusT * startPos.y + 2 * oneMinusT * t * controlPoint.y + t * t * endPos.y,
            oneMinusT * oneMinusT * startPos.z + 2 * oneMinusT * t * controlPoint.z + t * t * endPos.z
        );
        wood.setWorldPosition(pos);

        // 欧拉角插值
        const euler = new Vec3(
            startRot.x * oneMinusT + endRot.x * t,
            startRot.y * oneMinusT + endRot.y * t,
            startRot.z * oneMinusT + endRot.z * t
        );
        wood.eulerAngles = euler;
    }

    private _onBezierComplete(wood: Node, endRot: Vec3) {
        wood.eulerAngles = endRot;

        const moveStart = wood.getWorldPosition();
        const moveEnd = this.cutterEnd.worldPosition.clone();
        // const level: number = DataManager.Instance.conveyorLevel;
        const moveParam = { t: 0 };
        // / level
        tween(moveParam)
            .to(0.2, { t: 1 }, {
                easing: 'quadInOut',
                onUpdate: () => {
                    const t = moveParam.t;
                    const pos = new Vec3(
                        moveStart.x + (moveEnd.x - moveStart.x) * t,
                        moveStart.y + (moveEnd.y - moveStart.y) * t,
                        moveStart.z + (moveEnd.z - moveStart.z) * t
                    );
                    wood.setWorldPosition(pos);
                },
                onComplete: () => this._onMoveComplete(wood)
            })
            .start();

        if (this.chainsawNode) this.chainsawNode.active = true;
        SoundManager.inst.playAudio('Sounds_jumutou');
    }

    private _onMoveComplete(wood: Node) {
        if (wood?.isValid) {
            wood.removeFromParent();
            // DataManager.Instance.woodManager.onWoodDead(wood); // 如需放回对象池
        }

        this._isProcessing = false;
        if (this.chainsawNode) this.chainsawNode.active = false;
        DataManager.Instance.boardManager.boardAni(this.conveyerBeltStart, this.conveyerBeltEnd);
        // this.logging.pause();
    }


    private getTopItem(): Node | null {
        const stackManager: StackManager = this.node["__stackManager"];
        const lastSlot = stackManager.getLastOccupiedSlot();
        const node = lastSlot?.assignedNode || null;
        if (node) stackManager.releaseSlot(node);
        return node;
    }

    private getMidPoint(p0: Vec3, p2: Vec3, peakOffsetY: number): Vec3 {
        return new Vec3(
            (p0.x + p2.x) / 2,
            Math.max(p0.y, p2.y) + peakOffsetY,
            (p0.z + p2.z) / 2
        );
    }
}


