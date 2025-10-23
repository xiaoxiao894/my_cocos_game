import { _decorator, Component, Node } from 'cc';
import { App } from '../App';
import { Arrow3D } from './Arrow3D';
import { ArroePath } from './ArroePath';
import { EnemyBear } from '../Entitys/EnemyBear';
import { GlobeVariable } from '../core/GlobeVariable';
const { ccclass, property } = _decorator;

@ccclass('GuideManager')
export class GuideManager {
    //引导当前步骤
    private guideCurStep: number = 1;
    //引导阶段
    public guidePhase: number = 1;

    //引导当前执行到的步骤
    public executingStep: number = 0;

    private static _instance: GuideManager = null;

    private arrowPath: ArroePath = null;
    arrow3dComp: Arrow3D = null;

    private guideList: Array<Node> = [] //引导节点 索引位置
    private guideStepJson: any = {};
    public static get Instance() {
        if (this._instance == null) {
            this._instance = new GuideManager();
        }
        return this._instance;
    }
    
    // 清理资源
    // destroy() {
    //     if (this.arrowPath) {
    //         this.arrowPath.clearArrows();
    //         if (this.arrowPath.node) {
    //             this.arrowPath.node.destroy();
    //         }
    //         this.arrowPath = null;
    //     }
    // }


    init() {
        this.guideList = App.sceneNode.guideList;
        let arrow3d = App.guidArrow3D;
        arrow3d.setParent(App.sceneNode.guideParent);
        this.arrow3dComp = arrow3d.getComponent(Arrow3D);
        this.arrow3dComp.setActive(true);
        
        // // 创建节点并添加 ArroePath 组件
        // const arrowPathNode = new Node('ArrowPath');
        // arrowPathNode.setParent(App.sceneNode.guideParent);
        // this.arrowPath = arrowPathNode.addComponent(ArroePath);
        this.arrowPath = new ArroePath();
        
        this.jsonTablePhase1();
    }

    jsonTablePhase1() {
        let guideStepJson = {
            1: {
                "targetPos": this.guideList[0].worldPosition.clone(),
               // "targetNode": this.guideList[0],
                "isGuideComplate": false,
                "nextStep": 2,
                "extendNext": 3,
                "pass_": 1,
            },
            2: {
                "targetPos": this.guideList[1].worldPosition.clone(),
               // "targetNode": this.guideList[1],
                "isGuideComplate": false,
                "nextStep": 3,
                "extendNext": 0,
                "pass_": 2,
            },
            3: {
                "targetPos": this.guideList[4].worldPosition.clone(),
               // "targetNode": this.guideList[4],
                "isGuideComplate": false,
                "nextStep": 0,
                "extendNext": 0,
                "pass_": 5,
            },
            //4 开始是阶段2的 单独的逻辑
            4: {
                "targetPos": this.guideList[5].worldPosition.clone(),
                "isGuideComplate": false,
                "nextStep": 5,
                "extendNext": 0,
                "pass_": 6,
            },
            5: {
                "targetPos": this.guideList[2].worldPosition.clone(),
                "isGuideComplate": false,
                "nextStep": 6,
                "extendNext": 7,
                "pass_": 3,
            },
            6: {
                "targetPos": this.guideList[3].worldPosition.clone(),
                "isGuideComplate": false,
                "nextStep": 7,
                "extendNext": 0,
                "pass_": 4,
            },
            7: {
                "targetPos": this.guideList[6].worldPosition.clone(),
                "isGuideComplate": false,
                "nextStep": 8,
                "extendNext": 0,
                "pass_": 7,
            },
            8: {
                "targetPos": this.guideList[7].worldPosition.clone(),
                "isGuideComplate": false,
                "nextStep": 9,
                "extendNext": 10,
                "pass_": 8,
            },
            9: {
                "targetPos": this.guideList[8].worldPosition.clone(),
                "isGuideComplate": false,
                "nextStep": 10,
                "extendNext": 0,
                "pass_": 9,
            },
            10: {
                "targetPos": this.guideList[9].worldPosition.clone(),
                "isGuideComplate": false,
                "nextStep": 0,
                "extendNext": 0,
                "pass_": 10,
            },
            11: {
                "targetPos": this.guideList[10].worldPosition.clone(),
                "isGuideComplate": false,
                "nextStep": 0,
                "extendNext": 0,
                "pass_": 0,
            },

        }
        this.guideStepJson = guideStepJson;
    }
    phase2() {
        this.guidePhase = 2;
        this.executingStep = 4;
        this.arrow3dComp.node.active = false;
        this.arrowPath.clearArrows();
        this.guideCurStep = 4;
    }
    //参数为了直观看到引导步骤不传也可以
    // setGuideStep(num: number) {
    //     if(this.guideStepJson[num].isGuideComplate == true){
    //         this.guideCurStep = this.guideStepJson[num].nextStep;
    //         if(this.guideStepJson[this.guideCurStep].isGuideComplate == true){
    //             this.guideCurStep = this.guideStepJson[this.guideCurStep].nextStep;
    //         }
    //     }
    // }
    // setGuideStep(num: number) {
    //     // 从指定步骤开始查找
    //     let currentStep = num;

    //     // 循环查找第一个未完成的步骤
    //     while (this.guideStepJson[currentStep]) {
    //         if (!this.guideStepJson[currentStep].isGuideComplate) {
    //             // 找到未完成的步骤，更新当前步骤并退出循环
    //             this.guideCurStep = currentStep;
    //             return;
    //         }

    //         // 如果当前步骤已完成，继续查找下一步
    //         currentStep = this.guideStepJson[currentStep].nextStep;

    //         // 如果下一步为0（结束标志），则退出循环
    //         if (currentStep === 0) {
    //             break;
    //         }
    //     }

    //     // 如果所有步骤都已完成，将当前步骤设为0
    //     this.guideCurStep = 0;
    // }
    setGuideStepCompLate(num: number) {
        this.guideStepJson[num].isGuideComplate = true;
    }
    setNextGuideStep(num: number) {
        this.guideCurStep = num;
        //this.guideStepJson[num].isGuideComplate = false;
    }

    nexStep(nextStep: number = 0) {
        if (nextStep == 0) {
            this.guideCurStep = this.guideStepJson[this.guideCurStep].nextStep;
        } else {
            this.guideCurStep = this.guideStepJson[this.guideCurStep].extendNext;
        }
        //return this.guideCurStep = this.guideStepJson[this.guideCurStep].nextStep;
    }

    // 检查最近的敌人（优先锁定当前目标，死亡后再更新）
    private currentTargetEnemy: EnemyBear = null;
    resetTargetEnemy(){
        this.currentTargetEnemy = null;
    }
    checkRange() {
        // 1. 先检查当前锁定的敌人是否有效（存在且未死亡）
        if (this.currentTargetEnemy
            && this.currentTargetEnemy.hp > 0) {
            return this.currentTargetEnemy.node.worldPosition.clone();
        }

        // 2. 若当前目标无效，重新查找最近的存活敌人
        let minDis = Number.MAX_VALUE;
        let minEnemy: EnemyBear = null;
        let enemyList = App.sceneNode.enemyParent.children;

        for (let i = 0; i < enemyList.length; i++) {
            const enemyNode = enemyList[i];
            // 跳过已销毁的节点
            if (!enemyNode.isValid) continue;

            const enemy = enemyNode.getComponent(EnemyBear);
            // 跳过已死亡的敌人（根据实际项目中敌人死亡的判断逻辑调整）
            if (!enemy || enemy.hp <= 0) continue;

            // 计算与玩家的距离
            const enemyPos = enemy.node.worldPosition.clone();
            const playerPos = App.playerController.getPlayer().node.worldPosition.clone();
            const distance = enemyPos.subtract(playerPos).length();

            // 记录最近的敌人
            if (distance < minDis) {
                minDis = distance;
                minEnemy = enemy;
            }
        }

        // 3. 更新当前锁定的敌人
        this.currentTargetEnemy = minEnemy;

        // 4. 返回目标位置（若无敌人则返回玩家位置）
        return minEnemy?.node.worldPosition.clone()
            ?? App.playerController.getPlayer().node.worldPosition.clone();
    }
    update(dt) {
        if (this.guideCurStep == 0) {

            return;
        }
        if (this.guidePhase == 1) {//第一阶段引导
         //   
            if (this.guideStepJson[this.guideCurStep].isGuideComplate == false && App.playerController.getPlayer().coinNum > 0) {
                this.resetTargetEnemy();
                if (this.arrow3dComp) {
                    this.arrow3dComp.playFloatingEffect(dt, this.guideStepJson[this.guideCurStep].targetPos);
                }
                if (this.arrowPath) {
                    this.arrowPath.createArrowPathTo(this.guideStepJson[this.guideCurStep].targetPos);

                }
            } else {
                if (this.arrow3dComp) {
                    this.arrow3dComp.playFloatingEffect(dt, this.checkRange());
                }
                if (this.arrowPath) {
                    this.arrowPath.createArrowPathTo(this.checkRange());
                }
            }
            // 现在调用update方法处理箭头移动
            this.arrowPath.update(dt);
        } else if (this.guidePhase == 2) {//第二阶段引导
            let bodyCoin = App.playerController.getPlayer().coinNum; //人身上的金币
            let goldMineCoin = Math.max(0, App.goldMineController.getGoldMineNum());//金矿上的金币
            let allCoin = bodyCoin //+ goldMineCoin; //总体组合金币

            let pass = this.guideStepJson[this.guideCurStep].pass_;
            let { curCoin: cur, maxCoin: max } = GlobeVariable.handVoer[`pass_${pass}`];
            //差多少可以解锁的地块
            let remaining = Math.max(0, max - cur);

            if (this.guideStepJson[this.guideCurStep].isGuideComplate == false && allCoin >= remaining) {
                if (!this.arrow3dComp.node.active) {
                    this.arrow3dComp.node.active = true;
                }
                if (this.arrow3dComp) {
                    this.arrow3dComp.playFloatingEffect(dt, this.guideStepJson[this.guideCurStep].targetPos);
                }
                if (this.arrowPath) {
                    this.arrowPath.createArrowPathTo(this.guideStepJson[this.guideCurStep].targetPos);

                }
            } else {// if (goldMineCoin > 0)
                if (!this.arrow3dComp.node.active) {
                    this.arrow3dComp.node.active = true;
                }
                if (this.arrow3dComp) {
                    this.arrow3dComp.playFloatingEffect(dt, this.guideStepJson[11].targetPos);
                }
                if (this.arrowPath) {
                    this.arrowPath.createArrowPathTo(this.guideStepJson[11].targetPos);

                }
            }
            //  else {

            //     this.arrow3dComp.node.active = false;
            //     this.arrowPath.clearArrows();

            // }
            // 现在调用update方法处理箭头移动
            this.arrowPath.update(dt);
        }

    }

}