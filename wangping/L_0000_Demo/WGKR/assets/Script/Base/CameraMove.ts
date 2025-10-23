import { _decorator, Camera, Component, log, Node, Pool, tween, Vec3, view } from 'cc';
import LayerManager, { SceneType } from './LayerManager';
const { ccclass, property } = _decorator;

/**  game 摄像机  */
@ccclass('CameraMove')
export class CameraMove extends Component {

    public static instance: CameraMove;
    constructor() {
        super();
        CameraMove.instance = this;
    }

    /**跟随的目标 */
    @property(Node)
    public targetNode: Node;

    public camera: Camera;

    private _sceneCW: number;
    private _sceneCH: number;

    @property(Vec3)
    public OffVector3D: Vec3 = new Vec3();


    private sceneType: SceneType = SceneType.D2;


    public get sceneCW() {
        if (this._sceneCW == null) {
            let size = view.getDesignResolutionSize();
            this._sceneCW = size.width / 2;
            this._sceneCH = size.height / 2;
        }
        return this._sceneCW
    }

    public get sceneCH() {
        if (this._sceneCH == null) {
            let size = view.getDesignResolutionSize();
            this._sceneCW = size.width / 2;
            this._sceneCH = size.height / 2;
        }
        return this._sceneCH
    }

    protected onLoad(): void {
        this.sceneType = LayerManager.instance.SceneType;
    }
    start() {
        this.camera = this.getComponent(Camera);

    }

    private shakeIn = false;


    update(deltaTime: number) {
        if (this.shakeIn) {
            return;
        }
        // let node = PublicManager.instance.carmeraTarget;
        let node = this.targetNode;
        if (node) {
            if (this.sceneType == SceneType.D2) {


                this.move2D(node);
            } else {
                this.move3D(node);
            }
        }
    }

    private move2D(node: Node) {
        let pv = node.worldPosition;
        let pos = this.node.worldPosition
        let dx = pv.x - pos.x;
        let dy = pv.y - pos.y;
        if (Math.abs(dx) < 10) {
            dx = 0;
        }
        if (Math.abs(dy) < 10) {
            dy = 0;
        }
        this.node.setWorldPosition(pos.x + dx * 0.1, pos.y + dy * 0.1, 1000)
    }


    private move3D(node: Node) {
        let pv = node.worldPosition;
        let pos = this.node.worldPosition
        let dx = pv.x + this.OffVector3D.x - pos.x;
        let dy = pv.z + this.OffVector3D.z - pos.z;
        if (Math.abs(dx) < 0.05) {
            dx = 0;
        }
        if (Math.abs(dy) < 0.05) {
            dy = 0;
        }
        this.node.setWorldPosition(pos.x + dx * 0.1, this.OffVector3D.y, pos.z + dy * 0.1)
    }

    /**摄像机 抖动 */
    public shake() {
        if (!this.shakeIn) {
            this.shakeIn = true;
            if (Math.random() < 0.5) {
                this.Shake1();
            } else {
                // this.Shake2();
                this.Shake1();
            }
        }
    }


    /**

 * 抖动方法1（左右抖动）

 */

    public Shake1() {

        const scale = 1;
        const pos1 = 0.1 * scale;
        const pos2 = -pos1 * 2;

        tween(this.node)

            .by(0.05, { worldPosition: new Vec3(pos1, pos1) })

            .by(0.05, { worldPosition: new Vec3(pos2, pos2) })

            .by(0.05, { worldPosition: new Vec3(pos1, pos1) })

            .call(() => {

                this.shakeIn = false;

            })

            .start();

    }

    /**
    
     * 抖动方法2（伸缩抖动）
    
     */

    public Shake2() {

        let camera: Camera = this.camera;

        let ort: number = camera.orthoHeight;

        const scale = 0.1;

        tween(camera)

            .to(0.05, { orthoHeight: ort + scale })

            .to(0.05, { orthoHeight: ort - scale })

            .to(0.05, { orthoHeight: ort })

            .call(() => {
                this.shakeIn = false;
            })
            .start();

    }

}


