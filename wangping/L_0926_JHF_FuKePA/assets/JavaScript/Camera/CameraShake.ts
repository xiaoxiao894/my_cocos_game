import { _decorator, Component, Node, Vec3, Quat, math } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('CameraShake')
export class CameraShake extends Component {
    @property({ tooltip: '是否启用位置随机抖动（米）' })
    usePosition: boolean = true;

    @property({ tooltip: '是否启用旋转随机抖动（度）' })
    useRotation: boolean = true;

    @property({ tooltip: '位置抖动强度（最大位移，米）' })
    amplitudePos: number = 0.1;

    @property({ tooltip: '旋转抖动强度（最大欧拉角，度）' })
    amplitudeRotDeg: number = 1.5;

    @property({ tooltip: '随机采样频率（次/秒）' })
    frequency: number = 25;

    @property({ tooltip: '默认持续时间（秒）' })
    defaultDuration: number = 0.35;

    private _active = false;
    private _elapsed = 0;
    private _duration = 0;

    // 采样定时
    private _sampleInterval = 1 / 30;
    private _sampleTimer = 0;

    // 上/下一个目标偏移（用于插值）
    private _prevPosOffset = new Vec3();
    private _nextPosOffset = new Vec3();
    private _prevRotEuler = new Vec3(); // 度
    private _nextRotEuler = new Vec3(); // 度

    // 当前已应用到节点的偏移（用于抵消）
    private _appliedPosOffset = new Vec3();
    private _appliedRotQuat = new Quat(); // 抖动偏移的增量旋转
    private _appliedRotQuatInv = new Quat();

    onLoad() {
        this._appliedRotQuat = Quat.IDENTITY.clone();
        this._appliedRotQuatInv = Quat.IDENTITY.clone();
        this.setFrequency(this.frequency);
    }

    /**
     * 开始一次抖动
     * @param duration 持续时间（秒）
     * @param amplitudePos 位置强度（米）
     * @param amplitudeRotDeg 旋转强度（度）
     */
    public shake(
        duration: number = this.defaultDuration,
        amplitudePos?: number,
        amplitudeRotDeg?: number
    ) {
        if (amplitudePos != null) this.amplitudePos = amplitudePos;
        if (amplitudeRotDeg != null) this.amplitudeRotDeg = amplitudeRotDeg;

        this._duration = Math.max(0, duration);
        this._elapsed = 0;
        this._active = true;

        // 立即生成一个新目标，重置插值
        this._sampleTimer = 0;
        this._prevPosOffset.set(0, 0, 0);
        this._nextPosOffset.set(0, 0, 0);
        this._prevRotEuler.set(0, 0, 0);
        this._nextRotEuler.set(0, 0, 0);

        // 确保已清空历史已应用偏移
        this._clearAppliedOffsets();
        this._resampleTargets(1); // 立即采样一次
    }

    /** 停止抖动并归位 */
    public stop() {
        if (!this._active) return;
        this._active = false;
        this._elapsed = 0;
        this._sampleTimer = 0;
        this._clearAppliedOffsets(); // 把节点从抖动状态还原
    }

    /** 设置采样频率（次/秒） */
    public setFrequency(freq: number) {
        this.frequency = Math.max(1, freq);
        this._sampleInterval = 1 / this.frequency;
    }

    update(dt: number) {
        if (!this._active || this._duration <= 0) return;

        // 时长与衰减
        this._elapsed += dt;
        const tNorm = math.clamp01(this._elapsed / this._duration);
        const falloff = 1 - tNorm;                  // 线性衰减
        // 也可以用缓动：const falloff = 1 - tNorm * tNorm; // easeOutQuad

        // 到时间自动停止
        if (this._elapsed >= this._duration) {
            this.stop();
            return;
        }

        // 采样与插值
        this._sampleTimer += dt;
        let phase = math.clamp01(this._sampleTimer / this._sampleInterval);
        if (this._sampleTimer >= this._sampleInterval) {
            // 进入下一个区间：把 next 变成 prev，生成新的 next
            this._sampleTimer -= this._sampleInterval;
            this._resampleTargets(falloff);
            phase = math.clamp01(this._sampleTimer / this._sampleInterval);
        }

        // 先移除上一帧已应用偏移，避免累积漂移
        this._removeAppliedOffsets();

        // 计算当前插值偏移（乘以衰减）
        const posOffset = this._calcPosOffset(phase, falloff);
        const rotOffsetQuat = this._calcRotOffsetQuat(phase, falloff);

        // 将偏移应用到节点（在“当前基础姿态”上叠加）
        const basePos = this.node.getPosition();
        const baseRot = this.node.getRotation();

        const newPos = new Vec3(
            basePos.x + posOffset.x,
            basePos.y + posOffset.y,
            basePos.z + posOffset.z
        );

        const newRot = new Quat();
        Quat.multiply(newRot, baseRot, rotOffsetQuat);

        this.node.setPosition(newPos);
        this.node.setRotation(newRot);

        // 记录这帧应用的偏移（用于下一帧抵消）
        this._appliedPosOffset.set(posOffset);
        this._appliedRotQuat.set(rotOffsetQuat);
        Quat.invert(this._appliedRotQuatInv, this._appliedRotQuat);
    }

    // —— 私有方法 —— //

    private _resampleTargets(falloff: number) {
        // 下一目标位置偏移（随机单位向量 * 强度 * 衰减）
        if (this.usePosition) {
            const dir = this._randUnitVec3();
            this._prevPosOffset.set(this._nextPosOffset);
            this._nextPosOffset.set(
                dir.x * this.amplitudePos * falloff,
                dir.y * this.amplitudePos * falloff,
                dir.z * this.amplitudePos * falloff
            );
        }

        // 下一目标旋转偏移（欧拉角度，度）
        if (this.useRotation) {
            this._prevRotEuler.set(this._nextRotEuler);
            this._nextRotEuler.set(
                (Math.random() * 2 - 1) * this.amplitudeRotDeg * falloff, // pitch (x)
                (Math.random() * 2 - 1) * this.amplitudeRotDeg * falloff, // yaw (y)
                (Math.random() * 2 - 1) * this.amplitudeRotDeg * falloff  // roll (z)
            );
        }
    }

    private _calcPosOffset(phase: number, falloff: number): Vec3 {
        if (!this.usePosition) return Vec3.ZERO;
        // 在 prev 与 next 之间做线性插值
        const out = new Vec3();
        Vec3.lerp(out, this._prevPosOffset, this._nextPosOffset, phase);
        // 额外乘一次衰减可让插值中段也逐步减弱（可按需保留/去掉）
        out.multiplyScalar(falloff);
        return out;
    }

    private _calcRotOffsetQuat(phase: number, falloff: number): Quat {
        if (!this.useRotation) return Quat.IDENTITY;
        const e = new Vec3();
        e.x = math.lerp(this._prevRotEuler.x, this._nextRotEuler.x, phase) * falloff;
        e.y = math.lerp(this._prevRotEuler.y, this._nextRotEuler.y, phase) * falloff;
        e.z = math.lerp(this._prevRotEuler.z, this._nextRotEuler.z, phase) * falloff;

        const q = new Quat();
        Quat.fromEuler(q, e.x, e.y, e.z);
        return q;
    }

    private _removeAppliedOffsets() {
        if (!this._active) return;
        // 把上一帧的偏移从当前姿态中移除，得到“未抖动的基础姿态”
        const p = this.node.getPosition();
        const r = this.node.getRotation();

        const basePos = new Vec3(
            p.x - this._appliedPosOffset.x,
            p.y - this._appliedPosOffset.y,
            p.z - this._appliedPosOffset.z
        );

        const baseRot = new Quat();
        Quat.multiply(baseRot, r, this._appliedRotQuatInv);

        this.node.setPosition(basePos);
        this.node.setRotation(baseRot);

        // 清空已应用记录
        this._appliedPosOffset.set(0, 0, 0);
        this._appliedRotQuat = Quat.IDENTITY.clone();
        this._appliedRotQuatInv = Quat.IDENTITY.clone();
    }

    private _clearAppliedOffsets() {
        // 与 _removeAppliedOffsets 类似，但只在开始/结束时调用，确保节点姿态回到未抖动状态
        if (!this.node) return;
        if (!this._appliedPosOffset.equals(Vec3.ZERO) || !Quat.equals(this._appliedRotQuat, Quat.IDENTITY)) {
            this._removeAppliedOffsets();
        }
    }

    private _randUnitVec3(): Vec3 {
        // 3D 随机单位向量（均匀分布）
        let x: number, y: number, z: number, lenSq: number;
        do {
            x = Math.random() * 2 - 1;
            y = Math.random() * 2 - 1;
            z = Math.random() * 2 - 1;
            lenSq = x * x + y * y + z * z;
        } while (lenSq === 0 || lenSq > 1);
        const inv = 1 / Math.sqrt(lenSq);
        return new Vec3(x * inv, y * inv, z * inv);
    }
}
