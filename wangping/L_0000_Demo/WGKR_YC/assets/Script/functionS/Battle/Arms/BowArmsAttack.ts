import { _decorator, CCFloat, CCInteger, Component, math, Node, Quat, v3, Vec3 } from 'cc';
import { ArmsAttackBase } from './ArmsAttackBase';
import { BattleTarget } from '../BattleTarger/BattleTarget';
import LayerManager, { LayerEnum } from '../../../Base/LayerManager';
import { vectorPower2, CalculatePerpendicularPosition } from '../../../Tool/Index';
import BulletManager from '../BulletManager';
import { BulletEnum } from '../../../Base/EnumIndex';
import AudioManager, { SoundEnum } from '../../../Base/AudioManager';
const { ccclass, property } = _decorator;

@ccclass('BowArmsAttack')
export class BowArmsAttack extends ArmsAttackBase {


    @property({ type: BulletEnum })
    public bulletEnum: BulletEnum = BulletEnum.arrow;

    public startAttack(...param: any[]): void {
        const target = param[0] as BattleTarget;
        if (target) {
            this.attackEvent(target, this.power, this.reoel);
            AudioManager.inst.playOneShot(SoundEnum.Sound_minaqina);
        }
    }

    private testNum: number = Math.floor(Math.random() * 1000);

    @property(Node)
    public bulletShootPos: Node;

    @property(CCInteger)
    public shootCount: number = 1;

    @property(CCFloat)
    public bulletAngle: number = 15;

    private tempQ: math.Quat = new math.Quat();
    private tempQ2: math.Quat = new math.Quat();
    protected attackEvent(target: BattleTarget, power: number, reoel: number): void {
        const tPos = v3();
        console.log("id:" + this.testNum);
        // let targetVector = vectorPower2(this.bulletShootPos.worldPosition, tPos);
        // Quat.fromViewUp(this.tempQ, targetVector, Vec3.UP);
        this.tempQ.set(this.bulletShootPos.worldRotation);
        let Layer = LayerManager.instance.getLayer(LayerEnum.Layer_2_sky);
        for (let i = 0; i < this.shootCount; i++) {
            const randomAngle = math.randomRange(-this.bulletAngle, this.bulletAngle);
            Quat.fromAxisAngle(this.tempQ2, Vec3.RIGHT, math.toRadian(randomAngle));
            Quat.multiply(this.tempQ2, this.tempQ, this.tempQ2);
            let bullet = BulletManager.instance.shootBullet(this.bulletEnum, 0, power, reoel);
            this.tempQ2.getEulerAngles(tPos);
            bullet.node.setRotationFromEuler(tPos);
            Layer.addChild(bullet.node);
            bullet.node.setWorldPosition(this.bulletShootPos.worldPosition);
        }

    }

}


