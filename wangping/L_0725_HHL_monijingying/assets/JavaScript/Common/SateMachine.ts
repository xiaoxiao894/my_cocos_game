import State from "../Player/PlayerState/State";



export default class StateMachine {
    private currentState: State | null = null;
    private states: { [key: string]: State } = {};

    addState(name: string, state: State): void {
        this.states[name] = state;
    }

    setState(name: string,callback?: (...agrs:unknown[]) => void): void {
        if (this.currentState) {
            this.currentState.onExit(callback);
        }
        this.currentState = this.states[name];
        if (this.currentState) {
            this.currentState.onEnter(callback);
        }
    }
    getState() {
        return this.currentState
    }

    getStateName(): string | null {
    for (const name in this.states) {
        if (this.states[name] === this.currentState) {
            return name;
        }
    }
    return null;
}

    update(dt: number): void {
        if (this.currentState) {
            this.currentState.onUpdate(dt);
        }
    }
}