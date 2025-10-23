import { _decorator, Collider, Component, ITriggerEvent} from 'cc';
import { EntityTypeEnum } from '../Common/Enum';
import Entity from './Entity';
const { ccclass, property } = _decorator;

@ccclass('EntityTrigger')
export class EntityTrigger extends Component {

    @property(Entity)
    entity: Entity|null = null;

    @property(Collider)
    collider: Collider = null;

    protected _inTrigger:string = EntityTypeEnum.NONE;

    protected onEnable(){
        // 注册触发器回调
        this.collider.on('onTriggerEnter', this.onTriggerEnter, this);
        this.collider.on('onTriggerStay', this.onTriggerStay, this);
        this.collider.on('onTriggerExit', this.onTriggerExit, this);
    }

    protected onDisable(){
        // 注销触发器回调
        this.collider.off('onTriggerEnter', this.onTriggerEnter, this);
        this.collider.off('onTriggerStay', this.onTriggerStay, this);
        this.collider.off('onTriggerExit', this.onTriggerExit, this);
    }

    protected onTriggerEnter(event: ITriggerEvent) {
        const other = event.otherCollider;
        if(!other){
            return;
        }
        this._inTrigger = other.node.name;
        console.log(`触发器 进入 ${other.node.name}`);
    }

    //事件监听触发
    protected onTriggerStay(event: ITriggerEvent) {
        const other = event.otherCollider;
        if(!other){
            return;
        }
        this._inTrigger = other.node.name;
    }

    //离开触发器
    protected onTriggerExit(event: ITriggerEvent) {
        this._inTrigger = EntityTypeEnum.NONE;
    }

    public triggerName():string{
        return this._inTrigger;
    }
}


