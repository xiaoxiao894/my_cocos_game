import { _decorator, CCFloat, Component, instantiate, Mat4, Node, Prefab, SkeletalAnimation, tween, Vec3 } from 'cc';
import { DataManager } from '../Global/DataManager';
import { EntityTypeEnum } from '../Enum/Index';

const { ccclass, property } = _decorator;

@ccclass('WeaponManager')
export class WeaponManager extends Component {
    @property(CCFloat)
    createInterval = 2;

    @property(Node)
    temporaryWeapons: Node = null;

    @property(Node)
    transferStart: Node = null;

    @property(Node)
    transferCenter: Node = null;

    @property(Node)
    transferEnd: Node = null;

    @property(Node)
    minionWeaponCon: Node = null;

    private _maxWeaponCount = 3;
    private _timer = 0;
    private _slotSyncTimer = 0;

    weaponPos = [
        new Vec3(0.939, -2.548, -1.216),
        new Vec3(2.103, -2.548, -1.216),
        new Vec3(3.377, -2.548, -1.216)
    ];

    weapons: Node = null;
    private _slotOccupied: boolean[] = [false, false, false];
    private _tieJiang: Node = null;
    private _tieJiangAni: SkeletalAnimation = null;

    private _isTransmitting: boolean = false;
    private _transmitTimer: number = 0;
    private _transmitInterval: number = 0.1;

    start() {
        this._tieJiang = this.node.getChildByName("TieJiang");
        this._tieJiangAni = this._tieJiang.getComponent(SkeletalAnimation);

        this.weapons = this.node.getChildByName("Weapons");
        if (!this.weapons) {
            console.error("Weapons 节点未找到");
        }
    }

    update(deltaTime: number) {
        if (DataManager.Instance.isConveyorBeltUnlocking) {
            this._transmitTimer += deltaTime;
            if (!this._isTransmitting && this._transmitTimer >= this._transmitInterval) {
                this._transmitTimer = 0;
                this.automaticallyTransmitAni();
            }
        }

        // 是否生成武器
        if (!DataManager.Instance.isGenerateWeapons) return;
        if (!this.weapons) return;

        if (this.weapons?.children.length >= this._maxWeaponCount) {
            this._tieJiangAni.stop();
            return;
        }

        this._timer += deltaTime;
        if (this._timer >= this.createInterval) {
            this._timer = 0;
            this.createWeapon();
        }

        this._slotSyncTimer += deltaTime;
        if (this._slotSyncTimer >= 1) {
            this.syncSlotOccupiedState();
            this._slotSyncTimer = 0;
        }
    }

    private syncSlotOccupiedState() {
        for (let i = 0; i < this.weaponPos.length; i++) {
            const pos = this.weaponPos[i];
            let occupied = false;

            for (const child of this.weapons.children) {
                const localPos = this.weapons.inverseTransformPoint(new Vec3(), child.getWorldPosition());
                if (Vec3.distance(localPos, pos) < 0.1) {
                    occupied = true;
                    break;
                }
            }

            this._slotOccupied[i] = occupied;
        }
    }

    createWeapon() {
        if (!this._tieJiang || !this.weapons) return;

        const prefab = DataManager.Instance.prefabMap.get(EntityTypeEnum.Weapon);
        if (!prefab) return;

        let slotIndex = -1;

        for (let i = 0; i < this.weaponPos.length; i++) {
            const expectedPos = this.weaponPos[i];
            let isOccupied = false;

            for (const child of this.weapons.children) {
                const worldPos = child.getWorldPosition();
                const localPos = this.weapons.inverseTransformPoint(new Vec3(), worldPos);
                if (Vec3.distance(localPos, expectedPos) < 0.1) {
                    isOccupied = true;
                    break;
                }
            }

            if (!isOccupied) {
                slotIndex = i;
                this._slotOccupied[i] = true;
                break;
            } else {
                this._slotOccupied[i] = true;
            }
        }

        if (slotIndex === -1) return;

        const end = this.weaponPos[slotIndex].clone();
        const duration = 0.6;
        this._tieJiangAni.crossFade("Take 001", 0.1);

        this.scheduleOnce(() => {
            this.spawnAndAnimateWeapon(prefab, end, duration, slotIndex);
        }, 0.67);
    }

 private spawnAndAnimateWeapon(prefab: Prefab, end: Vec3, duration: number, slotIndex: number) {
    const weapon = instantiate(prefab);
    weapon.setParent(this.node);
    weapon.setPosition(new Vec3(1.719, -8.208, -1.43));
    weapon.children[0].setRotationFromEuler(-90, 0, -90);

    // 起点/终点均为 this.node 本地坐标
    const weaponStart = weapon.position.clone();
    const weaponTarget = end.clone();

    // ——关键：用“世界 +Y”抬高控制点，再转回本地——
    const startWorld = weapon.getWorldPosition();
    const endWorld = new Vec3();
    // 把 end（this.node 本地）转成世界坐标
    Vec3.transformMat4(endWorld, weaponTarget, this.node.getWorldMatrix());

    // 世界中点
    const midWorld = new Vec3(
        (startWorld.x + endWorld.x) * 0.5,
        (startWorld.y + endWorld.y) * 0.5,
        (startWorld.z + endWorld.z) * 0.5
    );

    // 往“世界上方”抬高固定高度（你原先是 +5）
    const ctrlWorld = new Vec3(midWorld.x, midWorld.y + 5, midWorld.z);

    // 转回 this.node 的本地坐标，作为控制点
    const controlPoint = this.node.inverseTransformPoint(new Vec3(), ctrlWorld);

    const controller = { t: 0 };

    tween(controller)
        .to(duration, { t: 1 }, {
            easing: 'quadOut',
            onUpdate: () => {
                if (!weapon?.isValid) return;
                const t = controller.t;
                const u = 1 - t;

                // 在本地空间做贝塞尔插值
                const pos = new Vec3(
                    u * u * weaponStart.x + 2 * u * t * controlPoint.x + t * t * weaponTarget.x,
                    u * u * weaponStart.y + 2 * u * t * controlPoint.y + t * t * weaponTarget.y,
                    u * u * weaponStart.z + 2 * u * t * controlPoint.z + t * t * weaponTarget.z
                );
                weapon.setPosition(pos); // 仍然是本地 setPosition
            }
        })
        .call(() => {
            const worldPos = weapon.getWorldPosition();
            const finalLocal = this.weapons.inverseTransformPoint(new Vec3(), worldPos);
            weapon.setParent(this.weapons);
            weapon.setPosition(finalLocal);
            weapon.children[0].setRotationFromEuler(-90, 0, -90);
            (weapon as any).__slotIndex = slotIndex;
        })
        .start();
}



    playerWeaponRotationAni(weapon) {
        const duration = 0.6;
        const startEuler = weapon.children[0].eulerAngles.clone();
        const targetEuler = new Vec3(0, 0, 0);
        const rotCtrl = { t: 0 };

        tween(rotCtrl)
            .to(duration, { t: 1 }, {
                easing: 'quadOut',
                onUpdate: () => {
                    const t = rotCtrl.t;
                    const currentEuler = new Vec3();
                    Vec3.lerp(currentEuler, startEuler, targetEuler, t);
                    weapon.children[0].setRotationFromEuler(currentEuler.x, currentEuler.y, currentEuler.z);
                }
            })
            .start();
    }

    automaticallyTransmitAni() {
        if (this._isTransmitting || !this.weapons) return;

        // 排列顺序
        this.getLastPositionWeapon();
        const children = this.weapons.children;
        if (children.length === 0) return;

        const lastWeapon = children[children.length - 1];
        if (!lastWeapon || !lastWeapon.isValid) return;

        this._isTransmitting = true;

        const slotIndex = (lastWeapon as any).__slotIndex;
        if (slotIndex !== undefined) {
            this._slotOccupied[slotIndex] = false;
        }

        const worldStartPos = lastWeapon.getWorldPosition();
        const worldRotation = lastWeapon.children[0].getWorldRotation();

        lastWeapon.setParent(this.temporaryWeapons);
        lastWeapon.setWorldPosition(worldStartPos);
        lastWeapon.children[0].setWorldRotation(worldRotation);

        const jumpTarget = this.transferStart.getWorldPosition();
        const jumpMid = new Vec3(
            (worldStartPos.x + jumpTarget.x) / 2,
            Math.max(worldStartPos.y, jumpTarget.y) + 2,
            (worldStartPos.z + jumpTarget.z) / 2
        );

        const controller = { t: 0 };
        tween(controller)
            .to(0.4, { t: 1 }, {
                easing: 'quadOut',
                onUpdate: () => {
                    const t = controller.t;
                    const oneMinusT = 1 - t;
                    const pos = new Vec3(
                        oneMinusT * oneMinusT * worldStartPos.x + 2 * oneMinusT * t * jumpMid.x + t * t * jumpTarget.x,
                        oneMinusT * oneMinusT * worldStartPos.y + 2 * oneMinusT * t * jumpMid.y + t * t * jumpTarget.y,
                        oneMinusT * oneMinusT * worldStartPos.z + 2 * oneMinusT * t * jumpMid.z + t * t * jumpTarget.z
                    );
                    lastWeapon.setWorldPosition(pos);
                }
            })
            .call(() => {
                const basePos = lastWeapon.getWorldPosition();
                tween(lastWeapon)
                    .to(0.15, { position: basePos.clone().add3f(0, 0.5, 0) }, { easing: 'quadOut' })
                    .to(0.15, { position: basePos }, { easing: 'bounceOut' })
                    .call(() => {
                        const center = this.transferCenter.getWorldPosition();
                        const end = this.transferEnd.getWorldPosition();

                        tween(lastWeapon)
                            .to(0.6, { worldPosition: center }, { easing: 'linear' })
                            .to(1.2, { worldPosition: end }, { easing: 'linear' })
                            .call(() => {
                                this.playerWeaponRotationAni(lastWeapon);

                                const total = this.minionWeaponCon.children.length;
                                const itemsPerRow = 4;
                                const spacingZ = 1.3;
                                const spacingY = 0.7;
                                const col = total % itemsPerRow;
                                const row = Math.floor(total / itemsPerRow);

                                const localTarget = new Vec3(0, row * spacingY, col * spacingZ);
                                const worldTarget = this.minionWeaponCon.getWorldPosition().clone();
                                const worldRot = this.minionWeaponCon.getWorldRotation();
                                const worldScale = this.minionWeaponCon.getWorldScale();
                                const mat = new Mat4();
                                Mat4.fromRTS(mat, worldRot, worldTarget, worldScale);

                                const targetPos = Vec3.transformMat4(new Vec3(), localTarget, mat);
                                const finalStart = lastWeapon.getWorldPosition();
                                const finalControl = new Vec3(
                                    (finalStart.x + targetPos.x) / 2,
                                    Math.min(Math.max(finalStart.y, targetPos.y) + 2, 5),
                                    (finalStart.z + targetPos.z) / 2
                                );

                                const finalController = { t: 0 };
                                tween(finalController)
                                    .to(0.4, { t: 1 }, {
                                        easing: 'quadInOut',
                                        onUpdate: () => {
                                            const t = finalController.t;
                                            const oneMinusT = 1 - t;
                                            const pos = new Vec3(
                                                oneMinusT * oneMinusT * finalStart.x + 2 * oneMinusT * t * finalControl.x + t * t * targetPos.x,
                                                oneMinusT * oneMinusT * finalStart.y + 2 * oneMinusT * t * finalControl.y + t * t * targetPos.y,
                                                oneMinusT * oneMinusT * finalStart.z + 2 * oneMinusT * t * finalControl.z + t * t * targetPos.z
                                            );
                                            lastWeapon.setWorldPosition(pos);
                                        }
                                    })
                                    .call(() => {
                                        // 被传送过来的武器
                                        (lastWeapon as any).__delivered = true;
                                        lastWeapon[`__isTransferredWeapons`] = true;
                                        lastWeapon.setParent(this.minionWeaponCon);
                                        lastWeapon.setWorldPosition(targetPos);
                                        this._isTransmitting = false;
                                    })
                                    .start();
                            })
                            .start();
                    })
                    .start();
            })
            .start();
    }

    getLastPositionWeapon() {
        const weapons = this.weapons.children.filter(w => w && w.isValid);
        if (weapons.length === 0) return null;

        weapons.sort((a, b) => b.worldPosition.z - a.worldPosition.z);
    }
}