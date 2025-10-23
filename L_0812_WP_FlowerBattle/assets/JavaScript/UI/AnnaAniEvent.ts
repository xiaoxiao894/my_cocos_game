import { _decorator, Component, Node } from 'cc';
import { SoundManager } from '../core/SoundManager';
const { ccclass, property } = _decorator;

@ccclass('AnnaAniEvent')
export class AnnaAniEvent extends Component {
    start() {

    }

    jumpSoundEvent() {
        SoundManager.Instance.playAudio("tiaoyue");
    }
    jumpSoundEvent1() {
        SoundManager.Instance.playAudio("tiaoyueluodi");
    }
    update(deltaTime: number) {
        
    }
}


