
// === 修改 ItemPartnerManager.ts ===
import { _decorator, Animation, Component, Node, ProgressBar, Quat, SkeletalAnimation, tween, Vec3 } from 'cc';
import { DataManager } from '../Global/DataManager';
import { PartnerEnum } from './StateDefine';
const { ccclass, property } = _decorator;

@ccclass('ItemPartnerManager')
export class ItemPartnerManager extends Component {
    public onKilledCallback: (() => void) | null = null;
    @property(SkeletalAnimation)
    skeletalAnimation: SkeletalAnimation = null;

    @property(Node)
    hpNode: Node = null;

    private _currentState: PartnerEnum | string = null;
    private _attackDistance = 2;
    private _moveSpeed = 15;
    private _target: Node | null = null;

    private _isAttacking = false;
    private _canAttack = true;

    private base: Node = null;
    private white: Node = null;
    private whiteProgressBar = null;
    private red: Node = null;
    private redProgressBar = null;

    private _hitPow: number = 5;
    private _isDead: boolean = false;
    private _index: number = Infinity;
    private _curHp: number = 8;
    private hp: number = 8;

    private _attackCooldown = 1.0;
    private _attackTimer = 0;

    start() { }

    onEnable() {
        if (!this.hpNode) return;

        this.base = this.hpNode.getChildByName("Base");
        this.white = this.hpNode.getChildByName("White");
        this.red = this.hpNode.getChildByName("Red");

        this.whiteProgressBar = this.white?.getComponent(ProgressBar);
        this.redProgressBar = this.red?.getComponent(ProgressBar);
    }

    update(deltaTime: number) {
        this.updateTargetIfNeeded();

        if (this._attackTimer > 0) this._attackTimer -= deltaTime;

        if (!this._target || !this._target.isValid || !this._target.parent) return;

        const selfPos = this.node.worldPosition;
        const targetPos = this._target.worldPosition;
        const distance = Vec3.distance(selfPos, targetPos);

        if (distance > this._attackDistance) {
            this._isAttacking = false;
            this.changState(PartnerEnum.Walk);

            const dir = new Vec3();
            Vec3.subtract(dir, targetPos, selfPos).normalize();
            this.node.setWorldPosition(selfPos.clone().add(dir.multiplyScalar(this._moveSpeed * deltaTime)));

            this.lookAtTarget(targetPos);
        } else {
            this.lookAtTarget(targetPos);
            if (!this._isAttacking && this._attackTimer <= 0) {
                if (this._target?.isValid && this._target.parent) {
                    this._isAttacking = true;
                    this.playAttackOnce(this._target);
                    this._attackTimer = this._attackCooldown;
                } else {
                    this._target = null;
                }
            }
        }
    }

    public onInjury(damage: number = 1) {
        if (this._isDead) return;

        this._curHp = Math.max(0, this._curHp - damage);

        this.redProgressBar && (this.redProgressBar.progress = this._curHp / this.hp);
        this.whiteProgressBar &&
            tween(this.whiteProgressBar)
                .to(0.5, { progress: this._curHp / this.hp }, { easing: 'quadInOut' })
                .start();

        if (this._curHp <= 0) {
            this._isDead = true;
            this.changState(PartnerEnum.Die);

            if (this.onKilledCallback) this.onKilledCallback();

            if (this._target) DataManager.Instance.claimedTargets.delete(this._target);

            this.scheduleOnce(() => this.node.destroy(), 1.2);
        }
    }

    private playAttackOnce(target: Node | null) {
        if (!target?.isValid || !target.parent || !this.skeletalAnimation) {
            this._isAttacking = false;
            return;
        }

        this.changState(PartnerEnum.Attack);
        this.skeletalAnimation.crossFade(PartnerEnum.Attack, 0.1);
        this.skeletalAnimation.play(PartnerEnum.Attack);

        this.scheduleOnce(() => {
            if (target?.isValid && target.parent) {
                DataManager.Instance.monsterConMananger.takeDamageMonster([target], false, this.node);
            }
        }, 0.5);

        this.scheduleOnce(() => (this._isAttacking = false), 1.0);
    }

    private changState(state: PartnerEnum | string) {
        if (state === this._currentState) return;
        this._currentState = state;
        this.skeletalAnimation?.crossFade(state as string, 0.1);
    }

    private updateTargetIfNeeded() {
        if (!this._target || !this._target.isValid || !this._target.parent) {
            const monsters = DataManager.Instance.monsterConMananger.getAttackTargets(this.node, 100, 360);
            if (!monsters || monsters.length === 0) return;

            const selfPos = this.node.worldPosition;
            let minDist = Number.MAX_VALUE;
            let selected: Node | null = null;

            for (const monster of monsters) {
                if (DataManager.Instance.claimedTargets.has(monster)) continue; // 已被认领
                const dist = Vec3.distance(monster.worldPosition, selfPos);
                if (dist < minDist) {
                    minDist = dist;
                    selected = monster;
                }
            }

            if (selected) {
                this._target = selected;
                DataManager.Instance.claimedTargets.add(selected);
            }
        }
    }

    private lookAtTarget(targetPos: Vec3) {
        const partner = this.node.getChildByName("Partner");
        if (!partner) return;

        const selfPos = partner.worldPosition;
        const forward = new Vec3();
        Vec3.subtract(forward, targetPos, selfPos);
        forward.y = 0;
        forward.normalize();

        const rotation = new Quat();
        Quat.fromViewUp(rotation, forward, Vec3.UP);
        partner.setRotation(rotation);
    }
}