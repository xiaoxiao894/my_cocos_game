import { _decorator, Component, Node, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('DropItemRotation')
export class DropItemRotation extends Component {
    @property
    rotationSpeed: number = 360; // 默认每秒旋转90度

    private currentRotation: number = 0;
    private isRotation: boolean = false;

    start() {

    }
    setIsRotation(isRotation: boolean) {
        this.isRotation = isRotation;
    }
    update(deltaTime: number) {
        if (this.isRotation) {
            // 计算本次update应该旋转的角度
            this.currentRotation += this.rotationSpeed * deltaTime;
            // 保持角度在0-360范围内
            if (this.currentRotation >= 360) {
                this.currentRotation -= 360;
            }
            // 设置节点的欧拉角，保持X和Z轴不变，只修改Y轴
            this.node.eulerAngles = new Vec3(90, this.currentRotation, 0);
        }

    }
}