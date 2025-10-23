import { _decorator, Component, Node, tween, tweenProgress, UITransform } from 'cc';
import { JumppManager } from './JumpManager';
import { UnityUpComponent } from '../../Base/UnityUpComponent';

const { ccclass, property } = _decorator;

@ccclass('PropFlyDriveEngine')
export class JumpDriveEngine extends UnityUpComponent {


    protected _update(dt: number): void {
        this.propFly(dt);
    }
    public propFly(dt: number) {
        let propFlyList = JumppManager.instacne.propFlyList;
        for (let i = propFlyList.length - 1; i >= 0; i--) {
            let fly = propFlyList[i];

            if (fly.isMoveOver) {
                propFlyList.splice(i, 1);
                fly.remove();
            } else {
                fly.moveOver(dt)
            }
        }
    }

}






