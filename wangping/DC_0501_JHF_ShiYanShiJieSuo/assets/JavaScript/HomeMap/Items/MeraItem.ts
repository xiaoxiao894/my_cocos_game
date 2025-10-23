import { _decorator, Component, Node, SkeletalAnimation, Sprite } from 'cc';
import { SoundManager } from '../../Common/SoundManager';
import { DataManager } from '../../Global/DataManager';
const { ccclass, property } = _decorator;

@ccclass('MeraItem')
export class MeraItem extends Component {

    @property(SkeletalAnimation)
    ani:SkeletalAnimation = null;

    @property(Sprite)
    green:Sprite = null;

    @property(Node)
    bubbleNode:Node = null;

    private _playingAni:string = "base_idle";

    private _rangeMax:number = 15;
    private _rangeNow:number = 0;

    private _soundLimit:number = 5;
    private _soundTime:number = 0;

    start() {
        this.green.fillRange=0;
    }

    update(dt: number) {
        // if(this._playingAni==="base_idle"){
        //     this._soundTime+=dt;
        //     if(this._soundTime>this._soundLimit){
        //         this._soundTime=0;
        //         SoundManager.inst.playAudio("DC_tanqi");
        //     }
        // }
    }

    public addMoney(){
        this._rangeNow++;
        if(this._rangeNow>this._rangeMax){
            this._rangeNow=0;
        }
        this.green.fillRange=this._rangeNow/this._rangeMax;
    }

    public playIdle(){
        if(this._playingAni!=="base_idle"){
            this._playingAni = "base_idle";
            this.ani.play("base_idle");
            this.bubbleNode.active=true;
            this.green.fillRange=0;
            //停止播放声音
            SoundManager.inst.stopMeraBGM();
            SoundManager.inst.stopMachineBGM();
            DataManager.Instance.effectManager.effectScene1Nomal();
        }
    }

    public playOperate(){
        if(this._playingAni!=="operate"){
            this._playingAni = "operate";
            this.ani.play("operate");
            this.bubbleNode.active=false;
            this.green.fillRange=0;

            SoundManager.inst.playAudio("DC_kaixin");
            this.scheduleOnce(()=>{
                SoundManager.inst.playMeraBGM();
            },0.5);
            SoundManager.inst.playMachineBGM();
            DataManager.Instance.effectManager.effectScene1Play();
        }
    }

}


