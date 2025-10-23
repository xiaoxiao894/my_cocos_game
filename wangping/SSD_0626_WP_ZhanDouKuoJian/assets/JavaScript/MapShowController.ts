import { _decorator, Component, Label, Node, tween, Vec3, Animation, find, Camera } from 'cc';
import { GlobeVariable } from './core/GlobeVariable';
import { CloudParticleEffect } from './core/CloudParticleEffect';
import { App } from './App';
import { MiningMachine } from './Entitys/MiningMachine';
import RVOObstacles from './RVO/RVOObstacles';
import { Simulator } from './RVO/Simulator';
import { SoundManager } from './core/SoundManager';
import { GuideManager } from './Guide/GuideManager';
import { palingTs } from './palingTs';
import { physicsForce } from './core/physicsForce';
import { physicsForce1 } from './core/physicsForce1';
const { ccclass, property } = _decorator;

@ccclass('MapShowController')
/**地图显示控制器
 * 按照场景拼音命名以防忘了
 * 
 */

export class MapShowController extends Component {

    @property({ type: Number, tooltip: "背景音乐间隔时间值" })
    bgmTime: number = 0.077;

    @property({ type: Node, tooltip: "地面升级" })
    dimianshengji: Node = null;

    @property({ type: Node, tooltip: "金矿的区域" })
    areas: Node = null;

    @property({ type: Node, tooltip: "所有的围栏" })
    weiqiang: Node = null;

    @property({ type: Node, tooltip: "主建筑" })
    building: Node = null;

    @property({ type: Node, tooltip: "电线的父类" })
    secondShow: Node = null;


    @property({ type: Node, tooltip: "所有的云" })
    yun: Node = null;

    @property({ type: Node, tooltip: "电塔基类" })
    dianta: Node = null;

    @property({ type: Node, tooltip: "二级电塔" })
    erjidianta: Node = null;

    @property({ type: Node, tooltip: "结束界面" })
    endGameNode: Node = null;


    @property({ type: Node, tooltip: "升级前地面" })
    upgradeBeforeGround: Node = null;

    @property({ type: Node, tooltip: "升级后地面" })
    upgradeAfterGround: Node = null;

    @property({ type: Node, tooltip: "采矿机特效左" })
    miningMachineEffctL: Node = null;


    @property({ type: Number, tooltip: "围墙Y从0 到 1" })
    palingTime0: Number = 0.03;

    @property({ type: Number, tooltip: "围墙Y从1 到 1.1" })
    palingTime1: Number = 0.2;

    @property({ type: Number, tooltip: "围墙Y从1.1 到 1" })
    palingTime2: Number = 0.1;



    private showLevelPylonNum: number = 0;
    private paling34: number = 0;
    private paling89: number = 0;

    private lensHigh: number = 10;
    private lensNum: number = 0;



    protected start(): void {
        this.upgradeBeforeGround.active = true;
        this.upgradeAfterGround.active = false;
        this.showMapLevel_1();
        this.initAreaLable();
    }
    lensHighFunc() {
        this.lensNum++;
        let mainCamera = find("Main Camera").getComponent(Camera);
        if (this.lensNum == 2) {
            tween(mainCamera)
                .to(0.2, { orthoHeight: mainCamera.orthoHeight + this.lensHigh - 8 })
                .call(() => {

                })
                .start();
        } else if (this.lensNum == 3) {
            tween(mainCamera)
                .to(0.2, { orthoHeight: mainCamera.orthoHeight + this.lensHigh - 8 })
                .call(() => {

                })
                .start();
        } else if (this.lensNum == 4) {
            tween(mainCamera)
                .to(0.2, { orthoHeight: mainCamera.orthoHeight + this.lensHigh - 6 })
                .call(() => {

                })
                .start();
        }

    }
    //左边房子动作
    leftHouseAni() {
        let leftHouse = this.dimianshengji.getChildByName("quyu08")
        let ani = leftHouse.getChildByName("minju").getComponent(Animation);
        ani.play();

    }
    //右边房子动作
    rightHouseAni() {
        let leftHouse = this.dimianshengji.getChildByName("quyu09")
        let ani = leftHouse.getChildByName("minju").getComponent(Animation);
        ani.play();
    }


    /**
     * 一级时候展示地图的状态
     */
    showMapLevel_1() {
        this.dimianshengji.active = false;

        this.weiqiang.getChildByName("erjiweiqiang").active = false;
        this.weiqiang.getChildByName("palingLevel2_1").active = false;
        //this.weiqiang.getChildByName("palingLevel2").active = false;
        this.weiqiang.getChildByName("palingLevel2").getComponent(Animation)
        // 获取Animation组件 停止在第一帧
        const anim = this.weiqiang.getChildByName("palingLevel2").getComponent(Animation);
        if (anim) {
            // 停止所有动画
            anim.stop();
            // 获取默认剪辑的动画状态
            const state = anim.getState(anim.defaultClip.name);
            if (state) {
                state.time = 0;
                state.sample();
                anim.pause();
            }
        }



        let dianta = this.weiqiang.getChildByName("dianta")
        dianta.getChildByName("yijidianta").active = false;

        this.erjidianta.children.forEach(element => {
            element.active = false;
        });
        this.weiqiang.getChildByName("disanchikuojian").active = false;
        //his.building.getChildByName("dianchang").getChildByName("gaojidianchang").active = false;

        this.secondShow.children.forEach(element => {
            element.active = false;
        });

        this.areas.getChildByName("coinArea").active = false;
        this.areas.getChildByName("jinkuang").active = false;
        this.areas.getChildByName("jinkuang-001").active = false;
        this.areas.getChildByName("DeliverWoodArea-1").active = true;
        this.areas.getChildByName("DeliverWoodArea-2").active = true;
        for (let i = 3; i < 11; i++) {
            this.areas.getChildByName("DeliverWoodArea-" + i).active = false;
        }
    }
    initAreaLable() {
        for (let i = 1; i < 11; i++) {
            let label = this.areas.getChildByName("DeliverWoodArea-" + i).getChildByName("UnlockTileLabel");
            label.getComponent(Label).string = GlobeVariable.handVoer["pass_" + i].maxCoin.toString();
        }
    }
    //升级围墙不扩展地面
    showMapLevel_1_2() {
        // this.erjidianta.getChildByName("dianwangta0105").active = true;
        // this.erjidianta.getChildByName("dianwangta0106").active = true;
        this.weiqiang.getChildByName("yijiweiqiang").getComponent(Animation).play("weiqiangL1");
        this.weiqiang.getChildByName("yijiweiqiang").getComponent(Animation).on(Animation.EventType.FINISHED, () => {
            this.weiqiang.getChildByName("yijiweiqiang").children.forEach(element => {
                element.getComponent(palingTs)?.hide();
            });

            this.weiqiang.getChildByName("yijiweiqiang").active = false;
            this.weiqiang.getChildByName("palingLevel2").active = true;
            //更新可攻击围墙和障碍物
            App.palingAttack.setPaling(2);
            this.weiqiang.getChildByName("palingLevel2").getComponent(Animation).play("weiqiangL2");
            for (let i = 3; i < 6; i++) {
                this.areas.getChildByName("DeliverWoodArea-" + i).active = true;
            }
        })



        SoundManager.inst.playAudio("YX_jiesuo");
    }

    showMapLevel_2_1() {
        this.weiqiang.getChildByName("palingLevel2_1").active = true;
        this.weiqiang.getChildByName("palingLevel2_1").getComponent(Animation).play("weiqiangL2_1");
        //this.showAni(this.weiqiang.getChildByName("palingLevel2_1"));

        //更新可攻击围墙和障碍物
        this.addObstacle("palingLevel_2_1");
        SoundManager.inst.playAudio("YX_weiqiangSC");
    }

    showMapLevel_2_2() {
        this.weiqiang.getChildByName("palingLevel2_2").active = true;
        this.weiqiang.getChildByName("palingLevel2_2").getComponent(Animation).play("weiqiangL2_2");
        //  this.showAni(this.weiqiang.getChildByName("palingLevel2_2"));
        //更新可攻击围墙和障碍物
        this.addObstacle("palingLevel_2_2");
        SoundManager.inst.playAudio("YX_weiqiangSC");
    }

    showMapLevel_2_2_1() {
        this.weiqiang.getChildByName("palingLevel2_3").active = true;
        this.weiqiang.getChildByName("palingLevel2_3").getComponent(Animation).play("weiqiangL2_3");
        //  this.showAni(this.weiqiang.getChildByName("palingLevel2_3"));
        this.upgradeBeforeGround.active = false;
        this.upgradeAfterGround.active = true;
        //更新可攻击围墙和障碍物
        App.palingAttack.setPaling(3);
        this.addObstacle("palingLevel_2_3");
        SoundManager.inst.playAudio("YX_chuangjian");
        SoundManager.inst.playAudio("YX_weiqiangSC");
    }

    showMapLevel_2_3() {
        this.yun.getChildByName("TX_yun-002").getComponent(CloudParticleEffect).cloudFadeEffct(false);
        this.yun.getChildByName("TX_yun-002").getChildByName("TX_yun-001").getComponent(CloudParticleEffect).cloudFadeEffct(false);
        this.weiqiang.getChildByName("palingLevel2").getChildByName("hide").active = false;
        this.weiqiang.getChildByName("palingLevel2").getChildByName("physics").getChildByName("paling3").active = false;
        // this.weiqiang.getChildByName("palingLevel2").getChildByName("physics").getChildByName("paling4").active = false;
        this.weiqiang.getChildByName("erjiweiqiang").active = true;

        this.weiqiang.getChildByName("erjiweiqiang").getComponent(Animation).play("erjiweiqiang");
        //  this.showAni(this.weiqiang.getChildByName("erjiweiqiang"));
        this.areas.getChildByName("coinArea").active = true;
        this.showAni(this.areas.getChildByName("coinArea"));
        this.areas.getChildByName("jinkuang").active = true;
        this.pylonLine4();
        this.showAni(this.areas.getChildByName("jinkuang"));
        this.areas.getChildByName("jinkuang").getChildByName("caijiqi").active = false;
        this.areas.getChildByName("DeliverWoodArea-6").active = true;
        // this.erjidianta.getChildByName("dianwangta0107").active = true
        // this.erjidianta.getChildByName("dianwangta0108").active = true

        let machineNode: Node = this.areas.getChildByName("jinkuang").getChildByName("caijiqi-001");
        if (machineNode) {
            machineNode.active = true;
            this.showAni(machineNode, () => {
                machineNode.getChildByName("ani").getComponent(Animation).play("CJQ")
                let machine: MiningMachine = machineNode.getComponent(MiningMachine);
                if (machine) {
                    machine.startMachine();
                }
            });

            SoundManager.inst.playAudio("YX_jiesuo02");
        }
        SoundManager.inst.playAudio("YX_chuangjian");
        SoundManager.inst.playAudio("YX_weiqiangSC");

    }

    showMapLevel_2_4() {
        let machineNode: Node = this.areas.getChildByName("jinkuang").getChildByName("caijiqi");
        if (machineNode) {
            // this.miningMachineEffctL.active = true;
            machineNode.active = true;
            this.pylonLine3();

            this.showAni(machineNode, () => {
                machineNode.getChildByName("ani").getComponent(Animation).play("CJQ")
                let machine: MiningMachine = machineNode.getComponent(MiningMachine);
                if (machine) {
                    machine.startMachine();
                }
            });

        }
        SoundManager.inst.playAudio("YX_jiesuo02");
    }

    showMapLevel_2_5() {
        this.areas.getChildByName("DeliverWoodArea-7").active = true;
    }


    showMapLevel_3Hide() {
        // 处理二级围墙
        const erjiweiqiang = this.weiqiang.getChildByName("erjiweiqiang");
        this.showAniSUpDown(erjiweiqiang, () => {
            erjiweiqiang.active = false;
        });

        // 处理palingLevel2下的隐藏元素
        const hideParent = this.weiqiang.getChildByName("palingLevel2");
        // 需要隐藏的元素名称列表
        const hideNames = ["hide1", "hide2", "hide"];

        // 循环处理每个元素
        hideNames.forEach(name => {
            const element = hideParent.getChildByName(name);
            this.showAniSUpDown(element, () => {
                element.active = false;
            });
        });

        const physics = this.weiqiang.getChildByName("palingLevel2").getChildByName("physics");
        const physicsNames = ["paling1", "paling2", "paling3", "paling4", "paling7", "paling8"];
        physicsNames.forEach(name => {
            if (physics.getChildByName(name)) {
                const element = physics.getChildByName(name);
                element.active = false;
            }

        });
    }
    showMapLevel_3() {
        setTimeout(() => {
            this.showMapLevel_3Hide();
        }, 200);
        this.weiqiang.getChildByName("disanchikuojian").active = true;
        this.weiqiang.getChildByName("disanchikuojian").getComponent(Animation).play("weiqiangL3");

        // this.showAni(this.weiqiang.getChildByName("disanchikuojian"));
        this.areas.getChildByName("DeliverWoodArea-8").active = true;
        this.areas.getChildByName("DeliverWoodArea-9").active = true;
        this.dimianshengji.active = true;


        // 定义所有云节点的名称
        const cloudNames = [
            "TX_yun-005",
            "TX_yun-008",
            "TX_yun-010",
            "TX_yun-012",
            "TX_yun-013",
            "TX_yun",
            "TX_yun-003",
            "TX_yun-019",
            "TX_yun-028",

        ];

        // 循环处理每个云节点及其子节点
        cloudNames.forEach(name => {
            // 处理主云节点
            this.yun.getChildByName(name).getComponent(CloudParticleEffect).cloudFadeEffct(false);
            // 处理子云节点
            this.yun.getChildByName(name).getChildByName("TX_yun-001").getComponent(CloudParticleEffect).cloudFadeEffct(false);
        });

        //更新可攻击围墙和障碍物
        App.palingAttack.setPaling(4);
        this.addObstacle("palingLevel_3_1");

        SoundManager.inst.playAudio("YX_chuangjian");
        SoundManager.inst.playAudio("YX_weiqiangSC");
    }

    showMapLevel_3_1() {
        this.dimianshengji.getChildByName("quyu08").active = true;
        this.showAni(this.dimianshengji.getChildByName("quyu08"));
        this.dimianshengji.getChildByName("quyu08Collider").active = true;

        GlobeVariable.addEnemyPhase();

        //this.pylonLine6();

        App.parterController.startLeft();
        this.dimianshengji.getChildByName("quyu08Collider").getComponent(physicsForce1).forceMovePlayer()
        SoundManager.inst.playAudio("YX_jiesuo02");

    }

    showMapLevel_3_2() {
        this.dimianshengji.getChildByName("quyu09").active = true;

        this.showAni(this.dimianshengji.getChildByName("quyu09"));
        // this.pylonLine7();
        this.dimianshengji.getChildByName("quyu09Collider").active = true;
        GlobeVariable.addEnemyPhase();
        App.parterController.startRight();
        this.dimianshengji.getChildByName("quyu09Collider").getComponent(physicsForce1).forceMovePlayer()
        SoundManager.inst.playAudio("YX_jiesuo02");
    }

    showMapLevel_3_3() {

        // this.yun.getChildByName("TX_yun-013").getComponent(CloudParticleEffect).cloudFadeEffct(false);
        // this.yun.getChildByName("TX_yun-013").getChildByName("TX_yun-001").getComponent(CloudParticleEffect).cloudFadeEffct(false);
        // this.yun.getChildByName("TX_yun-028").getComponent(CloudParticleEffect).cloudFadeEffct(false);
        // this.yun.getChildByName("TX_yun-028").getChildByName("TX_yun-001").getComponent(CloudParticleEffect).cloudFadeEffct(false);
        // this.yun.getChildByName("TX_yun-019").getComponent(CloudParticleEffect).cloudFadeEffct(false);
        // this.yun.getChildByName("TX_yun-019").getChildByName("TX_yun-001").getComponent(CloudParticleEffect).cloudFadeEffct(false);
        // this.yun.getChildByName("TX_yun-013").active = false;
        this.areas.getChildByName("DeliverWoodArea-10").active = true;

    }

    showMapLevel_3_4() {

        GuideManager.Instance.arrow3dComp.setActive(false)
        let machineNode: Node = this.areas.getChildByName("jinkuang-001")
        machineNode.active = true;
        this.pylonLine5();

        let mining1: Node = machineNode.getChildByName("caijiqi");
        if (mining1) {
            mining1.active = true;
            this.showAni(mining1, () => {
                mining1.getChildByName("ani").getComponent(Animation).play("CJQ")
                let machine1: MiningMachine = mining1.getComponent(MiningMachine);
                if (machine1) {
                    machine1.startMachine();
                }
            });

        }
        let mining2: Node = machineNode.getChildByName("caijiqi-001");
        if (mining2) {
            mining2.active = true;
            this.showAni(mining2, () => {
                mining2.getChildByName("ani").getComponent(Animation).play("CJQ")
                let machine2: MiningMachine = mining2.getComponent(MiningMachine);
                if (machine2) {
                    machine2.startMachine();
                }
            });

        }
        SoundManager.inst.playAudio("YX_jiesuo02");

        //游戏结束
        this.scheduleOnce(() => {
            let mainCamera = find("Main Camera").getComponent(Camera);

            // mainCamera.mainCamera
            tween(mainCamera)
                .to(0.5, { orthoHeight: 60 })
                .call(() => {
                    this.showEndGameNode();
                })
                .start();

        }, 4);
    }

    /** 显示结束界面 */
    public showEndGameNode() {
        if (!this.endGameNode.active) {
            this.endGameNode.active = true;
        }
    }

    pylonLine1() {
        if (!this.secondShow.getChildByName("01").active)
            this.secondShow.getChildByName("01").active = true;

    }
    pylonLine2() {
        if (!this.secondShow.getChildByName("02").active)
            this.secondShow.getChildByName("02").active = true;

    }
    pylonLine3() {
        if (!this.secondShow.getChildByName("03").active)
            this.secondShow.getChildByName("03").active = true;

    }
    pylonLine4() {
        if (!this.secondShow.getChildByName("04").active)
            this.secondShow.getChildByName("04").active = true;

    }
    pylonLine5() {
        if (!this.secondShow.getChildByName("05").active)
            this.secondShow.getChildByName("05").active = true;
    }
    pylonLine6() {
        if (!this.secondShow.getChildByName("06").active)
            this.secondShow.getChildByName("06").active = true;
    }
    pylonLine7() {
        if (!this.secondShow.getChildByName("07").active)
            this.secondShow.getChildByName("07").active = true;
    }
    /**
     *一级升级一次电塔显示出来 1——1
     * 现没有升级直接显示二级电塔
     */
    showLevelPylon(num) {
        //大于等于5 的区域不需要电塔解锁其他
        if (num < 5) {
            this.erjidianta.getChildByName("dianwangta010" + num).active = true;
            this.showAni(this.erjidianta.getChildByName("dianwangta010" + num));
            SoundManager.inst.playAudio("YX_jiesuo02");
        }
        if (num == 1) {
            this.pylonLine1();
            GlobeVariable.addEnemyPhase();
            this.lensHighFunc();

        } else if (num == 2) {
            this.pylonLine2();
            GlobeVariable.addEnemyPhase();
            this.lensHighFunc();
        } else if (num == 3) {
            this.pylonLine6();
            GlobeVariable.addEnemyPhase();
        } else if (num == 4) {
            this.pylonLine7();
            GlobeVariable.addEnemyPhase();
        }

        this.showLevelPylonNum += 1;
        // console.log("showLevelPylonNum ", this.showLevelPylonNum)
        if (this.showLevelPylonNum === 2) {
            this.showMapLevel_1_2();
            GlobeVariable.playerLevel = 2;
        } else if (this.showLevelPylonNum == 6) {
            this.showMapLevel_2_5();
        }
        if (GlobeVariable.playerLevel === 2) {
            if (num == 3) {
                this.showMapLevel_2_1();
                this.paling34 += 1;
                if (this.paling34 == 2) {
                    this.showMapLevel_2_2_1();
                }
            } else if (num == 4) {
                this.showMapLevel_2_2();
                this.paling34 += 1;
                if (this.paling34 == 2) {
                    this.showMapLevel_2_2_1();
                }
            }
            else if (num == 5) {
                this.showMapLevel_2_3();

            }
            else if (num == 6) {
                this.lensHighFunc();
                this.showMapLevel_2_4();
            } else if (num == 7) {
                this.lensHighFunc();
                GlobeVariable.playerLevel = 3;
                this.showMapLevel_3();
            }
        } else if (GlobeVariable.playerLevel === 3) {
            if (num == 8) {
                this.showMapLevel_3_1();
                this.paling89 += 1;
                if (this.paling89 == 2) {
                    this.showMapLevel_3_3();
                }
            } else if (num == 9) {
                this.showMapLevel_3_2();
                this.paling89 += 1;
                if (this.paling89 == 2) {
                    this.showMapLevel_3_3();
                }
            } else if (num == 10) {
                this.showMapLevel_3_4()
            }
        } else {
            console.error("GlobeVariable.playerLevel ", GlobeVariable.playerLevel)
        }
    }

    /** 添加障碍物 */
    private addObstacle(obstacleName: string) {
        const scenePhysics = App.sceneNode.PhysicsPaling;
        const level_1 = scenePhysics.getChildByName(obstacleName);
        if (level_1) {
            RVOObstacles.addOneObstacle(level_1);
            Simulator.instance.processObstacles();
        }
    }

    private showAni(node: Node, callBack: () => void = null) {

        node.setScale(0, 0, 0);
        tween(node)
            .to(0.03, { scale: new Vec3(1, 0, 1) })
            .to(0.2, { scale: new Vec3(1, 1.1, 1) })
            .to(0.1, { scale: new Vec3(1, 1, 1) })
            .call(() => {
                if (callBack)
                    callBack();
            })
            .start();
    }
    private showAniSUpDown(node: Node, callBack: () => void = null) {

        node.setScale(0, 0, 0);
        tween(node)
            .to(0.5, { position: new Vec3(0, -3.6, 0) })
            .call(() => {
                if (callBack)
                    callBack();
            })
            .start();
    }
}


