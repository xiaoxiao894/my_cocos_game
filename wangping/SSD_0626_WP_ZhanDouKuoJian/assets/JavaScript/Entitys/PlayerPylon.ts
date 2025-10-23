import { _decorator, Component, Node, Tween, tween, Vec3, Animation, Quat, math, ParticleSystem } from 'cc';
import Entity from './Entity';
import { App } from '../App';
import { EnemyBear } from './EnemyBear';
import { GlobeVariable } from '../core/GlobeVariable';
import { SoundManager } from '../core/SoundManager';
const { ccclass, property } = _decorator;

@ccclass('PlayerPylon')
export class PlayerPylon extends Entity {
    @property(Node)
    electricNodePath: Node = null;

    lightNodePath: Node = null;

    @property
    attackRange: number = 20; // 攻击范围，可在编辑器中调整

    private enemyList: EnemyBear[] = []; // 敌人列表
    private attackTargetList: EnemyBear[] = []; // 攻击目标列表

    private attackType = 1; // 1 随机攻击 列表的敌人  2 攻击最近的

    // 最大血量 当前血量
    hp = 2;
    maxHp = 2;
    attack: number = 2;

    //攻击间隔
    private attackInterval: number = 1.0;
    private testInterval = 1.0;
    private electricInterval: number = 1.0;
    private electricTestInterval = 1.0;
    private _speed: number = 15;
    //塔发射子弹的位置
    private bulletPos: Node = null;

    //攻击的的位置 和目标
    private attackPos: Vec3 = null;
    private attackTarget: EnemyBear = null;

    private audioPlayNum: number = 0;


    onLoad() {
        this.bulletPos = this.node.parent.getChildByName("attackPos");
        this.lightNodePath = this.electricNodePath.parent.getChildByName("lightPath");

    }
    move() {

    }

    cretorElectric(callback: () => void) {
        if (this.electricNodePath == null) {
            return;
        }
        let prefab = App.poolManager.getNode(GlobeVariable.entifyName.bulletEffect);
        prefab.getChildByName("Sphere Light").active = false;
        prefab.getChildByName("Electricity-001").active = true;

        prefab.setPosition(this.electricNodePath.children[0].position.clone());


        prefab.parent = this.electricNodePath.parent;
        this.particle(prefab, callback);


    }
    cretorLight(callback: () => void) {
        if (this.electricNodePath == null) {
            return;
        }
        let prefab = App.poolManager.getNode(GlobeVariable.entifyName.bulletEffect);
        prefab.getChildByName("Sphere Light").active = true;
        prefab.getChildByName("Electricity-001").active = false;
        prefab.setPosition(this.lightNodePath.children[0].position.clone());

        prefab.parent = this.lightNodePath.parent;
        this.particle(prefab, callback);


    }
    particle(prefab, callback: () => void) {
        let seq = tween(prefab)

        for (let i = 1; i < this.electricNodePath.children.length; i++) {
            const from = this.electricNodePath.children[i - 1].worldPosition;
            const to = this.electricNodePath.children[i].worldPosition;
            const distance = Vec3.distance(from, to);
            const moveTime = distance / this._speed;

            const direction = new Vec3();
            Vec3.subtract(direction, to, from);
            direction.normalize();

            // const angleY = Math.atan2(direction.x, direction.z) * 180 / Math.PI;
            // console.log("============================>", angleY);
            seq = seq.then(
                tween(prefab)
                    .to(moveTime, { worldPosition: to }, { easing: 'linear' })
                    .call(() => {
                        // if(this.attackTarget.hp <= 0){
                        //     return;
                        // }
                        // 若需要旋转，设置欧拉角
                        // let snappedAngle = Math.round(angleY / 90) * 90;
                        // electricTower.setRotationFromEuler(new Vec3(0, snappedAngle, 0));

                        // electricTower.setRotationFromEuler(new Vec3(0, angleY, 0));
                    })
            );
        }
        seq = seq.call(() => {
            // if(this.attackTarget.hp <= 0){
            //     return;
            // }

            if (callback) {
                callback();
            }

            // App.poolManager.returnNode(prefab);
            if (prefab) prefab.removeFromParent();
            if (prefab) prefab.destroy();
        })
        seq.start();
    }
    AttackAni() {
        this.checkEnemy();
        let enemy;
        // 根据攻击类型获取目标敌人
        if (this.attackType === 1) {
            // 随机攻击
            const index = Math.floor(Math.random() * this.attackTargetList.length);
            enemy = this.attackTargetList[index];
        } else if (this.attackType === 2) {
            // 攻击最近的
            enemy = this.checkRange();
        }

        // 执行攻击逻辑（提取重复代码）
        if (enemy) {
            this.attackPos = enemy.attackNode.worldPosition.clone();
            this.attackTarget = enemy;

            // 播放攻击音效（限制次数）
            if (++this.audioPlayNum < 4) {
                SoundManager.inst.playAudio("YX_diantagongji");
            }

            // 目标已死亡则不继续攻击
            if (this.attackTarget.hp <= 0) return;

            // // 创建并发射子弹
            // const prefab = App.poolManager.getNode(GlobeVariable.entifyName.bulletEffect);
            // prefab.parent = this.bulletPos;

            // tween(prefab)
            //     .to(0.5, { worldPosition: this.attackPos })
            //     .call(() => {
            //         this.attackTarget.baseHit(this.attack);
            //         prefab.removeFromParent();
            //         App.poolManager.returnNode(prefab);
            //     })
            //     .start();


            // tween(prefab)
            //     .to(0.5, { worldPosition: this.attackPos })
            //     .call(() => {
            //         this.attackTarget.baseHit(this.attack);
            //         prefab.removeFromParent();
            //         App.poolManager.returnNode(prefab);
            //     })
            //     .start();
            // 创建并发射子弹
            const prefab = App.poolManager.getNode(GlobeVariable.entifyName.ElectricBullet);
            prefab.setPosition(this.bulletPos.position.clone());
            prefab.setRotation(this.bulletPos.rotation.clone())
            prefab.setScale(new Vec3(this.bulletPos.scale.x + 3, this.bulletPos.scale.y, this.bulletPos.scale.z + 3));
            prefab.parent = this.bulletPos.parent;
            // 计算起点到终点的距离（用于Y轴缩放）
            const startPos = this.bulletPos.worldPosition.clone();
            const endPos = this.attackPos;
            //     const distance = Vec3.distance(startPos, endPos);

            //     // 计算电流线应该朝向终点的旋转
            //     const direction = endPos.clone().subtract(startPos).normalize();


            //     // // 创建目标点（当前位置 + 方向向量）
            //     const targetPos = startPos.clone().add(direction);
            //     // 让prefab看向目标点（up参数可选，默认为Y轴向上）
            //     prefab.lookAt(targetPos, new Vec3(1, 0.3, 0));

            //     // 使用tween动画实现电流线从起点拉伸到终点的效果
            //     tween(prefab)
            //         .to(0.5, {
            //             // Y轴缩放值与距离成正比，实现从起点到终点的拉伸效果
            //             scale: new Vec3(this.bulletPos.scale.x, distance/2, this.bulletPos.scale.z)
            //         })
            //         .call(() => {
            //             // 到达终点后触发攻击效果
            //             this.attackTarget.baseHit(this.attack);
            //             // 移除并归还到对象池
            //             prefab.removeFromParent();
            //             App.poolManager.returnNode(prefab);
            //         })
            //         .start();
            // }
            const start = startPos;
            const end = endPos;

            // 方向与长度
            const dir = new Vec3();
            Vec3.subtract(dir, end, start);
            const len = dir.length();

            if (len > 1e-5) {
                const dirN = dir.clone().normalize();

                const look = new Quat();
                Quat.fromViewUp(look, dirN, Vec3.UP);

                const rotX90 = new Quat();
                Quat.fromAxisAngle(rotX90, Vec3.RIGHT, math.toRadian(90));

                const final = new Quat();
                Quat.multiply(final, look, rotX90);
                prefab.setWorldRotation(final);
            }

            // 模型原始高度
            const modelBaseLen = 1;

            const k = len / Math.max(1e-6, modelBaseLen);

            const s = prefab.scale;
            prefab.setScale(s.x, k / 3, s.z);

            const ps = prefab.getComponent(ParticleSystem);
            if (!ps) return;

            enemy.node.getChildByName("TX_jizhong").active = true;

            // 重置粒子系统
            this.scheduleOnce(() => {
    
                this.attackTarget.baseHit(this.attack,start);
     
            }, 0.1)
            this.scheduleOnce(() => {
                ps.stop();
                ps.clear();
                enemy.node.getChildByName("TX_jizhong").active = false;
                // 移除并归还到对象池
                prefab.removeFromParent();
                App.poolManager.returnNode(prefab);
            }, 0.4)


            // // 设置初始颜色
            // const startColor = ps.startColor.color.clone();
            // startColor.a = 255;
            // ps.startColor.color = startColor;

            // // 重新开始发射
            // ps.play();

            // DataManager.Instance.monsterManager.killMonsters([monster]);

            // // 用一个代理值做渐隐
            // const val = { a: 255 };
            // tween(val)
            //     .to(0.3, { a: 0 }, {
            //         onUpdate: () => {
            //             ps.startColor.color = new Color(startColor.r, startColor.g, startColor.b, val.a);
            //         },
            //         onComplete: () => {

            //             // 如果需要完全结束粒子
            //             ps.stop();
            //         }
            //     })
            //     .start();
        }

    }

    creatorElectric() {

        // this.checkEnemy();
        // if (this.attackType == 1) {
        //     // 随机攻击
        //     if (this.attackTargetList.length <= 0) {
        //         return;
        //     }
        // } else if (this.attackType == 2) {

        //     // 攻击最近的
        //     let enemy = this.checkRange();
        //     if (enemy.hp <= 0) {
        //         return;
        //     }

        // }
        // if (this.electricNodePath == null) {
        //     this.node.getComponent(Animation).play("attackDT")

        // } else {
        this.scheduleOnce(() => {
            this.cretorLight(() => {
            })
        }, 0.1)

        this.cretorElectric(() => {
            // this.node.getComponent(Animation).play("attackDT")
        })
        // }

    }
    // electricSelect() {
    //     if (this.attackType == 1) {
    //         // 随机攻击
    //         let index = Math.floor(Math.random() * this.attackTargetList.length);
    //         let enemy = this.attackTargetList[index];
    //         if (enemy.hp <= 0) {
    //             return;
    //         }
    //         if (enemy) {
    //             this.creatorElectric()
    //         }
    //     } else if (this.attackType == 2) {

    //         // 攻击最近的
    //         let enemy = this.checkRange();
    //         if (enemy.hp <= 0) {
    //             return;
    //         }
    //         if (enemy) {

    //             this.creatorElectric()
    //         }
    //     }
    // }
    attack1() {
        this.checkEnemy();

        // 是否有符合攻击的敌人
        if (this.attackTargetList.length <= 0) {
            return;
        }

        this.node.getComponent(Animation).play("attackDT")
    }

    die(callback?: (...agrs: unknown[]) => void): void {

    }

    update(deltaTime: number) {
        this.testInterval += deltaTime;
        if (this.testInterval > this.attackInterval) {
            this.testInterval -= this.attackInterval;
            this.attack1();

            // this.checkEnemy();
            //this.creatorElectric();

            // this.electricSelect();
        }
        //电流播放间隔
        this.electricTestInterval += deltaTime;
        if (this.electricTestInterval > this.electricInterval) {
            this.electricTestInterval -= this.electricInterval;
            this.creatorElectric();
        }
    }

    /** 查找可攻击的敌人 */
    checkEnemy() {
        this.attackTargetList = []; // 先清空攻击目标列表
        this.enemyList = App.enemyController.getEnemyList();

        // // 遍历敌人列表
        for (let i = 0; i < this.enemyList.length; i++) {
            let enemy = this.enemyList[i];
            // 确保敌人存在且存活
            if (!enemy || enemy.hp <= 0) {
                continue;
            } else {
                // 判断敌人是否在攻击范围内
                let enemyPos = enemy.node.worldPosition.clone();
                let pylonPos = this.node.worldPosition.clone();
                let distance = enemyPos.subtract(pylonPos).length();
                if (distance < this.attackRange) {
                    this.attackTargetList.push(enemy);
                }
            }
        }
    }
    // 检查最近的敌人
    checkRange() {
        // 找到最近的敌人
        let minDis = Number.MAX_VALUE;
        let minEnemy: EnemyBear = null;
        for (let i = 0; i < this.attackTargetList.length; i++) {
            let enemy = this.attackTargetList[i];
            let enemyPos = enemy.node.worldPosition.clone();
            let pylonPos = this.node.worldPosition.clone();
            let distance = enemyPos.subtract(pylonPos).length();
            if (distance < minDis) {
                minDis = distance;
                minEnemy = enemy;
            }
        }
        return minEnemy;
    }
    /**
     * 判断目标是否在攻击范围内
     * @param target 目标节点
     * @returns 是否在范围内
     */
    isInAttackRange(target: Node): boolean {
        const distance = target.worldPosition.subtract(this.node.worldPosition).length();
        return distance < this.attackRange;
    }
}