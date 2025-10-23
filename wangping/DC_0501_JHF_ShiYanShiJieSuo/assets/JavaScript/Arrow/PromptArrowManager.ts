import { _decorator, Component, Vec3, math, Node, tween, v3 } from 'cc';
import { DataManager } from '../Global/DataManager';
import { CollisionZoneEnum, EntityTypeEnum } from '../Enum/Index';

const { ccclass, property } = _decorator;

@ccclass('PromptArrowManager')
export class PromptArrowManager extends Component {
    private _radius: number = 10;
    private readonly _heightOffset: number = 3;
    private readonly _rotateSpeed: number = 180;
    private readonly _targetDistanceThreshold: number = 15;

    private _laboratoriesNumber = 80;
    private _helperTwoUnlockQuantity = 30;
    private _helperOneQuantity = 15;

    private _targetVec: Vec3 = null;
    private _lastTargetVec: Vec3 = null;
    private _selfEulerY: number = 0;

    private _isTweening: boolean = false;
    private _isHiding: boolean = false;
    private _isArrowVisible: boolean = false;
    private _shouldForceShowArrow: boolean = false;

    frontBackpack: Node = null;
    backBackpack1: Node = null;
    backBackpack2: Node = null;

    start() {
        DataManager.Instance.promptArrowManager = this;
        this.node.active = false;

        this.frontBackpack = DataManager.Instance.player.getChildByName("FrontBackpack");
        this.backBackpack1 = DataManager.Instance.player.getChildByName("BackBackpack1");
        this.backBackpack2 = DataManager.Instance.player.getChildByName("BackBackpack2");
    }

    update(deltaTime: number) {
        if (!DataManager.Instance.player) return;

        this.updateTargetVec();
        if (!this._targetVec) return;

        const playerPos = DataManager.Instance.player.worldPosition;
        const distance = Vec3.distance(playerPos, this._targetVec);

        if (distance <= this._targetDistanceThreshold) {
            const time = performance.now() * 0.001;
            const speed = 0.9;
            const amplitude = 1.2;
            const floatY = 2+Math.sin(time * 2 * Math.PI * speed) * amplitude;

            this.node.setWorldPosition(new Vec3(
                this._targetVec.x,
                this._targetVec.y + this._heightOffset + floatY,
                this._targetVec.z
            ));

            this._selfEulerY += this._rotateSpeed * deltaTime;
            this._selfEulerY %= 360;
            this.node.setRotationFromEuler(-90, this._selfEulerY, 0);

            const arrowDistance = Vec3.distance(playerPos, this.node.worldPosition);
            if (this._isArrowVisible && !this._isHiding && arrowDistance < 10) {
                this.stopScaleTween();
            }
        } else {
            const dir = new Vec3();
            Vec3.subtract(dir, this._targetVec, playerPos);
            dir.y = 0;
            dir.normalize();

            const angleRad = Math.atan2(dir.x, dir.z);
            const angleDeg = math.toDegree(angleRad + Math.PI);

            const x = playerPos.x + this._radius * Math.sin(angleRad);
            const z = playerPos.z + this._radius * Math.cos(angleRad);
            const y = playerPos.y + this._heightOffset;

            this.node.setWorldPosition(new Vec3(x, y, z));
            this.node.setRotationFromEuler(0, angleDeg, 0);
            this._selfEulerY = 0;
        }

        // 若允许播放并满足条件，播放显示动画
        if (
            !this._isTweening &&
            !this._isArrowVisible &&
            !this._isHiding &&
            this._shouldForceShowArrow &&
            this._targetVec
        ) {
            this._shouldForceShowArrow = false;
            this.playScaleTween();
        }

        // 玩家远离目标位置时重新显示箭头（避免找不到）
        if (
            !this._isArrowVisible &&
            !this._isTweening &&
            !this._isHiding &&
            this._targetVec &&
            Vec3.distance(playerPos, this._targetVec) > 12
        ) {
            this._shouldForceShowArrow = true;
        }
    }

    playScaleTween() {
        if (this._isTweening) return;

        this._isTweening = true;
        this._isArrowVisible = true;

        this.node.setScale(v3(0.1, 0.1, 0.1));
        tween(this.node)
            .to(0.25, { scale: v3(5.2, 5.2, 5.2) }, { easing: 'quadOut' })
            .to(0.15, { scale: v3(5, 5, 5) }, { easing: 'quadIn' })
            .call(() => {
                this._isTweening = false;
            })
            .start();
    }

    stopScaleTween() {
        if (this._isTweening || this._isHiding) return;

        this._isTweening = true;
        this._isHiding = true;

        tween(this.node)
            .to(0.25, { scale: v3(0, 0, 0) }, {
                easing: 'quadOut',
                onComplete: () => {
                    this._isTweening = false;
                    this._isHiding = false;
                    this._isArrowVisible = false;
                    this._shouldForceShowArrow = false;
                }
            })
            .start();
    }

    updateTargetVec() {
        if (DataManager.Instance.guide.length === 0) return;

        const guidePos = (type: CollisionZoneEnum): Vec3 | null => {
            const item = DataManager.Instance.guide.find(g => g.type === type);
            return item ? new Vec3(item.pos.x, item.pos.y, item.pos.z) : null;
        };

        const allBackpacks = [this.frontBackpack, this.backBackpack1, this.backBackpack2];
        let honnerItems = 0, medicineItems = 0, moneyItems = 0;
        let foundHonor = false, foundMedicine = false, foundMoney = false;

        for (let backpack of allBackpacks) {
            if (!backpack) continue;
            for (let child of backpack.children) {
                if (child.name === EntityTypeEnum.Honor) {
                    honnerItems++; foundHonor = true;
                } else if (child.name === EntityTypeEnum.Medicine) {
                    medicineItems++; foundMedicine = true;
                } else if (child.name === EntityTypeEnum.Money) {
                    moneyItems++; foundMoney = true;
                }
            }
        }

        let newTarget: Vec3 = null;
        const hasMedicinesOnLand = DataManager.Instance.LaboratoryManeger.getLandMedicines().length > 0;

        if (DataManager.Instance.isUnlockPlotThree && honnerItems >= this._laboratoriesNumber) {
            newTarget = guidePos(CollisionZoneEnum.UnlockTileArea);
        } else if (DataManager.Instance.isUnlockPlotTwo && honnerItems >= this._helperTwoUnlockQuantity) {
            newTarget = guidePos(CollisionZoneEnum.Helper2Area);
        } else if (DataManager.Instance.isUnlockPlotOne && honnerItems >= this._helperOneQuantity) {
            newTarget = guidePos(CollisionZoneEnum.Helper1Area);
        } else if (DataManager.Instance.HonorManeger.HonorNum > 0) {
            newTarget = guidePos(CollisionZoneEnum.GetHonorArea);
        } else if (medicineItems > 0) {
            newTarget = guidePos(CollisionZoneEnum.DeliverMedicineArea);
        } else if (hasMedicinesOnLand || moneyItems > 0) {
            newTarget = guidePos(CollisionZoneEnum.Operator);
        } else {
            newTarget = guidePos(CollisionZoneEnum.GetMoneyArea);
        }

        if (!this._lastTargetVec || (newTarget && !this._lastTargetVec.equals(newTarget))) {
            this._lastTargetVec = newTarget;
            this._targetVec = newTarget;
            this._shouldForceShowArrow = true;
        }
    }
}
