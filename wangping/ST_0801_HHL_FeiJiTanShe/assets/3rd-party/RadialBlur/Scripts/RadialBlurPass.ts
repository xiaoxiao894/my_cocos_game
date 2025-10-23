import { _decorator, Material, Vec4, gfx, postProcess, renderer, rendering, Vec2, Slider, EffectAsset, resources, AssetManager, assetManager } from "cc";
import EditorAsset from "./Libs/EditorAsset";
const { ccclass, property, menu } = _decorator;
const { SettingPass, PostProcessSetting, BlitScreenPass, ForwardPass, } = postProcess

@ccclass('RadialBlur')
@menu('PostProcess/RadialBlur')
export class RadialBlur extends postProcess.PostProcessSetting {
    @property(EffectAsset)
    effectAsset: EffectAsset;

    @property
    highSample = true

    @property
    blueCenter = new Vec2(0.5, 0.5)

    @property({
        range: [0.0, 5.0],
        slide: true,
        step: 0.01,
    })
    blurFactor = 1.0

    changeBlurFactor(slider: Slider) {
        this.blurFactor = slider.progress;
    }
}


export class RadialBlurPass extends postProcess.SettingPass {
    name = 'RadialBlurPass'
    effectName = 'Shaders/RadialBlur.effect';
    outputNames: string[] = ['RadialBlurPassColor']

    _material: Material | undefined
    get material() {
        if (!this._material && this.setting.effectAsset) {
            this._material = new Material();
            this._material.initialize({ effectAsset: this.setting.effectAsset });
        }
        return this._material;
    }

    get setting() { return this.getSetting(RadialBlur); }

    // Whether the pass should rendered
    checkEnable(camera: renderer.scene.Camera): boolean {
        return super.checkEnable(camera);
    }

    params = new Vec4

    render(camera: renderer.scene.Camera, ppl: rendering.Pipeline) {
        if (!this.setting.effectAsset) {
            const cameraID = this.getCameraUniqueID(camera);
            this.context.clearBlack();
            let input0 = this.lastPass!.slotName(camera, 0);

            let output = this.slotName(camera, 0);

            this.context
                .updatePassViewPort()
                .addRenderPass('post-process', `${this.name}${cameraID}`)
                .setPassInput(input0, 'inputTexture')
                .addRasterView(output, gfx.Format.RGBA8)
                .blitScreen(0)
                .version();
            return;
        }
        const cameraID = this.getCameraUniqueID(camera);

        // clear background to black color 
        let context = this.context;
        context.clearBlack()

        let material = this.material;

        const passViewport = context.passViewport;


        // input name from last pass's output slot 0
        let input0 = this.lastPass ? this.lastPass.slotName(camera, 0) : '';
        let output = this.slotName(camera, 0);
        let depth = context.depthSlotName;

        // also can get depth slot name from forward pass.
        // let forwardPass = builder.getPass(ForwardPass);
        // depth = forwardPass.slotName(camera, 1);

        // set setting value to material
        let setting = this.setting;
        this.params.x = setting.blueCenter.x;
        this.params.y = setting.blueCenter.y;
        this.params.z = setting.blurFactor * 0.01;
        this.params.w = setting.highSample ? 1 : 0;
        material?.setProperty('params', this.params);

        const texSize = new Vec4(1 / passViewport.width, 1 / passViewport.height, passViewport.width, passViewport.height);
        material?.setProperty('texSize', texSize);

        context.material = material;
        context
            .updatePassViewPort()
            .addRenderPass('post-process', `${this.name}${cameraID}`)
            .setPassInput(input0, 'inputTexture')
            .setPassInput(depth, 'depthTexture')
            .addRasterView(output, gfx.Format.RGBA8)
            .blitScreen(0)
            .version();
    }
}

let builder = rendering.getCustomPipeline('Custom') as postProcess.PostProcessBuilder;
if (builder) {
    builder.insertPass(new RadialBlurPass, BlitScreenPass);
}