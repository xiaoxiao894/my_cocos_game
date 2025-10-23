import { _decorator,  Animation, CCString, Component, instantiate, Node, Prefab } from 'cc';
import {  EntityTypeEnum, EventName, PrefabPathEnum } from './Common/Enum';
import { ResourceManager } from './Global/ResourceManager';
import { DataManager } from './Global/DataManager';
import { EventManager } from './Global/EventManager';
import { RepeatLand } from './Areas/RepeatLand';
import { DissolveEffect } from '../Res/DissolveEffect/scripts/DissolveEffect';
import { SoundManager } from './Common/SoundManager';
import super_html_playable from './Common/super_html_playable';
const { ccclass, property } = _decorator;

@ccclass('SceneManager')
export class SceneManager extends Component {

    @property(Node)
    socketNode:Node = null;

    @property(Node)
    effectNode:Node = null;

    @property(Node)
    liftPlugPosNode:Node = null;
    @property(Node)
    plugInPosNode:Node = null;
    @property(Node)
    deliverWoodPosNode:Node = null;

    @property(RepeatLand)
    repeatLands:RepeatLand[]=[];

    @property(Animation)
    repeatLandAni:Animation = null;

    @property(Animation)
    rightLandAni:Animation = null;

    @property(DissolveEffect)
    dissolveEffect:DissolveEffect[] = [];

    @property(Node)
    endGameNode:Node = null;

    @property(Animation)
    fenceAni:Animation = null;

    @property({type:CCString,tooltip:"围墙音效名字"})
    wallSoundName:string = "YX_weiqiangSC";

    async start() {
        const google_play = "https://play.google.com/store/apps/details?id=com.funplus.ts.global";
        const appstore = "https://play.google.com/store/apps/details?id=com.funplus.ts.global";

        super_html_playable.set_google_play_url(google_play);
        super_html_playable.set_app_store_url(appstore);

        DataManager.Instance.sceneManger = this;
        DataManager.Instance.socketNode = this.socketNode;
        this.repeatLandAni.node.active = false;
        this.rightLandAni.node.active = false;
        this.fenceAni.node.active = false;
        await Promise.all([this.loadRes()])
        this.initGame();
    }

    async loadRes() {
        const list = [];
        for (const type in PrefabPathEnum) {
            const p = ResourceManager.Instance.loadRes(PrefabPathEnum[type], Prefab).then((Prefab) => {
                DataManager.Instance.prefabMap.set(type, Prefab)
            })
            list.push(p);
        }

        await Promise.all(list);
    }

    protected onEnable(): void {
        EventManager.inst.on(EventName.FourBlockInit,this.repeatLandInit,this);
        EventManager.inst.on(EventName.BlockFallAniPlay,this.repeatLandPlayAni,this);
    }

    protected onDisable(): void {
        EventManager.inst.off(EventName.FourBlockInit,this.repeatLandInit,this);
        EventManager.inst.off(EventName.BlockFallAniPlay,this.repeatLandPlayAni,this);
    }


    initGame() {
        //预加载音乐音效
        SoundManager.inst.preloadAudioClips();
    }



    //初始化四个地块
    private repeatLandInit() {
        let i:number = 0;
        let timeId = setInterval(()=>{
            if(i<this.repeatLands.length){
                this.repeatLands[i].init();
                i++;
            }else{
                clearInterval(timeId);
            }
        },3000);
    }

    //四个地块播放动画
    private repeatLandPlayAni() {
        this.repeatLandAni.node.active = true;
        this.repeatLandAni.play();
        //云消散
        this.scheduleOnce(()=>{
            this.repeatLands[1].cloudAni();
        },0.36);
        this.scheduleOnce(()=>{
            this.repeatLands[2].cloudAni();
        },0.43);
        
        
        this.scheduleOnce(()=>{
            this.showRightLand();
        },1);
        this.scheduleOnce(()=>{
            this.schedule(this.repeatLandDowned,0.067);
        },0.33);
        
    }

    private _repeatSoundIndex:number = 0;

    /** 下落之后 */
    private repeatLandDowned(){
        SoundManager.inst.playAudio("jianzhuluodi");
        this.repeatLands[this._repeatSoundIndex].showShadows();
        this._repeatSoundIndex++;
        if(this._repeatSoundIndex>3){
            this.unschedule(this.repeatLandDowned);
        }
    }

    /** 右侧地块动画 */
    private showRightLand(){
        this.rightLandAni.node.active = true;
        this.rightLandAni.play();
        this.dissolveEffect.forEach((d:DissolveEffect)=>{
            d.play(1);
        });
        this.scheduleOnce(()=>{
            this.fenceAni.node.active = true;
            this.fenceAni.play();
            SoundManager.inst.playAudio(this.wallSoundName);
        },0.5);
        EventManager.inst.emit(EventName.ShowJoyStickFinal);
        //结束界面出现
        // this.scheduleOnce(()=>{
        //     if(!this.endGameNode.active){
        //         this.endGameNode.active = true;
        //     }
        // },3);
    }

    public showEndGameNode() {
        if(!this.endGameNode.active){
            this.endGameNode.active = true;
        }
    }
}

