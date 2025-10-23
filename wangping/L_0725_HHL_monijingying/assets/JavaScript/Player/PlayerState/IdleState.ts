import { _decorator, RigidBody, Vec3 } from 'cc';
import State from './State';
import { PlayerState } from '../../Common/Enum';
import { SoundManager } from '../../Global/SoundManager';

export class IdleState extends State {
    onEnter(callback?: (...agrs: unknown[]) => void) {
        console.log("进入待机状态");
        SoundManager.inst.stopRunBGM();
        this.entity.getComponent(RigidBody)?.setLinearVelocity(Vec3.ZERO);
        this.entity.getComponent(RigidBody)?.setAngularVelocity(Vec3.ZERO);

            this.entity.ani.stop();
            // 检查骨骼动画组件是否存在
            if (!this.entity.ani) {
                console.error("骨骼动画组件未初始化");
                return;
            }

            this.entity.ani.crossFade(PlayerState.Idle, 0.3);
    }
    onUpdate(dt: number) {
        //  throw new Error('Method not implemented.');
    }
    onExit(callback?: (...agrs: unknown[]) => void) {
        console.log("退出待机状态")
    }

}


