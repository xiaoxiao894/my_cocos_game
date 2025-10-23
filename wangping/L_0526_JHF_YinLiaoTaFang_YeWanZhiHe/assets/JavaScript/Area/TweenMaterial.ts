import { Node, Material, MeshRenderer, Vec4, renderer, assert, IVec4Like } from "cc";

export class TweenMaterial {

    private node: Node = null;

    private renderer: MeshRenderer = null;

    private material: Material;

    private pass: renderer.Pass = null;

    private mainColorHandler: number = 0;

    private _mainColor: Vec4 = null;

    constructor(node: Node, initialColor?: IVec4Like) {

        this.node = node;

        this.renderer = this.node.getComponent(MeshRenderer);

        this.material = this.renderer.getMaterialInstance(0);

        this.pass = this.material.passes[0];

        this.mainColorHandler = this.pass.getHandle('mainColor');

        if (initialColor) {

            this._mainColor = Vec4.clone(initialColor);

            this.pass.setUniform(this.mainColorHandler, this._mainColor)

        } else {

            this._mainColor = new Vec4();

            this.pass.getUniform(this.mainColorHandler, this._mainColor);

        }

    }

    get mainColor() {

        assert(this.node !== null);

        return this._mainColor;

    }

    set mainColor(v: Vec4) {

        this.pass?.setUniform(this.mainColorHandler, v);

    }

}