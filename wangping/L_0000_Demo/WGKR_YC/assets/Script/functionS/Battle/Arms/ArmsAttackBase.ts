import { _decorator, CCFloat, Component, Node } from 'cc';
import { UnityUpComponent } from '../../../Base/UnityUpComponent';
const { ccclass, property } = _decorator;

@ccclass('ArmsAttackBase')
export abstract class ArmsAttackBase extends UnityUpComponent {

    @property(CCFloat)
    public attackSpeed: number = 1.5;
    private _attTime: number = 0;

    @property(CCFloat)
    public power: number = 10;
    @property(CCFloat)
    public reoel: number = 10;

    protected _update(dt: number): void {
        this._attTime -= dt;
    }

    public abstract startAttack(...param: any[]): void;
}


