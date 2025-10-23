import { _decorator, Component, director, Node, SkyboxInfo, Vec3 } from 'cc';
import EventManager from './EventManager/EventManager';
import EventType from './EventManager/EventType';
import CameraShake, { ShakeParam } from './ShakeParam/CameraShake';
const { ccclass, property } = _decorator;

@ccclass('ShakeController')
export class ShakeController extends Component {

    @property
    speedScaler: number = 0.8

    @property
    enableRotation: boolean = true;

    @property
    enableShake: boolean = true;

    @property(Node)
    aircaftNode: Node = null

    @property(Node)
    cameraNode: Node = null

    @property(CameraShake)
    cameraShake: CameraShake = null

    _scaler: number = 1.0;
    _offsetEnable: boolean = false;

    _isFreeze: boolean = false;
    _isDrop: boolean = false;

    _isTapGrounded: boolean = false;
    _isShowInstall: boolean = false;

    _offsetCount: number = 0;
    _offsetAdd: boolean = false;
    _skyboxOffsety: number = 0.0
    _cameraOffsety: number = 0.0

    _skybox: SkyboxInfo = null;

    start() {
        EventManager.addEventListener(EventType.SHOW_INSTALL, this.showInstall, this);
        EventManager.addEventListener(EventType.AIRCAFT_TAP_GROUNDED, this.tapGrounded, this);
        EventManager.addEventListener(EventType.AIRCAFT_START, this.onAircaftStart, this)
        EventManager.addEventListener(EventType.AIRCAFT_DROP, this.onAircaftDrop, this)
        EventManager.addEventListener(EventType.AIRCAFT_FREEZE, this.onAircaftFreeze, this)
        EventManager.addEventListener(EventType.PYSICS_SYSTEM_TIME_SCALE, this.onPhysicsSystemTimeScale, this);
        this._skybox = director.getScene().globals.skybox;
    }

    onDestroy(): void {
        EventManager.remveEventListener(EventType.SHOW_INSTALL, this.showInstall, this);
        EventManager.remveEventListener(EventType.AIRCAFT_TAP_GROUNDED, this.tapGrounded, this);
        EventManager.remveEventListener(EventType.AIRCAFT_FREEZE, this.onAircaftFreeze, this)
        EventManager.remveEventListener(EventType.AIRCAFT_DROP, this.onAircaftDrop, this)
        EventManager.remveEventListener(EventType.AIRCAFT_START, this.onAircaftStart, this)
        EventManager.remveEventListener(EventType.PYSICS_SYSTEM_TIME_SCALE, this.onPhysicsSystemTimeScale, this)
    }

    onPhysicsSystemTimeScale(scaler: number) {
        this._scaler = scaler;
    }

    update(deltaTime: number) {

        if (this.enableRotation) {
            const dt = deltaTime * this._scaler * this.speedScaler;
            this._skybox.rotationAngle += dt;
        }
    }

    protected lateUpdate(deltaTime: number): void {
        if (this.enableShake) {
            this.onShakeUpdate(deltaTime);
        }
    }

    onShakeUpdate(deltaTime: number) {

        if (this._isShowInstall) {
            return;
        }

        if (this._isDrop == false) {
            // 空中
            if (this._offsetEnable && this._isFreeze == false) {

                if (this._offsetAdd) {
                    this._skyboxOffsety += 0.005;
                    this._cameraOffsety += 0.04;
                } else {
                    this._skyboxOffsety -= 0.005;
                    this._cameraOffsety -= 0.04;
                }
                if (this._offsetCount % 2 == 0) {
                    this._offsetAdd = !this._offsetAdd;
                }

                this._offsetCount++;
                this.setOffsetYProperty(this._skyboxOffsety);

                const cameraWorldPos = new Vec3();
                cameraWorldPos.set(this.cameraNode.worldPosition)
                cameraWorldPos.y += this._cameraOffsety;
                this.cameraNode.worldPosition = cameraWorldPos;
            }

        } else {

            // 落地
            const y = this.aircaftNode.worldPositionY;
            this._skyboxOffsety = (y * 0.02);
            this.setOffsetYProperty(this._skyboxOffsety);
        }
    }

    setOffsetYProperty(value: number) {
        const skyboxMaterial = this._skybox.skyboxMaterial;
        skyboxMaterial.setProperty('offsety', value);
        this._skybox.skyboxMaterial = skyboxMaterial;
    }

    onAircaftStart() {
        this._offsetEnable = true;
    }

    onAircaftDrop() {
        this._offsetEnable = false;
        this._isDrop = true;
    }

    onAircaftFreeze(isFreeze: boolean) {
        this._isFreeze = isFreeze;
    }

    tapGrounded(isTap: boolean) {
        this._isTapGrounded = isTap;

        if (this.enableShake) {
            
            this.cameraShake.doCancelShake();

            const shakeParam = new ShakeParam();
            shakeParam.numberOfShakes = 3;
            shakeParam.shakeAmount = new Vec3(0.3, 0.5, 0.4);
            shakeParam.distance = 0.3;
            shakeParam.speed = 30;
            shakeParam.decay = 0.6;
            shakeParam.randomSign = true;

            this.cameraShake.doShake(shakeParam);
        }

    }

    showInstall() {
        this._isShowInstall = true;
    }
}

