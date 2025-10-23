import { _decorator, Component, Node, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('NodeFollowing')
export class NodeFollowing extends Component {

    @property(Node)
    targetNode: Node

    start() {
    }

    update(deltaTime: number) {
        const pos = new Vec3();
        pos.set(this.targetNode.worldPosition)
        this.node.worldPosition = pos;
    }
}

