import { _decorator, Vec3, v3, Quat, Mat4, Node } from 'cc';

let tempVec: Vec3 = v3()
let tempVec2: Vec3 = v3()
let tempVec3: Vec3 = v3()
let up = v3()

export class MathUtil {

    /**
     * 生成平滑3D路径
     * @param startPos 起点位置
     * @param endPos 终点位置
     * @param segmentCount 生成的段数
     * @param curveHeight 曲线高度(控制路径弯曲程度)
     * @returns 包含位置和旋转的路径点数组
     */
    public static generateSmoothPath(
        startPos: Vec3,
        endPos: Vec3,
        segmentCount: number = 100,
        curveHeight: number = 5
    ): { position: Vec3, rotation: Quat }[] {
        // 计算结果数组
        const pathPoints: { position: Vec3, rotation: Quat }[] = [];

        // 计算中间控制点(形成曲线顶部)
        const midPoint = Vec3.lerp(new Vec3(), startPos, endPos, 0.5);
        midPoint.y += curveHeight;

        // 计算所有点的位置(二次贝塞尔曲线)
        const positions: Vec3[] = [];
        for (let i = 0; i <= segmentCount; i++) {
            const t = i / segmentCount;
            positions.push(this.quadraticBezier(startPos, midPoint, endPos, t));
        }

        // 计算每个点的旋转角度(基于切线方向)
        for (let i = 0; i < positions.length; i++) {
            let tangent: Vec3;

            if (i === 0) {
                // 第一个点：使用下一个点的方向
                tangent = positions[i + 1].clone();
                tangent = tangent.subtract(positions[i]);
            } else if (i === positions.length - 1) {
                // 最后一个点：使用前一个点的方向
                tangent = positions[i].clone();
                tangent = tangent.subtract(positions[i - 1]);
            } else {
                // 中间点：使用前后点的平均方向
                const prevDir = positions[i].clone();
                prevDir.subtract(positions[i - 1]);
                const nextDir = positions[i + 1].clone();
                nextDir.subtract(positions[i]);
                tangent = prevDir.add(nextDir).multiplyScalar(0.5);
            }

            tangent.normalize();

            // 计算旋转(使物体朝向切线方向)
            const rotation = new Quat();
            if (!tangent.equals(Vec3.ZERO)) {
                const up = new Vec3(0, 1, 0);
                Quat.rotationTo(rotation, up, tangent);
            }

            pathPoints.push({
                position: positions[i],
                rotation
            });
        }

        return pathPoints;
    }

    // 二次贝塞尔曲线辅助函数
    public static quadraticBezier(p0: Vec3, p1: Vec3, p2: Vec3, t: number): Vec3 {
        const u = 1 - t;
        const uu = u * u;
        const tt = t * t;

        const x = uu * p0.x + 2 * u * t * p1.x + tt * p2.x;
        const y = uu * p0.y + 2 * u * t * p1.y + tt * p2.y;
        const z = uu * p0.z + 2 * u * t * p1.z + tt * p2.z;

        return new Vec3(x, y, z);
    }

    // 计算当前旋转与目标旋转之间的角度差（弧度）
    public static getAngleBetweenQuats(currentRot: Quat, targetRot: Quat): number {
        // 计算两个四元数之间的点积
        const dot = Quat.dot(currentRot, targetRot);

        // 确保点积在有效范围内[-1, 1]
        const clampedDot = Math.min(1, Math.max(-1, dot));

        // 返回角度差（弧度）
        return Math.acos(clampedDot) * 2;
    }

    /**
     * 将节点局部坐标转换为世界坐标
     * @param localPos 局部坐标(Vec3)
     * @param targetNode 目标节点(Node)
     * @returns 世界坐标(Vec3)
     */
    public static localToWorldPos3D(localPos: Vec3, targetNode: Node): Vec3 {
        if (!targetNode.isValid) {
            console.warn('Target node is invalid!');
            return localPos.clone();
        }

        const worldPos = new Vec3();
        Vec3.transformMat4(worldPos, localPos, targetNode.worldMatrix);

        return worldPos;
    }

    public static worldToLocal(worldPos: Vec3, targetNode: Node): Vec3 {
        // 获取节点的世界变换矩阵的逆矩阵
        const worldMatInv = new Mat4();
        Mat4.invert(worldMatInv, targetNode.worldMatrix);

        // 应用逆矩阵转换坐标
        const localPos = new Vec3();
        Vec3.transformMat4(localPos, worldPos, worldMatInv);

        return localPos;
    }

}