import { _decorator, AudioClip, AudioSource, Component, Node, Vec3 } from 'cc';
import EventManager from 'db://assets/scripts/EventManager/EventManager'
import EventType from 'db://assets/scripts/EventManager/EventType';
import { SoundController } from 'db://assets/scripts/Sounds/SoundController';
import { SoundPlayer } from 'db://assets/scripts/Sounds/SoundPlayer';
const { ccclass, property } = _decorator;

@ccclass('AircraftSound')
export class AircraftSound extends Component {

    @property(SoundPlayer)
    flyStartPlayer: SoundPlayer

    @property(SoundPlayer)
    lineDragPlayer: SoundPlayer

    @property(SoundPlayer)
    collisionPlayer: SoundPlayer

    _isStarted: boolean = false
    _isHideDrag: boolean = false
    _time: number = 0;

    _nextLineSoundTime: number = 0;
    _nextCollisionSoundTime: number = 0;

    start() {
        EventManager.addEventListener(EventType.AIRCAFT_START, this.launch, this);
        EventManager.addEventListener(EventType.HIDE_DRAG_TWEEN, this.onHideDragTween, this)
        EventManager.addEventListener(EventType.UPDATE_MAIN_PLAYER_POS, this.onUpdatePlayerPos, this);
        EventManager.addEventListener(EventType.AIRCAFT_TAP_GROUNDED, this.tapGrounded, this);
    }

    protected onDestroy(): void {
        EventManager.remveEventListener(EventType.AIRCAFT_START, this.launch, this);
        EventManager.remveEventListener(EventType.HIDE_DRAG_TWEEN, this.onHideDragTween, this)
        EventManager.remveEventListener(EventType.UPDATE_MAIN_PLAYER_POS, this.onUpdatePlayerPos, this);
        EventManager.remveEventListener(EventType.AIRCAFT_TAP_GROUNDED, this.tapGrounded, this);
    }

    update(deltaTime: number) {
        this._time += deltaTime;
    }

    launch() {
        this._isStarted = true
        this.flyStartPlayer.play();
    }

    onHideDragTween() {
        this._isHideDrag = true;
    }

    onUpdatePlayerPos(pos: Vec3) {
        if (this._isStarted || this._isHideDrag == false) {
            return;
        }
        if (this._time > this._nextLineSoundTime) {
            this.lineDragPlayer.playOneShot();
            this._nextLineSoundTime = this._time + 0.5
        }
    }

    tapGrounded(isTap: boolean) {
        if (isTap) {
            if (this._time > this._nextCollisionSoundTime) {
                this.collisionPlayer.playOneShot();
                this._nextCollisionSoundTime = this._time + 1.0
            }
        }
    }
}

