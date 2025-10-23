import { _decorator, Component, instantiate, Node, Prefab, SkeletalAnimation, Animation, find } from 'cc';
import { eventMgr } from '../core/EventManager';
import { EventType } from '../core/EventType';
import { DataManager } from '../Global/DataManager';
import { GroundParent } from '../core/GroundParent';
import { PalingAnimation } from '../core/PalingAnimation';
import { coinEffect } from '../core/coinEffect';
import { EntityTypeEnum, EventName } from '../Common/Enum';
import { OilDrumEffect } from '../core/MapBeast/OilDrumEffect';
import { EventManager } from '../Global/EventManager';
import { CloudParticleEffect } from '../core/CloudParticleEffect';
import { LandCloudFade } from '../core/LandCloudFade';
const { ccclass, property } = _decorator;

@ccclass('Lumberyard')
//第五个地块 伐木场
export class Lumberyard extends Component {

    @property(SkeletalAnimation)
    ani: SkeletalAnimation = null;

    @property(Node)
    protected palingNode: Node = null;

    @property(Node)
    protected palingLeft: Node = null;
    @property(Node)
    protected palingUp: Node = null;

    @property(Node)
    coinParent: Node = null;

    @property(Animation)
    work: Animation = null;

    @property(Node)
    levelUp: Node = null;

    @property(Node)
    levelUpParticle: Node = null;

    @property(Node)
    treeNode: Node = null;

    @property(Animation)
    mapAnimation: Animation = null;

    @property(CloudParticleEffect)
    cloudParticleOuter: CloudParticleEffect = null;

    @property(CloudParticleEffect)
    cloudParticleCentrality: CloudParticleEffect = null;


    // @property(Animation)
    // lumberyardTree: Animation = null;

    private isStart: boolean = false;

    private _coin: coinEffect = null;
    private _addNum: number = 10;

    @property(Node)
    mapCoinNode: Node = null;
    private mapCoinNum: number = 300;

    protected onEnable(): void {
        //云的的事件监听
        eventMgr.on(EventType.Lumberyard_cloudFadeOut, this.cloudFadeOutCallBack, this);
        eventMgr.on(EventType.Lumberyard_start, this.startCallBack, this);
        eventMgr.on(EventType.Lumberyard_cloudFadeIn, this.cloudFadeInCallBack, this);
        EventManager.inst.on(EventName.GameOver, this.ropeShowCallBack, this);
    }

    protected onDisable(): void {
        eventMgr.off(EventType.Lumberyard_cloudFadeOut, this.cloudFadeOutCallBack, this);
        eventMgr.off(EventType.Lumberyard_start, this.startCallBack, this);
        eventMgr.off(EventType.Lumberyard_cloudFadeIn, this.cloudFadeInCallBack, this);
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
        this.node.getChildByName("ChaZuo").active = false;
        this.initPaling();
    }

    update(deltaTime: number) {
    }
    //显示插座
    ropeShowCallBack() {
        this.node.getChildByName("ChaZuo").active = true;
    }

    /**
     * 关于云的操作模块
     */
    //淡出回调
    cloudFadeOutCallBack() {
        //if (DataManager.Instance.isGameOver) {
        if (this.isStart) return;
        // this.cloudFadeEffct(false);
        //}
        this.cloudParticleOuter.cloudFadeEffct(false);
        this.cloudParticleCentrality.cloudFadeEffct(false);

    }
    //淡入回调
    cloudFadeInCallBack() {
        if (this.isStart) return;
        // this.cloudFadeEffct(true);
        this.cloudParticleOuter.cloudFadeEffct(true);
        this.cloudParticleCentrality.cloudFadeEffct(true);
    }
    /**
     * 地块开始启动
     */
    startCallBack() {
        eventMgr.emit(EventType.MapLand_allCloudFade);
        DataManager.Instance.soundManager.playSocketSound();
        this.scheduleOnce(() => {
            DataManager.Instance.soundManager.playElectricSound();
            DataManager.Instance.soundManager.playLockSound();
        }, 0.6)

        //延迟几秒开始木栅栏动画
        this.palingEffctCallBack();


    }
    allEffect() {
        this.mapAnimation.play();

        this.isStart = true;
        if (DataManager.Instance.isGameOver) {
            //延时几秒开始建筑开始转动
            this.scheduleOnce(() => {
                this.ani.play();
                this.treeNode.getComponent(Animation).play();
            }, 1);

            //延时几秒开始升级特效
            // this.scheduleOnce(() => {
            //升级特效
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
                this.scheduleOnce(() => {
                    this.mapCoinNode.getComponent(coinEffect).setCoinNum(this.mapCoinNum);
                    this.mapCoinNode.getComponent(coinEffect).playEffect();

                    // this.lumberyardTree.play()
                    DataManager.Instance.addCoin(this.mapCoinNum);
                }, 0.3)
            }, this);
            // }, 0.5);
            this.scheduleOnce(() => {
                let node = find("Canvas/GameEnd");
                node.active = true;
                DataManager.Instance.soundManager.playVictorySound();
            }, 2);
            this.schedule(() => {
                this.lumberWork();
            }, 2.5);
        }
    }

    /**
     * 关于木栅栏的操作
     */
    initPaling() {
        // this.palingUp.active = false;
        // this.palingLeft.active = false;
    }
    async palingEffctTo() {

        DataManager.Instance.soundManager.playPalingSound();
        // 获取动画组件
        // const upAnimation = this.palingUp.getComponent(PalingAnimation);
        // const leftAnimation = this.palingLeft.getComponent(PalingAnimation);
        //this.palingRight.getComponent(PalingAnimation).startMoveDown();
        // 同时启动两个动画，并等待它们都完成
        // await Promise.all([
        //     upAnimation.startAnimation(),
        //     leftAnimation.startAnimation()
        // ]);
    }
    async palingEffctCallBack() {
        // this.palingUp.active = true;
        // this.palingLeft.active = true;
        DataManager.Instance.soundManager.playPalingSound();
        let anim = this.palingNode.getComponent(Animation)
        anim.play();
        anim.once(Animation.EventType.FINISHED, () => {

        })
        this.scheduleOnce(() => {
            this.allEffect();
        }, 0.32);

        // await this.palingEffctTo();

    }

    //增加金币
    private addCoin() {
        if (!this._coin) {
            let prefab: Prefab = DataManager.Instance.prefabMap.get(EntityTypeEnum.coinNode);
            let coinNode = instantiate(prefab);
            coinNode.scale = coinNode.scale.clone().multiplyScalar(1.1);
            coinNode.parent = this.coinParent;
            let effect: coinEffect = coinNode.getComponent(coinEffect);
            this._coin = effect;
            if (this._coin) {
                this._coin.setCoinNum(this._addNum);
            }
        }

        this._coin?.playEffect();
    }

    private lumberWork() {
        this.addCoin();
        this.scheduleOnce(() => {
            this.work.node.active = true;
            this.work.play();

        }, 0.5);

    }


}


