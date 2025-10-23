import { _decorator, Component, Node, Animation, Camera, Vec3, tween, Tween, Quat } from 'cc';
import { Global } from './core/Global';
const { ccclass, property } = _decorator;

@ccclass('GroundEffct')
export class GroundEffct extends Component {

    @property(Camera)
    mainCamera: Camera = null;

    @property(Animation)
    groundAnimation: Animation = null;
    // 每一个大地
    @property(Node)
    ground1: Node = null;

    @property(Node)
    ground2: Node = null;

    @property(Node)
    ground3: Node = null;

    @property(Node)
    ground4: Node = null;

    @property(Node)
    ground4UI: Node = null;

    @property(Animation)
    treeAnimation: Animation = null;
    // 每一个大地快上的树
    @property(Node)
    tree1: Node = null;

    @property(Node)
    tree2: Node = null;

    @property(Node)
    tree3: Node = null;

    @property(Node)
    tree4: Node = null;

    @property(Animation)
    groundObjectAnmation: Animation = null;

    // 每一个大地快上的物体
    @property(Node)
    groundObject1: Node = null;

    @property(Node)
    groundObject2: Node = null;

    @property(Node)
    groundObject3: Node = null;

    @property(Node)
    groundObject4: Node = null;

    //玉米地块 每一个小地块
    @property(Node)
    groundObject2_1: Node = null;
    @property(Node)
    groundObject2_2: Node = null;
    @property(Node)
    groundObject2_3: Node = null;
    @property(Node)
    groundObject2_4: Node = null;


    @property(Node)
    ArrowgroundObject2_1: Node = null;
    @property(Node)
    ArrowgroundObject2_2: Node = null;
    @property(Node)
    ArrowgroundObject2_3: Node = null;
    @property(Node)
    ArrowgroundObject2_4: Node = null;

    @property(Node)
    arrowGuid: Node = null;

    @property(Node)
    upgradeNode: Node = null;

    /////////////////////////////////以上关于相机地块的变量

    @property(Node)
    treeLandHouse: Node = null;
    @property(Node)
    enemyLandHouse: Node = null;

    protected onLoad(): void {
        this.tree3.active = false
        // this.scheduleOnce(() => {
        //     this.treeAnimation.play("shuCS - 02");
        //     const state = this.treeAnimation.getState("shuCS - 02");
        //     if (state) {
        //         state.time = 0;       // 设置动画时间到0秒
        //         state.sample();       // 采样当前时间帧，更新动画到第一帧
        //         this.treeAnimation.pause(); // 暂停动画，保持在第一帧
        //     }
        // }, 0.1)

    }

    //最后显示的相机位置
    @property({ type: Vec3, tooltip: '相机位置' })
    cameraPosition1: Vec3 = new Vec3(20, 100, 75);

    @property({ type: Vec3, tooltip: '相机旋转' })
    cameraRotation: Vec3 = new Vec3(-55, 0, 0);

    @property({ type: Number, tooltip: '相机高度' })
    cameraHigeht: number = 25;


    ///////////////////关于地块相机移动//////////////////////
    passAnimation1() {
        this.ground2.active = true;
        this.groundAnimation.play("dikuaiCS")
        Global.soundManager.playAnimationSound();

        this.groundAnimation.once(Animation.EventType.FINISHED, () => {
            this.tree2.active = true;
            this.groundObject2.active = true;
          //  this.treeAnimation.play("shuCS")
            this.groundObjectAnmation.play("shuCS")
        })
        const targetPosition = new Vec3(8, 22, 32.7);
        const targetPosition1 = new Vec3(14.8, 19, 32.3);
        const targetPosition2 = new Vec3(0, 21.8, 32.3);
        console.log("(this.mainCamera.node =====" + this.mainCamera.node)
        tween(this.mainCamera.node)
            .to(0.8, { position: targetPosition })
            .call(() => {
                tween(this.mainCamera.node)
                    .to(0.8, { position: targetPosition1 })
                    .call(() => {
                        tween(this.mainCamera.node)
                            .delay(0.5)
                            .to(0.8, { position: targetPosition2 })
                            .call(() => { })
                            .start();
                    })
                    .start();
            })
            .start();
    }
    passAnimation11() {
        const targetPosition = new Vec3(8, 22, 32.7);
        const targetPosition1 = new Vec3(13.8, 19, 43.1);
        tween(this.mainCamera.node)
            .to(0.8, { position: targetPosition })
            .call(() => {
                tween(this.mainCamera.node)
                    .to(0.8, { position: targetPosition1 })
                    .call(() => {
                        Global.isMoveCamreToCorn = false
                    })
                    .start();
            })
            .start();
    }
    passAnimation2() {
        Global.soundManager.playAnimationSound();

        const targetPosition = new Vec3(13.927, 33.377, 16.287);
        const targetPosition1 = new Vec3(31.3, 47.4, 58.5);
        const targetPosition2 = new Vec3(40.64, 47.385, 58.454);
        const targetPosition3 = new Vec3(15, 15, 37.1);
        this.ground3.active = true;
        this.groundAnimation.play("dikuaiCS - 01")
        this.groundAnimation.once(Animation.EventType.FINISHED, () => {
            this.tree3.active = true;
            this.enemyLandHouse.active = true;
            this.groundObject3.active = true;
            this.tree3.active = true;
            this.treeAnimation.play("shuCS - 02")
            this.groundObjectAnmation.play("shuCS - 02")
        })
        tween(this.mainCamera.node)
            // .to(0.8, { position: targetPosition })
            // .call(() => {
            //     // 第一个动画完成回调
            // })
            .to(1.2, { position: targetPosition1 })
            .call(() => {
                // 第二个动画完成回调
            })
            .delay(0.5)
            // .to(0.8, { position: targetPosition2 })
            // .call(() => {


            // })
            .to(1, { position: targetPosition3 })
            .call(() => {
                // 第二个动画完成回调
                this.scheduleOnce(() => {
                    this.arrowGuid.active = true
                }, 0.5)

            })
            .start();
    }
    passAnimation21() {
        const targetPosition2 = new Vec3(28, 28.4, 42.8);
        tween(this.mainCamera.node)
            .to(1, { position: targetPosition2 })
            .call(() => {
                // 第二个动画完成回调
                this.arrowGuid.active = false
            })
            .start();
    }

    passAnimation3() {
        Global.soundManager.playAnimationSound();
        //const targetPosition = new Vec3(19.511, 82.498, 106.064);
        const targetPosition = this.cameraPosition1// new Vec3(20, 100, 75);
        //const targetRotation = new Vec3(-55, 0, 0);
        //this.mainCamera.node.setRotationFromEuler(this.cameraRotation);//-55, 0, 0);
        // this.mainCamera.orthoHeight = this.cameraHigeht
        let tree = this.tree3.getChildByName("DK-102")
        tree.children.forEach((child) => {
            if (child.getChildByName("UI_famuzhiyin")) {
                let n = child.getChildByName("UI_famuzhiyin")
                // 获取当前节点的缩放值
                const currentScale = n.scale.clone();
                // 计算放大 1.2 倍后的缩放值
                const targetScale = currentScale.multiplyScalar(1.53);
                tween(n)
                    .to(1.7, { scale: targetScale })
                    .start();
            }
        })

        tween(this.mainCamera)
            .to(0.5, { orthoHeight: this.cameraHigeht })
            .start();
        tween(this.mainCamera.node)
            // .parallel(
            //     tween().to(0.5, { position: targetPosition }),
            //     tween().to(0.5, { eulerAngles: targetRotation })
            // )
            .to(0.5, { position: targetPosition })

            .call(() => {
                // 第一个动画完成回调
                this.ground4.active = true;


                this.tree4.active = true;

                this.groundAnimation.play("dikuaiCS - 02")
                this.treeAnimation.play("shuCS - 03")
                this.groundObjectAnmation.play("shuCS - 03")
                this.scheduleOnce(() => {
                    this.groundObject4.active = true;
                    this.ground4UI.active = true;
                }, 1)
            })
            .start();
    }
    showAllTreeClick() {
        for (let i = 0; i < 3; i++) {
            let tree = this.tree3.getChildByName("DK-10" + (i + 1));
            tree.children.forEach((child) => {
                if (child.getChildByName("UI_famuzhiyin")) {
                   // child.getChildByName("UI_famuzhiyin").active = true;
                }

            })
        }
        //let parentNode = this.tree3.getChildByName
    }
    //////////////////////////////////////////////相机镜头以外的操作
    upgradeTreeHouseAnimation(callback: () => void) {
        if (Global.isPlayHouseAnimation) {
            return;
        }
        Global.isPlayHouseAnimation = false;
        Global.soundManager.playUpSound();
        let house1 = this.treeLandHouse.getChildByName("shengjiqian")
        let house2 = this.treeLandHouse.getChildByName("shengjihou")
        let particle = this.treeLandHouse.getChildByName("TX_shengjiLZ")
        house1.active = false;
        house2.active = true;
        particle.active = true;
        const treeLandHouseAnim = this.treeLandHouse.getComponent(Animation);
        const particleAnim = particle.getComponent(Animation);

       // const treeLandHouseAnim = this.treeLandHouse.getComponent(Animation);
  
        // 检查特定动画状态（假设动画剪辑名为"upgrade_anim"）
        const animState = treeLandHouseAnim.getState("shengji_fangzi");
        if (animState && animState.isPlaying) {
            return;
        }
        // 创建两个 Promise，分别在动画完成时 resolve
        const p1 = new Promise<void>((resolve) => {
            treeLandHouseAnim.play();
            treeLandHouseAnim.once(Animation.EventType.FINISHED, () => {
                resolve();
            });
        });

        const p2 = new Promise<void>((resolve) => {
            particleAnim.play();
            particleAnim.once(Animation.EventType.FINISHED, () => {
                resolve();
            });
        });

        // 两个动画都完成后调用回调
        Promise.all([p1, p2]).then(() => {
            callback();
        });

    }
    upgradeEnemyHouseAnimation(callback: () => void) {
        Global.soundManager.playUpSound();
        let house1 = this.enemyLandHouse.getChildByName("shengjiqian")
        let house2 = this.enemyLandHouse.getChildByName("shengjihou")
        let particle = this.enemyLandHouse.getChildByName("TX_shengjiLZ")
        house1.active = false;
        house2.active = true;
        particle.active = true;
        const treeLandHouseAnim = this.enemyLandHouse.getComponent(Animation);
        const particleAnim = particle.getComponent(Animation);

        // 创建两个 Promise，分别在动画完成时 resolve
        const p1 = new Promise<void>((resolve) => {
            treeLandHouseAnim.play();
            treeLandHouseAnim.once(Animation.EventType.FINISHED, () => {
                resolve();
            });
        });

        const p2 = new Promise<void>((resolve) => {
            particleAnim.play();
            particleAnim.once(Animation.EventType.FINISHED, () => {
                resolve();
            });
        });

        // 两个动画都完成后调用回调
        Promise.all([p1, p2]).then(() => {
            callback();
        });
    }
    hideCornArrow() {
        this.ArrowgroundObject2_1.active = false;
        this.ArrowgroundObject2_2.active = false;
        this.ArrowgroundObject2_3.active = false;
        this.ArrowgroundObject2_4.active = false;
    }

    upgradeAnimation() {
        const anim = this.upgradeNode.getComponent(Animation);
        if (Global.playerBodyWood > 0 && Global.upgradeUIAnimtion == 1) {
            Global.upgradeUIAnimtion = 2;
            const animState = anim.getState('SJZY');
            if (!animState || animState.isPlaying) {
                return;
            }
            anim.play('SJZY');
        }
        // else if (Global.playerBodyWood >= Global.treeHandOverNumLimit && Global.upgradeUIAnimtion == 2) {
        //     Global.upgradeUIAnimtion = 0;
        //     const animState = anim.getState('WoodTDAni');
        //     if (!animState || animState.isPlaying) {
        //         return;
        //     }
        //     anim.play('WoodTDAni');
        // }
    }
    // start() {

    // }

    // update(deltaTime: number) {

    // }
}


