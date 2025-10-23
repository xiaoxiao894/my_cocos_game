import { _decorator, Animation, Component, Node, SkeletalAnimation, Sprite, tween, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('MeraItem')
export class MeraItem extends Component {
    @property(SkeletalAnimation)
    ani: SkeletalAnimation = null;

    @property(Sprite)
    green: Sprite = null;

    @property(Node)
    bubbleNode: Node = null;

    private _playingAni: string = "base_idle";

    private _rangeMax: number = 1;
    private _rangeNow: number = 0;

    private _soundLimit: number = 5;
    private _soundTime: number = 0;

    start() {
        this.green.fillRange = 0;
    }

    update(dt: number) {

    }

    public addMeat() {
        this._rangeNow++;
        if (this._rangeNow > this._rangeMax) {
            this._rangeNow = this._rangeMax;
        }
        this.green.fillRange = this._rangeNow / this._rangeMax;
    }

    public playIdle() {
        if (this._playingAni !== "idle") {
            this._playingAni = "idle";
            //  this.ani.play("idle");
            this.bubbleNode.active = true;
            this.green.fillRange = 0;
            this._rangeNow = 0;

            const stagbeetle = this.node.parent;
            if (stagbeetle) {
                const stagbeetleAni = stagbeetle.getComponent(Animation);
                if (stagbeetleAni) {
                    stagbeetleAni.play("chongziAT");
                    stagbeetleAni.once(Animation.EventType.FINISHED, () => {
                        this.ani.play("idle");
                    })
                }
            }
        }
    }

    public playOperate() {
        if (this._playingAni !== "attack01") {
            this._playingAni = "attack01";

            const stagbeetle = this.node.parent;
            if (stagbeetle) {
                const stagbeetleAni = stagbeetle.getComponent(Animation);
                if (stagbeetleAni) {
                    stagbeetleAni.play("chongziAT02");
                    stagbeetleAni.once(Animation.EventType.FINISHED, () => {
                        this.ani.play("attack01");
                    })
                }
            }
        }
    }
}


