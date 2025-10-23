import { Vec3, EventHandler, Node, v2, UITransform, math, Vec2, sp, log, CurveRange } from "cc";
import PoolManager, { PoolEnum } from "../../Base/PoolManager";
import JumpSequenceBase from "./JumpSequenceBase";




export class JumpCurve3D extends JumpSequenceBase {
    protected _remove(): void {
        PoolManager.instance.setPool(PoolEnum.JumpSequence + JumpCurve3D, this);
    }
    private flyNode: Node;
    private uiTran: UITransform;
    private endPos: Vec3 = new Vec3;
    private jumpSpeed: number = 1;

    private startPos: Vec3 = new Vec3();


    private curveRange: CurveRange;
    private curveRangeSpeed: CurveRange;
    private a: number;
    private b: number;

    public init(jumpNode: Node, endPos: Vec3, jumpPower: number, jumpSpeed: number) {

        this.flyNode = jumpNode;
        this.startPos.set(jumpNode.worldPosition);
        this.endPos.set(endPos);
        this.uiTran = jumpNode.getComponent(UITransform);
        this.jumpSpeed = jumpSpeed;
        this._time = 0;
        let coe = this.solveQuadraticThroughPoints([jumpNode.worldPosition, endPos], jumpPower);
        this.a = coe.a;
        this.b = coe.b;
        this.curveRange = null;
        this.curveRangeSpeed = null;
    }


    public setCurveRange(cr: CurveRange) {
        this.curveRange = cr;
        return this;
    }
    public setCurveRangeSpeed(cr: CurveRange) {
        this.curveRangeSpeed = cr;
        return this;
    }



    protected move(dt: number): boolean {

        let t = dt * this.jumpSpeed * 0.5;
        if (this.curveRangeSpeed) {
            let cy = this.curveRangeSpeed.curve.evaluate(this._time);
            t += t * cy;
            t = Math.max(0.01, t);
        }
        this._time += t;
        this._time = Math.min(1, this._time);
        let pos = this.startPos;
        let x = this._time * this.dis;
        let y = this.a * x * x + this.b * x;
        if (this.curveRange) {
            let cy = this.curveRange.curve.evaluate(this._time) * 4;
            let scale = 1 - Math.abs(this._time - 0.5) / 0.5
            y += cy * scale;
        }
        this.flyNode.setWorldPosition(this.vecctrXZ.x * this._time * this.dis + pos.x, y + pos.y, this.vecctrXZ.y * this._time * this.dis + pos.z);
        this.endPosPre(this.flyNode);
        if (this.uiTran) {
            this.uiTran.priority = -this.flyNode.worldPosition.z + pos.y * 1.5;
        }
        let isOver = this._time == 1;
        return isOver;
    }



    private vecctrXZ: Vec2 = new Vec2();
    private dis: number = 0;
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
        const startPoint = point[0];
        const endtPoint = point[1];
        let x = endtPoint.x - startPoint.x
        let z = endtPoint.z - startPoint.z
        if (startPoint.x == endtPoint.x && startPoint.z == endtPoint.z) {
            x = 0.1;
        }
        this.vecctrXZ.set(x, z);
        this.dis = this.vecctrXZ.length();
        this.vecctrXZ.normalize();
        const d = startPoint.y - endtPoint.y;
        const ey = -d;
        let cy = 0
        if (d >= 0) {
            cy = 1.5 * direction;
        } else {
            cy = ey + 1.5 * direction;;
        }
        const ex = this.dis;
        const cx = ex / 2;
        const x1122 = -cx * cx;
        const x12 = -cx;
        const y12 = -cy;
        const x2233 = cx * cx - ex * ex;
        const x23 = cx - ex;
        const y23 = cy - ey;
        const b = (x1122 * y23 - y12 * x2233) / (x1122 * x23 - x2233 * x12);
        const a = (y12 - b * x12) / x1122;
        return { a, b }
    }

}




