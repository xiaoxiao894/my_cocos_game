import { _decorator, Component, Node, Quat, v2, Vec2, Vec3, Animation, tween, ProgressBar, approx, Material, SkinnedMeshRenderer, ParticleSystem } from 'cc';
import Entity from './Entity';
import { Simulator } from '../RVO/Simulator';
import { App } from '../App';
import { GlobeVariable } from '../core/GlobeVariable';
import { PlayerController } from './PlayerController';
import { RVOMath, Vector2 } from '../RVO/Common';
import Blood from './Blood';
import { SoundManager } from '../core/SoundManager';
import { DissolveEffect } from '../../Res/Fbx/materials/DissolveEffect/scripts/DissolveEffect';
import { BooldPaling } from '../BooldPaling';
import { PalingMaterial } from '../PalingMaterial';
import { palingTs } from '../palingTs';
/**
 *   敌人状态用类型限时状态
 *   没有太复杂逻辑 在本类做处理即可
 */
export enum enemyStateType {
    // Idle = "idle",    // 玩家角色
    Move = "move",    // 静态玩家角色
    Hit = "hit",  //不需要操作有自己行为的角色
    Attack = "attack",    // 敌人角色
    Die = "die"
}
const { ccclass, property } = _decorator;

@ccclass('EnemyBear')
export class EnemyBear extends Entity {

    @property(Node)
    electricParticle: Node = null;

    @property(Material)
    baseMaterial: Material = null;

    @property(Material)
    redMaterial: Material = null;

    @property(Node)
    attackNode: Node = null;

    @property(Node)
    hitParticle1: Node = null;

    private machineState: enemyStateType = enemyStateType.Move;
    private _blood: Blood = null;

    private moveTargetType: number = -1;//追击主角 2 追击围栏
    //追击位置
    private moveTargetPos: Vec2 = null;
    //追击目标 是记录墙
    private moveTargetPaling: Node = null;
    //震退距离
    @property({ type: Number, tooltip: "震退距离" })
    private hitPow = 5;

    //震退高度
    @property({ type: Number, tooltip: "震退高度" })
    private hitPowHight = 3;

    //震退距离
    @property({ type: Number, tooltip: "塔震退距离" })
    private towerHitPow = 3;

    //震退高度
    @property({ type: Number, tooltip: "塔震退高度" })
    private towerHitPowHight = 3;
    //血条初始位置
    private _bloodOffset: Vec3 = new Vec3(0, 3, 0);
    //最大血量 当前血量
    hp = 2;
    maxHp = 2;
    //帧率
    private _frames: number = 0;
    //是否被攻击
    private isHit: boolean = false;

    //是否到达追踪的栅栏
    private _isArrivePaling: boolean = false;
    //RVOid
    private _agentHandleId: number = -1;
    public get agentHandleId(): number {
        return this._agentHandleId;
    }
    public set agentHandleId(value: number) {
        this._agentHandleId = value;
    }
    private deHitTime: number = 0;
    private deHitTimeMax: number = 0.5;


    /** 初始化 */
    public init(): void {
        this.electricParticle.active = false;
        //创建血条
        let bloodNode: Node = App.poolManager.getNode(GlobeVariable.entifyName.BloodBar);
        bloodNode.parent = App.sceneNode.bloodParent;
        bloodNode.active = false;
        this._blood = bloodNode.getComponent(Blood);
        this._blood?.init(this.maxHp);
        this.move();
        this.update(0);

        this.node.getChildByName("Bear_丧尸").getComponent(DissolveEffect).resetToOriginal();
        this.node.getChildByName("Bear_丧尸").getComponent(DissolveEffect).init();
    }
    dissolveEvent() {
        this.node.getChildByName("Bear_丧尸").getComponent(DissolveEffect).init();
        this.node.getChildByName("Bear_丧尸").getComponent(DissolveEffect).play(0.8);
    }


    shakeRed() {
        let material = this.node.getChildByName("Bear_丧尸").getComponent(SkinnedMeshRenderer)

        tween(material.node)
            // 定义要重复的动作序列：切换材质→等待→切回材质→等待
            .sequence(
                // 切换到目标材质
                tween().call(() => {
                    material.setMaterialInstance(this.redMaterial, 0);

                }),
                // 等待 0.2 秒
                tween().delay(0.2),
                // 切回原材质
                tween().call(() => {
                    material.setMaterialInstance(this.baseMaterial, 0);
                    if (this.hp <= 0) {
                        this.dissolveEvent();
                        // this.node.getChildByName("Bear_丧尸").getComponent(DissolveEffect).init();
                        // this.node.getChildByName("Bear_丧尸").getComponent(DissolveEffect).play(0.8);
                    }
                }),
                // 等待 0.2 秒（与切换时间对称）
                // tween().delay(0.2)
            )
            // 重复整个序列 3 次
            // .repeat(1)
            // 启动 tween
            .start();
    }
    hit(play) {
        if (this.machineState != enemyStateType.Die) {
            this.deHitTime = 0;

            if (this.machineState != enemyStateType.Hit)
                this.machineState = enemyStateType.Hit;
            if (!this.characterSkeletalAnimation.getState("hit").isPlaying) {
                //console.log("this.node.uuid ===  ", this.node.uuid)
                this.characterSkeletalAnimation.play("hit")
            }
            if (play.getEntityName() === GlobeVariable.entifyName.player) {
                const currentPos = this.node.getWorldPosition().clone();
                const playerPos = play.node.getWorldPosition().clone();

                // 计算击退方向向量
                let goalVector = new Vec2(playerPos.x, playerPos.z).subtract2f(currentPos.x, currentPos.z);
                goalVector = goalVector.normalize().multiplyScalar(-this.hitPow);
                // 预测击退后的终点
                const knockbackFinalPos = currentPos.clone().add(new Vec3(goalVector.x, 0, goalVector.y));
                if (!this.posIsInDoor(knockbackFinalPos)) {
                    // 记录原始y坐标
                    const originalY = this.node.worldPosition.y;

                    tween(this.node)
                        .parallel(
                            // x/z方向的击退动作
                            tween().to(0.15, { position: knockbackFinalPos }, {
                                onUpdate: () => {
                                    this.updateBloodPos();
                                }
                            }),
                            // y轴的升降动作
                            tween()
                                .to(0.075, { position: new Vec3(knockbackFinalPos.x, originalY + this.hitPowHight, knockbackFinalPos.z) })
                                .to(0.075, { position: new Vec3(knockbackFinalPos.x, originalY, knockbackFinalPos.z) })
                        )
                        .call(() => {
                            const agent = Simulator.instance.getAgentByAid(this.agentHandleId);
                            if (agent && this.node?.isValid) {
                                const newWorldPos = this.node.worldPosition;
                                agent.position_ = new Vector2(newWorldPos.x, newWorldPos.z);
                            }
                        })
                        .start();
                }
                //闪红动画
                this.shakeRed();
                //被打动画
                this.hitEffct1();
                // const effectNode: Node = App.poolManager.getNode(GlobeVariable.entifyName.TX_Attack_hit);
                // if (effectNode) {
                //     const ani: Animation = effectNode.getComponent(Animation);
                //     if (ani) {
                //         effectNode.parent = App.sceneNode.effectParent;
                //         effectNode.setWorldPosition(this.node.worldPosition);
                //         ani.play();
                //         ani.once(Animation.EventType.FINISHED, () => {
                //             effectNode.removeFromParent();
                //             App.poolManager.returnNode(effectNode, GlobeVariable.entifyName.TX_Attack_hit);
                //         });
                //     }
                // }
            }


            this.takeDamage(play.attack);
            this.setShowHp(play.attack);
        }
    }

    hitEffct1(back: () => void = null) {

        let arrowTx = App.poolManager.getNode(GlobeVariable.entifyName.TX_Attack_hit);
        arrowTx.parent = this.hitParticle1.parent
        arrowTx.setPosition(this.hitParticle1.position);
        arrowTx.active = true;
        let particle = arrowTx.getComponent(ParticleSystem);
        particle
        particle.play()
        this.scheduleOnce(() => {
            // 1. 停止粒子播放
            particle.stop();
            // 3. 可选：手动清除所有粒子（根据引擎特性）
            particle.clear();
            arrowTx.active = false;
            arrowTx.removeFromParent()
            App.poolManager.returnNode(arrowTx, GlobeVariable.entifyName.TX_Attack_hit);
            if (back) {
                back();
            }

        }, 1.5)
    }
    //普通的被攻击
    baseHit(attack: number, startPos: Vec3) {
        const currentPos = this.node.getWorldPosition().clone();
        const playerPos = startPos// play.node.getWorldPosition().clone();

        // 计算击退方向向量
        let goalVector = new Vec2(playerPos.x, playerPos.z).subtract2f(currentPos.x, currentPos.z);
        goalVector = goalVector.normalize().multiplyScalar(-this.towerHitPow);
        // 预测击退后的终点
        const knockbackFinalPos = currentPos.clone().add(new Vec3(goalVector.x, 0, goalVector.y));
        if (!this.characterSkeletalAnimation.getState("hit").isPlaying) {
            //console.log("this.node.uuid ===  ", this.node.uuid)
            this.characterSkeletalAnimation.play("hit")
        }
        if (!this.posIsInDoor(knockbackFinalPos)) {
            const originalY = this.node.worldPosition.y;

            tween(this.node)
                .parallel(
                    // x/z方向的击退动作
                    tween().to(0.225, { position: knockbackFinalPos }, {
                        onUpdate: () => {
                            this.updateBloodPos();
                        }
                    }),
                    // y轴的升降动作
                    tween()
                        .to(0.125, { position: new Vec3(knockbackFinalPos.x, originalY + this.towerHitPowHight, knockbackFinalPos.z) })
                        .to(0.125, { position: new Vec3(knockbackFinalPos.x, originalY, knockbackFinalPos.z) })
                )
                .call(() => {
                    const agent = Simulator.instance.getAgentByAid(this.agentHandleId);
                    if (agent && this.node?.isValid) {
                        const newWorldPos = this.node.worldPosition;
                        agent.position_ = new Vector2(newWorldPos.x, newWorldPos.z);
                    }
                })
                .start();
        }
        //this.deHitTime = 0;
        this.shakeRed();
        this.takeDamage(attack);
        this.setShowHp(attack);
        this.electricParticle.active = true;
        this.scheduleOnce(() => {
            this.electricParticle.active = false;
        }, 0.5);
    }
    hideBlood() {
        if (!this._blood) {
            return;
        }
        this._blood.node.active = false;
    }
    setShowHp(attack: number) {
        if (!this._blood) {
            return;
        }
        this._blood.node.active = true;
        this._blood.injuryAni(attack);
    }

    move() {
        if (this.machineState != enemyStateType.Move)
            this.machineState = enemyStateType.Move;
        if (!this.characterSkeletalAnimation.getState("walk").isPlaying) {
            //console.log("this.node.uuid ===  ", this.node.uuid)
            this.characterSkeletalAnimation.play("walk")
            return;
        }
    }
    resetPaling() {
        this.moveTargetPaling = null;
        let paling = App.palingAttack.getNearstPaling(this.node.worldPosition.clone());
        if (paling) {
            let palingPos = paling.node.getWorldPosition();
            //console.log("palingPos", palingPos)
            this.moveTargetPaling = paling.node;
        }
    }

    /**攻击的帧事件回调 */
    attackEvent() {
        if (this.moveTargetPaling) {
            // const bloodPaling = this.moveTargetPaling?.getChildByName("BloodPaling");
            // if (bloodPaling) {
            //     bloodPaling.active = true;
            //     this.moveTargetPaling.getChildByName("BloodPaling").active = true;
            //     let bloodPalingTs = this.moveTargetPaling.getChildByName("BloodPaling").getComponent(BooldPaling);
            //     if (bloodPalingTs) {
            //         bloodPalingTs.subscribeBool();
            //     }

            // }
            this.moveTargetPaling?.getComponent(PalingMaterial)?.shakeMaterial();

            const bloodPaling = this.moveTargetPaling?.getComponent(palingTs);
            if (bloodPaling) {
                bloodPaling.show(); // 移除重复的赋值
                bloodPaling?.subscribeBool();
            }
            // const bloodPaling = this.moveTargetPaling?.getChildByName("BloodPaling");
            // if (bloodPaling) {
            //   bloodPaling.active = true; // 移除重复的赋值
            //   bloodPaling.getComponent(BooldPaling)?.subscribeBool();
            // }

        }
    }
    attack1() {
        if (this.machineState != enemyStateType.Attack)
            this.machineState = enemyStateType.Attack;
        if (!this.characterSkeletalAnimation.getState("attack").isPlaying) {

            this.characterSkeletalAnimation.play("attack");
            if (this._isArrivePaling) {
                GlobeVariable.bearAttackPalingNum_audio++;
                if (GlobeVariable.bearAttackPalingNum_audio < 4) {
                    SoundManager.inst.playAudio("YX_daqiang");
                }

            }
            return true;
        }
        return false;
    }
    randomPos() {
        // 获取原位置并克隆
        const originalPos = this.node.getWorldPosition().clone();
        // 生成随机方向向量并归一化
        const randomDir = new Vec3(
            Math.random() * 2 - 1,  // x轴: -1 到 1
            0,  // y轴: -1 到 1
            Math.random() * 2 - 1   // z轴: -1 到 1
        ).normalize();
        // 计算5单位距离的随机偏移量并添加到原位置
        const randomPos = originalPos.add(randomDir.multiplyScalar(2));
        // 使用随机位置掉落物品
        App.dropController.dropItem(randomPos);
    }
    die(callback?: (...agrs: unknown[]) => void): void {
        if (this.machineState != enemyStateType.Die)
            this.machineState = enemyStateType.Die;
        if (!this.characterSkeletalAnimation.getState("die").isPlaying) {

            // this.node.getChildByName("Bear_丧尸")?.getComponent(DissolveEffect)?.init();

            // this.node.getChildByName("Bear_丧尸")?.getComponent(DissolveEffect)?.play(0.8);

            //App.dropController.dropItem(this.node.getWorldPosition().clone());
            this.randomPos();

            this.characterSkeletalAnimation.play("die");
            GlobeVariable.bearDiegNum_audio++;
            if (GlobeVariable.bearDiegNum_audio < 4) {
                SoundManager.inst.playAudio("YX_xiong");
            }
        }

        this._frames = 0;
        this.isHit = false;
        // 从RVO模拟器中移除代理，避免残留影响路径计算
        // console.log("die agentHandleId", this.agentHandleId);

        if (this.agentHandleId !== -1) {
            Simulator.instance.removeAgent(this.agentHandleId);
            this.agentHandleId = -1;
        }
        //从打栏杆移除
        if (this.moveTargetPaling) {
            let paling = App.palingAttack.getPalingByUuid(this.moveTargetPaling.uuid);
            if (paling) {
                App.palingAttack.updatePalingCurNum(paling.node.uuid, Math.max(paling.curNum - 1, 0));
            }
            this.moveTargetPaling = null;
            this.moveTargetType = -1;
        }
        // 1. 从EnemyController的列表中移除自己
        App.enemyController.removeEnemy(this);

        this.characterSkeletalAnimation.once(Animation.EventType.FINISHED, () => {
            //console.log("enemy die");
            this.node.getChildByName("Bear_丧尸").getComponent(DissolveEffect).resetToOriginal()
            this.reset();
            this.node.removeFromParent();
            this.node.active = false;
            // 回收节点到对象池（检查节点有效性）
            if (this.node?.isValid) {

                App.poolManager.returnNode(this.node, GlobeVariable.entifyName.EnemyBear);
            }
            // 回收血条节点（检查节点有效性）
            if (this._blood?.isValid) {
                this._blood.node.active = false;
                this._blood = null;
            }


        });
    }

    private reset() {
        this._frames = 0;
        this._isArrivePaling = false;
        this.hp = this.maxHp;
        this.moveTargetType = -1;
        this.moveTargetPos = null;
        this.moveTargetPaling = null;
    }

    /**
     * 在此之前 请确保Simulator run执行完毕
     */
    private _curState = null;
    moveByRvo(dt) {

        if (this.agentHandleId == -1) return;

        const currentPos1 = new Vec3();
        Vec3.copy(currentPos1, this.node.worldPosition);

        // 获取玩家的世界位置
        const playerPos = new Vec3();
        if (this.moveTargetPaling) {
            this.moveTargetPaling.getWorldPosition(playerPos);
        } else {
            PlayerController.Instance.getPlayer().node.getWorldPosition(playerPos);
        }

        // 计算距离
        const distance = Vec3.distance(currentPos1, playerPos);


        // 如果距离小于等于攻击距离，则执行攻击逻辑
        if (distance <= 3) {
            if (this.moveTargetType === 2) {
                this._isArrivePaling = true;
            }

            if (this.attack1()) {
                return;
            }
        } else {

            this.move();
            const p = Simulator.instance.getAgentPosition(this.agentHandleId);
            const targetPos = new Vec3(p.x, 0.2, p.y);
            const currentPos = this.node.worldPosition.clone();

            const dist = Vec3.distance(currentPos, targetPos);
            if (dist > 0.01) {
                const smoothFactor = 1;
                Vec3.lerp(currentPos, currentPos, targetPos, dt * smoothFactor);
                this.node.setWorldPosition(currentPos);
            }

            this.updateBloodPos();
        }
    }

    private updateBloodPos() {
        //同步更新血条位置
        if (this._blood) {
            let bloodPos: Vec3 = new Vec3();
            Vec3.add(bloodPos, this.node.worldPosition.clone(), this._bloodOffset);
            this._blood.node.setWorldPosition(bloodPos);
        }
    }

    // _frames: number = 0
    update(deltaTime: number) {

        if (this._frames++ > 8) {
            this._frames = 0
            if (this.hp <= 0) return;
            this.deHitTime += deltaTime;
            if (this.deHitTime >= this.deHitTimeMax) {
                this.hideBlood();
            }

            this.setPreferredVelocities()//设置追踪主角的线速度
            if (this.moveTargetType !== -1) {
                // if(this.moveTargetType !== 1){
                //     console.log("moveTargetType", this.moveTargetType,this.moveTargetPaling === null);
                // }
                const pos = this.moveTargetType === 1
                    ? PlayerController.Instance.getPlayer().node.worldPosition
                    : this.moveTargetPaling.worldPosition;
                //确定朝向
                this.rotateTowards(pos, deltaTime);
            }
        }

    }

    /**
    * 设置追踪主角的线速度方向和大小
    *  
    */
    setPreferredVelocities(hitPow: number = null) {
        if (this.agentHandleId < 0) {
            return;
        }
        const isPlayerInDoorArea = PlayerController.Instance.getPlayer().isInDoor();
        const inDoor: boolean = this.isInDoor();
        if (isPlayerInDoorArea) {
            //玩家在门里
            if (!this.moveTargetPaling) {
                //给个寻找的围栏
                //寻找围栏
                let paling = App.palingAttack.getNearstPaling(this.node.worldPosition.clone());
                if (paling) {
                    let palingPos = paling.node.getWorldPosition();
                    //console.log("palingPos", palingPos)
                    this.moveTargetPaling = paling.node;
                    App.palingAttack.updatePalingCurNum(paling.node.uuid, paling.curNum + 1);
                    this.moveTargetPos = v2(palingPos.x, palingPos.z);
                    this.moveTargetType = 2;
                    //console.log("set moveTargetType 2",this.moveTargetPaling === null)
                } else {
                    this.moveTargetType = 1;
                }
            }
        } else {


            const currentPos = new Vec3();
            Vec3.copy(currentPos, this.node.worldPosition);

            //获取玩家的世界位置
            const playerPos = new Vec3();
            PlayerController.Instance.getPlayer().node.getWorldPosition(playerPos);

            // 计算距离
            const distance = Vec3.distance(currentPos, playerPos);
            if (distance < 7.5 && !this._isArrivePaling) {
                this.moveTargetType = 1;
                if (this.moveTargetPaling) {
                    let paling = App.palingAttack.getPalingByUuid(this.moveTargetPaling.uuid);
                    if (paling) {
                        App.palingAttack.updatePalingCurNum(paling.node.uuid, Math.max(paling.curNum - 1, 0));
                    }
                    this.moveTargetPaling = null;
                    this.moveTargetType = 1;
                }
            } else {
                //玩家在门里
                if (!this.moveTargetPaling) {
                    //给个寻找的围栏
                    //寻找围栏
                    let paling = App.palingAttack.getNearstPaling(this.node.worldPosition.clone());
                    if (paling) {
                        let palingPos = paling.node.getWorldPosition();
                        //console.log("palingPos", palingPos)
                        this.moveTargetPaling = paling.node;
                        App.palingAttack.updatePalingCurNum(paling.node.uuid, paling.curNum + 1);
                        this.moveTargetPos = v2(palingPos.x, palingPos.z);
                        this.moveTargetType = 2;
                        //console.log("set moveTargetType 2",this.moveTargetPaling === null)
                    }
                }
            }

            // //玩家在门外
            // if (this.moveTargetType === 2 && !this._isArrivePaling) {
            //     //改为追踪玩家
            //     this.moveTargetType = 1;
            //     if (this.moveTargetPaling) {
            //         let paling = App.palingAttack.getPalingByUuid(this.moveTargetPaling.uuid);
            //         if (paling) {
            //             App.palingAttack.updatePalingCurNum(paling.node.uuid, Math.max(paling.curNum - 1, 0));
            //         }
            //         this.moveTargetPaling = null;
            //         this.moveTargetType = 1;
            //     }
            // } else if (this.moveTargetType !== 2) {
            //     this.moveTargetType = 1;
            // }
        }



        let agentAid = this.agentHandleId
        let agent = Simulator.instance.getAgentByAid(agentAid)
        let agentPos = Simulator.instance.getAgentPosition(agentAid)


        let moveTargetPos: Vec2 = this.moveTargetType === 2
            ? this.moveTargetPos.clone()
            : v2(PlayerController.Instance.getPlayer().node.getWorldPosition().x,
                PlayerController.Instance.getPlayer().node.getWorldPosition().z);

        if (hitPow) {
            if (agent && agentPos) {
                let goalVector: Vec2 = moveTargetPos.subtract2f(agentPos.x, agentPos.y)
                goalVector = goalVector.normalize().multiplyScalar(agent.maxSpeed_ * -hitPow);
                Simulator.instance.setAgentPrefVelocity(agentAid, goalVector);
            }
            return;
        }

        if (agent && agentPos) {
            let goalVector: Vec2 = moveTargetPos.subtract2f(agentPos.x, agentPos.y)
            if (goalVector.lengthSqr() > 1.0) {
                goalVector = goalVector.normalize().multiplyScalar(agent.maxSpeed_);
            }
            if (goalVector.lengthSqr() < RVOMath.RVO_EPSILON) {
                Simulator.instance.setAgentPrefVelocity(agentAid, Vec2.ZERO);
            }
            else {
                Simulator.instance.setAgentPrefVelocity(agentAid, goalVector);
            }
        } else {
            console.error("RVO异常::", agent, agentPos, agentAid)
        }

    }

    // 旋转到目标方向
    private rotateTowards(targetWorldPos: Vec3, dt: number) {
        const currentPos = this.node.worldPosition.clone();
        const dir = new Vec3();
        Vec3.subtract(dir, targetWorldPos, currentPos);
        dir.y = 0;
        dir.normalize();

        if (!dir) return;

        const targetQuat = new Quat();
        Quat.fromViewUp(targetQuat, dir, Vec3.UP);

        const currentQuat = this.node.worldRotation.clone();
        const resultQuat = new Quat();
        Quat.slerp(resultQuat, currentQuat, targetQuat, Math.min(1, dt * 40));
        this.node.worldRotation = resultQuat;
    }

    public isAlive(): boolean {
        return this.machineState !== enemyStateType.Die;
    }
}