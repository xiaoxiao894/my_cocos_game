import { _decorator, Animation, AnimationClip, AnimationState, Component, director, find, instantiate, Mat4, Node, Pool, Quat, SkeletalAnimation, SkeletalAnimationComponent, tween, Vec3 } from 'cc';
import { Actor } from './Actor';
import { StateDefine } from './StateDefine';
import { VirtualInput } from '../Input/VirtuallInput';
import { DataManager } from '../Global/DataManager';
import { GridSystem } from '../Grid/GridSystem';
import { EachPartnerManager } from './EachPartnerManager';
import { EntityTypeEnum } from '../Enum/Index';
const { ccclass, property, requireComponent } = _decorator;

@ccclass('PlayerManager')
@requireComponent(Actor)
export class PlayerManager extends Component {
    @property(Node)
    monster: Node = null;

    actor: Actor | null = null;

    private isInLockedState = false;

    private _attackDuration = 1.11;
    private _attackTimer = 0;
    private _isAttacking = false;

    private _isWalkAttack = false;

    monsters = null;
    start() {
        DataManager.Instance.player = this;

        this.actor = this.node.getComponent(Actor);
    }

    onDestroy() {
        DataManager.Instance.sceneManager.hitEffectPrefabPool.destroy();
    }

    create() {
        if (!DataManager.Instance.sceneManager.hitEffectPrefabPool) return;
        let node = DataManager.Instance.sceneManager.hitEffectPrefabPool.alloc();
        if (node.parent == null) {
            director.getScene().addChild(node);
        }
        node.active = true;
        return node;
    }

    onProjectileDead(node) {
        node.active = false;
        DataManager.Instance.sceneManager.hitEffectPrefabPool.free(node);
    }

    // update(deltaTime: number) {
    //     this.getIcon(deltaTime);

    //     if (this.actor.currentState === StateDefine.Die) return;

    //     this.monsters = DataManager.Instance.searchMonsters.getAttackTargets(this.node, 8, 360);
    //     const hasMonsters = this.monsters && this.monsters.length > 0;

    //     const len = this.handleInput();

    //     // 攻击计时
    //     if (this._isAttacking) {
    //         this._attackTimer += deltaTime;
    //         if (this._attackTimer >= this._attackDuration) {
    //             this._isAttacking = false;
    //             this._attackTimer = 0;
    //         }
    //     }

    //     // 触发攻击（站桩 + 有怪）
    //     if (!this._isAttacking && hasMonsters && len < 0.1) {
    //         this._isAttacking = true;
    //         this._attackTimer = 0;

    //         this.actor.changState(StateDefine.Attack);

    //         // 攻击起手短锁：仅允许 Attack/Walk_attack
    //         const selfAny = this as any;
    //         if (selfAny.__t === undefined) selfAny.__t = 0;
    //         if (selfAny.__lockUntil === undefined) selfAny.__lockUntil = 0;
    //         selfAny.__lockUntil = selfAny.__t + 0.10;
    //     }

    //     {
    //         const self = this as any;

    //         // 内部时钟/标记（无需类字段）
    //         if (self.__t === undefined) self.__t = 0;
    //         if (self.__stateCD === undefined) self.__stateCD = 0;           // 轻度冷却
    //         if (self.__applied === undefined) self.__applied = null;        // 上次真正应用的状态(StateDefine|null)
    //         if (self.__appliedSince === undefined) self.__appliedSince = 0; // 上次应用时间
    //         if (self.__lastDesired === undefined) self.__lastDesired = null;// 上次期望
    //         if (self.__desiredSince === undefined) self.__desiredSince = 0; // 期望保持起点
    //         if (self.__stuckT === undefined) self.__stuckT = 0;             // 想切被挡累计
    //         if (self.__idleFrozen === undefined) self.__idleFrozen = false; // 空闲是否已定格
    //         if (self.__parentIdleOn === undefined) self.__parentIdleOn = false; // 父级 idleA 标记
    //         if (self.__lockUntil === undefined) self.__lockUntil = 0;       // 攻击短锁

    //         self.__t += deltaTime;
    //         self.__stateCD = Math.max(0, self.__stateCD - deltaTime);

    //         // 常量：稳态窗口/最小驻留/强制阈值
    //         const STABLE_WIN = 0.06; // 期望状态需稳定 60ms
    //         const FORCE_AFTER = 0.25; // 期望同一状态持续 250ms 强制切
    //         const MIN_HOLD = (s: StateDefine | null) => {
    //             switch (s) {
    //                 case StateDefine.Attack: return 0.12;
    //                 case StateDefine.Walk_attack: return 0.10;
    //                 case StateDefine.Walk: return 0.10;
    //                 default: return 0.08; // Idle(null) 的最小驻留
    //             }
    //         };

    //         // —— 小工具：空闲定格/离开恢复 —— //
    //         const resumeIfFrozen = () => {
    //             if (!self.__idleFrozen) return;
    //             const jackParent = this.node.getChildByName("JackParent");
    //             const jackParentAni = jackParent?.getComponent(Animation);
    //             if (jackParentAni && self.__parentIdleOn) {
    //                 jackParentAni.stop();
    //                 self.__parentIdleOn = false;
    //             }
    //             const jack = jackParent?.getChildByName("AnnaJC_Skin");
    //             const skeletalAnim = jack?.getComponent(SkeletalAnimation);
    //             skeletalAnim?.resume();
    //             self.__idleFrozen = false;
    //         };

    //         const freezeIdleOnce = () => {
    //             if (self.__idleFrozen) return;
    //             const jackParent = this.node.getChildByName("JackParent");
    //             if (!jackParent) return;

    //             const jackParentAni = jackParent.getComponent(Animation);
    //             if (jackParentAni && !self.__parentIdleOn) {
    //                 jackParentAni.play("idleA"); // 不依赖 isPlaying
    //                 self.__parentIdleOn = true;
    //             }

    //             const jack = jackParent.getChildByName("AnnaJC_Skin");
    //             const skeletalAnim = jack?.getComponent(SkeletalAnimation);
    //             const clipName = skeletalAnim?.clips?.[0]?.name;
    //             if (skeletalAnim && clipName) {
    //                 skeletalAnim.play(clipName);

    //                 this.scheduleOnce(() => {
    //                     const state = skeletalAnim.getState(clipName);
    //                     state.setTime(0);  
    //                     state.update(0);    
    //                     state.pause();     
    //                 })

    //                 // state?.update(0);
    //                 // state?.pause(); // 定格一帧，杜绝滑步
    //                 self.__idleFrozen = true;
    //             }
    //         };

    //         // —— 计算“期望状态” —— //
    //         let desired: StateDefine | null = null;
    //         if (!this._isAttacking) {
    //             if (len > 0.1) {
    //                 this._isWalkAttack = false;
    //                 desired = hasMonsters ? StateDefine.Walk_attack : StateDefine.Walk;
    //                 resumeIfFrozen();
    //             } else {
    //                 if (hasMonsters) {
    //                     desired = StateDefine.Attack;
    //                     resumeIfFrozen();
    //                 } else {
    //                     desired = null; // 真·空闲，不切状态
    //                     freezeIdleOnce();
    //                 }
    //             }
    //         } else {
    //             desired = (len > 0.1) ? StateDefine.Walk_attack : StateDefine.Attack;
    //             this._isWalkAttack = (len > 0.1);
    //             resumeIfFrozen();
    //         }

    //         // 短锁：锁内只允许 Attack / Walk_attack
    //         if (self.__t < self.__lockUntil) {
    //             desired = (len > 0.1) ? StateDefine.Walk_attack : StateDefine.Attack;
    //         }

    //         // 期望稳定性跟踪
    //         if (desired !== self.__lastDesired) {
    //             self.__lastDesired = desired;
    //             self.__desiredSince = self.__t;
    //         }

    //         // 是否允许切换
    //         const stableEnough = (self.__t - self.__desiredSince) >= STABLE_WIN;
    //         const holdEnough = (self.__t - self.__appliedSince) >= MIN_HOLD(self.__applied);
    //         const attackPair =
    //             (self.__applied === StateDefine.Attack && desired === StateDefine.Walk_attack) ||
    //             (self.__applied === StateDefine.Walk_attack && desired === StateDefine.Attack);

    //         if (desired !== self.__applied) {
    //             // 想切换，先累计“卡住”时间
    //             self.__stuckT += deltaTime;

    //             // 允许切的条件：
    //             // 1) 稳定窗口成立 且 (已达到最小驻留 或 为 Attack↔Walk_attack 高优先级)
    //             // 2) 或者达到强制切换阈值（卡住补偿）
    //             if ((stableEnough && (holdEnough || attackPair)) || self.__stuckT >= FORCE_AFTER) {
    //                 // 只有非空闲才真正 changState；空闲用定格实现
    //                 if (desired !== null) {
    //                     this.actor.changState(desired);
    //                 }
    //                 self.__applied = desired;
    //                 self.__appliedSince = self.__t;
    //                 self.__stateCD = 0.06; // 轻度冷却
    //                 self.__stuckT = 0;

    //                 // 刚切到 Attack 时，刷新短锁，避免立刻被走/空闲覆盖
    //                 if (desired === StateDefine.Attack) {
    //                     self.__lockUntil = self.__t + 0.10;
    //                 }
    //             }
    //         } else {
    //             // 期望与已应用一致，清零卡住累计
    //             self.__stuckT = 0;
    //         }
    //     }
    // }


    // 怪受
    update(dt: number) {
        this.getIcon(dt);

        if (this.actor.currentState === StateDefine.Die) return;

        this.monsters = DataManager.Instance.searchMonsters.getAttackTargets(this.node, 8, 360);
        const hasMonsters = this.monsters && this.monsters.length > 0;

        const len = this.handleInput();
        // 攻击逻辑（触发一次）
        // if (hasMonsters && len < 0.1) {
        //     // this._isAttacking = true;
        //     // this._attackTimer = 0;
        //     if (DataManager.Instance.playerAction) {
        //         console.log("==============================>", DataManager.Instance.playerAction, "=====================>", StateDefine.Attack)
        //         this.actor.changState(StateDefine.Attack);
        //     }
        // }

        // === 动画状态管理 ===
        // if (!this._isAttacking) {
        if (len > 0.1) {
            if (DataManager.Instance.playerAction) {
                console.log("==============================>", DataManager.Instance.playerAction, "=====================>", StateDefine.Attack)
                this.actor.changState(hasMonsters ? StateDefine.Walk_attack : StateDefine.Walk);
            }
        } else {
            if (DataManager.Instance.playerAction) {
                if (hasMonsters) {
                    this.actor.changState(StateDefine.Attack);
                } else {
                    // === 空闲状态动画处理（骨骼动画冻结一帧） ===
                    const jackParent = this.node.getChildByName("JackParent");
                    const jackParentAni = jackParent?.getComponent(Animation);
                    if (jackParentAni) {
                        const idleState = jackParentAni.getState("idleA");
                        if (idleState && !idleState.isPlaying) {
                            jackParentAni.play("idleA");
                        }
                    }

                    const jack = jackParent.getChildByName("AnnaJC_Skin");
                    const skeletalAnim = jack.getComponent(SkeletalAnimation);
                    if (!skeletalAnim) return;

                    // const clipName = skeletalAnim.clips[0]?.name;
                    const clipName = skeletalAnim.clips.find(item => {
                        return item.name == StateDefine.Attack;
                    })
                    if (!clipName) return;

                    // 播放一次动画以初始化动画状态
                    skeletalAnim.play(clipName.name);

                    const state = skeletalAnim.getState(clipName.name);
                    if (!state) return;
                    state.update(0); // 强制立即应用该时间的骨骼姿势
                    state.pause();
                }
            }
        }

    }

    monsterHitEffect(monsters: Node[]) {
        for (let i = 0; i < monsters.length; i++) {
            const monster = monsters[i];

            const effect = this.create();
            if (!effect) continue;

            // 设置特效位置为怪物当前位置
            const pos = monster.getWorldPosition();
            pos.y = pos.y + 3;
            pos.x = pos.x + 1;
            effect.setWorldPosition(pos);

            // 播放动画（假设节点下有 Animation 组件）
            const sprite = effect.getChildByName("Sprite");
            const effectAnim = sprite.getComponent(Animation);
            if (effectAnim && effectAnim.defaultClip) {
                effectAnim.play("TX_Attack_hit");

                // 动画结束后回收
                effectAnim.once(Animation.EventType.FINISHED, () => {
                    this.onProjectileDead(effect);
                });
            } else {
                // 如果没动画直接延迟销毁
                setTimeout(() => {
                    this.onProjectileDead(effect);
                }, 1000);
            }
        }
    }

    // 停顿攻击特效
    pauseAttackEffect() {
        DataManager.Instance.soundManager.PlayerAttackSoundPlay();
        DataManager.Instance.monsterManager.killMonsters(this.monsters, true);

        const jackParent = this.node.getChildByName("JackParent");
        const jack = jackParent.getChildByName("AnnaJC_Skin");
        const txWalkAttack = jack.getChildByName("TX_attack");
        txWalkAttack.active = true;
        const attackSprite = txWalkAttack.getChildByName("Sprite");

        if (attackSprite) {
            const walkAttackAni = attackSprite.getComponent(Animation);
            if (walkAttackAni) {
                walkAttackAni.once(Animation.EventType.FINISHED, this._onAttackFinished, this);

                walkAttackAni.play("TX_Attack");
            }
        }
    }

    private _onAttackFinished(anim: Animation, state: AnimationState) {
        if (state.name === "TX_Attack") {
            const jackParent = this.node.getChildByName("JackParent");
            const jack = jackParent.getChildByName("AnnaJC_Skin");
            const txWalkAttack = jack.getChildByName("TX_attack");
            txWalkAttack.active = false;

            if (this._isWalkAttack) {
                this._isWalkAttack = false;

                // this.walkingAttackEffects();
            }
        }
    }

    // 走路攻击特效
    private _isAttackPlaying = false;
    walkingAttackEffects() {
        if (this._isAttackPlaying) return;
        this._isAttackPlaying = true;

        DataManager.Instance.soundManager.PlayerAttackSoundPlay();
        DataManager.Instance.monsterManager.killMonsters(this.monsters, true);

        const jackParent = this.node.getChildByName("JackParent");
        const jack = jackParent.getChildByName("AnnaJC_Skin");
        const txWalkAttack = jack.getChildByName("TX_walk_attack");
        txWalkAttack.active = true;

        const walkAttackSprite = txWalkAttack.getChildByName("Sprite");
        if (walkAttackSprite) {
            const walkAttackAni = walkAttackSprite.getComponent(Animation);
            if (walkAttackAni) {
                walkAttackAni.stop();
                walkAttackAni.once(Animation.EventType.FINISHED, this._onWalkAttackFinished, this);
                walkAttackAni.play("TX_Attack");
            }
        }
    }

    private _onWalkAttackFinished() {
        this._isAttackPlaying = false;

        const jackParent = this.node.getChildByName("JackParent");
        const jack = jackParent.getChildByName("AnnaJC_Skin");
        const txWalkAttack = jack.getChildByName("TX_walk_attack");
        txWalkAttack.active = false;
    }


    handleInput() {
        const x = VirtualInput.horizontal;
        const y = VirtualInput.vertical;

        if (x === 0 && y === 0) {
            this.actor.destForward.set(0, 0, 0);
            return 0;
        }

        const camNode = find("Main Camera");

        // 获取摄像机的世界旋转（四元数）
        const camRot = camNode.getWorldRotation();

        // 从旋转计算 forward（z轴）和 right（x轴）
        const forward = new Vec3(0, 0, -1);
        const right = new Vec3(1, 0, 0);

        Vec3.transformQuat(forward, forward, camRot);
        Vec3.transformQuat(right, right, camRot);

        // 只保留水平分量
        forward.y = 0;
        right.y = 0;
        forward.normalize();
        right.normalize();

        // 将摇杆输入转换为世界方向
        const moveDir = new Vec3();
        Vec3.scaleAndAdd(moveDir, moveDir, right, x);    // x轴影响
        Vec3.scaleAndAdd(moveDir, moveDir, forward, y); // y轴影响（注意：-y 表示前）

        moveDir.normalize();
        this.actor.destForward.set(moveDir.x, 0, moveDir.z);
        return moveDir.length();
    }


    // 获取主角朝向
    getForwardVector(node: Node): Vec3 {
        const forward = new Vec3(0, 0, -1);
        return Vec3.transformQuat(new Vec3(), forward, node.getRotation()).normalize();
    }

    // 获取肉  // 这里还需要
    private _uncollectedMeat: Node[] = [];

    getIcon(dt) {
        const newMeats = DataManager.Instance.monsterManager.getDrops();
        const player = DataManager.Instance.player;
        if (!player) return;

        const backpack1 = player.node.getChildByName("Backpack1");
        if (!backpack1) return;

        const playerPos = player.node.worldPosition.clone();
        const maxDistanceXZ = 33;

        // 合并新掉落 + 上次未收集的
        const allMeats: Node[] = [...newMeats, ...this._uncollectedMeat];
        this._uncollectedMeat = []; // 本轮清空，重新判断收集

        let delayCounter = 0;

        for (let i = 0; i < allMeats.length; i++) {
            const meat = allMeats[i];
            if (!meat || !meat.isValid) continue;

            const meatPos = meat.worldPosition.clone();
            const dx = meatPos.x - playerPos.x;
            const dz = meatPos.z - playerPos.z;
            const distSqrXZ = dx * dx + dz * dz;

            // 超出范围：暂存等待下一次
            if (distSqrXZ > maxDistanceXZ * maxDistanceXZ) {
                this._uncollectedMeat.push(meat);
                continue;
            }

            // === 贝塞尔飞行动画 ===
            const start = meatPos;
            const duration = 0.6;
            const controller = { t: 0 };

            meat.setParent(this.node.parent);
            meat.setWorldPosition(start);

            tween(controller)
                .delay(delayCounter * 0.05) // 用 delayCounter 替代 i，避免跳过后间隔混乱
                .to(duration, { t: 1 }, {
                    easing: 'quadOut',
                    onUpdate: () => {
                        const t = controller.t;
                        const oneMinusT = 1 - t;

                        // 当前背包堆叠高度
                        let maxY = 0;
                        for (let j = 0; j < backpack1.children.length; j++) {
                            const child = backpack1.children[j];
                            if (!child || !child.isValid) continue;
                            const localPos = child.getPosition();
                            if (localPos.y > maxY) {
                                maxY = localPos.y;
                            }
                        }

                        const localTarget = new Vec3(0, maxY + 0.5, 0);

                        const worldPos = backpack1.getWorldPosition();
                        const worldRot = backpack1.getWorldRotation();
                        const worldScale = backpack1.getWorldScale();
                        const worldMat = new Mat4();
                        Mat4.fromRTS(worldMat, worldRot, worldPos, worldScale);
                        const worldTarget = Vec3.transformMat4(new Vec3(), localTarget, worldMat);

                        const control = new Vec3(
                            (start.x + worldTarget.x) / 2,
                            Math.max(start.y, worldTarget.y) + 2,
                            (start.z + worldTarget.z) / 2
                        );

                        const pos = new Vec3(
                            oneMinusT * oneMinusT * start.x + 2 * oneMinusT * t * control.x + t * t * worldTarget.x,
                            oneMinusT * oneMinusT * start.y + 2 * oneMinusT * t * control.y + t * t * worldTarget.y,
                            oneMinusT * oneMinusT * start.z + 2 * oneMinusT * t * control.z + t * t * worldTarget.z
                        );

                        meat.setWorldPosition(pos);
                    }
                })
                .call(() => {
                    const finalWorldPos = meat.getWorldPosition().clone();
                    meat.setParent(backpack1);
                    meat.setWorldPosition(finalWorldPos);

                    DataManager.Instance.soundManager.playIconSound();
                    DataManager.Instance.UIPropertyManager.collectProperty();
                })
                .start();

            delayCounter++;
        }
    }


}


