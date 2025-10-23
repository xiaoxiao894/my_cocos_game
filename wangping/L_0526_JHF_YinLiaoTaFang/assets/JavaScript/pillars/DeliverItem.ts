import { _decorator, Component, Label,Sprite } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('DeliverItem')
export class DeliverItem extends Component {

    @property(Sprite)
    deliverRange:Sprite = null;
    @property(Label)
    num:Label = null;

    @property(Sprite)
    checkSprite:Sprite = null;



    private _needNum:number = 0;
    private _nowNum:number = 0;

    public init(needNum:number){
        this._needNum = needNum;
        this.num.string = `${this._nowNum}/${this._needNum}`;
        this.deliverRange.fillRange = this._nowNum/this._needNum;
        this.checkSprite.grayscale=true;
    }

    public addItem(){
        this._nowNum++;
        this.num.string = `${this._nowNum}/${this._needNum}`;
        this.deliverRange.fillRange = this._nowNum/this._needNum;
        if(this._nowNum == this._needNum){
            this.checkSprite.grayscale = false;
        }
    }

    update(deltaTime: number) {
        
    }
}


