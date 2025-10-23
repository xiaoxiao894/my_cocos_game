import { _decorator, CCFloat, Component, Node, tween, v3, Vec3 } from 'cc';
import { EventManager } from '../Global/EventManager';
import { EventName } from '../Common/Enum';
const { ccclass, property } = _decorator;

@ccclass('FourArrow')
export class FourArrow extends Component {
    
    private readonly _heightOffset: number = 4;
    private _selfEulerY: number = 0;
    private readonly _rotateSpeed: number = 140;

    private _isTweeningShow: boolean = false;
    private _isTweeningHide: boolean = false;
    private _isArrowVisible: boolean = false;

    private _showIndex:number = 0;

    @property(Node)
    arrow:Node[] = [];


    start() {
        this.arrow.forEach(element => {
            element.active = false;
        });
    }

    protected onEnable(): void {
        EventManager.inst.on(EventName.BlockFallAniPlay, this.showArrows, this);
    }

    protected onDisable(): void {
        EventManager.inst.off(EventName.BlockFallAniPlay, this.showArrows, this);
    }

    update(dt: number) {
        const time = Date.now();
        const speed = 0.05;
        const amplitude = 0.5;
        const floatY = Math.sin(time*0.1 * speed) * amplitude;

        this.arrow.forEach(element => {
            let pos:Vec3 = element.getWorldPosition().clone();
            element.setWorldPosition(new Vec3(
                pos.x,
                this._heightOffset + floatY,
                pos.z
            ));
        });
        this._selfEulerY += this._rotateSpeed * dt;
        this._selfEulerY %= 360;
        this.arrow.forEach(element => {
            element.setRotationFromEuler(0, this._selfEulerY, 0);
        });

    }

    playScaleTween() {
        let index = this._showIndex;
        if (this._isTweeningShow||this._isTweeningHide) return;
        this.arrow[index].active = true;
        this._isTweeningShow = true;
        this._isArrowVisible = true;
        this.arrow[index].setScale(v3(0.1, 0.1, 0.1));
        tween(this.arrow[index])
            .to(0.25, { scale: v3(3.2, 3.2, 3.2) }, { easing: 'quadOut' })
            .to(0.15, { scale: v3(3, 3, 3) }, { easing: 'quadIn' })
            .call(() => {
                this._isTweeningShow = false;
                console.log("playScaleTween",this.arrow[index].scale);
            })
            .start();
        this._showIndex++;
        if(this._showIndex>=4){
            this.unschedule(this.playScaleTween);
        }
    }

    // stopScaleTween() {
    //     if (this._isTweeningShow || this._isTweeningHide) return;

    //     this._isTweeningHide = true;

    //     tween(this.arrow)
    //         .to(0.25, { scale: v3(0, 0, 0) }, {
    //             easing: 'quadOut'
    //         })
    //         .call(
    //             () => {
    //                 this._isTweeningHide = false;
    //                 this._isArrowVisible = false;
    //                 this.arrow.active =false;
    //                 console.log("stopScaleTween",this.arrow.scale);
    //             }
    //         )
    //         .start();
    // }

    private showArrows(){
        this.scheduleOnce(()=>{
            this.schedule(this.playScaleTween,0.067);
        },0.57);
    }

}


