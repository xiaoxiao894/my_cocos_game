import { _decorator, Component, Animation, Node, Sprite, tween, UIOpacity } from 'cc';
import { App } from './App';
import { GlobeVariable } from './GlobeVariable';
const { ccclass, property } = _decorator;

@ccclass('EffectNode')
export class EffectNode extends Component {

    @property(Animation)
    bombEffect: Animation = null;

    @property(Sprite)
    bombSprite: Sprite = null;

    private spriteFrameName: string = null;
    setSpriteFrameName(frameName: string) {
        this.spriteFrameName = frameName;
    }
    loadAsset = async (path: string) => {
        let spF = await App.resManager.loadSpriteFrame(path)
        this.bombSprite.spriteFrame = spF
        this.bombSprite.node.active = true;
    }
    showImage() {
        console.log(this.spriteFrameName);
      //  this.loadAsset("iconsEffect/" + this.spriteFrameName);
      this.bombSprite.spriteFrame = App.mahjongAtlasEffect.getSpriteFrame(this.spriteFrameName);
      this.bombSprite.node.active = true;
        let opacity = this.bombSprite.getComponent(UIOpacity);
        tween(opacity)
            .to(1, { opacity: 0 })
            .call(() => {
                this.bombSprite.getComponent(UIOpacity).opacity = 255;
            })
            .start();
    }
    playEffect() {
        this.bombEffect.play("animation");
        this.bombEffect.once(Animation.EventType.FINISHED, () => {
          
            this.bombSprite.node.active = false;
            
            this.node.removeFromParent();
            App.poolManager.returnNode(this.node, GlobeVariable.prefabPoolName.mahjongEffect);
        })
    }
    start() {

    }

    update(deltaTime: number) {

    }
}


