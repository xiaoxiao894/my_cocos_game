import { _decorator, Component, Node, tween, Vec3 } from 'cc';
import { DataManager } from '../Global/DataManager';
const { ccclass, property } = _decorator;

@ccclass('ConveyerBeltManager')
export class ConveyerBeltManager extends Component {
    @property(Node)
    chuansongdai: Node = null;

    @property(Node)
    mianqian: Node = null;

    @property
    private delayBetween: number = 0.1;

    @property
    private scaleUp: number = 1.2;

    @property
    private scaleEnd: number = 1.0;

    @property
    private duration: number = 0.3; // 总时长（放大+缩小）

    start() {
        DataManager.Instance.conveyerBeltManager = this;
    }

    init() {
        this.scheduleOnce(() => {
            this.chuansongdaiAni();
            this.mianqianAni();
        })
    }

    chuansongdaiAni() {
        const children = this.chuansongdai.children;
        const halfDur = this.duration / 2;

        for (let i = 0; i < children.length; i++) {
            const child = children[i];
            const delay = i * this.delayBetween;

            tween(child)
                .delay(delay)
                .to(halfDur, { scale: new Vec3(this.scaleUp, this.scaleUp, this.scaleUp), position: new Vec3(child.position.x, 0.025, child.position.z) }, { easing: 'quadOut' })
                .to(halfDur, { scale: new Vec3(this.scaleEnd, this.scaleEnd, this.scaleEnd) }, { easing: 'quadIn' })
                .start();
        }
    }

    mianqianAni() {
        const children = this.mianqian.children;
        const halfDur = this.duration / 2;

        for (let i = 0; i < children.length; i++) {
            const child = children[i];
            const delay = i * this.delayBetween;

            const baseScale = new Vec3(40, 40, 40); // 初始缩放
            const peakScale = new Vec3(40, 40, 44); // 抛物线顶点

            // 强制设置初始 x/y = 40
            // child.setScale(baseScale);

            tween(child)
                .delay(delay)
                .to(halfDur, { scale: peakScale }, { easing: 'quadOut' })
                .to(halfDur, { scale: baseScale }, { easing: 'quadIn' })
                .start();
        }
    }
}


