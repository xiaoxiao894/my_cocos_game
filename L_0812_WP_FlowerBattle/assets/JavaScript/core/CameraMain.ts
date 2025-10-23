import { _decorator, Camera, Component, Node, Quat, tween, v3, Vec3 } from 'cc';
import { GlobeVariable } from './GlobeVariable';

const { ccclass, property } = _decorator;

//let tempPos: Vec3 = v3();
let tempPos: Vec3 = v3();
let tempCurrentPos: Vec3 = v3();
@ccclass('CameraMain')
export class CameraMain extends Component {


    @property(Node)
    target: Node | null = null;

    @property(Camera)  // 修复缺少@符号的问题
    camera: Camera | null = null;

    @property
    smoothFactor: number = 0.8;  // 平滑因子，值越小过渡越平滑

    initialDirection: Vec3 = v3();

    start() {
        // Vec3.subtract(this.initialDirection, this.node.worldPosition, this.target!.worldPosition);
    }

    init() {
        if (this.target) {
            Vec3.subtract(this.initialDirection, this.node.worldPosition, this.target.worldPosition);
            GlobeVariable.isCameraMove = true;
        }
    }

    update(dt: number) {
        if (GlobeVariable.isCameraMove && this.target && this.camera) {
            // 计算目标位置
            Vec3.add(tempPos, this.target.worldPosition, this.initialDirection);

            // 获取当前相机位置
            this.camera.node.getWorldPosition(tempCurrentPos);

            // 使用线性插值平滑过渡到目标位置
            Vec3.lerp(tempCurrentPos, tempCurrentPos, tempPos, this.smoothFactor);

            // 设置相机位置
            this.camera.node.setWorldPosition(tempCurrentPos);
        }
    }
}
