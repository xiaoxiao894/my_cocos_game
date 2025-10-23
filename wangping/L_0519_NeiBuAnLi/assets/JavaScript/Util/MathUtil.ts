import { _decorator, IVec3Like, Vec3, v3, math } from 'cc';

let tempVec: Vec3 = v3()
let tempVec2: Vec3 = v3()
let tempVec3: Vec3 = v3()
let up = v3()

/**
 * 通用数学库
 */
export class MathUtil {
    static rotateAround(out: Vec3, v: Vec3, u: Vec3, maxAngleDelta: number) {

        const cos = Math.cos(maxAngleDelta);
        const sin = Math.sin(maxAngleDelta);

        Vec3.multiplyScalar(tempVec, v, cos);

        Vec3.cross(tempVec2, u, v);

        Vec3.scaleAndAdd(tempVec3, tempVec, tempVec2, sin);

        const dot = Vec3.dot(u, v);

        Vec3.scaleAndAdd(out, tempVec3, u, dot * (1.0 - cos));
    }

    static rotateToward(out: Vec3, from: Vec3, to: Vec3, maxAngleDelta: number) {
        Vec3.cross(up, from, to);
        this.rotateAround(out, from, up, maxAngleDelta);
    }

    static signAngle(from: Vec3, to: Vec3, axis: Vec3): number {
        const angle = Vec3.angle(from, to);
        Vec3.cross(tempVec, from, to);
        const sign = Math.sign(axis.x * tempVec.x + axis.y * tempVec.y + axis.z * tempVec.z);
        return angle * sign;
    }

    static staticgetTwoDistinctRandom(arr){
        if (arr.length < 2) return null;

        // 洗牌 + 取前两个
        const shuffled = arr.slice().sort(() => Math.random() - 0.5);
        return [shuffled[0], shuffled[1]];
    }

}

