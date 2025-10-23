import { _decorator, CCFloat, Component, Node, Quat, sp, v3, Vec3 } from 'cc';
import { BagBase } from '../Bag/Base/BagBase';
import LayerManager, { LayerEnum } from '../../Base/LayerManager';
import { Prop } from '../Bag/Prop';
import { JumppManager } from '../Jump/JumpManager';
import PropManager from '../Bag/PropManager';
import { PropEnum } from '../../Base/EnumIndex';
import TweenTool from '../../Tool/TweenTool';
import AudioManager, { SoundEnum } from '../../Base/AudioManager';
const { ccclass, property } = _decorator;

@ccclass('MeatTCookMeat')
export class MeatTCookMeat extends Component {

    @property(BagBase)
    public meatBag: BagBase;
    @property(BagBase)
    public cookMeat: BagBase;
    @property(Node)
    public mtc: Node;

    private mtcList: Node[] = [];
    private stateList: number[] = [];

    @property(CCFloat)
    public speed: number = 1;
    private _time: number = 0;
    private _ttTime: number[] = []

    // private tempProp: Prop;


    protected start(): void {
        for (let i = 0; i < this.mtc.children.length; i++) {
            let mtc = this.mtc.children[i];
            this.mtcList.push(mtc);
            this._ttTime[i] = Number.MAX_VALUE;
            this.stateList[i] = 0;
        }
    }

    update(deltaTime: number) {
        this._time -= deltaTime;
        let index = -1;
        const layer = LayerManager.instance.getLayer(LayerEnum.Layer_2_sky);
        for (let i = 0; i < this._ttTime.length; i++) {
            const state = this.stateList[i];
            if (state == 1) {
                this._ttTime[i] -= deltaTime;
                if (this._ttTime[i] <= 0) {
                    this._ttTime[i] = 0.2;
                    const mtc = this.mtcList[i];
                    if (mtc.children.length) {
                        let prop = mtc.children[0].getComponent(Prop);
                        prop.remove();
                        AudioManager.inst.playOneShot(SoundEnum.Sound_meatTcook);
                        prop.node.removeFromParent();
                        prop = PropManager.instance.getProp(PropEnum.cookMeat);
                        TweenTool.scaleShake(prop.node);
                        layer.addChild(prop.node);
                        prop.node.setWorldPosition(mtc.worldPosition);
                        prop.node.setWorldRotation(mtc.worldRotation);
                        prop.subVisible(false);
                        JumppManager.instacne.jumpCurve(prop.node, this.cookMeat.placePropPos, 4, 5).onComplete(() => {
                            prop.subVisible(true);
                            this.cookMeat.addProp = prop;
                            prop.node.rotation = Quat.IDENTITY;
                        }).setDelay(this._ttTime[i]);
                    } else {
                        this.stateList[i] = 0;
                        this._ttTime[i] = Number.MAX_VALUE;
                        if (index == -1) {
                            index = i;
                        }
                    }
                }
            } else if (index == -1) {
                index = i;
            }
        }

        if (index == -1 || this._time > 0) {
            return;
        }
        if (this.meatBag.propCount) {
            this.stateList[index] = 1;
            const mtc = this.mtcList[index];
            this._time = 0.1;
            const prop: Prop = this.meatBag.prop;
            let pos = prop.node.worldPosition;
            layer.addChild(prop.node);
            prop.node.setWorldPosition(pos);
            prop.subVisible(false);
            JumppManager.instacne.jumpCurve(prop.node, mtc.worldPosition, 4, 5).onComplete(() => {
                // prop.node.rotation = mtc.rotation;
                mtc.addChild(prop.node);
                prop.node.setPosition(Vec3.ZERO);
                prop.node.rotation = Quat.IDENTITY;
                this._ttTime[index] = 1 / this.speed;
            });
        }

    }
}


