import { _decorator, Animation, AnimationState, Atlas, Collider, Component, geometry, Node, PhysicsSystem, v3, Vec3 } from 'cc';
import { AttackUp } from '../Battle/Attack/AttackUp';
import { AttackLevel, PropEnum } from '../../Base/EnumIndex';
import { BattleTarget } from '../Battle/BattleTarger/BattleTarget';
import { RotationDrive } from '../Rotation/RotationDrive';
import { MoveDrive } from '../../Base/MoveDrive';
import { vectorPower2 } from '../../Tool/Index';
import IPropFly from '../Bag/IPropFly';
import { Prop } from '../Bag/Prop';
import { JumppManager } from '../Jump/JumpManager';
import { BuyWay } from '../ShoppIng/Buy/BuyWay';
import { FlayPropManager } from '../Other/FlayPropManager';
import { FbxManager } from '../FBX/FbxManager';
import RockerManager from '../Rocker/RockerManager';
import { UnityUpComponent } from '../../Base/UnityUpComponent';
import PropManager from '../Bag/PropManager';
import { AttackParkPlay } from '../Battle/AttackParkPlay';
import AudioManager, { SoundEnum } from '../../Base/AudioManager';
import { CollectGetTarget } from '../Battle/CollectBattleTarger/CollectGetTarget';
import { ArmsManager } from './ArmsManager';
import AttackState from '../Battle/Attack/AttackState';
import { FireArmsAttack } from '../Battle/Arms/FireArmsAttack';
// import PropManager from '../Bag/PropManager';
const { ccclass, property } = _decorator;

enum AnimPlayerEnum {
    null = -1,
    idle,
    attack,
    run,
    run_attack,
}


@ccclass('HeroManager')
export class HeroManager extends UnityUpComponent implements IPropFly {


    public static okAttack: boolean = false;
    private animOff: number = -4;
    flyProp(prop: Prop): boolean {
        let dis = Vec3.distance(prop.node.worldPosition, this.node.worldPosition);
        if (dis <= 20) {
            let bag1 = this.buyWay.getBag(prop.propID);
            let endPos = v3(bag1.placePropPos);
            let c = bag1.NODECOUNT;
            AudioManager.inst.playOneShot(SoundEnum.Sound_get_meat);
            JumppManager.instacne.jumpCurve(prop.node, endPos, 3, 3).onComplete(() => {
                bag1.addProp = prop;
            }).setEndPosPre((node: Node) => {
                let endOldPos = endPos;
                let bag = bag1;
                let count = c;
                let endNewPos = bag.getPropPlaceWordPos(count);
                endNewPos.subtract(endOldPos);
                endNewPos.add(node.worldPosition);
                node.setWorldPosition(endNewPos);
            }, this);
            return true;
        }
        return false;
    }

    private _curLevel: AttackLevel = AttackLevel.BOW;


    @property(CollectGetTarget)
    protected collectGettarget: CollectGetTarget;
    private attackState: AttackState = new AttackState();

    @property(BuyWay)
    public buyWay: BuyWay;

    @property(Node)
    public fire_arms: Node;
    private _rotDrive: RotationDrive;
    public moveDrive: MoveDrive;

    @property(FbxManager)
    public fbxMgr: FbxManager;

    @property(FireArmsAttack)
    public fireArmsAttack: FireArmsAttack;

    private outRay = new geometry.Ray();
    private mask = 1 << 4;
    private tempPos = new Vec3;
    private vectorPos = new Vec3;


    @property(ArmsManager)
    public arms_mgrList: ArmsManager[] = [];

    private _curArmsMgr: ArmsManager;

    // @property(AttackParkPlay)
    // public attack_effect_list: AttackParkPlay[] = [];

    private _tempBattle: BattleTarget;
    protected onLoad(): void {
        // this.fbxMgr.setAttackAnimCall(this.attack, this);
    }
    start() {
        this.moveDrive = this.getComponent(MoveDrive);
        this._rotDrive = this.moveDrive.rotDrive;
        this.uptrigger(AttackLevel.BOW);
        FlayPropManager.instacne.addIFlay(this);

        // const bag = this.buyWay.getBag(PropEnum.meat);
        // for (let i = 0; i < 200; i++) {
        //     let prop = PropManager.instance.getProp(PropEnum.meat);
        //     bag.addProp = prop;
        // }
    }

    private attack(num: number) {

    }

    private moveUP(dt: number) {
        if (RockerManager.instance.isMove) {
            let rocker = RockerManager.instance.rockerDirection;
            let pos = this.node.worldPosition;
            this.tempPos.set(pos);
            this.tempPos.y += 1;
            this.vectorPos.set(-rocker.x, 0, rocker.y);
            this.vectorPos.multiplyScalar(10);
            this.vectorPos.add(this.tempPos);
            geometry.Ray.fromPoints(this.outRay, this.tempPos, this.vectorPos);
            const bResult = PhysicsSystem.instance.raycast(this.outRay, this.mask, 1.5, false);
            if (!bResult) {
                this.moveDrive.MoveEvent(dt);
            }
        } else {
            this.moveDrive.MoveEvent(dt);
        }
    }

    _update(deltaTime: number) {
        this.attackAnim();
        this.rotationTarget(deltaTime);
        this.animUP();
        this.moveUP(deltaTime);

    }


    protected attackAnim() {

        if (!HeroManager.okAttack) {
            this._tempBattle = null;
            return;
        }
        //     return;
        // }

        if (this._curLevel == AttackLevel.fire) {
            return;
        }
        if (!this.attackState.attackIn) {

            this._tempBattle = this.collectGettarget.singleTarget;
            if (!this._tempBattle) {
                return;
            }
            this._curArmsMgr.target = this._tempBattle;
            this.moveDrive.isRot = false;
            if (this._rotDrive.isFacingTargetHorizontal_vec()) {
                this.attackState.attackIn = true;
                let animState: AnimationState;
                if (this.moveDrive.isMove) {
                    animState = this._curArmsMgr.fbxMgr.setAnimation(AnimPlayerEnum.run_attack, false);
                    this.fbxMgr.setAnimation(AnimPlayerEnum.run_attack + this.animOff, false);
                } else {
                    animState = this._curArmsMgr.fbxMgr.setAnimation(AnimPlayerEnum.attack, false);
                    this.fbxMgr.setAnimation(AnimPlayerEnum.attack + this.animOff, false);
                }
                const endTime = animState.duration;
                const attackTime = 1 / this._curArmsMgr.arms.attackSpeed;
                const animScale = endTime / attackTime;
                animState.speed = animScale;
                this.scheduleOnce(() => {
                    this.attackState.attackIn = false;
                }, attackTime)
            }
        }

    }



    protected animUP() {
        if (this.attackState.attackIn) {
            return;
        }
        if (this.moveDrive.isMove) {

            this.fbxMgr.setAnimation(AnimPlayerEnum.run + this.animOff);
            this._curArmsMgr?.fbxMgr.setAnimation(AnimPlayerEnum.run, true);
        } else {
            this.fbxMgr.setAnimation(AnimPlayerEnum.idle + this.animOff);
            this._curArmsMgr?.fbxMgr.setAnimation(AnimPlayerEnum.idle, true);
        }
    }


    protected rotationTarget(dt: number) {

        if (this._curLevel == AttackLevel.fire) {

            this.moveDrive.isRot = true;
        } else {
            let target = this._tempBattle;
            if (target && !target.isDie) {
                this.moveDrive.isRot = false;
                let vector = vectorPower2(this.node.worldPosition, target.node.worldPosition, 1, 0, true);
                this._rotDrive.vector = vector;
                this._rotDrive.rotatLerpLookVector(dt)
            } else {
                this.moveDrive.isRot = true;
            }
        }
    }

    public get curLevel() {
        return this._curLevel;
    }


    public uptrigger(atLevel: AttackLevel) {
        this._curLevel = atLevel;

        this.animOff = atLevel * 4;

        if (this._curArmsMgr) {
            this._curArmsMgr.node.active = false;
        }

        if (atLevel == AttackLevel.BOW) {
            this._curArmsMgr = this.arms_mgrList[0];
        } else if (atLevel == AttackLevel.bigKnife) {
            this.fire_arms.active = false;
            this._curArmsMgr = this.arms_mgrList[1];
        } else if (atLevel == AttackLevel.fire) {
            this.fireArmsAttack.init();
            this.fire_arms.active = true;
            this._curArmsMgr = null;
        }
        if (this._curArmsMgr) {
            this._curArmsMgr.node.active = true;
        }
    }

    public fireOff: boolean;

    public openFire(fireOpen: boolean) {
        this.fireOff = fireOpen;
        if (this._curLevel == AttackLevel.fire) {

            this.fireArmsAttack.isAttack = this.fireOff;
        }
    }




}


