import { _decorator, CCInteger, Component, Label, Node } from 'cc';
import ShoppIngEvent from '../ShoppIngEvent';
import { WarriorAIManager } from '../../WarriorAI/WarriorAIManager';
import LayerManager, { LayerEnum } from '../../../Base/LayerManager';
import TweenTool from '../../../Tool/TweenTool';
import { EffectEnum } from '../../../Base/EnumIndex';
import { EffectManager } from '../../Effect/EffectManager';
import { MonsterCreate } from '../../Monster/MonsterCreate';
const { ccclass, property } = _decorator;

@ccclass('WarrIorShopEvent')
export class WarrIorShopEvent extends ShoppIngEvent {

    @property(MonsterCreate)
    public monsterC: MonsterCreate;

    @property(Node)
    public lockNode: Node;

    public isUse(): boolean {
        return WarriorAIManager.instance.AICount < this.maxCount;
    }
    @property(CCInteger)
    public maxCount: number = 5;

    @property(Label)
    public lab: Label;

    protected start(): void {
        this.lab.string = "0/" + this.maxCount;
    }

    protected update(dt: number): void {
        this.lab.string = WarriorAIManager.instance.AICount + "/" + this.maxCount;
    }

    private count = 0;
    public shoppEvent(): void {
        if (!this.count) {
            this.count++;
            this.lockNode.active = true;
            TweenTool.scaleShake(this.lockNode);
            this.monsterC.maxCount += 3;
        }
        EffectManager.instance.addShowEffect(this.node.worldPosition, EffectEnum.shopOver, 2);
        const monster = WarriorAIManager.instance.createAI;
        const layer = LayerManager.instance.getLayer(LayerEnum.Layer_1_Ground);
        layer.addChild(monster.node);
        monster.node.setWorldPosition(this.node.worldPosition);
    }
    public init(): void {

    }
}


