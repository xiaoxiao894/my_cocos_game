import { _decorator, Component, ProgressBar, Sprite, SpriteFrame, tween } from "cc";
import { NodePoolManager } from "./NodePoolManager";
import { EntityTypeEnum } from "./Enum";

/**
 * 怪的血量控制
 */
const { ccclass, property } = _decorator;
@ccclass("Blood")
export default class Blood extends Component {

    @property(SpriteFrame)
    bloodSpriteFrames:SpriteFrame[] = [];

    @property(Sprite)
    bloodSprite:Sprite = null;

    @property(ProgressBar)
    bloodProgress:ProgressBar = null;

    @property(ProgressBar)
    whiteProgress:ProgressBar = null;

    private _bloodMax:number = 100;
    private _bloodNow:number = 100;
    /** 最低血量 */
    private _bloodMin:number = 0;

    /**
     * 初始化
     * @param blood 总血量
     */
    public init(type:EntityTypeEnum,blood:number,bloodNow:number = blood,bloodMin:number = 0){
        this._bloodMax = blood;
        this._bloodNow = bloodNow;
        this._bloodMin = bloodMin;
        const targetProgress = this._bloodNow / this._bloodMax;
        this.bloodProgress.progress = targetProgress;
        this.whiteProgress.progress = targetProgress;
        if(type === EntityTypeEnum.Monster){
            this.node.setScale(1,1,1);
            this.bloodSprite.spriteFrame = this.bloodSpriteFrames[1];
        }else{
            this.node.setScale(1,1,1);
            this.bloodSprite.spriteFrame = this.bloodSpriteFrames[0];
        }
    }

    /**
     * 受伤掉血
     * @param harm 伤害值
     */
    public injuryAni(harm:number){
        this._bloodNow = Math.max(this._bloodMin, this._bloodNow - harm);
        const targetProgress = this._bloodNow / this._bloodMax;
        this.bloodProgress.progress = targetProgress;
        tween(this.whiteProgress)
            .to(0.5, { progress: targetProgress }, { easing: 'quadInOut' })
            // .call(()=>{
            //     if(this._bloodNow <= this._bloodMin){
            //         this.recycleSelf();
            //     }
            // })
            .start();
    }

    /** 恢复 */
    public recoverAllBlood(){
        this._bloodNow = this._bloodMax;
        this.bloodProgress.progress = 1;
        this.whiteProgress.progress = 1;
    }

    /** 回收自己 */
    private recycleSelf(){
        this.node.active = false;
    }
}