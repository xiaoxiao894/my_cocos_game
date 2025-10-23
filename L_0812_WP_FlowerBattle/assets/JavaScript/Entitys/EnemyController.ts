import { _decorator, Node, SkeletalAnimation, tween, Vec3 } from 'cc';
import { App } from '../App';
import { GlobeVariable } from '../core/GlobeVariable';
import { EnemySpider } from './EnemySpider';


export class EnemyController {

    private enemyList: EnemySpider[] = [];//敌人列
    private enemInitList = {};
    private enemyRvoList: EnemySpider[] = [];//敌人列表

    public static _instance: EnemyController = null;

    public static get Instance() {
        if (this._instance == null) {
            this._instance = new EnemyController();
        }
        return this._instance;
    }

    public init() {
        if (App.sceneNode.enemyParent.children.length > 0) {
            App.sceneNode.enemyParent.children.forEach((item) => {
                let enemy = item.getComponent(EnemySpider);
                // 确保enemInitList中存在对应的对象
                if (!this.enemInitList[enemy.node.name]) {
                    this.enemInitList[enemy.node.name] = {};
                }
                // 然后再设置属性
                this.enemInitList[enemy.node.name].isAttack = true;
                if(enemy.spiderType == 0){
                    this.enemInitList[enemy.node.name].entifyName = GlobeVariable.entifyName.EnemySpiderL;
                }else{
                    this.enemInitList[enemy.node.name].entifyName = GlobeVariable.entifyName.EnemySpider;
                }
                this.enemInitList[enemy.node.name].spiderType = enemy.spiderType;
                if(enemy.spiderType == 0){
                    this.enemInitList[enemy.node.name].speedBig = 1.5;
                }else{
                    this.enemInitList[enemy.node.name].speedBig = 1;
                }
                
                this.enemInitList[enemy.node.name].currentTargetIndex = enemy.currentIndex;
                this.enemInitList[enemy.node.name].worldPosition     = enemy.node.worldPosition.clone(); // 使用clone避免引用问题
                this.enemInitList[enemy.node.name].worldRotation     = enemy.node.worldRotation.clone(); // 使用clone避免引用问题
                this.enemInitList[enemy.node.name].spiderHp = enemy.spiderHp;
                if (enemy) {
                    enemy.isAttack = true;
                    this.enemyList.push(enemy);
                }
            })
        }
    }
    continueGame() {
        this.enemyList.length = 0;
        this.enemyRvoList.length = 0;
        this.enemyList = [];//敌人列表
        this.enemyRvoList = [];//敌人列表
        for (let key in this.enemInitList) {
            let prefab = App.poolManager.getNode(this.enemInitList[key].entifyName);
            prefab.parent = App.sceneNode.enemyParent;
            prefab.setWorldPosition(this.enemInitList[key].worldPosition);
            prefab.setWorldRotation(this.enemInitList[key].worldRotation);
            prefab.active = true;
            prefab.getComponent(SkeletalAnimation).getState("walk_f_1").speed = this.enemInitList[key].speedBig;

            let enemySpider = prefab.getComponent(EnemySpider);
            enemySpider.spiderName = "spider";
            enemySpider.poolName = this.enemInitList[key].entifyName;
            

            enemySpider.init();
            enemySpider.setHp(this.enemInitList[key].spiderHp);
            enemySpider.currentTargetIndex = this.enemInitList[key].currentTargetIndex;
            enemySpider.isAttack = true;
            this.enemyList.push(enemySpider);
        }
       // this.enemInitList = null;
       // this.enemInitList = {};
    }
    //n级敌人随机出现的位置
    public creatEnemyByLevel(level: number) {
        if( !GlobeVariable.isStartGame ) return;
        this.realCreatEnemy(App.sceneNode.enemyBirthPos.worldPosition.clone());
    }

    getEnemyList() {
        return this.enemyList;
    }
    getEnemyRvoList() {
        return this.enemyRvoList;
    }
    /**
     * 添加敌人到RVO寻找列表
     * 从对列列表删除
     * @param enemy 
     */
    setEnemyRvoList(enemy: EnemySpider) {
        this.enemyRvoList.push(enemy);
        this.removeEnemy(enemy);

    }

    removeEnemyRvo(enemy: EnemySpider) {
        const index = this.enemyRvoList.indexOf(enemy);
        if (index !== -1) {
            this.enemyRvoList.splice(index, 1); // 从列表中移除
        }
    }
    restRvoEnemy() {
        this.enemyRvoList.forEach((enemy, index) => {
            setTimeout(() => {
                if (enemy) {  // 额外检查，确保元素存在
                    enemy.rvoLastMove = true;
                }
            }, index * 300);
        });
    }

    // restRvoEnemy() {
    //     for (let index = 0; index < this.enemyRvoList.length; index++) {
    //         setTimeout(() => {
    //             const enemy = this.enemyRvoList[index];
    //             if (enemy) {
    //                 enemy.rvoLastMove = true;
    //             }
    //         }, index * 500);

    //     }
    // }

    // resetEnemyAttackPaling() {
    //     for (let index = 0; index < this.enemyList.length; index++) {
    //         const enemy = this.enemyList[index];
    //         enemy.resetPaling();
    //     }
    // }


    public removeEnemy(enemy: EnemySpider) {
        const index = this.enemyList.indexOf(enemy);
        if (index !== -1) {
            this.enemyList.splice(index, 1); // 从列表中移除
        }
        console.log(`remove enemy ,num ${this.enemyList.length}`);
    }
    /** 真正创建怪 */
    private realCreatEnemy(pos: Vec3) {
        //  GlobeVariable.curEnemySpiderNum++;
        //let scaleT = 1.8
        // 提取公共逻辑，减少重复代码
        let prefabName = GlobeVariable.curEnemySpiderNum > GlobeVariable.enemySpiderNumBig
            ? GlobeVariable.entifyName.EnemySpider
            : GlobeVariable.entifyName.EnemySpiderL;

        let prefab = App.poolManager.getNode(prefabName);
        prefab.parent = App.sceneNode.enemyParent;
        prefab.setWorldPosition(pos);
        prefab.active = true;


        let enemySpider = prefab.getComponent(EnemySpider);
        prefab.getComponent(SkeletalAnimation).getState("walk_f_1").speed = 1.5;
        enemySpider.spiderName = "spider";
        enemySpider.poolName = prefabName;

        enemySpider.init();
        // if(GlobeVariable.initEnemyBirthPosCurUnm <= GlobeVariable.initEnemyBirthPosNumLimit){
        //     prefab.setWorldPosition(App.sceneNode.enemyBirthPos1.worldPosition.clone());
        //     enemySpider.setSpiderPos();
        //     GlobeVariable.initEnemyBirthPosCurUnm++;
        // }

        setTimeout(() => {
            enemySpider.isAttack = true;

        }, 3);

        this.enemyList.push(enemySpider);
        console.log(`push enemy ,num ${this.enemyList.length}`);

        // 根据类型设置不同属性
        if (GlobeVariable.curEnemySpiderNum > GlobeVariable.enemySpiderNumBig) {
            GlobeVariable.curEnemySpiderNum = 0;
            prefab.getComponent(SkeletalAnimation).getState("walk_f_1").speed = 1;
            let data = App.dataManager.getMonsterById(2);
            if (data) {
                enemySpider.Idtype = data.Idtype;
                enemySpider.hp = data._hp;
                enemySpider.maxHp = data._hp;
                enemySpider.recordHp = data._hp;
                enemySpider.hitPow = data._hitPow;
            }

            // 实现大蜘蛛的缩放
            // prefab.setScale(2.8, 2.8, 2.8); // 假设使用这样的方法设置缩放
        }

        // 统一计数逻辑，无论大小蜘蛛都计入总数
        GlobeVariable.curEnemySpiderNum++;





        // //出现动画
        // tween(prefab)
        //     .to(0.15, { scale: new Vec3(1, 1.2, 1) }, { easing: 'quadOut' })
        //     .to(0.05, { scale: new Vec3(scaleT, scaleT, scaleT) }, { easing: 'quadOut' })

        //     .start();
    }

    public update(dt: number) {
        for (let index = 0; index < this.enemyList.length; index++) {
            const enemy = this.enemyList[index];
            enemy?.getComponent(EnemySpider)?.update(dt);
        }
        for (let index = 0; index < this.enemyRvoList.length; index++) {
            const enemy = this.enemyRvoList[index];
            enemy?.getComponent(EnemySpider)?.update(dt);
        }
    }
}