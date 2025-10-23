import { _decorator, Camera, ccenum, Component, director, Node, Rect, Scene, v3, Vec3, view } from 'cc';
import LayerManager, { LayerEnum } from '../../Base/LayerManager';
import PoolManager, { PoolEnum } from '../../Base/PoolManager';
import { PrefabsManager, PrefabsEnum } from '../../Base/PrefabsManager';
import Singleton from '../../Base/Singleton';
import { CameraMove } from '../../Base/CameraMove';
import { EffectTimePartRemove } from './EffectTimePartRemove';
import EventManager from '../../Base/EventManager';
import { EffectTimeRemove } from './EffectTimeRemove';
import { distanceSquared, isPointInCameraView, worldPosTNodePos } from '../../Tool/Index';
import { EffectEnum, EventEnum } from '../../Base/EnumIndex';
import AudioManager, { SoundEnum } from '../../Base/AudioManager';
const { ccclass, property } = _decorator;


const _dis: number = 0.1;

@ccclass('EffectManager')
export class EffectManager extends Singleton {


    private _effectListL: EffectSequence[][] = [];

    private _effectShowListL: EffectTimePartRemove[][] = []

    private effectPlayOver(remove: EffectTimePartRemove, effect: EffectEnum) {
        let ef = this._effectShowListL[effect];
        if (ef) {
            let index = ef.indexOf(remove);
            if (index != -1) {
                ef.splice(index, 1);
            }
        }
    }







    constructor() {
        super();
        EventManager.instance.on(EventEnum.Effect_Play_over, this.effectPlayOver, this);
    }



    public static get instance() {
        return this.getInstance<EffectManager>();
    }
    /**
     * 
     * @param pos 特效显示的位置
     * @param poolType 回收类型
     * @param type 类型
     * @param angle 角度
     */
    public addShowEffect(pos: Vec3, type: EffectEnum, scale: number = 1) {

        if (!isPointInCameraView(pos, CameraMove.instance.camera)) {
            return;
        }
        let ef = this._effectListL[type];
        if (!ef) {
            this._effectListL[type] = ef = [];
        }
        for (let i = 0; i < ef.length; i++) {
            let dis = distanceSquared(pos, ef[i].pos)
            if (dis <= _dis) {
                return;
            }
        }
        let sq = this.EffectSq;
        sq.scale = scale;
        sq.type = type;
        sq.pos.set(pos);
        this._effectListL[type].push(sq);
    }





    private showEffect(sq: EffectSequence) {
        let effect = PoolManager.instance.getPool<Node>(PoolEnum.effect + sq.type);
        if (!effect) {
            effect = PrefabsManager.instance.GetPrefabsIns(PrefabsEnum.effect, sq.type);
        }
        let layer = LayerManager.instance.getLayer(LayerEnum.Layer_2_sky);
        // effect.setScale(scale, scale, scale);
        layer.addChild(effect);
        effect.setWorldPosition(sq.pos);
        effect.active = true;
        effect.setScale(sq.scale, sq.scale, sq.scale);
        if (sq.type == EffectEnum.shopOver) {
            AudioManager.inst.playOneShot(SoundEnum.Sound_up);
        }


        return effect;
    }

    private coor: number = 0;

    private frameCount: number = 5;

    public frameReleaseSpecialEffects() {
        if (this._effectListL.length > 0) {
            for (let i = this.coor; i < this.frameCount; i++) {

                this._effectListL.forEach((sqList, type) => {
                    if (sqList && sqList.length) {
                        let sq = sqList.shift();
                        let isShow = true;
                        let showArr = this._effectShowListL[type];
                        if (!showArr) {
                            this._effectShowListL[type] = showArr = [];
                        }
                        for (let i = 0; i < showArr.length; i++) {
                            let dis = distanceSquared(sq.pos, showArr[i].node.worldPosition)
                            if (dis <= _dis) {
                                isShow = false;
                                break;
                            }
                        }
                        if (isShow) {
                            let effNode = this.showEffect(sq);
                            let er = effNode.getComponent(EffectTimePartRemove);
                            showArr.push(er);
                        }
                        PoolManager.instance.setPool(PoolEnum.EffectSq, sq);
                    }
                })

            }
        }
    }



    private get EffectSq() {
        let sq = PoolManager.instance.getPool<EffectSequence>(PoolEnum.EffectSq);
        if (!sq) {
            sq = new EffectSequence();
        }
        return sq;
    }


}

class EffectSequence {
    public type: EffectEnum;
    public pos: Vec3 = v3();
    public scale: number = 1;
}


