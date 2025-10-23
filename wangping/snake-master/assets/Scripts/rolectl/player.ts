import { Component, instantiate, Node, Prefab, tween, UITransform, v2, v3, Vec2, Vec3, _decorator } from 'cc';
import WaveMng from '../logics/mng/WaveMng';
import { monsterCtl } from '../Test/monsterCtl';
import { snakebody } from './snakebody';
const { ccclass, property } = _decorator;

@ccclass('player')
export class player extends Component {

    @property(Prefab) bodyPrefab: Prefab = null
    @property(Node) tmpWeapen: Node = null
    @property(WaveMng) waveMng: WaveMng = null

    _tmpV2: Vec2 = new Vec2()
    _tmpV3: Vec3 = new Vec3(0, 1, 0)
    _tmpV32: Vec3 = new Vec3()
    dir: Vec3 = new Vec3(0, 1, 0)
    bodyNum: number = 8
    sectionLen: number = 38
    speed: number = 3
    snakeArray: Node[];

    //蛇头走过的点数量
    headPointsNum: number = 0
    // record all points
    pointsArray = [];

    _isMove: boolean = false

    monsterList: Array<Node> = []


    start() {

        this.tmpWeapen.active = false
        this.headPointsNum = 0
        this.snakeArray = [];
        this.pointsArray = []
        this.snakeArray.push(this.node);

        this.initSnake()
    }

    initSnake() {
        this.rotateHead()
        // return
        for (let i = 1; i <= this.bodyNum; i++) {
            this.getNewBody(i);
            this.recordPoints()
        }
        console.log("初始化的节点...", this.pointsArray.length, this._recordTimes)
        this._recordTimes = 0

    }


    rotateHead(headPos: Vec2 = null) {
        if (!headPos) {
            headPos = new Vec2(this.dir.x, this.dir.y)
        }

        let angle = v2(1, 0).signAngle(headPos) * 180 / Math.PI;
        this.node.angle = angle - 90;
    }

    getNewBody(bodyIdx: number) {
        // console.log("this.snakeArray.length ::", this.snakeArray.length)
        let newBody = instantiate(this.bodyPrefab);
        let snakeCtl = newBody.getComponent(snakebody)
        snakeCtl.snakeBodyIdx = 0
        snakeCtl.preSnakeBody = this.snakeArray[this.snakeArray.length - 1]

        // set new body's position //这是第一个蛇身
        if (this.snakeArray.length == 1) {
            let dir = this.dir.normalize()
            let pos = this.node.getPosition().subtract(dir.multiplyScalar(this.sectionLen))
            newBody.setPosition(pos);
        }
        else {
            let lastBody = this.snakeArray[this.snakeArray.length - 1];
            let lastBOBody = this.snakeArray[this.snakeArray.length - 2];
            lastBody.getPosition(this._tmpV32)
            lastBOBody.getPosition(this._tmpV3)
            let dir = this._tmpV3.subtract(this._tmpV32).normalize();
            let tmpPos = lastBody.getPosition().subtract(dir.multiplyScalar(this.sectionLen))
            // console.log("tmpPos ::", tmpPos, this.snakeArray.length)
            newBody.setPosition(tmpPos);
        }

        this.node.parent.insertChild(newBody, 0)
        this.snakeArray.push(newBody);
        //修改蛇身zidx
        // newBody.setSiblingIndex(zIdx)


    }

    /**
     * 记录每两节之间的向量
     */
    _tmpDir: Vec3 = new Vec3()
    _recordTimes: number = 0
    recordPoints(idx: number = null) {
        // record points between bodies (head is a special body)
        if (!idx) {
            idx = this.snakeArray.length - 1
        }
        let len = 0;
        let index = 0;
        this._recordTimes++
        let pointNum = Math.ceil(this.sectionLen / this.speed)  //当前速度移动完一节身体需要的坐标点数
        let lastBody: Node = this.snakeArray[idx];
        let lastBOBody: Node = this.snakeArray[idx - 1];
        let dir: Vec3 = lastBOBody.getPosition().subtract(lastBody.getPosition()).normalize();
        for (let pIdx = 0; pIdx < pointNum; pIdx++) {
            len += this.speed;
            this._tmpDir = dir.clone()
            let pos: Vec3 = lastBody.getPosition().add(this._tmpDir.multiplyScalar(len));
            this.pointsArray.splice(index, 0, pos); // 每次从数组头部插入(pointNum个)坐标
            index += 1;
        }

    }

    changeSpeed(sp: number) {
        this.speed = sp
        this.pointsArray = []
        this.headPointsNum = 0
        for (let i = 1; i <= this.bodyNum; i++) {
            if (this.snakeArray[i].getComponent(snakebody))
                this.snakeArray[i].getComponent(snakebody).reset()
            this.recordPoints(i)
        }
    }


    _time: number = 0
    _hasChan: boolean = false
    update(deltaTime: number) {
        // return
        this._time += deltaTime
        if (this._time > 0.5) {
            this.checkAtt()
            this._time = 0
            // this.changeSpeed(6)
        }

        this._tmpV2.set(this.dir.x, this.dir.y)
        this.rotateHead(this._tmpV2)
        if (this.dir && this._isMove) {
            this.move()
        }

    }

    getTmpAttBox(){
        let rect = this.node.getComponent(UITransform).getBoundingBoxToWorld()
        //稍微扩大点
        let biger:number = 100
        rect.x -= biger
        rect.y -= biger
        rect.width += 2 * biger
        rect.height += 2 * biger
        return rect
    }

    /**
     * 临时攻击怪物
     */
    checkAtt() {
        this.tmpWeapen.setPosition(this.node.getPosition())

        this.tmpWeapen.scale = Vec3.ZERO
        this.tmpWeapen.active = true
        tween(this.tmpWeapen).to(0.2, { scale: v3(1, 1, 1) }).call(() => {
            this.tmpWeapen.active = false
        }).start()

        let killArray = []
        // console.log("this.monsterList::", this.monsterList.length)

        let checkRect = this.getTmpAttBox() //this.node.getComponent(UITransform).getBoundingBoxToWorld()
        let checkList = this.waveMng.getTreeColliderList(checkRect)
        // console.log("checkList::", checkList)
        for (let searchIdx = 0; searchIdx < checkList.length; searchIdx++) {
            if (this.node.getPosition().subtract(checkList[searchIdx].collider.getPosition()).lengthSqr() < 22500) {
                killArray.push(checkList[searchIdx].collider)
            }
        }

        for (let rmIdx = killArray.length - 1; rmIdx >= 0; rmIdx--) {
            let tMonsterCtl: monsterCtl = killArray[rmIdx].getComponent(monsterCtl)
            let uuid = tMonsterCtl.node.uuid
            if (tMonsterCtl.hurt()) {
                for (let idx = 0; idx < this.monsterList.length; idx++) {
                    if (this.monsterList[idx].uuid == uuid) {
                        this.monsterList.splice(idx, 1)
                    }
                }
            }
        }
    }

    setDir(dir) {
        // return
        this.dir = dir
    }

    move(dir: Vec3 = null) {
        // return
        if (!dir) {
            dir = this.dir
        }

        let moveV2 = dir.normalize().multiplyScalar(this.speed)
        // console.log("蛇头移动距离...", moveV2.length())


        //最后动蛇头
        // this.node.getPosition(this._tmpV3)
        this.node.setPosition(this.node.getPosition().add(moveV2))
        this.pointsArray.push(this.node.getPosition());
        this.headPointsNum += 1;

        //从第一个蛇身开始运动
        let lastPosIdx = -1
        for (let i = 1; i < this.snakeArray.length; i++) {
            let num = Math.floor((this.pointsArray.length - this.headPointsNum) / (this.snakeArray.length - 1) * (this.snakeArray.length - 1 - i));
            let posIdx = num + this.snakeArray[i].getComponent(snakebody).snakeBodyIdx
            this.snakeArray[i].setPosition(this.pointsArray[posIdx]);
            this.snakeArray[i].getComponent(snakebody).addIdx();
            lastPosIdx = posIdx
            // console.log("use idx :: ", num + this.snakeArray[i].getComponent(snakebody).snakeBodyIdx)
        }
        // console.log("this.pointsArray::", this.pointsArray)

    }
}

