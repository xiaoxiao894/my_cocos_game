import { _decorator, ccenum, CCInteger, CircleCollider2D, Collider, Collider2D, Component, Contact2DType, IPhysics2DContact, ITriggerEvent, Node, RigidBody, RigidBody2D, SphereCollider } from 'cc';
import { CollectGetTarget } from '../CollectBattleTarger/CollectGetTarget';
import ColliderTag, { COLLIDE_TYPE } from '../CollectBattleTarger/ColliderTag';
const { ccclass, property } = _decorator;


@ccclass('TriggerBase')
export abstract class TriggerBase extends CollectGetTarget {

    @property({ type: COLLIDE_TYPE })
    public attackTargetTag: COLLIDE_TYPE[] = [];

    protected attackCollide: SphereCollider;

    protected rig: RigidBody;

    onLoad() {
        this.attackCollide = this.getComponent(SphereCollider);
        this.attackCollide.on("onTriggerEnter", this.onStartCollide, this);
        this.attackCollide.on("onTriggerExit", this.onEndCollide, this);

        this.rig = this.node.getComponent(RigidBody);
    }


    private onStartCollide(event: ITriggerEvent) {

        let colliderTag = event.otherCollider.getComponent(ColliderTag);
        if (colliderTag) {
            if (this.attackTargetTag.indexOf(colliderTag.tag) != -1) {
                event.otherCollider
                this._startCollide(event);
            }
        }
    }

    protected abstract _startCollide(other: ITriggerEvent)


    private onEndCollide(event: ITriggerEvent) {
        let colliderTag = event.otherCollider.getComponent(ColliderTag);
        if (colliderTag) {
            if (this.attackTargetTag.indexOf(colliderTag.tag) != -1) {
                event.otherCollider
                this._EndCollide(event);
            }
        }
    }

    protected abstract _EndCollide(other: ITriggerEvent)

}


