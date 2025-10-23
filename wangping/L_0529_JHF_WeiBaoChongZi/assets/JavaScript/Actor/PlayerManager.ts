import { _decorator, Animation, AnimationState, Component, director, dynamicAtlasManager, find, instantiate, Mat4, Node, ParticleSystem, Pool, Quat, SkeletalAnimation, tween, Vec3 } from 'cc';
import { Actor } from './Actor';
import { StateDefine } from './StateDefine';
import { VirtualInput } from '../Input/VirtuallInput';
import { DataManager } from '../Global/DataManager';
import { EntityTypeEnum } from '../Enum/Index';
const { ccclass, property, requireComponent } = _decorator;

@ccclass('PlayerManager')
@requireComponent(Actor)
export class PlayerManager extends Component {
    actor: Actor | null = null;

    private _attackDuration = 0.1;
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
        this.monsters = DataManager.Instance.monsterConMananger.getAttackTargets(this.node, 10, 360);

        if (this.actor.currentState === StateDefine.Die) return;

        const hasMonsters = this.monsters && this.monsters.length > 0;

        // 1. 始终执行移动（不管是否攻击）
        const len = this.handleInput();
        // 2. 攻击逻辑（只做逻辑计时，不 return，不打断移动）
        // 攻击时计时控制
        if (this._isAttacking) {
            this._attackTimer += deltaTime;
            if (this._attackTimer >= this._attackDuration) {
                this._isAttacking = false;
                this._attackTimer = 0;
            }
        }

        // 攻击逻辑（触发一次）
        if (!this._isAttacking && hasMonsters && len < 0.1) {
            this._isAttacking = true;
            this._attackTimer = 0;

            if (this.actor.qianbiNode.active) {
                DataManager.Instance.playerAction = false;
                this.actor.changState(StateDefine.AttackP);
            } else {
                if (DataManager.Instance.playerAction) {
                    this.actor.changState(StateDefine.Attack);
                }
            }

            // this.pauseAttackEffect(); // 可选：播放攻击特效
        }

        // 3. 动画状态（不影响移动，仅决定动画表现）
        if (!this._isAttacking) {
            if (len > 0.1) {
                if (this.actor.qianbiNode.active) {
                    if (DataManager.Instance.playerAction) {
                        if (hasMonsters) {
                            DataManager.Instance.playerAction = false;
                            this.actor.changState(StateDefine.AttackP);
                        } else {
                            this.actor.changState(StateDefine.WalkP);
                        }
                    }

                    // this.actor.changState(hasMonsters ? StateDefine.AttackP : StateDefine.WalkP);
                } else {
                    if (DataManager.Instance.playerAction) {
                        this.actor.changState(hasMonsters ? StateDefine.Walk_attack : StateDefine.Walk);
                    }
                    // if (DataManager.Instance.playerAction && !hasMonsters) {
                    //     this.actor.changState(StateDefine.Walk)
                    // } else if (hasMonsters) {
                    //     this.actor.changState(StateDefine.Walk_attack)
                    // }
                }
            } else {
                if (this.actor.qianbiNode.active) {
                    if (DataManager.Instance.playerAction) {
                        this.actor.changState(hasMonsters ? StateDefine.WalkP : StateDefine.IdleP);
                    }
                } else {
                    if (DataManager.Instance.playerAction) {
                        this.actor.changState(hasMonsters ? StateDefine.Attack : StateDefine.Idle);
                    }
                    // if (!hasMonsters) {
                    //     this.actor.changState(StateDefine.Idle);
                    // } else if (hasMonsters) {
                    //     this.actor.changState(StateDefine.Attack);
                    // }
                    // console.log("98", hasMonsters ? StateDefine.Attack : StateDefine.Idle);

                }
            }
        } else {
            if (len > 0.1) {
                if (this.actor.qianbiNode.active) {
                    this.actor.changState(StateDefine.WalkP)
                } else {
                    if (DataManager.Instance.playerAction) {
                        this.actor.changState(StateDefine.Walk_attack); // 播放边打边走动画（如没有该动画可选 Walk）
                    }
                }
                this._isWalkAttack = true;
            }
        }
    }

    // 停顿攻击特效
    pauseAttackEffect() {
        this.hideAllAnimation();

        DataManager.Instance.soundManager.playerAttackSoundPlay();
        DataManager.Instance.monsterConMananger.takeDamageMonster(this.monsters, true, this.node)

        const jack = this.node.getChildByName("JackA_Skin");
        if (this.actor.qianbiNode.active) {
            const txWalkAttackP = jack.getChildByName("TX_walk_attack-P");
            txWalkAttackP.active = true;
            const attackSprite = txWalkAttackP.getChildByName("TX_attack");
            if (attackSprite) {
                const yanwu = attackSprite.getChildByName("TX_yanwu");
                if (yanwu) {
                    const particleSystem = yanwu.getComponent(ParticleSystem);
                    particleSystem.play();
                }
                const walkAttackAni = attackSprite.getComponent(Animation);
                if (walkAttackAni) {
                    walkAttackAni.once(Animation.EventType.FINISHED, this._onAttackFinished, this);

                    walkAttackAni.play("Attack_P");
                }
            }
        } else {
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
    }

    private _onAttackFinished(anim: Animation, state: AnimationState) {
        if (state.name === "TX_Attack") {
            const jack = this.node.getChildByName("JackA_Skin");
            const txWalkAttack = jack.getChildByName("TX_attack");
            txWalkAttack.active = false;

            if (this._isWalkAttack) {
                this._isWalkAttack = false;

                // this.walkingAttackEffects();
            }
        } else if (state.name === "TX_Attack-P") {
            const jack = this.node.getChildByName("JackA_Skin");
            const txWalkAttack = jack.getChildByName("TX_walk_attack-P");
            txWalkAttack.active = false;

            if (this._isWalkAttack) {
                this._isWalkAttack = false;
            }
        }
    }

    // 走路攻击特效
    walkingAttackEffects() {
        this.hideAllAnimation();
        DataManager.Instance.soundManager.playerAttackSoundPlay();

        DataManager.Instance.monsterConMananger.takeDamageMonster(this.monsters, true, this.node)

        const jack = this.node.getChildByName("JackA_Skin");
        if (this.actor.qianbiNode.active) {
            const txWalkAttack = jack.getChildByName("TX_walk_attack-P");
            txWalkAttack.active = true;
            const walkAttackSprite = txWalkAttack.getChildByName("TX_attack");

            if (walkAttackSprite) {
                const yanwu = walkAttackSprite.getChildByName("TX_yanwu");
                if (yanwu) {
                    const particleSystem = yanwu.getComponent(ParticleSystem);
                    particleSystem.play();
                }
                const walkAttackAni = walkAttackSprite.getComponent(Animation);
                if (walkAttackAni) {
                    walkAttackAni.once(Animation.EventType.FINISHED, this._onWalkAttackFinished, this);
                    walkAttackAni?.play("Attack_P");
                }
            }
        } else {
            const txWalkAttack = jack.getChildByName("TX_walk_attack");
            txWalkAttack.active = true;
            const walkAttackSprite = txWalkAttack.getChildByName("Sprite");

            if (walkAttackSprite) {
                const walkAttackAni = walkAttackSprite.getComponent(Animation);
                if (walkAttackAni) {
                    if (walkAttackAni.defaultClip && walkAttackAni.getState(walkAttackAni.defaultClip.name)?.isPlaying) {
                        walkAttackAni.stop();
                    }

                    walkAttackAni.once(Animation.EventType.FINISHED, this._onWalkAttackFinished, this);
                    // walkAttackAni?.stop();
                    walkAttackAni?.play("TX_Attack");
                }
            }
        }
    }

    // 隐藏所有动作
    hideAllAnimation() {
        // 停顿攻击
        const jack = this.node.getChildByName("JackA_Skin")

        if (jack) {
            if (this.actor.qianbiNode.active) {
                const txWalkAttackP = jack.getChildByName("TX_walk_attack-P");
                if (txWalkAttackP) txWalkAttackP.active = false;
            } else {
                const txAttack = jack.getChildByName("TX_attack");
                if (txAttack) txAttack.active = false

                const txWalkAttack = jack.getChildByName("TX_walk_attack");
                if (txWalkAttack) txWalkAttack.active = false;
            }
        }

    }

    private _onWalkAttackFinished(anim: Animation, state: AnimationState) {
        if (state.name === "TX_Attack") {
            const jack = this.node.getChildByName("JackA_Skin");
            const txWalkAttack = jack.getChildByName("TX_walk_attack");
            txWalkAttack.active = false;
        } else if (state.name === "TX_Attack-P") {
            const jack = this.node.getChildByName("JackA_Skin");
            const txWalkAttack = jack.getChildByName("TX_walk_attack-P");
            txWalkAttack.active = false;
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

    // 获取主角朝向
    getForwardVector(node: Node): Vec3 {
        const forward = new Vec3(0, 0, -1);
        return Vec3.transformQuat(new Vec3(), forward, node.getRotation()).normalize();
    }
    private _uncollectedIcon: Node[] = [];

    getIcon(dt) {
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
                    DataManager.Instance.soundManager.meatPickupSoundPlay();
                })
                .start();

            delayCounter++;
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
}


