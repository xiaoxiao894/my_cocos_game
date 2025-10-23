import { Node, Component } from 'cc';

/**
 * 组件初始化器 
 * 用于简化组件的获取或创建逻辑
 */
export class ComponentInitializer {
    /**
     * 获取或创建指定类型的组件
     * @param node 节点
     * @param componentType 组件类型
     * @returns 获取到的或新创建的组件实例
     */
    public static getOrAddComponent<T extends Component>(node: Node, componentType: new () => T): T {
        let component = node.getComponent(componentType);
        if (!component) {
            component = node.addComponent(componentType);
        }
        return component;
    }
    
    /**
     * 安全地获取组件，如果不存在则返回null，不会自动创建
     * @param node 节点
     * @param componentType 组件类型
     * @returns 获取到的组件实例或null
     */
    public static getComponent<T extends Component>(node: Node, componentType: new () => T): T | null {
        const component = node.getComponent(componentType);
        return component;
    }
    
    /**
     * 初始化一组组件引用
     * @param node 节点
     * @param componentMap 组件映射，键为属性名，值为组件类型
     * @param target 目标对象，用于存储组件引用
     * @param addIfMissing 是否在缺少组件时自动添加
     */
    public static initComponents<T extends Object>(
        node: Node, 
        componentMap: Record<string, new () => Component>,
        target: T,
        addIfMissing: boolean = true
    ): void {
        for (const [propName, compType] of Object.entries(componentMap)) {
            const prop = target[propName];
            if (!prop) {
                if (addIfMissing) {
                    target[propName] = this.getOrAddComponent(node, compType);
                } else {
                    target[propName] = this.getComponent(node, compType);
                }
            }
        }
    }
} 