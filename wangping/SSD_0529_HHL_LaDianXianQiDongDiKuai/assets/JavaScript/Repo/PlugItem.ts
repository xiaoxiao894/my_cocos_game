import { _decorator, CCInteger, Component, Node } from 'cc';
import { DataManager } from '../Global/DataManager';
import { EventManager } from '../Global/EventManager';
import { EventName } from '../Common/Enum';
const { ccclass, property } = _decorator;

@ccclass('PlugItem')
export class PlugItem extends Component {
    //插头高度5 

    @property(CCInteger)
    index:number = 0;

    /** 状态 0未连接 1连接中 2已连接 */
    private _state:number = 0;

    public set state(value:number) {
        this._state = value;
        //同步设置连接的电线
        DataManager.Instance.ropeManager.setRopeStateByIndex(this.index, value);
        //通知插头状态有变化
        EventManager.inst.emit(EventName.PlugStateUpdate,value);
    }

    public get state() {
        return this._state;
    }

    start() {

    }

    update(deltaTime: number) {
        
    }
}


