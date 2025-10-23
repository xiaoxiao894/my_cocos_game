import { _decorator, Component, Enum, Node } from 'cc';
import { ObjectType } from './CommonEnum';

const { ccclass, property } = _decorator;

@ccclass('PoolObjectBase')
export abstract class PoolObjectBase extends Component {
    /** 对象类型 */
    public objectType: ObjectType = ObjectType.None;

    /**
     * 重置对象
     */
    public abstract reset(): void;

    /**
     * 回收对象
     */
    public recycle(): void {
        this.reset();
        manager.pool.putNode(this.node);
    }
}
