import { _decorator, Component, EventTouch, Input, input, Node, Quat, TiledUserNodeData, tween, Vec2, Vec3 } from 'cc';
import { DataManager } from '../Globel/DataManager';
const { ccclass, property } = _decorator;

@ccclass('CameraManager')
export class CameraManager extends Component {

    @property(Node)
    cameraNode: Node = null;

    private _maxXRotation: number = 38;  // X轴最大旋转角度

    private _initialPos: Vec3 = new Vec3();  // 摄像机初始位置
    private _theta: number = -Math.PI;
    private _phi: number = Math.PI / 2;
    private _center: Vec3 = new Vec3(-3.929, 3.221, 1.357);
    private _isTouching: boolean = false;
    private _lastTouchPos: Vec2 = new Vec2();
    private _rotationSpeed: number = 0.0045;

    start() {
        DataManager.Instacne.cameraManager = this;

        input.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
        input.on(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
        input.on(Input.EventType.TOUCH_END, this.onTouchEnd, this);
        input.on(Input.EventType.TOUCH_CANCEL, this.onTouchEnd, this);

        this._initialPos = this.cameraNode.getWorldPosition().clone();
        DataManager.Instacne.expansionRadius = 0;
        this._center = new Vec3(-3.929, 3.221, 1.357); // 球心，你可以自定义

        // // 用初始方向计算 theta/phi，确保方向一致
        // const dir = new Vec3(0, 0, 0);
        // Vec3.subtract(dir, this._initialPos, this._center);
        // dir.normalize();
        // this._theta = Math.atan2(dir.x, dir.z);
        // this._phi = Math.acos(dir.y);

        this.updateCameraPosition();
        //this._center = new Vec3(0, 0, 0); // 球心，你可以自定义

        // 用初始方向计算 theta/phi，确保方向一致
        // const dir = new Vec3();
        // Vec3.subtract(dir, this._initialPos, this._center);
        // dir.normalize();
        // this._theta = -this.cameraNode.eulerAngles.y * (Math.PI / 180);
        // this._phi = Math.PI/2 - (this.cameraNode.eulerAngles.x * (Math.PI / 180));
        // this._phi = Math.max(0.1, Math.min(Math.PI - 0.1, this._phi)); // 限制 phi 的范围，避免过度旋转
    }

    onTouchStart(event: EventTouch) {
        DataManager.Instacne.UIManager.hideTitleNode();

        const touch = event.getTouches()[0];
        this._lastTouchPos.set(touch.getLocation().x, touch.getLocation().y);
        this._isTouching = true;
    }

    // 初始化变量
    onTouchMove(event: EventTouch) {
        if (!this._isTouching) return;

        const touch = event.getTouches()[0];
        const delta = new Vec2(
            (touch.getLocation().x - this._lastTouchPos.x) * 0.7,
            (touch.getLocation().y - this._lastTouchPos.y) * 0.7
        );

        this._theta -= delta.x * this._rotationSpeed;
        this._phi -= delta.y * this._rotationSpeed;
        const minPhi = 0.3 * Math.PI;
        const maxPhi = 0.7 * Math.PI;
        this._phi = Math.max(minPhi, Math.min(maxPhi, this._phi));

        //this._phi = Math.max(0.1, Math.min(Math.PI - 0.1, this._phi));

        this.updateCameraPosition(); // 只用统一的方法更新位置

        this._lastTouchPos.set(touch.getLocation());
    }

    updateCameraPosition(smooth: boolean = false) {
        const camPos = new Vec3();
        const center = this._center;
        let radius = DataManager.Instacne.expansionRadius;

        // 统一计算摄像机位置
        const x = center.x + radius * Math.sin(this._phi) * Math.sin(this._theta);
        const y = center.y + radius * Math.cos(this._phi);
        const z = center.z + radius * Math.sin(this._phi) * Math.cos(this._theta);
        camPos.set(x, y, z);

        if (smooth) {
            radius = Math.max(DataManager.Instacne.expansionRadius, 0.001); // 最小值防跳变
            // 平滑移动位置
            tween(this.cameraNode)
                .to(0.15, { position: camPos.clone() })
                .call(() => {
                    let outward = new Vec3();
                    Vec3.subtract(outward, this.cameraNode.worldPosition, center).normalize();

                    const target = new Vec3();
                    if (radius <= 0.001) {
                        const dirX = Math.sin(this._phi) * Math.sin(this._theta);
                        const dirY = Math.cos(this._phi);
                        const dirZ = Math.sin(this._phi) * Math.cos(this._theta);
                        outward = new Vec3(dirX, dirY, dirZ).normalize();
                        Vec3.add(target, camPos, outward.multiplyScalar(10)); // 稍微远一点
                    } else {
                        Vec3.add(target, this.cameraNode.worldPosition, outward);
                    }

                    this.cameraNode.lookAt(target);
                })
                .start();
        } else {
            const target = new Vec3();
            if (radius <= 0.001) {
                // 原地不动，只改变朝向
                camPos.set(this._initialPos);
                this.cameraNode.setWorldPosition(camPos);

                // 构造单位方向向量
                const dirX = Math.sin(this._phi) * Math.sin(this._theta);
                const dirY = Math.cos(this._phi);
                const dirZ = Math.sin(this._phi) * Math.cos(this._theta);
                const outward = new Vec3(dirX, dirY, dirZ).normalize();

                Vec3.add(target, camPos, outward.multiplyScalar(10)); // 稍微远一点
                if (this.cameraNode.eulerAngles.y < -5 && this.cameraNode.eulerAngles.y > -6) {
                    console.log("cameraNode.eulerAngles.y", this.cameraNode.eulerAngles.y, "phi ", this._phi, " theta ", this._theta);
                }

            } else {
                this.cameraNode.setWorldPosition(camPos);
                const outward = new Vec3();
                Vec3.subtract(outward, camPos, center).normalize();


                Vec3.add(target, camPos, outward);
            }
            this.cameraNode.lookAt(target);
        }
    }

    onTouchEnd(event: EventTouch) {
        this._isTouching = false;
    }

    onDestroy() {
        input.off(Input.EventType.TOUCH_START, this.onTouchStart, this)
        input.off(Input.EventType.TOUCH_MOVE, this.onTouchMove, this)
        input.off(Input.EventType.TOUCH_START, this.onTouchEnd, this)
        input.off(Input.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
    }

}


