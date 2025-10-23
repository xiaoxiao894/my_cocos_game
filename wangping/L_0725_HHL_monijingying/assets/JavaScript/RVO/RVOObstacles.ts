import { BoxCollider, Collider, CylinderCollider, Node, Vec3 } from "cc";
import { Vector2 } from "../RVO/Common";
import { Simulator } from "../RVO/Simulator";
/**
 * 每个障碍物需要有Collider组件 目前只支持了 BoxCollider 和 CylinderCollider
 */
export default class RVOObstacles {
    public static addOneObstacle(obstacle:Node){
            let collider:Collider = obstacle.getComponent(Collider);
            if (!collider) return;

            // 获取障碍物世界变换信息
            const worldPos = obstacle.worldPosition;
            const worldRotation = obstacle.worldRotation;
            const worldScale = obstacle.worldScale;

            const vertices = [];
            if (collider instanceof BoxCollider) {
                // 盒子碰撞器 - 精确四个角点
                const size = collider.size.clone();
                size.x *= worldScale.x;
                size.z *= worldScale.z;
                
                // 定义盒子4个顶点（局部空间）
                const halfExtents = new Vec3(size.x / 2, 0, size.z / 2);
                const corners = [
                    new Vec3(-halfExtents.x, 0, -halfExtents.z),
                    new Vec3( halfExtents.x, 0, -halfExtents.z),
                    new Vec3( halfExtents.x, 0,  halfExtents.z),
                    new Vec3(-halfExtents.x, 0,  halfExtents.z)
                ];
                
                // 转换到世界空间
                corners.forEach(corner => {
                    const rotated = Vec3.transformQuat(new Vec3(), corner, worldRotation);
                    vertices.push(new Vector2(
                        worldPos.x + rotated.x,
                        worldPos.z + rotated.z
                    ));
                });
            } else if (collider instanceof CylinderCollider) {
                // 圆柱体碰撞器 - 用6边形近似
                const radius = collider.radius * Math.max(worldScale.x, worldScale.z);
                const segments = 6; // 6边形
                
                for (let j = 0; j <= segments; j++) { // 注意这里 j <= segments 确保闭合
                    const angle = (j / segments) * Math.PI * 2;
                    const x = Math.cos(angle) * radius;
                    const z = Math.sin(angle) * radius;
                    
                    vertices.push(new Vector2(
                        worldPos.x + x,
                        worldPos.z + z
                    ));
                }
            } 

            // 添加到RVO2仿真器
            Simulator.instance.addObstacle(vertices);
    }
}