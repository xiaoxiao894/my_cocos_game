import { _decorator, Component, Node, tween, Vec3 } from 'cc';
import { StackManager } from '../StackSlot/StackManager';
import { DataManager } from '../Global/DataManager';
import { SimplePoolManager } from '../Util/SimplePoolManager';
import { TypeItemEnum } from '../Enum/Index';
const { ccclass, property } = _decorator;

@ccclass('MakeMeatChunksManager')
export class MakeMeatChunksManager extends Component {
    @property(Node)
    meatPaths: Node = null;

    @property(Node)
    collectMeatCon: Node = null;

    private _peakOffsetY = 5;
    private _isProcessing = false;

    private _activeTransferringItems: Set<Node> = new Set();
    start() {

    }

    update(deltaTime: number) {
        if (!this._isProcessing && this.node.children.length > 0 && this.meatPaths && this.meatPaths.children.length > 0) {
            const meat = this._getTopItem();
            if (!meat) return;

            this._isProcessing = true;

            const startPos = meat.getWorldPosition();
            const endPos = this.meatPaths.children[0].worldPosition;
            const midPos = this._getMidPoint(startPos, endPos, this._peakOffsetY)

            meat.setParent(this.node.parent);
            meat.setWorldPosition(startPos);

            const tParam = { t: 0 };
            tween(tParam)
                .to(0.5, { t: 1 }, {
                    onUpdate: () => {
                        const t = tParam.t;
                        const oneMinusT = 1 - t;
                        const p0 = startPos;
                        const p1 = midPos;
                        const p2 = endPos;

                        const current = new Vec3(
                            oneMinusT * oneMinusT * p0.x + 2 * oneMinusT * t * p1.x + t * t * p2.x,
                            oneMinusT * oneMinusT * p0.y + 2 * oneMinusT * t * p1.y + t * t * p2.y,
                            oneMinusT * oneMinusT * p0.z + 2 * oneMinusT * t * p1.z + t * t * p2.z
                        );

                        meat.setWorldPosition(current);
                    },
                    onComplete: () => {
                        this._isProcessing = false;

                        const inflectionPoint = this.meatPaths.children[1]?.worldPosition;
                        const endPoint = this.meatPaths.children[2]?.worldPosition;
                        if (!inflectionPoint) return;

                        tween(meat)
                            .to(0.5, { position: inflectionPoint })
                            .call(() => {
                                SimplePoolManager.Instance.free(TypeItemEnum.Meat, meat);

                                const roastDuck = this._makingRoastDuck(inflectionPoint);
                                roastDuck.setParent(this.node.parent);
                                tween(roastDuck)
                                    .to(0.5, { position: endPoint })
                                    .call(() => {
                                        const stackManager = this.collectMeatCon["__stackManager"];
                                        const slot = stackManager.assignSlot(roastDuck);
                                        if (!slot) {
                                            this._activeTransferringItems.delete(roastDuck);
                                            return;
                                        }
                                        const endPos = stackManager.getSlotWorldPos(slot, this.collectMeatCon);
                                        const midPos = this._getMidPoint(endPoint, endPos, this._peakOffsetY);

                                        const tParam = { t: 0 };
                                        tween(tParam)
                                            .to(0.5, { t: 1 }, {
                                                onUpdate: () => {
                                                    const t = tParam.t;
                                                    const oneMinusT = 1 - t;
                                                    const p0 = endPoint;
                                                    const p1 = midPos;
                                                    const p2 = endPos;
                                                    const current = new Vec3(
                                                        oneMinusT * oneMinusT * p0.x + 2 * oneMinusT * t * p1.x + t * t * p2.x,
                                                        oneMinusT * oneMinusT * p0.y + 2 * oneMinusT * t * p1.y + t * t * p2.y,
                                                        oneMinusT * oneMinusT * p0.z + 2 * oneMinusT * t * p1.z + t * t * p2.z
                                                    );

                                                    roastDuck.setParent(this.collectMeatCon);
                                                    roastDuck.setWorldPosition(current);
                                                },
                                                onComplete: () => {
                                                    roastDuck[`__isReady`] = true;
                                                }
                                            })
                                            .start();
                                    })
                                    .start();
                            })
                            .start();
                    }
                })
                .start();
        }
    }

    // 从槽位最上层获取节点
    private _getTopItem(): Node | null {
        const stackManager: StackManager = this.node[`__stackManager`];
        const lastSlot = stackManager.getLastOccupiedSlot();
        const node = lastSlot?.assignedNode || null;
        if (node) stackManager.releaseSlot(node);
        return node;
    }

    // 曲线控制点
    private _getMidPoint(p0: Vec3, p2: Vec3, peakOffsetY: number) {
        return new Vec3(
            (p0.x + p2.x) / 2,
            Math.max(p0.y, p2.y) + peakOffsetY,
            (p0.z + p2.z) / 2
        )
    }

    // 制作烤鸭
    private _makingRoastDuck(startPos) {
        const roastDuck = SimplePoolManager.Instance.alloc<Node>(TypeItemEnum.Roast);
        roastDuck.active = true;
        roastDuck.setWorldPosition(startPos);
        return roastDuck;
    }

}


