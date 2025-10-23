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
    @property(BuyWay)
    public buyWay: BuyWay;

    @property(AttackUp)
    public attackMod: AttackUp;
    @property(Node)
    public fire_arms: Node;
    @property(Collider)
    public triggetList: Collider[] = [];
    private _rotDrive: RotationDrive;
    public moveDrive: MoveDrive;

    @property(FbxManager)
    public fbxMgr: FbxManager;
    @property(AttackParkPlay)
    public fireParkPlay: AttackParkPlay;

    private outRay = new geometry.Ray();
    private mask = 1 << 4;
    private tempPos = new Vec3;
    private vectorPos = new Vec3;


    @property(AttackParkPlay)
    public attack_effect_list: AttackParkPlay[] = [];

    private _tempBattle: BattleTarget;
    protected onLoad(): void {
        this.fbxMgr.setAttackAnimCall(this.attack, this);
    }
    start() {
        this.moveDrive = this.getComponent(MoveDrive);
        this._rotDrive = this.moveDrive.rotDrive;
        this.uptrigger(AttackLevel.knife);
        FlayPropManager.instacne.addIFlay(this);
        // const bag = this.buyWay.getBag(PropEnum.meat);
        // for (let i = 0; i < 200; i++) {
        //     let prop = PropManager.instance.getProp(PropEnum.meat);
        //     bag.addProp = prop;
        // }
    }

    private attack(num: number) {
        this.attackMod.attackSwitch = num == 0;
        if (num == 0) {
            if (this.attackMod.attackLevel != AttackLevel.fire) {

                const attackE = this.attack_effect_list[this.attackMod.attackLevel];
                attackE.play();

            }

            switch (this.attackMod.attackLevel) {
                case AttackLevel.knife: {
                    AudioManager.inst.playOneShot(SoundEnum.Sound_knife);
                    break;
                }
                case AttackLevel.bigKnife: {
                    AudioManager.inst.playOneShot(SoundEnum.Sound_BigKnife);
                    break;
                }
            }
        }


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

        if (!this.attackMod.attackIn) {
            this._tempBattle = this.attackMod.battleTarget;
            if (!this._tempBattle) {
                return;
            }
            this.moveDrive.isRot = false;
            if (this._rotDrive.isFacingTargetHorizontal_vec() || this.attackMod.attackLevel == AttackLevel.fire) {
                this.attackMod.attackIn = true;
                let animState: AnimationState;
                if (this.moveDrive.isMove) {
                    animState = this.fbxMgr.setAnimation(AnimPlayerEnum.run_attack + this.animOff, false);
                } else {
                    animState = this.fbxMgr.setAnimation(AnimPlayerEnum.attack + this.animOff, false);
                }
                if (this.attackMod.attackLevel == AttackLevel.fire) {
                    // if (!this.attackMod.attackSwitch) {
                    //     this.fireParkPlay.play();
                    // }
                    // this.attackMod.attackSwitch = true;
                    AudioManager.inst.playOneShot(SoundEnum.Sound_Fire);
                }
                const endTime = animState.duration;
                const attackTime = 1 / 1.5;
                const animScale = endTime / attackTime;
                animState.speed = animScale;
                // this.scheduleOnce.caller();
                this.scheduleOnce(() => {
                    if (this.attackMod.attackLevel != AttackLevel.fire) {
                        this.attackMod.attackSwitch = false;
                    }
                    this.attackMod.attackIn = false;
                }, attackTime)
            }
        }

    }



    protected animUP() {
        if (this.attackMod.attackIn) {
            return;
        }
        if (this.moveDrive.isMove) {
            // if (this.attackMod.attackLevel == AttackLevel.fire) {
            //     const anim: string = this.fire_Anim.clips[AnimPlayerEnum.run].name;
            //     const st: AnimationState = this.fire_Anim.getState(anim);
            //     if (!st.isPlaying) {
            //         st.play();
            //     }
            // }
            this.fbxMgr.setAnimation(AnimPlayerEnum.run + this.animOff);
        } else {
            // if (this.attackMod.attackLevel == AttackLevel.fire) {
            //     const anim: string = this.fire_Anim.clips[AnimPlayerEnum.idle].name;
            //     const st: AnimationState = this.fire_Anim.getState(anim);
            //     if (!st.isPlaying) {
            //         st.play();
            //     }
            // }
            this.fbxMgr.setAnimation(AnimPlayerEnum.idle + this.animOff);
        }
    }


    protected rotationTarget(dt: number) {

        if (this.attackMod.attackLevel == AttackLevel.fire) {
            // this._tempBattle = this.attackMod.battleTarget;
            // if (!this._tempBattle) {
            //     this.attackMod.attackSwitch = false;
            //     this.fireParkPlay.stop();
            // }
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



    public uptrigger(atLevel: AttackLevel) {
        this.attackMod.attackLevel = atLevel;
        for (let i = 0; i < this.triggetList.length; i++) {
            let t = this.triggetList[i];
            t.node.active = atLevel == i;
            if (t.node.active) {
                this.attackMod.collider = t;
            }
        }
        this.animOff = atLevel * 4;
        if (atLevel == AttackLevel.fire) {
            this.fire_arms.active = true;
        }
    }

    public fireOff: boolean;

    public openFire(fireOpen: boolean) {
        this.fireOff = fireOpen;
        if (this.attackMod.attackLevel == AttackLevel.fire) {
            this.attackMod.attackSwitch = fireOpen;
            if (fireOpen) {
                this.fireParkPlay.play();
            } else {
                this.fireParkPlay.stop();
            }
        }
    }




}


