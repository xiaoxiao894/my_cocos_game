import { _decorator, Camera, Component,  Quat, Vec3,Node, tween, CCInteger, Tween, Vec2, CCFloat, math, animation, Animation } from 'cc';
import { DataManager } from '../Globel/DataManager';
import { EventManager } from '../Globel/EventManager';
import { EventName } from '../Enum/Enum';
import { MathUtils } from '../Utils/MathUtils';
const { ccclass, property } = _decorator;


@ccclass('CameraMain')
export class CameraMain extends Component {

    @property(Node)
    cameraNode: Node = null;

    @property(Camera)
    camera: Camera | null = null;

    @property(Node)
    speedEffectNode:Node = null;

    @property(Animation)
    bulletAnimation:Animation = null;

    @property({type:Node,tooltip:"摄像机相对于子弹初始位置，后续会一直保持此相对位置"})
    bulletPosNode:Node = null;

    @property({type:CCFloat,tooltip:"瞄准动画开始倍数"})
    radiusInStart:number = 3;

    @property({type:CCFloat,tooltip:"瞄准动画结束倍数"})
    radiusInEnd:number = 4;

    @property({type:CCFloat,tooltip:"取消瞄准动画开始倍数"})
    radiusOutStart:number = 2;

    @property({type:CCFloat,tooltip:"非瞄准状态旋转速度"})
    private rotationSpeed: number = 4.5;
    @property({type:CCFloat,tooltip:"瞄准状态旋转速度"})
    private rotationCloseSpeed: number = 2.5;

    @property({type:CCFloat,tooltip:"上抬后坐力幅度（度）"})
    public pitchRecoilAmount: number = 7; 

    @property({type:CCFloat,tooltip:"初始左右震动幅度（度）"})
    public yawShakeAmount: number = 4; 

    @property({type:CCFloat,tooltip:"左右震动总时长（秒）"})
    public shakeDuration: number = 0.2; 

    @property({type:CCFloat,tooltip:"上抬后坐力时长（秒）"})
    public recoilDuration: number = 0.4; 

    // @property({type:CCFloat,tooltip:"结束时摄像机速度"})
    // private endSpeed:number = 1.3;
    // @property({type:CCFloat,tooltip:"结束时，摄像机和子弹距离降低到此距离，摄像机停止移动"})
    // private endDistance:number = 5;


    


    //中心点世界坐标
    private _center: Vec3 ;
    private _initialPos: Vec3;    
    private _initialRotation: Quat = new Quat(); 

    //旋转相关
    private _theta: number = -Math.PI;
    private _phi: number = Math.PI / 2;
    

    //上次触摸点
    private _lastTouchPos: Vec2;

    //后坐力相关
    private _recoilRotation: Quat = new Quat();

    //结束展示
    private _lookAtBullet:boolean = false;
    private _lastDistance:number = 0;
    private _lastBulletPos:Vec3 = null;

    start() {
        this._center = this.node.getWorldPosition().clone();
        DataManager.Instance.cameraMain = this;

        this.speedEffectNode.active = false;

        // 记录初始位置
        this._initialPos = this.cameraNode.worldPosition.clone();
        // 记录初始旋转角度 
        this.node.getRotation(this._initialRotation);
        Quat.normalize(this._initialRotation,this._initialRotation);
        this.initGame();
    }

    private initGame(){
        //记录初始极坐标
        let { pitch, yaw } = MathUtils.quatToPolar(this._initialRotation);
        this._phi = Math.PI/2- pitch;
        this._theta = Math.PI+yaw;
        console.log(`phi ${this._phi} theta ${this._theta}`);
        DataManager.Instance.expansionRadius = this.radiusInEnd;
        this.updateCameraPosition();
    }

    protected onEnable(): void {
        EventManager.inst.on(EventName.GameOver, this.gameEnd, this);
    }

    protected onDisable(): void {
        EventManager.inst.off(EventName.GameOver, this.gameEnd, this);
    }

    update(dt: number) {
        if(this._lookAtBullet){
            // let enemyDistance = Vec3.distance(this.cameraNode.getWorldPosition(),DataManager.Instance.lastEnemyPos);
            // if(this._lastDistance>this.endDistance||enemyDistance>10){
            //     let bulletPos:Vec3 = DataManager.Instance.sceneMananger.getBulletPos();
            //     if(!bulletPos){
            //         bulletPos = this._lastBulletPos;
            //     }
            //     let direction:Vec3 = new Vec3();
            //     Vec3.subtract(direction, bulletPos, this.cameraNode.getWorldPosition());
            //     direction.normalize();
            //     Vec3.multiplyScalar(direction, direction, this.endSpeed*dt);
            //     this.cameraNode.setPosition(this.cameraNode.position.add(direction));
            //     this._lastDistance = Vec3.distance(this.cameraNode.getWorldPosition(),bulletPos);
            //     this._lastBulletPos = bulletPos;
            // }

        }

        if(this.speedEffectNode.active){
            this.speedEffectNode.setRotation(this.cameraNode.rotation.clone());
            let pos:Vec3 = this.cameraNode.getWorldPosition().clone();
            let direction:Vec3 = MathUtils.rotationToDirection(this.speedEffectNode.rotation);
            Vec3.scaleAndAdd(pos,pos,direction,20);
            this.speedEffectNode.setWorldPosition(pos);
        }
    }

    public touchEnd(){
        this._lastTouchPos = null;
    }

    public updateTouchPos(pos:Vec2){
        if(this._lastTouchPos){
             const delta = new Vec2(
                (pos.x - this._lastTouchPos.x) * 0.7,
                (pos.y - this._lastTouchPos.y) * 0.7
            );
            let speed:number = DataManager.Instance.expansionRadius>this.radiusOutStart?this.rotationCloseSpeed:this.rotationSpeed;
            speed *= 0.001;
            this._theta -= delta.x * speed;
            this._phi -= delta.y * speed;
            const minPhi = 0.42 * Math.PI;
            const maxPhi = 0.6 * Math.PI;
            this._phi = MathUtils.normalizeToTwoPi(this._phi);
            this._phi = Math.max(minPhi, Math.min(maxPhi, this._phi));
            const minTheta = 0.56 * Math.PI;
            const maxTheta = 0.9 * Math.PI;
            this._theta = MathUtils.normalizeToTwoPi(this._theta);
            this._theta = Math.max(minTheta, Math.min(maxTheta, this._theta));

            DataManager.Instance.cameraMain.updateCameraPosition();
            //console.log(`phi ${this._phi} theta ${this._theta}`);
            this._lastTouchPos.set(pos);
        }else{
            this._lastTouchPos = pos;  
        }
    }

    public updateCameraPosition(smooth: boolean = false) {
        const camPos = new Vec3();
        const center = this._center;
        let radius = DataManager.Instance.expansionRadius;

        // 统一计算摄像机位置
        const x = center.x + radius * Math.sin(this._phi) * Math.sin(this._theta);
        const y = center.y + radius * Math.cos(this._phi);
        const z = center.z + radius * Math.sin(this._phi) * Math.cos(this._theta);
        camPos.set(x, y, z);
        //console.log("camPos",camPos.toString());
        if (smooth) {
            radius = Math.max(DataManager.Instance.expansionRadius, 0.001); // 最小值防跳变
            // 平滑移动位置
            tween(this.cameraNode)
                .to(0.15, { worldPosition: camPos.clone() })
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

                    this.node.lookAt(target);
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
                //if (this.cameraNode.eulerAngles.y < -5 && this.cameraNode.eulerAngles.y > -6) {
                    //console.log("cameraNode.eulerAngles.y", this.cameraNode.eulerAngles.y, "phi ", this._phi, " theta ", this._theta);
                //}

            } else {
                this.cameraNode.setWorldPosition(camPos);
                const outward = new Vec3();
                Vec3.subtract(outward, camPos, center);
                outward.normalize();
                Vec3.add(target, camPos, outward);
            }
            this.node.lookAt(target);
        }
        //console.log(`phi ${this._phi} theta ${this._theta} radius ${radius}`);
    }

    public radiusIn(){
        DataManager.Instance.expansionRadius = this.radiusInStart;
        this.updateCameraPosition();
        DataManager.Instance.expansionRadius = this.radiusInEnd;
        this.updateCameraPosition(true);
    }

    public radiusOut(){
        DataManager.Instance.expansionRadius = this.radiusOutStart;
        this.updateCameraPosition();
        DataManager.Instance.expansionRadius = 0;
        this.updateCameraPosition(true);
    }

    // 触发带震动效果的后坐力
    public triggerRecoil() {
        this._recoilRotation.set(this.node.rotation);
        // 1. 左右震动阶段（振幅衰减）
        this.startShakePhase();

        // 2. 上抬后坐力阶段（延迟触发）
        this.scheduleOnce(() => {
            this.startRecoilPhase();
        }, this.shakeDuration);
    }

    /**
     * 左右震动阶段（多段衰减动画）
     */
    private startShakePhase() {
        const shakeCount = 4; // 震动次数
        const interval = this.shakeDuration / shakeCount;

        for (let i = 0; i < shakeCount; i++) {
            // 振幅衰减（指数衰减）
            const decayFactor = Math.pow(0.5, i); // 每次振幅减半
            const currentAmplitude = this.yawShakeAmount * decayFactor;

            // 计算目标旋转（左右交替）
            const targetYaw = (i % 2 === 0) ? currentAmplitude : -currentAmplitude;
            const targetRotation = this.calculateTargetRotation(0, targetYaw);

            // 分段动画
            tween(this.node)
                .delay(i * interval)
                .to(interval * 0.5, { rotation: targetRotation }, { easing: 'sineOut' })
                .start();
        }
    }

    /**
     * 上抬后坐力阶段
     */
    private startRecoilPhase() {
        const targetRotation = this.calculateTargetRotation(this.pitchRecoilAmount, 0);
        
        tween(this.node)
            .to(this.recoilDuration * 0.3, { rotation: targetRotation }, { easing: 'quadOut' })
            .to(this.recoilDuration * 0.7, { rotation: this._recoilRotation }, { easing: 'backOut' })
            .start();
    }

    /**
     * 计算目标旋转（叠加偏移）
     */
    private calculateTargetRotation(pitchDeg: number, yawDeg: number): Quat {
        const offset = new Quat();
        Quat.fromEuler(offset, pitchDeg, yawDeg, 0);

        const result = new Quat();
        Quat.multiply(result, this.node.rotation, offset);
        return result;
    }

    public resetGame(){
        this.initGame();
    }



    //游戏结束
    public gameEnd(){
        //转换视角
        // this.cameraNode.setWorldPosition(this.bulletPosNode.getWorldPosition().clone());
        // this.cameraNode.setWorldRotation(this.bulletPosNode.getWorldRotation().clone());
        // this._lastDistance = Vec3.distance(this.bulletPosNode.getWorldPosition().clone(),DataManager.Instance.sceneMananger.getBulletPos());
        this.node.eulerAngles = new Vec3(0,0,0);
        this._lookAtBullet = true;
        this.speedEffectNode.active = true;
        this.bulletAnimation.play();
        
    }
}
