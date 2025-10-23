import { _decorator, CCFloat, Component, log, math, Node, NodePool, NodeSpace, Quat, Vec3 } from 'cc';
import { getPerpendicularVector, isFacingTargetHorizontal_vec, vectorPower2 } from '../../Tool/Index';
const { ccclass, property } = _decorator;


@ccclass('RotationVector')
export class RotationVector extends Component {

    @property(CCFloat)
    public speed: number = 360;
    private tempQ: Quat = new Quat();


    private _vector: Vec3 = new Vec3();

    public setVector(vector: Vec3) {

        this._vector.set(vector);

    }

    public rotate(dt: number) {
        const radians = this.speed * Math.PI / 180 * dt;

        Quat.fromAxisAngle(this.tempQ, this._vector, radians);

        this.node.rotate(this.tempQ);
    }


}


