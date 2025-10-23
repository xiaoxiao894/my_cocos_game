import { _decorator, Animation, Component,Node, Vec3 } from "cc";
import { EventManager } from "../Global/EventManager";
import { EventName } from "../Common/Enum";
import GameUtils from "../Util/GameUtils";
import { DataManager } from "../Global/DataManager";
import { SoundManager } from "../Global/SoundManager";
const { ccclass, property } = _decorator;

@ccclass("MapController")
export default class MapController extends Component {
    //城外相关
    @property(Node)
    outPlotNode:Node = null;
    @property(Node)
    outFamersNode:Node = null;

    //城内相关
    @property(Node)
    centerNode:Node = null;
    @property(Node)
    bloodArea:Node = null;
    @property(Node)
    bloodPosList:Node[] = [];

    private _bloodPosStates:boolean[] = [true,true,true,true,true];


    protected onLoad(): void {
        DataManager.Instance.mapController = this;
        DataManager.Instance.centerPos = this.centerNode.worldPosition.clone();
        //隐藏
        this.outPlotNode.active = false;
        this.outFamersNode.active = false;
        this.bloodArea.active = false;
        // this.lawnMower.active = false;
        // this.deliverLawnArea.active = false;
        // this.unlockLawnMowerArea.active = false;
        // this.unlockLawnMowerAni.node.active = false;
        //展示
    }

    protected onEnable(): void {
        //EventManager.inst.on(EventName.UnlockLawnMower,this.unlockLawnMower,this);
        EventManager.inst.on(EventName.ShowMonster,this.showUnlockLawnMowerArea,this);

        EventManager.inst.on(EventName.GameOver,this.gameEnd,this);
        EventManager.inst.on(EventName.AllWallUnlock,this.showBloodArea,this);
    }

    protected onDisable(): void {
        //EventManager.inst.off(EventName.UnlockLawnMower,this.unlockLawnMower,this);
        EventManager.inst.off(EventName.ShowMonster,this.showUnlockLawnMowerArea,this);

        EventManager.inst.off(EventName.GameOver,this.gameEnd,this);
        EventManager.inst.off(EventName.AllWallUnlock,this.showBloodArea,this);
    }

    /** 显示解锁割草机地块 */
    private showUnlockLawnMowerArea():void{
        //GameUtils.showNodeAni(this.unlockLawnMowerArea);
    }

    /** 解锁割草机 */
    // private unlockLawnMower():void{
    //     this.unlockLawnMowerArea.active = false;
    //     GameUtils.showAni(this.lawnMower);
    //     GameUtils.showNodeAni(this.deliverLawnArea);
    //     SoundManager.inst.playAudio("jiesuo");
    //     this.unlockLawnMowerAni.node.active = true;
    //     this.unlockLawnMowerAni.play();
    //     this.unlockLawnMowerAni.on(Animation.EventType.FINISHED,()=>{
    //         this.unlockLawnMowerAni.node.active = false;
    //     });
    // }

    private showBloodArea():void{
        GameUtils.showNodeAni(this.bloodArea);
    }

    public getBloodIndex():number{
        for(let i = 0;i<this._bloodPosStates.length;i++){
            if(this._bloodPosStates[i]){
                return i;
            }
        }
        return -1;
    }

    public getBloodPosByIndex(index:number):Vec3{
        this._bloodPosStates[index] = false;
        return this.bloodPosList[index].worldPosition.clone();
    }

    public returnBloodPosByIndex(index:number):void{
        this._bloodPosStates[index] = true;
    }

    //游戏结束
    private gameEnd():void{
        this.scheduleOnce(()=>{
            this.outPlotNode.active = true;
            this.outFamersNode.active = true;
        },1);
    }

}