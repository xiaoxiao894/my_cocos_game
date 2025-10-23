import { Component, EventTouch, Input, Node, Vec2, Vec3, _decorator } from 'cc';
import Game from '../Test/Test2';
const { ccclass, property } = _decorator;


const TOUCH_RADIUS = 180;
const ROLE_MOVE_FRAME = 0.2;
const _tempPos = new Vec3();
const _tempDelta = new Vec2();
const Horizontal = new Vec2(1, 0);
const MOVE_DELTA = 0.2;

@ccclass('rolejoystick')
export class rolejoystick extends Component {

    @property(Node)
    ctrlSprite: Node = null!;
    @property(Node)
    moveTagSp: Node = null!;
    @property(Node)
    role: Node = null!;
    @property(Vec3)
    originPos = new Vec3();

    private _isTouch = false;
    private _touchPos = new Vec2();
    private _startPos = new Vec2();
    private _movePos = new Vec2();
    private _animComp: Animation = null!;
    private _animState = 'idle';

    // _tempPos: Vec3 = new Vec3()
    start() {
        this.ctrlSprite.setPosition(this.originPos);
        // _tempPos.set(0, 90, 0);
        // this.role.eulerAngles = _tempPos;
        // this._animComp = this.role.getComponentInChildren(Animation)!;
        this.node.on(Input.EventType.TOUCH_START, this.touchStart, this);
        this.node.on(Input.EventType.TOUCH_MOVE, this.touchMove, this);
        this.node.on(Input.EventType.TOUCH_END, this.touchEnd, this);
    }

    onDestroy() {
        this.node.off(Input.EventType.TOUCH_START, this.touchStart, this);
        this.node.off(Input.EventType.TOUCH_MOVE, this.touchMove, this);
        this.node.off(Input.EventType.TOUCH_END, this.touchEnd, this);
    }

    touchStart(touch: EventTouch) {
        // this.changeState('cocos_anim_run');
        // touch.getUI
        touch.getUILocation(this._startPos);
        const distance = this._startPos.length();
        console.error("joystick::", touch, distance)
        // if (distance < TOUCH_RADIUS) {
        this._touchPos.set(this._startPos);
        this._movePos.set(this._startPos);
        _tempPos.set(this.ctrlSprite.position);
        this.ctrlSprite.setWorldPosition(this._startPos.x, this._startPos.y, _tempPos.z);
        this._isTouch = true;
        // }
    }

    touchMove(touch: EventTouch) {
        if (!this._isTouch) {
            return;
        }

        touch.getUILocation(this._movePos);
        Vec2.subtract(_tempDelta, this._movePos, this._startPos);
        // 计算角色的整体旋转值
        // const deltaRadian = _tempDelta.angle(Horizontal);
        // const angle = deltaRadian * 180 / Math.PI;
        // const rot = this.role.eulerAngles;
        // _tempPos.set(rot.x, 90 + (Math.sign(_tempDelta.y)) * angle, rot.z);
        // this.role.eulerAngles = _tempPos;

        // 重新规划移动方向值
        // _tempDelta.multiply2f(MOVE_DELTA, MOVE_DELTA);
        // Vec2.add(this._movePos, this._startPos, _tempDelta);
        const distance = _tempDelta.length();

        // 是否超出限制半径
        if (distance > TOUCH_RADIUS) {

            const radian = _tempDelta.angle(Horizontal);
            // console.log("radian::", radian)
            const x = Math.cos(radian) * TOUCH_RADIUS;
            let y = Math.sin(radian) * TOUCH_RADIUS;
            if (this._startPos.y >= this._movePos.y) {
                y = -y
            }
            this._movePos.set(x, y).add(this._startPos);
        }

        // this.ctrlSprite.setWorldPosition(this._movePos.x, this._movePos.y, 0);
        this.moveTagSp.setWorldPosition(this._movePos.x, this._movePos.y, 0);
        this._touchPos.set(this._movePos);
    }

    touchEnd(touch: EventTouch) {
        this._isTouch = false;
        // this.changeState('cocos_anim_idle');
        // this.ctrlSprite.setPosition(this.originPos);
        // this.moveTagSp.setPosition(this.originPos)
    }

    changeState(name: string) {
        if (this._animState === name) {
            return;
        }

        // this._animComp.play(name);
        // this._animState = name;
    }

    update() {
        if (!this._isTouch) {
            Game.Instance.Player._isMove = false
            return;
        }

        // _tempPos.set(0, 0, ROLE_MOVE_FRAME);
        // this.role.translate(_tempPos);
        if (Game.Instance.Player) {
            Game.Instance.Player._isMove = true
            Game.Instance.Player.setDir(this.moveTagSp.getPosition().subtract(this.ctrlSprite.getPosition()).normalize())
        }
        // Game.Instance.Player.move(this.moveTagSp.getPosition().subtract(this.ctrlSprite.getPosition()).normalize())
        // Game.
    }
}




