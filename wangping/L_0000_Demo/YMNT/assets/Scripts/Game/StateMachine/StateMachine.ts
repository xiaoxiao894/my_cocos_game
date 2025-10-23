/**
 * 基础状态接口
 */
interface IState {
    onEnter?(data?: any): void;
    onExit?(data?: any): void;
    onUpdate?(dt: number): void;
}

/**
 * 泛型状态机实现
 * @typeparam T 状态类型，可以是字符串或数字
 */
export class StateMachine<T extends string | number> {
    private _currentState: T | null = null;
    private readonly _states: Map<T, IState> = new Map();
    private _isChangingState = false;
    private _previousState: T | null = null;
    private _isPaused = false;

    /**
     * 创建状态机实例
     * @param config 可选的初始配置
     */
    constructor(config?: { initialState: T, states: Record<T, IState> }) {
        if (config) {
            this.registerStates(config.states);
            setTimeout(() => {
                this.changeState(config.initialState);
            });
        }
    }

    /**
     * 注册多个状态
     * @param states 状态映射对象
     */
    registerStates(states: Record<T, IState>): void {
        for (const [key, state] of Object.entries(states)) {
            this._states.set(key as T, state as IState);
        }
    }

    /**
     * 注册单个状态
     * @param stateKey 状态键
     * @param state 状态对象
     */
    registerState(stateKey: T, state: IState): void {
        this._states.set(stateKey, state);
    }

    /**
     * 删除状态
     * @param stateKey 要删除的状态键
     * @returns 是否成功删除
     */
    removeState(stateKey: T): boolean {
        if (this._currentState === stateKey) {
            console.warn(`不能删除当前活动状态: ${String(stateKey)}`);
            return false;
        }
        return this._states.delete(stateKey);
    }

    /**
     * 切换状态
     * @param newState 新状态
     * @param data 可选的传递数据
     * @returns 是否成功切换
     */
    changeState(newState: T, data?: any): boolean {
        // 检查状态是否存在
        if (!this._states.has(newState)) {
            console.error(`状态 ${String(newState)} 未注册!`);
            return false;
        }

        // 如果已经在变更状态或当前状态相同且不是初始化，则跳过
        if (this._isChangingState || this._currentState === newState) {
            return false;
        }

        this._isChangingState = true;
        const oldState = this._currentState;
        
        try {
            // 执行旧状态退出逻辑
            if (oldState && this._states.has(oldState)) {
                this._states.get(oldState)?.onExit?.(data);
            }

            // 保存前一个状态
            this._previousState = oldState;
            
            // 设置新状态并执行进入逻辑
            this._currentState = newState;
            this._states.get(newState)?.onEnter?.(data);
            
            return true;
        } catch (error) {
            console.error(`状态切换错误: ${error}`);
            return false;
        } finally {
            this._isChangingState = false;
        }
    }

    /**
     * 更新当前状态
     * @param dt 帧间隔时间
     */
    update(dt: number): void {
        if (!this._currentState || this._isChangingState || this._isPaused) {
            return;
        }
        
        try {
            this._states.get(this._currentState)?.onUpdate?.(dt);
        } catch (error) {
            console.error(`状态更新错误: ${error}`);
        }
    }

    /**
     * 返回到前一个状态
     * @param data 可选的传递数据
     * @returns 是否成功返回
     */
    returnToPreviousState(data?: any): boolean {
        if (this._previousState) {
            return this.changeState(this._previousState, data);
        }
        return false;
    }

    /**
     * 检查指定状态是否已注册
     * @param stateKey 状态键
     */
    hasState(stateKey: T): boolean {
        return this._states.has(stateKey);
    }

    /**
     * 暂停状态机更新
     */
    pause(): void {
        this._isPaused = true;
    }

    /**
     * 恢复状态机更新
     */
    resume(): void {
        this._isPaused = false;
    }

    /**
     * 重置状态机
     */
    reset(): void {
        if (this._currentState) {
            this._states.get(this._currentState)?.onExit?.();
        }
        this._currentState = null;
        this._previousState = null;
        this._isChangingState = false;
        this._isPaused = false;
    }

    /** 获取当前状态 */
    get currentState(): T | null {
        return this._currentState;
    }

    /** 获取前一个状态 */
    get previousState(): T | null {
        return this._previousState;
    }

    /** 获取是否暂停 */
    get isPaused(): boolean {
        return this._isPaused;
    }

    /** 获取所有已注册状态键 */
    get stateKeys(): T[] {
        return Array.from(this._states.keys());
    }
}