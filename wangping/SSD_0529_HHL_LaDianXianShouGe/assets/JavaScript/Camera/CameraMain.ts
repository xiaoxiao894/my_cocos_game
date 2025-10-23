import { _decorator, Camera, Component,  Quat, v3, Vec3,Node, tween, CCInteger, Tween } from 'cc';
import { DataManager } from '../Global/DataManager';
import { EventManager } from '../Global/EventManager';
import { CameraState, EventName } from '../Common/Enum';
const { ccclass, property } = _decorator;

let tempPos: Vec3 = v3();

@ccclass('CameraMain')
export class CameraMain extends Component {

    @property(Camera)
    camera: Camera | null = null;

    @property(Node)
    target: Node | null = null;

    @property(CCInteger)
    speed:number = 0.7;

    @property(CCInteger)
    delayTime:number = 5;

    @property(Node)
    endPosNode:Node = null;

    @property(Node)
    towerPosNode:Node = null;

    @property(Node)
    lookTreePosNode:Node = null;

    @property(Node)
    lookBigTreePosNode:Node = null;

    @property({type:CCInteger,tooltip:"摄像机最后升高多少"})
    lastHeight:number = 20;


    private initialPos: Vec3 = v3();   
    private initialOffset: Vec3 = v3();   
    private initialRotation: Quat = new Quat(); 
    private _tempPos: Vec3 = v3();
    private _tweenAni:Tween<Node>;

    private _originalPos: Vec3 = new Vec3();
    private _isShaking: boolean = false;

    private _offsetSpeed:number = 12;
    
    private _moveState:CameraState = CameraState.Nomal;

    start() {
        DataManager.Instance.mainCamera = this;

        // 记录初始位置
        this.initialPos = this.node.worldPosition.clone();
         // 记录初始偏移
        Vec3.subtract(this.initialOffset, this.initialPos, this.target!.worldPosition);
        // 记录初始旋转角度（保持角度不变）
        this.node.getRotation(this.initialRotation);

        //看大树，立刻回来
        DataManager.Instance.cameraGuiding = true;
        DataManager.Instance.playerCanMove = false;
        this.node.setWorldPosition(this.lookBigTreePosNode.worldPosition.clone());
        this.scheduleOnce(()=>{
            tween(this.node)
            .to(1,{worldPosition:this.initialPos},{
                easing: 'sineOut', // 使用缓动函数使动画更自然
            }).call(()=>{
                DataManager.Instance.cameraGuiding = false;
                DataManager.Instance.playerCanMove = true;
            }).start();
        },1);
    }

    protected onEnable(): void {
        EventManager.inst.on(EventName.GameOver, this.moveCenterAndScale, this);
    }

    protected onDisable(): void {
        EventManager.inst.off(EventName.GameOver, this.moveCenterAndScale, this);
    }

    update(dt: number) {
        // 按照目标位置 + 初始偏移进行跟随
        if(!DataManager.Instance.cameraGuiding){
            if(this._moveState === CameraState.Nomal){
                Vec3.add(this._tempPos, this.target!.worldPosition, this.initialOffset);
                this.node.setWorldPosition(this._tempPos);
            }else {
                let targetPos:Vec3 = new Vec3();
                Vec3.add(targetPos, this.target!.worldPosition, this.initialOffset);

                if(this._moveState ===CameraState.LookTower){
                    targetPos = this.towerPosNode.worldPosition.clone();
                }else if(this._moveState ===CameraState.LookTree){
                    if(DataManager.Instance.wireLen>= DataManager.Instance.wireSecendLen){
                        targetPos = this.lookBigTreePosNode.worldPosition.clone();
                    }else{
                        targetPos = this.lookTreePosNode.worldPosition.clone();
                    }
                    
                }

                let nowPos = this.node.worldPosition.clone();
                let distance = Vec3.distance(nowPos, targetPos);

                if (distance < 0.2) {
                    this._tempPos.set(targetPos);
                    if (this._moveState === CameraState.LookBack) {
                        this._moveState = CameraState.Nomal;
                    }
                } else {
                    let distan = new Vec3();
                    Vec3.subtract(distan, targetPos, nowPos);
                    distan.normalize();
                    let moveStep = this._moveState === CameraState.LookBack ? this._offsetSpeed * dt * 1.5 : this._offsetSpeed * dt;
                    // 步长超过距离时直接到终点
                    if (moveStep >= distance) {
                        this._tempPos.set(targetPos);
                    } else {
                        Vec3.scaleAndAdd(this._tempPos, nowPos, distan, moveStep);
                    }
                }
                this.node.setWorldPosition(this._tempPos);
            }
            
        }
        

        // 固定角度，不再 lookAt
        this.node.setRotation(this.initialRotation);
    }

    // 移到树那边
    public moveToTree(){
        this._moveState = CameraState.LookTree;
    }


    //停止回到中心位
    public stopTweenAni(){
        if(this._tweenAni){
            this._tweenAni.stop();
        }
    }

    //移动摄像机并且升高高度
    public moveCenterAndScale(){
        DataManager.Instance.cameraGuiding = true;
        const orgHeight:number = this.camera.orthoHeight;
        this._tweenAni = tween(this.node)
        .to(0.5,{worldPosition:this.endPosNode.worldPosition},{
            easing: 'sineOut', // 使用缓动函数使动画更自然
            onUpdate: (target, ratio) => {
                // 动态调整正交摄像机大小
                this.camera.orthoHeight = orgHeight +ratio*this.lastHeight;
            }
        }).call(()=>{
            this.shake();
        }).start();
    }

    /**
     * 调用这个方法触发摄像机抖动
     * @param duration 抖动持续时间（秒）
     * @param strength 抖动强度
     */
    public shake(duration: number = 0.3, strength: number = 0.5) {
        if (this._isShaking) return;

        this._isShaking = true;
        this._originalPos.set(this.node.position);

        const shakeTimes = Math.floor(duration / 0.02);

        const shakeTween = tween(this.node);

        for (let i = 0; i < shakeTimes; i++) {
            const offset = new Vec3(
                (Math.random()*2 - 1) * strength,
                (Math.random()*2 - 1) * strength,
                0
            );
            shakeTween.to(0.01, { position: this._originalPos.clone().add(offset) });
        }

        shakeTween
            .to(0.01, { position: this._originalPos })
            .call(() => {
                this._isShaking = false;
            })
            .start();
    }

    public lookAtTower(){
        this._moveState = CameraState.LookTower;
    }

    public towerLookBack(){
         if(this._moveState === CameraState.LookTower){
            this._moveState = CameraState.LookBack;
        }
    }

    public treeLookBack(){
        if(this._moveState === CameraState.LookTree){
            this._moveState = CameraState.LookBack;
        }
    }
}
