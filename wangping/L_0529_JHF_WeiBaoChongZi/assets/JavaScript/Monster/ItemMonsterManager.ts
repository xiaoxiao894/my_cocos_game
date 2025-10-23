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
    math
} from 'cc';
import { MonsterStateDefine, StateDefine } from '../Actor/StateDefine';
import { DissolveEffect } from '../../Res/DissolveEffect/scripts/DissolveEffect';
import { DataManager } from '../Global/DataManager';
import { MathUtil } from '../Util/MathUtil';
import { ItemPartnerManager } from '../Actor/ItemPartnerManager';
import { EntityTypeEnum } from '../Enum/Index';

const { ccclass, property } = _decorator;

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
    radius: number = 3;

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

    private attackDistance = 9;
    private moveSpeed = 6;
    private chaseRadius = 50;

    private _spawnPos: Vec3 = new Vec3();

    // 平滑与防抖
    private _vel: Vec3 = new Vec3();
    private _lastChosenDir: Vec3 = new Vec3();
    private _dirCooldown = 0;
    private _lastPos: Vec3 = new Vec3();
    private _blockedTimer = 0;

    hitPow: number = 6;
    partnerHitpow: number = 1;

    private _assignedGuardrail: any = null;

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

        this._curHp = Math.max(0, this._curHp - 1);

        if (!this.hpNode || !this.redProgressBar || !this.whiteProgressBar) return;

        const targetProgress = this._curHp / this.hp;
        this.redProgressBar.progress = targetProgress;

        const currentPos = this.node.getWorldPosition().clone();
        const playerPos = DataManager.Instance.player.node.getWorldPosition().clone();

        let goalVector = new Vec2(playerPos.x, playerPos.z).subtract2f(currentPos.x, currentPos.z);
        goalVector = goalVector.normalize().multiplyScalar(isPlayer ? -this.hitPow : -this.partnerHitpow);

        if (isPlayer) {
            const offset = 3.2;
            const offsetVector = goalVector.clone().normalize().multiplyScalar(offset);

            goalVector.add(offsetVector);
        }


        const knockbackFinalPos = currentPos.clone().add(new Vec3(goalVector.x, 0, goalVector.y));
        const targetNode = new Node('Temp');
        targetNode.setWorldPosition(knockbackFinalPos);
        const isInsideDoor = DataManager.Instance.sceneManager.isNodeInsideDoorArea(targetNode);

        if (!isInsideDoor) {
            tween(this.node)
                .by(0.15, { position: new Vec3(goalVector.x, 0, goalVector.y) })
                .start();
        }

        tween(this.whiteProgressBar)
            .to(0.5, { progress: targetProgress }, { easing: 'quadInOut' })
            .start();

        if (whoHitMe && whoHitMe.name !== 'Player' && whoHitMe.isValid) {
            this._target = whoHitMe;
        }

        if (this._curHp > 0) {
            this.dissolveEffect.forEach((d: DissolveEffect) => this.setMaterByIndex(d.node, 1));
            setTimeout(() => {
                this.dissolveEffect.forEach(d => this.setMaterByIndex(d.node, 0));
            }, 250);
            DataManager.Instance.player.monsterHitEffect([this.node]);
        } else {
            this.scheduleOnce(() => {
                this.dissolveEffect.forEach(d => {
                    this.setMaterByIndex(d.node, 2);
                    d.init();
                    d.play(0.5);
                });
            });
            this._isDead = true;
            this.scheduleOnce(() => this.die(isPlayer), 0.5);
        }
    }

    private setMaterByIndex(node: Node, matIndex: number) {
        const mesh: MeshRenderer = node.getComponent(MeshRenderer);
        if (!mesh) return;
        mesh.setMaterial(this.mats[matIndex], 0);
        mesh.setMaterial(this.mats[matIndex + 3], 1);
    }

    update(deltaTime: number) {
        if (this._isDead || !DataManager.Instance.isStartGame) return;

        const isPlayerInDoor = DataManager.Instance.sceneManager.isNodeInsideDoorArea(
            DataManager.Instance.player.node
        );


        if (isPlayerInDoor) {
            const monsterPos = this.node.worldPosition.clone();
            let nearestGuardrail = null;
            let minDistSqr = Infinity;

            for (const guardrail of DataManager.Instance.guardrailArr) {
                const attackingCount = guardrail.attackingMonsterCount || 0;
                if (attackingCount >= 2) continue;

                const guardrailPos = guardrail.node.worldPosition;
                const dx = guardrailPos.x - monsterPos.x;
                const dz = guardrailPos.z - monsterPos.z;
                const distSqr = dx * dx + dz * dz;

                if (distSqr < minDistSqr) {
                    minDistSqr = distSqr;
                    nearestGuardrail = guardrail;
                }
            }

            if (nearestGuardrail && !this._assignedGuardrail) {
                this._assignedGuardrail = nearestGuardrail;
                this._assignedGuardrail.attackingMonsterCount =
                    (this._assignedGuardrail.attackingMonsterCount || 0) + 1;

                this._target = this._assignedGuardrail.node;
            }
        } else if (this._target && this._target.name == 'Partner') {
            // 
        } else {
            this._target = DataManager.Instance.player.node;

            if (this._assignedGuardrail) {
                this._assignedGuardrail.attackingMonsterCount = Math.max(
                    (this._assignedGuardrail.attackingMonsterCount -= 1),
                    0
                );
                this._assignedGuardrail = null;
            }
        }

        // 没目标
        if (!this._target || !this._target.isValid) {
            if (this._assignedGuardrail) {
                this._assignedGuardrail.attackingMonsterCount = Math.max(
                    (this._assignedGuardrail.attackingMonsterCount -= 1),
                    0
                );
                this._assignedGuardrail = null;
            }
            this._isAttacking = false;
            this._canAttack = true;
            this.returnToSpawn_NoOverlap(deltaTime);
            this.checkBlocked(deltaTime);
            this.resolveOverlap();
            return;
        }

        // 越界/进门
        const selfPos = this.node.worldPosition;
        const targetPos = this._target.worldPosition;
        const toTargetDist = Vec3.distance(this._spawnPos, targetPos);
        const isPlayer = this._target.name == 'Player';
        if (toTargetDist > this.chaseRadius || (isPlayer && isPlayerInDoor)) {
            if (this._assignedGuardrail) {
                this._assignedGuardrail.attackingMonsterCount = Math.max(
                    (this._assignedGuardrail.attackingMonsterCount -= 1),
                    0
                );
                this._assignedGuardrail = null;
            }
            this._target = null;
            this._isAttacking = false;
            this._canAttack = true;
            this.returnToSpawn_NoOverlap(deltaTime);
            this.checkBlocked(deltaTime);
            this.resolveOverlap();
            return;
        }

        // 追击 or 攻击
        const distance = Vec3.distance(selfPos, targetPos);
        if (distance > this.attackDistance) {
            this.moveToTarget_NoOverlap(deltaTime, targetPos);
        } else {
            this.smoothLookAt(targetPos, deltaTime); // 平滑看向目标
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

            this.scheduleOnce(() => {
                if (this._target?.isValid && this._target.name !== 'Player') {
                    const itemPartnerManager = this._target.getComponent(ItemPartnerManager);
                    itemPartnerManager?.onInjury();
                }
            }, 0.4);

            this.scheduleOnce(() => {
                this._isAttacking = false;
                this._canAttack = true;
            }, 1.0);
        }
    }

    attack() {
        if (!this._assignedGuardrail) return;

        if (this._assignedGuardrail.blood > 0) {
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
            }
        }

        if (this._assignedGuardrail.node.name.includes('Door')) {
            let leftNode = this._assignedGuardrail.node.getChildByPath('Door_Left/LaZhu_hl_B007/B');
            if (leftNode) {
                const leftMesh: MeshRenderer = leftNode.getComponent(MeshRenderer);
                if (leftMesh) {
                    leftMesh.setMaterial(DataManager.Instance.sceneManager.doorMaterials[1], 0);
                    setTimeout(() => {
                        leftMesh.setMaterial(DataManager.Instance.sceneManager.doorMaterials[0], 0);
                    }, 50);
                }
            }
            let rightNode = this._assignedGuardrail.node.getChildByPath('Door_Right/LaZhu_hl_B007/B');
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

    private lookAtTarget(targetPos: Vec3) {
        const forward = new Vec3();
        Vec3.subtract(forward, targetPos, this.node.worldPosition);
        forward.y = 0;
        forward.normalize();

        const spider = this._spider || this.node.getChildByName('Spider');
        if (!spider) return;

        const rotation = new Quat();
        Quat.fromViewUp(rotation, forward, Vec3.UP);
        spider.setRotation(rotation);
    }

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

    die(isPlayer: boolean) {
        this.changeState(MonsterStateDefine.Die);
        DataManager.Instance.gridSystemManager.removeNode(this.node);
        DataManager.Instance.monsterConMananger.onProjectileDead(this.node);
        this.rendomFallIcon(isPlayer);
    }

    rendomFallIcon(isPlayer: boolean) {
        const randomIconNum = MathUtil.getRandom(2, 4);
        const worldPos = this.node.getWorldPosition().clone();
        for (let i = 0; i < randomIconNum; i++) {
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
