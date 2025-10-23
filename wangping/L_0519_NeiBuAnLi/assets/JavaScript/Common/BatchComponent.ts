import { _decorator, BatchingUtility, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('BatchComponent')
export class BatchComponent extends Component {
    @property(Node)
    staticModalNode:Node = null;

    @property(Node)
    batchNode:Node = null;

    start() {
        BatchingUtility.batchStaticModel(this.staticModalNode,this.batchNode);
    }

}


