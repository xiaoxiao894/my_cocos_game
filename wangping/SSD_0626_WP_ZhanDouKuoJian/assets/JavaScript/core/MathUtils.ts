import { _decorator,  Vec3, v3, Quat, Mat4,Node } from 'cc';

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
                tangent = positions[i+1].clone();
                tangent = tangent.subtract(positions[i]);
            } else if (i === positions.length - 1) {
                // 最后一个点：使用前一个点的方向
                tangent = positions[i].clone();
                tangent = tangent.subtract(positions[i-1]);
            } else {
                // 中间点：使用前后点的平均方向
                const prevDir = positions[i].clone();
                prevDir.subtract(positions[i-1]);
                const nextDir = positions[i+1].clone();
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
        if (!targetNode?.isValid) {
            // console.warn('Target node is invalid!');
            return localPos.clone();
        }

        // 确保worldMatrix是最新的
        targetNode.updateWorldTransform();
        
        const worldPos = new Vec3();
        const mat = new Mat4();
        targetNode.getWorldMatrix(mat);
        Vec3.transformMat4(worldPos, localPos, mat);
        
        return worldPos;
    }

    public static signAngle(from: Vec3, to: Vec3, axis: Vec3): number {
        const angle = Vec3.angle(from, to);
        Vec3.cross(tempVec, from, to);
        const sign = Math.sign(axis.x * tempVec.x + axis.y * tempVec.y + axis.z * tempVec.z);
        return angle * sign;
    }

    /**
     * 将欧拉角（弧度制）转换为 forward 向量
     * @param eulerAngles - 欧拉角（弧度制，顺序可能是 XYZ/YXZ，取决于引擎）
     * @returns forward 向量（单位向量，指向物体的前向方向）
     */
    public static eulerToForward(eulerAngles: Vec3): Vec3 {
        // 1. 将欧拉角转换为四元数
        const rotation = new Quat();
        Quat.fromEuler(rotation, eulerAngles.x, eulerAngles.y, eulerAngles.z);

        // 2. 定义默认 forward 方向（Cocos Creator 默认是 -Z 轴）
        const forward = new Vec3(0, 0, -1);

        // 3. 应用旋转
        Vec3.transformQuat(forward, forward, rotation);

        // 4. 归一化（确保是单位向量）
        Vec3.normalize(forward, forward);

        return forward;
    }

    public static bezierCurve(start: Vec3, control: Vec3, end: Vec3, t: number): Vec3 {
        const u = 1 - t;
        const tt = t * t;
        const uu = u * u;

        const p = new Vec3();
        p.x = uu * start.x + 2 * u * t * control.x + tt * end.x;
        p.y = uu * start.y + 2 * u * t * control.y + tt * end.y;
        p.z = uu * start.z + 2 * u * t * control.z + tt * end.z;

        return p;
    }


}