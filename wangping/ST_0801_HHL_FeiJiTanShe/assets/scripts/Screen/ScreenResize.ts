import { _decorator, Component, Node } from 'cc';
import { screen, view } from 'cc';
import EventManager from '../EventManager/EventManager';
import EventType from '../EventManager/EventType';

const { ccclass, property } = _decorator;

@ccclass('ScreenResize')
export class ScreenResize extends Component {

    _isDirty: boolean

    start() {
    }

    protected onEnable(): void {
        view.on('canvas-resize', this.oncCanvasResize, this);
        this.scheduleOnce(() => {
            this._isDirty = true;
        }, 0.1)
    }

    protected onDisable(): void {
        view.off('canvas-resize', this.oncCanvasResize, this);
    }

    update(deltaTime: number) {
        if (this._isDirty) {
            this._isDirty = false;
            EventManager.dispatchEvent(EventType.VIEW_CANVAS_RESIZE)
        }
    }

    oncCanvasResize() {
        this._isDirty = true;
    }
}

