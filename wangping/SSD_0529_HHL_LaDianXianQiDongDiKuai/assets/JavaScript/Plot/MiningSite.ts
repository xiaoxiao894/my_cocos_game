import { _decorator, Component, instantiate, Node, Prefab, SkeletalAnimation, Animation, tween, Vec3 } from 'cc';
import { eventMgr } from '../core/EventManager';
import { EventType } from '../core/EventType';
import { DataManager } from '../Global/DataManager';
import { GroundParent } from '../core/GroundParent';
import { PalingAnimation } from '../core/PalingAnimation';
import { EntityTypeEnum } from '../Common/Enum';
import { coinEffect } from '../core/coinEffect';
import { OilDrumEffect } from '../core/MapBeast/OilDrumEffect';
import { CloudParticleEffect } from '../core/CloudParticleEffect';
const { ccclass, property } = _decorator;

@ccclass('MiningSite')
//第二个地块 矿场
export class MiningSite extends Component {

    @property(SkeletalAnimation)
    ani: SkeletalAnimation = null;

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

    @property(coinEffect)
    coinEffct: coinEffect = null;

    @property(Animation)
    work: Animation = null;

    @property(Node)
    levelUp: Node = null;

    @property(Node)
    levelUpParticle: Node = null;

    @property(Node)//矿机的通电效果
    electricEffect: Node = null;

    private isStart: boolean = false;

    private _coin: coinEffect = null;
    private _addNum: number = 10;

    @property(Node)
    mapCoinNode: Node = null;
    private mapCoinNum: number = 300;

    @property(Animation)
    mapAnimation: Animation = null;

    @property(CloudParticleEffect)
    cloudParticleOuter: CloudParticleEffect = null;
    @property(CloudParticleEffect)
    cloudParticleCentrality: CloudParticleEffect = null;

    protected onEnable(): void {
        //云的的事件监听
        eventMgr.on(EventType.MiningSite_cloudFadeOut, this.cloudFadeOutCallBack, this);
        eventMgr.on(EventType.MiningSite_cloudFadeIn, this.cloudFadeInCallBack, this);
        eventMgr.on(EventType.MiningSite_start, this.startCallBack, this);
        eventMgr.on(EventType.Lumberyard_start, this.lumberyardStart, this);
    }

    protected onDisable(): void {
        eventMgr.off(EventType.MiningSite_cloudFadeOut, this.cloudFadeOutCallBack, this);
        eventMgr.off(EventType.MiningSite_cloudFadeIn, this.cloudFadeInCallBack, this);
        eventMgr.off(EventType.MiningSite_start, this.startCallBack, this);
        eventMgr.off(EventType.Lumberyard_start, this.lumberyardStart, this);
    }
    private playPalingAnimation: Animation = null;

    start() {
        this.init();

        this.playPalingAnimation = this.palingNode.getComponent(Animation)
        const animState = this.playPalingAnimation.getState(this.playPalingAnimation.defaultClip.name);
        if (animState) {
            animState.time = 0;    // 设置到第一帧
            animState.sample();    // 采样当前时间帧
            this.playPalingAnimation.pause(); // 暂停动画，停留在第一帧
        }
    }

    private init() {
        this.initPaling();
    }

    update(deltaTime: number) {

    }

    /**
     * 关于云的操作模块
     */
    //淡出回调
    cloudFadeOutCallBack() {
        if (this.isStart) return
        // this.cloudFadeEffct(false);
        this.cloudParticleOuter.cloudFadeEffct(false)
        this.cloudParticleCentrality.cloudFadeEffct(false)
    }
    //淡入回调
    cloudFadeInCallBack() {
        if (this.isStart) return
        //this.cloudFadeEffct(true);
        this.cloudParticleOuter.cloudFadeEffct(true)
        this.cloudParticleCentrality.cloudFadeEffct(true)
    }

    /**
     * 地块开始启动
     */
    startCallBack() {
        DataManager.Instance.Arrow_mining.active = false;
        this.cloudParticleOuter.cloudFadeEffct(false)
        this.cloudParticleCentrality.cloudFadeEffct(false)
        DataManager.Instance.soundManager.playSocketSound();
        this.scheduleOnce(() => {
            this.isStart = true;
            DataManager.Instance.soundManager.playElectricSound();
            DataManager.Instance.soundManager.playLockSound();
        }, 0.6)
        this.scheduleOnce(() => {
            DataManager.Instance.addCoin(this.mapCoinNum);
        }, 0.4)

        //延迟几秒开始木栅栏动画
        this.palingEffctCallBack();


        // }, 2.6)
    }
    allEffect() {

        this.mapAnimation.play();

        //延时几秒开始建筑开始动画
        //this.scheduleOnce(() => {
        this.ani.play();
        // }, 1);
        //延时几秒开始通电动画
        this.scheduleOnce(() => {
            this.electricEffect.active = true;
            this.electricEffect.getComponent(Animation).play();
            DataManager.Instance.soundManager.playOreSoundThreeTimes();
        }, 0.7);

        //延时几秒开始升级特效
        // this.scheduleOnce(() => {

        //升级动画
        this.levelUp.active = true;
        const anim = this.levelUp.getComponent(Animation);
        anim.play()
        anim.once(Animation.EventType.FINISHED, () => {
            this.levelUp.active = false;
        }, this);


        DataManager.Instance.soundManager.playUpgradeSound();

        //升级粒子特效
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
        // }, 1.3);
        // this.schedule(() => {
        this.schedule(() => {
            this.miningWork();
        }, 2);
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
        // this.palingDown.active = true;
        // this.palingUp.active = false;
        // this.palingLeft.active = false;
    }
    async palingEffctTo() {
        // // 获取动画组件
        // const leftAnimation = this.palingLeft.getComponent(PalingAnimation);
        // const rightAnimation = this.palingRight.getComponent(PalingAnimation);
        // this.palingDown.getComponent(PalingAnimation).startMoveDown();
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
        }, 0.48);
        // await this.palingEffctTo();

        // this.palingUp.getComponent(PalingAnimation).startBounce();
    }

    private miningWork() {
        this.scheduleOnce(() => {
            this.addCoin();
        }, 1.9)
        // this.addCoin();
        if (this.work.node.active == false) {
            this.work.node.active = true;
        }
        this.work.play();

    }

    //增加金币
    private addCoin() {
        if (this.coinEffct.node.active == false) {
            this.coinEffct.node.active = true;
        }
        this.coinEffct.setCoinNum(this._addNum);
        this.coinEffct.playEffect();
        // if (!this._coin) {
        //     let prefab: Prefab = DataManager.Instance.prefabMap.get(EntityTypeEnum.coinNode);
        //     let coinNode = instantiate(prefab);
        //     coinNode.parent = this.coinParent;
        //     let effect: coinEffect = coinNode.getComponent(coinEffect);
        //     this._coin = effect;
        //     if (this._coin) {
        //         this._coin.setCoinNum(this._addNum);
        //     }
        // }

        // this._coin?.playEffect();
    }

    /** 伐木场共用栅栏处理  */
    private lumberyardStart() {
        if (DataManager.Instance.isGameOver) {
            //延迟几秒开始木栅栏动画
            this.scheduleOnce(() => {
                this.palingLeft.getComponent(PalingAnimation).startMoveDown();
            }, 0);
        }
    }

}


