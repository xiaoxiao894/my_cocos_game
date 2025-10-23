import { _decorator, Animation, AudioSource, Component, director, find, instantiate, Node, Pool, Prefab, Quat, tween, Vec3 } from 'cc';
import { DataManager } from '../Global/DataManager';
import { Bullet } from './Bullet';
import { EachPartnerManager } from './EachPartnerManager';
import { PartnerAttackEnum } from './StateDefine';
import { ItemAreaManager } from '../Area/ItemAreaManager';
const { ccclass, property } = _decorator;

@ccclass('PartnerManager')
export class PartnerManager extends Component {
    @property(Prefab)
    projectile: Prefab | null = null;

    // 大技能
    @property(Prefab)
    bigSkill: Prefab | null = null;

    @property(Prefab)
    hitPrefab: Prefab | null = null;

    prefabPool: Pool<Node> | null = null;
    bigSkillsPrefabPool: Pool<Node> | null = null;
    hitPrefabPool: Pool<Node> | null = null;

    public isSkillAllPlaying = false
    // 攻击动画名字
    public attackName = null;
    public direction = "L"

    // 最近的怪
    private nearestMonster = null;
    // 是否普通攻击
    private isNormalAttacking = true;

    private monsterParent = null;
    init() {
        // 获取所有怪
        this.monsterParent = DataManager.Instance.monsterManager.monsterParent;

        const poolCount = 5;
        const bigSkillsPrefabPoolCount = 100;

        // 普通攻击
        this.prefabPool = new Pool(() => {
            return instantiate(this.projectile!)
        }, poolCount, (node: Node) => {
            node.removeFromParent();
        })

        // 大技能
        this.bigSkillsPrefabPool = new Pool(() => {
            return instantiate(this.bigSkill!);
        }, bigSkillsPrefabPoolCount, (node: Node) => {
            node.removeFromParent();
        })

        // 攻击特效
        this.hitPrefabPool = new Pool(() => {
            return instantiate(this.hitPrefab!)
        }, poolCount, (node: Node) => {
            node.removeFromParent();
        })
    }

    onDestroy() {
        this.prefabPool.destroy();
    }

    create(prefabPool) {
        let node = prefabPool.alloc();
        if (node.parent == null) {
            director.getScene().addChild(node);
        }
        node.active = true;
        return node;
    }

    onProjectileDead(prefabPool, node) {
        node.active = false;
        prefabPool.free(node);
    }

    // 类的属性中增加：
    private isTargetLocked = false; // 用于锁定目标
    private _isIdlePlaying: boolean = false;
    private _idleAnimFinishedHandler: () => void = null;

    // update(dt: number) {
    //     if (this.isSkillAllPlaying) return;

    //     const monsters = DataManager.Instance.searchMonsters.getAttackTargets(this.node, 20, 360);
    //     const partnerWorldPos = this.node.worldPosition;

    //     // 仅在目标没有锁定时，更新目标 
    //     if (!this.isTargetLocked) {
    //         this.nearestMonster = this.getNearestMonster(monsters, partnerWorldPos);
    //     }

    //     if (this.nearestMonster && this.isNormalAttacking) {
    //         this.isNormalAttacking = false;

    //         const aniName = this.node.name.slice(0, -1);
    //         const isRight = this.isTargetOnRight(this.node, this.nearestMonster);
    //         const clipName = isRight ? `${aniName}L` : `${aniName}R`;
    //         if (isRight) {
    //             this.direction = "L";
    //         } else {
    //             this.direction = "R";
    //         }

    //         this.playPartnerAnim(clipName);

    //         // 攻击中，解除 idle 播放状态
    //         this.isTargetLocked = true;
    //         this._isIdlePlaying = false;

    //         this.scheduleOnce(() => {
    //             this.isNormalAttacking = true;
    //             this.isTargetLocked = false;
    //         }, 3);
    //     } else {
    //         const partnerParent = this.node.getChildByName("PartnerParent");
    //         if (partnerParent) {
    //             const ani = partnerParent.getComponent(Animation);
    //             if (ani && !this._isIdlePlaying) {
    //                 ani.play("idleB");
    //                 this._isIdlePlaying = true;

    //                 // 移除旧的监听器，避免叠加
    //                 if (this._idleAnimFinishedHandler) {
    //                     ani.off(Animation.EventType.FINISHED, this._idleAnimFinishedHandler);
    //                 }

    //                 // 注册新的监听器
    //                 this._idleAnimFinishedHandler = () => {
    //                     this._isIdlePlaying = false;
    //                 };
    //                 ani.on(Animation.EventType.FINISHED, this._idleAnimFinishedHandler);
    //             }
    //         }
    //     }
    // }

    fireAtTarget() {
        if (!this.nearestMonster) return;

        const bullet = this.create(this.prefabPool);
        if (!bullet) return;

        const selfPos = this.node.worldPosition;
        const monsterPos = this.nearestMonster.worldPosition;

        if (!monsterPos) return;

        //  计算角色 → 怪物的方向
        const direction = monsterPos.clone().subtract(selfPos).normalize();

        //  中点位置
        const midPoint = selfPos.clone().add(monsterPos).multiplyScalar(0.5);

        //  偏移位置（从中点向角色方向偏移）
        const maxOffset = Vec3.distance(selfPos, monsterPos) / 2;
        const radius = Math.min(3, maxOffset); // 向角色方向偏移
        const spawnPos = midPoint.clone().subtract(direction.clone().multiplyScalar(radius));
        spawnPos.y += 7; // 稍微抬高一点

        bullet.setWorldPosition(spawnPos);

        //  使用 lookAt 先设置 bullet 朝向（默认是 Z- 轴指向目标）
        bullet.lookAt(monsterPos, Vec3.UP);

        //  如果模型的“头朝向”为 X+，则绕 Y 轴加 90° 补偿
        const fixQuat = new Quat();
        Quat.fromAxisAngle(fixQuat, Vec3.UP, 90 * Math.PI / 180);

        const currentQuat = bullet.getRotation();
        const finalQuat = new Quat();
        Quat.multiply(finalQuat, currentQuat, fixQuat); // 原始朝向 * 补偿旋转
        bullet.setRotation(finalQuat);

        //  设置子弹参数
        const bulletComp = bullet.getComponent(Bullet);
        if (bulletComp) {
            bulletComp.explosiveSpecialEffects = this.explosiveSpecialEffects.bind(this);
            bulletComp.target = this.nearestMonster;
            bulletComp.speed = 40;
            bulletComp.PartnerManager = this;
        }
    }

    playPartnerAnim(name: string) {
        const anim = this.node.getComponent(Animation);
        const state = anim?.getState(name);
        if (state) {
            state.stop();  // 防止播放失败
            anim.play(name);
        } else {
            console.warn(`❌ 动画 ${name} 未找到`);
        }
    }

    // 目标是怪物或世界坐标
    explosiveSpecialEffects(target: Node | Vec3, name: string) {
        const worldPos = target instanceof Node ? target.worldPosition : target;

        //  生成爆炸特效
        const skillExplosion = this.create(this.hitPrefabPool);
        if (!skillExplosion) return;

        skillExplosion.setWorldPosition(new Vec3(worldPos.x, worldPos.y + 2, worldPos.z));

        // 
        const anim = skillExplosion?.children[0]?.getComponent(Animation);
        if (anim) {
            anim.play(`${name}_hit`);
            anim.once(Animation.EventType.FINISHED, () => {
                this.onProjectileDead(this.hitPrefabPool, skillExplosion);
            });
        } else {
            // 没动画时，延迟回收
            this.scheduleOnce(() => {
                this.onProjectileDead(this.hitPrefabPool, skillExplosion);
            }, 1);
        }

        // 查找爆炸范围内的怪物（半径 5）
        const radius = 5;
        const monsterParent = DataManager.Instance.monsterManager.monsterParent;
        const hitMonsters: Node[] = [];

        for (const monster of monsterParent.children) {
            const distSqr = Vec3.squaredDistance(monster.worldPosition, worldPos);
            if (distSqr <= radius * radius) {
                hitMonsters.push(monster);
            }
        }

        // 对命中的怪执行处理
        if (hitMonsters.length > 0) {
            DataManager.Instance.monsterManager.killMonsters(hitMonsters);
        }
    }

    // 获取离伙伴最近的怪物
    getNearestMonster(monsters, partnerPos: Vec3) {
        let nearest: Node | null = null;
        let minDistance = Infinity;

        for (let monster of monsters) {
            if (!monster || !monster.isValid) continue;

            const monsterPos = monster.worldPosition;
            const distance = Vec3.distance(monsterPos, partnerPos);

            if (distance < minDistance) {
                minDistance = distance;
                nearest = monster;
            }
        }

        return nearest;
    }

    // 判断是在人物的左边还是右边
    isTargetOnRight(self: Node, target: Node): boolean {
        const selfPos = self.worldPosition;
        const targetPos = target.worldPosition;

        // 角色的 forward 方向（Z轴向前）
        const forward = self.forward.clone().normalize();

        // 朝目标方向的向量
        const toTarget = targetPos.clone().subtract(selfPos).normalize();

        // 角色右方向 = forward × up
        const right = new Vec3();
        Vec3.cross(right, forward, Vec3.UP); // 使用世界Y轴为 up

        // 点积判断左右（> 0 在右侧 < 0 在左侧）
        return Vec3.dot(right, toTarget) > 0;
    }

    // // 技能生成的随机偏移范围（米）
    // private radiusRandomOffset = 3;

    // // 技能释放的整体朝向角度（绕Y轴，单位：度）
    // private directionAngleDeg = 0;

    // // 技能影响的半径，仅用于检测怪物，XZ平面（单位：米）
    // private skillDetectRadius = 4;

    // const initialRadius = 5;       // 第一圈技能的半径
    // const ringStep = 5;            // 每一圈向外扩展的间隔
    // const ringCount = 5;           // 总共生成多少圈
    // const delayPerRing = 0.3;      // 每一圈的延迟时间
    // const spreadAngle = 130;       // 技能扇形覆盖角度

    /**
     * 主技能释放函数，按照环形和扇形分布在角色前方生成技能节点
     */
    releaseMajorSkills() {
        const itemAreaManager = this.node.parent.getComponent(ItemAreaManager)
        const center = this.node.worldPosition.clone();  // 技能中心点为当前角色位置

        const directionAngleDeg = itemAreaManager.directionAngleDeg ?? 0;
        const directionAngleRad = directionAngleDeg * Math.PI / 180;

        // 朝向向量（forward），单位向量，决定技能释放的主方向（默认Z正方向）
        const forward = new Vec3(
            Math.sin(directionAngleRad),
            0,
            Math.cos(directionAngleRad)
        ).normalize();


        // 外层循环：每一圈技能生成逻辑
        for (let ring = 0; ring < itemAreaManager.ringCount; ring++) {
            const baseRadius = itemAreaManager.initialRadius + ring * itemAreaManager.ringStep;
            const delay = ring * itemAreaManager.delayPerRing;

            const candidateCount = 6 + ring;  // 每圈技能候选点数量（越外层越多）
            const selectCount = 2 + ring;     // 实际从候选中选出用于释放技能的位置

            // 创建索引数组并进行洗牌（随机打乱顺序）
            const indices = Array.from({ length: candidateCount }, (_, i) => i);
            for (let i = indices.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [indices[i], indices[j]] = [indices[j], indices[i]];
            }

            // === 播放该层技能音效 ===
            if (ring < 2) {
                DataManager.Instance.soundManager.playRingSoundDynamically(this.node.name, delay);
            }

            // 内层循环：生成实际技能节点
            for (let i = 0; i < selectCount && i < candidateCount; i++) {
                const idx = indices[i];

                // 当前角度在扇形中的位置
                const angleStep = itemAreaManager.spreadAngle / (candidateCount - 1);
                const angleDeg = -itemAreaManager.spreadAngle / 2 + angleStep * idx;
                const angleRad = angleDeg * Math.PI / 180;

                // 将角度旋转后的方向向量
                const dir = new Vec3(
                    Math.sin(directionAngleRad + angleRad),
                    0,
                    Math.cos(directionAngleRad + angleRad)
                ).normalize();

                // 生成点的基础位置
                const basePos = center.clone().add(dir.multiplyScalar(baseRadius));

                // 加上一个位置扰动偏移（模拟不规则性）
                const randomOffset = new Vec3(
                    (Math.random() - 0.5) * 2 * itemAreaManager.radiusRandomOffset,
                    0,
                    (Math.random() - 0.5) * 2 * itemAreaManager.radiusRandomOffset
                );

                const spawnPos = basePos.add(randomOffset); // 最终生成位置
                const angleY = directionAngleDeg + angleDeg; // 旋转角度（暂未使用）

                // 延迟执行技能生成
                ((spawnPos: Vec3, angleY: number, delay: number) => {
                    setTimeout(() => {
                        const skillNode = this.create(this.bigSkillsPrefabPool);
                        if (!skillNode) return;

                        // 重置技能节点状态
                        this.resetSkillNode(skillNode, spawnPos, angleY);

                        // 检测命中的怪物并清除
                        for (let i = 0; i < 2; i++) {
                            const monsters = this.getEnemiesInRange(spawnPos);
                            DataManager.Instance.monsterManager.killMonsters(monsters);
                        }

                        // 延迟回收技能节点（你可以启用缩放动画）
                        tween(skillNode)
                            .delay(1.0)
                            // .to(0.3, { scale: new Vec3(0, 0, 0) }, { easing: 'quadIn' })
                            .call(() => {
                                this.onProjectileDead(this.bigSkillsPrefabPool, skillNode);
                            })
                            .start();
                    }, delay * 1000);
                })(spawnPos, angleY, delay);
            }
        }
    }

    /**
     * 重置技能节点的状态，用于对象池复用
     */
    private resetSkillNode(node: Node, position: Vec3, angleY: number) {
        node.setWorldPosition(position);
        // node.setScale(Vec3.ONE); // 如果你开启缩放动画，取消注释
        node.active = true;

        const skill = node.getChildByName("Skill");
        if (skill) {
            // skill.setScale(Vec3.ONE);
            skill.active = true;

            const skillAni = skill.getComponent(Animation);
            const clipName = `TX_Skill_${this.node.name}`; // 动画名称格式根据角色名而定
            if (skillAni) {
                skillAni.stop(); // 保证动画重放
                skillAni.play(clipName);
            }
        }
    }

    /**
     * 获取技能范围内的敌人，仅检测XZ平面距离
     */
    getEnemiesInRange(center: Vec3): Node[] {
        const itemAreaManager = this.node.parent.getComponent(ItemAreaManager)
        const radius = itemAreaManager.skillDetectRadius;
        const radiusSqr = radius * radius;
        const enemies: Node[] = [];

        for (const enemy of this.monsterParent.children) {
            const pos = enemy.worldPosition;
            const dx = pos.x - center.x;
            const dz = pos.z - center.z;
            const distSqr = dx * dx + dz * dz;

            if (distSqr <= radiusSqr) {
                enemies.push(enemy);
            }
        }

        return enemies;
    }
}


