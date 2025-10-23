import { _decorator, Component, Node, Vec3 } from 'cc';
import { App } from '../App';
import { Arrow3D } from './Arrow3D';
import { ArroePath } from './ArroePath';
import { GlobeVariable } from '../core/GlobeVariable';
import { EnemySpider } from '../Entitys/EnemySpider';
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

    private guideList: Record<string, Node> = {};//引导节点 索引位置
    private guideStepJson: any = {};
    public static get Instance() {
        if (this._instance == null) {
            this._instance = new GuideManager();
        }
        return this._instance;

    }
    continueGame() {
        this.guideCurStep = 1;
        this.executingStep = 0;
        this.guidePhase = 1;
        this.guideList = {};
        App.sceneNode.guideList.forEach((node: Node) => {
            if (node.name) { // 假设节点有唯一名称属性（如 "UI_jianta"）
                this.guideList[node.name] = node;
            }
        });

        let arrow3d = App.guidArrow3D;
        arrow3d.setParent(App.sceneNode.guideParent);
        this.arrow3dComp = arrow3d.getComponent(Arrow3D);
        this.arrow3dComp.setActive(true);
        this.arrowPath = new ArroePath();
        this.jsonTablePhase2();
    }

    init() {
        //this.guideList = App.sceneNode.guideList;
        this.guideList = {};
        App.sceneNode.guideList.forEach((node: Node) => {
            if (node.name) { // 假设节点有唯一名称属性（如 "UI_jianta"）
                this.guideList[node.name] = node;
            }
        });

        let arrow3d = App.guidArrow3D;
        arrow3d.setParent(App.sceneNode.guideParent);
        this.arrow3dComp = arrow3d.getComponent(Arrow3D);
        this.arrow3dComp.setActive(true);
        this.arrowPath = new ArroePath();
        this.jsonTablePhase1();
    }
    jsonTablePhase2() {
        let guideStepJson = {
            1: {
                "targetPos": this.guideList["UI_jianta1"].worldPosition.clone(),
                "targetNode": this.guideList["UI_jianta1"],
                "isGuideComplate": false,
                "nextStep": 2,
                "extendNext": 0,
                "handOver": "UI_jianta",
            },
            2: {
                "targetPos": this.guideList["UI_juma1"].worldPosition.clone(),
                "targetNode": this.guideList["UI_juma1"],
                "isGuideComplate": false,
                "nextStep": 3,
                "extendNext": 0,
                "handOver": "UI_juma",
            },
            3: {
                "targetPos": this.guideList["UI_paota1"].worldPosition.clone(),
                "targetNode": this.guideList["UI_paota1"],
                "isGuideComplate": false,
                "nextStep": 4,
                "extendNext": 0,
                "handOver": "UI_paota",
            },
            4: {
                "targetPos": this.guideList["UI_shirenhua1"].worldPosition.clone(),
                "targetNode": this.guideList["UI_shirenhua1"],
                "isGuideComplate": false,
                "nextStep": 5,
                "extendNext": 0,
                "handOver": "UI_shirenhua",
            },
            5: {
                "targetPos": this.guideList["UI_jiachong1"].worldPosition.clone(),
                "targetNode": this.guideList["UI_jiachong1"],
                "isGuideComplate": false,
                "nextStep": 6,
                "extendNext": 0,
                "handOver": "UI_jiachong",
            },
            6: {
                "targetPos": this.guideList["UI_juma-0011"].worldPosition.clone(),
                "targetNode": this.guideList["UI_juma-0011"],
                "isGuideComplate": false,
                "nextStep": 0,
                "extendNext": 0,
                "handOver": "UI_juma-001",
            },
            7: {
                "targetPos": this.guideList["UI_jiachong-0011"].worldPosition.clone(),
                "targetNode": this.guideList["UI_jiachong-0011"],
                "isGuideComplate": false,
                "nextStep": 0,
                "extendNext": 0,
                "handOver": "UI_jiachong-001",
            },


        }
        this.guideStepJson = guideStepJson;
    }
    jsonTablePhase1() {
        let guideStepJson = {
            1: {
                "targetPos": this.guideList["UI_jianta1"].worldPosition.clone(),
                "targetNode": this.guideList["UI_jianta1"],
                "isGuideComplate": false,
                "nextStep": 2,
                "extendNext": 0,
                "handOver": "UI_jianta",
            },
            2: {
                "targetPos": this.guideList["UI_juma1"].worldPosition.clone(),
                "targetNode": this.guideList["UI_juma1"],
                "isGuideComplate": false,
                "nextStep": 3,
                "extendNext": 0,
                "handOver": "UI_juma",
            },
            3: {
                "targetPos": this.guideList["UI_paota1"].worldPosition.clone(),
                "targetNode": this.guideList["UI_paota1"],
                "isGuideComplate": false,
                "nextStep": 4,
                "extendNext": 0,
                "handOver": "UI_paota",
            },
            4: {
                "targetPos": this.guideList["UI_shirenhua1"].worldPosition.clone(),
                "targetNode": this.guideList["UI_shirenhua1"],
                "isGuideComplate": false,
                "nextStep": 5,
                "extendNext": 0,
                "handOver": "UI_shirenhua",
            },
            5: {
                "targetPos": this.guideList["UI_jiachong1"].worldPosition.clone(),
                "targetNode": this.guideList["UI_jiachong1"],
                "isGuideComplate": false,
                "nextStep": 6,
                "extendNext": 0,
                "handOver": "UI_jiachong",
            },
            6: {
                "targetPos": this.guideList["UI_juma-0011"].worldPosition.clone(),
                "targetNode": this.guideList["UI_juma-0011"],
                "isGuideComplate": false,
                "nextStep": 0,
                "extendNext": 0,
                "handOver": "UI_juma-001",
            },
            7: {
                "targetPos": this.guideList["UI_jiachong-0011"].worldPosition.clone(),
                "targetNode": this.guideList["UI_jiachong-0011"],
                "isGuideComplate": false,
                "nextStep": 0,
                "extendNext": 0,
                "handOver": "UI_jiachong-001",
            },


        }
        this.guideStepJson = guideStepJson;
    }


    setGuideStepCompLate(num: number) {
        this.guideStepJson[num].isGuideComplate = true;
    }
    setNextGuideStep(num: number) {
        this.guideCurStep = num;

    }
    nexStep(nextStep: number = 0) {
        if (nextStep == 0) {
            this.guideCurStep = this.guideStepJson[this.guideCurStep].nextStep;
        } else {
            this.guideCurStep = this.guideStepJson[this.guideCurStep].extendNext;
        }
    }
    nexPhase() {
        this.guidePhase += 1;
    }
    // 检查最近的敌人（优先锁定当前目标，死亡后再更新）
    private currentTarget: Node = null;
    // resetTargetEnemy(){
    //     this.currentTargetEnemy = null;
    // }
    checkRange() {
        // 1. 先检查当前锁定的敌人是否有效（存在且未死亡）
        if (this.currentTarget && this.currentTarget.parent == App.sceneNode.coinParent) {

            return this.currentTarget;
        }

        // 2. 若当前目标无效，重新查找最近的存活敌人
        let minDis = Number.MAX_VALUE;
        let minCoin: Node = null;
        let coinList = App.sceneNode.coinParent.children;

        for (let i = 0; i < coinList.length; i++) {
            const coin = coinList[i];
            // 跳过已销毁的节点
            if (!coin.isValid) continue;


            const randomIndex = Math.floor(Math.random() * 4);
            let pos = App.sceneNode.moveEndBlockPos.children[randomIndex].worldPosition
            let selfPos = coin.worldPosition.clone();
            // // 计算两点到世界原点的距离
            // const posDistance = pos.length();
            // const selfDistance = selfPos.length();
            // const isFartherFromOrigin = posDistance > selfDistance;
            // if (isFartherFromOrigin) {
            //     this.node.setWorldPosition(pos);
            // }
            // 获取自身前方向量（假设Z轴为前）
            const forward = coin.forward;
            // 计算目标相对于自身的向量
            const toTarget = pos.clone().subtract(selfPos);
            // 点积判断是否在前方（大于0为前方）
            const isInFront = toTarget.dot(forward) < 1.5;
            if (isInFront) {
                continue;
            }
            // 计算与玩家的距离
            const enemyPos = coin.worldPosition.clone();
            const playerPos = App.playerController.getPlayer().node.worldPosition.clone();
            const distance = enemyPos.subtract(playerPos).length();

            // 记录最近的敌人
            if (distance < minDis) {
                minDis = distance;
                minCoin = coin;
            }
        }

        // 3. 更新当前锁定的敌人
        this.currentTarget = minCoin;

        // 4. 返回目标位置（若无敌人则返回玩家位置）
        return minCoin;

    }

    update(dt) {
        if (!GlobeVariable.isCameraMoveEnd) return;
        // 无需引导时直接返回
        if (this.guideCurStep === -1 || this.guideCurStep === 0) return;

        // 缓存当前步骤数据
        const currentStep = this.guideStepJson[this.guideCurStep];
        // 提取箭头控制通用方法
        const showArrow = (targetPos) => {
            this.arrow3dComp.setActive(true);
            App.sceneNode.guideParent.active = true;
            this.arrow3dComp?.playFloatingEffect(dt, targetPos);
            let vv3 = new Vec3(targetPos.x, targetPos.y+2, targetPos.z);
            this.arrowPath?.createArrowPathTo(vv3);
        };
        const hideArrow = () => {
            App.sceneNode.guideParent.active = false;
            this.arrow3dComp.setActive(false);
        }

        switch (this.guidePhase) {
            case 1: // 第一阶段：引导解锁箭塔
                if (!currentStep.isGuideComplate && App.playerController.getPlayer().coinNum > 0) {
                    showArrow(currentStep.targetPos);
                } else {
                    hideArrow();
                }
                break;

            case 2: // 第二阶段：引导解锁拒马
                const handOverNam = currentStep.handOver;
                const lockCoin = GlobeVariable.handVoer[handOverNam].maxCoin - GlobeVariable.handVoer[handOverNam].curCoin;

                if (!currentStep.isGuideComplate && App.playerController.getPlayer().coinNum >= lockCoin && !GlobeVariable.isBlock) {
                    showArrow(currentStep.targetPos);
                } else {
                    const targetPos = this.checkRange();
                    targetPos instanceof Node ? showArrow(targetPos.worldPosition.clone()) : hideArrow();
                }
                break;

            case 3: // 第三阶段：引导拒马炮塔
            case 4: // 第四阶段：引导甲虫兵营
                const step2 = this.guideStepJson[2];
                const handOverNam1 = currentStep.handOver;
                const lockCoin1 = GlobeVariable.handVoer[handOverNam1].maxCoin - GlobeVariable.handVoer[handOverNam1].curCoin;
                const lockCoin2 = GlobeVariable.handVoer[step2.handOver].maxCoin - GlobeVariable.handVoer[step2.handOver].curCoin;

                if (GlobeVariable.blockLockNum < 2 && App.mapShowController.reunBlock1() && App.playerController.getPlayer().coinNum >= lockCoin2) {
                    showArrow(step2.targetPos);
                } else if (!currentStep.isGuideComplate && App.playerController.getPlayer().coinNum >= lockCoin1) {
                    showArrow(currentStep.targetPos);
                } else {
                    const targetPos = this.checkRange();
                    targetPos instanceof Node ? showArrow(targetPos.worldPosition.clone()) : hideArrow();
                }
                break;
            case 5: // 第五阶段：引导之终点拒马

                const step22 = this.guideStepJson[2];
                const lockCoin22 = GlobeVariable.handVoer[step22.handOver].maxCoin - GlobeVariable.handVoer[step22.handOver].curCoin;
                const step6 = this.guideStepJson[7];
                const lockCoin3 = GlobeVariable.handVoer[step6.handOver].maxCoin - GlobeVariable.handVoer[step6.handOver].curCoin;

                const handOverNam2 = currentStep.handOver;
                const lockCoin11 = GlobeVariable.handVoer[handOverNam2].maxCoin - GlobeVariable.handVoer[handOverNam2].curCoin;
                // if (GlobeVariable.blockLockNum < 2 && App.mapShowController.reunBlock1() && App.playerController.getPlayer().coinNum >= lockCoin22) {
                //     showArrow(step22.targetPos);
                // } else 

                if (GlobeVariable.beetleLockNum < 2 && App.mapShowController.retunBeetle1() && App.playerController.getPlayer().coinNum >= lockCoin3) {
                    showArrow(step6.targetPos);
                }
                else if (GlobeVariable.beetleLockNum >= 2 && !currentStep.isGuideComplate && App.playerController.getPlayer().coinNum >= lockCoin11) {
                    showArrow(currentStep.targetPos);
                }
                else {
                    const targetPos = this.checkRange();
                    targetPos instanceof Node ? showArrow(targetPos.worldPosition.clone()) : hideArrow();
                }

                break;



        }
    }

}


