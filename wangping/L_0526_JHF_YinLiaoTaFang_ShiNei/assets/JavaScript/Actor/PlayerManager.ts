import { _decorator, Animation, AnimationClip, AnimationState, Component, director, find, instantiate, Mat4, Node, Pool, Quat, SkeletalAnimation, SkeletalAnimationComponent, tween, Vec3 } from 'cc';
import { Actor } from './Actor';
import { StateDefine } from './StateDefine';
import { VirtualInput } from '../Input/VirtuallInput';
import { DataManager } from '../Global/DataManager';
import { GridSystem } from '../Grid/GridSystem';
import { EachPartnerManager } from './EachPartnerManager';
import { EntityTypeEnum, PlayerWeaponTypeEnum } from '../Enum/Index';
const { ccclass, property, requireComponent } = _decorator;

@ccclass('PlayerManager')
@requireComponent(Actor)
export class PlayerManager extends Component {
    @property(Node)
    monster: Node = null;

    @property({ type: Node, tooltip: "火焰" })
    fireNode: Node = null;

    actor: Actor | null = null;

    private isInLockedState = false;

    private _attackDuration = 0.5;
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

    update(deltaTime: number) {
        this.getIcon(deltaTime);

        if (this.actor.currentState === StateDefine.Die) return;

        if (DataManager.Instance.curWeaponType == PlayerWeaponTypeEnum.CottonSwab) {
            this.monsters = DataManager.Instance.searchMonsters.getAttackTargets(this.node, DataManager.Instance.sceneManager.forkAttackDistance, DataManager.Instance.sceneManager.forkAttackAngle);
        } else if (DataManager.Instance.curWeaponType == PlayerWeaponTypeEnum.Knife) {
            this.monsters = DataManager.Instance.searchMonsters.getAttackTargets(this.node, DataManager.Instance.sceneManager.knifeAttackDistance, DataManager.Instance.sceneManager.knifeAttackAngle);
        } else if (DataManager.Instance.curWeaponType == PlayerWeaponTypeEnum.Flamethrower) {
            this.monsters = DataManager.Instance.searchMonsters.getAttackTargets(this.node, DataManager.Instance.sceneManager.spitfireAttackDistance, DataManager.Instance.sceneManager.spitfireAttacAngle);
        }

        const hasMonsters = this.monsters && this.monsters.length > 0;
        const len = this.handleInput();

        // 攻击时计时控制
        // if (this._isAttacking) {
        //     this._attackTimer += deltaTime;
        //     if (this._attackTimer >= this._attackDuration) {
        //         this._isAttacking = false;
        //         this._attackTimer = 0;
        //     }
        // }

        // 攻击逻辑（触发一次）
        if (hasMonsters && len < 0.1) {
            // this._isAttacking = true;
            // this._attackTimer = 0;

            if (DataManager.Instance.playerAction) {
                const attackKey = `Attack_${DataManager.Instance.curWeaponType}`;
                this.actor.changState(StateDefine[attackKey]);

                if (DataManager.Instance.curWeaponType === PlayerWeaponTypeEnum.Flamethrower) {
                    this.fireNode.active = true;

                    DataManager.Instance.soundManager.startFlamethrowerSound();
                }
            }
        }

        // === 动画状态管理 ===
        // if (!this._isAttacking) {
        if (len > 0.1) {
            if (DataManager.Instance.playerAction) {
                const walkAttackKey = `Run_Attack_${DataManager.Instance.curWeaponType}`;
                const walkKey = `Run_${DataManager.Instance.curWeaponType}`;
                this.actor.changState(hasMonsters ? StateDefine[walkAttackKey] : StateDefine[walkKey]);
                if (DataManager.Instance.curWeaponType === PlayerWeaponTypeEnum.Flamethrower) {
                    if (hasMonsters) {
                        this.fireNode.active = true;
                        DataManager.Instance.soundManager.startFlamethrowerSound();
                    } else {
                        this.fireNode.active = false;
                        DataManager.Instance.soundManager.stopFlamethrowerSound();
                    }
                }
            }
        } else {
            if (DataManager.Instance.playerAction) {
                const attackKeyName = `Attack_${DataManager.Instance.curWeaponType}`;
                if (hasMonsters) {
                    this.actor.changState(StateDefine[attackKeyName]);
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

                    const jack = jackParent.getChildByName("JackA-ZJ");
                    const skeletalAnim = jack.getComponent(SkeletalAnimation);
                    if (!skeletalAnim) return;

                    // const clipName = skeletalAnim.clips[0]?.name;
                    const clipName = skeletalAnim.clips.find(item => {
                        return item.name == StateDefine[attackKeyName];
                    })
                    if (!clipName) return;

                    // 播放一次动画以初始化动画状态
                    skeletalAnim.play(clipName.name);

                    const state = skeletalAnim.getState(clipName.name);
                    if (!state) return;
                    state.update(0); // 强制立即应用该时间的骨骼姿势
                    state.pause();

                    if (DataManager.Instance.curWeaponType == PlayerWeaponTypeEnum.Flamethrower) {
                        this.fireNode.active = false;
                        DataManager.Instance.soundManager.stopFlamethrowerSound();
                    }
                }
            }
        }
        // } else {
        //     if (len > 0.1) {
        //         if (DataManager.Instance.playerAction) {
        //             const walkAttackKey = `Run_Attack_${DataManager.Instance.curWeaponType}`;
        //             this.actor.changState(StateDefine[walkAttackKey]);

        //             console.log("====================================================>163")

        //             if (DataManager.Instance.curWeaponType === PlayerWeaponTypeEnum.Flamethrower) {
        //                 this.fireNode.active = true;
        //                 DataManager.Instance.soundManager.startFlamethrowerSound();
        //             }
        //         }
        //         this._isWalkAttack = true;
        //     }
        // }
    }

    // 怪受
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
        this.hideAllAnimation();

        if (DataManager.Instance.curWeaponType != PlayerWeaponTypeEnum.Flamethrower) {
            DataManager.Instance.soundManager.PlayerAttackSoundPlay();
        }
        DataManager.Instance.monsterManager.killMonsters(this.monsters, true, this.node);
        const jackParent = this.node.getChildByName("JackParent");
        const jack = jackParent.getChildByName("JackA-ZJ");

        if (DataManager.Instance.curWeaponType == PlayerWeaponTypeEnum.CottonSwab) {
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
        } else if (DataManager.Instance.curWeaponType == PlayerWeaponTypeEnum.Knife) {
            const txWalkAttack = jack.getChildByName("TX_attack_SGD");
            txWalkAttack.active = true;
            const attackSprite = txWalkAttack.getChildByName("Sprite");

            if (attackSprite) {
                const walkAttackAni = attackSprite.getComponent(Animation);
                if (walkAttackAni) {
                    walkAttackAni.once(Animation.EventType.FINISHED, this._onAttackFinished, this);

                    walkAttackAni.play("TX_Attack-001");
                }
            }
        } else if (DataManager.Instance.curWeaponType == PlayerWeaponTypeEnum.Flamethrower) {
            this.fireNode.active = true;
        }
    }

    private _onAttackFinished(anim: Animation, state: AnimationState) {
        if (state.name === "TX_Attack" || state.name == "TX_Attack-001") {
            const jackParent = this.node.getChildByName("JackParent");
            const jack = jackParent.getChildByName("JackA-ZJ");
            if (DataManager.Instance.curWeaponType == PlayerWeaponTypeEnum.CottonSwab) {
                const txWalkAttack = jack.getChildByName("TX_attack");
                txWalkAttack.active = false;

                const walkAttackSprite = txWalkAttack.getChildByName("Sprite");
                if (walkAttackSprite) {
                    const walkAttackAni = walkAttackSprite.getComponent(Animation);
                    if (walkAttackAni) {
                        const clipName = "TX_Attack";
                        const state = walkAttackAni.getState(clipName);
                        this.scheduleOnce(() => {
                            if (state) {
                                state.stop();
                                state.time = 0;             // 设置到第0秒
                                state.sample();             // 应用当前帧数据（这个很关键）
                                state.pause();              // 暂停动画
                            }
                        }, 0.1)
                    }
                }
            } else if (DataManager.Instance.curWeaponType == PlayerWeaponTypeEnum.Knife) {
                const txWalkAttack = jack.getChildByName("TX_attack_SGD");
                txWalkAttack.active = false;

                const walkAttackSprite = txWalkAttack.getChildByName("Sprite");
                if (walkAttackSprite) {
                    const walkAttackAni = walkAttackSprite.getComponent(Animation);
                    if (walkAttackAni) {
                        const clipName = "TX_Attack-001";
                        const state = walkAttackAni.getState(clipName);
                        this.scheduleOnce(() => {
                            if (state) {
                                state.stop();
                                state.time = 0;             // 设置到第0秒
                                state.sample();             // 应用当前帧数据（这个很关键）
                                state.pause();              // 暂停动画
                            }
                        }, 0.1)
                    }
                }
            } else if (DataManager.Instance.curWeaponType == PlayerWeaponTypeEnum.Flamethrower) {
                this.fireNode.active = false;
            }

            if (this._isWalkAttack) {
                this._isWalkAttack = false;
                // this.walkingAttackEffects();
            }
        }
    }

    // 走路攻击特效
    // private _isAttackPlaying = false;
    walkingAttackEffects() {
        this.hideAllAnimation();
        // if (this._isAttackPlaying) return;
        // this._isAttackPlaying = true;

        if (DataManager.Instance.curWeaponType != PlayerWeaponTypeEnum.Flamethrower) {
            DataManager.Instance.soundManager.PlayerAttackSoundPlay();
        }
        DataManager.Instance.monsterManager.killMonsters(this.monsters, true, this.node);

        const jackParent = this.node.getChildByName("JackParent");
        const jack = jackParent.getChildByName("JackA-ZJ");
        if (DataManager.Instance.curWeaponType == PlayerWeaponTypeEnum.CottonSwab) {
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
        } else if (DataManager.Instance.curWeaponType == PlayerWeaponTypeEnum.Knife) {
            const txWalkAttack = jack.getChildByName("TX_walk_attack_SGD");
            txWalkAttack.active = true;

            const walkAttackSprite = txWalkAttack.getChildByName("Sprite");
            if (walkAttackSprite) {
                const walkAttackAni = walkAttackSprite.getComponent(Animation);
                if (walkAttackAni) {
                    walkAttackAni.stop();
                    walkAttackAni.once(Animation.EventType.FINISHED, this._onWalkAttackFinished, this);
                    walkAttackAni.play("TX_Attack-001");
                }
            }
        } else if (DataManager.Instance.curWeaponType == PlayerWeaponTypeEnum.Flamethrower) {
            this.fireNode.active = true;
        }

    }

    private _onWalkAttackFinished() {
        const jackParent = this.node.getChildByName("JackParent");
        const jack = jackParent.getChildByName("JackA-ZJ");
        if (DataManager.Instance.curWeaponType == PlayerWeaponTypeEnum.CottonSwab) {
            const txWalkAttack = jack.getChildByName("TX_walk_attack");
            txWalkAttack.active = false;

            const walkAttackSprite = txWalkAttack.getChildByName("Sprite");
            if (walkAttackSprite) {
                const walkAttackAni = walkAttackSprite.getComponent(Animation);
                if (walkAttackAni) {
                    const clipName = "TX_Attack";
                    const state = walkAttackAni.getState(clipName);
                    this.scheduleOnce(() => {
                        if (state) {
                            state.stop();
                            state.time = 0;             // 设置到第0秒
                            state.sample();             // 应用当前帧数据（这个很关键）
                            state.pause();              // 暂停动画
                        }
                    }, 0.1)
                }
            }
        } else if (DataManager.Instance.curWeaponType == PlayerWeaponTypeEnum.Knife) {
            const txWalkAttack = jack.getChildByName("TX_walk_attack_SGD");
            txWalkAttack.active = false;

            const walkAttackSprite = txWalkAttack.getChildByName("Sprite");
            if (walkAttackSprite) {
                const walkAttackAni = walkAttackSprite.getComponent(Animation);
                if (walkAttackAni) {
                    const clipName = "TX_Attack-001";
                    const state = walkAttackAni.getState(clipName);
                    this.scheduleOnce(() => {
                        if (state) {
                            state.stop();
                            state.time = 0;             // 设置到第0秒
                            state.sample();             // 应用当前帧数据（这个很关键）
                            state.pause();              // 暂停动画
                        }
                    }, 0.1)
                }
            }
        } if (DataManager.Instance.curWeaponType == PlayerWeaponTypeEnum.Flamethrower) {
            this.fireNode.active = false;
        }
    }

    hideAllAnimation() {
        const jackParent = this.node.getChildByName("JackParent");
        const jack = jackParent.getChildByName("JackA-ZJ");

        if (jack) {
            const txAttack = jack.getChildByName("TX_attack");
            if (txAttack) txAttack.active = false

            const txWalkAttack = jack.getChildByName("TX_walk_attack");
            if (txWalkAttack) txWalkAttack.active = false;

            const sgdAttack = jack.getChildByName("TX_attack_SGD");
            if (sgdAttack) sgdAttack.active = false;

            const sgdWalkAttack = jack.getChildByName("TX_walk_attack_SGD");
            if (sgdWalkAttack) sgdAttack.active = false;
        }

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


