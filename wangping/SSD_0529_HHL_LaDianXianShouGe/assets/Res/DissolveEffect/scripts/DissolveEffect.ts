import { _decorator, Component, Node, Material, MeshRenderer, EventTouch, SkinnedMeshRenderer } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('DissolveEffect')
export class DissolveEffect extends Component {

    @property
    delayTime = 0;

    @property([Material])
    mats: Material[] = [];

    _matInstances: Material[] = [];
    _startTime: number = 0;
    _playTime: number = 0;

    start() {
        // 创建材质实例，确保每个模型使用独立的材质
        this._createMaterialInstances();
    }

    private _createMaterialInstances() {
        // 优先检查 SkinnedMeshRenderer，其次检查 MeshRenderer
        let renderer = this.getComponent(SkinnedMeshRenderer) || this.getComponent(MeshRenderer);

        if (!renderer) {
            console.error("DissolveEffect: 找不到 SkinnedMeshRenderer 或 MeshRenderer 组件");
            return;
        }

        if (this.mats.length === 0) {
            console.error("DissolveEffect: 没有指定材质");
            return;
        }

        // 保存原始材质索引
        const originalMaterials = renderer.materials;

        // 创建材质实例
        for (let i = 0; i < this.mats.length; i++) {
            const originalMat = this.mats[i];
            if (originalMat) {
                let matInstance: Material = null;


                // 尝试使用 setMaterial() 方法创建实例（通用方法）

                // 临时应用材质以创建实例
                if (i < renderer.materials.length) {
                    renderer.setMaterial(originalMat, i);

                    // 获取实例化后的材质（兼容新旧 API）
                    if (typeof renderer.getMaterialInstance === 'function') {
                        // 使用新 API (推荐)
                        matInstance = renderer.getMaterialInstance(i);
                    } 
                }


                if (matInstance) {
                    this._matInstances.push(matInstance);
                }
            }
        }

        // 恢复原始材质，避免影响场景
        renderer.materials = originalMaterials;

        // 应用新的材质实例
        if (this._matInstances.length > 0) {
            renderer.materials = this._matInstances;
            console.log(`DissolveEffect: 成功为 ${this.node.name} 创建了 ${this._matInstances.length} 个材质实例`);
        } else {
            console.error("DissolveEffect: 未能创建任何材质实例");
        }
    }

    play(timeS: number) {
        this._playTime = timeS;
        this._startTime = Date.now() + this.delayTime * 1000;
        for (let i = 0; i < this._matInstances.length; ++i) {
            this._matInstances[i].setProperty('dissolveThreshold', 0.0);
        }
        this.node.getComponent(MeshRenderer).shadowCastingMode = MeshRenderer.ShadowCastingMode.OFF;
    }

    onPlayTest(event: EventTouch, customData) {
        this.play(customData - 0);
    }

    update(deltaTime: number) {
        if (this._startTime && this._playTime && this._startTime < Date.now()) {
            let timeElapsed = (Date.now() - this._startTime) / 1000.0;
            let factor = timeElapsed / this._playTime;
            if (factor >= 1.0) {
                factor = 1.0;
                this._startTime = 0;
                this._playTime = 0;
            }

            for (let i = 0; i < this._matInstances.length; ++i) {
                this._matInstances[i].setProperty('dissolveThreshold', factor);
            }
        }
    }
}
