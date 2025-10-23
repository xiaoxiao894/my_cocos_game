import { math, Quat, Vec3,Node, Mat4 } from "cc";

export class MathUtils {

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

    /**
     * 世界坐标转局部坐标
     * @param worldPos 世界坐标
     * @param targetNode 目标节点
     * @returns 
     */
    public static worldToLocal(worldPos: Vec3, targetNode: Node): Vec3 {
        // 获取节点的世界变换矩阵的逆矩阵
        const worldMatInv = new Mat4();
        Mat4.invert(worldMatInv, targetNode.worldMatrix);

        // 应用逆矩阵转换坐标
        const localPos = new Vec3();
        Vec3.transformMat4(localPos, worldPos, worldMatInv);

        return localPos;
    }

    /** 四元数转极坐标（弧度） */
    public static quatToPolar(quat: Quat): { pitch: number, yaw: number } {
        // 1. 提取四元数分量
        const { x, y, z, w } = quat;

        // 2. 计算偏航角（yaw，绕Y轴旋转）
        const yaw = Math.atan2(
            2 * (w * y + z * x),
            1 - 2 * (x * x + y * y)
        );

        // 3. 计算俯仰角（pitch，绕X轴旋转）
        const pitch = Math.asin(
            2 * (w * x - y * z)
        );

        // 4. 转换为角度（可选）
        return {
            pitch: pitch,
            yaw: yaw
        };
    }

    /**
     * 将方向向量转换为旋转四元数
     * @param direction 归一化的方向向量（Vec3）
     * @returns 旋转四元数（Quat）
     */
    public static vectorToRotation(direction: Vec3): Quat {
        // 确保向量归一化
        const normalizedDir = direction.clone().normalize();

        // 计算与默认前向（Z轴）的旋转
        const up = Vec3.UP; // 默认上方向（Y轴）
        const quat = new Quat();
        Quat.fromViewUp(quat, normalizedDir, up);

        return quat;
    }

    /** 弧度换算到 0-2PI */
    public static normalizeToTwoPi(rad: number): number {
        return ((rad % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
    }

    /**
     * 根据旋转四元数计算前向方向向量
     * @param rotation 旋转四元数(Quat)
     * @returns 归一化的前向方向向量(Vec3)
     */
    public static rotationToDirection(rotation: Quat): Vec3 {
        // 默认前向向量(Z轴负方向)
        const forward = new Vec3(0, 0, -1);
        // 旋转向量
        const direction = new Vec3();
        Vec3.transformQuat(direction, forward, rotation);
        // 确保归一化
        direction.normalize();
        return direction;
    }

    /** 贝塞尔曲线 */
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