import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Events')
export class Events {

    static onBulletDead: string = "onBulletDead";    

    static onFireBullet: string = "onFireBullet";
}
