import { _decorator, CCInteger, CircleCollider2D, Collider, Collider2D, Component, Contact2DType, game, IPhysics2DContact, ITriggerEvent, Node, RigidBody, RigidBody2D, sp } from 'cc';
import ColliderTag, { COLLIDE_TYPE } from '../CollectBattleTarger/ColliderTag';
const { ccclass, property } = _decorator;

@ccclass('BulletCollideBase3D')
export abstract class BulletCollideBase3D extends Component {


    @property({ type: COLLIDE_TYPE })
    public attackTargetTag: COLLIDE_TYPE[] = [];

    public attackCollide: Collider;
    public rig: RigidBody;
    onLoad() {
        this.attackCollide = this.getComponent(Collider);
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

    protected abstract _startCollide(event: ITriggerEvent)


    private onEndCollide(event: ITriggerEvent) {
        let colliderTag = event.otherCollider.getComponent(ColliderTag);
        if (colliderTag) {
            if (this.attackTargetTag.indexOf(colliderTag.tag) != -1) {
                event.otherCollider
                this._EndCollide(event);
            }
        }
    }

    protected abstract _EndCollide(event: ITriggerEvent)






}


