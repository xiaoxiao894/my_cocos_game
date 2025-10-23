import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('OpenNode')
export class OpenNode extends Component {
    @property(Node)
    public openNode: Node[] = [];
    start() {
        for (let i = 0; i < this.openNode.length; i++) {
            this.openNode[i].active = true;
        }
    }


}


