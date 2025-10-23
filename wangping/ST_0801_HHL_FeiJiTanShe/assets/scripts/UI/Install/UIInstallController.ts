import { _decorator, Button, Component, Node } from 'cc';
import EventManager from '../../EventManager/EventManager';
import EventType from '../../EventManager/EventType';
const { ccclass, property } = _decorator;

@ccclass('UIInstallController')
export class UIInstallController extends Component {

    @property(Node)
    tweener: Node


    @property(Button)
    installBtn: Button

    start() {
        EventManager.addEventListener(EventType.SHOW_INSTALL, this.onShow, this)
        this.installBtn.node.on(Button.EventType.CLICK, this.onInstallBtnClick, this)
    }

    protected onDestroy(): void {
        EventManager.remveEventListener(EventType.SHOW_INSTALL, this.onShow, this)
    }

    update(deltaTime: number) {
    }

    onShow(isShow: boolean) {
        this.tweener.active = true;
        this.scheduleOnce(() => {
            EventManager.dispatchEvent(EventType.PLAYABLE_DOWNLOAD);
            EventManager.dispatchEvent(EventType.PLAYABLE_GAME_END);
        }, 1);
    }

    onInstallBtnClick() {
        EventManager.dispatchEvent(EventType.PLAYABLE_DOWNLOAD);
    }
}

