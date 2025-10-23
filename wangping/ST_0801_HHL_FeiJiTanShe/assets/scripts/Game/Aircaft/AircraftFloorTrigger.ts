import { _decorator, Component, ITriggerEvent, PlaneCollider } from 'cc';
const { ccclass } = _decorator;

import EventManager from 'db://assets/scripts/EventManager/EventManager'
import EventType from 'db://assets/scripts/EventManager/EventType';

@ccclass('AircraftFloorTrigger')
export class AircraftFloorTrigger extends Component {
    
    _groundedTime: number = 0;
    _isGrounded: boolean = false;
    
    _isFirstTapGrounded: boolean = false;
    _isTriggerGrounded: boolean = false;
    _isTriggerDroped: boolean = false;

    start() {
        let collider = this.node.getComponent(PlaneCollider);
        collider.on('onTriggerEnter', this.onTriggerEnter, this);
        collider.on('onTriggerExit', this.onTriggerExit, this);
    }

    private onTriggerEnter(event: ITriggerEvent) {

        if (this._isGrounded == false) {
            EventManager.dispatchEvent(EventType.AIRCAFT_TAP_GROUNDED, true);
        }

        if (this._isTriggerDroped == false) {
            this._isTriggerDroped = true;
            EventManager.dispatchEvent(EventType.AIRCAFT_DROP, true);
        }

        if(this._isFirstTapGrounded == false) {
            this._isFirstTapGrounded = true;
            EventManager.dispatchEvent(EventType.AIRCAFT_FIRST_TAP_GROUNDED, true);
        }
        
        this._isGrounded = true;
        this._groundedTime = 0.0;
    }

    private onTriggerExit(event: ITriggerEvent) {
        this._isGrounded = false;
    }

    protected update(dt: number): void {
        this.onGroundUpdate(dt);
    }

    onGroundUpdate(dt: number) {
        if (this._isGrounded == false) {
            return;
        }
        if (this._isTriggerGrounded) {
            return;
        }
        this._groundedTime += dt;
        if (this._groundedTime >= 2.0) {
            this._isTriggerGrounded = true;
            EventManager.dispatchEvent(EventType.AIRCAFT_GROUNDED, true);
        }
    }
}

function property(target: AircraftFloorTrigger, propertyKey: '_groundedTime'): void {
    throw new Error('Function not implemented.');
}
