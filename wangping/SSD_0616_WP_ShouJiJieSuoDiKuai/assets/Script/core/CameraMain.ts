import { _decorator, Camera, Component,  Quat, v3, Vec3,Node, tween, CCInteger, Tween } from 'cc';

const { ccclass, property } = _decorator;

let tempPos: Vec3 = v3();

@ccclass('CameraMain')
export class CameraMain extends Component {

    @property(Camera)
    camera: Camera | null = null;
    @property(CCInteger)
    speed:number = 0.7;
    @property(CCInteger)
    delayTime:number = 5;

    private initialPos: Vec3 = v3();      
    private initialRotation: Quat = new Quat(); 
    private _tweenAni:Tween<Node>;

    start() {
      

        // 记录初始位置
        this.initialPos = this.node.worldPosition.clone();
        // 记录初始旋转角度（保持角度不变）
        this.node.getRotation(this.initialRotation);
    }



    //回到中心位置
    public moveToCenter(){
        this.scheduleOnce(this.realMove,this.delayTime);
    }

    private realMove(){
        let distence:number = Vec3.distance(this.node.worldPosition,this.initialPos);
        let t:number = this.speed*distence;
        this._tweenAni = tween(this.node).to(t,{worldPosition:this.initialPos}).start();
    }

    //停止回到中心位
    public stopTweenAni(){
        if(this._tweenAni){
            this._tweenAni.stop();
        }
        this.unschedule(this.realMove);
    }

    //移动摄像机并且升高高度
    public moveCenterAndScale(){
        const orgHeight:number = this.camera.orthoHeight;
        this._tweenAni = tween(this.node)
        .to(0.5,{worldPosition:this.initialPos},{
            easing: 'sineOut', // 使用缓动函数使动画更自然
            onUpdate: (target, ratio) => {
                // 动态调整正交摄像机大小
                this.camera.orthoHeight = orgHeight +ratio*5;
            }
        }).start();
    }
}
