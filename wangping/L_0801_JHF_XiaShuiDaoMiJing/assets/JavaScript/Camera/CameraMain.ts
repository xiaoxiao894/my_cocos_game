import { _decorator, Camera, Component, Node, Quat, tween, v3, Vec3 } from 'cc';
import { DataManager } from '../Global/DataManager';
const { ccclass, property } = _decorator;

let tempPos: Vec3 = v3();

@ccclass('CameraMain')
export class CameraMain extends Component {
    @property(Node)
    target: Node | null = null;

    @property(Camera)
    camera: Camera | null = null;

    // 是否引导？
    private isCameraGuiding = false;
    initialDirection: Vec3 = v3();
    start() {
        DataManager.Instance.mainCamera = this;

        Vec3.subtract(this.initialDirection, this.node.worldPosition, this.target!.worldPosition);
    }

    update(dt: number) {
        if (this.isCameraGuiding) return;

        Vec3.add(tempPos, this.target.worldPosition, this.initialDirection);

        if (this.camera) {
            this.camera.node.setWorldPosition(tempPos)
        }
    }


    public overGuide() {
        DataManager.Instance.isGameEnd = true;
        this.isCameraGuiding = true;
        tween(this.camera.node)
            .by(0.8, { worldPosition: new Vec3(20, 0, 0) })
            .delay(2)
            .by(0.8, { worldPosition: new Vec3(-20, 0, 0) })
            .delay(1)
            .call(() => {
                // this.isCameraGuiding = false;
            }).start();
    }


    // 场景震动的效果
    public cameraVibrationEffect() {

    }
}
