
import { _decorator, BoxCollider, CapsuleCollider, Component, Node, RigidBody } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ShipItem')
export class ShipItem extends Component {
    start() {
        const collider = this.node.getComponent(CapsuleCollider)
        if (collider) {
            collider.isTrigger = true;
        }

        const rigidBody = this.node.getComponent(RigidBody);
        if (rigidBody) {
            rigidBody.useGravity = false;
            rigidBody.linearDamping = 0;        // 线性阻尼
            rigidBody.angularDamping = 0;       // 旋转阻力
        }
    }

    update(deltaTime: number) {

    }
}


