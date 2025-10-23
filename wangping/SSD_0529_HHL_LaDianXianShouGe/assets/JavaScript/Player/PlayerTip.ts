import { _decorator, Color, Component, Label, Node, tween, UIOpacity, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('PlayerTip')
export class PlayerTip extends Component {

    @property(Node)
    aniNode:Node = null;

    @property(Node)
    redNode:Node = null;

    @property(Label)
    lenLabel:Label = null;

    private _num:number = 0;

    start() {
        this.aniNode.active = false;
    }

    public setNum(num:number) {
        this._num = num;
        this.lenLabel.string = Math.max(num,0).toString();
        if (num <= 0) {
            this.redNode.active = true;
        } else {
            this.redNode.active = false;
        }
        let color:string = num <= 5? '#ff0000' : '#000000';
        this.lenLabel.color = new Color().fromHEX(color);
    }

    public showTip(){
        this.aniNode.active = true;
        this.aniNode.scale = new Vec3(0, 0, 0);
        this.aniNode.getComponent(UIOpacity).opacity = 255;
        tween(this.aniNode)
        .to(0.25, { scale:new Vec3(1.1, 1.1, 1.1) }, { easing: 'quadOut' })
        .to(0.15, { scale: new Vec3(1, 1, 1) }, { easing: 'quadIn' })
        .start();
            
    }

    public hideTip(){
        tween(this.aniNode.getComponent(UIOpacity)).to(0.5,{opacity:0}).call(()=>{
            this.aniNode.active = false;
        }).start();
    }


    update(deltaTime: number) {
        
    }
}


