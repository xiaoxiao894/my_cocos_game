import { _decorator, Node, EventTouch, Touch, Component, UITransform, Input, EventKeyboard, KeyCode, v2, Vec3, input, Scene, director, EventMouse, macro, view, screen, UI, Vec2 } from 'cc';
const { ccclass, property } = _decorator;

import EventType from '../../EventManager/EventType'
import EventManager from '../../EventManager/EventManager';

@ccclass('UI_Joystick')
export class UI_Joystick extends Component {

    // private static _inst:UI_Joystick = null;
    // public static get inst():UI_Joystick{
    //     return this._inst;
    // }

    @property(UITransform)
    cameraUITransform: UITransform

    @property(UITransform)
    movementTransform: UITransform

    @property(UITransform)
    ctrlRootTransform: UITransform

    @property(Node)
    ctrlPointer: Node

    private _ctrlRoot: UITransform = null;
    private _ctrlPointer: Node = null;
    private _checkerCamera: UITransform = null;

    private _movementTouch: Touch = null;


    protected onLoad(): void {
        // UI_Joystick._inst = this;
    }

    start() {

        const checkerMovement = this.movementTransform;
        checkerMovement.node.on(Input.EventType.TOUCH_START, this.onTouchStart_Movement, this);
        checkerMovement.node.on(Input.EventType.TOUCH_MOVE, this.onTouchMove_Movement, this);
        checkerMovement.node.on(Input.EventType.TOUCH_END, this.onTouchUp_Movement, this);
        checkerMovement.node.on(Input.EventType.TOUCH_CANCEL, this.onTouchUp_Movement, this);

        this._checkerCamera = this.cameraUITransform;

        this._ctrlRoot = this.ctrlRootTransform;
        this._ctrlRoot.node.active = false;
        this._ctrlPointer = this.ctrlPointer

    }

    onDestroy() {
        const checkerMovement = this.movementTransform;
        checkerMovement.node.off(Input.EventType.TOUCH_START, this.onTouchStart_Movement, this);
        checkerMovement.node.off(Input.EventType.TOUCH_MOVE, this.onTouchMove_Movement, this);
        checkerMovement.node.off(Input.EventType.TOUCH_END, this.onTouchUp_Movement, this);
        checkerMovement.node.off(Input.EventType.TOUCH_CANCEL, this.onTouchUp_Movement, this);
    }

    onTouchStart_Movement(event: EventTouch) {
        let touches = event.getTouches();
        for (let i = 0; i < touches.length; ++i) {
            let touch = touches[i];
            let x = touch.getUILocationX();
            let y = touch.getUILocationY();
            if (!this._movementTouch) {

                //we sub halfWidth,halfHeight here.
                //because, the touch event use left bottom as zero point(0,0), ui node use the center of screen as zero point(0,0)
                //this._ctrlRoot.setPosition(x - halfWidth, y - halfHeight, 0);

                let halfWidth = this._checkerCamera.width / 2;
                let halfHeight = this._checkerCamera.height / 2;

                this._ctrlRoot.node.active = true;
                this._ctrlRoot.node.setPosition(x - halfWidth, y - halfHeight, 0);
                this._ctrlPointer.setPosition(0, 0, 0);
                this._movementTouch = touch;

                EventManager.dispatchEvent(EventType.JOYSTICK_START);
            }
        }
    }

    onTouchMove_Movement(event: EventTouch) {
        let touches = event.getTouches();
        const scaler = this._ctrlRoot.node.worldScale.x;
        for (let i = 0; i < touches.length; ++i) {
            let touch = touches[i];
            if (this._movementTouch && touch.getID() == this._movementTouch.getID()) {
                let halfWidth = this._checkerCamera.width / 2;
                let halfHeight = this._checkerCamera.height / 2;
                let x = touch.getUILocationX();
                let y = touch.getUILocationY();

                let pos = this._ctrlRoot.node.position;
                let ox = x - halfWidth - pos.x;
                let oy = y - halfHeight - pos.y;

                let len = Math.sqrt(ox * ox + oy * oy);
                if (len <= 0) {
                    return;
                }

                let dirX = ox / len;
                let dirY = oy / len;
                let radius = this._ctrlRoot.width / 2;
                if (len > radius) {
                    len = radius;
                    ox = dirX * radius;
                    oy = dirY * radius;
                }

                this._ctrlPointer.setPosition(ox, oy, 0);

                EventManager.dispatchEvent(EventType.JOYSTICK_MOVE, new Vec2(ox / radius, oy / radius))
            }
        }
    }

    onTouchUp_Movement(event: EventTouch) {
        let touches = event.getTouches();
        for (let i = 0; i < touches.length; ++i) {
            let touch = touches[i];
            if (this._movementTouch && touch.getID() == this._movementTouch.getID()) {
                this._movementTouch = null;
                this._ctrlRoot.node.active = false;
                EventManager.dispatchEvent(EventType.JOYSTICK_END);
            }
        }
    }
}