import { _decorator, Component, Node, Quat, Sprite } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('BubbleManager')
export class BubbleManager extends Component {
    private initialWorldRotation: Quat = new Quat();
    start() {
        this.node.getWorldRotation(this.initialWorldRotation);
    }

    update(dt: number) {
        this.node.setWorldRotation(this.initialWorldRotation);
    }

    // 气泡动画
    bubbleAni() {
        const greenBubbleNode = this.node.getChildByName("Base01");
        const duckIcon = this.node.getChildByName("DuckIcon");
        const rightNode = this.node.getChildByName("Right");

        if (!greenBubbleNode || !rightNode || !duckIcon) return;

        const greenBubbleSprite = greenBubbleNode.getComponent(Sprite);
        if (!greenBubbleSprite) return;


        greenBubbleSprite.fillRange = 1;

        this.scheduleOnce(() => {
            duckIcon.active = false;
            greenBubbleNode.active = false;
            rightNode.active = true;

            this.scheduleOnce(() => {
                this.node.active = false;
                rightNode.active = false;
            }, 1);

        }, 0.2);
    }

}


