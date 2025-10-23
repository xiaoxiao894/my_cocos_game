import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

import EventType from '../../EventManager/EventType'
import EventManager from '../../EventManager/EventManager';

@ccclass('UIFingerDragController')
export class UIFingerDragController extends Component {

    @property(Node)
    fingerTweener: Node

    @property(Node)
    labelTweener: Node

    protected onLoad(): void {
        EventManager.addEventListener(EventType.HIDE_DRAG_TWEEN, this.onHideFinger, this);
    }

    protected onDestroy(): void {
        EventManager.remveEventListener(EventType.HIDE_DRAG_TWEEN, this.onHideFinger, this);
    }

    start() {
        this.fingerTweener.active = true;
        this.labelTweener.active = true;
    }

    onHideFinger(): void {
        this.fingerTweener.active = false;
        this.labelTweener.active = false;
    }

}

