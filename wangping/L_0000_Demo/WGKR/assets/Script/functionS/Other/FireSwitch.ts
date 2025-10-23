import { _decorator, CCBoolean, Collider, Component, ITriggerEvent, Node } from 'cc';
import ColliderTag, { COLLIDE_TYPE } from '../Battle/CollectBattleTarger/ColliderTag';
import { HeroManager } from '../Hero/HeroManager';
import { AttackLevel } from '../../Base/EnumIndex';
const { ccclass, property } = _decorator;

@ccclass('FireSwitch')
export class FireSwitch extends Component {

    @property(CCBoolean)
    public fireOpen: boolean = false;



    start() {
        const collide = this.node.getComponent(Collider);
        collide.on("onTriggerEnter", this.onTriggerEnter, this);
    }



    private onTriggerEnter(event: ITriggerEvent) {
        const other = event.otherCollider;
        const tag = other.getComponent(ColliderTag);
        if (tag.tag == COLLIDE_TYPE.HERO) {
            const heroManager = other.getComponent(HeroManager);
            if (!heroManager) {
                return;
            }
            heroManager.openFire(this.fireOpen);
        }
    }
}


