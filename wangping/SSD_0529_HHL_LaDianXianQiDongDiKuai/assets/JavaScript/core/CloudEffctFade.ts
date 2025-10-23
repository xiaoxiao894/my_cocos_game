import { _decorator, CCFloat, Color, Component, Material, MeshRenderer, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('CloudEffctFade')
export class CloudEffctFade extends Component {
    @property({ type: CCFloat, tooltip: '渐变持续时间（秒）' })
    private duration: number = 10;

    private _materials: Material[] = []; // 存储所有需要渐变的材质
    private _fadeStarted: boolean = false; // 标记是否开始渐变
    private _elapsedTime: number = 0; // 已过去的时间

    initCloud() {
        console.log("同级节点 ceshi");
        const siblings: Node[] = this.node.children;

        // 收集所有需要渐变的材质
        siblings.forEach((sibling, index) => {
            console.log(`同级节点 ${index + 1}: ${sibling.name}`);
            this.collectMaterials(sibling);
        });

        // 开始渐变
        this.startFade();
    }

    collectMaterials(sibling: Node) {
        const targetNode = sibling.getChildByName("Plane001");
        if (!targetNode) {
            console.error("未找到名为'Plane001'的子节点");
            return;
        }

        const meshRenderer = targetNode.getComponent(MeshRenderer);
        if (!meshRenderer?.material) {
            console.error("需要 MeshRenderer 组件和有效材质");
            return;
        }

        // 存储材质并设置初始透明度为完全不透明
        const material = meshRenderer.material;
        this._materials.push(material);
        material.setProperty('albedo', new Color(255, 255, 255, 255));
    }

    startFade() {
        if (this._fadeStarted || this._materials.length === 0) return;
        
        this._fadeStarted = true;
        this._elapsedTime = 0;
    }

    update(deltaTime: number) {
        if (!this._fadeStarted || this._materials.length === 0) return;

        // 累加已过去的时间
        this._elapsedTime += deltaTime;
        
        // 计算渐变进度（0-1范围）
        const progress = Math.min(this._elapsedTime / this.duration, 1);
        
        // 根据进度计算当前透明度（从255到0）
        const alpha = Math.floor(255 * (1 - progress));
        const currentColor = new Color(255, 255, 255, alpha);
        
        // 更新所有材质的透明度
        this._materials.forEach(material => {
            material.setProperty('albedo', currentColor);
        });
        
        // 渐变完成后停止更新
        if (progress >= 1) {
            this._fadeStarted = false;
            console.log("所有材质透明度渐变完成");
        }
    }

    start() {
        this.initCloud();
    }
} 