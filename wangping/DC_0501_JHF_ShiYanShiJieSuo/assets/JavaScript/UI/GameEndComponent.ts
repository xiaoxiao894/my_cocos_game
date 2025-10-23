import { _decorator, Component, Node, tween, UITransform, Vec3 } from 'cc';
import Platform from '../Common/Platform';
import { SoundManager } from '../Common/SoundManager';
import super_html_playable from '../Common/super_html_playable';
const { ccclass, property } = _decorator;

@ccclass('GameEndComponent')
export class GameEndComponent extends Component {
    @property(Node)
    mainNode: Node = null;
    @property(Node)
    iconNode: Node = null;
    @property(Node)
    btnNode: Node = null;

    @property(Node)
    glft: Node = null;

    @property(Node)
    center: Node = null;

    @property(Node)
    line: Node = null;

    @property(Node)
    victory: Node = null;

    @property(Node)
    hand: Node = null;

    start() {
        // this.mainNode.active = false;

        // this.scheduleOnce(() => {
        //     if (!this || !this.mainNode) {
        //         return;
        //     }
        //     this.mainNode.active = true;
        //     this.btnNode.active = false;
        //     // this.iconNode.setScale(1, 1);
        //     // tween(this.iconNode).to(0.1, { scale: new Vec3(2.1, 2.1, 1) }).to(0.1, { scale: new Vec3(2, 2, 1) }).call(() => {
        //     //     this.btnNode.active = true;
        //     //     tween(this.btnNode).to(0.2, { scale: new Vec3(2.3, 2.3, 1) }).to(0.1, { scale: new Vec3(2, 2, 1) }).start();
        //     // }).start();
        // }, 2.6);
        this.hand.active = false;
        this.playElasticScaleX(this.victory, 0.8);
        this.glft.setScale(new Vec3(0, 1, 1));
        this.scheduleOnce(() => {
            this.playElasticScaleX(this.glft, 0.8);
        }, .3)
        this.btnNode.setScale(new Vec3(0, 1, 1));
        this.scheduleOnce(() => {
            this.playElasticScaleX(this.btnNode, 0.8);

            this.hand.setScale(0, 0, 0);
            this.hand.active = true;
            tween(this.hand)
                .delay(0.4)
                .to(0.1, { scale: new Vec3(1.3, 1.3, 1) })
                .call(() => {
                    this.playHandClickButton(); // 启动手指点击按钮动画
                })
                .start()

        }, .6)

        this.playCenterAni();
        SoundManager.inst.playAudio("DC_shengli");
    }

    playCenterAni() {
        const duration = 0.1;
        const delayStep = 0.1;

        for (let i = 0; i < this.center.children.length; i++) {
            const child = this.center.children[i];
            child.setScale(new Vec3(0, 1, 1));
            tween(child)
                .delay(i * delayStep)  // 顺序弹出
                .to(duration, { scale: new Vec3(1.1, 1.1, 1.1) }, { easing: 'quadOut' })
                .to(duration, { scale: new Vec3(1, 1, 1) }, { easing: 'quadIn' })
                .call(() => {
                    if (i == 4) {
                        tween(this.line)
                            .to(0.5, { scale: new Vec3(1, 1, 1) })
                            .start();
                    }
                })
                .start();
        }
    }


    /**
        * 弹性横向缩放动画（从 X=0 到 X=1）
        * @param target 目标节点
        * @param duration 动画时间
        * @param onComplete 完成回调（可选）
        */
    playElasticScaleX(target: Node, duration: number = 0.8, onComplete?: () => void) {
        // 初始横向缩放为0，其他维度正常
        target.setScale(new Vec3(0, 1, 1));

        tween(target)
            .to(duration, { scale: new Vec3(1, 1, 1) }, { easing: 'elasticOut' }) // 弹性缓动
            .call(() => {
                if (onComplete) onComplete();
            })
            .start();
    }

    private playHandClickButton() {
        if (!this.hand || !this.btnNode) return;

        // 将手指移动到按钮上方一点
        const btnWorldPos = this.btnNode.getWorldPosition();
        // const handWorldPos = btnWorldPos.clone();
        // handWorldPos.y += 50; // 手指稍高于按钮

        // // 转换到 hand 父节点的本地坐标
        // const localPos = this.hand.parent!
        //     .getComponent(UITransform)!
        //     .convertToNodeSpaceAR(handWorldPos);

        // 手指定位
        // this.hand.setPosition(localPos);
        this.hand.setScale(new Vec3(1.3,1.3,1));
        this.btnNode.setScale(Vec3.ONE);

        // 播放点击动画
        tween(this.hand)
            .delay(0.2)
            .to(0.3, { scale: new Vec3(1.04, 1.04, 1) }) // 手指压下
            .call(() => {
                // 按钮压下
                // tween(this.btnNode)
                //     .to(0.1, { scale: new Vec3(0.9, 0.9, 1) }) // 按钮压下
                //     .to(0.1, { scale: new Vec3(1, 1, 1) })     // 按钮弹起
                //     .start();
            })
            .to(0.3, { scale: new Vec3(1.3, 1.3, 1) }) // 手指弹起
            // .delay(0.6)
            .call(() => {
                this.playHandClickButton(); // 循环点击
            })
            .start();
    }



    update(deltaTime: number) {

    }

    private onJumpClick() {
        super_html_playable.download();
    }
}


