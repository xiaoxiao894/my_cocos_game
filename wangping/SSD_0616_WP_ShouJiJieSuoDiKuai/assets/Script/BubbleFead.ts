import { _decorator, Component, Node, tween, UIOpacity, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('BubbleFead')
export class BubbleFead extends Component {
    @property({ type: Node, tooltip: "升级节点1" })
    imageFead: Node[] = [];
    private isFead: boolean = false;

    protected onLoad(): void {
        this.imageFead.forEach((item) => {
            item.addComponent(UIOpacity)
        })
    }
    start() {
        this.Show();
    }
    hideFead() {
        this.isFead = true;
        this.imageFead.forEach(element => {
            const uiOpacity = element.getComponent(UIOpacity);
            if (uiOpacity) {
                tween(uiOpacity)
                    .to(0.5, { opacity: 0 })  // 操作 UIOpacity 组件的 opacity 属性
                    .start();
            }
        });
    }
    getFeadState() {
        return this.isFead;
    }
    Show() {

        this.imageFead.forEach(element => {
            const originalScale = element.scale.clone();
            const shrunkenScale = originalScale.clone().multiplyScalar(1.2);
            const uiOpacity = element.getComponent(UIOpacity);
            // uiOpacity.opacity = 0;
            if (uiOpacity) {
                // 使用 parallel 同时执行透明度和缩放动画
                tween(uiOpacity)
                    .to(0.5, { opacity: 255 })
                    .start()  // 操作 UIOpacity 组件的 opacity 属性     
                tween(element)
                    .to(0.2, { scale: shrunkenScale })  // 操作 Node 的 scale 属性
                    .to(0.2, { scale: originalScale })  // 操作 Node 的 scale 属性
                    .start();
            }
        });

    }
    Show1(num: number = -1) {
        console.log("num num == ", num);
        if (num == 1) {
            this.imageFead[0].parent.parent.position = new Vec3(
                this.imageFead[0].parent.parent.position.x,
                5.763,
                this.imageFead[0].parent.parent.position.z
            );
        }
        if (num == 2) {
            this.imageFead[0].parent.parent.position = new Vec3(
                this.imageFead[0].parent.parent.position.x,
                4.763,
                this.imageFead[0].parent.parent.position.z
            );
        } 

        this.imageFead.forEach(element => {
            const originalScale = new Vec3(0.01, 0.01, 0.01);
            const shrunkenScale = originalScale.clone().multiplyScalar(1.2);
            const uiOpacity = element.getComponent(UIOpacity);
            // uiOpacity.opacity = 0;
            if (uiOpacity) {
                // 使用 parallel 同时执行透明度和缩放动画
                tween(uiOpacity)
                    .to(0.5, { opacity: 255 })
                    .start()  // 操作 UIOpacity 组件的 opacity 属性     
                tween(element)
                    .to(0.2, { scale: shrunkenScale })  // 操作 Node 的 scale 属性
                    .to(0.2, { scale: originalScale })  // 操作 Node 的 scale 属性
                    .start();
            }
        });

    }
    // initShow

    update(deltaTime: number) {

    }
}


