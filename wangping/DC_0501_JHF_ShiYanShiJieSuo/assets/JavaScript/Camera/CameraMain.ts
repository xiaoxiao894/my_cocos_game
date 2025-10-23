import { _decorator, Camera, Component, Node, Quat, tween, v3, Vec3 } from 'cc';
import { DataManager } from '../Global/DataManager';
const { ccclass, property } = _decorator;



@ccclass('CameraMain')
export class CameraMain extends Component {
    @property(Node)
    target: Node | null = null;

    @property(Camera)
    camera: Camera | null = null;

    private initialOffset: Vec3 = v3();
    private initialRotation: Quat = new Quat();
    private _tempPos: Vec3 = v3();

    start() {
        DataManager.Instance.mainCamera = this;
        // 记录初始偏移
        Vec3.subtract(this.initialOffset, this.node.worldPosition, this.target!.worldPosition);

        // 记录初始旋转角度（保持角度不变）
        this.node.getRotation(this.initialRotation);

    }

    update(dt: number) {
        // 按照目标位置 + 初始偏移进行跟随
        if (!DataManager.Instance.cameraGuiding) {
            Vec3.add(this._tempPos, this.target!.worldPosition, this.initialOffset);
            this.node.setWorldPosition(this._tempPos);
        }


        // 固定角度，不再 lookAt
        this.node.setRotation(this.initialRotation);
    }

    public startGuide() {
        //开局引导
        DataManager.Instance.cameraGuiding = true;

        const targetHeight: number = 30;

        tween(this.node).by(1.5, { worldPosition: new Vec3(-30, 0, 0) }).delay(0.5).by(1.5, { worldPosition: new Vec3(30, 0, 0) }, {
            easing: 'sineOut', // 使用缓动函数使动画更自然
            onUpdate: (target, ratio) => {
                // 动态调整正交摄像机大小
                this.camera.orthoHeight = targetHeight + (1 - ratio) * 15;
            }
        }).call(() => {
            DataManager.Instance.cameraGuiding = false;
        }).start();
    }

    public overGuide() {
        //结束引导
        DataManager.Instance.cameraGuiding = true;
        tween(this.node).by(0.8, { worldPosition: new Vec3(20, 0, 0) }).delay(1).by(0.8, { worldPosition: new Vec3(-20, 0, 0) }).call(() => {
            DataManager.Instance.cameraGuiding = false;
        }).start();
    }
}
