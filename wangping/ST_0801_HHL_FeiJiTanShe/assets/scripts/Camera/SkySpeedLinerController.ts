import { _decorator, Camera, Component, math, Node, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

import EventType from 'db://assets/scripts/EventManager/EventType';
import EventManager from 'db://assets/scripts/EventManager/EventManager'

@ccclass('SkySpeedLinerController')
export class SkySpeedLinerController extends Component {

    @property(Node)
    txNode: Node

    @property
    minY: number = 8.0

    @property(Node)
    mainCamera : Node

    // @property
    // offsetPos: Vec3 = new Vec3(0, 0, 50)

    _isDirty: boolean = false;
    _curY: number = -1.0
    _isDrop: boolean = false;
    _isActive: boolean = false;

    start() {
        EventManager.addEventListener(EventType.UPDATE_MAIN_PLAYER_POS, this.onUpdateMainPlayerPos, this)
        EventManager.addEventListener(EventType.AIRCAFT_DROP, this.onDrop, this)
    }

    protected onDestroy(): void {
        EventManager.remveEventListener(EventType.UPDATE_MAIN_PLAYER_POS, this.onUpdateMainPlayerPos, this)
        EventManager.remveEventListener(EventType.AIRCAFT_DROP, this.onDrop, this)
    }

    update(deltaTime: number) {
        if (this._isDirty) {
            if (this._isActive == false && this._curY > this.minY) {
                this.txNode.active = true;
                this._isActive = true;
            } else if (this._isActive && this._curY <= this.minY) {
                this.txNode.active = false;
                this._isActive = false;
            }
            this._isDirty = false;
        }
    }

    // protected lateUpdate(dt: number): void {
    //      if(this._isActive) {
    //         const nextPos = new Vec3();
    //         const pos = this.mainCamera.position;
    //         Vec3.add(nextPos, pos, this.offsetPos);
    //         this.txNode.setPosition(nextPos)
    //     }
    // }

    onUpdateMainPlayerPos(pos: Vec3) {
        if (this._isDrop) {
            return
        }
        if (pos.y != this._curY) {
            this._curY = pos.y;
            this._isDirty = true;
        }
    }

    onDrop(pos: Vec3) {
        this._isDrop = true;
        this._isDirty = true;
        this._curY = 0.0;
    }
}

