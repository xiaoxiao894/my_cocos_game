import { _decorator, CCFloat, Component, Node, Sprite, Tween, tween, UIOpacity, Vec3 } from 'cc';
import super_html_playable from '../Common/super_html_playable';
import { SoundManager } from '../Globel/SoundManager';
import GameUtils from '../Utils/GameUtils';
const { ccclass, property } = _decorator;

@ccclass('GameEndManager')
export class GameEndManager extends Component {

    @property(Node)
    hand: Node = null;

    @property(Node)
    sourceTitleNode: Node = null;

    @property(Node)
    gunNode:Node = null;

    @property(UIOpacity)
    fire:UIOpacity = null;

    @property(Node)
    gunStartPosNode:Node = null;

    @property(Node)
    btnNode:Node = null;

    @property({type:CCFloat,tooltip:"横屏按钮缩放值"})
    landBtnScale:number = 1.2;

    @property({type:CCFloat,tooltip:"竖屏按钮缩放值"})
    verticalBtnScale:number = 1.2;

    private _startScale:number = 0;

    start() {
        this.init();
    }

    init() {
        //标题
        let titleScale = this.sourceTitleNode.getScale();
        titleScale.x = 0;
        this.sourceTitleNode.setScale(titleScale);
        const sourceTitleOpacity = this.sourceTitleNode.getComponent(UIOpacity);
        sourceTitleOpacity.opacity = 255;
        tween(this.sourceTitleNode)
            .to(0.2, { scale: new Vec3(titleScale.y*1.1, titleScale.y*1.1, 1) })
            .to(0.06, { scale: new Vec3(titleScale.y, titleScale.y, 1) })
            .start();
        
        //枪 
        let gunEndPos = this.gunNode.getPosition().clone();
        this.gunNode.setPosition(this.gunStartPosNode.getPosition());
        const gunNodeOpacity = this.gunNode.getComponent(UIOpacity)
        gunNodeOpacity.opacity = 0;
        this.scheduleOnce(()=>{
            tween(this.gunNode)
            .to(0.3, { position: gunEndPos.clone() })
            .call(()=>{
                let tweenTime = 0.8;
                let repeatTween = tween(this.gunNode)
                .by(tweenTime, { position: new Vec3(0, 15, 0) })
                .by(tweenTime, { position: new Vec3(0, -15, 0) });
                tween(this.gunNode).repeatForever(repeatTween).start();

                //火焰
                let startScale:Vec3 = this.fire.node.getScale();
                const fireScaleTween = tween(this.fire.node)
                .to(tweenTime,{scale:new Vec3(startScale.x*0.8,startScale.y*0.8,startScale.z)})
                .to(tweenTime,{scale:new Vec3(startScale.x,startScale.y,startScale.z)})
                tween(this.fire.node).repeatForever(fireScaleTween).start();

                const fireTween =  tween(this.fire).to(tweenTime,{opacity:200})
                .to(tweenTime,{opacity:255})
                tween(this.fire).repeatForever(fireTween).start();
            })
            .start();
            tween(gunNodeOpacity)
                .to(0.3, { opacity: 255 })
                .start();
        },0.2);
        

        //按钮
        let btnScale = this.btnNode.getScale();
        btnScale.x = 0;
        this._startScale = GameUtils.isLandscape() ? this.landBtnScale : this.verticalBtnScale;
        this.btnNode.setScale(btnScale);
        this.scheduleOnce(()=>{
            tween(this.btnNode)
            .to(0.25, { scale: new Vec3(this._startScale, this._startScale, 1) })
            .call(() => {
                this.buttonBreathingAni(this.btnNode);
                //this.playFingerAndButtonAnim();
            })
            .start();
        },0.4);

        this.hand.active = false;
        
        //音效
        SoundManager.inst.playAudio("YX_win");
    }

    // 按钮呼吸动画
    buttonBreathingAni(buttonNode) {
        this._startScale = GameUtils.isLandscape() ? this.landBtnScale : this.verticalBtnScale;
        const duration = 1;
        const minScale = this._startScale; // 最小缩放比例
        const maxScale = this._startScale * 1.1; // 最大缩放比例

        tween(buttonNode)
            .to(duration, { scale: new Vec3(minScale, minScale, minScale) }, { easing: 'sineInOut' })
            .to(duration, { scale: new Vec3(maxScale, maxScale, maxScale) }, { easing: 'sineInOut' })
            .call(() => {
                this.buttonBreathingAni(buttonNode);
            })
            .start();
    }

    // 手指+按钮循环提示动画
    playFingerAndButtonAnim() {
        this.hand.active = true;
        tween(this.hand)
            .repeatForever(
                tween()
                    .to(1, { scale: new Vec3(0.9, 0.9,0.9) })
                    .to(1, { scale: new Vec3(1, 1, 1) })
            )
            .start();
    }

    platformBtnEvent(){
        console.log("点击下载");
        super_html_playable.download();
    }

}


