import { _decorator, Component, Node, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('FlowNode')
export class FlowNode extends Component {
    @property(Node)
    public target: Node = null!;
    
    @property(Vec3)
    public offset: Vec3 = new Vec3();

    protected update(dt: number): void {
        this.node.setWorldPosition(this.target.getWorldPosition());

        const pos = this.node.getPosition();
        const newPos = pos.add(this.offset);
        this.node.setPosition(newPos);
    }
}


