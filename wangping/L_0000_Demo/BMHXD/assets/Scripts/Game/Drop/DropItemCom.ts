import { _decorator, Tween, tween, Vec3, Node, v3 } from "cc";
import { PoolObjectBase } from "../../common/PoolObjectBase";
const { ccclass, property } = _decorator;

@ccclass('DropItemCom')
export class DropItemCom extends PoolObjectBase {
    public canPickup: boolean = false;

    private tween: Tween<Node> = null!;

    /**
     * 播放掉落后的旋转动画
     */
    public showRotate(){
        Tween.stopAllByTarget(this.node);
        this.node.setRotationFromEuler(0, 0, 0);
        this.tween = tween(this.node)
            .to(0.2, { scale: v3(1.5, 1.5, 1.5) })
            .repeatForever()
            .start();
    }

    reset(){
        this.canPickup = false;
        this.node.setRotationFromEuler(0, 0, 0);
        Tween.stopAllByTarget(this.node);
        this.node.setScale(1, 1, 1);
    }
}