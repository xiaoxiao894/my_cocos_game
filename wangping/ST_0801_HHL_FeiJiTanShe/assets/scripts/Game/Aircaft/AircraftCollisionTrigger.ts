import { _decorator, BoxCollider, Component, ITriggerEvent, Node, RigidBody, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

import EventManager from 'db://assets/scripts/EventManager/EventManager'
import EventType from 'db://assets/scripts/EventManager/EventType';

@ccclass('AircraftCollisionTrigger')
export class AircraftCollisionTrigger extends Component {

    start() {
        let collider = this.node.getComponent(BoxCollider);
        collider.on('onTriggerEnter', this.onTriggerEnter, this);
    }
    
    private onTriggerEnter(event: ITriggerEvent) {
        EventManager.dispatchEvent(EventType.AIRCAFT_INPUT_CANCEL, true);
    }

}

