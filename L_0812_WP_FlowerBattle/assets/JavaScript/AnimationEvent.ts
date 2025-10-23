import { _decorator, Component, Node } from 'cc';
import { PlayerPylon } from './Entitys/PlayerPylon';
import { PlayerTurret } from './Entitys/PlayerTurret';
const { ccclass, property } = _decorator;

@ccclass('AnimationEvent')
export class AnimationEvent extends Component {

    @property({type:Node})
    target: Node = null;

    @property({type:Number})
    targetType: number = 1; // 1-火柴盒 2-炮塔

    AttackAni(){
        if(this.targetType == 1){
            this.target.getComponent(PlayerPylon).AttackAni();
        }

        if(this.targetType == 2){
            this.target.getComponent(PlayerTurret).AttackAni();
        }
    }
    restFireEvent(){
        if(this.targetType == 1){
            this.target.getComponent(PlayerPylon).restFireEvent();
        }
    }

    start() {

    }

    update(deltaTime: number) {
        
    }
}


