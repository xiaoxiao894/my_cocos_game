import { _decorator, Collider, ColliderComponent, Component,  ERigidBodyType, ICollisionEvent, Node, PhysicsSystem, RigidBody, Tween, Vec3 } from 'cc';
import { EntityTypeEnum, EventNames } from '../../Enum/Index';
import { EventManager } from '../../Global/EventManager';

const { ccclass, property } = _decorator;

@ccclass('MedicineItem')
export class MedicineItem extends Component {

    @property(Collider)
    collider: Collider = null; //碰撞体

    private _canPick: boolean = false;
    private _isStatic:boolean = false;

    private _timer:number = 5;
    private _count:number = 0;

    //10秒后强制可被捡起
    private _canPickTimer:number = 10;
    private _canPickCount:number = 0;
    private _setStatic:boolean = false;
    private _tweenItem :Tween<Node> = null;

    start() {

    }

    onEnable() {
        this.collider.on("onCollisionExit", this.onCollisionExit, this);
        this._canPick = false;
        this._canPickCount = 0;
        this._isStatic = false;
        this._setStatic = false;
    }

    onDisable() {
        this.collider.off("onCollisionExit", this.onCollisionExit, this);
        this._tweenItem=null;

    }

    onCollisionExit(event: ICollisionEvent) {
        const otherCollider = event.otherCollider;
        if ((otherCollider.node.name == EntityTypeEnum.Map||otherCollider.node.name == EntityTypeEnum.Medicine)&&this._canPick==false ) {
            if(this.node.getComponent(RigidBody).type!=ERigidBodyType.DYNAMIC){
                this.node.getComponent(RigidBody).type = ERigidBodyType.DYNAMIC;
                this._tweenItem?.stop();
            }
            
            this.canPickItem();
        }else if(this._isStatic&&!this._setStatic){
            this._setStatic = true;
            //this.node.getComponent(RigidBody).type = ERigidBodyType.STATIC;
        }
    }

    public setTweenItem(tweenItem:Tween<Node>){
        this._tweenItem = tweenItem;
    }

    private canPickItem(){
        this._canPick = true;
        this.node.getComponent(RigidBody).setGroup(1 << 2);
        this.collider.setMask(1 << 1 | 1 << 2 | 1 << 6 | 1 << 7| 1<<9 );
        EventManager.inst.emit(EventNames.MedicineCanPick,this.node);
        this._count = 0;
    }


    public get canPick(): boolean {
        return this._canPick;
    }

    update(dt: number) {
        this._count+=dt;
        if(!this._isStatic&&this._canPick&&this._timer<this._count){
            this._isStatic = true;
            this._setStatic = false;
        }
        if(!this._canPick){
            this._canPickCount+=dt;
            if(this._canPickCount>this._canPickTimer){
                this.canPickItem();
            }
        }
    }
}