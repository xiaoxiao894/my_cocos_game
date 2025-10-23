import { _decorator, Component, Node, tween, UIOpacity, Vec3 } from 'cc';
import { DataManager } from '../Global/DataManager';
import super_html_playable from '../../super_html_playable';
//import Platform from '../Common/Platform';
// const google_play = "https://play.google.com/store/apps/details?id=com.funplus.ts.global";
// const appstore = "https://play.google.com/store/apps/details?id=com.funplus.ts.global";

const { ccclass, property } = _decorator;

@ccclass('GameEndManager')
export class GameEndManager extends Component {


// ;
// super_html_playable.set_app_store_url(appstore);
    @property(Node)
    bg: Node = null;

    @property(Node)
    icon: Node = null;

    @property(Node)
    download: Node = null;

    // @property(Node)
    // win: Node = null;

    @property(Node)
    hand: Node = null;

    start() {
       // DataManager.Instance.gameEndManager = this;

        this.node.active = false;
        this.init();
        this.playFingerAndButtonAnim();
    }

    init() {
        this.hand.active = false;
        this.node.active = true;
        // 背景淡入
        const opacityCom = this.bg.getComponent(UIOpacity) || this.bg.addComponent(UIOpacity);
        opacityCom.opacity = 0;
        tween(opacityCom)
            .to(0.1, { opacity: 150 })
            .start();

        // 初始缩放
        this.icon.setScale(0, 0, 0);
        this.download.setScale(0, 1, 1);

        tween(this.icon)
            .to(0.25, { scale: new Vec3(2.2, 2.2, 2.2) })
            .to(0.3, { scale: new Vec3(2, 2, 2) })
            .start();

        tween(this.download)
            .delay(0.25)
            .to(0.25, { scale: new Vec3(1.1, 1.1, 1.1) })
            .to(0.3, { scale: new Vec3(1, 1, 1) })
            .call(
                () => {
                    this.hand.active = true;
                }
            )
            .start();

    }

    // 手指+按钮循环提示动画
    playFingerAndButtonAnim() {
       // this.hand.active = true;
        // 手指动画（0.9 -> 1 循环）
        tween(this.hand)
            .repeatForever(
                tween()
                    .to(0.3, { scale: new Vec3(0.4, 0.4,0.4) })
                    .to(0.3, { scale: new Vec3(0.5, 0.5, 0.5) })
            )
            .start();

        // 按钮点击提示动画（1.0 -> 1.1 -> 1.0 循环）
        // tween(this.download)
        //     .repeatForever(
        //         tween()
        //             .to(0.3, { scale: new Vec3(1.1, 1.1, 1.1) })
        //             .to(0.3, { scale: new Vec3(1, 1, 1) })
        //     )
        //     .start();
    }
    platformBtnEvent(){
        console.log("点击下载");
       // Platform.instance.jumpStore();
      // super_html_playable.set_google_play_url(google_play);
       super_html_playable.download();
    }

}


