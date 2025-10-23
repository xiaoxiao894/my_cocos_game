import { _decorator, Component, Node, tween, v3, Vec3 } from 'cc';
import { EventManager } from '../Global/EventManager';
import { EventName } from '../Common/Enum';
const { ccclass, property } = _decorator;

@ccclass('ArrowItem')
export class ArrowItem extends Component {
    
    private _targetVec: Vec3 = null;
    private readonly _heightOffset: number = 4;
    private _selfEulerY: number = 0;
    private readonly _rotateSpeed: number = 140;

    private _isTweeningShow: boolean = false;
    private _isTweeningHide: boolean = false;
    private _isArrowVisible: boolean = false;

    @property(Node)
    arrow:Node = null;

    start() {
        
    }

    protected onEnable(): void {
        EventManager.inst.on(EventName.ArrowTargetVectorUpdate, this.updateTargetVec, this);
    }

    protected onDisable(): void {
        EventManager.inst.off(EventName.ArrowTargetVectorUpdate, this.updateTargetVec, this);
    }

    update(dt: number) {
        if(!this._targetVec){
            return;
        }
        const time = Date.now();
        const speed = 0.05;
        const amplitude = 0.5;
        const floatY = Math.sin(time*0.1 * speed) * amplitude;

        this.arrow.setWorldPosition(new Vec3(
            this._targetVec.x,
            this._targetVec.y + this._heightOffset + floatY,
            this._targetVec.z
        ));
        this._selfEulerY += this._rotateSpeed * dt;
        this._selfEulerY %= 360;
        this.arrow.setRotationFromEuler(180, this._selfEulerY, 0);

        if(!this._isTweeningShow&&!this._isTweeningHide&&!this._isArrowVisible&&this._targetVec){
            this.playScaleTween();
        }


    }

    playScaleTween() {
        if (this._isTweeningShow) return;
        this.arrow.active = true;
        this._isTweeningShow = true;
        this._isArrowVisible = true;
        this.arrow.setScale(v3(0.1, 0.1, 0.1));
        tween(this.arrow)
            .to(0.25, { scale: v3(3.2, 3.2, 3.2) }, { easing: 'quadOut' })
            .to(0.15, { scale: v3(3, 3, 3) }, { easing: 'quadIn' })
            .call(() => {
                this._isTweeningShow = false;
                //console.log("playScaleTween",this.arrow.scale);
            })
            .start();
    }

    stopScaleTween() {
        if ( this._isTweeningHide) return;

        this._isTweeningHide = true;

        tween(this.arrow)
            .to(0.25, { scale: v3(0, 0, 0) }, {
                easing: 'quadOut'
            })
            .call(
                () => {
                    this._isTweeningHide = false;
                    this._isArrowVisible = false;
                    this.arrow.active =false;
                    //console.log("stopScaleTween",this.arrow.scale);
                }
            )
            .start();
    }

    /** 更新目标位置 */
    private updateTargetVec(pos:Vec3){
        if(pos&&this._targetVec&&Vec3.equals(pos,this._targetVec)){
            return;
        }
        this._targetVec = pos;
        if(this._isArrowVisible){
            this.stopScaleTween();
        }
    }


}


