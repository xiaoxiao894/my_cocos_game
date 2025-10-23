import { _decorator, Component, Input, Node } from 'cc';
import Platform from '../Common/Platform';
import super_html_playable from '../Common/super_html_playable';
const { ccclass, property } = _decorator;

@ccclass('IconManager')
export class IconManager extends Component {
    @property(Node)
    downLoad: Node = null;

    start() {
        this.downLoad.on(Input.EventType.TOUCH_END, this.onTouchEnd, this);
    }

    onTouchEnd() {
        super_html_playable.download();
    }

    update(deltaTime: number) {

    }
}


