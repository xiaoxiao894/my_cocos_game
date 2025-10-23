import { _decorator, Camera, Component, Node, Vec3, screen } from 'cc';
import { ThirdPersonCamera } from './ThirdPersonCamera';
import EventManager from '../EventManager/EventManager';
import EventType from '../EventManager/EventType';
const { ccclass, property } = _decorator;

@ccclass('CameraSettings')
export class CameraSettings extends Component {

    @property
    horizontalCameraPos: Vec3 = new Vec3(0, 6, -15)

    @property
    horizontalLookAtOffset: Vec3 = new Vec3(0, 3, -6);

    @property
    verticalCameraPos: Vec3 = new Vec3(0, 8.5, -18.5)

    @property
    verticalLookAtOffset: Vec3 = new Vec3(0, 3, -6);

    @property(Camera)
    mainCamera: Camera

    @property(ThirdPersonCamera)
    thirdPersonCamera: ThirdPersonCamera

    onLoad() {
        EventManager.addEventListener(EventType.VIEW_CANVAS_RESIZE, this.onScreenResize, this)
    }

    protected onDestroy(): void {
        EventManager.remveEventListener(EventType.VIEW_CANVAS_RESIZE, this.onScreenResize, this)
    }

    onScreenResize() {

        if (screen.windowSize.width > screen.windowSize.height) {
            if (this.thirdPersonCamera.target == null) {
                this.mainCamera.node.position = this.horizontalCameraPos;
            }
            this.thirdPersonCamera.lookAtOffset = this.horizontalLookAtOffset;
        } else if (screen.windowSize.width < screen.windowSize.height) {
            if (this.thirdPersonCamera.target == null) {
                this.mainCamera.node.position = this.verticalCameraPos;
            }
            this.thirdPersonCamera.lookAtOffset = this.verticalLookAtOffset;
        }
    }
}

