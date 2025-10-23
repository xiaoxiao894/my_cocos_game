import { _decorator, Animation, AnimationState, Color, Component, Label, Node, tween, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('BubbleItem')
export class BubbleItem extends Component {
    @property(Node)
    coinIconNode: Node = null;

    @property(Label)
    numberLabel: Label = null;

    @property(Label)
    numberLabel1: Label = null;

    @property(Node)
    green:Node = null;

    @property(Animation)
    ani:Animation = null;

    private _aniState: AnimationState = null; // ✅ 添加：记录当前动画状态
    private _originalScale: Vec3 = null; // ✅ 添加：记录原始 scale

    private _speedUpTime: number = 0; 
    private _speedTimeLimet: number = 0.1;


    start() {
        this._originalScale = this.coinIconNode.scale.clone();
        this.numberLabel.string = "0";
        this.numberLabel1.string = "0";
        this.numberLabel.node.active = true;
        this.numberLabel1.node.active = false;
        this.green.active = false;
        this._aniState = this.ani.getState("qipaoidleA");
    }

     stopBreathingAnimation() {

        // ✅ 停止时强制还原原始缩放
        this.coinIconNode.setScale(this._originalScale);
    }

    public playScaleOnce() {
        this.stopBreathingAnimation();

        const largerScale = new Vec3(
            this._originalScale.x * 1.1,
            this._originalScale.y * 1.1,
            this._originalScale.z * 1.1
        );

        this.increaseQuantity();

        tween(this.coinIconNode)
            .to(0.1, { scale: largerScale }, { easing: 'quadOut' })
            .to(0.1, { scale: this._originalScale }, { easing: 'quadIn' })
            .call(() => {
            })
            .start();

        
        if(this._aniState){
            this._aniState.speed = 1;
            this._speedUpTime = 0;
        }
    }

    protected update(dt: number): void {
        if(this._speedUpTime>this._speedTimeLimet){
            if(this._aniState){
                this._aniState.speed = 0.5;
            }
        }
        this._speedUpTime += dt;
    }

    // 气泡增加数量
    private increaseQuantity() {
        if (this.numberLabel1) {
            const number = Number(this.numberLabel1.string);
            this.numberLabel1.string = `${number + 1}`;

            this.numberLabel.node.active = false;
            this.numberLabel1.node.active = true;
            this.green.active = true;

        }
    }

    // 气泡减少数量
    public reduceNumber() {
        if (this.numberLabel1) {
            const number = Number(this.numberLabel1.string);
            const numString = Math.max(number - 1, 0)
            this.numberLabel1.string = `${numString}`;

            if (numString == 0) {
                this.numberLabel.node.active = true;
                this.numberLabel1.node.active = false;
                this.green.active = false;
            }
        }
    }
}


