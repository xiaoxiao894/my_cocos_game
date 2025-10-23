import { Component, Material, Sprite, UIOpacity, Vec4, _decorator, color, math, tween } from 'cc';

const { ccclass, property } = _decorator;

@ccclass('monsterEffectCtl')
export class monsterEffectCtl extends Component {
    _mt: Material = null
    _spCmp: Sprite = null
    private _hited: boolean;
    private _froze: boolean;
    private _optCmp: UIOpacity = null;


    start() {
        this._spCmp = this.node.getComponent(Sprite)
        // this._optCmp = this.node.addComponent(UIOpacity)
        // this._mt = this.node.getComponent(Sprite).getMaterialInstance(0)//这个打断合批...
    }

    reuse() {
        this.start()
        // this._hited = this._froze = false
        // this._frozeDt = this._hitDt = 0
        // this._mt = this.node.getComponent(Sprite).getMaterialInstance(0)
        //关闭蓝色内发光 关闭闪白
        this._spCmp.color = color(255, 255, 255, 1)
    }

    /**
     * 闪白
     */
    _showHitTotalTime: number = 0.15
    playHit() {
        //方式一 setProperty 打断合批
        //需要放开 start()中的 this._mt = this.node.getComponent(Sprite).getMaterialInstance(0)
        // tween(this._mt).to(this._showHitTotalTime, {}, {
        //     onUpdate(target: Material, ratio) {
        //         target.setProperty("hitwhit", ratio)
        //     },
        // }).call(() => {
        //     this._mt.setProperty("hitwhit", 0.0)
        // }).start()


        //方式二 占用alpha通道
        let tSpCmp = this._spCmp // this.node.getComponent(Sprite)
        tSpCmp.color = color(255, 255, 255, 1)
        let tmpColor: math.Color = color(255, 255, 255, 244)
        tween(tSpCmp).to(this._showHitTotalTime, {}, {
            onUpdate(target: Sprite, ratio) {
                tmpColor = color(255, 255, 255, 255 * ratio)
                target.color = tmpColor
            },
        }).call(() => {
            tmpColor = color(255, 255, 255, 1)
            tSpCmp.color = tmpColor
        }).start()

    }

    /**
     * 减速(视觉效果)
     */
    frozeColor: Vec4 = Vec4.ZERO;
    _showFrozeTime: number = 10
    _frozeDt: number = 0
    playFroze() {
        //占用r通道 r在0~25.5之间 开启蓝色内光
        let tSpCmp = this._spCmp
        let tmpColor: math.Color = null
        tSpCmp.color = color(1, tSpCmp.color.g, tSpCmp.color.b, tSpCmp.color.a)
        tween(tSpCmp).to(this._showFrozeTime, {}, {}).call(() => {
            tmpColor = color(255, 255, 255, tSpCmp.color.a)
            tSpCmp.color = tmpColor
        }).start()
    }

    /**
     * 测试消融
     */
    _disoveTime: number = 1
    disove(cb?: Function) {
        //占用g通道
        let tSpCmp = this._spCmp
        tSpCmp.color = color(this._spCmp.color.r, 1, this._spCmp.color.b, this._spCmp.color.a)
        let tmpColor: math.Color = null
        tween(tSpCmp).to(this._disoveTime, {}, {
            onUpdate(target: Sprite, ratio) {
                tmpColor = color(255, 254 * ratio, 255, 255)
                target.color = tmpColor
            },
        }).call(() => {
            if (cb) {
                cb()
            }
            // tmpColor = color(255, 255, 255, 1)
            // tSpCmp.color = tmpColor
        }).start()
    }

    /**
     * 仅用于测试显示效果 
     * 游戏类的冰冻减速 
     * 中毒燃烧掉血等逻辑 应该由逻辑层实现
     */
    _hitDt: number
    update(dt: number) {
        // this._mt = this.node.getComponent(Sprite).getMaterial(0)
        // if (this._hited) {
        //     this._hitDt += dt
        //     let percent = this._hitDt / this._showHitTotalTime
        //     percent = Math.min(Math.max(percent, 0.), 1.)
        //     this._mt.setProperty("hitwhit", percent)
        //     if (percent >= 1) {
        //         this._hitDt = 0
        //         this._hited = false
        //         this._mt.setProperty("hitwhit", 0.0)
        //     }
        // }

        // if (this._froze) {
        //     this._frozeDt += dt
        //     this._mt.setProperty("glowColor", this.frozeColor)
        //     if (this._frozeDt > this._showFrozeTime) {
        //         this._frozeDt = 0
        //         this._mt.setProperty("glowColor", Vec4.ZERO)
        //         this._froze = false
        //     }
        // }

        // console.log("this.mt::" , this._mt)
        // this.node.getComponent(Sprite).setMaterial(this._mt,0)
    }
}


