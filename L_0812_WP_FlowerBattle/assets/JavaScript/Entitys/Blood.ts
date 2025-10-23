import { _decorator, Component, ProgressBar, tween } from "cc";
import { App } from "../App";
import { GlobeVariable } from "../core/GlobeVariable";

/**
 * 怪的血量控制
 */
const { ccclass, property } = _decorator;
@ccclass("Blood")
export default class Blood extends Component {
    @property(ProgressBar)
    redProgress:ProgressBar = null;

    @property(ProgressBar)
    greenProgress:ProgressBar = null;

    private _bloodMax:number = 100;
    private _bloodNow:number = 100;

    /**
     * 初始化
     * @param blood 总血量
     */
    public init(blood:number){
        this._bloodMax = blood;
        this._bloodNow = blood;
        this.redProgress.progress = 1;
        this.greenProgress.progress = 1;
    }

    /**
     * 受伤掉血
     * @param harm 伤害值
     */
    public injuryAni(harm:number){
        this._bloodNow = Math.max(0, this._bloodNow - harm);
        const targetProgress = this._bloodNow / this._bloodMax;
        this.redProgress.progress = targetProgress;
        tween(this.greenProgress)
            .to(0.5, { progress: targetProgress }, { easing: 'quadInOut' })
            .call(()=>{
                if(this._bloodNow <= 0){
                    this.recycleSelf();
                }
            })
            .start();
    }

    /** 回收自己 */
    private recycleSelf(){
        this.node.active = false;
        this.node.removeFromParent();
        App.poolManager.returnNode(this.node, GlobeVariable.entifyName.BloodBar);
    }
}