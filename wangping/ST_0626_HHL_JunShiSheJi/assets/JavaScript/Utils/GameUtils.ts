import { Component,Node, view } from "cc";

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

}