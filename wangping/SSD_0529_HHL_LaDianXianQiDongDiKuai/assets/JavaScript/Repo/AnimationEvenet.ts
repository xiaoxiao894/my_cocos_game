import { _decorator, Component,Animation, Node } from 'cc';
import { DataManager } from '../Global/DataManager';
const { ccclass, property } = _decorator;

@ccclass('AnimationEvenet')
export class AnimationEvenet extends Component {
    @property(Node)
    effect: Node = null;

     @property(Node)
     effect1: Node = null;

    fadeParticle() {
        DataManager.Instance.soundManager.playPalingSound()
        this.effect1.active = false;
        
    }
    showParticle(){
        this.effect.active = true;
        this.effect.getComponent(Animation).play();
    }

}


