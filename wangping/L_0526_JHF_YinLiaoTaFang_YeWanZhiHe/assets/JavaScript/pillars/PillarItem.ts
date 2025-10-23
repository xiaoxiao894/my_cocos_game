import { _decorator, CCInteger, Collider, Component, ICollisionEvent, instantiate, Node, Prefab } from 'cc';
import { DeliverItem } from './DeliverItem';
const { ccclass, property } = _decorator;

@ccclass('PillarItem')
export class PillarItem extends Component {

    @property(Collider)
    pillarCollider: Collider = null;

    @property(CCInteger)
    unlockIndex: number = 0;

    @property(CCInteger)
    needNum: number = 0;

    @property(Prefab)
    deliver: Prefab = null;

    @property(Node)

    //0 没激活  1 已激活  2  已无用
    private _state: number = 0;
    private _num: number = 0;
    private _deliverItem: DeliverItem;


    start() {
        this._state = 0;
        this._num = 0;
        this.pillarCollider.node.active = false;

        let node = instantiate(this.deliver);
        if (node) {
            this._deliverItem = node.getComponent(DeliverItem);
            node.active = false;
            this.node.addChild(node);
        }

    }

    protected onEnable(): void {
        this.pillarCollider.on("onCollisionEnter", this.onCollisionEnter, this);
    }

    protected onDisable(): void {
        this.pillarCollider.off("onCollisionEnter", this.onCollisionEnter, this);
    }

    //激活
    public pillarActive() {
        this._state = 1;
        this.pillarCollider.node.active = true;
        if (this._deliverItem) {
            this._deliverItem.init(this.needNum);
            this._deliverItem.node.active = true;
        }

    }

    private pillarDie() {
        this._state = 2;
    }

    public itemAdd() {
        if (this._state === 1 && this._num < this.needNum) {
            this._num++;
            //更新展示展示
            if (this._num >= this.needNum) {
                this.pillarDie();
            }
            this._deliverItem?.addItem();
        }
    }

    private onCollisionEnter(event: ICollisionEvent) {
        //主角第一次靠近播放动画
    }

    public isUnlocked() {
        return this._state == 2;
    }

    public getLeftNeedNum(): number {
        return this.needNum - this._num;
    }



    update(deltaTime: number) {

    }
}


