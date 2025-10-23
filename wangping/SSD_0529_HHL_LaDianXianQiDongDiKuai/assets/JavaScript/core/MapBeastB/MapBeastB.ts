import { _decorator, Component, Node, SkeletalAnimation, Vec3, Animation, tween } from 'cc';
import { GroundParent } from '../GroundParent';
import { eventMgr } from '../EventManager';
import { EventType } from '../EventType';
import { PalingAnimation } from '../PalingAnimation';
import { MapBeast } from '../MapBeast/MapBeast';
import { EnemyBase } from '../MapBeast/EnemyBase';
import { CloudEffct } from '../CloudEffct';
import { OilDrumEffect } from '../MapBeast/OilDrumEffect';
import { coinEffect } from '../coinEffect';
import { DataManager } from '../../Global/DataManager';
import { CloudParticleEffect } from '../CloudParticleEffect';

const { ccclass, property } = _decorator;

@ccclass('MapBeastB')
export class MapBeastB extends Component {

    @property(Node)
    protected palingNode: Node = null;
    @property(Node)
    protected palingRight: Node = null;
    @property(Node)
    protected palingLeft: Node = null;
    @property(Node)
    protected palingUp: Node = null;
    @property(Node)
    protected palingDown: Node = null;

    @property(Node)
    protected beastContainer: Node = null;

    @property(Animation)
    protected oilAnimation: Animation = null;

    @property(Node)
    protected oilPump: Node = null;


    @property(Node)
    singleShowPaling: Node = null; //单独显示的栅栏

    // @property(Node)
    // cloudNode: Node = null;

    // @property(Node)
    // cloudNode1: Node = null;

    @property(Node)
    coinNode: Node = null;

    @property(Node)
    levelUp: Node = null;

    @property(Node)
    levelUpParticle: Node = null;

    @property(Animation)
    mapEffect: Animation = null;


    @property(CloudParticleEffect)
    cloudParticleOuter: CloudParticleEffect = null;
    @property(CloudParticleEffect)
    cloudParticleCentrality: CloudParticleEffect = null;

    @property(CloudParticleEffect)
    cloudParticleOuter1: CloudParticleEffect = null;
    @property(CloudParticleEffect)
    cloudParticleCentrality1: CloudParticleEffect = null;

    private isStart: boolean = false;

    private isDrumAni = false;//是否开始油桶的动画事件
    private drumDuration = 2.6;//持续多少秒
    private drumTime: number = 0;//累计时间
    private coinNum: number = 10;

    @property(Node)
    mapCoinNode: Node = null;
    private mapCoinNum: number = 300;

    private playPalingAnimation: Animation = null;
    start() {
        this.playPalingAnimation = this.palingNode.getComponent(Animation)
        const animState = this.playPalingAnimation.getState(this.playPalingAnimation.defaultClip.name);
        if (animState) {
            animState.time = 0;    // 设置到第一帧
            animState.sample();    // 采样当前时间帧
            this.playPalingAnimation.pause(); // 暂停动画，停留在第一帧
        }
    }
    //初始化事件
    onInitEvent() {
        //云的的事件监听
        eventMgr.on(EventType.MapBeastB_start, this.MapBeastBStart, this);
        eventMgr.on(EventType.MapBeastB_cloudFadeOut, this.beastBFadeOut, this);
        eventMgr.on(EventType.MapBeastB_cloudFadeIn, this.beastBFadeIn, this);
        //第二个云
        eventMgr.on(EventType.MapBeastB1_cloudFadeOut, this.beastBFadeOutOneOne, this);
        eventMgr.on(EventType.MapBeastB1_cloudFadeIn, this.beastBFadeInOneOne, this);

    }

    onLoad(): void {
        this.onInitEvent();
        this.initPaling();
    }

    beastBFadeOut() {
        if (this.isStart) {
            return;
        }
        this.cloudParticleOuter.cloudFadeEffct(false)
        this.cloudParticleCentrality.cloudFadeEffct(false)
        //this.cloudFadeEffct(false, this.cloudNode)

    }
    beastBFadeIn() {
        if (this.isStart) {
            return;
        }
        this.cloudParticleOuter.cloudFadeEffct(true)
        this.cloudParticleCentrality.cloudFadeEffct(true)
        //this.cloudFadeEffct(true, this.cloudNode)
    }
    beastBFadeOutOneOne() {
        if (this.isStart) {
            return;
        }
        this.cloudParticleOuter1.cloudFadeEffct(false)
        this.cloudParticleCentrality1.cloudFadeEffct(false)
        //this.cloudFadeEffct(false, this.cloudNode1)
    }
    beastBFadeInOneOne() {
        if (this.isStart) {
            return;
        }
        this.cloudParticleOuter1.cloudFadeEffct(true)
        this.cloudParticleCentrality1.cloudFadeEffct(true)
        // this.cloudFadeEffct(true, this.cloudNode1)
    }
    cloudFadeEffct(isFade: boolean, cloudNode: Node) {
        let siblings = cloudNode.children;
        if (siblings.length === 0) {
            console.warn("当前云节点没有子节点");
            return;
        }
        // 遍历并处理同级节点
        siblings.forEach((sibling, index) => {
            sibling.getComponent(CloudEffct).startEffect(isFade);
        });
    }
    MapBeastBStart() {
        this.cloudParticleOuter.cloudFadeEffct(false)
        this.cloudParticleCentrality.cloudFadeEffct(false)
        DataManager.Instance.soundManager.playSocketSound();
        this.scheduleOnce(() => {
            DataManager.Instance.soundManager.playElectricSound();
            DataManager.Instance.soundManager.playLockSound();
        }, 0.6)

        this.scheduleOnce(() => {
            DataManager.Instance.addCoin(this.mapCoinNum);
        }, 0.4)
        this.palingEffctCallBack();



    }
    allEffect() {

        this.mapEffect.play();
        if (this.isStart) return
        this.isStart = true;
        //this.cloudFadeEffct(false, this.cloudNode1)
        this.cloudParticleOuter1.cloudFadeEffct(false)
        this.cloudParticleCentrality1.cloudFadeEffct(false)

        this.scheduleOnce(() => {
            this.oilPump.getComponent(SkeletalAnimation).play();
        }, 1)
        // this.scheduleOnce(() => {
        //升级特效
        this.levelUp.active = true;
        const anim = this.levelUp.getComponent(Animation);
        anim.play()
        anim.once(Animation.EventType.FINISHED, () => {
            this.levelUp.active = false;
        }, this);
        //升级粒子特效
        DataManager.Instance.soundManager.playUpgradeSound();
        this.levelUpParticle.active = true;
        const animParticle = this.levelUpParticle.getComponent(Animation);
        this.scheduleOnce(() => {
            animParticle.play()
        }, 0.06)
        // animParticle.play()
        animParticle.once(Animation.EventType.FINISHED, () => {
            this.levelUpParticle.active = false;

        }, this);
        this.scheduleOnce(() => {
            this.mapCoinNode.getComponent(coinEffect).setCoinNum(this.mapCoinNum);
            this.mapCoinNode.getComponent(coinEffect).playEffect();

        }, 0.3)
        //}, 1.5);
        // this.scheduleOnce(() => {

        //     this.singleShowPaling.active = true;
        //     this.singleShowPaling.getComponent(PalingAnimation).startBounce();
        // }, 1.2)
        this.scheduleOnce(() => {
            this.beastContainer.active = true;
        }, 2)
        this.isDrumAni = true;
        this.scheduleOnce(() => {
            //摄像机移动
            tween(DataManager.Instance.mainCamera.node)
                .to(0.8, { worldPosition: new Vec3(0.014142, 34.1, 37.250385) })
                .call(() => {
                    //this._upgraded = true;
                })
                .start();

        }, 1)
    }
    /**
     * 关于木栅栏的操作
     */
    initPaling() {
        // this.palingRight.active = false;
        // this.palingDown.active = false;
        // this.palingUp.active = true;
        // this.palingLeft.active = false;

    }
    async palingEffctTo() {
        // 获取动画组件
        // const leftAnimation = this.palingLeft.getComponent(PalingAnimation);
        // const rightAnimation = this.palingRight.getComponent(PalingAnimation);
        // this.palingUp.getComponent(PalingAnimation).startMoveDown();
        // 同时启动两个动画，并等待它们都完成
        // await Promise.all([
        //     leftAnimation.startAnimation(),
        //     rightAnimation.startAnimation()
        // ]);
    }
    async palingEffctCallBack() {
        // this.palingRight.active = true;
        // this.palingDown.active = true;
        // this.palingUp.active = true;
        // this.palingLeft.active = true;
        DataManager.Instance.soundManager.playPalingSound();
        let anim = this.palingNode.getComponent(Animation)
        anim.play()
        anim.once(Animation.EventType.FINISHED, () => {

        })
        this.scheduleOnce(() => {
            this.allEffect();
        }, 0.48)
        // await this.palingEffctTo();

        // this.palingDown.getComponent(PalingAnimation).startBounce();
    }
    update(deltaTime: number) {
        if (this.isDrumAni) {
            this.drumTime += deltaTime;
            if (this.drumTime >= this.drumDuration) {
                this.drumTime = 0;
                //this.oilNode.getComponent(OilDrumEffect).showChildrenSequentially();
                if (this.oilAnimation.node.active == false) {
                    this.oilAnimation.node.active = true;
                }

                this.oilAnimation.play();
                this.scheduleOnce(() => {
                    this.coinNode.getComponent(coinEffect).setCoinNum(this.coinNum)
                    this.coinNode.getComponent(coinEffect).playEffect();
                }, 2.4)

                DataManager.Instance.addCoin(this.coinNum);
            }
        }
    }
}


