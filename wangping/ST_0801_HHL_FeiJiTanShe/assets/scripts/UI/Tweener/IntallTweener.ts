import { _decorator, Component, Node, Tween, tween, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('IntallTweener')
export class IntallTweener extends Component {

    @property(Node)
    title: Node

    @property(Node)
    box: Node

    @property(Node)
    installBtn: Node

    @property(Node)
    light: Node

    @property(Node)
    gift: Node

    _t1: Tween
    _t2: Tween

    start() {
    }

    protected onEnable(): void {

        this.title.scale.set(0,0,0);
        this.box.scale.set(0,0,0);
        this.installBtn.scale.set(0,0,0);


        tween(this.title).to(0.3, {
            scale: new Vec3(1, 1, 1)
        }, {
            easing: "backOut"
        }).start();

        tween(this.box).delay(0.2).to(0.3, {
            scale: new Vec3(1, 1, 1)
        }, {
            easing: "backOut"
        }).start();

        tween(this.installBtn).delay(0.4).to(0.3, {
            scale: new Vec3(1, 1, 1)
        }, {
            easing: "backOut"
        }).start();


        const t1 = tween(this.light).to(5, {
            eulerAngles: new Vec3(0, 0, 360),
        }).to(0, {
            eulerAngles: new Vec3(0, 0, 0),
        }).union().repeatForever().start();

        const t2 = tween(this.gift).to(0.2, {
            eulerAngles: new Vec3(0, 0, 5),
        }).to(0.2, {
            eulerAngles: new Vec3(0, 0, -5),
        }).union().repeatForever().start();

        this._t1 = t1;
        this._t2 = t2;
    }

    protected onDisable(): void {

        if (this._t1 != null) {
            this._t1.stop();
            this._t1 = null;
        }

        if (this._t2 != null) {
            this._t2.stop();
            this._t2 = null;
        }
    }

    update(deltaTime: number) {
    }
}

