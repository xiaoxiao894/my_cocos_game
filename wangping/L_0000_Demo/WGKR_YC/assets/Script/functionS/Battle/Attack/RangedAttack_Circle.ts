import { _decorator, CCFloat, CCInteger, Component, math, Node, Quat, v3, Vec3 } from 'cc';
import { BulletEnum } from '../../../Base/EnumIndex';
import LayerManager, { LayerEnum } from '../../../Base/LayerManager';
import { vectorPower2, CalculatePerpendicularPosition } from '../../../Tool/Index';
import { AttackParkPlay } from '../AttackParkPlay';
import { AttackTargetBase } from '../Base/AttackTargetBase';
import BulletManager from '../BulletManager';
const { ccclass, property } = _decorator;

/**远程攻击 */
@ccclass('RangedAttack_Circle')
export class RangedAttack_Circle extends AttackTargetBase {

    @property(AttackParkPlay)
    public attackParkPlay: AttackParkPlay;

    @property(CCFloat)
    public r: number = 0.25;
    @property(CCInteger)
    public shootCount: number = 3;

    @property(Node)
    public bulletShootPos: Node;

    @property({ type: BulletEnum })
    public bulletEnum: BulletEnum = BulletEnum.arrow;


    private tempQ: math.Quat = new math.Quat();
    protected attackEvent(power: number, reoel: number): void {
        if (this.target) {
            let target = this.target;
            const tPos = target.node.worldPosition;

            this.attackParkPlay && this.attackParkPlay.play();
            let targetVector = vectorPower2(this.bulletShootPos.worldPosition, tPos);
            Quat.fromViewUp(this.tempQ, targetVector, Vec3.UP);
            let ve3Pos: Vec3[] = CalculatePerpendicularPosition(targetVector, this.r, this.shootCount);
            let Layer = LayerManager.instance.getLayer(LayerEnum.Layer_2_sky);
            let worldPosition = this.bulletShootPos.worldPosition;
            for (let i = 0; i < ve3Pos.length; i++) {
                let pos = ve3Pos[i];
                let bullet = BulletManager.instance.shootBullet(this.bulletEnum, 0, power, reoel);
                bullet.node.rotation = this.tempQ;
                Layer.addChild(bullet.node);
                pos.add(worldPosition);
                bullet.node.setWorldPosition(pos);
            }
        }
    }

    public get attackPos() {
        return this.bulletShootPos.worldPosition;
    }

}


