import { _decorator, BoxCharacterController, BoxCollider, BoxCollider2D, CCBoolean, CCClass, CCFloat, Collider, Collider2D, Component, Contact2DType, ICollisionEvent, IPhysics2DContact, ITriggerEvent, Node, v3, Vec3 } from 'cc';
import Shopping from '../Shopping';
import { JumppManager } from '../../Jump/JumpManager';
import AudioManager, { SoundEnum } from '../../../Base/AudioManager';
import LayerManager, { LayerEnum } from '../../../Base/LayerManager';
import { PrefabsEnum, PrefabsManager } from '../../../Base/PrefabsManager';
import PoolManager, { PoolEnum } from '../../../Base/PoolManager';
import { BagBase } from '../../Bag/Base/BagBase';
import { UnityUpComponent } from '../../../Base/UnityUpComponent';
import { vectorPower2 } from '../../../Tool/Index';
import { PropEnum } from '../../../Base/EnumIndex';
import ColliderTag, { COLLIDE_TYPE } from '../../Battle/CollectBattleTarger/ColliderTag';
const { ccclass, property } = _decorator;



// CCClass(BagList);
@ccclass('BuyWay')
export class BuyWay extends UnityUpComponent {

    /**
     * 购买列表
     */
    private shopingList: Shopping[] = [];

    public nBagArr: BagBase[] = [];

    @property(Collider)
    private collide: Collider;

    private _bagArr: BagBase[] = [];



    protected onLoad(): void {
        this.collide.on("onTriggerEnter", this.onBeginContact, this);
        this.collide.on("onTriggerExit", this.onEndContact, this);
        const children = this.node.children;
        for (let i = 0; i < children.length; i++) {
            const cNode = children[i];
            const bag = cNode.getComponent(BagBase);
            if (bag) {
                this._bagArr[bag.placeId] = bag;
            }
        }
        this.refreshBagLocation();
    }

    private onBeginContact(event: ITriggerEvent) {
        // if (otherCollider.tag == COLLIDE_TYPE.SHOP) {
        let tag = event.otherCollider.getComponent(ColliderTag);
        switch (tag.tag) {
            case COLLIDE_TYPE.SHOP:
                let shopping = event.otherCollider.getComponent(Shopping);
                if (this.shopingList.indexOf(shopping) == -1) {
                    this.shopingList.push(shopping);
                }
                break;
            case COLLIDE_TYPE.BAG:
                let bag = event.otherCollider.getComponent(BagBase);
                if (this.nBagArr.indexOf(bag) == -1) {
                    this.nBagArr.push(bag);
                }
                break;
        }

        // }
    }

    private onEndContact(event: ITriggerEvent) {
        // if (otherCollider.tag == COLLIDE_TYPE.SHOP) {
        let tag = event.otherCollider.getComponent(ColliderTag);
        switch (tag.tag) {
            case COLLIDE_TYPE.SHOP:
                let shopping = event.otherCollider.getComponent(Shopping);
                let index = this.shopingList.indexOf(shopping)
                if (index != -1) {
                    this.shopingList.splice(index, 1);
                }
                break;
            case COLLIDE_TYPE.BAG:
                let bag = event.otherCollider.getComponent(BagBase);
                let index2 = this.nBagArr.indexOf(bag)
                if (index2 != -1) {
                    this.nBagArr.splice(index2, 1);
                }
                break;
        }
        // }
    }

    protected _update(dt: number): void {
        this.Shop();
        this.bagUp();
        this.refreshBagLocation();
    }

    private rotVector: Vec3 = new Vec3(0.5, 0, 0.5);

    private Shop() {
        for (let i = 0; i < this.shopingList.length; i++) {
            let shopping = this.shopingList[i];
            // if (PlayerManager.gold > 0) {
            if (shopping.isUse) {
                // PlayerManager.addGold(-1);
                // 判断是否还有足够的道具
                let layer = LayerManager.instance.getLayer(LayerEnum.Layer_2_sky);
                let bag = this.getBag(shopping.propId);
                if (bag && bag.isPropCount) {
                    let prop = bag.prop;
                    let node = prop.node
                    let wPos = node.worldPosition;
                    layer.addChild(node);
                    node.setWorldPosition(wPos);
                    shopping.moneyPay(1);
                    let bagPos = shopping.node.worldPosition;
                    // prop.rotVector = this.rotVector;
                    AudioManager.inst.playOneShot(SoundEnum.Sound_get_gold);
                    JumppManager.instacne.jumpCurve(node, bagPos, 4, 4).onComplete(() => {
                        shopping.moneyAccount(1);
                        prop.remove();
                    });
                }
            }
            // }
        }
    }
    private bagUp() {
        for (let i = 0; i < this.nBagArr.length; i++) {
            let bag = this.nBagArr[i];
            if (bag.takeId != PropEnum.null) {
                if (bag.isTake) {

                    let fBag = this.getBag(bag.takeId);
                    if (!fBag) {
                        break;
                    }
                    let prop = bag.prop;
                    let node1 = prop.node;
                    let wPos = node1.worldPosition;
                    let layer = LayerManager.instance.getLayer(LayerEnum.Layer_2_sky);
                    layer.addChild(node1);
                    node1.setWorldPosition(wPos);
                    let endPos = v3(fBag.placePropPos);
                    const c = fBag.NODECOUNT;
                    AudioManager.inst.playOneShot(SoundEnum.Sound_get);
                    JumppManager.instacne.jumpCurve(node1, endPos, 4, 6).onComplete(() => {
                        fBag.addProp = prop;
                    }).setEndPosPre((node: Node) => {
                        let endOldPos = endPos;
                        let bag1 = fBag;
                        let count = c;
                        let endNewPos = bag1.getPropPlaceWordPos(count);
                        endNewPos.subtract(endOldPos);
                        endNewPos.add(node.worldPosition);
                        node.setWorldPosition(endNewPos);
                    }, this);
                }
            } else if (bag.placeId != PropEnum.null) {
                let fBag = this.getBag(bag.placeId);
                if (!fBag) {
                    break;
                }
                if (fBag.isPropCount) {
                    if (bag.isPlace) {
                        if (bag.placeId == PropEnum.gold) {
                            // AudioManager.inst.playOneShot(SoundEnum.sound_gold_t);
                        }
                        let prop = fBag.prop;
                        let node2 = prop.node;
                        let wPos = node2.worldPosition;
                        let layer = LayerManager.instance.getLayer(LayerEnum.Layer_2_sky);
                        layer.addChild(node2);
                        node2.setWorldPosition(wPos);

                        AudioManager.inst.playOneShot(SoundEnum.Sound_out);
                        JumppManager.instacne.jumpCurve(node2, bag.placePropPos, 4, 6).onComplete(() => {
                            bag.addProp = prop;
                        });
                    }

                }
            }

        }
    }

    public getBag(propId: PropEnum) {
        return this._bagArr[propId];
    }

    private refreshBagLocation() {
        let index = 0;
        for (let i = 0; i < this._bagArr.length; i++) {
            let bag = this._bagArr[i];
            if (bag && bag.propCount) {
                bag.node.setSiblingIndex(index);
                bag.node.z = index * -1.3;
                index++;
            }
        }
    }

}


