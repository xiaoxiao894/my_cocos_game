import { _decorator, Component, Label, Node, tween, Vec3, ParticleSystem, UIOpacity } from 'cc';
import { DataManager } from '../Globel/DataManager';
const { ccclass, property } = _decorator;
/**
 * 死亡动画
 */
@ccclass('DieEffect')
export class DieEffect extends Component {

    @property(Node)
    labelMoveNode:Node = null;

    @property(Node)
    headShotNode:Node = null;

    @property(ParticleSystem)
    headShotParticle: ParticleSystem = null;

    @property(Label)
    bloodLabel: Label = null;

    public init(pos: Vec3, blood: number, isHeadShot: boolean) {
        let newStartPos:Vec3 = pos.clone();
        newStartPos.x+=1;
        newStartPos.z+=0.65;
        this.node.setWorldPosition(newStartPos);
        this.node.setWorldRotation(DataManager.Instance.cameraMain.cameraNode.getWorldRotation().clone());
        this.bloodLabel.string = blood.toString();
        if (isHeadShot) {
            this.headShotNode.active = true;
            this.headShotParticle.node.active = true;
            this.headShotParticle.play();
        } else {
            this.headShotParticle.node.active = false;
            this.headShotNode.active = false;
        }
        this.labelMoveNode.setScale(0,0);
        let movePos:Vec3 = this.labelMoveNode.position.clone();
        movePos.y += 0.5;
        tween(this.labelMoveNode).to(0.5, {scale:new Vec3(1,1,1),position:movePos}).start();
        this.scheduleOnce(()=>{
            tween(this.labelMoveNode.getComponent(UIOpacity)).to(0.5, {opacity:0}).start();
        },2.5);
        this.scheduleOnce(()=>{
            this.node.removeFromParent();
            this.node.destroy();
        },3);
    }
}


