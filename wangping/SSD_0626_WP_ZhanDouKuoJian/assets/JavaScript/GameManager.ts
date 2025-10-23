import { _decorator, approx, Component, director, Node, Vec3 } from 'cc';
import { EnemyController } from './Entitys/EnemyController';
import { App } from './App';
import { Simulator } from './RVO/Simulator';
import { GlobeVariable } from './core/GlobeVariable';
import RVOObstacles from './RVO/RVOObstacles';
import { Vector2 } from './RVO/Common';
const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager {
    private isStatrGame = false;
    private delayedTime: number = 1;
    private addTime: number = 0
    startGame() {
        App.guideManager.init();
        this.isStatrGame = true;
        App.palingAttack.setPaling(1);
        // App.enemyController.init();
        Simulator.instance.setAgentDefaults(60, 3, 1, 0.1, 14, 80, new Vector2(0, 0));
        this.addRvoObstacle();

    }
    // 添加障碍物
    addRvoObstacle() {
        let tempList = [];
        const scene1Physics = App.sceneNode.PhysicsPaling;

        const level_1 = scene1Physics.getChildByName("palingLevel_1_1");
        RVOObstacles.addOneObstacle(level_1);

        const level_2 = scene1Physics.getChildByName("palingLevel_3_1");
        RVOObstacles.addOneObstacle(level_2);

        Simulator.instance.processObstacles();


       // Simulator.instance.processObstacles();
    }
    private initEnemyTime:number = 0;
    private initEnemyTimeLimit:number = 1;

    private temp = 1; //当前出生的怪物数量
    update(dt: number) {

        if (this.isStatrGame) {
            this.addTime += dt;
            //间隔多少秒创建一波怪
            if (this.addTime >= GlobeVariable.enemyDelayedTime) {
                this.addTime = 0;
                this.temp++;
                if (App.enemyController.getEnemyList().length >= GlobeVariable.allEnemyNumLimit) return;
                this.produceEnemyBear();
            }
            // rvo 更新逻辑坐标
            Simulator.instance.run(dt);
            App.enemyController.update(dt);
            // this.playerAttackEnemy();
            App.playerController.update(dt);
            App.parterController.update(dt);
            App.guideManager.update(dt);
        }
    }

    produceEnemyBear() {
        // this.initEnemyTime += 0.1;
        // if(this.initEnemyTime <= this.initEnemyTimeLimit){
            
        //     App.enemyController.creatEnemyByLevel(2);
        // }else{
            App.enemyController.creatEnemyByLevel(1);
      //  }

    }

}


