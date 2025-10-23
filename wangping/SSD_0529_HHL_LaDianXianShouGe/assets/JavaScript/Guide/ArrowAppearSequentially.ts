import { _decorator, Collider,Component,ITriggerEvent,Node } from "cc";

const { ccclass, property } = _decorator;

@ccclass('ArrowItem')
export default class ArrowAppearSequentially extends Component{
    @property(Node)
    arrows: Node[] = [];

    @property(Collider)
    colliders: Collider[] = [];

    private _index:number = 0;

    protected onEnable(): void {
        this._index = 0;
        this.onIndexChange();
        this.colliders.forEach((collider, index) => {
            collider.on('onTriggerEnter', this.onTriggerEnter, this);
        })
    }

    protected onDisable(): void {
        this.colliders.forEach((collider, index) => {
            collider.off('onTriggerEnter', this.onTriggerEnter, this);
        })
    }

    private onTriggerEnter(event:ITriggerEvent){
        let selfNode = event.selfCollider.node;
        if(selfNode.name === "collider"+this._index){
            this._index++;
            this.onIndexChange();
        }
    }

    private onIndexChange(){
        this.arrows.forEach((arrow, index) => {
            arrow.active = (index === this._index||index === this._index+1);
        });
    }
}