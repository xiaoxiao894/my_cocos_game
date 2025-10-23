import { _decorator, Component, Node, Quat, SkeletalAnimation, tween, Vec3 } from 'cc';
import { Actor } from './Actor';
import { StateDefine } from './StateDefine';
import { VirtualInput } from '../Input/VirtuallInput';
import { DataManager } from '../Global/DataManager';
import { GridSystem } from '../Grid/GridSystem';
import { EachPartnerManager } from './EachPartnerManager';
const { ccclass, property, requireComponent } = _decorator;

@ccclass('PlayerManager')
@requireComponent(Actor)
export class PlayerManager extends Component {
    @property(Node)
    monster: Node = null;

    actor: Actor | null = null;

    private isInLockedState = false;

    start() {
        DataManager.Instance.player = this;

        this.actor = this.node.getComponent(Actor);
    }

    update(deltaTime: number) {
        this.updateFollowerPositions(deltaTime);
        // 获取肉
        this.getMeat(deltaTime);

        const monsters = this.getAttackTargets(this.node, 5, 180);
        if (monsters && monsters.length > 0 && DataManager.Instance.isNormalAttacking) {
            // DataManager.Instance.isNormalAttacking = false;
            // this.isInLockedState = true;

            // this.actor.changState(StateDefine.Attack);

            setTimeout(() => {
                // DataManager.Instance.isNormalAttacking = true;
                // this.isInLockedState = false;
            }, 800);


            DataManager.Instance.monsterManager.killMonsters(monsters);
        }

        if (this.actor.currentState == StateDefine.Die || this.isInLockedState) {
            return;
        }

        const len = this.handleInput();

        if (len > 0.1) {
            this.actor.changState(StateDefine.Walk);
        } else {
            this.actor.changState(StateDefine.Idle);
        }
    }

    handleInput() {
        let x = VirtualInput.horizontal;
        let y = VirtualInput.vertical;

        this.actor.destForward.x = x;
        this.actor.destForward.z = -y;
        this.actor.destForward.y = 0;
        this.actor.destForward.normalize();
        return this.actor.destForward.length();
    }

    getAttackTargets(player: Node, attackRange: number, maxAngle: number): Node[] {
        if (!DataManager.Instance.gridSystem) return;

        const nearby = DataManager.Instance.gridSystem.getNearbyNodes(player.worldPosition, attackRange);
        const forward = player.forward.clone().normalize();
        const result: Node[] = [];

        for (const enemy of nearby) {
            if (!enemy.activeInHierarchy) continue;

            const toEnemy = enemy.worldPosition.clone().subtract(player.worldPosition);
            const dist = toEnemy.length();

            if (dist > attackRange) continue;

            toEnemy.normalize();
            const angle = Math.acos(Vec3.dot(forward, toEnemy)) * 180 / Math.PI;

            if (angle <= maxAngle) {
                result.push(enemy);
            }
        }

        return result;
    }

    // 获取主角朝向
    getForwardVector(node: Node): Vec3 {
        const forward = new Vec3(0, 0, -1);
        return Vec3.transformQuat(new Vec3(), forward, node.getRotation()).normalize();
    }

    updateFollowerPositions(dt: number) {
        if (!DataManager.Instance.partnerManager) return;

        const mainPos = this.node.worldPosition.clone();
        const forward = this.getForwardVector(this.node);
        const radius = 6.5;
        const followerNodes = DataManager.Instance.partnerManager.node.children;
        const followerCount = followerNodes.length;

        const targetPositions = DataManager.Instance.partnerManager.getHalfCirclePositions(mainPos, forward, radius, followerCount);

        const baseSpeed = 9;
        const followerSpeed = baseSpeed * 0.9;
        const maxDist = followerSpeed * dt;

        for (let i = 0; i < followerCount; i++) {
            const follower = followerNodes[i];
            const eachPartnerManager = follower.getComponent(EachPartnerManager);
            const currentPos = follower.worldPosition.clone();
            const targetPos = targetPositions[i];

            const toTarget = targetPos.clone().subtract(currentPos);
            const distToTarget = toTarget.length();

            // ==== 添加分离力逻辑 ====
            const separationForce = new Vec3();
            for (let j = 0; j < followerCount; j++) {
                if (i === j) continue;

                const other = followerNodes[j];
                const otherPos = other.worldPosition;

                const offset = currentPos.clone().subtract(otherPos);
                const d = offset.length();

                const minSpacing = 2.0; // 最小间距
                if (d < minSpacing && d > 0.001) {
                    offset.normalize().multiplyScalar((minSpacing - d) / minSpacing);
                    separationForce.add(offset);
                }
            }

            // 合并方向 = 目标方向 + 分离力
            const finalDir = toTarget.normalize().add(separationForce).normalize();
            const moveStep = finalDir.multiplyScalar(Math.min(distToTarget, maxDist));
            follower.setWorldPosition(currentPos.add(moveStep));

            // 状态判断
            if (distToTarget > 0.1) {
                eachPartnerManager.changState(StateDefine.Walk);
            } else {
                eachPartnerManager.changState(StateDefine.Idle);
            }

            // ✅ 始终同步旋转（朝向主角反方向）
            const mainRot = this.node.getRotation();
            const rotOffset = new Quat();
            Quat.fromAxisAngle(rotOffset, Vec3.UP, Math.PI);
            const adjustedRot = new Quat();
            Quat.multiply(adjustedRot, mainRot, rotOffset);

            const curRot = follower.getRotation();
            const newRot = new Quat();
            Quat.slerp(newRot, curRot, adjustedRot, 0.2); // 可调速度
            follower.setRotation(newRot);
        }
    }

    // 获取肉
    getMeat(dt) {
        const meats = DataManager.Instance.monsterManager.getDrops();
        const player = DataManager.Instance.player;
        if (!player || meats.length === 0) return;

        for (let i = 0; i < meats.length; i++) {
            const meat = meats[i];
            if (!meat || !meat.isValid) continue;

            const start = meat.worldPosition.clone();

            const duration = 0.6;
            const controller = { t: 0 };

            meat.setParent(this.node.parent);

            tween(controller)
                .delay(i * 0.05)
                .to(duration, { t: 1 }, {
                    easing: 'quadInOut',
                    onUpdate: () => {
                        const t = controller.t;
                        const oneMinusT = 1 - t;

                        const currentTargetPos = this.node.worldPosition.clone(); // 实时获取角色位置
                        const dynamicControl = new Vec3(
                            (start.x + currentTargetPos.x) / 2,
                            Math.max(start.y, currentTargetPos.y) + 2,
                            (start.z + currentTargetPos.z) / 2
                        );

                        const pos = new Vec3(
                            oneMinusT * oneMinusT * start.x + 2 * oneMinusT * t * dynamicControl.x + t * t * currentTargetPos.x,
                            oneMinusT * oneMinusT * start.y + 2 * oneMinusT * t * dynamicControl.y + t * t * currentTargetPos.y,
                            oneMinusT * oneMinusT * start.z + 2 * oneMinusT * t * dynamicControl.z + t * t * currentTargetPos.z,
                        );

                        meat.setWorldPosition(pos);
                    }
                })
                .call(() => {
                    DataManager.Instance.monsterManager.recycleDrop(meat)

                    DataManager.Instance.UIPropertyManager.collectProperty();
                })
                .start();
        }

    }
}


