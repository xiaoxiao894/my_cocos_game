// import { _decorator, Component, Node, tween, Vec3, Quat, math, Tween, TweenEasing } from 'cc';
// const { ccclass, property } = _decorator;

// @ccclass('NodeRotator')
// export class NodeRotator extends Component {
//     start() {
//         this.scheduleOnce(() => {
//             this.rotator();
//         }, 2);
//     }
//     rotator() {

//         // 持续旋转（绕Y轴每秒旋转360度）
//         tween(this.node)
//             .by(2, { eulerAngles: new Vec3(0, 360, 0) }) // 相对旋转
//             .repeatForever() // 永久重复
//             .start();
//     }
// }


import { _decorator, Component, Node, Vec3, Quat, math, CCBoolean, CCInteger, CCFloat } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('NodeRotator')
export class NodeRotator extends Component {

    @property({ type: CCInteger, tooltip: '最大旋转速度 (度/秒)' })
    maxRotationSpeed: number = 360; // 每秒360度（1圈/秒）

    @property({ type: CCFloat, tooltip: '加速时间 (秒)' })
    accelerationTime: number = 2; // 从0加速到最大速度所需时间

    @property({ type: CCBoolean, tooltip: '顺时针旋转' })
    clockwise: boolean = true;

    @property({ type: CCBoolean, tooltip: '逆向旋转' })
    reverse: boolean = false; // 新增属性，用于控制是否逆向旋转

    @property({ type: Vec3, tooltip: '旋转轴' })
    rotateAxis: Vec3 = new Vec3(0,1,0); // 默认绕Y轴旋转

    private _currentSpeed: number = 0; // 当前旋转速度 (度/秒)
    private _isRotating: boolean = false;
    private _rotationProgress: number = 0; // 当前旋转角度（度）
    private _initialRotation: Quat = new Quat(); // 初始旋转状态

    start() {
        // 保存初始旋转状态
        this.node.getRotation(this._initialRotation);

       // this.scheduleOnce(() => {
            this.startRotation();
       // }, 5); // 延迟1秒开始旋转，便于观察
    }

    startRotation() {
        if (this._isRotating) return;

        this._isRotating = true;
        this._currentSpeed = 0;
        this._rotationProgress = 0;
    }

    stopRotation() {
        this._isRotating = false;
    }

    resetRotation() {
        this.stopRotation();
        this.node.setRotation(this._initialRotation);
        this._rotationProgress = 0;
    }

    toggleDirection() {
        this.clockwise = !this.clockwise;
    }

    // 新增方法：设置逆向旋转状态
    setReverse(reverse: boolean) {
        this.reverse = reverse;
    }

    protected update(dt: number) {
        if (!this._isRotating) return;

        // 1. 计算加速度 (度/秒²)
        const acceleration = this.maxRotationSpeed / this.accelerationTime;

        // 2. 更新当前速度（线性加速）
        if (this._currentSpeed < this.maxRotationSpeed) {
            this._currentSpeed += acceleration * dt;
            // 确保不超过最大速度
            this._currentSpeed = Math.min(this._currentSpeed, this.maxRotationSpeed);
        }

        // 3. 计算本帧旋转角度
        // 修改旋转方向计算，同时考虑clockwise和reverse参数
        const direction = (this.clockwise !== this.reverse) ? 1 : -1;
        const rotationAmount = this._currentSpeed * dt * direction;
        this._rotationProgress += rotationAmount;

        // 4. 应用旋转
        this.applyRotation();
    }

    private applyRotation() {
        // 创建旋转四元数
        const rotationQuat = new Quat();
        Quat.fromEuler(rotationQuat, 
            this.rotateAxis.x * this._rotationProgress,
            this.rotateAxis.y * this._rotationProgress,
            this.rotateAxis.z * this._rotationProgress
        );

        // 应用旋转
        this.node.setRotation(rotationQuat);
    }

    // 调试信息 - 更新以显示reverse状态
    onEnable() {
        console.log(`旋转控制器已启用:
        最大速度: ${this.maxRotationSpeed} 度/秒
        加速时间: ${this.accelerationTime} 秒
        旋转方向: ${this.clockwise ? '顺时针' : '逆时针'}
        逆向状态: ${this.reverse ? '是' : '否'}
        `);
    }
}