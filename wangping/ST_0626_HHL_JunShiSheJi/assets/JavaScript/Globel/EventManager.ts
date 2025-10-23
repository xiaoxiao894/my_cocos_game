interface IEvent {
    func: Function,
    ctx: unknown
}

/**
 * 事件管理
 */
export class EventManager {
    private constructor() { }
    private static _instance: EventManager = new EventManager();
    static get inst(): EventManager {
        return EventManager._instance;
    }

    private _eventMap: Map<string, Array<IEvent>> = new Map<string, Array<IEvent>>();

    clear(): void {
        this._eventMap.clear();
    }

    on(eventName: string, func: Function, ctx: unknown): void {
        if (this._eventMap.has(eventName)) {
            this._eventMap.get(eventName).push({ func, ctx });
        } else {
            this._eventMap.set(eventName, [{ func, ctx }]);
        }
    }

    off(eventName: string, func: Function, ctx: unknown): void {
        if (this._eventMap.has(eventName)) {
            const events = this._eventMap.get(eventName);
            const index = events.findIndex(i => i.func === func && i.ctx === ctx);
            index > -1 && events.splice(index, 1);
            if (events.length == 0) {
                this._eventMap.delete(eventName);
            }
        } else {
            console.warn(`事件解绑失败：事件名（${eventName}）不存在`);
        }
    }

    emit(eventName: string, detail?: any): void {
        if (this._eventMap.has(eventName)) {
            this._eventMap.get(eventName).forEach(({func, ctx}) => {
                typeof detail === 'undefined' ? func.call(ctx) : func.call(ctx, detail);
            });
        }
    }
}