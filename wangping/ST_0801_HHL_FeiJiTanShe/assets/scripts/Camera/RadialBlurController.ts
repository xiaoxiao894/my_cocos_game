import { _decorator, Component, math, Node, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

import { RadialBlur } from "db://assets/3rd-party/RadialBlur/Scripts/RadialBlurPass"
import EventType from 'db://assets/scripts/EventManager/EventType';
import EventManager from 'db://assets/scripts/EventManager/EventManager'

@ccclass('RadialBlurController')
export class RadialBlurController extends Component {

    @property(RadialBlur)
    radialBlur: RadialBlur

    @property
    maxY: number = 16.0

    @property
    maxBlurFactor: number = 0.8

    _isDirty: boolean = false;
    _curY: number = -1.0
    _isDrop: boolean = false;

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
            const t = math.clamp01(this._curY / this.maxY);
            this.radialBlur.blurFactor = math.lerp(0.0, this.maxBlurFactor, t);
            this._isDirty = false;
        }
    }

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

