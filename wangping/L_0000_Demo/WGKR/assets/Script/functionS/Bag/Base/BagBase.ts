import { _decorator, ccenum, CCFloat, CCInteger, Component, Enum, Node, Vec3 } from 'cc';
import PropManager from '../PropManager';
import { UnityUpComponent } from '../../../Base/UnityUpComponent';
import { PropEnum } from '../../../Base/EnumIndex';
import { Prop } from '../Prop';
const { ccclass, property } = _decorator;

// cc.Class.attr(component, 'style', {
//     type: 'Enum',
//     enumList: cc.Enum.getList(cc.Enum(obj))
// });



@ccclass('BagBase')
export abstract class BagBase extends UnityUpComponent {

    @property({
        tooltip: "要放置的道具id null为关闭放置功能",
        type: PropEnum
    })
    public placeId: PropEnum = PropEnum.null;

    @property({
        tooltip: "要拿取的道具id null为关闭拿取功能",
        type: PropEnum
    })
    public takeId: PropEnum = PropEnum.null;


    /**时间间隔 */
    @property({
        tooltip: "放置的时间间隔",
        type: CCFloat
    })
    public placeTimeInterval: number = 0.025;
    /**上次放置时间 */
    protected _placeTime: number = 0;


    /**拿取时间间隔 */
    @property({
        tooltip: "拿取的时间间隔",
        type: CCFloat
    })
    public takeTimeInterval: number = 0.025;
    /**上次拿取时间 */
    protected _takeTime: number = 0;


    /**放置数量量 */
    protected count: number = 0;

    /**每层高度偏移 */
    @property({
        tooltip: "每层高度偏移量",
        type: CCFloat
    })
    public layerHeight: number = 10;


    protected tempV3: Vec3 = new Vec3();

    @property(CCInteger)
    public showMaxCount: number = -1;
    protected showCount: number = 0;

    public isOpen: boolean = true;

    protected propList: Prop[] = [];

    private _guidNode: Node;
    protected onLoad(): void {
        this._guidNode = this.node.getChildByName("guidNode");
    }

    public get guidNode() {
        return this._guidNode ? this._guidNode : this.node;
    }
    /**获得道具 */
    public get prop(): Prop {
        if (this.showCount > 0) {
            this.showCount--;
            this._takeTime = this.takeTimeInterval;
            this._getprop();
            let prop: Prop;
            if (this.takeId != PropEnum.null) {
                prop = PropManager.instance.getProp(this.takeId);
            } else if (this.placeId != PropEnum.null) {
                prop = PropManager.instance.getProp(this.placeId);
            }
            let node = this.propList[this.propList.length - 1].node;
            prop.node.setWorldPosition(node.worldPosition);
            prop.node.rotation = node.rotation;
            return prop;
        } else if (this.propList.length) {
            this._takeTime = this.takeTimeInterval;
            let prop = this.propList.pop();
            this._getprop();
            return prop;
        }
        return null;
    }


    protected _getprop() {

    }


    public abstract get placePropPos(): Vec3;

    public abstract set addProp(prop: Prop);

    public abstract getPropPlacePos(count: number): Vec3;

    public getPropPlaceWordPos(count: number): Vec3 {
        this.getPropPlacePos(count);
        this.tempV3.transformMat4(this.node.worldMatrix);
        return this.tempV3;
    }

    protected _update(dt: number): void {
        this._placeTime -= dt;
        this._takeTime -= dt;
        this._onUpdata(dt);
    }

    /**是否可以放置道具 */
    public get isPlace() {
        return this._placeTime <= 0;
    }
    /**是否可以拿取道具 */
    public get isTake() {
        return this._takeTime <= 0 && !!this.propCount;
    }
    /**是否可以投掷道具    通过  另一个shopping或者背包的时间进行限制*/
    public get isPropCount() {
        return this.propCount > 0;
    }

    public get propCount() {
        if (this.showCount == -1) {
            return this.propList.length;
        } else {
            return this.propList.length + this.showCount;
        }
    }

    public get propCount_R() {
        if (this.showCount == -1) {
            return this.propList.length + this.count;
        } else {
            return this.propList.length + this.showCount + this.count;
        }
    }

    public abstract get NODECOUNT(): number;



    protected _onUpdata(dt: number) { };

}


