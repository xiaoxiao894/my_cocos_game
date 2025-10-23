import { _decorator, Component, Node, Quat, v3, Vec3 } from 'cc';
import { CommonEvent } from '../common/CommonEnum';
const { ccclass, property, executeInEditMode } = _decorator;

@ccclass('LookAtCamera')
// @executeInEditMode
export class LookAtCamera extends Component {
    @property(Node)
    private displayNode: Node = null;

    private cameraWorldPosition: Vec3 = new Vec3();
    private isUpdating: boolean = false; // 防止递归调用的标志

    onLoad() {
        app.event.on(CommonEvent.CameraMove, this.onCameraMove, this);
        this.displayNode.on(Node.EventType.TRANSFORM_CHANGED, this.updateLookAt, this);
    }
    
    onDestroy() {
        this.displayNode.off(Node.EventType.TRANSFORM_CHANGED, this.updateLookAt, this);
        app.event.off(CommonEvent.CameraMove, this);
    }

    private onCameraMove(wpos: Vec3) {
        this.cameraWorldPosition = wpos;
        this.updateLookAt(); // 直接调用更新，避免通过事件触发
    }

    private updateLookAt() {
        if (!this.displayNode || this.isUpdating) return;
        
        this.isUpdating = true; // 设置标志，防止递归
        this.displayNode.lookAt(this.cameraWorldPosition);
        this.isUpdating = false; // 重置标志
    }

    protected update(dt: number): void {
        // this.updateLookAt();
    }
}


