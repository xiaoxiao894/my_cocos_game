import { _decorator, CCFloat, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('OilDrumEffect')
export class OilDrumEffect extends Component {

    @property(CCFloat)
    singleTime: number = 0.2;
    start() {
        // 先隐藏所有子节点
        this.allHide();

    }

    allHide() {
        const siblings = this.node.children;
        siblings.forEach((sibling, index) => {
            sibling.active = false;
        });

    }
    // 逐个隐藏子节点
    hideChildrenSequentially() {
        const siblings = this.node.children;
        siblings.forEach((sibling, index) => {
            this.scheduleOnce(() => {
                sibling.active = false;
            }, this.singleTime * (index + 1));
        });
    }

    // 逐个显示子节点
    showChildrenSequentially() {
        const siblings = this.node.children;
        siblings.forEach((sibling, index) => {
            this.scheduleOnce(() => {
                sibling.active = true;
            }, this.singleTime * (index + 1));
        });
        this.scheduleOnce(()=>{
            this.allHide();
        })
    }

    update(deltaTime: number) {
        // 不需要更新逻辑
    }
}