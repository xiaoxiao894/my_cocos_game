import { _decorator, Color, color, ICollisionEvent, ITriggerEvent, Node, tween, UIOpacity, Vec3, PhysicsSystem, geometry } from 'cc';
import { Character } from './Character';
import { ComponentEvent } from '../../common/ComponentEvents';
import { EnemyAIComponent } from '../AI/EnemyAIComponent';
import { CharacterState, PHY_GROUP } from '../../common/CommonEnum';
import { DamageData } from '../../common/CommonInterface';
import { HealthComponent } from '../Components/HealthComponent';
import { DropComponent } from '../Components/DropComponent';

const { ccclass, property } = _decorator;

/**
 * 敌人角色类 - 展示重构后的事件系统使用
 */
@ccclass('Enemy')
export class Enemy extends Character {
    @property(EnemyAIComponent)
    ai: EnemyAIComponent = null!;

    @property(DropComponent)
    dropComponent: DropComponent = null!;

    @property({ displayName: '是否精英' })
    public isElite: boolean = false;

    onLoad(): void {
        super.onLoad();
    }

    protected start(): void {
        super.start();
    }

    protected initComponents() {
        super.initComponents();
    }

    protected onCollisionEnter(event: ICollisionEvent): void {
        if (event.otherCollider.getGroup() == PHY_GROUP.WALL) {
            this.ai.canAttackDoor = true;
            this.node.emit(ComponentEvent.STOP_MOVING);
        }
    }

    protected onCollisionExit(event: ICollisionEvent): void {
        if (event.otherCollider.getGroup() == PHY_GROUP.WALL) {
            this.ai.canAttackDoor = false;
        }
    }

    onTriggerEnter(event: ITriggerEvent): void {
        if (event.otherCollider.getGroup() == PHY_GROUP.WALL) {
            this.ai.canAttackDoor = true;
            this.node.emit(ComponentEvent.STOP_MOVING);
        }
    }

    onTriggerExit(event: ITriggerEvent): void {
        if (event.otherCollider.getGroup() == PHY_GROUP.WALL) {
            this.ai.canAttackDoor = false;
        }
    }

    protected onAttackEnter(): void {
        super.onAttackEnter();
        this.move(Vec3.ZERO);
    }

    protected registerComponentEvents() {
        super.registerComponentEvents();

        // 注册目标追踪组件事件（无需设置回调函数）
        // 目标追踪组件现在通过事件与其他组件通信
    }

    protected registerEvents() {
        super.registerEvents();

        // 监听组件初始化完成事件
        this.node.on(ComponentEvent.COMPONENT_INITIALIZED, this.onComponentInitialized, this);
    }

    protected unregisterEvents() {
        super.unregisterEvents();

        this.node.off(ComponentEvent.COMPONENT_INITIALIZED, this.onComponentInitialized, this);
    }

    /**
     * 组件初始化完成回调
     */
    private onComponentInitialized() {
        // 所有组件都已初始化并注册了事件监听
        // 可以开始使用事件系统进行组件间通信
        console.log('敌人组件初始化完成，事件系统已准备就绪');
    }

    protected onTargetReached(): void {
        // 精英没有碰撞，走到位置就可以打
        if (this.isElite) {
            this.ai.canAttackDoor = true;
        }
    }

    /**
     * 设置目标（通过事件）
     */
    public setTarget(target: any) {
        // 通过事件设置目标，而不是直接调用组件方法
        this.node.emit(ComponentEvent.SET_TARGET, target);
    }

    /**
     * 清除目标（通过事件）
     */
    public clearTarget() {
        // 通过事件清除目标
        this.node.emit(ComponentEvent.CLEAR_TARGET);
    }

    _attackTarget: Node | null = null;
    public setAttackTarget(target: Node) {
        this._attackTarget = target;
    }

    public GetAttackTarget(): Node | null {
        if (this._attackTarget) {
            return this._attackTarget;
        }
        // 修改为可攻击门和城墙，通过外部设定
        // // 本项目的敌人只需要攻击一个基地大门
        // let door = manager.game.doorNode;
        // if (door) {
        //     return door;
        // }
        return null;
    }

    protected onMoveStateUpdate(isMoving: boolean): void {
        const curState = this.stateComponent.getCurrentState();
        if (curState === CharacterState.Dead) {
            return;
        }

        // 敌人攻击时不移动
        if (curState === CharacterState.Attack) {
            return;
        }

        // Character基类中移动会打断攻击
        if (isMoving) {
            if (curState != CharacterState.Move) {
                this.stateComponent.changeState(CharacterState.Move);
            }
        } else {
            if (curState != CharacterState.Idle) {
                this.stateComponent.changeState(CharacterState.Idle);
            }
        }
    }

    protected onPerformAttack(damageData: DamageData): void {
        super.onPerformAttack(damageData);
        let target = this.GetAttackTarget();
        if (target) {
            let healthCom = target.getComponent(HealthComponent);
            if (healthCom) {
                healthCom.takeDamage(damageData);
            }
        }
    }

    protected onDead(): void {
        super.onDead();
        if (Math.random() > 0.3) {
            app.audio.playEffect('resources/MQBY/蜘蛛死亡');
        }

        // 生成掉落物品
        if (this.dropComponent) {
            const position = this.node.getWorldPosition();
            this.dropComponent.generateDrops(position);
        }

        const rigidBody = this.movementComponent.getRigidBody();

        // 禁用刚体和碰撞器
        this.scheduleOnce(() => {
            if (this.collider) {
                this.collider.enabled = false;
            }

            if (rigidBody) {
                rigidBody.enabled = false;
            }
        }, 0.3);


        // 移除敌人
        this.scheduleOnce(() => {
            manager.enemy.removeEnemy(this.node);
        }, 1.5);
    }

    public reset(): void {
        super.reset();
        this.ai.reset();
        const rigidBody = this.movementComponent.getRigidBody();
        if (this.collider) {
            this.collider.enabled = true;
        }

        if (rigidBody) {
            rigidBody.enabled = true;
        }
    }
} 