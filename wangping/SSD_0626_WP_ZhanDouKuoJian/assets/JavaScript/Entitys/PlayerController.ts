import { _decorator, Component, Node, Vec3 } from 'cc';
import { Player } from './Player';
import { App } from '../App';
import { CharacterStateType } from './Entity';
import { SoundManager } from '../core/SoundManager';
const { ccclass, property } = _decorator;

@ccclass('PlayerController')
export class PlayerController {
    private player: Player = null;//玩家
    public static _instance: PlayerController = null;
    private tempVec1: Vec3 = new Vec3();
    private tempVec2: Vec3 = new Vec3();
    private attackInterval: number = 0.2; // 攻击检测间隔(秒)
    private lastAttackTime: number = 0;
    private attackTargets = []; // 临时存储本次攻击目标
    private attackAngle: number = 270
    private attackDistance: number = 5.6
    public static get Instance() {
        if (this._instance == null) {
            this._instance = new PlayerController();
        }
        return this._instance;
    }
    getPlayer() {
        return this.player;
    }
    initPlayer() {
        this.player = App.sceneNode.player;
        this.player.idle();
    }
    playMove() {
        this.player.move();
    }
    playIdle() {
        this.player.idle();
    }
    playMoveAttack() {
        this.player.moveAttack();
    }
    update(dt: number) {
        //this.player.update(dt);
        this.playerAttackEnemy(dt);

    }
    playerAttackEnemy(deltaTime: number) {
        // 添加攻击间隔，减少检测频率
        this.lastAttackTime += deltaTime;
        if (this.lastAttackTime < this.attackInterval) {
            return;
        }
        this.lastAttackTime = 0;
        let isMove = true;
        let enemyList = App.enemyController.getEnemyList();

        this.attackTargets.length = 0;
        // 第一步：收集所有符合条件的敌人
        for (let i = 0; i < enemyList.length; i++) {
            Vec3.copy(this.tempVec1, enemyList[i].node.worldPosition);
            this.player.node.getWorldPosition(this.tempVec2);
            // 计算距离
            const distance = Vec3.distance(this.tempVec1, this.tempVec2);

            //方向
            // 计算方向向量（敌人相对于玩家的位置）
            const direction = Vec3.subtract(new Vec3(), this.tempVec1, this.tempVec2);
            Vec3.normalize(direction, direction);

            // 获取玩家正前方的方向向量（假设玩家的forward是其正前方）
            const playerForward = this.player.node.forward.clone().multiplyScalar(-1);
            Vec3.normalize(playerForward, playerForward);

            // 计算两个方向向量的夹角（弧度）
            const angle = Math.acos(Vec3.dot(direction, playerForward));

            // 转换为角度，并检查是否在180度范围内
            const angleDegrees = angle * (180 / Math.PI);
            const isInFront = angleDegrees <= this.attackAngle;

            if (distance <= this.attackDistance && isInFront) {
                this.attackTargets.push(enemyList[i]);
            }
        }
        // 第二步：将目标添加到玩家的攻击列表


        const currentAttackTargets = [...this.attackTargets];
        // 第三步：如果有目标，发起攻击
        if (this.attackTargets.length > 0) {
            isMove = false;
            if (this.player.getMachineName() == CharacterStateType.Move) {
                // console.log("===============================》当前是移动")
                this.player.moveAttack(() => {
                    //this.processAttackTargets(currentAttackTargets)
                    this.playMove();

                });

            } else if (this.player.getMachineName() == CharacterStateType.Idle) {
                this.player.useSkill(() => {
                    // console.log("this.player.useSkill 是否瞬间")
                    //  this.processAttackTargets(currentAttackTargets)
                });
            }
        }

    }
    // 处理攻击目标的辅助方法
    processAttackTargets() {
        const currentAttackTargets = [...this.attackTargets];
        // 从后向前遍历并删除元素，避免索引问题
        for (let i = currentAttackTargets.length - 1; i >= 0; i--) {
            const target = currentAttackTargets[i];
            if (target) {
                target.hit(this.player);
                currentAttackTargets.splice(i, 1);
            }
        }
        // this.player.attackTargetList = []

        // console.log("攻击回调，当前攻击目标数量:", this.player.attackTargetList.length);
    }

}


