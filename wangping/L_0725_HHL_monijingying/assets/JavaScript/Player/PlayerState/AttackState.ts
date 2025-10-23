import { _decorator,  RigidBody, Vec3 } from 'cc';
import State from './State';
import { EventName, PlayerState } from '../../Common/Enum';
import { SoundManager } from '../../Global/SoundManager';
import { DataManager } from '../../Global/DataManager';
import { EventManager } from '../../Global/EventManager';

const { ccclass, property } = _decorator;

@ccclass('AttackState')
export class AttackState extends State {
    private addTime: number = 0;
    private isAttack: boolean = false;
    private limitTime:number = 1.33;
    private attackTime:number = 1;
    private callBack = null;

    onEnter(callback?: (...agrs: unknown[]) => void) {
        console.log("进入攻击状态");
        SoundManager.inst.stopRunBGM();
        this.entity.getComponent(RigidBody)?.setLinearVelocity(Vec3.ZERO);
        if (this.entity.ani.getState(PlayerState.Attack).isPlaying) {
            return;
        }
        this.entity.ani.stop();
        // 检查骨骼动画组件是否存在
        if (!this.entity.ani) {
            console.error("骨骼动画组件未初始化");
            return;
        }
        this.entity.ani.play(PlayerState.Attack);
        
        this.isAttack = true;
        if (callback) {
            this.callBack = callback;
        }
    }

    onUpdate(dt: number) {
        if (this.isAttack) {
            this.addTime += dt;
            if(this.addTime >= this.attackTime){
                if(DataManager.Instance.playerController?.checkAttack()){
                    this.addTime = 0;
                    const state = this.entity.ani.getState(PlayerState.Attack);
                    state.setTime(0);
                    this.entity.ani.crossFade(PlayerState.Attack,0.1);
                }
            }
            if (this.addTime >= this.limitTime) {
                this.addTime = 0;
                this.isAttack = false;
                DataManager.Instance.playerAction = true;
                this.callBack?.();
            }
        }
        // throw new Error('Method not implemented.');
    }

    onExit(callback?: (...agrs: unknown[]) => void) {
        console.log("退出攻击状态");
        this.isAttack = false;
        // throw new Error('Method not implemented.');
        EventManager.inst.emit(EventName.StopAttackEffect);
    }

}


