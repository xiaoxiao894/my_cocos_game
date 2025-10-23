import {
    _decorator,
    Animation,
    Component,
    instantiate,
    Material,
    MeshRenderer,
    Node,
    ProgressBar,
    Quat,
    SkeletalAnimation,
    tween,
    Vec2,
    Vec3,
    math,
    ParticleSystem
} from 'cc';
import { MonsterStateDefine, StateDefine } from '../Actor/StateDefine';
import { DissolveEffect } from '../../Res/DissolveEffect/scripts/DissolveEffect';
import { DataManager } from '../Global/DataManager';
import { MathUtil } from '../Util/MathUtil';
import { ItemPartnerManager } from '../Actor/ItemPartnerManager';
import { EntityTypeEnum, PlayerWeaponTypeEnum } from '../Enum/Index';
import { SoundManager } from '../Common/SoundManager';

const { ccclass, property } = _decorator;
const targetNode = new Node('Temp');
@ccclass('ItemMonsterManager')
export class ItemMonsterManager extends Component {
    @property(SkeletalAnimation)
    skeletalAnimation: SkeletalAnimation = null;

    @property(DissolveEffect)
    dissolveEffect: DissolveEffect[] = [];

    @property(Material)
    mats: Material[] = [];

    @property
    hp: number = 4;

    /** 逻辑半径（用于防重叠） */
    radius: number = 2.5;

    /** 方向保持（秒），避免频繁切换导致抖动 */
    @property
    dirHoldTime: number = 0.2;

    /** 速度平滑强度（越大越快贴合期望速度，但仍平滑） */
    @property
    smoothFactor: number = 12;

    /** 侧移角度集合（度），用于被挡时的多角度采样 */
    @property
    sideAnglesStr: string = '30,-30,60,-60,90,-90';

    /** 最大转向角速度（度/秒）——用于平滑旋转 */
    @property
    turnSpeedDeg: number = 540;

    @property(ParticleSystem)
    daoguang: ParticleSystem = null;

    @property(ParticleSystem)
    huoyan: ParticleSystem = null;

    @property(ParticleSystem)
    mianqianguang: ParticleSystem = null;

    @property(ParticleSystem)
    bloodEffect: ParticleSystem = null;

    private _sideAngles: number[] = [];
    private _spider: Node | null = null;

    private _currentState: MonsterStateDefine | string = null;

    private _isDead = false;
    private _curHp: number = 4;

    private _target: Node | null = null;
    private _isAttacking = false;
    private _canAttack = true;

    private hpNode: Node | null = null;
    private whiteNode: Node | null = null;
    private redNode: Node | null = null;
    private redProgressBar: ProgressBar | null = null;
    private whiteProgressBar: ProgressBar | null = null;

    private attackDistance = 5;
    private moveSpeed = 10;
    private chaseRadius = 50;

    private _spawnPos: Vec3 = new Vec3();

    // 平滑与防抖
    private _vel: Vec3 = new Vec3();
    private _lastChosenDir: Vec3 = new Vec3();
    private _dirCooldown = 0;
    private _lastPos: Vec3 = new Vec3();
    private _blockedTimer = 0;

    hitPow: number = 1;
    partnerHitpow: number = 1;

    private _assignedGuardrail: any = null;
    private _doorMaxAttackers = 3;              // 固定 2~3，按需改 2 或 3

    get isDead() {
        return this._isDead;
    }
    set isDead(v: boolean) {
        this._isDead = v;
    }

    onLoad() {
        this._spider = this.node.getChildByName('Spider');
    }

    init() {
        this._spawnPos = this.node.worldPosition.clone();

        this._isDead = false;
        this._curHp = this.hp;

        this.hpNode = this.node.getChildByName('HP');
        if (!this.hpNode) return;

        this.whiteNode = this.hpNode.getChildByName('White');
        this.redNode = this.hpNode.getChildByName('Red');

        this.redProgressBar = this.redNode?.getComponent(ProgressBar) || null;
        if (this.redProgressBar) this.redProgressBar.progress = 1;

        this.whiteProgressBar = this.whiteNode?.getComponent(ProgressBar) || null;
        if (this.whiteProgressBar) this.whiteProgressBar.progress = 1;

        this.dissolveEffect.forEach((d: DissolveEffect) => {
            const mesh: MeshRenderer = d.node.getComponent(MeshRenderer);
            if (mesh) mesh.setMaterial(this.mats[0], 0);
            this.warmUpMaterial(d.node, 1);
            this.warmUpMaterial(d.node, 2);
            d.reset();
        });

        this._sideAngles = this.sideAnglesStr
            .split(',')
            .map(s => parseFloat(s.trim()))
            .filter(n => !isNaN(n));

        this._vel.set(0, 0, 0);
        this._lastPos.set(this.node.worldPosition);
        this._dirCooldown = 0;
        this._blockedTimer = 0;

        this._spider ||= this.node.getChildByName('Spider');
        this.changeState(MonsterStateDefine.Idle);
    }

    protected onEnable(): void {
        this._currentState = null;

        this._isDead = false;
        this._curHp = 4;

        this._target = null;
        this._isAttacking = false;
        this._canAttack = true;

        this.moveSpeed = 10;
        this.chaseRadius = 50;

        this._spawnPos = new Vec3();

        // 平滑与防抖
        this._vel = new Vec3();
        this._lastChosenDir = new Vec3();
        this._dirCooldown = 0;
        this._lastPos = new Vec3();
        this._blockedTimer = 0;

        this.hitPow = 1;
        this.partnerHitpow = 1;

        this._assignedGuardrail = null;
    }

    public warmUpMaterial(node: Node, index: number) {
        const mesh: MeshRenderer = node.getComponent(MeshRenderer);
        if (!mesh) return;
        mesh.setMaterial(this.mats[index], 0);
        this.scheduleOnce(() => {
            mesh.setMaterial(this.mats[0], 0);
        });
    }

    // 受伤
    injuryAni(isPlayer: boolean, whoHitMe: Node | null) {
        if (this._isDead) return;

        if (DataManager.Instance.curWeaponType == PlayerWeaponTypeEnum.CottonSwab) {
            this._curHp = Math.max(0, this._curHp - DataManager.Instance.sceneManager.cottonSwabRepelHarm);
        } else if (DataManager.Instance.curWeaponType == PlayerWeaponTypeEnum.Knife) {
            this._curHp = Math.max(0, this._curHp - DataManager.Instance.sceneManager.knifeSwabRepelHarm);
        } else if (DataManager.Instance.curWeaponType == PlayerWeaponTypeEnum.Flamethrower) {
            this._curHp = Math.max(0, this._curHp - DataManager.Instance.sceneManager.spitfireSwabRepelHarm);
        }

        // this._curHp = Math.max(0, this._curHp - 1);

        if (!this.hpNode || !this.redProgressBar || !this.whiteProgressBar) return;

        const targetProgress = this._curHp / this.hp;
        this.redProgressBar.progress = targetProgress;

        const currentPos = this.node.getWorldPosition().clone();
        const playerPos = DataManager.Instance.player.node.getWorldPosition().clone();

        let goalVector = new Vec2(playerPos.x, playerPos.z).subtract2f(currentPos.x, currentPos.z);

        if (DataManager.Instance.curWeaponType == PlayerWeaponTypeEnum.CottonSwab) {
            goalVector = goalVector.normalize().multiplyScalar(isPlayer ? -DataManager.Instance.sceneManager.cottonSwabRepelDistance : -this.partnerHitpow);
        } else if (DataManager.Instance.curWeaponType == PlayerWeaponTypeEnum.Knife) {
            goalVector = goalVector.normalize().multiplyScalar(isPlayer ? -DataManager.Instance.sceneManager.knifeRepelDistance : -this.partnerHitpow);
        } else if (DataManager.Instance.curWeaponType == PlayerWeaponTypeEnum.Flamethrower) {
            goalVector = goalVector.normalize().multiplyScalar(isPlayer ? -DataManager.Instance.sceneManager.spitfireRepelDistance : -this.partnerHitpow);
        }
        // goalVector = goalVector.normalize().multiplyScalar(isPlayer ? -this.hitPow : -this.partnerHitpow);

        if (isPlayer) {
            const offset = 3.2;
            const offsetVector = goalVector.clone().normalize().multiplyScalar(offset);

            goalVector.add(offsetVector);
        }

        const knockbackFinalPos = currentPos.clone().add(new Vec3(goalVector.x, 0, goalVector.y));
        targetNode.setWorldPosition(knockbackFinalPos);
        const isInsideDoor = DataManager.Instance.sceneManager.isNodeInsideDoorArea(targetNode);

        if (!isInsideDoor) {
            tween(this.node)
                .by(0.15, { position: new Vec3(goalVector.x, 0, goalVector.y) })
                .start();

            SoundManager.inst.playAudio("zhizhushouji");
        }

        tween(this.whiteProgressBar)
            .to(0.5, { progress: targetProgress }, { easing: 'quadInOut' })
            .start();

        if (whoHitMe && whoHitMe.name !== 'Player' && whoHitMe.isValid) {
            this._target = whoHitMe;
        }
        DataManager.Instance.player.monsterHitEffect([this.node]);

        if (this._curHp > 0) {
            this.dissolveEffect.forEach((d: DissolveEffect) => this.setMaterByIndex(d.node, 1));
            setTimeout(() => {
                this.dissolveEffect.forEach(d => this.setMaterByIndex(d.node, 0));
            }, 250);
        } else {
            this.scheduleOnce(() => {
                this.changeState(MonsterStateDefine.Die);
                // this.dissolveEffect.forEach(d => {
                //     this.setMaterByIndex(d.node, 2);
                //     d.init();
                //     d.play(0.5);
                // });
            });
            this._isDead = true;
            this.scheduleOnce(() => this.die(isPlayer), 1.33);
        }
    }

    private setMaterByIndex(node: Node, matIndex: number) {
        const mesh: MeshRenderer = node.getComponent(MeshRenderer);
        if (!mesh) return;
        mesh.setMaterial(this.mats[matIndex], 0);
        mesh.setMaterial(this.mats[matIndex + 3], 1);
    }

    /**
    * 人物在屋里
    *      1： 
    *         如果解锁煤油灯，就派离门最近的两只蜘蛛攻击门
    *      2： 
    *         如果没有解锁煤油灯，那所有的蜘蛛都保持原位置
    * 
    *  人物不在屋里
    *      1： 
    *         离人物一定范围的蜘蛛围过来攻击人
    *          
    *             
    *  无论人在屋还是不在屋，只要解锁煤油灯，就需要离门最近的的2-3只蜘蛛来攻击门，如果人在外面人在被蜘蛛攻击的范围内，优先攻击人，如果蜘蛛死了，会选择其它蜘蛛来攻击门
    * 
    */
    update(deltaTime: number) {
        if (this._isDead || !DataManager.Instance.isStartGame) return;

        const playerNode = DataManager.Instance.player.node;
        const isPlayerInDoor = DataManager.Instance.sceneManager.isNodeInsideDoorArea(playerNode);
        const lampUnlocked = DataManager.Instance.isDisplayKeroseneLamp;

        DataManager.Instance.isPlayerInDoor = isPlayerInDoor

        // —— 解锁煤油灯 —— //
        if (lampUnlocked) {
            this._tryAssignDoorSlot(); // 若自己没被指派，且有名额，则占坑
            if (this._assignedGuardrail && !this._assignedGuardrail.node?.isValid) {
                this._releaseDoorSlot();
            }
        } else {
            // 未解锁煤油灯：不应该有占坑
            if (this._assignedGuardrail) this._releaseDoorSlot();
        }
        if (isPlayerInDoor) {
            // 人在屋里
            if (lampUnlocked && this._assignedGuardrail) {
                this._target = this._assignedGuardrail.node; // 打门
            } else {
                this._target = null; // 原地/回出生点
            }
        } else {
            // 人不在屋里
            const selfPos = this.node.worldPosition;
            const playerPos = playerNode.worldPosition;
            const distToPlayer = Vec3.distance(selfPos, playerPos);

            // 只要进入我的仇恨范围（chaseRadius），优先打人
            const inAggro = distToPlayer <= this.chaseRadius;

            if (inAggro) {
                this._target = playerNode;   // 攻击人
                // 占坑不释放
            } else {
                if (lampUnlocked && this._assignedGuardrail) {
                    this._target = this._assignedGuardrail.node; // 回去打门
                } else {
                    this._target = null; // 回出生点
                }
            }
        }

        // 没目标：回出生点 + 碰撞/分离
        if (!this._target || !this._target.isValid) {
            this._isAttacking = false;
            this._canAttack = true;
            this.returnToSpawn_NoOverlap(deltaTime);
            this.checkBlocked(deltaTime);
            this.resolveOverlap();
            return;
        }

        // —— 越界/进门限制 ——
        const targetIsPlayer = this._target === playerNode;
        if (targetIsPlayer) {
            //  用“当前位置→玩家”的实时距离判断
            const selfPosNow = this.node.worldPosition;
            const playerPosNow = playerNode.worldPosition;
            const distToPlayerNow = Vec3.distance(selfPosNow, playerPosNow);

            // 人回屋 或 超出仇恨半径 -> 立刻停止追击，按上面规则下一帧重新分配
            if (isPlayerInDoor || distToPlayerNow > this.chaseRadius) {
                this._target = null;
                this._isAttacking = false;
                this._canAttack = true;

                this.returnToSpawn_NoOverlap(deltaTime);
                this.checkBlocked(deltaTime);
                this.resolveOverlap();
                return;
            }
        }

        // 追击 or 攻击
        const selfPos2 = this.node.worldPosition;
        const targetPos = this._target.worldPosition;
        const distance = Vec3.distance(selfPos2, targetPos);

        if (this._target.name == "Player") {
            this.attackDistance = 5;
        } else {
            this.attackDistance = 15;
        }

        if (distance > this.attackDistance) {
            this.moveToTarget_NoOverlap(deltaTime, targetPos);
        } else {
            this.smoothLookAt(targetPos, deltaTime);
            this.tryAttack();
        }

        this.checkBlocked(deltaTime);
        this.resolveOverlap();
    }

    private returnToSpawn_NoOverlap(dt: number) {
        const selfPos = this.node.worldPosition;
        const distance = Vec3.distance(selfPos, this._spawnPos);
        if (distance > 0.1) {
            this.moveTowards_NoOverlap(dt, this._spawnPos);
        } else {
            this._vel.set(0, 0, 0);
            this.changeState(MonsterStateDefine.Idle);
            this.smoothLookAt(this._spawnPos, dt);
        }
    }

    private moveToTarget_NoOverlap(dt: number, targetPos: Vec3) {
        this.moveTowards_NoOverlap(dt, targetPos);
    }

    private moveTowards_NoOverlap(dt: number, dest: Vec3) {
        const selfPos = this.node.worldPosition;
        const dirToTarget = new Vec3();
        Vec3.subtract(dirToTarget, dest, selfPos);
        dirToTarget.y = 0;
        if (dirToTarget.lengthSqr() < 1e-6) {
            this.changeState(MonsterStateDefine.Idle);
            return;
        }
        dirToTarget.normalize();

        const bestDir = this.chooseDirection(dirToTarget, dt);
        const desiredVel = bestDir.clone().multiplyScalar(this.moveSpeed);

        // 速度指数平滑
        const k = this.smoothFactor;
        const f = 1 - Math.exp(-k * dt);
        this._vel.x += (desiredVel.x - this._vel.x) * f;
        this._vel.z += (desiredVel.z - this._vel.z) * f;

        const nextPos = selfPos.clone().add(this._vel.clone().multiplyScalar(dt));

        if (this.canMoveTo(nextPos)) {
            this.node.setWorldPosition(nextPos);
            const lookPoint = selfPos.clone().add(bestDir);
            this.smoothLookAt(lookPoint, dt); // 平滑旋转
            this.changeState(MonsterStateDefine.Walk);
        } else {
            this._vel.set(0, 0, 0);
            this.changeState(MonsterStateDefine.Idle);
            // 被挡住也平滑朝目标看一下
            this.smoothLookAt(dest, dt);
        }
    }

    private chooseDirection(dirToTarget: Vec3, dt: number): Vec3 {
        const selfPos = this.node.worldPosition;
        const step = this.moveSpeed * dt;

        if (this._dirCooldown > 0) {
            this._dirCooldown -= dt;
            const stickNext = selfPos.clone().add(this._lastChosenDir.clone().multiplyScalar(step));
            if (this.canMoveTo(stickNext)) {
                return this._lastChosenDir.clone();
            }
        }

        const tryDirs: Vec3[] = [dirToTarget];
        for (const a of this._sideAngles) {
            tryDirs.push(this.rotateY(dirToTarget, math.toRadian(a)));
        }

        let best = dirToTarget;
        let bestScore = -Infinity;
        for (const d of tryDirs) {
            const nextPos = selfPos.clone().add(d.clone().multiplyScalar(step));
            if (!this.canMoveTo(nextPos)) continue;

            const score = Vec3.dot(d, dirToTarget) * 0.8 + Vec3.dot(d, this._lastChosenDir) * 0.2;
            if (score > bestScore) {
                bestScore = score;
                best = d;
            }
        }

        this._lastChosenDir = best.clone();
        this._dirCooldown = this.dirHoldTime;
        return best;
    }

    private canMoveTo(nextPos: Vec3): boolean {
        const siblings = this.node.parent?.children || [];
        for (const node of siblings) {
            if (node === this.node) continue;
            const other = node.getComponent(ItemMonsterManager);
            if (!other || other._isDead) continue;

            const otherPos = node.worldPosition;
            const minDist = this.radius + other.radius;
            const distSqr = Vec3.squaredDistance(nextPos, otherPos);
            if (distSqr < minDist * minDist) return false;
        }
        return true;
    }

    /** 被动分离：如果发生重叠，把自己往外推开 */
    private resolveOverlap() {
        const siblings = this.node.parent?.children || [];
        const selfPos = this.node.worldPosition;
        for (const node of siblings) {
            if (node === this.node) continue;
            const other = node.getComponent(ItemMonsterManager);
            if (!other || other._isDead) continue;

            const otherPos = node.worldPosition;
            const minDist = this.radius + other.radius;
            const dx = selfPos.x - otherPos.x;
            const dz = selfPos.z - otherPos.z;
            const dist = Math.sqrt(dx * dx + dz * dz);

            if (dist > 0 && dist < minDist) {
                const push = (minDist - dist) * 0.5;
                const nx = dx / dist;
                const nz = dz / dist;

                const newPos = new Vec3(
                    selfPos.x + nx * push,
                    selfPos.y,
                    selfPos.z + nz * push
                );
                this.node.setWorldPosition(newPos);
                selfPos.set(newPos);
            }
        }
    }

    private checkBlocked(dt: number) {
        const cur = this.node.worldPosition;
        const moved = Vec3.distance(cur, this._lastPos);
        this._lastPos.set(cur);

        if (moved < 0.001) {
            this._blockedTimer += dt;
            if (this._blockedTimer > 0.5) {
                this._dirCooldown = 0; // 允许立刻换方向
            }
        } else {
            this._blockedTimer = 0;
        }
    }

    private rotateY(vec: Vec3, rad: number): Vec3 {
        const c = Math.cos(rad);
        const s = Math.sin(rad);
        const x = vec.x * c - vec.z * s;
        const z = vec.x * s + vec.z * c;
        const out = new Vec3(x, 0, z);
        if (out.lengthSqr() > 1e-6) out.normalize();
        return out;
    }

    /** 平滑朝向某个世界坐标 */
    private smoothLookAt(worldPos: Vec3, dt: number) {
        const selfPos = this.node.worldPosition;
        const dir = new Vec3(worldPos.x - selfPos.x, 0, worldPos.z - selfPos.z);
        if (dir.lengthSqr() < 1e-6) return;
        dir.normalize();
        this.smoothLookDir(dir, dt);
    }

    /** 以最大角速度平滑朝向一个方向（y=0 的水平向量） */
    private smoothLookDir(dir: Vec3, dt: number) {
        if (!this._spider) {
            this._spider = this.node.getChildByName('Spider');
            if (!this._spider) return;
        }

        const forward = new Vec3(0, 0, 1);
        const targetRot = new Quat();
        Quat.rotationTo(targetRot, forward, dir);

        const curRot = this._spider.getRotation(new Quat());
        const maxStepRad = math.toRadian(this.turnSpeedDeg) * dt;

        const dot = Math.max(-1, Math.min(1, Quat.dot(curRot, targetRot)));
        const angle = Math.acos(dot) * 2;

        if (angle < 1e-4) {
            this._spider.setRotation(targetRot);
            return;
        }

        const t = Math.min(1, maxStepRad / angle);
        const out = new Quat();
        Quat.slerp(out, curRot, targetRot, t);
        this._spider.setRotation(out);
    }

    private tryAttack() {
        if (!this._isAttacking && this._canAttack) {
            this._isAttacking = true;
            this._canAttack = false;

            this.changeState(MonsterStateDefine.Attack);

            // 命中回调（示意：0.4s命中）
            this.scheduleOnce(() => {
                if (this._target?.isValid && this._target.name !== 'Player') {
                    const itemPartnerManager = this._target.getComponent(ItemPartnerManager);
                    itemPartnerManager?.onInjury();
                }
            }, 0.4);

            // 结束窗口
            this.scheduleOnce(() => {
                this._isAttacking = false;
                this._canAttack = true;
            }, 1.0);
        }
    }

    private _getDoorAssignedTotal(): number {
        let sum = 0;
        for (const g of (DataManager.Instance.guardrailArr ?? [])) {
            sum += (g.attackingMonsterCount || 0);
        }
        return sum;
    }

    private _findNearestGuardrail(fromPos: Vec3) {
        let nearest: any = null;
        let best = Infinity;
        for (const g of (DataManager.Instance.guardrailArr ?? [])) {
            const p = g.node.worldPosition;
            const dx = p.x - fromPos.x;
            const dz = p.z - fromPos.z;
            const d2 = dx * dx + dz * dz;
            if (d2 < best) { best = d2; nearest = g; }
        }
        return nearest;
    }

    private _tryAssignDoorSlot() {
        if (this._assignedGuardrail) return; // 已指派
        if (!DataManager.Instance.isDisplayKeroseneLamp) return; // 未解锁煤油灯

        const total = this._getDoorAssignedTotal();
        if (total >= this._doorMaxAttackers) return; // 没名额

        const nearest = this._findNearestGuardrail(this.node.worldPosition);
        if (!nearest) return;

        this._assignedGuardrail = nearest;
        this._assignedGuardrail.attackingMonsterCount =
            (this._assignedGuardrail.attackingMonsterCount || 0) + 1;
    }

    private _releaseDoorSlot() {
        if (!this._assignedGuardrail) return;
        this._assignedGuardrail.attackingMonsterCount = Math.max(
            (this._assignedGuardrail.attackingMonsterCount || 1) - 1, 0
        );
        this._assignedGuardrail = null;
    }

    /** 攻击墙 */
    attack() {
        // 如果不是攻击护栏，就是攻击人
        if (this._target.name == "Player") {
            DataManager.Instance.playerHealthBarManager.underAttack(1);
            return;
        }

        if (this._assignedGuardrail.blood > 5) {
            this._assignedGuardrail.blood -= 1;
            let bloodNode = this._assignedGuardrail.node.getChildByName('FenceBloodBar');
            if (!bloodNode) {
                bloodNode = instantiate(DataManager.Instance.prefabMap.get(EntityTypeEnum.FenceBloodBar));
                if (!bloodNode) return;
                bloodNode.parent = this._assignedGuardrail.node;
            }
            bloodNode.active = true;
            const bloodBar: ProgressBar = bloodNode.getComponent(ProgressBar);
            if (bloodBar) {
                bloodBar.progress = this._assignedGuardrail.blood / DataManager.Instance.guardrailBlood;

                console.log("=========================>", bloodBar.progress);
            }
        }

        if (this._assignedGuardrail.node.name.includes('Door')) {
            let leftNode = this._assignedGuardrail.node.getChildByPath('Door_L');
            if (leftNode) {
                const leftMesh: MeshRenderer = leftNode.getComponent(MeshRenderer);
                if (leftMesh) {
                    leftMesh.setMaterial(DataManager.Instance.sceneManager.doorMaterials[1], 0);
                    setTimeout(() => {
                        leftMesh.setMaterial(DataManager.Instance.sceneManager.doorMaterials[0], 0);
                    }, 50);
                }
            }
            let rightNode = this._assignedGuardrail.node.getChildByPath('Door_R');
            if (rightNode) {
                const rightMesh: MeshRenderer = rightNode.getComponent(MeshRenderer);
                if (rightMesh) {
                    rightMesh.setMaterial(DataManager.Instance.sceneManager.doorMaterials[1], 0);
                    setTimeout(() => {
                        rightMesh.setMaterial(DataManager.Instance.sceneManager.doorMaterials[0], 0);
                    }, 50);
                }
            }
        } else {
            let fenceNode = this._assignedGuardrail.node.getChildByName('B');
            if (fenceNode) {
                const fenceMesh: MeshRenderer = fenceNode.getComponent(MeshRenderer);
                if (fenceMesh) {
                    fenceMesh.setMaterial(DataManager.Instance.sceneManager.guardrailMaterials[3], 0);
                    fenceMesh.setMaterial(DataManager.Instance.sceneManager.guardrailMaterials[3], 1);
                    fenceMesh.setMaterial(DataManager.Instance.sceneManager.guardrailMaterials[3], 2);
                    setTimeout(() => {
                        fenceMesh.setMaterial(DataManager.Instance.sceneManager.guardrailMaterials[0], 0);
                        fenceMesh.setMaterial(DataManager.Instance.sceneManager.guardrailMaterials[1], 1);
                        fenceMesh.setMaterial(DataManager.Instance.sceneManager.guardrailMaterials[2], 2);
                    }, 50);
                }
            }
        }
    }

    // 状态切换
    private changeState(state: string) {
        if (state === this._currentState) return;
        this._currentState = state;

        const spider = this._spider || this.node.getChildByName('Spider');
        const spiderAni = spider?.getComponent(Animation);

        if (state === MonsterStateDefine.Idle) {
            this.skeletalAnimation?.stop();
            spiderAni?.play('idleA');

            const skeletalAnim = this.skeletalAnimation;
            if (!skeletalAnim) return;
            const clipName = skeletalAnim.clips[0]?.name;
            if (!clipName) return;

            skeletalAnim.play(clipName);
            const st = skeletalAnim.getState(clipName);
            if (!st) return;
            st.update(0);
            st.pause();
        } else {
            spiderAni?.stop();
            this.skeletalAnimation?.crossFade(state, 0.1);
        }
    }

    // 死亡
    die(isPlayer: boolean) {
        this.changeState(MonsterStateDefine.Die);
        this._releaseDoorSlot();
        DataManager.Instance.gridSystemManager.removeNode(this.node);
        DataManager.Instance.monsterConMananger.onProjectileDead(this.node);
        this.rendomFallMeat(isPlayer);

        DataManager.Instance.monsterConMananger.restoreSlot(this.node);
    }

    // 随机掉落肉块
    rendomFallMeat(isPlayer: boolean) {
        const randomMeatNum = MathUtil.getRandom(3, 5);
        const worldPos = this.node.getWorldPosition().clone();
        for (let i = 0; i < randomMeatNum; i++) {
            const randius = 3;
            const angle = Math.random() * Math.PI * 2;
            const r = Math.sqrt(Math.random()) * randius;

            const offsetX = r * Math.cos(angle);
            const offsetZ = r * Math.sin(angle);

            const newRandomPos = new Vec3(worldPos.x + offsetX, worldPos.y, worldPos.z + offsetZ);
            DataManager.Instance.meatManager.meatFallingOff(newRandomPos, isPlayer);
        }
    }
}
