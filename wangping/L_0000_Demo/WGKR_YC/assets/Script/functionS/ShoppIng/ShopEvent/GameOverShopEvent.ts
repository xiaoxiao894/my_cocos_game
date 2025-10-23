import { _decorator, Component, Node, tween } from 'cc';
import ShoppIngEvent from '../ShoppIngEvent';
import { GameOverPanel } from '../../GameOver/GameOverPanel';
import { EffectManager } from '../../Effect/EffectManager';
import { EffectEnum } from '../../../Base/EnumIndex';
import AudioManager, { SoundEnum } from '../../../Base/AudioManager';
const { ccclass, property } = _decorator;

@ccclass('GameOverShopEvent')
export class GameOverShopEvent extends ShoppIngEvent {

    @property(Node)
    public closeNode: Node;
    @property(Node)
    public openNode: Node;


    public shoppEvent(): void {
        tween(this.closeNode).to(0.1, { y: -3 }).call(() => {
            this.closeNode.active = false;
            this.openNode.active = true;
            tween(this.openNode).to(0.1, { y: 0 }).delay(0.3).call(() => {
                GameOverPanel.instance.show(true);
            }).start();
        }).start();
        EffectManager.instance.addShowEffect(this.node.worldPosition, EffectEnum.shopOver, 2);
        AudioManager.inst.playOneShot(SoundEnum.Sound_up);
    }
    public init(): void {
    }
    public isUse(): boolean {
        return true;
    }

}


