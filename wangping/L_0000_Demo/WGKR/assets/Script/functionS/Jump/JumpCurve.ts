import { Vec3, EventHandler, Node, v2, UITransform, math, CurveRange } from "cc";
import PoolManager, { PoolEnum } from "../../Base/PoolManager";
import JumpSequenceBase from "./JumpSequenceBase";
export class JumpCurve extends JumpSequenceBase {
    _remove(): void {
        PoolManager.instance.setPool(PoolEnum.JumpSequence + JumpCurve, this);
    }
    private flyNode: Node;
    private uiTran: UITransform;
    private endPos: Vec3 = new Vec3;
    private data: CurveMovement = new CurveMovement();


    private jumpSpeed: number = 2.5;

    private curveRange: CurveRange;

    private curveRangeSpeed: CurveRange;


    private startPosX: number = 0;


    public init(jumpNode: Node, endPos: Vec3, jumpPower: number, jumpSpeed: number) {
        this.flyNode = jumpNode;
        this.endPos.set(endPos);
        this.uiTran = jumpNode.getComponent(UITransform);
        this.jumpSpeed = jumpSpeed;
        this.data.fx = endPos.x - jumpNode.worldPosition.x;
        this.startPosX = jumpNode.worldPosition.x;
        this.data.coe = this.solveQuadraticThroughPoints([jumpNode.worldPosition, endPos], jumpPower);
        this.curveRange = null;
        this.curveRangeSpeed = null;
        this._time = 0;
    }

    public setCurveRange(cr: CurveRange) {
        this.curveRange = cr;
        return this;
    }

    public setCurveRangeSpeed(cr: CurveRange) {
        this.curveRangeSpeed = cr;
        return this;
    }



    public move(dt: number): boolean {
        let t = dt * this.jumpSpeed * 2;
        if (this.curveRangeSpeed) {
            let cy = this.curveRangeSpeed.curve.evaluate(this._time);
            t += t * cy;
            t = Math.max(0.01, t);
        }

        if (this._time > 0.9) {
            t *= 0.5;
        }

        this._time += t;


        this._time = Math.min(1, this._time);
        let speed = this.data.fx * this._time;
        let x = this.startPosX + speed;
        let y = this.data.coe.a * x * x + this.data.coe.b * x + this.data.coe.c;
        if (this.curveRange) {
            let cy = this.curveRange.curve.evaluate(this._time) * 256;
            let scale = 1 - Math.abs(this._time - 0.5) / 0.5
            y += cy * scale;
        }
        this.flyNode.setWorldPosition(x, y, 0);
        this.endPosPre(this.flyNode);
        this.uiTran.priority = -this.flyNode.y;
        let isOver = this._time == 1;
        return isOver;
    }


    /**
 * 定点投放
 * print: 需要开始坐标和结束坐标 [[startPosX,startPosY],[endPosX,endPosY]]
 * 
 * */
    private solveQuadraticThroughPoints(point: Vec3[], direction: number) {
        if (point.length != 2) {
            console.error("数量不足");
            return null
        }
        const sx = point[0].x;
        const sy = point[0].y;

        const ex = point[1].x;
        const ey = point[1].y;
        const cx = (sx + ex) / 2;
        let cy = 0;
        if (sy * direction < ey * direction) {
            cy = ey + 64 * direction;
        } else {
            cy = sy + 64 * direction;
        }
        let x1122 = sx * sx - cx * cx;
        let x12 = sx - cx;
        let y12 = sy - cy;
        let x2233 = cx * cx - ex * ex;
        let x23 = cx - ex;
        let y23 = cy - ey;
        let b = (x1122 * y23 - y12 * x2233) / (x1122 * x23 - x2233 * x12);
        let a = (y12 - b * x12) / x1122;
        let c = (sy - a * sx * sx - b * sx);
        return { a, b, c }
    }



}

class CurveMovement {
    coe: {
        a: number;
        b: number;
        c: number;
    }
    ex: number;
    ey: number;
    fx: number;
}



