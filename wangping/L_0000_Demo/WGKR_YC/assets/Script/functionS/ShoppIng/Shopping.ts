import { _decorator, CCBoolean, CCFloat, CCInteger, color, Color, Component, Label, Node, Sprite, tween, Vec3 } from "cc";
import ShoppIngEvent from "./ShoppIngEvent";
import TweenTool from "../../Tool/TweenTool";
import { PropEnum } from "../../Base/EnumIndex";
const { ccclass, property } = _decorator;
@ccclass('Shopping')
export default class Shopping extends Component {

    @property(Label)
    public gold_lable: Label;
    private gold_lable_shake: boolean = false;
    @property(Sprite)
    public progress: Sprite;

    @property({ type: PropEnum })
    public propId: PropEnum = PropEnum.gold;

    @property(CCInteger)
    public loopCount: number = -1;//-1表示永不关店
    @property(CCBoolean)
    public goldMod: boolean = false;
    @property({
        type: CCInteger, visible(this: Shopping) {
            return !this.goldMod;
        }
    })
    public gold: number = 20;
    @property({
        type: CCInteger, visible(this: Shopping) {
            return this.goldMod;
        }
    })
    public goldArr: number[] = [];
    private _gold: number;
    private _preGold: number;
    /**
     * false jumpTimeInterval 表示间隔时间
     * true jumpTimeInterval 表示完成一次所用的时间
     */
    @property(CCBoolean)
    public totaldurationSwitch: boolean = false;
    @property(CCFloat)
    public jumpTimeInterval: number = 0.05;
    private _jumpTimeInterval: number = 0;




    // @property(CCFloat)
    // public disTrigger: number = 128;

    @property(ShoppIngEvent)
    public shoppingEvent: ShoppIngEvent;

    protected onLoad(): void {
        this.init();
        this.initJumpTime();
    }

    public init() {
        if (this.goldMod) {
            if (this.goldArr.length) {
                const gold = this.goldArr.splice(0, 1)[0];
                this.gold = gold;
            }
        }
        this._gold = this.gold;
        this._preGold = this.gold;
        this.gold_lable.string = this._gold.toString();
        if (this.progress) {
            this.progress.fillRange = 0;
        }
    }

    public get isUse() {
        const isUse = this._preGold > 0 && this.loopCount != 0 && this._jumpTimeInterval <= 0;
        if (this.shoppingEvent) {
            return isUse && this.shoppingEvent.isUse();
        }
        return isUse;
    }

    protected update(dt: number): void {
        this._jumpTimeInterval -= dt;
        if (this.progress) {

            let proportion = 1 - this._gold / this.gold;
            if (proportion != this.progress.fillRange) {
                let off = proportion - this.progress.fillRange;
                if (off <= 0.005) {
                    this.progress.fillRange = proportion
                } else {
                    this.progress.fillRange += off * dt * 5;
                }
            }
        }
    }
    /**实际到账 */

    public moneyAccount(money: number) {
        this._gold -= money;
        this._gold = Math.max(0, this._gold);
        this.gold_lable.string = this._gold.toString();
        if (!this.gold_lable_shake) {
            this.gold_lable_shake = true;
            TweenTool.scaleShake(this.gold_lable.node).call(() => {
                this.gold_lable_shake = false;
            }).start();
        }
        if (this._gold == 0) {
            this.shoppingEvent && this.shoppingEvent.shoppEvent();
            if (this.loopCount != -1) {
                this.loopCount--;
                if (!this.loopCount) {
                    TweenTool.scaleShake(this.node, 0.2).call(() => {
                        this.node.active = false;
                    }).start();;
                }
            }
            if (this.loopCount) {
                TweenTool.scaleShake(this.node).call(() => {
                    this.init();
                    this.shoppingEvent && this.shoppingEvent.init();
                }).start();;
            }
            return true;
        }
        return false;
    }
    /**预付款 */
    public moneyPay(money: number) {
        this.initJumpTime();
        this._preGold -= money;
    }




    private initJumpTime() {
        if (this.totaldurationSwitch) {
            this._jumpTimeInterval = this.jumpTimeInterval / this.gold;
        } else {
            this._jumpTimeInterval = this.jumpTimeInterval;
        }
        console.log(this._jumpTimeInterval);
    }

    public get curGold() {
        return this._gold;
    }


}