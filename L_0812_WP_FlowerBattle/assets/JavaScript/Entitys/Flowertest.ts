import { _decorator, Component, Animation, SkeletalAnimation, ParticleSystem, Camera, Material, SkinnedMeshRenderer } from 'cc';
import { BooldPaling } from '../BooldPaling';
import { App } from '../App';
import { GlobeVariable } from '../core/GlobeVariable';
import { GameEndManager } from '../UI/GameEndManager';
const { ccclass, property } = _decorator;

@ccclass('Flowertest')
export class Flowertest extends Component {

    
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

    // @property({ type: Camera, tooltip: "动画" })
    // birthCamera: Camera = null;


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
        this.flowerMesh.materials = [this.materialWhite, this.materialWhite, this.materialWhite];
        this.hitAniScal.play("HitAni");
        this.scheduleOnce(() => {
            this.flowerMesh.materials = [this.material0, this.material1, this.material2];
        }, 0)
    }

    init() {
        this.hp = this.booldPaling.getBloodHpMax();
        this.scheduleOnce(() => {
          
        //    this.flowerAni.play("Chushi_MeiGuiHua");
        //    this.birthAni.play("kaichangAni");
        //   // this.birthCamera.getComponent(Animation).enabled = true;
        //    this.birthAni.once(Animation.EventType.FINISHED, () => {
        //      // this.birthCamera.getComponent(Animation).enabled = false;
        //       //this.birthCamera.node.active = false;
        //       this.flowerAni.play("Chushi_MeiGuiHua_reverse");
        //       this.flowerAni.once(Animation.EventType.FINISHED, () => {
        //           this.flowerAni.play("Idel_MeiGuiHua");
        //       }, this)
            
        //    }, this)
            
        }, 0.5)
        
        // this.hitAni.play("hua");
    }
  //  brithAniFuc(){
        //  this.birthAni.play("kaichangAni");
        //  this.birthCamera.getComponent(Animation).enabled = true;
        //  this.birthAni.once(Animation.EventType.FINISHED, () => {
        //     this.birthCamera.getComponent(Animation).enabled = false;
        //     this.birthCamera.node.active = false;
        //     this.flowerAni.play("Chushi_MeiGuiHua_reverse");
        //     this.flowerAni.once(Animation.EventType.FINISHED, () => {
        //         this.flowerAni.play("Idel_MeiGuiHua");
        //     }, this)
          
        //  }, this)
   // }
    continueGame() {
        this.isDie = false;
        this.booldPaling.continueGame();
        this.hp = this.booldPaling.getBloodHpMax();
        this.flowerAni.play("Idel_MeiGuiHua");

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
        this.flowerMesh.materials = [this.materialWhite, this.materialWhite, this.materialWhite];
        this.hitAniScal.play("HitAni");
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


