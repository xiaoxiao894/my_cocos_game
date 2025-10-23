import { Node, Vec3 } from 'cc';
import ItemPool from "../Common/ItemPool";
import { CollisionZoneEnum, EntityTypeEnum } from "../Enum/Index";
import { DataManager } from '../Global/DataManager';
import { HonorItem } from '../Common/DataTypes';
import Singleton from '../Base/Singleton';

export default class HonorManager extends Singleton {

    static get Instance() {
        return super.GetInstance<HonorManager>();
    }


    private _honorNum: number = 0;
    private _honorPool: ItemPool;
    private _honorParent: Node;

    //勋章的尺寸
    private _honorLength: number = 3;
    private _honorHeight: number = 0;

    //勋章数量
    private _helper1HonorNum: number = 0;
    private _helper2HonorNum: number = 0;
    private _unlockAreaHonorNum: number = 0;

    public init(moneyParent: Node): void {
        DataManager.Instance.HonorManeger = this;
        this._honorNum = 0;

        this._honorParent = moneyParent;
        this._honorHeight = DataManager.Instance.HonorHeight; //获取勋章的高度


    }

    public initHonorPool() {
        this._honorPool = new ItemPool(EntityTypeEnum.Honor, 10);
    }

    public addHonor(honorItem: Node): void {
        honorItem.setParent(this._honorParent);
        let pos: Vec3 = this.getNewHonorPos();
        honorItem.setPosition(pos);
        this._honorNum++;
        this.updateHonorArrowPos();
    }

    private getNewHonorPos(): Vec3 {
        let pos = new Vec3(0, 0, 0);
        //本层数量
        let nowLayerNumber = this._honorNum % 2;
        pos.y = Math.floor(this._honorNum / 2) * this._honorHeight; //勋章的高度
        pos.x = nowLayerNumber * this._honorLength + this._honorLength / 2; //勋章的长度
        return pos;
    }

    private removeHonor(): Vec3 {
        if (this._honorNum > 0) {
            let honorItem: Node = this._honorParent.children[this._honorParent.children.length - 1];
            this._honorNum--;
            if (honorItem) {
                let pos = honorItem.worldPosition.clone();
                this._honorPool.putItem(honorItem);
                return pos;
            } else {
                return this.removeHonor();
            }

        } else {
            return null;
        }
    }

    public get HonorNum(): number {
        return this._honorNum;
    }

    public playerGetHonor(): HonorItem | null {
        this.updateHonorArrowPos();
        let worldPos = this.removeHonor();
        if (worldPos == null) {
            return null;
        } else {
            return {
                pos: worldPos,
                honor: this._honorPool.getItem()
            };
        }

    }

    public getHonorNode(): Node {
        return this._honorPool.getItem();
    }

    public recycleHonor(honor: Node): void {
        this._honorPool.putItem(honor);
    }

    public getNewHonorWorldPos(newHonorNum): Vec3 {
        let honorNum = newHonorNum + this._honorNum;
        let basePos = this._honorParent.getWorldPosition().clone();

        let pos = new Vec3(0, 0, 0);
        //本层数量
        let nowLayerNumber = honorNum % 2;
        pos.y = Math.floor(honorNum / 2) * this._honorHeight; //勋章的高度
        pos.x = nowLayerNumber * this._honorLength + this._honorLength / 2; //勋章的长度F
        basePos.add(pos)
        return basePos;
    }

    public updateHonorArrowPos() {
        let basePos = DataManager.Instance.HomeMap.getHonorCollider.node.getWorldPosition().clone();
        basePos.y += Math.floor(this._honorNum / 2) * this._honorHeight; //勋章的高度

        const len: number = DataManager.Instance.guide.length;
        for (let i = 0; i < len; i++) {
            let item = DataManager.Instance.guide[i];
            if (item.type === CollisionZoneEnum.GetHonorArea) {
                item.pos = basePos;
                break;
            }
        }
    }

    //获取交付勋章位置 帮手1 帮手2 解锁地块
    public getHelper1Pos(): Vec3 {
        return DataManager.Instance.HomeMap.helper1Area.node.worldPosition.clone();
    }

    public getHelper2Pos(): Vec3 {
        return DataManager.Instance.HomeMap.helper2Area.node.worldPosition.clone();
    }

    public getUnlockAreaPos(): Vec3 {
        return DataManager.Instance.HomeMap.unlockTileArea.node.worldPosition.clone();
    }

    //勋章交付 帮手1 帮手2 解锁地块
    public deliverHonorToHelper1() {
        if (this._helper1HonorNum >= DataManager.Instance.Helper1NeedNum) {
            return;
        }
        this._helper1HonorNum++;
        DataManager.Instance.HomeMap.helper1Area.subNum();
        if (this._helper1HonorNum === DataManager.Instance.Helper1NeedNum) {
            DataManager.Instance.HomeMap.onHelper1Unlocke();
        }
    }

    public deliverHonorToHelper2() {
        if (this._helper2HonorNum >= DataManager.Instance.Helper2NeedNum) {
            return;
        }
        this._helper2HonorNum++;
        DataManager.Instance.HomeMap.helper2Area.subNum();
        if (this._helper2HonorNum === DataManager.Instance.Helper2NeedNum) {
            DataManager.Instance.HomeMap.onHelper2Unlocke();
        }
    }

    public deliverHonorToUnlockArea() {
        if (this._unlockAreaHonorNum >= DataManager.Instance.UnlockAreaNeedNum) {
            return;
        }
        this._unlockAreaHonorNum++;
        DataManager.Instance.HomeMap.unlockTileArea.subNum();
        if (this._unlockAreaHonorNum === DataManager.Instance.UnlockAreaNeedNum) {
            DataManager.Instance.HomeMap.unlockTile();
        }
    }

    //获取还需要多少
    public helper1NeedNum(): number {
        return DataManager.Instance.Helper1NeedNum - this._helper1HonorNum;
    }

    public helper2NeedNum(): number {
        return DataManager.Instance.Helper2NeedNum - this._helper2HonorNum;
    }

    public unlockAreaNeedNum(): number {
        return DataManager.Instance.UnlockAreaNeedNum - this._unlockAreaHonorNum;
    }

}

