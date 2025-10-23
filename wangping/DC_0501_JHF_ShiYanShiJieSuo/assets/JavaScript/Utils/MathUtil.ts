import { _decorator, IVec3Like, Vec3, v3, math } from 'cc';

let tempVec: Vec3 = v3()
let tempVec2: Vec3 = v3()
let tempVec3: Vec3 = v3()
let up = v3()

export class MathUtil {
    static signAngle(from: Vec3, to: Vec3, axis: Vec3): number {
        const angle = Vec3.angle(from, to);
        Vec3.cross(tempVec, from, to);
        const sign = Math.sign(axis.x * tempVec.x + axis.y * tempVec.y + axis.z * tempVec.z);
        return angle * sign;
    }

    static bezierCurve(start: Vec3, control: Vec3, end: Vec3, t: number): Vec3 {
        const u = 1 - t;
        const tt = t * t;
        const uu = u * u;

        const p = new Vec3();
        p.x = uu * start.x + 2 * u * t * control.x + tt * end.x;
        p.y = uu * start.y + 2 * u * t * control.y + tt * end.y;
        p.z = uu * start.z + 2 * u * t * control.z + tt * end.z;

        return p;
    }

    static shuffleArray(array) {
        const result = array.slice();
        for (let i = result.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [result[i], result[j]] = [result[j], result[i]]; // 交换
        }

        return result;
    }
}