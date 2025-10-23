import { _decorator, Component, Animation, SkeletalAnimation, ParticleSystem, Camera, Material, SkinnedMeshRenderer, tween, Vec3, Node, RigidBody, CapsuleCollider, Collider } from 'cc';
import { BooldPaling } from '../BooldPaling';
import { App } from '../App';
import { GlobeVariable } from '../core/GlobeVariable';
import { GameEndManager } from '../UI/GameEndManager';
import { CameraMain } from '../core/CameraMain';
import { Player } from './Player';
const { ccclass, property } = _decorator;

@ccclass('Flower')
export class Flower extends Component {


    @property({ type: BooldPaling, tooltip: "血条" })
    booldPaling: BooldPaling = null;

    @property({ type: SkeletalAnimation, tooltip: "动画" })
    flowerAni: SkeletalAnimation = null;

    @property({ type: ParticleSystem, tooltip: "动画" })
    hitParticle: ParticleSystem = null;

    @property({ type: Animation, tooltip: "动画" })
    hitAni: Animation = null;

    @property({ type: Animation, tooltip: "动画" })
    birthAni: Animation = null;

    @property({ type: Node, tooltip: "joysticNode" })
    joysticNode: Node = null;

    @property({ type: Camera, tooltip: "动画" })
    mainCamera: Camera = null;


    @property(Material)
    material0: Material = null;


    @property(Material)
    material1: Material = null;


    @property(Material)
    material2: Material = null;

    @property(Material)
    materialWhite: Material = null;

    @property(SkinnedMeshRenderer)
    flowerMesh: SkinnedMeshRenderer = null;

    @property({ type: Animation, tooltip: "受击缩放动画" })
    hitAniScal: Animation = null;

    private hp: number = 1000;

    private isDie: boolean = false;

    start() {
        this.init();
    }

    protected onEnable(): void {
        // this.init();
    }
    init() {
        this.hp = this.booldPaling.getBloodHpMax();
        this.scheduleOnce(() => {

            this.flowerAni.play("Chushi_MeiGuiHua");
            if (this.isPlayer) return;
            this.isPlayer = true;
            this.birthAni.play("kaichangAni");
            console.log('kaichangAni  kaichangAni ');
            this.flowerAni.once(Animation.EventType.FINISHED, () => {
                this.flowerAni.play("Chushi_MeiGuiHua_reverse");
                this.flowerAni.once(Animation.EventType.FINISHED, () => {
                    this.flowerAni.play("Idel_MeiGuiHua");
                    App.sceneNode.player.getComponent(RigidBody).enabled = true;
                    App.sceneNode.player.getComponent(Collider).enabled = true;

                }, this)

            }, this)
            this.birthAni.once(Animation.EventType.FINISHED, () => {

                this.cameraMove();


            }, this)

        }, 1)

        // this.hitAni.play("hua");
    }

    private isPlayer: boolean = false;
    IdleEvent() {
        App.sceneNode.player.getComponent(Player).jumpAni();

    }
    cameraMove() {
        tween(this.mainCamera.node)
            .to(0.5, { worldPosition: new Vec3(106.5, 111, 77.5) })
            .call(() => {
                this.mainCamera.getComponent(CameraMain).init();
                GlobeVariable.isCameraMoveEnd = true;
                this.joysticNode.active = true;
            })

            .start();

    }
    continueGame() {
        GlobeVariable.isCameraMoveEnd = false;
        GlobeVariable.isIdel = false;
        App.playerController.initPlayer();
        //this.scheduleOnce(() => {
        this.flowerAni.play("Chushi_MeiGuiHua");
        //  App.playerController.initPlayer();
        this.birthAni.play("kaichangAni");
        this.flowerAni.once(Animation.EventType.FINISHED, () => {
            this.flowerAni.play("Chushi_MeiGuiHua_reverse");
            this.flowerAni.once(Animation.EventType.FINISHED, () => {
                this.flowerAni.play("Idel_MeiGuiHua");
                //  this.cameraMove();
            }, this)

        }, this)
        this.birthAni.once(Animation.EventType.FINISHED, () => {

            this.cameraMove();


        }, this)
        this.isDie = false;
        this.booldPaling.continueGame();
        this.hp = this.booldPaling.getBloodHpMax();
        //  }, 0.5)

        //  this.flowerAni.play("Idel_MeiGuiHua");

    }
    hit(attack: number) {
        this.booldPaling.subscribeBool(attack);
        let flowerTx = App.poolManager.getNode(GlobeVariable.entifyName.FlowerTx);
        flowerTx.parent = this.hitParticle.node.parent
        flowerTx.setPosition(this.hitParticle.node.position);
        flowerTx.active = true;
        let particle = flowerTx.getComponent(ParticleSystem);
        if (particle)
            particle.play()

        this.scheduleOnce(() => {
            if (particle) {
                // 1. 停止粒子播放
                particle.stop();
                // 3. 可选：手动清除所有粒子（根据引擎特性）
                particle.clear();
                flowerTx.active = false;
                flowerTx.removeFromParent()
                App.poolManager.returnNode(flowerTx, GlobeVariable.entifyName.FlowerTx);
            }


        }, 1.5)
        this.hitAniScal.play("HitAni");
        this.flowerMesh.materials = [this.materialWhite, this.materialWhite, this.materialWhite];
        
        this.scheduleOnce(() => {
            this.flowerMesh.materials = [this.material0, this.material1, this.material2];
        }, 0.1)
        // if (this.booldPaling.getBloodHp() > this.hp / 2) {
        //     this.flowerAni.getState("Idel_MeiGuiHua").speed = 2;
        //     this.scheduleOnce(() => {
        //         this.flowerAni.getState("Idel_MeiGuiHua").speed = 1;
        //     }, 0.5)
        // }
        if (this.flowerAni.getState("Idel_MeiGuiHua").isPlaying) {
            this.flowerAni.getState("Idel_MeiGuiHua").speed = 2;
            this.scheduleOnce(() => {
                this.flowerAni.getState("Idel_MeiGuiHua").speed = 1;
            }, 0.5)
        } else if (this.flowerAni.getState("Idel_DieAway_MeiGuiHua").isPlaying) {
            this.flowerAni.getState("Idel_DieAway_MeiGuiHua").speed = 3;
            this.scheduleOnce(() => {
                this.flowerAni.getState("Idel_DieAway_MeiGuiHua").speed = 1;
            }, 0.5)
        }
        if (this.booldPaling.getBloodHp() == this.hp / 2) {
            this.flowerAni.play("DieAway_MeiGuiHua");
            this.scheduleOnce(() => {
                this.flowerAni.play("Idel_DieAway_MeiGuiHua");
            }, 1.5)
        } else if (this.booldPaling.getBloodHp() <= 0 && !this.isDie) {
            this.isDie = true
            this.flowerAni.play("Die_MeiGuiHua");
            this.flowerAni.once(Animation.EventType.FINISHED, () => {
                App.sceneNode.GameEnd.active = true;
                App.sceneNode.GameEnd.getComponent(GameEndManager).showGameEnd(0);
                GlobeVariable.isGameEnd = true;

            }, this);

        }

    }

    update(deltaTime: number) {

    }
}


