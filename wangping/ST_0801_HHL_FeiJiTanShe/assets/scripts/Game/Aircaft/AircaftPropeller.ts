import { _decorator, Component, Node, tween, Vec3, Tween } from 'cc';
import EventManager from 'db://assets/scripts/EventManager/EventManager'
import EventType from 'db://assets/scripts/EventManager/EventType';
const { ccclass, property } = _decorator;

@ccclass('AircaftPropeller')
export class AircaftPropeller extends Component {

    @property
    duration: number = 0.5

    _tweener: Tween
    _physicsSystemTimeScale: number = 1.0

    start() {
        EventManager.addEventListener(EventType.PYSICS_SYSTEM_TIME_SCALE, this.onPhysicsSystemTimeScale, this)
        EventManager.addEventListener(EventType.PROPELLER_WORK, this.onPropellerWork, this);
    }

    onPropellerWork(isWork: boolean) {

        if (this._tweener != null) {
            this._tweener.stop();
            this._tweener = null;
            this.node.eulerAngles = new Vec3(0.0, 0.0, 0.0)
        }
        
        if (isWork) {
            const timeScale = this._physicsSystemTimeScale >= 1.0 ? 1.0 : 0.5;
            const duration = this.duration / timeScale;
            const t = tween(this.node).
                to(
                    duration, {
                    eulerAngles: new Vec3(0.0, 0.0, 360.0),
                }).
                to(
                    0.0, {
                    eulerAngles: new Vec3(0.0, 0.0, 0.0)
                }).
                union().
                repeatForever().
                start();
            this._tweener = t;
        }
    }

    protected onDestroy(): void {
        EventManager.remveEventListener(EventType.PROPELLER_WORK, this.onPropellerWork, this)
        EventManager.remveEventListener(EventType.PYSICS_SYSTEM_TIME_SCALE, this.onPhysicsSystemTimeScale, this)
    }

    onPhysicsSystemTimeScale(timeScale: number) {
        this._physicsSystemTimeScale = timeScale;
        if (this._tweener != null) {
            this.onPropellerWork(true)
        }
    }
}

