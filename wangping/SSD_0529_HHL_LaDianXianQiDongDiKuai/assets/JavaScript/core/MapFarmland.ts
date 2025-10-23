import { _decorator, Component, Node, Prefab, SkeletalAnimation, Animation, ConeCollider, error, warn, ParticleSystem, Color, tween, Vec3 } from 'cc';
import { eventMgr } from './EventManager';
import { EventType } from './EventType';
import { CloudEffct } from './CloudEffct';
import { PalingAnimation } from './PalingAnimation';
import { FruitScript } from './FruitScript';
import { NodeRotator } from './NodeRotator';
import { GroundParent } from './GroundParent';
import { DataManager } from '../Global/DataManager';
import { coinEffect } from './coinEffect';
import { CloudParticleEffect } from './CloudParticleEffect';
import { SoundManager } from './SoundManager';
const { ccclass, property } = _decorator;

@ccclass('MapFarmland')
export class MapFarmland extends Component {

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
    fruitParent: Node = null;
    @property(Node)
    rotatorNode: Node = null;

    private coinNum: number = 10;
    private mapCoinNum: number = 300;

    @property(Node)
    levelUp: Node = null;

    @property(Node)
    levelUpParticle: Node = null;
    @property(Node)
    particleEffect: Node = null;
    @property(Node)
    mapCoinNode: Node = null;

    @property(Animation)
    mapEffct: Animation = null;
    private isStart: boolean = false;

    @property(CloudParticleEffect)
    cloudParticleOuter: CloudParticleEffect = null;

    @property(CloudParticleEffect)
    cloudParticleCentrality: CloudParticleEffect = null;

    @property(Animation)
    palingAnimation: Animation = null;

    // 缓存组件引用，避免重复查找
    private _fruitScripts: FruitScript[] = [];
    private _palingAnimations: Record<string, PalingAnimation> = {};
    private _animations: Record<string, Animation> = {};
    private _skeletalAnimations: Record<string, SkeletalAnimation> = {};

    // 计时器优化
    private _updateTimer: number = 0;
    private _checkInterval: number = 2; // 检查间隔时间（秒）
    private _fruitStateChange: boolean = false;

    // 对象池相关
    private _coinEffectPool: coinEffect[] = [];

    onInitEvent() {
        eventMgr.on(EventType.MapFarmland_cloudFadeOut, this.cloudFadeOutCallBack, this);
        eventMgr.on(EventType.MapFarmland_cloudFadeIn, this.cloudFadeInCallBack, this);
        eventMgr.on(EventType.MapFarmland_fruitGreen, this.fruitGreenCallBack, this);
        eventMgr.on(EventType.MapFarmland_start, this.FarmlandCallBack, this);
        eventMgr.on(EventType.Lumberyard_start, this.lumberyardStart, this);
    }

    onLoad(): void {
        this.onInitEvent();
        this.initPaling();
        this._cacheComponents();
    }
    protected start(): void {
        const animState = this.palingAnimation.getState(this.palingAnimation.defaultClip.name);
        if (animState) {
            animState.time = 0;    // 设置到第一帧
            animState.sample();    // 采样当前时间帧
            this.palingAnimation.pause(); // 暂停动画，停留在第一帧
        }
    }

    // 缓存常用组件引用
    private _cacheComponents() {
        // // 缓存栅栏动画组件
        // this._palingAnimations = {
        //     up: this.palingUp.getComponent(PalingAnimation),
        //     down: this.palingDown.getComponent(PalingAnimation),
        //     left: this.palingLeft.getComponent(PalingAnimation),
        //     right: this.palingRight.getComponent(PalingAnimation)
        // };

        // 缓存动画组件
        this._animations = {

            levelUp: this.levelUp.getComponent(Animation),
            levelUpParticle: this.levelUpParticle.getComponent(Animation),
            particleEffect: this.particleEffect.getComponent(Animation)
        };

        // 缓存骨骼动画组件
        this._skeletalAnimations.rotator = this.rotatorNode.getComponent(SkeletalAnimation);

        // 缓存果实脚本
        this._cacheFruitScripts();
    }

    // 缓存果实脚本引用
    private _cacheFruitScripts() {
        if (!this.fruitParent) return;

        this._fruitScripts.length = 0;
        this.fruitParent.children.forEach(child => {
            const fruitNode = child.getChildByName("fruitNode");
            if (fruitNode) {
                const script = fruitNode.getComponent(FruitScript);
                if (script) this._fruitScripts.push(script);
            }
        });
    }

    FarmlandCallBack() {
        DataManager.Instance.Arrow_farmLand.active = false;
        DataManager.Instance.soundManager.playSocketSound();
        this.scheduleOnce(() => {
            DataManager.Instance.addCoin(this.mapCoinNum);
        }, 0.3)
        if (this.isStart) return;
        this.scheduleOnce(() => {
            DataManager.Instance.soundManager.playElectricSound();
            DataManager.Instance.soundManager.playLockSound();
        }, 0.6)


        // this.scheduleOnce(() => {
        this.palingEffctCallBack()
        //}, 0.48)

    }
    allEffect() {
        this.mapEffct.play();
        this.isStart = true;

        //升级光效
        this.levelUp.active = true;
        this._animations.levelUp.play();
        this._animations.levelUp.once(Animation.EventType.FINISHED, () => {
            this.levelUp.active = false;
        }, this);


        DataManager.Instance.soundManager.playUpgradeSound();

        //升级粒子特效
        this.levelUpParticle.active = true;
        this.scheduleOnce(() => {
            this._animations.levelUpParticle.play();
        }, 0.06)
        //this._animations.levelUpParticle.play();
        this._animations.levelUpParticle.once(Animation.EventType.FINISHED, () => {
            this.levelUpParticle.active = false;

            //建筑旋转特效
            this._skeletalAnimations.rotator.play();
            //洒水粒子特效
            this.particleEffect.active = true;
            this._animations.particleEffect.play();
            this.scheduleOnce(() => {
                DataManager.Instance.soundManager.playCheerSound();
            }, 0.2)

            DataManager.Instance.soundManager.playWateringSoundThreeTimes()

        }, this);
        this.scheduleOnce(() => {
            this._playCoinEffect(this.mapCoinNode, this.mapCoinNum);

        }, 0.3)
        this.scheduleOnce(() => {
            eventMgr.emit(EventType.MapFarmland_fruitGreen);
        }, 1.1);
        this.scheduleOnce(() => {
            //摄像机移动
            tween(DataManager.Instance.mainCamera.node)
                .to(0.8, { worldPosition: new Vec3(0.014142, 34.1, 37.250385) })
                .call(() => {
                    //this._upgraded = true;
                })
                .start();

        }, 1.2)
    }
    cloudFadeOutCallBack() {
        if (this.isStart) return;
        this.cloudParticleOuter.cloudFadeEffct(false);
        this.cloudParticleCentrality.cloudFadeEffct(false);


        // const color = new Color(255, 255, 255, 0);  
        // this.cloudParticleOuter.getMaterialInstance(0).setProperty("tintColor",color);
        // this.cloudParticleCentrality.getMaterialInstance(0).setProperty("tintColor",color);

    }

    cloudFadeInCallBack() {
        if (this.isStart) return;
        this.cloudParticleOuter.cloudFadeEffct(true);
        this.cloudParticleCentrality.cloudFadeEffct(true);
        //this.cloudFadeEffct(true);
    }

    initPaling() {
        // this.palingRight.active = true;
        // this.palingDown.active = false;
        // this.palingUp.active = false;
        // this.palingLeft.active = false;

    }

    async palingEffctTo() {
        this._palingAnimations.right.startMoveDown();
        await Promise.all([
            this._palingAnimations.up.startAnimation(),
            this._palingAnimations.down.startAnimation()
        ]);
    }

    async palingEffctCallBack() {
        // this.palingRight.active = true;
        // this.palingDown.active = true;
        // this.palingUp.active = true;
        // this.palingLeft.active = true;

        this.palingAnimation.play();
        this.scheduleOnce(() => {
            this.allEffect();
        }, 0.48)
        this.palingAnimation.once(Animation.EventType.FINISHED, () => {


        }, this)
        DataManager.Instance.soundManager.playPalingSound();
        // await this.palingEffctTo();

        // this._palingAnimations.left.startBounce();
    }

    fruitGreenCallBack() {
        DataManager.Instance.soundManager.playGrowSound();
        this._fruitScripts.forEach(script => {
            script.setFruitState("red");//
        });
        this._fruitStateChange = true;
        this._updateTimer = 0;
    }

    fruitRedCallBack() {
        // 筛选绿色果实（优化版）
        //const greenScripts: FruitScript[] = [];
        // for (let i = 0; i < this._fruitScripts.length; i++) {
        //     if (!this._fruitScripts[i].getFruitState()) {
        //         greenScripts.push(this._fruitScripts[i]);
        //     }
        // }

        // if (greenScripts.length <= 0) return;

        const randomIndex = Math.floor(Math.random() * this._fruitScripts.length);
        // const fruitScript = greenScripts[randomIndex];
        // fruitScript.setFruitState("red");

        DataManager.Instance.addCoin(this.coinNum);

        // 获取对应的coinNode（需要确保结构一致性）
        const coinNode = this._fruitScripts[randomIndex].node.parent.getChildByName("coinNode");
        if (coinNode) {
            this.scheduleOnce(() => {
                this._playCoinEffect(coinNode, this.coinNum);
            }, 0.2);
        } else {
            warn("fruit 没有金币的节点", randomIndex);
        }

        // this.scheduleOnce(() => {
        //     fruitScript.setFruitState("green");
        // }, 3);

        this._updateTimer = 0;
    }

    // 使用固定间隔计时器替代每帧检查
    update(deltaTime: number) {
        if (!this._fruitStateChange) return;

        this._updateTimer += deltaTime;
        if (this._updateTimer >= this._checkInterval) {
            this.fruitRedCallBack();
            this._updateTimer = 0;
        }
    }

    lumberyardStart() {
        if (DataManager.Instance.isGameOver) {
            this.scheduleOnce(() => {
                //this._palingAnimations.up.startMoveDown();
                this.palingUp.getComponent(PalingAnimation).startMoveDown();
            }, 0);
        }
    }

    // 统一管理coinEffect播放
    private _playCoinEffect(node: Node, coinNum: number) {
        if (!node) return;

        let effect = node.getComponent(coinEffect);
        if (!effect) {
            effect = node.addComponent(coinEffect);
        }

        effect.setCoinNum(coinNum);
        effect.playEffect();
    }

    onDestroy() {
        // 清理事件监听
        // eventMgr.targetOff(this);

        // 清理定时器
        this.unscheduleAllCallbacks();
    }
}