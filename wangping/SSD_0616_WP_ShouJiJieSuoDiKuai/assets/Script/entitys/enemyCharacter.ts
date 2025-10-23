import { _decorator, Component, Node, Quat, Vec3, Animation, v3, tween, find, Material, MeshRenderer } from 'cc';
import Entity, { CharacterType } from './Entity';
import { Character } from './Character';
import { goodsDrop } from '../goodsDrop';
import { DissolveEffect } from '../../Res/TX/DissolveEffect/scripts/DissolveEffect';
import { Global } from '../core/Global';
const { ccclass, property } = _decorator;

@ccclass('enemyCharacter')
export class enemyCharacter extends Entity {

    type: string = CharacterType.ENEMY;
    hp: number = 4;
    isFindCharacter: boolean = false;

    private attackNum = 10000;

    @property(DissolveEffect)
    private dissolve: DissolveEffect = null;

    private isFindWay: boolean = true;

    @property(Vec3)
    findWay: Vec3[] = [];

    @property(Number)
    speedTime: number = 0.5;

    private _bloodOffset: Vec3 = new Vec3(0, 4.5, 0);

    // 当前路径点索引
    private currentWaypointIndex: number = 0;
    // 是否在移动到路径点的过程中
    private isMovingToWaypoint: boolean = false;

    protected onLoad(): void {
        // 初始化状态机
        //this.stateMachine.addState("enemyMove", new IdleState(this));


    }
    start() {
        this.init();
    }

    update(deltaTime: number) {
        this.onUpdate(deltaTime);
    }

    private speed: number = 7;
    private targetPos: Vec3 = new Vec3();

    // private isUpate: boolean = false;
    private stopDistance: number = 2; // 默认值调整为更合理的值
    private callback: Function = null;

    // 临时变量，减少GC压力
    private tempDir: Vec3 = new Vec3();
    private tempMoveVec: Vec3 = new Vec3();
    private tempNextPos: Vec3 = new Vec3();
    private tempForward: Vec3 = new Vec3();
    private tempRotation: Quat = new Quat();
    private tempParentRotation: Quat = new Quat();
    private tempParentRotationInv: Quat = new Quat();

    private shoudleAnimation;

    @property(Material)
    baseMaterial: Material = null;

    @property(Material)
    redMaterial: Material = null;

    init() {
        // this.isUpate = true;

        if (!this.characterSkeletalAnimation) {
            console.error("骨骼动画组件未初始化");
            return;
        }
        else {
            // this.characterSkeletalAnimation.play("run");
        }
        this.stopDistance = 2;
        // this.speed = this.getMoveSpeed();
        this.toMove();
    }
    attackEventCallBack() {
        if (!Global.isAttackWarn) {
            Global.warnUI.playWarnFadeAnimation();
            Global.isAttackWarn = true;
        }


        console.log("攻击帧事件回调")
        let ani = (this.target as Character).node.getChildByName("TX_sangshigongji")
        ani.active = true;
        ani.getComponent(Animation).play();
    }
    attacHitkEventCallBack() {

        const skeletalAnim = (this.target as Character).characterSkeletalAnimation;

        if (!(this.target as Character).isAttack) {
            skeletalAnim.stop();
            skeletalAnim.play("shouji");
        }
        (this.target as Character).shakeRed();

        skeletalAnim.once(Animation.EventType.FINISHED, () => {

            skeletalAnim.play("kugongnanidel");
        }, this);
    }
    private isDie: boolean = false;
    private num = 0
    hit() {
        if (this.hp <= 0) {
            return;
        }
        let houseMaterial = this.node.getChildByName("sangshi").getChildByName("fbx_zombie_runnerL").getComponent(MeshRenderer);
        tween(houseMaterial.node)
            // 定义要重复的动作序列：切换材质→等待→切回材质→等待
            .sequence(
                // 切换到目标材质
                tween().call(() => {
                    this.num++;
                    if (this.num >= 3) {
                        //this.characterSkeletalAnimation.stop();
                        this.die()
                    }

                    console.log("切换到目标材质")
                    houseMaterial.material = this.redMaterial;
                }),
                // 等待 0.2 秒
                tween().delay(0.2),
                // 切回原材质
                tween().call(() => {
                    houseMaterial.material = this.baseMaterial;
                }),
                // 等待 0.2 秒（与切换时间对称）
                tween().delay(0.2)
            )
            // 重复整个序列 3 次
            .repeat(1)
            // 启动 tween
            .start();
    }
    toMove() {
        this.scheduleOnce(() => {
            this.characterSkeletalAnimation.play("run");
        }, 0.3)

        if (this.findWay && this.findWay.length > 0) {

            const tweenObj = tween(this.node).to(this.speedTime, { position: this.findWay[0] });

            // 循环处理剩余路径点
            for (let i = 1; i < this.findWay.length; i++) {
                tweenObj.to(this.speedTime, { position: this.findWay[i] });
            }

            tweenObj
                .call(() => { this.isFindWay = false; })
                .start();
        }
    }
    private isdie:boolean = false;
    die() {
        if(this.isDie == false){
            this.isDie = true;
            Global.soundManager.playEnemySound()
            if (this.shoudleAnimation) {
                this.unschedule(this.shoudleAnimation)
                this.shoudleAnimation = null;
            }
            this.attackNum = -1;
    
    
            // this.node.getChildByName("sangshi").getChildByName("fbx_zombie_runnerL")
            this.characterSkeletalAnimation.play("death");
            this.characterSkeletalAnimation.once(Animation.EventType.FINISHED, () => {
                if (this.dissolve) {
                    this.dissolve.play(0.8)
                }
                this.scheduleOnce(() => {
                    this.node.active = false;
                    this.node.destroy();
                }, 0.8)
    
            })
        }

    }

    /**移动逻辑处理 */
    onUpdate(dt: number) {
        if (!this.isFindCharacter) return;
        Global.soundManager.playEnemySound()
        if (this.isFindWay) {


        } else {
            // 更新目标位置
            this.moveTargetWorldPos = (this.target as Character).node.worldPosition.clone();
            Vec3.copy(this.targetPos, this.moveTargetWorldPos);

            // 移动到目标
            if (this.moveToTarget(dt, this.targetPos)) {
                this.isFindCharacter = false;
            }
        }

    }
    // 在类中添加一个标志位，确保只执行一次
    private hasInitGoods: boolean = false;
    attackCharactr() {
        Global.soundManager.playEnemySound()
        if (this.num < 3) {
            if (this.attackNum > 0) {
                this.characterSkeletalAnimation.play("attack");
                this.characterSkeletalAnimation.once(Animation.EventType.FINISHED, () => {

                    // 2. 先判断组件是否存在，避免空指针
                    const skeletalAnim = (this.target as Character).characterSkeletalAnimation;
                    if (!skeletalAnim) {
                        console.error("骨骼动画组件不存在！");
                        return;
                    }
                    if (this.hp <= 0) {
                        return;
                    }
                    // 3. 停止当前动画



                    // skeletalAnim.stop();
                    // skeletalAnim.play("shouji");
                    // skeletalAnim.once(Animation.EventType.FINISHED, () => {
                    //     //(this.target as Character)
                    //     //(this.target as Character).idle();
                    // }, this);
                    this.attackNum--;
                    if (this.hp <= 0) {
                        return;
                    }
                    //if(this.attackNum === 9){
                    if (!this.hasInitGoods) {
                        let chNode = this.node.getChildByName("UI_gongji")

                        if (this.node.getChildByName("UI_ZYXS")?.active == false) {
                            this.node.getChildByName("UI_ZYXS").active = true;
                        }

                        (this.target as Character).getComponent(goodsDrop).initGoods();
                        console.log("(this.node.name == ", this.node.name);

                        const match = this.node.name.match(/SangshiPrefab_(\d+)/);
                        if (match) {
                            const index = match[1];
                            // 动态获取对应的攻击UI元素
                            const gongji = this.node.getParent().getChildByName(`UI_gongji_${index}`);

                            if (gongji) {

                                const currentPos = this.node.worldPosition.clone();
                                const bloodPos: Vec3 = new Vec3();
                                Vec3.add(bloodPos, currentPos, this._bloodOffset);

                                // 设置位置
                                gongji.setWorldPosition(bloodPos);

                                gongji.active = true;
                            }
                        }

                        //  this.node.getParent().getChildByName("UI_gongji").active = true;
                        // this.node.getChildByName("UI_gongji").active = true;
                        // this.shoudleAnimation = this.schedule(() => {
                        //     this.node.getChildByName("UI_gongji").getComponent(Animation).play();
                        //     //this.node.getChildByName("UI_gongji").getComponent(Animation).play();
                        // }, 1)

                        this.hasInitGoods = true;
                    }
                    // (this.target as Character).getComponent(goodsDrop).cornRandomPos(1);
                    (this.target as Character).getComponent(goodsDrop).randomizeItemsInBackpack(0, 1);
                    (this.target as Character).getComponent(goodsDrop).randomizeItemsInBackpack(1, 1);

                    // }
                    this.attackCharactr();
                })
            } else {

                return;
            }
        }


    }
    /**.getParent
     * 旋转角色朝向目标位置
     * @param targetPos 目标位置
     */
    private lookAtTarget(targetPos: Vec3) {
        // 计算朝向向量 (目标位置 - 当前位置)
        Vec3.subtract(this.tempForward, targetPos, this.node.worldPosition);
        this.tempForward.y = 0; // 保持水平方向
        this.tempForward.normalize();

        // 如果有父节点旋转，需要转换到局部空间
        const parent = this.node.parent?.parent;
        if (parent) {
            // 获取父节点旋转
            parent.getRotation(this.tempParentRotation);

            // 计算逆旋转
            Quat.invert(this.tempParentRotationInv, this.tempParentRotation);

            // 将世界方向转换到父节点局部空间
            Vec3.transformQuat(this.tempForward, this.tempForward, this.tempParentRotationInv);
        }

        // 计算旋转四元数
        Quat.fromViewUp(this.tempRotation, this.tempForward, Vec3.UP);
        this.node.setRotation(this.tempRotation);
    }

    /**
     * 移动角色到目标位置
     * @param deltaTime 帧间隔时间
     * @param targetPos 目标位置
     * @returns 是否到达目标
     */
    private moveToTarget(deltaTime: number, targetPos: Vec3): boolean {
        // 计算方向向量
        Vec3.subtract(this.tempDir, targetPos, this.node.worldPosition);
        this.tempDir.y = 0; // 保持水平移动

        const distance = this.tempDir.length();

        // console.log("=================>", distance, "====================>", this.stopDistance)
        if (distance < this.stopDistance) { // 距离足够近，认为已到达目标
            this.attackCharactr();
            return true;
        }

        // 归一化方向向量
        this.tempDir.normalize();

        // 计算本次移动距离
        const moveDistance = this.speed * deltaTime;
        if (moveDistance >= distance) {
            // 本次移动距离超过剩余距离，直接设置到目标位置

            this.node.worldPosition = targetPos.clone();
            this.lookAtTarget(targetPos);
            this.attackCharactr();
            return true;
        } else {
            // 计算移动向量
            Vec3.multiplyScalar(this.tempMoveVec, this.tempDir, moveDistance);

            // 计算下一个位置
            Vec3.add(this.tempNextPos, this.node.worldPosition, this.tempMoveVec);

            // 设置新位置
            this.node.worldPosition = this.tempNextPos;

            // 转向目标
            this.lookAtTarget(targetPos);
            return false;
        }
    }

    /**退出移动状态 */
    onExit() {
        this.moveTargetWorldPos = null;
        // this.target = null;
        this.speed = 0;
        this.targetPos.set(0, 0, 0);
        this.stopDistance = 2;
        this.isFindCharacter = false;
        this.callback = null;
    }
}


