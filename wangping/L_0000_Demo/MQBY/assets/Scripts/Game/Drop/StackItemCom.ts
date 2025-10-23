import { _decorator, Tween, tween, Vec3, Node, Collider, Enum, ICollisionEvent, ITriggerEvent, CCInteger, CCBoolean } from "cc";
import { PoolObjectBase } from "../../common/PoolObjectBase";
import { ObjectType, PHY_GROUP } from "../../common/CommonEnum";
import { PickupComponent } from "../Components/PickupComponent";
import { DropItemCom } from "./DropItemCom";
import { DamageNum } from "../UI/DamageNum";
const { ccclass, property } = _decorator;

@ccclass('StackItemCom')
export class StackItemCom extends PoolObjectBase {
    @property(Collider)
    itemCollider: Collider = null!;

    @property({
        type: Enum(ObjectType),
        displayName: '物品类型'
    })
    public itemType: ObjectType = ObjectType.DropItemCoin;

    @property({ type: CCInteger, displayName: '产出物品数量' })
    public itemCount: number = 1;

    @property({ displayName: '产出后是否消失' })
    public isDisappear: boolean = true;

    public canPickup: boolean = false;

    reset() {
        this.canPickup = false;
        this._createCount = 0;
        this.node.setRotationFromEuler(0, 0, 0);
        Tween.stopAllByTarget(this.node);
        this.node.setScale(1, 1, 1);
    }

    protected onLoad(): void {
    }

    protected start(): void {
        this.itemCollider.on('onCollisionEnter', this.onCollisionEnter, this);
        this.itemCollider.on('onTriggerEnter', this.onTriggerEnter, this);
    }

    private static _lastShowMaxTime: number = 0;

    _createCount: number = 0;
    _createDropItem(pickupCom: PickupComponent) {
        if (pickupCom) {
            for (let i = 0; i < this.itemCount; i++) {
                if (pickupCom.canPickupItem(this.itemType)) {
                    // 创建一个可拾取物品给对应的拾取组件
                    let item = manager.pool.getNode(this.itemType, manager.drop.node);
                    let dropItem = item.getComponent(DropItemCom);
                    dropItem.objectType = this.itemType;
                    manager.drop.addItem(item);
                    item.setWorldPosition(this.itemCollider.node.getWorldPosition());
                    pickupCom.pickupItem(dropItem);
                    this._createCount++;
                }
                else {
                    let nowTime = Date.now();
                    if (nowTime - StackItemCom._lastShowMaxTime > 800) {
                        // 物品拾取失败，显示数字
                        const damageNum = manager.pool.getNode(ObjectType.DamageNum)!.getComponent(DamageNum)!;
                        damageNum.node.setParent(manager.effect.node);
                        damageNum.showString("max", this.itemCollider.node.getWorldPosition());
                        StackItemCom._lastShowMaxTime = Date.now();
                    }
                }
            }

            if (this._createCount >= this.itemCount) {
                if (this.isDisappear) {
                    // 回收本物品
                    this.reset();
                    manager.pool.putNode(this.node);
                }
                else {
                    // 不回收物品，则重新设置建造计数
                    this._createCount = 0;
                }
            }
        }

    }

    protected onTriggerEnter(event: ITriggerEvent) {
        if (event.otherCollider.getGroup() == PHY_GROUP.HERO) {
            let pickupCom = event.otherCollider.node.getComponent(PickupComponent);
            this._createDropItem(pickupCom);
        }
        // 碰到传送带则隐藏
        else {
            if (event.otherCollider.node.name.indexOf('trans') != -1) {
                this.node.active = false;
            }
        }
    }

    protected onCollisionEnter(event: ICollisionEvent): void {
        if (event.otherCollider.getGroup() == PHY_GROUP.HERO) {
            let pickupCom = event.otherCollider.node.getComponent(PickupComponent);
            this._createDropItem(pickupCom);
        }
        // 碰到传送带则隐藏
        else {
            if (event.otherCollider.node.name.indexOf('trans') != -1) {
                this.node.active = false;
            }
        }
    }
}