import { _decorator, Animation, CCFloat, CCInteger, Component, Node } from 'cc';
import PoolManager, { PoolEnum } from '../../Base/PoolManager';
import { EffectEnum } from '../../Base/EnumIndex';
const { ccclass, property } = _decorator;

/**特效播放完毕之后 回收 */
@ccclass('EffectTimeRemove')
export class EffectTimeRemove extends Component {

    /**回收类型 */
    // @property({ type: PoolEnum })
    public type: PoolEnum = PoolEnum.effect;

    @property(CCFloat)
    public removeTime: number = 0.1;
    /**类型  当前物体所对应的枚举值 */
    @property({ type: EffectEnum })
    public index: number = EffectEnum.hit;
    protected _time: number;

    // public anim: Animation;
    // protected onLoad(): void {
    //     this.anim = this.getComponent(Animation);
    // }

    protected onEnable(): void {
        this._time = this.removeTime;
        // this.anim.play();
    }


    update(deltaTime: number) {
        this._time -= deltaTime;
        if (this._time <= 0) {
            this.node.active = false;
            PoolManager.instance.setPool(this.type + this.index, this.node);
        }
    }
}


