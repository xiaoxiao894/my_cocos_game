import { _decorator, Component, instantiate, Node, Prefab, tween, Vec3, Quat } from 'cc';
import { Actor } from './Actor';
import { StateDefine } from './StateDefine';
import { EntityTypeEnum, RobotMoneyEnum } from '../Enum/Index';
import { DataManager } from '../Global/DataManager';

const { ccclass, property } = _decorator;

const tempQuatA = new Quat();
const tempQuatB = new Quat();
const forward = new Vec3();

function smoothLookAt(node: Node, targetPos: Vec3, deltaTime: number, rotateSpeed: number = 15) {
    const currentPos = node.worldPosition;
    Vec3.subtract(forward, targetPos, currentPos);
    forward.y = 0; // 保证朝向只在水平面
    forward.normalize();
    Vec3.negate(forward, forward);

    node.getRotation(tempQuatA);
    Quat.fromViewUp(tempQuatB, forward, Vec3.UP);

    const angle = Quat.angle(tempQuatA, tempQuatB);
    if (angle < 0.01) return;

    Quat.slerp(tempQuatA, tempQuatA, tempQuatB, deltaTime * rotateSpeed);

    // 只保留 Y 轴旋转
    const newEulerY = getYawFromQuat(tempQuatA);
    Quat.fromEuler(tempQuatA, 0, newEulerY, 0); // 锁定 x/z

    node.setRotation(tempQuatA);
}

function getYawFromQuat(q: Quat): number {
    // 四元数提取 Yaw（Y 轴旋转角）角度（单位为度）
    const ysqr = q.y * q.y;

    const t3 = +2.0 * (q.w * q.y + q.z * q.x);
    const t4 = +1.0 - 2.0 * (ysqr + q.z * q.z);
    const yawRad = Math.atan2(t3, t4);

    return yawRad * 180 / Math.PI;
}

@ccclass('RobotController')
export class RobotController extends Component {
    @property(Prefab)
    waypointRoot: Prefab | null = null;

    private actor: Actor | null = null;
    private points: Vec3[] = [];
    private currentIndex: number = 0;
    private moveSpeed: number = 15;
    private forward: boolean = true;
    private handledAtOne: boolean = false;
    private isPausedAtIndexOne: boolean = false;

    private isAutoSearchMedication: boolean = false;
    private currentTargetMed: Node | null = null;
    private _frontBackpack: Node | null = null;
    private searchQuantityMedication: number = 15;

    private handledCollect: boolean = false;
    private handledDelivery: boolean = false;

    private lastPickupTime: number = 0;
    private isPicking: boolean = false;

    private isRun = true;

    private medicineTimeOut:number = 0;
    private medicineInterval:number = 2;

    //药剂机器人 加个强制保护
    private medicineTimeOut2:number = 0;


    playerFrontBackpack = null;

    start() {
        this.actor = this.node.getComponent(Actor) ?? this.node.addComponent(Actor);
        this.actor.init();

        const wayPoint = instantiate(this.waypointRoot);
        this.points = wayPoint.children.map(child => child.worldPosition.clone());
        this._frontBackpack = this.node.getChildByName("FrontBackpack");
        this.playerFrontBackpack = DataManager.Instance.player.getChildByName("FrontBackpack");

        this.schedule(this.updateRobotAI, 0);
    }

    private _lastMedDistance: number = Number.MAX_VALUE;
    private _lastMedCheckTime: number = 0;
    update(deltaTime: number) {
        // if (this.node.name !== EntityTypeEnum.CollectingMedicationRobot) return;

        // const backpack = this._frontBackpack;
        // const robotPos = this.node.worldPosition;
        // const medicines = DataManager.Instance.LaboratoryManeger.getLandMedicines();

        // this.isRun = !(backpack?.children.length > 0);

        // if (!this.isAutoSearchMedication) {
        //     if (medicines.length > 0) {
        //         this.isAutoSearchMedication = true;
        //         return;
        //     } else {
        //         this.currentIndex = backpack?.children.length > 0 ? 2 : 1;
        //         //this.updateRobotAI(deltaTime);
        //         return;
        //     }
        // }

        // if (backpack?.children.length >= this.searchQuantityMedication) {
        //     this.isAutoSearchMedication = false;
        //     this.currentTargetMed = null;
        //     this.currentIndex = 2;
        //     this.updateRobotAI(deltaTime);
        //     return;
        // }

        // const now = performance.now();

        // const needNewTarget =
        //     !this.currentTargetMed ||
        //     !this.currentTargetMed.isValid ||
        //     !this.currentTargetMed.activeInHierarchy ||
        //     backpack.children.includes(this.currentTargetMed) ||
        //     this.playerFrontBackpack?.children.includes(this.currentTargetMed) ||
        //     (this.currentTargetMed as any)._picked ||
        //     (now - this._lastMedCheckTime > 3000 && // 超过3秒
        //         Vec3.distance(robotPos, this.currentTargetMed.worldPosition) >= this._lastMedDistance - 0.1); // 几乎没靠近

        // if (needNewTarget) {
        //     let closestMed: Node | null = null;
        //     let minDist = Number.MAX_VALUE;

        //     for (const med of medicines) {
        //         if (
        //             !med.activeInHierarchy ||
        //             !med.isValid ||
        //             (med as any)._picked ||
        //             backpack.children.includes(med) ||
        //             this.playerFrontBackpack?.children.includes(med)
        //         ) continue;

        //         const dist = Vec3.distance(robotPos, med.worldPosition);
        //         if (dist < minDist) {
        //             minDist = dist;
        //             closestMed = med;
        //         }
        //     }

        //     if (closestMed) {
        //         this.currentTargetMed = closestMed;
        //         this._lastMedDistance = Vec3.distance(robotPos, closestMed.worldPosition);
        //         this._lastMedCheckTime = now;
        //     } else {
        //         this.isAutoSearchMedication = false;
        //         this.currentTargetMed = null;
        //         this.currentIndex = backpack.children.length > 0 ? 2 : 1;
        //         this.updateRobotAI(deltaTime);
        //         return;
        //     }
        // }

        // if (this.isPicking) return;

        // const targetPos = this.currentTargetMed.worldPosition;
        // const direction = new Vec3();
        // Vec3.subtract(direction, targetPos, robotPos);
        // const distance = direction.length();

        // this._lastMedDistance = distance;

        // if (distance < 0.5 && now - this.lastPickupTime > 300) {
        //     this.lastPickupTime = now;
        //     this.isPicking = true;

        //     const pickedMed = this.currentTargetMed;
        //     this.currentTargetMed = null;
        //     (pickedMed as any)._picked = true;
        //     this.actor.changeState(StateDefine.IdleRelax);

        //     this.scheduleOnce(() => {
        //         if (!pickedMed || !pickedMed.isValid) return;
        //         pickedMed.setParent(backpack);
        //         pickedMed.active = false;
        //         this.isPicking = false;
        //     }, 0);

        //     return;
        // }

        // direction.normalize();
        // this.moveSpeed = this.isRun ? 15 : 15;
        // const move = direction.multiplyScalar(this.moveSpeed * deltaTime);
        // const newPos = robotPos.clone().add(move);
        // newPos.y = robotPos.y;
        // this.node.setWorldPosition(newPos);

        // const facePos = newPos.clone().add(direction);
        // smoothLookAt(this.node, facePos, deltaTime);

        // if (this.isRun) {
        //     this.actor.changeState(StateDefine.Run);
        // } else {
        //     this.actor.changeState(StateDefine.Run);
        // }
    }

private updateRobotAI(dt: number) {
    if (this.points.length === 0) return;

    const currentPos = this.node.worldPosition;
    const targetPos = this.points[this.currentIndex];

    const direction = new Vec3();
    Vec3.subtract(direction, targetPos, currentPos);
    const distance = direction.length();
    //console.log("distance",distance);
    if (distance < 0.15) {
        this.node.setWorldPosition(targetPos);
        this.actor.changeState(StateDefine.IdleRelax);

        //if (this.node.name === EntityTypeEnum.WithdrawMoneyRobot) {
            if (this.currentIndex === 2 && !this.handledCollect) {
                this.onReachIndexOne();
                this.handledCollect = true;
                this.pauseAtIndexOne();
                return;
                
            }

            if (this.currentIndex === 1 && !this.handledDelivery) {
                
                this.pauseAtIndexOne();
                DataManager.Instance.isRobotAction = true;
                this.actor.changeState(StateDefine.IdleRelax);
                if(this.node.name === EntityTypeEnum.WithdrawMoneyRobot){
                    this.handledDelivery = true;
                    this.scheduleOnce(() => {
                        this.isRun = true;
                        DataManager.Instance.isRobotAction = false;
                        this.resumeFromIndexOne();
                    }, 1.5);
                }else{
                    this.medicineTimeOut2+=dt;
                    //药剂机器人
                    if(this._frontBackpack&&this._frontBackpack?.children.length >=10||this.medicineTimeOut2>10){
                        this.medicineTimeOut2 = 0;
                        this.handledDelivery = true;
                        this.scheduleOnce(() => {
                            this.isRun = true;
                            DataManager.Instance.isRobotAction = false;
                            this.resumeFromIndexOne();
                        }, 0.5);
                    }else{
                        this.medicineTimeOut+=dt;
                        if(this.medicineTimeOut>=this.medicineInterval){
                            this.medicineTimeOut = 0;
                            let actor:Actor = this.node.getComponent(Actor);
                            if(actor&&!actor.isDeliveryMoneyArea){
                                actor.isDeliveryMoneyArea = true;
                            }
                        }
                    }
                }
                
                return;
            }
        //}

        //if (this.node.name === EntityTypeEnum.CollectingMedicationRobot) {



            // if (this.currentIndex === 2) {
            //     this.scheduleOnce(() => {
            //         // for (const child of [...this._frontBackpack.children]) {
            //         //     child.destroy();
            //         // }

            //         const meds = DataManager.Instance.LaboratoryManeger.getLandMedicines();
            //         this.isAutoSearchMedication = meds.length > 0;

            //         this.isRun = false; // 修复关键：回程前关闭奔跑状态

            //         this.currentIndex = this.isAutoSearchMedication ? 0 : 1;
            //         this.resumeFromIndexOne();
            //     }, 2);
            //     this.pauseAtIndexOne();
            //     return;
            // }

            // if (this.currentIndex === 1 || this.currentIndex === 0) {
            //     this.isRun = false; // 保证回程路上速度正常
            //     this.actor.changeState(StateDefine.IdleRelax);
            //     return;
            // }
        //}

        if (this.isPausedAtIndexOne) return;

        this.updateIndex();
        this.actor.changeState(StateDefine.IdleRelax);
        return;
    }

    direction.normalize();
    this.moveSpeed = this.isRun ? 15 : 15;
    const move = direction.multiplyScalar(this.moveSpeed * dt);
    this.node.setWorldPosition(currentPos.clone().add(move));

    const facePos = currentPos.clone().add(direction);
    smoothLookAt(this.node, facePos, dt);

    this.actor.changeState(StateDefine.Run); // Run 状态统一设置
}


    private pauseAtIndexOne() {
        this.isPausedAtIndexOne = true;
    }

    private resumeFromIndexOne() {
        this.isPausedAtIndexOne = false;
    }

    private updateIndex() {
        if (this.forward) {
            this.currentIndex++;
            if (this.currentIndex >= this.points.length) {
                this.currentIndex = this.points.length - 2;
                this.forward = false;
            }
        } else {
            this.currentIndex--;
            if (this.currentIndex < 1) {
                this.currentIndex = 1;
                this.forward = true;

                this.handledCollect = false;
                this.handledDelivery = false;
            }
        }
    }

    private onReachIndexOne() {
        if (this.node.name === EntityTypeEnum.WithdrawMoneyRobot) {
            DataManager.Instance.isRobotAction = true;
            this.actor.changeState(StateDefine.IdleRelax);

            tween(this.node)
                .delay(2)
                .call(() => {
                    this.isRun = false;
                    DataManager.Instance.isRobotAction = false;
                    // this.actor.changeState(StateDefine.Walk);
                    this.resumeFromIndexOne();
                })
                .start();
         } else if (this.node.name === EntityTypeEnum.CollectingMedicationRobot) {
            tween(this.node)
                .delay(1)
                .call(() => {
                    this.isRun = false;
                    DataManager.Instance.isRobotAction = false;
                    if(!this._frontBackpack||this._frontBackpack?.children.length ===0){
                        this.resumeFromIndexOne();
                    }else{
                        this.onReachIndexOne();
                    }
                    
                })
                .start();
         }
        // } else if (this.node.name === EntityTypeEnum.CollectingMedicationRobot) {
        //     tween(this.node)
        //         .delay(10)
        //         .call(() => {
        //             this.isAutoSearchMedication = true;
        //         })
        //         .start();
        // }

        if (this.currentIndex === RobotMoneyEnum.DeliveryMoney) {
            this.handledAtOne = false;
        }
    }
}
