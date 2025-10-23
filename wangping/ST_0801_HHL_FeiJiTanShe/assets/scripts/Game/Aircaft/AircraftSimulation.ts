import { _decorator, Node, Component, math, Quat, RigidBody, Root, tween, v2, v3, Vec2, Vec3, randomRangeInt } from 'cc';
const { ccclass, property } = _decorator;
import { PhysicsSystem } from 'cc';

import EventManager from 'db://assets/scripts/EventManager/EventManager'
import EventType from 'db://assets/scripts/EventManager/EventType';
import { GameSettings } from '../GameSettings';

@ccclass('AircraftSimulation')
export class AircraftSimulation extends Component {

    @property(GameSettings)
    gameSettings: GameSettings = null;

    @property(RigidBody)
    rb: RigidBody

    initPos: Vec3 = v3(0.0, 1.7, 0.0);
    mass: number = 0.5
    angularDamping: number = 0.9
    linerDamping: number = 0.1

    // 弹射速度
    @property
    fireSpeed: number = 50.0;

    // @property
    // fireRotation: Vec3 = v3(-30.0, 0.0, 0.0)

    @property
    firePos: Vec3 = v3(0.0, 10.0, 25.0)

    // 施加的弹射力缩放
    // @property
    fireImpulseScalar: number = 60.0

    @property
    freezeTimeScalar: number = 0.05;

    // @property
    joystickInputTorqueScale: number = 2.0

    // @property
    forwardImpulseScaler: number = 20.0

    //---- 
    // @property
    waveTime: number = 1.5

    @property
    forward: Vec3 = new Vec3(0, 0, 0)


    // @property([Node])
    // airportPath: Node[] = []

    _nextWaveTime: number = 0.0
    _lastWaveY: number = 0.0

    _pickMinPos: Vec3;
    _pickMaxPos: Vec3;

    _pullBeginPos: Vec3;
    _pullEndPos: Vec3;

    _isLaunch: boolean = false;

    _fireDt: number = 0;
    _fireTime: number = 0;
    _fireTotalTime: number = 0;
    _fireScalar: number = 1;

    _isFreezeEnter: boolean = false;
    _physicsSystemTimeScale: number = 1;
    _isJoystickStart: boolean = false;
    _deltaTime: number = 0;
    _time: number = 0;
    _isDrop: boolean = false;
    _isInputCancel: boolean = false;

    // _anyJoystickInput: boolean = false;

    _curLinearVelocityScalar: number = 0
    _joystickInput: Vec2 = v2(0, 0);
    _lastJoystickInput: Vec2 = v2(0, 0);
    _lastWorldPositon: Vec3 = v3(0, 0, 0)

    // _firePathIndex: number = 0;
    // _fireLerp: boolean = false;
    // _firePath: Vec3[] = [];
    _fireEulerAngles: Vec3[] = [];
    _fireCurPathTime: number = 0;

    _isTapGrounded: boolean = false;
    _isRoll: boolean = false;

    joystickInputVerticalScale: number = 1.0
    joystickInputHorizontalScale: number = 1.0

    downWaveScaler: number = 0.3
    upWaveScaler: number = 0.15

    dropLocalTorque: Vec3 = v3();

    _lastForward:Vec3;
    _lastAngleZ:number = 0;

    private _hasInputed:boolean = false;
    private _lauchScale:number = 0;

    private aircraftInputingDownForce :number = 0;
    private aircraftUpSlowDownHeight:number = 0;
    private aircraftUpSlowDownSpeed:number = 0;


    protected onLoad(): void {

        const gameSettings = this.gameSettings;

        this.initPos = gameSettings.aircraftInitPos;
        this.mass = gameSettings.aircraftMass;
        this.angularDamping = gameSettings.aircraftAngularDamping;
        this.linerDamping = gameSettings.aircraftLinearDamping;
        this.fireImpulseScalar = gameSettings.aircraftFireImpulseScalar;
        this.joystickInputTorqueScale = gameSettings.aircraftJoystickInputTorqueScale;
        this.forwardImpulseScaler = gameSettings.aircraftForwardImpulseScaler;
        this.waveTime = gameSettings.aircraftWaveTime;

        this.joystickInputVerticalScale = gameSettings.aircraftJoystickInputVerticalScale;
        this.joystickInputHorizontalScale = gameSettings.aircraftJoystickInputHorizontalScale;

        this.downWaveScaler = gameSettings.aircraftDownWaveScaler;
        this.upWaveScaler = gameSettings.aircraftUpWaveScaler;

        this.dropLocalTorque = gameSettings.aircraftDropLocalTorque;
        this.aircraftInputingDownForce = gameSettings.aircraftInputingDownForce;
        this.aircraftUpSlowDownHeight = gameSettings.aircraftUpSlowDownHeight;
        this.aircraftUpSlowDownSpeed = gameSettings.aircraftUpSlowDownSpeed;

        if (this.rb == null) {
            this.rb = this.node.getComponent(RigidBody);
        }

        this.node.setWorldPosition(this.initPos);

        // PhysicsSystem.instance.gravity = v3(0, -8, 0);

        EventManager.addEventListener(EventType.PYSICS_SYSTEM_TIME_SCALE, this.onPhysicsSystemTimeScale, this)

        EventManager.addEventListener(EventType.SET_PICKER_POS, this.onSetPickerPos, this)
        EventManager.addEventListener(EventType.FINGER_PULL, this.onPull, this);
        EventManager.addEventListener(EventType.FINGER_PUSH, this.onPush, this);

        EventManager.addEventListener(EventType.SHOW_JOYSTICK, this.onShowJoystick, this);
        EventManager.addEventListener(EventType.JOYSTICK_START, this.onJoystickStart, this);
        EventManager.addEventListener(EventType.JOYSTICK_MOVE, this.onJoystickMove, this);
        EventManager.addEventListener(EventType.JOYSTICK_END, this.onJoystickEnd, this);

        EventManager.addEventListener(EventType.AIRCAFT_START, this.launch, this);
        EventManager.addEventListener(EventType.AIRCAFT_INPUT_CANCEL, this.onInputCancel, this);
        EventManager.addEventListener(EventType.AIRCAFT_GROUNDED, this.onGrounded, this);
        EventManager.addEventListener(EventType.AIRCAFT_DROP, this.onDrop, this);
        EventManager.addEventListener(EventType.AIRCAFT_DRAG, this.onDrag, this);
        EventManager.addEventListener(EventType.AIRCAFT_TAP_GROUNDED, this.onTapGrounded, this);
        EventManager.addEventListener(EventType.AIRCAFT_FIRE_ROTATE, this.onFireTorque, this);
    }

    onDestroy(): void {

        EventManager.remveEventListener(EventType.PYSICS_SYSTEM_TIME_SCALE, this.onPhysicsSystemTimeScale, this)

        EventManager.remveEventListener(EventType.SET_PICKER_POS, this.onSetPickerPos, this)
        EventManager.remveEventListener(EventType.FINGER_PULL, this.onPull, this);
        EventManager.remveEventListener(EventType.FINGER_PUSH, this.onPush, this);

        EventManager.remveEventListener(EventType.SHOW_JOYSTICK, this.onShowJoystick, this);
        EventManager.remveEventListener(EventType.JOYSTICK_START, this.onJoystickStart, this);
        EventManager.remveEventListener(EventType.JOYSTICK_MOVE, this.onJoystickMove, this);
        EventManager.remveEventListener(EventType.JOYSTICK_END, this.onJoystickEnd, this);

        EventManager.remveEventListener(EventType.AIRCAFT_START, this.launch, this);
        EventManager.remveEventListener(EventType.AIRCAFT_GROUNDED, this.onGrounded, this);
        EventManager.remveEventListener(EventType.AIRCAFT_INPUT_CANCEL, this.onInputCancel, this);
        EventManager.remveEventListener(EventType.AIRCAFT_DROP, this.onDrop, this);
        EventManager.remveEventListener(EventType.AIRCAFT_DRAG, this.onDrag, this);
        EventManager.remveEventListener(EventType.AIRCAFT_TAP_GROUNDED, this.onTapGrounded, this);
        EventManager.remveEventListener(EventType.AIRCAFT_FIRE_ROTATE, this.onFireTorque, this);
    }

    start() {
        this.rb.mass = this.mass;
        this.rb.angularDamping = this.angularDamping;
        this.rb.linearDamping = this.linerDamping;
        // this.rb.useGravity = false;
        // 在lastUpdate中更新,保证非物理修改坐标能生效
        EventManager.dispatchEvent(EventType.PYSICS_SYSTEM_UPDATE_TYPE, 1);
    }

    onPhysicsSystemTimeScale(timeScale: number) {
        this._physicsSystemTimeScale = timeScale;
    }

    update(deltaTime: number): void {

        this.forward = this.node.forward;

        this._deltaTime = deltaTime;
        this._time += deltaTime;

        if (this._isLaunch == false) {
            this.onDragRotaion(deltaTime);
        } else {
            this.onFlyUpdate(deltaTime);
        }

        if (this._isTapGrounded && this._isRoll == false) {

            const linearVelocity = new Vec3();
            this.rb.getLinearVelocity(linearVelocity);
            const len = Vec3.len(linearVelocity);

            if (len <= 60) {
                this._isRoll = true;
                this.onRoll();
            }
        }
    }

    onFlyUpdate(deltaTime: number) {
        if (this._isFreezeEnter == false) {
            this._fireTime -= deltaTime;
            if (this._fireTime <= 0) {
                this.enterFreeze();
            }
        } else {
            this.applyJoysitckInput(deltaTime);
        }
    }

    enterFreeze() {

        this._isFreezeEnter = true;

        {
            this.rb.useGravity = true;
        }

        EventManager.dispatchEvent(EventType.AIRCAFT_FREEZE, true);
        // 在update中更新,防止抖动
        EventManager.dispatchEvent(EventType.PYSICS_SYSTEM_TIME_SCALE, this.freezeTimeScalar);
        EventManager.dispatchEvent(EventType.SHOW_JOYSTICK_TWEEN);
        EventManager.dispatchEvent(EventType.SHOW_JOYSTICK);
        EventManager.dispatchEvent(EventType.SHOW_HUD);

    }

    lateUpdate(deltaTime: number) {
        this._lastWorldPositon.set(this.node.worldPosition);
        EventManager.dispatchEvent(EventType.UPDATE_MAIN_PLAYER_POS, this.node.worldPosition);
    }

    applyJoysitckInput(deltaTime: number) {
        if (this._isDrop || this._isInputCancel || this._isTapGrounded) {
            this._lastForward = null;
            return
        }
        
        this.onInput(this._joystickInput, deltaTime);
        this.onForwardLinearVelocity(deltaTime);
        this.onWind(this._joystickInput);
        this.onForwardImpulse(deltaTime);
    }

    // 摇杆输入
    onInput(joystickInput: Vec2, deltaTime: number) {

        if (joystickInput == Vec2.ZERO) {
            return;
        }
        let speed = new Vec3();
        this.rb.getAngularVelocity(speed);
        // console.log("角速度", speed);
        // console.log("当前角度",this.node.eulerAngles);

        if(!this._hasInputed){
            this.rb.clearForces();
            let angleSpeed:Vec3 = new Vec3();
            this.rb.getAngularVelocity(angleSpeed);
            //console.log("angleSpeed", angleSpeed);
            if(Math.abs(angleSpeed.x) > 2){
                angleSpeed.x/=2;
                this.rb.setAngularVelocity(angleSpeed);
            }
            this._hasInputed = true;
        }
        
        
        const scaler = this._physicsSystemTimeScale * this.joystickInputTorqueScale * deltaTime;
        const forward = this.node.forward;
        const toForward = new Vec3(forward.x, joystickInput.y, forward.z);
        // {
        //     // 模拟反方向拉动的一个动能抵抗
        //     const distance = Math.abs(forward.y - joystickInput.y);
        //     // [-1,1]
        //     const t = distance / 2.0;
        //     var distanceScaler = math.lerp(1.0, 0.1, t);

        //     Vec3.lerp(forward, forward, toForward, scaler * this.joystickInputVerticalScale * distanceScaler);
        //     this.node.forward = forward;
        // }

        {
            const torque = new Vec3();
            torque.y = -1.0 * joystickInput.x * this.joystickInputHorizontalScale; // 左右
            //torque.x = Math.sign(joystickInput.y) * Math.pow(joystickInput.y, 2) * this.joystickInputVerticalScale; // 上下
            if(joystickInput.y === 0 && joystickInput.x === 0){
                torque.x = joystickInput.y * this.joystickInputVerticalScale; // 上下
            }else{
                torque.x = joystickInput.y * this.joystickInputVerticalScale + this.aircraftInputingDownForce; // 上下
            }
            
            //如果z轴有值给翻滚回去
            let speedZ = this.node.eulerAngles.z - this._lastAngleZ;
            if(Math.abs(this.node.eulerAngles.z)>5&&Math.abs(speedZ)<3){
                if(this.node.eulerAngles.z/speedZ>0){
                    //速度与旋转偏移同向
                    torque.z = -1.0 * this.node.eulerAngles.z * 0.006; // z轴翻滚
                }else if(this.node.eulerAngles.z/speedZ>-5){
                    //速度与偏转方向相反，且快翻转过来了，不再施加力
                    torque.z = 0;
                }else if(this.node.eulerAngles.z/speedZ>-10){
                    //速度与旋转方向相反，且离翻转过来还有一定时间，施加力
                    torque.z = -1.0 * this.node.eulerAngles.z * 0.004*Math.abs(this.node.eulerAngles.z/speedZ)*0.1; // z轴翻滚
                }else{
                    //速度与旋转方向相反，且离翻转过来还有一定时间，施加力
                    torque.z = -1.0 * this.node.eulerAngles.z * 0.004; // z轴翻滚
                }
            }

            // {
            //     torque.x = joystickInput.y - forward.y; // 前后
            //     // 顶部仰角
            //     // if (torque.x < 0) {
            //     //     if (forward.y < -0.5) {
            //     //         torque.x = 0;
            //     //     }
            //     // } else if (torque.x > 0) {
            //     //     if(forward.y > 0.5) {
            //     //         torque.x = 0;
            //     //     }
            //     // }
            // }

            Vec3.multiplyScalar(torque, torque, scaler * 5.0);
            this.rb.applyLocalTorque(torque);
            this._lastAngleZ = this.node.eulerAngles.z;
        }
    }

    // 飞机上下晃动
    onWind(joystickInput: Vec2) {

        if (joystickInput != Vec2.ZERO) {
            this._nextWaveTime = this._time;
            return;
        }

        if (this._time >= this._nextWaveTime) {
            const forward = this.node.forward;
            if (forward.y > 0.0) {
                const y = math.clamp(forward.y, 0.5, 1.0);
                this._lastWaveY = this.upWaveScaler * y * -1.0;
            } else {
                const y = math.clamp(forward.y, -1.0, -0.5);
                this._lastWaveY = this.downWaveScaler * y * -1.0;
            }
            
            this._nextWaveTime = this._time + this.waveTime;
        }

        const torque = new Vec3();
        torque.x = this._lastWaveY;
        //如果z轴有值给翻滚回去
        let speedZ = this.node.eulerAngles.z - this._lastAngleZ;
        if(Math.abs(this.node.eulerAngles.z)>5&&Math.abs(speedZ)<3){
            
            if(Math.abs(this.node.eulerAngles.x)<100){
                if(this.node.eulerAngles.z/speedZ>0){
                    //速度与旋转偏移同向
                    torque.z = -1.0 * this.node.eulerAngles.z * 0.006; // z轴翻滚
                }else if(this.node.eulerAngles.z/speedZ>-5){
                    //速度与偏转方向相反，且快翻转过来了，不再施加力
                    torque.z = 0;
                }else if(this.node.eulerAngles.z/speedZ>-10){
                    //速度与旋转方向相反，且离翻转过来还有一定时间，施加力
                    torque.z = -1.0 * this.node.eulerAngles.z * 0.004*Math.abs(this.node.eulerAngles.z/speedZ)*0.1; // z轴翻滚
                }else{
                    //速度与旋转方向相反，且离翻转过来还有一定时间，施加力
                    torque.z = -1.0 * this.node.eulerAngles.z * 0.004; // z轴翻滚
                }
                torque.z = torque.z*0.05;
            }
            
            // console.log("角速度1", speedZ);
            // console.log("当前角度1",this.node.eulerAngles);
            // console.log("torque1", torque);
        }
        this.rb.applyLocalTorque(torque);
        this._lastAngleZ = this.node.eulerAngles.z;
    }

    // 飞机动力
    onForwardImpulse(deltaTime: number) {

        const scalar = this.forwardImpulseScaler * this._physicsSystemTimeScale * -1.0;

        const impulse = new Vec3();
        impulse.set(this.node.forward);
        Vec3.multiplyScalar(impulse, impulse, scalar * deltaTime);
        this.rb.applyImpulse(impulse);
    }

    // 线性方向转为forward朝向
    onForwardLinearVelocity(deltaTime: number) {

        if (this._isJoystickStart == false) {
            return;
        }

        const linearVelocity = new Vec3();
        this.rb.getLinearVelocity(linearVelocity);

        const forward = this.node.forward;

        const newLinearVelocity = new Vec3();
        const len = linearVelocity.length();
        Vec3.multiplyScalar(newLinearVelocity, forward, len * -1.0);

        Vec3.lerp(newLinearVelocity, linearVelocity, newLinearVelocity, deltaTime * 0.5);
        if(this.node.worldPosition.y>this.aircraftUpSlowDownHeight&&newLinearVelocity.y>this.aircraftUpSlowDownSpeed){
            const height:number = this.node.worldPosition.y-this.aircraftUpSlowDownHeight;
            //正在攀升
            newLinearVelocity.y = newLinearVelocity.y*0.99;
            //console.log("newLinearVelocity",newLinearVelocity.y,"height",height);
        }
        this.rb.setLinearVelocity(newLinearVelocity);
    }

    launch(scale: number) {
        this._lauchScale = scale;
        // this.rb.useGravity = false;
        EventManager.dispatchEvent(EventType.PYSICS_SYSTEM_UPDATE_TYPE, 0);

        EventManager.dispatchEvent(EventType.THIRD_PRESON_CAMERA_LOOK_AT, this.node);
        EventManager.dispatchEvent(EventType.PROPELLER_WORK, true);

        const curWorldPos = this.node.worldPosition;

        const forward = this.node.forward;
        const impulse = new Vec3();
        impulse.set(forward);

        // 弹射偏移
        {
            const distance = Math.abs((this._pickMaxPos.x - this._pickMinPos.x));
            const v = Math.abs(curWorldPos.x - this._pickMinPos.x);
            const t = v / distance;
            impulse.x = math.lerp(-1, 1, t);
        }

        this._fireScalar = scale;
        this._curLinearVelocityScalar = this.fireImpulseScalar * scale;

        Vec3.multiplyScalar(impulse, impulse, this._curLinearVelocityScalar);
        Vec3.multiplyScalar(impulse, impulse, -1.0);

        this.rb.applyLocalImpulse(impulse);

        const distance = Vec3.distance(curWorldPos, this.firePos);
        const speed = this.fireSpeed * scale;
        const fireTime = distance / speed;
        this._fireTime = fireTime
        this._isLaunch = true;
    }

    onPull(ratio: number) {
        const worldPosition = new Vec3();
        const beginWorldPos = this._pullBeginPos;
        const endWorldPos = this._pullEndPos;
        Vec3.lerp(worldPosition, beginWorldPos, endWorldPos, ratio);
        this.rb.node.setWorldPosition(worldPosition);
    }

    onPush(ratio: number) {
        const worldPosition = new Vec3();
        const beginWorldPos = this._pullEndPos;
        const endWorldPos = this._pullBeginPos;
        Vec3.lerp(worldPosition, beginWorldPos, endWorldPos, ratio);
        this.rb.node.setWorldPosition(worldPosition);
    }

    onShowJoystick() {
        this._isJoystickStart = false;
    }

    onJoystickStart() {
        if (this._isJoystickStart) {
            return;
        }
        this._isJoystickStart = true;
        EventManager.dispatchEvent(EventType.PYSICS_SYSTEM_TIME_SCALE, 1.25);
        EventManager.dispatchEvent(EventType.AIRCAFT_FREEZE, false);
    }

    onJoystickMove(deltaPos: Vec2) {
        this._joystickInput = deltaPos;
        this._lastJoystickInput = deltaPos;
    }

    onJoystickEnd(deltaPos: Vec2) {
        this._joystickInput = Vec2.ZERO;
    }

    onSetPickerPos(minPos: Vec3, maxPos: Vec3) {
        this._pullBeginPos = v3(0.0, minPos.y, minPos.z)
        this._pullEndPos = v3(0.0, maxPos.y, maxPos.z)
        this._pickMinPos = minPos;
        this._pickMaxPos = maxPos;
    }

    onGrounded() {
        this._isInputCancel = true;
        EventManager.dispatchEvent(EventType.PROPELLER_WORK, false);
    }

    onDrop() {
        this._isDrop = true;
        this._isInputCancel = true;
    }

    onInputCancel() {
        this.mass = 1.0
        this.rb.clearVelocity();
        this._isInputCancel = true;
        EventManager.dispatchEvent(EventType.PROPELLER_WORK, false);
    }

    onDrag(pos: Vec3) {
        this.node.setWorldPosition(pos);
    }

    // 拖拉的时候朝向改变
    onDragRotaion(deltaTime: number) {

        const curPos = this.node.position;
        const eulerAngles = new Vec3()
        const nextEulerAngles = new Vec3();

        // 在x上的偏移
        const xMin = this._pickMinPos.x;
        const xMax = this._pickMaxPos.x;
        const totalDistance = Math.abs(xMax - xMin);
        const curDistance = Math.abs(curPos.x - xMin);

        // 角度偏移
        const fromEulerAngles = new Vec3(0, -45, 0);
        const toEulerAngles = new Vec3(0, 45, 0);
        Vec3.lerp(nextEulerAngles, fromEulerAngles, toEulerAngles, curDistance / totalDistance)

        // 逐渐扭向
        Vec3.lerp(eulerAngles, this.node.eulerAngles, nextEulerAngles, deltaTime * 0.5);
        this.node.eulerAngles = eulerAngles;
    }

    onTapGrounded() {
        this._isTapGrounded = true;
    }

    onRoll() {
        this.rb.applyLocalTorque(this.dropLocalTorque);
    }

    onFireTorque() {
        //力度超过70%
        if(this._lauchScale>0.8&&!this._hasInputed){
            const r1 = randomRangeInt(0, 100);
            // 配置概率
            if (r1 <= this.gameSettings.aircraftStartRolloverProbability*100) {
                //加旋转力
                const torque = new Vec3(0, 0, 0);
                const r3 = randomRangeInt(50, 75);
                
                const r5 = randomRangeInt(0, 100);
                if(r5<25){
                    const r4 = Math.random()*2*Math.PI;
                    torque.x = r3 * Math.cos(r4);
                    torque.y = r3 * Math.sin(r4);
                }else{
                    torque.x = r5<62.5?r3:-r3;
                }
                console.log("r5",r5,"r3",r3);
                this.rb.applyLocalTorque(torque);
            }
        }
        
    }
}