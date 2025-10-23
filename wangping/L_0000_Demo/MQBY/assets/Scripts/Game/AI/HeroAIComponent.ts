import { _decorator, Node, v3, Vec3 } from 'cc';
import { BaseAIComponent } from './BaseAIComponent';
import { StateMachine } from '../StateMachine/StateMachine';
import { ComponentEvent } from '../../common/ComponentEvents';
import { CharacterState } from '../../common/CommonEnum';

const { ccclass, property } = _decorator;

export enum HeroAIState {
    Idle = 'idle',
    Attack = 'attack',
    Dead = 'dead',
}

@ccclass('HeroAIComponent')
export class HeroAIComponent extends BaseAIComponent {

    private _stateMachine: StateMachine<HeroAIState> = new StateMachine<HeroAIState>();

    onLoad() {
        super.onLoad();
        this.reset();
    }

    update(dt: number): void {
        super.update(dt);
        if(!this.aiEnabled) return;
        this._stateMachine.update(dt);
    }

    public reset(){
        this._stateMachine.reset();
        this.setupStateMachine();
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
        this._stateMachine.changeState(HeroAIState.Dead);
    }
    
    protected makeDecision(): void {
        // 如果角色已死亡，不进行决策
        if (this.character.stateComponent.getCurrentState() === CharacterState.Dead) {
            return;
        }

        switch (this._stateMachine.currentState) {
            case HeroAIState.Idle:
                const target = this.character.GetAttackTarget();
                if(target && this.character.attackComponent.canAttack()){
                    this._stateMachine.changeState(HeroAIState.Attack);
                }
                break;
            case HeroAIState.Attack:
                break;
            case HeroAIState.Dead:
                // 死亡状态不需要做任何决策
                break;
        }
    }

    protected setupStateMachine(): void {

        this._stateMachine.registerState(HeroAIState.Idle, {
            onEnter: () => this.onIdleEnter(),
            onUpdate: (dt: number) => this.onIdleUpdate(dt),
            onExit: () => this.onIdleExit(),
        });

        this._stateMachine.registerState(HeroAIState.Attack, {
            onEnter: () => this.onAttackEnter(),
            onUpdate: (dt: number) => this.onAttackUpdate(dt),
            onExit: () => this.onAttackExit(),
        });

        this._stateMachine.registerState(HeroAIState.Dead, {
            onEnter: () => this.onDeadEnter(),
            onUpdate: (dt: number) => this.onDeadUpdate(dt),
            onExit: () => this.onDeadExit(),
        });
        
        this._stateMachine.changeState(HeroAIState.Idle);
    }

    //#region 状态回调
    private onIdleEnter(): void { }
    private onIdleUpdate(dt: number): void { }
    private onIdleExit(): void { }
    private onAttackEnter(): void {
        // AI决定攻击，让角色执行攻击
        this.character.attack();
    }
    private onAttackUpdate(dt: number): void {
        const currentTarget = this.character.GetAttackTarget();
        if(!currentTarget){
            this._stateMachine.changeState(HeroAIState.Idle);
        }else{
            if(this.character.attackComponent.canAttack() ){
                this.character.attack();
            }
        }
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