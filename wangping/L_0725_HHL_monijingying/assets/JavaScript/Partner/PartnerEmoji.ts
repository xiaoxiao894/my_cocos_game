import { _decorator, Component,Sprite, SpriteFrame, tween, UIOpacity } from 'cc';
import GameUtils from '../Util/GameUtils';
const { ccclass, property } = _decorator;

@ccclass('PartnerEmoji')
export class PartnerEmoji extends Component {

    @property(Sprite)
    emoji:Sprite = null;
    @property({type:SpriteFrame,tooltip:"饥饿 开心 惊讶  愤怒 欢呼"})
    emjFrames:SpriteFrame[]=[];

    public showEmj(index:number){
        if(this.emjFrames[index]){
            this.emoji.spriteFrame = this.emjFrames[index];
            this.node.active = true;
            this.node.getComponent(UIOpacity).opacity = 255;
            GameUtils.showNodeAni(this.node);
            if(index === 2){
                this.surpriseEffect();
            }else{
                this.scheduleOnce(this.hideEmj,2.5);
            }
            
        }
    }

    /** 惊讶特殊效果 */
    private surpriseEffect(){
        this.scheduleOnce(()=>{
            tween(this.node.getComponent(UIOpacity))
            .to(0.1,{opacity:0})
            .delay(0.2)
            .to(0.1,{opacity:255})
            .delay(0.3)
            .to(0.1,{opacity:0})
            .start();
        },0.7);
    }

    /**隐藏表情 */
    private hideEmj(){
        this.node.active = false;
    }

}


