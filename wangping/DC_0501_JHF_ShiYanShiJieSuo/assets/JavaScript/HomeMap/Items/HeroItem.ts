import { _decorator, Component, Node, SkeletalAnimation,CCString, CCInteger, animation, Animation } from 'cc';
import { EventManager } from '../../Global/EventManager';
import { EventNames } from '../../Enum/Index';
import { SoundManager } from '../../Common/SoundManager';
const { ccclass, property } = _decorator;

@ccclass('HeroItem')
export class HeroItem extends Component {

    @property(SkeletalAnimation)
    ani:SkeletalAnimation = null;

    @property(CCString)
    soundName:string = "";

    @property(CCString)
    heroName:string = "";

    @property(Animation)
    attackAni:Animation = null;

    //private _atking:boolean=false;

    private _atkTime:number = 0;

    protected onEnable(): void {
        EventManager.inst.on(EventNames.MonsterGiveMoney,this.onMonsterDead,this);
        EventManager.inst.on(EventNames.MonsterBattle,this.onMonsterCome,this);
    }

    protected onDisable(): void {
        EventManager.inst.off(EventNames.MonsterGiveMoney,this.onMonsterDead,this);
        EventManager.inst.off(EventNames.MonsterBattle,this.onMonsterCome,this);
    }

    private onMonsterDead():void{
        //this._atking = false;
        //this.playIdle();
    }

    private onMonsterCome():void{
        //this._atking=true;
        //this.playAtk();
    }


    // public playIdle(){
    //     this.ani.play(this.idleName);
    // }

    // public playAtk(){
    //     this.ani.play(this.atkName);
    // }

    start() {
        this.attackAni.node.active = false;
    }

    private attackMonster(){
        EventManager.inst.emit(EventNames.MonsterBeaten,this.heroName);
        SoundManager.inst.playAudio(this.soundName);
        
    }

    private createMonster(){
        EventManager.inst.emit(EventNames.CreatMonster,this.heroName);
    }

    private playAtkAni(){
        this.attackAni.node.active = true;
        this.attackAni.play();
        this.attackAni.once(Animation.EventType.FINISHED,()=>{
            this.attackAni.node.active = false;
        });
    }

}


