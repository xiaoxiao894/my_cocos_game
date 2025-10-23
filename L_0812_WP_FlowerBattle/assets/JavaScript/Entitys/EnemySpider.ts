import { _decorator, Component, Node, Quat, v2, Vec2, Vec3, Animation, tween, ProgressBar, approx, Material, SkinnedMeshRenderer, Tween, MeshRenderer, ParticleSystem, SkeletalAnimation } from 'cc';
import Entity from './Entity';
import { Simulator } from '../RVO/Simulator';
import { App } from '../App';
import { GlobeVariable } from '../core/GlobeVariable';
import { PlayerController } from './PlayerController';
import { RVOMath, Vector2 } from '../RVO/Common';
import Blood from './Blood';
import { SoundManager } from '../core/SoundManager';
//import { DissolveEffect } from '../../Res/Fbx/materials/DissolveEffect/scripts/DissolveEffect';
import { BooldPaling } from '../BooldPaling';
import { PalingMaterial } from '../PalingMaterial';
import RVOUtils from '../RVO/RVOUtils';
import { DissolveEffect } from '../../Res/DissolveEffect/scripts/DissolveEffect';
import { Flower } from './Flower';
import { blockRed } from '../blockRed';
/**
 *   敌人状态用类型限时状态
 *   没有太复杂逻辑 在本类做处理即可
 */
export enum enemyStateType {
    Idle = "idle",
    Move = "move",
    Hit = "hit",
    Attack = "attack",
    Die = "die",
    Walk = "walk",
    Track = "track"
}
const { ccclass, property } = _decorator;

@ccclass('EnemySpider')
export class EnemySpider extends Entity {

    // @property(Node)
    // electricParticle: Node = null;

    @property(Material)
    baseMaterial: Material = null;

    @property(Material)
    grayMaterial: Material = null;

    @property(SkinnedMeshRenderer)
    skinnedMeshRenderer: SkinnedMeshRenderer = null;
    @property(DissolveEffect)
    dissolveEffect: DissolveEffect[] = [];

    @property(Node)
    hitPosNode: Node = null;

    @property(ParticleSystem)
    hitParticle: ParticleSystem = null;

    @property(ParticleSystem)
    hitParticle1: ParticleSystem = null;

    private machineState: enemyStateType = enemyStateType.Move;
    private _blood: Blood = null;

    private hitRangeV3: Vec3 = null;
    public poolName: string = null;


    spiderName: string = "spider"; //||rovSpider

    private _bloodOffset: Vec3 = new Vec3(0, 3, 0);
    //最大血量 当前血量
    private _hp: number = 1;
    hp = 1;
    maxHp = 1;
    //做预先扣除 防止怪物死亡后仍发射子弹攻击
    recordHp: number = 1;
    public hitPow = 2;
    private endIsMove: boolean = true;//结束后蜘蛛是否可以移动

    private _radius: number = 1.5; //敌人半径
    private _rvoSpeed: number = 20; //敌人速度
    // 是否到达追踪的栅栏
    private isRvo: boolean = false;
    private blockIndex: number = 0;
    private speed: number = 5
    private movePhase: number = 1;
    public rvoLastMove: boolean = false
    // 添加属性用于跟踪当前目标点
    public currentTargetIndex: number = 0;

    private dieGray: boolean = false; //是否死亡灰度


    private flowerEat: boolean = false; //是否被花吃了
    private selfScal: Vec3 = null;


    @property(Number)
    currentIndex: number = 0;

    @property(Boolean)
    isInitCraet: boolean = false

    @property(Number)
    spiderHp: number = 1;

    @property(Number)
    spiderType: number = 0;
    // 0 普通蜘蛛 1  大蜘蛛
    Idtype: number = 0;

    private scheduleId: any = undefined;
    private scheduleId1: any = undefined;
    public isAttack: boolean = false; //是否可以被攻击

    //RVOid
    private _agentHandleId: number = -1;
    public get agentHandleId(): number {
        return this._agentHandleId;
    }
    public set agentHandleId(value: number) {
        this._agentHandleId = value;
    }
    setSpiderPos() {
        this.currentTargetIndex = 8

    }
    protected start(): void {
        this.selfScal = this.node.scale.clone();
        if (this.isInitCraet) {
            this.init();
            this.currentTargetIndex = this.currentIndex;
            this._hp = this.spiderHp;
            this.hp = this._hp;
            this.maxHp = this._hp;
            this.recordHp = this._hp;
            this.isAttack = true;
            if(this.spiderType == 0){
                this.node.getComponent(SkeletalAnimation).getState("walk_f_1").speed = 1.5;
            }else if(this.spiderType == 1){
                this.node.getComponent(SkeletalAnimation).getState("walk_f_1").speed = 1;
            }
        }
    }
    setHp(hp: number) {
        this._hp = hp;
        this.hp = hp;
        this.maxHp = hp;
        this.recordHp = hp;
    }
    /** 初始化 */
    public init(): void {
        let data = App.dataManager.getMonsterById(1);
        if (data) {
            this._hp = data._hp;
            this.hitPow = data._hitPow;
            this.Idtype = data.Idtype;
        }
        this.reset();
        this.Idtype = 0;
        //RVOid
        this.agentHandleId = -1;
        this.setMaterByIndex(0, true);
        //创建血条
        // let bloodNode: Node = App.poolManager.getNode(GlobeVariable.entifyName.BloodBar);
        // bloodNode.parent = App.sceneNode.bloodParent;
        // bloodNode.active = true;
        // this._blood = bloodNode.getComponent(Blood);
        // this._blood?.init(this.maxHp);
        this.blockIndex = GlobeVariable.blockIndex;
        GlobeVariable.blockIndex++;
        if (GlobeVariable.blockIndex >= App.sceneNode.moveBlockPos.children.length) {
            GlobeVariable.blockIndex = 0;
        }
        this.move();
        //  this.walk();

    }


    private setMaterByIndex(matIndex: number, needReset: boolean = false) {
        if (!this.dissolveEffect) {
            return;
        }
        this.dissolveEffect.forEach((d: DissolveEffect) => {
            d.init();

            let mesh: MeshRenderer = d.node.getComponent(MeshRenderer);
            if (mesh) {
                let matInstance: Material = mesh.getMaterialInstance(0);
                if (matIndex === 1) {
                    matInstance.setProperty('showType', 1.0);
                } else if (matIndex === 0) {
                    matInstance.setProperty('showType', 0.0);
                    matInstance.setProperty('dissolveThreshold', 0.0);
                } else if (matIndex === 2) {
                    matInstance.setProperty('showType', 0.0);
                    matInstance.setProperty('dissolveThreshold', 0.0);
                    matInstance.setProperty('showTypeGray', 1.0);
                    // this.dieGray = true;

                    // d.play(0.8)
                }

            }

            if (needReset) {
                d.reset();
            }
        });

    }
    //普通的被攻击
    baseHit(attack: number, bulletPos: Vec3, hitRange: number = 1) {
        if (this.hp <= 0) return
        if (!this.isAttack) return
        // this.hitParticle.node.parent.active = true;
        // this.hitParticle.play();
        this.hitRangeV3 = new Vec3(bulletPos.x, bulletPos.y, bulletPos.z);
        this.hitPow = hitRange;

        this.hitEffct();
        SoundManager.Instance.playAudio("zhizhushouji");
        this.setMaterByIndex(1);
        if (this.machineState != enemyStateType.Die) {
            if (this.machineState != enemyStateType.Hit)
                this.machineState = enemyStateType.Hit;

            this.takeDamage(attack);
            this.setShowHp(attack);
        }
        this.scheduleOnce(() => {
            if (this.dieGray) return
            this.setMaterByIndex(0);
        }, 0.1);
    }
    hitEffct(back: () => void = null) {

        let arrowTx = App.poolManager.getNode(GlobeVariable.entifyName.ArrowTX);
        if (!this.hitParticle || !this.hitParticle.node) return;
        arrowTx.parent = this.hitParticle?.node.parent
        arrowTx.setPosition(this.hitParticle.node.position);
        arrowTx.active = true;
        let particle = arrowTx.getChildByName("jizhong").getComponent(ParticleSystem);
        particle
        particle.play()
        this.scheduleOnce(() => {
            // 1. 停止粒子播放
            particle.stop();
            // 3. 可选：手动清除所有粒子（根据引擎特性）
            particle.clear();
            arrowTx.active = false;
            arrowTx.removeFromParent()
            App.poolManager.returnNode(arrowTx, GlobeVariable.entifyName.ArrowTX);
            if (back) {
                back();
            }

        }, 1.5)
    }
    //普通的被攻击
    baseHit1(attack: number, bulletPos: Vec3, hitRange: number = 1) {
        if (this.hp <= 0) return

        if (!this.isAttack) return
        // this.hitParticle.node.parent.active = true;
        // this.hitParticle.play();
        this.hitRangeV3 = new Vec3(bulletPos.x, bulletPos.y, bulletPos.z);
        this.hitPow = hitRange;

        this.hitEffct1();
        SoundManager.Instance.playAudio("zhizhushouji");
        this.setMaterByIndex(1);
        if (this.machineState != enemyStateType.Die) {
            if (this.machineState != enemyStateType.Hit)
                this.machineState = enemyStateType.Hit;

            this.takeDamage(attack);
            this.setShowHp(attack);
        }
        this.scheduleOnce(() => {
            if (this.dieGray) return
            this.setMaterByIndex(0);
        }, 0.1);
    }
    hitEffct1(back: () => void = null) {

        let arrowTx = App.poolManager.getNode(GlobeVariable.entifyName.BeetleCollideTx);
        arrowTx.parent = this.hitParticle1.node.parent
        arrowTx.setPosition(this.hitParticle1.node.position);
        arrowTx.active = true;
        let particle = arrowTx.getChildByName("jizhong").getComponent(ParticleSystem);
        particle
        particle.play()
        this.scheduleOnce(() => {
            // 1. 停止粒子播放
            particle.stop();
            // 3. 可选：手动清除所有粒子（根据引擎特性）
            particle.clear();
            arrowTx.active = false;
            arrowTx.removeFromParent()
            App.poolManager.returnNode(arrowTx, GlobeVariable.entifyName.BeetleCollideTx);
            if (back) {
                back();
            }

        }, 1.5)
    }
    //被炮塔攻击的受击

    turretHit(attack: number, bulletPos: Vec3, hitRange: number = 8) {
        if (this.hp <= 0) return
        if (!this.isAttack) return
        this.hitRangeV3 = new Vec3(bulletPos.x, bulletPos.y, bulletPos.z);
        this.hitPow = hitRange;

        this.setMaterByIndex(1);
        if (this.machineState != enemyStateType.Die) {
            if (this.machineState != enemyStateType.Hit)
                this.machineState = enemyStateType.Hit;

            this.takeDamage(attack);
            this.setShowHp(attack);
        }
        this.scheduleOnce(() => {
            if (this.dieGray) return
            this.setMaterByIndex(0);
        }, 0.1);
    }
    setShowHp(attack: number) {
        if (!this._blood) {
            return;
        }
        this._blood.node.active = true;
        this._blood.injuryAni(attack);
    }
    //攻击的事件回调
    attackEvent() {
        if (GlobeVariable.isBlock) { //攻击的拒马存在
            App.sceneNode.QianBiJuMa.forEach(item => {
                item.getComponent(blockRed).setRed();
            })
            let blood = App.sceneNode.juma01.getChildByName("BloodPaling");
            blood.getComponent(BooldPaling).subscribeBool();
            if (blood.getComponent(BooldPaling).getBloodHp() <= 0) {
                // App.sceneNode.juma01.removeFromParent();
                App.sceneNode.juma01.active = false;
                GlobeVariable.isBlock = false;
                GlobeVariable.blockRest = false;

                // this.scheduleOnce(() => {
                GlobeVariable.isFirstBlock = false;
                blood.getComponent(BooldPaling).resetBloodHp();
                // App.mapShowController.restBlock1();
                // }, 3)

                this.isRvo = false;
                App.enemyController.restRvoEnemy();

            }
        }
    }
    private _walkTween: Tween<Node> = null;
    /**移动状态 动画*/
    move() {
        if (this.machineState == enemyStateType.Die || !GlobeVariable.isStartGame) return;

        if (this.machineState != enemyStateType.Move)
            this.machineState = enemyStateType.Move;
        if (!this.characterSkeletalAnimation.getState("walk_f_1").isPlaying) {
            this.characterSkeletalAnimation.play("walk_f_1")
            return;
        }
    }

    //开始追踪怪
    private trackMonster() {
        // 设置 RVO
        const mass = 1;
        const agentId = Simulator.instance.addAgent(
            RVOUtils.v3t2(this.node.worldPosition.clone()),
            this._radius,
            this._rvoSpeed,
            null,
            mass
        );

        const agentObj = Simulator.instance.getAgentByAid(agentId);
        agentObj.neighborDist = this._radius * 2.5;
        this.agentHandleId = agentId;
        this.machineState = enemyStateType.Track;

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
        let block = App.sceneNode.moveBlockPos.children[this.blockIndex];
        block.getWorldPosition(playerPos);

        // 计算距离
        const distance = Vec3.distance(currentPos1, playerPos);
        // 如果距离小于等于攻击距离，则执行攻击逻辑
        if (distance <= 2.5) {

            if (this.attack1()) {
                return;
            }
        } else {
            const p = Simulator.instance.getAgentPosition(this.agentHandleId);
            const targetPos = new Vec3(p.x, playerPos.y, p.y);
            const currentPos = this.node.worldPosition.clone();

            const dist = Vec3.distance(currentPos, targetPos);
            if (dist > 1) {
                const smoothFactor = 1;
                Vec3.lerp(currentPos, currentPos, targetPos, dt * smoothFactor);
                this.node.setWorldPosition(currentPos);
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

        let agentAid = this.agentHandleId
        let agent = Simulator.instance.getAgentByAid(agentAid)
        let agentPos = Simulator.instance.getAgentPosition(agentAid)

        const playerPos = new Vec3();
        let block = App.sceneNode.moveBlockPos.children[this.blockIndex];
        block.getWorldPosition(playerPos);
        let moveTargetPos: Vec2 = v2(playerPos.x, playerPos.z);

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

    attack1() {
        if (this.machineState != enemyStateType.Attack)
            this.machineState = enemyStateType.Attack;
        if (!this.characterSkeletalAnimation.getState("attack01_1").isPlaying) {

            this.characterSkeletalAnimation.play("attack01_1");
            // if (this._isArrivePaling) {
            //     GlobeVariable.bearAttackPalingNum_audio++;
            //     if (GlobeVariable.bearAttackPalingNum_audio < 4) {
            //         SoundManager.inst.playAudio("YX_daqiang");
            //     }

            // }
            return true;
        }
        return false;
    }
    private updateBloodPos() {
        //同步更新血条位置
        if (this._blood) {
            let bloodPos: Vec3 = new Vec3();
            Vec3.add(bloodPos, this.node.worldPosition.clone(), this._bloodOffset);
            this._blood.node.setWorldPosition(bloodPos);
        }
    }
    bombDie() {


        if (!this.isAttack) return
        if (this.machineState != enemyStateType.Die)
            this.machineState = enemyStateType.Die;
        this.isAttack = false;
        this.hitEffct();
        this.scheduleOnce(() => {


            // 1. 从EnemyController的列表中移除自己
            App.enemyController.removeEnemy(this);
            App.enemyController.removeEnemyRvo(this);
            //  this.characterSkeletalAnimation.once(Animation.EventType.FINISHED, () => {
            this.node.removeFromParent();
            this.node.active = false;

            // 回收节点到对象池（检查节点有效性）
            if (this.node?.isValid) {
                App.poolManager.returnNode(this.node, this.poolName);
            }
            // 回收血条节点（检查节点有效性）
            if (this._blood?.isValid) {
                //this._blood.node.active = false;
                this._blood = null;
            }
            this.reset();
            // if (this.Idtype == 1) {
            //     for (let i = 0; i < 10; i++) {
            //         this.randomPos();
            //     }
            // } else {
            //     for (let i = 0; i < 3; i++) {
            //         this.randomPos();
            //     }
            // }
        }, 0.1)




    }
    attackFlowerDie(followNode: Node) {
        if (this.machineState != enemyStateType.Die)
            this.machineState = enemyStateType.Die;
        this.isAttack = false;
        this.flowerEat = true;
        App.enemyController.removeEnemy(this);
        App.enemyController.removeEnemyRvo(this);

        tween(this.node)
            .parallel(
                tween().to(0.5, { scale: new Vec3(0, 0, 0) }),
                tween().to(0.5, { worldPosition: followNode.worldPosition },)
            )
            .call(() => {
                this.node.scale = this.selfScal;
                this.node.removeFromParent();
                this.node.active = false;
                this.reset();
                // 回收节点到对象池（检查节点有效性）
                if (this.node?.isValid) {
                    App.poolManager.returnNode(this.node, this.poolName);
                }
                // 回收血条节点（检查节点有效性）
                if (this._blood?.isValid) {
                    //this._blood.node.active = false;
                    this._blood = null;
                }

            })
            .start();
        // if(followNode){
        //     this.node.setWorldPosition(followNode.worldPosition);
        // }

        if (this.Idtype == 1) {
            for (let i = 0; i < 10; i++) {
                this.randomPos();
            }
        } else {
            for (let i = 0; i < 3; i++) {
                this.randomPos();
            }
        }
    }

    die(callback?: (...agrs: unknown[]) => void): void {


        if (this.machineState != enemyStateType.Die)
            this.machineState = enemyStateType.Die;
        this.isAttack = false;
        if (!this.node.isValid || !this.node) {
            return;
        }
        const currentPos = this.node.getWorldPosition().clone();
        const playerPos = this.hitRangeV3;


        // 计算击退方向向量
        let goalVector = new Vec2(playerPos.x, playerPos.z).subtract2f(currentPos.x, currentPos.z);
        goalVector = goalVector.normalize().multiplyScalar(-this.hitPow);
        // 预测击退后的终点
        const knockbackFinalPos = currentPos.clone().add(new Vec3(goalVector.x, 0, goalVector.y));
        tween(this.node)
            .by(0.15, { position: new Vec3(goalVector.x, 0, goalVector.y) }, {
                onUpdate: () => {
                    this.updateBloodPos();
                }
            })
            .start();
        // if (!this.characterSkeletalAnimation.getState("die").isPlaying) {

        //     this.characterSkeletalAnimation.play("die");
        //     GlobeVariable.bearDiegNum_audio++;
        //     if (GlobeVariable.bearDiegNum_audio < 4) {
        //         SoundManager.inst.playAudio("YX_xiong");
        //     }
        // }
        if (!this.characterSkeletalAnimation.getState("die_1").isPlaying) {
            this.characterSkeletalAnimation.play("die_1");
        }


        this.scheduleId = this.scheduleOnce(() => {
            this.dieGray = true;
            this.skinnedMeshRenderer.setMaterialInstance(this.grayMaterial, 0);
            // this.setMaterByIndex(2);
            this.scheduleId1 = this.scheduleOnce(() => {


                // 1. 从EnemyController的列表中移除自己
                App.enemyController.removeEnemy(this);
                App.enemyController.removeEnemyRvo(this);
                //  this.characterSkeletalAnimation.once(Animation.EventType.FINISHED, () => {
                this.node.removeFromParent();
                this.node.active = false;

                // 回收节点到对象池（检查节点有效性）
                if (this.node?.isValid) {
                    App.poolManager.returnNode(this.node, this.poolName);
                }
                // 回收血条节点（检查节点有效性）
                if (this._blood?.isValid) {
                    //this._blood.node.active = false;
                    this._blood = null;
                }
                this.reset();
                // App.dropController.dropItem(this.node.getWorldPosition().clone());
                if (this.Idtype == 1) {
                    for (let i = 0; i < 10; i++) {
                        this.randomPos();
                    }
                } else {
                    for (let i = 0; i < 3; i++) {
                        this.randomPos();
                    }
                }


                // });
            }, 0.5);
        }, 0.05);

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
        const randomPos = originalPos.add(randomDir.multiplyScalar(Math.random() * 6));

        let POS = App.sceneNode.coinAreaBan.worldPosition.clone();

        let vDis = Vec3.distance(randomPos, POS)
        if (vDis > 6) {
            // 使用随机位置掉落物品
            App.dropController.dropItem(randomPos);
        }else{
            this.randomPos();
        }
    }
    private reset() {

        // 清理调度
        if (this.scheduleId !== undefined) {
            this.unschedule(this.scheduleId);
            this.scheduleId = undefined;
        }

        if (this.scheduleId1 !== undefined) {
            this.unschedule(this.scheduleId1);
            this.scheduleId1 = undefined;
        }
        this.isAttack = false;
        this.hp = this._hp;
        this.maxHp = this._hp;
        this.recordHp = this._hp;
        this.spiderName = "spider";
        this._radius = 3; //敌人半径
        this._rvoSpeed = 20; //敌人速度
        // 是否到达追踪的栅栏
        this.isRvo = false;
        this.blockIndex = 0;
        this.speed = 5
        this.movePhase = 1;
        this.rvoLastMove = false
        this.machineState = enemyStateType.Move;
        this.characterSkeletalAnimation.play("walk_f_1");
        this.setMaterByIndex(0);
        this.dieGray = false;
        this.flowerEat = false;
        this.currentTargetIndex = 0;

        //RVOid
        if (this.agentHandleId != -1) {
            Simulator.instance.removeAgent(this.agentHandleId);
            this.agentHandleId = -1;
        }
    }

    update(deltaTime: number) {
        if (GlobeVariable.isGameEnd) {
            if (!this.endIsMove) return;

            const randomIndex = Math.floor(Math.random() * 4);
            let pos = App.sceneNode.moveEndBlockPos.children[randomIndex].worldPosition
            let selfPos = this.node.worldPosition;
            // // 计算两点到世界原点的距离
            // const posDistance = pos.length();
            // const selfDistance = selfPos.length();
            // const isFartherFromOrigin = posDistance > selfDistance;
            // if (isFartherFromOrigin) {
            //     this.node.setWorldPosition(pos);
            // }
            // 获取自身前方向量（假设Z轴为前）
            const forward = this.node.forward;
            // 计算目标相对于自身的向量
            const toTarget = pos.clone().subtract(selfPos);
            // 点积判断是否在前方（大于0为前方）
            const isInFront = toTarget.dot(forward) < 1.5;
            if (isInFront && this.endIsMove) {
                this.endIsMove = false;
                this.node.setWorldPosition(pos);
                return;
            }

        }
        if (!GlobeVariable.isStartGame) {
            return;
        }
        if (this.flowerEat) return;

        this.updateBloodPos();
        if (this.currentTargetIndex < App.sceneNode.enemyMovePath.children.length && this.movePhase == 1) {

            this.machineState = enemyStateType.Walk;
            this.moveToTarget(deltaTime, App.sceneNode.enemyMovePath);

        } else if (this.movePhase == 2) {

            if (GlobeVariable.isBlock && this.isRvo && !this.rvoLastMove) {
                this.moveByRvo(deltaTime);
                this.setPreferredVelocities()
            } else {
                this.move();
                if (this.spiderName == "rovSpider") {
                    Simulator.instance.removeAgent(this.agentHandleId);
                    this.agentHandleId = -1;
                    this.speed = 8;
                    if (this.rvoLastMove) {
                        this.moveToTarget(deltaTime, App.sceneNode.enemyMoveRvoPath);
                    }

                } else {

                    this.moveToTarget(deltaTime, App.sceneNode.enemyMovePath2);
                }
            }
        }

    }
    /*************************主体移动模块 每帧移动*********************************/


    /** 移动到当前目标点 */
    private moveToTarget(deltaTime: number, enemtParentPath: Node) {
        const targetNode = enemtParentPath.children[this.currentTargetIndex];
        const targetPos = targetNode.worldPosition;
        const currentPos = this.node.worldPosition;
        // 计算距离
        const distance = Vec3.distance(currentPos, targetPos);
        // 如果到达目标点，切换到下一个
        if (distance < 0.1) { // 可根据需要调整阈值
            this.currentTargetIndex++;
            // 旋转到目标方向
            this.node.eulerAngles = targetNode.eulerAngles.clone();
            if (this.currentTargetIndex >= enemtParentPath.children.length) {
                this.movePhase += 1;
                this.currentTargetIndex = 0;
                if (this.movePhase > 2) {
                    if (this._blood) {
                        this._blood.injuryAni(100);
                    }
                    this.bombDie();
                    App.sceneNode.flower.getComponent(Flower).hit(1);
                    return;
                }

                // 第二阶段：GlobeVariable.isBlock true 拒马存在，开启RVO
                if (GlobeVariable.isBlock && this.movePhase == 2) {
                    this.isRvo = true;
                    this.trackMonster();
                    this.spiderName = "rovSpider";
                    App.enemyController.setEnemyRvoList(this);
                }
            }
            return;
        }

        // 计算移动方向
        const direction = Vec3.subtract(new Vec3(), targetPos, currentPos).normalize();

        // 计算每帧移动距离
        const moveDistance = this.speed * deltaTime;

        // 更新位置
        const newPos = Vec3.add(new Vec3(), currentPos, Vec3.multiplyScalar(new Vec3(), direction, moveDistance));
        this.node.worldPosition = newPos;

        // 平滑旋转朝向目标
        this.rotateToTarget(targetNode.eulerAngles, deltaTime);
    }

    /** 平滑旋转到目标角度 */
    private rotateToTarget(targetRot: Vec3, deltaTime: number) {
        const currentRot = this.node.eulerAngles;
        // 计算旋转差值并平滑过渡
        const rotDiff = new Vec3(
            this.smoothDamp(currentRot.x, targetRot.x, deltaTime),
            this.smoothDamp(currentRot.y, targetRot.y, deltaTime),
            this.smoothDamp(currentRot.z, targetRot.z, deltaTime)
        );
        this.node.eulerAngles = rotDiff;
    }

    /** 平滑插值函数 */
    private smoothDamp(current: number, target: number, deltaTime: number, smoothTime: number = 0.5): number {
        let diff = target - current;
        // 处理角度环绕问题
        if (diff > 180) diff -= 360;
        if (diff < -180) diff += 360;
        return current + diff * (1 - Math.exp(-deltaTime / smoothTime));
    }

    // // 旋转到目标方向
    // private rotateTowards(targetWorldPos: Vec3, dt: number) {
    //     const currentPos = this.node.worldPosition.clone();
    //     const dir = new Vec3();
    //     Vec3.subtract(dir, targetWorldPos, currentPos);
    //     dir.y = 0;
    //     dir.normalize();

    //     if (!dir) return;

    //     const targetQuat = new Quat();
    //     Quat.fromViewUp(targetQuat, dir, Vec3.UP);

    //     const currentQuat = this.node.worldRotation.clone();
    //     const resultQuat = new Quat();
    //     Quat.slerp(resultQuat, currentQuat, targetQuat, Math.min(1, dt * 40));
    //     this.node.worldRotation = resultQuat;
    // }

    // public isAlive(): boolean {
    //     return this.machineState !== enemyStateType.Die;
    // }
}


