import { _decorator, Component, Node, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

import EventManager from 'db://assets/scripts/EventManager/EventManager';
import EventType from 'db://assets/scripts/EventManager/EventType';

@ccclass('FlagController')
export class FlagController extends Component {

    @property(Node)
    flag: Node

    _curPos: Vec3 = new Vec3();

    start() {
        EventManager.addEventListener(EventType.UPDATE_MAIN_PLAYER_POS, this.onUpdateMainPlayerPos, this)
        EventManager.addEventListener(EventType.AIRCAFT_GROUNDED, this.onGround, this);
    }

    protected onDestroy(): void {
        EventManager.remveEventListener(EventType.UPDATE_MAIN_PLAYER_POS, this.onUpdateMainPlayerPos, this)
        EventManager.remveEventListener(EventType.AIRCAFT_GROUNDED, this.onGround, this);
    }

    update(deltaTime: number) {
    }

    onUpdateMainPlayerPos(pos: Vec3) {
        this._curPos.set(pos);
    }

    onGround() {
        const pos = new Vec3();
        pos.set(this._curPos);
        pos.z += 3.0;
        this.flag.worldPosition = pos;
        this.flag.active = true;

        this.scheduleOnce(() => {
            EventManager.dispatchEvent(EventType.SHOW_INSTALL, true);
        }, 1.5);

    }
}

