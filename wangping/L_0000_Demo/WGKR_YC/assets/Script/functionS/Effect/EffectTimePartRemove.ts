import { _decorator, CCFloat, CCInteger, Component, log, Node, ParticleSystem, Vec3 } from 'cc';
import { EffectTimeRemove } from './EffectTimeRemove';
import PoolManager from '../../Base/PoolManager';
import { EffectManager } from './EffectManager';
import EventManager from '../../Base/EventManager';
import { EventEnum } from '../../Base/EnumIndex';
const { ccclass, property } = _decorator;
/**回收粒子特效 */
@ccclass('EffectTimePartRemove')
export class EffectTimePartRemove extends EffectTimeRemove {


    private _part: ParticleSystem[] = [];
    private get part() {
        if (this._part.length == 0) {
            this._part.push(this.node.getComponent(ParticleSystem));
            for (let i = 0; i < this.node.children.length; i++) {
                let part = this.node.children[i].getComponent(ParticleSystem);
                if (part) {
                    this._part.push(part);
                }
            }
        }
        return this._part;
    }

    protected onEnable(): void {
        log("effect");
        this._time = this.removeTime;
        for (let i = 0; i < this.part.length; i++) {
            let p = this.part[i];
            p.stop()
            p.play();
        }
    }

    update(deltaTime: number) {
        this._time -= deltaTime;
        if (this._time <= 0) {
            this.node.active = false;
            EventManager.instance.emit(EventEnum.Effect_Play_over, this, this.index);
            PoolManager.instance.setPool(this.type + this.index, this.node);
        }
    }
}


