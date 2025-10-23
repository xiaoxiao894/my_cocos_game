import { _decorator, Component, Line, Node, v3, Vec3 } from 'cc';
import EventManager from 'db://assets/scripts/EventManager/EventManager'
import EventType from 'db://assets/scripts/EventManager/EventType';
const { ccclass, property } = _decorator;

@ccclass('AircaftSplines')
export class AircaftSplines extends Component {

    @property(Line)
    line: Line

    @property
    p0: Vec3 = v3(4.6, 3.5, 3.8);

    @property
    p1: Vec3 = v3(-4.6, 3.5, 3.8);

    _isDirty: boolean = false;
    _isAircaftStarted: boolean = false;

    protected onLoad(): void {
        if (this.line == null) {
            this.line = this.node.getComponent(Line);
        }
    }

    start() {
        EventManager.addEventListener(EventType.UPDATE_MAIN_PLAYER_POS, this.onUpdateMainPlayerPos, this)
        EventManager.addEventListener(EventType.AIRCAFT_START, this.onAircaftStart, this)
    }

    protected onDestroy(): void {
        EventManager.remveEventListener(EventType.UPDATE_MAIN_PLAYER_POS, this.onUpdateMainPlayerPos, this)
        EventManager.remveEventListener(EventType.AIRCAFT_START, this.onAircaftStart, this)
    }

    update(deltaTime: number) {
        if (this._isDirty) {
            this.line.enabled = false;
            this.line.enabled = true;
            this._isDirty = false;
        }
    }

    onUpdateMainPlayerPos(pos: Vec3) {

        if (this._isAircaftStarted) {
            return;
        }

        const p3 = new Vec3()
        p3.set(pos);
        p3.add(new Vec3(0.1, 0.7, 0.0));

        const p4 = new Vec3()
        p4.set(pos);
        p4.add(new Vec3(-0.1, 0.7,  0.0));

        const positions = this.line.positions;
        positions[0] = this.p0;
        positions[1] = p3;
        positions[2] = p4;
        positions[3] = this.p1;
        this._isDirty = true;
    }

    onAircaftStart() {
        this.schedule(() => {
            const positions = this.line.positions;
            positions[0] = this.p0;
            positions[1] = this.p0;
            positions[2] = this.p1;
            positions[3] = this.p1;
            this._isDirty = true;
            this._isAircaftStarted = true;
        }, 0.25, 1, 0);
    }
}

