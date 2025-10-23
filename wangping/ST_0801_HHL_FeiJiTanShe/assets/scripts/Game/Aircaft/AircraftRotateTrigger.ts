import { _decorator, Component, BoxCollider, ITriggerEvent } from 'cc';
const { ccclass, property } = _decorator;

import EventManager from 'db://assets/scripts/EventManager/EventManager'
import EventType from 'db://assets/scripts/EventManager/EventType';

@ccclass('AircraftRotateTrigger')
export class AircraftRotateTrigger extends Component {

    _isTrigger : boolean
    
    onLoad(): void {
        let collider = this.node.getComponent(BoxCollider);
        collider.on('onTriggerEnter', this.onTriggerEnter, this);
    }

    private onTriggerEnter(event: ITriggerEvent) {
        if(this._isTrigger) {
            return;
        }
        this._isTrigger = true;
        EventManager.dispatchEvent(EventType.AIRCAFT_FIRE_ROTATE)
    }
}
