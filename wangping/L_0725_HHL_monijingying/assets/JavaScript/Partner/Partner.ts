import { _decorator, Label, Material, MeshRenderer, Node, physics, Quat, RigidBody, Sprite, Tween, tween, Vec2, Vec3, Animation, AnimationState, geometry, PhysicsSystem, ParticleSystem } from 'cc';
import { EmojiType, EntityTypeEnum, EventName, PartnerState } from '../Common/Enum';
import Entity from '../Common/Entity';
import { MathUtils } from '../Util/MathUtils';
import { EventManager } from '../Global/EventManager';
import { DataManager } from '../Global/DataManager';
import { Monster } from '../Monster/Monster';
import Blood from '../Common/Blood';
import { NodePoolManager } from '../Common/NodePoolManager';
import { PartnerEmoji } from './PartnerEmoji';
import GameUtils from '../Util/GameUtils';
import { SoundManager } from '../Global/SoundManager';
import JPSController from '../JPS/JPSController';
const { ccclass, property } = _decorator;

@ccclass('Partner')
export class Partner extends Entity {

    @property(Node)
    needCornNode: Node = null;
    @property(Node)
    needCornCollider: Node = null;
    @property(Sprite)
    progressBar: Sprite = null;
    @property(Label)
    needCornNum: Label = null;
    @property(Node)
    rottationNode: Node = null;

    @property(Material)
    mats: Material[] = [];

    @property(MeshRenderer)
    meshs: MeshRenderer[] = [];

    @property(PartnerEmoji)
    emoji: PartnerEmoji = null;

    @property(Animation)
    unlockAni: Animation = null;

    @property(ParticleSystem)
    bloodAni: ParticleSystem = null;

    @property({ displayName: "归家半径" })
    homeRadius: number = 10;

    @property({ displayName: "移动速度" })
    moveSpeed: number = 8;

    //血条初始位置
    @property({ displayName: "血条位置" })
    private bloodOffset: Vec3 = new Vec3(0, 6, 0);

    @property({ displayName: "血量" })
    maxHp: number = 200;


    protected entityName: EntityTypeEnum = EntityTypeEnum.Partner;

    private _index: number = -1;
    //解锁需要的玉米数
    private _needCornNum: number = 5;
    //当前拥有的玉米数
    private _cornNum: number = 0;
    //是否解锁
    private _unlocked: boolean = false;
    private _unlockTimes: number = 0;
    //状态
    private _state: PartnerState = PartnerState.Idle;
    //打玉米站位
    private _cornPosNode: Node = null;
    private _cornPosDir: Vec3 = new Vec3(1, 0, 0);
    //打类型 0没有 1 玉米 2 怪
    private _attackType: number = 0;
    /** 攻击速度 */
    attackSpeed: number = 1;
    /** 攻击计时 */
    attackTimer: number = 0;

    private _blood: Blood = null;


    //最大血量 当前血量
    private _minHp: number = 1;

    // 闪红时间间隔
    private _redTimeLimit: number = 0.3;
    private _redTime: number = 0;

    private attackTarget: Monster = null;

    //正在欢呼
    private _isCheering: boolean = false;

    private _gotoCornTween: Tween<Node> = null;

    private _attackRadiusSqr: number = 81;

    // JPS path following
    private _path: Vec3[] = [];
    private _pathIndex = 0;
    private _repathInterval = 2; // s
    private _repathTimer = 0;
    private _lastTargetSample: Vec3 | null = null;

    private _lastTargetTime: number = 0;

    turnSmooth: number = 150;

    private _nomalMtlIndex: number = 0;

    private _bloodPosIndex: number = -1;
    private _bloodRecoverPos: Vec3;

    public monsterNum: number = 0;

    //rvo
    private _agentHandleId: number = -1; //RVOid
    public get agentHandleId(): number {
        return this._agentHandleId;
    }
    public set agentHandleId(value: number) {
        this._agentHandleId = value;
    }

    protected onEnable(): void {
        EventManager.inst.on(EventName.ShowMonster, this.onShowMonster, this);
        EventManager.inst.on(EventName.FirstMonsterDie, this.onFirstMonsterDie, this);
        EventManager.inst.on(EventName.ReFindPath, this.reFindPath, this);
    }

    protected onDisable(): void {
        EventManager.inst.off(EventName.ShowMonster, this.onShowMonster, this);
        EventManager.inst.off(EventName.FirstMonsterDie, this.onFirstMonsterDie, this);
        EventManager.inst.off(EventName.ReFindPath, this.reFindPath, this);
    }

    protected onLoad(): void {
        this.needCornNode.active = false;
        this.needCornCollider.active = false;
    }

    public get index(): number {
        return this._index;
    }

    public init(index: number, cornPosNode: Node, startRot: Quat) {
        this._index = index;
        this._cornPosNode = cornPosNode;
        this.hp = this._minHp;

        this.rottationNode.setWorldRotation(startRot);

        this.ani.play(PartnerState.Hunger);
        this.emoji.node.active = false;
        this.needCornNum.string = this._needCornNum.toString();
        this.unlockAni.node.active = false;
        this.bloodAni.node.active = false;

        //创建血条
        let bloodNode: Node = NodePoolManager.Instance.getNode(EntityTypeEnum.HP)
        bloodNode.parent = DataManager.Instance.sceneManager.bloodParent;
        bloodNode.active = true;
        this._blood = bloodNode.getComponent(Blood);
        this._blood?.init(EntityTypeEnum.Partner, this.maxHp, this.hp, this.hp);
        this.updateBloodPos();
        //展示饥饿表情
        this.emoji.showEmj(EmojiType.Hungry);
        //if(this._index === 0){
        this.scheduleOnce(() => {
            this.needCorn();
        }, 2);
        //}
        this.node.getComponent(RigidBody).type = physics.ERigidBodyType.KINEMATIC;
        this._nomalMtlIndex = Math.floor(Math.random() * 3);
        this.setMaterByIndex(this._nomalMtlIndex);
    }

    /**是否已解锁 */
    public get unlocked(): boolean {
        return this._unlocked;
    }

    /** 切换到需要玉米状态 */
    public needCorn(): void {
        this.progressBar.fillRange = 0;
        GameUtils.showNodeAni(this.needCornNode);
        this.needCornCollider.active = true;
    }

    /** 增加玉米量 */
    public addCorn(num: number): void {
        this._cornNum += num;
        this.progressBar.fillRange = this._cornNum / this._needCornNum;
        this.needCornNum.string = String(this._needCornNum - this._cornNum);
        if (this._cornNum >= this._needCornNum) {
            this.unlock();
        }
    }

    /**需要的玉米量 */
    public getNeedNum(): number {
        if (!this.needCornNode.active) {
            return 0;
        }
        return this._needCornNum - this._cornNum;
    }

    /** 解锁伙伴 */
    private unlock(): void {
        this.monsterNum = 0;
        if (this._bloodPosIndex >= 0) {
            DataManager.Instance.mapController.returnBloodPosByIndex(this._bloodPosIndex);
            this._bloodPosIndex = -1;
            this._bloodRecoverPos = null;
        }
        this._unlocked = true;
        this.needCornNode.active = false;
        this.needCornCollider.active = false;
        this.changeState(PartnerState.Move);
        // if(this._index ===0){
        EventManager.inst.emit(EventName.UnlockFirstPartner);
        // }else{
        this.node.getComponent(RigidBody).type = physics.ERigidBodyType.DYNAMIC;
        //}

        if (DataManager.Instance.monsterController.monsterStarted()) {
            this.startPursueMonster();
        } else {
            this.gotoCorn();
        }
        //if(this._unlockTimes>0){
        this.bloodAni.node.active = true;
        this.bloodAni.play();
        // }else{
        //     GameUtils.unlockAni(this.unlockAni);
        // }
        this.emoji.showEmj(EmojiType.Happy);
        this.hp = this.maxHp;
        this._blood.recoverAllBlood();
        SoundManager.inst.playAudio("xiaorenjihuo");
        this._unlockTimes++;
    }

    /** 血量过低处理 */
    private bloodMinToUnlock(): void {
        if (this.hp > this._minHp || this._unlocked === false) {
            return;
        }

        if (DataManager.Instance.wallController.isWallAllUnlocked()) {
            if (this._attackType === 3) {
                return;
            }
            //跑去回血的位置
            this._attackType = 3;
            this._bloodPosIndex = DataManager.Instance.mapController.getBloodIndex();
            if (this._bloodPosIndex >= 0) {
                this._bloodRecoverPos = DataManager.Instance.mapController.getBloodPosByIndex(this._bloodPosIndex);
            }
            this.refreshPath(true);
        } else {
            this.crashBlood();
        }
    }

    public gotoBlooding(): boolean {
        return this._attackType === 3 || !this.unlocked;
    }

    private crashBlood(): void {
        //原地死机
        this._unlocked = false;
        this._cornNum = 0;
        this.changeState(PartnerState.Hunger);
        this.needCorn();
        this._attackType = 0;
        this.agentHandleId = -1;
        this.attackTarget = null;
        this._path = [];
        this._pathIndex = 0;
        this.node.getComponent(RigidBody).type = physics.ERigidBodyType.KINEMATIC;
    }

    //去打玉米
    private gotoCorn(): void {

        const rotTime: number = 0.5;
        const dis = Vec3.distance(this.node.worldPosition, this._cornPosNode.worldPosition);
        const moveTime: number = dis / this.moveSpeed;
        const unlockPartnerNum: number = DataManager.Instance.partnerController.getUnlockedNum();
        this._gotoCornTween = tween(this.node)
            .delay(rotTime)
            .to(moveTime, { worldPosition: this._cornPosNode.worldPosition })
            .delay(rotTime)
            .call(() => {
                this._attackType = 1;
                this.attack();

                if (unlockPartnerNum === 1) {
                    this.scheduleOnce(() => {
                        if (!DataManager.Instance.monsterController.monsterStarted()) {
                            EventManager.inst.emit(EventName.ShowMonster);
                        }
                    }, 2);
                }
            })
            .start();
        let deraction: Vec3 = new Vec3();
        Vec3.subtract(deraction, this._cornPosNode.worldPosition, this.node.worldPosition);
        deraction.normalize();
        const quat: Quat = MathUtils.vectorToRotation(deraction);
        tween(this.rottationNode)
            .to(rotTime, { worldRotation: quat })
            .delay(moveTime)
            .to(rotTime, { worldRotation: this._cornPosNode.worldRotation })
            .start();
    }

    private attack(): void {
        this.attackTimer = 0;
        this.changeState(PartnerState.Attack);
    }

    update(dt: number) {
        this.attackTimer += dt;
        this._redTime += dt;

        // 维护血条位置
        this.updateBloodPos();
        // 不解锁不移动
        if (!this._unlocked) return;

        if (this._attackType === 1 && this._agentHandleId < 0) {
            if (this.attackTimer >= this.attackSpeed) {
                this.attack();
            }
        } else if (this._agentHandleId >= 0 && this._attackType > 0) {
            if (this._attackType !== 3) {
                if (!this.attackTarget || !this.attackTarget.isAlive()) {
                    this.pickAndSetTarget();
                }
                if (this.attackTarget && this.attackTarget.isAlive()) {
                    this._attackType = 2;
                } else if (this._attackType !== 1) {
                    this.attackTarget = null;
                    this.switchToCorn();
                }
            }


            // 定期重算路径（怪会移动）
            this._repathTimer += dt;
            if (this._repathTimer >= this._repathInterval && !DataManager.Instance.partnerPathing) {
                DataManager.Instance.partnerPathing = true;
                this._repathTimer = 0;
                this.refreshPath();
                this.scheduleOnce(() => {
                    DataManager.Instance.partnerPathing = false;
                });
            }

            // 移动沿路径
            this.followPath(dt);
        }
    }

    /** 待机动画 */
    public playIdle(): void {
        this.changeState(PartnerState.Idle);
    }

    /** 切换动画状态 */
    private changeState(state: PartnerState) {
        //console.log(`${this._index} changestate ${state}`);
        if (this._state === state) {
            return;
        }
        this._state = state;
        this.ani.crossFade(state, 0.1);
    }

    //真实攻击事件
    public realAttackMonster(): void {
        if (!this.attackTarget || this._attackType !== 2) {
            return;
        }

        //console.log("伙伴攻击回调");
        // 从后向前遍历并删除元素，避免索引问题
        this.attackTarget.hit(this);
    }

    private onFirstMonsterDie(): void {
        // if(this._attackType !== 2){
        //     return;
        // }
        // this.emoji.showEmj(EmojiType.Cheer);
        // this.changeState(PartnerState.Cheer);
        // this._isCheering = true;
        // this.scheduleOnce(()=>{
        //     this.changeState(PartnerState.Idle);
        //     this._isCheering = false;
        // },1.3);
    }

    private onShowMonster(): void {
        if (!this.unlocked) {
            return;
        }
        //this.emoji.showEmj(EmojiType.Surprise);
        this.scheduleOnce(() => {
            this.emoji.showEmj(EmojiType.Anger);
        }, 6);
        this.scheduleOnce(this.startPursueMonster, 4);
    }


    //寻怪、追击怪相关
    /** 开始追击怪 */
    private startPursueMonster(): void {

        if (!this.unlocked) {
            return;
        }
        if (this._attackType === 2) {
            return;
        }

        if (this._gotoCornTween) {
            this._gotoCornTween.stop();
        }

        // 设置 RVO
        this._agentHandleId = 1;

        this._attackType = 2;
    }

    /** 切回玉米目标 */
    private switchToCorn(): void {
        this._attackType = 1;
        this.scheduleOnce(() => {
            this.refreshPath(true);
        }, this._index * 0.02);
    }

    /** 选择最近怪作为目标（限制在 homeRadius 内） */
    private pickAndSetTarget(): void {
        let chosen: Monster | null = null;
        let minDistSqr = Number.POSITIVE_INFINITY;
        const monsters = DataManager.Instance.monsterController.getMonsterList?.() || [];
        const selfPos = this.node.worldPosition;

        for (const m of monsters as Monster[]) {
            if (!m || !m.isAlive?.()) continue;
            const mPos = m.node.getWorldPosition();
            const distSqr = Vec3.squaredDistance(selfPos, mPos);
            const distCenterSqr = Vec3.squaredDistance(mPos, DataManager.Instance.centerPos);
            if (distCenterSqr < this.homeRadius * this.homeRadius && distSqr < minDistSqr && !DataManager.Instance.partnerController.hasTarget(m)) {
                minDistSqr = distSqr;
                chosen = m;
            }
        }
        if (this.attackTarget !== chosen) {
            DataManager.Instance.partnerController.removeMonsterTarget(this.attackTarget);
            DataManager.Instance.partnerController.addMonsterTarget(chosen);
        }
        this.attackTarget = chosen;
        if (chosen && chosen.isAlive()) {
            this.unschedule(this.scheduleRefreshPath);
            this.scheduleOnce(this.scheduleRefreshPath, this._index * 0.1 + 0.3);
        }
    }

    private scheduleRefreshPath(): void {
        this.refreshPath(true);
    }

    /** 目标世界坐标（考虑围攻偏移） */
    private getCurrentTargetWorldPos(): Vec3 | null {
        if (this._attackType === 2 && this.attackTarget && this.attackTarget.isAlive()) {
            const p = this.attackTarget.node.getWorldPosition();
            return p;
        }

        if (this._attackType === 1 && this._cornPosNode) {
            return this._cornPosNode.worldPosition.clone();
        }
        if (this._attackType === 3 && this._bloodRecoverPos) {
            return this._bloodRecoverPos.clone();
        }
        return null;
    }

    private reFindPath(): void {
        if (this._path && this._path.length > 0) {
            this.scheduleOnce(() => {
                this.refreshPath(true);
            }, this._index * 0.5);
        }
    }

    /** 重新计算路径 */
    private refreshPath(force = false): void {
        const start = performance.now();

        // ======= 要测的代码 =======
        for (let i = 0; i < 1e6; i++) {
            Math.sqrt(i);
        }

        if (this._isCheering) return;

        const targetPos = this.getCurrentTargetWorldPos();
        if (!targetPos) return;

        this._lastTargetTime++;
        // 目标移动采样，避免过度寻路
        if (!force) {
            if (this._lastTargetTime < 100 && this._lastTargetSample && Vec3.squaredDistance(this._lastTargetSample, targetPos) < 0.25) {
                return;
            }
        }
        this._lastTargetSample = targetPos.clone();
        this._lastTargetTime = 0;
        //射线检测，如果有障碍物，则重新寻路，否则不走寻路逻辑直接走过去
        let outRay: geometry.Ray = new geometry.Ray(this.node.worldPosition.x, 1, this.node.worldPosition.z, targetPos.x, 1, targetPos.z);
        const mask = 1 << 4 | 1 << 6;
        const maxDistance = 10000000;
        const queryTrigger = true;
        if (PhysicsSystem.instance.raycastClosest(outRay, mask, maxDistance, queryTrigger)) {
            this._path = JPSController.instance.findPath(this.node.worldPosition, targetPos) || [];
        } else {
            this._path = [];
            //console.log(this._index,"no raycast",outRay.d);
        }


        if (this._path.length > 0) {
            this._path.shift();
        } else {
            console.log(this._index, "no path");
        }
        this._path.push(targetPos);
        this._pathIndex = 0;

        // ==========================

        const end = performance.now();
        console.log(`=================运行时间: ${(end - start).toFixed(3)} ms`);
    }

    /** 路径跟随移动 + 朝向 */
    private followPath(dt: number): void {
        if (this._isCheering) return;
        if (!this._path || this._path.length === 0) return;


        const EPS = 0.2;
        const cur = this.node.worldPosition.clone();
        let next = this._path[this._pathIndex];


        // 安全保护
        if (!next) return;

        //攻击、状态切换相关逻辑
        // 获取目标的世界位置
        let tergetPos;
        if (this._attackType === 2) {
            tergetPos = this.attackTarget.node.getWorldPosition();
        } else if (this._attackType === 3) {
            tergetPos = this._bloodRecoverPos.clone();
        } else {
            tergetPos = this._cornPosNode.worldPosition.clone();
        }
        const currentPos1 = this.node.worldPosition.clone();

        // 计算距离
        const distanceSqr = Vec3.squaredDistance(currentPos1, tergetPos);
        // 如果距离小于等于攻击距离，则执行攻击逻辑
        if ((this._attackType === 2 && Number(distanceSqr.toFixed(2)) <= this._attackRadiusSqr) || (this._attackType === 1 && distanceSqr <= 1)) {
            if (this.attackTimer >= this.attackSpeed) {
                this.attack();
                let rotatePos: Vec3 = tergetPos;
                if (this._attackType === 1) {
                    Vec3.add(rotatePos, currentPos1, this._cornPosDir);
                }
                this.rotateTowards(rotatePos, dt);
            }
        } else if (this._attackType === 3 && distanceSqr <= 1) {
            this.crashBlood();
        } else {
            const toNext = new Vec3();
            Vec3.subtract(toNext, next, cur);
            toNext.y = 0;
            const dist = toNext.length();

            if (dist <= EPS) {
                // 前进到下一个路点
                if (this._pathIndex < this._path.length - 1) {
                    this._pathIndex++;
                    next = this._path[this._pathIndex];
                } else {
                    // 到达终点
                    this.changeState(PartnerState.Idle);
                    this.refreshPath(true);
                    return;
                }
            }


            // 朝向
            const dir = toNext.normalize();
            if (this._pathIndex === (this._path.length - 1)) {
                let rotatePos: Vec3 = tergetPos;
                if (this._attackType === 1) {
                    Vec3.add(rotatePos, currentPos1, this._cornPosDir);
                }
                this.rotateTowards(rotatePos, dt);
            } else if (dist >= 0.01) {
                this.rotateTowards(cur.clone().add(dir), dt);
            }



            // 移动
            const step = Math.min(this.moveSpeed * dt, dist);
            cur.add(dir.multiplyScalar(step));
            this.node.setWorldPosition(cur);
            this.changeState(PartnerState.Move);
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

        const currentQuat = this.rottationNode.worldRotation.clone();
        const resultQuat = new Quat();
        const alphaRot = 1 - Math.exp(-this.turnSmooth * dt); // 帧率无关
        Quat.slerp(resultQuat, currentQuat, targetQuat, alphaRot);
        const dot = Quat.dot(resultQuat, targetQuat);
        if (dot > 0.99996) { // ~0.5°
            this.rottationNode.worldRotation = targetQuat;
        } else {
            this.rottationNode.worldRotation = resultQuat;
        }
        //if(this._index === 1){
        //console.log(`rotateTowards ${this._index} ${this._path.length} ${this._pathIndex} ${dir.toString()}`);
        //}

    }

    private setShowHp(attack: number) {
        if (!this._blood) {
            return;
        }
        this._blood.node.active = true;
        this._blood.injuryAni(attack);
    }

    private updateBloodPos() {
        //同步更新血条位置
        if (this._blood) {
            let bloodPos: Vec3 = new Vec3();
            Vec3.add(bloodPos, this.node.worldPosition.clone(), this.bloodOffset);
            this._blood.node.setWorldPosition(bloodPos);
        }
    }

    hit(play: Entity) {

        if (this._redTime >= this._redTimeLimit) {
            //闪红
            this.changeColor(1);
            setTimeout(() => {
                //恢复
                this.changeColor(0);
            }, 140);
            this._redTime = 0;
        }

        this.takeDamage(play.attackNum);
        this.setShowHp(play.attackNum);
        this.bloodMinToUnlock();
    }

    die(callback?: (...agrs: unknown[]) => void): void {
        //不死神躯
    }

    private setMaterByIndex(matIndex: number) {
        this.meshs.forEach((m: MeshRenderer) => {
            m.setSharedMaterial(this.mats[matIndex], 0);
        });
    }

    private changeColor(matIndex: number) {
        this.meshs.forEach((mesh: MeshRenderer) => {
            let matInstance: Material = mesh.getMaterialInstance(0);
            if (matIndex === 1) {
                matInstance.setProperty('showType', 1.0);
            } else {
                matInstance.setProperty('showType', 0.0);
                matInstance.setProperty('dissolveThreshold', 0.0);
            }
        });

    }
}


