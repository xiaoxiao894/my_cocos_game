import { _decorator,  Label, Sprite, } from 'cc';
import { ColorArea } from '../ColorArea';
const { ccclass, property } = _decorator;

@ccclass('TurretArea')
export class TurretArea extends ColorArea {

    @property(Sprite)
    green:Sprite = null;

    @property({displayName:"需要数量"})
    needNum:number = 10;

    // @property({displayName:"类型",tooltip:"1-解锁 2-升级"})
    // type:number = 1;

    @property(Label)
    numLabel:Label = null;

    private _leftNeedNum:number = 0;

    protected start(): void {
        this._leftNeedNum = this.needNum;
        this.numLabel.string = this._leftNeedNum.toString();
        this.green.fillRange = 0;
    }

    /** 交付金币，返回是否解锁 */
    public deliverCoin():boolean{
        this._leftNeedNum--;
        this.green.fillRange = (this.needNum-this._leftNeedNum) / this.needNum;
        this.numLabel.string = String(Math.max(0,this._leftNeedNum));
        if(this._leftNeedNum <= 0){
            this.node.active = false;
            return true;
        }
        return false;
    }

    public get leftNeedNum():number{
        return this._leftNeedNum;
    }
}


