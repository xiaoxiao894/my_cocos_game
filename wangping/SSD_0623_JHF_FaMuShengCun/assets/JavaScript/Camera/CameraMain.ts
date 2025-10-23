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

    @property(Node)
    cameraPos: Node = null;

    initialDirection: Vec3 = v3();
    start() {
        DataManager.Instance.mainCamera = this;

        Vec3.subtract(this.initialDirection, this.node.worldPosition, this.target!.worldPosition);

        // this.scheduleOnce(() => {
        //     this.overGuide();
        // }, 4)
    }

    update(dt: number) {
        if (DataManager.Instance.cameraGuiding) return;

        Vec3.add(tempPos, this.target.worldPosition, this.initialDirection);

        if (this.camera) {
            this.camera.node.setWorldPosition(tempPos)
        }
    }

    public overGuide() {
        //结束引导
        DataManager.Instance.cameraGuiding = true;
        // tween(this.node)
        //     .by(0.8, { worldPosition: new Vec3(20, 0, 0) })
        //     .delay(1)
        //     .by(0.8, { worldPosition: new Vec3(-20, 0, 0) })
        //     .call(() => {
        //         DataManager.Instance.cameraGuiding = false;
        //     })
        //     .start();

        tween(this.node)
            .to(1, { position: new Vec3(34.636, 41.019, 35.38) })
            .start();

        const current = { height: this.camera.orthoHeight };
        tween(current)
            .to(1, { height: 35 }, {
                onUpdate: () => {
                    this.camera.orthoHeight = current.height;
                }
            })
            .start();
    }

    // 木头指引
    public woodGuidance() {
        //结束引导
        DataManager.Instance.cameraGuiding = true;
        const curPos = this.node.position.clone();
        tween(this.node)
            .to(1, { worldPosition: new Vec3(this.cameraPos.children[0].position.x, this.cameraPos.children[0].position.y, this.cameraPos.children[0].position.z) })
            .to(2, { worldPosition: new Vec3(this.cameraPos.children[1].position.x, this.cameraPos.children[1].position.y, this.cameraPos.children[1].position.z) })
            .delay(3)
            .to(2, { worldPosition: curPos })
            .call(() => {
                DataManager.Instance.cameraGuiding = false;
            })
            .start();
    }
}
