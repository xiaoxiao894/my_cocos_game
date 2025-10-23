import { _decorator, CCFloat, CCInteger, Component, Mat4, Node, Vec2, Vec3 } from 'cc';
import { BagBase } from './Base/BagBase';
import LayerManager, { SceneType } from '../../Base/LayerManager';
import TweenTool from '../../Tool/TweenTool';
import { Prop } from './Prop';
const { ccclass, property } = _decorator;

@ccclass('GroupBag3D')
export class GroupBag3D extends BagBase {

    public get NODECOUNT(): number {

        let count = this.count + this.propCount;
        if (this.showMaxCount != -1 && this.showMaxCount <= count) {
            count = this.showMaxCount - 1;
        }
        return count;
    }

    private sceneType: SceneType = SceneType.D2;

    protected onLoad(): void {
        super.onLoad();
        this.sceneType = LayerManager.instance.SceneType;
    }

    @property({
        tooltip: '一行中道具的个数',
        type: CCInteger
    })
    public horizontal: number = 3;

    @property({
        tooltip: '每层道具的总数',
        type: CCInteger
    })
    public layerCount: number = 9;

    @property({
        tooltip: '当前节点下 的初始位置 0:X  1:y  ',
    })
    public startPos: Vec3 = new Vec3();

    @property({
        tooltip: '每行偏移量  0:X  1:y  ',
    })
    public horizontalOffset: Vec2 = new Vec2();

    @property({
        tooltip: '每列偏移量  0:X  1:y  ',
    })
    public verticalOffset: Vec2 = new Vec2();


    @property({
        tooltip: '局部坐标角度仅限2d使用',
        type: CCFloat
    })
    public angle: number = 0;


    /**获取 放置的位置 */
    public get placePropPos() {
        this.count++;
        this._placeTime = this.placeTimeInterval;
        let count = this.NODECOUNT;
        return this.getPropPlaceWordPos(count);
    }
    public getPropPlacePos(count: number) {
        this.tempV3.set(Vec3.ZERO);
        // this._showAddArrow = true;
        let layer = Math.floor(count / this.layerCount);
        let layerY = layer * this.layerHeight;
        let layerCount = count % this.layerCount;
        let rx = Math.floor(layerCount % this.horizontal);
        let ry = Math.floor(layerCount / this.horizontal);
        if (this.sceneType == SceneType.D2) {
            let dx = this.startPos.x + rx * this.horizontalOffset.x + ry * this.verticalOffset.x;
            let dy = this.startPos.y + rx * this.horizontalOffset.y + ry * this.verticalOffset.y + layerY;
            this.tempV3.add3f(dx, dy, 0);
        } else {
            let dx = this.startPos.x + rx * this.horizontalOffset.x + ry * this.verticalOffset.x;
            let dz = this.startPos.z + rx * this.horizontalOffset.y + ry * this.verticalOffset.y;
            let y = layerY + this.startPos.y;
            this.tempV3.add3f(dx, y, dz);
        }
        return this.tempV3;
    }
    /**添加道具 */
    public set addProp(prop: Prop) {
        if (this.showMaxCount == -1 || this.showMaxCount > this.propList.length) {
            this.getPropPlacePos(this.propList.length);
            this.node.addChild(prop.node);
            this.propList.push(prop);
            prop.node.setPosition(this.tempV3);
            prop.node.setScale(Vec3.ONE);
            TweenTool.scaleShake(prop.node).call(() => {
                prop.node.setScale(Vec3.ONE);
            }).start();
            if (this.sceneType == SceneType.D2 && this.angle != -1) {

                // prop.tran.priority = 0;
                prop.node.angle = this.angle;
            }
        } else {
            this.showCount++;
            prop.remove();
        }
        this.count--;
    }

}

