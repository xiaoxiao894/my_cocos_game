import { _decorator, Component, Node, tween, v3, Vec3 } from 'cc';
import ShoppIngEvent from '../ShoppIngEvent';
import { HeroManager } from '../../Hero/HeroManager';
import TweenTool from '../../../Tool/TweenTool';
import { EffectManager } from '../../Effect/EffectManager';
import { AttackLevel, EffectEnum } from '../../../Base/EnumIndex';
import { JumppManager } from '../../Jump/JumpManager';
import { MonsterCreate } from '../../Monster/MonsterCreate';
import { GameOverPanel } from '../../GameOver/GameOverPanel';
import Shopping from '../Shopping';
const { ccclass, property } = _decorator;

@ccclass('PlayerLevelUpShopEvent')
export class PlayerLevelUpShopEvent extends ShoppIngEvent {

    @property(HeroManager)
    public hm: HeroManager;
    @property(Node)
    public lockNode: Node;

    @property(Node)
    public iconList: Node[] = [];

    @property(Node)
    public armsList: Node[] = [];

    @property(MonsterCreate)
    public monster: MonsterCreate;

    private _upIn: boolean = false;

    private count = 0;
    public shoppEvent(): void {
        this.count++;
        this._upIn = true;

        for (let i = 0; i < this.iconList.length; i++) {
            const icon = this.iconList[i];
            icon.active = i == this.count;
        }
        if (this.count == 2) {
            this.lockNode.active = true;
            TweenTool.scaleShake(this.lockNode);
        } else if (this.count == 3) {
            GameOverPanel.instance.show(true);
            return;
        }
        const armsNode = this.armsList[this.count - 1];
        armsNode.active = true;
        armsNode.setScale(Vec3.ZERO);
        armsNode.setWorldPosition(this.node.worldPosition);
        tween(armsNode).to(0.5, { y: 5, scale: v3(1.5, 1.5, 1.5) }, { easing: "backOut" }).call(() => {
            const end = this.hm.node.worldPosition.clone();
            JumppManager.instacne.jumpCurve(armsNode, end, 3.5, 3).onComplete(() => {
                this.hm.uptrigger(this.hm.curLevel + 1);
                if (this.hm.curLevel == AttackLevel.bigKnife) {
                    this.monster.maxTime = 0.7;
                }
                this.hm.openFire(this.hm.fireOff);
                EffectManager.instance.addShowEffect(this.hm.node.worldPosition, EffectEnum.shopOver, 2);
                armsNode.active = false;
                this._upIn = false;
                this.monster.maxCount += 5;
            }).setEndPosPre((node: Node) => {
                const end2 = end;
                const curPos = v3(this.hm.node.worldPosition);
                curPos.subtract(end2);
                curPos.add(node.worldPosition);
                node.setWorldPosition(curPos);
            }, this);
        }).start();
    }
    public init(): void {

    }
    public isUse(): boolean {
        return !this._upIn;
    }
    start() {

    }

    update(deltaTime: number) {

    }
}


