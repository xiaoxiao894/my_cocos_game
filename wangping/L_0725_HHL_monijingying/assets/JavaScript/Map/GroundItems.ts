import {  _decorator,Vec3,Node, Component,  CCFloat } from "cc";
import { NodePoolManager } from "../Common/NodePoolManager";
import { EntityTypeEnum } from "../Common/Enum";
import { MathUtils } from "../Util/MathUtils";
const {ccclass, property} = _decorator;

/** 地面堆叠的道具 */
@ccclass('GroundItems')
export class GroundItems extends Component {

    @property({type:CCFloat,tooltip:"道具长度 x方向"})
    private itemLength: number = 0;

    @property({type:CCFloat,tooltip:"道具宽度 z方向"})
    private itemWidth: number = 0;

    
    @property({type:CCFloat,tooltip:"道具长个数 x方向"})
    private itemLengthNum: number = 0;

    @property({type:CCFloat,tooltip:"道具宽个数 z方向"})
    private itemWidthNum: number = 0;

    @property(Node)
    private itemParent:Node = null;

    private _itemLackPos: Vec3[] = [];
    private _itemNum: number = 0;
    
    private _itemHeight: number = 0;
    

    //按顺序排列，最后一个玉米的位置
    private _maxItem: Vec3;

    // 正在在播放动画的数量
    private _playingAniNum: number = 0;

    private _entityType: EntityTypeEnum = EntityTypeEnum.NONE;

    /** 初始化 */
    public init(type:EntityTypeEnum,height:number):void{
        this._entityType = type;
        this._itemHeight = height;
    }

    /** 增加道具 */
    public addItem(worldPos?: Vec3): void {
        let item: Node = NodePoolManager.Instance.getNode(this._entityType);

        item.setParent(this.itemParent);

        if (worldPos) {
            item.setWorldPosition(worldPos);
        } else {
            let pos = this.getNextPosWithLength();

            item.setPosition(pos);
        }
        item.setScale(1, 1, 1);
        item.eulerAngles = new Vec3(0, 0, 0);
        if (!this._maxItem) {
            this._maxItem = item.getPosition().clone();
        } else {
            if (this.isPositionGreater(item.getWorldPosition(), this._maxItem)) {
                this._maxItem = item.getWorldPosition().clone();
            }
        }
        this._itemNum++;
    }

    public getGroundItemNum(){
        return this._itemNum;
    }
    
    /** 获取道具位置 */
    public playerGetItem(): Vec3 {
        let worldPos = this.removeItem();
        if (worldPos == null) {
            return null;
        } else {
            return worldPos;
        }
    }

    /** 增加正在播放动画数量(飞到此处) */
    public addPlayingAniNum(): void {
        this._playingAniNum++;
    }

    /** 减少正在播放动画数量(飞到此处) */
    public reducePlayingAniNum(): void {
        this._playingAniNum--;
    }

    /** 获取正在播放动画数量(飞到此处) */
    public getPlayingAniNum(): number {
        return this._playingAniNum;
    }

    public getGuidePos(): Vec3 {
        let pos:Vec3 = this.node.worldPosition.clone();
        pos.y = Math.floor(this._itemNum / (this.itemLengthNum * this.itemWidthNum)) * this._itemHeight
        return pos;
    }

    private isPositionGreater(pos1: Vec3, pos2: Vec3): boolean {
        if (pos1.y > pos2.y) return true;
        if (pos1.y < pos2.y) return false;

        // y 相等时比较 x
        if (pos1.x > pos2.x) return true;
        if (pos1.x < pos2.x) return false;

        // x 和 y 相等时比较 z
        return pos1.z > pos2.z;
    }

    public getNextItemPos(aniNum:number): Vec3 {
        if (this._itemLackPos.length > 0) {
            return this._itemLackPos.shift();
        } else {
            let targetPos = this.getNextPosWithLength(aniNum);
            let worldPos = new Vec3();
            worldPos = MathUtils.localToWorldPos3D(targetPos, this.itemParent);

            return worldPos;
        }
    }

    private getNextPosWithLength(addNum:number = 0): Vec3 {
        let count:number = addNum+this._itemNum;
        let pos = new Vec3(0, 0, 0);
        //本层数量
        let nowLayerNumber = count % (this.itemLengthNum * this.itemWidthNum);
        pos.y = Math.floor(count / (this.itemLengthNum * this.itemWidthNum)) * this._itemHeight; //钱的高度
        pos.z = nowLayerNumber % this.itemWidthNum * this.itemWidth + this.itemWidth / 2; //钱的宽度
        pos.x = Math.floor(nowLayerNumber / this.itemWidthNum) * this.itemLength + this.itemLength / 2; //钱的长度
        return pos;
    }

    private removeItem(): Vec3 {
        if (this._itemNum > 0) {
            let itemNodes:Node[]= this.itemParent.children;
            itemNodes.sort((a: Node, b: Node) => {
                // 1. 优先比较 y，大的在后
                if (a.position.y !== b.position.y) {
                    return a.position.y - b.position.y; // 升序（y小的在前）
                }

                // 2. y 相等时，比较 x，大的在后
                if (a.position.x !== b.position.x) {
                    return a.position.x - b.position.x; // 升序（x小的在前）
                }

                // 3. x 和 y 都相等时，比较 z，大的在后
                return a.position.z - b.position.z; // 升序（z小的在前）
            });
            let itemItem: Node = itemNodes[itemNodes.length - 1];
            this._itemNum--;
            if (itemItem) {
                let pos = itemItem.worldPosition.clone();
                NodePoolManager.Instance.returnNode(itemItem,this._entityType);
                this.updateitemLack(pos);
                return pos;
            } else {
                return this.removeItem();
            }

        } else {
            return null;
        }
    }

    private updateitemLack(pos: Vec3) {
        //如果当前没有这个坐标再加入
        if (this._itemLackPos.indexOf(pos) !== -1) {
            return;
        }

        this._itemLackPos.push(pos);
        this._itemLackPos.sort((a, b) => {
            // 1. 优先比较 y，大的在后
            if (a.y !== b.y) {
                return a.y - b.y; // 升序（y小的在前）
            }

            // 2. y 相等时，比较 x，大的在后
            if (a.x !== b.x) {
                return a.x - b.x; // 升序（x小的在前）
            }

            // 3. x 和 y 都相等时，比较 z，大的在后
            return a.z - b.z; // 升序（z小的在前）
        });

        for (let i = 0; i < this._itemLackPos.length; i++) {
            let item = this._itemLackPos[i];
            if (this.isPositionGreater(item, this._maxItem)) {
                this._itemLackPos.splice(i, this._itemLackPos.length - i);
                break;
            }
        }

    }

}