import { _decorator, Component, Node } from 'cc';
import { MoveBase } from './MoveBase';
import State from './State';
import { EventName, PlayerState } from '../../Common/Enum';
import { SoundManager } from '../../Global/SoundManager';
import { DataManager } from '../../Global/DataManager';
import { EventManager } from '../../Global/EventManager';

export class MoveAttackState extends State {
    private addTime: number = 0;
    private limitTime:number = 1.33;
    private isAttack: boolean = false;
    private moveBase: MoveBase = null;
    private callBack = null;
    onEnter(callback?: (...agrs: unknown[]) => void) {
        console.log("进入移动攻击状态");
        SoundManager.inst.playRunBGM();
        if (this.entity.ani.getState(PlayerState.MoveAttack).isPlaying) {
            return;

        }

        this.entity.ani.stop();
        // 检查骨骼动画组件是否存在
        if (!this.entity.ani) {
            console.error("骨骼动画组件未初始化");
            return;
        }
        this.moveBase = new MoveBase();
        this.entity.ani.crossFade(PlayerState.MoveAttack,0.6);
        this.isAttack = true;
        if (callback) {
            this.callBack = callback;
        }
    }
    onUpdate(dt: number) {
        this.moveBase.handleInput(dt, this.entity);
        if (this.isAttack) {
            this.addTime += dt;
            if (this.addTime >= this.limitTime) {
                this.addTime = 0;
                this.isAttack = false;
                DataManager.Instance.playerAction = true;
                
                if(DataManager.Instance.playerController?.checkAttack()){
                    this.isAttack = true;
                    this.entity.ani.play(PlayerState.MoveAttack);
                }else{
                    this.callBack?.(this.isAttack);
                }
            }
        }

        //console.log("移动攻击状态更新")
    }
    onExit(callback?: (...agrs: unknown[]) => void) {
        this.isAttack = false;
        console.log("退出移动攻击状态");
        EventManager.inst.emit(EventName.StopAttackEffect);
    }

}


