//单一的
// import { _decorator, CCInteger, Component, Node, tween, Vec3 } from 'cc';
// import { App } from '../App';
// import { GlobeVariable } from '../core/GlobeVariable';
// import { MathUtil } from '../core/MathUtils';
// import { SoundManager } from '../core/SoundManager';
// const { ccclass, property } = _decorator;

// /** 采矿机 */
// @ccclass('MiningMachine')
// export class MiningMachine extends Component {

//     @property(Node)
//     productCoinNode:Node = null;

//     @property(CCInteger)
//     index:number = -1;

//     private _timeLimit:number = 0.5;
//     private _timer:number = 0;
//     private _started:boolean = false;

//     /**机器开始工作 */
//     public startMachine(){
//         this._started = true;
//         SoundManager.inst.playMiningBGM();
//     }

//     update(deltaTime: number) {
//         if(this._started&&this._timer>this._timeLimit){
//             this.productCoin();
//             this._timer = 0;
//         }
//         this._timer += deltaTime;
//     }

//     /** 生产金币 */
//     private productCoin(){
//         let targetPos = App.goldMineController.getNextCoinPos(App.goldMineController.getPlayingAniNum());
//         let pos: Vec3 = this.productCoinNode.getWorldPosition().clone();  
//         //播动画
//         const centerPosX = (pos.x + targetPos.x) / 2;
//         const centerPosY = 25;
//         const centerPosZ = (pos.z + targetPos.z) / 2;
//         const controlPoint = new Vec3(centerPosX, centerPosY, centerPosZ)
//         let coin: Node = App.poolManager.getNode(GlobeVariable.entifyName.Coin);
//         coin.setParent(App.sceneNode.effectParent); //设置父节点
//         App.goldMineController.addPlayingAniNum();
//         tween(coin)
//             .to(0.45, { position: targetPos }, {
//                 easing: `cubicInOut`,
//                 onUpdate: (target, ratio) => {
//                     const targetNode = target as Node;
//                     const position = MathUtil.bezierCurve(pos, controlPoint, targetPos, ratio)

//                     targetNode.worldPosition = position;
//                 }
//             })
//             .call(() => {
//                 App.goldMineController.reducePlayingAniNum();
//                 App.goldMineController.addCoin(targetPos);
//                 App.poolManager.returnNode(coin, GlobeVariable.entifyName.Coin);
//             })
//             .start();
//     }
// }
////////////////////////////////////随机某个点
// import { _decorator, CCInteger, Component, Node, tween, Vec3 } from 'cc';
// import { App } from '../App';
// import { GlobeVariable } from '../core/GlobeVariable';
// import { MathUtil } from '../core/MathUtils';
// import { SoundManager } from '../core/SoundManager';
// const { ccclass, property } = _decorator;

// /** 采矿机 */
// @ccclass('MiningMachine')
// export class MiningMachine extends Component {

//     // 改为节点数组，支持多个金币生成点
//     @property(Node)
//     productCoinNodes: Node[] = [];

//     @property(CCInteger)
//     index: number = -1;

//     private _timeLimit: number = 0.5;
//     private _timer: number = 0;
//     private _started: boolean = false;

//     /**机器开始工作 */
//     public startMachine() {
//         this._started = true;
//         SoundManager.inst.playMiningBGM();
//     }

//     update(deltaTime: number) {
//         if (this._started && this._timer > this._timeLimit) {
//             this.productCoin();
//             this._timer = 0;
//         }
//         this._timer += deltaTime;
//     }

//     /** 生产金币 */
//     private productCoin() {
//         // 检查数组是否有有效节点
//         if (!this.productCoinNodes || this.productCoinNodes.length === 0) {
//             console.warn("未设置金币生成节点数组");
//             return;
//         }

//         // 从数组中随机选择一个生成节点
//         const randomIndex = Math.floor(Math.random() * this.productCoinNodes.length);
//         const selectedNode = this.productCoinNodes[randomIndex];
//         if (!selectedNode) {
//             console.warn(`索引${randomIndex}处的金币生成节点未设置`);
//             return;
//         }

//         let targetPos = App.goldMineController.getNextCoinPos(App.goldMineController.getPlayingAniNum());
//         // 使用选中节点的世界位置作为起点
//         let pos: Vec3 = selectedNode.getWorldPosition().clone();  

//         // 播动画
//         const centerPosX = (pos.x + targetPos.x) / 2;
//         const centerPosY = 25;
//         const centerPosZ = (pos.z + targetPos.z) / 2;
//         const controlPoint = new Vec3(centerPosX, centerPosY, centerPosZ)

//         let coin: Node = App.poolManager.getNode(GlobeVariable.entifyName.Coin);
//         coin.setParent(App.sceneNode.effectParent); //设置父节点
//         App.goldMineController.addPlayingAniNum();

//         tween(coin)
//             .to(0.45, { position: targetPos }, {
//                 easing: `cubicInOut`,
//                 onUpdate: (target, ratio) => {
//                     const targetNode = target as Node;
//                     const position = MathUtil.bezierCurve(pos, controlPoint, targetPos, ratio)
//                     targetNode.worldPosition = position;
//                 }
//             })
//             .call(() => {
//                 App.goldMineController.reducePlayingAniNum();
//                 App.goldMineController.addCoin(targetPos);
//                 App.poolManager.returnNode(coin, GlobeVariable.entifyName.Coin);
//             })
//             .start();
//     }
// }

import { _decorator, CCInteger, Component, Node, tween, Vec3 } from 'cc';
import { App } from '../App';
import { GlobeVariable } from '../core/GlobeVariable';
import { MathUtil } from '../core/MathUtils';
import { SoundManager } from '../core/SoundManager';
const { ccclass, property } = _decorator;

/** 采矿机 */
@ccclass('MiningMachine')
export class MiningMachine extends Component {

    // 金币生成点数组
    @property(Node)
    productCoinNodes: Node[] = [];

    @property(CCInteger)
    index: number = -1;

    private _timeLimit: number = 2.08;
    private _timer: number = 2.08;
    private _started: boolean = false;

    /**机器开始工作 */
    public startMachine() {
        this._started = true;
        SoundManager.inst.playMiningBGM();
    }

    update(deltaTime: number) {
        if (this._started && this._timer > this._timeLimit) {
            for(let i = 0; i < 3; i++){
                this.scheduleOnce(() => {
                    this.productCoin();
                }, i * 0.1);
            }
            this._timer = 0;
        }
        this._timer += deltaTime;
    }

    /** 生产金币 - 数组中所有节点同时执行 */
    private productCoin() {
        // 检查数组是否有有效节点
        if (!this.productCoinNodes || this.productCoinNodes.length === 0) {
            // console.warn("未设置金币生成节点数组");
            return;
        }

        // 遍历所有生成节点，同时创建金币动画
        this.productCoinNodes.forEach((selectedNode, nodeIndex) => {
            if (!selectedNode) {
                // console.warn(`索引${nodeIndex}处的金币生成节点未设置`);
                return;
            }

            // 为每个节点获取目标位置（可以根据需要调整为每个节点对应不同的目标）
            let targetPos = App.goldMineController.getNextCoinPos(App.goldMineController.getPlayingAniNum());
            let pos: Vec3 = selectedNode.getWorldPosition().clone();

            // 计算贝塞尔曲线控制点
            const centerPosX = (pos.x + targetPos.x) / 2;
            const centerPosY = 25;
            const centerPosZ = (pos.z + targetPos.z) / 2;
            const controlPoint = new Vec3(centerPosX, centerPosY, centerPosZ);

            // 从对象池获取金币节点
            let coin: Node = App.poolManager.getNode(GlobeVariable.entifyName.Coin);
            coin.setParent(App.sceneNode.miningCoinParent);
            App.goldMineController.addPlayingAniNum();
            App.goldMineController.reducePlayingAniNum();
            App.goldMineController.addCoin(targetPos);
     
            // //执行金币动画
            // tween(coin)
            //     .to(0.45, { position: targetPos }, {
            //         easing: `cubicInOut`,
            //         onUpdate: (target, ratio) => {
            //             const targetNode = target as Node;
            //             const position = MathUtil.bezierCurve(pos, controlPoint, targetPos, ratio);
            //             targetNode.worldPosition = position;
            //         }
            //     })
            //     .call(() => {


            //         App.poolManager.returnNode(coin, GlobeVariable.entifyName.Coin);
            //     })
            //     .start();
            // 重置金币初始旋转（避免复用节点时旋转状态残留）
            coin.eulerAngles = Vec3.ZERO;

            // 原有动画逻辑中添加旋转处理，尽量不改变原有结构
            tween(coin)
                .to(1, {
                    // 保留位置动画的同时，添加旋转属性
                    eulerAngles: new Vec3(0, 0, 720) // 2圈旋转
                }, {
                    easing: `cubicInOut`,
                    onUpdate: (target, ratio) => {
                        const targetNode = target as Node;
                        // 原有贝塞尔曲线位置计算
                        const position = MathUtil.bezierCurve(pos, controlPoint, targetPos, ratio);
                        targetNode.worldPosition = position;

                        // 此处无需额外处理旋转，因为tween已通过eulerAngles属性自动更新
                    }
                })
                .call(() => {

                    App.poolManager.returnNode(coin, GlobeVariable.entifyName.Coin);
                })
                .start();
        });
    }
}
