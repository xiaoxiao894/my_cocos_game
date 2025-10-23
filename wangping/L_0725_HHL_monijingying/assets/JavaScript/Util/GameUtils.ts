import { Animation, Component,Node, tween, Vec3, view } from "cc";

export default class GameUtils {

    /**
     * 在父节点中查找组件
     * @param node 当前节点
     * @param componentType  组件
     * @returns 
     */
    public static getComponentInParent<T extends Component>(node:Node,componentType: new () => T): T | null {
        let parent = node.parent;
        while (parent) {
            const comp = parent.getComponent(componentType);
            if (comp) {
                return comp;
            }
            parent = parent.parent;
        }
        return null;
    }

    /**
     * 判断屏幕是否为横屏状态（长宽比>1）
     * @returns 长宽比>1返回true，否则返回false
     */
    public static isLandscape(): boolean {
        const size = view.getVisibleSize();
        return size.width > size.height;
    }

    /**
     * 通用出现节点动画
     */
    public static showNodeAni(node:Node){
        node.active = true;
        node.scale = new Vec3(0.01, 0, 0.01);
        tween(node)
        .to(0.25, { scale:new Vec3(1.1, 1.1, 1.1) }, { easing: 'quadOut' })
        .to(0.15, { scale: new Vec3(1, 1, 1) }, { easing: 'quadIn' })
        .start();
    }

    /** 通用建筑出现动画 */
    public static showAni(node: Node, callBack: () => void = null) {
        node.active = true;
        node.setScale(0.1, 0.1, 0.1);
        tween(node)
            .to(0.03, { scale: new Vec3(1, 0.1, 1) })
            .to(0.2, { scale: new Vec3(1, 1.1, 1) })
            .to(0.1, { scale: new Vec3(1, 1, 1) })
            .call(() => {
                if (callBack)
                    callBack();
            })
            .start();
    }

    /** 通用解锁粒子动画 */
    public static unlockAni(ani:Animation){
        if(!ani||!ani.node){
            return;
        }
        ani.node.active = true;
        ani.play();
        ani.once(Animation.EventType.FINISHED,()=>{
            ani.node.active = false;
        });
    }
}