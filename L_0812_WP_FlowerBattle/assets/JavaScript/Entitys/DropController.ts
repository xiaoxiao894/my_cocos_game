import { tween, Vec3, Node, BoxCollider, RigidBody } from "cc";
import { App } from "../App";
import { GlobeVariable } from "../core/GlobeVariable";

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
    continueGame() {
        this._dropList.forEach((item) => {
            item.removeFromParent();
            item.destroy();
        })
        this._dropList = [];
    }

    // 金币掉落
    public dropItem(pos: Vec3) {
        let node = App.poolManager.getNode(GlobeVariable.entifyName.Coin);
        App.sceneNode.coinParent.addChild(node);
        node.setWorldPosition(pos);

        // 原始位置
        const startY = pos.y;
        const peakY = startY + 7;     // 第一次跃起高度
        const bounceY = startY + 1;   // 回落后的弹跳高度
        node.getComponent(BoxCollider).enabled = true;
        node.getComponent(RigidBody).enabled = true;
        tween(node)
            .to(0.15, { position: new Vec3(pos.x, peakY, pos.z) }, { easing: 'quadOut' })   // 向上弹起
            .to(0.1, { position: new Vec3(pos.x, bounceY, pos.z) }, { easing: 'quadIn' })    // 回落
            .to(0.05, { position: new Vec3(pos.x, bounceY + 2, pos.z) }, { easing: 'quadOut' }) // 二次弹起
            .to(0.05, { position: new Vec3(pos.x, bounceY, pos.z) }, { easing: 'quadIn' })   // 回到地面
            //     // .to(0.05, { position: new Vec3(pos.x, bounceY, pos.z) }, { easing: 'quadOut' }) // 二次弹起
            //     // .to(0.05, { position: new Vec3(pos.x, startY, pos.z) }, { easing: 'quadIn' })   // 回到地面
            .call(() => {
                //  node.getComponent(BoxCollider).enabled = false;
                // node.getComponent(RigidBody).enabled = false;
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
            if (distSqrXZ <= GlobeVariable.maxSquareDis) {
                this._dropList.splice(i, 1);
                //范围外掉落物放到最前边
                const drops: Node[] = this._dropList.splice(i, this._dropList.length - i);
                this._dropList.unshift(...drops);
                return drop;
            }
        }
        return null;
    }

}