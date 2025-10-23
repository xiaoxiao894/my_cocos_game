import { _decorator, Component, Node, TERRAIN_HEIGHT_BASE, tween, v3, Vec3 } from 'cc';
import ShoppIngEvent from '../ShoppIng/ShoppIngEvent';
import PoolManager, { PoolEnum } from '../../Base/PoolManager';
import { BuyAI } from './BuyAI';
import { PrefabsEnum, PrefabsManager } from '../../Base/PrefabsManager';
import Shopping from '../ShoppIng/Shopping';
import { BagBase } from '../Bag/Base/BagBase';
import LayerManager, { LayerEnum } from '../../Base/LayerManager';
import { Prop } from '../Bag/Prop';
import { JumppManager } from '../Jump/JumpManager';
import PropManager from '../Bag/PropManager';
import { PropEnum } from '../../Base/EnumIndex';
import { BuySwitch } from '../Other/BuySwitch';
import AudioManager, { SoundEnum } from '../../Base/AudioManager';
const { ccclass, property } = _decorator;

@ccclass('BuyAIManager')
export class BuyAIManager extends ShoppIngEvent {
    public isUse(): boolean {
        return true;
    }


    private posList: Vec3[] = [];
    private createPos: Vec3 = new Vec3();
    private endPos: Vec3 = new Vec3();

    private aiList: BuyAI[] = [];

    @property(BagBase)
    public cookMeatBag: BagBase;
    @property(BagBase)
    public goldBag: BagBase;
    @property(BuySwitch)
    public sb: BuySwitch;


    private tempShop: Shopping;
    private tempAiList: BuyAI[] = [];
    public shoppEvent(): void {

        const layer = LayerManager.instance.getLayer(LayerEnum.Layer_2_sky);
        const pos = v3(this.tempShop.node.worldPosition);
        for (let i = 0; i < this.tempShop.gold * 2; i++) {
            setTimeout(() => {
                const prop = PropManager.instance.getProp(PropEnum.gold);
                layer.addChild(prop.node);
                prop.node.setWorldPosition(pos);
                AudioManager.inst.playOneShot(SoundEnum.Sound_get_gold);
                JumppManager.instacne.jumpCurve(prop.node, this.goldBag.placePropPos, 4, 5).onComplete(() => {
                    this.goldBag.addProp = prop;
                });
            }, i * 50);
        }
        let ai = this.aiList[0];
        this.aiList.splice(0, 1);
        ai.moveD.pos = this.endPos;
        this.tempAiList.push(ai);
        ai.state = 2;
        this.upPos();
        this.createAI();
        this.tempShop.node.setScale(Vec3.ZERO);
        this.tempShop = null;
    }
    public init(): void {

    }
    start() {
        for (let i = 0; i < 5; i++) {
            let node = this.node.getChildByName(`pos_${i}`);
            if (node) {
                this.posList[i] = node.position;
                node.active = false;
            }
        }
        const createPos = this.node.getChildByName("pos_create");
        this.createPos.set(createPos.worldPosition);
        const endPos = this.node.getChildByName("pos_end");
        this.endPos.set(endPos.worldPosition);
        endPos.active = false;
        createPos.active = false;
        this.createAI();
    }

    private createAI() {
        if (this.aiList.length < this.posList.length) {
            const ai = this.AI;
            this.node.addChild(ai.node);
            ai.node.setWorldPosition(this.createPos);
            const pos = this.posList[this.aiList.length];
            ai.moveD.pos = pos;
            this.aiList.push(ai);
            ai.state = 1;
            this.scheduleOnce(() => {
                this.createAI();
            }, 1.5);
        }
    }
    protected update(dt: number): void {
        this.showShop();
        this.shop();
        this.aiOver();
    }

    private showShop() {
        let ai = this.aiList[0];
        if (ai && ai.state == 1) {
            if (ai.moveD.isPos) {
                ai.state = 2;
                tween(ai.shop.node).to(0.2, { scale: Vec3.ONE }, { easing: "backOut" }).call(() => {
                    this.tempShop = ai.shop;
                }).start();
            }
        }
    }
    private upPos() {
        for (let i = 0; i < this.aiList.length; i++) {
            const ai = this.aiList[i];
            ai.moveD.pos = this.posList[i];
        }
    }

    private aiOver() {
        let aiList = this.tempAiList;
        for (let i = aiList.length - 1; i >= 0; i--) {
            let ai = aiList[i];
            if (ai.state == 2) {
                if (ai.moveD.isPos) {
                    aiList.splice(i, 1);
                    PoolManager.instance.setPool(PoolEnum.AI, ai);
                    ai.node.removeFromParent();
                }
            }
        }

    }


    private shop() {
        if (!this.sb.isShop) {
            return;
        }
        if (this.tempShop) {
            if (this.tempShop.isUse) {
                if (this.cookMeatBag.isPropCount) {
                    const prop: Prop = this.cookMeatBag.prop;
                    const pos = prop.node.worldPosition;
                    const layer = LayerManager.instance.getLayer(LayerEnum.Layer_2_sky);
                    layer.addChild(prop.node);
                    prop.node.setWorldPosition(pos);
                    this.tempShop.moneyPay(1);
                    JumppManager.instacne.jumpCurve(prop.node, this.tempShop.node.worldPosition, 4, 5).onComplete(() => {
                        prop.remove();
                        this.tempShop.moneyAccount(1);
                    });
                }
            }
        }
    }

    private get AI() {
        let ai = PoolManager.instance.getPool<BuyAI>(PoolEnum.AI);
        if (!ai) {
            let node = PrefabsManager.instance.GetPrefabsIns(PrefabsEnum.AI, 0);
            ai = node.getComponent(BuyAI);
            ai.shop.shoppingEvent = this;
        }
        return ai;
    }


}


