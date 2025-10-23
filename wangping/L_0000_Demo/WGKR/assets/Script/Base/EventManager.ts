import Singleton from "../Base/Singleton";

interface IEvent {
    func: Function;
    ctx: unknown;
    once: boolean;
}


export default class EventManager extends Singleton {

    public static get instance() {
        return this.getInstance<EventManager>();
    }
    private constructor() {
        super();
    }

    private _eventDic: Map<string, Array<IEvent>> = new Map();

    on(eventName: string, func: Function, ctx?: unknown, once: boolean = false) {
        if (this._eventDic.has(eventName)) {
            this._eventDic.get(eventName).push({ func: func, ctx: ctx, once: once });
        } else {
            this._eventDic.set(eventName, [{ func: func, ctx: ctx, once: once }]);
        }
    }

    off(eventName: string, func: Function) {
        if (this._eventDic.has(eventName)) {
            let funcList = this._eventDic.get(eventName);
            let index = funcList.findIndex(i => i.func === func);
            index > -1 && funcList.splice(index, 1);
        }
    }

    emit(eventName: string, ...parmas: unknown[]) {
        if (this._eventDic.has(eventName)) {
            let funcList = this._eventDic.get(eventName);
            let onceList: number[] = [];
            funcList.forEach(({ func, ctx, once }, index) => {
                ctx ? func.apply(ctx, parmas) : func(...parmas);
                once ? onceList.push(index) : null;
            })
            if (onceList.length) {
                for (let i = onceList.length - 1; i >= 0; i--) {
                    let index = onceList[i]
                    funcList.splice(index, 1);
                }
            }
        }
    }
    clear() {
        this._eventDic.clear();
    }

}
export class EventType {
    public static readonly firstClick = "First click";
    public static readonly GoldUP = "GoldUP";
}