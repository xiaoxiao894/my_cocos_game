import { _decorator, Animation, AnimationState, Component, director, find, Mat4, Node, SkeletalAnimation, tween, Vec3 } from 'cc';
import { Actor } from './Actor';
import { DataManager } from '../Global/DataManager';
import { VirtualInput } from '../Input/VirtuallInput';
import { StateDefine } from './StateDefine';
import { PlayerWeaponTypeEnum } from '../Enum/Index';
const { ccclass, property, requireComponent } = _decorator;

@ccclass('PlayerManager')
@requireComponent(Actor)
export class PlayerManager extends Component {
    @property(Node)
    fireNode: Node = null;

    actor: Actor | null = null;
    monsters = [];
    private _uncollectedIcon: Node[] = [];
    start() {
        DataManager.Instance.player = this;

        this.actor = this.node.getComponent(Actor);
    }

    update(deltaTime: number) {
        this.getMeat();

        if (this.actor.currentState === StateDefine.Die) return;

        const curWeaponType = DataManager.Instance.curWeaponType;
        if (curWeaponType == PlayerWeaponTypeEnum.CottonSwab) {
            const distance = DataManager.Instance.sceneManager.cottonSwabAttackDistance;
            const angle = DataManager.Instance.sceneManager.cottonSwabAttackAngle;
            this.monsters = DataManager.Instance.monsterConMananger.getAttackTargets(this.node, distance, angle);
        } else if (curWeaponType == PlayerWeaponTypeEnum.Knife) {
            const distance = DataManager.Instance.sceneManager.knifeAttackDistance;
            const angle = DataManager.Instance.sceneManager.knifeAttackAngle;
            this.monsters = DataManager.Instance.monsterConMananger.getAttackTargets(this.node, distance, angle);
        } else if (curWeaponType == PlayerWeaponTypeEnum.Flamethrower) {
            const distance = DataManager.Instance.sceneManager.spitfireAttackDistance;
            const angle = DataManager.Instance.sceneManager.spitfireAttacAngle;
            this.monsters = DataManager.Instance.monsterConMananger.getAttackTargets(this.node, distance, angle);
        }

        const hasMonsters = this.monsters && this.monsters.length > 0;
        const len = this.handleInput();

        // 攻击逻辑（触发一次）
        if (hasMonsters && len < 0.1) {
            if (DataManager.Instance.playerAction) {
                const attackKey = `Attack_${curWeaponType}`;
                this.actor.changState(StateDefine[attackKey]);

                if (curWeaponType === PlayerWeaponTypeEnum.Flamethrower) {
                    this.fireNode.active = true;
                }
            }
        }

        // === 动画状态管理 ===
        if (len > 0.1) {
            if (DataManager.Instance.playerAction) {
                const walkAttackKey = `Run_Attack_${curWeaponType}`;
                const walkKey = `Run_${curWeaponType}`;
                this.actor.changState(hasMonsters ? StateDefine[walkAttackKey] : StateDefine[walkKey]);

                if (curWeaponType === PlayerWeaponTypeEnum.Flamethrower) {
                    if (hasMonsters) {
                        this.fireNode.active = true;
                    } else {
                        this.fireNode.active = false;
                    }
                }
            }
        } else {
            if (DataManager.Instance.playerAction) {
                const attackKeyName = `Attack_${curWeaponType}`;
                const idleKeyName = `Idle_${curWeaponType}`;
                if (hasMonsters) {
                    this.actor.changState(StateDefine[attackKeyName]);
                } else {
                    // this.actor.changState(StateDefine[idleKeyName]);

                    // === 空闲状态动画处理（骨骼动画冻结一帧） ===
                    const jackParent = this.node.getChildByName("JackParent");
                    const jackParentAni = jackParent?.getComponent(Animation);
                    if (jackParentAni) {
                        const idleState = jackParentAni.getState("idleA");
                        if (idleState && !idleState.isPlaying) {
                            jackParentAni.play("idleA");
                        }
                    }

                    const jack = jackParent.getChildByName("PA_chr_Anna_kt_Skin_V001");
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

                    if (curWeaponType == PlayerWeaponTypeEnum.Flamethrower) {
                        this.fireNode.active = false;
                    }
                }
            }
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
        Vec3.scaleAndAdd(moveDir, moveDir, right, x);
        Vec3.scaleAndAdd(moveDir, moveDir, forward, y);

        moveDir.normalize();
        this.actor.destForward.set(moveDir.x, 0, moveDir.z);
        return moveDir.length();
    }

    // monsterHitEffect(monsters: Node[]) {
    //     for (let i = 0; i < monsters.length; i++) {
    //         const monster = monsters[i];

    //         const effect = this.create();
    //         if (!effect) continue;

    //         // 设置特效位置为怪物当前位置
    //         const pos = monster.getWorldPosition();
    //         pos.y = pos.y + 3;
    //         pos.x = pos.x + 1;
    //         effect.setWorldPosition(pos);

    //         // 播放动画（假设节点下有 Animation 组件）
    //         const sprite = effect.getChildByName("Sprite");
    //         const effectAnim = sprite.getComponent(Animation);
    //         if (effectAnim && effectAnim.defaultClip) {
    //             effectAnim.play("TX_Attack_hit");

    //             // 动画结束后回收
    //             effectAnim.once(Animation.EventType.FINISHED, () => {
    //                 this.onProjectileDead(effect);
    //             });
    //         } else {
    //             // 如果没动画直接延迟销毁
    //             setTimeout(() => {
    //                 this.onProjectileDead(effect);
    //             }, 1000);
    //         }
    //     }
    // }

    walkingAttackEffects() {
        this.hideAllAnimation();

        DataManager.Instance.monsterConMananger.takeDamageMonster(this.monsters, true, this.node)

        const jackParent = this.node.getChildByName("JackParent");
        const jack = jackParent.getChildByName("PA_chr_Anna_kt_Skin_V001");
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
            // this.fireNode.active = true;
        }
    }

    // 隐藏所有动作
    hideAllAnimation() {
        // 停顿攻击
        const jackParent = this.node.getChildByName("JackParent");
        const jack = jackParent.getChildByName("PA_chr_Anna_kt_Skin_V001");
        const txWalkAttack = jack.getChildByName("TX_walk_attack");
        txWalkAttack.active = false;

        const txWalkAttackSGD = jack.getChildByName("TX_walk_attack_SGD");
        txWalkAttackSGD.active = false;

        const txAttackSGD = jack.getChildByName("TX_attack_SGD");
        txAttackSGD.active = false;

        const txAttack = jack.getChildByName("TX_attack");
        txAttack.active = false;
    }

    private _onWalkAttackFinished(anim: Animation, state: AnimationState) {
        const jackParent = this.node.getChildByName("JackParent");
        const jack = jackParent.getChildByName("PA_chr_Anna_kt_Skin_V001");
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
            // this.fireNode.active = false;
        }
    }

    // 停顿攻击特效
    pauseAttackEffect() {
        this.hideAllAnimation();

        DataManager.Instance.monsterConMananger.takeDamageMonster(this.monsters, true, this.node)

        const jackParent = this.node.getChildByName("JackParent");
        const jack = jackParent.getChildByName("PA_chr_Anna_kt_Skin_V001");

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
            // this.fireNode.active = true;
        }
    }

    private _onAttackFinished(anim: Animation, state: AnimationState) {
        if (state.name === "TX_Attack" || state.name == "TX_Attack-001") {
            const jackParent = this.node.getChildByName("JackParent");
            const jack = jackParent.getChildByName("PA_chr_Anna_kt_Skin_V001");
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
                // this.fireNode.active = false;
            }

            // if (this._isWalkAttack) {
            //     this._isWalkAttack = false;
            //     // this.walkingAttackEffects();
            // }
        }
    }

    // 自动获取肉
    getMeat() {
        const iconList = DataManager.Instance.meatManager.getDrops();
        const player = DataManager.Instance.player;
        if (!player) return;

        const backpacks = [
            player.node.getChildByName("Backpack1"),
            player.node.getChildByName("Backpack2"),
            player.node.getChildByName("Backpack3"),
        ];

        // 辅助函数：根据图标找到合适的背包
        const findTargetBackpack = (icon: Node): Node | null => {
            let matched: Node | null = null;
            let empty: Node | null = null;

            for (const backpack of backpacks) {
                if (!backpack) continue;

                const children = backpack.children;
                if (children.length === 0 && !empty) {
                    empty = backpack;
                } else {
                    for (const child of children) {
                        if (child.name === icon.name) {
                            matched = backpack;
                            break;
                        }
                    }
                }

                if (matched) break;
            }

            return matched || empty || backpacks[0];
        };

        const playerPos = player.node.worldPosition.clone();
        const maxDistanceXZ = 33;

        const allIcons: Node[] = [...iconList, ...this._uncollectedIcon];
        this._uncollectedIcon = [];

        let delayCounter = 0;

        for (let i = 0; i < allIcons.length; i++) {
            const icon = allIcons[i];
            if (!icon || !icon.isValid) continue;

            const iconPos = icon.worldPosition.clone();
            const dx = iconPos.x - playerPos.x;
            const dz = iconPos.z - playerPos.z;
            const distSqrXZ = dx * dx + dz * dz;

            if (distSqrXZ > maxDistanceXZ * maxDistanceXZ) {
                this._uncollectedIcon.push(icon);
                continue;
            }

            const targetBackpack = findTargetBackpack(icon);
            if (!targetBackpack) continue;

            const start = iconPos;
            const duration = 0.6;
            const controller = { t: 0 };

            icon.setParent(this.node.parent);
            icon.setWorldPosition(start);

            tween(controller)
                .delay(delayCounter * 0.05)
                .to(duration, { t: 1 }, {
                    easing: 'quadOut',
                    onUpdate: () => {
                        const t = controller.t;
                        const oneMinusT = 1 - t;

                        // 计算当前目标背包的堆叠高度
                        let maxY = 0;
                        for (const child of targetBackpack.children) {
                            if (!child || !child.isValid) continue;
                            const localPos = child.getPosition();
                            if (localPos.y > maxY) {
                                maxY = localPos.y;
                            }
                        }

                        const localTarget = new Vec3(0, maxY + 0.5, 0);

                        // 背包的世界变换矩阵
                        const worldPos = targetBackpack.getWorldPosition();
                        const worldRot = targetBackpack.getWorldRotation();
                        const worldScale = targetBackpack.getWorldScale();
                        const worldMat = new Mat4();
                        Mat4.fromRTS(worldMat, worldRot, worldPos, worldScale);
                        const worldTarget = Vec3.transformMat4(new Vec3(), localTarget, worldMat);

                        // 控制点
                        const control = new Vec3(
                            (start.x + worldTarget.x) / 2,
                            Math.max(start.y, worldTarget.y) + 2,
                            (start.z + worldTarget.z) / 2
                        );

                        // 贝塞尔插值
                        const pos = new Vec3(
                            oneMinusT * oneMinusT * start.x + 2 * oneMinusT * t * control.x + t * t * worldTarget.x,
                            oneMinusT * oneMinusT * start.y + 2 * oneMinusT * t * control.y + t * t * worldTarget.y,
                            oneMinusT * oneMinusT * start.z + 2 * oneMinusT * t * control.z + t * t * worldTarget.z
                        );

                        icon.setWorldPosition(pos);
                    }
                })
                .call(() => {
                    const finalWorldPos = icon.getWorldPosition().clone();
                    icon.setParent(targetBackpack);
                    icon.setWorldPosition(finalWorldPos);

                    const meatScaleNode = icon.getChildByName("Meat");
                    if (meatScaleNode) {
                        meatScaleNode.setScale(3, 3, 3);
                    }

                    tween(icon)
                        .to(0.15, { scale: new Vec3(1.2, 1.2, 1.2) }, { easing: 'quadOut' })
                        .to(0.05, { scale: new Vec3(1, 1, 1) }, { easing: 'quadOut' })
                        .start();


                    DataManager.Instance.uiPropertManager.meatCollectProperty();
                    // DataManager.Instance.soundManager.meatPickupSoundPlay();
                })
                .start();

            delayCounter++;
        }
    }
}


