import { _decorator, Node, Vec3, SkeletalAnimation, ITriggerEvent, Collider, Animation, ProgressBar, Slider, UIOpacity } from 'cc';
import Entity from './Entity';
import { App } from '../App';
import { EnemySpider } from './EnemySpider';
import { SoundManager } from '../core/SoundManager';
const { ccclass, property } = _decorator;

@ccclass('PlayerAttackFlower')
export class PlayerAttackFlower extends Entity {
    // @property
    attackRange: number = 60; // 攻击范围，可在编辑器中调整
    @property({ type: SkeletalAnimation })
    characterAnima: SkeletalAnimation = null; // 骨骼动画组件

    @property({ type: Collider })
    collider: Collider = null; // 碰撞组件

    @property({ type: Node })
    followNode: Node = null; // 跟随节点

    @property({ type: Node, tooltip: "消化状态进度条" })
    digestUINode: Node = null;

    @property({ type: Node, tooltip: "蜘蛛" })
    spaider: Node = null;

    private iseatSpiderMove: boolean = false;

    private spiderInitPos: Vec3 = new Vec3()
    private spiderInitScale: Vec3 = new Vec3()
    private isEat: boolean = false;//是否实在咀嚼状态

    private state: number = 0; //  1 攻击中 2 咀嚼中 3 吞咽

    private attackTargetList: EnemySpider[] = []; // 攻击目标列表
    frameIndex: number = 0;
    isIncreasing = false;
    addFrame = 10;
    private tuanyanAudio:boolean = false
    // 血量属性
    hp = 2;
    maxHp = 2;
    attack: number = 1;
    // 攻击间隔
    @property({ tooltip: "攻击间隔" })
    private attackInterval: number = 6;

    @property({ tooltip: "攻击间隔" })
    private testInterval = 6;
    showDigestUI() {
        this.digestUINode.active = true;
        this.digestUINode.getChildByName("shanguang01").active = false;
        this.digestUINode.getChildByName("xiaohua_shanguang").active = false;
    }
    continueGame() {
        this.digestUINode.active = false;
    }


    digestProgress() {
        let digestProgress = 1 - this.testInterval / this.attackInterval;
        if (this.iseatSpiderMove) {
            let z = this.spaider.position.z
            let x = this.spaider.position.x
            this.spaider.setPosition(x -= 0.003, this.spaider.position.y, z += 0.0015)
        }
        if (digestProgress <= 0) {
            // 获取当前缩放
            let currentScale = this.spaider.scale;
            // 计算新缩放值（向目标缩放靠近）
            let newScaleX = currentScale.x -0.002;
            let newScaleY = currentScale.y - 0.002;
            let newScaleZ = currentScale.z -0.002;
            // 设置新缩放
            this.spaider.setScale(newScaleX, newScaleY, newScaleZ);



            digestProgress = -0.1;
            this.digestUINode.getChildByName("shanguang01").active = true;
            this.digestUINode.getChildByName("xiaohua_shanguang").active = true;

            // 首先在类中添加一个状态变量，用于标记当前是否在增加透明度
            // this.isIncreasing = false;  // 可以在初始化时设置

            // 修改透明度更新逻辑
            if (this.isIncreasing) {
                // 处于增加状态，逐渐增加到255
                this.frameIndex += this.addFrame;
                // 当达到255时，切换回减少状态
                if (this.frameIndex >= 255) {
                    this.frameIndex = 255;
                    this.isIncreasing = false;
                }
            } else {
                // 处于减少状态，逐渐减少到0
                this.frameIndex -= this.addFrame;
                // 当减到0时，切换到增加状态
                if (this.frameIndex <= 0) {
                    this.frameIndex = 0;
                    this.isIncreasing = true;
                }
            }
            this.scheduleOnce(()=>{
                if (!this.tuanyanAudio) {
                    this.tuanyanAudio = true
                    SoundManager.Instance.playAudio("tunyan");
                }
            },0.3)

            // 应用透明度
            this.digestUINode.getChildByName("shanguang01").getComponent(UIOpacity).opacity = this.frameIndex;
            this.digestUINode.getChildByName("xiaohua_shanguang").getComponent(UIOpacity).opacity = this.frameIndex;

            if (this.characterAnima.getState("Attack-end").isPlaying) return;
            this.characterAnima.play("Attack-end");
            this.state = 3;
            this.characterAnima.once(Animation.EventType.FINISHED, () => {
                // this.testInterval = 0;
                this.isEat = false;
                this.testInterval = 6;
                this.state = 0;
                // 重置蜘蛛位置和缩放
                this.spaider.active = false;
                this.spaider.setPosition(this.spiderInitPos);
                this.spaider.setScale(this.spiderInitScale);
                this.iseatSpiderMove = false;
                this.tuanyanAudio = false;

                // this.digestUINode.getChildByName("shanguang01").active = false;

            })
        } else {
            this.digestUINode.getChildByName("Green").getComponent(ProgressBar).progress = digestProgress;
            this.digestUINode.getChildByName("Slider").getComponent(Slider).progress = digestProgress;
        }
    }
    onLoad() {
        this.digestUINode.active = false;
    }
    start() {
        if (!this.characterAnima.getState("Idle").isPlaying)
            this.characterAnima.play("Idle");
        if (!this.collider) {
            console.warn('没有找到碰撞矩阵');
            return;
        }
        if (!this.collider) return;
        this.spiderInitPos = this.spaider.position.clone();
        this.spiderInitScale = this.spaider.scale.clone();
        this.collider.on('onTriggerEnter', this.onTriggerEnter, this);
        this.collider.on('onTriggerStay', this.onTriggerStay, this);
        this.collider.on('onTriggerExit', this.onTriggerExit, this);

    }
    onTriggerEnter(event: ITriggerEvent) {
        if (this.state == 2 || this.state == 3) return;
        const selfnode = event.otherCollider.node;
        //selfnode.getComponent(EnemySpider).node.active = false;
        selfnode.getComponent(EnemySpider).attackFlowerDie(this.followNode);
        console.log("onTriggerExit nodeName == ", selfnode.name);
    }
    onTriggerExit(event: ITriggerEvent) {
        console.log("onTriggerExit")

    }
    onTriggerStay(event: ITriggerEvent) {

    }

    attackList() { // 可攻击的怪物
        // 获取当前节点的世界位置
        const selfPos = this.node.worldPosition;

        // 存储在120度范围内的敌人
        const enemiesInSector: EnemySpider[] = [];

        // 遍历攻击目标列表
        for (const enemy of this.attackTargetList) {
            if (!enemy || !enemy.node) continue;

            // 计算敌人相对于当前节点的方向向量
            const direction = new Vec3();
            Vec3.subtract(direction, enemy.node.worldPosition, selfPos);

            // 计算方向向量与前方（假设为Z轴正方向）的夹角
            // 注：根据游戏坐标系实际情况可能需要调整参考轴
            const angle = Math.atan2(direction.x, direction.z) * 180 / Math.PI;

            // 取绝对值，判断是否在120度范围内（-60度到+60度之间）
            if (Math.abs(angle) <= 60) {
                enemiesInSector.push(enemy);
            }
        }

        // 返回在120度范围内的敌人列表
        return enemiesInSector;
    }
    move() {
        // 塔防无需移动逻辑
    }
    // AttackAni() {
    //     // 检查敌人列表（更新范围内敌人）
    //     this.checkEnemy();
    //     let list = this.attackList();
    //     list.forEach((enemy) => {
    //         enemy.getComponent(EnemySpider).node.active = false;
    //         enemy.getComponent(EnemySpider).attackFlowerDie();
    //     })
    // }

    attack1() {
        // 1. 先更新敌人列表
        // this.checkEnemy();
        SoundManager.Instance.playAudio("eat");
        this.digestUINode.getChildByName("shanguang01").active = false;
        this.digestUINode.getChildByName("xiaohua_shanguang").active = false;
        this.characterAnima.play("Attack-start2");
        this.state = 1
        this.scheduleOnce(() => {
            if (this.spaider) {
                this.spaider.active = true;
                if (!this.iseatSpiderMove) {
                    this.iseatSpiderMove = true;
                }
            }
        }, 0.5)

        this.characterAnima.once(Animation.EventType.FINISHED, () => {
            this.isEat = true;
            if (!this.digestUINode.active) {
                this.showDigestUI();
            }

            this.characterAnima.play("Attack-loop");
            this.state = 2;
            this.testInterval = 0;
        })

    }

    die(callback?: (...agrs: unknown[]) => void): void {
        // 死亡逻辑可在此实现
    }
    update(deltaTime: number) {
        if (!this.isEat) {
            this.testInterval += deltaTime;
            if (this.testInterval > this.attackInterval) {
                this.testInterval = 0;
                this.checkEnemy();
                let attackList = this.attackList();
                if (attackList.length > 0) {
                    this.attack1();
                } else {
                    this.testInterval = 6;
                    if (!this.characterAnima.getState("Idle").isPlaying)
                        this.characterAnima.play("Idle");
                    this.digestUINode.getChildByName("shanguang01").active = true;
                    this.digestUINode.getChildByName("xiaohua_shanguang").active = true;

                    if (this.isIncreasing) {
                        // 处于增加状态，逐渐增加到255
                        this.frameIndex += this.addFrame;
                        // 当达到255时，切换回减少状态
                        if (this.frameIndex >= 255) {
                            this.frameIndex = 255;
                            this.isIncreasing = false;
                        }
                    } else {
                        // 处于减少状态，逐渐减少到0
                        this.frameIndex -= this.addFrame;
                        // 当减到0时，切换到增加状态
                        if (this.frameIndex <= 0) {
                            this.frameIndex = 0;
                            this.isIncreasing = true;
                        }
                    }

                    // 应用透明度
                    this.digestUINode.getChildByName("shanguang01").getComponent(UIOpacity).opacity = this.frameIndex;
                    this.digestUINode.getChildByName("xiaohua_shanguang").getComponent(UIOpacity).opacity = this.frameIndex;
                }
            }
        } else {
            this.testInterval += deltaTime;
            this.digestProgress()
            // if (this.testInterval > this.attackInterval) {
            //     this.testInterval = 0;
            //     this.characterAnima.play("Attack-end");
            //     this.characterAnima.once(Animation.EventType.FINISHED, () => {
            //         this.isEat = false;
            //         this.testInterval = 6;

            //     })
            // }
        }

    }

    /** 查找可攻击的敌人（更新攻击目标列表） */
    checkEnemy() {
        this.attackTargetList = []; // 清空列表
        const rvoEnemyList = App.enemyController.getEnemyRvoList();
        const enemyList = App.enemyController.getEnemyList();

        // 先检查RVO敌人列表
        for (let i = 0; i < rvoEnemyList.length; i++) {
            const enemy = rvoEnemyList[i];
            if (!this.isValidEnemy(enemy)) continue;

            if (this.isInAttackRange(enemy.node)) {
                this.attackTargetList.push(enemy);
            }
        }

        // RVO列表无目标时检查普通敌人列表
        //    if (this.attackTargetList.length === 0) {
        for (let i = 0; i < enemyList.length; i++) {
            const enemy = enemyList[i];
            if (!this.isValidEnemy(enemy)) continue;

            if (this.isInAttackRange(enemy.node)) {
                this.attackTargetList.push(enemy);
            }
        }
        //  }
    }

    /** 辅助判断：敌人是否有效（存活） */
    private isValidEnemy(enemy: EnemySpider): boolean {
        // 增加对isAttack和node.isValid的检查
        return enemy && enemy.node && enemy.node.isValid && enemy.hp > 0 && enemy.recordHp > 0 && enemy.isAttack;
    }

    /** 辅助判断：目标是否在攻击范围内 */
    private isInAttackRange(target: Node): boolean {
        if (!target) {
            return false;
        }
        return Vec3.distance(target.worldPosition, this.node.worldPosition) < this.attackRange;
    }


}