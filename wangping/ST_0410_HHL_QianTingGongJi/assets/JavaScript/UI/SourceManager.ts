import { _decorator, Component, Node, tween, UIOpacity, Vec3 } from 'cc';
import { DataManager } from '../Globel/DataManager';
const { ccclass, property } = _decorator;

const minScale = 0.9;
const maxScale = 1.1;
const duration = 1;

@ccclass('SourceManager')
export class SourceManager extends Component {
    @property(Node)
    uiRoot: Node = null;

    @property(Node)
    bg: Node = null;

    @property(Node)
    sourceTitleNode: Node = null;

    start() {
        DataManager.Instacne.sourceManager = this;

        this.bg.active = false;
        this.node.active = false;
        this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);

        this.sourceTitleNode.setScale(new Vec3(0, 0.7, 0.7));
        const sourceTitleOpacity = this.sourceTitleNode.getComponent(UIOpacity);
        sourceTitleOpacity.opacity = 255;
    }

    // 点击之后要做的事情
    onTouchEnd() {

    }

    // 显示成功页面
    displaySourcePage() {
        this.uiRoot.active = false;
        this.node.active = true;
        this.bg.active = true;

        if (DataManager.Instacne.isTurnSound) {
            DataManager.Instacne.soundManager.winSoundPlay();
        } else {
            DataManager.Instacne.soundManager.winSoundPause();
        }

        this.sourceTitleNode.active = true;
        const sourceTitleNodeOpacity = this.sourceTitleNode.getComponent(UIOpacity);
        tween(this.sourceTitleNode)
            .to(0.3, { scale: new Vec3(0.8, 0.8, 0.8) })
            .to(0.1, { scale: new Vec3(0.7, 0.7, 0.7) })
            .start();

        tween(sourceTitleNodeOpacity)
            .delay(1.9)
            .to(0.4, { opacity: 0 })
            .start();
    }

    // 隐藏成功页面
    hideSourcePage() {
        this.uiRoot.active = false;
        // this.node.active = false;
        this.bg.active = false;

        const sourceTitleOpacity = this.sourceTitleNode.getComponent(UIOpacity);
        tween(sourceTitleOpacity)
            .to(0.5, { opacity: 0 })
            .start();
    }
}

