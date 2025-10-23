import { _decorator, Collider, Color, Component, ITriggerEvent, Node, Sprite } from 'cc';
import ColliderTag, { COLLIDE_TYPE } from '../Battle/CollectBattleTarger/ColliderTag';
import { Site } from './Site';
const { ccclass, property } = _decorator;

@ccclass('Site2')
export class Site2 extends Site {

    @property(Collider)
    public collider2: Collider;


    start() {
        super.start();
        this.collider2.on("onTriggerEnter", this.onTriggerEnter, this);
        this.collider2.on("onTriggerExit", this.onTriggerExit, this);
    }


}


