import { _decorator, Component, Node,Animation } from 'cc';
import State from './State';
import { CharacterType } from '../Entitys/Entity';
const { ccclass, property } = _decorator;

@ccclass('AttackState')
export class AttackState extends State {
    private addTime: number = 0;
    private isAttack: boolean = false;
    private limitTime:number = 0.6
    private callBack = null;
    onEnter(callback?: (...agrs: unknown[]) => void) {
        if (this.entity.getType() == CharacterType.Player) {
            if (this.entity.characterSkeletalAnimation.getState("Attack_Woodcutter").isPlaying) {
                return;
            }
            this.entity.characterSkeletalAnimation.stop();
            // 检查骨骼动画组件是否存在
            if (!this.entity.characterSkeletalAnimation) {
                console.error("骨骼动画组件未初始化");
                return;
            }
            this.entity.characterSkeletalAnimation.play("Attack_Woodcutter");
            this.entity.characterSkeletalAnimation.once(Animation.EventType.FINISHED, () => {                
                this.entity.characterSkeletalAnimation.stop();
                this.entity.idle();
            })
            
            this.isAttack = true;
            if (callback) {
                this.callBack = callback;
            }
        }
    }
    onUpdate(dt: number) {
        if (this.isAttack) {
            this.addTime += dt;
            if (this.addTime >= this.limitTime) {
                this.addTime = 0;
                this.isAttack = false;
                this.callBack?.();
            }
        }
        // throw new Error('Method not implemented.');
    }
    onExit(callback?: (...agrs: unknown[]) => void) {
        // throw new Error('Method not implemented.');
    }

}


