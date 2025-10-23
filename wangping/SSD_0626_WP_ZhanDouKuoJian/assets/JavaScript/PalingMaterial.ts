import { _decorator, Component, Material, MeshRenderer, Node, SkinnedMeshRenderer, tween } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('PalingMaterial')
export class PalingMaterial extends Component {
    @property({ type: Material, tooltip: "基础材质" })
    baseMaterial: Material = null;

    @property({ type: Material, tooltip: "红色材质" })
    redMaterial: Material = null;

    @property({ type: Material, tooltip: "附加材质" })
    extendMaterial?: Material = null; 


    @property({ type: MeshRenderer, tooltip: "MeshRenderer" })
    rendererMaterial: MeshRenderer = null;



    // shakeMaterial(){
    //     //this.node.getComponent(MeshRenderer).material = this.redMaterial;
    // }
    shakeMaterial() {
        //  let houseMaterial = this.node.getChildByName("playerNode").getChildByName("player").getChildByName("Shimin").getComponent(SkinnedMeshRenderer);
        // let materials = houseMaterial.materials;
        //    materials[0] = this.redyMaterial;
        //    materials[1] = this.redyMaterial;
        //    houseMaterial.materials = materials
        tween(this.rendererMaterial.node)
            // 定义要重复的动作序列：切换材质→等待→切回材质→等待
            .sequence(
                // 切换到目标材质
                tween().call(() => {
                    this.rendererMaterial.setMaterialInstance(this.redMaterial, 0);
                    if (this.extendMaterial) {
                        this.rendererMaterial.setMaterialInstance(this.redMaterial, 1);
                    }

                    // houseMaterial.setMaterialInstance(this.redyMaterial, 1);
                }),
                // 等待 0.2 秒
                tween().delay(0.1),
                // 切回原材质
                tween().call(() => {
                    this.rendererMaterial.setMaterialInstance(this.baseMaterial, 0);
                    if (this.extendMaterial) {
                        this.rendererMaterial.setMaterialInstance(this.extendMaterial, 1);
                    }
                }),
                // 等待 0.2 秒（与切换时间对称）
                tween().delay(0.1)
            )
            // 重复整个序列 3 次
            .repeat(1)
            // 启动 tween
            .start();
    }
    start() {

    }

    update(deltaTime: number) {

    }
}


