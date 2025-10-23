import { _decorator, Component, Node, Prefab, Vec3, Animation, tween } from 'cc';
import { poolManager } from './PoolManager';
import { eventMgr } from '../EventManager';
import { EventType } from '../EventType';
import { EnemyBase } from './EnemyBase';
import { CloudEffct } from '../CloudEffct';
import { coinEffect } from '../coinEffect';
import { DataManager } from '../../Global/DataManager';
import { PalingAnimation } from '../PalingAnimation';
import { CloudParticleEffect } from '../CloudParticleEffect';
const { ccclass, property } = _decorator;

@ccclass('MapBeast')
export class MapBeast extends Component {
    @property(Prefab)
    bearPrefab: Prefab | null = null; // 熊预制体

    @property(Node)
    palingNode: Node = null;

    @property(Prefab)
    dogPrefab: Prefab | null = null; // 狗预制体

    @property(Prefab)
    elephantPrefab: Prefab | null = null; // 大象预制体

    @property(Node)
    beastContainer: Node | null = null; // 动物容器

    @property(Node)
    electricPalingParent: Node = null;

    // @property(Node)
    // palingPanrent: Node = null;
    // @property(Node)
    // protected cloudNode: Node = null;
    protected siblings: Node[] = null;

    @property(Node)
    mapCoinNode: Node = null;

    private mapCoinNum: number = 300;

    @property(Node)
    beastBack: Node = null;

    @property(Node)
    beastBackPaticle: Node = null;

    @property(CloudParticleEffect)
    cloudParticleOuter: CloudParticleEffect = null;

    @property(CloudParticleEffect)
    cloudParticleCentrality: CloudParticleEffect = null;


    private isStart: boolean = false;

    // cloudFadeEffct(isFade: boolean) {
    //     this.siblings = this.cloudNode.children;
    //     if (this.siblings.length === 0) {
    //         console.warn("当前云节点没有子节点");
    //         return;
    //     }
    //     // 遍历并处理同级节点
    //     this.siblings.forEach((sibling, index) => {
    //         sibling.getComponent(CloudEffct).startEffect(isFade);
    //     });
    // }
    //初始化事件
    onInitEvent() {
        //云的的事件监听
        eventMgr.once(EventType.MapBeast_start, this.beastStartCallBack, this);
        eventMgr.on(EventType.MapBeast_cloudFadeOut, this.beastCloudFadeOut, this);
        eventMgr.on(EventType.MapBeast_cloudFadeIn, this.beastCloudFadeIn, this);

    }
    protected startRandom: boolean = false;
    beastCloudFadeOut() {
        if (this.isStart) return;
        this.beastContainer.active = true;
        this.cloudParticleOuter.cloudFadeEffct(false);
        this.cloudParticleCentrality.cloudFadeEffct(false);
        // this.cloudFadeEffct(false);

    }
    beastCloudFadeIn() {
        if (this.isStart) return;
        this.cloudParticleOuter.cloudFadeEffct(true);
        this.cloudParticleCentrality.cloudFadeEffct(true);
        // this.cloudFadeEffct(true);

    }
    //主逻辑开始生效事件
    beastStartCallBack() {
        DataManager.Instance.isMapBesastSatr = true;
        DataManager.Instance.Arrow_beast.active = false;
        this.cloudParticleOuter.cloudFadeEffct(false);
        this.cloudParticleCentrality.cloudFadeEffct(false);
        DataManager.Instance.soundManager.playSocketSound();
        this.scheduleOnce(() => {
            DataManager.Instance.soundManager.playElectricSound();
            DataManager.Instance.soundManager.playLockSound();
            DataManager.Instance.soundManager.playPalingSound();
        }, 0.6)

        this.scheduleOnce(() => {
            DataManager.Instance.addCoin(this.mapCoinNum);
        }, 0.4)
        let anim = this.palingNode.getComponent(Animation)
        anim.play();
        anim.once(Animation.EventType.FINISHED, () => {

        })
        this.scheduleOnce(() => {

            //升级粒子特效
            this.beastBack.active = true;
            const animParticle = this.beastBack.getComponent(Animation);
            animParticle.play()
            animParticle.once(Animation.EventType.FINISHED, () => {
                this.beastBack.active = false;
            }, this);



            DataManager.Instance.soundManager.playUpgradeSound();
            this.beastBackPaticle.active = true;
            const animParticle1 = this.beastBackPaticle.getComponent(Animation);
            this.scheduleOnce(() => {
                animParticle1.play()
            }, 0.06)

            animParticle1.once(Animation.EventType.FINISHED, () => {
                this.beastBackPaticle.active = false;

            }, this);
            this.scheduleOnce(() => {
                this.mapCoinNode.getComponent(coinEffect).setCoinNum(this.mapCoinNum);
                this.mapCoinNode.getComponent(coinEffect).playEffect();

            }, 0.3)
        }, 0.32)
        // this.palingPanrent.getComponent(PalingAnimation).startBounce();
        this.scheduleOnce(() => {
            this.beastContainer.active = true;
        }, 1.5)

        // this.beastBack.getComponent(Animation).play();
        // this.beastBackPaticle.getComponent(Animation).play();


        this.scheduleOnce(() => {

            const siblings = this.electricPalingParent.children;
            for (let i = 0; i < siblings.length; i++) {
                const sibling = siblings[i];
                DataManager.Instance.soundManager.playPalingElectricSound();
                this.scheduleOnce(() => {

                    const effectNode = sibling.getChildByName("TX_dianliuWQ");
                    if (effectNode) {
                        effectNode.active = true;
                        const animation = effectNode.getComponent(Animation);
                        animation.play("dianliusuofang");
                        animation.once(Animation.EventType.FINISHED, () => {
                            // 动画完成后切换到新动画
                            animation.play("TX_dianliuWQ");
                        }, this);
                    }
                }, 0.1 * (i + 1)); // 每个节点延迟递增0.5秒
            }
        }, 1);
        this.isStart = true;
        // this.scheduleOnce(() => {
        //     this.cloudNode.removeAllChildren();
        // }, 40)
        this.scheduleOnce(() => {
            if (this.beastContainer.children.length > 0) {
                this.beastContainer.children.forEach(sibling => {
                    sibling.getComponent(EnemyBase).die();
                })
                // this.beastContainer.removeAllChildren();
                this.beastRandom();
                this.startRandom = true;

            }
            eventMgr.emit(EventType.MapBeast_enemyStart)
        }, 3.5)
        this.scheduleOnce(() => {
            //摄像机移动
            tween(DataManager.Instance.mainCamera.node)
                .to(0.8, { worldPosition: new Vec3(0.014142, 34.1, 37.250385) })
                .call(() => {
                    //this._upgraded = true;
                })
                .start();

        }, 1)

        // this.beastRandom();
    }

    beastRandom() {
        // 定义随机生成的动物配置
        const beastPatterns = [
            [ // 组合1
                { type: 'elephant', pos: new Vec3(5, 0, 40) },
                { type: 'dog', pos: new Vec3(-5, 0, 40) },
                { type: 'dog', pos: new Vec3(-2.583, 0, 40) },
                { type: 'bear', pos: new Vec3(-0.656, 0, 40) },
                { type: 'dog', pos: new Vec3(1.314, 0, 40) },
                { type: 'elephant', pos: new Vec3(-8, 0, 40) },
            ],
            [ // 组合2
                { type: 'elephant', pos: new Vec3(5, 0, 40) },
                { type: 'bear', pos: new Vec3(-5, 0, 40) },
                { type: 'dog', pos: new Vec3(-2.583, 0, 40) },
                { type: 'bear', pos: new Vec3(-0.656, 0, 40) },
                { type: 'dog', pos: new Vec3(1.314, 0, 40) },
                { type: 'dog', pos: new Vec3(-8, 0, 40) },
            ],
            [ // 组合3
                { type: 'bear', pos: new Vec3(5, 0, 40) },
                { type: 'dog', pos: new Vec3(-5, 0, 40) },
                { type: 'dog', pos: new Vec3(-2.583, 0, 40) },
                { type: 'bear', pos: new Vec3(-0.656, 0, 40) },
                { type: 'dog', pos: new Vec3(1.314, 0, 40) },
                { type: 'dog', pos: new Vec3(-8, 0, 40) },
            ],
            [ // 组合4
                { type: 'bear', pos: new Vec3(5, 0, 40) },
                { type: 'dog', pos: new Vec3(-5, 0, 40) },
                { type: 'dog', pos: new Vec3(-2.583, 0, 40) },
                { type: 'elephant', pos: new Vec3(-0.656, 0, 40) },
                { type: 'dog', pos: new Vec3(1.314, 0, 40) },
                { type: 'elephant', pos: new Vec3(-8, 0, 40) },
            ],
            [ // 组合5
                { type: 'bear', pos: new Vec3(5, 0, 40) },
                { type: 'elephant', pos: new Vec3(-5, 0, 40) },
                { type: 'dog', pos: new Vec3(-2.583, 0, 40) },
                { type: 'elephant', pos: new Vec3(-0.656, 0, 40) },
                { type: 'dog', pos: new Vec3(1.314, 0, 40) },
                { type: 'dog', pos: new Vec3(-8, 0, 40) },
            ]
        ];

        // 生成1-5的随机数
        const random = Math.floor(Math.random() * 5) + 1;
        // 获取对应的动物配置
        const beasts = beastPatterns[random - 1];

        // 生成动物
        beasts.forEach(beast => {
            switch (beast.type) {
                case 'elephant':
                    this.spawnElephant(beast.pos, true);
                    break;
                case 'dog':
                    this.spawnDog(beast.pos, true);
                    break;
                case 'bear':
                    this.spawnBear(beast.pos, true);
                    break;
            }
        });
    }


    initPools() {

        if (!this.bearPrefab || !this.dogPrefab || !this.elephantPrefab) return;
        // 初始化熊敌人池
        poolManager.initPool('BearPool', this.bearPrefab, 3,);
        // 初始化狗敌人池
        poolManager.initPool('DogPool', this.dogPrefab, 3,);
        // 初始化大象敌人池
        poolManager.initPool('ElephantPool', this.elephantPrefab, 3,);
    }
    start() {
        this.initPools();
        this.InitcreatorEnemy();
        this.onInitEvent();
        this.scheduleOnce(() => {
            this.beastContainer.active = false;
        }, 0.1)

        // this.scheduleOnce(() => {
        //    // eventMgr.emit(EventType.MapBeast_start);
        //    eventMgr.emit(EventType.MapBeast_cloudFadeOut);
        // }, 2)
        // this.scheduleOnce(() => {
        //    // eventMgr.emit(EventType.MapBeast_start);
        //    eventMgr.emit(EventType.MapBeast_cloudFadeIn);
        // }, 5)
    }

    InitcreatorEnemy() {
        this.spawnElephant(new Vec3(5, 0, 29));
        this.spawnDog(new Vec3(-5, 0, 28.665))
        this.spawnDog(new Vec3(-2.583, 0, 28.665))
        this.spawnBear(new Vec3(-0.656, 0, 28.533));
        this.spawnDog(new Vec3(1.314, 0, 28.665))
        this.spawnElephant(new Vec3(-8, 0, 29));

    }
    spawnBear(pos: Vec3, enemyDie?: boolean) {


        // 从对象池获取熊敌人节点
        const bear = poolManager.getNode('BearPool');
        if (enemyDie) {
            bear.getComponent(EnemyBase).setDie();
        }
        if (bear) {
            bear.parent = this.beastContainer;
            bear.position = new Vec3(pos);
            bear.active = true;
        }
    }

    spawnDog(pos: Vec3, enemyDie?: boolean) {

        // 从对象池获取狗敌人节点
        const dog = poolManager.getNode('DogPool');
        if (enemyDie) {
            dog.getComponent(EnemyBase).setDie();
        }
        if (dog) {
            dog.parent = this.beastContainer;
            dog.position = new Vec3(pos);
            dog.active = true;

        }
    }

    spawnElephant(pos: Vec3, enemyDie?: boolean) {

        // 从对象池获取大象敌人节点
        const elephant = poolManager.getNode('ElephantPool');
        if (enemyDie) {
            elephant.getComponent(EnemyBase).setDie();
        }
        if (elephant) {
            elephant.parent = this.beastContainer;
            elephant.position = new Vec3(pos);
            elephant.active = true;

        }
    }

    clearAll() {
        // 清空所有对象池
        poolManager.clearAll();

    }
    private addTime: number = 0;
    update(deltaTime: number) {
        if (this.startRandom) {
            this.addTime += deltaTime;
            if (this.addTime >= 9) {
                this.addTime = 0;
                this.beastRandom();
            }
        }
    }
}


