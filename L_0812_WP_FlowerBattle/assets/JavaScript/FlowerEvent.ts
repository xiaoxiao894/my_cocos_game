import { _decorator, Component, Node } from 'cc';
import { Flower } from './Entitys/Flower';
import { SoundManager } from './core/SoundManager';
const { ccclass, property } = _decorator;

@ccclass('FlowerEvent')
export class FlowerEvent extends Component {
    @property(Flower)
    birthAnnaNode: Flower = null;

    flowerKaiHuaEvent() {
        SoundManager.Instance.playAudio("huoduokai");
        console.log('flowerKaiHuaEvent');
    }   

}


