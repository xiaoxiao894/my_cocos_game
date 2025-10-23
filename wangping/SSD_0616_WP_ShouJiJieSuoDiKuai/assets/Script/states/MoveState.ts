import { _decorator, Component, Node, Quat, Vec3 } from 'cc';
import State from './State';
import Entity, { CharacterType } from '../entitys/Entity';
import { eventMgr } from '../core/EventManager';
import { EventType } from '../core/EventType';
import { BehaviourType, Character } from '../entitys/Character';
import { enemyCharacter } from '../entitys/enemyCharacter';
import { Global } from '../core/Global';
const { ccclass, property } = _decorator;

@ccclass('MoveState')
export class MoveState extends State {
    // private target: any = null;
    private speed: number = 0;
    private targetPos: Vec3 = new Vec3();

    private isUpate: boolean = false;
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

    constructor(entity: Entity) {
        super();
        this.entity = entity;
    }

    /**进入移动状态 */
    onEnter(callback?: () => void) {
        this.isUpate = true;

        if (this.entity.getType() == CharacterType.CHARACTER) {
            // 检查骨骼动画组件是否存在
            if (!this.entity.characterSkeletalAnimation) {
                console.error("骨骼动画组件未初始化");
                return;
            }
            this.entity.characterSkeletalAnimation.play("kugongnanpao");
        }
        if ((this.entity as Character).getBehaviour() == BehaviourType.Tree) {
            this.stopDistance = 2;
        } else if ((this.entity as Character).getBehaviour() == BehaviourType.FindEnemy) {
            this.stopDistance = 2;
        }
        else {
            this.stopDistance = 0.5;
        }

        this.speed = this.entity.getMoveSpeed();
        this.callback = callback;
    }

    /**移动逻辑处理 */
    onUpdate(dt: number) {
        if (!this.isUpate) return;
        Global.soundManager.playPlayerRunSound();
        // 更新目标位置
        if ((this.entity as Character).getBehaviour() == BehaviourType.FindEnemy) {
            this.entity.moveTargetWorldPos = (this.entity.target as enemyCharacter).node.worldPosition;
        }
        Vec3.copy(this.targetPos, this.entity.moveTargetWorldPos);

        // 移动到目标
        if (this.moveToTarget(dt, this.targetPos)) {
            
            this.isUpate = false;
        }
    }

    /**
     * 旋转角色朝向目标位置
     * @param targetPos 目标位置
     */
    private lookAtTarget(targetPos: Vec3) {
        // 计算朝向向量 (目标位置 - 当前位置)
        Vec3.subtract(this.tempForward, targetPos, this.entity.node.worldPosition);
        this.tempForward.y = 0; // 保持水平方向
        this.tempForward.normalize();

        // 如果有父节点旋转，需要转换到局部空间
        const parent = this.entity.node.parent?.parent;
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
        this.entity.node.setRotation(this.tempRotation);
    }

    /**
     * 移动角色到目标位置
     * @param deltaTime 帧间隔时间
     * @param targetPos 目标位置
     * @returns 是否到达目标
     */
    private moveToTarget(deltaTime: number, targetPos: Vec3): boolean {
        // 计算方向向量
        Vec3.subtract(this.tempDir, targetPos, this.entity.node.worldPosition);
        this.tempDir.y = 0; // 保持水平移动

        const distance = this.tempDir.length();

        console.log("=================>", distance, "====================>", this.stopDistance)
        if (distance < this.stopDistance) { // 距离足够近，认为已到达目标
            if (this.callback) {
                this.callback(this.entity);
            }
            return true;
        }

        // 归一化方向向量
        this.tempDir.normalize();

        // 计算本次移动距离
        const moveDistance = this.speed * deltaTime;
        if (moveDistance >= distance) {
            // 本次移动距离超过剩余距离，直接设置到目标位置
            if (this.callback) {
                this.callback(this.entity);
            }
            console.log("=============moveDistance", targetPos)
            this.entity.node.worldPosition = targetPos.clone();
            this.lookAtTarget(targetPos);
            return true;
        } else {
            // 计算移动向量
            Vec3.multiplyScalar(this.tempMoveVec, this.tempDir, moveDistance);

            // 计算下一个位置
            Vec3.add(this.tempNextPos, this.entity.node.worldPosition, this.tempMoveVec);

            // 设置新位置
            this.entity.node.worldPosition = this.tempNextPos;

            // 转向目标
            this.lookAtTarget(targetPos);
            return false;
        }
    }

    /**退出移动状态 */
    onExit() {
        this.entity.moveTargetWorldPos = null;
        // this.target = null;
        this.speed = 0;
        this.targetPos.set(0, 0, 0);
        this.stopDistance = 2;
        this.isUpate = false;
        this.callback = null;
    }
}