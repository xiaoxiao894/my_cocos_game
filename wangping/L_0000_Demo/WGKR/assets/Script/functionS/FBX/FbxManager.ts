import { _decorator, Component, Node, SkeletalAnimation } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('FbxManager')
export class FbxManager extends Component {


    private _animName: string[] = [];

    private _cur: number = -1;

    private _skeleta: SkeletalAnimation;

    private func: Function;
    private ctx: unknown;
    protected start(): void {

    }

    init() {
        this._cur = -1;
    }

    private get skeleta() {
        if (!this._skeleta) {
            this._skeleta = this.node.getComponent(SkeletalAnimation);
            let clips = this._skeleta.clips;
            for (let i = 0; i < clips.length; i++) {
                let name = clips[i].name;
                this._animName[i] = name;
            }
        }
        return this._skeleta;
    }

    public setAnimation(skT: number, loop: boolean = true, frame: number = 0) {
        const sk = this.skeleta;
        let aniName = this._animName[skT];
        let animState = sk.getState(aniName);
        if (this._cur == skT) {
            if (!loop || !animState.isPlaying) {
                let time = frame * animState.duration;
                animState.play();
                animState.setTime(time);
            }
        } else {
            if (this._cur != -1) {
                let caniName = this._animName[this._cur];
                let canimState = sk.getState(caniName);
                canimState.stop();
            }
            let time = frame * animState.duration;
            animState.play();
            animState.setTime(time);
            this._cur = skT;
        }
        return animState;
    }

    public getAnimState(skT: number) {
        const sk = this.skeleta;
        let aniName = this._animName[skT];
        let animState = sk.getState(aniName);
        return animState;
    }
    public isCurAnimation(skT: number) {
        return this._cur == skT;
    }

    public setAttackAnimCall(func: Function, ctx: unknown) {
        this.func = func;
        this.ctx = ctx;
    }

    private attack(num: number) {
        // EventManager.instance.emit(EventEnum.Tower_Hero_Attack + this.towerId, num);
        this.ctx ? this.func.apply(this.ctx, [num]) : this.func([num]);
    }

    public get curState() {
        return this._cur;
    }

    public set Rotation_x(value: number) {
        this.node.setRotationFromEuler(value * 30, 0, 0);
    }


}


