import { _decorator, Component } from "cc";

const { ccclass, property } = _decorator;
@ccclass('UnityUpComponent')
export abstract class UnityUpComponent extends Component {
    public static isStop: boolean = false;

    private _scale: number = 1;

    public set scale(value: number) {
        this._scale = value;
        this._scale = Math.max(0, this._scale);
        this._scale = Math.min(1, this._scale);
    }


    protected update(dt: number): void {
        //控制自己所有脚本的 更新 
        if (UnityUpComponent.isStop) {
            return;
        }
        this._update(dt);
    }

    protected abstract _update(dt: number): void;


}