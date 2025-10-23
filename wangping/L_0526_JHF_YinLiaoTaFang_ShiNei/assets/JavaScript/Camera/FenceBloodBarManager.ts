import { _decorator, Component, find, Node, Quat, Vec3 } from 'cc';
const { ccclass, property } = _decorator;


const _lookAtTarget = new Vec3();
const _rotationQuat = new Quat();

@ccclass('FenceBloodBarManager')
export class FenceBloodBarManager extends Component {

    private mainCamera = null;
    private _startRot: Vec3 = new Vec3(-45, 47.5, 0);

    start() {
        let newAngle = new Vec3();
        Vec3.subtract(newAngle, this._startRot, this.node.parent.eulerAngles);
        this.node.eulerAngles = newAngle;
    }

    // update(deltaTime: number) {
    //     if (!this.mainCamera) return;

    //     // 获取摄像机世界位置
    //     const cameraWorldPos = this.mainCamera.worldPosition;

    //     // 设置朝向目标点为摄像机位置
    //     this.node.getWorldPosition(_lookAtTarget);

    //     // 计算从当前节点位置指向摄像机方向的旋转
    //     Vec3.subtract(_lookAtTarget, cameraWorldPos, _lookAtTarget);
    //     _lookAtTarget.normalize();

    //     Quat.fromViewUp(_rotationQuat, _lookAtTarget.negative(), Vec3.UP);

    //     this.node.worldRotation = _rotationQuat;
    // }
}


