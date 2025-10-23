import { _decorator, Color, Component, MeshRenderer, Node, Tween, tween, Vec3 } from 'cc';
import { HealthComponent } from '../Components/HealthComponent';
import { ComponentEvent } from '../../common/ComponentEvents';
import { DamageData } from '../../common/CommonInterface';
import { CommonEvent } from '../../common/CommonEnum';
const { ccclass, property } = _decorator;

@ccclass('HomeGate')
export class HomeGate extends Component {
    @property({ type: HealthComponent, displayName: '健康组件' })
    public healthComponent: HealthComponent = null!;

    @property({ type: Node, displayName: '模型节点' })
    public modelNode: Node = null!;

    protected registerComponentEvents() {
        // 设置健康组件关联
        this.healthComponent.node.on(ComponentEvent.DEAD, this.onDead, this);
        this.healthComponent.node.on(ComponentEvent.HURT, this.onHurt, this);
    }

    oriColorMap: Map<string, Color> = new Map<string, Color>();

    /**
     * 递归设置节点及其子节点的颜色
     */
    protected setNodeColor(node: Node, color: Color) {
        if (node.name.startsWith('e_')) {
            return;
        }
        // 获取节点的渲染组件并设置颜色
        const meshRenderer = node.getComponent(MeshRenderer);
        if (meshRenderer) {
            // 通过材质设置颜色
            const material = meshRenderer.material;
            if (material) {
                // 记录原始颜色
                if (!this.oriColorMap.has(node.name)) {
                    let color = material.getProperty('mainColor') as Color;
                    this.oriColorMap.set(node.name, color);
                }
                material.setProperty('mainColor', color);
            }
        }

        // 递归处理子节点
        for (const child of node.children) {
            this.setNodeColor(child, color);
        }
    }

    /** 受伤效果颜色 (红色) */
    protected readonly hurtColor: Color = Color.RED;

    /**
     * 受伤回调
     */
    protected onHurt(damageData: DamageData) {
        // 快速收缩且后退
        tween(this.modelNode)
            .to(0.1, { scale: this._oriScale.clone().multiplyScalar(0.9), worldPosition: new Vec3(this._oriWPos.x, this._oriWPos.y, this._oriWPos.z - 1) })
            .to(0.1, { scale: this._oriScale, worldPosition: this._oriWPos })
            .start();

        // 模型闪红
        this.setNodeColor(this.modelNode, this.hurtColor);
        this.scheduleOnce(() => {
            let oriColor = this.oriColorMap.get(this.modelNode.name);
            if (oriColor) {
                this.setNodeColor(this.modelNode, oriColor);
            }
        }, 0.3);
    }

    _oriScale: Vec3 = new Vec3(1, 1, 1);
    _oriWPos: Vec3 = new Vec3(0, 0, 0);

    /**
     * 死亡回调
     */
    protected onDead() {
        this.node.active = false;
        app.event.emit(CommonEvent.GameFail);
    }

    start() {
        this.registerComponentEvents();
        this._oriScale.set(this.modelNode.scale);
        this._oriWPos.set(this.modelNode.worldPosition);
    }

    update(deltaTime: number) {

    }
}


