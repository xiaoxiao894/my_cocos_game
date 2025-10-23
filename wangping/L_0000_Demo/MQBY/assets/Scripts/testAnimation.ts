import { _decorator, Component, Node, SkeletalAnimation } from 'cc';
const { ccclass, property } = _decorator;

// 测试动画用，轮流播放对应组件里的所有动画
@ccclass('testAnimation')
export class testAnimation extends Component {
    @property({
        type: SkeletalAnimation,
        displayName: '动画',
    })
    private anim: SkeletalAnimation = null;

    private _playAnimIndex: number = 0;
    private _allAnimNames: string[] = [];

    protected onLoad(): void {
        if (!this.anim) return;
        const clips = this.anim.clips;
        this._allAnimNames = clips.map(clip => clip.name);
        this._playAnimIndex = 0;
        // 非循环动画，会触发FINISHED事件
        this.anim.on(SkeletalAnimation.EventType.FINISHED, this.onAnimFinished, this);
        // 循环动画，则使用LASTFRAME事件
        this.anim.on(SkeletalAnimation.EventType.LASTFRAME, this.onAnimFinished, this);        
    }

    private onAnimFinished() {
        this._playAnimIndex++;
        if (this._playAnimIndex >= this._allAnimNames.length) {
            this._playAnimIndex = 0;
        }
        this.anim.play(this._allAnimNames[this._playAnimIndex]);
    }

    start() {
        this.anim.play(this._allAnimNames[this._playAnimIndex]);
    }

    update(deltaTime: number) {

    }
}


