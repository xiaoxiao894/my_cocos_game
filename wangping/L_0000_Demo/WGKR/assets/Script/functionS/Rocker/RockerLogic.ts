import { log, math, Vec2 } from "cc";

export default class RockerLogic {



    private curTouchId: number;
    /**
     *摇杆位置
     */
    private rockerPoint: Vec2;

    /**
     * 弧度
     */
    private radians: number;
    /**
     * 半径
     */
    private radius: number;
    private radiusSquare: number;

    /**记录 遥感到中心的位置*/
    private _rockerPos: Vec2;
    /**记录遥感方向 */
    private _rockerDirection: Vec2;



    private _isMove: boolean = false;



    constructor(radius: number) {
        this.radius = radius;
        this.radiusSquare = this.radius * this.radius;
        this._rockerPos = new Vec2();
        this._rockerDirection = new Vec2();
    }

    public rockerDown(v2: Vec2) {
        this.rockerPoint = v2;
        this._isMove = true;
    }

    public rockerMove(mousePos: Vec2) {
        let dx = mousePos.x - this.rockerPoint.x;
        let dy = mousePos.y - this.rockerPoint.y;
        this.radians = Math.atan2(dy, dx);
        let x = Math.cos(this.radians);
        let y = Math.sin(this.radians);
        let dis = dx * dx + dy * dy;
        let r = Math.min(1, dis / this.radiusSquare * 2.5) * this.radius;


        this._rockerDirection.x = x;
        this._rockerDirection.y = y;
        this._rockerPos.x = this._rockerDirection.x * r;
        this._rockerPos.y = this._rockerDirection.y * r;
    }

    public rockerOver() {
        this.rockerPoint = null;
        this.radians = 0;
        this._rockerPos.x = 0;
        this._rockerPos.y = 0;
        this._rockerDirection.x = 0;
        this._rockerDirection.y = 0;
        this._isMove = false;
    }


    public get isMove() {
        return this._isMove;
    }


    /**记录 遥感到中心的位置*/
    public get rockerPos() {
        return this._rockerPos;
    }
    /**遥感方向 */
    public get rockerDirection() {
        return this._rockerDirection;
    }

}