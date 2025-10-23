import { Node, Vec3 } from "cc";

export default abstract class JumpSequenceBase {
    protected _time: number = 0;

    public moveOver(dt: number) {
        if (this.delayedTime <= 0) {
            if (this.move(dt)) {
                this.call();
                return true;
            } else {
                return false;
            }
        } else {
            this.delayedTime -= dt;
            return false;
        }
    }

    public remove() {
        this.callFunc.length = 0;
        this.callFunc.length = 0;
        this.delayedTime = 0;
        this._endPowPreFunc = null;
        this._endPowPreTarget = null;
        this._remove();
    }

    protected abstract move(dt: number): boolean;
    protected abstract _remove(): void;

    private callFunc: Function[] = [];
    private target: any[] = [];
    private delayedTime: number = 0;

    /**
     * 添加  运动完成之后的回调函数  可添加多个
     * @param callFunc 回调函数
     * @param target 域
     */
    // 定义一个公共方法，用于在任务完成后调用指定的函数
    public onComplete(callFunc?: Function, target?: any): this {

        // 将传入的函数添加到callFunc数组中
        this.callFunc[this.callFunc.length] = callFunc;
        // 将传入的目标对象添加到target数组中
        this.target[this.callFunc.length] = target;
        // 返回当前对象
        return this;
    }
    /**
     * 设置多长时间后  开始运动
     * @param time 延迟时间
     */
    public setDelay(time: number): this {
        this.delayedTime = time;
        return this;
    }
    private call() {
        for (let j = 0; j < this.callFunc.length; j++) {
            let call: Function = this.callFunc[j];
            let target: any = this.target[j];
            call.apply(target);
        }
    }
    private _endPowPreFunc: Function;
    private _endPowPreTarget: any;

    public setEndPosPre(func: Function, target: any) {
        this._endPowPreFunc = func;
        this._endPowPreTarget = target;
    }
    protected endPosPre(node: Node) {
        if (this._endPowPreFunc) {
            this._endPowPreFunc.apply(this._endPowPreTarget, [node]);
        }
    }

    public get isMoveOver() {
        return this._time == 1;
    }
}





