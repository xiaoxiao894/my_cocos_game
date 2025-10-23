import { _decorator, Component, Node } from 'cc';
import { Flower } from './Entitys/Flower';
import { GlobeVariable } from './core/GlobeVariable';
const { ccclass, property } = _decorator;

@ccclass('jumpEvent')
export class jumpEvent extends Component {
    @property(Flower)
    birthAnnaNode: Flower = null;

    qiehuanEvent() {
        if(this.birthAnnaNode) {
            if(!GlobeVariable.isIdel) {
                GlobeVariable.isIdel = true;
                this.birthAnnaNode.IdleEvent();
            }
        }

        console.log('jumpEvent');
    }

}


