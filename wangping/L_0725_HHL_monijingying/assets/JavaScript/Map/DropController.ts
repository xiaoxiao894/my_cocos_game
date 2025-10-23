import { tween, Vec3, Node, Quat } from "cc";
import { EntityTypeEnum } from "../Common/Enum";
import { NodePoolManager } from "../Common/NodePoolManager";
import { DataManager } from "../Global/DataManager";
import { MathUtils } from "../Util/MathUtils";

/**
 * @class DropController 掉落物管理类
 */
export default class DropController {

    /** 可拾取掉落物列表 */
    private _dropList: Node[] = [];

    public static _instance: DropController = null;

    public static get Instance() {
        if (this._instance == null) {
            this._instance = new DropController();
        }
        return this._instance;
    }

    public getDropList() {
        return this._dropList;
    }

    public getDropNum(): number {
        return this._dropList.length;
    }

    // 金币掉落
    public dropItem(pos: Vec3) {
        pos.y = DataManager.coinHeight / 2 - 0.1;
        let node = NodePoolManager.Instance.getNode(EntityTypeEnum.Coin);
        DataManager.Instance.sceneManager.coinParent.addChild(node);
        node.setWorldPosition(pos);

        //计算最终位置
        const randius = 7;
        const angle = Math.random() * Math.PI * 2;
        const r = 6+Math.random() * randius;
        const offsetX = r * Math.cos(angle);
        const offsetZ = r * Math.sin(angle);
        const newRandomPos = new Vec3(pos.x + offsetX, pos.y, pos.z + offsetZ);

        // 计算飞行方向角度（用于旋转）
        const flyAngle = Math.atan2(newRandomPos.z - pos.z, newRandomPos.x - pos.x);
        // 设置初始旋转（轻微倾斜）
        const initialRotation = flyAngle * 0.3; // 旋转幅度控制在0.3弧度(约17度)内

        // 弹跳高度参数
        const startY = pos.y;
        const peakY = startY + 25;     // 第一次跃起高度
        const bounceY = startY + 0.9;   // 回落后的弹跳高度
        const bounceY2 = startY + 0.6;   // 回落后的弹跳高度2

        // 使用贝塞尔曲线实现弧线飞行效果
        const controlPoint = new Vec3(
            (pos.x + newRandomPos.x) / 2,
            peakY,
            (pos.z + newRandomPos.z) / 2
        );

        // 飞行时间
        const flyDuration = 0.4;

        // 初始旋转设置
        let startRot: Vec3 = node.eulerAngles.clone();
        node.setRotationFromEuler(0, 0, initialRotation);
        let tempPos:Vec3 = new Vec3();
        tween(node)
            // 弧线飞行阶段（同时旋转）
            .to(flyDuration, {
                worldPosition: newRandomPos
            }, {
                easing: 'quadOut',
                onUpdate: (target: any, ratio: number) => {
                    const position = MathUtils.bezierCurve(pos, controlPoint, newRandomPos, ratio);
                    // 更新当前飞行位置
                    node.setWorldPosition(position);

                    // 计算当前飞行方向的角度
                    tempPos.set(
                        position.x + (newRandomPos.x - position.x) * 0.1,
                        position.y,
                        position.z + (newRandomPos.z - position.z) * 0.1
                    );

                    // 计算当前飞行方向的角度（弧度）
                    const currentAngle = Math.atan2(tempPos.z - position.z, tempPos.x - position.x);
                    // 设置旋转（Z轴旋转）
                    node.setRotationFromEuler(0, 0, currentAngle * 0.3);
                }
            })
            // 弹跳阶段（完全回正）
            .to(0.15, {
                position: new Vec3(newRandomPos.x, startY, newRandomPos.z),
                eulerAngles: startRot // 确保完全回正
            }, { easing: 'quadIn' })
            .to(0.1, { position: new Vec3(newRandomPos.x, bounceY, newRandomPos.z) }, { easing: 'quadOut' })
            .to(0.1, { position: new Vec3(newRandomPos.x, startY, newRandomPos.z) }, { easing: 'quadIn' })
            .to(0.1, { position: new Vec3(newRandomPos.x, bounceY2, newRandomPos.z) }, { easing: 'quadOut' })
            .to(0.1, { position: new Vec3(newRandomPos.x, startY, newRandomPos.z) }, { easing: 'quadIn' })
            .call(() => {
                this._dropList.push(node);
            })
            .start();
    }

    public getAroundDrop(pos: Vec3) {
        for (let i = this._dropList.length - 1; i >= 0; i--) {
            let drop = this._dropList[i];
            const dropPos = drop.worldPosition.clone();
            const dx = dropPos.x - pos.x;
            const dz = dropPos.z - pos.z;
            const distSqrXZ = dx * dx + dz * dz;

            // 范围内
            if (distSqrXZ <= DataManager.maxCoinSquareDis) {
                this._dropList.splice(i, 1);
                //范围外掉落物放到最前边
                const drops: Node[] = this._dropList.splice(i, this._dropList.length - i);
                this._dropList.unshift(...drops);
                return drop;
            }
        }
        return null;
    }

    /** 获取距离最近的金币位置 */
    public getNearestDropNode(pos: Vec3): Node {
        let nearestNode: Node = null;
        let minDistSqr = Infinity;
        for (let i = this._dropList.length - 1; i >= 0; i--) {
            let drop = this._dropList[i];
            const dropPos = drop.worldPosition.clone();
            const dx = dropPos.x - pos.x;
            const dz = dropPos.z - pos.z;
            const distSqrXZ = dx * dx + dz * dz;

            if (distSqrXZ < minDistSqr) {
                minDistSqr = distSqrXZ;
                nearestNode = drop;
            }
        }
        return nearestNode;
    }

}