import { Mat4, Vec3,Node } from "cc";
import { App } from "../App";
import { GlobeVariable } from "../core/GlobeVariable";
import { MathUtil } from "../core/MathUtils";

//类型定义 
export type CoinItem = {
    pos: Vec3, //世界坐标
    coin: Node 
}

/** 金矿管理类 */
export default class GoldMineController {

    private _coinLackPos: Vec3[] = [];
    private _coinNum: number = 0;

    //钱的尺寸
    private _coinWidth: number = 1.2;
    private _coinHeight: number = 0.2;

    //钱池个数
    private _coinLengthNum: number = 3;
    private _coinWidthNum: number = 4;

    //按顺序排列，最后一个金币的位置
    private _maxCoin: Vec3;

    // 正在在播放动画的数量
    private _playingAniNum: number = 0;

    private static _instance: GoldMineController;
    public static get Instance(): GoldMineController {
        if (!GoldMineController._instance) {
            GoldMineController._instance = new GoldMineController();
        }
        return GoldMineController._instance;
    }

    /** 增加金币 */
    public addCoin(worldPos?: Vec3): void {
        let coinItem: Node = App.poolManager.getNode(GlobeVariable.entifyName.Coin);

        coinItem.setParent(App.sceneNode.goldMineParent);

        if (worldPos) {
            coinItem.setWorldPosition(worldPos);
        } else {
            let pos = this.getNextPosWithLength();

            coinItem.setPosition(pos);
        }

        if (!this._maxCoin) {
            this._maxCoin = coinItem.getPosition().clone();
        } else {
            if (this.isPositionGreater(coinItem.getWorldPosition(), this._maxCoin)) {
                this._maxCoin = coinItem.getWorldPosition().clone();
            }
        }
        this._coinNum++;
    }
    public getGoldMineNum(){
        return this._coinNum;
    }
    
    public playerGetCoin(): CoinItem | null {
        let worldPos = this.removeCoin();
        if (worldPos == null) {
            return null;
        } else {
            return {
                pos: worldPos,
                coin: App.poolManager.getNode(GlobeVariable.entifyName.Coin)
            };
        }
    }

    public addPlayingAniNum(): void {
        this._playingAniNum++;
    }

    public reducePlayingAniNum(): void {
        this._playingAniNum--;
    }

    public getPlayingAniNum(): number {
        return this._playingAniNum;
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

    public getNextCoinPos(aniNum:number): Vec3 {
        if (this._coinLackPos.length > 0) {
            return this._coinLackPos.shift();
        } else {
            let targetPos = this.getNextPosWithLength(aniNum);
            let worldPos = new Vec3();
            worldPos = MathUtil.localToWorldPos3D(targetPos, App.sceneNode.goldMineParent);

            return worldPos;
        }
    }

    private getNextPosWithLength(addNum:number = 0): Vec3 {
        let count:number = addNum+this._coinNum;
        let pos = new Vec3(0, 0, 0);
        //本层数量
        let nowLayerNumber = count % (this._coinLengthNum * this._coinWidthNum);
        pos.y = Math.floor(count / (this._coinLengthNum * this._coinWidthNum)) * this._coinHeight; //钱的高度
        pos.z = nowLayerNumber % this._coinWidthNum * this._coinWidth + this._coinWidth / 2; //钱的宽度
        pos.x = Math.floor(nowLayerNumber / this._coinWidthNum) * this._coinWidth + this._coinWidth / 2; //钱的长度
        return pos;
    }

    private removeCoin(): Vec3 {
        if (this._coinNum > 0) {
            let coinNodes:Node[]= App.sceneNode.goldMineParent.children;
            coinNodes.sort((a: Node, b: Node) => {
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
            let coinItem: Node = coinNodes[coinNodes.length - 1];
            this._coinNum--;
            if (coinItem) {
                let pos = coinItem.worldPosition.clone();
                App.poolManager.returnNode(coinItem,GlobeVariable.entifyName.Coin);
                this.updateCoinLack(pos);
                return pos;
            } else {
                return this.removeCoin();
            }

        } else {
            return null;
        }
    }

    private updateCoinLack(pos: Vec3) {
        //如果当前没有这个坐标再加入
        if (this._coinLackPos.indexOf(pos) !== -1) {
            return;
        }

        this._coinLackPos.push(pos);
        this._coinLackPos.sort((a, b) => {
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

        for (let i = 0; i < this._coinLackPos.length; i++) {
            let item = this._coinLackPos[i];
            if (this.isPositionGreater(item, this._maxCoin)) {
                this._coinLackPos.splice(i, this._coinLackPos.length - i);
                break;
            }
        }

    }

}