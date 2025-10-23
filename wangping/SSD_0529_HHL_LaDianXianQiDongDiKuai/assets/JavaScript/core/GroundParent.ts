import { _decorator, Component, Node } from 'cc';
import { CloudEffct } from './CloudEffct';
const { ccclass, property } = _decorator;

@ccclass('GroundParent')
export class GroundParent extends Component {
    @property(Node)
    protected cloudNode: Node = null;
    protected siblings: Node[] = null;


    

    cloudFadeEffct(isFade: boolean) {
        this.siblings = this.cloudNode.children;
        if (this.siblings.length === 0) {
            console.warn("当前云节点没有子节点");
            return;
        }
        // 遍历并处理同级节点
        this.siblings.forEach((sibling, index) => {
            sibling.getComponent(CloudEffct).startEffect(isFade);
        });
    }
    start() {

    }

    update(deltaTime: number) {

    }
}


