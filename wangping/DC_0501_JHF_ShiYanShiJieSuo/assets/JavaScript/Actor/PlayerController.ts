import { _decorator, Component,  director, MeshRenderer, Node, Vec3 } from 'cc';
import { DataManager } from '../Global/DataManager';
import { Actor } from './Actor';
import { StateDefine } from './StateDefine';
const { ccclass, property } = _decorator;

@ccclass('PlayerController')
export class PlayerController extends Component {
    actor: Actor | null = null;
    start() {
        DataManager.Instance.player = this.node;
        this.actor = this.node.getComponent(Actor);
        this.actor.init();
    }

    update(deltaTime: number) {
        if (this.actor.currState == StateDefine.Die) {
            return;
        }
        const frontBackpack = this.node.getChildByName("FrontBackpack");

        if (!frontBackpack) return;

        const len = this.handleInput();
        if (len > 0.1) {
            if (frontBackpack?.children.length > 0) {
                this.actor.changeState(StateDefine.Run);
            } else {
                this.actor.changeState(StateDefine.Run);
            }
        } else {
            if (frontBackpack.children.length > 0) {
                this.actor.changeState(StateDefine.IdleRelax);
            } else {
                this.actor.changeState(StateDefine.IdleRelax);
            }
        }
    }

    handleInput(): number {
        if (!DataManager.Instance.jm || DataManager.Instance.jm.input.length() == 0) return;

        const rootNode = director.getScene();
        const camera = rootNode.getChildByName("Main Camera");

        const { x, y } = DataManager.Instance.jm.input;

        const input = new Vec3(-x, 0, y);
        if (input.length() === 0) return;

        // === 相机方向对齐移动 ===
        const cameraForward = camera.forward.clone();
        cameraForward.y = 0;
        cameraForward.normalize();

        const cameraRight = new Vec3();
        Vec3.cross(cameraRight, Vec3.UP, cameraForward);

        const moveDir = new Vec3();
        Vec3.scaleAndAdd(moveDir, moveDir, cameraForward, input.z);
        Vec3.scaleAndAdd(moveDir, moveDir, cameraRight, input.x);
        moveDir.normalize();

        this.actor.destForward.set(moveDir);

        return moveDir.length();
    }
}

