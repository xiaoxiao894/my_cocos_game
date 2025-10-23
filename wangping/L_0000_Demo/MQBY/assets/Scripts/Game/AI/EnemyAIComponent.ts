import { _decorator, Node, v3, Vec3 } from 'cc';
import { BaseAIComponent } from './BaseAIComponent';
import { StateMachine } from '../StateMachine/StateMachine';
import { ComponentEvent } from '../../common/ComponentEvents';
import { CharacterState } from '../../common/CommonEnum';

const { ccclass, property } = _decorator;

export enum EnemyAIState {
    Idle = 'idle',
    MoveToTarget = 'moveToTarget',
    Attack = 'attack',
    Dead = 'dead',
}

@ccclass('EnemyAIComponent')
export class EnemyAIComponent extends BaseAIComponent {

    private _stateMachine: StateMachine<EnemyAIState> = new StateMachine<EnemyAIState>();

    onLoad() {
        super.onLoad();
        this.reset();
    }

    update(dt: number): void {
        super.update(dt);
        if (!this.aiEnabled) return;
        this._stateMachine.update(dt);
    }

    public reset() {
        this._stateMachine.reset();
        this.setupStateMachine();
        this.aiEnabled = true;
        this._canAttackDoor = false;
    }

    protected registerEvents(): void {
        super.registerEvents();
        // 监听角色死亡事件
        this.character.healthComponent.node.on(ComponentEvent.DEAD, this.onCharacterDead, this);
    }

    protected unregisterEvents(): void {
        super.unregisterEvents();
        // 取消监听角色死亡事件
        this.character.healthComponent.node.off(ComponentEvent.DEAD, this.onCharacterDead, this);
    }

    /**
     * 角色死亡事件处理
     */
    private onCharacterDead(): void {
        this._stateMachine.changeState(EnemyAIState.Dead);
    }

    _canAttackDoor: boolean = false;
    set canAttackDoor(value: boolean) {
        this._canAttackDoor = value;
    }

    protected makeDecision(): void {
        // 如果角色已死亡，不进行决策
        if (this.character.stateComponent.getCurrentState() === CharacterState.Dead) {
            return;
        }

        switch (this._stateMachine.currentState) {
            case EnemyAIState.Idle:
                this._stateMachine.changeState(EnemyAIState.MoveToTarget);
                break;
            case EnemyAIState.MoveToTarget:
                const target = this.character.GetAttackTarget();
                if (target) {
                    if (this._canAttackDoor && this.character.attackComponent.canAttack()) {
                        this._stateMachine.changeState(EnemyAIState.Attack);
                    }
                    else {
                        const targetWpos = target.getWorldPosition();
                        // // 攻击墙的单位，移动目标需要宽一点，不要集中到墙的节点位置上去
                        // if(targetWpos.x < -5 || targetWpos.x > 5) {

                        // }
                        this.character.movementComponent.moveToWorldPosition(targetWpos);
                    }
                }
                break;
            case EnemyAIState.Attack:
                if (this.character.attackComponent.isCooling) {
                    return;
                }
                const currentTarget = this.character.GetAttackTarget();
                if (!currentTarget) {
                    this._stateMachine.changeState(EnemyAIState.Idle);
                } else {
                    if (this.canAttackDoor && this.character.attackComponent.canAttack()) {
                        this.character.attack();
                    }
                    else {
                        // 判定目标是否还在射程范围内，不在射程范围内则切换状态向目标移动
                        const distance = Vec3.distance(this.character.node.getWorldPosition(), currentTarget.getWorldPosition());
                        if (distance > this.character.attackComponent.attackRangeValue) {
                            this._stateMachine.changeState(EnemyAIState.MoveToTarget);
                        }
                    }
                }
                break;
            case EnemyAIState.Dead:
                // 死亡状态不需要做任何决策
                break;
        }
    }

    protected setupStateMachine(): void {

        this._stateMachine.registerState(EnemyAIState.Idle, {
            onEnter: () => this.onIdleEnter(),
            onUpdate: (dt: number) => this.onIdleUpdate(dt),
            onExit: () => this.onIdleExit(),
        });

        this._stateMachine.registerState(EnemyAIState.MoveToTarget, {
            onEnter: () => this.onMoveToTargetEnter(),
            onUpdate: (dt: number) => this.onMoveToTargetUpdate(dt),
            onExit: () => this.onMoveToTargetExit(),
        });

        this._stateMachine.registerState(EnemyAIState.Attack, {
            onEnter: () => this.onAttackEnter(),
            onUpdate: (dt: number) => this.onAttackUpdate(dt),
            onExit: () => this.onAttackExit(),
        });

        this._stateMachine.registerState(EnemyAIState.Dead, {
            onEnter: () => this.onDeadEnter(),
            onUpdate: (dt: number) => this.onDeadUpdate(dt),
            onExit: () => this.onDeadExit(),
        });

        this._stateMachine.changeState(EnemyAIState.Idle);
    }

    //#region 状态回调
    private onIdleEnter(): void { }
    private onIdleUpdate(dt: number): void { }
    private onIdleExit(): void { }

    private onMoveToTargetEnter(): void { }
    private onMoveToTargetUpdate(dt: number): void { }
    private onMoveToTargetExit(): void { }

    private onAttackEnter(): void {
        // AI决定攻击，让角色执行攻击
        this.character.attack();
    }
    private onAttackUpdate(dt: number): void {
        // const currentTarget = this.character.GetAttackTarget();
        // if (currentTarget) {
        //     // 朝向目标
        //     const currentPos = this.node.getWorldPosition();
        //     const targetPos = this.currentTarget.node.getWorldPosition();
        //     const direction = new Vec3();
        //     Vec3.subtract(direction, targetPos, currentPos);
        //     direction.normalize();
            
        //     this.node.emit(ComponentEvent.SET_FACE_DIRECTION_FROM_3D, direction);
        // }
    }
    private onAttackExit(): void { }

    private onDeadEnter(): void {
        // 停用AI
        this.aiEnabled = false;
    }
    private onDeadUpdate(dt: number): void { }
    private onDeadExit(): void {
        // 重新启用AI（如果需要复活逻辑）
        this.aiEnabled = true;
    }
    //#endregion

    //#region 公用方法
    //#endregion
} 