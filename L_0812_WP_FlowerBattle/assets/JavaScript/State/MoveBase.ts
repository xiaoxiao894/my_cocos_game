import { _decorator, Component, find, Node, Quat, v3, Vec3 } from 'cc';
import { VirtualInput } from '../UI/VirtuallInput';
const { ccclass, property } = _decorator;

@ccclass('MoveBase')
export class MoveBase extends Component {

    // 添加移动平滑系数
    @property
    moveSmoothFactor: number = 0.2; // 移动平滑系数，值越小越平滑

    // 保存上一帧的移动方向，用于平滑处理
    private lastMoveDir: Vec3 = v3();
    handleInput(dt: number, entity: any) {

        const x = VirtualInput.horizontal;
        const y = VirtualInput.vertical;

        // 如果没有输入，停止移动
        if (x === 0 && y === 0) {
            entity.destForward.set(0, 0, 0);
            return;
        }

        const camNode = find("Main Camera");
        if (!camNode) return;

        // 获取摄像机的世界旋转
        const camRot = camNode.getWorldRotation();

        // 计算基于摄像机的移动方向
        const forward = new Vec3(0, 0, -1);
        const right = new Vec3(1, 0, 0);

        // 将方向向量应用摄像机旋转
        Vec3.transformQuat(forward, forward, camRot);
        Vec3.transformQuat(right, right, camRot);

        // 只保留水平分量
        forward.y = 0;
        right.y = 0;
        forward.normalize();
        right.normalize();

        // 计算最终移动方向
        const moveDir = new Vec3();
        Vec3.scaleAndAdd(moveDir, moveDir, right, x);
        Vec3.scaleAndAdd(moveDir, moveDir, forward, y);
        moveDir.normalize();

        // 对移动方向进行平滑处理，避免突然变化
        if (moveDir.length() > 0.1) {
            moveDir.normalize();
            // 线性插值平滑过渡
            Vec3.lerp(this.lastMoveDir, this.lastMoveDir, moveDir, this.moveSmoothFactor);
            this.lastMoveDir.normalize();
        } else {
            this.lastMoveDir.set(0, 0, 0);
        }

        // 保存目标方向
        entity.destForward.set(this.lastMoveDir);

        // 执行移动和旋转
        this.doMove(dt, entity);
        this.doRotate(dt, entity);
    }

    doMove(dt: number, entity) {
        // 使用目标方向和速度计算位移
        const velocity = v3();
        Vec3.multiplyScalar(velocity, entity.destForward, entity.moveSpeed * dt);

        // 更新位置
        const currentPos = entity.node.getWorldPosition();
        entity.node.setWorldPosition(
            currentPos.x + velocity.x,
            currentPos.y,
            currentPos.z + velocity.z
        );
    }

    doRotate(dt: number, entity) {
        // 如果没有目标方向，不进行旋转
        if (entity.destForward.length() < 0.1) return;

        // 计算目标旋转
        const targetQuat = new Quat();
        Quat.fromViewUp(targetQuat, entity.destForward, Vec3.UP);

        // 平滑旋转到目标方向
        const currentRot = entity.node.getWorldRotation();
        Quat.slerp(currentRot, currentRot, targetQuat, dt * entity.rotateSpeed);

        // 应用旋转
        entity.node.setWorldRotation(currentRot);
    }
}


