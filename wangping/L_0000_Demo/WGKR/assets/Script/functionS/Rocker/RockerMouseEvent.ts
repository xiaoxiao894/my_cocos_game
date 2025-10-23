import { _decorator, CCFloat, Component, EventTouch, Input, log, Node, UITransform, Vec2 } from 'cc';
import RockerManager from './RockerManager';
import RockerLogic from './RockerLogic';
import { RockerUI } from './RockerUI';
import { MoveDrive } from '../../Base/MoveDrive';
import { GuideManager } from '../GameOver/GuideManager';
import AudioManager, { SoundEnum } from '../../Base/AudioManager';
const { ccclass, property } = _decorator;

@ccclass('RockerMouseEvent')
export class RockerMouseEvent extends Component {


    /**实际rockerUI */
    @property(RockerUI)
    public rockerUI: RockerUI;

    /**遥感动画 */
    @property(Node)
    public rockerAniUI: Node;

    @property(CCFloat)
    public rockerAniUIShowTime = 2;
    private _RockerAniShowTime: number = 2;

    private _rockerLogic: RockerLogic;

    private isOnClick = false;
    start() {
        RockerManager.instance.init(this.rockerUI.tran.width / 2);
        this._rockerLogic = RockerManager.instance.rockerLogic;
        this.node.on(Node.EventType.TOUCH_START, this.onMouseDown, this);
        this.rockerUI.node.active = false;
    }

    public shouAni() {
        this.rockerAniUI.active = true;
    }

    private onMouseDown(event: EventTouch) {
        if (!this.isOnClick) {
            this.isOnClick = true;
            // EventManager.emit(EventType.firstClick);
            AudioManager.inst.play(SoundEnum.bgm);
            GuideManager.instance.guideSwitch = true;
            MoveDrive.isMoveOk = true;
        }
        this.node.on(Node.EventType.TOUCH_MOVE, this.onMouseMove, this);
        this.node.on(Node.EventType.TOUCH_END, this.onMouseOver, this);
        this.node.on(Node.EventType.TOUCH_CANCEL, this.onMouseOver, this);
        let pos = event.getUILocation();
        this._rockerLogic.rockerDown(pos);
        this.rockerUI.pos = pos;
        this.rockerUI.node.active = true;
        this.rockerAniUI.active = false;
    }

    private onMouseMove(event: EventTouch) {
        let pos = event.getUILocation()
        this._rockerLogic.rockerMove(pos);
        this.rockerUI.rPos = this._rockerLogic.rockerPos;
    }

    private onMouseOver(event: EventTouch) {
        this.node.off(Node.EventType.TOUCH_MOVE, this.onMouseMove, this);
        this.node.off(Node.EventType.TOUCH_END, this.onMouseOver, this);
        this.node.off(Node.EventType.TOUCH_CANCEL, this.onMouseOver, this);
        this._rockerLogic.rockerOver();
        this.rockerUI.rPos = this._rockerLogic.rockerPos;
        this.rockerUI.node.active = false;
        this._RockerAniShowTime = this.rockerAniUIShowTime;
    }

    update(deltaTime: number) {
        if (!this.rockerAniUI.active && !this.rockerUI.node.active && this._RockerAniShowTime > 0) {
            this._RockerAniShowTime -= deltaTime;
            if (this._RockerAniShowTime <= 0) {
                this.rockerAniUI.active = true;
            }
        }
    }
}


