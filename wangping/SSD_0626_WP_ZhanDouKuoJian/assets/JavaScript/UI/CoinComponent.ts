import { _decorator, Camera, Color, color, Component, instantiate, Label, Node, Quat, Tween, tween,  Vec3, } from 'cc';
import { EventManager } from '../core/EventManager';
import { EventType } from '../core/EventType';
import { GlobeVariable } from '../core/GlobeVariable';

const { ccclass, property } = _decorator;

@ccclass('CoinComponent')
export class CoinComponent extends Component {

    @property(Label)
    coinNum: Label = null;

    @property(Node)
    breathNode: Node = null;

    private _coinNum:number = 0;



    private _breathTween: Tween<Node> | null = null;

    start() {
        this._coinNum =GlobeVariable.coinStartNum;
        this.updateCoinNum();
    }

    protected onEnable(): void {
        EventManager.instance.on(EventType.CoinAdd, this.coinAdd, this);
        EventManager.instance.on(EventType.CoinSub, this.coinSub, this);
    }

    protected onDisable(): void {
        EventManager.instance.off(EventType.CoinAdd, this.coinAdd, this);
        EventManager.instance.off(EventType.CoinSub, this.coinSub, this);
    }

    private coinAdd(num:number) {
        this._coinNum += num;
        this.updateCoinNum();
        this.playBreathAni(true);
    }

    private coinSub(num:number) {
        this._coinNum -= num;
        this.updateCoinNum();
        this.playBreathAni(false);
    }

    private updateCoinNum() {

        this.coinNum.string = String(Math.max(0, this._coinNum));
    }

    // 公用呼吸动画方法（防叠加）
    private playBreathAni(isAdd:boolean) {
        if (this._breathTween) {
            this._breathTween.stop(); // 停止之前的动画
        }
        if(isAdd){
            this.coinNum.color = new Color().fromHEX('#00ff00');
        }else{
            this.coinNum.color = new Color().fromHEX('#ff0000');
        }
        const tweenAni = tween(this.breathNode)
            .to(0.08, { scale: new Vec3(1.1, 1.1, 1.1) }, { easing: 'quadOut' })
            .to(0.08, { scale: new Vec3(1, 1, 1) }, { easing: 'quadIn' })
            .call(()=>{
                this.coinNum.color = new Color().fromHEX('#FFFFFF');
            })
            .start();

        this._breathTween = tweenAni;
    }

}


