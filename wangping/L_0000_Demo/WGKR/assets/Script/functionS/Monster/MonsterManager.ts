import { _decorator, animation, AnimationComponent, AnimationState, CCFloat, Collider, Component, DistanceJoint2D, MeshRenderer, Node, PostProcessStage, PrivateNode, Vec3 } from 'cc';
import { UnityUpComponent } from '../../Base/UnityUpComponent';
import { MoveDrive } from '../../Base/MoveDrive';
import { AttackUp } from '../Battle/Attack/AttackUp';
import { RotationDrive } from '../Rotation/RotationDrive';
import { BattleTarget } from '../Battle/BattleTarger/BattleTarget';
import { getPosRandomPos, vectorPower2 } from '../../Tool/Index';
import { MonsterBattleTarget } from './MonsterBattleTarget';
import PoolManager, { PoolEnum } from '../../Base/PoolManager';
import PropManager from '../Bag/PropManager';
import { PropEnum } from '../../Base/EnumIndex';
import { FbxManager } from '../FBX/FbxManager';
const { ccclass, property } = _decorator;


enum MonsterAnimEnum {
    null = -1,
    idle,
    attack,
    run,
    die,
}


@ccclass('MonsterManager')
export class MonsterManager extends UnityUpComponent {

    private _rotDrive: RotationDrive;
    private _moveDrive: MoveDrive;

    public attackTarget: BattleTarget;
    public attackIn: boolean = false;
    @property(CCFloat)
    public attackR: number = 2;

    @property(CCFloat)
    public power: number = 20;
    @property(CCFloat)
    public attackSpeed: number = 1.5;

    @property(MonsterBattleTarget)
    public battle: MonsterBattleTarget;

    @property(MeshRenderer)
    public meshRenderer: MeshRenderer;
    // public attackTarget: BattleTarget;
    @property(Collider)
    public selfCollider: Collider;

    @property(FbxManager)
    public fbxMgr: FbxManager;

    protected start(): void {
        this.fbxMgr.setAttackAnimCall(this.attack, this);
    }

    private attack() {
        this.attackTarget?.Hit(this.power);
    }


    public get moveDrive() {
        if (!this._moveDrive) {
            this._moveDrive = this.getComponent(MoveDrive);
            this._rotDrive = this.moveDrive.rotDrive;
        }
        return this._moveDrive;
    }


    _update(deltaTime: number) {


        if (this.battle.isDie) {
            if (this.dieTime <= 0) {

                this.dissolve(deltaTime);
            } else {
                this.dieTime -= deltaTime;
            }
        } else {
            this.attackUP(deltaTime);
        }

    }


    private attackUP(deltaTime: number) {
        if (this.attackTarget && !this.attackTarget.isDie) {
            let dis = Vec3.distance(this.node.worldPosition, this.attackTarget.node.worldPosition);
            // if (dis < + this.attackR * 2.5) {
            //     this.selfCollider.enabled = true;
            // }
            if (dis <= this.attackR) {
                this.moveDrive.autoMove = false;
                this.moveDrive.isRot = false;
                let vector = vectorPower2(this.node.worldPosition, this.attackTarget.node.worldPosition, 1, 0, true);
                this._rotDrive.vector = vector;
                this._rotDrive.rotatLerpLookVector(deltaTime);
                if (!this.attackIn && this._rotDrive.isFacingTargetHorizontal_vec()) {
                    this.attackIn = true;
                    let animState: AnimationState = this.fbxMgr.setAnimation(MonsterAnimEnum.attack, false);
                    const endtime = animState.duration;
                    const attackTime = 1 / this.attackSpeed;
                    const animScale = endtime / attackTime;
                    animState.speed = animScale;
                    this.scheduleOnce(() => {
                        this.attackIn = false;
                        if (!this.battle.isDie) {

                            this.moveDrive.autoMove = true;;
                        }
                    }, attackTime);
                }
            } else if (dis > this.attackR) {

                let pos = getPosRandomPos(this.attackTarget.node.worldPosition, this.attackR);
                pos.y = this.node.worldPositionY;
                this.setMovePos(pos);
            }
        }
        if (!this.attackIn) {
            if (!this.moveDrive.isMove) {

                this.fbxMgr?.setAnimation(MonsterAnimEnum.idle, true);
            } else {
                this.fbxMgr?.setAnimation(MonsterAnimEnum.run, true);
            }
        }
    }

    public setMovePos(pos: Vec3) {
        this.moveDrive.isRot = true;
        this.moveDrive.pos = pos;

    }

    public die() {
        this.selfCollider.enabled = false;
        this.moveDrive.autoMove = false;
        PropManager.instance.createProp(this.node.worldPosition, 2, PropEnum.meat, 1.65);
        let animState: AnimationState = this.fbxMgr?.setAnimation(MonsterAnimEnum.die, false);
        this.dieTime = animState.duration;
    }

    private dieTime: number = 0;
    private dissValue: number = 0;

    private dissolve(dt: number) {
        if (this.dissValue >= 1) {
            this.dissValue = 1;
            PoolManager.instance.setPool(PoolEnum.monsterManager, this);
            this.node.active = false;
            return;
        }
        this.dissValue += 2 * dt;
        this.dissValue = Math.min(1, this.dissValue);
        // let v = this.easeOutQuad(this.dissValue);

        let mats = this.meshRenderer.materials;
        for (let i = 0; i < mats.length; i++) {
            let mat = mats[i];
            let hand = mat.passes[1].getHandle("dissolveThreshold");
            mat.passes[1].setUniform(hand, this.dissValue);
            let hand2 = mat.passes[0].getHandle("outdissolveThreshold");
            mat.passes[0].setUniform(hand2, this.dissValue);
        }
    }


    public initMat() {
        this.selfCollider.enabled = true;
        this.dissValue = 0;
        this.moveDrive.autoMove = true;
        let mats = this.meshRenderer.materials;
        this.attackTarget = null;
        for (let i = 0; i < mats.length; i++) {
            let mat = mats[i];
            let hand = mat.passes[1].getHandle("dissolveThreshold");
            mat.passes[1].setUniform(hand, 0);
            let hand2 = mat.passes[0].getHandle("outdissolveThreshold");
            mat.passes[0].setUniform(hand2, 0);
        }
        // this.fbxMgr?.setAnimation(MonsterAnimEnum.idle, true);

    }

}


