import { _decorator, CCFloat, Component, Material, MeshRenderer, Node, tween, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('FruitScript')
export class FruitScript extends Component {
    @property(Material)
    private materialRed: Material | null = null; // 红色材质
    @property(Material)
    private materialGreen: Material | null = null; // 绿色材质
    private fruitNode: Node | null = null;
    private isRedState = false; // 当前是否为红色状态
    private meshRenderers: MeshRenderer[] = []; // 缓存 MeshRenderer 组件
    private originalScale:any = null;
    protected onLoad(): void {
        this.initFruitState();
    }

    initFruitState() {
        this.fruitNode = this.node.getChildByName("fruitNode") || this.node;
        this.fruitNode.active = false;
        this.originalScale = this.fruitNode.scale.clone();
        // 缓存所有需要渲染的 MeshRenderer 组件
        this.cacheMeshRenderers();
    }
    
    // 缓存所有需要渲染的 MeshRenderer 组件
    private cacheMeshRenderers() {
        this.meshRenderers = [];
        
        // 遍历 fruitNode 的所有子节点
        this.fruitNode.children.forEach(child => {
            const fanqieNode = child.getChildByName("fanqie");
            if (fanqieNode) {
                const meshRenderer = fanqieNode.getComponent(MeshRenderer);
                if (meshRenderer) {
                    this.meshRenderers.push(meshRenderer);
                }
            }
        });
    }

    getFruitState() {
        return this.isRedState;
    }

    // 设置水果状态（红色或绿色）
    setFruitState(state: 'red' | 'green',isFirst:boolean = false) {
        if (!this.fruitNode.active) {
            this.fruitNode.active = true;
        }
        if (!this.materialRed || !this.materialGreen) return;

        const targetMaterial = state === 'red' ? this.materialRed : this.materialGreen;
        this.isRedState = state === 'red';

        // 一次性应用材质到所有缓存的 MeshRenderer
        this.meshRenderers.forEach(meshRenderer => {
            meshRenderer.setMaterial(targetMaterial, 0);
        });

        // 根据状态播放动画
        if (this.enableBounce && state === 'green' && isFirst) {
            this.startBounce();
        } else if (state === 'red') {
            this.addScaleEffect();
        }
    }

    @property({ type: CCFloat, visible() { return !this.enableBounce; }, tooltip: '缩放动画时常 ' })
    public scaleTime: number = 0.2;

    @property({ type: CCFloat, visible() { return !this.enableBounce; }, tooltip: '缩放成度' })
    public scaleNumber: number = 1.1;
    
    // 对整个 fruitNode 添加缩放效果，而不是每个子节点
    private addScaleEffect() {
        
        tween(this.fruitNode)
            .to(this.scaleTime, { scale: this.fruitNode.scale.multiplyScalar(this.scaleNumber) })
            .to(this.scaleTime, { scale: this.originalScale })
            .start();
    }

    @property({ tooltip: '跳跃效果开始参数调节 只有跳跃效果生效' })
    public enableBounce: boolean = false;

    @property({ type: CCFloat, visible() { return this.enableBounce; }, tooltip: '弹跳动画总时长 ' })
    public totalDuration: number = 1.0;

    @property({ type: CCFloat, visible() { return this.enableBounce; }, tooltip: '弹跳高度 跳跃效果生效' })
    public bounceHeight: number = 1;

    @property({ type: CCFloat, visible() { return this.enableBounce; }, tooltip: '下落时超过起始点的距离 ' })
    public overshootDistance: number = 0.5;

    @property({ type: CCFloat, visible() { return this.enableBounce; }, tooltip: '上升阶段占总时间的比例 ' })
    public upPhaseRatio: number = 0.4;

    @property({ type: CCFloat, visible() { return this.enableBounce; }, tooltip: '下降阶段占总时间的比例 ' })
    public downPhaseRatio: number = 0.5;

    @property({ type: CCFloat, visible() { return this.enableBounce; }, tooltip: '回弹阶段占总时间的比例 ' })
    public bounceBackRatio: number = 0.1;

    startBounce() {
        // 确保节点处于激活状态
        this.fruitNode.active = true;

        // 获取当前位置作为起始点
        const startPos = new Vec3(this.fruitNode.position.x, this.fruitNode.position.y, this.fruitNode.position.z);

        // 计算弹跳的最高点
        const peakPos = new Vec3(startPos.x, startPos.y + this.bounceHeight, startPos.z);

        // 计算下落时超过起始点的位置
        const overshootPos = new Vec3(startPos.x, startPos.y - this.overshootDistance, startPos.z);

        // 对整个 fruitNode 应用弹跳动画
        tween(this.fruitNode)
            // 上升阶段
            .to(this.totalDuration * this.upPhaseRatio, { position: peakPos }, {
                easing: "backOut"
            })
            // 下降阶段
            .to(this.totalDuration * this.downPhaseRatio, { position: overshootPos }, {
                easing: "bounceOut"
            })
            // 回弹到起始位置
            .to(this.totalDuration * this.bounceBackRatio, { position: startPos }, {
                easing: "quadOut"
            })
            .start();
    }
}
