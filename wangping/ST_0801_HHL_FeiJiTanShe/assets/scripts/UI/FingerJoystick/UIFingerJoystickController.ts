import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

import EventType from '../../EventManager/EventType'
import EventManager from '../../EventManager/EventManager';

@ccclass('UIFingerJoystickController')
export class UIFingerJoystickController extends Component {

    @property(Node)
    fingerTweener: Node

    @property(Node)
    labelTweener: Node

    protected onLoad(): void {
        EventManager.addEventListener(EventType.SHOW_JOYSTICK_TWEEN, this.onShowFinger, this);
        EventManager.addEventListener(EventType.JOYSTICK_START, this.onHideFinger, this);
    }

    protected onDestroy(): void {
        EventManager.remveEventListener(EventType.SHOW_JOYSTICK_TWEEN, this.onShowFinger, this);
        EventManager.remveEventListener(EventType.JOYSTICK_START, this.onHideFinger, this);
    }
    
    start() {
        this.onHideFinger()
    }

    onHideFinger(): void {
        this.fingerTweener.active = false;
        this.labelTweener.active = false;
    }

    onShowFinger(): void {
        this.fingerTweener.active = true;
        this.labelTweener.active = true;
    }

    update(deltaTime: number) {

    }
}

