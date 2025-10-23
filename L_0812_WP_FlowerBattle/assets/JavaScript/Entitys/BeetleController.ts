import { _decorator, Node, tween, Vec3 } from 'cc';
import { App } from '../App';
import { GlobeVariable } from '../core/GlobeVariable';
import { PlayerBeetle } from './PlayerBeetle';
export class BeetleController {

    private beetleList: PlayerBeetle[] = [];//冲锋甲虫列表

    public static _instance: BeetleController = null;

    public static get Instance() {
        if (this._instance == null) {
            this._instance = new BeetleController();
        }
        return this._instance;
    }
    public init() {

    }
    //n级敌人随机出现的位置
    public creatBeetleByLevel() {

        if (GlobeVariable.beetleCurNum >= GlobeVariable.beetleNumLimit) {
            return;
        }
        this.realCreatBeetle(App.sceneNode.beetleBirthPos.worldPosition.clone());
    }

    getBeetleList() {
        return this.beetleList;
    }

    public removeBeetle(beetle: PlayerBeetle) {

        const index = this.beetleList.indexOf(beetle);
        if (index !== -1) {
            this.beetleList.splice(index, 1); // 从列表中移除
        }
        if (this.beetleList.length <= 0) {
            GlobeVariable.beetleIsMoveEnemy = false;
            
        }
        console.log(`remove enemy ,num ${this.beetleList.length}`);
    }
    /** 真正创建怪 */
    private realCreatBeetle(pos: Vec3) {
        GlobeVariable.beetleCurNum++;

        let prefab = App.poolManager.getNode(GlobeVariable.entifyName.Beetle);
        prefab.parent = App.sceneNode.beetleParent;
        prefab.setWorldPosition(pos);//init里用到了位置，放init前边
        prefab.active = true;
        let beetle = prefab.getComponent(PlayerBeetle);

        this.beetleList.push(beetle);
        console.log(`push beetle ,num ${this.beetleList.length}`);

        //出现动画
        tween(prefab)
            .to(0.15, { scale: new Vec3(1, 1.2, 1) }, { easing: 'quadOut' })
            .to(0.05, { scale: new Vec3(1.44, 1.44, 1.44) }, { easing: 'quadOut' })

            .start();
    }

    public update(dt: number) {
        for (let index = 0; index < this.beetleList.length; index++) {
            const enemy = this.beetleList[index];
            enemy?.getComponent(PlayerBeetle)?.update(dt);
        }
    }
}


