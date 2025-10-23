import { Vec3, Node, math, game } from 'cc';

/**
 * 3D旋转工具类
 * 提供统一的3D朝向和旋转方法
 */
export class Rotation3DUtils {
    
    /**
     * 让节点朝向指定的方向向量
     * @param node 要旋转的节点
     * @param direction 方向向量
     * @param smoothness 平滑度（0-10，值越大旋转越快，0表示不平滑）
     * @param deltaTime 帧时间间隔，如果不传则自动获取
     */
    public static faceDirection(node: Node, direction: Vec3, smoothness: number = 0, deltaTime?: number): void {
        if (!node || Vec3.equals(direction, Vec3.ZERO)) return;
        
        // 计算目标位置
        const currentPos = node.getWorldPosition();
        const targetPos = new Vec3();
        Vec3.add(targetPos, currentPos, direction);
        
        if (smoothness <= 0) {
            // 直接朝向
            node.lookAt(targetPos);
        } else {
            // 平滑旋转
            this.smoothLookAt(node, targetPos, smoothness, deltaTime);
        }
    }
    
    /**
     * 让节点朝向指定的位置
     * @param node 要旋转的节点
     * @param targetPos 目标位置
     * @param smoothness 平滑度（0-10，值越大旋转越快，0表示不平滑）
     * @param deltaTime 帧时间间隔，如果不传则自动获取
     */
    public static facePosition(node: Node, targetPos: Vec3, smoothness: number = 0, deltaTime?: number): void {
        if (!node) return;
        
        if (smoothness <= 0) {
            // 直接朝向
            node.lookAt(targetPos);
        } else {
            // 平滑旋转
            this.smoothLookAt(node, targetPos, smoothness, deltaTime);
        }
    }
    
    /**
     * 让节点朝向另一个节点
     * @param node 要旋转的节点
     * @param targetNode 目标节点
     * @param smoothness 平滑度（0-10，值越大旋转越快，0表示不平滑）
     * @param deltaTime 帧时间间隔，如果不传则自动获取
     */
    public static faceNode(node: Node, targetNode: Node, smoothness: number = 0, deltaTime?: number): void {
        if (!node || !targetNode) return;
        
        const targetPos = targetNode.getWorldPosition();
        this.facePosition(node, targetPos, smoothness, deltaTime);
    }
    
    /**
     * 根据X方向计算3D旋转角度（兼容2D朝向逻辑）
     * @param directionX X方向值（正数朝右，负数朝左）
     * @returns Y轴旋转角度
     */
    public static calculateYRotationFromX(directionX: number): number {
        // 假设模型默认朝向为Z轴正方向
        // 正X方向旋转0度，负X方向旋转180度
        return directionX > 0 ? 0 : 180;
    }
    
    /**
     * 只更新节点的Y轴旋转（保持水平朝向）
     * @param node 要旋转的节点
     * @param directionX X方向值
     * @param smoothness 平滑度
     * @param deltaTime 帧时间间隔，如果不传则自动获取
     */
    public static updateYRotationFromX(node: Node, directionX: number, smoothness: number = 0, deltaTime?: number): void {
        if (!node || directionX === 0) return;
        
        const targetAngleY = this.calculateYRotationFromX(directionX);
        const currentEulerAngles = node.eulerAngles;
        const targetEulerAngles = new Vec3(currentEulerAngles.x, targetAngleY, currentEulerAngles.z);
        
        if (smoothness <= 0) {
            // 直接设置
            node.eulerAngles = targetEulerAngles;
        } else {
            // 平滑旋转
            this.smoothRotateToEuler(node, targetEulerAngles, smoothness, deltaTime);
        }
    }

    /**
     * 计算基于时间的插值因子
     * @param smoothness 平滑度（0-10，值越大旋转越快）
     * @param deltaTime 帧时间间隔
     * @returns 插值因子
     */
    private static calculateTimeFactor(smoothness: number, deltaTime?: number): number {
        // 如果没有传入deltaTime，则从游戏获取
        const dt = deltaTime !== undefined ? deltaTime : game.deltaTime;
        
        // 基于时间的插值因子计算
        // smoothness * dt 确保在不同帧率下速度一致
        // 添加一个基础系数来调整整体速度
        const timeFactor = smoothness * dt * 5.0; // 5.0 是调整系数，可根据需要调整
        
        // 限制在合理范围内，避免过快的旋转
        return Math.min(1.0, timeFactor);
    }
    
    /**
     * 平滑的lookAt实现
     * @param node 要旋转的节点
     * @param targetPos 目标位置
     * @param smoothness 平滑度
     * @param deltaTime 帧时间间隔
     */
    private static smoothLookAt(node: Node, targetPos: Vec3, smoothness: number, deltaTime?: number): void {
        // 计算目标方向
        const currentPos = node.getWorldPosition();
        const direction = new Vec3();
        Vec3.subtract(direction, targetPos, currentPos);
        
        if (Vec3.equals(direction, Vec3.ZERO)) return;
        
        // 计算目标旋转
        const forward = Vec3.FORWARD.clone();
        const targetRotation = new math.Quat();
        math.Quat.rotationTo(targetRotation, forward, direction.normalize());
        
        // 平滑插值到目标旋转
        const currentRotation = node.getRotation();
        const factor = this.calculateTimeFactor(smoothness, deltaTime);
        math.Quat.slerp(currentRotation, currentRotation, targetRotation, factor);
        node.setRotation(currentRotation);
    }
    
    /**
     * 平滑旋转到指定欧拉角
     * @param node 要旋转的节点
     * @param targetEuler 目标欧拉角
     * @param smoothness 平滑度
     * @param deltaTime 帧时间间隔
     */
    private static smoothRotateToEuler(node: Node, targetEuler: Vec3, smoothness: number, deltaTime?: number): void {
        const currentEuler = node.eulerAngles;
        
        // 处理角度差异，确保选择最短路径
        let targetY = targetEuler.y;
        let currentY = currentEuler.y;
        
        // 处理角度跨越180度的情况
        const angleDiff = targetY - currentY;
        if (angleDiff > 180) {
            targetY -= 360;
        } else if (angleDiff < -180) {
            targetY += 360;
        }
        
        const factor = this.calculateTimeFactor(smoothness, deltaTime);
        
        // 对每个轴进行插值
        const newEuler = new Vec3(
            math.lerp(currentEuler.x, targetEuler.x, factor),
            math.lerp(currentY, targetY, factor),
            math.lerp(currentEuler.z, targetEuler.z, factor)
        );
        
        // 确保Y轴角度在0-360范围内
        if (newEuler.y < 0) {
            newEuler.y += 360;
        } else if (newEuler.y >= 360) {
            newEuler.y -= 360;
        }
        
        node.eulerAngles = newEuler;
    }
    
    /**
     * 检查两个方向是否近似相等
     * @param dir1 方向1
     * @param dir2 方向2
     * @param threshold 阈值
     * @returns 是否近似相等
     */
    public static isDirectionEqual(dir1: Vec3, dir2: Vec3, threshold: number = 0.01): boolean {
        return Vec3.distance(dir1, dir2) < threshold;
    }
    
    /**
     * 将方向向量标准化为水平方向（Y=0）
     * @param direction 原方向向量
     * @returns 水平方向向量
     */
    public static toHorizontalDirection(direction: Vec3): Vec3 {
        const result = direction.clone();
        result.y = 0;
        return result.normalize();
    }
} 