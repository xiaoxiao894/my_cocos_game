import { _decorator, Camera, Component, Label, Node, Sprite, Animation, Vec3, Quat, Material, MeshRenderer, tween } from 'cc';
import { eventMgr } from '../core/EventManager';
import { EventType } from '../core/EventType';
import { EnemyTree } from '../entitys/EnemyTree';
import Entity from '../entitys/Entity';
import { BehaviourType } from '../entitys/Character';
import { Global } from '../core/Global';
import { GroundEffct } from '../GroundEffct';
import { enemyCharacter } from '../entitys/enemyCharacter';
import { treeController } from './TreeController';
import { playerController } from './PlayerController';
import super_html_playable from '../../super_html_playable';
import { BubbleFead } from '../BubbleFead';
const { ccclass, property } = _decorator;
const google_play = "https://play.google.com/store/apps/details?id=com.funplus.ts.global";
const appstore = "https://play.google.com/store/apps/details?id=com.funplus.ts.global";
@ccclass('WorldMap')
export class WorldMap extends Component {

    @property(Node)
    public mainCamera: Camera = null;

    @property(Node)
    private greenScript: Node = null;

    @property(Node)
    private greenScript_1: Node = null;

    @property(Node)
    private treeArrow: Node = null;

    @property(Node)
    private upgradeNodep: Node = null;

    private isShowUpgradeNodep: boolean = false;

    @property(Node)
    private upgradeNodep1: Node = null;

    @property(GroundEffct)
    private GroundEffect: GroundEffct = null;


    @property(Node)
    private enemyParent: Node = null;

    @property(Node)
    private characterParent: Node = null;

    @property(Node)
    private treeParentNode: Node = null;


    //出生点 和第一地块交付的位置 //
    @property({ type: Node, tooltip: "birshPos1" })
    private birthNodes: Node[] = []

    @property(Material)
    private materialHouseBase: Material = null;
    @property(Material)
    private meterialHouseChange: Material = null;


    //结束点传送点  暂时没有用 后续看需要
    @property({ type: Node, tooltip: "endPos1" })
    private endNodes: Node[] = []


    @property({ type: Node, tooltip: "enemySelfPos1" })
    private enemySelfLanPos: Node[] = [];

    //玉米地占位点
    @property({ type: Node, tooltip: "cornPos1" })
    private cronNodesPos: Node[] = []

    //人物交付时候所站的位置
    @property({ type: Node, tooltip: "enemyHandOverPos1" })
    private enemyHandOverPos: Node[] = []

    //游戏结束时候四散的位置
    @property({ type: Node, tooltip: "gameOverPos1" })
    private allCharacterPos: Node[] = []


    private upgradeUIAnmationTree: Animation = null;
    private upgradeUIAnmationEnemy: Animation = null;

    private changeAnimation: Animation = null;


    @property(Node)
    gameEndUI: Node = null;

    private isComplate: boolean = false;

    start() {
        super_html_playable.set_google_play_url(google_play);
        super_html_playable.set_app_store_url(appstore);
        this.upgradeUIAnmationEnemy = this.upgradeNodep1.getComponent(Animation);
        this.upgradeUIAnmationTree = this.upgradeNodep.getComponent(Animation);
        this.initAll()
        Global.soundManager.playBgMusic()

    }
    initAll() {

        treeController.initAllTree(this.treeParentNode);
        playerController.initCharacters(this.characterParent, this.birthNodes, this.endNodes,
            this.cronNodesPos, this.enemyHandOverPos, this.allCharacterPos, this.enemySelfLanPos);
        this.onListenerEvent()
    }
    onListenerEvent() {
        eventMgr.on(EventType.ENTITY_MOVE_TREE, this.moveTreeCallBack)
        eventMgr.on(EventType.ENTITY_MOVE_HAND_OVER, this.moveHandOver.bind(this))
        eventMgr.on(EventType.ENTITY_HAND_OVER_ADD, this.updateHandOverProgress.bind(this));
        eventMgr.on(EventType.ENTITY_TREE_COMPLATE, this.treeUpgradeComplate.bind(this))
        eventMgr.on(EventType.ENTITY_TREE_TRANSMIT, this.treeTransmitCallback.bind(this))
        eventMgr.on(EventType.ENTITY_CORN_CUT, this.cornCutCallback.bind(this))
        eventMgr.on(EventType.ENTITY_ENEMY_TRANSMIT, this.enemyTransmitCallback.bind(this))
        eventMgr.on(EventType.ENTITY_ENEMY_DIE, this.enemyDieCallback.bind(this))
        eventMgr.on(EventType.ENTITY_ENEMY_HAND_OVER, this.enemyHandOverCallback.bind(this))
        eventMgr.on(EventType.ENTITY_CORNHAND_OVER_ADD, this.enemyHandeOverAdd.bind(this))
        eventMgr.on(EventType.ENTITY_CORN_COMPLATE, this.enemyHandOverComplate.bind(this))
        eventMgr.on(EventType.ENTITY_CLICK_ENEMY, this.clickEnemyAttack.bind(this))
        eventMgr.on(EventType.ENTITY_SHOW_TREEHANDE, this.showTreeHande.bind(this))
        eventMgr.on(EventType.ENTITY_ALL_DIE, this.allDieCallback.bind(this))
        eventMgr.on(EventType.SHOW_ENEMY, this.showCallBack.bind(this));
        eventMgr.on(EventType.GAME_OVER, this.gameOver.bind(this));
        eventMgr.on(EventType.ENTITY_HAND_OVER_NO, this.handoverNo.bind(this));


    }
    handoverNo() {

        this.treeParentNode.children.forEach((item) => {
            if (item.active) {
                let enemy = item.getComponent(EnemyTree)
                if (enemy.animationNum < 4) {
                    item.getComponent(EnemyTree).setFindState(true);
                    console.log("enemy.animationNum enemy.animationNum ", enemy.animationNum);
                    item.getChildByName("UI_famuzhiyin").getComponent(BubbleFead).Show1(enemy.curCollectNum);
                }

            }
        })
    }
    showCallBack() {
        let houseMaterial = this.GroundEffect.enemyLandHouse.getChildByName("shengjiqian").getChildByName("posun").getComponent(MeshRenderer);


        tween(houseMaterial.node)
            // 定义要重复的动作序列：切换材质→等待→切回材质→等待
            .sequence(
                // 切换到目标材质
                tween().call(() => {
                    houseMaterial.material = this.meterialHouseChange;
                }),
                // 等待 0.2 秒
                tween().delay(0.2),
                // 切回原材质
                tween().call(() => {
                    houseMaterial.material = this.materialHouseBase;
                }),
                // 等待 0.2 秒（与切换时间对称）
                tween().delay(0.2)
            )
            // 重复整个序列 3 次
            .repeat(5)
            // 启动 tween
            .start();
        //houseMaterial.material = this.meterialHouseChange;
        if (!this.enemyParent.active) {
            this.enemyParent.active = true;
            //  this.scheduleOnce(()=>{

            //  },1.2)

        }

    }
    private isAniTrue: boolean = false;
    gameOver() {
        this.scheduleOnce(() => {
            Global.isClickUpgrade = true;
            let red = this.upgradeNodep1.getChildByName("2dNode").getChildByName("scaleNode").getChildByName("Sprite-red")
            red.active = false;
            if (Global.upgradeUIAnimtion != 3) {
                Global.upgradeUIAnimtion = 3;
            }
            Global.soundManager.playShatterSound();
            let ani = this.upgradeNodep1.getChildByName("TX_posun")
            ani.active = true;
            if (!this.isAniTrue) {
                this.isAniTrue = true;
                ani.getComponent(Animation).play();
                ani.getComponent(Animation).once(Animation.EventType.FINISHED, () => {

                    this.upgradeNodep1.getChildByName("UI_ZYXS").active = true;
                })
            }



        }, 1)



    }
    allDieCallback() {
        playerController.allCharacterHanover();

    }
    ///////////////////////////////////第一个地块的操作
    //移动到目标点树
    moveTreeCallBack(target: Entity, behaviourType: BehaviourType) {
        playerController.squenceMove(target, behaviourType)
    }
    //移动到树交付的目标点
    moveHandOver(target: Node, behaviourType: BehaviourType) {
        playerController.squenceHandOver(target, behaviourType)
    }
    showTreeHande() {
        this.upgradeNodep.getChildByName("UI_ZYXS").active = true;
    }
    //交付木材 每次交付回调设置显示进度
    updateHandOverProgress() {
        let sp: Sprite = this.greenScript.getComponent(Sprite)

        let curNum: Label = sp.node.getParent().getChildByName("Label").getComponent(Label);
        let maxNum: Label = sp.node.getParent().getChildByName("Label-001").getComponent(Label);
        // 确保数值在有效范围内
        const current = Math.max(0, Math.min(Global.treeHandOverNum, Global.treeHandOverNumLimit));
        const max = Math.max(1, Global.treeHandOverNumLimit); // 防止除零错误

        curNum.string = current.toString();
        maxNum.string = "/" + max.toString();
        // if(Number(curNum) >= Number(maxNum)){
        //     this.upgradeNodep.getChildByName("UI_ZYXS").active = true;
        // }

        // 计算百分比 (0-1范围)
        const percentage = current / max;

        // 更新进度条
        sp.fillRange = percentage;

        // 可选：显示进度文本
        console.log(`交付进度: ${Math.round(percentage * 100)}% (${current}/${max})`);
    }
    //  交付 数量达到成绩的处理 升级处理
    treeUpgradeComplate() {
        this.upgradeNodep.active = false;
        this.treeParentNode.children.forEach((item) => {
            if (item.active) {
                item.getChildByName("UI_famuzhiyin").active = false
            }
        })
        this.GroundEffect.upgradeTreeHouseAnimation(() => {
            this.GroundEffect.passAnimation1();
            this.scheduleOnce(() => {
                this.treeArrow.active = true;
            }, 2.4)
        })

    }
    //点击引导按钮人物移动到下一个场景
    treeTransmitCallback(selfNode: Node) {
        this.treeParentNode.children.forEach((item) => {
            item.getChildByName("UI_famuzhiyin").active = false;
        })
        this.GroundEffect.ArrowgroundObject2_1.active = true;
        this.GroundEffect.ArrowgroundObject2_2.active = true;
        this.GroundEffect.ArrowgroundObject2_3.active = true;
        this.GroundEffect.ArrowgroundObject2_4.active = true;
        Global.isClickUpLandTree = false
        this.GroundEffect.passAnimation11();
        this.treeArrow.active = false;
        playerController.resetBehaviour();
        playerController.moveCornPos();

    }
    //////////////////////////////////////第二个地块的操作
    // 点击玉米地块开始收割玉米
    cornCutCallback(selfNode: Node) {

        for (let i = 1; i < Global.clickCornLand.length; i++) {
            if (Global.clickCornLand[i] == 0) {
                this.GroundEffect["ArrowgroundObject2_" + i].getChildByName("UI_ZYXS").active = true;
                break;
            }
        }
        // this.GroundEffect.ArrowgroundObject2_2.active = true;
        // this.GroundEffect.ArrowgroundObject2_3.active = true;
        // this.GroundEffect.ArrowgroundObject2_4.active = true;
        playerController.cutCornController(selfNode, this.GroundEffect)
    }
    // 玉米收割完 点击 传送按钮  摄像机操作 人物进入有怪物的地块
    enemyTransmitCallback(selfNode: Node) {
        this.upgradeNodep1.active = true;
        Global.upgradeAnimationgPlayTyep = 2;
        Global.upgradeUIAnimtion = 1;
        Global.isStartMoveEnemyLand = true;
        Global.isClickUpLandCorn = false;
        playerController.resetBehaviour();
        this.schedule(() => {
            this.GroundEffect.hideCornArrow();
        }, 3)
        this.GroundEffect.passAnimation21();
        //直接寻找敌人之后攻击的操作 后续有需要解开注释
        //playerController.moveFindEnemyPos(this.enemyParent);
        //找到自己的占位点
        playerController.moveFindEnemyLandPos(this.enemyParent)
    }
    //点击攻击敌人
    clickEnemyAttack(arrowEnemynode: Node) {
        console.log("点击攻击敌人")
        let enemy = arrowEnemynode.getComponent(enemyCharacter)
        let target = enemy.target
        playerController.attackEnemy(target, enemy)

    }
    //敌人死亡事件回调 
    enemyDieCallback(cahracter: EnemyTree) {
        this.upgradeNodep1.active = true;

        // this.scheduleOnce(() => {
        //     Global.isClickUpgrade = true;
        // }, 0.5)

        Global.warnUI.stopWarnFadeAnimation();

        Global.isClickUpLandTree = true;
        Global.isClickEnemy = true;
        this.GroundEffect.showAllTreeClick();
        Global.isEnemyCutTree = true;
    }
    //怪物死亡点击交付
    enemyHandOverCallback() {
        playerController.moveFindEnemHandOver()
    }
    //点击交付进度增长
    enemyHandeOverAdd() {
        let sp: Sprite = this.greenScript_1.getComponent(Sprite)
        // 确保数值在有效范围内
        let curNum: Label = sp.node.getParent().getChildByName("Label").getComponent(Label);
        let maxNum: Label = sp.node.getParent().getChildByName("Label-001").getComponent(Label);
        // 确保数值在有效范围内
        const current = Math.max(0, Math.min(Global.cornHandOverNum, Global.cornHandOverNumLimit));
        const max = Math.max(1, Global.cornHandOverNumLimit); // 防止除零错误

        curNum.string = current.toString();
        maxNum.string = "/" + max.toString();
        // 计算百分比 (0-1范围)
        const percentage = current / max;

        // 更新进度条
        sp.fillRange = percentage;

        // 可选：显示进度文本
        console.log(`交付进度: ${Math.round(percentage * 100)}% (${current}/${max})`);

    }
    //交付完成
    enemyHandOverComplate(character: Entity) {
        if (!this.isComplate) {
            this.isComplate = true;
            this.scheduleOnce(() => {
                this.upgradeNodep1.active = false;
            }, 0.1)
            this.scheduleOnce(() => {
                this.GroundEffect.upgradeEnemyHouseAnimation(() => {
                    playerController.GameHandOverComplate();
                    this.scheduleOnce(() => {
                        this.GroundEffect.passAnimation3();
                        this.gameEndUI.active = true
                    }, 1)
                })
            }, 0.12)

        }
        console.log("CornHandOverComplate")
    }
    update(deltaTime: number) {

        if (Global.clickNum == 5 && !this.isShowUpgradeNodep) {
            if (!this.upgradeNodep.active) {
                this.upgradeNodep.active = true;
                this.isShowUpgradeNodep = true;
                Global.upgradeUIAnimtion = 1;
            }
        }
        if (Global.upgradeAnimationgPlayTyep == 1) {
            this.changeAnimation = this.upgradeUIAnmationTree
            Global.upgradeAnimationgPlayTyep = 0
        } else if (Global.upgradeAnimationgPlayTyep == 2) {
            this.changeAnimation = this.upgradeUIAnmationEnemy
            Global.upgradeAnimationgPlayTyep = 0;

        }
        if (this.upgradeNodep.active || this.upgradeNodep1.active) {
            if (Global.upgradeUIAnimtion == 1) {
                // const anim = this.upgradeNodep.getComponent(Animation);
                this.changeAnimation.stop()
                Global.upgradeUIAnimtion = 2;
                const animState = this.changeAnimation.getState('SJZY');
                if (!animState || animState.isPlaying) {
                    return;
                }
                this.changeAnimation.play('SJZY');
            } else if (Global.upgradeUIAnimtion == 3) {

                Global.upgradeUIAnimtion = 4;
                // const anim = this.upgradeNodep.getComponent(Animation);
                this.changeAnimation.stop()

                const animState = this.changeAnimation.getState('WoodTDAni');
                animState.speed = 2;
                if (!animState || animState.isPlaying) {
                    return;
                }
                this.changeAnimation.play('WoodTDAni');
            } else if (Global.upgradeUIAnimtion == 5 || Global.upgradeUIAnimtion == 0) {
                //  const anim = this.upgradeNodep.getComponent(Animation);
                this.changeAnimation.stop()
                const animState = this.changeAnimation.getState('WoodTDAni');
                animState.speed = 1;
                this.changeAnimation.play('WoodTDAni');
                Global.upgradeUIAnimtion = -1;
            }
        }

    }
}



