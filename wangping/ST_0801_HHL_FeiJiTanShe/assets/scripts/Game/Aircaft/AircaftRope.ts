import { _decorator, Component, Line, Node, v3, Vec3 } from 'cc';
import EventManager from 'db://assets/scripts/EventManager/EventManager'
import EventType from 'db://assets/scripts/EventManager/EventType';
const { ccclass, property } = _decorator;

@ccclass('AircaftRope')
export class AircaftRope extends Component {

    @property(Node)
    followNode: Node

    @property(Node)
    plugTar01Node: Node

    @property(Node)
    plugTar02Node: Node

    @property(Node)
    staticTar01Node: Node

    @property(Node)
    staticTar02Node: Node


    @property
    followWorldPosition: Vec3 = new Vec3();

    @property
    originalStaticTar01Pos: Vec3 = new Vec3();

    @property
    originalStaticTar02Pos: Vec3 = new Vec3();

    @property
    curStaticTar01Pos: Vec3 = new Vec3();

    @property
    curStaticTar02Pos: Vec3 = new Vec3();

    // @property(Node)
    // rope01StaticNode: Node

    // @property(Node)
    // rope02StaticNode: Node

    _isAircaftStarted: boolean = false;
    // _isSleep: boolean = false;
    _isDirty: boolean;

    protected onLoad(): void {
    }

    start() {

        const followWorldPosition = new Vec3();
        followWorldPosition.set(this.followNode.worldPosition);
        this.followWorldPosition = followWorldPosition;
        this.originalStaticTar01Pos = this.staticTar01Node.worldPosition;
        this.originalStaticTar02Pos = this.staticTar02Node.worldPosition;

        // EventManager.addEventListener(EventType.AIRCAFT_DRAG, this.onDrag, this)
        EventManager.addEventListener(EventType.UPDATE_MAIN_PLAYER_POS, this.onUpdateMainPlayerPos, this)
        EventManager.addEventListener(EventType.AIRCAFT_START, this.onAircaftStart, this)
    }

    protected onDestroy(): void {
        // EventManager.remveEventListener(EventType.AIRCAFT_DRAG, this.onDrag, this)
        EventManager.remveEventListener(EventType.UPDATE_MAIN_PLAYER_POS, this.onUpdateMainPlayerPos, this)
        EventManager.remveEventListener(EventType.AIRCAFT_START, this.onAircaftStart, this)
    }

    update(deltaTime: number) {
        if (this._isDirty) {

            const oldFollowWorldPosition = new Vec3();
            oldFollowWorldPosition.set(this.followWorldPosition);

            const followWorldPosition = new Vec3();
            followWorldPosition.set(this.followNode.worldPosition);
            this.followWorldPosition = followWorldPosition;

            this.plugTar01Node.worldPosition = followWorldPosition;
            this.plugTar02Node.worldPosition = followWorldPosition;

            const x = followWorldPosition.x - oldFollowWorldPosition.x;

            const static01Pos = new Vec3();
            static01Pos.set(this.originalStaticTar01Pos);
            static01Pos.x += x * 0.02;
            this.curStaticTar01Pos = static01Pos;
            this.staticTar01Node.worldPosition = static01Pos;

            const static02Pos = new Vec3();
            static02Pos.set(this.originalStaticTar02Pos);
            static02Pos.x += x * 0.02;
            this.curStaticTar02Pos = static02Pos;
            this.staticTar02Node.worldPosition = static02Pos;

            this._isDirty = false;
        }
    }

    protected lateUpdate(dt: number): void {

    }

    onUpdateMainPlayerPos(pos: Vec3) {
        if (this._isAircaftStarted) {
            return;
        }
        this._isDirty = true;
    }


    onAircaftStart() {
        this._isAircaftStarted = true;
    }
}

