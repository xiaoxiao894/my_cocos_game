import { _decorator, Component, Node } from 'cc';
import { EffectNode } from './EffectNode';
const { ccclass, property } = _decorator;

@ccclass('BombAniEvent')
export class BombAniEvent extends Component {

    @property(EffectNode)
    bombImage: EffectNode = null;
    showImage() {
        this.bombImage.showImage();
    }
}


