import { _decorator, CCFloat, log, tween, Vec3 } from "cc";
import { GroupBag3D } from "./GroupBag3D";
import TweenTool from "../../Tool/TweenTool";
import { Prop } from "./Prop";


const { ccclass, property } = _decorator;

@ccclass("GroupPropTransform")
export default class GroupPropTransform extends GroupBag3D {

    @property(CCFloat)
    public transformeTime: number = 0.2;

    private _conversionTime: number = this.transformeTime;



    private placePorp: Prop[] = [];
    private tranProp: Prop[] = [];





    public get placePropPos() {
        // this._showArrow = true;
        this.count++;
        this.node.getWorldPosition(this.tempV3);
        let count = this.NullPosIndex + this.count;
        this.getPropPlacePos(count);
        this._placeTime = this.placeTimeInterval;
        return this.tempV3;
    }


    public set addProp(prop: Prop) {
        let count = this.NullPosIndex;
        // prop.tran.priority = count;
        this.tempV3.set(Vec3.ZERO);
        this.getPropPlacePos(count);
        this.tranProp.push(prop);
        this.placePorp[count] = prop;
        this.node.addChild(prop.node);
        this.propList.push(prop);
        prop.node.setPosition(this.tempV3);
        this.count--;
    }

    public get prop(): Prop {
        let index = this.getIsTakeIndex();
        if (index == -1) {
            return null;
        } else {
            this._takeTime = this.takeTimeInterval;
            let node = this.placePorp[index];
            this.placePorp[index] = null;
            let prop = node.getComponent(Prop);
            this.PropDown(index);
            return prop;
        }
    }

    private getIsTakeIndex() {
        let takeIndex = -1;
        for (let i = 0; i < this.placePorp.length; i++) {
            let prop = this.placePorp[i];
            if (prop && prop.propID == this.takeId) {
                takeIndex = i;
                break;
            }
        }
        return takeIndex;
    }



    private get NullPosIndex() {
        let count = this.placePorp.length;
        for (let i = 0; i < this.placePorp.length; i++) {
            let prop = this.placePorp[i];
            if (!prop) {
                count = i;
                break;
            }
        }
        return count;
    }

    private PropDown(index: number) {
        index = index % this.layerCount;
        let nullIndex = -1;
        for (let i = index; i < this.placePorp.length; i += this.layerCount) {
            let prop = this.placePorp[i];
            if (prop && nullIndex != -1) {
                this.placePorp[nullIndex] = prop;
                // prop.tran.priority = nullIndex;
                this.placePorp[i] = null;
                this.tempV3.set(Vec3.ZERO);
                this.getPropPlacePos(nullIndex);
                let pos = this.tempV3.clone();
                tween(prop.node).to(0.25, { position: pos }).start();
                nullIndex += this.layerCount;
            } else if (nullIndex == -1 && !prop) {
                nullIndex = i;
            }
        }
        console.log('下降完成');
    }

    protected update(dt: number): void {
        super.update(dt);
        if (!this.tranProp.length) {
            this._conversionTime = this.transformeTime;
            return;
        }
        this._conversionTime -= dt;
        if (this._conversionTime <= 0) {
            this._conversionTime = this.transformeTime;
            let prop = this.tranProp.shift();
            prop.propID = this.takeId;
            TweenTool.scaleShake(prop.node, 0.3);
        }
    }




}