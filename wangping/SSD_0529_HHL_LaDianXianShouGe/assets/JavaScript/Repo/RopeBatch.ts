
import { _decorator, BatchingUtility, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('RopeBatch')
export class RopeBatch extends Component {
    @property(Node)
    staticModalNode:Node = null;

    @property(Node)
    batchNode:Node = null;

    public batchStaticModel() {
        BatchingUtility.batchStaticModel(this.staticModalNode,this.batchNode);
    }

    public unbatchStaticModel() {
        BatchingUtility.unbatchStaticModel(this.staticModalNode,this.batchNode);
    }

}


