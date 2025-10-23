import { Camera, Component, Node, Vec3, _decorator } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('camerafollow')
export class camerafollow extends Component {
    offset: Vec3 = new Vec3();
    camera: Camera;

    @property(Node) folNode: Node = null
    start() {
        this.camera = this.node.getComponent(Camera);
        this.gameStart()
    }

    gameStart() {
        Vec3.subtract(this.offset, this.node.position, this.folNode.position);
    }

    _tmpV3: Vec3 = new Vec3()
    update(deltaTime: number) {
        // if (Game.Instance.gameState != GameState.GAME_PLAY || Game.Instance.player == null)
        //     return;
        let targetPos = this._tmpV3;
        targetPos = Vec3.add(targetPos, this.offset, this.folNode.position);
        Vec3.lerp(targetPos, this.node.position, targetPos, 0.1);
        this.node.setPosition(targetPos);
    }

    clear() {
        this.node.position = new Vec3(0, 0, 0);
    }
}