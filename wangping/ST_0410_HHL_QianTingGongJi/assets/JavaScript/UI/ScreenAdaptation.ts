import { _decorator, Component, Node, UITransform, view, Widget } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ScreenAdaptation')
export class ScreenAdaptation extends Component {

    // 喇叭
    @property(Node)
    speakerNode: Node = null;

    @property(Node)
    speakerOpenNode: Node = null;

    @property(Node)
    speakerCloseNode: Node = null;

    // 中心
    @property(Node)
    centerNode: Node = null;

    // 目标
    @property(Node)
    targetIcon: Node = null;

    @property(Node)
    targetNum: Node = null;

    // 相机缩放
    @property(Node)
    scaleCamera: Node = null;

    @property(Node)
    fireButton: Node = null;


    onLoad() {

    }

    start() {
    }

    update(deltaTime: number) {
        const visibleSize = view.getVisibleSize();
        const screenWidth = visibleSize.width;
        const screenHeight = visibleSize.height;

        const proportion = screenWidth / screenHeight;

        // 中心
        const centerNodeWig = this.centerNode.getComponent(Widget);
        // 缩放相机
        const scaleCamera = this.scaleCamera.getComponent(Widget);

        if (proportion >= 1.5) {
            if (centerNodeWig) centerNodeWig.enabled = false;
            if (scaleCamera) scaleCamera.enabled = false;
        } else {
            if (centerNodeWig) centerNodeWig.enabled = true;
            if (scaleCamera) scaleCamera.enabled = true
        }

        if (proportion <= 1) {
            this.fireButton.setPosition(350,-700,0);
        } else {
            this.fireButton.setPosition(650,-520,0);
        }
    }
}

