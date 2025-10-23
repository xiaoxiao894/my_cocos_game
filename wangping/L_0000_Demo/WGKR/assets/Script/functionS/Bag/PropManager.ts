import { v3, Vec3 } from "cc";
import PoolManager, { PoolEnum } from "../../Base/PoolManager";
import { PrefabsManager, PrefabsEnum } from "../../Base/PrefabsManager";
import Singleton from "../../Base/Singleton";
import { PropEnum } from "../../Base/EnumIndex";
import { Prop } from "./Prop";
import LayerManager, { LayerEnum } from "../../Base/LayerManager";
import { getPosRandomPos } from "../../Tool/Index";
import { JumppManager } from "../Jump/JumpManager";

export default class PropManager extends Singleton {

    public static get instance() {
        return this.getInstance<PropManager>();
    }

    private _propList: Prop[] = [];

    public getProp(id: PropEnum) {
        let prop = PoolManager.instance.getPool<Prop>(PoolEnum.Prop + id);
        if (!prop) {
            let node = PrefabsManager.instance.GetPrefabsIns(PrefabsEnum.prop, id);
            prop = node.getComponent(Prop);
        }
        prop.node.active = true;
        prop.node.setScale(Vec3.ONE);
        prop.propID = id;
        return prop;
    }

    public createProp(pos: Vec3, count: number, propId: PropEnum, scale: number = 1) {
        let layer = LayerManager.instance.getLayer(LayerEnum.Layer_2_sky);
        for (let i = 0; i < count; i++) {
            let prop = this.getProp(propId);
            layer.addChild(prop.node);
            prop.node.setWorldPosition(pos);
            let endpos = getPosRandomPos(pos, 5, Vec3.ZERO, v3(1, 0, 1));
            prop.node.setScale(scale, scale, scale);
            JumppManager.instacne.jumpCurve(prop.node, endpos, 3, 3).onComplete(() => {
                this._propList.push(prop);
            });
        }

    }

    public get propList() {
        return this._propList;
    }




}