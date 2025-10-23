import { _decorator, Camera, Component, EventTouch, geometry, Input, PhysicsSystem, Animation, Vec3, Quat } from 'cc';

import { EnemyTree } from '../entitys/EnemyTree';
import { eventMgr } from './EventManager';
import { EventType } from './EventType';
import { BehaviourType } from '../entitys/Character';
import { Global } from './Global';
import { BubbleFead } from '../BubbleFead';
import super_html_playable from '../../super_html_playable';
const { ccclass, property } = _decorator;

@ccclass('touchEvent')
export class touchEvent extends Component {

    @property(Camera)
    private mainCamera: Camera = null;
    private originalScale: Vec3 = new Vec3(1, 1, 1); // 存储原始缩放值

    private upgradeNode = null;
    private upgradeNode1 = null;
    private clickTreeUI = null;
    private cornLandArrow = null;
    start() {
        //this.mainCamera = WorldMap.instance.mainCamera;
    }

    update(deltaTime: number) {

    }

    protected onEnable(): void {
        this.node.on(Input.EventType.TOUCH_START, this.onTouchStart.bind(this), this);;
        this.node.on(Input.EventType.TOUCH_MOVE, this.onTouchMove.bind(this), this);
        this.node.on(Input.EventType.TOUCH_END, this.onTouchEnd.bind(this), this);
        this.node.on(Input.EventType.TOUCH_CANCEL, this.onTouchEnd.bind(this), this);


    }

    protected onDisable(): void {
        this.node.off(Input.EventType.TOUCH_START, this.onTouchStart, this);;
        this.node.off(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.off(Input.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.off(Input.EventType.TOUCH_CANCEL, this.onTouchEnd, this);

    }
    private nameUUId = null;
    // 记录上次点击的时间
    private lastTouchTime: number = 0;
    // 点击间隔时间，单位：毫秒
    private clickInterval: number = 100;
    private nameUIID: any[] = [];
    onTouchStart(event: EventTouch) {
        const currentTime = Date.now();
        // 检查距离上次点击是否超过设定的间隔时间
        if (currentTime - this.lastTouchTime < this.clickInterval) {
            return;
        }
        // 更新上次点击时间
        this.lastTouchTime = currentTime;
        const touchPos = event.getLocation();
        const ray = new geometry.Ray();
        this.mainCamera.screenPointToRay(touchPos.x, touchPos.y, ray);

        const mask = 1 << 1;
        const maxDistance = 10000000;
        const queryTrigger = true;

        console.log("mask mask == " + mask)
        // 调用射线检测，返回是否检测到碰撞体
        if (PhysicsSystem.instance.raycastClosest(ray, mask, maxDistance, queryTrigger)) {
            const result = PhysicsSystem.instance.raycastClosestResult;
            if (result.collider) {
                this.clickTreeUI = null;
                //this.clickTreeUI.scale = new Vec3(0.8, 0.8, 0.8);
                let nodeName = result.collider.node.name;
                if (nodeName.startsWith("UI_famuzhiyin")) { //点击了树
                    if (!this.nameUUId) {
                        this.nameUUId = result.collider.node.uuid;
                    } else {
                        if (this.nameUUId != result.collider.node.uuid) {
                            this.nameUUId = result.collider.node.uuid;
                            // this.nameUIID
                            if (this.nameUIID.indexOf(this.nameUUId) === -1) {
                                this.nameUIID.push(this.nameUUId);
                                Global.clickNum += 1;
                            }
                            // this.nameUIID.push(result.collider.node.uuid);


                            // 
                        }
                    }

                    if (result.collider.node.parent.getChildByName("UI_ZYXS")?.active) {
                        result.collider.node.parent.getChildByName("UI_ZYXS").active = false;
                    }

                    this.clickTreeUI = result.collider.node
                    this.clickTreeUI.scale = this.clickTreeUI.scale.clone().multiplyScalar(0.8);
                    if (!Global.isClickUpLandTree) {
                        return;
                    }
                    let enemyTree = result.collider.node.parent.getComponent(EnemyTree)
                    let isFind = enemyTree.getFindState();
                    if (Global.isClickEnemy && result.collider.node.getComponent(BubbleFead).getFeadState() == false) {
                        isFind = true;
                    }
                    if (isFind) {

                        //渐变消失效果
                        if (result.collider.node.getComponent(BubbleFead)) {
                            result.collider.node.getComponent(BubbleFead).hideFead();
                        }
                        //已经被寻找
                        //enemyTree.setFindState(false);
                        eventMgr.emit(EventType.ENTITY_MOVE_TREE, enemyTree, BehaviourType.Tree);
                    }

                } else if (nodeName == "upgradeNode") { //点击的交付木材按钮
                    if (result.collider.node.getChildByName("UI_ZYXS")?.active) {
                        result.collider.node.getChildByName("UI_ZYXS").active = false;
                    }
                    this.upgradeNode = result.collider.node
                    this.upgradeNode.scale = new Vec3(0.8, 0.8, 0.8);
                    Global.treeHandOver = true;
                    eventMgr.emit(EventType.ENTITY_MOVE_HAND_OVER, result.collider, BehaviourType.HandOver);

                } else if (nodeName == "upgradeNode-001") {
                    if (Global.isUpgrade) {
                        if (!Global.isClickUpgradeEnemy) {
                            Global.isClickUpgradeEnemy = true;
                            Global.soundManager.playWarnSound();
                            let red = result.collider.node.getChildByName("2dNode").getChildByName("scaleNode").getChildByName("Sprite-red")
                            red.active = true;
                            result.collider.node.getComponent(Animation).stop();
                            result.collider.node.getComponent(Animation).play("shanhong");
                            eventMgr.emit(EventType.SHOW_ENEMY, result.collider, BehaviourType.EnemyHnadOverPos);
                            // if (Global.upgradeUIAnimtion != 3) {
                            //     Global.upgradeUIAnimtion = 3;
                            // }
                        }

                        if (!Global.isClickUpgrade) {
                            Global.soundManager.playWarnSound();
                            return;
                        }
                        if (result.collider.node.getChildByName("UI_ZYXS")?.active) {
                            result.collider.node.getChildByName("UI_ZYXS").active = false;
                        }
                        if (Global.upgradeUIAnimtion != 3) {
                            Global.upgradeUIAnimtion = 3;
                        }
                        this.upgradeNode1 = result.collider.node
                        this.upgradeNode1.scale = new Vec3(0.8, 0.8, 0.8);
                        eventMgr.emit(EventType.ENTITY_ENEMY_HAND_OVER, result.collider, BehaviourType.EnemyHnadOverPos);
                    }

                }
                else if (nodeName == "TreeArrow") { //tree 点击传送下个地块

                    if (result.collider.node.getChildByName("UI_ZYXS")?.active) {
                        result.collider.node.getChildByName("UI_ZYXS").active = false;
                    }
                    Global.isMoveCamreToCorn = true;
                    eventMgr.emit(EventType.ENTITY_TREE_TRANSMIT, result.collider.node);

                } else if (nodeName.startsWith("Arrow")) {
                    if (!Global.isClickUpLandCorn || Global.isMoveCamreToCorn) {
                        return;
                    }
                    if (result.collider.node.getChildByName("UI_ZYXS")?.active) {
                        result.collider.node.getChildByName("UI_ZYXS").active = false;
                    }
                    const arrowNum = parseInt(nodeName.replace("Arrow", ""))
                    Global.clickCornLand[arrowNum] = 1;
                    this.cornLandArrow = result.collider.node;
                    this.cornLandArrow.scale = this.cornLandArrow.scale.clone().multiplyScalar(0.8);
                    eventMgr.emit(EventType.ENTITY_CORN_CUT, result.collider.node);

                } else if (nodeName.startsWith("TreeArrow-001")) {

                    if (result.collider.node.getChildByName("UI_ZYXS")?.active) {
                        result.collider.node.getChildByName("UI_ZYXS").active = false;
                    }

                    eventMgr.emit(EventType.ENTITY_ENEMY_TRANSMIT, result.collider.node);

                } else if (nodeName.startsWith("SangshiPrefab")) {


                    if (result.collider.node.parent.getChildByName("UI_gongji_3").getChildByName("UI_ZYXS")?.active) {
                        result.collider.node.parent.getChildByName("UI_gongji_3").getChildByName("UI_ZYXS").active = false;
                    }
                    //  result.collider.enabled = false;
                    //  result.collider.destroy()
                    if (result.collider.node.getComponent(BubbleFead)) {
                        if (result.collider.node.getComponent(BubbleFead).getFeadState()) {
                            return
                        } else {

                            result.collider.node.getComponent(BubbleFead).hideFead();
                            eventMgr.emit(EventType.ENTITY_CLICK_ENEMY, result.collider.node);
                        }

                    }

                }
                console.log("点击到了模型:", result.collider.node.name);
                // 在这里写点击模型后的逻辑
            }
        } else {
            console.log("未检测到碰撞体");
        }
    }
    onTouchMove(event: EventTouch) {

    }
    onTouchEnd(event: EventTouch) {

        if (this.upgradeNode) {
            this.upgradeNode.scale = new Vec3(1, 1, 1);
        }

        if (this.upgradeNode1) {
            this.upgradeNode1.scale = new Vec3(1, 1, 1);
        }
        if (this.clickTreeUI) {
            //this.clickTreeUI.scale = new Vec3(1, 1, 1);
            this.clickTreeUI.scale = this.clickTreeUI.scale.clone().multiplyScalar(1.2);
        }
        if (this.cornLandArrow) {
            this.cornLandArrow.scale = new Vec3(1, 1, 1);
            if (!Global.isClickUpLandCorn) {
                return;
            }
            ///this.cornLandArrow.scale.clone().multiplyScalar(1.2);
        }
    }
    btnDown() {
        super_html_playable.download();
    }
}



