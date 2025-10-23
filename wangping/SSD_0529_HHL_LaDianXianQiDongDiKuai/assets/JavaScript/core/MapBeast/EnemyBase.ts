import { _decorator, Component, Node, SkeletalAnimation, Vec3, Animation, AnimationState, Collider, BoxCollider, ITriggerEvent } from 'cc';
import { eventMgr } from '../EventManager';
import { EventType } from '../EventType';
import { TopShakeEffect } from './TopShakeEffect';
import { DissolveEffect } from 'db://assets/Res/DissolveEffect/scripts/DissolveEffect';
import { DataManager } from '../../Global/DataManager';
const { ccclass, property } = _decorator;

@ccclass('EnemyBase')
export class EnemyBase extends Component {

    @property(SkeletalAnimation) // 绑定骨骼动画组件
    protected skeletalAnim: SkeletalAnimation | null = null;

    @property
    protected moveSpeed: number = 2; // 移动速度

    @property
    protected health: number = 100; // 生命值

    @property(Node)
    electricParticle: Node = null;

    protected isAlive: boolean = true;
    protected moveCollider = false;
    protected attackEnder = false;
    protected isParticle = true;
    protected targetPosition: Vec3 | null = null; // 移动目标位置
    protected initPos: Vec3 | null = null;//目标初始位置
    private enmeyDie: boolean = false; //通电后怪物攻击一次后 几秒死亡 
    private enemyTimeDie: number = 2
    private collidPaling: Node;

    private attackEffect: boolean = false;

    @property(Node)
    dissovleNode: Node = null;

    setDie() {

        this.enmeyDie = true;
        this.attackEffect = true;
    }
    start() {
        this.init();
        eventMgr.once(EventType.MapBeast_start, this.beastStartCallBack, this);
        //  this.onInitEvent();
    }
    beastStartCallBack() {
        this.scheduleOnce(() => {
            this.attackEffect = true;
        }, 1)
    }
    protected init() {
        // 初始化骨骼动画
        if (!this.skeletalAnim) {
            this.skeletalAnim = this.node.getComponent(SkeletalAnimation);
        }
        // if (this.skeletalAnim) {
        //     this.playAnimation('walk', true); // 默认播放待机动画
        // }
        this.setupCollisionCallbacks();
        this.movePost();

    }
    attackEvent() {
        this.collidPaling.getComponent(TopShakeEffect).shake(2);
    }

    protected setupCollisionCallbacks() {
        const collider = this.node.getComponent(Collider);
        if (!collider) {
            console.warn('没有找到碰撞矩阵');
            return;
        }
        if (!collider) return;

        collider.isTrigger = true; // 

        // 注册触发器回调
        collider.on('onTriggerEnter', this.onTriggerEnter, this);
        collider.on('onTriggerStay', this.onTriggerStay, this);
        // collider.on('onTriggerExit', this.onTriggerExit, this);

    }
    onTriggerEnter(other: Collider, self: Collider) {
        console.log("onTriggerEnter")


    }
    onTriggerStay(event: ITriggerEvent) {

        // console.log("onTriggerStay")
        const otherCollider = event.otherCollider;
        //console.log(otherCollider)

        this.moveCollider = false;
        if (!this.attackEnder) {
            this.attack(otherCollider.node)
            this.collidPaling = otherCollider.node;
            this.attackEnder = true;
        }
    }
    onTriggerExit(other: Collider, self: Collider) {
        console.log("onTriggerExit")
    }
    // 通用移动方法
    public moveTo(position: Vec3) {
        if (!this.isAlive) return;

        this.targetPosition = position.clone();
        this.playAnimation('walk', true);
    }
    // 通用移动方法
    public movePost() {
        if (!this.isAlive) return;
        this.moveCollider = true;
        this.playAnimation('walk', true);
    }


    update(deltaTime: number) {
        if (!this.isAlive || !this.moveCollider) return;
        let posz = this.node.position.z - deltaTime * 2;
        this.node.setPosition(new Vec3(this.node.position.x, this.node.position.y, posz))


        // // 计算移动方向
        // const currentPos = this.node.worldPosition;
        // const direction = new Vec3();
        // Vec3.subtract(direction, this.targetPosition, currentPos);

        // // 判断是否到达目标
        // if (direction.lengthSqr() < 0.1) {
        //     this.targetPosition = null;
        //     this.playAnimation('Idle', true);
        //     return;
        // }

        // // 标准化方向向量并移动
        // direction.normalize();
        // direction.multiplyScalar(this.moveSpeed * deltaTime);
        // Vec3.add(currentPos, currentPos, direction);
        // this.node.worldPosition = currentPos;

        // // 面向移动方向
        // this.faceDirection(direction);
    }

    // // 转向移动方向
    // protected faceDirection(direction: Vec3) {
    //     direction.y = 0; // 保持水平旋转
    //     if (direction.lengthSqr() > 0) {
    //         this.node.lookAt(Vec3.add(new Vec3(), this.node.worldPosition, direction));
    //     }
    // }

    // 通用受伤方法
    public takeDamage(damage: number) {
        if (!this.isAlive) return;

        this.health -= damage;
        if (this.health <= 0) {
            this.die();
        }

    }

    // 死亡处理
    public die() {
         this.electricParticle.active = false;
        if (!this.isAlive) return;
        this.isAlive = false;
       
        if (this.node.name == "ElephantPrefab" || this.node.name == "ElephantPrefab-001") {
            DataManager.Instance.soundManager.playElephantSound()
        } else if (this.node.name == "DogPrefab" || this.node.name == "DogPrefab-001") {
            DataManager.Instance.soundManager.playDogSound()
        } else if (this.node.name == "BearPrefab" || this.node.name == "BearPrefab-001") {
            DataManager.Instance.soundManager.playBearSound()
        }
        this.scheduleOnce(() => {

            if (this.dissovleNode.getComponent(DissolveEffect))
                this.dissovleNode.getComponent(DissolveEffect).play(0.8);

        }, 0.5)

        this.playAnimation('die', false, () => {
            if (this.dissovleNode) {
                let dis = this.dissovleNode;



                this.scheduleOnce(() => {
                    this.electricParticle.active = true;
                    this.node.removeFromParent();
                    this.node.destroy(); // 动画结束后销毁
                }, 1)

            } else {
                // if (this.node.name == "ElephantPrefab" || this.node.name == "ElephantPrefab-001") {
                //     DataManager.Instance.soundManager.playElephantSound()
                // } else if (this.node.name == "DogPrefab" || this.node.name == "DogPrefab-001") {
                //     DataManager.Instance.soundManager.playDogSound()
                // } else if (this.node.name == "BearPrefab" || this.node.name == "BearPrefab-001") {
                //     DataManager.Instance.soundManager.playBearSound()
                // }
                this.scheduleOnce(() => {
                    this.isParticle = true;
                    this.node.removeFromParent();
                    this.node.destroy(); // 动画结束后销毁
                }, 1)
            }


        });
    }

    // 骨骼动画控制方法
    protected playAnimation(
        name: string,
        loop: boolean = false,
        onFinished?: () => void
    ) {
        if (!this.skeletalAnim) return;

        // 停止当前动画
        this.skeletalAnim.stop();

        // 播放新动画
        const state = this.skeletalAnim.getState(name);
        if (state) {

            //console.log(`state===== ${state}`)
            //state.wrapMode = loop ? AnimationState.WrapMode.Loop : AnimationState.WrapMode.Normal;
            state.speed = 1.0;

            this.skeletalAnim.play(name);

            // 设置单次动画结束回调
            if (!loop && onFinished) {
                this.skeletalAnim.once(Animation.EventType.FINISHED, onFinished);
            }
        } else {
            console.warn(`Animation clip ${name} not found!`);
        }
    }

    // 攻击方法 (需子类实现具体逻辑)
    public attack(target: any) {
        if (!this.isAlive) return;
        // this.scheduleOnce(() => {
        //     target.getComponent(TopShakeEffect).shake(2);
        // }, 0.5);

        if(this.electricParticle?.active == false){
            if(DataManager.Instance.isMapBesastSatr)
            this.electricParticle.active = true;
        }
        this.playAnimation('attack', false, () => {

            DataManager.Instance.soundManager.playAttackPalingSound();
            if (this.attackEffect) {
                if (this.electricParticle) {
                   // if (this.isParticle) {
                     //   this.isParticle = false;
                        //if (this.electricParticle.active == false) {
                        //this.electricParticle.active = true;
                        //  }
                  //  }

                }
            }
            
            if (target)
                this.scheduleOnce(() => {
                    this.attackEnder = false;
                }, 0.2);
            if (this.enmeyDie) {
                this.scheduleOnce(() => {

                    this.die();
                }, this.enemyTimeDie);
            }
            // this.playAnimation('Idle', true);
            // 子类可在此添加攻击逻辑
        });
    }
}