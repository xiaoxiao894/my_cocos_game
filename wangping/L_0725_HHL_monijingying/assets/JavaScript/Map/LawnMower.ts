import { _decorator, animation, Animation, Component, Node, SkeletalAnimation, Sprite } from 'cc';
import { BubbleItem } from './BubbleItem';
const { ccclass, property } = _decorator;

@ccclass('LawnMower')
export class LawnMower extends Component {

    @property(SkeletalAnimation)
    ani:SkeletalAnimation = null;

    @property(Animation)
    grassAni:Animation = null;

    @property(BubbleItem)
    bubbleItem:BubbleItem = null;


    // 0 停止 1 工作
    private _state:number = 0;
    private _coinNum:number = 0;

    start() {
        
    }

    public addCoin(){
        this._coinNum++;
        this.bubbleItem.playScaleOnce();
    }

    public subCoin(){
        this._coinNum--;
        this.bubbleItem.reduceNumber();
    }

    public playIdle(){
        if(this._state!==0){
            this._state = 0;
            this.ani.stop();
            this.grassAni?.stop();
        }
    }

    public playOperate(){
        if(this._state===1){
            //上个动画没结束，强制结束，取消监听
            this.ani.off(Animation.EventType.FINISHED, this.playIdle, this);
            this.ani.stop();
        }
        this._state = 1;
        this.ani.play("QieCao_QieCaoJi");
        this.ani.once(Animation.EventType.FINISHED, this.playIdle, this);
        this.grassAni?.play();
        return true;
    }
}


