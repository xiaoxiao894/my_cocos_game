import { _decorator, Animation, CCString, Component, SkeletalAnimation } from "cc";
import { EventManager } from "../Globel/EventManager";
import { EventName } from "../Enum/Enum";
import { SoundManager } from "../Globel/SoundManager";
const { ccclass, property } = _decorator;

@ccclass("Player")
export default class Player extends Component {
    @property(SkeletalAnimation)
    ani:SkeletalAnimation = null;
    @property(CCString)
    upAniName:string = "";
    @property(CCString)
    downAniName:string = "";
    @property(CCString)
    changeAniName:string = "";
    @property(CCString)
    standAniName:string = "";
    @property(CCString)
    squatAniName:string = "";

    private _squatTime:number = 0;

    protected onEnable(): void {
        EventManager.inst.on(EventName.PlayerUp, this.playerUp, this);
        EventManager.inst.on(EventName.PlayerDown, this.playerDown, this);
    }

    protected onDisable(): void {
        EventManager.inst.off(EventName.PlayerUp, this.playerUp, this);
        EventManager.inst.off(EventName.PlayerDown, this.playerDown, this);
    }

    
    private playerUp(){
        this.ani.play(this.upAniName);
        this.ani.once(Animation.EventType.FINISHED,()=>{
            this.ani.play(this.standAniName);
        });
    }

    private playerDown(){
        this._squatTime++;
        this.node.getComponent(Animation).stop();
        this.ani.play(this.downAniName);
        this.ani.once(Animation.EventType.FINISHED,()=>{
           // if(this._squatTime>2){
                this.playerChange();
            //     this._squatTime = 0;
            // }else{
            //     this.ani.play(this.squatAniName);
            // }
            this.node.getComponent(Animation).play();
        });
    }

    /** 换子弹 */
    private playerChange(){
        SoundManager.inst.playAudio("YX_zhunbei");
        this.ani.play(this.changeAniName);
        this.ani.once(Animation.EventType.FINISHED,()=>{
            this.ani.play(this.squatAniName);
        });
    }
}