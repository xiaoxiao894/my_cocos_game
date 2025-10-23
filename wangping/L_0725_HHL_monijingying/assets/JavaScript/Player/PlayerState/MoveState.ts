import { _decorator, Component, find, math, Node, v3, Vec3, Quat } from 'cc';
import { MoveBase } from './MoveBase';
import State from './State';
import { PlayerState } from '../../Common/Enum';
import { SoundManager } from '../../Global/SoundManager';
const { ccclass, property } = _decorator;

@ccclass('MoveState')
export class MoveState extends State {

    private moveBase: MoveBase = null;
    onEnter(callback?: (...agrs: unknown[]) => void) {
        console.log("进入移动状态");
        SoundManager.inst.playRunBGM();
            if (this.entity.ani.getState(PlayerState.Move).isPlaying) {
                return;
            }
            this.entity.ani.stop();

            // 检查骨骼动画组件是否存在
            if (!this.entity.ani) {
                console.error("骨骼动画组件未初始化");
                return;
            }
            this.moveBase = new MoveBase();
            this.entity.ani.crossFade(PlayerState.Move, 0.8);
    }

    onUpdate(dt: number) {
        this.moveBase.handleInput(dt, this.entity);
    }

    onExit(callback?: (...agrs: unknown[]) => void) {
        console.log("退出移动状态")
    }


}