import { _decorator, Collider, Component, find, Node, Quat, RigidBody, SkeletalAnimation, tween, Vec3 } from 'cc';
import { DataManager } from '../Global/DataManager';
import { PartnerEnum } from './StateDefine';
import { TypeItemEnum } from '../Enum/Index';
import { StackManager } from '../StackSlot/StackManager';
import { ItemTreeManager } from '../Tree/ItemTreeManager';
const { ccclass, property } = _decorator;

@ccclass('ItemPartnerManager')
export class ItemPartnerManager extends Component {
    @property(SkeletalAnimation)
    skeletalAnimation: SkeletalAnimation = null;

    private _currentState: PartnerEnum | string = null;
    private _attackDistance = 2.2;
    private _moveSpeed = 15;
    private _target: Node | null = null;

    private _attackCount = 0;
    private _attackCooldown = 2.394;
    private _attackTimer = 0;

    private _deliveryPoint = new Vec3(-10.884, 0, 3.818);
    private _maxCutDownTreeNum = 5;
    private _cutDownTreeNum = 0;

    private _isBusy = false;
    private _startMovePos: Vec3 | null = null;

    update(deltaTime: number) {
        if (DataManager.Instance.hasHelperCuttingDownTrees || DataManager.Instance.hasHelperReachDeliveryLocation) return;

        if (this._cutDownTreeNum >= this._maxCutDownTreeNum) {
            this.moveToDeliveryPoint(deltaTime);
            return;
        }

        if (this._target) {
            this.handleTreeApproachAndCut(deltaTime);
        } else if (!this._isBusy) {
            this.updateTargetIfNeeded();

            if (!this._target) {
                this.moveToDeliveryPoint(deltaTime);
            }
        }

        if (this._attackTimer > 0) {
            this._attackTimer -= deltaTime;
        }
    }

    private handleTreeApproachAndCut(deltaTime: number) {
        const selfPos = this.node.worldPosition;
        const targetPos = this._target.worldPosition;

        // 记录初始移动位置（只记录一次）
        if (!this._startMovePos) {
            this._startMovePos = selfPos.clone();
        }

        const distanceToTarget = Vec3.distance(selfPos, targetPos);

        if (distanceToTarget > this._attackDistance) {
            this.changState(PartnerEnum.Walk);
            this.moveToTarget(targetPos, deltaTime);
        } else {
            DataManager.Instance.hasHelperCuttingDownTrees = true;
            this.changState(PartnerEnum.Attack);

            if (!this._isBusy && this._attackTimer <= 0) {
                this._isBusy = true;
                this._attackTimer = this._attackCooldown;
                this.playAttackAnimation(this._target);
            }
        }
    }

    private playAttackAnimation(target: Node | null) {
        if (!target?.isValid || !target.parent || !this.skeletalAnimation) {
            this.removeTarget();
            return;
        }

        let tree = target.getComponent(ItemTreeManager);
        if (!tree || tree.isBeingCut) {
            this.removeTarget();
            return;
        }

        // 第一次攻击动画
        const HIT_DELAY = 0.48 // 1.33 / 2.8;   // 命中点
        const BETWEEN_DELAY = 0.48;    // 两次攻击之间的等待

        // 第一次攻击动画
        this.skeletalAnimation.crossFade(PartnerEnum.Attack, 0.1);

        this.scheduleOnce(() => {
            DataManager.Instance.treeManager.affectedTrees([target], false, this.node);
        }, HIT_DELAY);

        // 第一次攻击结束 -> 进入第二次
        this.scheduleOnce(() => {
            if (target?.isValid && target.parent) {
                const tree = target.getComponent(ItemTreeManager);
                if (!tree || tree.isBeingCut) {
                    this.removeTarget();
                    return;
                }

                this._attackCount = 1;

                // 第二次攻击动画
                this.skeletalAnimation.crossFade(PartnerEnum.Attack, 0.1);
                this.scheduleOnce(() => {
                    DataManager.Instance.treeManager.affectedTrees([target], false, this.node);
                }, HIT_DELAY);

                // 第二次命中
                this.scheduleOnce(() => {
                    if (target?.isValid && target.parent) {
                        // console.log("===========================> 开始进攻了2");
                        this._attackCount = 2;

                        // —— 第三次攻击开始 —— //
                        this.skeletalAnimation.crossFade(PartnerEnum.Attack, 0.1);
                        this.scheduleOnce(() => {
                            DataManager.Instance.treeManager.affectedTrees([target], false, this.node);
                        }, HIT_DELAY);

                        this.scheduleOnce(() => {
                            if (target?.isValid && target.parent) {
                                // console.log("===========================> 开始进攻了3");
                                this._attackCount = 3;

                                // 收尾
                                this._cutDownTreeNum++;
                                this._target = null;
                                this._startMovePos = null;
                                this._isBusy = false;
                                this._attackTimer = 0;
                                DataManager.Instance.hasHelperCuttingDownTrees = false;
                                // console.log("砍树完成，总数:", this._cutDownTreeNum);
                            } else {
                                this.removeTarget();
                            }
                        }, BETWEEN_DELAY); // 第三次攻击延迟
                        // —— 第三次攻击结束 —— //

                    } else {
                        this.removeTarget();
                    }
                }, BETWEEN_DELAY); // 第二次攻击命中延迟（保持你原来的 0.74）
            } else {
                this.removeTarget();
            }
        }, BETWEEN_DELAY); // 第一次攻击结束到第二次攻击开始的延迟

    }

    private removeTarget() {
        this._isBusy = false;
        this._target = null;
        this._startMovePos = null;
        this._attackTimer = 0;
        DataManager.Instance.hasHelperCuttingDownTrees = false;
    }


    private updateTargetIfNeeded() {
        const trees = DataManager.Instance.searchTreeManager.getAttackTargets(this.node, 100, 360);
        if (!trees || trees.length === 0) return;

        const selfPos = this.node.worldPosition;
        let minDist = Number.MAX_VALUE;
        let selected: Node | null = null;

        for (const tree of trees) {
            if (DataManager.Instance.claimedTargets.has(tree)) continue;
            const dist = Vec3.distance(tree.worldPosition, selfPos);
            if (dist < minDist && tree.name === "Tree") {
                minDist = dist;
                selected = tree;
            }
        }

        if (selected) {
            this._target = selected;
            DataManager.Instance.claimedTargets.add(selected);
        }
    }

    private moveToTarget(targetPos: Vec3, deltaTime: number) {
        const selfPos = this.node.worldPosition;
        const dir = new Vec3();
        Vec3.subtract(dir, targetPos, selfPos).normalize();

        const moveDelta = dir.multiplyScalar(this._moveSpeed * deltaTime);
        const newPos = selfPos.clone().add(moveDelta);
        this.node.setWorldPosition(newPos);

        this.lookAtTarget(targetPos);
    }

    private changState(state: PartnerEnum | string) {
        if (state === this._currentState) return;
        this._currentState = state;
        this.skeletalAnimation?.crossFade(state as string, 0.1);
    }

    private lookAtTarget(targetPos: Vec3) {
        const partner = this.node;
        if (!partner) return;

        const partnerPos = partner.worldPosition;

        const forward = new Vec3();
        Vec3.subtract(forward, targetPos, partnerPos);
        forward.y = 0;
        forward.normalize();

        // 朝向目标方向的旋转
        const rotation = new Quat();
        Quat.fromViewUp(rotation, forward, Vec3.UP);

        // ✅ 强制设置子节点的世界旋转
        partner.setWorldRotation(rotation);
    }


    private moveToDeliveryPoint(deltaTime: number) {
        const selfPos = this.node.worldPosition;
        const distance = Vec3.distance(selfPos, this._deliveryPoint);

        if (distance > 0.2) {
            const dir = new Vec3();
            Vec3.subtract(dir, this._deliveryPoint, selfPos).normalize();

            this.changState(PartnerEnum.Walk);

            this.node.setWorldPosition(selfPos.clone().add(dir.multiplyScalar(this._moveSpeed * deltaTime)));

            this.lookAtTarget(this._deliveryPoint);
        } else {
            DataManager.Instance.hasHelperReachDeliveryLocation = true;
            this.changState(PartnerEnum.Idle);
            this._cutDownTreeNum = 0;
            this._isBusy = false;
            // console.log("📦 已到达交付点，清空砍树计数。");

            //  像交付地点交付
            this.startSequentialDelivery();
        }
    }

    private _deliveryQueue: Node[] = [];
    private startSequentialDelivery() {
        const backpack = this.node.getChildByName("Backpack1");
        if (!backpack) return;

        const children = backpack.children;
        if (children.length === 0) return;

        const to = find("THREE3DNODE/PlacingCon/WoodAccumulationCon");
        if (!to) return;

        const stackManager: StackManager = to["__stackManager"];

        // 从最后一个有效的准备 item 开始
        this._deliveryQueue = [];
        for (let i = children.length - 1; i >= 0; i--) {
            const child = children[i];
            if (child?.isValid && child['__isReady']) {
                this._deliveryQueue.push(child);
            }
        }

        if (this._deliveryQueue.length > 0) {
            this._deliverNextItem(to, stackManager);
        }
    }

    private _deliverNextItem(to: Node, stackManager: StackManager) {
        if (this._deliveryQueue.length === 0) {
            DataManager.Instance.hasHelperReachDeliveryLocation = false;
            this.updateTargetIfNeeded();
            return;
        }

        const item = this._deliveryQueue.shift();
        if (!item || !item.isValid) {
            this._deliverNextItem(to, stackManager); // 跳过无效
            return;
        }

        const startPos = item.getWorldPosition();
        item.parent = this.node;
        item.setWorldPosition(startPos);

        const slot = stackManager.assignSlot(item);
        if (!slot) return;

        const endPos = stackManager.getSlotWorldPos(slot, to);
        const controlPoint = new Vec3(
            (startPos.x + endPos.x) / 2,
            Math.max(startPos.y, endPos.y) + 15,
            (startPos.z + endPos.z) / 2
        );

        const tParam = { t: 0 };
        tween(tParam)
            .to(0.1, { t: 1 }, {
                onUpdate: () => {
                    const t = tParam.t;
                    const oneMinusT = 1 - t;
                    const current = new Vec3(
                        oneMinusT * oneMinusT * startPos.x + 2 * oneMinusT * t * controlPoint.x + t * t * endPos.x,
                        oneMinusT * oneMinusT * startPos.y + 2 * oneMinusT * t * controlPoint.y + t * t * endPos.y,
                        oneMinusT * oneMinusT * startPos.z + 2 * oneMinusT * t * controlPoint.z + t * t * endPos.z
                    );
                    item.setWorldPosition(current);
                },
                onComplete: () => {
                    item.eulerAngles = new Vec3(-90, 0, 0);

                    const rigidBody = item.getComponent(RigidBody);
                    if (rigidBody) rigidBody.enabled = false;

                    const collider = item.getComponent(Collider);
                    if (collider) collider.enabled = false;

                    tween(item)
                        .to(0.15, { scale: new Vec3(1.2, 1.2, 1.2) }, { easing: 'quadOut' })
                        .to(0.05, { scale: new Vec3(1, 1, 1) }, { easing: 'quadOut' })
                        .start();

                    // 放入目标父节点并转为局部坐标
                    const finalWorldPos = endPos;
                    item.setWorldPosition(finalWorldPos);
                    item.setParent(to);
                    const localPos = new Vec3();
                    to.inverseTransformPoint(localPos, finalWorldPos);
                    item.setPosition(localPos);

                    // ✅ 延迟 0.3 秒后交付下一个
                    this.scheduleOnce(() => {
                        this._deliverNextItem(to, stackManager);
                    }, 0.03);
                }
            })
            .start();
    }

}