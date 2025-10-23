import { _decorator, Component, Node } from 'cc';
import { UnityUpComponent } from '../../Base/UnityUpComponent';
import IPropFly from '../Bag/IPropFly';
import PropManager from '../Bag/PropManager';
import { EffectManager } from '../Effect/EffectManager';
const { ccclass, property } = _decorator;

@ccclass('FlayPropUp')
export class FlayPropManager extends UnityUpComponent {
    public static instacne: FlayPropManager;

    protected onLoad(): void {
        FlayPropManager.instacne = this;
    }
    _update(deltaTime: number) {
        const propList = PropManager.instance.propList;
        for (let i = propList.length - 1; i >= 0; i--) {
            const prop = propList[i];
            for (let j = 0; j < this._IfPList.length; j++) {
                const element = this._IfPList[j];
                const rameove = element.flyProp(prop);
                if (rameove) {
                    propList.splice(i, 1);
                    break;
                }
            }

        }
    }

    private _IfPList: IPropFly[] = [];

    public addIFlay(IfP: IPropFly) {
        let index = this._IfPList.indexOf(IfP);
        if (index == -1) {
            this._IfPList.push(IfP);
        }
    }
    public removeIFlay(IfP: IPropFly) {
        let index = this._IfPList.indexOf(IfP);
        if (index != -1) {
            this._IfPList.splice(index, 1);
        }
    }


}


