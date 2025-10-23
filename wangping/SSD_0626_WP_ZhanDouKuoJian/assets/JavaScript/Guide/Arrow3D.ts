import { _decorator, Component, Node, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Arrow3D')
export class Arrow3D extends Component {
    private _floatingTime = 0;
    private _floatingRotateY = 0;
    private readonly _floatingSpeed = 0.6;
    private readonly _floatingAmplitude = 0.8;
    private readonly _floatingHeightOffset = 8;
    private readonly _floatingRotateSpeed = 180;

    start(): void {
      //  DataManager.Instance.arrow3DManager = this;
       // this.node.active = false;
    }
    setActive(isActive: boolean) {
        this.node.active = isActive;
    }
    /**
     * 播放立起来跳动 + 自转效果（调用前需设置 _targetVec）
     * @param deltaTime 每帧传入的时间
     * @param targetVec 箭头要跳动的目标位置
     */
    playFloatingEffect(deltaTime: number, targetVec: Vec3) {
        this._floatingTime += deltaTime;

        // 上下浮动
        const floatY = Math.sin(this._floatingTime * 2 * Math.PI * this._floatingSpeed) * this._floatingAmplitude;

        this.node.setWorldPosition(new Vec3(
            targetVec.x,
            targetVec.y + this._floatingHeightOffset + floatY,
            targetVec.z
        ));

        // 自转
        this._floatingRotateY += this._floatingRotateSpeed * deltaTime;
        this._floatingRotateY %= 360;

        this.node.setRotationFromEuler(-270, this._floatingRotateY, 0);
    }
}


