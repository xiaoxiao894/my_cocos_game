import { _decorator, Component, Node, Enum, Prefab, RigidBodyComponent, UITransform, v3, PhysicsSystem } from 'cc';
import { RopeGeneratorNew_V2 } from './RopeGeneratorNew_V2';
const { ccclass, property } = _decorator;

export enum PHY_GROUP {
    Group0 = 1 << 0,
    Group1 = 1 << 1,
}
Enum(PHY_GROUP);

@ccclass('Rope3D_V2')
export class Rope3D_V2 extends Component {

    @property({ type: Node })
    plugTar: Node = null;

    @property({ type: Node })
    staticTar: Node = null;

    @property({ type: Node })
    ropeNode: Node;

    @property
    nodeCount: number = 30

    private StartPointX = 0;

    start() {
        this.ropeNode.getComponent(RopeGeneratorNew_V2).createRope(this.nodeCount, this.staticTar, this.plugTar);
    }

    onStartPointHeight(customEventData: any) {

        if (this.node.active == false) {
            return;
        }

        const value = customEventData._progress;

        let { x, y, z } = this.plugTar.position;
        x = value * 5;
        this.plugTar.setPosition(v3(x, y, z));
    }

}