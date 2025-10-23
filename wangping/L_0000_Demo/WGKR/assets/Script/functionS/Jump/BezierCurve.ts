// interface Point {
//     x: number;
//     y: number;

import { Node, sp, UITransform } from "cc";
import PoolManager, { PoolEnum } from "../../Base/PoolManager";
import JumpSequenceBase from "./JumpSequenceBase";
import LayerManager, { SceneType } from "../../Base/LayerManager";

// }
export default class BezierCurve extends JumpSequenceBase {
    private flyNode: Node;
    private uiTran: UITransform;
    private workBuffer: Vector

    private points: Vector[];
    private speed: number = 1;
    public init(flyNode: Node, points: Vector[], speed: number = 1) {
        this.flyNode = flyNode;
        this.uiTran = flyNode.getComponent(UITransform);
        this.points = points;
        this.speed = speed;
        this._time = 0;
    }


    protected move(dt: number): boolean {
        this._time += dt * this.speed;
        if (this._time >= 1) {
            return true;
        }
        const point = BezierCurve.bezierOptimized(this.points, this._time, this.workBuffer);
        this.flyNode.setWorldPosition(point[0], point[1], point[2] ? point[2] : 0);
        this.endPosPre(this.flyNode);
        if (this.uiTran) {
            if (LayerManager.instance.SceneType == SceneType.D2) {
                this.uiTran.priority = -point[1];
            } else {
                this.uiTran.priority = -point[2] + point[1] * 1.5;
            }
        }
        return false;
    }
    protected _remove(): void {
        PoolManager.instance.setPool(PoolEnum.JumpSequence + BezierCurve, this);
    }

    /**
 * 高性能贝塞尔曲线计算 (德卡斯特里奥算法)
 * @param points 控制点数组（每个点用 Float32Array 表示，如2D: [x, y], 3D: [x, y, z]）
 * @param t 参数 t ∈ [0, 1]
 * @param workBuffer 工作缓冲区（可选，用于内存复用）
 * @returns 曲线上的点（Float32Array，直接引用 workBuffer 避免内存分配）
 */
    private static bezierOptimized(points: Vector[], t: number, workBuffer?: Vector): Vector {
        const n = points.length;
        const dim = points[0].length;
        // 初始化工作缓冲区（内存复用）
        const buffer = workBuffer || new Float32Array(dim);
        const temp: Vector[] = [];
        for (let i = 0; i < n; i++) {
            temp[i] = new Float32Array(points[i]); // 初始化第一层
        }
        // 德卡斯特里奥算法优化实现
        for (let level = 1; level < n; level++) {
            const end = n - level;
            for (let i = 0; i < end; i++) {
                const p0 = temp[i];
                const p1 = temp[i + 1];
                const current = temp[i];
                for (let d = 0; d < dim; d++) {
                    current[d] = (1 - t) * p0[d] + t * p1[d];
                }
            }
        }

        // 将结果复制到工作缓冲区（避免返回内部数据引用）
        buffer.set(temp[0]);
        return buffer;
    }



}
export type Vector = Float32Array;