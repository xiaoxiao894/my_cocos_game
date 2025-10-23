import { _decorator, Collider, Color, Component, ITriggerEvent, Node, Sprite } from 'cc';
import ColliderTag, { COLLIDE_TYPE } from '../Battle/CollectBattleTarger/ColliderTag';
const { ccclass, property } = _decorator;

@ccclass('Site')
export class Site extends Component {

    @property(Collider)
    public collider: Collider;
    @property(Sprite)
    public sp: Sprite;

    private count: number = 0;
    start() {
        this.collider.on("onTriggerEnter", this.onTriggerEnter, this);
        this.collider.on("onTriggerExit", this.onTriggerExit, this);
    }

    protected onTriggerEnter(event: ITriggerEvent) {
        const tag = event.otherCollider.getComponent(ColliderTag);
        if (tag && tag.tag == COLLIDE_TYPE.HERO) {
            this.count++;
            this.sp.color = Color.GREEN;
        }
    }

    protected onTriggerExit(event: ITriggerEvent) {
        const tag = event.otherCollider.getComponent(ColliderTag);
        if (tag && tag.tag == COLLIDE_TYPE.HERO) {
            this.count--;
            if (this.count == 0) {
                this.sp.color = Color.WHITE;
            }
        }
    }

}


