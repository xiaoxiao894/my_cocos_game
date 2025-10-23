import { _decorator, Animation, Component, Node, tween, UIOpacity } from 'cc';
import { BattleTarget } from '../Battle/BattleTarger/BattleTarget';
import { GameOverPanel } from '../GameOver/GameOverPanel';
import { CameraMove } from '../../Base/CameraMove';
const { ccclass, property } = _decorator;

@ccclass('HeroBattleTarget')
export class HeroBattleTarget extends BattleTarget {
    @property(UIOpacity)
    public opa: UIOpacity;
    @property(Animation)
    public shake_red: Animation;

    private shakeIn: boolean = false;

    protected damage(power: number): void {
        if (!this.shakeIn && power > 0) {
            CameraMove.instance.Shake2();
            this.shake_red.play();
            this.shakeIn = true;
            tween(this.opa).to(0.3, { opacity: 255 }).delay(0.1).to(0.2, { opacity: 0 }).call(() => {
                this.shakeIn = false;
            }).start();
        }
    }
    protected die(): void {
        GameOverPanel.instance.show(false);

    }

    protected update(dt: number): void {
        this.Hit(-100 * dt);
    }
}


