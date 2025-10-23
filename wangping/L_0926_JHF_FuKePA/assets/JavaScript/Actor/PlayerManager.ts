import { _decorator, Animation, AnimationState, Component, director, find, Mat4, Node, ParticleSystem, Quat, SkeletalAnimation, Tween, tween, Vec3 } from 'cc';
import { Actor } from './Actor';
import { DataManager } from '../Global/DataManager';
import { VirtualInput } from '../Input/VirtuallInput';
import { StateDefine } from './StateDefine';
import { PlayerWeaponTypeEnum, TypeItemEnum } from '../Enum/Index';
import { SimplePoolManager } from '../Util/SimplePoolManager';
import { SoundManager } from '../Common/SoundManager';
import { ItemMonsterManager } from '../Monster/ItemMonsterManager';
const { ccclass, property, requireComponent } = _decorator;

@ccclass('PlayerManager')
@requireComponent(Actor)
export class PlayerManager extends Component {
    @property(Node)
    fireNode: Node = null;

    actor: Actor | null = null;

    private _monsters = [];
    private _uncollectedIcon: Node[] = [];

    private _initPlayerPos: Vec3 = null;
    private _initPlayerRot: Quat = null;
    private _initBackpackGold: number[] = [0, 0, 0];

    private _mainCamera = null;
    start() {
        DataManager.Instance.player = this;

        this._mainCamera = find("Main Camera");

        this._initPlayerPos = this.node.worldPosition.clone();
        this._initPlayerRot = this.node.worldRotation.clone();

        this.actor = this.node.getComponent(Actor);

        this._recordInitialBackpackGold();
    }

    update(deltaTime: number) {
        this.getMeat();

        if (this.actor.currentState === StateDefine.Die) return;

        const curWeaponType = DataManager.Instance.curWeaponType;
        if (curWeaponType == PlayerWeaponTypeEnum.CottonSwab) {
            const distance = DataManager.Instance.sceneManager.cottonSwabAttackDistance;
            const angle = DataManager.Instance.sceneManager.cottonSwabAttackAngle;
            this._monsters = DataManager.Instance.monsterConMananger.getAttackTargets(this.node, distance, angle);
        } else if (curWeaponType == PlayerWeaponTypeEnum.Knife) {
            const distance = DataManager.Instance.sceneManager.knifeAttackDistance;
            const angle = DataManager.Instance.sceneManager.knifeAttackAngle;
            this._monsters = DataManager.Instance.monsterConMananger.getAttackTargets(this.node, distance, angle);
        } else if (curWeaponType == PlayerWeaponTypeEnum.Flamethrower) {
            const distance = DataManager.Instance.sceneManager.spitfireAttackDistance;
            const angle = DataManager.Instance.sceneManager.spitfireAttacAngle;
            this._monsters = DataManager.Instance.monsterConMananger.getAttackTargets(this.node, distance, angle);
        }

        const hasMonsters = this._monsters && this._monsters.length > 0;
        const len = this.handleInput();

        // 攻击逻辑（触发一次）
        if (hasMonsters && len < 0.1) {
            this._stopRunSfx();
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
            this._playRunSfx();
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
            this._stopRunSfx();
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

        // 获取摄像机的世界旋转（四元数）
        const camRot = this._mainCamera.getWorldRotation();

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

    _runSfxOn: boolean = false;
    _playRunSfx() {
        if (!this._runSfxOn) {
            SoundManager.inst.playRunBGM();
            this._runSfxOn = true;
        }
    }

    _stopRunSfx() {
        if (this._runSfxOn) {
            SoundManager.inst.stopRunBGM();
            this._runSfxOn = false;
        }
    }

    // 假设在同一个类里
    private _isAttackPlaying = false;           // 防重入标志
    private readonly RESET_DELAY_FRAME = 0;     // 用 0 表示下一帧；若确实需要，可改为 0.1

    private getJackNode(): Node | null {
        const jackParent = this.node.getChildByName("JackParent");
        if (!jackParent) return null;
        const jack = jackParent.getChildByName("PA_chr_Anna_kt_Skin_V001");
        return jack || null;
    }

    /** 通用：播放某个动画节点中的 Sprite Animation，并在播放结束时回调
     * nodeName: 子节点名，例如 "TX_walk_attack" / "TX_attack_SGD"
     * clipName: 要播放的动画片段名，例如 "TX_Attack" / "TX_Attack-001"
     */
    private playAnimationNode(jack: Node, nodeName: string, clipName: string, onFinished?: () => void) {
        if (!jack) return;
        const animNode = jack.getChildByName(nodeName);
        if (!animNode) return;
        animNode.active = true;

        const sprite = animNode.getChildByName("Sprite");
        if (!sprite) {
            // 如果没有 Sprite，也许只是启用特效节点
            onFinished?.();
            return;
        }

        const animComp = sprite.getComponent(Animation);
        if (!animComp) {
            onFinished?.();
            return;
        }

        // 先确保停止，防止叠加
        const existingState = animComp.getState(clipName);
        if (existingState) {
            existingState.stop();
            existingState.time = 0;
            existingState.sample();
            existingState.pause();
        }

        // 捕获当前的 nodeName/clipName（防止中途改变全局武器）
        const finishHandler = () => {
            // 在下一帧重置动画状态（更稳定）
            this.scheduleOnce(() => {
                this.resetAndPauseAnimation(animComp, clipName);
                animNode.active = false;
                onFinished?.();
            }, this.RESET_DELAY_FRAME);
        };

        // use once to avoid multiple subscriptions
        animComp.once(Animation.EventType.FINISHED, finishHandler, this);

        // 播放
        animComp.play(clipName);
    }

    /** 停止并把动画设为第0帧并暂停（复位用） */
    private resetAndPauseAnimation(animComp: Animation, clipName: string) {
        const st = animComp.getState(clipName);
        if (!st) return;
        st.stop();
        st.time = 0;
        st.sample(); // 应用第0帧
        st.pause();
    }

    /** 走路攻击特效（重构后的） */
    walkingAttackEffects() {
        if (this._isAttackPlaying) return; // 防重入
        this._isAttackPlaying = true;

        // 伤害逻辑（保留你的调用）
        DataManager.Instance.monsterConMananger.takeDamageMonster(this._monsters, true, this.node);

        const jack = this.getJackNode();
        if (!jack) {
            this._isAttackPlaying = false;
            return;
        }

        // 捕获当前武器类型，避免播放期间玩家切换武器导致回调误操作
        const weapon = DataManager.Instance.curWeaponType;

        if (weapon === PlayerWeaponTypeEnum.CottonSwab) {
            this.playAnimationNode(jack, "TX_walk_attack", "TX_Attack", () => {
                this._isAttackPlaying = false;
            });
        } else if (weapon === PlayerWeaponTypeEnum.Knife) {
            this.playAnimationNode(jack, "TX_walk_attack_SGD", "TX_Attack-001", () => {
                this._isAttackPlaying = false;
            });
        } else if (weapon === PlayerWeaponTypeEnum.Flamethrower) {
            // TODO: 实现喷火器的持续特效逻辑
            this._isAttackPlaying = false;
        } else {
            this._isAttackPlaying = false;
        }
    }

    /** 停顿攻击特效（重构后的） */
    pauseAttackEffect() {
        if (this._isAttackPlaying) return;
        this._isAttackPlaying = true;

        DataManager.Instance.monsterConMananger.takeDamageMonster(this._monsters, true, this.node);

        const jack = this.getJackNode();
        if (!jack) {
            this._isAttackPlaying = false;
            return;
        }

        const weapon = DataManager.Instance.curWeaponType;

        if (weapon === PlayerWeaponTypeEnum.CottonSwab) {
            this.playAnimationNode(jack, "TX_attack", "TX_Attack", () => {
                this._isAttackPlaying = false;
            });
        } else if (weapon === PlayerWeaponTypeEnum.Knife) {
            this.playAnimationNode(jack, "TX_attack_SGD", "TX_Attack-001", () => {
                this._isAttackPlaying = false;
            });
        } else if (weapon === PlayerWeaponTypeEnum.Flamethrower) {
            // TODO: 实现喷火器短促攻击特效
            this._isAttackPlaying = false;
        } else {
            this._isAttackPlaying = false;
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

    // 自动获取肉
    getMeat() {
        const meatList = DataManager.Instance.meatManager.getDrops();
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

        const allMeats: Node[] = [...meatList, ...this._uncollectedIcon];
        this._uncollectedIcon = [];

        let delayCounter = 0;

        for (let i = 0; i < allMeats.length; i++) {
            const icon = allMeats[i];
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

            // icon.setParent(this.node.parent);
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


                    DataManager.Instance.uiGameManager.meatCollectProperty();
                    SoundManager.inst.playAudio("roukuai_shiqu");
                })
                .start();

            delayCounter++;
        }
    }

    monsterHitEffect(monsters: Node[]) {
        for (let i = 0; i < monsters.length; i++) {
            const monster = monsters[i];
            if (!monster) continue;

            const itemMonsterManager = monster.getComponent(ItemMonsterManager);

            switch (DataManager.Instance.curWeaponType) {
                case PlayerWeaponTypeEnum.CottonSwab: {
                    const root = itemMonsterManager.mianqianguang.node; // 显隐根
                    const particles = itemMonsterManager.mianqianguang.node;   // 粒子容器
                    this._playFx(root, 1, particles);

                    this.playBloodEffect(itemMonsterManager);
                    // itemMonsterManager.bloodEffect.active = true;
                    break;
                }

                case PlayerWeaponTypeEnum.Knife: {
                    const root = itemMonsterManager.daoguang.node; // 显隐根
                    const particles = itemMonsterManager.daoguang.node;   // 粒子容器
                    this._playFx(root, 1, particles);

                    this.playBloodEffect(itemMonsterManager);
                    // this._playFx(hit, 1, hit);
                    break;
                }

                case PlayerWeaponTypeEnum.Flamethrower: {
                    const root = itemMonsterManager.huoyan.node; // 显隐根
                    const particles = itemMonsterManager.huoyan.node;   // 粒子容器
                    this._playFx(root, 1, particles);

                    this.playBloodEffect(itemMonsterManager);
                    // this._playFx(hit, 1, hit);
                    break;
                }
            }
        }
    }

    playBloodEffect(itemMonsterManager) {
        if (itemMonsterManager.bloodEffect && itemMonsterManager.huoyan.isValid) {
            itemMonsterManager.bloodEffect.node.active = true;
            itemMonsterManager.bloodEffect.stop();
            itemMonsterManager.bloodEffect.clear(); // 清除残留粒子
            itemMonsterManager.bloodEffect.play();
        }
    }

    // 在类里定义一次
    private _fxHideCbs: Map<Node, () => void> = new Map();
    private _playFx(root: Node, duration?: number, particlesParent?: Node) {
        if (!root || !root.isValid) return;

        // 如果之前已经排了关闭回调，先取消
        const prev = this._fxHideCbs.get(root);
        if (prev) {
            this.unschedule(prev);
            this._fxHideCbs.delete(root);
        }

        let realDuration = duration ?? 0;

        // 播放所有子粒子，并计算需要的总时长
        if (particlesParent && particlesParent.isValid) {
            for (const child of particlesParent.children) {
                const ps = child.getComponent(ParticleSystem);
                if (ps) {
                    ps.clear();
                    ps.play();

                    // 计算粒子完整生命周期时长
                    const life = (ps.startLifetime.constantMax ?? ps.startLifetime.constant) || 0;
                    const total = ps.duration + life;
                    if (total > realDuration) realDuration = total;
                }
            }
        }

        // 显示根节点
        root.active = true;

        // 定义关闭逻辑
        const hide = () => {
            if (particlesParent && particlesParent.isValid) {
                for (const child of particlesParent.children) {
                    const ps = child.getComponent(ParticleSystem);
                    if (ps) {
                        ps.stop();
                        ps.clear();
                    }
                }
            }
            if (root.isValid) root.active = false;
            this._fxHideCbs.delete(root);
        };

        // 记住并排定关闭
        this._fxHideCbs.set(root, hide);
        if (realDuration > 0) {
            this.scheduleOnce(hide, realDuration);
        }
    }

    // 重置角色
    public resetPlayer() {
        this._stopAllMeatAnimation();

        DataManager.Instance.curWeaponType = PlayerWeaponTypeEnum.CottonSwab;

        this._stopTweensDeep(this.node);

        // 位置朝向
        if (this._initPlayerPos) this.node.setWorldPosition(this._initPlayerPos);
        if (this._initPlayerRot) this.node.setWorldRotation(this._initPlayerRot);

        // 运动与输入复位
        if (this.actor) {
            this.actor.destForward.set(0, 0, 0);
        }

        // 归零虚拟摇杆
        try {
            (VirtualInput as any).horizontal = 0;
            (VirtualInput as any).vertical = 0;
        } catch {

        }

        this.hideAllAnimation();
        this._switchToIdleByWeapon();
        if (this.fireNode && this.fireNode.isValid) {
            this.fireNode.active = false;
        }

        this._monsters = [];
        this._uncollectedIcon = [];

        // 重置背包 
        const player = DataManager.Instance.player;
        if (!player) return;

        const backpacks = this._getBackpacks();

        for (let b = 0; b < backpacks.length; b++) {
            const backpack = backpacks[b];

            backpack.removeAllChildren();
        }

        DataManager.Instance.sceneManager.initBackpack();

        this.showAllBackpacks();
        this.actor.resetActor();
        this._rebuildInitialBackpackGold();
    }

    private _stopAllMeatAnimation() {
        const iconList = [
            ...DataManager.Instance.meatManager.getDrops(),
            ...this._uncollectedIcon
        ];
        for (const icon of iconList) {
            if (icon && icon.isValid) {
                Tween.stopAllByTarget(icon);
                Tween.stopAllByTarget(icon)
            }
        }
    }

    private _stopTweensDeep(node: Node) {
        if (!node?.isValid) return;
        Tween.stopAllByTarget(node);
        for (const child of node.children) {
            this._stopTweensDeep(child);
        }
    }

    private _switchToIdleByWeapon() {
        if (!this.actor) return;
        const wt = DataManager.Instance.curWeaponType;
        const idleKey = `Idle_${wt}`;
        const idleEnum = (StateDefine as any)[idleKey];
        if (idleEnum != null) {
            this.actor.changState(idleEnum);
        }

        const jackParent = this.node.getChildByName("JackParent");
        const parentAni = jackParent?.getComponent(Animation);
        if (parentAni) {
            const st = parentAni.getState("idleA");
            if (!st?.isPlaying) parentAni.play("idleA");
        }
    }

    private _recordInitialBackpackGold() {
        const backpacks = this._getBackpacks();
        for (let i = 0; i < backpacks.length; i++) {
            const bp = backpacks[i];
            if (!bp) { this._initBackpackGold[i] = 0; continue; }

            let cnt = 0;
            for (const child of bp.children) {
                if (!child?.isValid) continue;
                if (child.name === TypeItemEnum.GoldCoin) cnt++;
            }
            this._initBackpackGold[i] = cnt;
        }
    }

    // 初始化金币
    private _rebuildInitialBackpackGold() {
        const backpacks = this._getBackpacks();
        const STEP_Y = 0.5;

        for (let i = 0; i < backpacks.length; i++) {
            const bp = backpacks[i];
            if (!bp) continue;

            const need = this._initBackpackGold[i] | 0;
            if (need <= 0) continue;

            let baseY = 0;
            for (const child of bp.children) {
                if (!child?.isValid) continue;
                baseY = Math.max(baseY, child.getPosition().y);
            }

            for (let k = 0; k < need; k++) {
                const coin = SimplePoolManager.Instance.alloc(TypeItemEnum.GoldCoin) as Node;
                if (!coin) continue;

                coin.active = true;
                coin[`__isReady`] = true;
                coin.setParent(bp);
                coin.setPosition(0, baseY + k * STEP_Y, 0);
            }
        }
    }

    // 获取背包
    private _getBackpacks(): (Node | null)[] {
        const p = DataManager.Instance.player;
        if (!p) return [null, null, null];
        return [
            p.node.getChildByName("Backpack1"),
            p.node.getChildByName("Backpack2"),
            p.node.getChildByName("Backpack3"),
        ];
    }

    // 隐藏所有背包
    public hideAllBackpacks() {
        const backpacks = this._getBackpacks();

        for (let i = 0; i < backpacks.length; i++) {
            const backpack = backpacks[i];

            backpack.active = false;
        }
    }

    // 显示所有背包
    public showAllBackpacks() {
        const backpacks = this._getBackpacks();

        for (let i = 0; i < backpacks.length; i++) {
            const backpack = backpacks[i];

            backpack.active = true;
        }
    }
}


