import { _decorator, Component, Label, Node, Sprite,  Animation, tween, Vec3, Tween, AnimationState, CCString } from 'cc';
import { EventManager } from '../Global/EventManager';
import { EventName } from '../Common/Enum';
import { DataManager } from '../Global/DataManager';
import { DissolveEffect } from '../../Res/DissolveEffect/scripts/DissolveEffect';
import { SoundManager } from '../Common/SoundManager';
const { ccclass, property } = _decorator;

@ccclass('TowerComponent')
export class TowerComponent extends Component {

    @property(Sprite)
    progressBar: Sprite = null;

    @property(Node)
    woodNode:Node = null;

    @property(Node)
    woodFlyEndNode: Node = null;

    @property(Node)
    firstShow:Node = null;

    @property(Node)
    secondShow:Node = null;

    @property(Node)
    thirdShow:Node = null;

    @property(Animation)
    upgradeEffect: Animation = null;

    @property(Node)
    upgradeNode:Node = null;

    @property(Node)
    upgradeNewNode:Node = null;

    @property(DissolveEffect)
    dissolveEffect:DissolveEffect = null;

    @property(Animation)
    levelUpEffect:Animation = null;

    @property(Animation)
    secondLevelUpEffect:Animation = null;

    @property(Animation)
    fireAnimation:Animation[] = [];

    @property(Label)
    numLabel:Label = null;


    private _nowNum: number = 0;
    /** 塔的等级 1 2 3 */
    private _towerLevel:number = 1;
    private _breathTweenPlaying:boolean = false;
    private _breathTime:number = 0;

    protected onEnable(): void {
        EventManager.inst.on(EventName.GiveTowerWood, this.onGiveTowerWood, this);
    }

    protected onDisable(): void {
        EventManager.inst.on(EventName.GiveTowerWood, this.onGiveTowerWood, this);
    }

    start() {
        this.upgradeNode.active = true;
        this.upgradeNewNode.active = false;
        this.updateProgress();
        DataManager.Instance.woodEndNode = this.woodFlyEndNode;
        this.firstShow.active = true;
        this.secondShow.active = false;
        this.thirdShow.active = false;
        this.levelUpEffect.node.active = false;

        this.setFireAni(0);
    }

    update(deltaTime: number) {
        if(this._breathTweenPlaying){
            this._breathTime -= deltaTime;
            if(this._breathTime<=0){
                this._breathTweenPlaying = false;
                this.changeSpeed(1);
            }
        }
    }

    private updateProgress() {
        let need: number = DataManager.Instance.upgradeSecondWoodNum;
        let num = this._nowNum;
        if(this._towerLevel == 1){
            
        }else{
            num = num - DataManager.Instance.upgradeSecondWoodNum;
            need = DataManager.Instance.upgradeThirdWoodNum - DataManager.Instance.upgradeSecondWoodNum;
        }
        

        this.progressBar.fillRange = num / need;
        
        this.numLabel.string = `${num} / ${need}`;
    }

    private onGiveTowerWood(): void {
        this._nowNum = DataManager.Instance.towerWoodNum;
        if(this._towerLevel ==1&&this._nowNum>=DataManager.Instance.upgradeSecondWoodNum){
            this.firstUpgradeEffect();
        }else if(this._towerLevel ==2&&this._nowNum>=DataManager.Instance.upgradeThirdWoodNum){
            this.secondUpgradeEffect();
        }
        this.updateProgress();
        this.playBreathAni();
    }


    /** 第一次升级动画 */
    private firstUpgradeEffect(): void {
        //绳子长度升级
        DataManager.Instance.wireLen = DataManager.Instance.wireSecendLen;
        
        this._towerLevel = 2;
        this.secondShow.active = true;
        this.thirdShow.active = false;
        this.upgradeEffect.play("shengji01");
        this.scheduleOnce(()=>{
            this.levelUpEffect.node.active =true;
            this.levelUpEffect.play();
        },0.15);
        //通知四块方块初始化
        EventManager.inst.emit(EventName.FourBlockInit);
        EventManager.inst.emit(EventName.RopeTotalLenChange);
        this.setFireAni(1);
        SoundManager.inst.playAudio("shengji1");
    }

    /** 第二次升级动画 */
    private secondUpgradeEffect(): void {
        this.upgradeNode.active = false;
        this._towerLevel = 3;
        this.firstShow.active = false;
        this.secondShow.active = false;
        this.thirdShow.active = true;
        this.upgradeEffect.play("shengji02");
        this.upgradeEffect.once(Animation.EventType.FINISHED,()=>{
            //通知四块方块落下
            EventManager.inst.emit(EventName.BlockFallAniPlay);
            EventManager.inst.emit(EventName.GameOver);
        });
        this.scheduleOnce(()=>{
            this.dissolveEffect.play(0.8);
        },0.1);
        this.scheduleOnce(()=>{
            this.levelUpEffect.play();
            this.secondLevelUpEffect.play();
        },0.15);
        this.scheduleOnce(()=>{
            this.upgradeNewNode.active = true;
            this.upgradeNewNode.setScale(0,0,0);
            tween(this.upgradeNewNode)
            .to(0.25, { scale: new Vec3(1, 1, 1) }, { easing: 'quadOut' })
            .start();
        },1.5);
        this.setFireAni(2);
        SoundManager.inst.playAudio("shengji3");
        SoundManager.inst.playAudio("shengji3_2");
        DataManager.Instance.isGameOver = true;
    }

    private playBreathAni() {
        this._breathTweenPlaying = true;
        this._breathTime = 0.4;
        this.changeSpeed(3);
    }

    private changeSpeed(speed:number){
        let ani:Animation = this.upgradeNode.getComponent(Animation);
        if(ani){
            let aniState:AnimationState = ani.getState("idleA");
            if(aniState){
                aniState.speed = speed;
            }
        }
    }

    private setFireAni(state:number){
        for(let i = 0;i<this.fireAnimation.length;i++){
            this.fireAnimation[i].node.active = state==i;
        }
    }

}


