import { _decorator, Component, Node } from 'cc';
import { enemyCharacter } from './entitys/enemyCharacter';
const { ccclass, property } = _decorator;

@ccclass('NewComponent')
export class NewComponent extends Component {
    @property(enemyCharacter)
    private enemyCharacterTs: enemyCharacter = null;
    attackEvent(){
        if(this.enemyCharacterTs){
            this.enemyCharacterTs.attackEventCallBack();
        }
        console.log("丧尸的帧事件")
    }
    attackHitEvent(){
        if(this.enemyCharacterTs){
            this.enemyCharacterTs.attacHitkEventCallBack();
        }
    }
}


