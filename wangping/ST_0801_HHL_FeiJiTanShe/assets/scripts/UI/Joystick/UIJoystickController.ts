import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

import EventType from '../../EventManager/EventType'
import EventManager from '../../EventManager/EventManager';

@ccclass('UIJoystickController')
export class UIJoystickController extends Component {

    @property(Node)
    joystick: Node

    protected onLoad(): void {
        this.joystick.active = false;
        EventManager.addEventListener(EventType.SHOW_JOYSTICK, this.onShowJoystick, this);
        EventManager.addEventListener(EventType.AIRCAFT_GROUNDED, this.onHideJoystick, this);
    }

    protected onDestroy(): void {
        EventManager.remveEventListener(EventType.SHOW_JOYSTICK, this.onShowJoystick, this);
        EventManager.addEventListener(EventType.AIRCAFT_DROP, this.onHideJoystick, this);
    }

    start() {
    }

    onShowJoystick() {
        this.joystick.active = true;
    }

    onHideJoystick() {
        this.joystick.active = false;
    }

}