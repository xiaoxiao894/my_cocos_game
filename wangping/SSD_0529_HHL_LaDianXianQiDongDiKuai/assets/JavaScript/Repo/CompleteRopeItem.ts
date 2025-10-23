import { _decorator, Component, instantiate, Material, MeshRenderer, Node, Quat, Vec3 } from 'cc';
import { RopeGeneratorNew } from './RopeGeneratorNew';
import { RopeBatch } from './RopeBatch';
const { ccclass, property } = _decorator;

@ccclass('CompleteRopeItem')
export class CompleteRopeItem extends Component {

    @property(Node)
    ropeNode: Node = null;

    @property(Node)
    private effectNode: Node = null;

    @property(Node)
    ropeParent: Node = null;

    /** 状态 0未连接 1连接中 2已连接 */
    private _state: number = 0;

    private _index: number = 0;

    private _ropeLen: number = 120;

    private _rope: RopeGeneratorNew = null;

    private headNode: Node = null;
    private endNode: Node = null;


    public set state(value: number) {
        this._state = value;
        if (this._state === 1) {
            this._rope.startMove();
            //取消合批
            this.unschedule(this.batchStaticModel);
            this.node.getComponent(RopeBatch).unbatchStaticModel();
        } else {
            if (this._state === 2) {
                this._rope.stopMove();
            } else {
                this._rope.stopMove();
            }
            //合批
            this.scheduleOnce(this.batchStaticModel, 6);
        }
    }

    public get state() {
        return this._state;
    }

    public init(index: number, startNode: Node, endNode: Node) {
        this._index = index;
        this._state = 0;
        this.headNode = startNode;
        this.endNode = endNode;
        this.effectNode.active = false;
        this.creatRope();

    }

    private creatRope(): void {

        let ropeNode = instantiate(this.ropeNode);
        ropeNode.active = true;
        ropeNode.parent = this.ropeParent;
        ropeNode.getComponent(RopeGeneratorNew).createRope(this._ropeLen, this.headNode, this.endNode);
        this._rope = ropeNode.getComponent(RopeGeneratorNew);

        //8秒后合批
        this.scheduleOnce(this.batchStaticModel, 8);
    }

    private _reopIndex: number = 0;
    private _timeAccumulator: number = 0;
    private _yOffset: number = -2;
    private _yDirection: number = 1; // 1表示递增，-1表示递减
    update(deltaTime: number) {
        if (this._state === 2) {
            if (this._reopIndex < 0) {
                this._reopIndex = this.ropeParent.children.length - 1;
            }
            let newPos: Vec3 = this.ropeParent.children[Math.floor(this._reopIndex)].worldPosition.clone();
             newPos.y += 2;
             newPos.x -= -0.3;
             
            // // 累积时间
            // this._timeAccumulator += deltaTime;
            // if (this._timeAccumulator >= 0.01) {
            //     // 每0.01秒更新y偏移，范围-2到2循环
            //     this._yOffset += this._yDirection * 0.1; // 每次变化0.1，可调节速度
                
            //     if (this._yOffset >= 2) {
            //         this._yOffset = 2;
            //         this._yDirection = -1;
            //     } else if (this._yOffset <= -0.5) {
            //         this._yOffset = -0.5;
            //         this._yDirection = 1;
            //     }
            //     this._timeAccumulator = 0;
            // }
            // newPos.x += this._yOffset;
            // newPos.y += this._yOffset;
            if (!this.effectNode.active) {
                this.effectNode.active = true;
            }
             const rotation = Quat.fromEuler(new Quat(), 0, -90, 0);
             this.effectNode.setWorldRotation(rotation);
            this.effectNode.setWorldPosition(newPos);

            // 每帧减少一个索引，使用累积速度实现加速
            this._reopIndex -= deltaTime * 60 * 2.8; // 5为加速倍数，60为假设帧率，调节加速速度
            if (this._reopIndex < 0) {
                this._reopIndex += this.ropeParent.children.length;
            }
        }
    }

    public shackRope() {
        this._rope.shackRope();
    }

    public batchStaticModel() {
        this.node.getComponent(RopeBatch).batchStaticModel();
    }
    public unbatchStaticModel() {
        this.unschedule(this.batchStaticModel);
        this.node.getComponent(RopeBatch).unbatchStaticModel();
        this._rope.startMove();
    }
}


