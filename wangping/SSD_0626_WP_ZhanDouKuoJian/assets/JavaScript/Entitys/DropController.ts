import { tween, Vec3, Node, v3 } from "cc";
import { App } from "../App";
import { GlobeVariable } from "../core/GlobeVariable";
import { DropItemRotation } from "../DropItemRotation";
import { MathUtil } from "../core/MathUtils";

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

    // 金币掉落
    public dropItem(pos: Vec3) {
        let node = App.poolManager.getNode(GlobeVariable.entifyName.Coin);
        node.setScale(v3(6, 6, 6))
        const dropRotation = node.getComponent(DropItemRotation);
        if (dropRotation) {
            dropRotation.setIsRotation(true);
        }
        App.sceneNode.coinParent.addChild(node);
        node.setWorldPosition(pos);

        //金币掉落新动画
        // node.eulerAngles = new Vec3(90, 0, 0);
        // const startY = pos.y;             // 初始高度
        // const frirBounceY = startY + 8;    // 第一次跃起高度
        // const offsetZ = pos.z + 3;        // 偏移后的Z轴位置
        // const offsetZ1 = pos.z + 4;        // 偏移后的Z轴位置
        // const endY = startY + 0.7;       // 回落后的弹跳高度

        // const bounceY = startY;    // 弹跳基数
        // tween(node)
        //     .parallel(
        //         // y轴的升降动作
        //         tween()
        //             .to(0.2, { position: new Vec3(pos.x, frirBounceY, pos.z) }, { easing: 'quadOut' }),
        //         tween()
        //             .to(0.2, { position: new Vec3(pos.x, frirBounceY, offsetZ) }, { easing: 'quadOut' })
        //     )
        //     .to(0.2, { position: new Vec3(pos.x, endY, offsetZ1) }, { easing: 'quadIn' })    // 回落
        //     // 三次弹跳处理
        //     .to(0.1, { position: new Vec3(pos.x, bounceY + 4, offsetZ1) }, { easing: 'quadOut' })
        //     .to(0.1, { position: new Vec3(pos.x, endY, offsetZ1) }, { easing: 'quadIn' })
        //     .to(0.1, { position: new Vec3(pos.x, bounceY + 3, offsetZ1) }, { easing: 'quadOut' })
        //     .to(0.1, { position: new Vec3(pos.x, endY, offsetZ1) }, { easing: 'quadIn' })
        //     .to(0.1, { position: new Vec3(pos.x, bounceY + 1.5, offsetZ1) }, { easing: 'quadOut' })
        //     .to(0.1, { position: new Vec3(pos.x, endY, offsetZ1) }, { easing: 'quadIn' })

        //     .call(() => {
        //         // 旋转组件

        //         this._dropList.push(node);
        //     })
        //     .start();

        //赛贝尔曲线金币掉落
        node.eulerAngles = new Vec3(90, 0, 0);
        const startY = pos.y;             // 初始高度
        const frirBounceY = startY + 8;    // 第一次跃起高度
        const offsetZ = pos.z + 3;        // 偏移后的Z轴位置
        const offsetZ1 = pos.z + 4;        // 最终Z轴位置
        const endY = startY + 0.7;       // 回落后的弹跳高度
        const bounceY = startY;    // 弹跳基数
        const woodWorldPos = node.getWorldPosition().clone();
        // 计算贝塞尔曲线控制点（提升高度可配置）
        const LIFT_HEIGHT = 8; // 可提取为配置项
        const handOverPos = new Vec3(
            pos.x,
            endY,
            offsetZ1
        );
        const controlPoint = new Vec3(
            pos.x,
            frirBounceY + LIFT_HEIGHT,
            offsetZ
        );
        // 执行贝塞尔曲线动画
        tween(node)
            .to(0.5, {
                //  scale: new Vec3(6, 6, 6)
            }, {
                easing: 'cubicInOut',
                onUpdate: (target: Node, ratio: number) => {
                    // 计算贝塞尔曲线位置
                    const position = MathUtil.bezierCurve(
                        woodWorldPos,
                        controlPoint,
                        handOverPos,
                        ratio
                    );
                    target.worldPosition = position;
                }
            })
            .call(() => {
                tween(node)
                    // 三次弹跳处理
                    .to(0.1, { position: new Vec3(pos.x, bounceY + 4, offsetZ1) }, { easing: 'quadOut' })
                    .to(0.1, { position: new Vec3(pos.x, endY, offsetZ1) }, { easing: 'quadIn' })
                    .to(0.1, { position: new Vec3(pos.x, bounceY + 3, offsetZ1) }, { easing: 'quadOut' })
                    .to(0.1, { position: new Vec3(pos.x, endY, offsetZ1) }, { easing: 'quadIn' })
                    .to(0.1, { position: new Vec3(pos.x, bounceY + 1.5, offsetZ1) }, { easing: 'quadOut' })
                    .to(0.1, { position: new Vec3(pos.x, endY, offsetZ1) }, { easing: 'quadIn' })

                    .call(() => {
                        // 旋转组件

                        this._dropList.push(node);
                    })
                    .start();
                // this._dropList.push(node);
            })
            .start();

        // // 原始位置
        // const startY = pos.y;
        // const peakY = startY + 8;     // 第一次跃起高度
        // const bounceY = startY + 1.2;   // 回落后的弹跳高度

        // tween(node)
        //     .to(0.25, { position: new Vec3(pos.x, peakY, pos.z) }, { easing: 'quadOut' })   // 向上弹起
        //     .to(0.2, { position: new Vec3(pos.x, startY, pos.z) }, { easing: 'quadIn' })    // 回落
        //     .to(0.15, { position: new Vec3(pos.x, bounceY, pos.z) }, { easing: 'quadOut' }) // 二次弹起
        //     .to(0.15, { position: new Vec3(pos.x, startY, pos.z) }, { easing: 'quadIn' })   // 回到地面
        //     .call(() => {
        //         this._dropList.push(node);
        //     })
        //     .start();
    }

    public getAroundDrop(pos: Vec3) {
        for (let i = this._dropList.length - 1; i >= 0; i--) {
            let drop = this._dropList[i];
            const dropPos = drop.worldPosition.clone();
            const dx = dropPos.x - pos.x;
            const dz = dropPos.z - pos.z;
            const distSqrXZ = dx * dx + dz * dz;

            // 范围内
            if (distSqrXZ <= GlobeVariable.maxSquareDis) {
                this._dropList.splice(i, 1);
                //范围外掉落物放到最前边
                const drops: Node[] = this._dropList.splice(i, this._dropList.length - i);
                this._dropList.unshift(...drops);
                //停止旋转
                const dropRotation = drop.getComponent(DropItemRotation);
                if (dropRotation) {
                    dropRotation.setIsRotation(false);
                }
                return drop;
            }
        }
        return null;
    }

}