import { _decorator, AnimationState, CCFloat, Collider, Component, director, ICollisionEvent, math, Node, RigidBody, SkeletalAnimation, v3, Vec3 } from 'cc';
import { StateDefine } from './StateDefine';
import { MathUtil } from '../Util/MathUtil';
import { DataManager } from '../Global/DataManager';
import { FlowField } from '../Monster/FlowField';
import { GamePlayNameEnum } from '../Enum/Index';
const { ccclass, property } = _decorator;

let tempVelocity: Vec3 = v3();

@ccclass('Actor')
export class Actor extends Component {
    @property(SkeletalAnimation)
    skeletalAnimation: SkeletalAnimation | null = null;

    @property(CCFloat)
    linearSpeed: number = 1.0;

    @property(CCFloat)
    angularSpeed: number = 90;

    destForward: Vec3 = v3();

    collider: Collider | null = null;
    rigidbody: RigidBody | null = null;

    currentState: StateDefine | string = StateDefine.Idle;

    start() {
        this.rigidbody = this.node.getComponent(RigidBody);
        this.collider = this.node.getComponent(Collider);

        if (this.skeletalAnimation) {
            this.skeletalAnimation.on(SkeletalAnimation.EventType.FINISHED, this.onAnimFinished, this);
        }

        this.collider?.on("onTriggerEnter", this.onTriggerEnter, this);
    }

    update(deltaTime: number) {
        if (this.currentState == StateDefine.Die) {
            return;
        }

        let a = MathUtil.signAngle(this.node.forward, this.destForward, Vec3.UP);
        let as = v3(0, a * 20, 0);
        this.rigidbody.setAngularVelocity(as);

        switch (this.currentState) {
            case StateDefine.Walk:
                this.doMove();
                break;
        }
    }

    doMove() {
        let speed = this.linearSpeed * this.destForward.length() * 10;
        tempVelocity.x = math.clamp(this.node.forward.x, -1, 1) * speed;
        tempVelocity.z = math.clamp(this.node.forward.z, -1, 1) * speed;
        this.rigidbody?.setLinearVelocity(tempVelocity);
        //FlowField.Instance.updateFlowField(this.node.getWorldPosition().clone());
    }

    stopMove() {
        this.rigidbody?.setLinearVelocity(Vec3.ZERO);
    }

    changState(state: StateDefine | string) {
        if (state == this.currentState) {
            return;
        }

        if (this.currentState == StateDefine.Walk) {
            this.stopMove();
        }

        this.skeletalAnimation?.crossFade(state as string, 0.1)
        this.currentState = state;
    }

    onTriggerEnter(event: ICollisionEvent) {
        const selfCollider = event.selfCollider;
        const otherCollider = event.otherCollider;

        if (otherCollider.node.name == "Door") {
            DataManager.Instance.guideTargetIndex++;
            director.loadScene(GamePlayNameEnum.GamePlayTwo);
        }
    }

    onAnimFinished(state: AnimationState) {
        if (state.name === 'Attack') {
            DataManager.Instance.isNormalAttacking = true;
        }
    }
}


