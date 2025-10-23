import { _decorator, Camera, Component, Node, Quat, tween, v3, Vec3 } from 'cc';
import { DataManager } from '../Global/DataManager';
import { EventManager } from '../Global/EventManager';
import { CameraState, EventName } from '../Common/Enum';
const { ccclass, property } = _decorator;

let tempPos: Vec3 = v3();

@ccclass('CameraMain')
export class CameraMain extends Component {
    @property(Node)
    target: Node | null = null;

    @property(Camera)
    camera: Camera | null = null;

    // 是否引导
    private isCameraGuiding = false;
    private initialOffset: Vec3 = v3();

    private _offsetSpeed:number = 40;
    //摄像机状态
    private _moveState:CameraState = CameraState.Nomal;
    private _tempPos: Vec3 = v3();

    start() {
        DataManager.Instance.cameraMain = this;

        Vec3.subtract(this.initialOffset, this.node.worldPosition, this.target!.worldPosition);
    }

    protected onEnable(): void {
        EventManager.inst.on(EventName.ShowMonster, this.onFirstMonsterShow, this);
        EventManager.inst.on(EventName.GameOver, this.onGameOver, this);
    }

    protected onDisable(): void {
        EventManager.inst.off(EventName.ShowMonster, this.onFirstMonsterShow, this);
        EventManager.inst.off(EventName.GameOver, this.onGameOver, this);
    }

    private onFirstMonsterShow():void{
        // this._moveState = CameraState.LookMonster;
        // this.scheduleOnce(()=>{
        //     this._moveState = CameraState.LookBack;
        // },3);
    }

    update(dt: number) {
        if (this.isCameraGuiding) return;
        //摄像机追着主角
        if(this._moveState === CameraState.Nomal){
            Vec3.add(tempPos, this.target.worldPosition, this.initialOffset);
            if (this.camera) {
                this.camera.node.setWorldPosition(tempPos)
            }
        }else{
            let targetPos:Vec3 = new Vec3();
            Vec3.add(targetPos, this.target!.worldPosition, this.initialOffset);
            if(this._moveState === CameraState.LookMonster){
                targetPos = DataManager.Instance.monsterController.getFirstMonsterPos();
                if(!targetPos){
                    this._moveState = CameraState.Nomal;
                    return;
                }
                targetPos.y=this.camera.node.worldPosition.y;
                targetPos.x+=this.initialOffset.x;
                targetPos.z+=this.initialOffset.z;
            }

            let nowPos = this.camera.node.worldPosition.clone();
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
            this.camera.node.setWorldPosition(this._tempPos);
        }
        
    }


    private onGameOver():void{
        this.isCameraGuiding = true;
        const orgHeight:number = this.camera.orthoHeight;
        tween({})
        .to(1,{},
            {
                easing: 'sineOut', // 使用缓动函数使动画更自然
                onUpdate: (target, ratio) => {
                    // 动态调整正交摄像机大小
                    this.camera.orthoHeight = orgHeight +ratio*30;
                }
            }
        ).start();
    }

    public isNomalState():boolean{
        return this._moveState === CameraState.Nomal;
    }
}
