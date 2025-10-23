import { _decorator, Component, Node, Camera, RenderTexture, view, UITransform, MeshRenderer, primitives, utils, log } from 'cc';
const { ccclass, property, executeInEditMode } = _decorator;

@ccclass('UIQuadProfile')
export default class UIQuadProfile {
   @property(Node)
   targetNode: Node = null!;
   @property(MeshRenderer)
   quad: MeshRenderer = null!
}

@ccclass('UIQuad')
@executeInEditMode
export class UIQuad extends Component {
   @property(Camera)
   copyCamera: Camera = null!;

   @property([UIQuadProfile])
   UIQuadProfiles: UIQuadProfile[] = []
   rt: RenderTexture

   start() {
    
   }

   onEnable() {
       if (!this.copyCamera) return
       this.copyCamera.node.active = true;
       this.rt = new RenderTexture();
       this.rt.reset({
           width: view.getVisibleSize().width,
           height: view.getVisibleSize().height,
       })
       this.copyCamera.targetTexture = this.rt;
       this.copyRenderTex();
   }

   onDisable() {
       if (!this.copyCamera) return
       this.copyCamera.node.active = false;
       this.copyCamera.targetTexture = null
       this.rt?.destroy()
   }

   private copyRenderTex() {
       this.UIQuadProfiles.forEach((v, i) => {
           const targetNode = v.targetNode
           const quad = v.quad
           if (!targetNode || !quad) return

           quad.material.setProperty("mainTexture", this.rt);

           const width = targetNode.getComponent(UITransform).width;
           const height = targetNode.getComponent(UITransform).height;
           const anchorPoint = targetNode.getComponent(UITransform).anchorPoint
           const rtwidth = this.rt.width;
           const rtheight = this.rt.height;
           const worldPos = targetNode.getWorldPosition();
           worldPos.x -= width * anchorPoint.x
           worldPos.y -= height * anchorPoint.x
           const geometryQuad = primitives.quad();
           const uv_l = worldPos.x / rtwidth
           const uv_b = worldPos.y / rtheight
           const uv_r = (worldPos.x + width) / rtwidth
           const uv_t = (worldPos.y + height) / rtheight

           geometryQuad.uvs = [uv_l, uv_b, uv_l, uv_t, uv_r, uv_t, uv_r, uv_b]
           quad.mesh = utils.MeshUtils.createMesh(geometryQuad, quad.mesh)

       })
   }
}