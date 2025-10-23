import { _decorator, Animation, Component, Node } from 'cc';
import Player from './Player';
import { PlayerTrigger } from './PlayerTrigger';
import { SoundManager } from '../Global/SoundManager';
import { DataManager } from '../Global/DataManager';
import { EventManager } from '../Global/EventManager';
import { EventName } from '../Common/Enum';
const { ccclass, property } = _decorator;

@ccclass('PlayerAniEvent')
export class PlayerAniEvent extends Component {
    @property(Player)
    player: Player = null!;

    @property(PlayerTrigger)
    playerTrigger: PlayerTrigger = null!;

    @property(Animation)
    attackAni: Animation = null!;

    start() {
        this.attackAni.node.active = false;
        this.attackAni.on(Animation.EventType.FINISHED, this.attackAniOver, this);
    }

    protected onEnable(): void {
        EventManager.inst.on(EventName.StopAttackEffect,this.stopAttackEffect,this);
    }

    protected onDisable(): void {
        EventManager.inst.off(EventName.StopAttackEffect,this.stopAttackEffect,this);
    }



    update(deltaTime: number) {
        
    }

    // 攻击事件
    private onAttack(){
        this.player.realAttackMonster();
        this.playerTrigger.onAttackCorn();
    }

    //攻击动画播放
    public onAttackAni(){
        console.log("攻击动画播放");
        this.attackAni.node.active = true;
        this.attackAni.play();
        SoundManager.inst.playAudio("wuqi2");
    }

    private attackAniOver(){
        this.attackAni.node.active = false;
    }

    private stopAttackEffect():void{
        if(this.attackAni.node.active){
            this.attackAni.stop();
            this.attackAni.node.active = false;
        }
    }

    private secendSound():void{
        SoundManager.inst.playAudio("wuqi2");
    }

    centerAttackEnd() {
        // if (DataManager.Instance.playerAction) {
        //     DataManager.Instance.playerAction = false;
        // }
    }

    attackEnd(name) {
        //DataManager.Instance.playerAction = true;
    }

}


