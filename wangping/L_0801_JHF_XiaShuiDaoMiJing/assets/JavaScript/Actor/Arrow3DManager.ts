import { _decorator, Component, Node, Vec3 } from 'cc';
import { DataManager } from '../Global/DataManager';
const { ccclass, property } = _decorator;

@ccclass('Arrow3DManager')
export class Arrow3DManager extends Component {
    /** 累积的时间，用于驱动 sin 波计算上下浮动 */
    private _floatingTime = 0;

    /** 当前箭头绕 Y 轴的旋转角度（度数） */
    private _floatingRotateY = 0;

    /** 上下浮动的速度（单位 Hz，0.2 ≈ 5 秒完成一次上下浮动） */
    private readonly _floatingSpeed = 0.2;

    /** 上下浮动的振幅（单位：世界坐标系高度，数值越大浮动越明显） */
    private readonly _floatingAmplitude = 0.2;

    /** 箭头整体基准高度偏移（箭头固定悬浮在目标点上方的高度） */
    private _floatingHeightOffset = 5.5;

    /** 箭头自转速度（度/秒，180 表示每秒旋转半圈） */
    private readonly _floatingRotateSpeed = 180;

    get getFloatingHeightOffset() {
        return this._floatingHeightOffset;
    }

    set setFloatingHeightOffset(value) {
        this._floatingHeightOffset = value;
    }

    start(): void {
        DataManager.Instance.arrow3DManager = this;
        this.node.active = false;
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


