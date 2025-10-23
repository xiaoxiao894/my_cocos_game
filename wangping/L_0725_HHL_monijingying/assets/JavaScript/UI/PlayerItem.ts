import { _decorator,  Color,  Component, Label, Node, Quat, Tween, tween,  Vec3, } from 'cc';

const { ccclass, property } = _decorator;

@ccclass('PlayerItem')
export class PlayerItem extends Component {

    @property(Label)
    num: Label = null;

    @property(Node)
    breathNode: Node = null;

    private _num:number = 0;


    private _breathTween: Tween<Node> | null = null;

    public init(num) {
        this._num = num;
        this.updateCoinNum();
    }

    public add(num:number) {
        this._num += num;
        this.updateCoinNum();
        this.playChangeAni(true);
    }

    public sub(num:number) {
        this._num -= num;
        this.updateCoinNum();
        this.playChangeAni(false);
    }

    private updateCoinNum() {

        this.num.string = String(Math.max(0, this._num));
    }

    // 播数字变化动画动画
    private playChangeAni(isAdd:boolean) {
        if (this._breathTween) {
            this._breathTween.stop(); // 停止之前的动画
        }
        if(isAdd){
            this.num.color = new Color().fromHEX('#00ff00');
        }else{
            this.num.color = new Color().fromHEX('#ff0000');
        }
        const tweenAni = tween(this.breathNode)
            .to(0.08, { scale: new Vec3(1.1, 1.1, 1.1) }, { easing: 'quadOut' })
            .to(0.08, { scale: new Vec3(1, 1, 1) }, { easing: 'quadIn' })
            .call(()=>{
                this.num.color = new Color().fromHEX('#FFFFFF');
            })
            .start();

        this._breathTween = tweenAni;
    }

}


