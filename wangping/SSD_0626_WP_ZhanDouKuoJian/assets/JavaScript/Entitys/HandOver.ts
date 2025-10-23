import { _decorator, Component, Node, tween, Vec3 } from 'cc';
import { MathUtil } from '../core/MathUtils';
import { eventMgr } from '../core/EventManager';
import { EventType } from '../core/EventType';
import { GlobeVariable } from '../core/GlobeVariable';
const { ccclass, property } = _decorator;

@ccclass('HandOver')
export class HandOver extends Component {



    handOver(packNode,handOverNode ,callBack) {

      //  GlobeVariable.handOverPhase = true;
         // 获取交付位置节点
         let handOverPosNode = handOverNode;
         if (!handOverPosNode) {
             console.error("找不到交付位置节点");
             return;
         }
         let handOverPos = handOverPosNode.worldPosition.clone();
 

 
         const woodNode = packNode;
         const woodWorldPos = woodNode.getWorldPosition().clone();
 
         // 计算贝塞尔曲线控制点（提升高度可配置）
         const LIFT_HEIGHT = 15; // 可提取为配置项
        //  const controlPoint = new Vec3(
        //      (woodNode.worldPosition.x + handOverPos.x) / 2,
        //      (woodNode.worldPosition.y + handOverPos.y) / 2 + LIFT_HEIGHT,
        //      (woodNode.worldPosition.z + handOverPos.z) / 2
        //  );
         const controlPoint = new Vec3(
             woodNode.worldPosition.x ,
             (woodNode.worldPosition.y + handOverPos.y) / 2 + LIFT_HEIGHT,
             woodNode.worldPosition.z 
         );
         // 执行贝塞尔曲线动画
         tween(woodNode)
             .to(0.2, {
                 scale: new Vec3(4, 4, 4)
             }, {
                 easing: 'cubicInOut',
                 onUpdate: (target: Node, ratio: number) => {
                   // GlobeVariable.handOverPhase = true;
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

                 // 从场景中移除木头
                 woodNode.removeFromParent();
                 woodNode.destroy();
               //  GlobeVariable.handOverPhase = false;
                 callBack()

             })
             .start();
    }
}


