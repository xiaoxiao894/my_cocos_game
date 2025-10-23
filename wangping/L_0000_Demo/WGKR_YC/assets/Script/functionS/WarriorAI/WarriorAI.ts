import { _decorator, Animation, AnimationState, Collider, Component, Node, v3, Vec3 } from 'cc';
import { AttackLevel } from '../../Base/EnumIndex';
import { MoveDrive } from '../../Base/MoveDrive';
import { getPosRandomPos, vectorPower2 } from '../../Tool/Index';
import { Prop } from '../Bag/Prop';
import { AttackUp } from '../Battle/Attack/AttackUp';
import { BattleTarget } from '../Battle/BattleTarger/BattleTarget';
import { JumppManager } from '../Jump/JumpManager';
import { FlayPropManager } from '../Other/FlayPropManager';
import { RotationDrive } from '../Rotation/RotationDrive';
import { BuyWay } from '../ShoppIng/Buy/BuyWay';
import IPropFly from '../Bag/IPropFly';
import { BagBase } from '../Bag/Base/BagBase';
import { FbxManager } from '../FBX/FbxManager';
import { AttackParkPlay } from '../Battle/AttackParkPlay';
const { ccclass, property } = _decorator;
enum WarriorAnimEnum {
    null = -1,
    idle,
    attack,
    run,
    run_attack,
}
@ccclass('WarriorAI')
export class WarriorAI extends Component implements IPropFly {
    flyProp(prop: Prop): boolean {
        let dis = Vec3.distance(prop.node.worldPosition, this.node.worldPosition);
        if (dis <= 10) {
            let bag = this.bag;
            JumppManager.instacne.jumpCurve(prop.node, bag.placePropPos, 3, 3).onComplete(() => {
                bag.addProp = prop;
            });
            return true;
        }
        return false;
    }

    @property(AttackUp)
    public attackMod: AttackUp;
    @property(Collider)
    public attackCollider: Collider;

    @property(BattleTarget)
    public selfBattle: BattleTarget;
    private _rotDrive: RotationDrive;
    public moveDrive: MoveDrive;
    public bag: BagBase;
    public tempBattle: BattleTarget;

    public state: number = 0;

    @property(AttackParkPlay)
    public attackE: AttackParkPlay;

    @property(FbxManager)
    public fbxMgr: FbxManager;


    public init(bag: BagBase) {
        this.bag = bag;
        this.moveDrive = this.getComponent(MoveDrive);
        this._rotDrive = this.moveDrive.rotDrive;
        this.attackMod.collider = this.attackCollider;
        this.fbxMgr.setAttackAnimCall(this.attack, this);

    }

    public die() {
        FlayPropManager.instacne.removeIFlay(this);
    }
    public initInfo(): void {
        this.state = 0;
        this.tempBattle = null;
        FlayPropManager.instacne.addIFlay(this);
        this.attackMod.attackIn = false;
        this.attackMod.attackSwitch = false;
        this.isAttack = false;
    }


    update(deltaTime: number) {
        this.attackUP();
        this.attackAnim();
        this.rotationTarget(deltaTime);
        this.animUP();
    }


    protected attackAnim() {

        if (this.isAttack && !this.attackMod.attackIn) {
            this.moveDrive.isRot = false;
            if (this._rotDrive.isFacingTargetHorizontal_vec()) {
                this.attackMod.attackIn = true;
                let animState: AnimationState;
                if (this.moveDrive.isMove) {
                    animState = this.fbxMgr.setAnimation(WarriorAnimEnum.run_attack, false);
                } else {
                    animState = this.fbxMgr.setAnimation(WarriorAnimEnum.attack, false);
                }
                let endTime = animState.duration;
                let attackTime = 1 / 2;
                let animScale = endTime / attackTime;
                animState.speed = animScale;
                // this.scheduleOnce.caller();
                this.scheduleOnce(() => {
                    this.attackMod.attackSwitch = false;
                    this.attackMod.attackIn = false;
                }, attackTime)
            }
        }

    }
    protected animUP() {
        if (this.attackMod.attackIn || this.isAttack) {
            return;
        }
        if (this.moveDrive.isMove) {
            this.fbxMgr.setAnimation(WarriorAnimEnum.run);
        } else {
            this.fbxMgr.setAnimation(WarriorAnimEnum.idle);
        }
    }


    protected rotationTarget(dt: number) {
        let target = this.tempBattle;
        if (target && !target.isDie) {
            this.moveDrive.isRot = false;
            let vector = vectorPower2(this.node.worldPosition, target.node.worldPosition, 1, 0, true);
            this._rotDrive.vector = vector;
            this._rotDrive.rotatLerpLookVector(dt)
        } else {
            this.moveDrive.isRot = true;
        }
    }

    private isAttack: boolean = false;

    private attackUP() {
        if (this.attackMod.attackIn) {
            return;
        }
        if (this.tempBattle && !this.tempBattle.isDie) {
            let dis = Vec3.distance(this.attackMod.node.worldPosition, this.tempBattle.node.worldPosition);
            if (dis > 3.5) {
                this.isAttack = false;
            } else {
                this.isAttack = true;
            }
        }
    }
    protected attack(num: number) {
        this.attackMod.attackSwitch = num == 0;
        if (num == 0) {
            this.attackE.play();
        }
    }


}


