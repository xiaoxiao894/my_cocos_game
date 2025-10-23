import { Component, Node, Vec3, _decorator } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('snakebody')
export class snakebody extends Component {

    speed: number = 3

    private _preSnakeBody: Node = null;
    public get preSnakeBody(): Node {
        return this._preSnakeBody;
    }
    public set preSnakeBody(value: Node) {
        this._preSnakeBody = value;
    }

    private _snakeBodyIdx: number = 0;
    public get snakeBodyIdx(): number {
        return this._snakeBodyIdx;
    }
    public set snakeBodyIdx(value: number) {
        this._snakeBodyIdx = value;
    }

    reset() {
        this.snakeBodyIdx = 0
    }

    addIdx() {
        this.snakeBodyIdx++
    }

    /**
     * 获取当前蛇身指向前一个蛇身的dir
     */
    _tmpVec: Vec3 = new Vec3(0, 1, 0)
    getPreDir() {
        // return this.preSnakeBody.getPosition().subtract(this.node.getPosition()).normalize()
        // return this.preSnakeBody.getPosition().subtract(this.node.getPosition())
        console.log("this.preSnakeBody.getPosition() ::", this.preSnakeBody.getPosition())
        return this.node.getPosition().subtract(this.preSnakeBody.getPosition())
    }


    start() {

    }

    update(deltaTime: number) {

    }

    _tmpV3: Vec3 = new Vec3()
    move(length: number = null) {
        let moveV2 = this.getPreDir()//.multiplyScalar(1 / this.speed)


        // console.log("蛇身移动的距离...", moveV2.length())
        Vec3.lerp(this._tmpV3, this.node.getPosition(), this.preSnakeBody.getPosition().add(moveV2), 0.5)
        console.log("........:", moveV2, this._tmpV3)
        this.node.setPosition(this._tmpV3)
        // this.node.setPosition(this.node.getPosition().add(moveV2))
    }
}


