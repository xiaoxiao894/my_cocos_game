import { _decorator, Component, Node } from 'cc';
import State from './State';
import { CharacterType } from '../Entitys/Entity';
const { ccclass, property } = _decorator;

@ccclass('IdleState')
export class IdleState extends State {
    onEnter(callback?: (...agrs: unknown[]) => void) {
        // console.log("进入待机状态")
        if (this.entity.getType() == CharacterType.Player) {
            this.entity.characterSkeletalAnimation.stop();
            // 检查骨骼动画组件是否存在
            if (!this.entity.characterSkeletalAnimation) {
                console.error("骨骼动画组件未初始化");
                return;
            }

            this.entity.characterSkeletalAnimation.crossFade("Idle_Woodcutter", 0.1);

        }
    }
    onUpdate(dt: number) {
        //  throw new Error('Method not implemented.');
    }
    onExit(callback?: (...agrs: unknown[]) => void) {
        // console.log("退出待机状态")
    }

}


