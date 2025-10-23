import { _decorator, Component, Label, Node, tween, Vec3, Animation, Sprite, find, BoxCollider, RigidBody, Camera, Quat } from 'cc';
import { GlobeVariable } from './core/GlobeVariable';
import { App } from './App';
import { SoundManager } from './core/SoundManager';
import { GameEndManager } from './UI/GameEndManager';

const { ccclass, property } = _decorator;

@ccclass('MapShowController')
/**地图显示控制器
 * 按照场景拼音命名以防忘了
 * 
 */
export class MapShowController extends Component {

    @property({ type: Node, tooltip: "建筑物父类Cons" })
    private buidingParent: Node = null;

    @property({ type: Node, tooltip: "建筑物 解锁区域父类UIPos" })
    private buidingAreaParent: Node = null;

    @property({ type: Camera, tooltip: "记录主摄像机" })
    private mianCamera: Camera = null;

    @property({ type: Node, tooltip: "记录玩家节点" })
    private player: Node = null;

    @property({ type: Node, tooltip: " 箭头引导" })
    private arrowGuide: Node = null;

    @property({ type: Animation, tooltip: "结束坍塌动画" })
    private playerAnim: Animation = null;

    //显示模型
    private arrowTower: Node = null;//箭塔模型
    private turret: Node = null;//炮塔模型
    private block1: Node = null;//拦截拒马
    private block2: Node = null;//拦截拒马
    private beetle: Node = null;// Beetle模型
    private flower: Node = null;//花模型
    private attackFlower: Node = null;//攻击的花

    //解锁区域 
    private arrowTowerArea: Node = null;//箭塔模型
    private turretArea: Node = null;//炮塔模型
    private block1Area: Node = null;//拦截拒马
    private block2Area: Node = null;//拦截拒马
    private beetleArea: Node = null;// Beetle 甲虫骑士兵营
    private beetleArea1: Node = null;// Beetle 甲虫骑士
    private attackFlowerArea: Node = null;//攻击的花
    private bubble: Node = null; // 兵营气泡
    private mainCameraPos: Vec3 = null;
    private mainCameraRot: Quat = null;
    private playerPos: Vec3 = null;
    private playerRot: Quat = null;
    protected onLoad(): void {
        //模型
        this.arrowTower = this.buidingParent.getChildByName("jianta");
        this.turret = this.buidingParent.getChildByName("paota");
        this.block1 = this.buidingParent.getChildByName("juma01");
        this.block2 = this.buidingParent.getChildByName("juma02");
        this.beetle = this.buidingParent.getChildByName("jiachong");
        this.flower = this.buidingParent.getChildByName("hua");
        this.attackFlower = this.buidingParent.getChildByName("shirenhua");
        //解锁区域
        this.arrowTowerArea = this.buidingAreaParent.getChildByName("UI_jianta");
        this.turretArea = this.buidingAreaParent.getChildByName("UI_paota");
        this.block1Area = this.buidingAreaParent.getChildByName("UI_juma");
        this.block2Area = this.buidingAreaParent.getChildByName("UI_juma-001");
        this.beetleArea = this.buidingAreaParent.getChildByName("UI_jiachong");
        this.beetleArea1 = this.buidingAreaParent.getChildByName("UI_jiachong-001");
        this.attackFlowerArea = this.buidingAreaParent.getChildByName("UI_shirenhua");

        this.bubble = this.buidingAreaParent.getChildByName("qipao")
        this.bubble.active = false;
        this.beetleArea1.active = false;
        this.showLable();
        // 记录初始位置和旋转
        this.mainCameraPos = this.mianCamera.node.position.clone();
        this.mainCameraRot = this.mianCamera.node.rotation.clone();
        this.playerPos = this.player.position.clone();
        this.playerRot = this.player.rotation.clone();
    }
    guildMoveCamera() {
        if (GlobeVariable.isBeetleGuild) {
            return;
        }
        GlobeVariable.isBeetleGuild = true;
        GlobeVariable.isJoyStickBan = true;
        this.curCameraPos = this.mianCamera.node.position.clone();
        tween(this.mianCamera.node)
            .to(1.5, { position: new Vec3(156.87, 111, 27.13) })
            .to(0.8, { position: new Vec3(156.87, 111, 27.13) })// 添加1秒延时
            .to(1.5, { position: this.curCameraPos })
            .call(() => {
                GlobeVariable.isJoyStickBan = false;
                // 箭头引导
                this.arrowGuide.active = true;
                this.arrowGuide.getComponent(Animation).play("endArrowAni");
                //this.mianCamera.node.position = this.curCameraPos;
            })
            .start();
    }
    continueGame() {
        // 恢复初始位置和旋转
        this.mianCamera.node.setPosition(this.mainCameraPos);
        this.mianCamera.node.setRotation(this.mainCameraRot);
        this.player.setPosition(this.playerPos);
        this.player.setRotation(this.playerRot);

        this.arrowTower.active = false;
        let arrowTowerModel = this.arrowTower.getChildByName("HuoChaiHeJiaTa").getChildByName("model").getChildByName("L_prp_HuoChaiHe_jt_Skin_V001")
        arrowTowerModel.getChildByName("HuoChaiHe").getChildByName("HuoChaiGun").active = true;
        this.turret.active = false;
        this.block1.active = false;
        this.block2.active = false;
        this.beetle.active = false;
        this.attackFlower.active = false;

        this.arrowTowerArea.active = true;
        this.turretArea.active = false;
        this.block1Area.active = false;
        this.block2Area.active = false;
        this.beetleArea.active = false;
        this.beetleArea1.active = false;
        this.attackFlowerArea.active = false;

        this.bubble = this.buidingAreaParent.getChildByName("qipao")
        this.bubble.active = false;
        this.beetleArea1.active = false;
        this.continueShowLable();

        // 调用函数处理不同路径的物体
        this.disableColliderAndRigidBody("Physice/UI_paota");
        this.disableColliderAndRigidBody("Physice/UI_jianta");
        this.disableColliderAndRigidBody("Physice/UI_jiachong");
    }
    // 定义一个通用函数来禁用物体的碰撞器和刚体
    disableColliderAndRigidBody(path) {
        const obj = find(path);
        if (!obj) return;

        const collider = obj.getComponent(BoxCollider);
        if (collider) collider.enabled = false;

        const rigidBody = obj.getComponent(RigidBody);
        if (rigidBody) rigidBody.enabled = false;
    }
    continueShowLable() {
        GlobeVariable.handOverArea.forEach(element => {
            const passData = GlobeVariable.handVoer[element];
            let nodes = this.buidingAreaParent.getChildByName(element)
            if (nodes) {
                let lab = nodes.getChildByName("UnlockTileLabel")?.getComponent(Label)
                lab.string = passData.maxCoin + ""

                let sp = nodes.getChildByName("progress").getComponent(Sprite);
                sp.fillRange = 0
            }
            // passData.isShow = true;
            // passData.showCoin = passData.maxCoin;
        })
        this.bubble.getChildByName("qipao").getChildByName("UnlockTileLabel-001").getComponent(Label).string = GlobeVariable.handVoer["UI_jiachong-001"].maxCoin + "";

    }
    bubbleAniSpeed(speed: number = 0.7) {
        let ani = this.bubble.getComponent(Animation);
        let state = ani.getState("qipaohuxi");
        if (state) {
            state.speed = speed;
        }
        ani.play("qipaohuxi")

    }

    showLable() {
        GlobeVariable.handOverArea.forEach(element => {
            const passData = GlobeVariable.handVoer[element];
            let nodes = this.buidingAreaParent.getChildByName(element)
            if (nodes) {
                let lab = nodes.getChildByName("UnlockTileLabel")?.getComponent(Label)
                lab.string = passData.maxCoin + ""
            }
            // passData.isShow = true;
            // passData.showCoin = passData.maxCoin;
        })
        this.bubble.getChildByName("qipao").getChildByName("UnlockTileLabel-001").getComponent(Label).string = GlobeVariable.handVoer["UI_jiachong-001"].maxCoin + "";

    }


    setBubbleLable() {
        let remaining = GlobeVariable.handVoer["UI_jiachong-001"].maxCoin - GlobeVariable.handVoer["UI_jiachong-001"].showCoin;//passData.curCoin;
        // 处理边界值
        remaining = Math.max(0, remaining);
        this.bubble.getChildByName("qipao").getChildByName("UnlockTileLabel-001").getComponent(Label).string = remaining + "";
        let sp = this.bubble.getChildByName("qipao").getChildByName("qipao-001").getComponent(Sprite);
        sp.fillRange = GlobeVariable.handVoer["UI_jiachong-001"].showCoin / GlobeVariable.handVoer["UI_jiachong-001"].maxCoin;
    }


    protected start(): void {
        this.buidingAreaParent.children.forEach(element => {
            element.active = false;
        });
        this.buidingParent.children.forEach(element => {
            element.active = false;
        });
        this.arrowTower.active = true;
        this.scheduleOnce(() => {
            this.arrowTower.active = false;
        }, 0);
        this.flower.active = true;
        this.arrowTowerArea.active = true;
        //临时功能
       // this.attackFlower.active = true;


    }
    reunBlock1() {
        return this.block1Area.active;
    }
    retunBeetle1() {
        return this.beetleArea1.active;
    }


    restBlock1() {
        this.block1Area.active = true;
        const sp = this.block1Area.getChildByName("progress").getComponent(Sprite);
        const lb = this.block1Area.getChildByName("UnlockTileLabel").getComponent(Label);

        // 缓存当前关卡数据
        const passData = GlobeVariable.handVoer[this.block1Area.name];
        passData.curCoin = 0;
        passData.showCoin = 0;//passData.curCoin;
        sp.fillRange = 0;
        lb.string = passData.maxCoin + "";

    }
    //显示甲虫的气泡
    showBeetleBubble() {
        this.bubble.active = true;
        this.bubbleAniSpeed();
        //  this.bubble.getChildByName("qipao_red").active = false;
        this.beetleArea1.active = true;
    }
    //显示甲虫的气泡
    hideBeetleBubble(areaName: string) {
        // 缓存当前关卡数据
        const passData = GlobeVariable.handVoer[areaName];
        passData.curCoin = 0;
        passData.showCoin = 0;//passData.curCoin;

        GlobeVariable.beetleIsMove = true;
        GlobeVariable.beetleLockNum++;
        SoundManager.Instance.playAudio("jiachongchongfenghao");

        this.bubble.active = false;
        //this.bubble.getChildByName("qipao_red").active = true;
        this.beetleArea1.active = false;
        let sp = this.bubble.getChildByName("qipao").getChildByName("qipao-001").getComponent(Sprite);
        sp.fillRange = 0;
        this.bubble.getChildByName("qipao").getChildByName("UnlockTileLabel-001").getComponent(Label).string = GlobeVariable.handVoer["UI_jiachong-001"].maxCoin + "";
    }
    //显示拦截拒马解锁区域
    showUIBlock1Area() {
        this.block1Area.active = true;
    }
    showUIBlock2Area() {
        this.block2Area.active = true;
    }
    //甲虫骑士解锁区域
    showUIBeetleArea() {

        this.beetleArea.active = true;
    }
    //攻击的花解锁区域  
    showUIAttackFlowerArea() {
        this.attackFlowerArea.active = true;
    }
    //箭塔解锁区域

    showUIArrowTowerArea() {

        this.arrowTowerArea.active = true;
    }
    //炮塔解锁区域
    showUITurretArea() {
        this.turretArea.active = true;
    }
    private curCameraPos: Vec3 = new Vec3();
    cameraMove(){
        this.curCameraPos = this.mianCamera.node.position.clone();
        tween(this.mianCamera.node)
            .to(1.5, { position: new Vec3(118, 111, 66) })
            .to(1.5, { position: this.curCameraPos })
            .call(() => {
                GlobeVariable.isJoyStickBan = false;
                //this.mianCamera.node.position = this.curCameraPos;
            })
            .start();
    }
    /**
     * 显示区域建筑
     * @param areaName 区域名称
     */
    public showUIBuiding(areaName: string) {
        if (areaName == "UI_jianta") { //解锁箭塔后显示拒马交付区域
            const jiantou = find("Physice/UI_jianta");
            const collider = jiantou.getComponent(BoxCollider);
            if (collider) {
                collider.enabled = true;
            }
            const rigidBody = jiantou.getComponent(RigidBody);
            if (rigidBody) {
                rigidBody.enabled = true;
            }

            this.arrowTower.active = true;
            SoundManager.Instance.playAudio("jiesuo");
            GlobeVariable.isStartGame = true
            App.sceneNode.enemyParent.active = true;
            this.showUIBlock1Area();
            App.guideManager.setGuideStepCompLate(1);
            App.guideManager.nexStep();
            App.guideManager.nexPhase();
        }
        if (areaName == "UI_juma") {
            this.block1.active = true;
            this.block1.getComponent(Animation).play("juma01chuxian")
            SoundManager.Instance.playAudio("jiesuo");
            GlobeVariable.isBlock = true;
            if (GlobeVariable.isFirstBlock) {
                this.showUITurretArea();
                App.guideManager.setGuideStepCompLate(2);
                App.guideManager.nexStep();
                App.guideManager.nexPhase();
            }
            GlobeVariable.blockLockNum++;
        }
        if (areaName == "UI_paota") {
            const jiantou = find("Physice/UI_paota");
            const collider = jiantou.getComponent(BoxCollider);
            if (collider) {
                collider.enabled = true;
            }
            const rigidBody = jiantou.getComponent(RigidBody);
            if (rigidBody) {
                rigidBody.enabled = true;
            }
            this.turret.active = true;
            SoundManager.Instance.playAudio("jiesuo");
            GlobeVariable.enemySpiderNumBig = 3;
          
            this.showUIAttackFlowerArea();
            App.guideManager.setGuideStepCompLate(3);
            App.guideManager.nexStep();
           // App.guideManager.nexPhase();

        }
        if (areaName == "UI_juma-001") {

            //this.block2.active = true;
            this.playerAnim.play("endAni");
            SoundManager.Instance.playAudio("jiesuo");
            setTimeout(() => {
                App.sceneNode.GameEnd.active = true;
                App.sceneNode.GameEnd.getComponent(GameEndManager).showGameEnd(1);

            }, 2000);
            GlobeVariable.isGameEnd = true;
        }
        if (areaName == "UI_jiachong") {
            const jiantou = find("Physice/UI_jiachong");
            const collider = jiantou.getComponent(BoxCollider);
            if (collider) {
                collider.enabled = true;
            }
            const rigidBody = jiantou.getComponent(RigidBody);
            if (rigidBody) {
                rigidBody.enabled = true;
            }
            this.beetle.active = true;
            SoundManager.Instance.playAudio("jiesuo");
            GlobeVariable.beetleIsMove = true;
            SoundManager.Instance.playAudio("jiachongchongfenghao");
            
            GlobeVariable.beetleLockNum++;
            App.guideManager.setGuideStepCompLate(5);
            App.guideManager.nexStep();
            App.guideManager.nexPhase();

        }
        if (areaName == "UI_jiachong-001") {
            
            this.hideBeetleBubble(areaName);
            this.showUIBlock2Area();
            this.guildMoveCamera();

        }
        if (areaName == "UI_shirenhua") {
            SoundManager.Instance.playAudio("jiesuo");
            this.attackFlower.active = true;
            GlobeVariable.isJoyStickBan = true;
            this.showUIBeetleArea();
            this.cameraMove();
            App.guideManager.setGuideStepCompLate(4);
            App.guideManager.nexStep();
            App.guideManager.nexPhase();
            // GlobeVariable.beetleLockNum++;
            // this.hideBeetleBubble(areaName);

        }

    }

}


