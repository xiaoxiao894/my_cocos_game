import { _decorator, Component, Node, Camera, geometry, Vec3, toRadian, Rect, Quat, math, view } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Frustum')
export default class Frustum {


    public static isNodeInFOV(node: Node, camera: Camera): number {
        const cameraPos = camera.node.worldPosition;
        const nodePos = node.worldPosition;
    
        // 计算距离
        const distance = Vec3.distance(cameraPos, nodePos);
        if (distance < camera.near) {
            return 3; // 超出近/远裁剪面
        }else if( distance > camera.far){
            return 4;
        }
    
        // 方向检测（同方法 1 或方法 2）
        return this.isNodeInFOVAngle(node, camera);
    }

    private static isNodeInFOVAngle(node: Node, camera: Camera): number {
        const cameraPos = camera.node.worldPosition;
        const cameraForward =camera.node.forward.normalize();
    
        const nodePos = node.worldPosition;
        const dirToNode = Vec3.subtract(new Vec3(), nodePos, cameraPos).normalize();
    
        // 计算垂直 FOV 夹角
        const angleVerticalRad = Math.acos(Vec3.dot(cameraForward, dirToNode));
        const angleVerticalDeg = math.toDegree(angleVerticalRad);
        const halfFOVVertical = camera.fov / 2;
    
        if (angleVerticalDeg > halfFOVVertical) {
            return 1; // 超出垂直 FOV
        }
    
        // 计算水平 FOV 夹角（通过 aspect 调整）
        const screen=view.getVisibleSize();
        const aspect = screen.width / screen.height; // 或直接使用 camera.aspect（如果可用）
        const halfFOVHorizontal = Math.atan(Math.tan(toRadian(camera.fov) / 2) * aspect);
        const angleHorizontalRad = Math.acos(Vec3.dot(cameraForward, dirToNode));
    
        return angleHorizontalRad <= halfFOVHorizontal?0:2;
    }
}