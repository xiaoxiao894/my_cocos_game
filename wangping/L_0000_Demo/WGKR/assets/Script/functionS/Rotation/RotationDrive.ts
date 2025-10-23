import { _decorator, CCFloat, Component, log, math, Node, NodeSpace, Quat, v3, Vec3 } from 'cc';
import { isFacingTargetHorizontal_vec } from '../../Tool/Index';
const { ccclass, property } = _decorator;


@ccclass('RotationDrive')
export class RotationDrive extends Component {

    @property(CCFloat)
    public angle: number = 30;
    @property(CCFloat)
    public speed: number = 1;
    private tempQ: Quat = new Quat();

    private tempQ2: Quat = new Quat();

    private _vector: Vec3 = new Vec3();
    private _vector2: Vec3 = new Vec3();


    private _fowerVe3: Vec3 = new Vec3();

    public set vector(vector: Vec3) {
        this._vector.set(vector);
        Quat.fromViewUp(this.tempQ, vector, Vec3.UP);
    }


    public rotatLerpLookVector(dt: number) {


        const currentQ = this.node.rotation;
        const targetQ = this.tempQ;

        const deltaQ = this.tempQ2;
        Quat.multiply(deltaQ, targetQ, Quat.invert(this.tempQ2, currentQ));


        // 将差异四元数转换为轴角
        const axis = this._vector2;
        let angle = 0;
        Quat.getAxisAngle(axis, deltaQ);
        angle = Quat.angle(currentQ, targetQ);

        // 强制修正旋转方向（若角度超过 180°，反向旋转）
        if (angle > Math.PI) {
            angle = 2 * Math.PI - angle;
            Vec3.negate(axis, axis);
            Quat.fromAxisAngle(deltaQ, axis, angle);
        }

        // 计算插值
        const t = Math.min(this.speed * dt, 1.0);
        Quat.slerp(this.tempQ2, currentQ, targetQ, t);
        this.node.setRotation(this.tempQ2);


    }
    public isFacingTargetHorizontal_vec(isHeight: boolean = false) {
        let vector: Vec3 = this._vector;
        Vec3.transformQuat(this._fowerVe3, Vec3.FORWARD, this.node.worldRotation);
        this._fowerVe3.normalize();
        return isFacingTargetHorizontal_vec(vector, this._fowerVe3, this.angle, isHeight); //返回是否朝向目标
    }
}


