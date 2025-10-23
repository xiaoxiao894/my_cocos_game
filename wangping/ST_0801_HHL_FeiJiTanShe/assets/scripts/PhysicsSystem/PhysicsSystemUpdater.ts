import { _decorator, Component, PhysicsSystem, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

import EventType from '../EventManager/EventType'
import EventManager from '../EventManager/EventManager'

@ccclass('PhysicsSystemUpdater')
export class PhysicsSystemUpdater extends Component {

    @property
    timeScale: number = 1;

    @property
    enableTimeScale: boolean = true;

    @property
    updateType: number = 0

    _fixedTimeStep: number;

    onLoad(): void {
        PhysicsSystem.instance.autoSimulation = false;
        // PhysicsSystem.instance.gravity = new Vec3(0,-8,0);
        this._fixedTimeStep = PhysicsSystem.instance.fixedTimeStep;
        EventManager.addEventListener(EventType.PYSICS_SYSTEM_TIME_SCALE, this.setTimeScale, this)
        EventManager.addEventListener(EventType.PYSICS_SYSTEM_UPDATE_TYPE, this.setUpdateType, this)
    }

    onDestroy(): void {
        EventManager.remveEventListener(EventType.PYSICS_SYSTEM_TIME_SCALE, this.setTimeScale, this)
        EventManager.remveEventListener(EventType.PYSICS_SYSTEM_UPDATE_TYPE, this.setUpdateType, this)
    }

    setUpdateType(updateType: number) : void {
        this.updateType = updateType;
    }

    setTimeScale(timeScale: number): void {
        this.timeScale = timeScale;
    }

    update(deltaTime: number): void {
        if (this.updateType == 0) {
            this.onPhysicsSystemUpdate(deltaTime);
        }
    }

    lateUpdate(deltaTime: number): void {
        if (this.updateType == 1) {
            this.onPhysicsSystemUpdate(deltaTime);
        }
    }

    onPhysicsSystemUpdate(deltaTime: number) {
        const timeScale = this.enableTimeScale ? this.timeScale : 1.0;
        const deltaTimeScaler = deltaTime * timeScale;
        const fixedTimeStepScaler = this._fixedTimeStep * timeScale;

        PhysicsSystem.instance.syncSceneToPhysics();
        PhysicsSystem.instance.step(fixedTimeStepScaler, deltaTimeScaler);
        PhysicsSystem.instance.emitEvents();
    }
}

