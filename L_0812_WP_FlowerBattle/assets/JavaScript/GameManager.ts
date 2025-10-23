import { _decorator } from 'cc';
import { App } from './App';
import { Simulator } from './RVO/Simulator';
import { GlobeVariable } from './core/GlobeVariable';
import RVOObstacles from './RVO/RVOObstacles';
import { Vector2 } from './RVO/Common';
import { Flower } from './Entitys/Flower';
import { EventManager } from './core/EventManager';
import { EventType } from './core/EventType';
import { PlayerAttackFlower } from './Entitys/PlayerAttackFlower';
const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager {
    private isStatrGame = false;
    private delayedTime: number = 0.8;
    private addTime: number = 0

    private beetleDelayedTime: number = 0.3;
    private beetleAddTime: number = 0

    private blockTime: number = 0;
    private blockDelayedTime: number = 1;


    continueGame() {
        //  this.isStatrGame = false;

        this.delayedTime = 0.6;
        this.addTime = 0
        let characterData = App.dataManager.getCharacterById(4);
        if (characterData) {
            this.beetleDelayedTime = characterData.attackInterval;
            this.beetleAddTime = characterData.attackInterval
        }
        if (characterData.maxNum != -1) {
            GlobeVariable.beetleNumLimit = characterData.maxNum;
        }
        this.blockTime = 0;
        this.blockDelayedTime = 1;

        
        App.mapShowController.continueGame();
        App.playerController.continueGame();
        App.dropController.continueGame();
        App.guideManager.continueGame();
        GlobeVariable.continueGame();
        App.sceneNode.enemyParent.children.forEach((item) => {
            item.removeFromParent();
            item.destroy();
        })
        App.sceneNode.bloodParent.children.forEach((item) => {
            item.removeFromParent();
            item.destroy();
        })
        App.sceneNode.effectParent.children.forEach((item) => {
            item.removeFromParent();
            item.destroy();
        })
        App.sceneNode.coinParent.children.forEach((item) => {
            item.removeFromParent();
            item.destroy();
        })
        App.sceneNode.enemyParent.removeAllChildren();
        App.enemyController.continueGame();
        App.sceneNode.coinParent.removeAllChildren();
        App.sceneNode.effectParent.removeAllChildren();
        App.sceneNode.guideParent.removeAllChildren();
        App.sceneNode.flower.getComponent(Flower).continueGame();
        App.sceneNode.attackFlower.getComponent(PlayerAttackFlower).continueGame();
        App.sceneNode.GameEnd.active = false;
        GlobeVariable.isGameEnd = false;
        App.sceneNode.enemyParent.active = false;
        GlobeVariable.isStartGame = false;
        //拦截拒马是否存在
        GlobeVariable.initEnemyBirthPosCurUnm = 0;
        GlobeVariable.isBlock = false;
        GlobeVariable.isFirstBlock = true;
        GlobeVariable.blockLockNum = 0;
        GlobeVariable.blockRest = true; //拒马交付区域是否显示
        GlobeVariable.blockIndex = 0;
        GlobeVariable.restQueue = false;
        GlobeVariable.rvoRestTime = 0.6;
        GlobeVariable.rvoRestTimeLimit = 0.6;
        GlobeVariable.beetleIsMove = false;
        GlobeVariable.beetleIsMoveEnemy = false;
        //甲虫的引导是否结束 结束第一次时候移动想镜头
        GlobeVariable.isBeetleGuild = false;
        GlobeVariable.beetleLockNum = 0;
        GlobeVariable.enemySpiderNumBig = 10;
        GlobeVariable.curEnemySpiderNum = 1;
        GlobeVariable.bigHp = 5;
        GlobeVariable.beetleNumLimit = 10;
        GlobeVariable.beetleCurNum = 0;
        GlobeVariable.globCoinNum = 0;
        //金币初始数量
        GlobeVariable.coinStartNum = 5;
        //当前碰撞的区域
        GlobeVariable.g_curArea = 1;
        GlobeVariable.playerLevel = 0;
        EventManager.instance.emit(EventType.ContinueCoin);

        this.startGame();

    }
    startGame() {
        App.guideManager.init();
        this.isStatrGame = true;
        //     App.palingAttack.setPaling(1);
        Simulator.instance.setAgentDefaults(60, 3, 1, 0.1, 14, 80, new Vector2(0, 0));
        this.addRvoObstacle();
        let characterData = App.dataManager.getCharacterById(4);
        if (characterData) {
            this.beetleDelayedTime = characterData.attackInterval;
            this.beetleAddTime = characterData.attackInterval;
        }
        if (characterData.maxNum != -1) {
            GlobeVariable.beetleNumLimit = characterData.maxNum;
        }

    }
    // 添加障碍物
    addRvoObstacle() {
        const obstacleParrent = App.sceneNode.obstacleParrent;
        obstacleParrent.children.forEach((item) => {
            RVOObstacles.addOneObstacle(item);

        })

        // RVOObstacles.addOneObstacle(level_1);  
        Simulator.instance.processObstacles();
    }
    private temp = 1; //当前出生的怪物数量
    update(dt: number) {
        if (GlobeVariable.isGameEnd) return;
        if (!GlobeVariable.blockRest) {

            this.blockTime += dt;
            if (this.blockTime >= this.blockDelayedTime) {
                this.blockTime = 0;
                GlobeVariable.blockRest = true;
                App.mapShowController.restBlock1();
            }

        }
        if (this.isStatrGame) {
            this.addTime += dt;
            //间隔多少秒创建一波怪
            if (this.addTime >= this.delayedTime) {
                this.addTime = 0;
                this.temp++;
                if ((App.enemyController.getEnemyList().length + App.enemyController.getEnemyRvoList().length) >= GlobeVariable.allEnemyNumLimit) return;
                // if (!GlobeVariable.beetleIsMoveEnemy) {
                this.produceEnemySpider();
                // }

            }
            // rvo 更新逻辑坐标
            Simulator.instance.run(dt);

            App.enemyController.update(dt);
            // this.playerAttackEnemy();
            App.playerController.update(dt);
            App.beetleController.update(dt);
            App.guideManager.update(dt);
        }

        if (GlobeVariable.beetleIsMove) {
            GlobeVariable.beetleIsMoveEnemy = true;
            this.beetleAddTime += dt;
            if (this.beetleAddTime >= this.beetleDelayedTime) {
                this.beetleAddTime = 0;
                if (GlobeVariable.beetleCurNum >= GlobeVariable.beetleNumLimit) {
                    // GlobeVariable.beetleNumLimit = 10;
                    GlobeVariable.beetleCurNum = 0;
                    GlobeVariable.beetleIsMove = false;
                    setTimeout(() => {
                        App.mapShowController.showBeetleBubble();
                    }, 300);
                }
                App.beetleController.creatBeetleByLevel();

            }
        }

    }

    produceEnemySpider() {
        App.enemyController.creatEnemyByLevel(1);
    }

}


