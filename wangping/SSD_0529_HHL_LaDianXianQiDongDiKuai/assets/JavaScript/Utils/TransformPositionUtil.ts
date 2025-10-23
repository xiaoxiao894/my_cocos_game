import { Camera, geometry, Mat4, UITransform, Vec2, Vec3 } from "cc";
import { DataManager } from "../Global/DataManager";

export default class TransformPositionUtil {
    
    // 获取点在远近平面之间的比例 (0=近平面, 1=远平面)
    public static getDepthRatio(camera: Camera, worldPos: Vec3): number {
        // 创建逆矩阵
        const inverseMat = new Mat4();
        Mat4.invert(inverseMat, camera.node.worldMatrix);
        
        // 应用矩阵变换
        const localPos = new Vec3();
        Vec3.transformMat4(localPos, worldPos, inverseMat);
        
        const depth = -localPos.z; // 视图空间中的深度值
        // 计算标准化深度 (0到1之间)
        return (depth - camera.near) / (camera.far - camera.near);
    }

    /**
     * 计算点C在AB直线上的投影比例
     * @param a 点A坐标
     * @param b 点B坐标 
     * @param c 点C坐标
     * @returns 投影点到A的距离与AB长度的比例 (范围可能超出[0,1])
     */
    public static getProjectionRatio(a: Vec2, b: Vec2, c: Vec2): number {
        // 计算向量AB和AC
        const ab = b.subtract(a);
        const ac = c.subtract(a);
        
        // 计算AB长度的平方
        const abLengthSq = ab.lengthSqr();
        
        // 如果AB长度接近0，返回0避免除零错误
        if (abLengthSq < Number.EPSILON) {
            return 0;
        }
        
        // 计算投影比例 (向量点积公式)
        const ratio = Vec2.dot(ac, ab) / abLengthSq;
        
        return ratio;
    }


    /**
     * 获取插件位置 (主方法)
     */
    public static getPlugPos(pos: Vec2): Vec3 {
        const camera = DataManager.Instance.mainCamera.camera;
        const ray = camera.screenPointToRay(pos.x, pos.y);
        const lastPos = DataManager.Instance.nowPlug.worldPosition.clone();

        // 1. 计算射线上最近的点
        const closestPoint = this.getClosestPointOnRay(ray, lastPos);
        
        // 2. 应用高度曲线
        closestPoint.y = this.calculateHeight(closestPoint.x, closestPoint.z);
        
        // 3. 边界限制
        //this.applyBoundaryLimits(closestPoint);
        
        // 4. 动态平滑处理
        return this.applySmoothing(lastPos, closestPoint);
    }

    /**
     * 计算射线上距离目标点最近的点
     */
    public static getClosestPointOnRay(ray: geometry.Ray, targetPoint: Vec3): Vec3 {
        const rayDirection = ray.d.normalize();
        const rayToPoint = Vec3.subtract(new Vec3(), targetPoint, ray.o);
        const projection = Vec3.dot(rayToPoint, rayDirection);

        return projection <= 0 
            ? ray.o.clone() 
            : ray.o.add(rayDirection.multiplyScalar(projection));
    }

    /**
     * 高度计算函数 (基于与原点距离)
     */
    public static calculateHeight(x: number, z: number): number {
        const distance = Math.sqrt(x * x + z * z);
        const normalizedDistance = Math.min(distance, 10);
        // 二次曲线平滑过渡：原点高度10，距离10时高度3
        return 3 + 7 * Math.pow(1 - normalizedDistance / 10, 2);
    }

    /**
     * 应用移动边界限制
     */
    public static applyBoundaryLimits(pos: Vec3): void {

        // 移动边界限制
        let moveBoundary: number = 10.0;

        const len = Math.sqrt(pos.x * pos.x + pos.z * pos.z);
        if (len > moveBoundary) {
            const factor = moveBoundary / len;
            pos.x *= factor;
            pos.z *= factor;
        }
    }

    /**
     * 应用动态平滑过渡
     */
    public static applySmoothing(lastPos: Vec3, targetPos: Vec3): Vec3 {

        // 平滑系数 (0.1-1.0，越小越平滑)
        let smoothFactor: number = 0.3;
        // 最大移动距离 (防止瞬间跳跃)
        let maxMoveDistance: number = 5.0;

        // 计算实际移动距离
        const moveDistance = Vec3.distance(lastPos, targetPos);
        
        // 动态调整平滑系数 (移动越快越不平滑)
        const dynamicSmooth = Math.min(smoothFactor, 1 / (moveDistance + 0.1));
        
        // 限制最大移动距离
        if (moveDistance > maxMoveDistance) {
            return lastPos;
        }
        
        // 应用线性插值
        return new Vec3(
            lastPos.x + (targetPos.x - lastPos.x) * dynamicSmooth,
            lastPos.y + (targetPos.y - lastPos.y) * dynamicSmooth,
            lastPos.z + (targetPos.z - lastPos.z) * dynamicSmooth
        );
    }


}