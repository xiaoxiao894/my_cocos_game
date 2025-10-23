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

    initialDirection: Vec3 = v3();
    start() {
        DataManager.Instance.mainCamera = this;

        Vec3.subtract(this.initialDirection, this.node.worldPosition, this.target!.worldPosition);
    }

    update(dt: number) {
        Vec3.add(tempPos, this.target.worldPosition, this.initialDirection);

        if (this.camera) {
            this.camera.node.setWorldPosition(tempPos)
        }
    }
}
