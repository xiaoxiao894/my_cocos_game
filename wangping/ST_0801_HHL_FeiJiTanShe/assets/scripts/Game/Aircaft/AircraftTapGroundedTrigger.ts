import { _decorator, Component, ITriggerEvent, PlaneCollider } from 'cc';
const { ccclass } = _decorator;

import EventManager from 'db://assets/scripts/EventManager/EventManager'
import EventType from 'db://assets/scripts/EventManager/EventType';

@ccclass('AircraftTapGroundedTrigger')
export class AircraftTapGroundedTrigger extends Component {
    
    _isGrounded: boolean = false;

    start() {
        let collider = this.node.getComponent(PlaneCollider);
        collider.on('onTriggerEnter', this.onTriggerEnter, this);
        collider.on('onTriggerExit', this.onTriggerExit, this);
    }

    private onTriggerEnter(event: ITriggerEvent) {

        if (this._isGrounded == false) {
            EventManager.dispatchEvent(EventType.AIRCAFT_TAP_GROUNDED, true);
        }

        this._isGrounded = true;
    }

    private onTriggerExit(event: ITriggerEvent) {
        this._isGrounded = false;
    }
}