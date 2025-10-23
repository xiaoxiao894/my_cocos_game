import { _decorator, director, Component, Node, Camera, geometry, input, Input, EventTouch, PhysicsSystem, Vec3, RigidBody, ConstantForce } from 'cc';
const { ccclass, property } = _decorator;

import EventType from '../EventManager/EventType'
import EventManager from '../EventManager/EventManager'

@ccclass('TouchEventPublisher')
export class TouchEventPublisher extends Component {

    onLoad() {
        input.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
        input.on(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
        input.on(Input.EventType.TOUCH_END, this.onTouchEnd, this);
        input.on(Input.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
    }

    onDestroy() {
        input.off(Input.EventType.TOUCH_START, this.onTouchStart, this);
        input.off(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
        input.off(Input.EventType.TOUCH_END, this.onTouchEnd, this);
        input.off(Input.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
    }

    start() {
    }

    onTouchStart(event: EventTouch) {
        EventManager.dispatchEvent(EventType.TOUCH_START, event);
    }

    onTouchMove(event: EventTouch) {
        EventManager.dispatchEvent(EventType.TOUCH_MOVE, event);
    }

    onTouchEnd(event: EventTouch) {
        EventManager.dispatchEvent(EventType.TOUCH_END, event);
    }

    onTouchCancel(event: EventTouch) {
        EventManager.dispatchEvent(EventType.TOUCH_CANCEL, event);
    }
}

