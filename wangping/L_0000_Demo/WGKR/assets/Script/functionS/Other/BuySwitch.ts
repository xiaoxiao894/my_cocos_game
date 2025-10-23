import { _decorator, Collider, Color, Component, ITriggerEvent, Node, Sprite } from 'cc';
import ColliderTag, { COLLIDE_TYPE } from '../Battle/CollectBattleTarger/ColliderTag';
import ShoppIngEvent from '../ShoppIng/ShoppIngEvent';
import TweenTool from '../../Tool/TweenTool';
import { EffectEnum } from '../../Base/EnumIndex';
import { EffectManager } from '../Effect/EffectManager';
const { ccclass, property } = _decorator;

@ccclass('BuySwitch')
export class BuySwitch extends ShoppIngEvent {
    public shoppEvent(): void {
        this.ai.active = true;
        TweenTool.scaleShake(this.ai);
        EffectManager.instance.addShowEffect(this.ai.worldPosition, EffectEnum.shopOver, 2);
    }
    public init(): void {
    }
    public isUse(): boolean {
        return true;
    }


    private collider: Collider;
    @property(Sprite)
    public sp: Sprite;
    @property(Node)
    public ai: Node;

    private count = 0;

    // private _isHero: boolean = false;
    // private _isLock: boolean = false;

    public get isShop() {
        return this.count > 0;
    }

    start() {
        this.collider = this.getComponent(Collider);
        this.collider.on("onTriggerEnter", this.onTriggerEnter, this);
        this.collider.on("onTriggerExit", this.onTriggerExit, this);
        this.ai.active = false;
    }

    private onTriggerEnter(event: ITriggerEvent) {
        const tag = event.otherCollider.getComponent(ColliderTag);
        if (tag && tag.tag == COLLIDE_TYPE.HERO) {
            this.sp.color = Color.GREEN;
            this.count++;
            // this._isHero = true;
        }
    }

    private onTriggerExit(event: ITriggerEvent) {
        const tag = event.otherCollider.getComponent(ColliderTag);
        if (tag && tag.tag == COLLIDE_TYPE.HERO) {
            this.count--;
            if (!this.count) {
                this.sp.color = Color.WHITE;
            }
            // this._isHero = false;
        }
    }

    update(deltaTime: number) {

    }
}


