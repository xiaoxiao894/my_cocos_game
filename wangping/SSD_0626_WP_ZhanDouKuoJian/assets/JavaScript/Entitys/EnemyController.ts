import { _decorator, Node, tween, Vec3 } from 'cc';
import { EnemyBear } from './EnemyBear';
import { App } from '../App';
import { Simulator } from '../RVO/Simulator';
import RVOUtils from '../RVO/RVOUtils';
import { GlobeVariable } from '../core/GlobeVariable';


export class EnemyController {

    private enemyList: EnemyBear[] = [];//敌人列表
    private _radius: number = 1.5; //敌人半径
    private _speed: number = 6; //敌人速度

    public static _instance: EnemyController = null;

    public static get Instance() {
        if (this._instance == null) {
            this._instance = new EnemyController();
        }
        return this._instance;
    }

    public init() {

    }

    //n级敌人随机出现的位置
    public creatEnemyByLevel(level: number) {

        let posNodeList: Node[] = [];
        switch (level) {
            case 1:
                posNodeList = App.sceneNode.enemyBirthLevel_1;
                break;
            case 2:
                posNodeList = App.sceneNode.enemyBirthInit;
                break;
        }
        // 检查 enemyBirthLevel_n 数组是否存在且不为空
        if (posNodeList.length > 0) {
            const randomIndex = Math.floor(Math.random() * posNodeList.length);
            // 设置 prefab 的位置为随机选择的位置
            this.realCreatEnemy(posNodeList[randomIndex].worldPosition.clone());
        } else {
            console.error(`enemyBirthLevel_${level} 数组不存在或为空！`);
        }
    }

    getEnemyList() {
        return this.enemyList;
    }
    resetEnemyAttackPaling() {
        for (let index = 0; index < this.enemyList.length; index++) {
            const enemy = this.enemyList[index];
            enemy.resetPaling();
        }
    }


    public removeEnemy(enemy: EnemyBear) {
        const index = this.enemyList.indexOf(enemy);
        if (index !== -1) {
            this.enemyList.splice(index, 1); // 从列表中移除
        }
        // console.log(`remove enemy ,num ${this.enemyList.length}`);
    }
    /** 真正创建怪 */
    private realCreatEnemy(pos: Vec3) {
        let prefab = App.poolManager.getNode(GlobeVariable.entifyName.EnemyBear);
        prefab.parent = App.sceneNode.enemyParent;
        prefab.setWorldPosition(pos);//init里用到了位置，放init前边
        prefab.active = true;
        let enemyBear = prefab.getComponent(EnemyBear);
        enemyBear.init();
        this.enemyList.push(enemyBear);
        // console.log(`push enemy ,num ${this.enemyList.length}`);



        //出现动画


        tween(prefab)
            .to(0.15, { scale: new Vec3(1, 1.2, 1) }, { easing: 'quadOut' })
            .to(0.05, { scale: new Vec3(1.8, 1.8, 1.8) }, { easing: 'quadOut' })

            .call(() => {
                const mass = 1;
                const agentId = Simulator.instance.addAgent(
                    RVOUtils.v3t2(pos),
                    this._radius,
                    this._speed,
                    null,
                    mass
                );

                const agentObj = Simulator.instance.getAgentByAid(agentId);
                agentObj.neighborDist = this._radius * 2.5;
                enemyBear.agentHandleId = agentId;
            })
            .start();
    }

    public update(dt: number) {
        for (let index = 0; index < this.enemyList.length; index++) {
            const enemy = this.enemyList[index];
            enemy?.getComponent(EnemyBear)?.moveByRvo(dt);
        }
    }
}


