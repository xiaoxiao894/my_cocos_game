import { _decorator, Component, find, math, Node, v3, Vec3, Quat } from 'cc';
import State from './State';
import { VirtualInput } from '../UI/VirtuallInput';
import { CharacterType } from '../Entitys/Entity';
import { MoveBase } from './MoveBase';
import { App } from '../App';
import { SoundManager } from '../core/SoundManager';
const { ccclass, property } = _decorator;

@ccclass('MoveState')
export class MoveState extends State {

    private moveBase: MoveBase = null;
    onEnter(callback?: (...agrs: unknown[]) => void) {
        // console.log("进入移动状态")
        if (this.entity.getType() == CharacterType.Player) {
            if (this.entity.characterSkeletalAnimation.getState("Run_Woodcutter").isPlaying) {
                return;
            }
            this.entity.characterSkeletalAnimation.stop();

            // 检查骨骼动画组件是否存在
            if (!this.entity.characterSkeletalAnimation) {
                // console.error("骨骼动画组件未初始化");
                return;
            }
            this.moveBase = new MoveBase();
            this.entity.characterSkeletalAnimation.crossFade("Run_Woodcutter", 0.1);

        }
        SoundManager.inst.playRunBGM();
    }

    onUpdate(dt: number) {
        console.log("=============> move")
        this.moveBase.handleInput(dt, this.entity);
    }

    onExit(callback?: (...agrs: unknown[]) => void) {
        // console.log("退出移动状态")
        SoundManager.inst.stopRunBGM();
    }
}