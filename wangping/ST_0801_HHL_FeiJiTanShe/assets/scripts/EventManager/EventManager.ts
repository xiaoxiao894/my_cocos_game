import { EventTarget } from 'cc';
const eventTarget = new EventTarget();

type _cocos_core_event_eventify__EventType = string | number;

export default class EventManager {

    public static addEventListener<TFunction extends (...args: any[]) => void>(type: _cocos_core_event_eventify__EventType, callback: TFunction, target?: any) {
        eventTarget.on(type, callback, target);
    }
    
    public static remveEventListener<TFunction extends (...args: any[]) => void>(type: _cocos_core_event_eventify__EventType, callback?: TFunction, target?: any) {
        eventTarget.off(type, callback, target);
    }
    
    public static dispatchEvent(type: _cocos_core_event_eventify__EventType, arg0?: any, arg1?: any, arg2?: any, arg3?: any, arg4?: any): void {
        eventTarget.emit(type, arg0, arg1, arg2, arg3, arg4);
    }

}