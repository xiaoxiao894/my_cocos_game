import { _decorator, Component, math, Node, Sprite, UIOpacity, UITransform } from 'cc';
import TweenTool from '../../Tool/TweenTool';
// import TweenAni from './TweenAni';
const { ccclass, property } = _decorator;

enum ColorEnum {
    red,
    green,
}

/**血量组件 */
@ccclass('HpComponent')
export class HpComponent extends Component {

    @property(Sprite)
    public img_hp_slide: Sprite;


    @property(Sprite)
    public img_hp_effect: Sprite;

    // private _tran: UITransform;

    private a: number = 0.03;

    private _uiO: UIOpacity;


    onLoad() {
        this.uiO.opacity = 0;
        // this._tran = this.node.getComponent(UITransform);
        // this.img_hp_slide.width = this._tran.width;
        this.img_hp_slide.node.active = true;
    }


    update(deltaTime: number) {
        // if (PublicManager.instance.isOver) {
        //     return;
        // }
        let dis = this.img_hp_effect.fillRange - this.img_hp_slide.fillRange;
        if (dis > 0) {
            if (dis < 0.01) {
                this.img_hp_effect.fillRange = this.img_hp_slide.fillRange;
            } else {
                let sx = this.img_hp_effect.fillRange - dis * this.a;
                this.img_hp_effect.fillRange = sx;
            }
        }
    }

    /**设置当前血量  百分比 */
    public set value(value: number) {

        let scale = Math.max(0, value);
        scale = Math.min(1, scale);
        if (value > this.img_hp_effect.fillRange) {

            this.img_hp_effect.fillRange = value;
        }
        if (this.uiO.opacity > 0 && (scale == 1 || scale == 0)) {
            TweenTool.aplAni(this.uiO, 0);
        } else if (this.uiO.opacity <= 255 && scale != 1) {
            TweenTool.aplAni(this.uiO, 255);
        }

        this.img_hp_slide.fillRange = scale;
    }

    private get uiO() {
        if (this._uiO == null) {
            this._uiO = this.node.getComponent(UIOpacity);
        }
        return this._uiO;
    }


}


