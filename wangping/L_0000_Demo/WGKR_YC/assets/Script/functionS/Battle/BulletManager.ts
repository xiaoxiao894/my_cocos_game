import { ccenum, instantiate, Prefab } from "cc";
import { BulletEnum } from "../../Base/EnumIndex";
import PoolManager, { PoolEnum } from "../../Base/PoolManager";
import { PrefabsManager, PrefabsEnum } from "../../Base/PrefabsManager";
import Singleton from "../../Base/Singleton";
import BulletBattle3D from "./Bullet/BulletBattle3D";
import { BattleTarget } from "./BattleTarger/BattleTarget";
import { ElectricknifeData } from "./Bullet/ElectricknifeData";
import { Lightning } from "db://assets/GameRes/Effect/Eff/light/Lightning";
import LayerManager, { LayerEnum } from "../../Base/LayerManager";




export default class BulletManager extends Singleton {

    public static get instance() {
        return this.getInstance<BulletManager>();
    }
    /**
     * 
     * @param bulletEnum 子弹类型
     * @param angle 角度
     * @param damage 伤害
     * @param repelPower 击退力度
     * @returns 
     */
    public shootBullet(bulletEnum: BulletEnum, angle: number, damage: number, repelPower: number) {

        let bullet = PoolManager.instance.getPool<BulletBattle3D>(PoolEnum.bullet + bulletEnum);
        if (!bullet) {
            let pre = PrefabsManager.instance.GetPrefabsIns(PrefabsEnum.bullet, bulletEnum);
            let node = instantiate(pre);
            bullet = node.getComponent(BulletBattle3D);
        }
        bullet.setBulletInfo(angle, damage, repelPower);
        bullet.node.active = true;
        return bullet;
    }
    /**
     * 
     * @param bulletEnum 子弹类型
     * @param angle 角度
     * @param damage 伤害
     * @param repelPower 击退力度
     * @returns 
     */
    public shootElectricknifeBullet() {

        let bullet = PoolManager.instance.getPool<ElectricknifeData>(PoolEnum.bullet + 99);
        if (!bullet) {
            bullet = new ElectricknifeData();
        }
        bullet.init();
        // bullet.setBulletInfo(angle, damage, repelPower);
        return bullet;
    }

    public get lightning() {
        let bullet = PoolManager.instance.getPool<Lightning>(PoolEnum.bullet + 1);
        if (!bullet) {
            const node = PrefabsManager.instance.GetPrefabsIns(PrefabsEnum.bullet, 1);
            bullet = node.getComponent(Lightning);
            const layer = LayerManager.instance.getLayer(LayerEnum.Layer_2_sky);
            layer.addChild(node);
        }
        bullet.setPosNode(null, null);
        bullet.node.active = true;
        return bullet;
    }

    /**
     * 
     * @param bulletEnum 子弹类型
     * @param angle 角度
     * @param damage 伤害
     * @param repelPower 击退力度
     * @returns 
    */
    // public shootBullet(bulletEnum: BulletEnum, angle: number, damage: number, repelPower: number) {

    //     let bullet = PoolManager.instance.getPool<BulletBattle3D>(PoolEnum.bullet + bulletEnum);
    //     if (!bullet) {
    //         let pre = PrefabsManager.instance.GetPrefabsIns(PrefabsEnum.bullet, bulletEnum);
    //         let node = instantiate(pre);
    //         bullet = node.getComponent(BulletBattle3D);
    //     }
    //     bullet.setBulletInfo(angle, damage, repelPower);
    //     bullet.node.active = true;
    //     return bullet;
    // }




}