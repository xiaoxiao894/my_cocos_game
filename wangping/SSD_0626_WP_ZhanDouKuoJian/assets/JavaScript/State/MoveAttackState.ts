import { _decorator, Component, Node } from 'cc';
import State from './State';
import { CharacterType } from '../Entitys/Entity';
import { MoveBase } from './MoveBase';
import { SoundManager } from '../core/SoundManager';
const { ccclass, property } = _decorator;

@ccclass('MoveAttackState')
export class MoveAttackState extends State {
    private addTime: number = 0;
    private limitTime: number = 0.5
    private isAttack: boolean = false;
    private moveBase: MoveBase = null;
    private callBack = null;
    onEnter(callback?: (...agrs: unknown[]) => void) {
        // console.log("进入移动攻击状态")
        if (this.entity.getType() == CharacterType.Player) {
            if (this.entity.characterSkeletalAnimation.getState("Run_Attack_Woodcutter").isPlaying) {
                return;

            }
            this.entity.characterSkeletalAnimation.stop();
            // 检查骨骼动画组件是否存在
            if (!this.entity.characterSkeletalAnimation) {
                console.error("骨骼动画组件未初始化");
                return;
            }
            this.moveBase = new MoveBase();
            console.log("动作 runAttack");
            this.entity.characterSkeletalAnimation.crossFade("Run_Attack_Woodcutter", 0.1);
            this.isAttack = true;
            if (callback) {
                this.callBack = callback;
            }
        }
        SoundManager.inst.playRunBGM();
    }
    onUpdate(dt: number) {
        console.log("=============> isAttack")
        this.moveBase.handleInput(dt, this.entity);
        if (this.isAttack) {
            this.addTime += dt;
            if (this.addTime >= this.limitTime) {
                this.addTime = 0;
                this.isAttack = false;
                this.callBack?.(this.isAttack);
                //  this.entity.moveAttack();
            }
        }

        // console.log("移动攻击状态更新")
    }
    onExit(callback?: (...agrs: unknown[]) => void) {
        this.isAttack = false;
        SoundManager.inst.stopRunBGM();

        // console.log("退出移动攻击状态")
    }

}


