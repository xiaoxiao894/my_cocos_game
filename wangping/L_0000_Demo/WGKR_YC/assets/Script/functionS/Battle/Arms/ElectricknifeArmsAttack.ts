import { _decorator, Component, editorExtrasTag, geometry, Light, Node, PhysicsSystem, Vec3 } from 'cc';
import { ArmsAttackBase } from './ArmsAttackBase';
import { BattleTarget } from '../BattleTarger/BattleTarget';
import { vectorPower } from '../../../Tool/Index';
import BulletManager from '../BulletManager';
import { ElectricknifeData } from '../Bullet/ElectricknifeData';
import LayerManager, { LayerEnum } from '../../../Base/LayerManager';
import { Lightning } from 'db://assets/GameRes/Effect/Eff/light/Lightning';
import AudioManager, { SoundEnum } from '../../../Base/AudioManager';
import { MonsterBattleTarget } from '../../Monster/MonsterBattleTarget';
const { ccclass, property } = _decorator;

export const removetime: number = 0.3;

@ccclass('ElectricknifeArmsAttack')
export class ElectricknifeArmsAttack extends ArmsAttackBase {

    private outRay = new geometry.Ray();
    private mask = 1 << 2;

    @property(Node)
    public shootNode: Node;

    private _eDataList: ElectricknifeData[] = [];



    private temp: Vec3 = new Vec3;
    public startAttack(...param: any[]): void {
        const target = param[0] as BattleTarget;
        if (target) {
            this.temp.set(target.node.worldPosition);
            this.temp.y = this.shootNode.worldPositionY;
            geometry.Ray.fromPoints(this.outRay, this.shootNode.worldPosition, this.temp);
            // this.light.setPos(this.temp, this.shootNode.worldPosition);
            const isCollide = PhysicsSystem.instance.sweepSphere(this.outRay, 3, this.mask, 30);
            if (!isCollide) {
                return;
            }
            const result = PhysicsSystem.instance.sweepCastResults;
            const edata = BulletManager.instance.shootElectricknifeBullet();
            const battleList: BattleTarget[] = edata.targetList;
            for (let i = 0; i < result.length; i++) {
                const r = result[i];
                const battle = r.collider.getComponent(BattleTarget);
                if (battle) {
                    battleList.push(battle);
                }
            }
            battleList.sort((a: BattleTarget, b: BattleTarget) => {
                const dis = Vec3.squaredDistance(a.node.worldPosition, this.node.worldPosition);
                const dis2 = Vec3.squaredDistance(b.node.worldPosition, this.node.worldPosition);
                return dis - dis2;

            })

            if (battleList.length) {
                this._eDataList.unshift(edata);
            } else {
                edata.remove();
            }
        }
    }

    protected _update(dt: number): void {
        super._update(dt);
        this.eHandle(dt);
    }


    private eHandle(dt: number) {
        for (let i = this._eDataList.length - 1; i >= 0; i--) {
            const data = this._eDataList[i];
            data.time -= dt;
            data.removeTime -= dt;
            if (data.attackIndex < data.targetList.length) {
                if (data.time <= 0) {
                    this.handleAddData(data);
                }
            }
            if (data.removeTime <= 0) {
                this.handleRemoveData(data);
            }
            if (data.removeIndex == data.targetList.length) {
                data.remove();
                this._eDataList.splice(i, 1);
            }
        }
    }




    private handleAddData(data: ElectricknifeData) {
        data.time = 0.15;
        let startNode: Node;
        let endNode: Node;
        if (data.attackIndex) {
            const battlet1 = data.targetList[data.attackIndex - 1] as MonsterBattleTarget;
            const battlet2 = data.targetList[data.attackIndex] as MonsterBattleTarget;
            // this.attackHit(battlet1);
            this.attackHit(battlet2);
            startNode = battlet1.hitNode;
            endNode = battlet2.hitNode;
        } else {
            const battlet1 = data.targetList[data.attackIndex] as MonsterBattleTarget;
            this.attackHit(battlet1);
            startNode = this.shootNode;
            endNode = battlet1.hitNode;
        }
        const liht = BulletManager.instance.lightning;
        liht.setPosNode(endNode, startNode);
        liht.line.width.constant = 1;
        data.lineList.push(liht);
        AudioManager.inst.playOneShot(SoundEnum.Sound_shandian);
        data.attackIndex++;
    }

    private handleRemoveData(data: ElectricknifeData) {
        data.removeTime = removetime;
        const light = data.lineList.splice(0, 1)[0];
        if (light) {
            light.remove();
            data.removeIndex++;
        }
    }

    private attackHit(battle: BattleTarget) {
        if (!battle.isDie) {
            battle.Hit(this.power);
            battle.repelBattleTarget(this.shootNode, this.reoel);
        }
    }


    private _light: Lightning;
    private get light() {
        if (!this._light) {
            this._light = BulletManager.instance.lightning;
        }
        return this._light;
    }

}