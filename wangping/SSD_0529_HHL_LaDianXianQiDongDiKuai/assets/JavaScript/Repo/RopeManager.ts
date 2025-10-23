import { _decorator, CCInteger, Component, instantiate, Node, PointToPointConstraint, Quat, RigidBody, RigidBodyComponent, tween, Vec3 } from 'cc';
import { DataManager } from '../Global/DataManager';
import { RopeGeneratorNew } from './RopeGeneratorNew';
import { MathUtil } from '../Utils/MathUtils';
import { CompleteRopeItem } from './CompleteRopeItem';
import { EventManager } from '../Global/EventManager';
import { EventName } from '../Common/Enum';
import { PlugItem } from './PlugItem';
import { eventMgr } from '../core/EventManager';
import { PlotName } from '../core/EventType';
const { ccclass, property } = _decorator;

@ccclass('RopeManager')
export class RopeManager extends Component {

    /** 电线起点 */
    @property(Node)
    headNodes: Node[] = [];

    /** 电线终点 */
    @property(Node)
    endNodes: Node[] = [];

    /** 电线父节点 */
    @property(Node)
    ropeParent: Node = null;

    @property(Node)
    completeRope: Node = null;

    @property(CCInteger)
    leftRopeMoveSpeed: number = 0.5;

    @property(Node)
    newEndNode: Node = null;

    @property(Node)
    Arrow_beast: Node = null;

    @property(Node)
    Arrow_mining: Node = null;

    @property(Node)
    Arrow_farmLand: Node = null;


    private _startRopeNum: number = 3;

    private _ropes: CompleteRopeItem[] = [];

    //当前rope索引
    private _nowRopeIndex: number = 0;

    start() {
        DataManager.Instance.Arrow_beast = this.Arrow_beast
        DataManager.Instance.Arrow_farmLand = this.Arrow_farmLand
        DataManager.Instance.Arrow_mining = this.Arrow_mining
        DataManager.Instance.ropeManager = this;
        for (let i = 0; i < this._startRopeNum; i++) {
            this.creatPope(i);
        }
        for (let i = this._startRopeNum; i < this.headNodes.length; i++) {
            this.headNodes[i].active = false;
            this.endNodes[i].active = false;
        }

    }

    protected onEnable(): void {
        EventManager.inst.on(EventName.PlugStateUpdate, this.onPlugStateUpdate, this);
        EventManager.inst.on(EventName.GameOver, this.onGameOver, this);
        EventManager.inst.on(EventName.ropeMovePoint, this.ropeMovePointCallback, this);
    }

    protected onDisable(): void {
        EventManager.inst.off(EventName.PlugStateUpdate, this.onPlugStateUpdate, this);
        EventManager.inst.off(EventName.GameOver, this.onGameOver, this);
    }

    /** 创建一根电线 */
    public creatPope(index: number = 0) {

        let newParent = instantiate(this.completeRope);

        let item: CompleteRopeItem = newParent.getComponent(CompleteRopeItem);

        if (item) {
            newParent.parent = this.ropeParent;
            this._ropes.push(item);
            item.init(index, this.headNodes[index], this.endNodes[index]);
        }
    }

    public creatLeftRopes() {
        let index = 0;
        for (let i = this._startRopeNum; i < this.headNodes.length; i++) {

            if (DataManager.Instance.leftSocket[index] == 3) {
                index += 1;
                this.scheduleOnce(() => {

                    this.headNodes[i].setPosition(new Vec3(-0.837, 0, 3));
                    this.endNodes[i].setPosition(new Vec3(-1.305, 0, 1.8));
                    //  this.headNodes[i].setRotation();
                    //this.headNodes[i].rotation = this.headNodes[1].rotation;

                    //this.endNodes[i].setPosition(new Vec3(-1.4, 0.5, 2.917));
                    let rot = new Quat();
                    Quat.fromEuler(rot, 0, -26, 0);
                    this.endNodes[i].setRotation(rot);
                    // this.endNodes[i].setRotation(this.endNodes[1].rotation);
                    // this.endNodes[i].position = this.endNodes[1].position;
                    // this.endNodes[i].rotation = this.endNodes[1].rotation;
                }, 0.5)

            }

            this.scheduleOnce(() => {
                this.schedule(() => {
                    this.headNodes[i].active = true;
                    this.endNodes[i].active = true;
                }, 1)

                this.creatPope(i);
            }, 0.5)
            console.log("DataManager.Instance.leftSocket[index] == ", DataManager.Instance.leftSocket[0]);
            console.log("DataManager.Instance.leftSocket[index] == ", DataManager.Instance.leftSocket[1]);
            //插销的动作取消改用Animation
            // let pos: Vec3 = this.endNodes[i].getWorldPosition().clone();
            // this.endNodes[i].setWorldPosition(new Vec3(pos.x, pos.y + 5, pos.z));
            // tween(this.endNodes[i]).to(0.15, { worldPosition: pos }).start();
        }
    }

    // private creatStaticRope(index:number = 0){
    //     let plugTar:Node = this.endNodes[index];
    //     let staticTar:Node = this.headNodes[index];
    //     const curvePoints = MathUtil.generateSmoothPath(plugTar.getWorldPosition().clone(),staticTar.getWorldPosition().clone(),this._ropeLen,-8.35);
    //     let newParent = new Node("Rope"+index);
    //     newParent.parent = this.ropeParent;
    //     this._ropesParent.push(newParent);
    //     console.log("staticPoss",JSON.stringify(curvePoints));
    //     for(let i=0;i<this._ropeLen;i++){
    //         let ropeNode = instantiate(this.ropeNode);
    //         ropeNode.getComponent(RigidBody).type = RigidBody.Type.STATIC;
    //         ropeNode.active = true;
    //         ropeNode.parent = newParent;
    //         ropeNode.setWorldPosition(curvePoints[i].position);
    //         ropeNode.rotation = curvePoints[i].rotation;
    //     }        
    // }

    public setRopeStateByIndex(index: number, state: number) {
        let item = this._ropes[index];
        item.state = state;
    }


    update(deltaTime: number) {

    }

    //通知引导更新位置
    private index: boolean = true;
    private index1: boolean = true;
    private onPlugStateUpdate() {
        if (DataManager.Instance.leftSocket.length <= 2) {
            this.Arrow_farmLand.active = false;
            this.Arrow_mining.active = false;
            this.Arrow_beast.active = false;
            EventManager.inst.emit(EventName.ArrowTargetVectorUpdate, null);
            return;
        }
        let pos: Vec3 = new Vec3();
        let state1Index: number = -1;
        let state0Index: number = -1;
        for (let i = 0; i < this.endNodes.length; i++) {
            let plug: PlugItem = this.endNodes[i].getComponent(PlugItem);
            if (plug) {
                if (plug.state == 1) {
                    state1Index = i;
                    break;
                } else if (plug.state == 0 && state0Index == -1) {
                    state0Index = i;
                }
            }
        }
        console.log("DataManager.Instance.leftSocket[0] == ", DataManager.Instance.leftSocket[0]);
        if (DataManager.Instance.leftSocket[0] == 0) {
            this.Arrow_farmLand.active = true;
        }
        else if (DataManager.Instance.leftSocket[0] == 1) {
            this.scheduleOnce(() => {
                if (!this.index)
                    return;
                this.index = false;

                this.Arrow_mining.active = true;
            }, 1)

        }
        else if (DataManager.Instance.leftSocket[0] == 2) {
            this.scheduleOnce(() => {
                if (!this.index1)
                    return;
                this.index = false;
                this.Arrow_beast.active = true;
            }, 1)

        }

        //引导到插座
        if (state1Index !== -1) {
            let socketIndex: number = DataManager.Instance.leftSocket[0];
            // pos = DataManager.Instance.socketNodes[socketIndex].getWorldPosition();

            // pos.x -= 1.5
            // pos.y += 4;
            pos = DataManager.Instance.arrowNodes[socketIndex].getWorldPosition();
        } else if (state0Index !== -1) {
            //引导到插头
            pos = this.endNodes[state0Index].getWorldPosition();
        }

        EventManager.inst.emit(EventName.ArrowTargetVectorUpdate, pos.clone());
    }

    public onGameOver(): void {
        // this.scheduleOnce(() => {
        // this.unbatchAllAndMoveHeads();
        // }, 6)
        //  EventManager.inst.emit(EventName.ropeMovePoint);
        this.creatLeftRopes();
        //停顿3秒，给剩下的插上插头
        // this.resetPos();
        this.scheduleOnce(this.connectLeftRopes, 3);

        //已有电线晃动一下
        for (let i = 0; i < this._startRopeNum; i++) {
            this._ropes[i].shackRope();
        }


    }
    ropeMovePointCallback() {
        this.unbatchAllAndMoveHeads();
    }
    /**
   * 取消所有绳子的合批，移动头节点位置
   */
    public unbatchAllAndMoveHeads() {
        for (let i = 0; i < this._ropes.length; i++) {
            const ropeNode = this._ropes[i];
            const ropeComp = ropeNode.getComponent(CompleteRopeItem);
            if (ropeComp) {
                ropeComp.unbatchStaticModel();
            }
        }
        for (let i = 0; i < 5; i++) {
            const pos1 = this.headNodes[i].getPosition();
            this.headNodes[i].setPosition(new Vec3(pos1.x - 0.5, pos1.y + 1.5, pos1.z));
            // let pos: Vec3 = this.headNodes[i].getWorldPosition().clone();
            // this.headNodes[i].setWorldPosition(new Vec3(pos.x, pos.y + 1.5, pos.z));
        }


    }


    //连接剩下的插头
    //this._nowRopeIndex = this._startRopeNum;
    private connectLeftRopes() {
        this._nowRopeIndex = 0;
        this.continueFunc();
        // for (let index = 0; index < this.endNodes.length; index++) {
        //     if (this.endNodes[index].getComponent(PlugItem).state == 0) {
        //         this.connectLeftOneRope();
        //         break;
        //         //this.plugLinkSocket(index,this.endNodes[index]);
        //     }
        // }

    }
    private continueFunc() {
        for (let index = this._nowRopeIndex; index < this.endNodes.length; index++) {
            if (this.endNodes[index].getComponent(PlugItem).state == 0) {
                if (DataManager.Instance.leftSocket[0] == 3) {
                    this.newEndNode.getChildByName(`ChaTou${2}`).active = false;
                } else {
                    this.newEndNode.getChildByName(`ChaTou${index}`).active = false;
                }

                console.log("continueFunc index == " + index);
                this.connectLeftOneRope();
                break;
                //this.plugLinkSocket(index,this.endNodes[index]);
            } else {
                this._nowRopeIndex++;
            }
        }
    }

    private connectLeftOneRope() {
        let self = this;
        let plug: PlugItem = this.endNodes[this._nowRopeIndex].getComponent(PlugItem);
        if (plug && plug.state == 0) {
            plug.state = 1;
            let socketIndex: number = DataManager.Instance.leftSocket.shift();
            let eulerAngles: Vec3 = DataManager.Instance.plugMoveAngles[socketIndex];
            let plugTartetRot = new Quat();
            Quat.fromEuler(plugTartetRot, eulerAngles.x, eulerAngles.y, eulerAngles.z);
            let endPos: Vec3 = this.getEndPos(DataManager.Instance.socketNodes[socketIndex]);
            let distance: number = Vec3.distance(this.endNodes[this._nowRopeIndex].worldPosition, endPos);
            let t = distance / (this.leftRopeMoveSpeed * 1000) + 1.3;
            let cloudHide: boolean = false;
            let tweenHandel = tween(this.endNodes[this._nowRopeIndex]).to(t, { rotation: plugTartetRot, worldPosition: endPos }, {
                easing: "cubicOut",
                onUpdate(target, ratio) {
                    //检测距离靠近直接走插入动画
                    let nowDistan: number = Vec3.distance(self.endNodes[self._nowRopeIndex].worldPosition, endPos);
                    if (nowDistan < DataManager.Instance.plugConnectDistance) {
                        self.plugLinkSocket(socketIndex, self.endNodes[self._nowRopeIndex]);
                        tweenHandel.stop();
                    }
                    if (!cloudHide && nowDistan < DataManager.Instance.cloudHideDistance) {
                        eventMgr.emit(PlotName[socketIndex] + "_cloudFadeOut");
                        cloudHide = true;
                    }
                },
            }).start();
            this.scheduleOnce(() => {
                this._nowRopeIndex++;
                if (this._nowRopeIndex < this.endNodes.length) {
                    //this.connectLeftOneRope();
                    this.continueFunc();
                }
            }, 2);
        }
    }
    /* 根据欧拉角计算反方向的移动向量
    * @param eulerAngles 欧拉角（度）
    * @param distance 移动距离
    * @returns 反方向移动向量
    */
    getBackwardMoveVector(eulerAngles: Vec3, distance: number): Vec3 {
        const quat = new Quat();
        Quat.fromEuler(quat, eulerAngles.x, eulerAngles.y, eulerAngles.z);

        // 初始前方向向量
        const forward = new Vec3(-1, 0, 0);
        const direction = new Vec3();
        Vec3.transformQuat(direction, forward, quat);

        // 反方向向量
        direction.multiplyScalar(-distance);
        return direction;
    }
    //插头插入动画，然后解锁地块
    public plugLinkSocket(socketIndex: number, plugNode: Node) {

        let dis: number = 2;
        let moveDis = this.getBackwardMoveVector(DataManager.Instance.plugFinalAngles[socketIndex], dis)

        let endPos: Vec3 = this.getEndPos(DataManager.Instance.socketNodes[socketIndex]);
        Vec3.add(moveDis, moveDis, plugNode.worldPosition);
        eventMgr.emit(PlotName[socketIndex] + "_cloudFadeOut");
        tween(plugNode)
            .to(0.5, { worldPosition: moveDis, eulerAngles: DataManager.Instance.plugFinalAngles[socketIndex] })
            .to(0.3, { worldPosition: endPos }, { easing: "cubicOut" }).call(() => {
                let index: number = DataManager.Instance.leftSocket.indexOf(socketIndex);
                if (index >= 0) {
                    DataManager.Instance.leftSocket.splice(index, 1);
                }
                plugNode.getComponent(PlugItem).state = 2;

                //通知解锁
                eventMgr.emit(PlotName[socketIndex] + "_start");
                DataManager.Instance.sceneManger.checkBuildCanUpdate();
                DataManager.Instance.mainCamera.moveToCenter();
            }).start();
    }

    //插座对应插头位置
    private getEndPos(socketNode: Node): Vec3 {
        let endPos: Vec3 = MathUtil.localToWorldPos3D(new Vec3(0, 0, 1.5), socketNode);
        return endPos;
    }
}


