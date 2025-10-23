import { _decorator, Component } from 'cc';
import { StateMachine } from '../StateMachine/StateMachine';
import { CharacterState } from '../../common/CommonEnum';
import { ComponentEvent } from '../../common/ComponentEvents';
import { BaseComponet } from './BaseComponet';

const { ccclass, property } = _decorator;

/**
 * 状态组件 - 管理角色状态机相关功能
 */
@ccclass('StateComponent')
export class StateComponent extends BaseComponet {
    /** 状态机实例 */
    private stateMachine: StateMachine<CharacterState> = null!;

    /** 状态进入回调映射 */
    private stateEnterCallbacks: Map<CharacterState, Function> = new Map();
    /** 状态更新回调映射 */
    private stateUpdateCallbacks: Map<CharacterState, Function> = new Map();
    /** 状态退出回调映射 */
    private stateExitCallbacks: Map<CharacterState, Function> = new Map();

    onLoad() {
        super.onLoad();
        this.initStateMachine();
        this.registerEvents();
    }

    onDestroy() {
        this.unregisterEvents();
    }

    /**
     * 注册事件监听
     */
    private registerEvents() {
        // 监听状态改变事件
        this.node.on(ComponentEvent.CHANGE_STATE, this.onChangeState, this);
    }

    /**
     * 注销事件监听
     */
    private unregisterEvents() {
        this.node.off(ComponentEvent.CHANGE_STATE, this.onChangeState, this);
    }

    /**
     * 处理状态改变事件
     */
    private onChangeState(state: CharacterState) {
        this.changeState(state);
    }

    /**
     * 初始化状态机
     */
    private initStateMachine() {
        this.stateMachine = new StateMachine<CharacterState>({
            initialState: CharacterState.Idle,
            states: {
                [CharacterState.Idle]: {
                    onEnter: this.onStateEnter.bind(this, CharacterState.Idle),
                    onUpdate: this.onStateUpdate.bind(this, CharacterState.Idle)
                },
                [CharacterState.Move]: {
                    onEnter: this.onStateEnter.bind(this, CharacterState.Move),
                    onUpdate: this.onStateUpdate.bind(this, CharacterState.Move),
                    onExit: this.onStateExit.bind(this, CharacterState.Move)
                },
                [CharacterState.Attack]: {
                    onEnter: this.onStateEnter.bind(this, CharacterState.Attack),
                    onUpdate: this.onStateUpdate.bind(this, CharacterState.Attack),
                    onExit: this.onStateExit.bind(this, CharacterState.Attack)
                },
                [CharacterState.Skill]: {
                    onEnter: this.onStateEnter.bind(this, CharacterState.Skill),
                    onUpdate: this.onStateUpdate.bind(this, CharacterState.Skill),
                    onExit: this.onStateExit.bind(this, CharacterState.Skill)
                },
                [CharacterState.Dead]: {
                    onEnter: this.onStateEnter.bind(this, CharacterState.Dead),
                    onUpdate: this.onStateUpdate.bind(this, CharacterState.Dead)
                }
            }
        });
    }

    /**
     * 设置状态进入回调
     * @param state 状态
     * @param callback 回调函数
     */
    public setStateEnterCallback(state: CharacterState, callback: Function) {
        this.stateEnterCallbacks.set(state, callback);
    }

    /**
     * 设置状态更新回调
     * @param state 状态
     * @param callback 回调函数
     */
    public setStateUpdateCallback(state: CharacterState, callback: Function) {
        this.stateUpdateCallbacks.set(state, callback);
    }

    /**
     * 设置状态退出回调
     * @param state 状态
     * @param callback 回调函数
     */
    public setStateExitCallback(state: CharacterState, callback: Function) {
        this.stateExitCallbacks.set(state, callback);
    }

    /**
     * 状态进入回调
     * @param state 状态
     */
    private onStateEnter(state: CharacterState) {
        const callback = this.stateEnterCallbacks.get(state);
        if (callback) {
            callback();
        }
        
        // 发送状态改变事件
        this.node.emit(ComponentEvent.STATE_CHANGED, state);
    }

    /**
     * 状态更新回调
     * @param state 状态
     * @param dt 时间间隔
     */
    private onStateUpdate(state: CharacterState, dt: number) {
        const callback = this.stateUpdateCallbacks.get(state);
        if (callback) {
            callback(dt);
        }
    }

    /**
     * 状态退出回调
     * @param state 状态
     */
    private onStateExit(state: CharacterState) {
        const callback = this.stateExitCallbacks.get(state);
        if (callback) {
            callback();
        }
    }

    /**
     * 更新状态机
     * @param dt 时间间隔
     */
    update(dt: number) {
        if (this.stateMachine) {
            this.stateMachine.update(dt);
        }
    }

    /**
     * 改变状态
     * @param state 目标状态
     */
    public changeState(state: CharacterState) {
        if (this.stateMachine && this.stateMachine.currentState !== state) {
            this.stateMachine.changeState(state);
        }
    }

    /**
     * 获取当前状态
     * @returns 当前状态
     */
    public getCurrentState(): CharacterState {
        return this.stateMachine ? this.stateMachine.currentState! : CharacterState.Idle;
    }

    /**
     * 判断是否处于指定状态
     * @param state 要检查的状态
     * @returns 是否处于该状态
     */
    public isInState(state: CharacterState): boolean {
        return this.stateMachine && this.stateMachine.currentState === state;
    }

    /**
     * 重置状态机到初始状态
     */
    public reset() {
        if (this.stateMachine) {
            this.stateMachine.changeState(CharacterState.Idle);
        }
    }
} 