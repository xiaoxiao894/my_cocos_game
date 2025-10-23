import { _decorator,  Component, Node,  Vec3 } from 'cc';
import { DataManager } from '../Global/DataManager';
import { CompleteRopeItem } from './CompleteRopeItem';
import { EventManager } from '../Global/EventManager';
import { EntityTypeEnum, EventName } from '../Common/Enum';
import { PlugItem } from './PlugItem';
import RopePool from './RopePool';
const { ccclass, property } = _decorator;

@ccclass('RopeManager')
export class RopeManager extends Component {

    /** 电线起点 */
    @property(Node)
    headNode: Node = null;

    /** 电线终点 */
    @property(Node)
    endNode: Node= null;

    @property(Node)
    completeRope: Node = null;

    @property(Node)
    plugParentNode:Node = null;

    @property(Node)
    ropeItemNode:Node = null;


    private _rope: CompleteRopeItem = null;

    private _ropePool:RopePool;


    start() {
        DataManager.Instance.ropeManager = this;
        DataManager.Instance.plugNode = this.endNode;
        this._ropePool = new RopePool(this.ropeItemNode, 10);
        this.creatPope();
        
    }

    protected onEnable(): void {
        EventManager.inst.on(EventName.PlugStateUpdate, this.onPlugStateUpdate, this);
        EventManager.inst.on(EventName.TreeToWoodInited, this.onTreeToWoodOver, this);
    }

    protected onDisable(): void {
        EventManager.inst.off(EventName.PlugStateUpdate, this.onPlugStateUpdate, this);
        EventManager.inst.off(EventName.TreeToWoodInited, this.onTreeToWoodOver, this);
    }

    /** 创建一根电线 */
    public creatPope() {

        let item: CompleteRopeItem = this.completeRope.getComponent(CompleteRopeItem);
        if (item) {
            this._rope = item;
            item.init( this.headNode, this.endNode);
        }
    }

    public setRopeState(state: number) {
        this._rope.state = state;
    }

    //通知引导更新位置
    private onPlugStateUpdate() {
        
        let pos: Vec3 = new Vec3();
        let plug: PlugItem = this.endNode.getComponent(PlugItem);
        if (plug) {
            if (plug.state == 1) {
                pos = DataManager.Instance.socketNode.getWorldPosition();
                pos.y += 3;
            } else if (plug.state == 0 ) {
                //引导到插头
                pos = this.endNode.getWorldPosition();
            }
        }

    }

    /** 插头插入插座结束 */
    private onTreeToWoodOver() {
        //通电缩回效果,延迟到树处理完再开始
        this._rope.ropePowerOn();
    }

    public flashRed(){
        this._rope.flashRed();
    }

    public getRope():Node{
        return this._ropePool.getItem();
    }

    public putRope(node:Node){
        this._ropePool.putItem(node);
    }
}


